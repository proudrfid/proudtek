# Page 1/5 — `mifare-desfire-ev3-card.json` MID → DEEP

**Route**: `/products/rfid-cards/mifare-desfire-ev3-card/`
**Previous state**: MID (keywords present, brief as string array, partial sources, no dataHighlight)
**Upgrade state**: DEEP (framework-complete)
**Inbound refs**: 42 · **Sync**: clean (936 ms)

## Anchor set

ISO/IEC 14443 Type A · ISO/IEC 7816-4 APDU · NIST FIPS 197 (AES) · NIST SP 800-38B (CMAC) · Common Criteria EAL5+ (AVA_VAN.5 / ALC_DVS.2) · NXP AN10922 (key diversification) · NXP AN12343 (DESFire EV3 features) · NFC Forum Type 4 Tag · APTA TCRP Report 115 · EN 1545 (transport interoperability) · Garcia et al. CRYPTO 2008 (Crypto-1 break)

## DEEP block inventory

- `statBar`: multi-app file system capacity + AES-128 / 3DES / DES / CMAC crypto suite + EAL5+ hardware posture
- `comparePanel`: DESFire EV3 vs DESFire EV2 vs MIFARE Classic 1K trade-off
- `dataHighlight` (new): *"150–180 ms"* — DESFire EV3 fare-gate tap cycle vs USD 30 Flipper Zero Classic clone rig — section title *Throughput and security economics*
- `timeline`: NXP DESFire roadmap EV1 (2008) → EV2 (2016) → EV3 (2020) → 2026 deployment phase containing the Blocker C anchor

## brief[]

12 labelled objects covering: (1) chip genealogy, (2) AES-128 mutual authentication mechanics, (3) ISO/IEC 14443-4 + 7816-4 APDU surface, (4) EV3 delta vs EV2, (5) file system + application-tree capacity, (6) transit-fare cycle physics, (7) enterprise multi-app consolidation math, (8) EAL5+ + AVA_VAN.5 posture, (9) SUN / SDM dynamic URL output, (10) key diversification per AN10922, (11) reader-side integration + OEM ecosystem, (12) EU/US government employee credential usage.

## sources (12 five-field)

NXP product page + AN12343 + AN10922 + FIPS 197 + SP 800-38B + ISO/IEC 14443 + ISO/IEC 7816-4 + NFC Forum T4 + Common Criteria cert cert + APTA TCRP 115 + EN 1545 + Garcia CRYPTO 2008.

## Blocker C

Final timeline item (*Phase 5 — 2026 → forward*) closes with: *"Deployment patterns integrators follow on transit-fare-collection, campus-multi-application-credential, enterprise-access-control, government-employee-ID and hospitality-keycard DESFire-EV3 programmes."*

## Notes

- Existing statBar and comparePanel retained; dataHighlight added as new section between comparePanel and timeline
- Sources block grew from 7 partial entries to 12 five-field entries; publisher + accessedAt populated throughout
- brief[] restructured from 9 string entries to 12 labelled `{label, items[]}` objects; no deployment claims made in Results/Outcome prose
