# Design System — Proudtek

This document codifies the design system already implemented in `src/styles/codex-tokens.css` and the Kadence theme it sits on top of. It is **descriptive**, not prescriptive — the system below reflects what the site actually ships today. Future agents and contributors should read this before making any visual or UI changes.

The source of truth is `src/styles/codex-tokens.css`. If a token in this doc diverges from the CSS file, the CSS wins — update this doc to match.

---

## Product Context

- **What this is:** Static Astro mirror of `proudtek.com`, a Shenzhen-based B2B RFID/NFC manufacturer.
- **Who it's for:** Procurement teams from retail (Walmart-mandate compliance), aerospace MRO, data-center operators, brand-protection programs, hotel/access-card buyers. They cross-reference vendor datasheets — chip specs and certifications are load-bearing.
- **Space/industry:** Industrial RFID/NFC supply, factory-direct B2B. Adjacent: industrial labels, smart cards, hardware identification.
- **Project type:** Hybrid editorial + e-commerce-style marketing site. Most pages are captured WordPress/Kadence HTML snapshots; a growing subset (`src/content/editorial/**/*.json`) renders through native Astro components.

## Aesthetic Direction

- **Direction:** Warm editorial / luxury-procurement.
- **Decoration level:** Intentional — warm cream backgrounds, subtle gold borders, gradient washes on hero rails. Not minimal (too sterile for B2B trust signals), not expressive (procurement readers want clarity).
- **Mood:** Trustworthy, established, serious-but-not-boring. Reads as a premium trade publication rather than a typical Chinese factory site. Cyan CTAs add a modern-tech inflection that keeps it from feeling old-fashioned.
- **Tension that defines the system:** Warm earth tones (brown / gold / cream) for editorial body, cool cyan / navy for action moments. This tension is the memorable thing — every other page-type accent (teal / steel / forest) sits in the warm-cool middle.

## Typography

Fonts are loaded via Kadence's font stack at the WordPress layer; codex tokens override only where editorial typography needs a different role.

- **Display / Hero (headings):** `"Lora", Georgia, "Times New Roman", serif` — token `--codex-font-heading`. Serif chosen for editorial trust; pairs with warm earth-tone palette.
- **Body:** Inter via Kadence's `--global-body-font-family` (with `--codex-font-body` system-stack fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif`).
- **Mono / Code:** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` — token `--codex-font-mono`.
- **Loading:** Inter is preloaded as Latin-subset woff2 in `SeoHead.astro`. Lora loads via Kadence's font stack. Global `font-display: swap !important` enforced on every `@font-face` in `codex-tokens.css` to keep render unblocked.

**Type scale** (rem-based, 16px root):

| Token | Value | Use |
| --- | --- | --- |
| `--codex-text-2xs` | 0.7rem (~11.2px) | Micro caption |
| `--codex-text-xs` | 0.75rem (12px) | Meta, captions |
| `--codex-text-xs-plus` | 0.8rem (~12.8px) | Absorbs 0.78/0.8/0.82 |
| `--codex-text-sm` | 0.85rem (~13.6px) | Secondary text |
| `--codex-text-sm-plus` | 0.9rem (~14.4px) | Absorbs 0.88/0.9/0.92/0.95 |
| `--codex-text-base` | 1rem (16px) | Body |
| `--codex-text-base-plus` | 1.1rem (~17.6px) | Absorbs 1.05/1.1 |
| `--codex-text-md` | 1.125rem (18px) | Lead body |
| `--codex-text-lg` | 1.25rem (20px) | h4 / large link |
| `--codex-text-lg-plus` | 1.4rem (~22.4px) | Absorbs 1.35/1.4 |
| `--codex-text-xl` | 1.5rem (24px) | h3 |
| `--codex-text-xl-plus` | 1.75rem (28px) | Absorbs 1.7/1.75/1.8 |
| `--codex-text-2xl` | 2rem (32px) | h2 |
| `--codex-text-3xl` | 2.5rem (40px) | h1 / hero |

The `-plus` half-step tiers (DS-8) were introduced to absorb pre-existing off-grid literals with ≤0.05rem (≤0.8px) of drift — imperceptible. Prefer the canonical tier for new code.

**Line heights:**
- `--codex-leading-tight: 1.2` — headings (h1-h6)
- `--codex-leading-snug: 1.35` — secondary headings, cards
- `--codex-leading-normal: 1.5`
- `--codex-leading-relaxed: 1.65` — body, long-form
- Body default: `--codex-line-height-base: 1.6` (PR-6 baseline, hits the 1.5-1.65 BBC GEL window for long-form readability).

**Font weights:** 400 / 500 / 600 / 700 / 800.

**Content measure:** `--codex-content-measure: 70ch` on `:where(.entry-content, .codex-editorial-section, .codex-editorial-card, .codex-blog-index, .codex-rfq-hero) :where(p, li, dd)`. Mid-window of the 45-75ch optimal-measure range. Default editorial sections also **center** their content (≥1025px) so prose isn't pinned left: the column is fluid `--codex-reading-column` (`min(72rem, 92%)` — rem-capped, not ch, so headings and body share an edge) and wide data elements use `--codex-reading-column-wide` (`min(88rem, 100%)`). See Layout → Editorial reading column.

## Color

Approach: **balanced** — a warm-brown / gold core for editorial chrome, with semantic accents for action (cyan), procurement forms (navy), and page-type theming (teal / steel / forest). Status colors (error / success / warning) are AA-compliant.

### Brand core (warm earth)

| Token | Hex | Role |
| --- | --- | --- |
| `--codex-dark` | `#291c0e` | Primary text + dark surfaces |
| `--codex-dark-mid` | `#6c5127` | Dark gradient mid-stop |
| `--codex-gold` | `#c39a5f` | Brand gold, gold-on-dark accents |
| `--codex-gold-light` | `#d4a755` | Brighter gold variant (trust strip) |
| `--codex-gold-muted` | `#6d5a3a` | Muted gold for secondary surfaces |

