# DS-12 — Design system token consolidation + documentation

**Date**: 2026-04-27
**Scope**: Audit-driven token enforcement and documentation pass on the Codex design system. Two phases: Phase 1 = token-layer consolidation; Phase 2 = first formal documentation.
**Files touched**: 1 source (`src/styles/codex.css`) + 4 new docs (`docs/{README,tokens,components,conventions}.md`)
**Net diff**: +839 / -65 lines on `codex.css`; +1438 lines of new documentation

---

## Why

After three rounds of design audits (DS-9 / DS-10 / DS-11) shipped meaningful component improvements, the underlying token layer hadn't been touched. The site had **110 tokens defined** but **155 hardcoded hex literals**, **207 raw rgba()**, **395 arbitrary px**, **113 `!important`**, and zero documentation. The design system existed *technically*, but the contract between author and consumer was loose — three different gold hex codes (`#c39a5f` / `#d4a755` / `#b08d57`) coexisted in production; transition durations (`0.15s` / `0.2s` / `0.4s`) were spelled out as literals 36+ times; status colors (DS-10/11 ✓/✗ pills, DS-11 form errors) were hardcoded `#1f6f3a` / `#8b2d2d` rather than tokens.

DS-12 was a deliberate audit + cleanup pass. The audit produced a **55/100 score** with a 38-item issue list. Phase 1 closed the highest-ROI five items in the issue list. Phase 2 wrote the first formal documentation — closing the system's biggest unmitigated risk (zero docs across 60+ components).

---

## Phase 1 — Token enforcement

### Audit baseline

The audit scan turned up:

```
Tokens defined:   110
Hardcoded hex:    155 literals
Raw rgba():       207 calls
Arbitrary px:     395 occurrences
!important:       113 declarations
Mismatched fallbacks (var(--token, wrong-value)): 17
Naming drift:     5 categories (rail/sidebar, card prefixes, cta types, etc.)
Component docs:   0
```

### #1a — Add 22 new tokens

Tokens added to `:root` in `src/styles/codex.css`:

```css
/* Status colors — reconciled to AA-compliant values */
--codex-error: #8b2d2d;             /* was #c0392b @ 5.13:1 → now 7.59:1 AAA */
--codex-error-tint: rgba(139, 45, 45, 0.10);
--codex-success: #1f6f3a;           /* was #27ae60 @ 3.06:1 (AA fail!) → now 5.46:1 AA */
--codex-success-tint: rgba(31, 111, 58, 0.12);
--codex-warning: #b48a3a;           /* pre-allocated */

/* Strong text + touch */
--codex-text-strong: #1a1a1a;
--codex-touch-min: 44px;

/* Gold extension */
--codex-gold-light: #d4a755;        /* promoted from organic drift */

/* Motion scale */
--codex-motion-instant: 80ms;
--codex-motion-fast: 150ms;
--codex-motion-base: 200ms;
--codex-motion-slow: 400ms;
--codex-motion-deliberate: 600ms;
--codex-easing-out: cubic-bezier(0.25, 1, 0.5, 1);
--codex-easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--codex-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);

/* Elevation ladder */
--codex-elevation-flat: none;
--codex-elevation-rest: 0 1px 3px rgba(41, 28, 14, 0.08);
--codex-elevation-hover: 0 4px 12px rgba(41, 28, 14, 0.10);
--codex-elevation-sticky: 0 -4px 16px rgba(0, 0, 0, 0.10);
--codex-elevation-modal: 0 16px 48px rgba(41, 28, 14, 0.18);

/* Focus rings */
--codex-ring-error: var(--codex-error, #8b2d2d);
--codex-ring-focus-glow: 0 0 0 3px rgba(195, 154, 95, 0.30);
--codex-ring-error-glow: 0 0 0 3px rgba(139, 45, 45, 0.30);
```

**Why these specifically**: each one was needed to plug a known leak. Status tints + AA-compliant primaries closed the gap left by DS-10/11 hardcoded values. Motion scale gave the site a place to tune pace centrally. Elevation ladder gave components a consistent vocabulary for depth. Touch-min formalized the WCAG 2.5.5 floor that was already enforced ad-hoc. `text-strong` + `gold-light` named drift that was already happening.

### #1b — Sync mismatched fallbacks

