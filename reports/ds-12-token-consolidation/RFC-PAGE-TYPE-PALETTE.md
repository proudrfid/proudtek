# RFC — `--codex-teal/forest/steel-*`: deprecate, fold, or promote?

**Status**: Draft, awaiting design + product call
**Date**: 2026-04-27
**Authors**: DS-12 audit follow-up
**Decision required by**: Whenever a 5th page-type is needed, or an Astro-level dark-mode pass is opened
**TL;DR recommendation**: **Option D — promote**. Trim 2 dead tokens, add 1 missing compatibility variant, document the system as the canonical "page-type palette" — don't deprecate.

---

## Background

The DS-12 design system audit (2026-04-27) flagged 8 tokens as "deprecation candidates":

```css
--codex-teal:          #3d6b6b
--codex-teal-light:    rgba(61, 107, 107, 0.08)
--codex-teal-border:   rgba(61, 107, 107, 0.18)
--codex-forest:        #2d6a4f
--codex-forest-light:  rgba(45, 106, 79, 0.07)
--codex-forest-border: rgba(45, 106, 79, 0.15)
--codex-steel:         #4a5568
--codex-steel-light:   rgba(74, 85, 104, 0.06)
```

The audit's heuristic: "if usage stays low (~3 each), fold into the consuming `[data-page-type]` rules and remove from the token layer." But the deeper analysis (DS-12 #10, this doc) found that this *is* the system — 20 callsites across the editorial hero, snapshot section, and action bar surfaces, driving four page-type categories.

This RFC enumerates options and recommends a path.

---

## Where they're used (the system)

The site's editorial pages carry a `[data-page-type]` attribute that drives a coherent color theme across three surfaces:

| Page type | Color | Surface treatments |
|---|---|---|
| `solution` (≈ 50 `/solutions/*` pages) | **teal** `#3d6b6b` | Hero border-left + background gradient + kicker color; snapshot border-left; action bar border-left + primary CTA gradient |
| `guide` (≈ 30 `/guides/*` pages) | **forest** `#2d6a4f` | Same surfaces, forest theme |
| `compare` (≈ 40 `/compare/*` pages) | **steel** `#4a5568` | Hero, snapshot, action-bar border-left + kicker color |
| `compatibility` (≈ 20 `/compatibility/*` pages) | **gold-muted** (brand) | Hero border-left only |

Plus the brand color is the implicit fourth in `[data-page-type="product"]` (default state, no override).

So the system is: **one brand color + three accent colors** spread across **three surface types** on **140+ editorial pages**.

### Per-token usage breakdown

