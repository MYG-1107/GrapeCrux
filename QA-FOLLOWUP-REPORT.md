# Follow-up QA report — GrapeCrux

**Prepared:** 31 October 2026  
**Scope:** Shared brand lockup, curated Blog hub, search discovery for unfeatured articles, five new technical articles, chatbot topic coverage and overlay integrity.

## Results

| Check | Result |
|---|---:|
| Full HTML documents in overlay | 22 |
| Article detail files in overlay | 15 |
| New long-form articles | 5 (836–934 words each) |
| Featured article cards on Blogs hub | 8 |
| Article detail URLs preserved in sitemap | 21 |
| Sitemap URL entries | 47 unique |
| HTML metadata / IDs / H1 / image-alt validation | 0 errors |
| Chatbot intent test cases | 35/35 passed |
| Brand, curation, indexability and article QA checks | 45 passed |
| JavaScript syntax / Python backend compilation | Passed |
| ZIP integrity | Passed |

## User-facing changes

- Shared header and footer restore the original mark plus two-tone “GrapeCrux” wordmark, with viewport-aware medium sizing.
- The Blogs page displays eight selected articles only. The remaining published article URLs are not listed on that hub, but remain live and are included in `sitemap.xml`.
- Five new technical articles cover PostgreSQL query tuning, WCAG 2.2 accessibility, OWASP Top 10:2025, AI product evaluation, and secure CI/CD pipelines. Each includes a distinct title, description, canonical URL, Open Graph metadata, keyword metadata, BlogPosting JSON-LD and authoritative further reading.
- The local chatbot now recognises each topic and distinguishes the curated Blogs page from the full published article set.

## SEO accuracy note

Google Search does not use `meta name="keywords"` for indexing or ranking. Those fields are kept as supplementary metadata, not treated as a ranking mechanism. Useful content, descriptive titles, internal links, crawlable URLs, correct canonicals, structured data and sitemap submission are more useful implementation priorities. A sitemap is a discovery hint; it does not guarantee crawl, index or rankings.

## Limitations / deployment QA

The live domain could not be retrieved in the available browser environment, so a visual screenshot comparison against the production domain and real-device browser tests could not be completed. The lockup markup uses the same responsive values in both shared fragments, but verify at 375px mobile, 768px tablet and 1366px+ desktop after pushing. Also validate the menu toggle, footer wrapping, image loading, live canonical URLs, Google Search Console URL inspection and actual sitemap processing. The ZIP is an overlay; it has not been pushed or deployed.
