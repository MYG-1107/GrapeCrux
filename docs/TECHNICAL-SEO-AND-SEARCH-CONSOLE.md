# GrapeCrux — Technical SEO and Search Console Action Plan

Repository baseline: main at 4ba962ab219fbe6898c119b73625c21097d8abc5
Live site: https://grapecrux.com/
Source guidance: https://www.freecodecamp.org/news/fix-common-technical-seo-issues/ (3 November 2026).

## Current repository findings

At the reviewed commit:
- 159 files in the repository tree.
- 118 clean, directory-based content pages.
- 70 individual blog articles.
- 12 service detail pages.
- 13 individual Careers role pages.
- 118 sitemap URLs; every sitemap URL maps to a clean page file, with no duplicate or unmapped URL.
- robots.txt allows public crawling, disallows only /backend/ and /tests/, and declares the canonical sitemap.
- Main content and headings are in the original HTML response. JavaScript enhances the shared header/footer and other interactions.
- Page title, meta description, canonical, GA4 Consent Mode and Open Graph metadata are present in the current implementation.

The sitemap and robots file are structurally sound at this commit. They should not be rewritten simply to create activity.

## Application of the freeCodeCamp checklist

The article describes eight practical checks. This release adds repeatable checks for them:

1. HTTP status / soft 404: the live audit checks every sitemap URL and probes a random missing URL; the missing URL must return HTTP 404, not a 200 not-found page.
2. Redirect chains: the live audit follows redirects, reports chains over one hop and flags redirecting URLs inside the sitemap.
3. robots.txt: static and live checks ensure important public routes (Blogs, Services, Careers, About and Contact) are not blocked.
4. Meta noindex: public sitemap pages must not carry a robots noindex directive.
5. X-Robots-Tag: the live audit checks HTTP response headers, since this directive is not visible in page source.
6. Canonicals: static/live checks require self-referencing canonicals for clean routes and detect canonical collisions.
7. Titles/descriptions: static/live checks require page titles and descriptions and detect duplicate titles.
8. Crawlable links and JavaScript: static checks validate real anchor hrefs and local destinations; live checks fetch unique internal link targets and verify that meaningful main content is present in the original HTML.

A canonical is a strong signal, not a command, and is most useful when similar content can be reached through multiple URLs. GrapeCrux clean pages use self-referencing canonicals. Legacy .html aliases remain noindex compatibility pages outside the sitemap.

## Search Console screenshots supplied

The screenshots show, in the selected reporting window:
- Search performance: 0 clicks, 1 impression, 0% CTR and average position 3 (based on that single impression).
- Page indexing overview: 1 indexed page and 0 not indexed pages at the time of capture.
- HTTPS report: the homepage is shown as the one example, last crawled on 7 November 2026.
- Core Web Vitals: no field data for mobile or desktop.

Interpretation:
- One impression is too little data to draw a stable ranking conclusion from average position.
- “No data” in Core Web Vitals does not mean good or poor performance; Search Console has no reportable field-data group yet.
- The source sitemap is complete, but sitemap inclusion does not guarantee crawling or indexing.
- Use the Page indexing report and URL Inspection live test to understand why individual pages are not yet indexed.

## Search Console steps after merge

1. Open the exact property for https://grapecrux.com/.
2. Open Indexing → Sitemaps and confirm https://grapecrux.com/sitemap.xml shows Success and a discovered URL count close to 118.
3. If it has not been submitted, submit it once; do not repeatedly resubmit the same sitemap.
4. Inspect the homepage, About, Services hub, priority service pages, Careers, Contact and Blogs hub.
5. Run Test live URL. Verify crawling is allowed, indexing is allowed, the canonical is correct and rendered HTML contains the page's expected content.
6. Request indexing for a small number of priority pages after verifying their live status and canonical.
7. Review Indexing → Pages weekly and fix the reported reason instead of requesting indexing blindly.

Google treats sitemap submission and indexing requests as discovery signals, not guarantees. New or updated URLs may take days or weeks to be processed.

## GA4: a Contact page view is not a lead

The supplied Analytics screenshot shows 73 active users, approximately 1.2K events and 0 Key events in the selected 30-day overview. It also suggests tracking Contact page visits as generate_lead. Do not apply that suggestion as written: a page view only means someone visited the Contact page.

