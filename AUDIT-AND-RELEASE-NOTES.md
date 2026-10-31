# GrapeCrux — QA and Content Release Notes

**Release date:** 31 October 2026  
**Scope:** client-perspective content audit, chatbot QA, blog expansion, internship careers page, shared layout and analytics verification.

## Release changes

- Added a Blogs hub and six original service-aligned articles with primary-source/read-more resources, unique SEO metadata, canonical URLs, Open Graph data and BlogPosting schema.
- Added Careers with seven remote three-month internship tracks across software development, AI/ML, data analytics, QA/test automation, UI/UX, cloud/DevOps and business/digital marketing.
- Marked the ₹5,000–₹10,000 monthly stipend as indicative and subject to written offer; added confirmation requirements for seats, schedule, mentor and dates.
- Connected each Careers card's Apply button to the matching role in the form.
- Expanded the deterministic FAQ assistant to answer company identity, legal relationship, registered office, services, industries, concept-only portfolio, no published verified testimonials, pricing limits, no SEO ranking guarantees, blogs, internship terms and contact handling.
- Explicitly disclosed that the current website assistant is a curated FAQ, not a human representative or live generative AI model.
- Repaired assistant script references, included the GA4 consent configuration on Blogs and Careers, kept the Google tag in each page `<head>`, and left header/footer content in shared include files.
- Updated Privacy wording to describe the current GA4 consent behaviour and mailto-only forms; clarified that GrapeCrux is a brand initiative of Infinite Resource Creators Private Limited.
- Updated Work page messaging to say that its examples are concepts and that the site does not currently publish verified case studies or testimonials.
- Updated the shared footer year after the footer fragment loads.

## Automated QA summary

- 37 HTML documents scanned.
- 29 full content pages with shared header/footer placeholders.
- 28 canonical, indexable routes in sitemap.
- 0 static validation errors and 0 warnings.
- Chatbot knowledge tests: 23/23 passed.
- Main JavaScript and assistant knowledge module: syntax checks passed.
- Optional backend Python compile check: passed.

Full findings and the manual post-deployment test plan are in `QA-TEST-REPORT.md`.

## Known limitations / approval items

- The root `grapecrux_brand_logo.png` is retained in the existing repository and is not duplicated in this archive. Preserve it during upload.
- Contact and internship forms prepare `mailto:` messages; they do not persist data or submit to a CRM. A server-side lead/application workflow is a future enhancement.
- The chatbot is a local rules-based FAQ. A live generative assistant requires separate backend hosting, secure secret configuration, model evaluation and privacy review.
- The Work page has concept directions, not verified public client case studies or testimonials. Do not invent proof.
- Internship stipend/schedule/slots are indicative and must be approved in the written offer before announcing confirmed vacancies.
- Privacy and terms pages should be reviewed against the company's actual processes and applicable laws.
- SEO improvements do not guarantee indexing or a top ranking. Search Console verification and post-deployment monitoring remain necessary.
- The live domain could not be fetched by the available browser/network tools in this run. Live visual checks, actual GA4 Realtime events, mail-client handoff and Lighthouse/Core Web Vitals scores remain post-deployment checks.
