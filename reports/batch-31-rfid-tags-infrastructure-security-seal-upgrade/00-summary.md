# Batch 31 — RFID Tags · Industrial-Infrastructure / Security-Seal SHALLOW → DEEP Upgrade

**Cluster:** rfid-tags industrial-infrastructure + hazmat + customs-security cluster (6 SKUs)
**Scope:** Six SHALLOW rfid-tags product pages upgraded to the full DEEP framework
**Date closed:** 2026-04-24
**Workflow:** Per-page Read → Write → `npx astro sync` → TaskUpdate, then per-batch verify (sync + inbound-ref ≥ 4 + orphan scan + DEEP audit + Blocker C phrase scan).

## Pages shipped

| # | Slug | Regulatory anchor profile | Sync | Inbound |
|---|------|---------------------------|------|---------|
| 1 | rfid-flag-tag | API 5L + ASTM A615 + ASTM A6 + AWS D1.1 + AISC 360 + NACE MR0175 + API Q1 + GS1 EPC Gen2v2 + ISO 18000-63 + ASME B36.10 | 905 ms | 9 |
| 2 | rfid-drum-tag | 49 CFR 173 + OSHA 1910.106 + OSHA 1910.1200 HazCom + EPA RCRA 40 CFR 262 + IMDG + ADR + ATEX 2014/34/EU + IEC 60079-11 + UN Model Regs + RIPA | 968 ms | 7 |
| 3 | rfid-concrete-embed-tag | ACI 318 + ACI 301 + PCI MNL-116 + EN 13369 + AASHTO LRFD + ASTM C666 + FHWA NBI 23 CFR 650 + ISO 19650 + COBie 2.4 + ACI 562 | 896 ms | 11 |
| 4 | rfid-cable-seal-tag | ISO 17712 + ISO 18185 + C-TPAT + WCO SAFE + EU AEO + CBSA PIP + ABF ATT + GS1 EPC Gen2v2 + ISO 668 + CBP ACE | 970 ms | 10 |
| 5 | rfid-mining-asset-tag | MSHA 30 CFR Part 18 + Part 23 + Part 75 + ATEX Group I (M1/M2) + IEC 60079-11 + IEC 60079-0 + AS/NZS 60079 + CSA C22.2 No. 157 + ICMM CCM + ISO 17757 | 895 ms | 6 |
| 6 | rfid-pallet-runner-tag | ANSI MH1 + ISO 6780 + ISO 8611-1 + GS1 SSCC + GS1 EPC Gen2v2 + FSMA 204 (21 CFR 1 Subpart S) + EPAL + CHEP + EUDR (EU 2023/1115) + GS1 EPCIS 2.0 | 905 ms | 5 |

Final batch `npx astro sync`: **659 ms clean**.

## DEEP framework compliance matrix

| Slug | kw=6 | brief≥11 | sources≥8 | statBar | comparePanel | dataHighlight | timeline | Blocker C |
|------|:----:|:--------:|:---------:|:-------:|:------------:|:-------------:|:--------:|:---------:|
| rfid-flag-tag | 6 | 12 | 10 | ✓ | ✓ | ✓ | ✓ | ✓ |
| rfid-drum-tag | 6 | 12 | 10 | ✓ | ✓ | ✓ | ✓ | ✓ |
| rfid-concrete-embed-tag | 6 | 12 | 10 | ✓ | ✓ | ✓ | ✓ | ✓ |
| rfid-cable-seal-tag | 6 | 11 | 10 | ✓ | ✓ | ✓ | ✓ | ✓ |
| rfid-mining-asset-tag | 6 | 11 | 10 | ✓ | ✓ | ✓ | ✓ | ✓ |
| rfid-pallet-runner-tag | 6 | 11 | 10 | ✓ | ✓ | ✓ | ✓ | ✓ |

## Distinguishing regulatory profiles — no overlap

- **flag** — steel-mill product-standard stack (API 5L pipe, ASTM A615 rebar, ASTM A6 structural shapes, AISC 360 erection, NACE MR0175 sour service). Protruding-antenna geometry with 25–40 mm metal stand-off to escape detuning on mill-to-fab conveyance.
- **drum** — hazmat packaging + occupational-safety stack (49 CFR 173 UN 1A1/1A2/1H1, OSHA 1910.106 flammable liquids, EPA RCRA 40 CFR 262 generator tracking, IMDG / ADR multimodal, ATEX Zone 1 / IEC 60079-11 intrinsic safety). Solvent-resistant housings (epoxy, 316L, PTFE, GF nylon) for chemical exposure + 30 kHz vibration of forklift handling.
- **concrete-embed** — structural-concrete code stack (ACI 318 design, ACI 301 placement, PCI MNL-116 precast QC, AASHTO LRFD bridges, ASTM C666 freeze-thaw, FHWA NBI 23 CFR 650 inspection, ISO 19650 / COBie 2.4 BIM handover). Alkaline-resistant housing (pH 12–13) cast-in with UHF read-through 5–10 cm concrete cover.
- **cable-seal** — trade-security stack (ISO 17712 freight-container seal Indicative / High-Security, ISO 18185 e-Seal 6-frame data, C-TPAT / WCO SAFE / EU AEO / CBSA PIP / ABF ATT trusted-trader tiers, CBP ACE customs filing). Factory-locked TID unclonable seal; mechanical break + cryptographic event log ties to customs single-window.
- **mining** — underground-permissibility stack (MSHA 30 CFR Part 18 methane-air, Part 23 trolley-wire, Part 75 coal-mine ventilation; ATEX Group I M1 / M2 mining; IEC 60079-11 ia intrinsic safety; AS/NZS 60079; CSA C22.2 No. 157; ICMM CCM autonomy; ISO 17757 LHD). Housing and chip-power budget sized below 0.28 mJ methane MIE.
- **pallet-runner** — pallet-pool + food-traceability stack (ANSI MH1 / ISO 6780 GMA-style runner pallet, ISO 8611 load test, GS1 SSCC-96 + EPCIS 2.0 events, FSMA 204 KDE / CTE for FTL foods, EPAL / CHEP pool operators, EUDR commodity due diligence). Runner-cavity embed survives 50–100+ trip cycles + 80 °C caustic wash + 1,000 kg stack load.

## Verification summary

- `npx astro sync` — clean across all six writes + final batch sync (659 ms).
- Inbound references — minimum 5 (rfid-pallet-runner-tag), maximum 11 (rfid-concrete-embed-tag); all ≥ 4 threshold.
- Orphan scan — zero orphan pages introduced.
- DEEP audit — all six pages carry keywords[6] + brief[≥11] objects + sources[10] five-field + all four DEEP section blocks (statBar, comparePanel, dataHighlight, timeline) + Blocker C de-identification phrase.
- Schema — all six pages validate against `src/content/editorial/products/rfid-tags/*.json` Zod collection.

## Files

- `src/content/editorial/products/rfid-tags/rfid-flag-tag.json`
- `src/content/editorial/products/rfid-tags/rfid-drum-tag.json`
- `src/content/editorial/products/rfid-tags/rfid-concrete-embed-tag.json`
- `src/content/editorial/products/rfid-tags/rfid-cable-seal-tag.json`
- `src/content/editorial/products/rfid-tags/rfid-mining-asset-tag.json`
- `src/content/editorial/products/rfid-tags/rfid-pallet-runner-tag.json`
