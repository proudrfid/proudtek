# Batch 12 — rfid-labels pharma / medical / component authentication

**Scope:** 6 rfid-labels SKUs — 4 pharma/medical (NFC/UHF) + 2 battery/electronics regulatory-driven authentication pages.
**Date:** 2026-04-23
**Cluster progress:** 24 / 58 rfid-labels SKUs refined (~41%).

## SKUs refined

| SKU | Treatment | Sec | FAQ | Sources |
| --- | --- | --- | --- | --- |
| nfc-pharmaceutical-label | Depth + FAQ + hygiene | 2→4 | 3→5 | 0→8 |
| uhf-rfid-blood-bag-label | Depth + FAQ + hygiene | 2→4 | 3→5 | 0→8 |
| rfid-medication-vial-label | FAQ + hygiene | 6 | 3→5 | 0→8 |
| rfid-cryogenic-specimen-label | FAQ + hygiene | 6 | 3→5 | 0→8 |
| nfc-battery-passport-tag | FAQ + hygiene | 7 | 3→5 | 0→8 |
| nfc-warranty-seal-tag | FAQ + hygiene | 7 | 3→5 | 0→8 |

## Depth-extension additions (2 → 4 sections)

### nfc-pharmaceutical-label
- **"The DSCSA / EU FMD / EMVS serialization architecture — where NFC fits and where GS1 DataMatrix stays mandatory"** — FDA DSCSA unit-level serialization via SGTIN-96, EU FMD 2011/62/EU Article 3 unique identifier + Article 5 anti-tampering device (ATD, deliberately technology-agnostic), EMVS hub/national blueprint, global convergence (Brazil ANVISA RDC 157/2017, Russia Chestny ZNAK, Saudi Arabia SFDA Rasd, Argentina ANMAT, India DGFT). Honest framing: NFC is an **additive consumer-facing authentication layer**, not a replacement for the GS1 DataMatrix carrier mandated by regulators.
- **"Anti-counterfeit layers, cold-chain vaccines and patient-adherence programs"** — defence-in-depth 5-layer stack; WHO VVM + Berlinger Fridge-tag + Sensitech TempTale + LogTag UTRIX cold-chain integration; patient-adherence pull-throughs via Epic MyChart / Cerner HealtheLife / Apple HealthKit; pharmacovigilance integration with FDA MedWatch and EMA EudraVigilance; ICH E6(R2) GCP IMP kit chain-of-custody.

### uhf-rfid-blood-bag-label
- **"ISBT 128 data structure, chip selection and label substrate engineering for blood-bag RFID"** — ICCBBA ST-001 + TS-002 RFID placement technical specification; 13-character Donation Identification Number (DIN); Impinj M700 series (M730/M750/M770) for 400–600 tag population density; plasticizer migration from PVC blood bag; shelf lives by component (RBC 42d AS-1/AS-3/AS-5, apheresis platelets 5d, FFP 1yr -18°C, frozen RBC 10yr -65°C CPD/glycerol); Fresenius Kabi CompoFlow, Haemonetics ACD-A, Terumo BCT Trima Accel, MacoPharma collection/processing integration.
- **"Clinical integration — crossmatch, bedside transfusion verification and hemovigilance"** — Mediware HCLL, SCC SoftBank, Haemonetics SafeTrace TX, Cerner Millennium Blood Bank, Epic Beaker; AABB Standard 5.27.2 four points of identity; UK SHOT + FDA BPDR hemovigilance feeds; CAR-T autologous specimen chain + AATB tissue-bank intersections.

## FAQ extensions (3 → 5) — regulator-specific

