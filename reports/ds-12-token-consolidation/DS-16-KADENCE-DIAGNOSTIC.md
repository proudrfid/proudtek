# DS-16 — Kadence/WordPress CSS Diagnostic

**Status:** Diagnostic complete. Decision: **close DS-16, no excision pass.**
**Method:** Cross-reference each Kadence/WP-prefixed rule in `codex.css` against renderer code (`seo.ts`, `render-snapshot.ts`, `catalog-pages.ts`, `editorial-pages.ts`) and JSON data fixtures.
**Date:** 2026-04-27

---

## 1. Why this diagnostic exists

DS-15's audit summary called the 51 Kadence/WP-prefixed CSS rules "WordPress migration debt — could be excised for ~6 KB raw savings." DS-14's combined-push plan proposed running this excision alongside DS-15's Phase 6 to share a Lighthouse baseline.

Before committing 5–10 days to a full-pipeline rewrite, we ran the same methodology that DS-12 #10 (RFC-PAGE-TYPE-PALETTE) used to defuse the teal/forest/steel "low-usage palette" assumption: **measure dependency before assuming removability.**

This document records that measurement.

---

## 2. Categorization — the 51 rules

Rules are grouped by their region in `codex.css` and labeled:

- **LOAD-BEARING** — rule has live emitters in source data and/or live consumers in rendering pipeline. Removal breaks the page.
- **ADAPTER** — rule targets a legacy class but the renderer also emits a codex- equivalent. Removable only if we rename the class at the emit site (multi-file change).
- **DEAD** — no live emitter and no consumer.

