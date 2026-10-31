# GrapeCrux — Follow-up Audit & Release Notes

## Repository review scope

The current `main` branch contains a bright static frontend with directory-based clean routes, eight service landing pages, an illustrative work/concepts page, an insights hub, a contact form, legal templates, a local browser chatbot and an optional FastAPI backend. This update builds on that structure rather than replacing the design with a different visual system.

## Changes in this package

1. **Original logo:** Replaced the stylised G lockup with the original repository grape image in shared header/footer and chatbot avatar; favicon references the original PNG. Keep the existing repository-root `grapecrux_brand_logo.png` when uploading.
2. **Navigation:** Added an Industries & Use Cases route and header/footer links.
3. **Insights:** Converted the three in-page guide anchors into standalone clean-URL articles with unique metadata and article structured data. This helps the guides be shared and indexed independently.
4. **Contact brief:** Removed the awkward “currency to confirm” wording, added a separate currency field, and included currency in the prepared enquiry email.
5. **SEO:** Added the new industry and article routes to the sitemap; preserved existing canonical URL and root CNAME strategy.
6. **Shared UI:** Kept the existing warm-white/forest-green/lime visual language, but adjusted logo lockup sizing and the assistant avatar to use the provided artwork.
7. **No invented credentials:** No client logos, testimonials, completed project metrics, locations, registrations or certifications were added. Work examples remain explicitly labelled as concepts unless verified evidence is provided.

## Items still needing owner confirmation

- Add verified registered address, registration identifiers, approved leadership details and public company profile only when the owner confirms them.
- Add genuine case studies and testimonials only with permission and evidence; the current Work page correctly labels its cards as concept directions.
- Verify `service@grapecrux.com` is monitored.
- Have privacy and terms text reviewed against actual practices and applicable law.
- Decide whether contact leads should be emailed only or handled by a hosted backend/CRM.
- Deploy and configure the optional FastAPI AI backend if a generative model is needed. The default assistant remains a local guided FAQ.

## Validation performed in package

- HTML syntax parse check across all static HTML files.
- Unique titles, meta descriptions and canonical URL checks for indexable page files.
- Local link and local image target checks (with explicit exceptions for anchor links and the original repo-root logo asset).
- Sitemap XML parse and sitemap-to-page existence checks.
- JavaScript syntax check if Node.js is available.
- ZIP archive integrity check.

## Live validation boundary

Static checks cannot guarantee the browser has no runtime errors, the live CNAME/DNS are correct, an external email application opens, the optional backend is deployed, or search engines have indexed the pages. Verify on `https://grapecrux.com/` after upload and run Lighthouse/Search Console separately.


## Page-by-page coverage

The static package includes these 20 canonical routes:

- `/` — Home
- `/about/` — About GrapeCrux
- `/services/` — Service catalogue
- `/services/web-development/`
- `/services/ai-automation/`
- `/services/product-design/`
- `/services/branding/`
- `/services/digital-growth/`
- `/services/cloud-devops/`
- `/services/data-integration/`
- `/services/quality-assurance/`
- `/industries/` — Illustrative use cases, not a claim of past client work
- `/work/` — Concept directions clearly labelled as concepts
- `/insights/` — Insight index
- `/insights/website-project-planning/`
- `/insights/ai-assistant-readiness/`
- `/insights/website-launch-qa/`
- `/contact/`
- `/privacy/`
- `/terms/`

In addition, the package includes the home `index.html`, 8 legacy `.html` redirect pages, `404.html`, reusable assets/scripts, `robots.txt`, `sitemap.xml`, `CNAME`, the optional `backend/`, and deployment documentation. The visible path `/index.html` is cleaned by the script; GitHub Pages still requires the physical homepage file `index.html`.

## Latest local validation result

- 29 HTML files scanned.
- 20 indexable pages and 9 noindex pages (redirects plus 404).
- 20 sitemap URLs, each resolving to a packaged clean-route page.
- 0 static structure errors and 0 warnings in `validate_site.py`.
- JavaScript syntax check passed with Node.js.
- Python syntax compilation passed for the optional FastAPI backend.
- ZIP integrity check passed after packaging.

## Known content gaps that cannot be filled honestly without company approval

- No verified registered-office address, registration number, leadership bio, team names, certifications or public phone number were supplied, so these have not been invented.
- No approved real client case studies, testimonials or measurable outcomes were supplied. The Work page remains clearly labelled concept directions. Replace these with genuine work as evidence becomes available.
- The contact form prepares a `mailto:` message; it does not store leads or prove an email was delivered.
- The optional generative-AI backend is only a scaffold and is not deployed by GitHub Pages. The default chatbot is a local rules-based guide.
- Privacy and terms pages are starter templates that require company/legal review.
- The official logo PNG is already in the existing repository but is not duplicated inside this ZIP. The site uses the official public raw asset and falls back to the local root PNG, so preserve that file when uploading the package.

## Live testing limitation

The automated web page fetch did not provide a readable live HTML response in this environment, and a headless Chromium smoke-test attempt timed out. Therefore the checks above are local/static checks, not proof of live production navigation, visual rendering, live contact email delivery, deployed chatbot API availability, Lighthouse scores, or search-engine indexing. Run those checks after deployment.

## Corporate profile update (2026-10-31)

The About page now presents GrapeCrux as a creative initiative of Infinite Resource Creators Private Limited, not a separate legal entity. It includes the supplied vision, mission, philosophy, incorporation date, CIN, registered office and ROC information. The Organization JSON-LD also includes the parent-company identifier, founding date and address based on the information supplied by the company.

**Publication note:** The corporate details above were supplied by the company representative and were not independently verified against MCA records. Confirm spelling, punctuation and current registered-office details against official company documents before publishing. Avoid describing GrapeCrux as a separately incorporated company.

## Remaining site-wide checks

- Confirm the legal entity/brand relationship is consistent on Contact, footer, Terms, Privacy and chatbot disclosures; About page now carries the full corporate information.
- Confirm contact email, phone and enquiry handling are current and monitored.
- Test the actual deployed routes, mobile navigation, form mailto flow and chatbot on the live domain after upload.
- Confirm all external assets load reliably and use a branded social preview image.
- Review privacy notice against the actual analytics, cookies, form and chatbot data collection in production.