The biggest concrete drift was `var(--codex-gold, #fallback)` where the fallback hex *didn't match* the actual token resolution. Three different colors were running:

```
var(--codex-gold, #d4a755)  × 11   ← wrong fallback (token resolves to #c39a5f)
var(--codex-gold, #b08d57)  × 6    ← wrong fallback
var(--codex-gold, #c39a5f)  ← correct
```

A new contributor reading a `#d4a755` fallback had no way to know that the real value was `#c39a5f`. Both sweeps `replace_all`'d to the canonical fallback. **17 fallback values reconciled.**

### #1c — Migrate DS-10/11 status colors to tokens

DS-10 (compare-table glyph pills) and DS-11 (RFQ form error states) had shipped with hardcoded `#1f6f3a` / `#8b2d2d` / corresponding rgba tints, plus `rgba(195, 154, 95, 0.30)` for the focus-ring halo. After Phase 1 #1a added the proper tokens, six rules migrated:

| Rule | Before | After |
|---|---|---|
| `.codex-cell-glyph[data-cell-glyph="yes"] { color }` | `#1f6f3a` | `var(--codex-success)` |
| `.codex-cell-glyph[data-cell-glyph="yes"] { background }` | `rgba(31, 111, 58, 0.12)` | `var(--codex-success-tint)` |
| `.codex-cell-glyph[data-cell-glyph="no"] { color }` | `#8b2d2d` | `var(--codex-error)` |
| `.codex-cell-glyph[data-cell-glyph="no"] { background }` | `rgba(139, 45, 45, 0.10)` | `var(--codex-error-tint)` |
| `.codex-inline-rfq-error { color }` | `#8b2d2d` | `var(--codex-error)` |
| `.is-invalid { border-color }` | `#8b2d2d` | `var(--codex-error)` |
| `.is-invalid:focus-visible { box-shadow }` | `0 0 0 3px rgba(139, 45, 45, 0.30)` | `var(--codex-ring-error-glow)` |
| Form `:focus-visible { box-shadow }` | `0 0 0 3px rgba(195, 154, 95, 0.30)` | `var(--codex-ring-focus-glow)` |
| Brief summary `:focus-visible { box-shadow }` | `0 0 0 3px rgba(195, 154, 95, 0.30)` | `var(--codex-ring-focus-glow)` |

**Side effect**: any pre-existing rule using `var(--codex-success)` or `var(--codex-error)` (e.g. legacy `border-left: 3px solid var(--codex-success)` in lines 4069 / 4080) automatically upgraded to the AA-compliant values. **Free site-wide a11y improvement.**

### #1d — Motion sweep

50+ rules spelled out transition durations as literals. Three patterns dominated:

| Literal | Count | Replaced with |
|---|---|---|
| `0.15s` | 22 in transitions (15 line hits) | `var(--codex-motion-fast)` |
| `0.2s` | 13 in transitions (11 line hits) | `var(--codex-motion-base)` |
| `0.4s` | 1 | `var(--codex-motion-slow)` |

**Result**: `0.15s` / `0.2s` / `0.4s` literals all → 0. Motion-fast / motion-base / motion-slow now used 16 / 13 / 3 times respectively. Future "speed up the site by 20%" is a 4-line edit.

### #1e — Reclassify 13 `#1a1a1a` usages

The top hardcoded color was `#1a1a1a` × 13. Critical discovery: **most "hardcoded" hex was actually fallback values inside `var(--codex-token, #fallback)`** — intentional safety nets, not real violations. But the 13 `#1a1a1a` instances split three ways once classified:

| Group | Count | Lines | Why | Fix |
|---|---|---|---|---|
| **A — Text on gold bg** | 3 | 681, 5231, 5400 | Near-black needed for max contrast on gold; warm-brown wouldn't have enough | `var(--codex-text-strong, #1a1a1a)` |
| **B — Body / heading text** | 9 | 388, 443, 465, 482, 571, 643, 3429, 3502, 4905 | Was `var(--codex-dark, #1a1a1a)` for body text — semantic mismatch (`--codex-dark` is brand surface, not text); fallback also wrong (token actually resolves to `#291c0e` warm brown, not near-black) | `var(--codex-text, #291c0e)` |
| **C — Dark brand surface** | 1 | 5177 (`.codex-footer { background }`) | Correctly using `--codex-dark` as a surface; only fallback mismatched | `var(--codex-dark, #291c0e)` (fallback fix only) |

