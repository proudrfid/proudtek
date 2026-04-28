# Batch 19 — rfid-tags industrial / container-tracking

**Date:** 2026-04-23
**Cluster:** `rfid-tags`
**SKUs refined:** 6
**Cluster progress after batch:** **12 / 70 (17 %)** (Batches 5 + 6 priors + Batch 19)

## Scope

Batch 19 opens the rfid-tags cluster refinement. We selected six cohesive industrial / supply-chain container-tracking SKUs that cluster naturally around hazmat / bolt-seal / high-temperature processing use cases:

- `rfid-bolt-seal` — ISO/PAS 17712:2013 high-security bolt seals for WCO SAFE / C-TPAT / EU AEO + GS1 GIAI-96 + EPCIS 2.0 port/TMS integration (Navis N4, MercuryGate, E2open, Blue Yonder, Oracle TMS).
- `rfid-tamper-seal-tag` — OTP-flag tamper seals with EPCIS 2.0 ObjectEvent `bizStep='inspecting'` + sealStatus CBV for EU GDP, DSCSA §582, C-TPAT and CJIS chain-of-custody compliance.
- `rfid-returnable-container-tag` — GRAI-96 RTI tracking for CHEP IntelliTrack, IFCO SmartFlow, Tosca pool platforms + Auburn ARC Categories G/M + ISO/IEC 17363:2007 + ASTM D4169 drop/vibration.
- `rfid-ibc-chemical-drum-tag` — UN / DOT 49 CFR / ADR 2025 / IMDG / ICAO TI hazmat container tracking with ATEX Zone 1/2 + 21/22 + GIAI-96/GRAI-96 + SAP EWM / Oracle SCM / Datacor Chempax integration.
- `rfid-gas-cylinder-tag` — DOT 49 CFR §180.205 + EU TPED + ADR 6.2 + CGA G-1.6 cylinder requalification tracking with GIAI-96 + TrackAbout / VERTIGAS / SAP for Gases integration.
- `rfid-high-temperature-ceramic-tag` — LTCC 800 °C survivable tags for FAA AC 20-62E + EASA Part-145 + AMS 2759 + AMS 2750 pyrometry + NADCAP AC7102 with OPC UA furnace-log binding on Honeywell Maxum / Eurotherm nanodac / Super Systems DP8860 controllers.

## Treatment (uniform across all 6 SKUs)

1. **Legacy `/product/...` imageSourceRoutes** → migrated to intra-cluster `/products/rfid-tags/<slug>/` neighbors. (rfid-bolt-seal also had legacy `/product/` resourceCards entries and one broken slug `rfid-tamper-evident-seal` → corrected to `rfid-tamper-seal-tag`.)
2. **FAQ 3 → 5** — appended one platform/integration Q&A + one regulatory/standards Q&A per SKU.
3. **Sources 0 → 8** — schema-valid label/url/publisher triples per SKU.
4. **Dates** — added `publishedAt: "2026-04-22"` + `modifiedAt: "2026-04-23"` + bumped `reviewedAt` to `"2026-04-23"`.
5. **primaryAction** — migrated `/contact/` → `/contact/rfid-labels-tags/`.
6. **secondaryActions** — broken-slug fix on rfid-bolt-seal (`rfid-tamper-evident-seal` → `rfid-tamper-seal-tag`).

## Regulatory / platform anchors

