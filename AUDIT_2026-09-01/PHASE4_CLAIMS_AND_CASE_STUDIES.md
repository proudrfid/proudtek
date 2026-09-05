# Phase 4 — Claim and Evidence Audit

Deliverables: `PHASE4_CLAIM_LEDGER_CURATED.csv` (50 material claim groups — the ledger that matters), `PHASE4_CLAIM_LEDGER.csv` (raw candidate extraction: 31,008 unique sentences with a numeric/standard/certification trigger across 535 indexable pages, auto-classified — a search index for follow-up, not a reviewed ledger). Evidence statuses follow the brief: FIRST_PARTY_VERIFIED · EXTERNAL_PRIMARY_SOURCE · EXTERNAL_SECONDARY_SOURCE · DERIVED_CALCULATION · ILLUSTRATIVE_EXAMPLE · UNVERIFIED. Nothing was rewritten.

## 1. What could be verified with documents

Only one document pack exists in the repository: `9001 certificate/奥科体系证书.pdf` (6 pages, scanned). It contains three management-system certificates issued by **Anhui Certification and Inspection Co., Ltd (CAIC, zjcaic.com)**, verifiable at cnca.gov.cn:

| Standard | Certificate no. | Holder (CN / EN) | USCC | Scope (certificate text) | Initial / expiry |
| --- | --- | --- | --- | --- | --- |
| ISO 9001:2015 (GB/T 19001-2016) | 98026Q00274R000 | 深圳市奥科物联有限公司 / Shenzhen Proud Tek Co., Ltd | 91440300MA5FBLMP1Y | **Sales service of smart cards (PVC cards, wooden cards), RFID tags** | 2026-06-10 / 2029-06-09 |
| ISO 14001:2015 | 98026E00200R000 | same | same | environmental management activities involved in the sales of the same | same |
| ISO 45001:2018 | 98026S00203R000 | same | same | OH&S management activities involved in the sales of the same | same |

Registered and audit address on all three: A2109, Zhantao Science & Technology Building, Minzhi, Longhua, Shenzhen — the office address on proudtek.com.

Consequences (observed evidence → interpretation):
- The certificates are real and recent; `/about/certifications/` already states the scope honestly. **But the site-wide trust strip on 446 pages says "ISO 9001 Certified Factory", `llms.txt` says "ISO 9001:2015 certified manufacturing (SGS audited)", and machine mirrors list "ISO 9001:2015, ISO 14001:2015, RoHS Compliant, CE Marking, REACH Compliant" as credentials.** The issuer is CAIC, not SGS; the scope is sales service, not manufacturing.
- The certificate's Chinese legal name (深圳市奥科物联有限公司, "Shenzhen Aoke IoT Co., Ltd") and English name ("Shenzhen Proud Tek Co., Ltd") both differ from the site's JSON-LD `legalName` "Proud Tek Co., Limited" (Phase 3 conflict C1 is now partly resolved by a primary document).
- The certification date (June 2026) means any implication of long-standing ISO certification is unsupported.

Two external primary sources were checked for chip facts (rule 17): NXP's MIFARE Classic product page and the NTAG213/215/216 datasheet Rev 3.2. Results: NTAG memory sizes and originality-signature claims are correct; the Classic 1K page's "launched … in 1997" contradicts NXP ("back in 1994") and the same page's own "since 1994" — one verifiable error in a five-fact sample, not caught by the 35-rule chip-claims lint.

## 2. Status summary of the 50 curated claim groups

| Evidence status | Groups | Notes |
| --- | --- | --- |
| FIRST_PARTY_VERIFIED (with required correction) | 2 | ISO certificates (K-09, K-10) — verified *and* found misrepresented on most surfaces |
| EXTERNAL_PRIMARY_SOURCE (checked) | 2 | P-01 MIFARE Classic air-interface/memory; P-03 NTAG memory/originality |
| EXTERNAL_PRIMARY_SOURCE available but not cited sentence-by-sentence | 4 | DSCSA, ESPR/DPP/Battery Regulation, HIPAA/GDPR, Crypto-1 literature |
| CONTRADICTED by a primary or owner-controlled source | 3 | K-02 factories vs rfidak.com + certificate scope; P-02 1997 vs NXP 1994; G-01/K-09 "SGS audited" vs CAIC |
| UNVERIFIED | 39 | all company-capability numbers, patents, R&D %, client counts, service SLAs, MOQ/lead-time/price figures, all 13 case studies, compatibility acceptance tables, OEKO-TEX/TÜV/FCC/CE, authorship identities, testimonials, sustainability claims |

