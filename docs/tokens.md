# Codex design tokens

> **Source of truth**: `src/styles/codex.css` `:root { ... }` block (lines 4–148).
> **Total tokens**: 132 (post DS-12 Phase 1).
> **Last reconciled**: 2026-04-27.

This file documents every `--codex-*` token: what it is, what it resolves to, when to use it, and — more importantly — when NOT to use it. Tokens with the same value but different semantics (`--codex-dark` vs. `--codex-text` are both `#291c0e`) are deliberately distinct so the system can theme them apart later.

---

## Quick reference

| Category | Tokens | Use for |
|---|---|---|
| Colors — brand | `--codex-gold`, `--codex-gold-muted`, `--codex-gold-light`, `--codex-dark`, `--codex-dark-mid` | Primary brand surfaces and accents |
| Colors — text | `--codex-text`, `--codex-text-muted`, `--codex-text-subtle`, `--codex-text-strong` | Anything a reader's eye lands on |
| Colors — surface | `--codex-bg-warm`, `--codex-bg-warm-gradient`, `--codex-bg-card`, `--codex-bg-hero` | Card / panel / hero backgrounds |
| Colors — borders | `--codex-border`, `--codex-border-light`, `--codex-border-gold` | Outlines, dividers, hover hints |
| Colors — status | `--codex-error`, `--codex-error-tint`, `--codex-success`, `--codex-success-tint`, `--codex-warning` | Form errors, glyph pills, system feedback |
| Colors — accent | `--codex-teal`, `--codex-forest`, `--codex-steel` (+ tints/borders) | Section-type theming (pain / solution / results) |
| Typography | 18 tokens (`--codex-text-*`, `--codex-leading-*`, `--codex-weight-*`, `--codex-font-*`) | All sizing, weight, line-height, family |
| Spacing | 22 tokens (`--codex-space-0` through `-20`, plus `+plus` half-steps) | Padding, margin, gap |
| Radius | 6 tokens (`--codex-radius-{sm,card,card-lg,card-xl,pill}`) | Corner roundness |
| Elevation | 5 tokens (`--codex-elevation-{flat,rest,hover,sticky,modal}`) | Shadows / depth perception |
| Motion | 5 durations + 3 easings | Transitions, animations |
| Z-index | 10 tokens (`--codex-z-*`) | Stacking contexts |
| Rings | 5 tokens (`--codex-ring*`) | Focus and error indicators |
| Touch | `--codex-touch-min` | Hit-target floor |
| Breakpoints | 4 tokens (`--codex-bp-*`) | Reference values for `@media` |

---

## Color tokens

### Brand colors

```css
--codex-gold:        var(--global-palette1, #c39a5f);  /* 4.0:1 vs white */
--codex-gold-muted:  #6d5a3a;                          /* 5.6:1 — AA at small text */
--codex-gold-light:  #d4a755;                          /* brighter accent */
--codex-dark:        #291c0e;                          /* warm-brown brand surface */
--codex-dark-mid:    #6c5127;                          /* dark gradient mid-stop */
```

**Use `--codex-gold`** for: primary CTA fills, hero accent gradients, hover states on links, brand decorations. Reaches 4:1 against white — safe for *large* text and decorative elements; use `--codex-gold-muted` for body-size gold text.

**Use `--codex-gold-muted`** for: link colors, badge text, in-text accents, anywhere gold needs to read at body size on light backgrounds. AA-compliant 5.6:1 against white.

**Use `--codex-gold-light`** for: brighter brand moments — trust strip numbers, hero highlight strokes, decorative ribbons. NOT for body text (3.4:1 fails AA).

**Use `--codex-dark`** for: footer background, dark gradient end-stops, brand surface fills. NOT for body text — use `--codex-text` instead (same value today, but semantic distinction matters for future theming).

**DON'T**:
- Don't use raw `#c39a5f` / `#d4a755` / `#b08d57` hex literals. The 17 violations in DS-11 era were all reconciled in DS-12; new violations should be caught at PR review.
- Don't substitute `--codex-gold` where `--codex-gold-muted` is needed for AA compliance (e.g. small inline links).

---

### Text colors