The current static Contact and Careers forms prepare email drafts. The visitor must send the email themselves. Existing events project_enquiry_email_draft_requested and careers_application_email_draft_requested measure intent, not confirmed receipt.

Recommended reporting:
- You may mark the project email-draft event as a Key event if you deliberately want to measure enquiry intent, but label it as a draft request.
- Do not rename it generate_lead while it only opens an email draft.
- For real lead measurement, connect the form to a secure backend/form provider and fire generate_lead only after confirmed successful receipt.
- Do not send names, phone numbers, email addresses, CV contents or free-text responses to GA4.

## Core Web Vitals

Search Console currently shows no Core Web Vitals data. After deployment, run PageSpeed Insights for the homepage, Services, a service detail page, Blogs, Careers and Contact on mobile and desktop. Record LCP, INP and CLS. Google's good thresholds at the 75th percentile are LCP at or below 2.5 seconds, INP below 200 ms and CLS below 0.1. Re-check field data when enough Chrome UX Report data accumulates.

Do not minify or remove scripts only to chase a score; profile the measured bottleneck first.

## GitHub Pages redirect limitation

Older .html addresses remain compatibility pages with noindex and a clean-route fallback. Ordinary GitHub Pages static files cannot emit arbitrary per-path HTTP 301 responses. The live audit checks what the host actually returns. If a true HTTP 301 is required for legacy URLs, use a hosting/platform redirect feature or supported edge/CDN rule. Do not mistake JavaScript or meta-refresh navigation for a server-side 301.

## Automation added

- Pull-request regression workflow: checks page metadata, self-canonicals, unique titles, noindex, sitemap completeness, robots rules, initial HTML, internal links and shared includes.
- Weekly/manual live audit: checks HTTP statuses, redirect hops, X-Robots-Tag, meta robots, canonicals, duplicate titles, H1/main content, sitemap, live internal links and a soft-404 probe.
- The live audit is separate from PR CI because the branch is not yet deployed. Run it manually after merge or let its weekly schedule run.

## Metadata hardening in this release

- Standardised author, Open Graph locale, image alternative text and image dimensions across all 118 indexable content pages.
- Added canonical `twitter:url`, `twitter:title`, `twitter:description` and `twitter:image` values so shared links have complete preview metadata.
- Kept the existing canonical host, crawlable HTML navigation, JSON-LD, sitemap and robots directives unchanged.
- Corrected the static duplicate-ID check so `data-*` attributes are not mistaken for HTML `id` attributes.
- Extended the SEO validator to fail if any public page loses required Open Graph or Twitter metadata.

## Limits

The live domain did not resolve from the audit environment while preparing this PR, so live HTTP results are not claimed. The new GitHub Action will run against the public site after merge. No source-code change can force Google to index pages or guarantee rankings.


## Follow-up: first live-audit workflow failure (10 November 2026)

The first manual run of the live audit (run ID 42856513736) failed before it completed page-level SEO checks. The job log showed the same parser exception for all 118 sitemap pages: `Cannot read properties of undefined (reading 'match')`. As a result, the run reported 0 unique titles and 0 internal link targets. This was an audit-script failure, not evidence that all 118 pages were broken.

The parser helper now normalizes optional/missing HTML fragments to an empty string before calling `match()`. Missing metadata is therefore reported as a specific SEO finding instead of aborting the page check. Unexpected exceptions now include a short stack location in the job log to make future diagnosis actionable.

The two SEO workflows now use:
- `actions/checkout@v7`
- `actions/setup-node@v7`
- Node.js 24
- `ubuntu-24.04` for a stable runner image
- `package-manager-cache: false`, since these audit jobs do not install packages or require a package cache

The deprecation warning in the original run concerned the Node 20 runtime bundled inside the v4 GitHub Actions; it was separate from the parser error. The runner-image migration notice was informational and not the cause of the failed job.

After this fix is merged, rerun **Actions → Live technical SEO audit**. The expected confirmation is that the audit reports all sitemap URLs as processed and counts page titles/internal link targets, with any real HTTP or SEO defects listed separately. A successful script run does not itself prove Google has indexed the pages.
