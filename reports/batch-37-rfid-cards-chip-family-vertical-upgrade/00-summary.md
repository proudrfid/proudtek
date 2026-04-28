# Batch 37 — rfid-cards chip-family + vertical-badge SHALLOW → DEEP

**Batch parent task:** #288
**Scope:** 5 rfid-cards pages spanning HF-library, UHF-logistics, enterprise-badge, consumer-accessory and education-vertical chip families
**Framework target:** DEEP (keywords≥6 + brief≥11 labelled objects + statBar + comparePanel + dataHighlight + timeline + sources≥8 five-field + Blocker C anchor)

## Pages upgraded

| # | Page | Task | Anchor stack |
|---|---|---|---|
| 1 | icode-slix-card.json | #289 | ISO/IEC 15693 · 18000-3 Mode 1 · NXP SL2S2002/2602 · ISO 28560-2 · Danish Data Model 2.0 · NFC Forum Type 5 · BISG · ETSI EN 300 330 · FCC 15.225 |
| 2 | uhf-rfid-card.json | #290 | GS1 EPC Gen2v2.1 · ISO/IEC 18000-63 · Impinj Monza R6/M700/M800 · NXP UCODE 8/9 · Alien Higgs-9 · ETSI EN 302 208 · FCC 15.247 · ARIB STD-T106 |
| 3 | rfid-employee-badge.json | #291 | ISO/IEC 7810 · 10373-1 · 14443 · NIST FIPS 201-3 · SP 800-73-4 · SP 800-116 · HID iCLASS SE/SEOS · SIA OSDP v2.2 · DESFire EV3 · ISO/IEC 19794-5 |
| 4 | rfid-blocking-card.json | #292 | ISO/IEC 14443 · 10373-6 · 7810 · EMVCo Contactless · Kfir & Wool 2005 · Garcia ESORICS 2008 · UK Finance Annual Fraud · FTC consumer guidance · ICAO 9303 |
| 5 | rfid-student-id-card.json | #293 | ISO/IEC 7810 · 14443 · 10373-1 · DESFire EV3 · NXP AN10922 · FERPA · Apple Campus Cards (Oct 2019) · Google Wallet · Transact · CBORD |

## DEEP audit (all five pages)

| page | kw | brief | statBar | comparePanel | dataHighlight | timeline | sources | 5-field | Blocker C |
|---|---|---|---|---|---|---|---|---|---|
| icode-slix-card | 6 | 12 | ✓ | ✓ | ✓ | ✓ | 10 | 10 | ✓ |
| uhf-rfid-card | 6 | 12 | ✓ | ✓ | ✓ | ✓ | 10 | 10 | ✓ |
| rfid-employee-badge | 6 | 12 | ✓ | ✓ | ✓ | ✓ | 10 | 10 | ✓ |
| rfid-blocking-card | 6 | 12 | ✓ | ✓ | ✓ | ✓ | 9 | 9 | ✓ |
| rfid-student-id-card | 6 | 12 | ✓ | ✓ | ✓ | ✓ | 10 | 10 | ✓ |

All 5 pages meet framework minimums.

## Inbound-ref coverage (≥4 threshold)

| page | start | added | final | hosts |
|---|---|---|---|---|
| icode-slix-card | 4 | 0 | 4 | _pillar + industries/libraries + guides/chip-encyclopedia + solutions |
| uhf-rfid-card | 2 | 2 | 4 | _pillar + rfid-wristbands/uhf-rfid-wristband + **lp/bulk-rfid-cards** + **solutions/rfid-access-control** |
| rfid-employee-badge | 10 | 0 | 10 | _pillar + 5 solutions/lp + 3 industries + 1 compare |
| rfid-blocking-card | 1 | 3 | 4 | _pillar + **lp/bulk-rfid-cards** + **lp/rfid-card-manufacturer-china** + **lp/rfid-smart-card-manufacturer** |
| rfid-student-id-card | 6 | 0 | 6 | _pillar + industries/education + solutions/access-control + lp + compare |

