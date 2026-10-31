# GrapeCrux Website — Shared Layout & GA4 Update

This is a static GitHub Pages website for **GrapeCrux**, a creative initiative of **Infinite Resource Creators Private Limited**.

## Shared header and footer

The website now has a single source of truth for its shared navigation and footer:

- `includes/header.html` — edit this file to change the header/navigation across content pages.
- `includes/footer.html` — edit this file to change the footer across content pages.
- `assets/js/main.js` — fetches these fragments into each page's `#site-header` and `#site-footer` placeholders, then wires up active navigation and the mobile menu.

This is the correct pattern for a static GitHub Pages site: GitHub Pages does not process PHP/server-side includes. The fragments are fetched in the browser. Do not open pages by double-clicking them with `file://`; use a local HTTP server or the deployed site so browser `fetch()` can load the fragments.

### Local preview

From the repository root run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Google Analytics 4

The Google tag supplied for this site is **G-QXMRMGJEP2**. The exact gtag.js loader and configuration snippet has been placed once in the `<head>` of every complete HTML page (29 page documents), including the 404 and legacy redirect pages. The two files in `includes/` are HTML fragments, not standalone pages, and correctly do not carry their own tag. It is intentionally **not** placed in `includes/header.html`: that fragment is inserted inside `<body>`, while Google recommends installing the tag high in each page's `<head>`.

Do not add another copy of the same tag to `main.js`, the footer, or `includes/header.html`, or page views may be duplicated. If new HTML pages are added, copy the existing snippet into their `<head>` once.

To test measurement:

1. Deploy the updated files.
2. Open the site in a clean browser session and accept/reject any consent control if one is later implemented.
3. In GA4 open **Reports → Realtime** or **Admin → DebugView** and browse several pages.
4. Use Google's **Test installation** tool or Tag Assistant to confirm the `G-QXMRMGJEP2` tag is detected on the homepage and at least one nested page.

Note: this package adds the Google tag as requested. It does not implement a consent banner or Consent Mode. Review applicable privacy requirements for visitors in the EEA/UK and other relevant regions before using analytics; configure consent before measurement where required.

## Clean URLs and deployment

Content pages use directory index files, for example `/about/index.html` is served as `/about/`. Root `.html` pages remain as compatibility redirects. Keep `CNAME` and `.nojekyll` when deploying to the repository root.

GitHub Pages settings should publish from `main` and `/ (root)`. The repository contains a custom domain in `CNAME`.

## Important deployment note

Preserve the existing root file `grapecrux_brand_logo.png`. The shared header/footer reference that company logo file. This update package includes all site source and shared components; the logo file is retained from the existing repository rather than re-created.

## Files of interest

```text
includes/
  header.html              # shared header
  footer.html              # shared footer
assets/js/main.js          # include loader, nav, form and chat behaviour
404.html                   # uses shared layout too
sitemap.xml                # canonical public URLs
robots.txt
backend/                    # optional chatbot API (not required for GA4)
AUDIT-AND-RELEASE-NOTES.md # QA findings and deployment checks
```
