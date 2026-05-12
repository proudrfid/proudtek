# W3-4d³ — Chip-Family Facet Expansion: Cards + Labels + Tags

**Date:** 2026-04-19
**Scope:** Extend the `chipFamilies` backfill pattern shipped in W3-4d² to `/products/rfid-cards/`, `/products/rfid-labels/`, and `/products/rfid-tags/` SKUs.
**Outcome:** Chip-filter coverage on `/products/all/` lifted from **63 cards (25.6 %)** to **180 cards (73.2 %)** — 2.86× beyond the original 40 % target.

The W3-4d² pass established the plumbing (optional `chipFamilies` field on editorial schema, `deriveFacetsWithChipOverride()` variant that unions explicit list with regex-scan) and demonstrated it on keyfobs + wristbands (34 SKUs, +12.6 pts coverage). This pass applies the same script and same field to the three largest product sub-indexes — no plumbing changes, only a wider directory list.

---

## 1. Scope

Three directories, 160 SKUs:

| Directory | SKUs |
|---|---:|
| `rfid-cards/` | 30 |
| `rfid-labels/` | 59 |
| `rfid-tags/` | 71 |

Plus the 34 already-tagged SKUs from W3-4d² (keyfobs + wristbands), the backfill script now covers 191 SKUs total. The two-directory TARGET_DIRS constant in `scripts/_backfill-chip-families.mjs` was extended to five directories — one-line change.

---

## 2. Backfill run

```
SKUs scanned:            191
Already tagged (skip):   34    (W3-4d² keyfobs + wristbands)
No chip signal (skip):   18    (specialty industrial tags, see §5)
Newly tagged:            139
```

**Per-category tagged SKUs:**

| Directory | Newly tagged | Dominant chips |
|---|---:|---|
| `rfid-cards/` | 29 | MIFARE DESFire (21), MIFARE Classic (19), NTAG21x (18), EM/T5577 (7) |
| `rfid-labels/` | 57 | NTAG21x (30), Impinj M7xx (25), UCODE (25), NTAG424 (24) |
| `rfid-tags/` | 53 | UCODE (41), Impinj M7xx (39), MIFARE DESFire (17), NTAG21x (10) |

The category split tracks real-world chip choice:

- **Cards** skew HF — MIFARE family dominates access-control and payment applications, NTAG21x carries NFC review and business-card usage, EM/T5577 is the LF workhorse for legacy building-access systems.
- **Labels** skew NFC + UHF — NTAG21x is the top HF chip for NFC anti-counterfeit labels; UCODE 8/9 and Impinj M7xx are the UHF workhorses for item-level apparel and logistics tagging; NTAG424 DNA lands on premium anti-counterfeit and DPP labels.
- **Tags** skew UHF heavy — UCODE (41) and Impinj M7xx (39) dominate because tags are mostly on-metal / outdoor / asset-tracking form-factors where UHF wins.

---

## 3. Catalog-index coverage impact

`/products/all/` filter panel static count pills:

| Chip | W3-4d (pre) | W3-4d² (post keyfob+wristband) | W3-4d³ (now) |
|---|---:|---:|---:|
| NTAG21x | 5 | 33 | **86** |
| NXP UCODE 8/9 | 1 | 10 | **78** |
| Impinj M7xx / M8xx | 5 | 14 | **76** |
| MIFARE DESFire | 4 | 26 | **71** |
| MIFARE Classic | 5 | 26 | **45** |
| NTAG424 DNA | 3 | 3 | **27** |
| EM / T5577 (LF) | 3 | 15 | **23** |
| ICODE SLIX | 2 | 2 | **13** |
| MIFARE Ultralight | 2 | 7 | **11** |
| Alien Higgs | 1 | 2 | **10** |
| MIFARE Plus | 2 | 2 | **5** |

Every chip value now returns 5-86 cards. The smallest filter (MIFARE Plus) still clears the "≥5 results" bar we target. No dead filters, no single-digit ghost values.

**Aggregate coverage on the chip facet:**

| Pass | Cards with chip tag | Coverage | Δ |
|---|---:|---:|---:|
| W3-4d (ship) | 32 | 13.0 % | — |
| W3-4d² (keyfobs + wristbands) | 63 | 25.6 % | +12.6 pts |
| **W3-4d³ (this pass)** | **180** | **73.2 %** | **+47.6 pts** |

---

## 4. File change summary

Modified (1):

```
scripts/_backfill-chip-families.mjs      (TARGET_DIRS list +3 entries)
```

