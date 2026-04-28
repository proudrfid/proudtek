# Page 5/6 — rfid-helmet-tag

**Route**: `/products/rfid-tags/rfid-helmet-tag/`
**Task**: #206
**Status**: ✅ MID → DEEP complete

## Regulatory anchor

- ANSI/ISEA Z89.1-2014 (R2019) Industrial Head Protection (Type I / Type II + Classes G / E / C)
- EN 397 industrial / EN 14052 high-performance / EN 12492 climbing / EN 443 fire-fighter helmets
- NFPA 1971 structural fire-fighter + NFPA 1851 selection / care / maintenance + NFPA 1977 wildland
- MIL-DTL-44099 ACH Advanced Combat Helmet + MIL-DTL-32480 ECH Enhanced Combat Helmet + NIJ 0106 ballistic
- OSHA 29 CFR 1910.135 + 29 CFR 1926.100 + EU 2016/425 PPE Regulation Cat. III

## DEEP compliance

| Block | Status |
|-------|--------|
| keywords[] | 6 ✓ |
| brief[] fields | 12 ✓ |
| sources[] | 10 ✓ |
| sources 5-field | ✓ |
| statBar | ✓ |
| comparePanel | ✓ |
| dataHighlight | ✓ |
| timeline | ✓ |

## Form-factor SKUs

Six helmet form factors: (1) inside-shell dual-inlay (UHF + HF), (2) fire-
service NFPA 1971 high-temperature variant, (3) ACH / ECH military ballistic
helmet tag, (4) wildland NFPA 1977 thin-profile, (5) climbing EN 12492 low-
mass sticker, (6) chin-strap sewn patch.

## Platforms

Avetta PPE, SafetyCulture, Origami Risk, Intelex, Cority, Enablon, VelocityEHS,
Procore, Autodesk Construction Cloud, HammerTech, Firehouse, FirstDue, ESO,
Emergency Reporting, ImageTrend Elite, TargetSolutions, MSA FireGrid,
HID/LEGIC/Mifare/PIV/CAC, Gallagher, Genetec, Lenel, Software House, Johnson
Controls OpenBlue.

## Cross-reference health

- Inbound refs: 7
- Outbound unique: 8
- Orphans: 0 (imageSourceRoutes repaired from `/product/rfid-laundry-tags/` + `/product/nfc-stickers/` to `/products/rfid-tags/rfid-textile-laundry-tag/` + `/products/rfid-labels/ntag215-nfc-sticker/`)

## Validation

`npx astro sync` clean (886 ms). Re-sync post-orphan-fix clean (826 ms).
