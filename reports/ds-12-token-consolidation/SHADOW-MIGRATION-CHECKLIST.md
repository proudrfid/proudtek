# `--codex-shadow*` → `--codex-elevation-*` migration checklist

**Date**: 2026-04-27
**Status**: Analysis complete; **no migrations executed**. Per-site migration is a design decision, not a mechanical refactor.
**Why this exists**: The DS-12 Phase 1 elevation scale (`--codex-elevation-rest/hover/sticky/modal`) is the modern replacement for `--codex-shadow / -light / -heavy`. The legacy tokens have 20 callsites (audit baseline) but the values aren't 1:1 swappable — heavy 12-16px blur in legacy vs. subtler 1-12px in the new scale, plus an inverted hover convention on a 6-callsite pattern. This document is the per-callsite analysis so any future migration sprint knows which sites are safe to sweep and which need design review.

---

## Token reference

### Legacy (deprecated DS-12 #1)

```css
--codex-shadow:        0 12px 24px rgba(41, 28, 14, 0.14);   /* heavy resting */
--codex-shadow-light:  0 12px 24px rgba(41, 28, 14, 0.08);   /* same blur, lighter */
--codex-shadow-heavy:  0 16px 36px rgba(41, 28, 14, 0.08);   /* biggest blur, light alpha */
```

### New scale (DS-12 #1a)

```css
--codex-elevation-flat:    none;
--codex-elevation-rest:    0 1px 3px rgba(41, 28, 14, 0.08);
--codex-elevation-hover:   0 4px 12px rgba(41, 28, 14, 0.10);
--codex-elevation-sticky:  0 -4px 16px rgba(0, 0, 0, 0.10);
--codex-elevation-modal:   0 16px 48px rgba(41, 28, 14, 0.18);
```

### Why values don't map 1:1

| Aspect | Legacy | New scale |
|---|---|---|
| Aesthetic | Heavy "lifted card" feel | Subtler "modern flat-ish" |
| Default rest blur | 12-16px | 1-12px |
| Default rest alpha | 0.08-0.14 | 0.08-0.18 |
| Hover convention | Rest = heavier; hover = lighter (press release) | Rest = lighter; hover = heavier (standard lift) |

The hover convention difference is the killer — 6 of the 9 callsites pair `--codex-shadow` (rest) with `--codex-shadow-light` (hover) to create the "press release" optical effect (button rises with translateY(-1px) AND shadow lightens because the object is closer to the imagined light source). Mechanically swapping rest/hover to elevation-rest/elevation-hover would invert the design.

---

## Per-callsite analysis

### Callsite #1 — `.codex-legacy-redirect__action--primary` rest + hover (L1048-1060)

