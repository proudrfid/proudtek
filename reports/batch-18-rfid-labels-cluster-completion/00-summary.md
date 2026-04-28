# Batch 18 — rfid-labels cluster completion

**Date:** 2026-04-23
**Cluster:** `rfid-labels`
**SKUs refined:** 4
**Cluster progress after batch:** **58 / 58 (100 %) — CLUSTER COMPLETE**

## Scope

Batch 18 closes out the rfid-labels cluster at 58/58. Four remaining SKUs spanning chip-level inlay, NFC engagement hardware, records-management tracking and retail-mandate compliance:

- `impinj-m750-uhf-inlay` — Monza R6-P chip-level SKU with cryptographic Authenticate + Untraceable + 32-bit User memory for brand-protection and EU Digital Product Passport deployments.
- `nfc-table-stand` — point-of-service NFC hardware for restaurant menus, hotel Wi-Fi, retail social-media tap and Google review acquisition.
- `rfid-document-tracking-label` — HF/UHF labels for legal, healthcare, financial and government records rooms; DMS integration (iManage, NetDocuments, Laserfiche, SharePoint) under HIPAA / FRCP / SEC 17a-4 / NARA.
- `rfid-garment-source-tag` — factory-applied SGTIN-96 tags for Walmart / Target / Macy's / Nordstrom / Nike / Inditex retail mandates, with EPCIS 2.0 + EDI 856 ASN + GS1 Digital Link Sunrise 2027 alignment.

## Treatment (uniform across all 4 SKUs)

1. **Legacy `/product/...` imageSourceRoutes + resourceCards + secondaryActions** → migrated to intra-cluster `/products/rfid-labels/<slug>/` neighbors.
2. **FAQ 3 → 5** — appended one platform/standards Q&A + one regulatory/integration Q&A per SKU (except `impinj-m750-uhf-inlay` already at 6).
3. **Sources 0 → 8** — schema-valid label/url/publisher triples per SKU.
4. **Dates** — added `publishedAt: "2026-04-22"` + `modifiedAt: "2026-04-23"` + bumped `reviewedAt` to `"2026-04-23"`.
5. **primaryAction** — migrated `/contact/` → `/contact/rfid-labels-tags/`.

## Regulatory / platform anchors

| SKU | Anchor |
| --- | --- |
| impinj-m750-uhf-inlay | Monza R6-P + EPC Gen2v2 Authenticate/Untraceable + GS1 Crypto Suite 3 AES-128 + Impinj Authenticity cloud + EU 2024/1781 DPP |
| nfc-table-stand | NFC Forum NDEF URI RTD + Apple Core NFC iOS 14+ + Android NFC CTS + Google Business Profile review URL (g.page/r/ + search.google.com/local/writereview) |
| rfid-document-tracking-label | HIPAA 45 CFR §164.310 + FRCP Rule 26/37(e) ESI + SEC Rule 17a-4(f) + FINRA 4511 + NARA 36 CFR Part 1236 + iManage/NetDocuments/Laserfiche/OpenText DMS |
| rfid-garment-source-tag | Auburn ARC Categories F/H/M + Walmart/Target/Macy's/Nordstrom/Nike/Inditex mandates + EDI 856 ASN + EPCIS 2.0 (ISO/IEC 19987:2015) + GS1 Digital Link Sunrise 2027 |

## Verification

- `npx astro sync` — clean, 824 ms, zero schema errors.
- `grep -l '"/product/'` across **all 58 rfid-labels SKUs** — **0 matches**. Cluster is legacy-route-free.
- Counts (Batch 18):
  - `impinj-m750-uhf-inlay`: sec=3, faq=6, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `nfc-table-stand`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `rfid-document-tracking-label`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `rfid-garment-source-tag`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/

## Cluster-completion thematic synthesis

The rfid-labels cluster is now 58 / 58 refined across 18 batches spanning roughly 6 weeks of editorial work. The cluster is organized around five narrative axes that emerged as refinement progressed:

