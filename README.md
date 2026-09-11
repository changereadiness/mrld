# MRLD Website — Engineering README

## 1. Purpose

This repository contains the public website for **MRLD**, a Canadian industrial equipment company focused on connecting selected manufacturers with qualified buyers, supporting equipment sourcing, and coordinating project logistics.

The site is intentionally lightweight. It is built as a **static HTML/CSS/JavaScript website** with no framework, package manager, database, server-side rendering, build step, or application backend.

The current design is the **Stage 2** architecture. Its core product/design principle is restraint: each page should have one job, communicate only what is necessary, and avoid repeating the same commercial proposition across multiple pages.

For an engineer reviewing the site, the main priorities are:

1. preserve the current visual hierarchy and cross-page alignment;
2. preserve the minimal copy architecture;
3. keep the site fast and dependency-light;
4. avoid introducing frameworks unless there is a concrete functional need;
5. treat the current layout as largely frozen unless correcting a bug, accessibility issue, responsive issue, legal issue, or adding genuine business evidence such as signed manufacturers.

---

## 2. Current Technical Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Static hosting
- Custom domain configured through `CNAME`
- Contact form submitted through Formspree
- No npm / yarn / pnpm
- No bundler
- No templating engine
- No JavaScript framework
- No CSS framework
- No database
- No CMS

The custom domain currently configured in the repository is:

```text
mrldx.com
```

There is no repository-level hosting configuration beyond the static files and `CNAME`. The presence of `CNAME` is compatible with static hosts such as GitHub Pages, but the repository itself should not be assumed to depend on a specific hosting provider.

---

## 3. Repository Structure

```text
/
├── CNAME
├── README.md
├── index.html
├── bridge.html
├── card.html
├── connect.html
├── partner.html
│
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── interactions.css
│   │   ├── Profile_Ali_Said.jpg
│   │   └── images                 # legacy/suspicious 1-byte file; currently not a meaningful asset
│   │
│   ├── images/
│   │   ├── favicon.png
│   │   └── mrld-symbol-web.png
│   │
│   └── js/
│       └── site.js
│
└── pages/
    ├── equipment.html
    ├── project-logistics.html
    ├── industries.html
    ├── about.html
    ├── contact.html
    ├── privacy.html
    └── terms.html
```

### Important architectural note

The site uses a hybrid styling approach:

- `assets/css/style.css` contains the shared/base design system and substantial legacy/shared styles.
- `assets/css/interactions.css` contains shared Stage 1/Stage 2 motion and interaction behavior.
- Most Stage 2 pages also include **page-scoped inline `<style>` blocks** for their current presentation.
- Some pages contain small page-specific inline `<script>` blocks for interactions that are unique to that page.

This means visual behavior can come from three layers:

1. shared `style.css`;
2. shared `interactions.css`;
3. page-local CSS / JS.

Do not refactor one of these layers in isolation without checking all public pages.

---

## 4. Main Site Map

| Path | Public purpose | Current behavior |
|---|---|---|
| `/index.html` | Main homepage | Core MRLD proposition, manufacturers/buyers, selected equipment, selected brands, CTA |
| `/pages/equipment.html` | Equipment sourcing | Requirement-first sourcing philosophy and buyer/manufacturer entry points |
| `/pages/project-logistics.html` | Project logistics | Supplier-to-site coordination flow with interactive process steps |
| `/pages/industries.html` | Sectors | Visual sector recognition page; content title is **Sectors** |
| `/pages/about.html` | About / founder | Market position, founder story, selective-by-design principle |
| `/pages/contact.html` | Contact | Primary inquiry form and direct contact channels |
| `/pages/privacy.html` | Privacy Policy | Legal/privacy content |
| `/pages/terms.html` | Terms of Use | Legal/terms content |

### Auxiliary / direct-access pages

| Path | Purpose | Navigation status |
|---|---|---|
| `/card.html` | Digital card for Ali Saïd | Not linked in primary navigation |
| `/connect.html` | Lightweight connection/routing page | Not linked in primary navigation |
| `/partner.html` | Partner/company information behind a client-side convenience gate | Not linked in primary navigation |
| `/bridge.html` | Legacy/alternate MRLD landing-page concept | Not linked anywhere; candidate for removal after confirmation |

