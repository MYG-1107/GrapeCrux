# GrapeCrux — Footer Wordmark & 15-Article Blog Update

This is an **overlay ZIP** for the current `MYG-1107/GrapeCrux` repository. It is not a replacement for the full website.

## Files to update
- `includes/footer.html` — fixes the footer wordmark contrast. The existing transparent icon is preserved; the wordmark is now dark green with a readable green accent on the pale footer background. The header is not changed.
- `blogs/index.html` — updates the blog hub SEO metadata and groups the 15 new articles into four topic sections while retaining the existing eight selected articles.
- `blogs/<article-slug>/index.html` — 15 new long-form article pages.
- `sitemap.xml` — includes all 15 new canonical article URLs and refreshes the Blogs hub last-modified date.

## New articles
### AI (6)
1. Choosing the Right AI Architecture: Machine Learning, Generative AI or Agents?
2. RAG vs Fine-Tuning: Choosing the Right Way to Adapt an AI Model
3. Before You Build AI: Prepare Your Business Data, Processes and Ownership
4. Operating AI in Production: Monitor Quality, Cost, Latency and Failure
5. Responsible AI Governance: Practical Controls for Business and Product Teams
6. Multimodal AI in Business: Connecting Documents, Images, Audio and Workflows

### Prompt Engineering (4)
7. A Practical Prompt Engineering Framework: Task, Context, Constraints and Output
8. Few-Shot Prompting: How to Choose Examples That Teach the Right Pattern
9. Structured Output Prompting: From JSON Instructions to Validated Application Data
10. Secure Prompt Design: Separate Instructions from Untrusted Data

### Site visibility and improvements (2)
11. A Technical SEO Visibility Audit: Crawling, Indexing, Canonicals and Sitemaps
12. Improve Website Visibility and Conversions: Content, Speed and Trust

### Data Engineering, Big Data Analytics and AI Agents (3)
13. Designing Reliable Data Engineering Pipelines: Batch, Streaming and Quality
14. Big Data Analytics: Turn Large Datasets into Decisions People Can Trust
15. Building Business AI Agents: Tools, State, Handoffs and Guardrails

## SEO included on every new article
- Unique title and meta description
- Keywords metadata as supplementary metadata (Google does not use the keywords meta tag for ranking)
- Self-referencing HTTPS canonical URL
- Robots index/follow directive
- Open Graph and Twitter metadata
- BlogPosting JSON-LD with dates, publisher, category and canonical page reference
- One clear H1, hierarchical H2 sections, readable article text
- Internal links to relevant GrapeCrux service/article pages
- Further reading links to official or primary technical sources
- Sitemap entry

## Deploy
1. Extract the ZIP.
2. Copy the contents of the `GrapeCrux-Blog-Update/` folder into the root of the existing repository.
3. Allow the new files to be added and replace `includes/footer.html`, `blogs/index.html` and `sitemap.xml`.
4. Preserve all other repository files, especially `CNAME`, `.nojekyll`, the header, CSS, JS, logo and existing articles.
5. Commit and push to `main` (or the GitHub Pages publishing branch).
6. After Pages deploys, check the footer at desktop and mobile widths, open the Blogs hub and all 15 article URLs, then submit the sitemap in Google Search Console.

## Important
- The header is deliberately unchanged.
- The articles are original GrapeCrux editorial content informed by linked official documentation. Review and update technical details when source documents change.
- Adding articles does not guarantee crawling, indexing or ranking. Monitor Search Console after deployment.
- The assistant knowledge file is unchanged in this release; the site-wide chatbot may continue to answer broad blog questions but is not given a specific answer entry for each new article in this update.
