# GrapeCrux Website — Redesigned Static Package

A bright, responsive corporate website package for GrapeCrux, with a European-inspired editorial design direction, clean URLs, service landing pages, SEO foundations, a guided service assistant and a project enquiry form.

## Included features

- Redesigned homepage, about, services, work/concept directions, insights, contact, privacy and terms pages.
- Eight detailed service pages: web and app development; AI and automation; product design and UX; brand strategy and visual identity; digital growth and SEO; cloud and DevOps; data and system integration; quality assurance and consulting.
- Directory-based pages (`/about/index.html`, `/services/index.html`, and so on) so visitors see clean URLs such as `/about/`, not `about.html`.
- Legacy redirect files for common old `.html` page URLs. `index.html` remains the required homepage file but the included script redirects a visible `/index.html` URL to the root directory.
- Shared header/footer rendered through reusable JavaScript components.
- Responsive navigation, accessible labels and focus states, reduced-motion support and mobile layouts.
- Per-page title, description, canonical URL, Open Graph metadata and Organization JSON-LD.
- `robots.txt`, `sitemap.xml`, `404.html`, and preserved `CNAME` (`grapecrux.com`).
- Client-side service assistant with service guidance, FAQs, fallback responses and links into the enquiry journey.
- Optional FastAPI backend under `backend/` for generative AI responses; the frontend safely falls back to its local guide until an API URL is configured.
- Project enquiry form with basic validation. It prepares an email in the visitor's email application; it does not send the form to a server or store data on the site.
- Concept mockups are labelled illustrative, not presented as completed client work.

## Technology and limitations

The website frontend is static HTML/CSS/JavaScript and is suitable for GitHub Pages. By default, the assistant is a local, rule-based service guide. An optional FastAPI backend is provided under `backend/` for generative AI responses; deploy it separately, configure a server-side `OPENAI_API_KEY`, and set `window.GRAPECRUX_CHAT_API_URL` in `assets/js/config.js`. The frontend uses the local guide as a fallback. Never put private API keys into browser JavaScript.

The form uses `mailto:` as a no-backend fallback. For production lead management, use a secure form endpoint or backend with input validation, spam protection, monitoring, privacy disclosures and a reliable delivery/retention policy.

## Deployment to `MYG-1107/GrapeCrux`

1. Download and unzip this package.
2. Back up or branch the current repository before replacing files.
3. Upload the **contents** of this extracted folder to the repository root (`main` branch), preserving the root `CNAME` file.
4. In GitHub, open **Settings → Pages** and ensure the published source points to the `main` branch and `/ (root)` if using branch-based deployment.
5. Confirm the custom domain is `grapecrux.com`. Do not change the existing DNS records unless you know they are incorrect.
6. After GitHub Pages publishes, test the site on the custom domain and the GitHub Pages project URL.
7. If publishing only on `https://myg-1107.github.io/GrapeCrux/`, the included script adjusts root links/assets for that project path. Canonical metadata intentionally points to the custom domain `https://grapecrux.com/`; update it only if the intended primary domain changes.
8. Submit `https://grapecrux.com/sitemap.xml` in Google Search Console after confirming the custom domain is verified and the URLs are accessible.

## URL behaviour

The preferred formats are `/`, `/about/`, `/services/`, `/services/ai-automation/`, `/work/`, `/insights/`, `/contact/`, `/privacy/`, and `/terms/`. Each clean page is a directory containing `index.html`. The `.html` suffix appears only on the actual static files within the repository, not the preferred browser URL.

GitHub Pages does not provide arbitrary server rewrite rules. Directory-based URLs are used for clean paths; small legacy redirect files are included for common old page URLs. After deployment, verify redirects and direct navigation manually.

## Pre-launch checklist

- [ ] Confirm business legal name, approved company description, contact email and any office address.
- [ ] Confirm all listed services reflect actual delivery capabilities.
- [ ] Replace illustrative concept cards with approved work or keep the concepts clearly labelled.
- [ ] Review privacy and terms pages with a qualified adviser; these are starter templates.
- [ ] Test every page and link on desktop and mobile.
- [ ] Test the email form using an email client; switch to a backend endpoint if you require guaranteed delivery or database records.
- [ ] Test local assistant responses and fallback paths. If generative AI is needed, deploy `backend/`, set secrets and CORS correctly, update `assets/js/config.js`, and test API failures/rate limits.
- [ ] Verify canonical URLs, sitemap, robots directives, structured data, and Search Console coverage.
- [ ] Run Lighthouse and browser console checks after deployment.

## Contact

Website contact shown in this package: `service@grapecrux.com`. Verify that this mailbox is monitored before production use.