These direct-access pages should not be deleted casually because they may be used externally even though the main site does not link to them.

`bridge.html` is the exception: it appears to be an obsolete/legacy page and should be verified before removal.

---

## 5. Page-by-Page Functional Notes

### 5.1 Homepage — `index.html`

Primary job: explain MRLD quickly without overcommunicating.

Current structure:

1. Hero — `Connecting manufacturers with buyers.`
2. Manufacturer / Buyer split
3. Selected equipment
4. Selected equipment brands
5. Final CTA

Key functionality:

- Large MRLD symbol is used as a subtle hero background treatment.
- A central Manufacturers → MRLD → Buyers bridge motif is animated.
- Manufacturer and buyer content carries the commercial centre of gravity.
- Equipment categories are deliberately broad; MRLD should not be visually associated with a single product category.
- Current selected brand names are displayed as restrained typographic marks:
  - Caterpillar
  - MWM
  - Cummins
  - Waukesha

Commercial rule: do **not** add manufacturers merely because discussions are in progress. Public brand display should be reserved for equipment/brands MRLD can legitimately offer or relationships that are sufficiently established to publish.

---

### 5.2 Equipment — `pages/equipment.html`

Primary job: explain MRLD's sourcing philosophy without becoming a catalogue.

Hero:

```text
The wrong equipment may look right on paper.
```

Main concepts:

- requirement first;
- equipment should fit the application;
- MRLD does not begin with a predetermined catalogue;
- sourcing is organized around the requirement, operating context, fit, and source.

Key interactions:

- The requirement-flow visual uses three primary nodes:
  - Your Requirement
  - MRLD
  - Equipment
- On fine-pointer devices, hovering a node gives it visual priority while the others recede.
- Manufacturer and buyer closing panels cross-dim: hovering one intentionally mutes the opposite panel.
- Link hover treatment uses the site's copper accent.

Page-specific JS is inline near the bottom of the page.

---

### 5.3 Project Logistics — `pages/project-logistics.html`

Primary job: explain what happens between commercial agreement and physical delivery.

Hero:

```text
The deal can be done. The project isn’t.
```

Main interactive element:

A six-step Supplier → Site process.

- Desktop / fine pointer: detail is shown on hover/focus.
- Mobile / coarse pointer: steps are activated by tap.
- Only one step is emphasized at a time.
- Supporting copy is deliberately hidden until interaction to reduce visual density.

Important commercial boundary:

> MRLD coordinates the path. Specialized logistics providers execute transport and freight services.

That distinction should remain clear. The page should not imply MRLD is itself a freight carrier if that is not the operating model.

Page-specific JS is inline near the bottom of the page.

---

### 5.4 Sectors — `pages/industries.html`

Primary job: let visitors recognize their operating environment without another page of explanatory text.

Hero:

```text
The machine fits the job or it doesn’t.
```

Sectors shown:

- Construction
- Mining
- Energy
- Manufacturing
- Infrastructure
- Material Handling

The page is intentionally minimal:

1. hero;
2. 3×2 visual sector field;
3. CTA.

#### Naming note

The page's content/title uses **Sectors**, but the filename and current navigation/footer label still use **Industries**.

Current path:

```text
/pages/industries.html
```

If this is renamed later, preserve old links with an appropriate redirect where the hosting platform permits it.

#### Current external image dependency

The six sector images are currently loaded from `images.unsplash.com`.

This is the only meaningful passive external asset dependency still present in the main public site. If the site must become fully self-contained/offline-renderable, these six images should be downloaded, stored locally, and the URLs changed to relative local paths.

---

### 5.5 About — `pages/about.html`

Primary job: explain where MRLD sits and who is behind it.

The page intentionally breaks the visual rhythm of the product/service pages.

Current structure:

1. `Built between markets.` hero
2. Canada → Asia → International Markets axis
3. Founder & Director section
4. `Selective by design.` contained CTA

The founder section is the centre of gravity and incorporates MRLD's founding observation rather than adding another corporate explainer section.

Founder portrait asset:

```text
assets/css/Profile_Ali_Said.jpg
```

