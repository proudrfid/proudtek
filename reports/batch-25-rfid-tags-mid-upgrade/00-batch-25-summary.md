# Batch 25 — rfid-tags facility services + consumer MID→DEEP upgrade

**Date:** 2026-04-23 → 2026-04-24
**Scope:** 6 RFID-tag SKUs on the facility-services / consumer-event / smart-city / automotive / parking axis
**Framework:** locked DEEP — keywords[6] + brief ≥11 + statBar + comparePanel + dataHighlight + timeline + 5-field sources ≥8 + Blocker C de-identification
**Outcome:** 6/6 pages Zod-clean, 6/6 ≥4 inbound refs, 0 orphan refs, 0 new orphan refs introduced

## Pages closed

| # | Page | Route | Keywords | Brief | Sources | Inbound |
|---|------|-------|----------|-------|---------|---------|
| 1 | rfid-keg-tag | `/products/rfid-tags/rfid-keg-tag/` | 6 | 12 | 10 | 4 |
| 2 | rfid-race-timing-tag | `/products/rfid-tags/rfid-race-timing-tag/` | 6 | 12 | 10 | 4 |
| 3 | rfid-guard-tour-tag | `/products/rfid-tags/rfid-guard-tour-tag/` | 6 | 11 | 10 | 4 |
| 4 | rfid-waste-bin-tag | `/products/rfid-tags/rfid-waste-bin-tag/` | 6 | 12 | 10 | 4 |
| 5 | rfid-tire-tag | `/products/rfid-tags/rfid-tire-tag/` | 6 | 12 | 10 | 5 |
| 6 | rfid-parking-token | `/products/rfid-tags/rfid-parking-token/` | 6 | 11 | 10 | 4 |

## Blocker C de-identification pattern applied

Every page's prior "Results clients achieve" section carried fabricated customer numerics (percentages, dollar amounts, hour savings attributed to implied but unnamed clients). Every one was rewritten as "Deployment patterns integrators follow on [domain] programmes" with:

- directional-benchmark intro framing (numbers are shape-of-work, not outcomes)
- standards citations replacing implied client references
- dataHighlight block with a qualitative-shift or single-standard-cited value
- 4-phase timeline (Weeks 1-N scoping / spec / pilot / scale-out)

## Standards mobilised across Batch 25

**Brewery keg fleet management:** GS1 GIAI-96 / GRAI-96 / SSCC-96 (Tag Data Standard 2.0), EPCIS 2.0 ObjectEvent, DIN 6647-1 / DIN 6647-2 steel keg dimensional standards, Brewers Association Keg Management Best Practices, BBPA Keg Deposit Scheme guidance, TTB 27 CFR Part 25, FDA 21 CFR §175.105 indirect food contact, EU Commission Regulation 10/2011 on plastic materials in contact with food, EHEDG Doc 8 hygienic design, 3-A Sanitary Standards.

**Race-timing chip timing programmes:** World Athletics Book of Rules Technical Rule 30 (2024), AIMS/IAAF Course Measurement & Certification 2022, World Triathlon Competition Rules 2024 §4, UCI Part 1 Ch. III / 1.2.071, USATF Rule 245, USAC, UKA, World Para Athletics, MYLAPS / ChronoTrack / RFIDTS / J-Chip / RaceResult 12 / RunSignUp ecosystems, ISO/IEC 18000-63:2015 Gen2v2, GS1 TDS 2.0 SGTIN-96 + EPCIS 2.0 ObjectEvent.

**Guard-tour patrol compliance:** ASIS PSC.1 Management Systems for Private Security Operations, ISO 18788:2015, BS 7499:2020 static guarding, BS 7872:2011 manned-security cash-in-transit, BS 8406:2009 event stewarding, EN 50518:2019 alarm-receiving centres, NFPA 601 fire watch, Joint Commission EC.02.01.01 / LS.02.01.35, SOC 2 CC6.4 / CC7.2, ISO/IEC 27001:2022 Annex A.7.1 / A.7.4, PCI DSS v4.0 Req 9.4, NIST SP 800-53 Rev 5 PE-3 / PE-6 / PE-8, FIPS 201-3 PIV, 33 CFR 105 ISPS, NERC CIP-014-2, NFC Forum Type 4 / NTAG424 DNA SUN CMAC AES-128, ISO/IEC 14443-3:2018, MIFARE DESFire EV3.