| Field | Value |
|---|---|
| Selectors (rest) | `.codex-product-cta__primary`, `.codex-footer-rfq-link`, `.codex-legacy-redirect__action--primary` |
| Selectors (hover) | (same three) `:hover` |
| Current rest | `box-shadow: var(--codex-shadow);` (0.14 alpha, 12px blur) |
| Current hover | `transform: translateY(-1px); box-shadow: var(--codex-shadow-light);` (0.08 alpha, 12px blur) |
| Pattern | **Rest-heavier hover** ("press release" optical effect) |
| Migration option A | rest → `--codex-elevation-hover`, hover → `--codex-elevation-rest`. **Inverts the design** — hover becomes lighter than the standard scale expects. |
| Migration option B | Stay legacy. The 3 dark-gradient CTAs that share this rule have a deliberately heavier rest state for product-CTA prominence. |
| **Recommendation** | 🚫 **Stay legacy.** The rest-heavier hover pattern is a designed optical effect, not laziness. Migration would require redesigning the lift behavior (e.g. larger translateY + new shadow scale's hover-heavier convention). |

### Callsite #2 — `.codex-editorial-{primary,secondary,brief-link,jump-link}:hover` shared (L1085-1091)

| Field | Value |
|---|---|
| Selectors | `.codex-editorial-brief-link:hover`, `.codex-editorial-secondary:hover`, `.codex-editorial-primary:hover`, `.codex-editorial-jump-link:hover` |
| Current | `transform: translateY(-1px); box-shadow: var(--codex-shadow-light);` (0.08 alpha, 12px blur) |
| Rest pair? | `.codex-editorial-primary` rests with `--codex-shadow` (Callsite #4) — same rest-heavier pattern. The other 3 don't have rest shadows. |
| Migration option | Split the shared rule. For the 3 selectors without rest shadow (`brief-link`, `secondary`, `jump-link`), migrate to `--codex-elevation-rest`. Keep `editorial-primary:hover` on legacy since it pairs with rest-heavier. |
| Cost | Modest — 1 split rule + 1 new rule. |
| **Recommendation** | ⚠️ **Design review required.** Splitting the rule means brief-link/secondary/jump-link hovers move from heavy (12px blur, 0.08 alpha) to subtle (1px-3px blur, 0.08 alpha). Visible aesthetic change. Worth doing if design wants the modern subtle look on these 3 selectors. |

### Callsite #3 — `.codex-editorial-primary` rest (L1114-1121)

| Field | Value |
|---|---|
| Selector | `.codex-editorial-primary` (action-bar primary CTA) |
| Current | `box-shadow: var(--codex-shadow);` |
| Hover pair | Yes (Callsite #2 — `.codex-editorial-primary:hover` uses `--codex-shadow-light`) |
| Pattern | Rest-heavier hover (same as Callsite #1) |
| **Recommendation** | 🚫 **Stay legacy.** Same logic as Callsite #1. |

### Callsite #4 — `#footer-navigation .codex-nav-rfq-link` rest (L1808-1812)

| Field | Value |
|---|---|
| Selector | `#footer-navigation .codex-nav-rfq-link` (footer pill button) |
| Current | `box-shadow: var(--codex-shadow);` (heavy resting) |
| Hover pair? | Hover rule at L1819 changes background-gradient + color, **does NOT change box-shadow**. So the rest shadow persists on hover. |
| Migration option | rest → `--codex-elevation-hover` (0.10 alpha, 4px blur). Lighter and subtler than current 0.14 alpha 12px blur. |
| Visual impact | Clearly subtler — the pill loses some "lifted" feel. Whether that's better or worse is a design call. |
| **Recommendation** | ⚠️ **Design review required.** Single-callsite migration is technically safe (no shared rule, no hover-coupling), but the visual change is meaningful. Footer CTAs benefit from prominence, so subtler shadow may reduce the affordance. |

### Callsite #5 — `.codex-editorial-hero` (L3382-3389)

| Field | Value |
|---|---|
| Selector | `.codex-editorial-hero` (the hero card on every editorial page) |
| Current | `box-shadow: var(--codex-shadow-heavy);` (0.08 alpha, 16px blur, 36px spread) |
| Hover pair? | None — hero is static |
| Migration option | → `--codex-elevation-modal` (0.18 alpha, 16px blur, 48px spread). **2.25× heavier alpha**, slightly bigger spread. |
| Visual impact | Hero shadow becomes significantly more prominent. Risk: hero feels "heavy" / over-emphasized vs. clean editorial aesthetic. |
| Alternative | Keep legacy. The 0.08 alpha was chosen for editorial restraint; the new scale's modal-tier (0.18) is meant for *literally floating UI* (modals, dialogs) not hero cards. |
| **Recommendation** | 🚫 **Stay legacy.** Modal-tier elevation isn't the right semantic fit for an in-flow hero card. If the new scale is supposed to cover all elevation surfaces, it's missing a "subtle prominent surface" tier between hover and modal. |

### Callsite #6 — `.codex-conversion-shell` (L4245-4252)

| Field | Value |
|---|---|
| Selector | `.codex-conversion-shell` (conversion CTA shell on snapshot pages) |
| Current | `box-shadow: var(--codex-shadow-heavy);` |
| Hover pair? | None |
| Migration | Same options as #5 |
| **Recommendation** | 🚫 **Stay legacy** — same rationale as #5. |

### Callsite #7 — `.codex-conversion-button` rest + hover (L4330-4343)

| Field | Value |
|---|---|
| Selector (rest) | `.codex-conversion-button` |
| Selector (hover) | `.codex-conversion-button:hover` |
| Current rest | `box-shadow: var(--codex-shadow);` |
| Current hover | `transform: translateY(-1px); box-shadow: var(--codex-shadow-light);` |
| Pattern | Rest-heavier hover (same as Callsite #1) |
| **Recommendation** | 🚫 **Stay legacy.** Same rationale as Callsite #1. |

---

## Summary table

| # | Lines | Selector(s) | Recommendation |
|---|---|---|---|
| 1 | 1048-1060 | 3 dark-gradient pill CTAs (rest + hover) | 🚫 Stay legacy |
| 2 | 1085-1091 | 4 editorial hover selectors (shared rule) | ⚠️ Design review (split possible) |
| 3 | 1114-1121 | `.codex-editorial-primary` rest | 🚫 Stay legacy |
| 4 | 1808-1812 | `#footer-navigation .codex-nav-rfq-link` rest | ⚠️ Design review |
| 5 | 3382-3389 | `.codex-editorial-hero` | 🚫 Stay legacy |
| 6 | 4245-4252 | `.codex-conversion-shell` | 🚫 Stay legacy |
| 7 | 4330-4343 | `.codex-conversion-button` rest + hover | 🚫 Stay legacy |

**Stay-legacy: 5 callsites (5 cards × 1-2 rules each = 13 of 20 raw `var()` calls)**
**Design review: 2 callsites (3 hover selectors + 1 footer rest = 4 of 20 raw `var()` calls)**
**Auto-migrate: 0**

The "audit said migrate" intuition was wrong. Legacy values were chosen with intent. The new elevation scale, while modern and cleaner, doesn't model the rest-heavier-hover convention and doesn't have a "subtle prominent surface" tier for hero cards.

---

## Recommended next steps for the design team

### If the product wants to standardize on the new elevation scale (full sweep)

The migration becomes a **redesign** of two patterns, not a refactor:

1. **Redesign the rest-heavier-hover CTA pattern** — pick a new lift convention (translateY only, no shadow change? Or hover = bigger shadow + bigger lift?). Once the new pattern is decided, all 6 rest+hover CTAs migrate together.

2. **Add a new elevation tier for prominent in-flow surfaces** — something between `--codex-elevation-hover` (0.10 alpha) and `--codex-elevation-modal` (0.18 alpha). Suggested:
   ```css
   --codex-elevation-prominent: 0 10px 28px rgba(41, 28, 14, 0.10);
   ```
   Hero + conversion-shell migrate to this. The legacy `--codex-shadow-heavy` retires.

3. **Sweep the design-review callsites** (#2, #4) for visual consistency on subtle hover surfaces (non-CTA hovers + footer pill).

Cost estimate: ~1 week of design review + ~1 day of CSS migration + visual smoke test on 5 page types.

### If the product is fine with legacy for now (no migration)

Keep the deprecation comment but tighten its message: not just "values aren't 1:1" but specifically:
- "Six callsites participate in a rest-heavier-hover pattern that the new scale doesn't model."
- "Two prominent shells need a tier between hover and modal that the new scale doesn't have."
- "The new scale is most appropriate for *new* card/banner/sticky surfaces (`.codex-card`, `.codex-banner`) where the elevation-rest/hover convention fits."

Cost: 5 minutes (comment edit only, see :root in `codex.css`).

---

## What this analysis tells us about the new elevation scale

The DS-12 Phase 1 elevation scale was designed by analogy to Material Design's elevation system (rest / hover / modal). It works well for the patterns where it's been adopted (`.codex-card` hover lift, `.codex-banner` shadow). But:

- **Missing tier**: between `hover` (subtle) and `modal` (heavy floating UI), there's no "prominent in-flow card" tier. That's where the legacy `--codex-shadow-heavy` lived.
- **Hover convention mismatch**: the scale assumes hover increases elevation (Material convention); the site has 6 CTAs using the inverse "press release" convention. Either the convention needs to be added, or those CTAs need redesign.

These are findings for a future Phase 5 design system pass — the elevation scale needs one more iteration before it can fully replace legacy.

---

## Action items

- [ ] **Now**: Update `:root` comment block in `codex.css` to reflect the rest-heavier pattern as the primary blocker (see below)
- [ ] **Now**: Link this checklist from `docs/tokens.md` shadow section
- [ ] **Future Phase 5**: Design review on the 6 rest-heavier CTAs — redesign pattern or accept the inverted hover convention
- [ ] **Future Phase 5**: Add `--codex-elevation-prominent` tier between hover and modal
- [ ] **Future Phase 5**: Migrate the 2 design-review-only callsites (jump-link/brief-link/secondary hovers + footer pill rest)

— DS-12 #9 closeout