The location under `assets/css/` is unconventional. It works, but an engineer may reasonably move it to `assets/images/` during a deliberate asset cleanup, provided all references are updated.

The market-axis has a small travelling copper animation. At the time of this README, that animation does not have its own explicit page-local `prefers-reduced-motion` override; this is a worthwhile accessibility cleanup item.

---

### 5.6 Contact — `pages/contact.html`

Primary job: make it easy to start the right commercial conversation.

Hero:

```text
Bring us the requirement. Or the opportunity.
```

The page intentionally does **not** contain another process explainer or final CTA after the form.

#### Form

The form submits using `POST` to Formspree.

Required fields:

- Name
- Email
- Inquiry type
- Message

Optional fields:

- Company
- Phone
- Industry / sector

Inquiry types currently offered:

- Equipment requirement
- Manufacturer representation
- Project logistics
- Other opportunity

Sector values currently offered:

- Construction
- Mining
- Manufacturing
- Energy
- Infrastructure
- Material Handling
- Other

Message placeholder:

```text
What are you trying to accomplish?
```

Direct channels are also shown:

- Email: `contact@sayudi.com`
- LinkedIn: Ali Saïd / Sayudi profile URL

#### Form behavior

`assets/js/site.js` adds form engagement/submission classes but does not intercept or replace native Formspree submission.

Do not replace the endpoint or form field names casually; changes can affect Formspree routing and downstream email handling.

---

### 5.7 Privacy / Terms

Files:

```text
/pages/privacy.html
/pages/terms.html
```

These pages received visual normalization only during Stage 2. Their legal copy should be treated as content-controlled text.

Engineering changes should generally be limited to:

- layout;
- typography;
- accessibility;
- navigation/footer consistency;
- responsive behavior;
- visual bugs.

Do not materially rewrite legal wording as part of a UI refactor without a separate legal/content review.

---

## 6. Global Visual System

Defined primarily in:

```text
assets/css/style.css
```

Core CSS variables:

```css
--graphite: #202426;
--graphite-dark: #151819;
--background: #F2F1ED;
--white: #FAFAF8;
--copper: #B56A3C;
--steel: #687278;
--text: #41474A;
--border: #D8D7D2;
--container: 1280px;
```

Design language:

- warm off-white background;
- graphite primary surfaces/text;
- copper accent used sparingly;
- generous negative space;
- minimal borders;
- avoid decorative UI that does not communicate something;
- no excessive card grids;
- no generic corporate iconography unless it earns its place;
- restrained motion.

### Stage 2.5 global footer

The primary public site now uses the Stage 2.5 footer on:

- `index.html`;
- Equipment;
- Project Logistics;
- Sectors / `industries.html`;
- About;
- Contact;
- Privacy;
- Terms;
- Partner;
- legacy Bridge page.

The footer is intentionally architectural rather than explanatory. It contains:

- the MRLD symbol + wordmark;
- a subtle acronym expansion: `MARKET REACH · LEVERAGE · DEVELOPMENT`;
- three navigation groups: Explore, Company, Connect;
- Privacy / Terms and copyright in the utility row.

The old footer description and `Canadian company. Global reach.` line were intentionally removed. Canadian identity remains present elsewhere in site content and should not be reintroduced into the footer without a deliberate content decision.

The footer label uses **Sectors** even though the current primary navigation still uses **Industries** and the physical file remains `industries.html`. This is intentional during the transition period.

### Language control

The primary navbar now includes the visual language selector:

```text
EN / FR / ไทย
```

Current state:

- English is the active language;
- French and Thai controls are presentation placeholders only;
- their links currently use `href="#"` and cancel navigation;
- localized routing should be introduced only when the translated site structure is implemented.

Do not use flags or a globe icon for this control unless the design direction is explicitly revisited.

### Typography

The site no longer calls Google Fonts.

Current stacks:

```css
--heading-font: "Manrope", "Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
--body-font: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
```

Because `Manrope` and `Inter` are no longer downloaded by the site, they render only if already present on the visitor's system. Otherwise the declared fallbacks are used.

This removes external font requests but means typography can vary slightly by operating system. If exact cross-platform typography becomes a hard requirement, self-host properly licensed local webfont files and define them with `@font-face`.

Do not introduce font files without verifying licensing and deployment implications.

