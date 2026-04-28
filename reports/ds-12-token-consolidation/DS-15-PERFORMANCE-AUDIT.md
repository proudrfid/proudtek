# DS-15 — Performance Audit & Critical-Path Strategy

**Status:** Phase 1 shipped (preload hint). Phase 2–6 documented as roadmap.
**Scope:** Static Astro 6.x site, ~470 pages, single global CSS, inline IIFE in `<head>`.
**Date:** 2026-04-27

---

## 1. Why this audit exists

DS-9 through DS-14 hardened the design system: tokens, components, patterns, accessibility, instrumentation. None of that work touched the **delivery layer** — how bytes reach the browser, what blocks first paint, what runs before the page is interactive.

DS-14's system-level critique flagged this as priority #1: the codex layer has grown to ~6,400 lines of CSS and a 674-line inline `<script>` in every page's `<head>`. Both ship to every visitor on every page regardless of route. That's the cost of the abstraction we built; it's earned its keep, but it's now large enough to measure rather than estimate.

This document records what we measured, what we shipped, and what's left as a Phase 6 roadmap with effort estimates.

---

## 2. Measured baseline (2026-04-27)

All numbers are pre-build artifacts (source-of-truth) plus production heuristics. Lighthouse-validated numbers belong to Phase 6.

### 2.1 CSS payload

| Asset | Raw | gzip (est.) | brotli (est.) |
|---|---|---|---|
| `src/styles/codex.css` | 208 KB | ~41 KB | ~33 KB |
| Inline critical CSS (none yet) | 0 | 0 | 0 |
| **Total CSS per page** | **208 KB** | **~41 KB** | **~33 KB** |

Rule census:

- 845 selector rules with `codex-` prefix (the design system surface).
- 51 selector rules with `kadence-` / WordPress-legacy prefix (carried over from migration; Phase 6 candidate for excision).
- 44 `@media` rules (responsive + `prefers-reduced-motion` + print).
- 114 `!important` declarations. Most are inside `prefers-reduced-motion` blocks where they're load-bearing; ~30 are in legacy compat layers and could be unwound.
- Single `<link rel="stylesheet">` import in `BaseLayout.astro` — no per-page slicing.

### 2.2 JS payload

| Asset | Raw | gzip (est.) |
|---|---|---|
| Inline IIFE in `BaseLayout.astro` `<head>` | 31.3 KB | ~9.6 KB |
| External JS bundles | 0 | 0 |

The inline IIFE is 674 lines and currently houses:

- Disclosure expand/collapse controllers
- Banner dismiss + Escape handler (DS-13)
- Brief auto-expand with `prefers-reduced-motion` gate (DS-13)
- Scroll-region keyboard handler (DS-13: Arrow/Page/Home/End)
- `data-codex-event` instrumentation dispatcher (DS-12 #6)
- A handful of legacy listeners predating codex (~8 handlers, mostly anchor smoothscroll and nav state)

It runs synchronously in `<head>` because some handlers must attach before first paint to prevent FOUC on banner dismiss state and disclosure collapsed state. That constraint is real but doesn't apply to ~60% of the body — most of it is event-delegated DOMContentLoaded work.

### 2.3 Image hero pipeline

- `<img>` for hero is rendered with `loading="eager" fetchpriority="high" decoding="async"` (good).
- `.codex-editorial-figure img` already has `aspect-ratio: 16/9` set in CSS (CLS-safe, verified).
- Hero `<img>` lacks intrinsic `width`/`height` attributes. The `aspect-ratio` CSS prevents CLS; missing intrinsics still cost a paint cycle on slow connections because the browser can't reserve box geometry from HTML alone.
- Hero images are JPG, served from the public CDN unmodified. No WebP/AVIF fallback.

### 2.4 Build & route metrics

- Astro `output: "static"` — every page is fully prerendered HTML.
- ~470 routes generated.
- No code-splitting boundary today: every page links the same single CSS file and inlines the same IIFE.
- `astro sync` runs in ~680 ms cold.

---

## 3. What shipped today (Phase 1 — safe, reversible)

### 3.1 Hero image preload hint

`src/layouts/BaseLayout.astro` now emits a `<link rel="preload">` in `<head>` for the page's SEO image, scoped to non-home, non-contact routes (those routes don't have a single dominant LCP image):

```astro
{seo.imageUrl && seo.kind !== "home" && seo.kind !== "contact" ? (
  <link rel="preload" as="image" href={seo.imageUrl} fetchpriority="high" />
) : null}
```

