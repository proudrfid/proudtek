# Batch 26 Summary — rfid-tags industrial infrastructure + inspection cluster MID → DEEP

**Scope:** 6 MID-tier SKUs sharing an industrial-infrastructure + inspection-regime spine (AWWA / PHMSA / NESC / ANSI / NFPA / API / ASME / NACE / CSA / DNV / NAHAD).
**Route prefix:** `/products/rfid-tags/`
**Upgrade:** MID → DEEP full rewrite; Blocker C de-identification on every page that previously carried fabricated numerics.
**Sync:** clean across all 6 pages; `npx astro sync` green (860-900 ms).

## Pages in batch

| # | Slug | Anchor regime |
|---|------|--------------|
| 1 | `rfid-manhole-cover-tag` | AWWA M44 / J100-10 · PHMSA 49 CFR Part 192 · NESC (IEEE C2-2023) · EN 124 D400/E600 · AASHTO M 306 · ASTM A48/A536/A126 |
| 2 | `rfid-utility-pole-tag` | ANSI O5.1/O5.4/O5.5 · NESC Rule 250/261/236/381 · AWPA U1 · FCC Part 1 §1.1428 · FERC FAC-003-4 · CPUC Rule 35 / AB 1054 / SB 901 |
| 3 | `rfid-fire-extinguisher-tag` | NFPA 10 Chapter 7 + Chapter 8 · OSHA 29 CFR 1910.157 · ISO 11602-2 · UL 299 / 626 / 711 · Joint Commission EC.02.03.05 · CMS 42 CFR 482.41 / 483.90 |
| 4 | `rfid-valve-tag` | API 570 / API 598 / API 607 · ASME B31.3 + B16.34 · OSHA PSM 29 CFR 1910.119 · 29 CFR 1910.147 LOTO · NFPA 70E Art. 120 · NACE MR0175 / ISO 15156 · ISO 14313 / 17292 / 15761 / 16135 · ISO 5211 |
| 5 | `rfid-oil-gas-pipe-tag` | API 5L / 5CT / 1104 · PHMSA 49 CFR Part 192 (Mega Rule §192.624 MAOP) + Part 195 · ASME B31.4 / B31.8 / B31.8S · CSA Z662 · DNV-ST-F101 · ISO 21809-1/-2/-3/-5 · NACE MR0175 |
| 6 | `rfid-hose-tag` | NAHAD STAMPED · EN ISO 1402 · EN 12115 · EN 13766 · ISO 18752 · SAE J517 · NFPA 1962 · NFPA 1852 · API 7K / API 16C · USCG 33 CFR 156 · OCIMF / DNV / ABS |

## DEEP compliance (all 6 pages)

| Slug | kw | brief | sources | statBar | comparePanel | dataHighlight | timeline | inbound |
|------|----|-------|---------|---------|--------------|---------------|----------|---------|
| rfid-manhole-cover-tag | 6 | 12 | 10 | 1 | 1 | 1 | 1 | 4 |
| rfid-utility-pole-tag | 6 | 11 | 10 | 1 | 1 | 1 | 1 | 5 |
| rfid-fire-extinguisher-tag | 6 | 12 | 10 | 1 | 1 | 1 | 1 | 6 |
| rfid-valve-tag | 6 | 13 | 10 | 1 | 1 | 1 | 1 | 6 |
| rfid-oil-gas-pipe-tag | 6 | 12 | 10 | 1 | 1 | 1 | 1 | 5 |
| rfid-hose-tag | 6 | 12 | 10 | 1 | 1 | 1 | 1 | 4 |

All 6 pages clear the DEEP thresholds (keywords ≥ 6, brief ≥ 11, sources ≥ 8, statBar + comparePanel + dataHighlight + timeline present, inbound ≥ 4).

## Blocker C de-identification

Every page with a prior numeric "Results" section (fabricated percentages, implied customer savings, named-client throughput claims) was rewritten to a standards-anchored "Deployment patterns integrators follow on [domain] programmes" narrative plus dataHighlight + 4-phase timeline citing primary-source standards only.

## Cross-link edits in support of this batch

- `rfid-nail-tag.json` — added `rfid-manhole-cover-tag` to its "Related rugged RFID tag products" resourceCard (inbound-ref top-up to clear ≥ 4 threshold).
- `rfid-fire-extinguisher-tag`, `rfid-valve-tag`, `rfid-oil-gas-pipe-tag`, `rfid-hose-tag` resourceCards wire each page into the other three as a natural cluster, bringing each to 4-6 inbound refs without introducing any orphans.

## Verification

- `npx astro sync` clean on each page immediately after Write (6/6).
- Orphan-ref scan — zero new orphans introduced by Batch 26 edits (all referenced routes resolve against `defined` route set).
- Inbound-ref threshold — all 6 pages at ≥ 4 inbound refs after cross-link + `rfid-nail-tag` top-up.

## Sources cited across the batch (union)