---

## 7. Hero Alignment Invariants

One of the deliberate Stage 2 refinements is cross-page hero consistency.

The internal product/service pages use the following standardized hero heading values:

```css
font-size: clamp(3.15rem, 6.1vw, 6.15rem);
line-height: 1;
letter-spacing: -.05em;
max-width: 980px;
margin: 0 0 1.65rem;
```

Equipment, Project Logistics, and Sectors additionally use a deliberately synchronized hero block height:

```css
height: clamp(31rem, 40vw, 35rem);
```

and on the mobile breakpoint:

```css
height: 35rem;
padding: 4.5rem 0 4.75rem;
```

These values are intentional. Tiny differences between pages were visually noticeable during review.

If changing one of these three heroes, test page-to-page navigation at the same viewport width before changing the others.

The oversized MRLD background symbol on Equipment, Project Logistics, and Sectors is also intended to remain visually locked in size and position across page transitions.

---

## 8. Shared Navigation Behavior

The shared navigation is controlled by CSS plus `assets/js/site.js`.

Key behaviors:

- mobile hamburger menu;
- hamburger morphs into an X;
- `aria-expanded` and button label update on open/close;
- Escape closes the menu;
- clicking outside closes the menu;
- selecting a nav link closes the menu;
- resizing into desktop closes mobile nav state;
- current page gets `aria-current="page"` based on normalized URL path;
- header becomes sticky and gains a translucent/blurred scrolled state.

Desktop navigation breakpoint is centered around `1050px` in the shared styles/JS.

The navigation currently labels the sectors page as **Industries** even though the page itself is now titled **Sectors**.

---

## 9. Shared JavaScript — `assets/js/site.js`

The shared script is dependency-free and runs inside an IIFE.

It adds the class:

```text
mrld-js
```

to the `<html>` element, allowing progressive enhancement styles to apply only when JS is available.

### Functions

#### `initNavigation()`

- sticky header state;
- active nav state;
- mobile navigation open/close;
- keyboard/outside-click handling.

#### `initScrollProgress()`

Creates a 2px copper progress bar at the top of the viewport.

Disabled on `card.html` via `body.card-page`.

#### `initRevealSystem()`

Adds scroll/entrance reveal classes to heroes, sections, and selected cards.

Uses `IntersectionObserver` where available.

Has a no-observer fallback.

Respects `prefers-reduced-motion`.

#### `initSurfaceResponse()`

On fine-pointer devices, selected surfaces receive pointer-position-aware radial highlighting and small hover elevation.

Disabled when reduced motion is requested.

#### `initForms()`

Adds state classes to form controls and submitting buttons. It does not perform AJAX submission.

#### `initCardEntry()`

Applies entry motion to `card.html`.

#### `initHomeBridge()`

Controls the homepage bridge sequence:

- manufacturer node;
- first arrow;
- MRLD node;
- second arrow;
- buyer node.

It also adds subtle perspective response on fine-pointer devices.

Reduced-motion preference disables this animation.

---

## 10. Page-Specific JavaScript

### Equipment

Inline JavaScript handles:

- cross-dimming of manufacturer/buyer panels;
- hover focus of requirement / MRLD / equipment nodes.

The flow focus interaction only runs on devices matching:

```text
(hover: hover) and (pointer: fine)
```

### Project Logistics

Inline JavaScript handles:

- six interactive delivery steps;
- dynamic title/copy in the detail area;
- hover/focus behavior on desktop;
- tap-to-select/tap-to-clear behavior on touch/mobile.

### Partner page

`partner.html` contains a hardcoded client-side access code.

This is explicitly a **convenience gate, not authentication**.

Anyone with source access can discover the code. Do not use this mechanism for confidential, regulated, privileged, or commercially sensitive material.

If genuine access control is needed, move the page behind server-side authentication or an access-controlled service.

---

## 11. Motion & Reduced Motion

Shared motion is defined in:

```text
assets/css/interactions.css
```

and coordinated by `site.js`.

The site uses:

- entrance reveals;
- hover elevation;
- pointer-responsive glow;
- scroll progress;
- hero/bridge motion;
- page-specific interaction effects.

The shared interaction system respects:

