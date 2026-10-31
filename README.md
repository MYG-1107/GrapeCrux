# GrapeCrux Website — QA, Blogs, Careers and SEO Release

This is the complete static GitHub Pages source package for GrapeCrux. It includes the existing corporate site structure plus a Blogs hub, six original blog posts, a Careers page, chatbot knowledge refinements, shared navigation/footer loading and consent-aware GA4 configuration.

## Upload to GitHub Pages

1. Back up the repository or create a branch before replacing files.
2. Extract this ZIP and open the `grapecrux-v4` folder.
3. Upload the **contents** of that folder to the root of `MYG-1107/GrapeCrux`.
4. Preserve the existing root file `grapecrux_brand_logo.png`. It is used by the shared header, footer and chatbot and is intentionally not duplicated in this source archive. Do not delete or rename it during replacement.
5. Preserve `CNAME` and `.nojekyll`.
6. Keep GitHub Pages configured to publish from `main` and `/ (root)`.
7. After deployment, verify the clean canonical routes directly in a browser.

## Shared header and footer

- `includes/header.html` is the only shared navigation source.
- `includes/footer.html` is the only shared footer source.
- All full content pages contain `#site-header` and `#site-footer` placeholders.
- `assets/js/main.js` loads these files once per page. On GitHub Pages it rebases root links under `/GrapeCrux/`; on `grapecrux.com` it uses root paths.
- To change the shared navigation or footer, edit only the respective include file. Google Analytics belongs in each document's `<head>`, not inside these body fragments.

## Google Analytics

GA4 measurement ID: `G-QXMRMGJEP2`.

The tag is configured on each HTML page. Analytics and advertising storage start as denied. A page-view event is sent only after the visitor accepts optional analytics in the preference banner. The footer's **Cookie preferences** link reopens the setting. After deployment, test consent and page views with Google Tag Assistant and GA4 Realtime.

## Blogs

`/blogs/` contains six original editorial articles on trustworthy AI assistants, AI application security, Core Web Vitals, service-page SEO, reliable API integrations and quality engineering. Each article includes page-specific metadata, canonical URL, BlogPosting structured data and further-reading links to primary technical sources.

## Careers

`/careers/` describes seven remote, three-month internship tracks: Software Development, AI / Machine Learning, Data Analytics, QA & Test Automation, UI / UX, Cloud & DevOps, and Business & Digital Marketing.

The page displays an indicative stipend of ₹5,000–₹10,000 per month and an indicative commitment of around 20 hours/week. Confirm budget, available seats, mentor capacity, dates, schedule and final stipend before announcing openings or issuing offers. The amount is not guaranteed until it is in the written offer. Internship completion does not guarantee a permanent job.

The application form prepares an email to `service@grapecrux.com`; it does not store applications or upload CVs. Applicants attach their resume to the email that opens. Role-card Apply buttons select the matching role in the form.

## Chatbot

`assets/js/assistant-knowledge.js` contains curated, deterministic FAQ answers. The current front-end assistant is not a generative AI model or human agent. The optional FastAPI backend in `backend/` is separate, not hosted by GitHub Pages and not enabled by default; deploy and configure it securely before using a live model. Do not expose provider API keys in front-end code.

## Forms and privacy

Contact and internship forms use `mailto:`. They validate required fields and prepare an email; the visitor's email app must send it. The static website does not store these submissions. The Privacy page describes this and the consent-aware GA4 behaviour. Have privacy/terms wording reviewed for the company's markets before treating it as legal advice or a contract.

## QA commands

Run from the extracted folder:

```bash
python validate_site.py
node --check assets/js/main.js
node --check assets/js/assistant-knowledge.js
node tests/chatbot-intents.test.cjs
python -m py_compile backend/main.py
```

See `QA-TEST-REPORT.md` and `AUDIT-AND-RELEASE-NOTES.md` for source-level findings, checks, limitations and manual post-deployment test cases.

## SEO note

The package includes page-specific metadata, canonical clean URLs, internal links, XML sitemap, robots directives and BlogPosting metadata. These improve clarity and crawlability; they do not guarantee crawling, indexing or first-place rankings. Verify Search Console ownership, submit the sitemap and monitor search performance after deployment.