### Text

| Token | Hex | Role |
| --- | --- | --- |
| `--codex-text` | `#291c0e` (via `--global-palette3`) | Body text, default |
| `--codex-text-strong` | `#1a1a1a` | High-contrast strong text |
| `--codex-text-muted` | `#4f4f4f` (via `--global-palette4`) | Muted body / captions |
| `--codex-text-subtle` | `#5c5c5c` (via `--global-palette5`) | Tertiary text |

### Action / CTA

| Token | Hex | Role |
| --- | --- | --- |
| `--codex-cyan` | `#1fcefb` | Primary CTA, hero buttons |
| `--codex-cyan-hover` | `#15bce8` | Primary CTA hover state |
| `--codex-color-accent` | `#1f4e79` | RFQ / procurement form navy accent |
| `--codex-color-ink` | `#18242c` | RFQ form text ink |
| `--codex-color-ink-secondary` | `#3a4a52` | RFQ form secondary text |

### Page-type accents

Each industry / category page can adopt a coloured rail without abandoning the warm core. The `-light` and `-border` variants are the soft-fill / border-tint partners.

| Token | Hex | Page type |
| --- | --- | --- |
| `--codex-teal` | `#3d6b6b` | Editorial / guide content |
| `--codex-steel` | `#4a5568` | Industrial / heavy asset content |
| `--codex-forest` | `#2d6a4f` | Sustainability / compliance content |

### Status (WCAG AA against white at small text)

| Token | Hex | Contrast | Use |
| --- | --- | --- | --- |
| `--codex-error` | `#8b2d2d` | 7.59:1 | Form error, destructive |
| `--codex-success` | `#1f6f3a` | 5.46:1 | Positive confirmation, glyph pills |
| `--codex-warning` | `#b48a3a` | — | Reserved, not yet shipped |

Each status color has a `-tint` partner (10-12% alpha) for soft-fill backgrounds (RFQ error halos, comparison-table glyph pills).

### Borders

- `--codex-border: rgba(41, 28, 14, 0.12)` — default card / table border
- `--codex-border-light: rgba(41, 28, 14, 0.08)` — subtle divider
- `--codex-border-gold: rgba(195, 154, 95, 0.18)` — gold-tinted accent border

### Backgrounds & gradients

