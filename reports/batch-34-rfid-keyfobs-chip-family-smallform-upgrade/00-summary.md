# Batch 34 — rfid-keyfobs chip-family + small-form cluster (SHALLOW → DEEP)

**Date:** 2026-04-24
**Scope:** 6 rfid-keyfobs SKUs upgraded from SHALLOW to the full DEEP editorial framework.
**Reviewer:** peter-zhang
**Status:** ✅ All pages cleared DEEP audit + inbound-ref (≥4) + orphan scan + `npx astro sync`.

## Pages upgraded

| # | Slug | Anchor posture | Brief | Sources | Inbound refs |
|---|------|----------------|-------|---------|--------------|
| 1 | `mifare-desfire-keyfob` | ISO/IEC 14443 + NFC Forum Type 4 + NIST FIPS 197 AES-128 + NXP AN10922 + BSI TR-02102-1 + Common Criteria EAL5+ + ISO/IEC 27001 A.9 + NIST FIPS 201-3 | 11 | 12 | 13 |
| 2 | `em4305-keyfob` | ISO/IEC 18000-2 + EM4305 datasheet + ISO 11784/11785 FDX-B + HID Prox H10301 + SIA OSDP v2.2 + IEC 60529 + RoHS 3 | 11 | 9 | 6 |
| 3 | `t5577-keyfob` | ISO/IEC 18000-2 + ATA5577 datasheet + HID Prox H10301/Corporate 1000 + SIA OSDP v2.2 + BSI TR-02102-1 + IEC 60529 + RoHS 3 + REACH | 11 | 8 | 4 |
| 4 | `dual-frequency-key-fob` | ISO/IEC 18000-2 + ISO/IEC 14443 + ISO/IEC 15693 + SIA OSDP v2.2 + NXP MIFARE Classic bulletin + HID Prox + NXP AN10922 + RoHS 3 | 11 | 10 | 4 |
| 5 | `rfid-coin-keyfob` | ISO/IEC 14443 + NXP AN12343 + NXP MIFARE Classic bulletin + Garcia 2008 + NIST FIPS 197 + BSI TR-02102-1 + NAMA industry data + IEC 60529 IP67 + RoHS 3 + REACH | 11 | 11 | 4 |
| 6 | `rfid-wristwatch-tag` | ISO/IEC 14443 + ISO/IEC 18000-2 + ISO 22810 water-resistance + IEC 60529 + ASTM F2182 phantom wrist + ISO 10993-5/-10 + EN 1811 Ni-release + REACH Annex XVII + NXP AN12343 + RoHS 3 | 11 | 13 | 4 |

## Cluster theming

Four chip-anchored pages (mifare-desfire + em4305 + t5577 + dual-frequency) paired with two form-factor pages (coin + wristwatch) where chip-selection logic dominates. Mutually-distinct regulatory-anchor sets preserved across all 6 pages:

- **mifare-desfire-keyfob** — enterprise-access, transit-consortium, campus, PIV, high-security residential (AES-128 + CMAC + CRYPTO-1 migration)
- **em4305-keyfob** — multi-tenant-residential, storage-facility, co-working, OSDP retrofit, HID Prox emulation
- **t5577-keyfob** — multi-vendor-legacy, locksmith duplication, reader commissioning, red-team audit, integrator inventory (distinct from em4305 via universal-emulation envelope)
- **dual-frequency-key-fob** — system-migration, multi-building-campus, parking-plus-office, mixed-tenant-portfolio, LF-to-HF bridge
- **rfid-coin-keyfob** — cashless-laundry, unattended-vending, self-serve-carwash, pay-per-use-locker, arcade-micropayment (NAMA industry anchor + Nayax / USA Technologies controller posture)
- **rfid-wristwatch-tag** — resort-all-inclusive, waterpark-cashless, fitness-club-access, industrial-worker-ID, senior-living (on-wrist antenna tuning + watch-IP-67/22810 + ISO 10993 biocompatibility)

## Verify pass results

- `npx astro sync` — clean, 936 ms.
- DEEP audit (Python): all 6 pages `keywords=6`, `brief≥11` object array, all 4 DEEP blocks (`statBar`, `comparePanel`, `dataHighlight`, `timeline`) present, `sources≥8` with five-field shape (`label, url, publisher, publishedAt, accessedAt, note`), Blocker C anchor phrase ("Deployment patterns integrators follow on … programmes") embedded in final timeline item.
- Inbound-ref grep — all 6 pages at ≥ 4 (lowest: t5577-keyfob, dual-frequency, coin, wristwatch at 4; em4305 at 6; mifare-desfire at 13).
- Orphan scan on outbound `/products/*`, `/compare/*`, `/solutions/*`, `/industries/*` hrefs — zero orphans across all 6 pages.

## Inbound-ref wiring edits (post-write)

To clear the ≥4 threshold on the three lightest-in-linked pages, the following sibling files were edited to add resourceCards links:

- `rfid-wristbands/rfid-waterpark-wristband.json` → added link to `rfid-wristwatch-tag`
- `rfid-wristbands/nfc-fitness-wristband.json` → added link to `rfid-wristwatch-tag`
- `rfid-wristbands/rfid-adjustable-silicone-wristband.json` → added link to `rfid-wristwatch-tag`
- `rfid-keyfobs/rfid-abs-keyfob.json` → added links to `t5577-keyfob` + `rfid-coin-keyfob`
- `rfid-keyfobs/rfid-metal-keyfob.json` → added link to `t5577-keyfob`

## Programme status after Batch 34

rfid-keyfobs SHALLOW cluster reduced from 8 SHALLOW entries → 2 remaining (`nfc-epoxy-key-tag`, `rfid-coin-tag`), which roll into Batch 35 closeout. All 6 Batch 34 pages now at DEEP parity with Batch 33's material-family cluster.