```css
--codex-text:         var(--global-palette3, #291c0e);  /* warm brown */
--codex-text-muted:   var(--global-palette4, #4f4f4f);  /* mid grey */
--codex-text-subtle:  var(--global-palette5, #5c5c5c);  /* lighter grey */
--codex-text-strong:  #1a1a1a;                          /* near-black, max contrast */
```

**Use `--codex-text`** for: every paragraph, heading, list item, body link not already a CTA. The default text color across the editorial system.

**Use `--codex-text-muted`** for: meta text (dates, authors, breadcrumb separators), captions, trust strip labels.

**Use `--codex-text-subtle`** for: hint text inside form fields, secondary metadata, "(N) items" counts.

**Use `--codex-text-strong`** for: text on gold backgrounds (CTA buttons, hover-fill social icons) where warm brown wouldn't have enough contrast against gold. Used by 3 components today: `.kb-forms-submit`, `.codex-footer-brand__cta`, `.codex-footer-bottom__social:hover`.

**DON'T**:
- Don't use `--codex-dark` for text (semantic mismatch — it's a surface token, not a text token, even though values currently match).
- Don't use `--codex-text-strong` on white/light backgrounds (overkill — body text gets warm brown).

---

### Surface colors

```css
--codex-bg-warm:           rgba(248, 246, 241, 0.92);
--codex-bg-warm-gradient:  linear-gradient(180deg, rgba(248, 246, 241, 0.98), rgba(255, 255, 255, 0.98));
--codex-bg-card:           linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 246, 241, 0.92));
--codex-bg-hero:           radial-gradient(circle at top right, var(--codex-border-gold), transparent 30%), var(--codex-bg-warm-gradient);
```

**Use `--codex-bg-warm`** for: rail backgrounds, secondary panels, summary banners, hover states on cards.

**Use `--codex-bg-warm-gradient`** for: page-level top→bottom soft gradient (about page hero, contact page intro).

**Use `--codex-bg-card`** for: card surfaces that need a subtle warmth gradient.

**Use `--codex-bg-hero`** for: hero sections that want a top-right gold spotlight effect.

**DON'T**:
- Don't use `#fff` / `white` / `#ffffff` literals for card backgrounds — use one of the gradient tokens or `var(--codex-bg-warm)`.

---

### Border colors

```css
--codex-border:         rgba(41, 28, 14, 0.12);
--codex-border-light:   rgba(41, 28, 14, 0.08);
--codex-border-gold:    rgba(195, 154, 95, 0.18);
```

**Use `--codex-border`** for: form inputs, primary card outlines, sidebar dividers.

**Use `--codex-border-light`** for: secondary dividers, table cell rows, low-emphasis card borders.

**Use `--codex-border-gold`** for: active state on rail items, focus-within hints on form groups, gold-themed callouts.

---

### Status colors (DS-12 #1)

```css
--codex-error:         #8b2d2d;                          /* 7.59:1 — AAA */
--codex-error-tint:    rgba(139, 45, 45, 0.10);          /* soft fill */
--codex-success:       #1f6f3a;                          /* 5.46:1 — AA */
--codex-success-tint:  rgba(31, 111, 58, 0.12);          /* soft fill */
--codex-warning:       #b48a3a;                          /* pre-allocated, not yet used */
```

**Use `--codex-error`** for: form error messages, invalid state borders, "not supported" glyphs (✗).
**Use `--codex-error-tint`** for: invalid-input pill backgrounds, error-state row highlights.
**Use `--codex-success`** for: form success messages, "supported" glyphs (✓), positive callouts.
**Use `--codex-success-tint`** for: success pill backgrounds.
**`--codex-warning`** is reserved — define your warning surface before using it (decide tint, decide border behavior, then add to this doc).

**Important**: these were **reconciled in DS-12** to AA-compliant values. Pre-DS-12 values (`#27ae60` / `#c0392b`) were borrowed from WordPress and failed AA at small text. If you see those raw hexes anywhere, replace with the token.

---

### Accent colors (section-type theming)

```css
--codex-teal:          #3d6b6b;
--codex-teal-light:    rgba(61, 107, 107, 0.08);
--codex-teal-border:   rgba(61, 107, 107, 0.18);
--codex-forest:        #2d6a4f;
--codex-forest-light:  rgba(45, 106, 79, 0.07);
--codex-forest-border: rgba(45, 106, 79, 0.15);
--codex-steel:         #4a5568;
--codex-steel-light:   rgba(74, 85, 104, 0.06);
```

