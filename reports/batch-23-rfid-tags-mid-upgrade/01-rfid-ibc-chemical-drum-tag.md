# Batch 23 / Page 1 — rfid-ibc-chemical-drum-tag

**Route:** `/products/rfid-tags/rfid-ibc-chemical-drum-tag/`
**Upgrade:** MID → DEEP (full rewrite with Blocker C de-identification)
**Sync:** clean (Zod pass)
**Inbound:** 5 references

## What changed

- `keywords[6]`: "RFID IBC tag", "chemical drum RFID tag", "ATEX Zone 1/2 RFID tag", "GHS Safety Data Sheet NFC", "GRAI-96 returnable IBC", "ADR 2025 hazmat RFID".
- `brief[]` 9 → 12 fields — adds Operating temperature (-40/+120 continuous, +150 short), EPC scheme (GRAI-96 / GIAI-96 / SGTIN-96), Compliance (UN Model Regs Rev.22, DOT 49 CFR 171-180, ADR 2025 / RID 2025 / IMDG 2024 / ICAO TI 2025, OSHA HCS 29 CFR §1910.1200, EPA RCRA 40 CFR §262, EU CLP 1272/2008, REACH 1907/2006, GMP Annex 15), Platform integration (SAP EWM, Oracle, Infor, MS Dynamics, BatchMaster/Deacom/Datacor Chempax; Schütz TICKET / Greif CHEM-PAK / Mauser LIFE CYCLE+).
- `statBar` on Problems section: 5,000-20,000 cycles / Zone 1/2 ATEX / 2-6 m handheld / 3-8 m fixed.
- `comparePanel` on "How Proud Tek solves": paper fill logs + adhesive sticker vs epoxy-potted on-metal RFID with GRAI-96 pre-encoding.
- Blocker C — "Results chemical companies report" rewritten as "Deployment patterns integrators follow on hazmat-container RFID programmes" with dataHighlight (75-85% → 98%+ fill-trace accuracy) + 4-phase timeline.
- Sources 8 → 10 at 5-field; added EPA RCRA 40 CFR §262 and EU CLP 1272/2008.

## Standards cited

UN Model Regulations Rev.22 · DOT 49 CFR 171-180 · ADR 2025 · RID 2025 · IMDG 2024 · ICAO TI 2025 · OSHA HCS 29 CFR §1910.1200 · EPA RCRA 40 CFR §262 · EU CLP 1272/2008 · REACH 1907/2006 · ATEX 2014/34/EU Zone 1/2 · IECEx · GMP Annex 15 · GS1 TDS 2.0 · EPCIS 2.0 (ISO/IEC 19987:2015) · ISO/IEC 18000-63:2015.
