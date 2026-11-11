# GrapeCrux — GA4, GTM and Search Console operating guide

## GA4 events implemented in the website

- page_view: existing consent-aware page views.
- contact_view: Contact page view.
- service_view: service detail page view.
- blog_view: individual blog article view.
- case_study_view: illustrative demonstration/case studies page view.
- form_start: first interaction with the project enquiry form.
- form_submit: a valid project form submission attempt.
- generate_lead: emitted only after the backend returns a stored enquiry reference.
- email_click, phone_click, whatsapp_click: relevant contact-link interactions where the corresponding link exists.
- cta_click, start_project_click, contact_cta_click, service_page_click, blog_article_click, outbound_link_click and chat_open: contextual interactions.

The code is consent-aware. The events do not include names, email addresses, phone numbers, company names or free-text project descriptions.

## Important conversion distinction

The website's primary business record is the backend enquiry database. GA4 is for marketing analysis, not lead storage.

- form_submit indicates an attempt to submit.
- generate_lead indicates that the API confirmed the enquiry record was stored.
- Email notification and customer acknowledgement have their own backend status fields.
- A Contact page view, CTA click or opening an email draft is not a confirmed lead.

After the first real API submission:
1. Open GA4 → Reports → Realtime or Admin → DebugView.
2. Submit a test enquiry with analytics consent enabled.
3. Confirm generate_lead contains only non-personal event parameters and a generated enquiry reference.
4. In GA4 Admin → Data display → Events, mark generate_lead as a Key event.
5. Keep form_submit as a diagnostic event, not the primary conversion.
6. Do not mark page_view, contact_view or every CTA click as a lead.

## GTM status

No GTM container ID was supplied in the report or repository configuration. The website therefore keeps the direct GA4 G-QXMRMGJEP2 implementation and includes a blank configuration placeholder for a future GTM migration.

Before enabling GTM:
- Supply the actual GTM-XXXXXXX container ID.
- Decide whether GA4 will be configured directly or through GTM.
- If moving GA4 to GTM, remove/disable the duplicate direct GA4 configuration as part of the same controlled change.
- Respect the site's analytics consent state before loading marketing/analytics tags.
- Verify Realtime and DebugView and check that one interaction emits only one event.

## GA4 property configuration to complete manually

- Confirm the web data stream uses G-QXMRMGJEP2.
- Review Enhanced Measurement settings.
- Configure internal traffic filters for company/team usage.
- Review cross-domain measurement only if real cross-domain journeys exist.
- Mark generate_lead as a Key event after successful receipt is confirmed.
- Build reports for traffic source, landing page, service views, enquiry attempts and confirmed leads.
- Do not send personal information to GA4.

## Search Console

The user's 10 November 2026 screenshot showed the sitemap was processed successfully with 118 discovered URLs. This PR adds 16 new public URLs, so the updated sitemap contains 134 URLs.

After deployment:
1. Confirm Indexing → Sitemaps shows Success for https://grapecrux.com/sitemap.xml.
2. Inspect priority landing pages with URL Inspection.
3. Use Test Live URL and confirm indexing is allowed and canonical selection is correct.
4. Review Page indexing weekly and group URLs by the reported reason.
5. Monitor queries, impressions, clicks, CTR and landing pages over a meaningful period.
6. Do not request indexing for every URL repeatedly; sitemap submission and requests do not guarantee inclusion.

