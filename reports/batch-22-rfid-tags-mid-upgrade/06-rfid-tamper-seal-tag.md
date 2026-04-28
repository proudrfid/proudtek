# Batch 22 · Page 6/6 — rfid-tamper-seal-tag.json

**Route:** `/products/rfid-tags/rfid-tamper-seal-tag/`
**Tier move:** MID → DEEP
**Reviewed:** 2026-04-24 · **Modified:** 2026-04-24

## Changes

- **Keywords (new):** 6 entries — "RFID tamper-evident seal tag", "ISO 17712 high-security RFID seal", "C-TPAT RFID bolt seal", "OTP tamper-flag UHF seal", "EPCIS 2.0 seal-event logging", "GDP pharmaceutical tamper seal".
- **Brief:** 7 → 11 fields. Added Operating temperature, EPC scheme (SGTIN-96 for cargo, GIAI-96 for reusable enclosures, GSRN-96 for recurring service relationships), Compliance (C-TPAT, EU AEO, EU GDP §9.2, DSCSA §582 T3, WCO SAFE, CJIS §5.12), Platform integration (SAP EWM/TM, Oracle OTM, Blue Yonder LMS, E2open, Project44, FourKites, Navis N4). Hardened the Tamper-detection field to make the OTP-bit irreversibility explicit.
- **Section extensions:**
  - `statBar` on Problems: 60–90 s manual inspection / 500–2,000 container moves-per-day / 2–5 m portal read / Irreversible OTP tamper-flag transition.
  - `comparePanel`: ISO 17712 mechanical-only seal vs ISO 17712 + UHF RFID + OTP tamper-flag — covers gate throughput, audit trail durability, insider-manipulation resistance, GDP / DSCSA evidence paths.
- **De-identification (Blocker C):** Prior "Results clients achieve" cited a specific 90 s → <10 s gate-processing delta, 600–900 vs 400–450 moves-per-lane-per-day, a "18 months zero successful insider manipulation" claim, and "40–60% CBP inspection reduction". Replaced with "Deployment patterns integrators follow on container and pharmaceutical seal programmes" framed as directional benchmarks with CBP C-TPAT + ISO 17712 + EPCIS 2.0 citations. Added `dataHighlight` (90 s → <10 s gate-lane verification) and a 4-phase `timeline` (lane/seal audit → portal commissioning & EPCIS mapping → pilot under C-TPAT/GDP observation → programme scale-out).
- **Sources:** 8 → 10 entries, all 5-field. Added WCO SAFE Framework (2021) and CJIS Security Policy §5.12 (evidence chain-of-custody).

## Verification
- `npx astro sync` — clean.
- Inbound links: 4 references intact.
- Source URLs: 10/10 HTTPS.

## Status
`completed` with Blocker C de-identification pass.