1. **Chipset axis** — from commodity NTAG213/215/216 and ICODE SLIX2 at HF, through Impinj M700/M730/M750/M800 + NXP UCODE 8/9 + Alien Higgs-9 at UHF, to specialty cryptographic chips (NTAG424 DNA SUN + Monza R6-P Authenticate + UCODE DNA). Every chip-level SKU is now internally cross-linked to its finished-product applications and its peer chips for comparison.
2. **Form-factor axis** — inlay (wet/dry) → component label (paper, blank) → vertical specialty label (pharma, blood bag, specimen slide, cryogenic, plant-nursery, tire, windshield, warranty seal, battery passport). Every form factor links to its upstream inlay SKU and its downstream vertical applications.
3. **Standards axis** — GS1 TDS 2.0 SGTIN-96, EPC Gen2v2, ISO/IEC 18000-63, ISO/IEC 14443 + 15693, NFC Forum NDEF + Type 2 / Type 4, EPCIS 2.0 (ISO/IEC 19987:2015), GS1 Digital Link Sunrise 2027, Auburn ARC test categories. Every SKU now cites the applicable air-interface and data-model standard in its sources array.
4. **Regulatory axis** — CAP/CLIA/Joint Commission for pathology, DSCSA + EU FMD + GDPR for pharma, HIPAA for healthcare, FRCP + SEC 17a-4 for records, DPP + battery passport for EU sustainability, Walmart/Target/Macy's/Nordstrom/Nike/Inditex mandates for retail, APHIS + ISPM 15 + EPPO for nursery, FSMA 204 + EUDR for cold-chain, EMVCo + PSD2 + PCI DSS for payments, Nintendo Amiibo + Disney Infinity for collectibles. Every vertical-focus SKU pivots on a dense regulatory/platform framework now documented in the FAQ + sources layer.
5. **Integration axis** — Zebra/Impinj/SATO/Printronix/TSC printers, NiceLabel/BarTender/Loftware/CODESOFT software, SES-imagotag/Pricer/Hanshow ESL platforms, SmartCosmos/Authena/Identiv brand-auth backends, iManage/NetDocuments/Laserfiche/OpenText/SharePoint DMS platforms, SES-imagotag Vusion/Pricer Plaza/Hanshow Nebular shelf platforms. Every deployment-layer SKU now cites the integration landscape its buyers actually procure against.

## Cluster hygiene pass-rate

| Metric | Before Batch 1 | After Batch 18 |
| --- | --- | --- |
| Legacy `/product/` routes | 100+ | 0 |
| SKUs with `publishedAt` + `modifiedAt` | ~8 | 58 |
| SKUs with 5 FAQs | ~12 | 58 |
| SKUs with 8-entry sources | 0 | 58 |
| SKUs with `/contact/rfid-labels-tags/` primaryAction | 0 | 58 |
| SKUs with `reviewedAt >= 2026-04-22` | 0 | 58 |

## Next cluster candidates

The rfid-labels cluster is now the deepest and most hygiene-complete cluster in the editorial tree. Next refinement targets (by SKU count and commercial priority):

- **`rfid-tags` cluster** — already partially refined (Batches 5-6b), remaining SKUs need Batch 18-style hygiene + sources pass.
- **`rfid-cards` cluster** — partially refined (Batch 1), remaining SKUs need hygiene + sources.
- **`rfid-wristbands` cluster** — largely refined (Batches 6-6c), needs sources + dates consistency pass.
- **`rfid-keyfobs` cluster** — largely refined (Batches 7-8), needs sources + dates consistency pass.
- **`solutions/` cluster** — partially refined (Batch 4), remaining need hygiene + sources.
- **`industries/` cluster** — partially refined (Batch 2), remaining need hygiene + sources.
- **`compare/` cluster** — partially refined (Batch 3), needs sources + dates consistency pass.
