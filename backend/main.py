"""GrapeCrux enquiry and lead-management API; deploy separately from GitHub Pages."""
from __future__ import annotations
import csv, hashlib, hmac, io, logging, os, re, secrets, smtplib, sqlite3, time, urllib.parse, urllib.request
from collections import defaultdict, deque
from contextlib import closing
from datetime import date, datetime, timezone
from email.message import EmailMessage
from pathlib import Path
from typing import Literal
from dotenv import load_dotenv
from fastapi import FastAPI, BackgroundTasks, Depends, Header, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, ConfigDict, Field, field_validator
from starlette.concurrency import run_in_threadpool

load_dotenv()
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
log = logging.getLogger("grapecrux.api")
DB = Path(os.getenv("DATABASE_PATH", "/data/grapecrux-enquiries.sqlite3"))
ORIGINS = [x.strip().rstrip("/") for x in os.getenv(
    "CORS_ORIGINS",
    "https://grapecrux.com,https://www.grapecrux.com,https://myg-1107.github.io,http://localhost:8000"
).split(",") if x.strip()]
ADMIN_TOKEN = os.getenv("ADMIN_API_TOKEN", "")
SALES_EMAIL = os.getenv("SALES_NOTIFICATION_EMAIL", "service@grapecrux.com")
SALT = os.getenv("IP_HASH_SALT", "").strip() or secrets.token_urlsafe(32)
STATUSES = {"New","Under Review","Qualified","Proposal Sent","Discussion","Won","Lost","Spam"}
SERVICES = {
 "Custom Software Development","Web & App Development","AI & Automation","AI Integration & Development",
 "Business Process Automation","Mobile Application Development","Product Design & UX",
 "Brand Strategy & Visual Identity","Digital Growth & SEO","Cloud & DevOps",
 "Data & System Integration","Data Engineering & Analytics","Quality Assurance & Consulting",
 "CRM & ERP Solutions","Product Engineering & SaaS Development","Software Testing",
 "Managed Support & Maintenance","Technical consultation","Project enquiry"
}
PROJECT_TYPES = {
 "New application or product","Website or web application","Mobile application",
 "AI or automation","System integration","Data engineering or analytics",
 "Quality assurance or technical review","Cloud or DevOps improvement",
 "Maintenance or modernisation","Consultation or discovery","Other"
}
PREFERRED = {"Email","Phone","Either"}
enquiry_hits: dict[str, deque[float]] = defaultdict(deque)
chat_hits: dict[str, deque[float]] = defaultdict(deque)
app = FastAPI(title="GrapeCrux Enquiry API", version="2.0.0", docs_url=None, redoc_url=None, openapi_url=None)
app.add_middleware(CORSMiddleware, allow_origins=ORIGINS, allow_credentials=False,
                   allow_methods=["GET","POST","PATCH","OPTIONS"],
                   allow_headers=["Authorization","Content-Type","Idempotency-Key"])
bearer = HTTPBearer(auto_error=False)

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")

def connect() -> sqlite3.Connection:
    DB.parent.mkdir(parents=True, exist_ok=True)
    c = sqlite3.connect(DB, timeout=15)
    c.row_factory = sqlite3.Row
    c.execute("PRAGMA busy_timeout=15000")
    c.execute("PRAGMA foreign_keys=ON")
    return c

