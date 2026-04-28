# Batch 22 · Page 5/6 — rfid-high-temperature-ceramic-tag.json

**Route:** `/products/rfid-tags/rfid-high-temperature-ceramic-tag/`
**Tier move:** MID → DEEP
**Reviewed:** 2026-04-24 · **Modified:** 2026-04-24

## Changes

- **Keywords (new):** 6 entries — "ceramic RFID tag", "high-temperature RFID", "LTCC UHF tag", "heat-treatment tracking", "NADCAP AC7102 pyrometry", "AMS 2750 furnace traceability".
- **Brief:** 9 → 12 fields. Added EPC scheme (SGTIN-96 / GIAI-96 / CPI-96 mix for serialised parts, reusable fixtures and in-process lot carriers), Compliance (AMS 2750 pyrometry, AMS 2759 aerospace heat treat, NADCAP AC7102, FAA AC 20-62E, EASA Part-145, ATA Spec 2000 Ch. 9-5 AIT, AIAG CQI-9), Platform integration (Siemens Opcenter / Rockwell FactoryTalk / GE Digital Plant Apps / SAP DMC / OPC UA).
- **Section extensions:**
  - `statBar` on Problems: 250 °C continuous / 800 °C short-cycle / 10×5×3 mm LTCC footprint / IP68 resin seal.
  - `comparePanel` "Polymer UHF tag on thermal asset vs LTCC ceramic tag": covers survivability, antenna detuning, AMS 2750 thermocouple proximity.
- **De-identification (Blocker C):** Prior "Results industrial manufacturers achieve" cited specific recertification cycles, fixture recovery rates and kiln-burn loss percentages. Replaced with "Deployment patterns integrators follow on heat-treatment and thermal-process programmes" framed as directional benchmarks. Added `dataHighlight` (AMS 2750 + NADCAP AC7102 evidence-grade lot genealogy) and 4-phase `timeline` (thermal audit → EPC encoding → OPC UA binding → NADCAP audit cycle).
- **Sources:** 8 → 10 entries, all 5-field. Added AIAG CQI-9 (Special Process: Heat Treat System Assessment) and ATA Spec 2000 Chapter 9-5 (Automated Identification / AIT).

## Verification
- `npx astro sync` — clean.
- Inbound links: 4 references intact.
- Source URLs: 10/10 HTTPS.

## Status
`completed` with Blocker C de-identification pass.
