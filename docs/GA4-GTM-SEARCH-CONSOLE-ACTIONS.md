# GrapeCrux — GA4, GTM and Search Console operating guide

## GA4 events implemented in the website

- page_view: consent-aware page views.
- contact_view: Contact page view.
- service_view: service detail page view.
- blog_view: individual blog article view.
- case_study_view: illustrative demonstration/case studies page view.
- form_start: first interaction with the project enquiry form.
- form_submit: valid client-side form submission attempt.
- email_click, phone_click, whatsapp_click: relevant contact-link interactions where those links exist.
- cta_click, start_project_click, contact_cta_click, service_page_click, blog_article_click, outbound_link_click and chat_open: contextual interactions.

The code is consent-aware. Event parameters are designed not to include names, email addresses, phone numbers, company names, CV contents or free-text project descriptions.

## Important conversion distinction

Contact and Careers forms use native HTML POST to a hosted email form-delivery provider. The provider forwards messages to the configured company inboxes. The static website does not operate an enquiry database or a private lead-management dashboard.

- form_submit indicates that a browser form submission was attempted.
- It does not confirm that the provider delivered the message, that the destination inbox accepted it, or that a team member read it.
- Do not send a generate_lead event from the client-side submit event. Do not mark form_submit, contact_view, page_view or CTA clicks as verified sales leads.
- Track received enquiries and applications from the authorised company mailboxes or an approved CRM, not by sending personal data to GA4.

## GTM status

No GTM container ID was supplied. The website therefore keeps the direct GA4 G-QXMRMGJEP2 implementation and does not activate Google Tag Manager.

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
- Build reports for traffic sources, landing pages, service views, form attempts and website interactions.
- Do not send personal information, CV content or free-text form responses to GA4.

## Search Console

The user's 10 November 2026 screenshot showed the sitemap was processed successfully with 118 discovered URLs. This PR adds 16 new public URLs, so the updated sitemap contains 134 URLs.

After deployment:
1. Confirm Indexing → Sitemaps shows Success for https://grapecrux.com/sitemap.xml.
2. Inspect priority landing pages with URL Inspection.
3. Use Test Live URL and confirm indexing is allowed and canonical selection is correct.
4. Review Page indexing weekly and group URLs by the reported reason.
5. Monitor queries, impressions, clicks, CTR and landing pages over a meaningful period.
6. Do not request indexing for every URL repeatedly; sitemap submission and requests do not guarantee inclusion.