ANSI O5.1-2022 · AWPA U1-2023 · NESC (IEEE C2-2023) · FCC 47 CFR Part 1 §1.1428 · FERC FAC-003-4 · CPUC Rule 35 + AB 1054 / SB 901 · ISO 55001:2014 · ASTM G154-16 · ASTM G155-13 · ASTM B117-19 · ISO 4892-2:2013 · Osmose O-Calc Pro reference · EN 124:2015 · AASHTO M 306-10 · ASTM A48 / A536 / A126 · AWWA M44 · AWWA J100-10 · PHMSA 49 CFR Part 192 (incl. §192.619 + §192.624 Mega Rule) + Part 195 (§195.452) · GS1 TDS 2.0 + EPCIS 2.0 · NFPA 10:2022 · NFPA 25:2023 · NFPA 96:2021 · NFPA 72:2022 · NFPA 1962:2023 · NFPA 1852 · OSHA 29 CFR 1910.106 / .119 / .120 / .134 / .147 / .157 / .158 / .160 / .178 · ISO 11602-1 / -2 · UL 299 / UL 626 / UL 711 · Joint Commission EC.02.03.05 · CMS 42 CFR 482.41 / 483.90 · EN 3-7:2004+A1:2007 · API 570 / 574 / 579-1 (ASME FFS-1) / 598 / 607 / 653 / 1104 / 6A / Spec 7K / Spec 16C · API 5L / 5CT / 2B · ASME B31.3 / B31.4 / B31.8 / B31.8S / B16.34 / B16.5 / B16.47 / BPVC V / IX · NACE MR0175 + MR0103 + SP0169 / SP0204 / SP0502 · ISO 15156 · ISO 14313 / 17292 / 15761 / 16135 · ISO 5211 · NFPA 70E Article 120 · EPA 40 CFR Part 68 RMP · EU Seveso III Directive 2012/18/EU · HSE COMAH · NORSOK M-001 · EEMUA 159 · EU PED 2014/68/EU · ATEX 2014/34/EU · IECEx · CSA Z662 · CSA Z245.20 / Z245.21 · ISO 21809-1/-2/-3/-5 · ISO 3183 · DNV-ST-F101 · EU Directive 2008/68/EC · USCG 33 CFR 156 · OCIMF marine-transfer hose guidance · DNV / ABS marine approvals · NAHAD Hose Assembly Guidelines · EN ISO 1402:2021 · EN 12115:2011 · EN 13766:2010 · EN 14420 · ISO 18752:2022 · SAE J517 / J343 / J1273 / J1453 · ISO 1436 / 3949 / 11237 / 4079 · FDA 21 CFR §177.2600 + 21 CFR Part 11 · EU EMA Annex 11 · EC 1935/2004 + EU 10/2011 · USP Class VI · ISO 10993-5 · NXP AN12196 (NTAG424 DNA SUN CMAC).

## Platforms cited (union)

Pipeline GIS / EAM: ArcGIS Utility Network, ArcGIS Field Maps, Survey123, Schneider ArcFM, GE Smallworld Electric Office, PODS / APDM / UPDM, Trimble Unity / Business Center · Enterprise EAM / APM: IBM Maximo + Maximo Oil & Gas + Linear Asset Manager, SAP PM / S/4HANA Asset Management, Infor EAM (Energy / Life Sciences / Process), Oracle eAM, AVEVA PI System + AIM + UOC, Hexagon PAS PlantOps + SDx + Asset Performance, Bentley AssetWise APM + OpenPlant, GE Digital APM (Meridium), Aspen Mtell, Emerson AMS Device Manager + Plantweb Optics, Honeywell Forge APM, Yokogawa OpreX, Rockwell FactoryTalk AssetCentre, Nuvolo for ServiceNow · Life-safety / FM: BuildingReports, InspectPoint, ServiceTrade, FireLab, FM:Systems, Honeywell Forge Inspector, Siemens Desigo CC FSM, Johnson Controls OpenBlue, Accruent Meridian, ARC Facilities, Brightly Asset Essentials, AkitaBox, Origami Risk EHS, iAuditor / SafetyCulture · Utility pole-inspection: Osmose O-Calc Pro + WMIS, Exo UPSS, NEETRAC, SPIDAcalc + SPIDAstudio, FLIR PoleScope, Katapult Pro, NJUNS, Alden iVUE, Pointel, Cumulus, Technosylva, Reax · Pipeline integrity: ROSEN, Baker Hughes, TD Williamson, NDT Global, Quest Integrity, Penspen, Oceaneering, GE PII · Hose ecosystem: Gates PROaCT, Parker PTS / ParFlex, Continental ContiTech Matrix, Eaton Aeroquip FT1308 / Hose Assembly Master, Danfoss Aeroquip, Manuli Hydraulics, Ryco Hydraulics, Pirtek PTS + On-Site Tracker, Hose Monster · Fire-service: Firehouse, FirstDue, ESO, Emergency Reporting, Rhodium, TargetSolutions Vector LMS, All Hands Fire · SCBA: MSA FireGrid, Scott Safety Tracker, Dräger Aerial · Marine: Kongsberg K-IMS, DNV Veracity, Bureau Veritas VIMS · Turnaround: Prometheus PlatformPM · Pilot supporting: Cityworks, Innovyze InfoAsset, Sensus, Itron, Sedaru, SPIDAcalc, Coptrz NFC audit.