```css
@media (prefers-reduced-motion: reduce)
```

and JavaScript checks:

```js
window.matchMedia("(prefers-reduced-motion: reduce)")
```

Known accessibility cleanup item: verify every page-local animation, especially the About market-axis animation, also respects reduced-motion preferences.

---

## 12. Logo / Brand Asset Behavior

Main local image assets:

```text
assets/images/favicon.png
assets/images/mrld-symbol-web.png
```

### Logo implementation is currently mixed

- Homepage uses the local PNG file.
- Several internal pages embed the approved MRLD SVG directly as a `data:image/svg+xml;base64,...` URI.

This mixed strategy was adopted to avoid path/cache/rendering problems encountered during iteration.

For maintenance, a future engineer may rationalize this to a single local SVG asset, but only after testing all deployment paths and caching behavior.

Avoid replacing the approved symbol with older rendered variants. Earlier logo files existed with visibly incorrect rendering and should not be reintroduced.

---

## 13. External Network Dependencies

### Passive page-load dependencies

At the time of this README, the six Sectors photography URLs still load from Unsplash:

```text
https://images.unsplash.com/...
```

These should be localized to achieve a truly self-contained site.

There are no Google Fonts requests in the current build.

### User-triggered external destinations/services

- Formspree — contact form submission
- LinkedIn — outbound profile link
- `mrldx.com` — used by some direct-access pages
- `mailto:` email links

These are intentional and should not be confused with passive asset requests.

---

## 14. Self-Contained / Offline Goal

The intended end-state is:

- all CSS local;
- all JS local;
- all logos local/embedded;
- all photography local;
- no remote fonts;
- no third-party runtime library/CDN dependencies;
- external requests occur only when the user intentionally submits a form or follows an outbound link.

Remaining blocker to full passive self-containment:

- localize the six Sectors images.

---

## 15. Forms, Data & Privacy

The website itself has no database and does not persist user-submitted form data locally.

The Contact form sends information to Formspree.

Any change to form processing should be reviewed against:

- the Privacy Policy;
- data minimization expectations;
- the destination inbox/workflow;
- spam protection requirements;
- cross-border data handling implications where relevant.

The JavaScript interaction layer does not currently implement analytics, hidden profiling, tracking pixels, advertising scripts, or session recording.

If analytics are added later, update privacy disclosures accordingly.

---

## 16. SEO / Metadata

Main public pages include:

- UTF-8 charset;
- responsive viewport meta;
- page-specific `<title>`;
- page-specific meta description;
- favicon.

Currently absent or not systematically implemented:

- canonical URLs;
- Open Graph metadata;
- Twitter/X card metadata;
- JSON-LD structured data;
- sitemap in this repository;
- robots.txt in this repository.

These are reasonable future SEO improvements, but should not trigger a visual redesign.

---

## 17. Accessibility Notes

Existing positive behavior:

- semantic headings are used;
- navigation toggle has ARIA controls/expanded state;
- current nav page gets `aria-current`;
- decorative logos generally use empty alt text / `aria-hidden`;
- Project Logistics hover interactions also respond to keyboard focus;
- reduced-motion support exists in the shared interaction system;
- forms use explicit labels and native required validation;
- buttons/links remain native controls rather than click handlers on generic `<div>` elements in core flows.

Recommended engineering review:

1. keyboard test all interactive elements;
2. verify visible focus styles across all pages;
3. audit color contrast, especially muted gray text and copper-on-light backgrounds;
4. ensure About's travelling market-axis motion honors reduced motion;
5. run automated accessibility testing (axe/Lighthouse) plus manual keyboard testing;
6. verify form errors are understandable with native browser validation and screen readers.

---

## 18. Responsive Behavior

The website uses responsive CSS across shared and page-local styles.

There is no single universal breakpoint. Common breakpoints include:

- 1050px — desktop navigation and some wide layouts;
- 980px / 900px / 800px — page/layout transitions;
- 760px / 700px / 600px / 480px — mobile refinements.

Because several Stage 2 pages contain page-local CSS, an engineer should test at minimum:

```text
375px
390px
430px
768px
1024px
1280px
1440px+
```

Also test Safari/iOS and Safari/macOS because the site has been reviewed heavily in that environment.

