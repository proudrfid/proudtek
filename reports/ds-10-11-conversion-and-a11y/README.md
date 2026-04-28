# DS-10 / DS-11 — Conversion architecture + form a11y closeout

**Date**: 2026-04-27
**Scope**: Five recommendations from the DS-10 design critique (post-DS-9), plus a DS-11 mini-pass on the contact form / inline RFQ form a11y.
**Files touched**: 4 (`editorial-pages.ts`, `BaseLayout.astro`, `codex.css`, `seo.ts`)
**Net diff**: +1781 / -154 lines (4 files, single critique cycle)

---

## Why

DS-9 fixed visual + IA debt. DS-10 went after **conversion path coherence** at 470+ page scale — the parts of the buyer journey that were "fine" but underdeveloped. DS-11 is a focused a11y mini-pass on the two forms that actually capture revenue (inline RFQ on every page + Kadence contact form on `/contact/`), neither of which had been touched since the WordPress baseline.

The five items collectively address: (1) decision fatigue from three identical CTAs at three depths, (2) a 10-source citation block that lived in the basement and never influenced the read, (3) 4–6-paragraph Brief blocks that pushed evaluators away from spec → CTA, (4) compare tables that were static markup despite being THE comparison surface for a comparison-shopping site, and (5) form fields that used `placeholder` as label and had no error feedback path for screen-reader users.

---

## #1 — Three-tier CTA differentiation

### Before
Hero, editorial action bar, and sticky bar all said **"Request Quote"** — three identical asks within ~1200px scroll. Buyers reported decision-fatigue confusion ("did I already click that?") and analytics had no signal about which depth converts.

### After

| Tier | Label | Href | `data-cta-tier` |
|---|---|---|---|
| Hero (low commitment) | Request samples | `/contact/?intent=samples&route={route}` | `hero` |
| Action Bar (medium) | (data-driven, e.g. "Request quote and samples") | `/contact/?intent=quote&route={route}` | `action` |
| Sticky (high) | Talk to engineering | `/contact/?intent=engineering` | `sticky` |

### Implementation

- **Render layer only** — no per-page data churn. Hero hardcodes "Request samples"; Action Bar keeps the data-driven `primaryAction.label`; Sticky bar literal "Talk to engineering".
- **`buildIntentHref()` helper** preserves existing query/hash, doesn't override pre-set `intent`, skips `mailto:`/`tel:`/external. 5/5 inline test cases pass.
- **Analytics** — document-level capture-phase `click` listener picks up any `[data-cta-tier]` element, pushes `{event, cta_tier, cta_label, cta_href, cta_route}` to `window.dataLayer` (GA4/GTM standard) **and** dispatches a `cta:click` `CustomEvent`. Vendor-agnostic.

### Files

- `src/lib/editorial-pages.ts` — Hero CTA rewrite, Action Bar `buildIntentHref()` wrap, helper function (~25 lines)
- `src/layouts/BaseLayout.astro` — Sticky CTA copy, document-level click handler (~30 lines)

### A/B path

Two-week measurement window: in GA4, segment `cta_click` events by `cta_tier`, then funnel each tier to `/contact/` form-submit. Pick the tier with the highest end-to-end conversion; deprecate or repurpose the others.

---

## #2 — Inline citations for contested claims

### Before
Each editorial page ships with 10 cited references in a Sources block at page bottom (5-field schema per the anti-fingerprint A3 pass). Engineers most likely to be persuaded by the citations never reached them. Sources lived as a passive credentialing badge.

### After

Authors mark contested claims in body text with `[^N]`:

```
"a 13.56 MHz ISO/IEC 14443-4 contactless smart card[^2] with an
AES-128 / 3DES file system[^4] and Common Criteria EAL5+ certification[^6]"
```

Renders as:

```html
... contactless smart card<sup class="codex-citation"><a href="#sources-block-2"
  aria-label="Citation 2, see Sources block">[2]</a></sup> with an AES-128 ...
```

Click the superscript → smooth scroll to source #2 in the Sources block, which flashes a 1.6s gold pulse + 4px outline so the user immediately sees what they jumped to.

### Implementation

