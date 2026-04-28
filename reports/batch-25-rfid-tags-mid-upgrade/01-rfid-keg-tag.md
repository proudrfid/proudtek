# Batch 25 / Page 1 — rfid-keg-tag

**Route:** `/products/rfid-tags/rfid-keg-tag/`
**Upgrade:** MID → DEEP (full rewrite with Blocker C de-identification)
**Sync:** clean (Zod pass)
**Inbound:** 4 references

## What changed

- `keywords[6]`: "RFID keg tag", "GS1 GIAI-96 keg fleet", "GRAI-96 returnable asset", "DIN 6647 steel keg RFID", "EPCIS 2.0 keg event", "Brewers Association keg management".
- `brief[]` expanded to 12 fields — adds Chip options (Impinj Monza R6-P / M750 / M775 UHF; NXP UCODE 9 / 9xe; NTAG216 HF for tasting-room tap events), Frequency / air interface (860-960 MHz Gen2v2 per ISO/IEC 18000-63:2015; 13.56 MHz per ISO/IEC 14443 Type A for tap-to-verify), EPC / ID scheme (GS1 TDS 2.0 GIAI-96 for serialised keg fleet, GRAI-96 for returnable assets exchanged across brewers, SSCC-96 for pallet/aggregation), 5 form-factor SKUs (neck-chime anti-metal, keg-body anti-metal disc, spear-collar ferrite, valve-cap insert, pallet-level aggregator), Environmental rating IP67/IP68 + -40/+85 °C cure, Read range, Mounting method, Pre-encoding + EPCIS 2.0 ObjectEvent "in-transit" / "in-possession" / "returned" / "retired", Compliance framework (DIN 6647-1/-2 + TTB 27 CFR Part 25 + FDA 21 CFR §175.105 + EU 10/2011 + EHEDG Doc 8 + 3-A Sanitary), Platform integration (VIP Keg Management, Kegstar, MicroStar, Keg Logistics, TrakRap + Encompass + Crafted ERP + Fishbowl Brewery + OrchestratedBEER + Ekos), MOQ.
- `statBar` on Challenges: GIAI-96 encoding / DIN 6647-2 keg diameter / 5-15% annual keg-loss baseline / EPCIS 2.0 event schema.
- `comparePanel` on "How Proud Tek solves": commodity anti-metal UHF tag (random EPC, no GS1 GIAI-96 scheme, no DIN 6647 keg-neck fit qualification, no vibration / wash-down qualification, no EPCIS 2.0 event feed) vs Proud Tek brewery keg programme (GIAI-96 pre-encoded to brewer issuer code, DIN 6647-1/-2 neck-chime fit, 3-A / EHEDG hygienic-design wash-down, keg-steam-wash qualified to 90 °C/30 min cycles, EPCIS 2.0 event feed wired to VIP / Kegstar / MicroStar).
- Blocker C — prior "Results" section (fabricated loss-reduction percentages and dollar-recovery attributed to implied brewery clients) rewritten as "Deployment patterns integrators follow on brewery keg fleet programmes" with dataHighlight ("manual count → GIAI-96 fleet visibility" citing Brewers Association Keg Management Best Practices + BBPA Keg Deposit Scheme + GS1 TDS 2.0 §7.1 GIAI-96) + 4-phase timeline (Weeks 1-3 fleet audit + GIAI-96 issuer-code registration → 4-6 SKU spec + pilot-lot encoding → 7-10 first-brewhouse rollout + VIP / Kegstar wiring → Month 4+ multi-brewer / distributor scale).
- Sources: 10 at 5-field (GS1 TDS 2.0, EPCIS 2.0, DIN 6647-1:2013, DIN 6647-2:2013, Brewers Association Keg Management Best Practices, BBPA Keg Deposit Scheme, TTB 27 CFR Part 25, FDA 21 CFR §175.105, EU 10/2011, ISO/IEC 18000-63:2015).

## Standards cited

GS1 Tag Data Standard 2.0 §7.1 GIAI-96 · §7.2 GRAI-96 · §7.4 SSCC-96 · GS1 EPCIS 2.0 ObjectEvent · DIN 6647-1:2013 steel keg dimensional standard · DIN 6647-2:2013 steel keg testing · Brewers Association Keg Management Best Practices · BBPA Keg Deposit Scheme · TTB 27 CFR Part 25 (Beer) · FDA 21 CFR §175.105 (indirect food contact) · EU Commission Regulation 10/2011 (plastic FCM) · EHEDG Doc 8 · 3-A Sanitary Standards · ISO/IEC 18000-63:2015 · ISO/IEC 14443 Type A.
