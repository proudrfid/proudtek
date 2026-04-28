# mifare-ultralight-c-card — SHALLOW → DEEP (+ plural dedup)

**Route.** `/products/rfid-cards/mifare-ultralight-c-card/`

**Anchor standards & citations.**
- NXP MIFARE Ultralight C (MF0ICU2) — 3DES mutual authentication (112-bit effective key), 192 bytes user memory (48 × 4-byte pages), NFC Forum Type 2 Tag, ISO/IEC 14443-3 Type A.
- NXP Application Note AN11136 — 3DES key diversification scheme used for procurement-grade deployments.
- NIST SP 800-67 Rev. 2 — TDEA (Triple Data Encryption Algorithm) specification underlying the Ultralight C mutual authentication.
- Nohl / Plötz 2008 Crypto-1 break — the event that drives Ultralight C adoption for disposable programmes that cannot tolerate Classic cloning risk.
- Apple Core NFC (iOS 14+) + Android NFC — both read NDEF from public Ultralight C pages without an app install.
- Positioning relative to NTAG and DESFire: Ultralight C sits between Ultralight EV1 (password-only) and DESFire EV3 (AES-128) at ~40-60% lower per-card cost than DESFire.

**DEEP block inventory.**
- `statBar.items[4]` — 192 B user memory / 3DES mutual auth / 40-60% below DESFire / MOQ 500 blank, 1,000 printed.
- `comparePanel` — Ultralight / Ultralight EV1 (password-only, brute-forceable) vs Ultralight C (3DES 112-bit, this page) / DESFire EV3 (AES-128, reusable tier).
- `dataHighlight` — "144 B" free user memory after UID/config/key/counter overhead; usage examples for fare, access token, or loyalty payload.
- `timeline` — 2001-2004 Ultralight → 2008 Crypto-1 break (European metro €2-5M/yr loss anchor) → 2009 NXP releases Ultralight C → 2012-15 NFC Forum Type 2 consumer NDEF → 2016 AN11136 → 2020-24 DESFire displaces for reusable, Ultralight C consolidates to true disposable tier → 2026 Today (Blocker C anchor: "events-venue-single-use, transit-single-ride, hotel-disposable-key, conference-badge, and one-time-visitor programmes").

**Brief.** 12 `{label, items[]}` objects covering chip identity (distinct from Ultralight / EV1), air interface & NFC Forum classification, memory layout & capacity, security posture (3DES + AN11136 diversification), positioning vs Classic/DESFire, card body & slot geometry (incl. 0.3 mm PET turnstile variant + paper/Tyvek inlay), factory pre-encoding & manifests, QC on bulk runs (NXP chip certificate + 3DES spot-check log), print & personalise, programme fit & deployment patterns, procurement realities, compliance & end-of-life.

**Sources[10].** NXP MF0ICU2 Ultralight C short-form spec, NXP AN11136 key diversification, NIST SP 800-67 Rev. 2 TDEA, ISO/IEC 14443-3, NFC Forum Type 2 Tag Operation Specification, ISO/IEC 7810, ISO/IEC 10373-1, Nohl/Plötz USENIX 2008 Crypto-1 attack, Apple Core NFC framework documentation, Android Developers NFC basics.

**Merge & dedup.** Absorbed the bulk-procurement failure-mode content from the plural `mifare-ultralight-c-cards.json` (default transport-key not set; OTP/lock bits pre-set; counterfeit chip substitution; missing UID manifest; dimensional drift) into a "Bulk-procurement failure modes Proud Tek eliminates" section on the canonical page. Added 301 redirect `/products/rfid-cards/mifare-ultralight-c-cards/` → `/products/rfid-cards/mifare-ultralight-c-card/` in `public/_redirects`. Plural source file deleted.

**Inbound refs (7).** `_pillar`, `mifare-desfire-ev3-card`, `mifare-plus-se-card`, `mifare-classic-1k-card`, `guides/mifare-ultralight-c-chip-encyclopedia`, `guides/mifare-desfire-ev3-commands-reference`, `industries/hospitality`.

**Outbound orphan scan.** 0 orphans across 10 hrefs.

**Task.** #316 completed.
