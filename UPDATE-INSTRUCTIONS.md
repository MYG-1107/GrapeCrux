# Apply this GrapeCrux QA / SEO / Analytics update

This is an **overlay update**, not a replacement of the full repository.

1. Download and extract the ZIP.
2. Open the `GrapeCrux-QA-SEO-Analytics-Update` folder.
3. Copy its contents to the root of `MYG-1107/GrapeCrux`, replacing the two shared include files and `assets/js/config.js`, and adding the `.gitignore`, docs, and tests/scripts.
4. Keep the existing `grapecrux_brand_logo.png`, all existing page folders, `CNAME`, `.nojekyll`, sitemap, robots file, page content, assistant knowledge and backend files.
5. Remove the already-tracked Python bytecode file using the command in `SEO-AND-ANALYTICS-QA-REPORT.md`.
6. Commit and push to `main`.
7. After GitHub Pages deploys, verify the logo, then test GA4 Realtime/DebugView after allowing analytics consent.

## What changed

- `includes/header.html`: removes the white bordered tile around the transparent logo while retaining the wordmark and navigation.
- `includes/footer.html`: removes the white tile and uses a high-contrast wordmark on the dark footer.
- `assets/js/config.js`: adds consent-aware GA4 click and email-draft events without collecting applicant PII.
- `.gitignore`: prevents future Python bytecode and local secret files from being added.
- `GA4-SETUP-AND-EVENTS.md`: explains events and how to test them.
- `SEO-AND-ANALYTICS-QA-REPORT.md`: records findings and production checks.
- `scripts/validate_seo_analytics.py` and `tests/analytics-events-static.test.cjs`: local validation utilities.

The update does not claim that a mailto draft is an application received. A backend form is required for confirmed server-side submissions.
