# Page 2/6 — rfid-livestock-leg-band

**Route**: `/products/rfid-tags/rfid-livestock-leg-band/`
**Task**: #212
**Status**: ✅ MID → DEEP complete

## Regulatory anchor

- USDA NPIP (National Poultry Improvement Plan) 9 CFR 145-147 breeder + commercial poultry
- EU Regulation 2019/2035 + 1308/2013 poultry CMO + 21/2004 sheep-goats adjacent
- ICAR Section 5.7 cattle fetlock + Section 10.8 sheep-goat fetlock + Section 5 dairy parlour
- USFWS Federal Bird Banding 50 CFR Part 21-23 (wildlife adjacent)
- CITES Appendix I psittacines + raptors + Appendix II + USBGA + PIPA + FCI + RPRA + AU pigeon racing
- ISO 11784/11785 FDX-B + ISO 24631 conformance + performance testing

## DEEP compliance

| Block | Status |
|-------|--------|
| keywords[] | 6 ✓ |
| brief[] fields | 11 ✓ |
| sources[] | 10 ✓ |
| sources 5-field | ✓ |
| statBar | ✓ |
| comparePanel | ✓ |
| dataHighlight | ✓ |
| timeline | ✓ |

## Form-factor SKUs

Six leg-band form factors: (1) poultry tarsus 8-14 mm, (2) raptor / psittacine CITES-compliant 10-18 mm, (3) pigeon-racing 8-10 mm, (4) dual-freq layer / breeder 14-18 mm, (5) dairy cow pastern 35-45 mm velcro / ratchet, (6) sheep / goat fetlock 25-35 mm.

## Platforms

Hy-Line 5i + Aviagen RMS + Cobb MX (breeder poultry); DairyComp 305 + DeLaval DelPro + GEA CowScout + BouMatic MPC + Lely Horizon + AfiFarm + NEDAP CowControl (dairy); Unikon + Benzing + Tauris + Bricon (pigeon-racing clocks); USFWS Bird Banding Lab + CITES Trade Database (wildlife).

## Cross-reference health

- Inbound refs: 4 (after +1 addition from rfid-glass-capsule-tag.json)
- Orphans: 0

## Validation

`npx astro sync` clean (849 ms). Full-tree re-sync clean (876 ms) after inbound-top-up.