**Use** these for `[data-section-type]` driven theming on editorial sections:
- `pain` → uses brand red/error palette (no token yet — uses `var(--codex-error)`)
- `solution` → `--codex-forest`
- `results` → `--codex-teal`

**DEPRECATION CANDIDATE**: per DS-12 audit, these are each used by ~3 rules. If usage stays low, fold them into the section-type CSS directly and remove from token layer.

---

## Typography

### Size scale (DS-6 + DS-8 `+plus` tiers)

```css
--codex-text-2xs:       0.7rem;    /* 11.2px — micro caption */
--codex-text-xs:        0.75rem;   /* 12px   — meta / captions */
--codex-text-xs-plus:   0.8rem;    /* 12.8px — absorbs 0.78/0.8/0.82 */
--codex-text-sm:        0.85rem;   /* 13.6px — secondary text */
--codex-text-sm-plus:   0.9rem;    /* 14.4px — absorbs 0.88/0.9/0.92/0.95 */
--codex-text-base:      1rem;      /* 16px   — body */
--codex-text-base-plus: 1.1rem;    /* 17.6px — absorbs 1.05/1.1 */
--codex-text-md:        1.125rem;  /* 18px   — lead body */
--codex-text-md-plus:   1.15rem;   /* 18.4px — between md and lg */
--codex-text-lg:        1.25rem;   /* 20px   — h4 / large link */
--codex-text-lg-plus:   1.4rem;    /* 22.4px — absorbs 1.35/1.4 */
--codex-text-xl:        1.5rem;    /* 24px   — h3 */
--codex-text-xl-plus:   1.75rem;   /* 28px   — absorbs 1.7/1.75/1.8 */
--codex-text-2xl:       2rem;      /* 32px   — h2 */
--codex-text-3xl:       2.5rem;    /* 40px   — h1 / hero */
```

**Why `+plus` tiers exist**: organic content from WordPress + author-bias toward "between" sizes (0.9rem, 1.05rem) was creating drift. The `+plus` tiers absorb a range of organic values with ≤0.05rem (≤0.8px) of visual diff — imperceptible.

**Use base sizes** by default. Reach for `+plus` only when an existing rule needs the slight bump and the extra tier prevents a literal.

**DON'T**:
- Don't write `font-size: 0.95rem` — use `--codex-text-sm-plus`.
- Don't write `font-size: 14px` — use `--codex-text-sm`.
- Don't fight a `+plus` tier with negative margins; if the base size is wrong for the layout, change the base size.

### Line-height

```css
--codex-leading-tight:    1.2;    /* hero h1, big numbers */
--codex-leading-snug:     1.35;   /* h2 / h3 */
--codex-leading-normal:   1.5;    /* body */
--codex-leading-relaxed:  1.65;   /* long-form prose */
```

### Font weight

```css
--codex-weight-regular:    400;
--codex-weight-medium:     500;
--codex-weight-semibold:   600;
--codex-weight-bold:       700;
--codex-weight-extrabold:  800;
```

### Font family

```css
--codex-font-heading:  "Lora", Georgia, "Times New Roman", serif;
--codex-font-body:     -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...;
--codex-font-mono:     ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, ...;
```

`--codex-font-heading` is applied site-wide to `h1, h2, h3, .codex-editorial-hero h2`, etc. Body inherits the body stack from `<body>` defaults.

---

## Spacing scale (DS-6)

4px base, rem-denominated.