Two pages required top-up inbound refs (uhf-rfid-card, rfid-blocking-card). All added as contextually appropriate resourceCards links in adjacent LP / solutions pages, not manufactured filler.

## Orphan-ref scan

Result: **0 orphaned internal refs** across the 5 upgraded pages. External citation URLs (nxp.com, hidglobal.com, epc-rfid.info, apple.com, etc.) correctly filtered from internal-route detection.

## Sync validation

`npx astro sync` completed clean after each page write (906-1,020 ms). Final post-inbound-top-up sync: 914 ms clean.

## Blocker C anchor-phrase compliance

All 5 pages close the final timeline item with the canonical phrase: *"Deployment patterns integrators follow on [vertical] [domain] programmes"* — contextualised per page:

- icode-slix-card → library-self-service / file-folder-tracking / gas-bottle-fleet / industrial-laundry-staff / records-management
- uhf-rfid-card → vehicle-gate-access / speed-lane-turnstile / hands-free-healthcare-zone / warehouse-personnel-safety / conference-session-tracking
- rfid-employee-badge → enterprise-multi-site-access-control / time-attendance / cashless-cafeteria-payments / secure-print-release / data-centre-access
- rfid-blocking-card → consumer-wallet-shielding / bank-co-brand-promotion / corporate-welcome-kit / travel-accessory-retail / access-badge-portfolio-protection
- rfid-student-id-card → dormitory-access / library-self-service / campus-meal-plan / print-release / exam-authentication

## Notable editorial decisions

**rfid-blocking-card threat-model reframing.** The previous SHALLOW copy carried unsubstantiated quantitative claims (e.g. "25-35 % higher contactless adoption", "90 %+ recipient satisfaction", "zero unauthorised badge cloning incidents") that violated the Blocker C evidence discipline. The DEEP rewrite anchors instead to the actual fraud surface — EMVCo contactless transaction caps (EUR 50 / GBP 100 / USD 100), EMV tokenisation, UK Finance fraud data, FTC consumer guidance, and the Kfir & Wool 2005 / Garcia 2008 academic literature on skimming attack economics. The page now positions blocking cards honestly: a low-cost wallet-kit accessory whose primary job is customer reassurance rather than demonstrable fraud reduction, since EMV tokenisation and transaction caps have already substantially closed the exploit window since 2012.

**rfid-student-id-card — Apple Campus + Google Wallet arc.** The dataHighlight uses the literal "2019 → 2026" span to capture the adoption curve from Apple Campus Cards launching at 8 universities (Duke, Alabama, Oklahoma, Johns Hopkins, Santa Clara, Mercer, Temple, Vanderbilt) in October 2019 to the current Google Wallet / Apple Wallet hybrid campus pattern. Plastic-card deployments remain the issuance baseline; the arc describes how digital overlay has become expected rather than replacement.

**uhf-rfid-card dataHighlight.** "600-1,200 per hour per lane" captures UHF's genuine throughput advantage over NFC in speed-lane and vehicle-gate access scenarios — the economic differentiator versus HF cards at the same credential-management tier.

**rfid-employee-badge dataHighlight.** "750-1,250 replacement badges per year" on a 5,000-employee estate quantifies the ongoing replenishment load that distinguishes enterprise badge programmes from one-off card orders — this is why enterprise buyers need dual-sourced supply and pre-encoded stock agreements.

## Deferred follow-ups

Task #296 [pending] — 4 rfid-cards duplicate-pair merge-dedup investigation:
- mifare-desfire-ev3-card / mifare-desfire-ev3-cards
- mifare-ultralight-c-card / mifare-ultralight-c-cards
- dual-frequency-rfid-card / rfid-dual-frequency-card
- transparent-nfc-card / transparent-clear-nfc-card

Deferred to a separate batch because the merge-absorb pattern (cf. rfid-tyvek-wristband, rfid-anti-metal-tag) requires a different workflow — full ref-audit → canonical pick → 301 redirect → source file deletion — rather than the standard SHALLOW→DEEP rewrite.
