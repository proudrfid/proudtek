# Batch 40 — RFID-cards access-integration + dedup closeout cluster SHALLOW → DEEP

**Scope.** Five rfid-cards pages lifted to the full DEEP framework plus four duplicate SKU consolidations — the final batch in the rfid-cards category. Two access-integration pages (Assa Abloy-compatible hotel keys, RFID + magstripe combo) clarify the hospitality/campus installed-base story; three chip/material pages (Ultralight C, dual-frequency, transparent NFC) are upgraded from their SHALLOW form and absorb the content of their duplicate siblings. After this batch the rfid-cards category stands at 25 canonical DEEP pages with four legacy-URL 301 redirects.

**Pages.**
1. `rfid-card-assa-abloy-compatible` — Assa Abloy Hospitality (VingCard Classic/Essence/Allure/Signature RFID + Vostio) compatibility via ISO/IEC 14443-A; MIFARE Classic 1K / DESFire EV3; Magnuson-Moss Act §2302(c) anti-tying; NXP AN10922; Oracle Opera / Mews / Cloudbeds PMS neutrality.
2. `rfid-card-magnetic-stripe-combo` — ISO/IEC 7811-2/-6/-7 HiCo 2750/4000 Oe + LoCo 300 Oe; ISO/IEC 7813 track layout; 13.56 MHz MIFARE/NTAG/iCLASS RFID rail; 18-36 month bridging for hospitality, campus (CBORD/Transact/Atrium), enterprise estates.
3. `mifare-ultralight-c-card` — NXP MF0ICU2 with 3DES mutual authentication (NIST SP 800-67 TDEA, 112-bit); 192 B memory / 144 B usable; NFC Forum Type 2; NXP AN11136 key diversification; plural dupe merged and redirected.
4. `dual-frequency-rfid-card` — LF 125 kHz + HF 13.56 MHz / HF + UHF 860-960 MHz pairings; EM4100/T5577/HID Prox + MIFARE/iCLASS/Monza/UCODE; ISO/IEC 14443 / 15693 / 18000-2 / 18000-63; ACS import (HID ProWatch, Lenel, Genetec, C•CURE, Pro-Watch, Gallagher); `rfid-dual-frequency-card` alternate-naming dupe merged and redirected.
5. `transparent-nfc-card` — optical-grade polycarbonate (Covestro Makrolon heritage) + PETG; registered white-ink underbase + metallic/foil/spot-UV/laser-etch stack; NTAG213/216/424 DNA; ISO/IEC 10373-1 durability; `transparent-clear-nfc-card` alternate-naming dupe merged and redirected.

**Framework compliance.** Each page ships `keywords[6]`, `brief[12]` array-of-`{label,items[]}`, one of each titled DEEP block (`statBar`, `comparePanel`, `dataHighlight`, `timeline`), 10 five-field `sources[]`, and a Blocker C de-identification anchor phrase in the final timeline item. Audit script confirmed 5/5 PASS.

**Inbound references (≥4 target).**
- rfid-card-assa-abloy-compatible: 7 refs (_pillar, magstripe-combo, compatibility/vingcard-hotel-key-cards, solutions/rfid-access-control, solutions/hotel-key-cards, compare/mifare-classic-vs-plus-vs-desfire-hotel-locks, industries/hospitality)
- rfid-card-magnetic-stripe-combo: 5 refs (_pillar, assa-abloy-compatible, solutions/hotel-key-cards, industries/hospitality, industries/education)
- mifare-ultralight-c-card: 7 refs (_pillar, mifare-desfire-ev3-card, mifare-plus-se-card, mifare-classic-1k-card, guides/mifare-ultralight-c-chip-encyclopedia, guides/mifare-desfire-ev3-commands-reference, industries/hospitality)
- dual-frequency-rfid-card: 6 refs (_pillar, dual-frequency-key-fob, solutions/rfid-access-control, compare/uhf-vs-hf-rfid, compare/125khz-vs-13.56mhz-rfid, industries/education)
- transparent-nfc-card: 4 refs (_pillar, nfc-card-custom-printing, lp/custom-rfid-card-printing, solutions/nfc-business-card)

**Host-page ref-boost edits.**
- `solutions/hotel-key-cards.json` — added magstripe-combo to "Chip-family SKUs and hospitality vertical".
- `industries/education.json` — added magstripe-combo + dual-frequency to "Core SKUs for campus deployments".
- `industries/hospitality.json` — added assa-abloy-compatible + magstripe-combo + ultralight-c to "Hotel key card SKUs".

**Duplicate consolidation (4 × 301 redirects).**
- `/products/rfid-cards/mifare-ultralight-c-cards/` → `/products/rfid-cards/mifare-ultralight-c-card/` (plural → singular)
- `/products/rfid-cards/mifare-desfire-ev3-cards/` → `/products/rfid-cards/mifare-desfire-ev3-card/` (plural → singular; canonical was already DEEP)
- `/products/rfid-cards/rfid-dual-frequency-card/` → `/products/rfid-cards/dual-frequency-rfid-card/` (naming order)
- `/products/rfid-cards/transparent-clear-nfc-card/` → `/products/rfid-cards/transparent-nfc-card/` (naming verbosity)

Duplicate source files deleted: `mifare-ultralight-c-cards.json`, `mifare-desfire-ev3-cards.json`, `rfid-dual-frequency-card.json`, `transparent-clear-nfc-card.json`.

**Orphan-ref scan.** Cross-checked against the full route set (content collections + legacy WP pages in `src/data/pages/` + `public/_redirects` sources). All 55 outbound hrefs across the five pages resolve; 0 orphans.

**Sync.** `npx astro sync` clean on final pass (897ms after ref-boost edits).

**RFID-cards category status.** After Batch 40: 25 canonical DEEP pages (20 pre-batch + 5 upgraded this batch), 4 legacy-URL 301 redirects, 0 SHALLOW remaining. The category is complete.

**Tasks.** #314 #315 #316 #317 #318 completed per-page; #319 Batch 40 verify completed; #296 (4 rfid-cards dedup pairs investigation) closes with this commit; #313 parent closes on commit of these reports.
