# GrapeCrux — Brand, Content and UX Guidelines

This document records the visual and interaction system already used by the GrapeCrux website. It is a working reference for future page, campaign and component changes; it is not a request to redesign every page.

## Brand direction

GrapeCrux should feel like a focused creative-technology partner: clear, considered, capable and approachable. The visual identity should support trust and useful action rather than look decorative or overly futuristic.

Use the official GrapeCrux logo and wordmark assets in the repository. Do not recreate the mark with text, recolour it ad hoc, stretch it or place it on a busy background.

## Colour palette

The effective shared CSS tokens are:

| Role | Value | Use |
|---|---|---|
| Ink | `#163F36` | Primary headings, navigation and dark surfaces |
| Secondary ink | `#234F43` | Supporting brand text and links |
| Moss | `#3F632A` | Brand accent, links and focus indication |
| Lime | `#D9F36A` | Selective highlights and accent buttons |
| Paper | `#F7F8F5` | Main page background |
| White | `#FFFFFF` | Cards, forms and content surfaces |
| Body text | `#526158` | Paragraphs and secondary copy |
| Soft green | `#EDF3E8` | Tinted panels |
| Soft lime | `#F2F8DF` | Subtle callouts and icon backgrounds |
| Border | `#E1E7DF` | Card, form and section boundaries |

Keep the palette restrained. Lime is an accent, not a paragraph-text colour. Do not introduce extra colours for individual pages without a clear functional reason. Check text against its actual background; normal text should meet at least 4.5:1 contrast and large text at least 3:1.

## Typography

The shared stack prefers Inter and falls back to the operating system UI fonts: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Do not add a remote font dependency without a measured benefit.

The baseline body copy is 16px with a 1.65 line-height. Use the existing `clamp()` heading and lead styles so type scales between viewport sizes. Paragraphs should be comfortably readable; avoid long lines, dense all-caps copy and small low-contrast labels.

## Images and graphics

- Prefer the supplied logo, original SVG artwork and real product or project imagery that explains a service.
- Use original, relevant illustrations where photography would be generic or misleading.
- Do not use stock imagery that implies a client, completed project, team or facility that GrapeCrux does not actually have.
- Keep decorative graphics secondary to the page's message. Avoid unrelated gradients, excessive 3D effects and inconsistent illustration styles.
- Give meaningful images descriptive alt text. Use empty alt text only for purely decorative images that should be ignored by assistive technology.
- Optimise image dimensions and formats, declare width and height where practical, and avoid loading large decorative assets before the main content.

## Buttons and calls to action

Use the shared button classes instead of page-specific button styling:

- Primary: ink background with white text for the main action.
- Secondary: light surface and visible border for a supporting action.
- Accent: lime background with dark text, mainly on dark CTA panels.
- Text links: use for lower-emphasis navigation and related reading.

Buttons have a 50px minimum height in the shared design system. Keep labels action-oriented and specific, such as "Start a project", "Discuss this service" or "Assess your project". A page should make its next step obvious without presenting several equally prominent competing actions.

The main business journey is: understand the offer → review a relevant service or capability → assess a requirement or contact the team. Careers and editorial pages should use their own relevant next actions.

## Page layout and navigation

- Keep the main content within the shared 1,180px maximum-width container.
- Use the shared header and footer includes. Do not add one-off page navigation that competes with the shared navigation.
- Maintain one clear H1, a descriptive introduction, scannable H2/H3 sections and meaningful internal links.
- Use cards for related choices, not as a substitute for explaining the service.
- Keep service pages focused on the problem, likely deliverables, delivery considerations, questions and a relevant enquiry link.
- Label illustrative concepts as concepts. Do not imply that examples are completed client engagements unless they are verified case studies.
- Keep legal, confirmation and utility pages accessible, but out of the primary sales journey where appropriate.
- The XML sitemap is for crawlers; the `/sitemap/` page is the visitor-facing directory and groups the same published URLs by purpose.

## Content usefulness, grammar and length

Do not write to an arbitrary word count. A page is long enough when it answers the questions a visitor needs answered for that page's purpose.

For business/service pages, make it easy to understand:
1. What GrapeCrux offers.
2. Who the service is for and what problem it addresses.
3. What the work may include and what a client can expect.
4. How the engagement proceeds, including what remains subject to discovery.
5. What the visitor should do next.

For Careers pages, state the role, responsibilities, skills, application route and any conditions that applicants need before applying. For articles, define the topic, organise it with useful headings, explain practical implications and link to relevant next reading. Do not add repetitive paragraphs just to make a page longer.

Use plain, professional English. Prefer specific verbs and familiar words over inflated claims, jargon or vague promises. Keep spelling conventions consistent (for example, "enquiries" and "optimisation"). Proofread headings, button labels, form instructions, link names and mobile navigation—not just long paragraphs. Be accurate about delivery, pricing, timelines, client results, employment terms and third-party services.

## Responsive behaviour

The current layout uses fluid sizing and responsive CSS. Its main layout transitions include approximately 1,050px, 820px and 560px, with a few component-specific breakpoints. Test representative widths rather than assuming one mobile screenshot is sufficient:

- Desktop/laptop: 1,440px wide.
- Tablet: 768px wide.
- Mobile: 412px wide, plus a narrow 360px check when changing dense content.

Check menu behaviour, card stacking, forms, footer columns, floating chatbot placement, text wrapping and horizontal overflow at each width.

## Accessibility and interaction

Target WCAG 2.2 AA. Preserve semantic landmarks, a visible-on-focus skip link, a logical heading hierarchy, descriptive link and button labels, form labels and error states, meaningful image alternatives and keyboard-operable controls. Focus indicators must remain visible. Do not communicate meaning through colour alone.

The stylesheet includes focus-visible and reduced-motion support. Do not remove them. Check foreground/background contrast on the real rendered surface, including hover/focus states and tinted cards. Test keyboard-only navigation and mobile menu open/close behaviour.

## Search and measurement

Every public content page should have a unique title, useful meta description, self-referencing canonical, one meaningful H1 and crawlable links. Keep the XML sitemap and the human-readable sitemap aligned. Do not put legacy aliases or form-confirmation pages into the public XML sitemap.

The shared `assets/js/config.js` bootstraps GA4 measurement ID `G-QXMRMGJEP2` with Consent Mode defaults set to denied. Analytics events are gated on the visitor's analytics choice. The repository does not currently configure a Google Tag Manager container ID. Do not add a second GA4 installation in GTM while direct GA4 remains active.

## Release checks

Before merging a page or design change, run the repository's static validation and browser checks. The browser suite should cover desktop, tablet and mobile, verify the shared header/footer and the key user journeys, and run Axe on the main conversion pages. A clean automated scan is useful evidence, not a substitute for checking real content, keyboard use and assistive-technology behaviour.
