# hospital-patient-id-wristband — SHALLOW → DEEP

**Route.** `/products/rfid-wristbands/hospital-patient-id-wristband/`

**Anchor standards & citations.**
- Joint Commission National Patient Safety Goal NPSG.01.01.01 — "Use at least two patient identifiers when providing care, treatment, and services". The wristband is the credential layer that operationalises this rule.
- HIPAA Privacy Rule 45 CFR 164.502 (minimum necessary) and 45 CFR 164.514 (de-identification reference) — bound the wristband-chip payload to a non-PII opaque serial; clinical context lives in the EMR.
- ISO 10993-5 (cytotoxicity) and ISO 10993-10 (sensitisation) — biocompatibility evaluation framework reference for prolonged-skin-contact materials; latex-free face stock + adhesive + closure.
- FDA 21 CFR 175.105 — adhesive baseline for direct-thermal hospital wristband construction.
- ISO/IEC 14443-A 13.56 MHz HF air interface for NFC; ISO/IEC 18000-63 EPC Gen2v2 for optional UHF RTLS / wandering prevention.
- AHRQ Patient Safety Network and WHO Patient Safety Solutions Solution 2 — international reference framework parallels.
- Printer compatibility: Zebra HC100 / HC100M (installed-base baseline), SATO WS4, Brother QL-820NWB.
- EMR / HIS integration: Epic, Oracle Cerner, MEDITECH, Allscripts (Veradigm) via HL7 v2 ADT or FHIR R4 Patient / Encounter resources; Epic Rover / Cerner Mobile / MEDITECH Expanse iOS-app NFC tap workflows.

**DEEP block inventory.**
- `statBar.items[4]` — Joint Commission NPSG.01.01.01 / HIPAA 45 CFR 164.514 PHI minimisation / Zebra HC100 installed-base printer baseline / MOQ 5,000 with 12-18 day lead time.
- `comparePanel` — NFC bedside verification (1-5 cm tap, smartphone-readable, Epic Rover / Cerner Mobile compatible, BCMA / blood-draw / specimen / surgical-safety / mother-infant) vs UHF RTLS (1-5 m automatic detection, dedicated reader infra, dementia / behavioural-health / NICU elopement).
- `dataHighlight` — "2 IDs" — Joint Commission NPSG.01.01.01 two-patient-identifier rule automated by the tap; closed-loop BCMA replaces manual visual verification with EMR-resolved digital second factor; published patient-safety literature (AHRQ, Zebra Healthcare, Joint Commission) consistently reports meaningful drop in wrong-patient near-misses.
- `timeline` — 1953 hospital paper armband baseline → 1995-2000 Joint Commission codifies two-identifier rule → 2003 NPSG.01.01.01 published → 2008-2013 BCMA scaling, NFC-on-wristband emerges → 2014 iPhone 6 NFC → 2018-2022 Epic Rover / Cerner Mobile / MEDITECH Expanse NFC tap-to-identify → 2026 Today (Blocker C anchor: "hospital-inpatient-ward, ED-arrival-triage, maternity-mom-baby-band, ambulatory-surgery, and long-term-care programmes").

**Brief.** 12 `{label, items[]}` objects covering material (latex-free synthetic), chip options (NFC + optional UHF), PHI minimisation (non-PII serial design pattern), Joint Commission / patient-safety frame, printer compatibility (Zebra HC100), EMR / HIS integration, sizing (adult / paediatric / infant / NICU), tamper-evident closure with calibrated false-positive rate, wear comfort and lifecycle, workflow applications, procurement / operations, compliance posture.

**Sources[10].** ISO/IEC 14443-1..4, NXP NTAG213/215/216 data sheet, HIPAA Privacy Rule 45 CFR 164.502 / 164.514, Joint Commission NPSG.01.01.01, ISO 10993-5, ISO 10993-10, Zebra HC100 specification, Apple Core NFC framework, AHRQ Patient Safety Network primer on patient identification, WHO Patient Safety Solutions Solution 2.

**Inbound refs (9).** Pillar, multiple healthcare / hospitality wristband SKUs, industries/healthcare, solutions/rfid-patient-tracking.

**Outbound orphan scan.** 0 orphans across 13 hrefs.

**Task.** #325 completed.
