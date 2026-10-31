# GrapeCrux — Responsive, Services, SEO and Editorial Release

**Prepared:** 31 October 2026  
**Repository:** `MYG-1107/GrapeCrux`  
**Package:** Incremental overlay ZIP; no files have been pushed or deployed by this build.

## Changes

- Standardised the shared header and footer logo to a responsive 148–172px width range and 48px maximum height. The same lockup is used across the homepage, Careers and other routes.
- Preserved the existing header navigation and responsive mobile menu; the base stylesheet already uses a compact menu at tablet/mobile breakpoints and a single-column article layout on narrow screens.
- Expanded the Services hub from eight to twelve capability groups.
- Added dedicated CRM & ERP Solutions, Product Engineering & SaaS, Software Testing & Quality Engineering, and Managed Application Support pages.
- Added five long-form articles with unique metadata, canonical URLs, Open Graph tags, BlogPosting JSON-LD, internal service links and official technical resources.
- Updated the blog hub to list the five new articles (sixteen total in the blog index).
- Expanded the chatbot's curated knowledge base and optional backend prompt to cover CRM/ERP, product engineering, software testing, managed support, secure APIs and cloud operations.
- Added all nine new canonical routes (five articles and four service pages) to the XML sitemap.

## SEO audit

The repository's canonical indexable pages were reviewed for a title, meta description, canonical URL, Open Graph title/description/image and JSON-LD. Core pages, service pages, careers, insights, and the existing blog pages contained these items. Legacy `.html` compatibility redirects and the 404 document are intentionally excluded from the same SEO requirements. New pages follow the full metadata and structured-data pattern.

## Research basis for service catalogue

The expanded service taxonomy reflects common full-lifecycle software delivery practices visible in Indian software-services providers: CRM/ERP and custom enterprise software, AI integration, product engineering, managed cloud/DevOps, data/analytics, quality engineering and integration. See the release correspondence for the researched public references; GrapeCrux's pages describe its own intended scope, not competitor claims.

## Validation boundary

- Local ZIP integrity, HTML metadata fields, canonical/sitemap URLs, article counts, JSON-LD parseability and JavaScript syntax were checked in the build environment.
- The live website fetch returned a network-disabled response during this session, so a live cross-device screenshot comparison could not be completed here. CSS and shared includes are corrected at source level; please confirm the deployed rendering in real browsers after pushing.
- The email application remains a `mailto:` draft. The applicant must attach a CV and press Send. Automatic server-side delivery needs a mail provider and secure backend configuration.
- Search indexing and rankings are not guaranteed; Google Search Console verification and sitemap submission remain post-deployment steps.


## Follow-up brand, editorial and QA update

- Restored the compact brand symbol and two-tone “GrapeCrux” text lockup in the shared header and footer. The mark is responsive between 44px and 50px; the wordmark uses the original green colour treatment.
- Curated the public Blogs landing page to eight selected guides. Other article detail pages remain published and crawlable, and all article URLs remain in the XML sitemap. No `noindex` directive was added to unfeatured articles.
- Added five long-form, source-linked technical articles on PostgreSQL query performance, WCAG 2.2, OWASP Top 10:2025, AI product evaluation, and secure CI/CD pipelines.
- Updated deterministic chatbot answers and optional backend instructions for the new editorial topics and curated listing behaviour.
- Added `tests/brand-blog-qa.test.cjs` to check brand lockup, featured article count, sitemap inclusion, indexability, canonical metadata, structured data and chatbot topic coverage.

## SEO interpretation

The selected Blog hub intentionally shows eight articles. Unfeatured articles remain directly accessible and included in the XML sitemap with indexable page metadata. This supports discovery but does not guarantee that a search engine will crawl, index or rank any URL. Search Console submission and ongoing monitoring are required.

## Visual QA boundary

Live domain fetch was unavailable in this run, so pixel-perfect comparison against the deployed site was not possible. The responsive logo lockup uses viewport-based sizing in the shared fragments and was verified at source level. Run desktop/tablet/mobile visual checks after deployment, including keyboard navigation and footer wrap.


## Automated QA results — follow-up package

- HTML source audit: 22 full HTML documents in the overlay; titles, descriptions and canonical URLs present; no duplicate IDs; exactly one H1 per content page; image alt attributes present. Shared includes were correctly excluded from full-document metadata checks.
- Blog article audit: 15 article detail files in the overlay; all have keywords, canonical URLs, Open Graph title/description and BlogPosting JSON-LD. Five new articles contain approximately 836–934 words each.
- Editorial curation: exactly eight article cards appear on `/blogs/`. All 21 article detail URLs remain in the sitemap; 13 are not featured in the visible hub. The five new pages explicitly use `index,follow`.
- Sitemap: 47 unique URL entries; XML parsed successfully; 21 blog detail URLs.
- JavaScript syntax: assistant knowledge module passed.
- Chatbot intent tests: 35/35 passed, including each newly added topic.
- Brand, blog curation, indexing and content QA: 45 checks passed.
- Python backend compilation: passed.
- ZIP archive integrity: verified after packaging.

Google Search does not use the meta-keywords tag for indexing or ranking. Keyword metadata is retained as supplementary descriptive metadata; the editorial work prioritises useful content, clear page titles/descriptions, crawlable URLs, canonical tags, structured data and sitemap coverage. See Google Search Central's documentation: https://developers.google.com/search/docs/crawling-indexing/special-tags and https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview.