| Token | Uses | Where |
|---|---|---|
| `--codex-teal` | 6 | hero border, kicker color, snapshot border, action-bar border, action-bar CTA gradient (×2) |
| `--codex-teal-light` | 1 | hero background gradient stop |
| `--codex-teal-border` | **0** | **dead — never used in production** |
| `--codex-forest` | 6 | (same surfaces as teal) |
| `--codex-forest-light` | 1 | hero background gradient stop |
| `--codex-forest-border` | **0** | **dead — never used in production** |
| `--codex-steel` | 5 | hero border, kicker color, snapshot border, action-bar border (compare doesn't have a CTA gradient variant) |
| `--codex-steel-light` | 1 | hero background gradient stop |

**6 tokens are pulling weight; 2 are dead weight.**

---

## The decision

Four options; the question is how seriously the team treats page-type theming as a system worth keeping.

### Option A — Keep all 8 as-is

**Pros**
- Zero work
- Future-proof: if someone adds a teal-bordered callout, the `-border` token is ready

**Cons**
- 2 dead tokens (`teal-border`, `forest-border`) sitting in `:root` indefinitely
- The audit's "deprecation candidates" labelling stays misleading
- Doesn't promote the system — new contributors don't see this as a feature, just leftover tokens

### Option B — Trim the dead 2 tokens, keep the working 6

**Pros**
- Clean inventory
- Working system kept intact
- Token count: 8 → 6 (within the audit's stated 5-token "low usage" threshold)

**Cons**
- Minor: if a future design adds a teal-bordered surface, the token has to be re-added
- Still doesn't elevate the system from "tokens we have" to "system we use"

### Option C — Fold all 8 into hardcoded `[data-page-type]` CSS rules

**Pros**
- Fewer tokens (8 → 0)
- Aligned with audit's original "fold them" recommendation

**Cons**
- Duplicates `#3d6b6b` (teal) across **5 rules**, `#2d6a4f` (forest) across **5 rules**, `#4a5568` (steel) across **4 rules** — net gain in hardcoded values
- Loses semantic naming: a future designer reading `border-left: 4px solid #3d6b6b` has to grep the codebase to know "oh, this is the solution-type accent"
- Future global tweak ("make solution teal a touch darker") becomes a 5-callsite edit instead of 1 token change
- Theming readiness: dark mode would need to override 5 hardcoded hexes per category instead of 1 token per category

This option *was* the audit's recommendation but only made sense under the false premise of 3-each usage. With actual 5-6 each, hardcoding inverts the cost calculus.

### Option D — Promote: document as canonical page-type palette + trim 2 dead tokens + add missing compatibility variant

**Pros**
- Recognizes what's actually shipped: a working system that earns its tokens
- Trims the 2 dead ones (token count: 8 → 6)
- Adds the missing piece: `--codex-compatibility-*` tokens so all 4 page types have a coherent color story (currently `compatibility` uses `--codex-gold-muted`, which conflates with brand)
- Adds a `tokens.md` section "Page-type palette" formalizing the system
- Lays the groundwork for future page types (e.g. if a 5th category gets added, the system has a slot for it)

**Cons**
- Requires a 5-minute design call to confirm:
  1. The 4 colors stay (no rebrand of solution-teal, etc.)
  2. The compatibility color decision: stay on `--codex-gold-muted` or get its own dedicated token
  3. The `-border` variants are genuinely needed or fine to drop

---

## Recommendation: Option D

**Why not B**: trimming alone keeps the audit's misleading "deprecation candidate" framing in `tokens.md`. New contributors see "deprecated" and avoid the tokens — but they're not deprecated, they're load-bearing.

**Why not C**: 14 hardcoded hex literals replacing 6 working tokens is the wrong direction. The DS-12 Phase 1 anti-fingerprint argument applied here in reverse: tokens are how we keep design intent legible.

**Why D**: the system exists, works, and should be named. Stop calling it "deprecation candidates" and start calling it "the page-type palette."

### Concrete changes if Option D is approved

#### 1. Rename the existing tokens to a coherent prefix

Current: `--codex-teal`, `--codex-forest`, `--codex-steel` (with `-light` and `-border` variants).
Proposed: keep `--codex-teal` etc. as-is (BC), but document them under a "page-type palette" section in `tokens.md`.

#### 2. Trim the 2 dead `-border` tokens

```diff
- --codex-teal-border: rgba(61, 107, 107, 0.18);    /* 0 uses */
- --codex-forest-border: rgba(45, 106, 79, 0.15);   /* 0 uses */
```

Save 2 tokens. If they're needed in the future, add them back at that time.

#### 3. (Option D-1) Add `--codex-compatibility-*` for the 4th category

If the design call decides compatibility deserves its own color (current uses brand gold-muted, which conflates):

```css
--codex-compatibility:        #6f4e37;  /* warm bronze, distinct from brand gold-muted */
--codex-compatibility-light:  rgba(111, 78, 55, 0.08);
```

Then `[data-page-type="compatibility"]` rules switch to the new token.

#### 3. (Option D-2) Or accept "compatibility uses brand gold"

Document explicitly in tokens.md: "Compatibility pages use the brand gold-muted as their accent — this is intentional, signaling 'this is part of the core product story' rather than a separate category." No new tokens.

This is probably the right call if the team wants to keep the page-type palette tight (3 accents + brand).

#### 4. Update `tokens.md`

Move the section from "Accent colors (section-type theming)" / "DEPRECATION CANDIDATE" framing to a proper "Page-type palette" section explaining:
- The 4 page types and their colors
- The 3 surfaces each color drives (hero / snapshot / action bar)
- How to add a 5th page type

#### 5. Update `:root` comment

Replace the deprecation framing with a "page-type palette" intro that names the system.

---

## Cost / impact summary

| Option | Token count | Code touches | Risk | Doc work |
|---|---|---|---|---|
| A — Keep | 8 | 0 | None | None |
| B — Trim dead 2 | 6 | 0 (tokens never used) | None | Minor (remove deprecation framing) |
| C — Fold | 0 | ~14 hex insertions across 14 rules | Visible if a designer mistypes a hex | Major rewrite |
| **D — Promote** | 6 (or 8 if compatibility gets its own) | 0 | None — pure documentation | New "Page-type palette" section in tokens.md |

---

## Open questions for the design call

1. **Does compatibility deserve its own accent color?** — Currently uses `--codex-gold-muted`. If yes, propose `--codex-compatibility` (e.g. warm bronze `#6f4e37`); if no, document the brand-gold reuse as intentional.

2. **Are there any plans for a 5th page-type?** — e.g. `tutorial`, `case-study`, `news`. If yes, which color?

3. **Are the `-border` variants ever needed?** — The `-light` (gradient stop) and base color are used; `-border` was speculative and never adopted. Drop?

4. **Does the system need a `[data-page-type="product"]` explicit declaration?** — Currently products have no `data-page-type` attribute, so they fall through to brand defaults. Making it explicit would let products carry a brand-color accent border too (currently they don't).

---

## Action items if Option D is approved

- [ ] Hold 30-min design call to answer the 4 open questions
- [ ] Trim `--codex-teal-border` + `--codex-forest-border` from `:root`
- [ ] (Optional) Add `--codex-compatibility-{base,light}` per design call decision
- [ ] Rename `tokens.md` section from "Accent colors (section-type theming)" → "Page-type palette"
- [ ] Update `tokens.md` to remove "DEPRECATION CANDIDATE" framing; replace with system documentation
- [ ] Update `:root` comment block in `codex.css` to introduce the palette as a feature
- [ ] Document in `docs/conventions.md` how to add a new page-type theme (if/when)
- [ ] (Stretch) Add `[data-page-type="product"]` explicit declaration with `--codex-gold-muted` accent for visual coherence

**Estimated total**: ~30 min design call + ~1 hour CSS / docs work. No render-function changes (the system already drives off `data-page-type` attribute).

---

## What this RFC tells us about the audit

The audit's heuristic "low usage → fold into consuming rule" was good as a default rule but **wrong here** because of measurement error: the audit counted "uses" without mapping them to a coherent system. 5-6 callsites *across multiple surfaces, driven by the same data attribute* isn't "low usage" — it's a **feature**.

Future audits should ask: *do these tokens form a coherent system?* before recommending deprecation. A single hex used 3 times = waste. Three hexes used 5 times each, each driving a coherent visual category = a feature worth naming.

— DS-12 #10 RFC (Option D recommended)