The semantic insight: `--codex-dark` and `--codex-text` resolve to the same hex today (`#291c0e`) but mean different things. `--codex-dark` is a **surface** (footer bg, gradient end). `--codex-text` is **text content**. Six H1/H2/body rules were using `--codex-dark` when they should have been using `--codex-text` — a latent bug for any future dark-mode theming attempt. DS-12 #1e separates them properly.

**Result**: only 4 `#1a1a1a` literals remain in the file — 1 token definition + 3 fallbacks of the new `--codex-text-strong` token. All sourced.

---

## Phase 2 — Documentation

The audit's biggest single risk wasn't any specific token mismatch — it was **zero documentation across 60+ components**. A new contributor literally couldn't know whether `.codex-conversion-card` was current or legacy without reading every render call site. Phase 2 wrote three reference docs + a README index.

### `docs/tokens.md` (447 lines)

Every `--codex-*` token: category, value, when to use, when NOT to use. Organized by:
- Quick-reference table (13 categories)
- Color tokens (brand / text / surface / border / status / accent)
- Typography (size scale + line-height + weight + family)
- Spacing (with `+plus` half-step rationale)
- Radius / Elevation / Motion / Z-index / Rings / Touch / Breakpoints
- "How to add a new token" 5-step procedure
- "How to deprecate a token" 5-step procedure
- Token coverage targets table
- Changelog with DS-N traceability

Highlights:
- Documents the 8 deprecation candidates (`--codex-shadow-*`, `--codex-z-raised/surface`, `--codex-teal-*`, `--codex-forest-*`, `--codex-steel-*`)
- Records contrast ratios next to status colors so reviewers can spot AA violations
- Names the breakpoint quirk explicitly: CSS custom properties don't work in `@media`, so authors must keep literal + comment pairs in sync

### `docs/components.md` (667 lines)

The top 20 components by usage / business value. Each entry follows the same structure: purpose, where it renders, variants, states, a11y notes, HTML skeleton, don't list.

Coverage by score bucket:
- 9/10 components (4): Compare table, Sources block + citations, Brief details, RFQ form
- 8/10 components (4): Sticky CTA, Editorial section, Catalog rail, Resources rail
- 7/10 components (1): Hero CTA
- 6/10 components (4): Hub card, Trust strip, Editorial channels, Conversion shell
- 5/10 components (5): Spec table, Mega-menu, Snapshot card, Footer RFQ, Decision snapshot
- 3/10 components (1): Conversion card (legacy)
- Patterns / footer / breadcrumb / social row (5)

Each component lists at least one explicit "Don't" — anti-pattern with rationale. Adding a new component now has a 7-step procedure + a 9-item completeness checklist.

### `docs/conventions.md` (285 lines)

The how-to-operate-in-the-system file. Covers:
- BEM-ish naming (`.codex-<context>__<part>--<modifier>`)
- State classes (`is-*` for instance booleans, `has-*` for parent-acknowledging-child, `--*` for variants — three categories, deliberately distinct)
- File ordering inside `codex.css` (append at bottom under DS-N header, never insert in the middle — keeps git-blame archaeology readable)
- Token enforcement rules (color/spacing/type/motion always tokenized; raw values OK only for layout primitives)
- Fallback discipline (`var(--token, fallback)` fallbacks must match actual resolution)
- `!important` policy (only for fighting Kadence, max 120 site-wide; every use needs a comment)
- File mapping (which file owns what)
- Inline scripts (one IIFE in `BaseLayout.astro`, no bundling)
- Browser support matrix
- A11y checklist (8 items)
- Migration playbook (7 steps)
- Definition of done (7 items)
- "Things we don't do" (deliberate non-decisions: no CSS-in-JS, no PostCSS, no Storybook, no automated visual regression, no scoped styles, no per-component CSS files)
- Glossary

### `docs/README.md` (39 lines)

The index. Lists the three docs in reading order, points to "how to add" sections in each, and gives the audit history table tracing DS-1 through DS-12 with score progression (~45/100 → 55/100 → ~68/100).

---

## Verification summary