def init_db() -> None:
    with closing(connect()) as c:
        c.execute("PRAGMA journal_mode=WAL")
        c.execute("""CREATE TABLE IF NOT EXISTS enquiries(
          id INTEGER PRIMARY KEY AUTOINCREMENT, reference TEXT NOT NULL UNIQUE,
          idempotency_key TEXT NOT NULL UNIQUE, name TEXT NOT NULL, email TEXT NOT NULL,
          company TEXT NOT NULL DEFAULT '', country TEXT NOT NULL, phone TEXT NOT NULL DEFAULT '',
          service TEXT NOT NULL, project_type TEXT NOT NULL, budget_range TEXT NOT NULL DEFAULT '',
          budget_currency TEXT NOT NULL DEFAULT '', expected_start_date TEXT NOT NULL DEFAULT '',
          message TEXT NOT NULL, existing_website TEXT NOT NULL DEFAULT '',
          preferred_contact_method TEXT NOT NULL, landing_page TEXT NOT NULL DEFAULT '',
          referrer TEXT NOT NULL DEFAULT '', utm_source TEXT NOT NULL DEFAULT '',
          utm_medium TEXT NOT NULL DEFAULT '', utm_campaign TEXT NOT NULL DEFAULT '',
          utm_content TEXT NOT NULL DEFAULT '', utm_term TEXT NOT NULL DEFAULT '',
          ip_hash TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'New',
          assigned_to TEXT NOT NULL DEFAULT '', internal_notes TEXT NOT NULL DEFAULT '',
          follow_up_date TEXT NOT NULL DEFAULT '', notification_email_status TEXT NOT NULL DEFAULT 'pending',
          acknowledgement_email_status TEXT NOT NULL DEFAULT 'pending',
          created_at TEXT NOT NULL, updated_at TEXT NOT NULL)""")
        existing_columns = {row[1] for row in c.execute("PRAGMA table_info(enquiries)").fetchall()}
        if "privacy_consent_at" not in existing_columns:
            c.execute("ALTER TABLE enquiries ADD COLUMN privacy_consent_at TEXT NOT NULL DEFAULT ''")
        c.execute("CREATE INDEX IF NOT EXISTS idx_enquiries_date ON enquiries(created_at DESC)")
        c.execute("CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status)")
        c.commit()
    try:
        os.chmod(DB, 0o600)
    except OSError:
        log.warning("Could not set database file permissions; verify host volume permissions.")

def enforce_limit(store: dict[str, deque[float]], key: str, limit: int, window: int) -> None:
    t = time.monotonic()
    q = store[key]
    while q and t - q[0] > window:
        q.popleft()
    if len(q) >= limit:
        raise HTTPException(429, "Too many requests. Please wait before trying again.",
                            headers={"Retry-After": str(window)})
    q.append(t)

def host_key(request: Request) -> str:
    # Trust the ASGI client address. Configure Uvicorn proxy headers with only the
    # hosting provider trusted proxy CIDRs; never accept arbitrary X-Forwarded-For.
    return request.client.host if request.client else "unknown"

def require_origin(request: Request) -> None:
    origin = request.headers.get("origin")
    if origin and origin.rstrip("/") not in ORIGINS:
        raise HTTPException(403, "Website origin is not allowed.")

def require_admin(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)) -> str:
    if not ADMIN_TOKEN:
        raise HTTPException(503, "Lead management is not configured.")
    supplied = credentials.credentials if credentials else ""
    if not supplied or not hmac.compare_digest(supplied, ADMIN_TOKEN):
        raise HTTPException(401, "Administrator authentication is required.",
                            headers={"WWW-Authenticate":"Bearer"})
    return "admin"

class EnquiryInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=5, max_length=180)
    company: str = Field(default="", max_length=160)
    country: str = Field(min_length=2, max_length=100)
    phone: str = Field(default="", max_length=40)
    service: str = Field(min_length=2, max_length=120)
    project_type: str = Field(min_length=2, max_length=100)
    budget_range: str = Field(default="", max_length=80)
    budget_currency: str = Field(default="", max_length=12)
    expected_start_date: date | None = None
    message: str = Field(min_length=20, max_length=6000)
    existing_website: str = Field(default="", max_length=500)
    preferred_contact_method: str = Field(default="Email", max_length=20)
    landing_page: str = Field(default="", max_length=500)
    referrer: str = Field(default="", max_length=1000)
    utm_source: str = Field(default="", max_length=150)
    utm_medium: str = Field(default="", max_length=150)
    utm_campaign: str = Field(default="", max_length=200)
    utm_content: str = Field(default="", max_length=200)
    utm_term: str = Field(default="", max_length=200)
    website: str = Field(default="", max_length=300)
    privacy_consent: bool
    turnstile_token: str = Field(default="", max_length=4096)

    @field_validator("name","company","country","phone","service","project_type","budget_range",
                     "budget_currency","message","existing_website","preferred_contact_method",
                     "landing_page","referrer","utm_source","utm_medium","utm_campaign",
                     "utm_content","utm_term","website")
    @classmethod
    def trim_value(cls, value: str) -> str:
        return value.replace(chr(0), "").strip()

    @field_validator("email")
    @classmethod
    def email_valid(cls, value: str) -> str:
        v = value.strip().lower()
        if not re.fullmatch(r"[A-Z0-9.!#$%&'*+/=?^_{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+", v, re.I):
            raise ValueError("Enter a valid email address.")
        return v

    @field_validator("service")
    @classmethod
    def service_valid(cls, value: str) -> str:
        if value not in SERVICES: raise ValueError("Choose a published service.")
        return value

    @field_validator("project_type")
    @classmethod
    def project_type_valid(cls, value: str) -> str:
        if value not in PROJECT_TYPES: raise ValueError("Choose a valid project type.")
        return value

    @field_validator("preferred_contact_method")
    @classmethod
    def contact_method_valid(cls, value: str) -> str:
        if value not in PREFERRED: raise ValueError("Choose Email, Phone or Either.")
        return value

    @field_validator("existing_website")
    @classmethod
    def website_valid(cls, value: str) -> str:
        if value and not re.match(r"^https?://", value, re.I):
            raise ValueError("Website URL must start with http:// or https://.")
        return value

    @field_validator("landing_page")
    @classmethod
    def landing_page_valid(cls, value: str) -> str:
        if value and not value.startswith("/"): raise ValueError("Landing page must be a relative path.")
        return value

class EnquiryAccepted(BaseModel):
    received: bool
    reference: str
    message: str
    created: bool = True

class EnquiryPatch(BaseModel):
    model_config = ConfigDict(extra="forbid")
    status: str | None = Field(default=None, max_length=40)
    assigned_to: str | None = Field(default=None, max_length=120)
    internal_notes: str | None = Field(default=None, max_length=4000)
    follow_up_date: date | None = None

    @field_validator("status")
    @classmethod
    def status_valid(cls, value):
        if value is not None and value not in STATUSES: raise ValueError("Invalid enquiry status.")
        return value

    @field_validator("assigned_to","internal_notes")
    @classmethod
    def trim_admin(cls, value):
        return value.strip() if value is not None else value

def verify_turnstile_sync(token: str, ip: str) -> bool:
    secret = os.getenv("TURNSTILE_SECRET_KEY", "")
    if not secret: return True
    if not token: return False
    data = urllib.parse.urlencode({"secret":secret,"response":token,"remoteip":ip}).encode()
    req = urllib.request.Request("https://challenges.cloudflare.com/turnstile/v0/siteverify",
        data=data,headers={"Content-Type":"application/x-www-form-urlencoded"},method="POST")
    try:
        with urllib.request.urlopen(req, timeout=8) as response:
            return bool(json.loads(response.read().decode()).get("success"))
    except Exception:
        log.exception("Turnstile verification failed.")
        return False