By claim type (curated): company identity 6 · manufacturing capability 5 · certification 5 · patent 1 · price 2 · MOQ 1 · lead time 3 · customer result 15 · product specification 4 · security 1 · test result 1 · compatibility 2 · legal/regulatory 5 · health/safety 1 · sustainability 1 · market statistic 1.

## 3. The claims that create legal or factual danger (P0)

| ID | Claim | Why P0 | Treatment |
| --- | --- | --- | --- |
| K-02/K-03/K-04 | "Two self-owned factories, 10 automated lines, 305+ machines" (home, factory page, sample-pack strip) | Contradicted by the owner's sister site for the same legal entity ("production runs on contracted partner lines") and by the sales-only ISO scope; Made-in-China shows one factory address and "Trading Company". Procurement buyers make sourcing decisions on this. | REQUEST_FIRST_PARTY_EVIDENCE with a deadline; absent evidence → QUALIFY to the rfidak.com formulation or REMOVE. Owner decision required before any Phase 9 drafting of About/Factory. |
| K-09/G-01 | "ISO 9001 Certified Factory" / "certified manufacturing (SGS audited)" | Certificate exists but says the opposite on scope and issuer; false certification wording is the classic B2B liability | QUALIFY to certificate text everywhere; remove "SGS" |
| K-11 | OEKO-TEX / "RoHS, REACH by TÜV" | Certification marks used without a certificate in evidence | Evidence or removal of logos/wording |
| CS-00…CS-12 | 13 anonymous case studies with precise outcomes (99.4 %, 41 %, 3.1×, 320 %, "zero retained sponges", 380 M DSCSA labels/yr) plus a pillar promising "measured after go-live", "customer permission", "reference calls" | No permission, data or reference evidence; two are in regulated domains (pharma DSCSA, patient safety); editorial policy discloses LLM drafting. If these are composites, they are presented as real deployments — exactly what the brief forbids. | Per-case evidence request; otherwise relabel as illustrative worked examples (with the pillar rewritten) or remove |
| K-05 | "8+ certified patents" | Zero patent numbers on a site that invites verification | Numbers or removal |
| K-07 | "10 % of annual profits into R&D" | Unprovable financial claim | Remove |
| R-01…R-05 | Regulatory statements (DSCSA, ESPR/DPP timelines, ISBT 128 "FDA requires", Walmart mandate specifics, AHRQ/AORN figures) | Regulatory advice to buyers must be tied to the official text; several are forecasts or paraphrases presented as requirements | Sentence-level citations to EUR-Lex/FDA/AABB/AORN/Walmart public docs; LEGAL_REVIEW; qualify forecasts |

## 4. Consistency defects found while extracting (same fact, different numbers)

| Fact | Values found | Surfaces |
| --- | --- | --- |
| Years in business | 18+ (home, about) · 17+ (llms.txt, ORGANIZATION_CREDENTIALS) · 15 (proudrfid, YouTube) | fix by computing from 2008 |
| Clients | 500+ (site) · 400+ (YouTube, proudrfid) · 1,000+ (rfidak) · "more than 500" (protekrfid) | one figure with basis |
| MOQ | 500-piece MOQ (188 pages) · 100 pcs stock / 200–1,000 custom (COMMERCIAL_TERMS, every product) · 1,000–5,000 (About) · 500/1,000/5,000/10,000 (product briefs) · llms.txt per-family table | one MOQ table |
| Response time | one business day (≥500 pages) · 24 hours (FAQ) · 6 hours (Made-in-China) · 2–4 hours (rfidak) | one measured SLA |
| MIFARE Classic launch | 1997 (Classic 1K brief) · 1994 (same page highlight; NXP) | 1994 |
| Legal name | Proud Tek Co., Limited (JSON-LD) · Shenzhen Proud Tek Co., Ltd (certificate EN, MIC, rfidak) · 深圳市奥科物联有限公司 (certificate CN) | registration extract |
| Certification issuer | SGS (llms.txt, ORGANIZATION_CREDENTIALS) · CAIC (certificate, certifications page) | CAIC |
| Author attribution | Peter Zhang / Nancy Wu (HTML, JSON-LD) · "Proud Tek Co., Limited" (machine mirrors) · "Proud Tek Editorial Team" (llms.txt guidance) | one rule |

## 5. Case-study authenticity report (E)

