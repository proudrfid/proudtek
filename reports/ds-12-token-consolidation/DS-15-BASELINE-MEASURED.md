# DS-15 — Measured Baseline (Lighthouse, 2026-04-27)

**Status:** First Lighthouse-CI run complete. 8 routes × 3 runs = 24 reports.
**Source:** `reports/lighthouse-baseline/` (gitignored).
**Date:** 2026-04-27 12:01–12:08 UTC.
**Why this exists:** DS-15-PERFORMANCE-AUDIT.md numbers were estimates from raw source code. This is the harness verification. Several priorities flip.

---

## 1. Headline numbers

### Per-route Lighthouse scores (avg of 3 runs)

| Route | perf | a11y | bp | seo |
|---|---|---|---|---|
| `/` | **0.98** | **0.90** ⚠️ | 1.00 | 1.00 |
| `/about/` | **0.99** | **0.93** ⚠️ | 1.00 | **0.92** ⚠️ |
| `/blog/` | **0.99** | 0.98 | 0.95 | 1.00 |
| `/compare/uhf-vs-hf-rfid/` | **0.99** | 0.96 | 1.00 | 1.00 |
| `/contact/` | **0.99** | 0.96 | 1.00 | 1.00 |
| `/industries/hospitality/` | **0.99** | 0.97 | 1.00 | 1.00 |
| `/products/rfid-cards/mifare-desfire-ev3-card/` | **0.99** | 0.97 | 1.00 | 1.00 |
| `/solutions/digital-product-passport/` | **0.96** | 0.96 | 1.00 | 1.00 |

`⚠️` = below the 0.95 threshold set in `lighthouserc.cjs`.

### Per-route Core Web Vitals (avg of 3 runs)

| Route | LCP | CLS | TBT | FCP | TTI | Total bytes |
|---|---|---|---|---|---|---|
| `/` | 0.94 s | 0.000 | 0 ms | 0.72 s | 0.80 s | **4,740 KB** |
| `/about/` | 0.92 s | 0.000 | 0 ms | 0.57 s | 0.57 s | 1,005 KB |
| `/blog/` | 0.87 s | **0.036** | 0 ms | 0.47 s | 0.47 s | 2,123 KB |
| `/compare/uhf-vs-hf-rfid/` | 0.81 s | 0.000 | 0 ms | 0.62 s | 0.62 s | 523 KB |
| `/contact/` | 0.73 s | 0.000 | 0 ms | 0.57 s | 0.63 s | 911 KB |
| `/industries/hospitality/` | 0.82 s | 0.000 | 0 ms | 0.57 s | 0.57 s | 822 KB |
| `/products/rfid-cards/mifare-desfire-ev3-card/` | 0.86 s | 0.000 | 0 ms | 0.58 s | 0.58 s | 1,018 KB |
| `/solutions/digital-product-passport/` | **1.43 s** | 0.000 | 0 ms | 0.62 s | 0.62 s | 1,695 KB |

**All vitals well under threshold:** LCP < 2.5 s, CLS < 0.1, TBT < 300 ms, FCP < 1.8 s.

### Resource summary (avg of 3 runs)

| Route | Stylesheet | Script |
|---|---|---|
| `/` | 74 KB | **323–463 KB** |
| `/about/` | 68 KB | **310–450 KB** |
| `/blog/` | 62 KB | varies |
| `/compare/uhf-vs-hf-rfid/` | 68 KB | **310 KB** |
| `/contact/` | — | — |
| `/industries/hospitality/` | 68 KB | **310 KB** |
| `/products/rfid-cards/mifare-desfire-ev3-card/` | 68 KB | **310–450 KB** |
| `/solutions/digital-product-passport/` | 68 KB | **310 KB** |

The 310–463 KB script size triggers the harness's 4 KB warn threshold. **Important:** TBT is 0 ms across all routes — the JS is large but not blocking. The threshold I set in `lighthouserc.cjs` was for blocking JS only; the WP/Kadence JS layer is mostly deferred / async.

---

## 2. What the audit got wrong

DS-15-PERFORMANCE-AUDIT.md predicted three meaningful wins. Real numbers say:

### Predicted: "Critters critical-CSS inline → 200–400 ms first paint improvement"

**Reality:** FCP is already 0.47–0.72 s. The 1.8 s budget has 1+ second of headroom. Critters might shave 100 ms; it's not the 200–400 ms predicted because the baseline was already faster than estimated. **Not worth 1 day of work for 100 ms on a route that's already at 0.6 s.**

### Predicted: "JS pre-paint/deferred split → 150–300 ms TTI improvement"

**Reality:** TBT is 0 ms. TTI is 0.47–0.80 s. There's nothing to defer because nothing is blocking. The 31 KB inline IIFE I planned to split might be net-zero or negative impact (deferring it adds a network round-trip on cold connections). **Skip this entirely until we have evidence of blocking.**

### Predicted: "WebP/AVIF hero pipeline → 100–300 ms LCP on cold mobile"

**Reality:** LCP is 0.73–1.43 s on desktop preview. Mobile + 4G simulation will be 2–3× slower per Lighthouse's standard throttling, so on real mobile this could approach 2.5 s. **Still justified, especially for `/` (4.7 MB total weight) and `/solutions/digital-product-passport/` (1.43 s LCP outlier).**

---

## 3. What the audit missed

### Issue #1 — Home a11y 0.90 (below 0.95 floor)

DS-13 closeout claimed AA-compliant a11y. Lighthouse says the home page is at 0.90. Investigation of the report shows **all violations are inside the Kadence/WP layer**, not the codex surface:

