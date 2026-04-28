# Page 5/5 — rfid-student-id-card.json (Task #293)

**Before:** SHALLOW — no keywords array, string-array brief, 0 sources, no block sections
**After:** DEEP framework complete

## Anchor stack

ISO/IEC 7810 · ISO/IEC 14443 · ISO/IEC 10373-1 · NXP DESFire EV3 · NXP Application Note AN10922 (AES key diversification) · FERPA (20 U.S.C. § 1232g / 34 CFR Part 99) · Apple Campus Cards launch (October 2019 cohort: Duke, Alabama, Oklahoma, Johns Hopkins, Santa Clara, Mercer, Temple, Vanderbilt) · Google Wallet student IDs (2022 onwards) · Transact eAccounts · CBORD · ISO/IEC 19794-5 (ICAO face-image spec for card photos).

## DEEP block summary

- **keywords[6]** — RFID student ID card, university student ID card, campus one-card, DESFire EV3 student credential, Apple Wallet student ID, Google Wallet student ID.
- **brief[12]** — labelled objects on ISO/IEC 7810 card body and university branding, photo spec (ISO 19794-5), chip choice (MIFARE Classic legacy → DESFire EV3 standard), AES key diversification (AN10922), FERPA data-minimisation constraints, Transact / CBORD / Blackboard campus-one-card back-ends, service stacking (dormitory access + library + meal plan + print release + exam), Apple Campus Cards architecture and the October 2019 launch cohort, Google Wallet student-ID rollout, hybrid physical-plus-wallet pattern (wallet is overlay not replacement), replacement-badge operational load (8-15 % annual churn), orientation issuance flow (2,000-10,000 cards in the August move-in window).
- **statBar** — 8-15 % annual replacement churn, 2,000-10,000 cards in orientation-week issuance, ISO/IEC 7810 ID-1 form factor, DESFire EV3 AES-128 default chip tier.
- **comparePanel** — DESFire EV3 vs HID iCLASS SE vs MIFARE Classic 1K for campus one-card across cryptography, reader cost, key management overhead, FERPA compatibility, multi-vendor service stacking.
- **dataHighlight** — **"2019 → 2026"** — the Apple Wallet + Google Wallet student-ID adoption arc, from the October 2019 Apple Campus Cards launch at 8 universities to the current hybrid campus pattern where plastic remains the issuance baseline and wallet overlay is an expected add-on rather than a replacement.
- **timeline** — HID Prox student cards (1990s) → MIFARE Classic 1K era (2000s) → DESFire EV1/EV2 adoption for campus one-cards → Apple Campus Cards launch Oct 2019 (Duke, Alabama, Oklahoma, Johns Hopkins, Santa Clara, Mercer, Temple, Vanderbilt) → DESFire EV3 (2020) → Google Wallet student IDs (2022) → hybrid campus one-card pattern (2023-2025) → integrator deployment closer.
- **sources[10]** — ISO/IEC 7810, ISO/IEC 14443-1, ISO/IEC 10373-1, NXP DESFire EV3, NXP AN10922, FERPA statute/regulation, Apple Newsroom October 2019 Campus Cards announcement, Google Wallet student ID support page, Transact eAccounts, CBORD CS Gold campus card.
- **Blocker C** — "Deployment patterns integrators follow on dormitory-access, library-self-service, campus-meal-plan, print-release and exam-authentication student-ID programmes."

## Validation

`npx astro sync` — clean, 914 ms.
Inbound refs — 6 (_pillar + industries/education + solutions/rfid-access-control + rfid-employee-badge cross-link + lp + compare).