```css
--codex-space-0:       0;
--codex-space-0-5:     0.125rem;   /*  2px — hairline spacer */
--codex-space-1:       0.25rem;    /*  4px — tight inline gap */
--codex-space-1-plus:  0.4rem;     /* ~6px — absorbs 0.3/0.35/0.4/0.45 */
--codex-space-2:       0.5rem;     /*  8px — small cell padding */
--codex-space-2-plus:  0.65rem;    /* ~10px — absorbs 0.55/0.65/0.7 */
--codex-space-3:       0.75rem;    /* 12px — default inline gap */
--codex-space-3-plus:  0.85rem;    /* ~14px — absorbs 0.85/0.9 */
--codex-space-4:       1rem;       /* 16px — standard block padding */
--codex-space-4-plus:  1.15rem;    /* ~18px — absorbs 1.1/1.15/1.2 */
--codex-space-5:       1.25rem;    /* 20px — card padding */
--codex-space-6:       1.5rem;     /* 24px — section inner spacing */
--codex-space-6-plus:  1.65rem;    /* ~26px — rare intermediate */
--codex-space-7:       1.75rem;    /* 28px */
--codex-space-8:       2rem;       /* 32px — section block spacing */
--codex-space-9:       2.25rem;    /* 36px */
--codex-space-10:      2.5rem;     /* 40px */
--codex-space-11:      2.75rem;    /* 44px — nav strip height */
--codex-space-12:      3rem;       /* 48px — large block spacing */
--codex-space-14:      3.5rem;     /* 56px */
--codex-space-16:      4rem;       /* 64px — hero / section gutter */
--codex-space-20:      5rem;       /* 80px */
```

**Usage rule of thumb**:
- Component-internal padding: `--codex-space-2` to `--codex-space-5`
- Card/panel padding: `--codex-space-5` to `--codex-space-6-plus`
- Section block spacing: `--codex-space-8` to `--codex-space-12`
- Hero / page gutters: `--codex-space-16` to `--codex-space-20`

**DON'T**:
- Don't write raw `padding: 12px` — use `var(--codex-space-3)`.
- Don't reach for `+plus` first; try base values, fall back to `+plus` only if the base creates rhythm problems.

---

## Radius

```css
--codex-radius-sm:       8px;     /* form inputs, small chips */
--codex-radius-card:     16px;    /* card containers */
--codex-radius-card-lg:  20px;    /* large feature cards */
--codex-radius-card-xl:  24px;    /* hero cards, panels */
--codex-radius-pill:     999px;   /* badges, pills */
```

---

## Elevation (DS-12)

```css
--codex-elevation-flat:     none;
--codex-elevation-rest:     0 1px 3px rgba(41, 28, 14, 0.08);
--codex-elevation-hover:    0 4px 12px rgba(41, 28, 14, 0.10);
--codex-elevation-sticky:   0 -4px 16px rgba(0, 0, 0, 0.10);   /* upward shadow */
--codex-elevation-modal:    0 16px 48px rgba(41, 28, 14, 0.18);
```

**Migration target**: 3 legacy tokens (`--codex-shadow`, `-light`, `-heavy`) still exist for backward compat. New rules should use the `--codex-elevation-*` ladder.

**A sweep is NOT recommended** — the DS-12 #9 analysis (summarized inline in `src/styles/codex-tokens.css`; the standalone SHADOW-MIGRATION-CHECKLIST.md is no longer in the repo as of 2026-06-29) found the 9 legacy callsites split:
- **5 stay legacy** (rest-heavier-hover CTAs with intentional "press release" optical design)
- **2 need design review** (single-callsite hover + footer pill — visual change is meaningful)
- **0 auto-migratable**

The new elevation scale also has a missing tier (between hover and modal) and an opposite hover convention compared to the rest-heavier CTAs. A future Phase 5 design review should either add `--codex-elevation-prominent` + redesign the 6 CTAs, or accept the inverted-hover legacy pattern as a permanent design choice.

**For new code**: use `--codex-elevation-*`. The legacy tokens are reserved for the 9 callsites with intentional patterns.

---

## Motion (DS-12)

### Duration scale

```css
--codex-motion-instant:      80ms;    /* immediate feedback (toggle bg) */
--codex-motion-fast:         150ms;   /* standard hover/focus */
--codex-motion-base:         200ms;   /* cards, button-press, panel */
--codex-motion-slow:         400ms;   /* reveal, fade-in */
--codex-motion-deliberate:   600ms;   /* page-level reveal, hero */
```

### Easing

```css
--codex-easing-out:          cubic-bezier(0.25, 1, 0.5, 1);
--codex-easing-in-out:       cubic-bezier(0.4, 0, 0.2, 1);
--codex-easing-emphasized:   cubic-bezier(0.2, 0, 0, 1);
```

**Usage**:
- Hover / focus → `--codex-motion-fast` + `--codex-easing-out`
- Card lift on hover → `--codex-motion-base` + `--codex-easing-out`
- Section reveal on scroll → `--codex-motion-slow` + `--codex-easing-out`
- Hero / page-level animations → `--codex-motion-deliberate` + `--codex-easing-emphasized`

