# Page 1/6 — rfid-weapon-tracking-tag

**Route**: `/products/rfid-tags/rfid-weapon-tracking-tag/`
**Task**: #202
**Status**: ✅ MID → DEEP complete

## Regulatory anchor

- MIL-STD-130N IUID Construct #2 (EID / IAC / PNO / SEQ) + DoD IUID Registry via PIEE / iRAPT
- AR 190-11 Physical Security of AA&E (Army) + OPNAVINST 5530.13C (Navy) + AFI 31-101 (Air Force) + MCO 5530.14A (Marines)
- ATF 27 CFR Part 478 FFL bound-book + ATF Form 4473 + eForm 3 / 4 / 5 disposition
- NATO STANAG 2495 Weapons Marking for Identification and Tracing
- NIBIN ballistic imaging database + EU 2021/555 Firearms Directive recast tracing

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

Six form factors keyed to armory / operational / forensic flow: (1) inside-stock
cavity inlay, (2) rail-mount Picatinny tag, (3) serialized trigger-guard wrap,
(4) armorer service-card NTAG424 DNA, (5) holster / scabbard patch, (6) grenade
/ pyro container tag.

## Cross-reference health

- Inbound refs: 7
- Outbound unique: 9
- Orphans: 0 (imageSourceRoutes repaired from legacy `/product/...` to `/products/rfid-tags/anti-metal-uhf-it-asset-tag/` + `/products/rfid-keyfobs/mifare-desfire-keyfob/`)

## Validation

`npx astro sync` clean (895 ms). Re-sync post-orphan-fix clean (826 ms).