- `--codex-bg-warm: rgba(248, 246, 241, 0.92)` — warm cream surface
- `--codex-bg-warm-gradient` — vertical white-to-cream
- `--codex-bg-card` — vertical white-to-warm card fill
- `--codex-bg-hero` — radial gold-tinted top-right + warm-gradient base
- `--codex-gradient-dark: linear-gradient(135deg, #291c0e, #6c5127)` — dark-mode hero / footer
- `--codex-gradient-gold` / `--codex-gradient-gold-hover` — gold CTAs / chips

### Surfaces & reclaimed tokens (DS-17, 2026-06-29)

Names for colors that previously shipped as raw hex literals (100 callsites reclaimed, **zero visual change** — each token equals the exact value it replaced). Extends the RFQ/procurement cool sub-palette and adds the missing white surface/inverse and dark-gradient-partner tokens. Proposal + per-callsite map: `COLOR_TOKEN_PROPOSAL_2026-06-29.md`.

| Token | Hex | Role |
| --- | --- | --- |
| `--codex-surface` | `#ffffff` | White panel / card background |
| `--codex-surface-cool` | `#fcfdfe` | Cool-tinted form card surface |
| `--codex-surface-muted` | `#fafafa` | Neutral light surface (contact) |
| `--codex-text-inverse` | `#ffffff` | White text on dark / coloured bg |
| `--codex-color-ink-strong` | `#0a1a2c` | Deeper ink than `--codex-color-ink` |
| `--codex-steel-muted` | `#55687a` | Steel-blue secondary text |
| `--codex-steel-soft` | `#7a8690` | Steel-blue tertiary text |
| `--codex-steel-subtle` | `#8a949c` | Steel-blue placeholder / faint text |
| `--codex-border-cool` | `#e5e9ed` | Cool form border / divider |
| `--codex-border-cool-light` | `#eef1f4` | Cool hairline divider |
| `--codex-teal-dark` | `#2c5454` | Dark partner for `--codex-teal` gradients |
| `--codex-forest-dark` | `#1b4332` | Dark partner for `--codex-forest` gradients |

Near-neighbour values (`#f5f9fc`, warm creams, generic greys) and the WhatsApp brand green (`#25d366`) were intentionally left raw (zero-regression-only scope).

### Dark mode

Not implemented as a full theme. Strategy: `color-scheme: light dark` is declared so the UA auto-adapts scrollbars, form controls, default checkbox/radio, and date pickers. Full Kadence palette inversion is explicitly out of scope.

## Spacing

4px base unit, rem-denominated so it scales with root font-size. The `-plus` half-step tiers (DS-8) absorb pre-existing organic literals with ≤0.05rem of drift.

| Token | Value | Use |
| --- | --- | --- |
| `--codex-space-0` | 0 | — |
| `--codex-space-0-5` | 2px | Hairline spacer |
| `--codex-space-1` | 4px | Tight inline gap |
| `--codex-space-1-plus` | ~6px | Absorbs 0.3-0.45rem |
| `--codex-space-2` | 8px | Small cell padding |
| `--codex-space-2-plus` | ~10px | Absorbs 0.55-0.7rem |
| `--codex-space-3` | 12px | Default inline gap |
| `--codex-space-3-plus` | ~14px | Absorbs 0.85-0.9rem |
| `--codex-space-4` | 16px | Standard block padding |
| `--codex-space-4-plus` | ~18px | Absorbs 1.1-1.2rem |
| `--codex-space-5` | 20px | Card padding |
| `--codex-space-6` | 24px | Section inner spacing |
| `--codex-space-6-plus` | ~26px | Rare intermediate |
| `--codex-space-7` | 28px | — |
| `--codex-space-8` | 32px | Section block spacing |
| `--codex-space-9` | 36px | Between 8 and 10 |
| `--codex-space-10` | 40px | — |
| `--codex-space-11` | 44px | Nav strip height, touch min |
| `--codex-space-12` | 48px | Large block spacing |
| `--codex-space-14` | 56px | — |
| `--codex-space-16` | 64px | Hero / section gutter |
| `--codex-space-20` | 80px | — |

