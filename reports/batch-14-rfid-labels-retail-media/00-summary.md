# Batch 14 — rfid-labels retail + media + thin-page catch-up

**Scope:** 6 rfid-labels SKUs spanning retail (apparel hang tag, jewelry, retail price), library media (book spine) and NFC thin-page catch-up (food traceability, event ticket).
**Date:** 2026-04-23
**Cluster progress:** 36 / 58 rfid-labels SKUs refined (~62%).

## SKUs refined

| SKU | Treatment | Sec | FAQ | Sources |
| --- | --- | --- | --- | --- |
| uhf-rfid-apparel-hang-tag-retail | FAQ + hygiene | 3 | 3→5 | 0→8 |
| uhf-rfid-jewelry-label | FAQ + hygiene | 3 | 3→5 | 0→8 |
| uhf-rfid-retail-price-label | Depth + FAQ + hygiene | 2→4 | 3→5 | 0→8 |
| rfid-book-spine-label | Depth + FAQ + hygiene | 2→4 | 3→5 | 0→8 |
| nfc-food-traceability-label | Depth + FAQ + hygiene | 2→4 | 3→5 | 0→8 |
| nfc-event-ticket-sticker | Depth + FAQ + hygiene | 2→4 | 3→5 | 0→8 |

## Depth-extension additions (2 → 4 sections)

### uhf-rfid-retail-price-label
- **"GS1 Sunrise 2027, 2-D carrier coexistence at POS and item-level EPC encoding"** — GS1 Sunrise 2027 (UPC/EAN + DataMatrix/QR + RFID tri-encoding); GS1 Digital Link URI; SGTIN-96 per TDS 2.0; Walmart T2/T3, Target, Macy's, Kroger supplier mandates; EPCIS 2.0 (ISO/IEC 19987) to Oracle Retail / Manhattan Active Omni / IBM Sterling OMS / SAP Customer Activity Repository.
- **"POS integration, EAS coexistence and self-checkout loss-prevention physics"** — three SCO architectures (RFID-tunnel Decathlon/Uniqlo; RFID-pad; smart-cart Amazon Dash/Caper/Veeve); Sensormatic AM 58 kHz + Checkpoint RF 8.2 MHz + UHF RFID three-layer combined pedestal (Synergy / Nedap !D Top / EVOLVE); camera-based SCO shrink (Diebold Vynamic / NCR Halo / Everseen) vs RFID-enabled; ESL (SES-imagotag, Pricer, Hanshow) coexistence.

### rfid-book-spine-label
- **"ISO 28560 RFID-in-libraries data model, ISO 15693 HF physics and why libraries chose HF over UHF"** — ISO 28560-1/2/3 three-part standard; 26 data elements; ISO 15511 ISIL; HF 13.56 MHz (ISO 15693/14443) vs UHF 860-960 MHz — the deliberate library choice (read-range, privacy, stacked-book attenuation).
- **"ILS / LMS integration — SIP2, NCIP and the big four library software platforms"** — SIP2 (3M legacy) vs NCIP (NISO Z39.83); SirsiDynix Symphony/BLUEcloud/Horizon, Innovative Polaris/Sierra, Ex Libris Alma (Clarivate), Koha; AMH sorters (Lyngsoe, FE Technologies, P.V. Supa, Tech Logic).

### nfc-food-traceability-label
- **"FSMA Section 204 Critical Tracking Events, Key Data Elements and the Food Traceability List"** — 21 CFR Part 1 Subpart S (effective Jan 20, 2026); FTL scope (cheeses, eggs, leafy greens, seafood, RTE salads); CTE categories (Harvest, Cooling, Initial Packing, FLBR, Shipping, Receiving, Transformation); EU parallel — Reg (EC) 178/2002 Article 18 + Reg (EU) 2017/625 + Farm-to-Fork COM(2020) 381 + Reg (EU) 1379/2013 CMO + IUU-fishing Reg 1005/2008.
- **"GS1 Digital Link, EPCIS 2.0 visibility events and the data interoperability layer"** — GS1 Digital Link URI tri-encoding (NDEF + QR + EPC); EPCIS 2.0 ObjectEvent/AggregationEvent/TransactionEvent/TransformationEvent; IFT FDA low-cost traceability challenge; Mitre CDC Foodborne Investigation Tool.

### nfc-event-ticket-sticker
- **"NFC vs dynamic QR vs rotating-seed QR vs blockchain ticketing — the anti-fraud architecture"** — Ticketmaster SafeTix / AXS Mobile ID dynamic QR vs NFC UID vs NTAG424 DNA SUN (AES-128 per AN12196) vs blockchain/NFT (ERC-721/ERC-1155 on Ethereum/Polygon/Flow/Solana); fraud-mitigation spectrum.
- **"Venue operations, access-control integration and the Global Biometric Standards landscape"** — stadium/arena access stack (gate + zone + F&B/merch); Venue Solutions Group, Legends, Aramark, Levy, Sodexo Live!; IAVM + SEAT best practice; MSG Sports / AEG / OVG / ASM Global / Oak View Group biometric-assisted credentials; GDPR/CCPA privacy envelope.

## FAQ extensions (3 → 5) — regulator / integration specific

