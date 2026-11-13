# GrapeCrux — Implementation of “1st changes.docx”

Source document: the supplied GrapeCrux Website – Comprehensive Business Visibility, SEO, Analytics and Lead Generation Improvement Report, dated 10 November 2026.

## Release objective

Make the website clearer to prospective clients, improve service discovery and support direct business enquiries while keeping the existing GrapeCrux brand and design direction.

## Website and business visibility

- Reworked the homepage to explain software, AI and digital services and link to relevant project routes.
- Added audience and business-challenge sections to help visitors understand where GrapeCrux may be relevant.
- Added service discovery and specialist landing pages for custom software, business process automation, AI integration, mobile application development and data engineering.
- Added How We Work, Technologies, illustrative Case Studies and a resource library.
- The Case Studies page identifies examples as illustrative demonstrations, not verified client engagements.
- Added a browser-based project assessment that recommends relevant service routes and lets visitors copy a project brief. The assessment does not submit answers automatically.
- Retained the guided FAQ assistant as a local, rule-based browser feature.

## Direct email form delivery

- The Contact form submits through the hosted FormSubmit service to service@grapecrux.com.
- The Careers hub and all 13 role detail forms submit through the hosted FormSubmit service to yaswanth@grapecrux.com.
- Career applications include Job IDs, role-specific questions and a required privacy acknowledgement.
- Applicants may optionally attach one PDF, DOC or DOCX resume, up to 10 MB.
- Contact and Careers forms use HTTPS form POST and redirect to dedicated confirmation pages.
- FormSubmit requires a one-time activation from each recipient inbox after the first submission. The Contact and Careers recipient addresses must be activated separately.
- The static website does not run an application server, create a submission database or provide a private lead-management dashboard. Delivered messages are received and managed in the authorised company email accounts.
- The form provider may retain a temporary submission archive for up to 30 days. The recipient mailboxes are subject to the organisation's own access and retention practices.

## Measurement and privacy

- Consent-aware GA4 tracking remains in place using G-QXMRMGJEP2.
- Analytics events describe page views, service discovery, form starts and interactions.
- The form_submit event measures a browser-side submission attempt. It is not proof of provider delivery, inbox receipt or a human response.
- No generate_lead event is emitted as a verified email-delivery conversion.
- Names, phone numbers, email addresses, CV contents and free-text form answers are not sent to GA4.
- The Privacy Notice describes the hosted form provider, the two recipient addresses, optional CV upload, the local assistant and the analytics distinction.
- No SMTP credentials, API tokens or other private secrets are placed in the public repository.

## Content and search

- Kept the curated Blogs hub focused while preserving the additional articles as crawlable individual pages.
- Added structured page metadata, canonical URLs, Open Graph and Twitter metadata, JSON-LD where appropriate, and the existing Google tag on the relevant pages.
- Updated the XML sitemap for the existing public pages. Form confirmation pages are noindex and are not sitemap entries.
- Kept robots.txt focused on public crawling and the existing tests path.
- Maintained internal links between articles, relevant service pages, the project assessment and Contact.

## Deliberately not fabricated

- No client names, testimonials, case-study results, performance statistics or certifications were invented.
- The Technologies page describes capability areas; vendor experience and certifications must be confirmed before publication.
- No city/country landing-page network was generated without evidence of market capacity.
- No price list, guaranteed result or response-time promise was published.
- No newsletter form was connected without a consent-aware email marketing provider and unsubscribe process.
- No Google Tag Manager container was activated because no actual GTM ID was supplied. Direct GA4 remains the current measurement route.

## After deployment

1. Submit a test Contact enquiry and activate service@grapecrux.com using the provider confirmation email.
2. Submit a test Careers application and separately activate yaswanth@grapecrux.com.
3. Test a Careers application both with and without an optional CV attachment.
4. Confirm that submissions reach the correct inboxes and that Reply-To points to the visitor.
5. Check spam placement, inbox access permissions and organisation-approved retention.
6. Confirm GA4 consent behaviour and verify that form_submit is interpreted as an attempt, not a confirmed lead.
7. Re-run the live SEO audit and inspect key URLs in Google Search Console.
8. Run PageSpeed Insights for Home, Services, Blogs, Careers and Contact on mobile and desktop.

## Known limitations

- Email delivery depends on the hosted form provider and successful one-time activation of both recipient addresses.
- The static site does not provide a submission database, API, private lead dashboard, status workflow or automatic backup of enquiries.
- Browser analytics cannot verify provider delivery or inbox receipt. Use the authorised mailboxes or an approved CRM to track real enquiries and outcomes.
- The provider's optional upload limit is 10 MB total; the website accepts only PDF, DOC and DOCX resume extensions.
- The organisation must review the provider's current terms, privacy practices and data-processing requirements before using the forms for production personal data.
