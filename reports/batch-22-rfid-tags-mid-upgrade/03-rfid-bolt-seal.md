# Batch 22 · Page 3/6 — rfid-bolt-seal.json

**Route:** `/products/rfid-tags/rfid-bolt-seal/`
**Tier move:** MID → DEEP
**Reviewed:** 2026-04-24 · **Modified:** 2026-04-24

## Changes

- **Keywords (new):** 6 entries — "RFID bolt seal", "ISO 17712 high-security RFID seal", "C-TPAT RFID container seal", "SGTIN-96 container seal EPC", "gate-lane seal reader", "WCO SAFE RFID bolt seal".
- **Brief:** 7 → 11 fields. Added Operating temperature (–40 to +85 °C), EPC scheme (SGTIN-96 per GS1 TDS 2.0), Compliance (ISO 17712 High Security H, C-TPAT, EU AEO, WCO SAFE), Reader integration (Impinj R700 / Zebra FX9600 / Alien ALR-F800 portals).
- **Section extensions:**
  - `statBar` on Problems: ≥15 kN pull-force (ISO 17712 H) / 3–8 m portal read / 2–5% manual transcription error / 96-bit EPC.
  - `comparePanel` "Visual-only seal inspection vs ISO 17712 + UHF RFID seal": covers throughput, chain-of-custody evidence and tamper-flag durability.
- **De-identification (Blocker C):** Prior "Results clients achieve" cited specific terminal volumes (1,200 truck/day), freight forwarder movement counts (80,000 movements), C-TPAT Tier 3 classification, and luxury-goods zero-theft outcomes. Replaced with a single "Deployment patterns integrators follow on container-security programmes" section framed as directional benchmarks with WCO SAFE / CBP C-TPAT citations. Added `dataHighlight` (2–5% transcription error → ~0% with portal reads) and 4-phase `timeline` (lane audit → portal commissioning → pilot under C-TPAT observation → scale-out).
- **Sources:** 8 → 10 entries, all 5-field. Added WCO RFID Guidelines (2013) and Navis N4 TOS integration reference.

## Verification
- `npx astro sync` — clean.
- Inbound links: 7 references intact.
- Source URLs: 10/10 HTTPS.

## Status
`completed` with Blocker C de-identification pass.