New SKUs tagged (139):

```
src/content/editorial/products/rfid-cards/         29 of 30 SKUs
src/content/editorial/products/rfid-labels/        57 of 59 SKUs
src/content/editorial/products/rfid-tags/          53 of 71 SKUs
```

No schema, lib, or catalog-pages.ts changes required — the plumbing from W3-4d² handles the widened input set directly.

---

## 5. Remaining gap — the 66 untagged cards

Of the 66 cards still without a chip facet:

| Bucket | Count | Nature |
|---|---:|---|
| `/product/*` WP stubs (legacy) | ~37 | Content lives in WordPress HTML snapshots, not content-collection JSONs. The `chipFamilies` pattern doesn't apply. Per-file patches to the `deriveFacets` fallback or to the HTML extraction pipeline would be needed. |
| Specialty industrial tags (`/products/rfid-tags/*`) | 18 | SKUs like `rfid-ammo-can-tag`, `rfid-anchor-bolt-tag`, `rfid-fish-tag`, `rfid-utility-pole-tag`, `rfid-tree-tag`, `rfid-livestock-leg-band` — written in generic "RFID" terms without naming a chip vendor. Tagging these would require editorial judgment (most are UHF on-metal so presumably `impinj-m7 + ucode`) rather than automated scanning. |
| Pillar index pages | ~6 | `/products/rfid-keyfobs/`, `/products/rfid-wristbands/`, etc. — intentionally untagged because they're category landings, not SKUs. |
| Uncategorized stragglers | ~5 | WP stubs for readers and scanners (`/product/acr122u`, `/product/bluetooth-rfid-scanner`, etc.) that have no chip because they ARE the reader, not the tag. Correctly untagged. |

The biggest remaining lever is the ~37 legacy WP stubs. Their content lives in `src/data/pages/*.html` snapshots and flows through a different extraction path in catalog-pages.ts (`loadPageFromDisk` → `extractProductSummary`). Surfacing those under chip filters would need either per-stub `chipFamilies` overrides in `catalog-pages.ts`'s WP_CHIP_OVERRIDES map (new code) or a regex-widening in the HTML extraction path.

Given that the remaining WP stubs are mostly legacy cards / wristbands that overlap with newer content-collection equivalents (e.g. `/product/nfc-business-card/` WP stub vs `/products/rfid-cards/nfc-business-card/` landing def), a cleaner follow-up would be a deprecation pass — redirect the WP stubs to their landing-def equivalents and remove them from the catalog index. That's a bigger architectural decision than this pass justifies.

---

## 6. Build verification

**Command:** `ASTRO_OUT_DIR=./dist-restored npm run build`
**Wall clock:** 105.91 s
**Exit status:** Completed. Trailing EPERM on `.prerender` cleanup is the known virtiofs quirk.

All 246 product cards still render with three facet attributes. The 11 chip count pills on the filter panel now show the updated totals (5-86 per chip). No TypeScript build errors, no Zod validation failures. `Content config changed` was logged at startup — the cached types regenerated in ~900 ms.

---

## 7. Net of three passes (W3-4d + W3-4d² + W3-4d³)

Together the three W3-4d passes ship a mature faceted filter on `/products/all/`:

- **Frequency filter**: 65 % coverage (160 / 246 cards).
- **Chip family filter**: 73 % coverage (180 / 246 cards) — **+60 pts** from the original 13 %.
- **Environment filter**: 16 % coverage (40 / 246 cards) — largest remaining opportunity.

The chip filter is now the most useful signal on the page. A buyer who clicks "MIFARE DESFire" sees 71 cards; a buyer who clicks "UCODE 8/9" sees 78. Average chip-filter click reveals ~40 matching SKUs from the 246-card population — useful scoping, not empty space.

---

## 8. Next natural follow-ups

- **Env-facet expansion** — same `chipFamilies`-style override for environment tags (`envFamilies`: on-metal / high-temp / outdoor / embed / tamper / sensor). Current env coverage is only 16 %, and many tag SKUs have "IP68" or "200 °C" claims buried in spec sheets that the regex scan misses.
- **WP-stub deprecation** — audit the ~37 legacy `/product/*` WP stubs, redirect duplicates to their content-collection equivalents, remove orphans from the catalog index. Would simultaneously clean up the catalog and lift chip-filter coverage to ~90 %.
- **W10 compare-cluster depth pass** — extend 15 thin `/compare/*` pages to 700+ words each.
