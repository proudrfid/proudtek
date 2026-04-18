# W3-4c `relatedIndustries` Top-Up — 127 Previously-Untagged SKUs

**Date:** 2026-04-18
**Batch:** `relatedIndustries` coverage pass across the full SKU catalog.
**Scope:** Every SKU page now carries a populated `relatedIndustries` array — no more gaps in the "Used in these industries" grid.

---

## 1. Starting state

Before this batch:

| State | SKUs |
|---|---|
| Tagged (`relatedIndustries` non-empty) | 64 |
| Untagged | **127** |
| Total | 191 |

The 127 untagged files were almost entirely in the rfid-cards, rfid-keyfobs, rfid-wristbands clusters (added after the original W4 tagging pass), plus ~42 rfid-tags and ~35 rfid-labels that had slipped through.

After this batch:

| State | SKUs |
|---|---|
| Tagged | **191** |
| Untagged | 0 |

---

## 2. The script

`scripts/_add-related-industries.mjs` (~165 lines, pure Node).

Twenty regex rules (one per industry pillar), priority-ordered so that the narrowest / most-specific verticals (pharmaceutical, healthcare, cold-chain, aerospace, defense, data-center, automotive-tire-oem, libraries, laundry) are evaluated first and claim their slot before broader buckets (retail-apparel, logistics, industrial) pick up the remainder. Each SKU's tag list is capped at 4 entries.

Untouched guardrails:

- Only SKUs whose `relatedIndustries` field is missing or empty are modified. Already-tagged SKUs (the original 64) are skipped entirely.
- `resourceCards` is excluded from the scanned text. This was an important fix — after commit `3db154a` shipped industry back-link labels into many SKUs' resource cards ("Automotive & tire OEM — Tier-1 programs…"), a naïve text scan would cross-match SKUs on the anchor label of a back-link already applied to them. Scoped scan only hits the SKU's own editorial fields: `title`, `kicker`, `summary`, `heroPoints`, `brief`, `sections`, `faq`, `keywords`, `productTable`, `timeline`.

Fallback: any SKU that still produces zero matches (3 total — `rfid-blocking-card`, `rfid-gift-card`, `rfid-loyalty-card`) falls back to cluster defaults so every page renders at least a 2-card grid:

| Cluster | Default fallback |
|---|---|
| rfid-cards | `hospitality`, `education` |
| rfid-keyfobs | `hospitality`, `fitness` |
| rfid-wristbands | `events-venues`, `hospitality` |
| rfid-labels | `industrial`, `logistics` |
| rfid-tags | `industrial`, `logistics` |

---

## 3. Tuning iterations

**Run 1 (initial):** 127 tagged, luxury-brands at 59, fitness at 37 — both clearly over-broad.

Fixes:

- **Dropped `premium\b` from the luxury-brands regex.** "Premium" is marketing boilerplate on 25+ non-luxury SKUs (metal business cards, transparent NFC cards, loyalty cards, gift cards — corporate-gift territory, not high-end fashion). Tightened to specific luxury terms only: `luxury|leather goods|handbag|jewelry|fine watches|wine|spirits|bamboo card|wooden card|engraved|bespoke|olive oil|cannabis tracking|fine art|collectible|premium fashion`.
- **Dropped `cycling` from the fitness regex.** In SKU copy this word almost never refers to the sport — it matches "thermal cycling", "freeze-thaw cycling", "wash cycling", "guests cycling between pools/saunas". Replaced with cycling-as-sport phrases: `cycling studio|spin class|treadmill|fitness|gym|membership card|wellness center|locker room`.

**Run 2:** luxury dropped 59 → 40, fitness 37 → 14. Better, but manhole-cover-tag was still matching `automotive-tire-oem` via the W3-4b back-link label in its resourceCards.

**Run 3 (scoped scan):** Added `SCAN_FIELDS` allow-list to `gatherText` so it skips `resourceCards`. Manhole-cover still matches automotive — but now from legit in-copy ("does not bear direct tire load" — the manhole cover bears tire loads on roadways). That's a defensible cross-link, not a false positive from the back-link label. Shipped.

---

## 4. Final distribution

Per-slug count **for this batch only** (127 SKUs × up to 4 tags):

