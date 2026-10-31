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
