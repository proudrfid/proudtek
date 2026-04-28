# Page 3/5 — rfid-employee-badge.json (Task #291)

**Before:** SHALLOW — no keywords array, string-array brief, 0 sources, no block sections
**After:** DEEP framework complete

## Anchor stack

ISO/IEC 7810 · ISO/IEC 10373-1 · ISO/IEC 14443 · NIST FIPS 201-3 (PIV) · NIST SP 800-73-4 · NIST SP 800-116 · HID iCLASS SE / SEOS · SIA OSDP v2.2 · NXP DESFire EV3 · ISO/IEC 19794-5 (ICAO face-image specification for card photos).

## DEEP block summary

- **keywords[6]** — RFID employee badge, enterprise access badge, HID iCLASS SEOS badge, MIFARE DESFire EV3 badge, FIPS 201 PIV badge, multi-site access credential.
- **brief[12]** — labelled objects covering ISO/IEC 7810 card body, visual layering (dye-sub face, holographic OVD, UV/IR covert), chip tier ladder (EM4100 → iCLASS CSN → SEOS → DESFire EV3 → PIV), FIPS 201-3 / SP 800-73-4 PIV architecture, SP 800-116 risk-matched assurance, SIA OSDP v2.2 reader-controller channel, physical access + logical access + cafeteria + print + time-attendance stacking, printer/encoder flow (Fargo, Zebra, Evolis), photo quality (ISO 19794-5), lifecycle (provisioning, replacement, revocation), regional regulatory notes.
- **statBar** — ISO/IEC 7810 ID-1 form factor, AES-128 + CMAC at SEOS / DESFire tier, 300 dpi dye-sub print default, 3-5 yr plastic life / 5-10 yr chip life.
- **comparePanel** — HID Prox vs iCLASS SE/SEOS vs DESFire EV3 vs PIV side-by-side on frequency/standard, cryptography, reader compatibility, key management, typical deployment scale.
- **dataHighlight** — **"750-1,250 replacement badges per year"** on a 5,000-employee estate (15-25 % annual replacement rate from loss, damage, role change, new hires). This is the ongoing replenishment load — the reason enterprise badge buyers need dual-sourced supply and pre-encoded stock agreements rather than one-off orders.
- **timeline** — HID Prox 125 kHz baseline (1991) → ISO/IEC 14443 (2000) → FIPS 201 / HSPD-12 (2004-2005) → iCLASS SE (2012) → DESFire EV1/EV2/EV3 arc → SEOS (2013) → OSDP v2.2 (2018) → FIPS 201-3 (2022) → integrator deployment closer.
- **sources[10]** — ISO/IEC 7810, ISO/IEC 10373-1, ISO/IEC 14443-1, NIST FIPS 201-3, NIST SP 800-73-4, NIST SP 800-116, HID iCLASS SE / SEOS product brief, SIA OSDP v2.2 specification, NXP DESFire EV3 product page, ISO/IEC 19794-5.
- **Blocker C** — "Deployment patterns integrators follow on enterprise-multi-site-access-control, time-attendance, cashless-cafeteria-payments, secure-print-release and data-centre-access employee-badge programmes."

## Validation

`npx astro sync` — clean, 1.02 s.
Inbound refs — 10 (highest in batch: _pillar + 5 solutions/lp + 3 industries + 1 compare + 1 internal rfid-cards cross-link).
