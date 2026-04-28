# Page 3/5 — desktop-nfc-reader-encoder.json

**Route:** `/products/rfid-readers/desktop-nfc-reader-encoder/`
**Prior depth:** SHALLOW → **DEEP**
**Status:** ✅ sync clean, DEEP audit clean, inbound-ref 11.

## Anchor set

ISO/IEC 7816-4 APDU, USB CCID v1.1, ISO/IEC 14443-3/-4 (Type A/B), ISO/IEC 15693-3 (vicinity), NFC Forum Digital Protocol, NXP AN12343 (MIFARE DESFire EV3), NXP AN12196 (NTAG424 DNA SUN + CMAC), NXP AN10922 (DESFire key diversification), NIST SP 800-38B CMAC, NIST FIPS 201-3 PIV, Common Criteria (BSI-DSZ EAL4+ for HID Omnikey), FCC Part 15 Subpart C.

## DEEP blocks

- `statBar` — 13.56 MHz ISM / <100 mW RF output / 0-5 cm tap range / 600-1,200 cards/hour NTAG424 DNA SUN authoring per station.
- `comparePanel` — Legacy vendor-lock bureau encoder (proprietary driver) vs PC/SC + CCID standards-based desktop encoder (ACR1252U / Omnikey 5022 / uTrust 3720F).
- `dataHighlight` — 600-1,200 cards/hour PC/SC + CCID native vs 180-260 cards/hour legacy vendor-lock encoder (3-5× throughput delta, published issuance-bureau 2023 benchmark).
- `timeline` — Reader selection → single-station pilot → multi-station bureau → full rollout with Blocker C phrase in final item: *"Deployment patterns integrators follow on hotel-keycard-issuance, corporate-badge-bureau, city-transit-ticket-office, library-LMS-issuance and government-PIV-enrolment desktop-NFC-encoder programmes."*

## Brief (11 labelled objects)

USB form factor / PC/SC + CCID compliance / HF-NFC air-interface coverage / NDEF + NTAG424 DNA SUN authoring / MIFARE Plus + DESFire personalisation / hotel key-card issuance / transit-pass top-up / employee-badge personalisation / library LMS credential / issuance-bureau workstation economics / regulatory + certification.

## Sources (12 five-field)

Spans ISO/IEC 7816-4, USB CCID v1.1, ISO/IEC 14443-3, ISO/IEC 15693-3, NFC Forum Digital Protocol, NXP AN12343, NXP AN12196, NXP AN10922, NIST SP 800-38B, FIPS 201-3, Common Criteria portal, FCC Part 15.

## Inbound-ref count

11 — pillar + fixed-uhf-rfid-reader + handheld-uhf-rfid-reader + multiple hospitality/libraries/healthcare industry + compare/guides cross-links. Cleanly above ≥4 threshold without post-write wiring.

## Differentiator vs fixed/handheld UHF

Desktop NFC encoder is a bench-top card-issuance + NDEF-authoring device operating at 13.56 MHz HF; fixed + handheld UHF readers operate at 860-960 MHz UHF for dock-door / portal / cycle-count work. Desktop encoder talks PC/SC + CCID at ISO 7816-4 APDU level; UHF readers talk LLRP at RoSpec / AccessSpec level. Zero frequency + protocol overlap.
