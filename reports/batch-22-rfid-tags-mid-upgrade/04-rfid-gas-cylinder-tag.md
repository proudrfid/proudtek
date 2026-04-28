# Batch 22 · Page 4/6 — rfid-gas-cylinder-tag.json

**Route:** `/products/rfid-tags/rfid-gas-cylinder-tag/`
**Tier move:** MID → DEEP
**Reviewed:** 2026-04-24 · **Modified:** 2026-04-24

## Changes

- **Keywords (new):** 6 entries — "RFID gas cylinder tag", "on-metal cylinder RFID", "hydrostatic test tracking", "DOT 49 CFR 180.205 cylinder", "TPED 2010/35/EU", "GIAI-96 cylinder asset".
- **Brief extended:** EPC scheme (GIAI-96 for reusable cylinders), Compliance (DOT 49 CFR §180.205, TPED 2010/35/EU, ADR 2025 Ch. 6.2, CGA G-1.6, ATEX 2014/34/EU for Zone-2 readers, FDA 21 CFR §211 for medical gas), Platform integration (TrackAbout, VERTIGAS, SAP EAM).
- **Section extensions:**
  - `statBar` on Problems: 2–6 m read on steel / 5–15% annual cylinder loss benchmark / 5–10 yr requalification cycle / –40 to +120 °C operating window.
  - `comparePanel`: stamped-serial inspection vs GIAI-96 RFID on-metal cylinder tag — covers hydro-test log accuracy, wrong-gas-fill risk, fleet-loss visibility.
- **De-identification (Blocker C):** Prior "Results clients achieve" cited 28,000-cylinder fleet moving from 9% → 1.4% loss, 4.2 → 1.5 FTE reduction, two DOT citations avoided, and $320K rental-cost recovery. Replaced with "Deployment patterns integrators follow on cylinder-fleet programmes" framed as directional benchmarks. Added `dataHighlight` (5–15% → 1–3% annual loss with CGA G-1.6 citation) and 4-phase `timeline` (audit → tag/encode → platform binding → DOT/TPED requalification cycle).
- **Sources:** 7 → 9 entries, all 5-field. Added FDA 21 CFR §211 (medical gas cGMP) and ADR 2025 reference.

## Verification
- `npx astro sync` — clean.
- Inbound links: 6 references intact.
- Source URLs: 9/9 HTTPS.

## Status
`completed` with Blocker C de-identification pass.