**Touch-target floor:** `--codex-touch-min: 44px` (WCAG 2.5.5). Required for sticky-CTA dismiss, rail close button, table cells, RFQ submit.

**Density:** Comfortable. Editorial card padding 20-24px, section block spacing 32-48px, hero gutters 64-80px.

## Layout

- **Approach:** Hybrid — Kadence row/column grid for snapshot pages, native Astro components for editorial JSON pages.
- **Kadence row layout:** `.kt-row-column-wrap` uses CSS Grid (`grid-template-columns: minmax(0, 1fr)` mobile; `repeat(N, 1fr)` desktop). Per-row inline `<style>` blocks emit desktop/tablet breakpoints with `(min-width: 1025px)`. Codex tokens **do not** override these — earlier polyfill attempts with `display: flex` broke every multi-column row.
- **Codex row spacing:** `.kb-row-layout-wrap { margin-bottom: 20px }` — only spacing tweak applied site-wide.
- **Max content width:** Kadence-controlled (typically 1290px center column).
- **Editorial reading column (2026-07-06):** default (non-split) `.codex-editorial-section` blocks center their content in the fluid `--codex-reading-column` (`min(72rem, 92%)`) band from ≥1025px, so prose no longer pins to the left and leaves a lopsided blank right half on wide/rail pages. The column is **fluid** (not a fixed width) so it grows with the content area and fills ~92% of it up to the cap, instead of floating as a narrow strip that leaves big symmetric gutters on wide/rail screens. The band is **rem, not ch**, on purpose: a ch measure is font-relative, so the larger heading font would cap at a wider column than the body and their left edges would not align. Wide data elements (comparison tables, feature grids, compare panels, timelines, stat bars, figures) center in a wider `--codex-reading-column-wide` (`min(88rem, 100%)`) band. Centering uses physical `margin-left/right: auto` longhands (not `margin-inline`) so they reliably beat the `margin: 0 0 …` shorthand on section headings across engines. Block flow is preserved, so paragraph margins keep collapsing and vertical rhythm is unchanged. `split` / `columns` layouts opt out via their `[data-section-layout]` attribute.
- **Border radius scale:**

| Token | Value | Use |
| --- | --- | --- |
| `--codex-radius-sm` | 8px | Form inputs, small pills |
| `--codex-radius-card` | 16px | Cards, panels |
| `--codex-radius-card-lg` | 20px | Hero shells |
| `--codex-radius-card-xl` | 24px | Conversion shells, large surfaces |
| `--codex-radius-pill` | 999px | Pills, chips, focus dots |

### Z-index — canonical 5

| Token | Value | Use |
| --- | --- | --- |
| `--codex-z-base` | 0 | Default flow |
| `--codex-z-raised` | 1 | In-card stacking (sticky thead, image overlays) |
| `--codex-z-sticky` | 30 | Site chrome (header, sticky nav) |
| `--codex-z-dropdown` | 1000 | Dropdowns, sticky CTA, masthead surfaces |
| `--codex-z-modal` | 8000 | Modal, drawer, anything that should win |

Five legacy tokens are deprecated (`-surface` / `-header` / `-toast` / `-tooltip` / `-overlay`) but kept for backward compat. New code should prefer the canonical 5.

### Breakpoints

CSS custom properties can't be used inside `@media` queries, so these are declared in tokens for reference and the literal values must be kept in sync with them.

| Token | Value |
| --- | --- |
| `--codex-bp-sm` | 480px |
| `--codex-bp-md` | 768px (canonical mobile/tablet breakpoint) |
| `--codex-bp-lg` | 1024px |
| `--codex-bp-xl` | 1280px |

Plus one in-between tier in active use: **600px** (small-phone / large-phone
boundary — blog-index single-column, compare-panel collapse, cluster-grid
two-up). The 2026-06-11 typography audit consolidated 19 scattered query
archetypes (420/479/560/640/720/880/900/960/1000/1100px…) onto this 5-stop
family: `max-width` 480 / 600 / 767 / 1024, `min-width` 600 / 768 / 1025 /
1280 (+ the 1279 complement). Do not introduce new boundaries without
updating this table.

## Motion

**Approach:** Intentional — meaningful state transitions, no decorative animation. Hover/focus feedback prioritized.

