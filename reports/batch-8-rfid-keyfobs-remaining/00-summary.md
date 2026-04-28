# Batch 8 — rfid-keyfobs remaining SKU refinement

**Date:** 2026-04-23
**Scope:** 8 SKUs under `src/content/editorial/products/rfid-keyfobs/`
**Status:** Complete. `astro sync` clean (~860 ms). Zero `/product/` legacy routes remaining in the keyfobs cluster.

## SKUs refined

| # | SKU slug | sections | faq | sources | primaryAction | notes |
|---|---|---|---|---|---|---|
| 1 | `rfid-leather-keyfob` | 4 | 5 | 8 | `/contact/access-control-keyfobs/` | Added cowhide-vs-PU buyer guide (tanning chemistry, REACH Cr VI, LWG audit), branding methods breakdown (deboss/foil/laser/edge paint), CRYPTO-1 migration guidance. |
| 2 | `rfid-metal-keyfob` | 4 | 5 | 8 | `/contact/access-control-keyfobs/` | Added ferrite-backed antenna physics explainer (NXP AN1445), plating durability table (nickel/gold 1.0 μm / PVD), vehicle-gate use-case caveat, CRYPTO-1 migration. |
| 3 | `rfid-epoxy-keyfob` | 5 | 5 | 7 | `/contact/access-control-keyfobs/` | Added UV-stable epoxy formulation section (ISO 4892-2 xenon-arc, HALS+UVA, heat-cure), common-tender-mistakes checklist, UV FAQ. |
| 4 | `rfid-coin-keyfob` | 5 | 5 | 8 | `/contact/access-control-keyfobs/` | Added server-side vs on-chip value file architecture, Nayax/USA Technologies/Setomatic hybrid model, payback math (12-site laundry operator 7-11 month payback). |
| 5 | `rfid-coin-tag` | 6 | 5 | 7 | `/contact/rfid-labels-tags/` | Fixed 4 legacy routes; added LF/HF selector FAQ, MOQ/lead-time FAQ, MIFARE Classic vs DESFire EV3 FAQ. |
| 6 | `rfid-wristwatch-tag` | 4 | 5 | 8 | `/contact/access-control-keyfobs/` | Added on-wrist antenna tuning (ASTM F2182 tissue-equivalent gel, body detuning physics), chemical tolerance by material (silicone/nylon/zinc), allergy section (ISO 10993-5, 316L hardware). |
| 7 | `nfc-wood-keychain-tag` | 6 | 5 | 7 | `/contact/access-control-keyfobs/` | Added FSC vs PEFC guidance, WEEE end-of-life FAQ, EUDR deforestation-regulation reference. |
| 8 | `nfc-epoxy-key-tag` | 7 | 5 | 8 | `/contact/access-control-keyfobs/` | Added IP65 vs IP67 FAQ, UV-resistance FAQ, DESFire-vs-Classic chip recommendation with BSI + Garcia 2008 references. |

## Common hygiene applied across all 8 SKUs

Replaced broken legacy `/product/...` routes in `imageSourceRoutes`, `resourceCards`, and `secondaryActions` with valid `/products/<group>/<slug>/` routes (verified against current content collection — e.g. `/products/rfid-cards/rfid-metal-business-card/`, `/products/rfid-cards/rfid-wooden-card/`, `/products/rfid-wristbands/rfid-adjustable-silicone-wristband/`). Fixed broken `primaryAction.href: "/contact/"` to `/contact/access-control-keyfobs/` (or `/contact/rfid-labels-tags/` for the coin-tag SKU, which sits closer to tag-tier tooling). Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`, and bumped `reviewedAt: "2026-04-23"` on each SKU. Appended `sources[]` arrays (7-8 entries per SKU) citing ISO/IEC 14443-3, 18000-2, IEC 60529, ISO 4892-2, ISO 10993-5, ISO 11784/11785, NFC Forum Type 2, NXP product pages, NXP CRYPTO-1 advisory, NXP AN1445 (on-metal antenna), Garcia et al. 2008 (CRYPTO-1 break), BSI TR-02102, FSC/PEFC/EUDR/WEEE, EU RoHS 3, REACH, ASTM B633/D4060/F2182, LWG, NAMA as appropriate to each product. Extended FAQ from 3 to 5 on each SKU; added CRYPTO-1 security caveats wherever MIFARE Classic is mentioned.

## rfid-keyfobs cluster status (post-Batch 8)

14 of 14 SKUs refined (100%). Cluster ready for full `astro build` preview on user-local machine.

## Next up

- Task B remaining: rfid-labels cluster (58 SKUs) — spans Batches 9-11 or beyond.
- Batch 9 will start with 6 flagship labels: `impinj-m800`, `ntag213`, `ntag424-dna`, `rfid-wet-inlay`, `nfc-digital-product-passport`, `impinj-m700`.
- Task C (full `astro build`) still queued for user-side execution — sandbox 45 s bash ceiling insufficient for full build.
