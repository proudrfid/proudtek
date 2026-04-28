# Batch 23 / Page 5 — uhf-rfid-hard-tag

**Route:** `/products/rfid-tags/uhf-rfid-hard-tag/`
**Upgrade:** MID → DEEP (full rewrite with Blocker C de-identification)
**Sync:** clean (Zod pass)
**Inbound:** 12 references

## What changed

- `keywords[6]`: "UHF RFID hard tag", "dual EAS RFID anti-theft tag", "Checkpoint Sensormatic Nedap hard tag", "SGTIN-96 retail hard tag", "source-tagging RFID program", "RAIN Alliance retail reference 2.1".
- `brief[]` 7 → 11 fields — adds Operating temperature (-20/+70 storage; -10/+45 read-reliable), EPC scheme (SGTIN-96 default, SGTIN-198 luxury, GIAI-96 reusable pool), Compliance (EN 50357 / EN 50364, EN 300 330 / FCC Part 15 Subpart B, ICNIRP 2020, GS1 TDS 2.0, EPCIS 2.0 ISO/IEC 19987:2015, INFORM Consumers Act 15 U.S.C. §45f, EU DSA Art. 31, NRF POS Data Standards v10), Platform integration (Sensormatic Synergy / Shrink Analyzer / Sensormatic IQ, Checkpoint EVOLVE / HALO, Nedap !D Cloud / !D Gate, Zebra SmartLens for Retail, Impinj ItemSense, Detego, Sellbytel; POS via Cegid / Oracle Retail Xstore / Shopify POS / SAP CAR / Salesforce Commerce).
- `statBar` on Problems: 200+ reuse cycles / RF 8.2 MHz or AM 58 kHz EAS / 3-8 m fixed-reader range / EPC Gen2v2 air interface.
- `comparePanel` on "How Proud Tek solves": commodity hard tag (assumed EAS freq, blank EPC, untested detach) vs Proud Tek converged (written EAS-gate confirmation, pin-retention sampling to 200 cycles, SGTIN pre-encoding, detach torque match, source-tagging factory co-ordination).
- Blocker C — "Results retail clients report" (40-store fashion chain zero-mismatches vs one-batch-failure, 340 cycles 30% replenishment saving, 1.5M-unit sportswear 22-minute receiving reduction, luxury $0.48 → $0.31 $85K savings at 500K units) rewritten as "Deployment patterns integrators follow on converged EAS + RFID hard-tag programmes" with dataHighlight (~200 → 300+ qualified reuse cycles) + 4-phase timeline (Weeks 1-2 gate & detach-lane audit → 3-4 tag spec lock + pre-encoding → 5-8 pilot store + source-tagging factory → Month 3+ chain scale-out + recirculation loop).
- Sources 8 → 10 at 5-field; added RAIN Alliance Retail Reference 2.1 + EU Digital Services Act Article 31.

## Standards cited

EN 50357 · EN 50364 · EN 300 330 · FCC Part 15 Subpart B · ICNIRP 2020 · ISO/IEC 18000-63:2015 · GS1 TDS 2.0 · EPCIS 2.0 (ISO/IEC 19987:2015) · NRF POS Data Standards v10 · NRF ORC Survey · RAIN Alliance Retail Reference 2.1 · INFORM Consumers Act 15 U.S.C. §45f · EU DSA Art. 31.