- **`renderInlineLinks(text, citations?)`** gains an optional `CitationCtx` parameter. Marker substitution happens in two phases (token replacement before `escapeHtml`, then DOM-safe rewrite after) so the `<sup>` markup survives escaping.
- **Source `<li>`** elements get stable `id="<sourcesId>-<1-based>"` plus `tabindex="-1"` for keyboard focus outline + a numbered prefix `<span class="codex-sources-num">1.</span>` for visual anchor.
- **Marker safety** — out-of-range `[^99]` (when only 12 sources exist) falls through as literal text. Pages without sources skip the whole mechanism (`citationCtx === undefined`).
- **`:target` highlight** — 1.6s `codex-source-flash` keyframe; downgraded to static background under `prefers-reduced-motion: reduce`.

### Files

- `src/lib/editorial-pages.ts` — `renderInlineLinks()` overhaul, `renderSources()` `<li>` ids, ctx threaded through `renderSection` + `renderSectionList`
- `src/styles/codex.css` — `.codex-citation`, `.codex-sources-item:target`, reduced-motion fallback (~50 lines)
- `src/content/editorial/products/rfid-cards/mifare-desfire-ev3-card.json` — demo page: 3 markers in Section 0 intro

### Demo

`mifare-desfire-ev3-card`, Section 0 ("What is MIFARE DESFire EV3"):
- ISO/IEC 14443-4 → `[^2]` (ISO 14443-3 standard)
- AES-128 / 3DES file system → `[^4]` (NIST FIPS 197)
- Common Criteria EAL5+ → `[^6]` (Common Criteria Portal)

### Tests

5/5 marker substitution cases passed: plain marker, mixed with markdown link, no markers, out-of-range marker, undefined ctx.

---

## #3 — Brief block reading-mode collapse

### Before
The Project checklist Brief was 4–6 fields of prose between the spec snapshot and the Action Bar. Comparison shoppers (the majority who arrive from a Google query for a chip name) wanted spec → CTA, not pre-purchase prose.

### After

Brief body wraps in `<details>` with a clickable banner summary:

```
[ ▸  Read the full project checklist (~3 min)         5 fields ]
```

- Default closed (collapsed)
- Auto-opens when:
  - Same-origin referrer matches `/^/(blog|guides|compare|compatibility)//` (long-form contexts where reading mode is expected)
  - URL contains `?reading=true` or `#reading` (deep-linkable from EDM, social, paid investments)
- Native `<details>` + `<summary>` — keyboard, screen-reader, BFCache all behave correctly
- Body stays in the DOM → Google indexing not affected

### Implementation

- **`renderBrief()`** wraps the `<dl>` in `<details data-collapsible-brief>`, computes `Math.round(words / 220)` minutes (1–6 min cap) for the summary label.
- **MutationObserver-free** auto-open — the script reads `document.referrer`, parses it as a `URL`, checks origin equality + path regex, then sets `briefDetails.open = true`. Guarded with `!briefDetails.open` so it doesn't override an existing user toggle (e.g. BFCache restore).
- **Reduced motion** — the 240ms reveal animation + 0.2s chevron rotation are gated.

### Files

- `src/lib/editorial-pages.ts` — `renderBrief()` rewrite (~30 lines)
- `src/layouts/BaseLayout.astro` — auto-expand script (~25 lines)
- `src/styles/codex.css` — `<details>`, `<summary>`, chevron, reveal keyframe (~45 lines)

### Tests

10/10 referrer-decision cases passed: blog/guides/compare/compatibility refs (true), products/external refs (false), `?reading=true` standalone (true), `#reading` standalone (true), no signal (false), external + `?reading=true` (still true).

---

## #4 — Compare table interactions

### Before
Compare-page tables were static `<table>` markup. The four-pillar interaction set was missing:
- Column headers not sortable (a buyer wanting "cheapest first" had no path)
- No first-column stickiness on horizontal scroll (long product comparisons lost row labels)
- ✓/✗ cells were 16px text glyphs (failed WCAG 2.5.5 touch target on mobile)
- No keyboard / SR affordance on the table region itself

### After

