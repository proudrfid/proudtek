# Batch 7 — rfid-keyfobs SKU refinement

**Date:** 2026-04-23
**Scope:** 6 SKUs under `src/content/editorial/products/rfid-keyfobs/`
**Status:** Complete. `astro sync` clean (~850 ms).

## SKUs refined

| # | SKU slug | sections | faq | sources | primaryAction | notes |
|---|---|---|---|---|---|---|
| 1 | `rfid-abs-keyfob` | 7 | 5 | 8 | `/contact/access-control-keyfobs/` | Legacy `/product/` routes fixed; RoHS/REACH + CRYPTO-1 caveats added. |
| 2 | `mifare-desfire-keyfob` | 6 | 5 | 8 | `/contact/access-control-keyfobs/` | Added EV1/EV2/EV3 table, AES-128 key architecture + AN10922 diversification, CRYPTO-1 → DESFire EV3 migration (Modes A/B/C), pitfalls. |
| 3 | `em4305-keyfob` | 4 | 5 | 7 | `/contact/access-control-keyfobs/` | Added LF chip comparison (EM4100/EM4305/T5577), 125 kHz cryptography caveat. |
| 4 | `t5577-keyfob` | 4 | 5 | 6 | `/contact/access-control-keyfobs/` | Added legitimate-use framing, policy & security caveat, Flipper Zero comparison. |
| 5 | `dual-frequency-key-fob` | 6 | 5 | 7 | `/contact/access-control-keyfobs/` | Added 1 dB electromagnetic isolation test explanation + 12-18 month migration phasing. |
| 6 | `rfid-silicone-keyfob` | 5 | 5 | 8 | `/contact/access-control-keyfobs/` | Added silicone material-science section (FDA 21 CFR 177.2600, ISO 10993-5, platinum-cure), 4-environment application deep-dive, common pitfalls. |

## Common hygiene applied across all 6 SKUs

- Replaced broken legacy routes (`/product/rfid-key-fob/`, `/product/rfid-silicone-wristbands/`, `/product/proximity-fobs/`, `/product/blank-rfid-card/`) in `imageSourceRoutes`, `resourceCards`, and `secondaryActions` with valid `/products/<group>/<slug>/` routes.
- Fixed broken `primaryAction.href: "/contact/"` to `/contact/access-control-keyfobs/`.
- Added `publishedAt: "2026-04-22"` where missing; set `modifiedAt: "2026-04-23"` and bumped `reviewedAt: "2026-04-23"`.
- Appended `sources[]` arrays (6-8 entries per SKU) citing ISO/IEC 18000-2, 14443-3, NXP CRYPTO-1 advisory, IEC 60529 (IP code), IEC 60068-2-31 (drop), EU RoHS 3 (2015/863), REACH (EC 1907/2006), FDA 21 CFR 177.2600, ISO 10993-5, NXP AN10922 (key diversification), NXP AN12343 (DESFire EV3 SUN/SDM), and vendor datasheets where cited.
- Extended FAQ from 3 to 5 on each SKU; added CRYPTO-1 security caveats wherever MIFARE Classic is mentioned.

## Remaining rfid-keyfobs SKUs (not in Batch 7)

8 SKUs deferred for future batches:
`rfid-leather-keyfob`, `rfid-metal-keyfob`, `rfid-epoxy-keyfob`, `rfid-coin-keyfob`, `rfid-coin-tag`, `rfid-wristwatch-tag`, `nfc-wood-keychain-tag`, `nfc-epoxy-key-tag`.

## Verification

- `python3 -c "json.load(...)"` sanity check per SKU — all pass.
- `npx astro sync` — clean (no schema errors, 850 ms).
- Content-collection types regenerated.

## Next up

- Batch 8: remaining 8 rfid-keyfobs SKUs.
- Batches 9-11: rfid-labels cluster (58 SKUs) starting with flagships `impinj-m800`, `ntag213`, `ntag424-dna`, `rfid-wet-inlay`, `nfc-digital-product-passport`, `impinj-m700`.
- Task C (full `astro build`) still queued for user-side execution — the sandbox 45 s bash ceiling isn't enough for a full build.
