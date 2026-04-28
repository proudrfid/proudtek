# Batch 24 — rfid-tags healthcare + life-sci MID→DEEP upgrade

**Date:** 2026-04-23 → 2026-04-24
**Scope:** 6 RFID-tag SKUs on the healthcare / life-sci / aerospace axis
**Framework:** locked DEEP — keywords[6] + brief ≥11 + statBar + comparePanel + dataHighlight + timeline + 5-field sources ≥8 + Blocker C de-identification
**Outcome:** 6/6 pages Zod-clean, 6/6 ≥4 inbound refs, 0 orphan refs

## Pages closed

| # | Page | Route | Brief | Sources | Inbound |
|---|------|-------|-------|---------|---------|
| 1 | rfid-blood-bag-tag | `/products/rfid-tags/rfid-blood-bag-tag/` | 12 | 10 | 7 |
| 2 | rfid-surgical-instrument-tag | `/products/rfid-tags/rfid-surgical-instrument-tag/` | 13 | 10 | 6 |
| 3 | rfid-temperature-sensor-tag | `/products/rfid-tags/rfid-temperature-sensor-tag/` | 12 | 10 | 4 |
| 4 | rfid-glass-capsule-tag | `/products/rfid-tags/rfid-glass-capsule-tag/` | 12 | 10 | 4 |
| 5 | rfid-animal-ear-tag | `/products/rfid-tags/rfid-animal-ear-tag/` | 11 | 10 | 5 |
| 6 | rfid-aircraft-part-tag | `/products/rfid-tags/rfid-aircraft-part-tag/` | 13 | 10 | 5 |

## Blocker C de-identification pattern applied

Every page's prior "Results clients achieve" section carried fabricated customer numerics (percentages, dollar amounts, hour-count savings attributed to implied but unnamed clients). Every one was rewritten as "Deployment patterns integrators follow on [domain] programmes" with:

- directional-benchmark intro framing (numbers are shape-of-work, not outcomes)
- standards citations replacing implied client references
- dataHighlight block with a qualitative-shift or single-standard-cited value
- 4-phase timeline (Weeks 1-N scoping / spec / pilot / scale-out)

## Standards mobilised across Batch 24

**Blood-bag transfusion safety:** ISBT 128 (ICCBBA), ICCBBA TR4-002 RFID Implementation Guide for Blood Transfusion, AABB Standards 33rd ed., FDA 21 CFR Part 606/§640, EU Blood Directive 2002/98/EC + Commission Directive 2005/61/EC, SHOT UK Annual Report, ISO 15693-3:2019, ISO 10993-5/-10, CAP Transfusion Medicine Checklist.

**Surgical-instrument / SPD:** AAMI ST79:2022, ISO 17665-1:2006, EN 285:2015+A1:2021, FDA 21 CFR Part 830 UDI, FDA 21 CFR §801.45 direct marking, EU MDR 2017/745 Art. 27-29 UDI, ISO 13485:2016, ISO 14971:2019, Joint Commission Sentinel Event Policy + Alert 51, AORN Guidelines for Perioperative Practice 2024.

**Cold-chain temperature sensor:** FDA 21 CFR Part 211, EU Good Distribution Practice 2013/C 343/01, WHO PQS E006 + WHO TRS 961 Annex 9, EN 12830:2018, ISO/IEC 17025, IATA Time & Temperature Sensitive Label, USP <1079>, FSMA 204 (21 CFR Part 204), PDA Technical Report 39, ISPE Good Practice Guide: Cold Chain Management, GS1 TDS 2.0 / EPCIS 2.0 SensorReportList.

**Glass-capsule animal ID:** ISO 11784:1996, ISO 11785:1996, ISO 14223:2018, ISO 24631:2018, ICAR Manufacturer Code Register, ISO 10993-1/-5/-10/-11, ISO 11135:2014, EU Regulation 576/2013, Commission Implementing Regulation 577/2013, UK Microchipping of Dogs (England) Regulations 2015, WOAH Terrestrial Animal Health Code Chapter 4.3.

**Livestock ear tag:** USDA APHIS 9 CFR Part 86 (mandatory-RFID 2024-11-05), EU Regulation 2019/2035 + Commission Implementing Regulation 2021/520, Australia NLIS Business Rules, Canada Health of Animals Regulations Part XV, Brazil IN MAPA 51/2018, ICAR Section 12 device testing.

**Aerospace flyable RFID:** ATA Spec 2000 Chapter 9-5 Passive UHF Flyable RFID Tag, FAA AC 20-162A, EASA CM-AS-002 Issue 01, RTCA DO-160G / EUROCAE ED-14G, SAE AS5678, SAE AS9100D, FAA 14 CFR Part 45, FAA AC 21-29D SUP, Boeing D6-81763 Rev E, Airbus A0094T0054, NXP UCODE DNA AES-128 / ISO/IEC 29167-10.

## Inbound-link backfills

Two pages required inbound-link backfill to clear the ≥4-reference threshold:

- `rfid-temperature-sensor-tag` (3 → 4): added link from `products/rfid-labels/nfc-pharmaceutical-label.json` resourceCard.
- `rfid-glass-capsule-tag` (1 → 4): added links from `products/rfid-tags/nfc-pet-tag.json`, `products/rfid-tags/rfid-fish-tag.json`, `products/rfid-tags/rfid-livestock-leg-band.json` resourceCards.

No pillar pages required edits.

## Verification

`npx astro sync` clean on every page after write; cumulative 7 runs, 650–900 ms each. DEEP-threshold classifier passes for all 6 pages (keywords=6, brief ≥11, statBar Y, comparePanel Y, dataHighlight Y, timeline Y, sources ≥10). Zero orphan refs in `href` walk of all 6 pages against content-collection routes.
