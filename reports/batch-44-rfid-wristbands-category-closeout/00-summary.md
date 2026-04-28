# Batch 44 — RFID-wristbands category closeout cluster SHALLOW → DEEP

**Scope.** The final 3 rfid-wristbands SKUs that complete the category at 18/18 DEEP. Together with Batches 41 (flagship), 42 (material family), and 43 (specialised application), this batch closes out the entire wristband category against the current DEEP framework standard.

**Pages.**
1. `rfid-adjustable-silicone-wristband` — adjustable-fit silicone with watch-style buckle (130-220 mm single SKU range), inventory simplification 60-80% vs fixed-size programmes, multi-frequency chip options (HF / LF / UHF), multi-season reuse with 100,000+ EEPROM write cycles per NXP spec.
2. `rfid-nylon-wristband` — woven nylon-PA with sealed RFID module, commercial-laundry compatible (hundreds of 60 °C cycles), comfortable for 24/7 daily wear, OEKO-TEX Standard 100 ESG option, antimicrobial-additive thread variant.
3. `elastic-rfid-wristband` — stretch-fit slip-on no-clasp architecture, 1-second self-applied issue time vs 5-15 second clasp-applied front-desk handover, reusable hygiene workflow (sanitise + re-encode + reissue), 6-12 month elastic-recovery lifecycle.

**Framework compliance.** Each page ships `keywords[6]`, `brief[12]` array-of-`{label,items[]}`, one of each titled DEEP block, 10 five-field `sources[]`, and a Blocker C de-identification anchor phrase in the final timeline item. Audit script confirmed 3/3 PASS.

**Inbound references (≥4 target).** Initial scan: adjustable-silicone 18 (already strong from prior internal cross-references), nylon 3, elastic 2. After ref-boost edits to industries/fitness + industries/hospitality:
- rfid-adjustable-silicone-wristband: 18 refs
- rfid-nylon-wristband: 5 refs (+2)
- elastic-rfid-wristband: 4 refs (+2)

**Host-page ref-boost edits.** 2 host pages updated:
- `industries/fitness.json` — added nylon + elastic to "Fitness RFID products".
- `industries/hospitality.json` — added nylon + elastic to "Wristband and linen-tracking products".

**Orphan-ref scan.** Cross-checked against the full route set (content collections + legacy WP pages in `src/data/pages/` + `public/_redirects` sources). All 47 outbound hrefs across the three pages resolve; 0 orphans.

**Sync.** `npx astro sync` clean on every per-page pass and final pass.

## RFID-wristbands category status — COMPLETE

**18 of 18 SKUs at current DEEP framework standard.** Full category audit confirms:

```
Total: 18  DEEP: 18  Non-DEEP: 0
```

**Category build-out across 4 batches:**
- Batch 41 (flagship cluster): UHF, cashless-payment, silicone-mifare-classic, hospital-patient-id, Tyvek
- Batch 42 (material family): fabric, paper, PVC, vinyl, waterpark
- Batch 43 (specialised application): child, prison, medical-alert, fitness, qr-nfc
- Batch 44 (closeout): adjustable-silicone, nylon, elastic

**Tasks.** #346 #347 #348 completed per-page; #349 Batch 44 verify completed; #345 Batch 44 parent closes on commit of these reports.
