# Phase 7 — Kadence/WP JS Layer Diagnostic

**Status:** Diagnostic complete. 3 dead scripts removed via render-snapshot strip patterns.
**Method:** Same emitter↔consumer cross-reference as DS-16, applied to the JS layer.
**Date:** 2026-04-27

---

## 1. Why this exists

DS-16 audited the Kadence/WP **CSS** adapter layer and found 47/51 selectors load-bearing. The DS-15 baseline measurement showed per-page script weight 310–696 KB and earlier prose framed this as "Kadence JS = 310 KB elephant" — calling for a sibling diagnostic.

Lighthouse network-request data reveals the framing was wrong: **Kadence-prefixed JS is small (~28 KB unique, 3–15 KB per route).** The 310+ KB came from Google services (gtag + Maps), not Kadence. So this diagnostic is narrower than expected — but a few real dead scripts surfaced, plus one leaked polling interval that's worse than its bytes suggest.

---

## 2. Inventory — every JS file shipping per page

Source: 24 Lighthouse runs (8 routes × 3) network logs.

| File | Transfer | Routes | Origin |
|---|---|---|---|
| `gtag/js?id=GT-TWTG3JNV` | 156 KB | 8/8 | Google Tag Manager |
| `gtag/js?id=G-30013548` (× 2 endpoints) | 272 KB | 8/8 | Google Analytics 4 |
| `splide.min.js` | 13.3 KB | 1/8 (home) | Kadence theme |
| `navigation.min.js` | 4.8 KB | 8/8 | Kadence theme |
| `jarallax.min.js` | 4.1 KB | 5/8 | Kadence-blocks plugin |
| `kb-form-block.min.js` | 2.6 KB | 2/8 (contact, home) | Kadence-blocks plugin |
| `kb-splide-init.min.js` | 2.0 KB | 1/8 (home) | Kadence-blocks plugin |
| `kb-advanced-heading.min.js` | 0.9 KB | 7/8 | Kadence-blocks plugin |
| `kt-init-parallax.min.js` | 0.9 KB | 5/8 | Kadence-blocks plugin |
| `easy-table-of-contents/front.min.js` | 1.7 KB | 1/8 | Plugin |
| `easy-table-of-contents/smooth_scroll.min.js` | 0.9 KB | 1/8 | Plugin |
| `maps.googleapis.com/*` (8 files) | ~370 KB | 1/8 (contact) | Google Maps |

Total Kadence-only: ~28 KB unique, ~3–15 KB per route. Compare with gtag at ~430 KB on every route — the real elephant.

---

## 3. Categorization — the seven Kadence/WP scripts

### DEAD (3 scripts)

#### `splide.min.js` — 13 KB on home

- **Library:** Splide carousel. ~30 KB raw.
- **Initializer target:** `.wp-block-kadence-testimonials .kt-blocks-carousel-init` (testimonial blocks).
- **Why dead:** `render-snapshot.ts:153` strips the `kt-blocks-carousel-init` class from testimonial wrappers (was already in place before this audit) so the static 3-up grid renders correctly. With the class stripped, Splide has nothing to bootstrap.
- **Verified:** Built `dist-restored/index.html` contains `0` instances of `kt-blocks-carousel-init`.
- **Action:** Strip `<script src*="splide.min">` in `UNUSED_HEAD_ASSET_PATTERNS`.

#### `kb-splide-init.min.js` — 2 KB on home

- **Code:** `querySelectorAll(".wp-block-kadence-advancedgallery .kt-blocks-carousel-init")` — looks for advanced-gallery carousels.
- **Why dead:** Same class strip as above; the selector finds zero elements.
- **Action:** Strip via the same pattern.

#### `kb-advanced-heading.min.js` — 0.9 KB on 7 routes (worse than its size)

