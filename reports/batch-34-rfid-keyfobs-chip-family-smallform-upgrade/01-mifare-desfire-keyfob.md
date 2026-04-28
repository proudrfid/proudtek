# Page 1/6 — mifare-desfire-keyfob.json

**Route:** `/products/rfid-keyfobs/mifare-desfire-keyfob/`
**Prior depth:** SHALLOW → **DEEP**
**Status:** ✅ sync clean, DEEP audit clean, inbound-ref 13.

## Anchor set

ISO/IEC 14443-3 / 14443-4, ISO/IEC 7816-4, NFC Forum Type 4 Tag, NIST FIPS 197 (AES-128), NIST SP 800-38B (CMAC), NXP AN10922 (DESFire key-diversification), NXP AN12343 (DESFire EV3 datasheet), BSI TR-02102-1 (key-length guidance), Common Criteria EAL5+ certification, ISO/IEC 27001 A.9 access-control clauses, NIST FIPS 201-3 (PIV cards), NXP MIFARE Classic security bulletin.

## DEEP blocks

- `statBar` — AES-128 / 2KB-8KB EEPROM / 4-28 app slots / EAL5+.
- `comparePanel` — MIFARE Classic 1K (CRYPTO-1 proven-broken) vs DESFire EV3 (AES-128 mutual + CMAC + SP 800-38B).
- `dataHighlight` — NXP October 2015 security bulletin deprecating CRYPTO-1 for new deployments + Garcia-2008 academic attack context.
- `timeline` — CRYPTO-1 → EV3 migration in Mode A (coexistence) / Mode B (hybrid) / Mode C (cutover), with Blocker C phrase in the final item: *"Deployment patterns integrators follow on enterprise-access, transit-consortium, campus multi-application, PIV-aligned federal-contractor and high-security-residential DESFire-keyfob programmes."*

## Brief (12 objects, ≥11 required)

Air-interface envelope / on-chip security / application-slot model / integrator ecosystem / enterprise-access posture / transit-consortium posture / campus posture / federal-contractor PIV posture / high-security-residential posture / form-factor + mechanical / regulatory + disclosure / deployment-economics.

## Sources (12 five-field)

All 12 include `label`, `url`, `publisher`, `publishedAt`, `accessedAt`, `note`. Spans ISO / IEC, NIST, NXP datasheet + application notes, BSI, Common Criteria, NXP security bulletin.

## Inbound-ref count

13 — heavily wired (pillar + em4305-keyfob + t5577-keyfob + dual-frequency + coin-keyfob + wristwatch + abs/metal/silicone/leather/epoxy siblings + mifare-desfire-ev3 card cluster).
