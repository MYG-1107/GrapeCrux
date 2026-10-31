# GrapeCrux Careers, Blogs and Assistant Update

**Prepared:** 31 October 2026  
**Repository:** `MYG-1107/GrapeCrux`  
**Delivery:** Overlay package; no changes have been pushed to the live repository by this ZIP build.

## Delivered

- Replaced the old seven-track, three-month internship-only Careers page with six full-time positions and seven internship tracks.
- Removed fixed-duration wording and all compensation amounts from the Careers page.
- Added a dynamic application form with required full name, email and phone number; different full-time and internship questions; individual GitHub, portfolio and LinkedIn fields; and impact-focused prompts.
- Connected role-card buttons to the corresponding type and role in the application form.
- Set the application email recipient to `yaswanth@grapecrux.com`.
- Added a Life at GrapeCrux section, selection explanation, applicant guidance, role-specific FAQs and a business project CTA.
- Corrected the shared header and footer lockups to display only the logo image without the previous white tile or duplicate text wordmark.
- Added five technical blog articles and updated the blog hub and XML sitemap.
- Expanded the local assistant knowledge base and optional backend system guidance for jobs, internships, blog topics and the Work page. Generic fallback messages now vary and route users to relevant pages.

## Important delivery behaviour

The site is static GitHub Pages content. A browser `mailto:` form cannot silently deliver an email or attach a local resume. The new application flow prepares a draft addressed to `yaswanth@grapecrux.com`; the applicant must attach the CV and click Send. The page tells applicants this clearly. Automatic server-side submission requires a secured mail service, server-side credentials, hosting and privacy review, none of which were supplied for this static deployment.

## Technical editorial note

The PHP article references the official PHP 8.5 release announcement and migration guide. On 31 October 2026, the official PHP downloads page identified PHP 8.5.12 (released 21 October 2026) as the current stable PHP version. The article also distinguishes the PHP 8.6.0 beta testing release from stable production versions.

## Validation boundary

The overlay package can be syntax-checked and the updated chatbot intent tests can be run independently. The full repository-wide validator requires the unchanged repository files to be present in the working directory; visual browser QA, live email-client handoff, hosted assistant availability and Google Search Console checks must be completed after merging and deployment. No search-ranking or indexing outcome is guaranteed.
