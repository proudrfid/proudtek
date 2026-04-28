# nfc-digital-product-passport-tag — SHALLOW → DEEP

**Route.** `/products/rfid-labels/nfc-digital-product-passport-tag/`

**Anchor standards & citations.**
- EU Regulation 2024/1781 ESPR — Digital Product Passport framework regulation.
- GS1 Digital Link 1.3 — web-resolvable URI syntax for GTIN + serial.
- ISO/IEC 15459 — unique identifier across supply chains.
- NXP NTAG 424 DNA + DNA TT — AES-128 SUN + 5-key role-based access architecture.
- NXP AN12196 — SUN URL generation + tamper-loop CTTES register.
- CIRPASS Project — DPP interoperability reference architecture.
- W3C DIDs (Decentralized Identifiers) — identity layer for DPP stakeholders.
- JSON-LD — DPP data-model serialisation.
- EU Reg 2023/1542 (Battery DPP, 18 Feb 2027), Reg 2023/1670 (Smartphone Ecodesign).
- EU Dir 2024/1799 Right to Repair.

**DEEP block inventory.**
- `statBar.items[4]` — EU 2024/1781 ESPR DPP framework / NTAG 424 DNA AES-128 + 5-key access / GS1 Digital Link 1.3 + ISO/IEC 15459 / phased rollout 2027-2029.
- `comparePanel` — Static QR / printed barcode / paper certificate vs NTAG 424 DNA SUN + 5-key role architecture + GS1 Digital Link URI (this page).
- `dataHighlight` — Stakeholder-segregated DPP file slots: consumer / brand-owner / service-provider / recycler each read distinct keys; 5-key NTAG 424 DNA architecture maps directly to DPP stakeholder model.
- `timeline` — 2017 GS1 Digital Link → 2018 NTAG 424 DNA → 2020 EU Green Deal Circular Economy Action Plan → 2022-2023 CIRPASS / Battery Reg / ESPR adoption → 2024 ESPR enacted + R2R Directive → 2027 Battery Passport hard deadline + Textile DPP → 2026 Today (Blocker C: textile-fashion-house / battery-OEM / electronics-launch / construction-component / chemicals-substance programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon (NTAG 424 DNA + TagTamper), 5-key role architecture, DPP data model + GS1 Digital Link, CIRPASS interoperability, ERP integration (SAP/Oracle/MS Dynamics), category rollout phases (battery 2027 / textile 2027-2028 / electronics 2028-2029), substrate options, encoding workflow, backend integration, regulatory compliance, procurement.

**Sources[10].** EU Reg 2024/1781 ESPR, GS1 Digital Link 1.3, ISO/IEC 15459, NXP NTAG 424 DNA, NXP AN12196, CIRPASS Project, EU Reg 2023/1542 Battery, EU Reg 2023/1670 Smartphone Ecodesign, EU Dir 2024/1799 Right to Repair, JSON-LD W3C.

**Inbound refs (12).** Pillar, sibling NFC DPP-adjacent products, industries/eu-compliance / brand-protection / sustainability.

**Outbound orphan scan.** 0 orphans across 12 hrefs.

**Task.** #369 completed.
