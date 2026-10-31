# GrapeCrux — GA4 & Shared Header/Footer Release Notes

## Changes made

1. Added `includes/header.html` and `includes/footer.html` as single-source shared fragments.
2. Refactored `assets/js/main.js` to load the fragments into `#site-header` and `#site-footer` on the content pages, including the 404 page.
3. Moved all header/footer markup out of JavaScript string templates. Header/footer text, links and layout are now edited in the two include files.
4. Preserved responsive navigation and added active navigation state after the header include loads.
5. Added the supplied GA4 Google tag `G-QXMRMGJEP2` to the `<head>` of all 29 complete HTML page documents exactly once per page.
6. Updated `404.html` to use the shared header/footer and the existing site design.
7. Preserved existing service pages, content pages, clean URL directory structure, SEO metadata, sitemap, robots rules, CNAME and chatbot code.

## Google tag placement

The tag is in each HTML `<head>` because `includes/header.html` is fetched and inserted inside the page `<body>`. Placing the gtag snippet in the body-level header include would not follow Google's recommended installation placement. All future HTML pages must carry the snippet once in their own `<head>`.

## Layout include loading

The header/footer fragments are fetched at runtime from `/includes/header.html` and `/includes/footer.html`. `main.js` adds `/GrapeCrux` to asset and link paths only when hosted on `myg-1107.github.io`; custom-domain paths remain root-based.

Legacy root `.html` documents are redirect stubs; they redirect visitors to canonical directory URLs and do not display a content layout. The canonical destination pages all use the shared header/footer.

## Static QA performed

- Verified all 29 complete HTML page documents (including 404 and legacy redirects) include `G-QXMRMGJEP2` exactly once. Shared fragments in `includes/` are not standalone pages and do not carry a separate tag.
- Verified canonical content pages include both `#site-header` and `#site-footer` placeholders.
- Verified 404 page uses the shared header/footer loader.
- Verified shared fragments exist at `includes/header.html` and `includes/footer.html`.
- Verified no duplicate hard-coded header/footer template remains in `main.js`.
- Verified the main JavaScript parses with Node.js syntax checker.
- Verified all root navigation hrefs in shared fragments are compatible with custom domain and GitHub Pages project path rebasing.

## Tests still required after deployment

- Use Tag Assistant / GA4 Realtime to confirm the measurement ID receives page views on `/`, `/about/`, `/services/`, and at least one nested service URL.
- Verify network requests for `/includes/header.html` and `/includes/footer.html` return HTTP 200.
- Test desktop and mobile navigation and current-page highlighting.
- Confirm the `grapecrux_brand_logo.png` asset is preserved in the repository root and loads from both the custom domain and GitHub Pages fallback.
- Review privacy disclosure and consent requirements. Consent Mode is not configured by this package.

## Limitation

The live site could not be independently fetched through the available browser inspection service during this run. The audit and changes were based on the current `main` branch source tree and its actual HTML/JS/CSS files. Static checks do not prove the deployed site or real-time analytics stream is working; the post-deployment checks above are necessary.
