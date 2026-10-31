# GrapeCrux Website — Responsive Branding, Services and Editorial Update

This is an **overlay ZIP** for the existing `MYG-1107/GrapeCrux` repository. It includes the previously prepared Careers/blog/chatbot updates plus this release's responsive logo correction, expanded Services hub, four dedicated service pages and five additional long-form articles. It is not a replacement copy of the entire repository.

## Apply the update

1. Extract the ZIP and open `GrapeCrux-update`.
2. Copy the folder contents into the root of your existing repository, allowing listed files to be replaced and new folders to be added.
3. Preserve unchanged repository assets, especially `grapecrux_brand_logo.png`, `CNAME`, `.nojekyll` and the existing root files.
4. Review the changes, commit and push to the GitHub Pages publishing branch.
5. After deployment, check the homepage, Careers, Services, all new service pages and all five new article URLs at desktop, tablet and mobile widths.

## Responsive logo fix

The shared header and footer use the same logo image and a consistent responsive width (`clamp(148px, 12vw, 172px)`) with a 48px maximum height. The old fixed 206px rendering is removed from the shared lockup. The rule is included in the shared header/footer image styles so the Careers, homepage and all pages remain consistent. Keep the original transparent `grapecrux_brand_logo.png` file.

## Services added

The Services hub now lists 12 capability areas, including CRM & ERP Solutions, Product Engineering & SaaS Development, Software Testing & Quality Engineering, and Managed Application Support & Maintenance. Dedicated pages have been added for those four areas. Platform selection, vendor licences, support hours and project responsibilities are explicitly scoped; no vendor partnership or 24/7 promise is implied.

## Five additional blogs

- CRM implementation and team adoption
- Manual QA, browser/API automation and release quality
- SaaS MVP engineering and multi-tenant safety
- Secure API integration, webhooks, OAuth and idempotency
- Cloud observability, SLOs and cost control

Every new article includes an individual title, meta description, keywords, canonical URL, Open Graph metadata, BlogPosting JSON-LD, internal links and primary technical resources. The existing blog hub now lists all 16 articles.

## SEO audit summary

The current repository's canonical, indexable pages were checked for title, meta description, canonical URL, Open Graph title/description/image and JSON-LD structured data. Those elements were present on the main indexable routes, including all existing blog and service pages. Legacy `.html` redirect stubs and the 404 page are not treated as canonical content pages. The new service and article routes have unique metadata and structured data, and are included in `sitemap.xml`.

SEO metadata helps search engines understand a page; it does not guarantee crawling, indexing, rich results or ranking. Verify site ownership and submit the sitemap in Google Search Console after deployment.

## Quality checks

Run from the full repository root after merging:

```bash
node --check assets/js/careers.js
node --check assets/js/assistant-knowledge.js
node tests/chatbot-intents.test.cjs
python -m py_compile backend/main.py
python validate_site.py
```

Also inspect responsive layouts at 360px, 390px, 768px, 1024px and 1440px widths. Check the logo in the homepage header, Careers header and all footers. Test one full-time and one internship application, the email recipient, and all newly added service and blog links.

## Form and assistant behaviour

Careers applications continue to prepare a `mailto:` draft to `yaswanth@grapecrux.com`; the applicant must attach their CV and press Send. The static website does not silently transmit or store applications. The local chatbot is a curated FAQ and can describe the new services and blog topics. The optional hosted model remains disabled unless a backend URL and secure server configuration are supplied.


## Brand lockup and curated Blogs hub (31 October 2026)

- Restored the original GrapeCrux symbol + two-tone wordmark in both shared header and footer. The logo mark uses a medium responsive size (44–50px) and the wordmark retains the previous dark-green “Grape” and moss-green “Crux” treatment.
- The Blogs landing page now features eight selected articles rather than listing every article. The remaining published article pages remain live, indexable (`index,follow`) and included in `sitemap.xml`; the landing page is a curated editorial selection, not an archive of every URL.
- Added five in-depth guides: PostgreSQL query performance, WCAG 2.2 accessibility, OWASP Top 10:2025, AI product evaluation, and secure CI/CD pipelines. Each new page includes a unique SEO title, meta description, keywords, canonical URL, Open Graph metadata, BlogPosting JSON-LD and primary-source links.
- Expanded the local chatbot with answers for all five topics and a clear explanation that the Blogs page is curated while other published articles remain available by URL and sitemap.

QA commands:
```bash
node --check assets/js/assistant-knowledge.js
node tests/chatbot-intents.test.cjs
node tests/brand-blog-qa.test.cjs
python -m py_compile backend/main.py
```

Search engines can discover sitemap URLs, but crawl frequency, indexing and rankings are determined by each search engine. Submit the sitemap in Search Console and monitor indexing; no ranking position is guaranteed.


### SEO note on keywords and discovery

Each new article includes a concise keyword metadata field because you requested topic tags, but Google Search does not use the `meta name="keywords"` tag for indexing or ranking. The stronger signals are the article's useful original content, clear title and description, crawlable links, canonical URL and structured data. All 21 article detail URLs remain in the sitemap even though eight are featured on the Blogs landing page. Search engines may discover them through the sitemap, but crawling, indexing and ranking are not guaranteed. Submit the sitemap and inspect representative URLs in Google Search Console after deployment.