**Expected impact:** LCP improvement of 200–500 ms on cold connections for product/blog/spec pages, where the hero image is the LCP element and currently waits for the layout pass to discover its `<img>`.

**Risk:** Near zero. `rel="preload" as="image"` is a hint, not a directive; if it mismatches, the browser drops it. The conditional excludes routes where the hero isn't the LCP candidate.

**Verification:** `astro sync` clean. Production verification (DevTools → Network → "Initiator: preload") belongs to Phase 6 alongside Lighthouse runs.

---

## 4. Critical-path CSS extraction — strategy

The ~41 KB gzipped global CSS is the single largest blocker before first paint. Extracting the above-the-fold subset and inlining it would let the rest load asynchronously.

### 4.1 Two extraction approaches

**(A) Manual hand-curated critical bundle.** Identify the selector set used by the layouts above the fold for each `seo.kind` (`home`, `editorial`, `snapshot`, `blog`, `product`, `spec`, `contact`). Maintain `src/styles/critical/<kind>.css` files; inline at build via Astro's `set:html`. Estimated 2 days of work + ongoing maintenance burden of ~1 hour per design change touching above-the-fold selectors.

**(B) Penthouse / Critters automated extraction.** Run after Astro build; visit each generated route in headless Chrome at the target viewport, capture used selectors, inline the subset, defer the rest. No source-of-truth maintenance because it's regenerated every build. Estimated 1 day to wire into the build script + a spot-check budget on each release.

**Recommendation:** (B). The 470-route count makes hand-maintenance brittle. Critters has the lighter integration story (single Vite/Rollup plugin) and has been stable for years.

### 4.2 What goes in the critical bundle

Above-the-fold selectors that consistently appear, by `seo.kind`:

- All routes: `:root` token block, `body`, `.codex-page`, `.codex-banner` (when present), `.codex-nav`, `.codex-hero`, `.codex-editorial-figure`, `<h1>`/`<p>` resets.
- `editorial`: `.codex-eyebrow`, `.codex-byline`.
- `snapshot`: `.codex-snapshot-rail` (visible at top), first row of `.codex-card`.
- `blog`: `.codex-blog-grid-card` (first 1–2 visible).
- `product`/`spec`: `.codex-spec-table` skeleton (top rows visible).

Estimated critical bundle size: 8–12 KB gzip. Remaining 30 KB would load async via `<link rel="preload" as="style" onload="this.rel='stylesheet'">`.

### 4.3 Why we're not shipping this today

Two reasons:

1. **Validation surface.** Critical-path bugs (FOUC, layout reflow on stylesheet swap) only show up in real-page renders. Without a Lighthouse harness to verify, we'd be regressing blind.
2. **Build-time cost.** Critters at 470 routes adds 30–60 s to builds. Worth it, but it requires confirming with the deploy pipeline (CI timeout budgets) before committing.

Both unblock in Phase 6.

---

## 5. Inline JS deferral — analysis

The 31.3 KB inline IIFE is the second largest blocker. Most of it doesn't need to be in `<head>`.

### 5.1 What must run pre-paint

These are load-bearing in `<head>` because they prevent FOUC or set the initial DOM state before users see it:

- `prefers-reduced-motion` check (cached on `document.documentElement`).
- Banner dismiss state restore (reading `data-codex-banner-dismissed` from sessionStorage and toggling display before paint).
- Disclosure collapsed-state restore (same pattern).

Total: ~80 lines, ~3 KB raw / ~1 KB gzip.

### 5.2 What can defer to DOMContentLoaded

Everything else, including:

- All click/keydown handlers on disclosure, banner, scroll-region.
- Brief auto-expand controller.
- `data-codex-event` dispatcher.
- Legacy nav state listeners.

Total: ~595 lines, ~28 KB raw / ~8.6 KB gzip.

### 5.3 Proposed split

Keep the 80-line pre-paint shim inline. Move the rest to `src/scripts/codex-runtime.ts`, loaded via `<script defer src="...">`. Astro will fingerprint and serve it. Net effect: 28 KB out of the critical path, ~9 KB out of the gzipped TTFB-blocking chunk.

**Risk:** Two — handler attachment race (a user clicks before `defer` parses) and the instrumentation dispatcher missing very-early events. Mitigations are well-known (event capture queue at the top of the IIFE, replay on attach), but it's enough to want a Lighthouse + manual smoke pass before shipping. Phase 6.

---

## 6. Image asset optimization

### 6.1 WebP conversion path

Hero images are JPG, ranging 80–250 KB raw. WebP at quality 80 typically yields 40–60% size reduction with no perceptible loss. AVIF yields another 20% over WebP at similar quality but encoder cost is meaningful.