**Smart-city waste collection:** DIN 30745-1:1997 / DIN 30745-2:1997 waste-bin identification chip & data block, EN 840-1 to EN 840-6:2020 mobile waste containers, RAL-GZ 951/1 quality mark, EU Waste Framework Directive 2008/98/EC as amended by 2018/851, EU Landfill Directive 1999/31/EC, EU Packaging & Packaging Waste Directive 94/62/EC, EU SUP Directive 2019/904, ISO/IEC 18000-2:2009 LF air interface, ISO 11785 FDX-B, ETSI EN 300 330, FCC Part 15 §15.209, US EPA PAYT guidance, ISWA Global Waste Management Outlook 2024, WRAP UK, AMCS / Bucher DataFleet / FAUN GlobalNet / Geesinknorba Telematics / Routeware / Enevo / Bigbelly reader-truck platforms, SAP IS-U, Tyler Munis.

**Digital tyre passport:** ISO 20909:2021 Annex A flex / endurance / plunger / speed RFID-on-tyre qualification, ISO 20910:2022 RFID-on-tyre data content (8-byte + 16-byte + variable blocks), US DOT 49 CFR Part 574 + NHTSA FMVSS 139, UNECE R30 / R54 / R75 / R117 / R108 / R109 / R141 (labelling & retread), EU Regulation 2020/740 tyre labelling + EPREL, EU Regulation 661/2009 / 2018/858, EU Directive 2000/53/EC ELV, WBCSD Tire Industry Project RFID Data Content Guideline, IATF 16949:2016, Bridgestone / Michelin / Continental / Goodyear / Pirelli / Hankook / Yokohama OEM fleet platforms, Bandag / Marangoni / Vipal / UniCircle / Oliver / Galgo retread-layer integrators.

**Parking / gate credentials:** ISO/IEC 14443-3 and -4:2018, ISO/IEC 15693:2018, ISO/IEC 18092:2013 NFCIP-1, ISO/IEC 7816, ISO/IEC 7810, NFC Forum Type 2 / Type 4, EN 15291:2007 parking-equipment identification, EN 12414:1999 parking-equipment data-interchange, FIPS 201-3 PIV, NIST SP 800-73, PCI DSS v4.0 Req 3 / 4 / 9, GDPR 2016/679, CCPA, ETSI EN 300 330 + EN 302 208, ISO 14906:2018 EFC DSRC, Global Platform CPS, IPMI APO, EPA; SKIDATA / Designa / Amano McGann / TIBA / WPS / Scheidt & Bachmann / T2 Systems / ParkMobile / PayByPhone / Flowbird equipment vendors, Genetec AutoVu / Tattile / Neology ANPR overlays, Calypso / ITSO / OV-chipkaart / Suica / Octopus closed-loop transit ecosystems.

## Inbound-link backfills

Five pages required inbound-link backfill to clear the ≥4-reference threshold:

- `rfid-keg-tag` (3 → 4): added link from `products/rfid-tags/rfid-returnable-container-tag.json` "Related logistics tags" resourceCard.
- `rfid-race-timing-tag` (3 → 4): added link from `solutions/rfid-event-wristbands.json` "RFID event wristband products" resourceCard.
- `rfid-guard-tour-tag` (3 → 4): added link from `industries/data-center-it-asset-tracking.json` "Data center RFID products" resourceCard (perimeter-patrol PE-6/PE-8 framing).
- `rfid-waste-bin-tag` (2 → 4): added link from `products/rfid-tags/rfid-pallet-tag.json` "Related products" and `products/rfid-tags/rfid-anti-metal-tag.json` "Related on-metal and industrial RFID SKUs".
- `rfid-parking-token` (2 → 4): added link from `products/rfid-tags/rfid-coin-tag.json` "Related small-format and tool tracking RFID tags" and `solutions/rfid-access-control.json` "Access control credential products".

`rfid-tire-tag` already cleared the threshold at 5 inbound refs and required no backfill.

No pillar pages required edits.

## Keywords backfill

Five of the six pages shipped pre-sync without a `keywords[]` array — the schema treats `keywords` as optional, so sync passed, but the DEEP framework requires `keywords[6]`. Keywords arrays (6 entries each, anchored on the page's core standards and platform vendors) were injected after `heroImage` in all five affected pages before the final sync regression.

## Verification

`npx astro sync` clean on every page after write; cumulative 7 runs, 838–909 ms each. DEEP-threshold classifier passes for all 6 pages (keywords=6, brief ≥11, statBar Y, comparePanel Y, dataHighlight Y, timeline Y, sources=10). Zero orphan refs in `href` walk of all 6 pages against content-collection routes. Corpus-wide orphan-ref count (58) is pre-existing and unchanged by this batch.
