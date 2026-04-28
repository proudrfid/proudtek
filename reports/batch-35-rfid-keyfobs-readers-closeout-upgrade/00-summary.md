# Batch 35 — rfid-keyfobs + rfid-readers Closeout Cluster (SHALLOW → DEEP)

**Scope:** 5 pages — 2 rfid-keyfobs closeout (`nfc-epoxy-key-tag`, `rfid-coin-tag`) + 3 rfid-readers full cluster (`desktop-nfc-reader-encoder`, `fixed-uhf-rfid-reader`, `handheld-uhf-rfid-reader`).

**Cluster impact:** Closes out BOTH rfid-keyfobs and rfid-readers clusters to 100% DEEP in a single batch.

## Pages upgraded

| # | Page | Route | Prior | After |
|---|------|-------|-------|-------|
| 1 | nfc-epoxy-key-tag | `/products/rfid-keyfobs/nfc-epoxy-key-tag/` | SHALLOW | DEEP |
| 2 | rfid-coin-tag | `/products/rfid-keyfobs/rfid-coin-tag/` | SHALLOW | DEEP |
| 3 | desktop-nfc-reader-encoder | `/products/rfid-readers/desktop-nfc-reader-encoder/` | SHALLOW | DEEP |
| 4 | fixed-uhf-rfid-reader | `/products/rfid-readers/fixed-uhf-rfid-reader/` | SHALLOW | DEEP |
| 5 | handheld-uhf-rfid-reader | `/products/rfid-readers/handheld-uhf-rfid-reader/` | SHALLOW | DEEP |

## Verify results

**Astro sync:** clean (918 ms, final run).

**DEEP audit** — every page passes on kw=6 / brief≥11 (labelled objects) / all 4 DEEP blocks (statBar + comparePanel + dataHighlight + timeline) / sources≥8 five-field / Blocker C phrase in final timeline item.

| Page | kw | brief | blocks | sources | blockerC |
|------|----|-------|--------|---------|----------|
| nfc-epoxy-key-tag | 6 | 11 | ✅ all 4 | 11 | ✅ |
| rfid-coin-tag | 6 | 12 | ✅ all 4 | 12 | ✅ |
| desktop-nfc-reader-encoder | 6 | 11 | ✅ all 4 | 12 | ✅ |
| fixed-uhf-rfid-reader | 6 | 11 | ✅ all 4 | 12 | ✅ |
| handheld-uhf-rfid-reader | 6 | 11 | ✅ all 4 | 12 | ✅ |

**Inbound-ref (≥4 threshold):**

| Page | Inbound | Notes |
|------|---------|-------|
| nfc-epoxy-key-tag | 6 | passes without wiring |
| rfid-coin-tag | 5 | passes after 3 wiring edits (see below) |
| desktop-nfc-reader-encoder | 11 | passes without wiring |
| fixed-uhf-rfid-reader | 9 | passes without wiring |
| handheld-uhf-rfid-reader | 9 | passes without wiring |

**Orphan scan:** zero orphan hrefs across all 5 pages.

## Wiring edits (inbound-ref for rfid-coin-tag)

rfid-coin-tag was initially inbound=2 (pillar + rfid-coin-keyfob). Three sibling-edit wiring passes pushed inbound to 5:

1. `rfid-keyfobs/rfid-abs-keyfob.json` — added rfid-coin-tag link to "Related keyfob and access-credential tags" resourceCards alongside existing rfid-coin-keyfob link.
2. `rfid-tags/rfid-coin-tag.json` — added rfid-keyfobs/rfid-coin-tag link to cross-cluster resourceCards (small-form disc gaming/token-dispenser sibling).
3. `rfid-keyfobs/nfc-epoxy-key-tag.json` — added rfid-coin-tag link to "Related keyfob + epoxy-form adjacents" resourceCards (both small-form rfid-keyfobs siblings).

## Anchor programme per page (abbreviated)

- **nfc-epoxy-key-tag** — ISO 4892-2 xenon-arc UV weathering (1,000h, ΔE≤2) + EN 1811 Ni-release + NTAG424 DNA SUN/CMAC + boutique-fitness/hospitality-loyalty/pet-ID/digital-business-card programmes.
- **rfid-coin-tag** — IEC 60068-2-32 Ea drop-test (1.0m × 1,000 cycles) + token-dispenser ±0.1mm tolerance + casino-chip sequential laser-engraving + AGA 2024 gaming-commission chip-audit benchmark (100,000 chips in <4 hours).
- **desktop-nfc-reader-encoder** — PC/SC + CCID (ISO/IEC 7816-4 + USB CCID v1.1) vendor-neutral stack + NTAG424 DNA SUN/CMAC authoring at 600-1,200 cards/hour per station.
- **fixed-uhf-rfid-reader** — EPC Gen2 v2.1 / ISO 18000-63 + LLRP + 300-600 tags/sec dense-reader-mode throughput (Auburn U RFID Lab + Impinj published) + EU Tire Regulation 2024/1257 exit-portal posture.
- **handheld-uhf-rfid-reader** — 65-70% manual → 95%+ weekly-audit accuracy lift (Auburn U RFID Lab retail benchmark 2022-2024) + MIL-STD-810H 1.5-2.4m drop + USDA 9 CFR Part 86 livestock traceability.

## Blocker C phrases (final timeline item)

- **nfc-epoxy-key-tag** — *"Deployment patterns integrators follow on boutique-fitness, hospitality-loyalty, pet-ID, digital-business-card, tap-to-earn-loyalty and brand-merchandise NFC-epoxy-key-tag programmes."*
- **rfid-coin-tag** — *"Deployment patterns integrators follow on multi-family-laundry, gaming-arcade, casino-table-chip, municipal-parking, locker-credit and loyalty-promotional RFID-coin-token programmes."*
- **desktop-nfc-reader-encoder** — *"Deployment patterns integrators follow on hotel-keycard-issuance, corporate-badge-bureau, city-transit-ticket-office, library-LMS-issuance and government-PIV-enrolment desktop-NFC-encoder programmes."*
- **fixed-uhf-rfid-reader** — *"Deployment patterns integrators follow on retail-ceiling-inventory, logistics-dock-door, automotive-tire-exit-portal, aerospace-MRO-toolroom and pharmaceutical-DSCSA fixed-UHF-reader programmes."*
- **handheld-uhf-rfid-reader** — *"Deployment patterns integrators follow on livestock-herd-management, warehouse-cycle-count, retail-floor-audit, industrial-laundry-bundle and field-asset-audit handheld-UHF-reader programmes."*

## Programme status after Batch 35

- **rfid-keyfobs cluster:** 100% DEEP (14/14 pages).
- **rfid-readers cluster:** 100% DEEP (3/3 pages).

Both clusters close out simultaneously; Batch 36 advances to the next SHALLOW cluster backlog.