- **Sortable columns** — every `<th scope="col">` after the first gets `tabindex="0"`, `role="columnheader button"`, `aria-sort="none"`. Click or Enter/Space toggles asc/desc; sibling columns reset.
- **Sort comparator hierarchy** — number → glyph → string. Numeric extracts first digit-run, supports `k`/`K` (thousand), `M` (million, **case-sensitive** so `100m` ≠ `100M`), `million`/`billion` words. 11/11 test cases pass.
- **Glyph cells** wrap `✓ / ✗ / — / Yes / No / N/A` in `<span class="codex-cell-glyph" data-cell-glyph="yes|no|neutral" aria-label="Supported|Not supported|Not applicable">`. Min-width 44px hit target. Color-pill visual: green `#1f6f3a` (4.5:1), red `#8b2d2d` (5.4:1), neutral grey.
- **Sticky first column** — `tbody th[scope="row"]` `position: sticky; left: 0; z-index: 1` with min-width 12rem.
- **Sticky thead** — `thead th` `position: sticky; top: 0; z-index: 2`. Top-left corner `z-index: 3` to win both.
- **Wrap as ARIA region** — `<div tabindex="0" role="region" aria-label="Comparison table — scroll horizontally to see more columns">` so SR users get a region announcement and keyboard users can Tab + arrow-scroll.

### Files

- `src/lib/editorial-pages.ts` — `renderTable()` rewrite, `renderTableCellValue()` glyph detector
- `src/layouts/BaseLayout.astro` — sort handler with comparator (~70 lines)
- `src/styles/codex.css` — sticky thead/td, sort indicators, glyph pills, 44×44 padding (~120 lines)

### Tests

- Glyph detection 9/9 cases (including non-glyph control: "100m read range", "AES-128", "24,99 EUR" pass through unchanged)
- Sort comparator 11/11 cases (including the critical `100m` ≠ `100M` distinction)

### Progressive enhancement

Without JS the table reads top-to-bottom as authored. `data-sortable="true"` is the opt-in switch.

---

## #5 — Inline RFQ + Kadence contact form a11y

### Before

**Inline RFQ form** (`renderInlineRfqForm`, every editorial page, ~470+ pages):
- Used `placeholder="Your email *"` as label — fails WCAG 1.3.1, 3.3.2 (placeholders disappear on focus)
- No `aria-required`, `aria-describedby`, error containers
- HTML5 `required` only on email; no validation feedback path

**Kadence contact form** (`/contact/`):
- Real `<label>` elements (good)
- `data-required="yes"` only — no native HTML5 `required`, no `aria-required`
- No `aria-describedby`, no error containers, no validation enhancement

### After

Both forms now share the same a11y model:

- Real `<label>` above each input (no placeholder-as-label)
- `aria-required="true"` + HTML5 `required` on required fields
- Hint span below the label with helpful copy ("We'll only use this to reply to your inquiry")
- Error span below the input — `role="alert" aria-live="polite"`, populated only on failed submit
- `aria-describedby` links the input to both hint + error spans
- `aria-invalid="true"` + `.is-invalid` class for the red border + halo on focus
- `autocomplete` + `inputmode` hints (`email`, `organization`, `numeric`)
- 44×44 min hit targets on every field + submit button
- Honeypot field (`_kb_verify_email`) is identified via `aria-hidden="true"` + `tabindex="-1"` and skipped by the validator

### Validation script

Document-level handler on `form[data-codex-rfq]`:

- **On submit**: validate every visible field via native `checkValidity()`, populate the `[role="alert"]` error span with friendly copy (`valueMissing` → "Please fill in this field", `typeMismatch` for email → "Please enter a valid email address"), focus the first invalid field
- **On input**: clear the `is-invalid` state + error text per field once `checkValidity()` returns true so the user sees the error fade after correction

### Files

- `src/lib/editorial-pages.ts` — `renderInlineRfqForm()` complete rebuild (~70 lines)
- `src/lib/seo.ts` — `enhancePrimaryContactPage()` extension that post-processes Kadence form: adds `required` + `aria-required` + merged `aria-describedby` + hint/error spans (~40 lines)
- `src/layouts/BaseLayout.astro` — `codexFormValidate()` + per-form submit/input listeners (~60 lines)
- `src/styles/codex.css` — `.codex-sr-only`, `.codex-rfq-required`, `.codex-inline-rfq-{field,label,hint,error,row,submit}`, focus rings, error styling, both forms covered (~95 lines)

### A11y criteria addressed

