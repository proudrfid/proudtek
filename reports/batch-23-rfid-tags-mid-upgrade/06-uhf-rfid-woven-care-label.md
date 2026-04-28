# Batch 23 / Page 6 — uhf-rfid-woven-care-label

**Route:** `/products/rfid-tags/uhf-rfid-woven-care-label/`
**Upgrade:** MID → DEEP (full rewrite with Blocker C de-identification)
**Sync:** clean (Zod pass)
**Inbound:** 10 references

## What changed

- `keywords[6]`: "UHF RFID woven care label", "sewn-in RFID care label", "ESPR 2024/1781 textile DPP", "ISO 6330 wash-endurance RFID", "SGTIN-96 permanent garment ID", "EPCIS 2.0 circular-economy RFID".
- `brief[]` 7 → 12 fields — adds RFID protocol (EPC Gen2v2 ISO/IEC 18000-63:2015; RAIN Endorsed), Operating temperature (-20/+70 storage; iron up to 110 °C; tumble dry up to 80 °C), Wash endurance explicit ISO 6330:2021 domestic 50+ / ISO 15797:2017 industrial 25+, EPC scheme (SGTIN-96 / SGTIN-198 / GRAI-96), Compliance (EU 1007/2011, FTC 16 CFR 423, Canadian Textile Labelling Act, JIS L 0001, ISO 3758:2023, OEKO-TEX STANDARD 100 Class I+II, ESPR 2024/1781 Art. 9(1)(f), GS1 TDS 2.0 / EPCIS 2.0, GS1 Digital Link 1.4), Platform integration (PLM/WMS SAP/Oracle/Centric/PTC FlexPLM/Infor; resale StockX/Vestiaire/The RealReal/thredUP/Depop; rental Rent the Runway/Nuuly/Urbn Box; recyclers Renewcell/Worn Again/Circ; DPP registries CIRPASS/Aura/TrusTrace; retail ops Sensormatic IQ/Nedap iD Cloud/Zebra SmartLens/Detego).
- `statBar` on Challenges: 50+ home-wash cycles / 2027 ESPR rollout / 1-4 m on-body range / SGTIN-96 or 198 unique product identifier.
- `comparePanel` on "How Proud Tek solves": commodity RFID sticker (3-5 wash delam, separate care label, <1 m body-detuned read, blank EPC) vs Proud Tek loom-encapsulated (ISO 6330 50+ cycles verified, care symbols + fibre + brand woven into same face, on-body antenna tuning, SGTIN pre-encoding, GS1 Digital Link overprint).
- Blocker C — "Results clients achieve" (40-60% faster returns, <2s vs 8-12s scans, 98%+ resale counterfeit detection $50K-$200K fraud reduction, 15-25% uniform lifecycle extension) rewritten as "Deployment patterns integrators follow on sewn-in RFID lifecycle programmes" with dataHighlight (single persistent SGTIN-96 factory → end-of-life per ESPR Art. 9(1)(f)) + 4-phase timeline (Weeks 1-3 PLM + label-face design lock → 4-6 inlay tuning + ISO 6330 qualification → 7-10 pilot style + EPCIS wiring → Month 4+ scale-out + DPP rollout).
- Sources 8 → 10 at 5-field; added ISO 15797:2017 industrial-laundry standard + GS1 Digital Link 1.4.

## Standards cited

EU Regulation 1007/2011 · EU Regulation 2024/1781 (ESPR) Art. 9(1)(f) · FTC 16 CFR Part 423 · Canadian Textile Labelling Act · JIS L 0001 · ISO 3758:2023 · ISO 6330:2021 · ISO 15797:2017 · ISO/IEC 18000-63:2015 · GS1 TDS 2.0 · EPCIS 2.0 (ISO/IEC 19987:2015) · GS1 Digital Link 1.4 · OEKO-TEX STANDARD 100 Annex 6 (Class I+II) · CIRPASS.
