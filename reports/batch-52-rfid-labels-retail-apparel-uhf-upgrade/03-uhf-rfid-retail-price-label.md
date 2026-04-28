# uhf-rfid-retail-price-label — SHALLOW → DEEP

**Route.** `/products/rfid-labels/uhf-rfid-retail-price-label/`

**Anchor standards & citations.**
- GS1 EPC TDS 2.0 SGTIN-96 encoding.
- GS1 Digital Link URI 1.3.
- GS1 Sunrise 2027 — 2-D-at-POS migration target.
- ISO/IEC 19987:2015 EPCIS 2.0 visibility events.
- ISO/IEC 18000-63:2015 EPC Gen2v2 RAIN RFID.
- Auburn ARC Categories A-H.
- Impinj M700 series + NXP UCODE 9.
- Sensormatic Synergy combined EAS+RFID pedestal.
- SES-imagotag Vusion electronic shelf label platform.

**DEEP block inventory.**
- `statBar.items[4]` — 65-75% → 98-99% inventory accuracy uplift / USD 1.1T annual industry out-of-stock loss / 70% out-of-stocks caused by in-store issues / 60-80% → 95-99% SCO non-scan detection (camera vs RFID).
- `comparePanel` — Barcode-only price label + manual cycle count + camera-only SCO vs triple-encoded UHF RFID label + EPCIS 2.0 + ESL/EAS coexistence (this page).
- `dataHighlight` — Triple identifier in single label (UPC + GS1 DataMatrix Digital Link + RFID EPC SGTIN-96) + GS1 Sunrise 2027 forward-compatibility + same AI 21 serial across all three encodings.
- `timeline` — 1974 UPC/EAN linear barcode → 2005 Walmart RFID apparel mandate → 2014-2018 Auburn ARC + UHF RAIN maturity → 2018-2019 Target + Macy's apparel RFID launch → 2020 GS1 Sunrise 2027 announced → 2022-2024 Walmart GMM + Target consumables expansion → 2024 EU ESPR DPP + SCO RFID loss-prevention → 2026 Today (Blocker C: grocery-supercenter, fashion-omnichannel, electronics-big-box, beauty-cosmetics-prestige, sporting-goods-superstore programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon, triple identifier encoding, GS1 Sunrise 2027 readiness, retailer mandate compatibility, Auburn ARC certification matrix, POS architecture integration, EAS coexistence architecture, ESL coexistence, substrate + adhesive, EPCIS 2.0 + omnichannel OMS integration, application verticals, procurement.

**Sources[10].** GS1 EPC TDS 2.0, GS1 Digital Link, GS1 Sunrise 2027, ISO/IEC 19987:2015 EPCIS, ISO/IEC 18000-63:2015, Auburn ARC, Impinj M700, NXP UCODE 9, Sensormatic Synergy, SES-imagotag Vusion.

**Inbound refs (10).** Pillar, sibling apparel-hang-tag + jewelry + garment-source + shipping-label + paper-label + blank-label + multi-retailer SKUs.

**Outbound orphan scan.** 0 orphans across 7 hrefs.

**Task.** #405 completed.