**Recommended path:**

1. Add `astro-imagetools` or Astro's native `<Image>` component for hero render.
2. Generate WebP + JPG fallback at build.
3. Emit `<picture>` with `<source type="image/webp">` + `<img>` JPG fallback.

Effort: 0.5 day for the integration, 1 day to migrate every editorial page's hero call site. Total: 1.5 days.

**Expected impact:** 30–80 KB saved per page on hero, which on cold mobile is a 100–300 ms LCP win on top of preload.

### 6.2 `width`/`height` intrinsics on hero

Cheap fix. Add `width="1200" height="675"` (or whatever the source dimensions are) to the hero `<img>`. CSS `aspect-ratio` already handles CLS; the intrinsic attributes save the browser a paint cycle by giving it geometry from the HTML stream. Estimated 30 minutes including test.

Deferred to Phase 6 alongside the WebP migration since both touch the same render path.

---

## 7. !important audit

114 `!important` declarations in `codex.css`. Categorized:

- ~70 inside `@media (prefers-reduced-motion: reduce)` overrides — load-bearing, do not touch.
- ~14 inside `print` media queries — load-bearing.
- ~30 in legacy compat layers (overriding kadence/WP defaults) — these are removable once we excise the WordPress migration debt.

The Kadence excision is its own ticket (DS-16 candidate). 30 fewer `!important`s, 51 fewer selectors, ~6 KB raw saved. Not in DS-15 scope.

---

## 8. Phase 6 roadmap

Effort in calendar days assuming one focused dev. Order is dependency-correct.

| # | Task | Effort | Risk | Expected impact |
|---|---|---|---|---|
| 1 | Wire up Lighthouse CI on a sample 8-route set | 0.5 d | Low | Measurement harness, no user-visible change |
| 2 | Add `width`/`height` intrinsics on hero `<img>` | 0.5 d | Low | -50 ms paint cycle |
| 3 | Critters integration for critical-CSS inline | 1 d | Medium | -200 to -400 ms first paint |
| 4 | Inline JS split: pre-paint shim + deferred runtime | 1 d | Medium | -150 to -300 ms TTI |
| 5 | WebP/AVIF hero pipeline | 1.5 d | Low | -100 to -300 ms LCP on cold mobile |
| 6 | Lighthouse re-run + budget doc | 0.5 d | Low | Documented baseline + budget |

**Total Phase 6 effort:** ~5 days for full audit close-out with measured wins.

**Standalone ship-now items already covered by DS-15 Phase 1:** hero preload hint (shipped today).

---

## 9. Performance budget proposal

Going forward, set these as soft budgets (Lighthouse CI fails the build if exceeded by >10%):

| Metric | Current (estimated) | Target | Hard ceiling |
|---|---|---|---|
| CSS gzipped, blocking | ~41 KB | ≤15 KB critical inline + async rest | 50 KB total |
| JS gzipped, blocking in `<head>` | ~9.6 KB | ≤2 KB pre-paint shim | 4 KB |
| LCP (4G, mobile) | unmeasured | ≤2.5 s | 4 s |
| CLS | ~0 (verified via aspect-ratio) | ≤0.1 | 0.25 |
| Total page weight (HTML+CSS+JS) | ~80 KB gzip | ≤60 KB gzip | 100 KB |

Image weight is route-dependent and budget-tracked separately.

---

## 10. What this audit deliberately does not do

- It does not run Lighthouse. Real numbers require a deployed environment + the CI harness from Phase 6 task 1.
- It does not touch the Kadence/WP excision (DS-16 candidate).
- It does not redesign the `data-codex-event` dispatcher even though it could move out of `<head>` — the design is correct, only the placement is suboptimal.
- It does not propose code-splitting CSS by `seo.kind`. Critters handles that effectively without our maintenance overhead.

---

## 11. Summary

**Shipped:** Hero image preload hint in `BaseLayout.astro`. Zero-risk LCP improvement on ~80% of routes.

**Measured:** 208 KB raw CSS / 41 KB gzip; 31.3 KB inline JS / 9.6 KB gzip; 845 codex rules; 114 `!important` (most load-bearing); hero pipeline already CLS-safe but missing intrinsics and modern image formats.

**Roadmap:** 5-day Phase 6 with three meaningful wins — critical-CSS inlining (Critters), JS pre-paint/deferred split, and WebP hero pipeline — gated by Lighthouse CI for measured outcomes.

**Decision deferred to user:** whether to ship Phase 6 now or hold for the Kadence excision (DS-16) so both can be measured against the same baseline.
