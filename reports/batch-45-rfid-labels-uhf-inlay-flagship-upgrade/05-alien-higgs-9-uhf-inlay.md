# alien-higgs-9-uhf-inlay — SHALLOW → DEEP

**Route.** `/products/rfid-labels/alien-higgs-9-uhf-inlay/`

**Anchor standards & citations.**
- Alien Technology Higgs-9 chip — fourth-generation Alien RAIN RFID silicon (successor to Higgs-3 / Higgs-4 / Higgs-EC).
- 128-bit EPC + 96-bit factory-serialised TID + 688-bit (≥64 byte) user memory — largest user memory in volume RAIN RFID tier.
- Read sensitivity -24.0 dBm typical (~0.5 dB more sensitive than M700-series).
- Dense-reader mode (DRM) support for overlapping reader zones.
- ISO/IEC 18000-63:2015 + EPC Gen2v2 air-interface compliance.
- GS1 EPC Tag Data Standard (TDS) 2.0 SGTIN-96 / SGTIN-198 / SSCC / GIAI / Application Identifier encoding.
- GS1 EPCIS 2.0 supply-chain event data standard for RTI / pharma traceability.
- AFI (Application Family Identifier) format per GS1 EPC TDS for multi-party data exchange.
- ATA Spec 2000 Chapter 9-5 aerospace parts traceability — large user memory for on-tag part-history payloads.
- EU Regulation 2024/1781 ESPR Digital Product Passport — 688-bit user memory accommodates full DPP URL + serial + sustainability fields on-tag.

**DEEP block inventory.**
- `statBar.items[4]` — 688 bits user memory (largest in volume RAIN tier) / -24.0 dBm read sensitivity / 128-bit EPC SGTIN-96/198 + GS1 AI / Offline-capable without network connectivity.
- `comparePanel` — Higgs-9 (large user memory + offline data) vs M700 (small-antenna sensitivity) / UCODE 9 (high-volume cost).
- `dataHighlight` — "32-48 bytes" typical RTI trip data fitting comfortably in Higgs-9 user memory; structural value of on-tag offline data storage vs alternatives forced to truncate or backend round-trip.
- `timeline` — 2004 EPC Gen2 v1 → 2007 Higgs-3 with 800-bit user memory → 2012-2014 Walmart Phase 1 + supply-chain RTI scales on Higgs family → 2015 ISO/IEC 18000-63:2015 → 2018 Higgs-9 launch → 2020-2024 Walmart mandate scales (Higgs-9 captures user-memory-dependent supply-chain segment) → 2026 Today (Blocker C: aerospace-part-traceability, DPP-textile-EU-ESPR, automotive-component-RFID, healthcare-instrument, multi-application-on-tag programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon and lineage, memory architecture, sensitivity and read range, air interface and standards, on-tag data storage patterns (RTI / field service / pharma traceability / GS1 AI multi-party), Higgs-9 vs M700 vs UCODE 9 chip-family decision, industrial asset tracking, returnable transit items (RTI) and logistics, antenna designs available, form factors, procurement and lead times, compliance posture.

**Sources[10].** Alien Technology Higgs-9 product brief, ISO/IEC 18000-63:2015, GS1 EPC TDS 2.0, GS1 EPCIS 2.0, RAIN RFID Alliance, FCC Part 15.247, ETSI EN 302 208, Auburn ARC Master List, ATA Spec 2000 Chapter 9-5, EU Regulation 2024/1781 ESPR.

**Inbound refs (6).** Pillar, sibling Impinj M700/M800 inlays, industries/luxury-brands / retail-apparel / logistics / industrial / aerospace-aviation-mro / eu-compliance, compare/ucode-vs-ucode-vs-Monza-vs-Higgs.

**Outbound orphan scan.** 0 orphans across 12 hrefs.

**Task.** #356 completed.