| Check | Result |
|---|---|
| `npx astro sync` | ✅ 672 ms, content + types valid |
| CSS brace balance | ✅ 939 / 939 |
| Hardcoded transition durations remaining (`0.15s`, `0.2s`, `0.4s`) | ✅ 0 |
| Mismatched gold fallbacks remaining | ✅ 0 |
| `#1a1a1a` literals remaining | ✅ 4 (1 token def + 3 valid fallbacks) |
| Tokens defined | 110 → **132** (+22) |
| Cross-doc anchor links resolve | ✅ 7/7 |
| Documentation lines | 0 → **1438** |

---

## Score change

DS-12 audit started at **55/100**. Phase 1 + Phase 2 closed:

| Dimension | Before | After | Δ |
|---|---|---|---|
| Naming consistency | 6/10 | 7/10 | +1 (conventions.md formalizes) |
| Token coverage | 6/10 | 8/10 | +2 (motion 100%, status 100%, mismatched fallbacks 0) |
| Component completeness | 7/10 | 7/10 | — (Phase 3 is the refactor pass) |
| Documentation | 1/10 | 8/10 | +7 (1438 lines of docs) |
| A11y | 9/10 | 9/10 | — |
| Theming readiness | 4/10 | 7/10 | +3 (gold fallbacks unified, success/error tokenized, dark/text semantically split) |
| Motion / animation | 5/10 | 8/10 | +3 (motion scale + 100% literal coverage) |
| Mobile adaptation | 8/10 | 8/10 | — |

**New total: ≈68/100** — a 13-point lift in one cycle. Most of the headroom now lives in component-level refactor (Phase 3) and pattern extraction (Phase 4), not token hygiene.

---

## File diff summary

```
 src/styles/codex.css         | +839 / -65 lines
 docs/README.md               | +39 lines (new file)
 docs/tokens.md               | +447 lines (new file)
 docs/components.md           | +667 lines (new file)
 docs/conventions.md          | +285 lines (new file)
 ────────────────────────────────────────────
 5 files, +2277 / -65
```

Of the +839 in `codex.css`:
- ~120 lines = new token declarations + comment headers
- ~85 lines = motion / elevation / ring scale additions
- ~90 lines = DS-11 status color migration (no net delta visually, just `var()` substitutions)
- ~80 lines = motion sweep (no net delta)
- Remainder = comment headers + DS-12 documentation in code

---

## What's next

### Phase 3 — Component refactor (deferred, opportunistic)

1. **Extract `.codex-card` base** — 12 card variants currently re-define padding/border/radius/shadow. Base + variants saves ~400 lines, standardizes hover translate (3px on hubs, 6px on home — DS-10 flagged).
2. **Rename `industries-sidebar` / `spec-sidebar` → `*-rail`** — naming drift fix.
3. **Z-index 10 → 5 consolidation** — reduce semantic noise.
4. **Decommission deprecation candidates** — `--codex-shadow-*` (use elevation), `--codex-teal/forest/steel-*` (fold into `[data-section-type]` rules if usage stays low).

### Phase 4 — Pattern extraction (deferred, ongoing)

1. `.codex-card` / `.codex-banner` / `.codex-scroll-region` / `.codex-disclosure` mixins
2. `data-codex-event` instrumentation surface (extends `data-cta-tier`)
3. (Optional) Storybook or VitePress component preview

### Open question for design review

- **Color theming readiness**: should we commit to a dark-mode pass in 2026-Q3? The token layer is now nearly ready (`--codex-dark` and `--codex-text` semantically separated), but ~6 hardcoded `#ffffff` and ~155 hex still in fallback positions would need a sweep first.

---

## Hand-off notes

1. **Read `docs/conventions.md` first** if you're new to the codebase. It's the operating manual.
2. **PR review checklist**: every PR that adds CSS rules should be checked against the "definition of done" in conventions.md. Reviewers can ask "why a raw value?" with the expectation of a justification, not silence.
3. **Token additions need three things**: token in `:root`, doc entry in `tokens.md`, sweep of existing literals. PRs that ship one without the others should bounce.
4. **Migration playbook applies even to small fixes**. Don't `replace_all` without grepping the affected count first and noting it in the PR description.
5. **Documentation gates merge**. New components require an entry in `components.md`. New tokens require an entry in `tokens.md`. New conventions (`is-*` style decisions, `!important` rationales) require an entry in `conventions.md`. Without these, the system regresses.

— DS-12 closeout