| SKU | Anchor |
| --- | --- |
| rfid-bolt-seal | ISO/PAS 17712:2013 + WCO SAFE + C-TPAT + EU AEO (UCC Article 38) + GS1 GIAI-96 + EPCIS 2.0 + Navis N4 / Kaleris + MercuryGate / E2open / Blue Yonder / Oracle TMS |
| rfid-tamper-seal-tag | ISO 17712 H/S + OTP-flag EPC Gen2v2 Select + EPCIS 2.0 sealStatus CBV + EU GDP 2013/C 343/01 §9.2 + DSCSA §582 + C-TPAT 19 CFR §149 + CJIS §5.12 + Impinj Monza R6 + NXP UCODE 8m tamper-alarm |
| rfid-returnable-container-tag | GS1 GRAI-96 + EPCIS 2.0 + ISO/IEC 17363:2007 + Auburn ARC Cat G/M + CHEP IntelliTrack + IFCO SmartFlow + Tosca + SAP IBP-SC + Blue Yonder + ASTM D4169 DC-13 |
| rfid-ibc-chemical-drum-tag | UN Model Regs Rev.22 + DOT 49 CFR 171-180 + ADR 2025 + IMDG 2024 + ICAO TI 2025 + OSHA HCS 29 CFR §1910.1200 + ATEX 2014/34/EU + IECEx + REACH + CLP + EPCIS 2.0 + SAP EWM + Datacor Chempax + Schütz TICKET |
| rfid-gas-cylinder-tag | DOT 49 CFR §180.205 + EU TPED 2010/35/EU + ADR 6.2 + CGA G-1.6 + FDA 21 CFR §211 + ATEX 2014/34/EU + GS1 GIAI-96 + EPCIS 2.0 + TrackAbout + VERTIGAS + SAP for Gases |
| rfid-high-temperature-ceramic-tag | FAA AC 20-62E + EASA Part-145 + AMS 2759 + AMS 2750 pyrometry + NADCAP AC7102 + ATA Spec 2000 Ch. 9-5 + ISO/IEC 18000-63 + NXP UCODE 8m + Siemens Opcenter + Rockwell FactoryTalk + Honeywell Maxum + Eurotherm nanodac + OPC UA |

## Verification

- `npx astro sync` — clean, 866 ms, zero schema errors.
- `grep '"/product/'` across all 6 Batch 19 SKUs — **0 matches**. Legacy-route-free.
- Counts (Batch 19):
  - `rfid-bolt-seal`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `rfid-tamper-seal-tag`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `rfid-returnable-container-tag`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `rfid-ibc-chemical-drum-tag`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `rfid-gas-cylinder-tag`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `rfid-high-temperature-ceramic-tag`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/

## Narrative observations

Batch 19 surfaces the rfid-tags cluster's core strategic differentiator vs. the rfid-labels cluster we just closed: where rfid-labels is dominated by form-factor and chip-level SKUs (inlays, stickers, authentication labels), rfid-tags concentrates on ruggedized / vertical / environmental-specialty SKUs whose buying decision pivots on regulatory certification (ISO 17712, ATEX/IECEx, NADCAP AC7102, DOT 49 CFR, TPED) and mechanical integration (rivets, hose clamps, ceramic cement, welded brackets). The editorial voice for rfid-tags should therefore lean heavier on:

1. **Certification citations** — every industrial-specialty tag has a dominant regulatory framework (DOT / TPED / ATEX / AMS / NADCAP / ISO 17712) that its specification sheet must reference.
2. **Mounting & retrofit guidance** — rfid-tags buyers retrofit existing asset fleets; mounting matrix tables and mechanical-integration FAQs carry more weight than for rfid-labels.
3. **MES / OPC UA / TOS integration depth** — the target personas (fill-plant ops, heat-treat supervisors, port terminal IT) integrate at the MES / SCADA / TOS / TMS layer rather than the WMS / ERP layer typical for rfid-labels.

Future Batch 20-22 targets: rfid-pallet-tag / rfid-anti-metal-tag (high-traffic commodity), rfid-tire-tag / rfid-vehicle-windshield-tag / rfid-cable-tie-tag (automotive + logistics), rfid-animal-ear-tag + rfid-library-book-tag + rfid-jewelry-tag (already partially refined via Batch 5).

## Next cluster candidates (continued)

64 rfid-tags SKUs remaining. Priority next batch candidates:
- High-traffic commodity: rfid-pallet-tag, rfid-anti-metal-tag (already refined), rfid-cable-tie-tag, rfid-zip-tie-tag, rfid-uhf-on-metal-tag
- Automotive / logistics: rfid-tire-tag, rfid-vehicle-windshield-tag, rfid-fleet-vehicle-tag, rfid-cargo-pallet-tag
- Authentication: rfid-laundry-tag (already refined), rfid-textile-laundry-tag (already refined via Batch 5), rfid-silicone-laundry-tag, rfid-wash-care-label
- Living assets: rfid-animal-ear-tag (already refined via Batch 5), rfid-pet-collar-tag, rfid-tree-tag
- Library / retail: rfid-library-book-tag (already refined via Batch 5), rfid-jewelry-tag (already refined via Batch 5), rfid-eyewear-tag, rfid-optical-frame-tag
