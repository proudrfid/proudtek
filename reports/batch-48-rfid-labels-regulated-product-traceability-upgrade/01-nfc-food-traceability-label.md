# nfc-food-traceability-label — SHALLOW → DEEP

**Route.** `/products/rfid-labels/nfc-food-traceability-label/`

**Anchor standards & citations.**
- US FDA FSMA Section 204 — 21 CFR Part 1 Subpart S, compliance date 20 Jan 2026.
- FDA Food Traceability List (FTL) — cheeses / shell eggs / nut butters / leafy greens / melons / peppers / sprouts / tomatoes / fresh-cut produce / finfish / crustaceans / molluscan bivalves / RTE deli salads.
- EU Reg (EC) 178/2002 General Food Law Article 18 — 'one up, one down' baseline.
- EU Reg 2023/1115 EUDR + Reg 2024/3234 compliance-date amendment.
- GS1 Digital Link 1.3 + ISO/IEC 19987:2015 EPCIS 2.0 + per-lot Traceability Lot Code (TLC).
- EU Reg 1379/2013 CMO seafood + EU Reg 1005/2008 IUU-fishing + Reg 2017/625 Official Controls.
- IFT FDA Low-Cost Traceability Challenge 2023 reference architecture.
- FDA 21 CFR 175.105 indirect-food-contact PSA.

**DEEP block inventory.**
- `statBar.items[4]` — 20 Jan 2026 FSMA 204 compliance / USD 30-40B annual food-fraud / 57-day recall response / EUDR compliance dates 30 Dec 2025 + 30 Jun 2026.
- `comparePanel` — Printed lot code + 1D barcode + paper certificate vs GS1 Digital Link URI + EPCIS 2.0 events (this page).
- `dataHighlight` — 80-95% recall scope reduction with per-lot TLC + EPCIS visibility events vs SKU-level recall over weeks.
- `timeline` — 2002 EU 178/2002 → 2011 FSMA enacted → 2015 EPCIS 2.0 + GS1 Digital Link → 2018 NTAG 424 DNA + iOS 12 → 2022-2023 FSMA 204 final + EUDR enacted → 2024-2025 EUDR amendment + IFT challenge → 2026-2027 FSMA 204 in force + EUDR compliance + GS1 Sunrise → 2026 Today (Blocker C: premium-coffee-DTC, organic-leafy-greens, sustainable-seafood, single-origin-cocoa, farm-to-fork-restaurant programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon, GS1 Digital Link encoding, form factors, substrate + adhesive, FSMA 204 CTEs, FTL coverage, EUDR commodity coverage, cold-chain integration architecture, consumer-tap experience, backend integration, standards + regulatory compliance, procurement.

**Sources[10].** FDA FSMA Section 204, FDA Food Traceability List, EU Reg 178/2002, EU Reg 2023/1115 EUDR, GS1 Digital Link 1.3, ISO/IEC 19987:2015 EPCIS, NXP NTAG 424 DNA, FDA 21 CFR 175.105, EU Reg 1379/2013 CMO, IFT FDA Low-Cost Traceability Challenge.

**Inbound refs (7).** Pillar, sibling DPP / pharma / olive-oil / NTAG424 flagship products, industries/cold-chain-food-traceability + agriculture (host-edits added).

**Outbound orphan scan.** 0 orphans across 6 hrefs.

**Task.** #375 completed.
