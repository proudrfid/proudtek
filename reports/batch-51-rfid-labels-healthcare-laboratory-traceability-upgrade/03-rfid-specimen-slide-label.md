# rfid-specimen-slide-label — SHALLOW → DEEP

**Route.** `/products/rfid-labels/rfid-specimen-slide-label/`

**Anchor standards & citations.**
- CAP Laboratory Accreditation Program — Anatomic Pathology Checklist 2024.
- ANP.11605 specimen identification + ANP.22570 slide labelling.
- CLIA 42 CFR Part 493 §493.1241 + §493.1249.
- Joint Commission NPSG.01.01.01 (two patient identifiers) + NPSG.01.03.01.
- ISO 15189:2022 medical laboratory quality + competence.
- CAP Q-Probes 2005 (Wagar et al., Arch Pathol Lab Med).
- DICOM Supplement 145 Whole Slide Imaging.
- FDA 510(k) WSI primary-diagnosis clearance (Philips IntelliSite 2017 / Leica AT2 DX 2019 / Roche uPath 2022).
- HL7 FHIR R4 DiagnosticReport / Specimen / ServiceRequest resources.

**DEEP block inventory.**
- `statBar.items[4]` — 0.1-1% pathology specimen misidentification rate / 5-15% handwritten label illegibility post-staining / 3-8% barcode-label failure post-coverslipping / 15-45 min manual archival retrieval per case.
- `comparePanel` — Handwritten ink label + paper barcode + manual visual archive search vs ultra-thin RFID NFC label + LIS auto-capture + DICOM-WSI tie (this page).
- `dataHighlight` — 55-75% specimen misidentification reduction with RFID auto-ID vs manual baseline (CAP Q-Probes Wagar 2005 / Layfield 2010 / Makary 2007); PHI off-tag HIPAA-compliant architecture; DICOM-WSI Slide ID (0040,0560) ↔ chip EPC tie.
- `timeline` — 1980s handwritten ink-label baseline → 2005 CAP Q-Probes specimen-identification baseline → 2010 DICOM Supplement 145 WSI → 2013 NTAG213/215/216 family → 2017 FDA 510(k) Philips IntelliSite primary-diagnosis WSI → 2019-2022 Leica AT2 DX + Roche uPath FDA-cleared → 2022 ISO 15189:2022 refresh → 2026 Today (Blocker C: academic-medical-centre-pathology, regional-reference-laboratory, oncology-companion-diagnostics, ivf-cytology, forensic-pathology programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon (NTAG210μ + NTAG213), frequency + protocol, form factor + dimensions (<0.15 mm thickness + 22×18 mm), histology-protocol resistance (formalin + paraffin + xylene + H&E + IHC + coverslipping), encoded data model (PHI off-tag), LIS integration partners (Epic Beaker AP + Cerner CoPath + Sunquest + PowerPath + NovoPath), digital pathology scanner integration (Leica Aperio + Hamamatsu + 3DHistech + Roche Ventana + Philips IntelliSite), DICOM-WSI integration (Slide ID 0040,0560), regulatory + accreditation framework, slide-archive automation, application verticals, procurement.

**Sources[10].** CAP Anatomic Pathology Checklist, CLIA 42 CFR Part 493, Joint Commission NPSG, ISO 15189:2022, Wagar et al. Arch Pathol Lab Med 2005, DICOM Sup 145, FDA 510(k) K163253 Philips IntelliSite, NXP NTAG21x, ISO/IEC 14443-3:2018, HL7 FHIR R4.

**Inbound refs (4).** Pillar, sibling medication-vial (host-edit boost) + cryogenic + blood-bag + ntag213.

**Outbound orphan scan.** 0 orphans across 5 hrefs.

**PHI architecture note.** Chip encodes accession number only — PHI off-tag (HIPAA-compliant). LIS resolves accession to patient at read time. 42 CFR Part 2 substance-use-disorder protected.

**Task.** #398 completed.
