# Page 3/6 — nfc-pet-tag

**Route**: `/products/rfid-tags/nfc-pet-tag/`
**Task**: #213
**Status**: ✅ MID → DEEP complete

## Regulatory anchor

- NFC Forum Type 2 Tag Specification v1.2 + NDEF 1.0
- ISO/IEC 14443-A:2020 Proximity Integrated Circuit Cards (13.56 MHz)
- AVMA Companion Animal Microchip position + AAHA Universal Pet Microchip Lookup (24 US registries)
- ISO 11784/11785 FDX-B 15-digit implanted microchip (complement, not replacement)
- EU 576/2013 Pet Passport + UK Pet Travel Scheme + Australia DAFF + NZ MPI + CFIA + Japan MAFF
- NXP AN12196 NTAG424 DNA SUN CMAC AES-128 anti-clone for service / show / K-9 dogs

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

Six companion-animal form factors: (1) 25 / 30 mm epoxy disc split-ring, (2) laser-engraved 316L stainless pendant + embedded inlay, (3) silicone slide-over sleeve, (4) die-cut bone / paw / heart custom shape (MOQ 3,000), (5) silicone wristband for multi-pet households, (6) chin-strap sewn variant for working-dog / service-animal / K-9 harness.

## Chip options

NTAG213 (144 bytes URL-only), NTAG215 (504 bytes hybrid), NTAG216 (888 bytes full vCard), NTAG424 DNA (416 bytes + AES-128 SUN CMAC anti-clone).

## Registry interoperability

AAHA Universal Pet Microchip Lookup aggregator + HomeAgain (Merck) + PetLink (Datamars) + AKC Reunite + AVID PETtrac + 24PetWatch + Save This Life + Petkey + Found Animals + InfoPET + BuddyID + MyMicroChip + BanfieldChip.

## Cross-reference health

- Inbound refs: 4 (after +2 additions from rfid-glass-capsule-tag.json + rfid-ear-tag-livestock.json)
- Orphans: 0

## Validation

`npx astro sync` clean (873 ms). Full-tree re-sync clean (876 ms) after inbound-top-up.