def send_mail(to_address: str, subject: str, body: str, reply_to: str = "") -> None:
    host = os.getenv("SMTP_HOST", "").strip()
    sender = os.getenv("SMTP_FROM_EMAIL", os.getenv("SMTP_USERNAME", "")).strip()
    username = os.getenv("SMTP_USERNAME", "").strip()
    password = os.getenv("SMTP_PASSWORD", "")
    port = int(os.getenv("SMTP_PORT", "587"))
    if not host or not sender: raise RuntimeError("SMTP is not configured.")
    message = EmailMessage()
    message["Subject"], message["From"], message["To"] = subject, sender, to_address
    if reply_to: message["Reply-To"] = reply_to
    message.set_content(body)
    if port == 465:
        with smtplib.SMTP_SSL(host, port, timeout=15) as server:
            if username: server.login(username, password)
            server.send_message(message)
    else:
        with smtplib.SMTP(host, port, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            if username: server.login(username, password)
            server.send_message(message)

def update_mail_status(reference: str, column: str, value: str) -> None:
    if column not in {"notification_email_status","acknowledgement_email_status"}:
        raise ValueError("Invalid status column.")
    with closing(connect()) as c:
        c.execute("UPDATE enquiries SET " + column + "=?, updated_at=? WHERE reference=?",
                  (value, now_iso(), reference))
        c.commit()

def deliver_emails(reference: str) -> None:
    with closing(connect()) as c:
        row = c.execute("SELECT * FROM enquiries WHERE reference=?", (reference,)).fetchone()
    if not row: return
    record = dict(row)
    if not os.getenv("SMTP_HOST") or not os.getenv("SMTP_FROM_EMAIL", os.getenv("SMTP_USERNAME","")).strip():
        update_mail_status(reference,"notification_email_status","not_configured")
        update_mail_status(reference,"acknowledgement_email_status","not_configured")
        return
    internal = "\\n".join([
        "New GrapeCrux project enquiry: " + reference, "",
        "Name: " + record["name"], "Email: " + record["email"],
        "Company: " + (record["company"] or "Not provided"),
        "Country: " + record["country"], "Phone: " + (record["phone"] or "Not provided"),
        "Service: " + record["service"], "Project type: " + record["project_type"],
        "Budget: " + (record["budget_range"] or "Not specified") + " " + record["budget_currency"],
        "Expected start: " + (record["expected_start_date"] or "Not specified"),
        "Preferred contact: " + record["preferred_contact_method"],
        "Website: " + (record["existing_website"] or "Not provided"),
        "Landing page: " + record["landing_page"], "Referrer: " + record["referrer"],
        "Campaign: " + " / ".join([record["utm_source"],record["utm_medium"],record["utm_campaign"]]),
        "", "Project description:", record["message"]
    ])
    try:
        send_mail(SALES_EMAIL,"[GrapeCrux enquiry " + reference + "] " + record["service"],internal,record["email"])
        update_mail_status(reference,"notification_email_status","sent")
    except Exception:
        log.exception("Internal enquiry email failed for %s", reference)
        update_mail_status(reference,"notification_email_status","failed")
    ack = "\\n".join([
        "Thank you for contacting GrapeCrux, " + record["name"] + ".",
        "", "Your project enquiry has been received.", "Reference: " + reference,
        "Service: " + record["service"], "",
        "The team can review the information and determine the appropriate next step. "
        "This automatic acknowledgement does not promise a response time or project outcome.",
        "", "GrapeCrux", "A creative initiative of Infinite Resource Creators Private Limited",
        "https://grapecrux.com/", "service@grapecrux.com"
    ])
    try:
        send_mail(record["email"],"GrapeCrux has received your enquiry (" + reference + ")",ack)
        update_mail_status(reference,"acknowledgement_email_status","sent")
    except Exception:
        log.exception("Customer acknowledgement failed for %s", reference)
        update_mail_status(reference,"acknowledgement_email_status","failed")

def admin_auth(credentials: HTTPAuthorizationCredentials | None = Depends(HTTPBearer(auto_error=False))) -> str:
    token = os.getenv("ADMIN_API_TOKEN", "")
    supplied = credentials.credentials if credentials else ""
    if not token: raise HTTPException(503,"Lead management is not configured.")
    if not supplied or not hmac.compare_digest(supplied,token):
        raise HTTPException(401,"Administrator authentication is required.",headers={"WWW-Authenticate":"Bearer"})
    return "admin"

@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'; base-uri 'none'"
    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store, max-age=0"
        response.headers["Pragma"] = "no-cache"
    if request.url.scheme == "https": response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

@app.on_event("startup")
async def startup():
    DB.parent.mkdir(parents=True,exist_ok=True)
    with closing(connect()) as c:
        c.execute("PRAGMA journal_mode=WAL")
        c.execute("""CREATE TABLE IF NOT EXISTS enquiries(
          id INTEGER PRIMARY KEY AUTOINCREMENT, reference TEXT UNIQUE NOT NULL,
          idempotency_key TEXT UNIQUE NOT NULL, privacy_consent_at TEXT NOT NULL DEFAULT '', name TEXT NOT NULL, email TEXT NOT NULL,
          company TEXT NOT NULL DEFAULT '', country TEXT NOT NULL, phone TEXT NOT NULL DEFAULT '',
          service TEXT NOT NULL, project_type TEXT NOT NULL, budget_range TEXT NOT NULL DEFAULT '',
          budget_currency TEXT NOT NULL DEFAULT '', expected_start_date TEXT NOT NULL DEFAULT '',
          message TEXT NOT NULL, existing_website TEXT NOT NULL DEFAULT '',
          preferred_contact_method TEXT NOT NULL, landing_page TEXT NOT NULL DEFAULT '',
          referrer TEXT NOT NULL DEFAULT '', utm_source TEXT NOT NULL DEFAULT '',
          utm_medium TEXT NOT NULL DEFAULT '', utm_campaign TEXT NOT NULL DEFAULT '',
          utm_content TEXT NOT NULL DEFAULT '', utm_term TEXT NOT NULL DEFAULT '',
          ip_hash TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'New',
          assigned_to TEXT NOT NULL DEFAULT '', internal_notes TEXT NOT NULL DEFAULT '',
          follow_up_date TEXT NOT NULL DEFAULT '', notification_email_status TEXT NOT NULL DEFAULT 'pending',
          acknowledgement_email_status TEXT NOT NULL DEFAULT 'pending',
          created_at TEXT NOT NULL, updated_at TEXT NOT NULL)""")
        c.execute("CREATE INDEX IF NOT EXISTS idx_enquiries_date ON enquiries(created_at DESC)")
        c.execute("CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status)")
        c.commit()
    try: os.chmod(DB,0o600)
    except OSError: log.warning("Could not set file permissions; verify persistent volume permissions.")

@app.get("/health")
async def health():
    try:
        with closing(connect()) as c: c.execute("SELECT 1").fetchone()
        return {"status":"ok","service":"grapecrux-enquiries","version":"2.0.0"}
    except Exception:
        log.exception("Health check failed.")
        raise HTTPException(503,"Enquiry storage is unavailable.")

@app.post("/api/enquiries",response_model=EnquiryAccepted,status_code=201)
async def create_enquiry(payload: EnquiryInput,request: Request,background_tasks: BackgroundTasks,
                         idempotency_key: str = Header(alias="Idempotency-Key",min_length=8,max_length=100)):
    origin=request.headers.get("origin")
    if origin and origin.rstrip("/") not in ORIGINS: raise HTTPException(403,"Website origin is not allowed.")
    if payload.website:
        return EnquiryAccepted(received=True,reference="GC-IGNORED",message="Thank you. Your enquiry has been received.",created=False)
    if not payload.privacy_consent: raise HTTPException(400,"Please acknowledge the privacy notice.")
    if payload.expected_start_date and payload.expected_start_date < date.today():
        raise HTTPException(422,"Expected start date cannot be in the past.")
    enforce_limit(enquiry_hits,host_key(request),int(os.getenv("ENQUIRY_REQUESTS_PER_10_MINUTES","5")),600)
    if os.getenv("TURNSTILE_SECRET_KEY","").strip():
        verified=await run_in_threadpool(verify_turnstile_sync,payload.turnstile_token,host_key(request))
        if not verified: raise HTTPException(400,"Spam protection could not verify this submission. Please try again.")
    ref="GC-"+datetime.now(timezone.utc).strftime("%Y%m%d")+"-"+secrets.token_hex(3).upper()
    now=now_iso()
    values=payload.model_dump(exclude={"website","turnstile_token","privacy_consent"})
    values["expected_start_date"]=payload.expected_start_date.isoformat() if payload.expected_start_date else ""
    values["ip_hash"]=hashlib.sha256((SALT+host_key(request)).encode()).hexdigest()
    columns=["reference","idempotency_key","privacy_consent_at","name","email","company","country","phone","service",
      "project_type","budget_range","budget_currency","expected_start_date","message","existing_website",
      "preferred_contact_method","landing_page","referrer","utm_source","utm_medium","utm_campaign",
      "utm_content","utm_term","ip_hash","created_at","updated_at"]
    vals=[ref,idempotency_key,now,values["name"],values["email"],values["company"],values["country"],
      values["phone"],values["service"],values["project_type"],values["budget_range"],
      values["budget_currency"],values["expected_start_date"],values["message"],values["existing_website"],
      values["preferred_contact_method"],values["landing_page"],values["referrer"],values["utm_source"],
      values["utm_medium"],values["utm_campaign"],values["utm_content"],values["utm_term"],
      values["ip_hash"],now,now]
    try:
        with closing(connect()) as c:
            result=c.execute("INSERT OR IGNORE INTO enquiries ("+",".join(columns)+") VALUES ("+
                ",".join(["?"]*len(columns))+")",vals)
            c.commit()
            existing=c.execute("SELECT reference FROM enquiries WHERE idempotency_key=?",(idempotency_key,)).fetchone()
            inserted=result.rowcount==1
    except sqlite3.Error:
        log.exception("Enquiry storage failed.")
        raise HTTPException(503,"The enquiry could not be stored. Please try again or email service@grapecrux.com.")
    if not existing: raise HTTPException(503,"The enquiry receipt could not be confirmed.")
    if inserted: background_tasks.add_task(deliver_emails,existing["reference"])
    return EnquiryAccepted(received=True,reference=existing["reference"],message="Your project enquiry has been received successfully.",created=inserted)

@app.get("/api/admin/summary")
async def admin_summary(_admin: str = Depends(admin_auth)):
    with closing(connect()) as c:
        total=c.execute("SELECT COUNT(*) AS n FROM enquiries").fetchone()["n"]
        rows=c.execute("SELECT status,COUNT(*) AS n FROM enquiries GROUP BY status").fetchall()
    return {"total":total,"by_status":{r["status"]:r["n"] for r in rows}}

@app.get("/api/admin/enquiries")
async def admin_list(status: str = Query(default="",max_length=40),limit: int = Query(default=50,ge=1,le=100),
                     offset: int = Query(default=0,ge=0,le=100000),_admin: str = Depends(admin_auth)):
    if status and status not in STATUSES: raise HTTPException(400,"Unknown enquiry status.")
    where=" WHERE status=?" if status else ""
    params=(status,) if status else ()
    columns="reference,name,email,company,country,phone,service,project_type,budget_range,budget_currency,expected_start_date,message,existing_website,preferred_contact_method,landing_page,referrer,utm_source,utm_medium,utm_campaign,status,assigned_to,internal_notes,follow_up_date,notification_email_status,acknowledgement_email_status,created_at,updated_at"
    with closing(connect()) as c:
        total=c.execute("SELECT COUNT(*) AS n FROM enquiries"+where,params).fetchone()["n"]
        rows=c.execute("SELECT "+columns+" FROM enquiries"+where+" ORDER BY created_at DESC LIMIT ? OFFSET ?",(*params,limit,offset)).fetchall()
    return {"total":total,"limit":limit,"offset":offset,"items":[dict(r) for r in rows]}

@app.patch("/api/admin/enquiries/{reference}")
async def admin_update(reference: str,payload: EnquiryPatch,_admin: str = Depends(admin_auth)):
    fields=payload.model_dump(exclude_unset=True)
    if not fields: raise HTTPException(400,"No changes were provided.")
    if "follow_up_date" in fields: fields["follow_up_date"]=fields["follow_up_date"].isoformat() if fields["follow_up_date"] else ""
    fields["updated_at"]=now_iso()
    assignments=",".join([key+"=?" for key in fields])
    with closing(connect()) as c:
        result=c.execute("UPDATE enquiries SET "+assignments+" WHERE reference=?",
                         (*fields.values(),reference))
        c.commit()
    if result.rowcount==0: raise HTTPException(404,"Enquiry reference not found.")
    return {"updated":True,"reference":reference}

def safe_csv_cell(value) -> str:
    text_value = "" if value is None else str(value)
    if text_value.startswith(("=", "+", "-", "@", "\t", "\r")):
        return "'" + text_value
    return text_value

@app.get("/api/admin/enquiries/export.csv")
async def admin_export(_admin: str = Depends(admin_auth)):
    columns=["reference","created_at","status","name","email","company","country","phone","service",
      "project_type","budget_range","budget_currency","expected_start_date","message","existing_website",
      "preferred_contact_method","landing_page","referrer","utm_source","utm_medium","utm_campaign",
      "assigned_to","follow_up_date"]
    output=io.StringIO()
    writer=csv.writer(output); writer.writerow(columns)
    with closing(connect()) as c:
        rows=c.execute("SELECT "+",".join(columns)+" FROM enquiries ORDER BY created_at DESC").fetchall()
    for row in rows: writer.writerow([safe_csv_cell(row[column]) for column in columns])
    output.seek(0)
    filename="grapecrux-enquiries-"+datetime.now(timezone.utc).strftime("%Y%m%d")+".csv"
    return StreamingResponse(iter([output.getvalue()]),media_type="text/csv; charset=utf-8",
      headers={"Content-Disposition":'attachment; filename="'+filename+'"'})

class ChatMessage(BaseModel):
    role: Literal["user","assistant"]
    content: str = Field(min_length=1,max_length=2000)
class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(min_length=1,max_length=12)
class ChatResponse(BaseModel):
    reply: str

@app.post("/api/chat",response_model=ChatResponse)
async def chat(payload: ChatRequest,request: Request):
    enforce_limit(chat_hits,host_key(request),int(os.getenv("CHAT_REQUESTS_PER_MINUTE","20")),60)
    key=os.getenv("OPENAI_API_KEY","").strip()
    if not key: raise HTTPException(503,"Assistant backend is not configured.")
    if sum(len(m.content) for m in payload.messages)>8000: raise HTTPException(413,"Please send a shorter conversation.")
    from openai import AsyncOpenAI
    prompt="""You are the GrapeCrux website assistant. Be warm, concise and honest.
GrapeCrux is a creative initiative of Infinite Resource Creators Private Limited.
Explain published services, project process, resources, project assessment, demonstrations,
Blogs and Careers. The Case Studies page presents illustrative demonstrations, not verified
client deployments. Never invent prices, client names, testimonials, certifications,
offices, timelines, rankings or results. Never ask for passwords, payment credentials,
government IDs or OTPs. Do not reveal backend settings. Refer enquiries to
service@grapecrux.com and careers to https://grapecrux.com/careers/.
"""
    client=AsyncOpenAI(api_key=key,timeout=20.0,max_retries=1)
    try:
        response=await client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL","gpt-4o-mini"),
            messages=[{"role":"system","content":prompt}]+[{"role":m.role,"content":m.content.strip()} for m in payload.messages],
            temperature=0.25,max_tokens=450)
        answer=(response.choices[0].message.content or "").strip()
        if not answer: raise RuntimeError("Empty assistant response")
        return ChatResponse(reply=answer[:3000])
    except Exception:
        log.exception("Assistant request failed.")
        raise HTTPException(502,"The assistant is temporarily unavailable.")
