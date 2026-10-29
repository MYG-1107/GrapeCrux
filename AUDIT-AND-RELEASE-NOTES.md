# GrapeCrux Engineering & Website Audit — Package Notes

## Scope

This replacement package was prepared from the public repository structure and current homepage source. The existing repository had a single `index.html`, a dark purple-oriented stylesheet, a JavaScript loader for header/footer includes, a brand PNG, and a `CNAME` for `grapecrux.com`. This package keeps the custom-domain configuration and reworks the site into a clean-URL, directory-based static site.

## Main changes in this package

1. **Visual design:** brighter warm-white surfaces, forest-green typography, lime accent, editorial spacing, service cards and responsive layouts.
2. **Content:** clearer business-first positioning, eight detailed service categories and service-specific landing pages.
3. **Credibility:** no fake client logos, numbers, testimonials or claimed results. The portfolio examples are explicitly labelled illustrative concepts.
4. **Navigation:** common header/footer components, mobile navigation and clean internal paths.
5. **URLs:** directory-based routes, canonical clean URLs, legacy redirect pages and an `index.html` address-bar cleanup script.
6. **SEO:** per-page titles/descriptions, canonical tags, Open Graph metadata, Organization JSON-LD, robots file and sitemap.
7. **Chat:** local guided assistant for service selection and project enquiry guidance, plus an optional FastAPI backend scaffold for generative AI. The local guide remains the fallback when no API URL is configured.
8. **Contact:** validated project brief that prepares a `mailto:` message, with no silent server-side collection.
9. **Legal:** starter privacy/terms pages with review warnings because actual legal data practices and jurisdictional needs were not provided.
10. **QA support:** 404 page, deployment instructions and pre-launch checklist.

## QA matrix to run after uploading

| Area | Validation | Expected result |
|---|---|---|
| Root page | Open `/` and `/index.html` | Root content loads; visible `index.html` is removed by redirect script |
| Clean routes | Open every clean URL directly | Each directory route loads without `.html` |
| Legacy paths | Open `about.html`, `services.html`, `contact.html`, etc. | Redirects to the corresponding clean route |
| Navigation | Click all desktop/mobile menu links | Correct target; mobile menu can open/close by keyboard and pointer |
| Assets | Inspect images, CSS and JS requests | No missing local asset requests |
| Enquiry | Submit invalid/valid data | Browser validation works; valid submission prepares an email |
| Assistant | Try service, unknown, quote and contact questions | Answers relevant local FAQ or provides an honest fallback; never promises a quote/ranking |
| Responsive | Test 360px, 768px, 1024px and desktop | No horizontal overflow; controls remain usable |
| SEO | Inspect head metadata and sitemap | Unique title/description, canonical clean URLs and sitemap URLs align |
| Accessibility | Keyboard, visible focus, reduced motion, colour contrast | No obvious keyboard trap; motion can be reduced; follow up with a formal audit |
| Deployment | Test custom domain and GitHub Pages project URL | Correct path prefix and assets on both contexts |

## Known constraints / not yet verified

- This package has not been run through a live browser automation suite or Lighthouse in this environment.
- GitHub Pages hosting settings and DNS for `grapecrux.com` are not changed by creating this ZIP.
- GitHub Pages cannot do arbitrary server-side redirects. Directory-based routes provide clean URLs; legacy redirect pages are client-side/static fallbacks and should be tested after deployment.
- The enquiry form depends on the visitor's email application. It does not guarantee a message is delivered and does not record leads server-side.
- The chatbot is rule-based client-side guidance by default. An optional FastAPI generative-AI backend is included under `backend/` but has not been deployed or connected; use server-side secrets and configure its API URL/CORS before enabling it.
- Privacy and terms pages are templates and must be checked against actual practices and local requirements.
- The exact currently stored PNG brand artwork was not embedded into this build; this package contains a self-contained SVG wordmark treatment used by the site. If the current official PNG is mandatory, copy `grapecrux_brand_logo.png` from the existing repository into the final root and update the shared header/footer to use it after visual validation.

## Release recommendation

Publish to a backup branch first, verify the page source and links, then switch the published branch once the functional and content checks pass.
