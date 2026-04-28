# Batch 26 / Page 2 — rfid-utility-pole-tag

**Route:** `/products/rfid-tags/rfid-utility-pole-tag/`
**Upgrade:** MID → DEEP full rewrite with Blocker C de-identification
**Sync:** clean (Zod pass)
**Inbound:** 5 references

## What changed

- `keywords[6]`: "RFID utility pole tag", "ANSI O5.1 wood pole identification", "NESC / IEEE C2 Rule 261 inspection", "GS1 GIAI-96 pole asset ID", "Osmose O-Calc Pro / SPIDAcalc integration", "FCC Part 1 §1.1428 joint-use attachment".
- `brief[]` 11 fields — Chip options (Monza R6-P / M775 / UCODE 9xe / NTAG424 DNA), Frequency, EPC scheme, 5 mounting SKUs (nail-mount wood per AWPA M4 / bolt-on anti-metal steel O5.4 / band-clamp concrete O5.5 + composite O5.6 / F3039 / climbing-space NESC Rule 236 / pole-top disc for transmission crossarm), Housing UV qualification (ASTM G154 Cycle 1 1,000 h + ISO 4892-2 Method A 2,500 h + ASTM G155 1,200 h + ASTM B117 1,000 h + EN ISO 6270-2), Environmental IP68, Read range (drive-by 30 km/h, helicopter / drone patrol, climbing-space handheld), Service life 25-year, Compliance framework (ANSI O5.1 / O5.4 / O5.5 + AWPA U1 + NESC Rule 250 / 261 / 236 / 381 + FCC §1.1428 + FERC FAC-003-4 + NERC CIP-014-2 + CPUC Rule 35 / AB 1054 / SB 901 + ISO 55001), Platform integration (ArcGIS UN / Field Maps / Survey123 + GE Smallworld Electric Office + Schneider ArcFM + Maximo / SAP PM / Infor EAM / Oracle WAM / Cityworks + Osmose O-Calc Pro + WMIS + Exo UPSS + NEETRAC + SPIDAcalc + SPIDAstudio + FLIR PoleScope + Katapult Pro + NJUNS + Alden iVUE + Pointel + Cumulus + Technosylva + Reax wildfire-analyst), MOQ.
- `statBar` on Challenges: 50k-500k poles / 25-50 yr design life / 10-yr inspection cycle / FCC §1.1428 joint-use.
- `comparePanel` 5×5 on "How Proud Tek solves": commodity nail-mount / paint-stencil pole tag (random EPC, no ANSI O5.1 species / grade map, no NESC Rule 250/261 inspection cadence, no AWPA U1 preservative record, no FCC / FERC / CPUC joint-use platform) vs Proud Tek utility-pole programme (GIAI-96 against ANSI O5.1 species / grade + AWPA U1 preservative + inspection cadence + joint-use attachment register, NESC / FCC / FERC / CPUC compliance pack, wildfire-analyst wiring into Technosylva / Reax, inspection feed into Osmose O-Calc Pro / SPIDAcalc / Katapult Pro / NJUNS, EAM feed into Maximo / SAP PM / Infor EAM / Cityworks).
- Blocker C — prior "Results" section rewritten as "Deployment patterns integrators follow on utility-pole inspection programmes" with dataHighlight ("25-year design life" citing ASTM G154-16 + ISO 4892-2:2013 + ASTM G155-13 + ASTM B117-19) + 4-phase timeline (Weeks 1-3 inventory + GIAI-96 → Weeks 4-6 SKU + mounting + chip + pilot-lot → Weeks 7-12 pilot + inspection-platform wiring → Month 4+ system-wide + wildfire / NESC / FERC audit closeout).
- Sources: 10 at 5-field (ANSI O5.1-2022, NESC (IEEE C2-2023), AWPA U1-2023, GS1 TDS 2.0 + EPCIS 2.0, FCC 47 CFR Part 1 §1.1428, FERC FAC-003-4, CPUC Rule 35 + AB 1054 / SB 901, ISO 55001:2014, ASTM G154-16, Osmose O-Calc Pro reference).

## Standards cited

ANSI O5.1-2022 · ANSI O5.4 Steel Transmission Poles · ANSI O5.5 Prestressed Concrete Poles · ANSI O5.6 Composite Poles · ASTM F3039 Fiber-Reinforced Composite · AWPA U1-2023 · NESC (IEEE C2-2023) Rule 250 / 261 / 236 / 381 · FCC 47 CFR Part 1 §1.1428 · FERC FAC-003-4 Transmission Vegetation Management · NERC CIP-014-2 Physical Security · California Public Utilities Commission Rule 35 + AB 1054 + SB 901 Wildfire Mitigation Plan · ISO 55001:2014 · ASTM G154-16 · ISO 4892-2:2013 · ASTM G155-13 · ASTM B117-19 · EN ISO 6270-2 · GS1 TDS 2.0 · EPCIS 2.0.