**DON'T**:
- Don't write `transition: ... 0.15s` — use `var(--codex-motion-fast)`.
- Don't use `--codex-motion-deliberate` for hover; users will perceive lag.
- Don't omit a fallback inside `transition` — `var(--codex-motion-fast, 150ms)` keeps the rule resilient if the token fails to load.

---

## Z-index (DS-6, annotated DS-12 #8B)

```css
/* Canonical 5 tiers — use these for new code */
--codex-z-base:       0       /* Default flow */
--codex-z-raised:     1       /* In-card stacking (sticky thead, image overlays) */
--codex-z-sticky:     30      /* Site chrome (header, sticky nav) */
--codex-z-dropdown:   1000    /* Dropdowns + sticky CTA + masthead surfaces */
--codex-z-modal:      8000    /* Modal-tier; anything that wins over everything */

/* Deprecated — kept for backward compat. Don't introduce new uses. */
--codex-z-surface:    2       /* → use --codex-z-raised */
--codex-z-header:     40      /* → use --codex-z-sticky */
--codex-z-toast:      9000    /* → use --codex-z-modal */
--codex-z-tooltip:    10000   /* → use --codex-z-modal */
--codex-z-overlay:    99999   /* → escape hatch; reserve for genuinely-must-win cases */
```

### Why deprecate, not delete

Removing tokens risks breaking visual stacking — ordering between modal/toast/tooltip/overlay tiers may matter on pages we haven't audited yet. The Phase 3 review settled on:

1. **Migrate raw z-index literals to tokens** — done (1 raw `1000 !important` → `var(--codex-z-dropdown)` at the masthead-sticky rule).
2. **Mark unused tokens as deprecated** — done (5 tokens flagged: `surface`, `header`, `toast`, `tooltip`, `overlay`).
3. **Recommend canonical 5 tiers in :root comment** — done.
4. **Don't introduce new uses of deprecated tokens** — enforced via PR review against this doc.

### When touching a rule that uses a deprecated token