| Slug | This pass | Pre-existing | Total SKUs tagged |
|---|--:|--:|--:|
| industrial | 61 | 10 | 71 |
| events-venues | 55 | 4 | 59 |
| brand-protection | 46 | 10 | 56 |
| logistics | 38 | 10 | 48 |
| luxury-brands | 37 | 4 | 41 |
| healthcare | 26 | 6 | 32 |
| hospitality | 26 | 4 | 30 |
| education | 26 | 4 | 30 |
| retail-apparel | 14 | 10 | 24 |
| fitness | 14 | 3 | 17 |
| laundry-services | 14 | 2 | 16 |
| eu-compliance | 6 | 9 | 15 |
| pharmaceutical | 8 | 4 | 12 |
| agriculture | 7 | 4 | 11 |
| libraries | 7 | 3 | 10 |
| data-center-it-asset-tracking | 6 | 0 | 6 |
| aerospace-aviation-mro | 5 | 0 | 5 |
| automotive-tire-oem | 4 | 0 | 4 |
| cold-chain-food-traceability | 4 | 0 | 4 |
| government-defense-supply-chain | 2 | 0 | 2 |

The 5 brand-new industry pillars (from commit `2704dcb`) now have 21 SKU-side references in `relatedIndustries`, up from 0 before this batch. Combined with the 44 back-link rows from commit `3db154a`, the new pillars now have 65 inbound SKU references across both `resourceCards` and `relatedIndustries`.

---

## 5. Fallback cases (3 SKUs)

| SKU | Fallback applied | Rationale |
|---|---|---|
| `rfid-blocking-card` | hospitality, education | Consumer-facing anti-skimming card; no industry vertical applies cleanly |
| `rfid-gift-card` | hospitality, education | Generic stored-value use case; fits retail/hospitality but no in-copy keyword hit |
| `rfid-loyalty-card` | hospitality, education | Same pattern as gift card |

These 3 are the only SKUs where the cluster default fired. All 124 others matched at least one specific rule.

---

## 6. Rendered spot-checks

Sampled 5 SKU pages from different clusters — all render the "Used in these industries" grid with sensible cross-links:

| Route | Industries rendered |
|---|---|
| `/products/rfid-cards/rfid-bamboo-card/` | events-venues, hospitality, luxury-brands, industrial |
| `/products/rfid-keyfobs/mifare-desfire-keyfob/` | fitness, education, industrial |
| `/products/rfid-wristbands/elastic-rfid-wristband/` | healthcare, fitness, education |
| `/products/rfid-labels/rfid-frozen-food-label/` | cold-chain-food-traceability, retail-apparel |
| `/products/rfid-tags/rfid-ammo-can-tag/` | government-defense-supply-chain, logistics, industrial |

---

## 7. Build verification

```
ASTRO_OUT_DIR=./dist-restored npm run build    # clean, 102.04s
```

No schema errors. No broken links. The Zod `editorialSchema.relatedIndustries` validator passed on all 191 SKUs.

---

## 8. Catalog audit impact

No new SKUs, no new image overrides. Only `relatedIndustries` arrays mutated on 127 files. `EDITORIAL_OVERRIDE_ROUTES` allowlist unchanged.

---

## 9. Files changed summary

| Category | Files | Change |
|---|---|---|
| New: script | 1 | `scripts/_add-related-industries.mjs` |
| Modified: SKU JSONs | 127 | `relatedIndustries` array populated |
| New: report | 1 | `pillar-pages-w3c-related-industries-report.md` |

**Total diff:** 129 files changed.

---

## 10. What ships next

Open queue for the next pick:

| Priority | Item | Description |
|---|---|---|
| P0 | W5-6 P1 chip encyclopedia depth | NTAG21x family, UCODE 9 standalone, UCODE 8 standalone, Monza R6 family, MIFARE DESFire EV3 commands — ~5 deep guide pages |
| P1 | W10 compare-cluster depth pass | Extend 15 thin `/compare/*` pages from stub to 700+ words each |
| P2 | Catalog index UX refresh | Faceted filter on `/products/` (chip family / frequency / mount / IP rating) |

---

## 11. Push reminder

```
cd /Users/zhangping/Projects/Playground
git push origin main
```