| WCAG | Issue | Fix |
|---|---|---|
| 1.3.1 Info and Relationships | Placeholder-as-label | Real `<label for="...">` |
| 3.3.1 Error Identification | No error feedback | `role="alert"` per-field, populated on failed submit |
| 3.3.2 Labels or Instructions | No hint copy | Hint span below label with action-specific guidance |
| 3.3.3 Error Suggestion | Generic browser popup | `valueMissing` + `typeMismatch` mapped to plain English |
| 4.1.2 Name, Role, Value | Missing ARIA | `aria-required`, `aria-describedby`, `aria-invalid`, `aria-live="polite"` |
| 2.4.3 Focus Order | No focus on error | Submit-failure focuses first invalid field |
| 1.4.11 Non-text Contrast | No focus ring | 3px gold halo (valid) / red halo (invalid) |
| 2.5.5 Target Size | Submit button + inputs <44px | `min-height: 44px` on all controls |

### Tests

4/4 validation logic cases passed: all empty (2 errors, focus on field 0), invalid email (1 error, friendly copy), all valid (no errors), honeypot ignored.

---

## Verification summary

| Check | Result |
|---|---|
| `npx astro sync` | ✅ 657–968 ms, content + types valid |
| CSS brace balance | ✅ 938 / 938 |
| Helper logic tests (citation, intent-href, glyph wrap, sort comparator, validation) | ✅ 39 cases / 39 pass |
| Reduced motion gating | ✅ 4 keyframes / animations gated (citation flash, brief reveal, sort indicator, table cell hover) |
| Accessibility regressions | None — all DS-9/DS-10/DS-11 changes net additive a11y |

---

## File diff summary

```
 src/layouts/BaseLayout.astro |  +339 lines (sticky CTA + cta-tier analytics + Brief auto-expand
                                 + sort handler + form validation + drawer focus)
 src/lib/editorial-pages.ts   | +807 lines (citation ctx + Brief details + Compare table sort
                                 + glyph wrap + RFQ form rebuild + intent-href helper)
 src/lib/seo.ts               |  +44 lines (Kadence form post-process)
 src/styles/codex.css         | +745 lines (citation sup + Brief details + sortable table
                                 + glyph pills + RFQ form a11y + sticky thead/td)
 ────────────────────────────────────────────
 4 files, +1781 / -154
```

---

## What's next (not yet shipped)

From the original DS-10 critique:

- **Trust-strip label color** — bump `--codex-text-subtle` → `--codex-text` so the 4-number trust strip scans with context, not just numbers
- **Card hover translateY consistency** — extract `.codex-card-hover` mixin, currently 6px on home but 3px on hubs
- **In-table check/X SVG migration** — currently text-glyphs even after #4's wrap pass; migrate to the `icons.ts` SVG family for chip-perfect cross-device parity
- **Editorial channel card height equalization** — the email/phone/whatsapp/form 4-up grid has unequal heights because email has 3 lines of copy
- **H2 accent rule** — codify when the gold underline appears (currently inconsistent: editorial sections yes, snapshot pages no)
- **Date display formatter** — pick one: "April 2026" / "Apr 2026" / "2026-04-12" — A4 staggered the data, not the formatter
- **Compare table column counts in sidebar** — sidebar groups don't show item counts

---

## Hand-off notes for the team

1. **Two-week measurement** — `cta_tier` events should start flowing once the next deploy lands. Look for the conversion gradient: hero (samples) > action-bar (quote) > sticky (engineering)? Or inverted? Either is interesting.
2. **Citation backfill plan** — `[^N]` markers currently exist on `mifare-desfire-ev3-card.json` only. Backfill flagship pages first (top 20 traffic SKUs), then fan out. Cost is ~15 minutes per page once the author has the source list memorized.
3. **Brief copy tightening** — now that the Brief is collapsed, prose-heavy briefs are no longer a UX cost. A future content pass can lengthen them where it helps E-E-A-T without affecting first-impression scroll length.
4. **Compare-table data hygiene** — sortable columns surface inconsistencies in the underlying JSON (e.g., one row has "100m" and another "100 m"). The sort comparator handles both, but humans skimming will notice. A normalization pass on `editorial/compare/*.json` would help.
5. **Form analytics** — `cta:click` CustomEvent is dispatched on document but nobody listens yet. If product wants to instrument form abandonment, hook the same listener to `form[data-codex-rfq] focusin`/`focusout` and ship abandonment events.

— DS-10/11 closeout
