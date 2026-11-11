# GrapeCrux Enquiry and Lead Management API

The public website is hosted through GitHub Pages. GitHub Pages cannot run Python or store private lead records. This FastAPI application must be deployed separately on an HTTPS ASGI host with a persistent private volume.

## What it provides

- Server-side validation for business project enquiries.
- SQLite persistence with an idempotency key and a generated enquiry reference.
- Per-IP in-memory rate limiting and a honeypot field.
- Optional Cloudflare Turnstile verification when configured on both frontend and backend.
- CORS and Origin checks for the public website.
- Company notification and customer acknowledgement emails over configured SMTP.
- Protected admin endpoints to list, filter, update, summarise and export enquiries.
- Lead statuses: New, Under Review, Qualified, Proposal Sent, Discussion, Won, Lost and Spam.
- Security response headers on the API.
- Manual SQLite backup and retention utilities.
- Existing optional AI assistant endpoint retained.

## Deploy

1. Use Python 3.11 or later.
2. Create a persistent private volume for the SQLite database and backups. Do not store the database in the public web root or Git repository.
3. Install dependencies with pip install -r requirements.txt.
4. Set the environment variables shown in .env.example in the host's secret/configuration panel. Do not commit a real .env file.
5. Set CORS_ORIGINS to the exact production origins that should call the API.
6. Generate long random values for ADMIN_API_TOKEN and IP_HASH_SALT. Keep them in the host secret store; the backend uses an ephemeral random salt only as a development fallback.
7. Configure SMTP credentials and verify that the sender is authorised to send from the chosen address. Use port 465 for implicit TLS or port 587 for STARTTLS.
8. Set DATABASE_PATH to a file on the persistent volume, for example /data/grapecrux-enquiries.sqlite3.
9. Run Uvicorn behind the host's HTTPS reverse proxy. Enable proxy headers only for the trusted proxy addresses supplied by your hosting provider; do not trust arbitrary forwarded headers. Example: uvicorn main:app --host 0.0.0.0 --port 8000 --proxy-headers --forwarded-allow-ips='<trusted-proxy-CIDRs>'.
10. Verify /health, submit a test enquiry and confirm the database record, internal email and customer acknowledgement.
11. Set window.GRAPECRUX_API_BASE_URL in assets/js/config.js to the deployed API origin. Do not include /api in the value.
12. Re-run the website's live SEO audit and the backend unit tests.

## Required environment variables

- DATABASE_PATH: SQLite database file on persistent private storage.
- CORS_ORIGINS: comma-separated exact allowed origins, including https://grapecrux.com.
- ADMIN_API_TOKEN: long random bearer token for lead-management API access.
- IP_HASH_SALT: separate random secret used to hash rate-limit audit identifiers. Configure this explicitly in production.
- SALES_NOTIFICATION_EMAIL: company notification recipient; defaults to service@grapecrux.com.
- SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, SMTP_FROM_EMAIL: email delivery settings.
- LEAD_RETENTION_DAYS: retention used by the manual purge utility. Review the organisation's legal and business retention requirements before using it.
- ENQUIRY_REQUESTS_PER_10_MINUTES: per-process rate limit.
- TURNSTILE_SECRET_KEY: optional. Only set after adding the corresponding Turnstile site key/widget to the public form.
- OPENAI_API_KEY, OPENAI_MODEL: optional assistant backend settings.

## Lead management

Open https://grapecrux.com/lead-management/, enter the backend API URL and ADMIN_API_TOKEN. The dashboard keeps the token in page memory only. Use HTTPS, trusted devices and a unique admin token. Rotate the token if it may have been exposed.

The API returns project contact details only to an authenticated administrator. Do not share exports or records through public issue trackers, analytics events or unsecured storage.

## Email and successful conversion events

The database is the primary enquiry record. The API returns a success response only after the record is stored. SMTP delivery runs after persistence and its status is retained in the record. A successful database write and a successful email notification are separate checks; monitor both.

The browser may send a GA4 generate_lead event only after the API returns a stored enquiry reference. The event includes service and reference, not the person's name, email, phone, company or project message. Mark generate_lead as a Key event in GA4 Admin after the event has been received. Do not mark contact-page visits or click attempts as leads.

## Backups and retention

Run python maintenance.py backup on a schedule configured by the backend host. Store the backup outside the public site and test restoration periodically. Run python maintenance.py purge --retention-days N only after the organisation approves its retention policy. The backup and purge operations are deliberately manual; connect them to the host's private scheduler after deployment.

## Operational limitations

- The in-memory rate limiter is suitable only as a single-instance starting control. Use a shared rate limiter or edge/provider rules when running multiple instances.
- The application uses the ASGI client's address for rate limiting and hashed audit identifiers. Configure Uvicorn proxy headers only with the hosting provider's trusted proxy CIDRs; never trust all forwarded headers.
- SQLite is suitable for a modest single-service deployment. Review a managed database if traffic, concurrency or recovery requirements grow.
- The API cannot send email until SMTP credentials are configured.
- The admin dashboard cannot connect until the backend URL and admin token are configured.
- No secrets or SMTP credentials are included in this repository.
- Review privacy notices, data processing arrangements, data location, access permissions and retention with the organisation before receiving production enquiries.
