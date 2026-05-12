# W3-4d Catalog Faceted Filter — `/products/all/` UX Refresh

**Date:** 2026-04-18
**Batch:** Catalog index faceted filter — frequency / chip family / environment.
**Scope:** Add a spec-filter panel to the left rail on `/products/all/` so buyers can narrow 246 products by technical specs. Pure client-side; zero extra server round-trips, zero new build artifacts beyond the one rendered index.

---

## 1. What shipped

A second panel inside the existing `.codex-catalog-rail` left sidebar, directly below the "Product Families" nav. Three facet groups, each multi-select:

| Group | Icon | Options shown on `/products/all/` (with counts) |
|---|---|---|
| Frequency | 📡 | LF (125 kHz) — 14 · HF / NFC (13.56 MHz) — 96 · UHF / RAIN (860–960 MHz) — 67 |
| Chip family | 🔌 | NTAG21x · NTAG424 DNA · MIFARE Classic · MIFARE DESFire · MIFARE Ultralight · MIFARE Plus · ICODE SLIX · EM / T5577 (LF) · Impinj M7xx / M8xx · Alien Higgs · NXP UCODE 8/9 |
| Environment | 🛡️ | On-metal / anti-metal · High-temp (≥150 °C) · Outdoor / IP67+ · Embed / cast-in · Tamper-evident · Sensor / temp logger |

Semantics:
- **AND across groups** — a card must match at least one selected value in every active group.
- **OR within a group** — HF + UHF both ticked → show everything that is HF *or* UHF.
- Facet values with 0 matching SKUs are dropped (no empty checkboxes).
- Filter chips in the panel show live counts, and the rail category pills reflow to reflect what's currently visible per category.
- Clear button in the panel header appears only when any filter is active; a second Clear button lives inside the empty-state card.

---

## 2. Architecture

### Build-time (`src/lib/catalog-pages.ts`)

**Facet derivation.** A new `FACET_RULES` block (lines 283–319) holds 20 rules split across the three groups. `deriveFacets(...textParts)` runs each rule's regex over `title + summary + route-slug` at build time and returns a `Facets = { freq: string[]; chip: string[]; env: string[] }` object. The route slug is passed in so URL-embedded specs (e.g. `anti-metal-uhf-it-asset-tag` → `anti-metal` + `uhf`) get picked up even when the marketing summary is short.

**`CatalogProduct` extended.** Added `facets: Facets` alongside `route / title / image / summary`. Both WP-sourced products and Content-Collection landing products populate it at the point of construction inside `collectCatalogProducts`.

**Product card emission.** `renderProductCard` now appends `data-facet-freq="…"`, `data-facet-chip="…"`, `data-facet-env="…"` to every `<li class="product">`. Values are space-joined; an empty string means "no match in this group" — the filter JS treats it as "hide this card if any box in this group is ticked".

**Panel markup.** `renderCatalogMain` tallies per-value counts across all visible products, builds a `filterPanelHtml` string (one `.codex-facet-group` block per group, skipping zero-count options), and injects it into the existing `<aside id="codex-catalog-rail-panel">` alongside the Product Families nav. A sibling `<div class="codex-catalog-empty" hidden>` is emitted after the main content so the JS can unhide it when filters zero out the grid.

### Runtime (inline script in the catalog main panel)

Self-contained IIFE extension after the existing scroll-spy code. No new script file, no build pipeline changes. Three functions:

- `readSelectedFacets()` — snapshot of all `:checked` checkboxes grouped by `data-facet-group`.
- `cardMatches(card, sel)` — AND-across / OR-within logic against each card's `data-facet-*` attributes.
- `applyFilters()` — walks all cards, toggles `hidden`, tallies per-category match counts, rewrites:
  - the `.woocommerce-result-count` line ("Showing 23 of 246 products")
  - each category section's count pill ("18 products" → "3 products")
  - the rail's `[data-cat-count]` counts (with `.is-empty` class when that category has 0 visible)
  - visibility of the empty-state card
  - visibility of both Clear buttons

### CSS (`src/styles/codex.css`)

~130 lines added between the catalog-rail overlay breakpoint and the backward-compat block. Visual language matches the existing `.codex-catalog-rail` family: same border colour token, same 12px border radius, same subtle box-shadow. Gold-accented `.has-active-filters` state draws the eye to the filter panel when any checkbox is ticked. Empty state is a dashed border card, centred, with a prominent "Clear filters" button.

---

## 3. Facet distribution in the live build

Of the 246 catalog products:

