# GrapeCrux — Implementation of “1st changes.docx”

Source document: the supplied GrapeCrux Website – Comprehensive Business Visibility, SEO, Analytics and Lead Generation Improvement Report, dated 10 November 2026.

## Release objective

Move the website from a company presentation site toward a discoverable, useful and measurable business acquisition platform. This release keeps the current brand and design direction, and adds service discovery, trust information, enquiry intake and operational documentation.

## Implemented in this branch

| Report recommendation | Implementation |
|---|---|
| Homepage should explain software, AI and digital services quickly | Updated primary headline and supporting copy; direct project and technical-consultation routes |
| Who We Help | Added startups, small businesses, growing companies, enterprise teams, education, healthcare, e-commerce and agency categories with clear qualification language |
| Business Challenges We Help Solve | Added problem-to-solution section for automation, integration, custom software, support, performance, reporting, QA, DevOps and modernisation |
| Why Work With GrapeCrux | Added factual delivery practices: scope clarity, quality, security/privacy considerations, handover and continuity |
| Consistent service discovery | Homepage now highlights 12 core service groups; service hub adds five specialist landing pages |
| Dedicated service pages | Added Custom Software, Business Process Automation, AI Integration, Mobile Application Development and Data Engineering |
| Contact enquiry fields | Added full name, business email, company, country, optional phone, service, project type, optional budget/currency, expected start, optional existing site and preferred communication |
| Genuine enquiry processing | Added a FastAPI API, SQLite persistence, generated reference, idempotency, validation, origin checks, honeypot, per-process rate limit and optional Turnstile verification |
| Notification and acknowledgement | Added SMTP notification to the configured business inbox and acknowledgement to the customer; each status is recorded separately |
| Internal lead management | Added a noindex dashboard and protected API for listing, status changes, assignment, follow-up date, internal notes and CSV export |
| Conversion tracking | Added form_start and form_submit; generate_lead fires only after the API confirms that the enquiry record is stored |
| Source attribution | Captures landing path, referrer and UTM fields with the enquiry; no personal information is sent to GA4 |
| Blog archive | Added a crawlable HTML archive of 70 existing article URLs with search, category filters and progressive pagination |
| Commercial content connection | Blog archive and article links connect visitors to related services, assessment and contact routes |
| How We Work | Added consultation, feasibility, proposal, scope, delivery, validation, deployment, handover and support expectations |
| Technology directory | Added capability areas and a technology selection approach without claiming unverified vendors/certifications |
| Case studies / demonstrations | Added illustrative technical demonstrations and a clear statement that they are not completed client deployments |
| Resource library | Added six actionable checklists for AI readiness, website visibility, CRM/ERP integration, QA, cloud migration and automation opportunities |
| Project requirement tool | Added a local guided assessment that recommends relevant service routes and lets a visitor copy a project brief |
| Structured data | Homepage distinguishes the legal organisation, GrapeCrux brand and website; new service pages use Service, WebPage and BreadcrumbList types |
| Sitemap | Added 16 new public URLs; lead-management is excluded and marked noindex |
| Assistant | Added answers for new services, resources, demonstrations, project assessment and working approach |
| Mobile and accessibility | Added responsive component styles, labelled fields, status announcements, accessible form behaviour and print-friendly checklists |
| Security and operations | Added backend security headers, protected admin API, private database instructions, manual backup and retention utilities |
| Quality checks | Added static business-platform tests and backend API unit tests in GitHub Actions |

## Deliberately not fabricated

- No client names, testimonials, case-study results, performance statistics or certifications were invented. The Work/Case Studies area labels examples as illustrative demonstrations.
- The Technologies page describes engineering capability areas, not a guaranteed list of every vendor or platform. Named tools and versions must be confirmed by the delivery team before publication.
- No city/country landing-page network was generated. Geography pages should only be created for markets GrapeCrux can genuinely serve.
- No Google Business Profile was created. The registered office address alone does not establish GBP eligibility; verify that the business meets Google's real-world location or service-area rules.
- No price list, service-level response promise or guaranteed result was published.
- No newsletter form was connected without a consent-aware email marketing provider and unsubscribe process.
- Google Tag Manager is not activated because no real GTM container ID was supplied. Direct GA4 remains the current measurement route; do not run both a direct GA4 configuration and a duplicate GA4 tag through GTM.
- GitHub Pages does not run the Python API or host the lead database. The backend is included but requires separate deployment and secrets.
- GitHub Pages static hosting does not provide arbitrary custom HTTP response headers for the HTML website. Security headers added here protect the API; website-wide headers need an edge/CDN or hosting platform that supports them.

## Deployment dependencies

The public website can be published from this PR, but these backend features become active only after a separate FastAPI deployment:

1. A persistent private database volume.
2. Production values for DATABASE_PATH, CORS_ORIGINS, ADMIN_API_TOKEN and IP_HASH_SALT.
3. SMTP host, credentials, sender and authorised notification inbox.
4. An HTTPS backend API origin.
5. Update window.GRAPECRUX_API_BASE_URL in assets/js/config.js to that backend origin.
6. Complete a test enquiry and verify the database record, notification and acknowledgement.
7. Test the protected lead-management dashboard using the admin token.
8. Configure a private backup schedule and approve the retention policy.

The online form does not claim receipt while the API URL is blank. It shows a manual email fallback. This prevents an email draft or click from being counted as a successfully received lead.

## Search Console and GA4 actions after merge

- The supplied Search Console screenshot confirmed that the earlier sitemap was processed and 118 URLs were discovered. This release adds 16 public URLs, so the XML sitemap will contain 134 URLs. Google will process the updated file on its own schedule.
- In Search Console, inspect the homepage, priority services, Contact, Careers, Blogs and new landing pages. Review Page indexing reasons instead of repeatedly requesting indexing.
- After API submission is enabled and a test lead is received, check GA4 Realtime/DebugView for generate_lead. Then mark generate_lead as a Key event in GA4 Admin.
- Keep form_submit as a submit-attempt measure; do not mark Contact page views as leads.
- The GTM ID is not in the supplied material. If you provide it later, decide whether to migrate GA4 to GTM; avoid duplicate installations.
- Run PageSpeed Insights for Home, Services, Blogs, Careers and Contact on mobile and desktop. The report's Core Web Vitals thresholds are targets, not current measured scores.
- Recheck the live SEO audit and sitemap after GitHub Pages deploys.

## Known limitations

- Rate limiting is in-memory and per-process. A multi-instance deployment should use shared rate limiting or an edge provider rule.
- SQLite is a modest single-service starting point; a managed database may be preferable as volume and concurrency increase.
- SMTP notification status and database storage are separate; monitor both.
- The dashboard uses one bearer token supplied by the operator. For multiple administrators, use managed identity/roles rather than sharing a token.
- The data retention utility is deliberately manual. The organisation must approve the retention policy and schedule purge/backup jobs.
- The privacy notice should be reviewed against the actual backend host, data region, email provider, AI provider and applicable jurisdictions before the API is used for real visitor data.
