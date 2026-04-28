# Pillar hygiene sweep — 4 remaining product pillars

Follow-on to the `rfid-wristbands/_pillar.json` review documented in `reports/batch-6c-rfid-wristbands-skus/08-post-batch-cleanup.md`. In this session the same Batch 6 claim-hygiene checklist was applied to the four remaining product pillars. All edits landed in a single session and content-collection schema validation (`astro sync`) passes after each pillar.

## Checklist applied to every pillar

1. **SKU count** — `N+` hero-point phrasing replaced with the exact current count (by `ls src/content/editorial/products/<group>/*.json` minus `_pillar.json`).
2. **Unverified aggregate figures** — softened to the literature-attribution pattern (e.g. "Industry trackers (… RAIN RFID Alliance …) report …" instead of bare "tens of billions per year").
3. **Absolute-dollar figures** — replaced with cost-tier markers (`$` entry / `$$` mid / `$$$` premium) where present.
4. **Broken `primaryAction.href: /contact/`** — replaced with the highest-volume valid contact sub-route for that cluster.
5. **`sources[]` EEAT backfill** — added an array of external, third-party standards and regulator URLs covering every ISO, GS1, IEC, ETSI, FCC, EU regulation, NFC Forum spec, NIST FIPS and vendor security advisory referenced in the pillar body.
6. **Dates** — `modifiedAt` + `reviewedAt` bumped to `2026-04-23` to reflect this review.

## Per-pillar summary

### `rfid-cards/_pillar.json` — task #90

- SKU count: `29+ RFID card SKUs` → `29 RFID card SKUs`
- Narrative: "one of the most widely manufactured objects on earth" → attributed to "annual global shipments are tracked alongside payment and identity cards by Smart Payment Association and Eurosmart market reports"
- primaryAction: `/contact/` → `/contact/custom-rfid-cards/`
- sources[]: 12 entries covering ISO/IEC 7810, 14443, 15693-3, 7816-4, 18000-63; ICAO 9303 Part 10; NIST FIPS 201-3; EMVCo; GS1 EPC TDS 2.0; NXP AN10922; NXP CRYPTO-1 advisory; NFC Forum.

### `rfid-tags/_pillar.json` — task #91

- SKU count: `70+` → `70 industrial tag SKUs`
- Cost claim: "per-unit cost below USD 0.30 in volume" → "volume-tier unit cost (cost tier $, entry-tier disposable to $ mid-tier ruggedised …)"
- primaryAction: `/contact/` → `/contact/rfid-labels-tags/`
- sources[]: 12 entries covering ISO/IEC 18000-63, 18000-3; ISO 11784/11785; ISO 17712; ATA Spec 2000; ISO 28560-2; GS1 EPC TDS 2.0; EU Regulation 2024/1257 (tyre regulation); ATEX Directive 2014/34/EU; IEC 60529; FCC 15.247; ETSI EN 302 208.

### `rfid-labels/_pillar.json` — task #92

- SKU count: `56+ RFID label, inlay and smart-label SKUs` → `58 RFID label, inlay and smart-label SKUs`
- Narrative: "tens of billions of units per year" attributed to "RAIN RFID Alliance membership reports, IDTechEx annual RFID forecasts and GS1 Digital Link adoption surveys"
- Retail-apparel claim: "Uniqlo, Decathlon, Macy's, Inditex and Lululemon run 95%+ item-level UHF tagging" softened to "have all publicly disclosed RFID programmes per their annual reports and Auburn University RFID Lab case studies … at near-catalogue coverage"
- primaryAction: `/contact/` → `/contact/rfid-labels-tags/`
- sources[]: 14 entries covering ISO/IEC 18000-63; EPCglobal Gen2 v3; ISO/IEC 14443-3, 15693-3; GS1 EPC TDS 2.0; NFC Forum Type 2; FCC 15.247; ETSI EN 302 208; ISO/IEC 19762; IATA Resolution 753; ISO 28560-2; EU ESPR 2024/1781; EU Battery Regulation 2023/1542; ISO/IEC 18046-3.

### `rfid-keyfobs/_pillar.json` — task #93

- SKU count: `14+` → `14 RFID keyfob, NFC key tag and coin-tag SKUs`
- No absolute-dollar figures in body (already compliant).
- primaryAction: `/contact/` → `/contact/access-control-keyfobs/`
- sources[]: 15 entries covering ISO/IEC 18000-2; ISO/IEC 14443-3, 15693-3, 18000-63, 7816-4; NFC Forum Type 2/4; NIST FIPS 201-3; IEC 60529; IEC 60068-2-31; FCC 15.247; ETSI EN 302 208; NXP AN10922; NXP CRYPTO-1 advisory; EU RoHS 3 (2015/863); REACH (EC 1907/2006).

## State after sweep

| Pillar            | SKU count | `sources[]` | primaryAction                       | modifiedAt  |
|-------------------|-----------|-------------|-------------------------------------|-------------|
| rfid-wristbands   | 18        | 10          | `/contact/event-rfid/`              | 2026-04-23  |
| rfid-cards        | 29        | 12          | `/contact/custom-rfid-cards/`       | 2026-04-23  |
| rfid-tags         | 70        | 12          | `/contact/rfid-labels-tags/`        | 2026-04-23  |
| rfid-labels       | 58        | 14          | `/contact/rfid-labels-tags/`        | 2026-04-23  |
| rfid-keyfobs      | 14        | 15          | `/contact/access-control-keyfobs/`  | 2026-04-23  |

All 5 product pillars now carry `sources[]` at EEAT parity with the refined SKU pages underneath them. No `/contact/` bare references remain on any pillar `primaryAction`. Content-collection schema validation passes in ~800 ms on each pillar edit.