- **Code:** `setInterval(() => { if (Typed exists) { document.querySelectorAll(".kt-typed-text").forEach(...) } }, 125)` — polls for a `Typed` global to bootstrap typed-text animation on `.kt-typed-text` elements.
- **Why dead:**
  1. **`Typed` is never loaded** — no `Typed.js` script ships from Kadence or codex.
  2. **`.kt-typed-text` matches zero elements** — verified via grep on the built `dist-restored/`. The animated-typing feature was never used.
- **Why it's worse than 0.9 KB:** the `setInterval(..., 125)` runs **8 times per second forever** on every page that loads this script. Tab idle = 8 wasted timer wakeups/sec × 7 routes that load it. CPU cost trivial per wakeup, but it's a textbook performance leak.
- **Action:** Strip.

### LOAD-BEARING (4 scripts)

#### `navigation.min.js` — 4.8 KB on all 8 routes

- **Functions:** `kadence.initOutlineToggle` (keyboard-vs-mouse focus tracking via `hide-focus-outline` body class) + mobile drawer toggle wiring.
- **Modern equivalent:** `:focus-visible` CSS handles the outline part natively.
- **Why kept:** the mobile drawer toggle (`.menu-toggle-open`, `.drawer-toggle`) still depends on this JS to flip the drawer state. Replacing it would require reimplementing the drawer in our own IIFE — not a perf-driven need (4.8 KB total).
- **Future ticket candidate:** if we replace the mobile drawer with a codex-native pattern, this becomes removable.

#### `jarallax.min.js` + `kt-init-parallax.min.js` — 5 KB combined on 5 routes

- **Function:** Parallax scroll effect for `.kt-jarallax` elements (cover-block backgrounds).
- **Verified:** built `dist-restored/about/index.html` ships 1 `.kt-jarallax` element.
- **Why kept:** the parallax effect is a visible UX feature on the about page hero. Removing the JS would freeze the background — no functional break, but a visual loss.
- **Decision needed:** if visual parallax isn't desired, we can strip both classes via render-snapshot + remove these scripts. ~5 KB × 5 routes saving. Not in scope here without product input.

#### `kb-form-block.min.js` — 2.6 KB on 2 routes

- **Function:** Kadence form-block submit handler + client-side validation.
- **Routes:** `/contact/` (primary contact form) and `/` (home page embedded inquiry form).
- **Why kept:** DS-11 #5c added our own form-validation-enhancement IIFE in `BaseLayout.astro`, but the actual submit POST + Kadence-side state-machine still lives in this script. Removing it would require reimplementing form submission.
- **Future ticket candidate:** swap to a vanilla `fetch`-based submit + native HTML5 validation — would let us remove this script and DS-11 #5c's polyfill in one pass.

#### `kt-accordion.min.js` — 12.7 KB on /faq/ (not in 8-route sample)

- **Function:** Kadence accordion block runtime (open/close + smooth-height transitions).
- **Used on:** `/faq/` page, possibly others outside the sample. The page emits `<button class="kt-blocks-accordion-header">` + `<div class="kt-accordion-panel">`.
- **Why kept:** the FAQ page's accordion behavior depends on it.
- **Future ticket candidate:** DS-12 #4A defined the `.codex-disclosure` pattern. Migrating /faq/ to that pattern would eliminate this script.

---

## 4. What shipped — actual fix

`src/lib/render-snapshot.ts` `UNUSED_HEAD_ASSET_PATTERNS` extended with three new entries:

```ts
'script[src*="splide.min"]',
'script[src*="kb-splide-init"]',
'script[src*="kb-advanced-heading"]',
```

Wrapped in a comment block that links to this doc and explains the reasoning per script.

**Net byte savings per route:**

| Route | Before | After | Saved |
|---|---|---|---|
| `/` | splide 13 KB + kb-splide-init 2 KB + kb-adv-heading 0.9 KB | 0 | **−15.9 KB** |
| `/about/` | kb-adv-heading 0.9 KB | 0 | −0.9 KB |
| `/blog/` | kb-adv-heading 0.9 KB | 0 | −0.9 KB |
| `/compare/...` | kb-adv-heading 0.9 KB | 0 | −0.9 KB |
| `/industries/...` | kb-adv-heading 0.9 KB | 0 | −0.9 KB |
| `/products/.../...` | kb-adv-heading 0.9 KB | 0 | −0.9 KB |
| `/solutions/.../...` | kb-adv-heading 0.9 KB | 0 | −0.9 KB |
| `/contact/` | (no eligible scripts) | 0 | 0 |

