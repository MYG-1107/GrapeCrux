# GrapeCrux Website — Complete Redesign Package

This is a static GitHub Pages website for GrapeCrux, presented as a digital, creative and AI solutions brand operated under Infinite Resource Creators Private Limited.

## Included

- Brighter forest-green, lime and warm-white visual system inspired by restrained European corporate design.
- Homepage, About, Services, Industries & Use Cases, Work/Concepts, Insights, Contact, Privacy Notice and Terms.
- Eight individual service pages: Web & App Development, AI & Automation, Product Design & UX, Brand Strategy & Visual Identity, Digital Growth & SEO, Cloud & DevOps, Data & System Integration, and Quality Assurance & Consulting.
- Three standalone insight guides: Website Project Planning, AI Assistant Readiness, and Website Launch QA.
- Clean directory-based URLs and legacy `.html` redirect pages.
- Shared header/footer, mobile menu, local service assistant and optional FastAPI generative-AI backend.
- Per-page title, description, canonical, Open Graph data; sitemap, robots.txt, 404 page and CNAME.
- Project enquiry form with client-side validation, optional budget currency, and an honest `mailto:` workflow.
- QA validator and release notes.

## Official logo asset

The shared header, footer, chatbot avatar and favicon now use the original `grapecrux_brand_logo.png` from the repository instead of the stylised “G” symbol. The official PNG is loaded from the public GitHub raw URL, with the repository-root PNG as a first-party fallback.

**The PNG itself is not duplicated inside this ZIP.** It already exists at the root of the current repository, so keep it when uploading this package. If you deploy the extracted site in a different repository, keep/copy that PNG into the new repository root. Source URL: `https://raw.githubusercontent.com/MYG-1107/GrapeCrux/main/grapecrux_brand_logo.png`.

## Deploy on GitHub Pages

1. Extract the ZIP.
2. Back up the current repository or create a branch first.
3. Upload the extracted folder contents to the root of `MYG-1107/GrapeCrux`; do not upload the containing folder as an extra nested directory.
4. Keep `CNAME` set to `grapecrux.com` and preserve the original `grapecrux_brand_logo.png` repository asset.
5. Confirm **Settings → Pages** publishes from `main` and the repository root.
6. Test `https://grapecrux.com/`, all clean routes, legacy redirects, mobile navigation, the enquiry form and chatbot.
7. Submit `https://grapecrux.com/sitemap.xml` in Search Console after verifying the canonical URLs.

## Clean URL design

Use URLs such as `/about/`, `/services/`, `/industries/`, `/services/ai-automation/`, `/insights/website-project-planning/`, `/contact/`, `/privacy/` and `/terms/`. Page files are placed in route directories as `index.html`. The homepage file must remain named `index.html` for GitHub Pages, but `assets/js/main.js` removes the visible `/index.html` path when JavaScript runs.

GitHub Pages does not support arbitrary server-side rewrite rules. Directory routing provides clean URLs; legacy redirect files are static/client-side redirects, not HTTP 301 server redirects.

## Chatbot and form limitations

By default, the chatbot is a browser-based guided service assistant, not a generative model. The optional FastAPI backend in `backend/` can call an AI model after separate deployment, configuration of `OPENAI_API_KEY` on the server, CORS setup and setting `window.GRAPECRUX_CHAT_API_URL` in `assets/js/config.js`. Never place secrets in frontend JavaScript.

The contact form validates inputs and prepares an email in the visitor's email app. The site does not store or deliver form submissions server-side. For reliable lead tracking, configure a secure hosted form/backend service with validation, spam controls, retention rules and an updated privacy notice.

## Repository coverage

The current package has 20 clean, indexable route pages: Home; About; Services overview; eight service details; Industries & Use Cases; Work & Concepts; Insights overview; three standalone insight guides; Contact; Privacy Notice; and Terms. The package also includes 8 legacy `.html` redirect pages and a 404 page.

## Before production launch

- Verify the business legal name, approved company description, contact email and legal pages.
- Confirm the service catalogue reflects what the company can actually deliver.
- Replace concept mock-ups with approved work only when verified evidence is available.
- Run the included validator, then test all links and forms in a browser across desktop/mobile sizes.
- Run Lighthouse and inspect console/network errors. Static checks do not establish live hosting, performance or SEO rankings.
