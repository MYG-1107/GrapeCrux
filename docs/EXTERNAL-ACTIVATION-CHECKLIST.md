# GrapeCrux — email form activation checklist

The website uses hosted HTML form delivery so contact and Careers submissions are forwarded to company email without a custom application server or database.

## One-time recipient activation

FormSubmit requires each recipient address to be confirmed before normal delivery is enabled.

- [ ] Deploy the website branch to the production site.
- [ ] Submit a clearly labelled test enquiry from https://grapecrux.com/contact/.
- [ ] Open the activation email sent to service@grapecrux.com and complete the provider's confirmation step.
- [ ] Submit a test application from https://grapecrux.com/careers/ .
- [ ] Open the activation email sent to yaswanth@grapecrux.com and complete its separate confirmation step.
- [ ] Repeat each test after activation and confirm the details arrive in the intended inbox.
- [ ] Check that the visitor's email is available as Reply-To.
- [ ] Test an application with no attachment and a second application with a small PDF CV.
- [ ] Confirm only PDF, DOC and DOCX files up to 10 MB are accepted by the website.
- [ ] Review spam-folder placement and the provider's anti-spam settings.

## Privacy and inbox operations

- [ ] Confirm the privacy notice identifies FormSubmit as the hosted form-delivery provider.
- [ ] Confirm the Contact and Careers forms display their required privacy acknowledgements.
- [ ] Restrict access to the recipient mailboxes to authorised team members.
- [ ] Set an organisation-approved mailbox retention and deletion process.
- [ ] Remember that the provider's submissions archive is temporary (up to 30 days); the company mailbox is where delivered messages are received.
- [ ] Do not forward applicant CVs or enquiry details to public issue trackers, analytics properties or unsecured storage.

## Analytics and search

- [ ] Confirm GA4 uses G-QXMRMGJEP2 and analytics consent remains denied by default.
- [ ] Test that form_submit is recorded only as a browser submission attempt; it does not verify email delivery.
- [ ] Do not configure generate_lead as a confirmed conversion from a client-side submit event.
- [ ] Confirm https://grapecrux.com/sitemap.xml reports Success in Search Console.
- [ ] Run the live SEO audit after deployment and inspect the Contact, Careers and Blogs pages.
- [ ] Run PageSpeed Insights for Home, Services, Blogs, Careers and Contact on mobile and desktop.

## Operational ownership

- [ ] Designate an owner for the service@grapecrux.com enquiry inbox.
- [ ] Designate an owner for the yaswanth@grapecrux.com recruitment inbox.
- [ ] Establish a routine for acknowledging enquiries, reviewing applications and recording sales outcomes in an approved CRM or business process.
- [ ] Periodically submit a test form to verify that the hosted delivery path and mailbox remain active.
