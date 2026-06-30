# Codex components

> **Source**: `src/lib/editorial-pages.ts`, `src/lib/seo.ts`, `src/layouts/BaseLayout.astro`, `src/styles/codex.css`.
> **Convention**: every component class starts with `.codex-`. See [conventions.md](./conventions.md).
> **Audit baseline**: 60+ components total; this doc covers the top 20 by usage / business value.

Each entry follows the same structure:
1. **Purpose** — what the component is for
2. **Where it renders** — the source location
3. **Variants** — modifier classes / data-attributes
4. **States** — interactive states and how they're triggered
5. **A11y notes** — ARIA, keyboard, screen reader, contrast
6. **HTML skeleton** — minimum markup to invoke the component
7. **Don't** — anti-patterns

---

## Index

| # | Component | Where | Used on |
|---|---|---|---|
| 1 | [Sticky CTA bar](#1-sticky-cta-bar) | `BaseLayout.astro` | every page |
| 2 | [Hero CTA](#2-hero-cta) | `editorial-pages.ts renderEditorial()` | editorial pages |
| 3 | [Editorial action bar](#3-editorial-action-bar) | `editorial-pages.ts renderActionBar()` | editorial pages |
| 4 | [Editorial section](#4-editorial-section) | `editorial-pages.ts renderSection()` | editorial pages |
| 5 | [Sources block + inline citations](#5-sources-block--inline-citations) | `editorial-pages.ts renderSources()` | editorial pages |
| 6 | [Brief details](#6-brief-details) | `editorial-pages.ts renderBrief()` | editorial pages |
| 7 | [Compare table](#7-compare-table) | `editorial-pages.ts renderTable()` | compare pages |
| 8 | [RFQ form](#8-rfq-form) | `editorial-pages.ts renderInlineRfqForm()` + `seo.ts enhancePrimaryContactPage()` | editorial pages + `/contact/` |
| 9 | [Catalog rail](#9-catalog-rail) | `editorial-pages.ts renderCatalogRail()` | hub pages |
| 10 | [Hub card](#10-hub-card) | `editorial-pages.ts renderIndustriesHub() / renderSolutionsHub()` | industry + solution hubs |
| 11 | [Trust strip](#11-trust-strip) | `editorial-pages.ts renderTrustSignals()` | editorial pages |
| 12 | [Decision snapshot](#12-decision-snapshot) | `editorial-pages.ts renderDecisionSnapshot()` | product editorial pages |
| 13 | [Mega-menu](#13-mega-menu) | `render-snapshot.ts injectCustomNav()` | every page (header) |
| 14 | [Footer](#14-footer) | `seo.ts rewriteFooterInquirySection()` + Kadence baseline | every page |
| 15 | [Editorial channel cards](#15-editorial-channel-cards) | `editorial-pages.ts renderContactChannels()` | `/contact/` |
| 16 | [Conversion shell](#16-conversion-shell) | `seo.ts injectConversionBlocks()` | snapshot pages |
| 17 | [Resource grid](#17-resource-grid) | `editorial-pages.ts renderResourceGrid()` | editorial pages |
| 18 | [Jump nav](#18-jump-nav) | `editorial-pages.ts renderJumpNav()` | editorial pages |
| 19 | [Breadcrumb trail](#19-breadcrumb-trail) | `editorial-pages.ts renderTrail()` | editorial + product pages |
| 20 | [Social/footer-bottom row](#20-social--footer-bottom-row) | `seo.ts` (Kadence baseline) | every page (footer) |

---

## 1. Sticky CTA bar

### Purpose
Highest-commitment of the three-tier CTA ladder (DS-10 #1). Sits fixed at the bottom of the viewport, hidden by default until the user scrolls past in-page conversion anchors. Asks for the most-committed action: "Talk to engineering".

### Where
`src/layouts/BaseLayout.astro` lines 110–115; behavior in `<script>` lines 280–340; styling in `codex.css` `.codex-sticky-cta` block.

### Variants
None visual. Behavior driven by `data-cta-tier="sticky"`.

### States
| State | Trigger | Visual |
|---|---|---|
| Hidden (default) | Page load before 3s timer | `display: none` (no `.is-visible`) |
| Visible | 3s elapsed AND no conversion anchor in viewport | `.is-visible` class added |
| Re-hidden | Hero / action-bar / inline-rfq scrolled into view | `.is-visible` removed |
| Permanently dismissed | User clicks the dismiss `×` | flag persists for the page session only |

### A11y
- `role="complementary"` `aria-label="Talk to engineering"` on the wrap
- Dismiss button: `aria-label="Dismiss"`, 44×44 hit target via `min-width/height`
- High contrast: gold border-top (`--codex-gold` 4:1), pure white text on rgba(41,28,14,0.96) backdrop-filter blur

### HTML skeleton
```html
<div class="codex-sticky-cta" role="complementary" aria-label="Talk to engineering">
  <span>Hit a spec wall? Talk it through with our engineers.</span>
  <a class="codex-sticky-cta__btn" data-cta-tier="sticky"
     href="/contact/?intent=engineering">Talk to engineering</a>
  <button class="codex-sticky-cta__dismiss" aria-label="Dismiss"
          type="button">&times;</button>
</div>
```

### Don't
- Don't render multiple sticky bars per page; the `IntersectionObserver`/Set-based tracker assumes uniqueness.
- Don't reuse the class for "promo" banners; this slot is reserved for the high-tier conversion CTA.

---

## 2. Hero CTA

### Purpose
Lowest-commitment ask of the three-tier CTA ladder. Asks for product samples (a non-financial commitment) so the buyer can evaluate at the lowest friction. Always paired with a ghost "Browse all SKUs" secondary.

### Where
`editorial-pages.ts renderEditorial()` line 1663; styling `codex.css` `.codex-hero-cta` block.

### Variants
- `.codex-hero-cta-btn` — primary (gold filled)
- `.codex-hero-cta-btn--ghost` — secondary (transparent + border)

### States
| State | Trigger | Visual |
|---|---|---|
| Default | — | Gold fill (primary) / transparent (ghost) |
| Hover | mouse over | `transform: translateY(-2px)` + boosted box-shadow |
| Focus | keyboard | `:focus-visible` ring per `--codex-ring` |
| Active | pressed | (browser default) |

### A11y
- Primary CTA passes 3:1 against gold (heavy text-strong color on light gold)
- Ghost button has 1.5px gold-muted border for visibility against light backgrounds
- Both meet 44×44 touch target

### HTML skeleton
```html
<div class="codex-hero-cta">
  <a class="codex-hero-cta-btn" data-cta-tier="hero"
     href="/contact/?intent=samples&route=/products/foo/">Request samples</a>
  <a class="codex-hero-cta-btn codex-hero-cta-btn--ghost"
     href="/products/all/#cluster" data-pillar-bridge="cluster">
     Browse all Cards SKUs <span aria-hidden="true">→</span>
  </a>
</div>
```

### Don't
- Don't change the label without considering the three-tier ladder. Hero must stay lower-commitment than the action-bar; otherwise the funnel collapses.
- Don't use `--codex-text-strong` (near-black) for the ghost button text — it should read in the warm-brown family.

---

## 3. Editorial action bar

### Purpose
Mid-commitment ask in the three-tier CTA ladder. Asks for a quote (medium commitment — buyer is signaling readiness to discuss specs + pricing). Lives below the editorial sections but above the inline RFQ form.

### Where
`editorial-pages.ts renderActionBar()` line 2438; styling `codex.css` `.codex-editorial-action-bar` block.

### Variants
- Primary action (`.codex-editorial-primary`) — data-driven label + `data-cta-tier="action"`
- Secondary action (`.codex-editorial-secondary`) — `mailto:` link + extra resource links

### A11y
- `<section>` with descriptive heading (`<h2>`)
- All actions are real `<a>` tags, no `<button>` confusion

### HTML skeleton
```html
<section class="codex-editorial-action-bar" id="next-step">
  <div>
    <p class="codex-editorial-kicker">Next step</p>
    <h2>Ready to discuss your project?</h2>
    <p>Use the contact route when you're ready for pricing, samples, or compatibility help.</p>
  </div>
  <div class="codex-editorial-action-links">
    <a class="codex-editorial-primary" data-cta-tier="action"
       href="/contact/?intent=quote&route=/products/foo/">Request quote and samples</a>
    <a class="codex-editorial-secondary"
       href="mailto:info@proudtek.com?subject=...">✉ Email inquiry directly</a>
  </div>
</section>
```

---

## 4. Editorial section

### Purpose
Atomic content block on editorial pages. Holds an `<h2>` + intro + paragraphs + bullets / table / image / callout.

### Where
`editorial-pages.ts renderSection()` line 2037.

### Variants

Driven by `[data-section-type]`:
- `pain` — red accent, used for "Common challenges" / "Why teams struggle"
- `solution` — forest accent, used for "How Proud Tek solves..."
- `results` — teal accent, used for case-study sections

Detected from section title via `detectSectionType()` regex.

### States
- Default
- Reveal on scroll (`.is-visible` added via `IntersectionObserver`)
- (No hover/active)

### A11y
- `<section>` with `<h2>` heading
- All inline citations (`[^N]`) become accessible `<sup>` links to the Sources block
- Decorative arrows (`→`) wrapped in `<span aria-hidden="true">`

### HTML skeleton
```html
<section class="codex-editorial-section" data-section-type="solution"
         id="how-it-works">
  <h2>How Proud Tek solves hotel access challenges</h2>
  <p class="codex-editorial-section-intro">...</p>
  <p>... body paragraph with [^4] citation marker ...</p>
  <ul class="codex-editorial-list">
    <li>...</li>
  </ul>
</section>
```

---

## 5. Sources block + inline citations

### Purpose
The 10-source `<ol>` at the bottom of every editorial page. Each `<li>` has a stable `id` so inline `[^N]` citation markers can deep-link to it (DS-10 #2). On click, the target source flashes 1.6s gold and gets a 4px outline so the user immediately sees what they jumped to.

### Where
`editorial-pages.ts renderSources()` line 2155 + `renderInlineLinks()` line 1994.

### A11y
- `aria-labelledby` ties section to its heading
- Each `<li>` has `tabindex="-1"` so keyboard focus from a `<sup>` link gets a visible outline
- `<sup>` links have `aria-label="Citation N, see Sources block"`
- `:target` flash animation downgrades to static background under `prefers-reduced-motion`

### HTML skeleton
```html
<!-- In body text (authored): "AES-128 encryption[^4]" -->
<!-- Renders as: -->
... AES-128 encryption<sup class="codex-citation">
  <a href="#sources-block-4" aria-label="Citation 4, see Sources block">[4]</a>
</sup>

<!-- In the Sources block: -->
<section id="sources-block" class="codex-sources">
  <h2>Sources & references</h2>
  <ol class="codex-sources-list">
    <li id="sources-block-4" class="codex-sources-item" tabindex="-1">
      <span class="codex-sources-num" aria-hidden="true">4.</span>
      <a class="codex-sources-link" href="..." rel="noopener external">
        NIST FIPS 197 — Advanced Encryption Standard (AES)
      </a>
      <span class="codex-sources-meta">...</span>
    </li>
    ...
  </ol>
</section>
```

### Don't
- Don't write raw `<sup>` tags in body content; use the `[^N]` syntax in JSON data — the renderer will substitute.
- Don't reorder source array items casually; existing `[^N]` markers in body text will point to the wrong source.

---

## 6. Brief details

### Purpose
The "Project checklist" Brief block, collapsed by default to keep evaluators on the spec → CTA path (DS-10 #3). Auto-opens for users coming from long-form contexts (`/blog/`, `/guides/`, `/compare/`, `/compatibility/`) or with `?reading=true` URL param.

### Where
`editorial-pages.ts renderBrief()` line 2102; auto-expand JS in `BaseLayout.astro`.

### Variants
None.

### States
| State | Trigger | Visual |
|---|---|---|
| Closed (default) | Page load, no signal to expand | `<details>` collapsed, chevron pointing right |
| Open | User clicks summary, OR same-origin referrer matches `/blog/`/`/guides/`/`/compare/`/`/compatibility/`, OR URL has `?reading=true` or `#reading` | Chevron rotates to point down, body fades in over 240ms |
| Open w/ reduced motion | `prefers-reduced-motion: reduce` | Same as Open but no fade-in animation |

### A11y
- Native `<details>` + `<summary>` — Enter/Space toggle baked in
- Summary `:focus-visible` gets `--codex-ring-focus-glow`
- Body text stays in DOM when closed (good for SEO, search)

### HTML skeleton
```html
<section class="codex-editorial-section codex-editorial-brief"
         id="brief" data-collapsible-brief>
  <h2>Project checklist</h2>
  <p class="codex-editorial-section-intro">...</p>
  <details class="codex-editorial-brief-details">
    <summary class="codex-editorial-brief-summary">
      <span class="codex-editorial-brief-summary__label">
        Read the full project checklist (~3 min)
      </span>
      <span class="codex-editorial-brief-summary__hint" aria-hidden="true">
        5 fields
      </span>
    </summary>
    <dl class="codex-editorial-brief-grid">
      <!-- field cards ... -->
    </dl>
  </details>
</section>
```

---

## 7. Compare table

### Purpose
Compare-page tables. Sortable columns, sticky first column on horizontal scroll, sticky thead on vertical scroll, glyph cells (`✓ / ✗ / —`) wrapped as colored pills (DS-10 #4).

### Where
`editorial-pages.ts renderTable()` line 2161; sort handler in `BaseLayout.astro`.

### Variants
- `data-sortable="true"` — opt in to click/keyboard column sort

### States
| State | Trigger | Visual |
|---|---|---|
| Default | — | Plain header rows, indicator at low opacity |
| Hover | mouse over `<th>` | Warm gold tint + boosted indicator opacity |
| Focus | `<th>` focused via Tab | 3px inset gold ring |
| Sorted asc | aria-sort="ascending" | Indicator's bottom triangle solid, top hollow |
| Sorted desc | aria-sort="descending" | Top triangle solid, bottom hollow |

### A11y
- Wrap is `<div tabindex="0" role="region" aria-label="Comparison table — scroll horizontally">`
- Column header has `tabindex="0"` `role="columnheader button"`
- `aria-sort` updated synchronously on each sort
- Glyph cells: `<span class="codex-cell-glyph" aria-label="Supported|Not supported|Not applicable" role="img">`
- 44×44 min hit target on every cell

### HTML skeleton
```html
<div class="codex-editorial-table-wrap" tabindex="0" role="region"
     aria-label="Comparison table — scroll horizontally to see more columns">
  <table class="codex-editorial-table" data-sortable="true">
    <thead><tr>
      <th scope="col"><span class="codex-th-label">Feature</span></th>
      <th scope="col" data-sort-col="1" aria-sort="none" tabindex="0"
          role="columnheader button">
        <span class="codex-th-label">DESFire EV3</span>
        <span class="codex-th-indicator" aria-hidden="true"></span>
      </th>
    </tr></thead>
    <tbody>
      <tr>
        <th scope="row">Encryption</th>
        <td><span class="codex-cell-glyph" data-cell-glyph="yes"
                 aria-label="Supported" role="img">✓</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 8. RFQ form

### Purpose
The inline RFQ form rendered at the bottom of every editorial page (`renderInlineRfqForm`), and the Kadence form on `/contact/` (post-processed by `enhancePrimaryContactPage`). Both share the same a11y model after DS-11 #5: real labels, hint + error spans, autocomplete + inputmode hints, role="alert" feedback.

### Where
- Inline: `editorial-pages.ts renderInlineRfqForm()` line 2416
- `/contact/`: post-process in `seo.ts enhancePrimaryContactPage()`
- Validation: `BaseLayout.astro` `codexFormValidate()`

### A11y
- `<label for>` above each input
- `aria-required="true"` + HTML5 `required`
- `aria-describedby` links to hint + error spans
- `role="alert" aria-live="polite"` on error spans
- `aria-invalid="true"` + `.is-invalid` on failed validation; cleared on input
- Submit failure focuses the first invalid field
- Honeypot (`_kb_verify_email`) tagged `aria-hidden="true" tabindex="-1"`, skipped by validator

### HTML skeleton (inline RFQ)
```html
<form action="https://formspree.io/f/xlgorlog" method="POST"
      class="codex-inline-rfq-form" data-codex-rfq novalidate>
  <input type="hidden" name="_subject" value="Inquiry: Product Name" />
  <div class="codex-inline-rfq-row">
    <div class="codex-inline-rfq-field">
      <label for="codex-rfq-route-email" class="codex-inline-rfq-label">
        Your email <span class="codex-rfq-required" aria-hidden="true">*</span>
      </label>
      <span id="codex-rfq-route-email-hint" class="codex-inline-rfq-hint">
        We'll only use this to reply to your inquiry.
      </span>
      <input id="codex-rfq-route-email" name="email" type="email"
             required aria-required="true"
             aria-describedby="codex-rfq-route-email-hint codex-rfq-route-email-error"
             autocomplete="email" inputmode="email" />
      <span id="codex-rfq-route-email-error" class="codex-inline-rfq-error"
            role="alert" aria-live="polite"></span>
    </div>
    <!-- ... other fields ... -->
  </div>
  <button type="submit" class="codex-inline-rfq-submit">Send Inquiry</button>
</form>
```

### Don't
- Don't use `placeholder` as a substitute for `<label>` — caught at PR review.
- Don't add `required` without `aria-required` — both are needed for AT parity.
- Don't add fields without an error span; the validator searches for it via `aria-describedby`.

---

## 9. Catalog rail

### Purpose
The vertical secondary nav on hub pages (`/products/`, `/industries/`, `/solutions/`, `/blog/`, `/guides/`, `/compare/`, `/compatibility/`). Group items into clusters; the active route auto-highlights.

### Where
`editorial-pages.ts renderCatalogRail()` + helpers; styling `codex.css` `.codex-catalog-rail` block.

### Variants
- `.codex-catalog-rail--grouped` — group headers + `<ul>` per group (DS-9 #4)
- `.codex-catalog-rail-locked` — pinned open on desktop
- Mobile: collapsible via toggle button + backdrop

### States
| State | Trigger | Visual |
|---|---|---|
| Default | — | Active link gets warm-gold left border + bold weight |
| Hover (link) | mouse over | Warm tint background |
| Active (link) | URL matches `data-catalog-route` | Bold + gold stripe |
| Mobile collapsed | viewport < 768px | Hidden, button visible |
| Mobile expanded | toggle clicked | Slide in + backdrop blur |

### A11y
- `role="navigation"` `aria-label`
- Active link `aria-current="page"`
- Mobile toggle: `aria-controls="catalog-rail" aria-expanded="true|false"`
- Close button: 44×44 hit target

### Don't
- Don't put more than ~10 groups in one rail; switch to multi-rail or accordion if you have more.

---

## 10. Hub card

### Purpose
The product/industry/solution preview cards on hub landing pages. Hero image + title + description + arrow.

### Where
`editorial-pages.ts renderIndustriesHub() / renderSolutionsHub() / renderResourcesCategoryHub()`

### Variants

Different render paths produce slightly different skeletons:
- `.codex-industries-hub-card` — industries hub
- `.codex-solutions-hub-card` — solutions hub
- `.codex-resources-category-card` — resources hub
- `.codex-related-industry-card` — at the bottom of product editorial

### States
- Default: subtle shadow + border
- Hover: shadow boost + `translateY(-3px)` (or `-6px` on home — DS-10 flagged this inconsistency)

### A11y
- Whole card is a `<a>`, not nested links (no link-in-link)
- Decorative arrow is `<span aria-hidden="true">`
- Image has `alt` text (or empty alt if decorative)

### HTML skeleton
```html
<a href="/industries/hospitality/" class="codex-industries-hub-card">
  <img src="/.../hero.png" alt="Hospitality industry hero">
  <div class="codex-industries-hub-card__body">
    <span class="codex-industries-hub-card__emoji codex-icon">
      <!-- inline SVG ... -->
    </span>
    <strong>Hospitality</strong>
    <p>Hotel access, kiosk wristbands, kitchen RFID...</p>
    <span class="codex-industries-hub-card__cta">
      Explore Hospitality <span aria-hidden="true">→</span>
    </span>
  </div>
</a>
```

### Don't
- Don't nest `<a>` inside the card; the entire card is one link.
- Don't omit the alt; even decorative hero images should have `alt=""`.

---

## 11. Trust strip

### Purpose
The 4-number social-proof strip below the hero (`10+ Years`, `ISO 9001`, `500+ Clients`, `50+ Countries`). DS-9 boosted the number weight to 32px Lora bold.

### Where
`editorial-pages.ts renderTrustSignals()` line 2200.

### A11y
- Plain text, no aria — values speak for themselves
- Each `<strong>` has the number, sibling `<span>` has the label

### Don't
- Don't add more than 4 items; the row breaks at 5+.
- Don't use this for product specs — that's the snapshot card's job.

---

## 12. Decision snapshot

### Purpose
The "at a glance" spec card on product editorial pages. Tabular spec list + tags + price bracket.

### Where
`editorial-pages.ts renderDecisionSnapshot()`.

### A11y
- `<dl>` for spec key→value pairs
- Tags are `<a>` links to filter pages, not bare spans

### Don't
- Don't over-stuff this card (>8 spec rows). It's a snapshot, not the full datasheet.

---

## 13. Mega-menu

### Purpose
The desktop top-nav mega-menu surface for Industries, Solutions, Resources. Hover/focus opens; click closes.

### Where
`render-snapshot.ts injectCustomNav()`.

### A11y
- Mobile: real `<details>` + `<summary>` accordion (DS-9 #2)
- Desktop: `aria-haspopup="true"` on parent link
- ⚠️ **Known gap (DS-12 audit)**: desktop hover does not toggle `aria-expanded` — needs Phase 3 fix

---

## 14. Footer

### Purpose
Site footer with brand, contact widgets, social row, copyright. Inherits from Kadence and post-processed in `seo.ts`.

### Where
`seo.ts rewriteFooterInquirySection()`, `injectFooterRfq()`, etc. + Kadence baseline.

### A11y
- All links have descriptive text (no "Click here")
- Social icons have `aria-label`
- Dark `--codex-dark` background w/ white-90% text — WCAG 1.4.3 pass

### Don't
- Don't bypass the post-processing layer; the Kadence baseline has stale copy that's normalized in `seo.ts`.

---

## 15. Editorial channel cards

### Purpose
The 4-up Email / Phone / WhatsApp / Form cards on `/contact/` and contact-route editorial pages.

### Where
`editorial-pages.ts renderContactChannels()` line 2360.

### A11y
- Each card is a real `<a>` (mailto / tel / form route)
- Icons are inline SVG with `aria-hidden="true"` (label text reads instead)

### Don't
- ⚠️ **Known issue (DS-10 audit)**: card heights unequal at desktop because email has 3 lines of copy, others have 1. Either pad to equal height OR reflow as 2-up — TBD.

---

## 16. Conversion shell

### Purpose
The "next step" callout block injected into snapshot product pages by `seo.ts injectConversionBlocks()`. Three variants: contact, mailto, internal-link.

### A11y
- All actions are real `<a>` tags
- Heading hierarchy preserved

---

## 17. Resource grid

### Purpose
The "Useful next pages" grid at the bottom of every editorial page. 3-up card layout linking to blog/guides/compare/compatibility.

### Where
`editorial-pages.ts renderResourceGrid()`.

### Don't
- Don't use this for product cross-sell (that's a different surface). Resource grid is editorial-only: blog / guide / comparison / compatibility links.

---

## 18. Jump nav

### Purpose
The in-page TOC at the top of editorial pages. Scrollspy-style — the active section is highlighted as the reader scrolls.

### Where
`editorial-pages.ts renderJumpNav()`; tracking JS in `BaseLayout.astro`.

### A11y
- `<nav role="navigation" aria-label="On this page">`
- Active link gets `aria-current="location"` (not "page" — it's an in-page anchor)
- Smooth-scroll respects `prefers-reduced-motion`

---

## 19. Breadcrumb trail

### Purpose
Top-of-page breadcrumb with truncation to 60 chars + first-segment-only fallback (DS-9 KPI cleanup).

### Where
`editorial-pages.ts renderTrail()`.

### A11y
- `<nav aria-label="Breadcrumb">`
- Current page is a non-link `<span aria-current="page">`

---

## 20. Social / footer-bottom row

### Purpose
The icon row at the very bottom of the footer (Twitter / LinkedIn / YouTube / etc.).

### A11y
- Each icon is a `<a>` with `aria-label="LinkedIn"` etc.
- `:hover` and `:focus`: gold background + `--codex-text-strong` icon (max contrast on gold)
- 44×44 minimum hit target

### Don't
- Don't link to inactive social handles. The footer post-processor `seo.ts:836` strips empty hrefs.

---

## How to add a new component

1. **Justify** — does this concept already have 80% overlap with an existing component? (e.g. "another card" — use `.codex-card` once that base ships, or modify an existing variant.)
2. **Locate** — pick the right module:
   - Editorial-only → `editorial-pages.ts`
   - Cross-cutting layout → `BaseLayout.astro`
   - Snapshot post-processing → `seo.ts`
3. **Name** — follow [conventions.md](./conventions.md): `.codex-<context>-<role>` for the wrap, `__<part>` for children, `--<variant>` for modifiers, `is-<state>` for state.
4. **Tokenize** — only use tokens for color/spacing/type/motion. Reach for raw values only with explicit comment justifying why no token fits.
5. **A11y** — every component must list: ARIA role, keyboard interaction, screen-reader announcement, contrast ratio for primary text.
6. **Document** — add an entry to this file with HTML skeleton + don't list.
7. **Verify** — `npx astro sync && npx astro build` + visual diff one page using the new component.

---

## Component completeness checklist (post-DS-12)

Use this when adding or auditing a component:

- [ ] Has at least one variant or is genuinely a base
- [ ] All interactive states defined (default, hover, focus, active, disabled where applicable)
- [ ] ARIA role / label appropriate for the role it plays
- [ ] Keyboard interaction documented (Tab, Enter, Space, Esc, arrow keys)
- [ ] Color contrast meets WCAG 1.4.3 AA (≥4.5:1 small, ≥3:1 large)
- [ ] Touch targets meet WCAG 2.5.5 (≥44×44 for interactive)
- [ ] Animation gated under `prefers-reduced-motion: reduce`
- [ ] Mobile-adapted (works at 360px viewport)
- [ ] One-page entry in this doc
- [ ] HTML skeleton example
- [ ] Don't list with at least 2 items

A component scoring 8/10 or higher on the checklist is "production complete." Below that, list it as TODO in the [Phase 3 roadmap](./tokens.md#token-coverage-targets).

---

## Patterns (DS-12 Phase 4)

Patterns differ from components: they're shared *behavior + visual* idioms with a custom-property API, designed to be combined with a context-specific class. Three patterns ship today:

### `.codex-card`

Shared baseline for every preview card. See **[component #10](#10-hub-card)** and any class with `codex-card` prefix in HTML. API:

```css
.codex-card {
  --card-bg: #fff;
  --card-padding: var(--codex-space-5) var(--codex-space-5-plus);
  --card-radius: var(--codex-radius-card);
  --card-border-color: var(--codex-border-light);
  --card-elevation: var(--codex-elevation-rest);
  --card-elevation-hover: var(--codex-elevation-hover);
  --card-hover-lift: -3px;
  --card-hover-border: var(--codex-gold-muted);
  --card-text-decoration: none;
}
```

Variants override only what differs. The `.codex-card--media` modifier zeros padding + adds `overflow: hidden` for image-card layouts. **Used by**: 7 card variants (industries-hub, industries-cat, industries-product, related-industry, blog-grid, resources-category, editorial-{card,brief,snapshot,link}).

#### A11y notes (DS-13)

- **Hover transform** is gated under `prefers-reduced-motion: reduce` — the `--card-hover-lift` translateY is suppressed for vestibular-sensitive users, while box-shadow + border-color visual feedback still apply.
- **Whole-card link pattern**: most cards are wrapped in a single `<a>` and the entire card is the affordance. The card body has `text-decoration: none` so headings/copy don't carry link underlines.
- **Card with separate inner link**: if a card includes a *separate* `<a>` link in the body (e.g. a "Read more" link not the whole-card link), give that inner link explicit `text-decoration: underline`. Without it the link is distinguishable only by color — fails WCAG 1.4.1 Use of Color. (DS-13 #6)

### `.codex-disclosure`

The "expand from a clickable banner summary" pattern. `<details>` + `<summary>` styled as a banner with chevron, body slides in with a 240ms reveal (gated under `prefers-reduced-motion`). API:

```css
.codex-disclosure {
  --disclosure-margin-top: var(--codex-space-3);
  --disclosure-bg: var(--codex-bg-warm);
  --disclosure-padding: 0.85rem 1.1rem;
  --disclosure-radius: var(--codex-radius-sm);
  --disclosure-border: 1px solid var(--codex-border-light);
  --disclosure-hover-bg: rgba(195, 154, 95, 0.10);
  --disclosure-hover-border: var(--codex-gold-muted);
  --disclosure-chevron-color: var(--codex-gold-muted);
  --disclosure-body-gap: var(--codex-space-3);
  --disclosure-reveal-duration: 240ms;
}
```

#### Usage skeleton

```html
<details class="codex-disclosure">
  <summary class="codex-disclosure__summary">
    <span class="codex-disclosure__label">Read the full thing (~3 min)</span>
    <span class="codex-disclosure__hint" aria-hidden="true">5 fields</span>
  </summary>
  <div class="codex-disclosure__body">
    ... content ...
  </div>
</details>
```

**Used by**: Brief details. **Future candidates**: FAQ accordion (currently uses `details` directly without the banner styling), "Show all 10 sources" toggle on Sources block, "Show methodology" expander on data-heavy editorial sections.

### `.codex-scroll-region`

Generic "scrollable region with keyboard parity" wrapper. Provides horizontal/vertical overflow + max-height ceiling + border + focus ring. Author is responsible for the ARIA semantics (tabindex/role/aria-label) — the CSS only handles the visual layer. API:

```css
.codex-scroll-region {
  --scroll-region-max-height: 70vh;
  --scroll-region-radius: var(--codex-radius-sm);
  --scroll-region-border: 1px solid var(--codex-border-light);
}
```

#### Usage skeleton

```html
<div class="codex-scroll-region"
     tabindex="0"
     role="region"
     aria-label="Comparison table — scroll horizontally to see more">
  <table>...</table>
</div>
```

**Used by**: Compare table (`.codex-editorial-table-wrap`). **Future candidates**: Spec table (currently flagged 5/10 for "no aria-* + overflow ugly"), wide timeline charts, anything with a 4+ column data surface that overflows on mobile.

### `.codex-banner`

Generic "fixed/sticky banner" pattern. Covers any surface that needs to anchor a message + action + dismiss to the viewport edge: sticky CTA bar, announcement bar, toast notification, privacy banner. API:

```css
.codex-banner {
  --banner-position: fixed;
  --banner-top: auto;
  --banner-bottom: 0;
  --banner-left: 0;
  --banner-right: 0;
  --banner-bg: rgba(41, 28, 14, 0.92);
  --banner-color: #ffffff;
  --banner-padding: var(--codex-space-3) var(--codex-space-5);
  --banner-gap: var(--codex-space-4);
  --banner-z: var(--codex-z-modal);
  --banner-border-top: 1px solid var(--codex-gold);
  --banner-border-bottom: none;
  --banner-shadow: 0 -8px 24px rgba(0, 0, 0, 0.18);
  --banner-blur: 12px;
  --banner-enter-from: translateY(100%);
  --banner-show-duration: 300ms;
}
```

#### Variants

| Variant | Position | Enter direction | Use case |
|---|---|---|---|
| (base) | fixed bottom | translateY(100%) → up | Sticky CTA — current consumer |
| `--sticky-top` | fixed top | translateY(-100%) → down | Announcement bar, free-shipping banner |
| `--toast` | fixed bottom-right | translateX(120%) → left | Toast notification (success/error/info) |

#### Usage skeleton

```html
<!-- Sticky CTA at bottom (current sticky-cta) -->
<div class="codex-banner" role="complementary" aria-label="Talk to engineering">
  <span class="codex-banner__message">Hit a spec wall? Talk it through with our engineers.</span>
  <a class="codex-banner__action" href="/contact/?intent=engineering">Talk to engineering</a>
  <button class="codex-banner__dismiss" aria-label="Dismiss" type="button">&times;</button>
</div>

<!-- Top announcement bar -->
<div class="codex-banner codex-banner--sticky-top" role="status">
  <span class="codex-banner__message">Free DHL on orders over 5,000 pieces.</span>
  <button class="codex-banner__dismiss" aria-label="Dismiss" type="button">&times;</button>
</div>

<!-- Toast notification (override --banner-bg per status) -->
<div class="codex-banner codex-banner--toast" role="status"
     style="--banner-bg: var(--codex-success); --banner-color: #fff;">
  <span class="codex-banner__message">Inquiry sent. We'll reply within 1 business day.</span>
  <button class="codex-banner__dismiss" aria-label="Dismiss" type="button">&times;</button>
</div>
```

#### State

The `.is-visible` class gates `opacity` + `transform`. Authors are responsible for adding/removing it via JS based on whatever signal makes sense:
- **Sticky CTA**: scroll past in-page anchors → IntersectionObserver removes `.is-visible`
- **Announcement bar**: page load → instant `.is-visible`; dismissed flag → remove
- **Toast**: queue-driven; auto-dismiss after N seconds

#### Backward compat

The legacy `.codex-sticky-cta`, `.codex-sticky-cta__btn`, and `.codex-sticky-cta__dismiss` class names still emit on the sticky CTA HTML. The JS in `BaseLayout.astro` queries `.codex-sticky-cta` for the IntersectionObserver tracking; renaming the legacy class would break the JS. Visual styling now comes from the `.codex-banner` base; the legacy classes are no-op anchors for future variant-specific overrides.

#### Don't

- Don't use `.codex-banner` for in-page content (e.g. inline alerts inside an article). It assumes fixed/sticky positioning — for inline alerts use a different pattern (or build one once 3+ examples exist).
- Don't put more than one banner of the same variant onscreen at once. Multiple sticky-bottom banners stack visually but the dismiss + IntersectionObserver assumptions break.
- Don't omit `role` and `aria-label`. The pattern provides only the visual layer; semantics are the author's responsibility (`role="complementary"` for sticky CTA; `role="status"` for announcement; `role="alert"` for important toasts). A dev-only `console.warn` in `BaseLayout.astro` flags banners missing `role` during local development (DS-13 #4).
- Don't override `--banner-bg` without verifying contrast against `--banner-color` (default `#fff`). The `--codex-success` / `--codex-error` / `--codex-warning` tokens all pass 4.5:1 against white when used as toast backgrounds, but a custom hex needs an explicit contrast check. (DS-13 #5)

### How patterns differ from components

A **component** has fixed visual shape, fixed semantics, named role (`.codex-hero-cta-btn`, `.codex-sticky-cta`).

---

## The Kadence/WordPress adapter layer

`codex.css` carries 51 selector rules using `kadence-`, `kt-`, `kb-`, or `wp-` prefixes. **These are not migration debt.** They are the design system's adapter layer between WordPress block markup (still emitted by JSON data fixtures and renderer code) and codex visuals.

DS-16 audited every one of these rules and cross-referenced them with `seo.ts`, `render-snapshot.ts`, `catalog-pages.ts`, `editorial-pages.ts`, and 25+ JSON data fixtures. The result: **47 selectors are load-bearing** (live emitter + live consumer), **4 selectors are renameable in theory** but not worth a standalone pass, and **0 selectors are dead**.

Examples of why each "WP-flavored" rule earns its keep:

- `.entry-content > .wp-block-cover:first-child` (homepage hero, ~80 lines) — `index.json` opens its body HTML with `<div class="wp-block-cover">`.
- `.kadence-blocks-form-field` — `seo.ts` post-processes the WP form block into the contact form; the class is the contract.
- `.kadence-breadcrumbs` — `catalog-pages.ts` actively emits this from scratch (not carried-over WP HTML).
- `html body #masthead.site-header` (29 sub-rules) — defense-in-depth specificity beats the legacy Kadence sticky-header rule that *also* still exists in the cascade.

**Future audit rule:** prefix-based audits (counting `kadence-` selectors) are leading indicators only. Real audit requires emitter ↔ consumer cross-reference, otherwise you'll double-count "removable debt" that's actually system. This is the third audit (after DS-12 #9 shadows and DS-12 #10 page-type palette) where syntactic foreignness was mistaken for semantic deadness; the methodology now requires verification before the conclusion.

Full diagnostic: `reports/ds-12-token-consolidation/DS-16-KADENCE-DIAGNOSTIC.md` — note: this standalone file is no longer in the repo as of 2026-06-29; the summary above is retained.

A **pattern** is a parameterized shape that gets composed with a context class. The context class lives at the leaf and provides the use-case context; the pattern provides the shape. `.codex-card .codex-blog-grid-card` is the canonical example.

When in doubt: if 3+ existing components share an idiom, extract it as a pattern. The mixin-style + custom-property API keeps each component variant short (3-5 lines of overrides instead of 10+ lines of duplicated declarations).