| Attribute | Coverage |
|---|--:|
| At least one frequency tag | 160 / 246 (65 %) |
| At least one chip-family tag | 33 / 246 (13 %) |
| At least one environment tag | 40 / 246 (16 %) |

Commentary:
- Frequency has strong coverage because most SKUs mention MHz / kHz / NFC / UHF in copy.
- Chip-family coverage is intentionally thin — most landing pages are generic ("rfid keyfobs wholesale") and don't name a specific chip. Chip filters are most useful on the dedicated `/products/rfid-cards/` / `/products/rfid-labels/` sub-indexes (where the same filter code is already wired by virtue of sharing `renderCatalogMain`).
- Environment coverage tracks ruggedised/specialty SKUs (anti-metal, tamper, IP-rated).

Top filter values by card count:
- Frequency: HF 96 · UHF 67 · LF 14
- Chip: MIFARE DESFire 5 · EM/T5577 5 · NTAG21x 4 · MIFARE Classic 4 · Impinj M7xx 4
- Environment: Tamper 10 · Outdoor 10 · High-temp 7 · Anti-metal 7

---

## 4. Build verification

```
ASTRO_OUT_DIR=./dist-restored npm run build      # clean, 102.63s
```

Trailing `EPERM unlink .prerender/…` is the known virtiofs-mount cleanup quirk; all pages (including `/products/all/index.html`) emitted successfully.

Rendered-output spot checks against `dist-restored/products/all/index.html`:

| Check | Expected | Actual |
|---|--:|--:|
| `data-facet-freq=` attributes on `<li.product>` | 246 | 246 |
| `codex-facet-option` rows in panel | ≤20 | 20 (all 3 groups rendered, 0-count values dropped) |
| `codex-catalog-empty` block | 1 | 1 |
| `codex-catalog-filter__header` + `Filter by spec` heading | 1 | 1 |
| JS functions inlined (`applyFilters`, `cardMatches`, `readSelectedFacets`) | 3 | 3 |
| Rail category pills with `data-cat-count` | 6 | 6 (one per category) |

Panel header renders cleanly:

```html
<div class="codex-catalog-filter" data-total-products="246">
  <div class="codex-catalog-filter__header">
    <div class="ind-sidebar__title">Filter by spec</div>
    <button type="button" class="codex-catalog-filter__clear" hidden>Clear</button>
  </div>
  <div class="codex-facet-group" data-facet-group-wrap="freq">
    <div class="codex-facet-group__title">📡 Frequency</div>
    <label class="codex-facet-option"><input … value="lf"> LF (125 kHz) (14)</label>
    …
  </div>
  …
</div>
```

---

## 5. Responsive behaviour

No new breakpoints — the filter panel inherits the rail's existing narrow-viewport collapse rules. At ≤1279 px the rail already collapses to a floating "🗂️ Categories" button; tapping it now opens a sheet that contains *both* the category nav and the filter panel stacked vertically. Clear button and empty-state CTA are touch-target-sized (≥ 40 px).

---

## 6. Files changed

| Category | File | Change |
|---|---|---|
| Modified | `src/lib/catalog-pages.ts` | +~170 lines: `FACET_RULES`, `deriveFacets`, `Facets` type, `CatalogProduct.facets`, facet tallying, `filterPanelHtml` build, data-* attrs on cards, filter JS |
| Modified | `src/styles/codex.css` | +~130 lines: `.codex-catalog-filter`, `.codex-facet-group`, `.codex-facet-option`, `.codex-catalog-empty`, `.is-empty` |
| New | `pillar-pages-w3d-catalog-facets-report.md` | this report |

**Total diff:** 3 files changed.

Pure front-end. No SKU JSON touched, no catalog audit delta, no `CATALOG_IMAGE_OVERRIDES` change.

---

## 7. What ships next

Open queue after this batch:

| Priority | Item | Description |
|---|---|---|
| P0 | W5-6 P1 chip encyclopedia depth | NTAG21x family, UCODE 9 standalone, UCODE 8 standalone, Monza R6 family, MIFARE DESFire EV3 commands — ~5 deep guide pages |
| P1 | W10 compare-cluster depth pass | Extend 15 thin `/compare/*` pages from stub to 700+ words each |
| P2 | Backfill chip-family tags on rfid-keyfob / rfid-wristband sub-indexes | Most landing pages omit specific chip names; a short pass on 30–40 SKU summaries would grow the chip-filter coverage from 13 % to ~40 % without any new regex work |

---

## 8. Push reminder

```
cd /Users/zhangping/Projects/Playground
git push origin main
```