**Duration scale:**

| Token | Value | Use |
| --- | --- | --- |
| `--codex-motion-instant` | 80ms | Immediate feedback (toggle background) |
| `--codex-motion-fast` | 150ms | Standard hover/focus |
| `--codex-motion-base` | 200ms | Cards, button press, panel |
| `--codex-motion-slow` | 400ms | Reveal, fade-in |
| `--codex-motion-deliberate` | 600ms | Page-level reveal, hero |

**Easing:**

| Token | Curve | Use |
| --- | --- | --- |
| `--codex-easing-out` | `cubic-bezier(0.25, 1, 0.5, 1)` | Enter (default) |
| `--codex-easing-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Move, position changes |
| `--codex-easing-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | Critical state changes |

**Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables all transitions and animations site-wide via `animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important`.

## Elevation

5-tier ladder replacing 3 legacy ad-hoc shadow tokens. Legacy tokens remain aliased for backward compat but are not for new code.

| Token | Value | Use |
| --- | --- | --- |
| `--codex-elevation-flat` | none | Flat surface |
| `--codex-elevation-rest` | `0 1px 3px rgba(41, 28, 14, 0.08)` | Default card |
| `--codex-elevation-hover` | `0 4px 12px rgba(41, 28, 14, 0.10)` | Card hover |
| `--codex-elevation-sticky` | `0 -4px 16px rgba(0, 0, 0, 0.10)` | Bottom sticky bar |
| `--codex-elevation-modal` | `0 16px 48px rgba(41, 28, 14, 0.18)` | Floating modal |

**Legacy tokens (do not use in new code):**
- `--codex-shadow` / `--codex-shadow-light` / `--codex-shadow-heavy`. Migration policy and the legacy callsites are documented inline in `src/styles/codex-tokens.css` and `docs/tokens.md` (the standalone `reports/ds-12-token-consolidation/SHADOW-MIGRATION-CHECKLIST.md` is no longer in the repo as of 2026-06-29). Two prominent shells (`.codex-editorial-hero`, `.codex-conversion-shell`) need design review before swap — there's no in-flow surface tier between `-hover` and `-modal`.

## Focus rings (WCAG 2.1 AA)

| Token | Value | Use |
| --- | --- | --- |
| `--codex-ring` | `#c39a5f` (gold) | Default keyboard focus ring |
| `--codex-ring-on-dark` | `#ffffff` | High-contrast ring on dark/gold CTAs |
| `--codex-ring-error` | `#8b2d2d` | Invalid form input ring |
| `--codex-ring-width` | 2px | Ring thickness |
| `--codex-ring-offset` | 2px | Ring offset from element edge |
| `--codex-ring-focus-glow` | `0 0 0 3px rgba(195, 154, 95, 0.30)` | Focus halo |
| `--codex-ring-error-glow` | `0 0 0 3px rgba(139, 45, 45, 0.30)` | Error halo |

Applied globally via `:focus-visible { outline: var(--codex-ring-width) solid var(--codex-ring); outline-offset: var(--codex-ring-offset); }`.

## CTA hierarchy

Three documented tiers from PR-7 (`codex-components.css`):

- `.codex-cta--primary` — filled cyan (`--codex-cyan`), white text. Used for the single primary action per view.
- `.codex-cta--secondary` — transparent dark-outline. Companion to primary, never appears alone.
- `.codex-cta--ghost` — white-outline, transparent fill. For video overlays and dark backgrounds.

The classes mirror existing hero button styling so they apply consistently to new `<a>` or `<button>`. Existing `.wp-block-cover button` rules continue to win for hero-specific overrides via higher specificity.

## Architecture notes

