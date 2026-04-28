# Codex conventions

> **Purpose**: codify the naming, structure, and discipline rules that have emerged across DS-1 through DS-12. The system has good bones but loose enforcement; this file is what new contributors read first.

---

## Class naming

### Prefix

Every Codex class starts with `.codex-`. This is the trust boundary against:
- WordPress / Kadence inherited classes (e.g. `.wp-block-cover`, `.kb-form-field`)
- Tailwind-style utility leak
- Other plugins that may load alongside

If a class doesn't start with `.codex-`, it isn't governed by this design system.

### Structure (BEM-ish)

```
.codex-<context>__<part>--<modifier>
```

- `<context>` — the component name. Hyphenated: `editorial-section`, `industries-hub-card`.
- `__<part>` — a child element of that component. Optional. `editorial-section__intro`.
- `--<modifier>` — a variant of the component or part. Optional. `--ghost`, `--with-rail`.

Examples:
```
.codex-hero-cta-btn               # component
.codex-hero-cta-btn--ghost        # variant of the component
.codex-editorial-section          # component
.codex-editorial-section__intro   # part
.codex-editorial-pillar--with-rail # variant
```

### State

```
.codex-<component>.is-<state>
.codex-<component>.has-<feature>
```

- `is-*` — boolean state on the component instance itself: `is-active`, `is-visible`, `is-invalid`, `is-scrolled`.
- `has-*` — parent acknowledging child state: `.codex-rail.has-active-filters`.
- `--*` — variant (visual or behavioral configuration that doesn't change at runtime).

The three are **distinct**. Don't conflate them:
- ✅ `.codex-button--primary.is-disabled` (variant + runtime state)
- ❌ `.codex-button-primary-disabled` (smushed)
- ❌ `.codex-button.is-primary` (variant should be `--primary`)

### File ordering inside `codex.css`

The CSS file is organized top-to-bottom:

1. **Tokens** (`:root` block, lines 4–148)
2. **Global a11y** (focus-visible, reduced-motion)
3. **Layout primitives** (containers, grids)
4. **Editorial layout** (page-level shells: pillar, contact, snapshot)
5. **Components** (in the order they were added — not alphabetical, this preserves git-blame archaeology)
6. **Cross-cutting overrides** (Kadence override blocks, footer normalization)
7. **DS-N batch additions** at the bottom (each DS round has a header comment + dated)

Rule: **never insert into the middle**. Append your additions to the bottom under a dated header comment. This keeps git-blame readable.

---

## Tokens

### Always reach for a token first

For these properties, never use raw values:
- color (no hex, no rgba)
- font-size, font-weight, line-height
- spacing (padding, margin, gap)
- border-radius
- transition duration
- z-index
- box-shadow (use `--codex-elevation-*`)

### Acceptable raw values

Raw values are OK for:
- **Layout primitives** that don't fit the spacing scale: `flex-basis`, `grid-template-columns`, fixed widths driven by content (e.g. `width: 1180px` for a max-width container).
- **One-off animation parameters** like `transform: rotate(-45deg)`.
- **Border widths under 4px** (1px, 2px, 3px) — the spacing scale doesn't go that low and a token would be over-engineering.
- **Calculation operands** inside `calc()` where a token would harm readability.
- **Comments + documentation** referencing concrete values.

### Fallback values inside `var()`

Use `var(--codex-token, fallback)` for color / spacing / radius / z-index — anywhere the rule could break visually if the token fails to load.

The fallback must **match the token's actual resolved value**. Mismatched fallbacks are caught at audit:
- ❌ `color: var(--codex-gold, #d4a755);` (token resolves to `#c39a5f`)
- ✅ `color: var(--codex-gold, #c39a5f);`

For motion / transition / easing, fallbacks are optional — if the token fails to load, transitions just become instantaneous, which is a graceful degrade.

---

## `!important`

Use `!important` only when:
1. Overriding Kadence / WordPress inherited styles that ship with their own `!important`
2. Forcing color/text-decoration on `<a>` tags inside post-processed snapshot HTML
3. Writing a print-style or `prefers-reduced-motion` rule that must always win

Don't use `!important` to:
- Win an internal Codex specificity battle (refactor selectors instead)
- Override another component's styling (leak boundary; refactor instead)
- "Make sure this stays" without a comment explaining what it's fighting

Every `!important` must be paired with a comment naming the inheritance chain it's defeating, or it's a code smell:
```css
/* !important defeats Kadence's .wp-block-button > a inline style */
.codex-hero-cta-btn { color: var(--codex-text-strong) !important; }
```

**Audit goal**: never let `!important` exceed 120 in `codex.css`. Currently 113 (DS-12 baseline).

---

## File mapping

| File | Owns | Don't put here |
|---|---|---|
| `src/styles/codex.css` | All Codex CSS | One-off page styles, scoped Astro styles |
| `src/lib/editorial-pages.ts` | Editorial-page render functions, components rendered in editorial layout | Snapshot post-processing, SEO logic |
| `src/lib/seo.ts` | SEO + post-processing of WordPress snapshots, footer normalization, JSON-LD | Editorial render logic |
| `src/lib/render-snapshot.ts` | Snapshot HTML pipeline orchestration, mega-menu injection | Editorial section render |
| `src/lib/icons.ts` | SVG icon library (~48 icons) | Icon usage logic |
| `src/layouts/BaseLayout.astro` | Page shell, sticky CTA, all client-side JS | Per-page logic |

---

## Inline scripts

All client-side JS lives in **one** `<script is:inline>` block at the bottom of `BaseLayout.astro`. We do this so:
- One network call (no JS bundle to load)
- Survives any SSR mode or page-type variation
- Easy to grep when debugging

Conventions:
- Wrap everything in a single IIFE
- Use `var` for top-level scope (avoid `let`/`const` in IIFE — older browser parity)
- Each feature gets a comment header naming the DS round + date
- Use feature-detect over UA-sniff: `if ('IntersectionObserver' in window)`
- Listen on document with `{ capture: true }` for delegated handlers that must survive DOM swaps

---

## Instrumentation (`data-codex-event` family)

The site is **vendor-agnostic for analytics**. We don't ship a GTM/GA4/Mixpanel SDK; instead we push events to `window.dataLayer` (the universal dropoff that GTM, GA4, Heap, and most others read) and dispatch a parallel `codex:event` `CustomEvent` so anything else can listen too. This means swapping analytics vendors is a vendor-config change, not a code change.

### The attribute

```
data-codex-event="<event_name>"
```

Any element with this attribute becomes an analytics event source. The handler in `BaseLayout.astro` watches `click` events bubbling up to the document and pushes the configured event with metadata.

### Optional metadata attributes

| Attribute | Purpose |
|---|---|
| `data-codex-event-tier="<tier>"` | Categorical bucket (e.g. "hero", "footer", "nav-primary") |
| `data-codex-event-label="<label>"` | Override the auto-derived label (defaults to `textContent`) |

### Payload shape

Every push includes:

```js
{
  event: '<event_name>',
  label: '<label>',
  tier: '<tier or null>',
  href: '<href if anchor>',
  route: '<current pathname>',
}
```

### Backward compat — `data-cta-tier`

The pre-DS-12 `data-cta-tier="hero|action|sticky"` attribute still fires the legacy `cta_click` event with the original payload shape (`cta_tier / cta_label / cta_href / cta_route`). Existing analytics dashboards keep working unchanged. New code should prefer `data-codex-event` for clarity, but the two patterns coexist and you can use both on the same element if you need legacy analytics + the new format.

### Form events (DS-12 #6B)

`form[data-codex-rfq]` automatically fires three events without needing additional attributes:

| Event | When | Payload |
|---|---|---|
| `form_focus` | First field interaction | `form_id`, `field_focused`, `route` |
| `form_field_complete` | Per-field completion (once per field) | `form_id`, `field_name`, `route` |
| `form_submit` | On submit (regardless of validation outcome — analytics consumer should join with redirect-target visibility to detect "successful submit") | `form_id`, `fields_completed`, `route` |

Form abandonment is inferable: any session with `form_focus` but no matching `form_submit` is a drop-off.

### How to add a new event source

1. **Pick a stable event name** — snake_case, past tense, namespaced if non-obvious. Good: `nav_open`, `download_started`, `video_played`. Bad: `Click`, `event1`, `important_action`.
2. **Add the attribute** to the element: `data-codex-event="nav_open"`.
3. **Set the tier** if it'll be split in dashboards: `data-codex-event-tier="primary"`.
4. **Document the event** in this file's table when you add it. Without docs, downstream dashboards can't join correctly.

### Listed events (current)

| Event | Source | Tier values |
|---|---|---|
| `cta_click` (legacy) | `[data-cta-tier]` (currently 3 elements: hero / action / sticky) | `hero`, `action`, `sticky` |
| `form_focus` | `form[data-codex-rfq]` (auto) | n/a |
| `form_field_complete` | `form[data-codex-rfq]` (auto) | n/a |
| `form_submit` | `form[data-codex-rfq]` (auto) | n/a |

### Don't

- **Don't fire events from inline `onclick="..."`**. Use `data-codex-event` so the event surface stays uniform and discoverable via `grep`.
- **Don't add a vendor-specific snippet** (e.g. `gtag('event', ...)`). Push to `dataLayer` only — vendors read it.
- **Don't change a documented event's name or payload**. Dashboards depend on stability. If the semantics change, deprecate the old name and add a new one.
- **Don't put PII in the payload**. The `route` field is fine (no query string is captured); `href` is captured for outbound clicks. If you need to track form data, hash it before pushing.

---

## A11y checklist for any new interactive element

Before merging:

- [ ] Is the element keyboard-reachable? Tab order makes sense?
- [ ] Does it have a visible focus indicator? `:focus-visible` + `--codex-ring`?
- [ ] If it changes state, is the state announced to screen readers? `aria-pressed`, `aria-expanded`, `aria-current`, `aria-selected` as appropriate.
- [ ] If it triggers an error/success message, is the message in a `[role="alert"]` `[aria-live="polite"]` container?
- [ ] If it's an icon-only control, does it have a real label? `aria-label="Dismiss"` or visually-hidden text.
- [ ] Touch target ≥44×44? `min-height: var(--codex-touch-min)`.
- [ ] Color contrast ≥4.5:1 (normal text) or ≥3:1 (large text)?
- [ ] Animation under `prefers-reduced-motion: reduce`?
- [ ] Decorative icons / arrows / chars wrapped in `<span aria-hidden="true">`?

---

## Browser support

The site targets:
- **Modern evergreen browsers** (Chrome / Edge / Firefox / Safari latest 2 versions)
- **Mobile Safari iOS 14+**
- **Chrome on Android 10+**

We **don't support**:
- IE11 (Astro doesn't either)
- Browsers without CSS Custom Properties
- Browsers without `IntersectionObserver` (graceful degrade — Brief auto-expand and sticky CTA simply don't activate)

Polyfills are forbidden. If a feature requires a polyfill, redesign so the absence of the feature is a graceful degrade.

---

## When to add a token vs. inline a value

**Add a token when**:
- The same value will appear ≥3 times across the codebase (or already does)
- The value is semantic, not coincidental (e.g. "primary brand gold", not "the width of this card")
- The value might need to change site-wide later (theme, dark mode, A/B test)

**Inline the value when**:
- It appears once and is genuinely one-off
- It's a layout primitive driven by content (e.g. `grid-template-columns: 1fr 240px`)
- It's a derived value from an existing token (`calc(var(--codex-space-4) + 4px)`)

**Audit**: every PR that adds raw values must justify them in the commit message or PR body. Reviewers may ask "why not a token?" and the answer should not be "I forgot."

---

## When to add a component vs. extend an existing one

**Add a new component when**:
- The new concept has <40% visual + behavioral overlap with anything existing
- It will be reused in ≥2 contexts (or is part of a pattern that will be)
- It owns its own a11y story (different keyboard interaction, different ARIA role)

**Extend an existing component when**:
- The new use is a variant of the same concept
- A new modifier (`--<variant>`) or state (`is-*`) is enough to express the difference
- The accessibility story is the same

**Don't**:
- Don't fork a component to "tweak slightly". A new modifier is cheaper than a forked component.
- Don't add a component without an entry in [components.md](./components.md). Documentation gates merge.

---

## Migration playbook

When the audit identifies a token-coverage gap or a deprecated pattern:

1. **Inventory** — `grep -n` the deprecated pattern, count occurrences, note files.
2. **Justify** — write a 1-paragraph note in the PR description: why the new pattern is better, what's at risk, how to verify.
3. **Token-gate** — make sure the new token / pattern exists in `codex.css` first (PR #1: token addition).
4. **Sweep** — `replace_all` or per-file edits to migrate (PR #2: migration).
5. **Verify** — `npx astro sync && npx astro build`. Visual diff at least one page per major route type. Check brace balance: `node -e "const c=require('fs').readFileSync('src/styles/codex.css','utf8'); console.log(c.match(/{/g).length, '/', c.match(/}/g).length)"`.
6. **Document** — update token / component / convention doc as needed.
7. **Close** — note the date and the migration in the changelog at the bottom of [tokens.md](./tokens.md).

---

## Definition of "done" (for a design change)

- All a11y checklist items pass
- All affected components updated in [components.md](./components.md)
- Token usage clean (no new raw hex/rgba/px/transition literals)
- `astro sync` + `astro build` pass
- Visual smoke-test on at least: home, one product editorial, one industry hub, one compare page, `/contact/`
- `prefers-reduced-motion` honored
- Mobile (360px viewport) works
- Changelog entry in the relevant doc

---

## Things we don't do (yet)

These are deliberate non-decisions; if they ever become decisions, document them here.

- **No CSS-in-JS**. Everything goes in `codex.css`.
- **No PostCSS / SCSS / Tailwind**. Pure CSS3 with custom properties.
- **No Storybook**. Documentation lives in markdown next to the source.
- **No automated visual regression**. We rely on manual visual smoke-testing during PR review.
- **No design tokens export to Figma**. The CSS is the single source of truth; design files mirror it (Figma side hand-managed).
- **No CSS modules / scoped styles**. All Codex classes are global by design — they need to apply to post-processed Kadence HTML which we don't author.
- **No component-level CSS files**. The `codex.css` monolith is intentional — single network round-trip, easier to grep, archaeology is by date not by component.

If you want to break one of these rules, write a doc in `docs/decisions/` first explaining why and what changes for everyone else.

---

## Glossary

| Term | Meaning |
|---|---|
| **Codex** | The design system. Named for the editorial focus on B2B reference content. |
| **Token** | A `--codex-*` CSS custom property. The unit of design-decision capture. |
| **Component** | A reusable UI element with at least one `.codex-*` class. |
| **Editorial page** | A page rendered through `editorial-pages.ts`. Has a hero, sections, brief, action bar, sources, RFQ form. ~470 of these. |
| **Snapshot page** | A page rendered from a WordPress export JSON, post-processed in `seo.ts`. Slowly being replaced by editorial pages. |
| **Hub page** | A landing page that rolls up editorial children (e.g. `/industries/`, `/solutions/`, `/blog/`). |
| **Pillar** | The shared hero-grid-rail-CTA layout used by hubs. |
| **Snapshot pipeline** | The cheerio-based DOM transformation in `seo.ts` that normalizes Kadence/WordPress markup. |
| **DS-N** | Design Sprint round N. DS-1 = initial styling. DS-12 = current (token consolidation). |

---

## Changelog

- **2026-04-27 (DS-12 #6 — instrumentation)** — Added the `data-codex-event` family doc + form event spec (form_focus / form_field_complete / form_submit on `[data-codex-rfq]`). Backward-compat preserved for `data-cta-tier`.
- **2026-04-27 (DS-12 Phase 2)** — This file created. Codified naming, token discipline, file mapping, a11y checklist, migration playbook.
- **2026-04-26 (DS-11)** — `data-codex-rfq` form pattern; `is-invalid` / `aria-invalid` discipline.
- **2026-04-26 (DS-10)** — `data-cta-tier` instrumentation; `[^N]` citation marker syntax; `data-collapsible-brief` opt-in.
- **2026-04-22 (DS-9)** — `is-active` for nav active state; `--with-rail` modifier convention.
- **2026-04-22 (DS-6)** — Token system established: spacing, typography, z-index, breakpoints. BEM-ish prefix discipline locked in.