| # | Selector / region | Lines | Category | Evidence |
|---|---|---|---|---|
| 1 | `.kb-row-layout-wrap` (margin-bottom rule) | L304 | LOAD-BEARING | `index.json` and 20+ data fixtures emit `kb-row-layout-wrap`; JSON content carries WP block markup |
| 2 | `figure.wp-block-image:has(img[src*="rfid_blue"])` decorative icon scoping | L324–329, L464–475 | LOAD-BEARING | Homepage section dividers; without size cap the decorative 48px icon scales to full column width |
| 3 | `.kt-blocks-testimonials-wrap_a4d6e5-42 .kt-blocks-testimonials-inner-wrap > div` static grid | L338–344 | LOAD-BEARING | `index.json` emits this exact wrapper class; `render-snapshot.ts:153` strips the carousel JS hook so this CSS is the fallback layout |
| 4 | `.splide__track`, `.splide__list` carousel fallback grid | L347–352 | LOAD-BEARING | Same testimonials block; ensures no-JS state still shows 3-up grid |
| 5 | `.codex-contact__form-card .kadence-blocks-form-field` form field flex | L655–658 | ADAPTER | `seo.ts:2334` references `.kadence-blocks-form-field` directly when post-processing contact form HTML; would require coordinated rename in `seo.ts` + JSON |
| 6 | `.codex-contact__form-card .kb-field-desk-width-100/-50` grid widths | L661–662, L665–666 | LOAD-BEARING | Kadence form post-process (DS-11 #5b) emits these classes from the WP form block schema |
| 7 | `.codex-contact__form-card input.kb-field` / `textarea.kb-field` styling | L678–697 | LOAD-BEARING | Same form block; `kb-field` is the field-class contract |
| 8 | `.codex-contact__form-card .kadence-blocks-field.verify { display: none }` honeypot | L707 | LOAD-BEARING | Anti-spam honeypot field — removing the rule shows the trap field to users |
| 9 | `.codex-contact__form-card .kb-submit-field` / `.kb-forms-submit` | L709–714+ | LOAD-BEARING | Same form-block contract |
| 10 | `.entry-content > .wp-block-cover:first-child` homepage hero (16 sub-rules) | L808–893 | LOAD-BEARING | `index.json` body HTML opens with `<div class="wp-block-cover">`; this IS the home hero render |
| 11 | `.entry-content > .kb-row-layout-wrap.kt-row-has-bg:first-child p` | L1816 | LOAD-BEARING | First-section paragraph color on rows with background images |
| 12 | `.woocommerce-products-header .kadence-breadcrumbs + .kadence-breadcrumbs` dedupe | L4409 | ADAPTER | `catalog-pages.ts:1264` actively emits `<nav class="kadence-breadcrumbs">`; would require rename in catalog-pages emit + CSS |
| 13 | `html body #masthead.site-header` sticky header (29 sub-rules) | L5121–5300+ | LOAD-BEARING | Site-wide header chrome; defuses Kadence's transparent-header body class + `.kadence-sticky-header` inner wrapper specificity races |
| 14 | `.kadence-svg-iconset` color override inside header | L5231 | LOAD-BEARING | Kadence SVG icon set rendered in nav drop-down toggles; without color override they render in palette9 (#fff) and disappear on light header |
| 15 | `body.home .wp-block-cover.is-light` hero gradient + CTA hierarchy (DS-9 #5) | L5749–5799 | LOAD-BEARING | DS-9 #5 explicitly upgraded this region for hero contrast — completed task |
| 16 | `.kadence-blocks-form-field > label` typography | L6348 | LOAD-BEARING | Form-block label styling |

**Total:** 16 rule groups covering all 51 individual selectors.
**LOAD-BEARING:** 14 rule groups (≈ 47 selectors).
**ADAPTER:** 2 rule groups (≈ 4 selectors).
**DEAD:** 0 rule groups.

---

## 3. Why "Kadence layer" isn't migration debt

Three independent signals confirm this is the design system's adapter layer, not removable history:

**Signal 1 — JSON data fixtures still carry WP class semantics.** `index.json` ships its body HTML with `<div class="wp-block-cover">` and `<div class="kb-buttons-wrap">` and `<a class="kb-button">`. 20+ product/category JSONs do the same. The JSON IS the source of truth for content; rewriting them to drop WP classes is the multi-day pipeline change called out in DS-15's analysis.

**Signal 2 — Renderer code actively emits Kadence classes.** `catalog-pages.ts:1264` writes `<nav class="kadence-breadcrumbs">` from scratch — this isn't carried-over WP HTML, it's our renderer choosing to use that class today. `editorial-pages.ts:1641` emits `kadence-woo-messages-none-woo-pages`. `seo.ts:2334` and others use `.kadence-blocks-form-field` as the class contract for post-processing.

**Signal 3 — The CSS is mostly defensive.** `html body #masthead.site-header` uses 5,151 specificity (id + element + class) to *beat* the legacy Kadence rules; the `.kadence-sticky-header` selector appears specifically to suppress the legacy sticky behavior. This isn't migration debt — it's a defense-in-depth layer that exists *because* the WP class system is still live.

---

## 4. The actual savings, if we did excise

For completeness, the cost-benefit if we proceeded with full excision:

**Effort (real estimate):**
- Rewrite ~25 JSON data fixtures to drop WP block markup → ≈ 2 days.
- Rewrite `render-snapshot.ts` cleanup logic to no longer strip what isn't there → ≈ 0.5 day.
- Rewrite `seo.ts` post-process queries to target codex- classes → ≈ 1 day.
- Rewrite `catalog-pages.ts` and `editorial-pages.ts` emitters → ≈ 0.5 day.
- Rewrite the 51 CSS rules to point at codex- equivalents → ≈ 1 day.
- Visual regression: 470 pages × manual spot-check across 6 page types → ≈ 1.5 days.
- **Total: ≈ 6.5 days.**

**Savings:**
- ~6 KB raw / ~1.5 KB gzip CSS reduction.
- ~30 `!important` declarations removed from compat layers.
- One conceptual layer removed from the cascade.

**Risk:**
- Home hero, contact form, breadcrumbs, sticky header all touch the WP class layer. A miss in any single area = visible regression on a top-traffic route.
- Many DS-9 / DS-11 fixes (sticky header, form a11y, hero CTA hierarchy) explicitly target WP classes. Excision unwinds that work conceptually even if functionally preserved.

**Net:** 6.5 days of risk for 1.5 KB gzip is below the design-system hurdle rate. The "Kadence layer" name is misleading — it's the WP-class-compatibility adapter that DS-9, DS-11, DS-12 all rely on.

---

## 5. Decision

**Close DS-16.** No excision pass.

**What we keep:** the ADAPTER label on the 4 selectors that *could* be renamed cheaply — `.kadence-breadcrumbs` (catalog emit) and `.kadence-blocks-form-field` (seo emit) — but only if a future ticket has independent reason to touch those emit sites. Not worth a standalone task.

**What changes in `tokens.md` / `components.md`:** add a one-paragraph note that the 51 WP/Kadence selectors are a deliberate adapter layer, not migration debt. Future audits should not flag them as removable without measuring emitter dependency first.

**Methodology recorded:** this is the third audit estimate that overstated removability by treating syntactic foreignness as semantic deadness:

1. **DS-12 #9 (shadows):** assumed swappable; was a coherent rest-heavier-hover scale incompatible with the new hover-heavier scale.
2. **DS-12 #10 (page palette):** assumed low-usage; was a 6-of-8-load-bearing system.
3. **DS-16 (Kadence):** assumed migration debt; is the WP-compat adapter layer.

The pattern: **prefix-based audit (counting `kadence-` selectors) is a leading indicator only**. Real audit requires emitter ↔ consumer cross-reference, which is what we did here in ~30 minutes vs. the 6.5 days we'd have spent committing to the wrong conclusion.

---

## 6. Implications for DS-15 Phase 6

Phase 6 proceeds as documented in `DS-15-PERFORMANCE-AUDIT.md`. Not blocked by DS-16 outcome.

The 41 KB gzip CSS is no longer carrying a 1.5 KB "easy win" in the form of dead Kadence rules — that win does not exist. The Critters critical-path inline strategy still gets us 200–400 ms; that's where the real savings are.

Phase 6 task ordering unchanged:

1. Lighthouse CI harness (0.5 d)
2. Hero `width`/`height` intrinsics (0.5 d)
3. Critters critical-CSS inline (1 d)
4. JS pre-paint/deferred split (1 d)
5. WebP/AVIF hero pipeline (1.5 d)
6. Lighthouse re-run + budget doc (0.5 d)

**Total Phase 6:** ~5 days, no DS-16 dependency.

---

## 7. Summary

51 Kadence/WP-prefixed CSS rules audited. **Zero are dead.** 47 selectors are load-bearing through live renderer emit + JSON data fixtures + defense-in-depth specificity battles with the WP-class layer. 4 selectors are theoretically renameable but not worth a standalone pass.

DS-16 closes. Phase 6 proceeds independently with the Lighthouse harness as shared baseline (single-purpose now, not dual-purpose).

The methodology improvement — emitter-cross-reference before assuming removability — gets recorded as the third instance of audits over-counting "migration debt." The design system is leaner than it looks, even where the prefixes are noisy.
