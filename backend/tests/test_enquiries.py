import os
import tempfile
import unittest
from pathlib import Path
_TEMP = tempfile.TemporaryDirectory()
os.environ["DATABASE_PATH"] = str(Path(_TEMP.name) / "test.sqlite3")
os.environ["ADMIN_API_TOKEN"] = "test-token-not-for-production"
os.environ["CORS_ORIGINS"] = "https://grapecrux.com"
os.environ["SMTP_HOST"] = ""
from fastapi.testclient import TestClient
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from main import app
class EnquiryApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.context=TestClient(app)
        cls.client=cls.context.__enter__()
    @classmethod
    def tearDownClass(cls):
        cls.context.__exit__(None,None,None)
        _TEMP.cleanup()
    def payload(self):
        return {
            "name":"Test Client","email":"client@example.com","company":"Example Organisation",
            "country":"India","phone":"","service":"AI & Automation","project_type":"AI or automation",
            "budget_range":"To be discussed","budget_currency":"INR","expected_start_date":None,
            "message":"We would like to review an AI workflow for internal support.",
            "existing_website":"https://example.com","preferred_contact_method":"Email",
            "landing_page":"/services/ai-automation/","referrer":"",
            "utm_source":"unit-test","utm_medium":"test","utm_campaign":"backend",
            "utm_content":"","utm_term":"","website":"","privacy_consent":True,"turnstile_token":""
        }
    def post(self,key,payload=None,origin="https://grapecrux.com"):
        return self.client.post("/api/enquiries",headers={"Origin":origin,"Idempotency-Key":key},json=payload or self.payload())
    def admin_headers(self):
        return {"Authorization":"Bearer test-token-not-for-production"}
    def test_create_and_idempotency(self):
        first=self.post("test-request-0001")
        second=self.post("test-request-0001")
        self.assertEqual(first.status_code,201)
        self.assertEqual(second.status_code,201)
        self.assertEqual(first.json()["reference"],second.json()["reference"])
    def test_admin_auth_and_status_update(self):
        self.assertEqual(self.client.get("/api/admin/summary").status_code,401)
        summary=self.client.get("/api/admin/summary",headers=self.admin_headers())
        self.assertEqual(summary.status_code,200)
        listing=self.client.get("/api/admin/enquiries",headers=self.admin_headers()).json()
        reference=listing["items"][0]["reference"]
        updated=self.client.patch("/api/admin/enquiries/"+reference,headers=self.admin_headers(),
                                   json={"status":"Qualified","assigned_to":"QA test"})
        self.assertEqual(updated.status_code,200)
    def test_unapproved_origin_is_rejected(self):
        self.assertEqual(self.post("test-request-origin",origin="https://other.example").status_code,403)
    def test_honeypot_is_not_persisted(self):
        before=self.client.get("/api/admin/summary",headers=self.admin_headers()).json()["total"]
        data=self.payload(); data["website"]="bot-filled"
        response=self.post("test-request-honeypot",data)
        after=self.client.get("/api/admin/summary",headers=self.admin_headers()).json()["total"]
        self.assertEqual(response.status_code,201)
        self.assertEqual(before,after)
if __name__=="__main__": unittest.main()
