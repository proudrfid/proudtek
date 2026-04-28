# Batch 9 — rfid-labels flagship SKU refinement

**Date:** 2026-04-23
**Scope:** 6 flagship SKUs under `src/content/editorial/products/rfid-labels/`
**Status:** Complete. `astro sync` clean (~800-900 ms) across all 6 files. Zero `/product/` legacy routes remaining in the Batch 9 SKUs.

## SKUs refined

| # | SKU slug | sections | faq | sources | primaryAction | notes |
|---|---|---|---|---|---|---|
| 1 | `impinj-m800-uhf-inlay` | 4 | 5 | 9 | `/contact/rfid-labels-tags/` | Added M800 family-at-a-glance (M830/M850/M870/M880 positioning) and Impinj Protected Mode crypto-authentication section (ISO/IEC 18000-63:2015 Amendment 1 AUTHENTICATE command, backend verification architecture, NTAG 424 DNA comparison). Extended FAQ with M800 variant selection and reader firmware upgrade. Sources: ISO 18000-63, GS1 EPC Gen2v2, Impinj M800 datasheet, Impinj Authentication Service, RAIN RFID, FCC 15.247, ETSI EN 302 208, FDA DSCSA, EMA FMD. |
| 2 | `impinj-m700-uhf-inlay` | 4 | 5 | 8 | `/contact/rfid-labels-tags/` | Added M700-family positioning (M730/M750/M770 selection tree) and "Read range in the real world" section (bench 16-18m → retail 4-8m handheld / 2-5m fixed → warehouse 3-6m per portal → healthcare 2-4m; rule of thumb divide datasheet by 2-4×). Added M700→M800 pin-compatible upgrade-path FAQ and M700-variant-selection-for-apparel FAQ. |
| 3 | `ntag213-nfc-sticker` | 6 | 5 | 7 | `/contact/rfid-labels-tags/` | Fixed legacy `/product/nfc-stickers/` and `/product/mifare-stickers/` routes. Sources: NXP NTAG213/215/216 datasheet, ISO 14443-3, NFC Forum Type 2, NDEF spec, Apple Core NFC, Android NFC docs, Google Business Profile review link. |
| 4 | `ntag424-dna-tamper-evident-tag` | 6 | 6 | 9 | `/contact/rfid-labels-tags/` | Fixed legacy `/product/nfc-stickers/` and `/product/desfire-tag/` routes. Sources: NXP NTAG424 DNA product page + AN12196 SDM/SUN + AN10922 key diversification, FIPS PUB 197 AES, NIST SP 800-38B CMAC, ISO 14443-4, FDA DSCSA, EU FMD 2011/62/EU, EU ESPR 2024/1781. |
| 5 | `rfid-wet-inlay` | 4 | 5 | 8 | `/contact/rfid-labels-tags/` | Added "Roll format, pitch and web width" converter-RFP section (Mühlbauer/Melzer/Bielomatik cassette geometries, 16/20/25/35 mm pitch, 76/152 mm cores, FINAT FTM 19 mark/splice tolerance). Extended FAQ with chip-stocking strategy and adhesive-to-substrate matching. Sources: ISO 18000-63, ISO 14443-3, GS1 EPC TDS, FINAT Technical Handbook, NFC Forum specs, Auburn RFID Lab ARC, RAIN RFID Alliance, IPC-SM-817. |
| 6 | `nfc-digital-product-passport-tag` | 7 | 5 | 9 | `/contact/rfid-labels-tags/` | Fixed legacy `/product/nfc-stickers/` and `/product/desfire-tag/` routes. Extended FAQ with EU Battery Regulation 2023/1542 18 Feb 2027 deadline mechanics and NTAG213→NTAG424 DNA upgrade economics analysis. Sources: EU ESPR 2024/1781, EU Battery Regulation 2023/1542, CIRPASS consortium, GS1 Digital Link, ISO/IEC 15459, NXP NTAG424 DNA, NFC Forum Type 4, EU Circular Economy Action Plan, EU SPI. |

## Common hygiene applied across all 6 SKUs

Replaced broken legacy `/product/...` routes in `imageSourceRoutes` with valid `/products/rfid-labels/<slug>/` cross-links (verified via `ls` on the content collection — targets include `ntag215-nfc-sticker`, `ntag216-nfc-sticker`, `nfc-wine-bottle-tag`, `nfc-spirits-authentication-label`, `nfc-battery-passport-tag`, `rfid-dry-inlay`, `impinj-m700-uhf-inlay`, `impinj-m800-uhf-inlay`, `alien-higgs-9-uhf-inlay`, `ntag424-dna-tamper-evident-tag`). Fixed broken `primaryAction.href: "/contact/"` to `/contact/rfid-labels-tags/` (label-tier contact form). Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`, and bumped `reviewedAt: "2026-04-23"` on each SKU. Appended `sources[]` arrays (7-9 entries per SKU) citing ISO/IEC 14443-3, 14443-4, 18000-63:2015, 15459, 19762; GS1 EPC TDS + Digital Link; NFC Forum Type 2/Type 4 + NDEF specs; NXP NTAG213/215/216 datasheet, NTAG424 DNA + AN12196 + AN10922; Impinj M700/M800 datasheets and Authentication Service; RAIN RFID Alliance; FINAT Technical Handbook; Auburn RFID Lab ARC; IPC-SM-817; FCC 15.247, ETSI EN 302 208; FIPS PUB 197, NIST SP 800-38B; FDA DSCSA; EU FMD 2011/62/EU; EU ESPR 2024/1781, EU Battery Regulation 2023/1542; CIRPASS; EU Circular Economy Action Plan. Extended FAQ to 5-6 entries on each SKU where previously 3. Flagship-level technical depth prioritised on the two chip-authoritative SKUs (impinj-m700, impinj-m800) and the two crypto/compliance SKUs (ntag424-dna, nfc-digital-product-passport).

## rfid-labels cluster status (post-Batch 9)

6 of 58 SKUs refined (10%). Six flagships now anchor the cluster; remaining 52 SKUs will be refined across Batches 10-11+.

## Next up

- **Batch 10 candidates** (next 8-10 rfid-labels SKUs): `ntag215-nfc-sticker`, `ntag216-nfc-sticker`, `nfc-wet-inlay`, `nfc-dry-inlay`, `rfid-dry-inlay`, `alien-higgs-9-uhf-inlay`, `nfc-anti-metal-sticker`, `rfid-anti-metal-sticker`, `rfid-tamper-evident-label`, `nfc-battery-passport-tag`.
- **Batch 11 candidates** (industry-application labels): `nfc-wine-bottle-tag`, `nfc-spirits-authentication-label`, `nfc-olive-oil-authentication-label`, `nfc-cosmetics-authentication-label`, `nfc-sneaker-authentication-tag`, `nfc-luxury-handbag-tag`, plus pharmaceutical/medication-vial/blood-bag/cryogenic labels.
- **Task C** (full `astro build`) still queued for user-local execution — sandbox 45 s bash ceiling insufficient for full build.