---

## 19. Visual Consistency Rules

These are intentional product requirements, not incidental pixel preferences.

### Internal hero consistency

- Hero eyebrows on equivalent internal pages should start at exactly the same horizontal/vertical position.
- Hero heading type scale should be identical on equivalent internal pages.
- Equipment, Project Logistics, and Sectors should transition with no visible hero-height jump.
- Their oversized background MRLD symbol should not visibly change size or position when navigating between them.

### CTA consistency

Contained closing CTAs use the dark/graphite box treatment where needed to prevent visual bleeding into the footer.

### Interaction style

Motion should communicate:

- connection;
- flow;
- emphasis;
- state;
- process.

Do not add animation merely for decoration.

Avoid:

- floating ornamental shapes;
- excessive counters;
- dramatic route/page transitions;
- perpetual high-attention motion;
- generic "tech" effects.

---

## 20. Content / Commercial Integrity Rules

These rules matter when maintaining the website.

### Manufacturer / brand display

Do not publish a manufacturer's logo/name as a commercial relationship merely because MRLD is in discussion with them.

Public display should reflect a real, defensible commercial basis.

### No implied exclusivity

Do not imply:

- exclusive territory rights;
- distributorship;
- exclusive representation;
- formal channel status;

unless such a relationship actually exists and has been approved for public communication.

MRLD's present website language is intentionally framed around:

- market representation;
- equipment sourcing;
- qualified buyer access;
- commercial connection;
- project coordination.

### Product-category neutrality

MRLD should not visually become synonymous with power generation or any single equipment category. The company positioning is broader: industrial equipment.

### Evidence over promises

Future website growth should primarily come from real evidence:

- signed manufacturers;
- real product access;
- real logistics/project relationships;
- credible new market activity.

Avoid adding speculative "coming soon" sections or explanatory claims simply to make the site appear larger.

---

## 21. Known Engineering Cleanup Opportunities

These items are not necessarily visible defects. They are good candidates for a controlled technical cleanup after the visual version is locked.

### A. Localize Sectors images

Highest-priority dependency cleanup.

### B. Rename Industries → Sectors consistently

Current state:

- page title/content: Sectors;
- filename: `industries.html`;
- primary navigation: Industries;
- Stage 2.5 footer: Sectors.

If changed, preserve compatibility for existing indexed/shared URLs.

### C. Consolidate repeated inline SVG logo data

Several pages carry the same base64 SVG data. A single local SVG would reduce duplication if deployment testing proves reliable.

### D. Move founder portrait

`assets/css/Profile_Ali_Said.jpg` should logically live under `assets/images/`.

### E. Remove or confirm `assets/css/images`

This is currently a 1-byte file and appears to be an artifact.

### F. Audit legacy CSS

`style.css` and `interactions.css` still contain selectors from earlier site stages and pages.

Do not blindly delete them: first map selectors to `bridge.html`, `card.html`, `connect.html`, `partner.html`, and current pages.

### G. Confirm `bridge.html`

No current page links to it. Verify whether it is intentionally retained before deleting.

### H. Normalize page-local styling long-term

The current inline styles make fast visual iteration easy but create duplication.

A later engineering cleanup could extract stable Stage 2 page patterns into shared CSS components **after** the final visual baseline is accepted.

Do not perform this extraction during a content/design revision; it makes regressions harder to isolate.

### I. Reduced-motion audit

Verify every page-local keyframe animation, especially About.

### J. Add automated checks

There is currently no test/lint/build system.

Useful low-overhead additions could include:

- HTML validation;
- link checker;
- ESLint only if JS grows materially;
- Lighthouse CI or equivalent;
- accessibility smoke tests;
- screenshot-based visual regression tests for hero alignment.

Avoid introducing a large Node toolchain unless maintenance complexity justifies it.

---

## 22. Current Validation Performed

For this repository snapshot:

- local HTML asset/link references were checked programmatically;
- no missing local referenced files were found;
- shared JavaScript syntax was checked with Node;
- inline JS on Equipment, Project Logistics, and Partner was syntax-checked;
- page titles and meta descriptions are present on the main public pages.

This is not a replacement for browser/device QA.

---