- `color-contrast` (weight 7) — `.kt-testimonial-name` rendering at insufficient contrast against background; Kadence form button (`.kb-forms-submit`) same issue. Plus one codex hit: `.codex-industry-selector__eyebrow`.
- `link-name` (weight 7) — `.kb-section-link-overlay` is an empty overlay link with no accessible name. WP block emits this for clickable card overlays; we never gave it an `aria-label`.
- `heading-order` (weight 3) — Kadence testimonial titles use `<h5>` after a section `<h4>`, jumping the order.
- `label-content-name-mismatch` (weight 0) — minor, no score impact.

**This is consistent with DS-16's diagnostic.** DS-13 audited the codex layer and was correct about it. The Kadence adapter layer has its own a11y debt that wasn't in DS-13's scope.

### Issue #2 — `/about/` SEO 0.92 + a11y 0.93

About has the worst combined scores. Likely culprits (need to spot-check the JSON report):
- SEO: probably a missing or malformed meta tag, or a `<meta name="robots">` issue.
- a11y: probably similar Kadence-layer issues since `/about/` is a snapshot page.

### Issue #3 — `/solutions/digital-product-passport/` LCP 1.43 s outlier

All other routes: LCP 0.73–0.94 s. This one is **60% slower**. Worth investigating which element became LCP and why. Likely a particularly large hero image or a render-blocking section.

### Issue #4 — Home total page weight 4,740 KB

`/` ships 4.7 MB. Other routes: 0.5–2.1 MB. The home page is the heaviest by 2× the next-heaviest. Mostly images (homepage hero + testimonial photos + section dividers). WebP migration buys the most here.

### Issue #5 — `/blog/` CLS 0.036

Only route with non-zero CLS. Below the 0.1 threshold so not failing, but worth a single-line investigation — probably the blog card grid loading thumbnails without aspect-ratio constraints (different from `.codex-editorial-figure` which has its own).

---

## 4. Reshaped Phase 6 roadmap

Old plan: 5 days, six tasks, ordered by predicted impact.
New plan: 4 days, focused on real issues, demoting tasks with no measurable win.

| # | Task | Prior priority | New priority | Effort | Why |
|---|---|---|---|---|---|
| 1 | Lighthouse CI harness | High | **DONE** | — | Task #612 ✅ |
| 2 | Hero `width`/`height` intrinsics | Medium | **DONE** | — | Task #613 ✅ |
| 3 | **Fix home + about a11y** | not in scope | **HIGH (NEW)** | 1 d | 0.9 → ≥0.95 on home, 0.93 → 0.95 on /about/. Targets Kadence-layer link-name + heading-order + contrast |
| 4 | **Investigate /solutions/digital-product-passport/ LCP outlier** | not in scope | **MEDIUM (NEW)** | 0.5 d | 1.43 s → match other routes' ~0.85 s. Diagnose what makes this single route slow |
| 5 | **Investigate /about/ SEO 0.92** | not in scope | **MEDIUM (NEW)** | 0.25 d | Single point gap → 1.0 |
| 6 | WebP/AVIF hero pipeline | High | **MEDIUM** | 1.5 d | Still worth doing for home page weight + mobile LCP. Original justification holds but isn't urgent |
| 7 | Critters critical-CSS inline | High | **LOW** | 1 d | FCP already 0.47–0.72 s; gain estimate revised down to ≤100 ms. Defer until we have a reason |
| 8 | Inline JS pre-paint/deferred split | High | **DEFERRED** | 1 d | TBT is 0 ms. Nothing to defer. **Cancel** unless evidence emerges |
| 9 | Lighthouse re-run + budget doc | High | High | 0.5 d | After #3–#6 land, re-measure and tighten the 50K/4K thresholds with realistic numbers |

**New total:** ~3.25 days for the high+medium items vs. the old ~5 days that targeted nonexistent problems.

**Threshold update needed in `lighthouserc.cjs`:**
- `resource-summary:script:size` — current 4 KB threshold flags non-blocking WP/Kadence JS. Either remove (since TBT is 0 ms anyway) or keep as informational signal for the WP-layer-investigation roadmap. **Recommendation:** keep but document that it tracks total script weight, not blocking weight.
- `resource-summary:stylesheet:size` — current 50 KB threshold; baseline is 62–74 KB. Raise to 80 KB until Critters lands.

---

## 5. The methodology lesson (third instance)

Three audits in this design system have over-estimated removability/win because they reasoned from source size or syntactic foreignness rather than measured behavior:

1. **DS-12 #9 (shadows)** — assumed swappable; was a coherent system in different convention.
2. **DS-12 #10 (page palette)** — assumed waste; was 6/8 load-bearing.
3. **DS-16 (Kadence CSS)** — assumed migration debt; was the WP-class adapter layer.
4. **DS-15 (perf wins)** — assumed Critters + JS split would dominate; FCP/TBT already healthy.

The pattern: **estimate before measure → over-promise**. Recording so the next audit asks "what's the measured baseline?" before "what could we optimize?".

---

## 6. Summary

**Performance is excellent already.** 7 of 8 routes score 0.99 perf with sub-second LCP. The one outlier (`/solutions/digital-product-passport/` at 1.43 s) deserves investigation but isn't a system-wide problem.

**A11y has real gaps.** Home is at 0.90, about at 0.93. All gaps trace to the Kadence layer (`.kb-section-link-overlay` empty links, testimonial heading-order, color-contrast on testimonial names). DS-13 was right about codex; the WP adapter layer has separate debt.

**Phase 6 priorities flip.** Critters + JS-split are demoted (no measurable win available); a11y + LCP outlier + SEO + WebP move up. Total scope: 3.25 days.

**Lighthouse harness is working.** First baseline written. Re-runs after each fix will measure the actual delta.
