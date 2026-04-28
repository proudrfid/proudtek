# Page 1/6 — rfid-ear-tag-livestock

**Route**: `/products/rfid-tags/rfid-ear-tag-livestock/`
**Task**: #211
**Status**: ✅ MID → DEEP complete

## Regulatory anchor

- USDA APHIS Animal Disease Traceability (ADT) 9 CFR Part 86 + 840-series US national-animal-ID
- EU Regulation 2019/2035 + 1760/2000 (cattle) + 21/2004 (sheep-goats) + 1308/2013 CMO
- ISO 11784:1996 + ISO 11785:1996 — HDX + FDX-B 134.2 kHz 15-digit ID
- ISO 24631-1 Conformance + ISO 24631-6 Performance + ISO 24631-7 injectable
- ICAR Section 5 cattle + Section 10 sheep-goat + Section 11.7 rumen bolus + Section 5.6 injectable
- NLIS Australia + NAIT New Zealand + CFIA CLTS + TRACES EU + SITRAN Mexico

## DEEP compliance

| Block | Status |
|-------|--------|
| keywords[] | 6 ✓ |
| brief[] fields | 11 ✓ |
| sources[] | 10 ✓ |
| sources 5-field | ✓ |
| statBar | ✓ |
| comparePanel | ✓ |
| dataHighlight | ✓ |
| timeline | ✓ |

## Form-factor SKUs

Six livestock form factors: (1) two-piece cattle button + male stud (ICAR Section 5), (2) two-piece sheep-goat smaller profile (Section 10), (3) dual-freq FDX-B + UHF hybrid, (4) UHF-only feedlot / operational-throughput, (5) rumen bolus (Section 11.7 / ISO 24631-7), (6) injectable glass transponder (Section 5.6).

## Platforms

Allflex Universal Total Tagger + Y-TEX Advance Lockout + Datamars Tagger + Ritchey Easy-Tagger; USDA ADTIS + EU TRACES + NLIS + NAIT + CFIA CLTS; DairyComp 305 + DeLaval DelPro + GEA CowScout + BouMatic MPC + AfiFarm + NEDAP CowControl; Gallagher + Tru-Test; Angus Herd Improvement Records (AHIR) + Holstein USA + PIC International Group + JBS + Cargill + Tyson + Smithfield + Perdue.

## Cross-reference health

- Inbound refs: 6
- Orphans: 0
- Post-edit inbound addition: nfc-pet-tag link added to resourceCards (brings nfc-pet-tag inbound count to 4)

## Validation

`npx astro sync` clean (880 ms). Full-tree re-sync clean (876 ms) after inbound-top-up edit.
