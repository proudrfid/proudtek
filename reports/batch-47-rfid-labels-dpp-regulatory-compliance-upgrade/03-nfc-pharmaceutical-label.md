# nfc-pharmaceutical-label — SHALLOW → DEEP

**Route.** `/products/rfid-labels/nfc-pharmaceutical-label/`

**Anchor standards & citations.**
- US FDA Drug Supply Chain Security Act (DSCSA) — full enforcement Nov 2024.
- EU Falsified Medicines Directive 2011/62/EU + Delegated Regulation 2016/161 (Article 3 Unique Identifier + Article 5 Anti-Tamper Device).
- EMVS European Medicines Verification System — end-point decommissioning.
- NXP NTAG 424 DNA + DNA TT — AES-128 SUN + bridge-antenna CTTES tamper register.
- WHO PQS E006 — cold-chain monitoring requirements.
- WHO VVM (Vaccine Vial Monitor) reference.
- ICH E6(R2) GCP — clinical-trial Investigational Medicinal Product handling.
- USP <661.1> — pharmaceutical-grade plastic packaging.
- HL7 FHIR R4 — MedicationAdministration resource for CLMA / BMA workflows.
- GS1 DataMatrix — mandatory carrier under DSCSA + EU FMD.

**DEEP block inventory.**
- `statBar.items[4]` — US DSCSA full enforcement Nov 2024 / EU FMD 2011/62/EU + 2016/161 ATD + UI / NTAG 424 DNA AES-128 + bridge-antenna CTTES / NFC sits ON TOP of mandated GS1 DataMatrix.
- `comparePanel` — Mandated GS1 DataMatrix alone / hologram + paper batch sheet vs GS1 DataMatrix + NTAG 424 DNA SUN + bridge-antenna 5-layer defense-in-depth (this page).
- `dataHighlight` — Defense-in-depth 5-layer architecture: Layer 1 GS1 DataMatrix (regulatory mandate) / Layer 2 NFC SUN cryptographic identity / Layer 3 bridge-antenna physical tamper / Layer 4 cold-chain WHO PQS E006 / Layer 5 HL7 FHIR MedicationAdministration audit.
- `timeline` — 2011 EU FMD adopted → 2013 US DSCSA enacted → 2016 EU Delegated Reg 2016/161 + EMVS goes live → 2019 EU FMD safety-features deadline → 2024 DSCSA full enforcement Nov → 2025-2026 ICH E6(R3) GCP modernisation → 2026 Today (Blocker C: high-value-biologics / specialty-pharmacy / hospital-CLMA-BMA / clinical-trial-IMP / cold-chain-vaccine programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon, GS1 DataMatrix carrier hierarchy (NFC ON TOP of, NOT in place of), DSCSA + FMD regulatory architecture, EMVS end-point decommissioning workflow, cold-chain WHO PQS E006 + VVM integration, ICH E6(R2) clinical-trial IMP handling, CLMA/BMA via HL7 FHIR, USP <661.1> substrate compliance, bridge-antenna anti-refill mechanism, defense-in-depth architecture, procurement, compliance posture.

**Sources[10].** US FDA DSCSA, EU FMD 2011/62/EU + Delegated Reg 2016/161, EMVS, NXP NTAG 424 DNA, NXP AN12196, WHO PQS E006, ICH E6(R2) GCP, USP <661.1>, HL7 FHIR R4, GS1 DataMatrix.

**Inbound refs (8).** Pillar, sibling NFC authentication products, industries/healthcare / pharma-supply-chain / brand-protection / cold-chain-food-traceability.

**Outbound orphan scan.** 0 orphans across 9 hrefs.

**Task.** #370.5 completed (page 3/5 of batch 47).
