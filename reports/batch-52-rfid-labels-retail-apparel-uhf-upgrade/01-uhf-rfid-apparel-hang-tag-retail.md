# uhf-rfid-apparel-hang-tag-retail — SHALLOW → DEEP

**Route.** `/products/rfid-labels/uhf-rfid-apparel-hang-tag-retail/`

**Anchor standards & citations.**
- Walmart RFID source-tagging mandate (since 2005).
- Auburn University RFID Lab ARC Category D1 (hang tag on apparel).
- GS1 EPC TDS 2.0 SGTIN-96 / SGTIN-198 binary encoding.
- ISO/IEC 18000-63:2015 EPC Gen2v2 RAIN RFID.
- EU ESPR Reg 2024/1781 + textile DPP priority category.
- GS1 Digital Link URI 1.3.
- Impinj M730 / M750 / M770 / NXP UCODE 9.
- Target apparel mandate (2018) + Macy's (2019) + H&M / Inditex Zara internal programmes.
- GS1 EPCIS 2.0 visibility events.

**DEEP block inventory.**
- `statBar.items[4]` — 95-99% RFID-tagged inventory accuracy (vs 65-75% barcode-only) / 2-5% same-store-sales uplift / Walmart RFID since 2005 / 30-50% out-of-stock reduction.
- `comparePanel` — Generic UHF supplier no ARC test vs Proud Tek with ARC Category D1 + retailer-spec match + 100% read QC (this page).
- `dataHighlight` — Auburn ARC Category D1 hang-tag-on-apparel certification + GS1 SGTIN-96 / SGTIN-198 + EU ESPR DPP 2027-2028 forward-compatibility.
- `timeline` — 2005 Walmart mandate → 2010 Auburn ARC founded → 2014-2018 Impinj M700 + NXP UCODE 8 + ISO/IEC 18000-63 → 2018-2019 Target + Macy's launch → 2020-2022 H&M + Inditex Zara internal → 2022-2024 Walmart GMM + CPG expansion → 2024 EU ESPR textile DPP → 2026 Today (Blocker C: walmart-supplier-source-tagging, target-apparel-mandate, macys-item-level-rfid, h-and-m-internal-store-rfid, lululemon-omnichannel-inventory, fashion-brand-source-tagging programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon, EPC encoding standards, form factors + dimensions, material options, printing + branding, Auburn ARC certification, retailer mandate compatibility, performance + read-rate metrics, manufacturer + DC encoding workflow, EU ESPR DPP readiness, standards + compliance, procurement.

**Sources[10].** GS1 EPC TDS, Auburn ARC, ISO/IEC 18000-63:2015, EU ESPR 2024/1781, EU Strategy Sustainable Textiles, Impinj M700, NXP UCODE 9, GS1 Digital Link, Walmart RFID Source Tagging, GS1 EPCIS 2.0.

**Inbound refs (7).** Pillar, sibling jewelry + retail-price + garment-source + shipping-label + ntag213 + impinj-m750.

**Outbound orphan scan.** 0 orphans across 8 hrefs.

**Task.** #403 completed.