- **uhf-rfid-apparel-hang-tag-retail**: retailer RFID mandates (Walmart, Target, Macy's, Nordstrom, Dillard's, JCPenney, H&M, Zara/Inditex, Uniqlo, Lululemon, Nike, Adidas, PVH, Levi's) + Auburn ARC Category D1; EU ESPR 2024/1781 + EU Textile Strategy + DPP roadmap 2027-2030.
- **uhf-rfid-jewelry-label**: Kimberley Process (KPCS 81 jurisdictions) + OECD 5-step Due Diligence + EU 2017/821 + RJC + De Beers Tracr / Everledger; EAS coexistence (Sensormatic AM 58 kHz, Checkpoint RF 8.2 MHz, combined pedestals).
- **uhf-rfid-retail-price-label**: Walmart T2/T3 + Target + Macy's + Nordstrom + Dillard's + JCPenney + Kroger pilot + Home Depot + Dick's retailer mandates + Auburn ARC Cat A/B/C/D/F/H; ESL (SES-imagotag, Pricer, Hanshow) coexistence at shelf vs RFID on item.
- **rfid-book-spine-label**: ISO 28560-2 + ISO 15511 ISIL encoding profile (Bibliotheca liber8, FE Technologies, Ex Libris Alma, Innovative Polaris, SirsiDynix); SIP2/NCIP + AMH (Lyngsoe, FE Technologies, P.V. Supa, Tech Logic) workflow.
- **nfc-food-traceability-label**: EUDR 2023/1115 (cattle, cocoa, coffee, palm oil, rubber, soya, wood) — DDS + plot-level GPS + TRACES NT — compliance date Dec 30, 2025 (large) / June 30, 2026 (SME); cold-chain architecture — identification label + separate temperature logger (ELPRO LIBERO, Sensitech TempTale, Berlinger, DeltaTrak, Emerson GO) vs integrated sensor SKU (SL13A, SL900A, AS3955).
- **nfc-event-ticket-sticker**: Ticketmaster SafeTix / AXS Mobile ID / SeatGeek / StubHub / Eventbrite / Dice platform integration + 2024-2026 industry direction (mobile-first + NFC hospitality backup + biometric gate); NTAG213/216 UID vs signature-record vs NTAG424 DNA SUN AES-128 tier model.

## Hygiene fixes (all 6 SKUs)

- Legacy `/product/...` imageSourceRoutes → intra-cluster `/products/rfid-labels/...` (2 entries per SKU; apparel-hang-tag-retail was already correct).
- primaryAction.href `/contact/` → `/contact/rfid-labels-tags/`.
- Dates: publishedAt 2026-04-22 + modifiedAt 2026-04-23 + reviewedAt 2026-04-22 → 2026-04-23.
- sources[] arrays appended (8 entries each, schema: label + url, publisher optional).

## Verification

- `npx astro sync` — clean generation (824 ms).
- Legacy `/product/` route count across all 6 SKUs: **0**.
- Primary action href across all 6 SKUs: **/contact/rfid-labels-tags/**.
- sources[] across all 6 SKUs: **8 entries each**.
- Sections: retail-price, book-spine, food-traceability, event-ticket at 4; apparel-hang-tag and jewelry at 3 (inherited depth from prior batches).
- FAQ: all 6 at 5 entries.
- reviewedAt across all 6: 2026-04-23.

## Thematic cohesion

Batch 14 clusters three retail/media/thin-page domains:

1. **Retail item-level RFID (3 SKUs)** — apparel hang tag, jewelry, retail price label. Through-line is retailer RFID supplier mandates (Walmart/Target/Macy's/Kroger), Auburn ARC certification categories, GS1 Sunrise 2027 2-D-at-POS transition, and EAS coexistence physics. All three converge on SGTIN-96 item-level encoding as the compliance backbone.
2. **Library/Media (1 SKU)** — book spine label. Through-line is ISO 28560 + ISO 15693 HF + ISIL + SIP2/NCIP to SirsiDynix/Innovative/Ex Libris/Koha. Deliberately separated from UHF retail to honor the library industry's HF choice.
3. **NFC consumer traceability (2 SKUs)** — food traceability, event ticket. Through-line is FSMA 204 + EUDR + EU Farm-to-Fork for food; Ticketmaster SafeTix + biometric-assisted access for events. Both use NTAG213/216 baseline + NTAG424 DNA SUN upgrade path for cryptographic authentication.

## Cluster progress

- rfid-labels total: 58 SKUs.
- Refined through Batch 14: 36 SKUs (~62%).
- Remaining: 22 SKUs spanning long-tail blank/paper media (uhf-rfid-paper-label, uhf-rfid-blank-label, rfid-wet-inlay, rfid-dry-inlay), remaining NFC thin-page (nfc-cannabis-tracking-label, nfc-art-provenance-tag, nfc-electronics-warranty-label, nfc-sneaker-authentication-tag variant pages), inlay/chip-component pages already partially covered, and specialty environment labels.

## Next batch proposal — Batch 15

**Specialty / thin-page catch-up bundle** (6 SKUs):
- `nfc-cannabis-tracking-label`
- `nfc-art-provenance-tag`
- `nfc-electronics-warranty-label`
- `long-range-uhf-windshield-sticker`
- `rfid-document-tracking-label`
- `rfid-laundry-label` (or equivalent textile-laundry SKU if present in rfid-labels)

Thematic anchor: regulatory-driven thin-page consolidation — state cannabis seed-to-sale traceability (METRC, BioTrack, Leaf Data Systems, OpenTHC), art/cultural-heritage provenance (UNESCO 1970 Convention, ICOM Red Lists), electronics warranty + EU right-to-repair + ESPR, government document tracking.

## Task status

- #141 Batch 14 audit parent → **completed**.
- Batch 15 tasks pending creation on user authorization.
