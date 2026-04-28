# Batch 28 summary — rfid-tags livestock + aquaculture + forestry + outdoor MID→DEEP cluster

**Tasks**: #210 (audit parent) + #211-216 (pages) + #217 (verify) + #218 (this report)
**Status**: ✅ All six pages DEEP-upgraded, verified, and reported

## Pages

| # | Slug | Task | Regulatory anchor |
|---|------|------|-------------------|
| 1 | rfid-ear-tag-livestock | #211 | USDA APHIS ADT 9 CFR Part 86 / EU 2019/2035 + 1760/2000 / ISO 11784-11785 HDX + FDX-B / ICAR Section 5 + 10 / NLIS + NAIT |
| 2 | rfid-livestock-leg-band | #212 | USDA NPIP 9 CFR 145-147 / EU 2019/2035 + 1308/2013 poultry / ICAR Section 5.7 + 10.8 / CITES Appendix I+II / USBGA + PIPA + FCI pigeon-racing |
| 3 | nfc-pet-tag | #213 | NFC Forum Type 2 + ISO/IEC 14443-A / AVMA + AAHA Universal Pet Microchip Lookup / EU 576/2013 Pet Passport / NXP AN12196 NTAG424 DNA SUN |
| 4 | rfid-fish-tag | #214 | ISO 11784/11785 + ISO 24631-1/-6 / NMFS ESA + PTAGIS / AFTM + AFS Use of Fishes in Research / CITES Appendix I+II sturgeon + eel |
| 5 | rfid-tree-tag | #215 | USFS FIA / ISA TRAQ + ANSI A300 / SFI 2022 + FSC-STD-40-004 v3.1 + PEFC ST 2002:2020 / EU 2023/1115 EUDR / Lacey Act |
| 6 | waterproof-uhf-rfid-outdoor-tag | #216 | IEC 60529 IP68/IP69K + ISO 20653 + NEMA 250 Type 4X/6/6P / ISO 12944 C5-M/CX + NACE SP0492 + NORSOK M-501 / ATEX 2014/34/EU + IECEx + NEC Class I Div 1 / MIL-STD-810H |

## DEEP compliance audit (all pages)

| Slug | keywords | brief | sources | 5-field | statBar | comparePanel | dataHighlight | timeline |
|------|----------|-------|---------|---------|---------|--------------|---------------|----------|
| rfid-ear-tag-livestock | 6 ✓ | 11 ✓ | 10 ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| rfid-livestock-leg-band | 6 ✓ | 11 ✓ | 10 ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| nfc-pet-tag | 6 ✓ | 12 ✓ | 10 ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| rfid-fish-tag | 6 ✓ | 12 ✓ | 10 ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| rfid-tree-tag | 6 ✓ | 12 ✓ | 10 ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| waterproof-uhf-rfid-outdoor-tag | 6 ✓ | 12 ✓ | 10 ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

## Cross-reference health

| Slug | Inbound | Orphans | Sync |
|------|---------|---------|------|
| rfid-ear-tag-livestock | 6 | 0 | 880 ms |
| rfid-livestock-leg-band | 4 (3 → 4 after +1 inbound) | 0 | 849 ms |
| nfc-pet-tag | 4 (2 → 4 after +2 inbound) | 0 | 873 ms |
| rfid-fish-tag | 4 | 0 | 877 ms |
| rfid-tree-tag | 4 | 0 | 886 ms |
| waterproof-uhf-rfid-outdoor-tag | 4 (3 → 4 after +1 inbound) | 0 | 958 ms |

## Inbound-reference top-ups

Three pages below 4-inbound threshold were topped up by adding links from sibling tags:

- rfid-glass-capsule-tag.json → added rfid-livestock-leg-band + nfc-pet-tag (resolves leg-band + pet-tag)
- rfid-ear-tag-livestock.json → added nfc-pet-tag (second nfc-pet-tag inbound)
- rfid-utility-pole-tag.json → added waterproof-uhf-rfid-outdoor-tag

Post-edit sync clean at 876 ms; all three targets now at 4 inbound.

## Validation

All six DEEP rewrites passed `npx astro sync` on first write (no Zod retry loops). Final full-tree re-sync clean at 876 ms. Orphan-ref scan across all six Batch 28 pages returned 0 orphans — image-source routes already pointed at valid `/products/rfid-tags/` + `/products/rfid-cards/` + `/products/rfid-labels/` replacements.
