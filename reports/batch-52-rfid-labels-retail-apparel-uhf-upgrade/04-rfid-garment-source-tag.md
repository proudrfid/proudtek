# rfid-garment-source-tag — SHALLOW → DEEP

**Route.** `/products/rfid-labels/rfid-garment-source-tag/`

**Anchor standards & citations.**
- GS1 EPC TDS 2.0 SGTIN-96 encoding.
- GS1 EPCIS 2.0 (ISO/IEC 19987:2015) JSON-LD visibility events.
- GS1 Digital Link URI 1.3 + Sunrise 2027.
- Auburn ARC Categories F (folded garment) + H (high-density hanging) + M (metal-hardware proximity).
- Walmart Supplier RFID Program (since 2005).
- ISO/IEC 18000-63:2015 EPC Gen2v2 RAIN RFID.
- ANSI ASC X12 EDI 856 Advance Ship Notice format.
- RAIN Alliance retail source-tagging briefs.
- Impinj M700 series (M730 / M750 / M770).
- GS1 US Implementation Guide 5010 — EDI 856 ASN with SGTIN encoding.

**DEEP block inventory.**
- `statBar.items[4]` — USD 1-5/item Walmart / Target / Macy's RFID chargeback / USD 50-200K first-time-RFID-complier exposure on 100K-unit order / 99%+ retailer-mandated minimum read-rate / 8-12 → 3-4 weeks factory implementation timeline.
- `comparePanel` — Self-encoding factory + manual ASN + missed serial-format spec vs Proud Tek pre-encoded source tag + 100% read QC + auto-EDI 856 + EPCIS (this page).
- `dataHighlight` — Three artifacts per order: EDI 856 ASN + EPCIS 2.0 JSON-LD + GS1 Digital Link URI. SGTIN-96 = Company Prefix + Indicator + Item Reference + 38-bit Serial.
- `timeline` — 2005 Walmart RFID apparel mandate → 2010 Auburn ARC founded → 2014-2018 UHF RAIN maturity → 2018-2019 Target + Macy's launch → 2020-2022 H&M + Uniqlo + Lululemon + Kohl's adoption → 2022-2024 Walmart GMM + Target consumables expansion → 2024 EU ESPR DPP + GS1 Sunrise 2027 alignment → 2026 Today (Blocker C: walmart-supplier-source-tagging, target-apparel-mandate, macys-item-level-rfid, nike-direct-to-consumer, inditex-internal-store-rfid, h-and-m-source-tagging programmes).

**Brief.** 12 `{label, items[]}` objects covering frequency + chip silicon, source tag form factors, GS1 SGTIN-96 encoding, ASN + EPCIS data delivery, Auburn ARC certification, retailer mandate compatibility, read-rate + performance, pre-encoding service workflow, factory application workflow, multi-retailer SKU management, standards + compliance, procurement.

**Sources[10].** GS1 EPC TDS 2.0, GS1 EPCIS 2.0, GS1 Digital Link, Auburn ARC, Walmart Supplier RFID, ISO/IEC 18000-63:2015, ANSI ASC X12 EDI 856, RAIN Alliance, Impinj M700, GS1 US Implementation Guide 5010.

**Inbound refs (12).** Pillar, sibling apparel-hang-tag + retail-price + jewelry + shipping-label + UHF inlay flagships + retail-apparel industry pages.

**Outbound orphan scan.** 0 orphans across 8 hrefs.

**Task.** #406 completed.