- **Source of truth for tokens:** `src/styles/codex-tokens.css`.
- **CSS load order:** `codex.css` imports `tokens` → `components` → `layout` → `pages` → `cluster-hub` → `rfq`. Page-specific overrides load last so they can override component defaults.
- **Kadence layer:** WordPress/Kadence base stylesheets load from `/site-assets/wp-content/themes/kadence/assets/css/` (bundled into `codex-kadence-bundle.<hash>.css` at build time by `scripts/build-kadence-css-bundle.mjs`). Codex tokens override or extend Kadence; the two are coupled — don't change Kadence's `--global-palette*` without testing the codex token chain.
- **Editorial vs snapshot:** Pages under `src/content/editorial/**/*.json` render through native Astro components and follow the codex tokens directly. Pages from the WordPress snapshot inherit Kadence first and codex second.
- **Body safety:** `body { overflow-x: clip; scroll-padding-bottom: 3.5rem }`. `overflow-x: hidden` was rejected because it disables sticky positioning on children; `clip` keeps sticky working.

## Anti-patterns (don't add)

These appeared during the design audit (May 2026) and were removed. Don't reintroduce:

- Multiple raw hex literals (`#1fcefb` / `#15bce8` etc.) instead of tokens — changing the brand accent meant a global search-and-replace.
- Off-grid spacing literals (0.3 / 0.45 / 0.85 rem) without using the `-plus` half-step tiers.
- New z-index integers outside the canonical 5 — use `--codex-z-*` tokens, never magic numbers like `z-index: 99` mid-stylesheet.
- New shadow values outside the elevation scale — use `--codex-elevation-*`, not ad-hoc `box-shadow` values.
- Full Kadence palette inversion for dark mode — out of scope, breaks Kadence's global stylesheet contract.
- AI-fabricated chip specs in product content (per `memory/feedback-verify-chip-claims.md`) — visual design tokens are stable, but factual claims must always cite a vendor source.

## Decisions Log

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-04-22 (DS-5) | WCAG 2.1 AA focus rings tokenized | Keyboard nav was inconsistent across hero, RFQ form, table; tokens unify ring width/color/offset |
| 2026-04-22 (DS-6) | 4px-base spacing scale + 11.2-40px type scale + canonical 5-layer z-index | Replace 14 scattered z-index integers + organic spacing/type literals |
| 2026-04-22 (PR-6) | Body `line-height: 1.6` + 70ch content measure | Audit found body at browser default (~1.2) failing BBC GEL 1.5-1.65 recommendation |
| 2026-04-22 (PR-7) | `.codex-cta--primary/--secondary/--ghost` codified | CTAs used three undocumented visual treatments across pages |
| 2026-04-27 (DS-8) | `-plus` half-step tiers added | Absorb pre-existing organic intermediate literals with ≤0.05rem drift |
| 2026-04-27 (DS-10/11) | Status colors reconciled to AA: `#8b2d2d` error (7.59:1), `#1f6f3a` success (5.46:1) | Original `#27ae60` failed WCAG 1.4.3 at 3.06:1 |
| 2026-04-27 (DS-12 #1) | 5-tier elevation scale, motion scale, `--codex-text-strong`, `--codex-touch-min: 44px` | Consolidate 3 legacy shadow tokens, formalize motion/touch tokens |
| 2026-04-27 (DS-12 #8B) | Z-index scale audited down to canonical 5; 5 tiers deprecated | Over-stratified original 10-tier scale |
| 2026-05-08 | `codex.css` split into 4 sub-files by responsibility | Original 6581-line file became unreadable |
| 2026-05-20 | DESIGN.md created via `/design-consultation` (codify path) | Document the system that already exists; provide future agents a reference |
| 2026-06-29 (DS-17) | 12 color tokens reclaimed from raw hex (white `surface`/`text-inverse`, RFQ cool-palette `steel-*` + `surface-cool`/`border-cool`, `color-ink-strong`, `teal-dark`/`forest-dark`) | 100 raw literals → `var(--codex-*)`, zero-regression (token == value, verified); ~30 near-neighbour/singleton/brand values left raw on purpose |
| 2026-07-06 | Balanced reading column: default editorial sections center a fluid rem-capped reading column (`--codex-reading-column` `min(72rem, 92%)`); wide data elements use a `min(88rem, 100%)` band. Fluid (not fixed) so the column fills wide/rail content areas instead of floating as a narrow strip; rem cap keeps heading + body edges aligned | Prose-only sections pinned text to the left of a full-width container, leaving a lopsided blank right half — 2,247 of 3,442 sections across 512 pages. Split-layout figure pairing also added to image-bearing sections (DESFire post) |
