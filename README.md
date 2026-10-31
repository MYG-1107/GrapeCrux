# GrapeCrux Website Update Package

This is an **overlay ZIP** for the existing `MYG-1107/GrapeCrux` repository. It contains every changed and newly added file for the careers, blog, shared branding, chatbot, sitemap and supporting documentation updates. It is not a replacement copy of the entire repository.

## Apply the update

1. Download and extract this ZIP.
2. Open the extracted `GrapeCrux-update` folder.
3. Copy its contents into the root of your existing `MYG-1107/GrapeCrux` working copy, allowing the listed files to be replaced and the five new blog folders to be added.
4. Keep all other repository files and assets. In particular, preserve the existing root `grapecrux_brand_logo.png`, `CNAME`, and all unchanged pages/assets.
5. Review the changed files, then commit and push to the GitHub Pages publishing branch.
6. After deployment, check `https://grapecrux.com/careers/`, `https://grapecrux.com/blogs/`, each new article URL, the header/footer logo and the chatbot.

## Careers changes

- Six full-time openings: Senior Full-stack Developer, AI Engineer, Forward Deployment Engineer, Quality Assurance Tester, DevOps Engineer and Big Data Engineer.
- Seven internship tracks: Software Developer, Prompt Engineer, AI Engineer, Python Developer, .NET Developer, Machine Learning Engineer and Data Analytics.
- No fixed-duration wording and no compensation figures are published on the careers page.
- The application requires full name, email address and phone number.
- Full-time and internship selections show different questions. Full-time applicants provide employment history, experience and impact; internship applicants provide education, current status, projects and learning goals.
- GitHub, portfolio and LinkedIn are collected as separate optional fields.
- Role buttons preselect the opportunity type and track.
- Applications are prepared for `yaswanth@grapecrux.com`. The current static website uses a `mailto:` draft: applicants must attach their resume and press Send in their own email application. This website does not transmit or store applications. Automatic server-side delivery would require a configured, secured mail provider and hosting environment.

## Blogs and SEO

Five new original articles are added under `blogs/`, and the blog hub is updated to list all eleven articles. New pages include unique titles, descriptions, keywords, canonical URLs, Open Graph metadata, BlogPosting structured data, internal service links and further-reading sources. The sitemap includes all five new article routes.

The PHP article is based on the official PHP release and migration documentation. At the time prepared (31 October 2026), the official downloads page identified PHP 8.5.12 (released 21 October 2026) as the current stable PHP version; re-check the official page before publishing any future version-specific announcement. The article distinguishes stable releases from pre-release builds.

SEO metadata and crawl paths improve discoverability but do not guarantee indexing, rich results or search ranking. Verify Search Console ownership and submit `/sitemap.xml` after deployment.

## Chatbot

`assets/js/assistant-knowledge.js` adds specific answers for all available roles, application steps, the new blog topics and the illustrative nature of the Work page. Unknown questions now rotate through different fallback replies and point to relevant website sections rather than repeating one identical message.

`backend/main.py` updates the optional hosted assistant's system guidance. The frontend still uses the deterministic local knowledge base unless `GRAPECRUX_CHAT_API_URL` is configured. The hosted backend requires a secure server environment and a server-side provider key; do not put secrets in frontend JavaScript.

## Logo

The shared header and footer now render the existing root `grapecrux_brand_logo.png` directly as a single image, without the old white tile, border or duplicate text wordmark. Preserve that transparent PNG when merging the overlay.

## Checks

Run from the repository root after merging:

```bash
node --check assets/js/careers.js
node --check assets/js/assistant-knowledge.js
node tests/chatbot-intents.test.cjs
python -m py_compile backend/main.py
python validate_site.py
```

Also manually test one full-time and one internship application in a browser, including role auto-selection, conditional required fields, the generated recipient/subject/body, the resume attachment step and the final Send action. Check mobile layout and the circle alignment at desktop and mobile widths.
