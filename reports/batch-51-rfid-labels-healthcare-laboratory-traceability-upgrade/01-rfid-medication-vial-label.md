# rfid-medication-vial-label — SHALLOW → DEEP

**Route.** `/products/rfid-labels/rfid-medication-vial-label/`

**Anchor standards & citations.**
- US FDA DSCSA Title II (PL 113-54) — full enforcement Nov 2024.
- GS1 SGTIN-96 EPC encoding + GS1 EPC Tag Data Standard.
- ISO/IEC 18000-63:2015 UHF RAIN.
- Impinj M700 series + NXP UCODE 9.
- DEA CSOS (Controlled Substance Ordering System).
- Joint Commission NPSG.03.04.01 medication labelling + 5-Rights.
- ICH E6(R2) GCP — clinical-trial IMP.
- USP <661.1> pharmaceutical-grade plastic packaging.

**DEEP block inventory.**
- `statBar.items[4]` — Nov 2024 DSCSA full enforcement / USD 72B annual US drug-diversion loss / 1 in 300 manual 5-Rights bedside error rate / 45-60 min → <10 min ADC restock uplift.
- `comparePanel` — Manual barcode scan + paper diversion log + visual 5-Rights vs UHF RFID bulk scan + RFID diversion analytics + NFC bedside tap-verify (this page).
- `dataHighlight` — 70-80% ADC restock labour reduction (45-60 min → <10 min) at RFID-enabled hospitals + 4-6 weeks → <48 hours diversion-detection time + 99.8%+ receiving accuracy (vs 94-96% manual) + 85%+ bedside verification error reduction.
- `timeline` — 2003 Joint Commission NPSG.03.04.01 → 2013 FDA DSCSA enacted PL 113-54 → 2014-2018 GS1 EPC TDS + UHF RAIN maturity → 2017-2019 ADC vendor RFID modules → 2018 NTAG 424 DNA + iOS 12 background NFC → 2020-2022 drug-diversion analytics platforms → Nov 2024 DSCSA full enforcement → 2026 Today (Blocker C: hospital-pharmacy-adc, biopharma-distribution-centre, oncology-infusion-suite, surgical-anaesthesia-cart, clinical-trial-imp programmes).

**Brief.** 12 `{label, items[]}` objects covering frequency + chip silicon, DSCSA serialisation encoding, container-specific label sizing, substrate + adhesive, ADC integration partners (BD Pyxis MedStation ES Gen7 / Omnicell XT RFID-Ready / BD Rowa Vmax), pharmacy IS + eMAR integration (Epic Willow / Cerner PharmNet / Meditech BPM / Wolters Kluwer / HL7 + FHIR), controlled-substance + DEA framework, recall management workflow, application verticals, Joint Commission + clinical safety framework, standards + compliance, procurement.

**Sources[10].** FDA DSCSA, GS1 General Specifications + EPC TDS, ISO/IEC 18000-63:2015, Impinj M700 + NXP UCODE 9, DEA CSOS, Joint Commission NPSG, ICH E6(R2) GCP, USP <661.1>.

**Inbound refs (8).** Pillar, sibling cryogenic + specimen-slide + blood-bag + tamper-evident + nfc-pharmaceutical-label flagship + industries/healthcare + pharmaceutical.

**Outbound orphan scan.** 0 orphans across 10 hrefs.

**Task.** #396 completed.