Plus: **the leaked `setInterval(..., 125)` is gone** on 7 routes. This is the bigger win conceptually — battery / CPU on idle tabs.

---

## 5. Methodology — fifth instance recorded

Phase 7 follows the same pattern that produced four prior over-counts:

1. DS-12 #9 shadow tokens — assumed swappable; was a coherent system.
2. DS-12 #10 page palette — assumed wasteful; was load-bearing.
3. DS-16 Kadence CSS — assumed migration debt; was adapter layer.
4. DS-15 Phase 6 (Critters + JS-split) — assumed worth 1s; FCP/TBT already healthy.
5. **Phase 7 Kadence JS — assumed 310 KB elephant; was actually 28 KB, with only 16 KB dead.**

The 310 KB framing came from category bucketing in the Lighthouse `resource-summary:script:size` audit, which lumps gtag + Maps + Kadence + tracking together. The actual Kadence-prefixed traffic was an order of magnitude smaller. **Lesson:** when a number triggers an audit, drill into per-resource breakdown before naming a category as the cause.

The methodology now has its longest streak: five consecutive audits where measurement contradicted the prefix-based framing. Future audits should default to "skeptical of the framing" until per-item evidence is gathered.

---

## 6. What's still on the table

Three follow-ups identified during diagnostic, all gated on independent decisions:

- **Parallax removal** (5 KB × 5 routes = 25 KB) — needs visual sign-off. If parallax on /about/ hero isn't important, strip both `.kt-jarallax` class via render-snapshot + remove `jarallax.min.js` + `kt-init-parallax.min.js`. ~30 min work.
- **Mobile drawer rewrite** (4.8 KB × 8 routes = 38 KB) — replace Kadence drawer + outline toggle with a codex-native IIFE. ~1 day work + visual regression check on every page.
- **FAQ accordion → `.codex-disclosure` migration** (~13 KB on /faq/) — covered by the existing DS-12 #4A pattern; migration would eliminate `kt-accordion.min.js` for free. ~0.5 day work.

None of these are urgent; all routes pass Lighthouse cleanly today. Filing as known opportunities, not next-action items.

The Google services (gtag + Maps) totaling ~430 KB per route are out of scope for "Kadence JS layer" but represent the real script weight. Decision belongs to product/marketing; engineering can offer to defer gtag (already async, but `defer` rather than `async` would push it out of the LCP race) for incremental wins.

---

## 7. Summary

7 Kadence/WP JS scripts audited. **3 confirmed dead** via emitter↔consumer cross-reference and shipped as render-snapshot strip patterns. **4 confirmed load-bearing**, with documented future migration paths for each. **No new dependencies, no behavior changes** — pure dead-weight removal.

**Headline:**
- Home page: 15.9 KB JS removed + dead Splide trampoline removed.
- 6 other routes: 0.9 KB removed each + leaked setInterval(125ms) stopped.
- /contact/ + /faq/: untouched (no eligible candidates).

The biggest finding isn't the bytes — it's the leaked timer. `kb-advanced-heading.min.js` was polling every 125 ms forever on 7 routes for a `Typed` global that never appears, hunting for `.kt-typed-text` elements that don't exist. Now it's gone.

**Phase 7 closes.** Phase 6 + 7 together have audited and rationalized the Kadence/WP CSS layer (DS-16) and JS layer (this doc). Both close with the same pattern: most of the layer is load-bearing adapter, a small minority is genuine debt, and the audit framing was bigger than the reality.

The DS-15 → Phase 6 → Phase 7 trilogy ends. Next coherent direction would be the gtag/Maps deferral (different layer entirely) or category expansion of the Lighthouse sample.