| Case | Named customer? | Anonymous real? | Composite? | Illustrative? | Permission on file? | Measurement records | Sample size | Baseline | Method | Period | Hardware/tag config | Numbers reproducible? | Disclaimer required? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CS-01 hotel 28 properties | No ("withheld under NDA") | Unknown | Unknown | Not labelled | None in repo | None | not stated | magstripe cost baseline implied | not stated | 18 months / FY | MIFARE Classic 1K; DESFire EV3 migration mentioned | No | Yes, unless evidence supplied |
| CS-02 laundry PPS | No | Unknown | Unknown | Not labelled | None | None | not stated (methodology page promises n ≥ 30 for durability numbers) | not stated | "ISO 6330"-style cycles implied by methodology page, not stated in case | 18 months | UCODE 8 PPS tag | No | Yes |
| CS-03 library 47 branches | No | Unknown | Unknown | Not labelled | None | None | — | legacy proprietary chip | — | 24 months | ICODE SLIX2 | No | Yes |
| CS-04 festival 180k | No ("NDA") | Unknown | Unknown | Not labelled | None | None | — | — | — | 4 days | UCODE 9 wristbands | No | Yes |
| CS-05 pharma 380 M/yr DSCSA | No ("NDA") | Unknown | Unknown | Not labelled | None | None | — | — | — | — | UCODE 9 labels | No | **Yes — regulated domain; legal review** |
| CS-06 restaurant 412 stores 3.1× | No | Unknown | Unknown | Not labelled | None | None ("control" mentioned, not described) | 412 stores | 14 reviews/store/month | A/B implied | 90 days | NTAG213 cards | No | Yes |
| CS-07 apparel 11 M tags | No | Unknown | Unknown | Not labelled | None | None | 340 stores | 67 % accuracy | — | 24 months | Monza R6-P hangtags | No | Yes |
| CS-08 3PL 99.2 % | No | Unknown | Unknown | Not labelled (blog "Customer story") | None | None; 18 dollar figures | — | 87 % | — | 24 weeks | — | No | Yes |
| CS-09 Walmart mandate 99.2 % | No ("NDA") | Unknown | Unknown | Not labelled | None | None | 1,200 units audit | 95 % threshold (Walmart) | Walmart RDC audit (asserted) | 14 weeks | SGTIN-96 hangtag 73×23 mm | No | Yes + Walmart policy citation |
| CS-10 boutique hotel 41 % | No | Unknown | Unknown | Not labelled | None | None | 78 rooms | magstripe costs | — | 11 weeks | MIFARE Classic 1K | No | Yes |
| CS-11 hospital zero RSS | No ("NDA") | Unknown | Unknown | Partly ("modelled against ~$166K … PA Patient Safety Authority via STERIS 2023") | None | None | 14 ORs + 2 trauma bays | 2 RSS events/yr | — | 9 + 18 months | RFID sponges | No | **Yes — patient-safety claim; legal review** |
| CS-12 restaurant group +320 % | No | Unknown | Unknown | Not labelled | None | None | 6 locations | weekly reviews | — | 90 days | NFC cards | No | Yes |
| Pillar /case-studies/ | — | — | — | — | Asserts permission and "measured" results | — | — | — | — | — | — | — | Rewrite pending evidence |

Rule applied: no case may remain presented as a real deployment without (a) permission record, (b) original measurement data or a reproducible calculation, and (c) disclosed configuration. Where the owner confirms a case is illustrative, the honest and still-useful form is a **worked example** with stated assumptions ("A 78-room hotel replacing magstripe at $X/card and Y re-encodes/month would save …" = DERIVED_CALCULATION), not a "customer story".

## 6. Required owner evidence (feeds report section N)

1. Business registration extract (name, USCC 91440300MA5FBLMP1Y, establishment date).
2. Factory evidence: lease/ownership, plant entity licence, equipment register, or third-party factory audit report — or a written decision to adopt the "partner lines, in-house spec and QC" formulation.
3. Patent numbers (CNIPA) and holder.
4. OEKO-TEX certificate (holder, product class, validity, Label Check link); TÜV/SGS/Intertek test report numbers for RoHS/REACH; FCC IDs / CE DoCs for reader SKUs.
5. Client/country counts with basis; headcount range.
6. MOQ policy, lead-time records (12 months), dated indicative price list per family, sample-request log, helpdesk response-time export.
7. Per case study: permission, source data, config, period, contact for reference.
8. Author/reviewer identities and public profiles; agreed attribution wording.
9. FSC chain-of-custody code; LCA source for carbon figures.
10. Legal review of regulatory sentences (DSCSA, ESPR/DPP, ISBT 128/FDA, Walmart, AHRQ/AORN, HIPAA).

## 7. Interpretation
The site's *editorial scaffolding* for evidence (methodology page, certifications page with numbers and scope, sources arrays, corrections log, LLM-assistance disclosure) is unusually good for a B2B manufacturer. The *content* has not caught up with it: the certificates page is honest while 446 pages of boilerplate say "Certified Factory"; the methodology page promises disclosed test conditions while product figures carry none; the case-study pillar promises permission and measurement while nothing is on file. Closing that gap — not adding more claims — is the highest-value GEO work available.
