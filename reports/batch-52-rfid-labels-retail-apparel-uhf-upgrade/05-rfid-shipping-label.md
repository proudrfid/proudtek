# rfid-shipping-label — SHALLOW → DEEP

**Route.** `/products/rfid-labels/rfid-shipping-label/`

**Anchor standards & citations.**
- GS1 General Specifications + SSCC + GS1-128 logistics label.
- GS1 Digital Link URI 1.3 + URI-to-EPC binding (https://id.gs1.org/00/{SSCC} ↔ SSCC-96).
- GS1 Sunrise 2027 — 2-D-at-POS migration.
- GS1 EPC TDS 2.0 SSCC-96 + SGTIN-96 + GID-96.
- ISO/IEC 18000-63:2015 EPC Gen2v2 RAIN RFID.
- Impinj M750 / M730 + NXP UCODE 9.
- Zebra ZT411 RFID + ZT621 RFID printer specifications.
- GS1 EPCIS 2.0 (ISO/IEC 19987:2015) JSON-LD.
- Amazon FBA Vendor Flex RFID label guidelines.

**DEEP block inventory.**
- `statBar.items[4]` — 92-95% → 99.5%+ dock-door scan compliance uplift (barcode gun → RFID portal) / USD 50-75/hr driver detention fee / USD 50-250/PO non-compliance chargeback / 30-60 min → 5-8 min trailer loading time uplift.
- `comparePanel` — Barcode-only thermal label + manual scan-gun receiving + 3PL paper audit vs RFID + GS1-128 + DataMatrix triple-identifier + portal-reader receiving (this page).
- `dataHighlight` — Triple identifier on single label: GS1-128 barcode + SSCC-96 RFID EPC + GS1 DataMatrix Digital Link URI. TDS 2.0 URI binding (https://id.gs1.org/00/{SSCC} ↔ SSCC-96 EPC).
- `timeline` — 1989 GS1-128 barcode standardised → 2005 Walmart RFID supplier mandate → 2010 Auburn ARC + GS1 EPC TDS maturity → 2014-2018 Zebra ZT411 RFID + RAIN maturity → 2020 GS1 Sunrise 2027 announced → 2022-2024 Walmart GMM + Amazon FBA Vendor Flex RFID + UPS SmartLabel → 2024 EPCIS 2.0 + EU ESPR DPP + USPS Delivering for America RFID pilot → 2026 Today (Blocker C: retailer-supplier-mandate, e-commerce-fulfilment-centre, parcel-carrier-hub-sortation, 3pl-billing-audit, cross-dock-routing programmes).

**Brief.** 12 `{label, items[]}` objects covering frequency + chip silicon, label format + dimensions, EPC encoding standards, RFID-printer compatibility, read-rate performance, carrier programme compatibility, retailer supplier-mandate compatibility, supply-chain touchpoint deployment, GS1 Sunrise 2027 forward-compatibility, operational ROI metrics, standards + compliance, procurement.

**Sources[10].** GS1 General Specifications SSCC, GS1 Digital Link, GS1 Sunrise 2027, GS1 EPC TDS 2.0, ISO/IEC 18000-63:2015, Impinj M700, NXP UCODE 9, Zebra ZT411 RFID, GS1 EPCIS 2.0, Amazon FBA Vendor Flex RFID.

**Inbound refs (8).** Pillar, sibling pallet-label + airline-baggage + apparel-hang-tag + retail-price + garment-source + paper-label + pallet-tag + tamper-seal-tag.

**Outbound orphan scan.** 0 orphans across 8 hrefs.

**Task.** #407 completed.