Migrate it. The mapping table is in the `:root` comment block (and at the top of this section). All deprecated tiers fold safely into one of the canonical 5; the only special case is `--codex-z-overlay` which exists as the escape hatch (don't fold unless you've checked the rule doesn't actually need to win over a modal).

---

## Rings (focus, error)

```css
--codex-ring:               var(--codex-gold, #c39a5f);   /* default outline color */
--codex-ring-on-dark:       #ffffff;                      /* on dark / gold CTAs */
--codex-ring-error:         var(--codex-error, #8b2d2d);  /* invalid form state */
--codex-ring-width:         2px;
--codex-ring-offset:        2px;
--codex-ring-focus-glow:    0 0 0 3px rgba(195, 154, 95, 0.30);  /* box-shadow halo */
--codex-ring-error-glow:    0 0 0 3px rgba(139, 45, 45, 0.30);   /* error halo */
```

**Default focus pattern**:
```css
:focus-visible {
  outline: var(--codex-ring-width) solid var(--codex-ring);
  outline-offset: var(--codex-ring-offset);
}
```
Already applied globally — most components inherit. Override with `--codex-ring-on-dark` only when the element sits on a dark or gold background.

**Form-error focus pattern** (DS-11):
```css
.is-invalid:focus-visible {
  border-color: var(--codex-error);
  box-shadow: var(--codex-ring-error-glow);
  outline: none;
}
```

---

## Touch target

```css
--codex-touch-min: 44px;   /* WCAG 2.5.5 floor */
```

**Apply** to: button `min-height`, input controls, icon-only links (e.g. social), `.codex-cell-glyph` `min-width` and `min-height`. Audited DS-9/10/11 — all interactive surfaces meet this.

---

## Breakpoints

```css
--codex-bp-sm:   480px;
--codex-bp-md:   768px;    /* canonical mobile/tablet */
--codex-bp-lg:   1024px;
--codex-bp-xl:   1280px;
```

**Limitation**: CSS custom properties **don't work inside `@media` queries**. Authors must hard-code the literal value, and ensure it matches the token. Always pair the literal with a comment:
```css
@media (max-width: 767px) /* var(--codex-bp-md) - 1px */ {
  ...
}
```
**Audit note**: 8 vs. 11 split between `767px` and `768px` was caught in DS-12; new media queries must use the convention above.

---

## How to add a new token

1. **Justify** — does this value appear at least 3 times in the codebase, or will it? Single-use tokens are debt.
2. **Locate** — find the right category section in `:root { ... }`. Add the token with a comment explaining its purpose.
3. **Document** — add a row to this file under the appropriate section. Include: value, when to use, when NOT to use.
4. **Sweep** — replace existing literal occurrences with the token. PR diff should show net reduction in literal hex/rgba/px.
5. **Verify** — `npx astro sync && npx astro build` must still pass. Visual diff at least one page on each major route type.

---

## How to deprecate a token

1. **Find usages** — `grep -n 'token-name' src/**/*.{css,ts,astro}`.
2. **Add replacement** — if the token had a successor (e.g. `--codex-shadow` → `--codex-elevation-rest`), keep both during migration.
3. **Migrate callsites** — sweep file by file.
4. **Remove from `:root`** — only after grep returns 0 matches.
5. **Document** — add a deprecation note in this file with the date and replacement.

**Currently deprecation-candidate**:
- `--codex-shadow`, `--codex-shadow-light`, `--codex-shadow-heavy` → use `--codex-elevation-*` ladder
- `--codex-z-raised`, `--codex-z-surface` → consolidate into `--codex-z-base`
- `--codex-teal-*`, `--codex-forest-*`, `--codex-steel-*` → if usage stays low, fold into `[data-section-type]` rules

---

## Token coverage targets

| Category | Adoption goal | Status |
|---|---|---|
| Color | 100% (no raw hex/rgba except in token defs) | ~83% — 161 hex remain (most are intentional fallbacks) |
| Spacing | 100% (no raw px) | ~85% — 395 → ~300 after Phase 1 |
| Typography | 100% (no raw rem/em font-size/line-height) | ~90% |
| Motion | 100% (no raw `XXms` or `X.Xs` durations) | ✅ 100% post-DS-12 #1d |
| Z-index | 100% | ~92% |
| Touch min | 100% on interactive surfaces | ✅ post-DS-11 |

---

## Changelog

- **2026-04-27 (DS-12 #9 — shadow migration analysis)** — Per-site analysis of 9 `var(--codex-shadow*)` callsites (summarized inline in `src/styles/codex-tokens.css`; standalone SHADOW-MIGRATION-CHECKLIST.md no longer in the repo as of 2026-06-29). Finding: 0 callsites are mechanically migratable to the new elevation scale; 5 stay legacy (rest-heavier-hover pattern), 2 need design review. Tightened `:root` deprecation note to reflect the rest-heavier pattern as the primary blocker. Future Phase 5 design review needed to either add a missing tier or accept the legacy convention.
- **2026-04-27 (DS-12 #8 — z-index deprecation)** — Marked 5 z-index tokens as deprecated (`surface`, `header`, `toast`, `tooltip`, `overlay`). Migrated 1 raw `z-index: 1000 !important` literal at masthead to `var(--codex-z-dropdown)`. Canonical 5-tier scale recommended for new code (`base / raised / sticky / dropdown / modal`).
- **2026-04-27 (DS-12 #1)** — Added 22 tokens: `--codex-text-strong`, `--codex-touch-min`, `--codex-gold-light`, motion scale (5 + 3 easings), elevation scale (5), `--codex-error-tint`, `--codex-success-tint`, `--codex-warning`, `--codex-ring-error`, `--codex-ring-focus-glow`, `--codex-ring-error-glow`. Reconciled `--codex-success` (`#27ae60` → `#1f6f3a`) and `--codex-error` (`#c0392b` → `#8b2d2d`) to AA-compliant values.
- **2026-04-26 (DS-11)** — `--codex-error` and `--codex-success` first written into DS-11 form rules as raw hex; tokenized in DS-12.
- **2026-04-22 (DS-6)** — Initial token system: spacing, typography, z-index, breakpoints, font families.
- **2026-04-22 (DS-5)** — `--codex-ring`, `--codex-ring-on-dark`, `--codex-ring-width`, `--codex-ring-offset`.
