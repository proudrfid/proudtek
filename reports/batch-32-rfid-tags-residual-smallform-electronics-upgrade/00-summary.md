# Batch 32 — RFID Tags · Residual Small-Form + Retail + Electronics SHALLOW → DEEP Upgrade (Tree Closeout)

**Cluster:** rfid-tags residual small-form / retail / electronics cluster (5 SKUs)
**Scope:** Final 5 SHALLOW rfid-tags product pages upgraded to the full DEEP framework — closes the entire rfid-tags tree at zero SHALLOW remaining.
**Date closed:** 2026-04-24
**Workflow:** Per-page Read → Write → `npx astro sync` → TaskUpdate, then per-batch verify (sync + inbound-ref ≥ 4 + orphan scan + DEEP audit + Blocker C phrase).

## Pages shipped

| # | Slug | Regulatory anchor profile | Sync | Inbound |
|---|------|---------------------------|------|---------|
| 1 | rfid-coin-tag | ISO 14443 + ISO 15693 + GS1 EPC Gen2v2 + FCC Part 15 + RED 2014/53/EU + SAE AIR5562 + ISO 17025 + PCI PTS + GDPR Art. 13 + EPCIS 2.0 | 930 ms | 15 |
| 2 | rfid-eyelet-tag | ISO 6330 + AATCC 135 + ISO 13934-1 + DIN 53351 + ISO 9227 + GS1 EPC Gen2v2 + EPCIS 2.0 + CDC G.VII + TRSA HCH + ZDHC MRSL | 929 ms | 5 |
| 3 | rfid-hang-tag | GS1 EPC Gen2v2 + GS1 TDS 2.0 + EPCIS 2.0 + RAIN RFID Alliance CoC + ARTS + FCC Part 15 + RED 2014/53/EU + 16 CFR 303 + EU 2023/988 GPSR + Auburn RFID Lab | 944 ms | 7 |
| 4 | rfid-pcb-tag | IPC-A-610 + IPC J-STD-001 + IPC-4101 + Rogers RO4350B + ISO/IEC 19770-1 + NIST SP 800-53 CM-8 + CIS v8 + PCI DSS v4.0 Req. 9 + GS1 Gen2v2 + EPCIS 2.0 | 872 ms | 6 |
| 5 | rfid-pcb-screw-mount-tag | IPC-A-610 + IPC-2221 + ISO 4762 + ISO 2380 + IEC 60068-2-6 + MIL-STD-810G + NEBS GR-63-CORE + ISO/IEC 19770-1 + NIST SP 800-53 + GS1 Gen2v2 | 1.02 s | 18 |

Final batch `npx astro sync`: **628 ms clean**.

## DEEP framework compliance matrix

| Slug | kw=6 | brief≥11 | sources≥8 | statBar | comparePanel | dataHighlight | timeline | Blocker C |
|------|:----:|:--------:|:---------:|:-------:|:------------:|:-------------:|:--------:|:---------:|
| rfid-coin-tag | 6 | 11 | 10 | ✓ | ✓ | ✓ | ✓ | ✓ |
| rfid-eyelet-tag | 6 | 11 | 10 | ✓ | ✓ | ✓ | ✓ | ✓ |
| rfid-hang-tag | 6 | 11 | 10 | ✓ | ✓ | ✓ | ✓ | ✓ |
| rfid-pcb-tag | 6 | 11 | 10 | ✓ | ✓ | ✓ | ✓ | ✓ |
| rfid-pcb-screw-mount-tag | 6 | 11 | 10 | ✓ | ✓ | ✓ | ✓ | ✓ |

## Distinguishing regulatory profiles — no overlap

- **coin** — small-form consumer / tool token stack. ISO 14443 + ISO 15693 for HF, GS1 Gen2v2 for UHF; SAE AIR5562 FOD programmes + ISO 17025 calibration-controlled tool-crib; PCI PTS domain separation for cashless leisure wallets. 10-30 mm IP68 disc, unique to tool / token / product-authentication.
- **eyelet** — textile + soft-goods grommet-mount stack. ISO 6330 wash / AATCC 135 shrinkage / ISO 13934 tensile / DIN 53351 grommet pull-out / ISO 9227 salt-fog. 500-800 N fastener mechanics; TRSA HCH + CDC G.VII healthcare-linen hygiene + ZDHC / Higg sustainability. Unique canvas / leather / tarp attach path.
- **hang-tag** — retail source-tag + RAIN RFID Alliance stack. GS1 TDS 2.0 SGTIN-96 + EPCIS 2.0 + ARTS + RAIN CoC + Auburn Lab Project Zipper benchmark. FCC / RED reader conformity + FTC 16 CFR 303 care-label + EU 2023/988 GPSR digital-info hooks. Unique 98 %+ item-level accuracy + 30-60 % out-of-stock reduction benchmark anchor.
- **pcb** — IT-asset / DCIM / on-metal-tolerance stack. IPC-A-610 Class 2 / 3 workmanship + IPC J-STD-001 reflow + IPC-4101 FR-4 / Rogers RO4350B dielectric + JEDEC MSL 3. ISO/IEC 19770-1 ITAM + NIST SP 800-53 CM-8 + CIS v8 + PCI DSS v4.0 Req. 9 governance. Unique ≤ ±0.5 dB unit-to-unit tolerance claim versus foam-backed labels.
- **pcb-screw-mount** — chassis-permanent mechanical-retention stack. ISO 4762 / ISO 2380 fastener + IEC 60068-2-6 vibration + MIL-STD-810G shock + NEBS GR-63-CORE Level 3 mechanical retention. Unique fastener-mark anti-counterfeit evidence + 10-25 year service life claim. Orthogonal to adhesive pcb-tag sibling.

## Verification summary

- `npx astro sync` — clean across all 5 writes + final batch sync (628 ms).
- Inbound references — minimum 5 (rfid-eyelet-tag), maximum 18 (rfid-pcb-screw-mount-tag); all ≥ 4 threshold.
- Orphan scan — zero orphan pages introduced.
- DEEP audit — all 5 pages carry keywords[6] + brief[11] objects + sources[10] five-field + all four DEEP section blocks (statBar, comparePanel, dataHighlight, timeline) + Blocker C de-identification phrase.
- Schema — all 5 pages validate against `src/content/editorial/products/rfid-tags/*.json` Zod collection.
- **Tree-level milestone** — rfid-tags tree SHALLOW scan returns zero pages; full DEEP conversion of the rfid-tags product tree complete.

## Files

- `src/content/editorial/products/rfid-tags/rfid-coin-tag.json`
- `src/content/editorial/products/rfid-tags/rfid-eyelet-tag.json`
- `src/content/editorial/products/rfid-tags/rfid-hang-tag.json`
- `src/content/editorial/products/rfid-tags/rfid-pcb-tag.json`
- `src/content/editorial/products/rfid-tags/rfid-pcb-screw-mount-tag.json`
