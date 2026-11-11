# GrapeCrux — External activation checklist

The pull request prepares the public website and backend source. These steps require access to the relevant company hosting or Google accounts and must be completed by an authorised administrator.

## Backend hosting

- [ ] Choose an HTTPS ASGI hosting provider.
- [ ] Create a private persistent volume for the SQLite database and backups.
- [ ] Add the variables from backend/.env.example through the host's secret manager.
- [ ] Generate strong random ADMIN_API_TOKEN and IP_HASH_SALT values.
- [ ] Configure SMTP sender, credentials and authorised notification inbox.
- [ ] Set CORS_ORIGINS to the actual website origins.
- [ ] Configure Uvicorn proxy headers only for trusted hosting proxy addresses.
- [ ] Deploy the app and verify /health.
- [ ] Test one enquiry end-to-end: API receipt, reference, database record, company notification and customer acknowledgement.
- [ ] Verify database and backup file permissions.
- [ ] Approve a retention policy and schedule database backup and manual retention cleanup.
- [ ] Review privacy disclosures, hosting/data region and any provider data-processing agreements.

## Connect the website to the API

- [ ] Set window.GRAPECRUX_API_BASE_URL in assets/js/config.js to the HTTPS API origin (not including /api).
- [ ] Redeploy the static site.
- [ ] Submit a test enquiry from grapecrux.com.
- [ ] Confirm a reference appears only after API storage succeeds.
- [ ] Confirm the fallback email path remains available when the API is unavailable.
- [ ] Open /lead-management/ and connect with the admin token.
- [ ] Verify listing, filtering, status updates, assignment, follow-up and CSV export.
- [ ] Rotate the admin token if it has been shared outside approved administrators.

## GA4 and GTM

- [ ] Verify G-QXMRMGJEP2 is the correct web data stream.
- [ ] Review internal traffic filters and Enhanced Measurement.
- [ ] Submit a test enquiry with analytics consent enabled.
- [ ] Confirm generate_lead appears after API success, with no personal fields.
- [ ] Mark generate_lead as a Key event in GA4 Admin.
- [ ] Do not mark contact_view, page_view, form_start or form_submit as confirmed leads.
- [ ] A GTM container ID was not supplied. If the company wishes to use GTM, provide the actual GTM-XXXXXXX ID and choose a single GA4 implementation route to avoid duplicate events.

## Search Console

- [ ] Confirm https://grapecrux.com/sitemap.xml reports Success.
- [ ] The repository sitemap now contains 134 public URLs (the screenshot supplied earlier showed 118 discovered before this PR).
- [ ] Use URL Inspection on the homepage, priority service pages, Contact, Careers, Blogs and new public resource pages.
- [ ] Review Indexing → Pages for the actual exclusion reason.
- [ ] Request indexing only for priority pages after checking live test results and canonical selection.
- [ ] Compare discovered URLs with indexed URLs over time; sitemap submission does not guarantee indexing.

## External business visibility

- [ ] Confirm LinkedIn company description, logo, website, service specialisations and contact details.
- [ ] Assess Google Business Profile eligibility before creating or changing a profile. The registered office address alone does not prove eligibility as a customer-facing or qualifying service-area business.
- [ ] Maintain the official GitHub organisation profile and publish only shareable demonstrations or open-source work.
- [ ] Pursue genuine partner/community contributions and editorial references; avoid paid link schemes and mass directory submissions.
- [ ] Select priority target markets based on actual capacity, communication, delivery and commercial readiness. Do not publish near-duplicate country/city pages.

## Performance and monitoring

- [ ] Run PageSpeed Insights for Home, Services, Blogs, Careers and Contact on mobile and desktop.
- [ ] Record LCP, INP and CLS rather than treating source-level checks as measured Core Web Vitals.
- [ ] Enable repository notifications for failed availability and SEO audit workflows.
- [ ] If the backend is deployed, add GRAPECRUX_API_HEALTH_URL as a repository variable so the hourly availability check includes /health.