- **nfc-pharmaceutical-label**: NFC is not an approved DSCSA/FMD carrier (GS1 DataMatrix remains mandatory — honest framing); hospital BMA/CLMA integration via HL7 FHIR MedicationAdministration and HL7 v2.x RAS/RGV.
- **uhf-rfid-blood-bag-label**: RFID coexists with printed ISBT 128 barcodes (never replaces them); HF vs UHF decision framework — HF for bedside identity match, UHF for bulk inventory visibility.
- **rfid-medication-vial-label**: BD Pyxis MedStation ES Gen7 RFID drawer module + Omnicell XT RFID-Ready pocket + BD Rowa Vmax Restock Automation integration via HL7 RAS/RGV; DEA CSOS e-222 + state PDMPs as complementary (not substitute) controls for Schedule II–V diversion (Bluesight / Omnicell Performance Center / Invistics ControlCheck analytics).
- **rfid-cryogenic-specimen-label**: ISBER Best Practices 5th edition (Section G/J/K) + ISO 20387:2018 biobanking + CAP Biorepository accreditation; IVF gamete/embryo chain-of-custody under UK HFEA Code of Practice + FDA 21 CFR Part 1271 HCT/P + EU 2004/23/EC (Tissues and Cells Directive); RFID Witness Systems (CooperSurgical, IMT Matcher) for IVF two-sample identity match.
- **nfc-battery-passport-tag**: Global Battery Alliance Battery Passport framework + CIRPASS DPP interoperability (GS1 Digital Link URI + JSON-LD + W3C DIDs); NTAG 424 DNA 5-application-key role-based access provisioning (master + public consumer + authenticated owner + service provider + recycler) mapping to EU Battery Regulation Article 77 + Annex XIII required data fields; Aura Blockchain / Re|Source battery ledger for responsible-sourcing claims.
- **nfc-warranty-seal-tag**: FDA 21 CFR Part 11 electronic records applicability for chain-of-custody evidence seals (validated-system responsibility, not tag-level claim); EU FMD Article 5 ATD is technology-agnostic (NFC seals generally accepted); 5-layer overt+covert+cryptographic security stack for high-value electronics OEM programs (hologram + GS1 DataMatrix + micro-taggant + UV ink + NTAG 424 DNA).

## Hygiene fixes (all 6 SKUs)

- Legacy `/product/...` imageSourceRoutes → intra-cluster `/products/rfid-labels/...` (2 entries per SKU).
- primaryAction.href `/contact/` → `/contact/rfid-labels-tags/`.
- Dates: publishedAt 2026-04-22 + modifiedAt 2026-04-23 + reviewedAt 2026-04-22 → 2026-04-23.
- sources[] arrays appended (8 entries each, schema: label + url, publisher optional).

## Verification

- `npx astro sync` — clean generation (856 ms).
- Legacy `/product/` route count across all 6 SKUs: **0**.
- Bare `/contact/` references across all 6 SKUs: **0**.
- All imageSourceRoutes cross-link targets verified via directory listing before commit.
- resourceCard target `/products/rfid-tags/rfid-bolt-seal/` verified present on disk (nfc-warranty-seal-tag).
- resourceCard target `/products/rfid-tags/rfid-blood-bag-tag/` verified present on disk (uhf-rfid-blood-bag-label / rfid-medication-vial-label).

## Thematic cohesion

Batch 12 clusters two regulatory-driven authentication domains:

1. **Pharma / medical / biobank (4 SKUs)** — DSCSA, EU FMD, EMVS, ICCBBA ST-001/TS-002, FDA 21 CFR Part 606, AABB Standards, ISBER Best Practices, ISO 20387, HFEA, FDA 21 CFR Part 1271. The through-line is "NFC/RFID is an additive layer atop the mandatory carrier (GS1 DataMatrix or ISBT 128 printed barcode) — not a replacement." This is the single most important honest-framing message for regulated-industry buyers.
2. **Battery / electronics chain-of-custody (2 SKUs)** — EU Battery Regulation 2023/1542 Feb-2027 hard deadline, EU ESPR 2024/1781 DPP framework, GBA + CIRPASS interoperability, NTAG 424 DNA 5-key role-based access, FDA 21 CFR Part 11 electronic-records. The through-line is "regulation-driven digital product passport meets tamper-evident authentication at the SKU level."

## Cluster progress

- rfid-labels total: 58 SKUs.
- Refined through Batch 12: 24 SKUs (~41%).
- Remaining: 34 SKUs spanning shipping/logistics, asset, airline, library/laundry/jewelry, retail/apparel, remaining pharma/food catch-up.

## Next batch proposal — Batch 13

**Shipping + logistics + asset + airline bundle** (6 SKUs):
- `rfid-airline-baggage-tag`
- `rfid-asset-label`
- `rfid-shipping-label`
- `uhf-rfid-pallet-label`
- `uhf-rfid-tire-label`
- `uhf-rfid-windshield-label`

Thematic anchor: IATA Resolution 753 baggage traceability + GS1 EPCIS + US DoT tire serialization + electronic toll collection + IEEE 802.11p V2X windshield applications.

## Task status

- #131 Batch 12 audit parent → **completed**.
- #132–137 individual SKU refine tasks → **all completed**.
- Batch 13 tasks pending creation on user authorization.
