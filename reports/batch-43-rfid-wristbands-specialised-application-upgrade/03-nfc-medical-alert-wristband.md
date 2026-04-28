# nfc-medical-alert-wristband — SHALLOW → DEEP

**Route.** `/products/rfid-wristbands/nfc-medical-alert-wristband/`

**Anchor standards & citations.**
- ISO/IEC 14443-A 13.56 MHz HF NTAG213 (144 B) / NTAG216 (888 B) — NDEF-encoded emergency profile.
- NFC Forum Type 2 Tag Operation Specification — readable on every modern smartphone without an app.
- HIPAA Privacy Rule 45 CFR 164.502 (minimum necessary) + 45 CFR 164.514 (de-identification) — bounds on-chip vs cloud-profile design.
- FDA 21 CFR 177.2600 + ISO 10993-5 / 10993-10 biocompatibility evaluation framework for medical-grade silicone.
- Joint Commission NPSG.01.01.01 (two patient identifiers) + AHRQ Patient Safety Network + WHO Patient Safety Solutions Solution 2 (Patient Identification).
- MedicAlert Foundation (since 1956) — canonical engraved-bracelet medical-alert programme and emergency-contact subscriber service framework.
- Apple Core NFC + Android NFC for no-app universal smartphone tap.
- EU REACH SVHC + RoHS Directive 2011/65/EU — material compliance.
- Care-facility platform integration: PointClickCare, MatrixCare, Cantata Health, Eldermark.

**DEEP block inventory.**
- `statBar.items[4]` — Tap = seconds vs phone-line lookup / NTAG216 888 B multi-condition profile capacity / iOS 14+ + Android no-app universal reader / FDA / ISO 10993 medical-grade silicone biocompatibility.
- `comparePanel` — On-chip NDEF (offline default, allergies / medications / blood type / DNR / contacts) vs Cloud-linked HIPAA-compliant profile (full medical history, role-based access, audit logging, requires connectivity).
- `dataHighlight` — "Seconds" allergy / medication info into clinician's hand vs 15-60 minutes empirical-caution window before family contact / pharmacy lookup surfaces critical info.
- `timeline` — 1956 MedicAlert Foundation founded → 1996 HIPAA enacted → 2003 Joint Commission NPSG.01.01.01 → 2010-2012 NXP NTAG commoditisation → 2014 iPhone 6 NFC universalises → 2018-2022 PointClickCare / MatrixCare / Cantata Health platform integration + iOS 14 Core NFC Background Tag Reading → 2026 Today (Blocker C anchor: "chronic-condition-patient, severe-allergy-bearer, DNR-advance-directive, dementia-wandering, and paediatric-medical-fragility programmes").

**Brief.** 12 `{label, items[]}` objects covering substrate (medical-grade silicone), air interface and chip pairing, on-chip vs cloud-linked profile design, HIPAA Privacy Rule + PHI minimisation, MedicAlert Foundation alignment, emergency-services workflow, assisted-living / dementia / wandering response, chronic-condition individual programmes, visual identification and accessibility, clasp and child / paediatric considerations, mass-casualty and disaster-response use, procurement and operations.

**Sources[10].** ISO/IEC 14443-1..4, NXP NTAG213 / 215 / 216 data sheet, NFC Forum Type 2 Tag Specification, HIPAA Privacy Rule 45 CFR 164.502 / 164.514, FDA 21 CFR 177.2600, ISO 10993-5, ISO 10993-10, MedicAlert Foundation, Joint Commission NPSG.01.01.01, Apple Core NFC framework.

**Inbound refs (5).** Pillar, multiple wristband SKUs, industries/healthcare, solutions/rfid-patient-tracking.

**Outbound orphan scan.** 0 orphans across 14 hrefs.

**Task.** #340 completed.
