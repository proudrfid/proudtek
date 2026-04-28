# Batch 10 — rfid-labels hygiene + depth SKU refinement

**Date:** 2026-04-23
**Scope:** 6 SKUs under `src/content/editorial/products/rfid-labels/` (3 hygiene-only + 3 depth-extension)
**Status:** Complete. `astro sync` clean (~890 ms). Zero `/product/` legacy routes remaining in the Batch 10 SKUs.

## SKUs refined

| # | SKU slug | sections | faq | sources | primaryAction | treatment | notes |
|---|---|---|---|---|---|---|---|
| 1 | `ntag215-nfc-sticker` | 6 | 5 | 8 | `/contact/rfid-labels-tags/` | hygiene | Sources: NXP NTAG213/215/216 + NT2H1511G0DU datasheet, ISO 14443-3, NFC Forum Type 2 + NDEF, Wi-Fi Alliance WSC, RFC 6350 vCard, Nintendo Amiibo, Apple Core NFC. |
| 2 | `ntag216-nfc-sticker` | 6 | 5 | 8 | `/contact/rfid-labels-tags/` | hygiene | Sources: NXP NTAG213/215/216 + NT2H1611G0DU datasheet, ISO 14443-3, NFC Forum Type 2 + NDEF, RFC 6350, Wi-Fi Alliance WSC, Apple Core NFC, Android NFC. |
| 3 | `nfc-anti-metal-sticker` | 6 | 5 | 8 | `/contact/rfid-labels-tags/` | hygiene | Sources: NXP AN1445 (canonical on-metal antenna), NXP NTAG213/215/216 + NTAG424 DNA, ISO 14443-3, NFC Forum analog+digital, IEEE Finkenzeller antenna reference, NIST SP 800-53 CM-8 (asset inventory), ISO/IEC 27001 A.8.1. |
| 4 | `rfid-dry-inlay` | 4 | 5 | 8 | `/contact/rfid-labels-tags/` | **depth** | Added "Card lamination process — temperatures, pressures and inlay survival" (PVC 140-160 °C vs PC 180-200 °C vs injection-overmold 280 °C; ISO 7810 thickness budget) and "Chip-to-form-factor matching" (hotel/transit vs corporate access vs eID/passport vs UHF luggage tags vs dual-frequency HID+DESFire migration). Extended FAQ with PVC-vs-PC inlay difference and UHF-in-ISO-7810-card tradeoffs. Sources include ISO 7810, ISO 14443-3, ISO 7816, ICAO 9303, NXP AN12343 + AN10922, Garcia 2008 CRYPTO-1 break, IATA 753. |
| 5 | `alien-higgs-9-uhf-inlay` | 4 | 5 | 8 | `/contact/rfid-labels-tags/` | **depth** | Added "Higgs-9 vs M700 vs UCODE 9 — when each one wins" (memory vs small-antenna range vs cost-at-volume decision matrix; crypto-auth note) and "On-tag data storage patterns — when user memory earns its premium" (RTI trip data, utility field-service, pharma traceability, GS1 AI format, anti-patterns). FAQ extended with M800-crypto-migration and 5-10M unit lead-time supply-chain. Sources: Alien Higgs-9 datasheet, ISO 18000-63:2015, GS1 EPC TDS + EPCIS 2.0, RAIN RFID Alliance, FCC 15.247, ETSI EN 302 208, Auburn RFID Lab ARC. |
| 6 | `rfid-tamper-evident-label` | 4 | 5 | 8 | `/contact/rfid-labels-tags/` | **depth** | Added "Two tamper-detection mechanisms — destructive-antenna vs NTAG 424 DNA TagTamper" (analog irreversible-kill vs digital CTTES persistent-status; pick-between-them and stacked-defence guidance). FAQ extended with FDA DSCSA / EU FMD ATD compliance analysis (NFC is not an approved serialization carrier — GS1 DataMatrix is — but satisfies the separate ATD requirement per 2016/161 Art. 5) and shelf-life / environmental-envelope specifics. Sources: NXP NTAG 424 DNA TagTamper + AN12196, EU 2016/161 ATD regulation, EU FMD 2011/62/EU, FDA DSCSA, GS1 DataMatrix, ISO 14443-4, OECD counterfeit-trade figures. |

## Common hygiene applied across all 6 SKUs

Replaced broken legacy `/product/...` routes in `imageSourceRoutes` with valid `/products/<group>/<slug>/` cross-links (verified via `ls`). Fixed `primaryAction.href: "/contact/"` to `/contact/rfid-labels-tags/` on all six. Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`, `reviewedAt: "2026-04-23"` on each. Appended `sources[]` arrays (8 entries per SKU).

## Depth extensions summary

**rfid-dry-inlay** (2→4 sections, 3→5 FAQ) — upgraded from a thin component page into a full buyer's guide for card manufacturers, covering lamination-cycle survival specs, chip-to-form-factor matching for hotel/transit/corporate/eID/passport/UHF-baggage/dual-frequency credential programs, and the PVC-vs-PC inlay distinction that gates ICAO 9303 passport work.

**alien-higgs-9-uhf-inlay** (2→4 sections, 3→5 FAQ) — upgraded into a chip-positioning page against Impinj M700 and NXP UCODE 9, plus a taxonomy of on-tag data-storage patterns that justify Higgs-9's user-memory premium (RTI trip data, field-service records, pharma traceability, GS1 AI format) with anti-patterns flagged (no PII, no crypto, no primary identifier).

**rfid-tamper-evident-label** (3→4 sections, 3→5 FAQ) — added the key explanatory section that had been missing: analog destructive-antenna tamper vs digital NTAG 424 DNA TagTamper CTTES-register tamper, with pick-between-them and stacked-defence-in-depth guidance. FAQ extension clarifies the common misconception that NFC is an approved DSCSA/FMD serialization carrier (it is not — GS1 DataMatrix is; NFC satisfies the separate ATD requirement under EU 2016/161 Art. 5).

## rfid-labels cluster status (post-Batch 10)

12 of 58 SKUs refined (~21%). Flagship layer (Batch 9) and component/hygiene layer (Batch 10) now anchored; remaining ~46 SKUs are industry-application labels (wine/spirits/cosmetics/luxury/sneaker/pharma/blood-bag/medication-vial/cryogenic, plus asset/shipping/airline-baggage/library/laundry/inventory/gun/jewelry/hospital-patient-wristband labels).

## Next up

- **Batch 11 candidates** (next 6-8 SKUs — industry authentication labels cluster): `nfc-wine-bottle-tag`, `nfc-spirits-authentication-label`, `nfc-olive-oil-authentication-label`, `nfc-cosmetics-authentication-label`, `nfc-sneaker-authentication-tag`, `nfc-luxury-handbag-tag`, `nfc-battery-passport-tag`, `nfc-wet-inlay` / `nfc-dry-inlay` (catch thin component pages).
- **Batch 12 candidates** (pharma + supply-chain labels): `rfid-pharmaceutical-label`, `rfid-blood-bag-label`, `rfid-medication-vial-label`, `rfid-cryogenic-label`, `rfid-airline-baggage-label`, `rfid-asset-tracking-label`, `rfid-shipping-label`, plus any remaining anti-metal/tamper variants and library/laundry/inventory labels.
- **Task C** (full `astro build`) still queued for user-local execution.
