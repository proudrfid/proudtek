# Page 3/5 — `mifare-plus-se-card.json` MID → DEEP

**Route**: `/products/rfid-cards/mifare-plus-se-card/`
**Previous state**: MID (migration-oriented narrative, no dataHighlight, 5 partial sources)
**Upgrade state**: DEEP (framework-complete)
**Inbound refs**: 19 · **Sync**: clean (916 ms)

## Anchor set

ISO/IEC 14443 Type A · ISO/IEC 7810 ID-1 · NIST FIPS 197 · NIST SP 800-38B (CMAC) · NXP MIFARE Plus SE datasheet · NXP AN10922 · Common Criteria EAL4+ · HID iCLASS SE / SALTO XS4 / ASSA Aperio / dormakaba firmware references · Garcia et al. CRYPTO 2008 (Crypto-1 break) · ISO/IEC 10373-6 (test methods)

## DEEP block inventory

- `statBar`: AES-128 security level SL1/SL2/SL3 + MIFARE Classic backward compatibility + EAL4+ hardware posture
- `comparePanel`: MIFARE Plus SE vs MIFARE Classic 1K vs DESFire EV3 (migration ladder trade-off)
- `dataHighlight` (new): *"70–85%"* reader capex deferred across a 3–5 year window on a 5,000-reader estate (EUR 2.0–3.5M) vs DESFire rip-and-replace — section title *Migration economics*
- `timeline`: Crypto-1 break (2008) → MIFARE Plus X (2010) → Plus EV1 → Plus SE (2018) → 2026 phased-migration phase containing the Blocker C anchor

## brief[]

12 labelled objects covering: (1) Plus family genealogy (X / EV1 / SE), (2) SL1 → SL2 → SL3 staged migration model, (3) Crypto-1 → AES-128 crypto swap, (4) ISO/IEC 14443 + 7810 air-interface + form factor, (5) AN10922 key diversification in mixed fleet, (6) reader firmware update paths (HID iCLASS SE, SALTO XS4, Aperio, dormakaba), (7) EAL4+ certification posture, (8) fleet economics (reader capex deferral math), (9) phased-rollout risk (gate-by-gate vs big-bang), (10) issuance workflow (re-encoding vs re-issue), (11) Classic backward compatibility rules, (12) SL3-only mandate trigger conditions.

## sources (10 five-field)

NXP MIFARE Plus SE datasheet + AN10922 + FIPS 197 + SP 800-38B + ISO/IEC 14443 + ISO/IEC 7810 + ISO/IEC 10373-6 + Common Criteria cert cert + Garcia CRYPTO 2008 + HID/SALTO/Aperio/dormakaba firmware refs (bundled).

## Blocker C

Final timeline item (*Phase 4 — 2026 → forward*) closes with: *"Deployment patterns integrators follow on large-enterprise-Classic-migration, multi-year-campus-rollout, hospitality-keycard-upgrade, healthcare-staff-ID and phased-access-control MIFARE-Plus-SE programmes."*

## Notes

- dataHighlight anchors the Plus SE buying decision on capex-deferral math — an economic pivot unique to Plus in the chip family ladder
- 5 partial sources → 10 five-field sources; reader-OEM firmware anchors moved from inline prose to first-class sources[] entries
- brief[] restructured from 10 string entries to 12 labelled objects; no customer-specific migration claims made in Results prose
