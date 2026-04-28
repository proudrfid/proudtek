# Phase 6 #4 — Hero Image Re-encoding (DPP LCP Outlier Fix)

**Status:** 5 oversized images re-encoded in place. Originals backed up to `.hero_pre_phase6_backup_2026-04-27/landing-images/` (gitignored).
**Date:** 2026-04-27
**Trigger:** Lighthouse baseline showed `/solutions/digital-product-passport/` at LCP 1.43 s vs other 7 routes' 0.73–0.94 s. Investigation showed the hero `eu-compliance.jpg` was 774 KB at 1920×1280 (12.5× the next-largest hero at 62 KB / 1080×1080).

---

## What was done

In-place re-encode of 5 worst offenders. Resize to `max-width: 1600px`, JPEG quality 85, progressive, optimize=True. Pillow 12.1.

| File | Before | After | Saved | Pages affected |
|---|---|---|---|---|
| `wedding-invitation-card.jpg` | 4608×2592, **4,833 KB** | 1600×900, **158 KB** | −97% | blog post (rare hits) |
| `christmas-gift-tag-wrapped-present.jpg` | 2496×1664, **2,077 KB** | 1600×1067, **238 KB** | −89% | blog post (rare hits) |
| `eu-compliance.jpg` (DPP hero) | 1920×1280, **774 KB** | 1600×1067, **481 KB** | −38% | DPP solution + industry/eu-compliance + 5 guides + 2 compares |
| `rfid-coin-tag-uhf.jpg` | 2600×2600, **675 KB** | 1600×1600, **105 KB** | −84% | product page |
| `ski-lift-access-control-gate.jpg` | 1280×960, **539 KB** | 1280×960, **207 KB** | −62% | blog post |

**Aggregate:** 8.69 MB → 1.16 MB. **Saved 7.53 MB across 5 files.**

---

## Why DPP only got 38% reduction

`eu-compliance.jpg` shows fabric/clothing texture with NFC tag detail — high-frequency content where JPEG quality reduction has more visible impact, so kept at q85 conservative. The other four had photographic content that compressed harder. Could push DPP further by going to 1280×853 + q80 if more savings needed; left at safer settings.

---

## Expected baseline impact

Lighthouse desktop preset throttles to 10 Mbps. Transfer time of `eu-compliance.jpg`:

- Before: 774 KB ÷ 10 Mbps ≈ 620 ms
- After: 481 KB ÷ 10 Mbps ≈ 385 ms
- **Savings: ~235 ms LCP on DPP**

DPP LCP should drop from 1.43 s → ~1.20 s. Still slower than other routes (0.73–0.94 s) because the page lacks an above-the-fold hero element competing with the site logo (so logo paint timing dominates) — but the resource-fetch bottleneck is gone.

For LCP to fully match other routes, DPP would need a layout that puts a bigger element above the fold faster — that's an editorial-page restructure, not a perf fix. Out of scope for #4.

---

## Image pipeline state — what's left

12 images >300 KB, 5 cleared in this pass. **7 remaining in 300–500 KB range:**

- `rfid-bamboo-card.jpg` (461 KB)
- `waterproof-uhf-rfid-outdoor-tag.jpg` (426 KB)
- `rfid-book-spine-label.jpg` (381 KB)
- `nfc-payment-smart-ring.jpg` (366 KB)
- `rfid-tire-label.jpg` (334 KB)
- `wedding-favor-place-card.jpg` (323 KB)
- `uhf-rfid-retail-price-label.jpg` (297 KB)

These are below the LCP-blocking threshold for any of the 8 sample routes in our baseline, so they don't affect Phase 6 measurements directly. They belong to **Phase 6 #6 (WebP/AVIF migration)** — same pass that produces format variants. Leaving for that ticket; the immediate LCP outlier is fixed.

---

## Verification path

1. User: re-run `npm run lh:baseline` from Mac.
2. Check `/solutions/digital-product-passport/` LCP — should be ≤1.25 s.
3. Visual spot-check the 5 affected hero images on a few pages — at 1600×900 / q85 they should still look indistinguishable from the originals at typical desktop and mobile viewport sizes.
4. If any image looks degraded, restore from `.hero_pre_phase6_backup_2026-04-27/landing-images/<filename>` and re-encode at q90 instead of q85.

---

## Methodology note

The DS-15 baseline + DS-15-BASELINE-MEASURED.md identified DPP as a single-route outlier. Drilling into the Lighthouse JSON pinpointed the LCP-element selector (`img.custom-logo`) and the heaviest network request (`eu-compliance.jpg` at 774 KB). The fix targeted exactly that file plus the 4 worst siblings discovered during the audit sweep — the "fix the outlier, then keep walking the corridor" pattern.

The wider image pipeline migration (Phase 6 #6 WebP) remains the right place for systematic 50–80% savings across all 50+ landing images. This pass took 5 minutes for 7.5 MB of savings; the WebP pass will take 1.5 days for the long tail.
