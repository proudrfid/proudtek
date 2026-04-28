# Batch 26 / Page 1 — rfid-manhole-cover-tag

**Route:** `/products/rfid-tags/rfid-manhole-cover-tag/`
**Upgrade:** MID → DEEP full rewrite with Blocker C de-identification
**Sync:** clean (Zod pass)
**Inbound:** 4 references (after `rfid-nail-tag` cross-link top-up)

## What changed

- `keywords[6]`: "RFID manhole cover tag", "GS1 GIAI-96 utility asset ID", "EN 124 D400 / E600 qualified", "AWWA M44 valve / manhole asset management", "PHMSA 49 CFR Part 192 gas O&M", "ArcGIS Utility Network / Bentley AssetWise / Maximo".
- `brief[]` 12 fields — adds Chip options (Monza R6-P / M775 / UCODE 9xe / NTAG424 DNA), Frequency / air interface, EPC scheme (GIAI-96 per GS1 TDS 2.0 §7.1), 5 form factors (cast-in recess / epoxy-embedded retrofit / flush surface marker / pick-hole insert / valve-box bolt-on), Load rating (EN 124 D400 / E600 + AASHTO M 306 HS-20 / HL-93), Material substrate (ASTM A48 / A536 / A126 / composite / stainless), Environmental rating IP68, Read range, Tamper (Monza R6-P tamper flag + NTAG424 DNA SUN CMAC AES-128), Compliance framework (AWWA M44 / J100-10 + PHMSA 49 CFR Part 192.605 / §192.723 / Part 195 + NESC Rule 381 + EN 124:2015 + ASTM A48/A536/A126 + AASHTO M 306 + ISO 55001:2014), Platform integration (ArcGIS Utility Network / Field Maps / Survey123 + Bentley AssetWise + Maximo + SAP PM + Infor EAM + Oracle WAM + Cityworks + Trimble Unity + Innovyze InfoAsset + Sensus / Itron + Sedaru / SPIDAcalc), MOQ.
- `statBar` on Challenges: 50k-500k access points / 30-50 yr service life / EN 124 D400 / $1B+ theft exposure.
- `comparePanel` 5×5 on "How Proud Tek solves": commodity on-metal disc (random EPC, no load-class qualification, no AWWA / PHMSA traceability, no utility-network platform wiring, no tamper-evident identity) vs Proud Tek utility-infrastructure programme (GIAI-96 against AWWA / PHMSA / NESC asset register, EN 124 D400 / E600 + AASHTO M 306 HS-20 / HL-93 load-class qualified, ASTM A48 / A536 / A126 substrate compatibility, NTAG424 DNA SUN CMAC AES-128 tamper-evidence, platform wiring into ArcGIS Utility Network + Bentley AssetWise + Maximo + SAP PM + Infor EAM + Oracle WAM + Cityworks + Trimble Unity + Innovyze InfoAsset).
- Blocker C — prior "Results" section (fabricated theft-reduction percentages and implied city savings) rewritten as "Deployment patterns integrators follow on utility infrastructure tracking programmes" with dataHighlight ("EN 124 D400 / E600 qualified" citing EN 124:2015 §5 + AASHTO M 306-10 + ASTM A48 / A536 / A126) + 4-phase timeline (Weeks 1-3 inventory + GIAI-96 issuer-code → Weeks 4-6 SKU + chip + pilot-lot → Weeks 7-12 pilot install + GIS / EAM wiring → Month 4+ system-wide + PHMSA / AWWA audit closeout).
- Sources: 10 at 5-field (EN 124:2015, AASHTO M 306-10, ASTM A48/A48M-03(2016), ASTM A536-84(2019), GS1 TDS 2.0 + EPCIS 2.0, AWWA M44, AWWA J100-10, PHMSA 49 CFR Part 192, NESC (IEEE C2-2023), ISO 55001:2014).

## Standards cited

EN 124:2015 D400 / E600 · AASHTO M 306-10 HS-20 / HL-93 · ASTM A48 / A48M-03(2016) · ASTM A536-84(2019) · ASTM A126 · AWWA M44 Distribution Valves · AWWA J100-10 Risk and Resilience Management · PHMSA 49 CFR Part 192 §192.605 + §192.723 · PHMSA 49 CFR Part 195 · NESC (IEEE C2-2023) Rule 381 · ISO 55001:2014 · GS1 Tag Data Standard 2.0 · EPCIS 2.0 · NXP AN12196 NTAG424 DNA SUN CMAC AES-128.
