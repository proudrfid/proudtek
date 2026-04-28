# Batch 23 / Page 2 — rfid-jewelry-tag

**Route:** `/products/rfid-tags/rfid-jewelry-tag/`
**Upgrade:** MID → DEEP (incremental edits — no Blocker C needed)
**Sync:** clean (Zod pass)
**Inbound:** 4 references (2 added this batch — luxury-brands + nfc-luxury-authentication)

## What changed

- `keywords[6]`: "RFID jewelry tag", "UHF barbell ring tag", "SGTIN-198 luxury serial", "GS1 Digital Link jewellery provenance", "Aura Blockchain RFID", "jewellery inventory RFID 95% accuracy".
- `brief[]` 7 → 11 fields — adds Operating temperature (-20/+60), EPC scheme (SGTIN-96 / SGTIN-198), Compliance (ISO/IEC 18000-63:2015, GS1 TDS 2.0 / EPCIS 2.0, ESPR 2024/1781, INFORM Consumers Act 15 U.S.C. §45f, RJC COP 2019, Kimberley Process, CIBJO Blue Book), Platform integration (Cegid Retail Kering/LVMH, Lightspeed Retail, Salesforce Commerce, Oracle Retail Xstore, Shopify POS, SAP CAR, The Edge, RFID4U, Aura Blockchain; Impinj xArray / xSpan, Zebra ATR7000, CAEN Quark-UP).
- `statBar` on Problems: 200+/s inventory speed / 3 mm band thickness / <1 g tag weight / 95%+ read-rate target.
- `comparePanel` on "How Proud Tek solves": generic hang-tag vs format-matched barbell / loop / label designs.
- `dataHighlight` added to existing "Typical outcomes" section (multi-hour stock-count → <30 min per counter).
- 4-phase `timeline` added: Weeks 1-2 category audit → 3-4 sample set → 5-8 pilot store → Month 3+ chain rollout.
- Sources 8 → 10 at 5-field; added Auburn RFID Lab + Aura Blockchain Consortium references.

## Standards cited

ISO/IEC 18000-63:2015 · GS1 TDS 2.0 (SGTIN-96 / SGTIN-198) · EPCIS 2.0 (ISO/IEC 19987:2015) · GS1 Digital Link 1.4 · ESPR 2024/1781 · INFORM Consumers Act 15 U.S.C. §45f · RJC Code of Practices 2019 · Kimberley Process · CIBJO Blue Book · Auburn RFID Lab ARC.
