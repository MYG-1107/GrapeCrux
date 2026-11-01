# GrapeCrux — GA4 event tracking update

## What changed

`assets/js/config.js` keeps the existing assistant setting and adds consent-aware event tracking. It reads the same preference key used by the current consent banner: `gc-analytics-consent-v1`. It sends custom events only after the visitor has accepted analytics measurement.

Events added:

| Event | Meaning | Is it a confirmed conversion? |
|---|---|---|
| `chat_open` | Visitor opens the GrapeCrux assistant | No |
| `chat_contact_click` | Visitor clicks a contact route inside the assistant | No |
| `contact_cta_click` | Visitor clicks a project/contact CTA | No |
| `service_page_click` | Visitor opens a service detail page | No |
| `blog_article_click` | Visitor opens an individual blog article | No |
| `careers_page_click` | Visitor opens the Careers page from a link | No |
| `careers_apply_click` | Visitor clicks a role-specific Apply button | No |
| `project_enquiry_email_draft_requested` | Valid project form submit handler is reached and a mailto draft is requested | No; it does not prove the email was sent |
| `careers_application_email_draft_requested` | Valid careers form submit handler is reached and a mailto draft is requested | No; it does not prove the email was sent |

Only low-risk labels such as page path, service slug, role name and application type are sent. Names, email addresses, phone numbers, CVs, free-text answers and message contents are not sent to GA4.

## Why the Analytics screenshot shows zero key events

The screenshot shows views and event activity, but 0 key events in the selected report. The current website source uses a consent banner and sets `send_page_view: false`; page views are sent manually after analytics consent is granted. The current frontend primarily opens email drafts for contact and careers forms and did not have dedicated business-intent event names. A mailto draft is not a verified form submission.

The update adds clearly named intent events. They will appear after deployment and after visitors accept analytics. They will not retroactively populate past dates.

## What to mark as a key event

In GA4, after the new events have appeared under Admin / Events:

- You may mark `project_enquiry_email_draft_requested` as a **project-enquiry intent proxy** if you accept that it only means the visitor requested an email draft.
- You may mark `careers_application_email_draft_requested` as an **application intent proxy** if you accept that it only means the visitor requested an email draft.
- Do not describe either event as an enquiry/application received. The visitor still needs to send the email, and GrapeCrux still needs to receive it.

For true confirmed conversions, replace the mailto-only forms with a secure backend/form provider. Fire a separate event such as `generate_lead` only after the backend returns a successful receipt/confirmation. Do not fire it merely because the submit button was clicked.

## Verify after upload

1. Deploy the updated files.
2. Open `https://grapecrux.com/` in a private/incognito session.
3. Choose **Allow analytics** in the GrapeCrux privacy banner.
4. Open a service page, blog article, chatbot and Careers page.
5. Submit valid test details in the project or careers form only if you intend to open a mail draft. Do not send real personal test data to GA4.
6. Open GA4 Realtime or DebugView and confirm the custom event names appear.
7. Use Google Tag Assistant to verify consent default and consent update commands.
8. Repeat after choosing **Reject optional analytics**. Custom analytics events should not be emitted for that browser's rejected-consent session.

## Existing tag / consent arrangement

The current repository sets `analytics_storage`, `ad_storage`, `ad_user_data` and `ad_personalization` to denied before the Google tag is configured, then updates consent after the visitor chooses. This ordering is consistent with Google's documented gtag.js Consent Mode pattern. Keep the default consent command ahead of measurement events and preserve the visitor preference on later pages.

Official Google guidance:
- Consent Mode: https://developers.google.com/tag-platform/security/guides/consent
- Consent debugging with Tag Assistant: https://developers.google.com/tag-platform/security/guides/consent-debugging
