# GrapeCrux — Current Repository QA, SEO & Analytics Review

**Review date:** 1 November 2026  
**Repository:** https://github.com/MYG-1107/GrapeCrux  
**Production domain:** https://grapecrux.com/

## Scope and limitations

The current public GitHub `main` tree was inspected. The live-domain browser reader returned a DisabledError in this session, and a direct network clone was not available. Therefore, production HTTP responses, rendered screenshots, actual form completion, chatbot backend availability and live Tag Assistant events could not be independently exercised here. Findings below distinguish repository-source checks from live tests that remain necessary.

## Repository structure checks

| Check | Repository result |
|---|---:|
| Files in current tree | 82 |
| HTML documents (includes, redirects and 404 included) | 58 |
| Clean directory page documents | 47 |
| Blog article pages | 22 |
| Service detail pages | 13 |
| Sitemap entries | 47 |
| Duplicate sitemap URLs | 0 |
| Sitemap entries without a matching page file | 0 |
| Shared header/footer include files | Present |
| `robots.txt` and `CNAME` | Present |

The sitemap URLs all map to a matching clean page file in the repository. The robots file points to `https://grapecrux.com/sitemap.xml` and allows normal public crawling while disallowing the backend and test folders.

## Client-facing review

The website communicates GrapeCrux as a creative initiative of Infinite Resource Creators Private Limited. Its content covers a broad software and digital-services portfolio, including web/app development, AI automation, product design, branding, digital growth, cloud/DevOps, data integration, quality assurance, CRM/ERP, product engineering, testing and managed support.

The Work section labels examples as illustrative concepts rather than completed client projects. That distinction should remain until verified case studies and written client permissions are available. The site does not need invented testimonials, logos, awards or certifications to appear credible; it needs genuine project evidence as the company builds it.

## Functional observations from source

### Shared header and footer

The header and footer are loaded from `includes/header.html` and `includes/footer.html`, and all page documents use the common placeholders and main script. The current logo is placed inside a white bordered rounded wrapper in both includes. This conflicts with the requested transparent mark-only presentation. This release removes the wrapper styling and places the transparent PNG directly in the shared lockup.

### Contact and Careers forms

The project enquiry handler prepares a `mailto:service@grapecrux.com` email. The Careers handler prepares a `mailto:yaswanth@grapecrux.com` draft and instructs the applicant to attach a CV and press Send. These are email-draft workflows: the static site cannot confirm that the visitor sent the email or that the company received it. Do not label a draft-open event as a completed enquiry or application.

### Chatbot

The current frontend uses `assets/js/assistant-knowledge.js` for curated deterministic answers and can optionally call a hosted backend if configured in `assets/js/config.js`. The knowledge tests cover company details, services, careers, jobs, blogs, technical topics, testimonials, work, contact and unknown questions. The backend setting is blank in the repository; confirm whether the live assistant is using local FAQ mode or a separately deployed backend before advertising it as generative AI.

### Google Analytics

Page source shows GA4 property `G-QXMRMGJEP2`, `send_page_view: false`, and a consent banner that sends `page_view` after analytics consent is granted. The code sets consent defaults to denied before configuration and updates consent based on the visitor's choice. This is a deliberate privacy choice; visits from users who reject optional analytics will not be represented as ordinary cookie-based Analytics sessions.

The supplied Analytics screenshot shows 7 active users, 77 views, 201 events and 0 key events for the displayed reporting period. A zero key-event figure does not mean the tag is broken. It means no event is currently recorded as a key event for that report/time window, or no qualifying event was observed. The current source did not have specific custom events for business enquiry and recruitment intent. This release adds consent-aware click and email-draft events.

## SEO review and recommendations

### Current positives

- 47 clean directory page documents are represented by 47 sitemap entries.
- The sitemap contains no duplicates and each entry maps to a repository page file.
- `robots.txt` references the sitemap and does not broadly block public pages.
- Sampled homepage, About, Services, Careers, Contact, Work and Blogs pages include a page-specific title, meta description and canonical URL.
- Sampled page JSON-LD parses as valid JSON.
- Legacy `.html` routes exist as compatibility pages, while canonical site navigation uses clean routes.

### Remaining SEO work

1. After deployment, verify every sitemap URL returns HTTP 200 and is indexable in Google Search Console. A repository file existing does not prove the production URL is live.
2. Inspect the canonical chosen by Google for homepage, Careers, Services, About and a blog detail page.
3. Ensure Organization/WebSite markup accurately identifies GrapeCrux as a creative initiative of Infinite Resource Creators Private Limited. Do not invent social profiles or use the brand as a separate legal company.
4. Maintain unique titles, descriptions, a clear primary H1, internal links and helpful article content on each page. Avoid keyword stuffing or duplicate near-identical pages.
5. Keep only preferred canonical URLs in the sitemap. The existing 47-entry sitemap maps to 47 repository page files, but Google Search Console should be used to confirm the deployed canonical status.
6. The current Careers page describes roles in a CollectionPage/ItemList. If the company wants Google for Jobs eligibility, each real vacancy needs its own public job detail page and valid `JobPosting` structured data, with accurate dates, employment type and location/work arrangement. Do not fabricate dates or postings for roles that are not actively open.
7. The similar-name autocorrection seen in the user's Google screenshot is not by itself proof of a website technical penalty or indexing failure. Google generates title links and snippets automatically and can recrawl/reprocess changes over time. Strengthen consistent brand references, company profile information and genuine external citations; then inspect the exact query in Search Console.
8. `meta name="keywords"` is not a substitute for helpful content or technical SEO and should not be treated as a Google ranking lever.

## Tracked build artefact

The current repository tree contains `backend/__pycache__/main.cpython-313.pyc`. This is a generated Python bytecode file and should not be committed. This overlay adds `.gitignore` entries for `__pycache__/` and `*.py[cod]`; because the bytecode is already tracked, remove it once from Git with:

```bash
git rm backend/__pycache__/main.cpython-313.pyc
git commit -m "Remove generated Python bytecode"
```

## Release validation required after deployment

- Test 360px, 390px, 768px, 1024px and 1440px widths.
- Confirm shared logo has no white tile in both header and footer.
- Confirm mobile nav open/close and focus behavior.
- Test one project email draft and one Careers email draft; confirm the correct recipient and attach a test CV manually.
- Test chatbot local FAQ and hosted backend mode separately if the API is configured.
- Accept analytics consent and verify page_view plus custom events in Realtime/DebugView.
- Reject consent and verify custom events are not emitted.
- Check Search Console sitemap processing, URL Inspection, indexing reasons and canonical selection.
- Run the existing repository tests and the added analytics static test.

## Release decision

The repository's route/sitemap mapping is consistent and the source contains a valid shared include architecture. This overlay addresses the logo tile and adds useful GA4 intent measurement. It does not certify live rendering, mail delivery, real application receipt, live chatbot backend behavior, Core Web Vitals or Google indexing. Complete the deployment checks before declaring production QA closed.
