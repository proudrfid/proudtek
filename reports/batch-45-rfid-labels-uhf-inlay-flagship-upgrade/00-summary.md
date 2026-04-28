# Batch 45 — RFID-labels flagship UHF-inlay cluster SHALLOW → DEEP

**Scope.** Five foundational UHF-inlay SKUs that anchor every UHF label deployment across retail (Walmart RFID mandate), supply-chain, healthcare, pharmaceutical, aerospace MRO, and EU Digital Product Passport programmes. This batch opens the rfid-labels category build-out — 58 SHALLOW pages remaining; this batch establishes the chip-spec foundation that the rest of the category builds on.

**Pages.**
1. `impinj-m700-uhf-inlay` — Impinj M700 family (M730 retail / M750 mainstream-with-user-memory / M770 high-memory + AutoTune mixed-surface), -23.5 dBm sensitivity, ARC Master List + Walmart mandate alignment, M800 upgrade path.
2. `impinj-m730-uhf-inlay` — Monza R6 cost-optimised retail volume tier, 96-bit EPC + factory TID + 0 user memory, sub-cent silicon ASP at billion-tag scale, Walmart RFID source-tag dominant chip.
3. `impinj-m750-uhf-inlay` — Monza R6-P brand-protection variant, AUTHENTICATE + Untraceable + Crypto Suite 3 AES-128, Impinj Authenticity cloud service for turnkey verification, EU DPP UHF tier minimum.
4. `impinj-m800-uhf-inlay` — Next-gen M830/M850/M870/M880 with M880 Protected Mode crypto-AUTHENTICATE, 1-2 dB sensitivity improvement over M700, pin-compatible upgrade path, pharmaceutical / luxury / DPP applications.
5. `alien-higgs-9-uhf-inlay` — Alien Technology Higgs-9 with 688-bit (≥64 byte) user memory (largest in volume RAIN tier), -24.0 dBm sensitivity, RTI / industrial-asset / field-service offline-capable on-tag data storage default chip.

**Framework compliance.** Each page ships `keywords[6]`, `brief[12]` array-of-`{label,items[]}`, one of each titled DEEP block, 10 five-field `sources[]`, and a Blocker C de-identification anchor phrase in the final timeline item. Audit script confirmed 5/5 PASS.

**Inbound references (≥4 target).** Strong cross-link density already in place from extensive prior internal cross-references across compare pages, industry pages, and other rfid-labels SKUs. No host-page ref-boost edits required:
- impinj-m700-uhf-inlay: 19 refs
- impinj-m730-uhf-inlay: 11 refs
- impinj-m750-uhf-inlay: 7 refs
- impinj-m800-uhf-inlay: 8 refs
- alien-higgs-9-uhf-inlay: 6 refs

**Orphan-ref scan.** Cross-checked against the full route set. All 65 outbound hrefs across the five pages resolve; 0 orphans.

**Sync.** `npx astro sync` clean on every per-page pass and final pass.

**Tasks.** #352 #353 #354 #355 #356 completed per-page; #357 Batch 45 verify completed; #351 parent closes on commit of these reports.