## 23. Recommended Engineer Review Checklist

### Functional

- [ ] Home navigation works desktop/mobile
- [ ] Hamburger opens/closes correctly
- [ ] Escape closes mobile navigation
- [ ] Active nav state is correct
- [ ] Scroll progress behaves correctly
- [ ] Homepage bridge animation behaves correctly
- [ ] Equipment hover emphasis works on desktop
- [ ] Equipment remains usable on touch devices
- [ ] Project Logistics hover/focus behavior works on desktop
- [ ] Project Logistics tap behavior works on mobile
- [ ] Sectors image grid loads and crops correctly
- [ ] About market-axis animation behaves correctly
- [ ] Contact form submits successfully through Formspree
- [ ] Native required-field validation works
- [ ] Direct email and LinkedIn links work
- [ ] Privacy and Terms links work
- [ ] Direct-access `card.html`, `connect.html`, and `partner.html` still function

### Visual

- [ ] Equipment / Project Logistics / Sectors hero heights are pixel-consistent
- [ ] Oversized logo does not jump between those three pages
- [ ] Hero eyebrow positions align on equivalent pages
- [ ] Hero heading type scale is consistent desktop/mobile
- [ ] About and Contact hero baselines visually match the intended internal-page system
- [ ] About closing CTA is contained in the dark box treatment
- [ ] Footer transition is clean on every page
- [ ] Mobile spacing does not create accidental blank regions
- [ ] No horizontal overflow at 320px+

### Accessibility

- [ ] Keyboard-only navigation
- [ ] Visible focus states
- [ ] Reduced-motion behavior
- [ ] Contrast audit
- [ ] Form label/error audit
- [ ] Screen reader sanity test for navigation and interactive process steps

### Network

- [ ] No Google Fonts requests
- [ ] Localize six Sectors images if true self-containment is required
- [ ] Confirm only intentional outbound requests remain

### Deployment

- [ ] Verify `CNAME` remains correct
- [ ] Test clean-cache deployment
- [ ] Test hard refresh
- [ ] Test relative paths from `/` and `/pages/`
- [ ] Confirm HTTP → HTTPS and canonical host behavior at the hosting layer

---

## 24. Deployment

Because the site is static, deployment is simply the repository contents served from the web root.

There is no compile/build command.

A minimal local test can use any static HTTP server, for example:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Prefer serving over HTTP locally rather than opening `file://` URLs when testing navigation, form behavior, or browser security/network differences.

Do not deploy `__MACOSX`, editor swap files, OS metadata, temporary screenshots, or build-review archives.

---

## 25. Change Philosophy

The Stage 2 site was intentionally reduced rather than expanded.

The design principle is:

> Confidence through restraint.

Before adding a section, ask:

1. Does this page already communicate the idea somewhere else?
2. Is the new content evidence, or merely explanation?
3. Does the visitor need this information to make a decision?
4. Is a visual/interaction doing useful communication or only decoration?
5. Would removing this make the page stronger?

The website should now evolve with the business rather than trying to anticipate it.

Major future content changes should be driven primarily by real developments such as signed manufacturers, validated equipment availability, and meaningful commercial partnerships.

---

## 26. Handoff Summary

For a software engineer taking over the site:

- This is a small, dependency-light static website.
- The current visual baseline is considered mature and close to frozen.
- Do not begin with a framework migration.
- First inspect responsive consistency, accessibility, external network calls, and dead/legacy CSS.
- Preserve the exact visual alignment of equivalent hero sections.
- Preserve the current low-copy architecture.
- Treat `partner.html` access as cosmetic/client-side only.
- Treat Sectors imagery as the remaining passive remote dependency.
- Treat `industries.html` → Sectors naming as a future URL/navigation cleanup task.
- Use real business evidence, not speculative content, as the reason to expand the site.

---

## 27. Contact / Ownership

Public site contact currently routes through:

```text
contact@sayudi.com
```

The About page identifies **Ali Saïd** as Founder & Director.

For technical maintenance, deployment credentials, DNS, Formspree ownership, and hosting access should be documented separately from this public repository if they contain secrets or account credentials.

**Never commit passwords, API keys, DNS credentials, inbox credentials, or private commercial documents to this repository.**
