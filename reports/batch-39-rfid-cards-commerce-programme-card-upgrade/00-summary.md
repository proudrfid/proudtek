# Batch 39 — RFID-cards commerce / programme-card cluster SHALLOW → DEEP

**Scope.** Five SHALLOW `/products/rfid-cards/` pages lifted to the full DEEP framework: gift, loyalty, membership, NFC warranty, and parking. These are the commerce- and programme-card pages where stored-value regulation (CARD Act / PSD2), loyalty-programme ROI, club/fitness credentials, post-purchase warranty registration, and UHF long-read parking access live. Collectively they complete the commerce-facing rfid-cards cluster, leaving only the four duplicate-pair investigations (Task #296) and two access-integration SKUs for Batch 40.

**Pages.**
1. `rfid-gift-card` — CARD Act 2009 §402 five-year expiry + PSD2 limited-network exemption; NRF ~USD 170B; 6-12% breakage; NTAG213/216 + DESFire EV3.
2. `rfid-loyalty-card` — Bond Brand Loyalty ~16 enrolments / ~7 active; GDPR Art. 6/15/17/20; PCI-DSS v4.0; ISO/IEC 15416 grade A/B barcode; Apple Wallet Passes.
3. `rfid-membership-card` — MIFARE Classic 1K → DESFire EV3 AES-128 + AN10922 key diversification; Mindbody / ABC Fitness / PerfectGym integrators; ISO/IEC 19794-5 face image.
4. `nfc-warranty-card` — NTAG213 baseline + NTAG424 DNA SUN anti-counterfeit tier; NFC Forum NDEF URI RTD; Magnuson-Moss 15 U.S.C. § 2301; EU Directive 2019/771; EU ESPR 2024/1781 DPP; GS1 Digital Link.
5. `rfid-parking-card` — UHF 860-960 MHz EPC Gen2 ISO/IEC 18000-63 (2-5 m windshield) vs HF ISO/IEC 14443 tap vs LF ISO/IEC 18000-2 proximity; Impinj Monza R6/R6-P, NXP UCODE 8/9; Skidata / HID / Nedap / 3M integrators.

**Framework compliance.** Each page ships `keywords[6]`, `brief[12]` array-of-`{label,items[]}`, one of each titled DEEP block (`statBar`, `comparePanel`, `dataHighlight`, `timeline`), 10 five-field `sources[]`, and a Blocker C de-identification anchor phrase ("Deployment patterns integrators follow on [domain] programmes") in the final timeline item. Audit script confirmed 5/5 PASS.

**Inbound references (≥4 target).**
- rfid-gift-card: 5 refs (_pillar, loyalty-card, custom-printing LP, bulk-cards LP, retail-apparel)
- rfid-loyalty-card: 5 refs (_pillar, gift-card, custom-printing LP, bulk-cards LP, retail-apparel)
- rfid-membership-card: 6 refs (_pillar, mifare-ultralight-c-cards, custom-printing LP, bulk-cards LP, industries/fitness, LF-chip encyclopedia guide)
- nfc-warranty-card: 4 refs (_pillar, custom-printing LP, brand-protection, solutions/digital-product-passport)
- rfid-parking-card: 5 refs (_pillar, bulk-cards LP, industries/fitness, solutions/rfid-parking-management, LF-chip encyclopedia guide)

**Host-page ref-boost edits.**
- `lp/bulk-rfid-cards.json` — added 4 rfid-cards SKUs to "Browse RFID card products" (gift + loyalty + membership + parking).
- `lp/custom-rfid-card-printing.json` — added 4 rfid-cards SKUs to "Related RFID card resources" (gift + loyalty + membership + warranty).
- `industries/fitness.json` — added membership + parking to "Fitness RFID products".
- `industries/brand-protection.json` — added warranty-card to "Authentication tag SKUs".
- `industries/retail-apparel.json` — added gift + loyalty to "Related products".
- `solutions/digital-product-passport.json` — added warranty-card to "DPP-ready NFC products" (top-up to clear nfc-warranty-card ≥4).

**Orphan-ref scan.** Cross-checked against the full 2,073-route set (content collections + legacy WP pages in `src/data/pages/` + fixed routes). All 28 outbound hrefs across the five pages resolve; 0 orphans.

**Sync.** `npx astro sync` clean on final pass (663ms).

**Tasks.** #306 #307 #308 #309 #310 completed per-page; #311 Batch 39 verify completed. #305 parent closes on commit of these reports.
