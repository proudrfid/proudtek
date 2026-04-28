# Batch 13 — rfid-labels logistics + automotive

**Scope:** 6 rfid-labels SKUs covering logistics (airline baggage, shipping, asset, pallet) and automotive/vehicle-access (tire, windshield).
**Date:** 2026-04-23
**Cluster progress:** 30 / 58 rfid-labels SKUs refined (~52%).

## SKUs refined

| SKU | Treatment | Sec | FAQ | Sources |
| --- | --- | --- | --- | --- |
| rfid-airline-baggage-tag | FAQ + hygiene | 6 | 3→5 | 0→8 |
| rfid-asset-label | FAQ + hygiene | 3 | 3→5 | 0→8 |
| rfid-shipping-label | FAQ + hygiene | 6 | 3→5 | 0→8 |
| uhf-rfid-pallet-label | Depth + FAQ + hygiene | 2→4 | 3→5 | 0→8 |
| uhf-rfid-tire-label | Depth + FAQ + hygiene | 2→4 | 3→5 | 0→8 |
| uhf-rfid-windshield-label | FAQ + hygiene | 3 | 3→5 | 0→8 |

## Depth-extension additions (2 → 4 sections)

### uhf-rfid-pallet-label
- **"GS1 SSCC encoding, EPCIS visibility events and ASN EDI 856 alignment — why the data structure matters as much as the tag"** — GS1 SSCC 18-digit format + SSCC-96 EPC encoding per TDS 2.0; EPCIS 2.0 JSON-LD visibility events (ISO/IEC 19987); ASN EDI 856 (ANSI X12) and DESADV (UN/EDIFACT); GS1 Digital Link URI; GS1 application identifiers (AI 00, AI 02, AI 37, AI 400-series).
- **"Dense-reader portal physics, the Walmart / Target / Kroger RFID mandates and how the label is engineered to survive the RF environment"** — FCC Part 15.247 (902-928 MHz, 4 W EIRP) vs ETSI EN 302 208 (865-868 MHz, 2 W ERP); ISO/IEC 18000-63:2015 Dense Reader Mode + Miller-subcarrier; circular vs linear polarization; Walmart/Target/Home Depot/Kroger/Dick's/Nordstrom supplier mandates; Auburn University RFID Lab ARC Category 6 certification.

### uhf-rfid-tire-label
- **"NHTSA TREAD Act, FMVSS 139, EU Tyre Regulation 2020/740 and UNECE R117 — the regulatory context for tire lifecycle tracking"** — 49 CFR §574 TIN (13-character plant+size+manufacturer+DOT-date); TREAD Act 2000 post-Firestone; FMVSS 139 pneumatic radial tire performance; EU 2020/740 (fuel efficiency / wet grip / rolling noise + EPREL QR); UNECE R117 global homologation.
- **"Automotive Tier-1 OEM RFID programs, TPMS pairing and fleet telematics integration"** — Michelin MEMS / Track Connect, Bridgestone Tirematics, Continental ContiPressureCheck, Goodyear CheckPoint; TPMS (FMVSS 138 / EU 661/2009) vs passive UHF (complementary, not replacement); Geotab / Samsara / Michelin Effitires / Webfleet fleet telematics; ISO/TS 20910/20911; EU ELV 2000/53/EC + ESPR 2024/1781 + EUDR 2023/1115 natural-rubber DPP.

## FAQ extensions (3 → 5) — regulator / integration specific

- **rfid-airline-baggage-tag**: IATA Resolution 753 four-checkpoint architecture (check-in / loading / transfer / delivery) with SITA BagJourney + SITA BagManager + airline DCS (Amadeus Altéa, Sabre SabreSonic, Lufthansa Systems) + BSM/BTM format per IATA PSC Res 751a; Delta / Qatar / Cathay / Lufthansa / AF-KLM / Emirates / American / IAG deployment patterns, $0.10-0.30 tag cost offset by $2.50-$4.00 operational savings per passenger (SITA Baggage IT Insights).
- **rfid-asset-label**: SOX Section 404 / PCAOB AS 2201 internal-controls evidence mapping; PCI DSS 4.0 Req 12.5.1 system-component inventory (CDE scope); NIST SP 800-53 CM-8 + CM-8(3) + CM-8(4) continuous monitoring for FedRAMP/FISMA/DoD RMF. ServiceNow ITAM / IBM Maximo / Ivanti Neurons / Jamf Pro + Intune integration patterns (2-6 week middleware).
- **rfid-shipping-label**: GS1 Sunrise 2027 initiative — 2-D carrier (DataMatrix/QR with Digital Link URI) coexistence with traditional UPC/EAN and RFID at POS; USPS / UPS SmartLabel / FedEx Memphis World Hub / Amazon FBA / Vendor Flex + retail supplier mandates; single-design label satisfies all carriers via variable EPC format at print-and-encode.
- **uhf-rfid-pallet-label**: Auburn University ARC Category 6 + Walmart T2/T3 + Target RFID certification; EPCIS 2.0 (ISO/IEC 19987) middleware bridge between Impinj Speedway / Zebra FX9600 LLRP and SAP EWM / Manhattan Active WM / Blue Yonder / Oracle WMS Cloud / Körber K.Motion — 3-6 month pilot, ROI on portal deployment.
- **uhf-rfid-tire-label**: EU 2020/740 EPREL label + sidewall DOT TIN + embedded RFID three-layer coexistence + GS1 Digital Link URI DPP roadmap; TREAD Act 49 CFR §579 early-warning reporting, §573 defect reports, §574 tire identification — RFID simplifies compliance but statutory obligations unchanged; NHTSA early-warning data quality improvement from manual to machine-captured.
- **uhf-rfid-windshield-label**: E-ZPass/SunPass/FasTrak 6C electronic toll collection (ISO/IEC 18000-63 passive UHF) — interoperability requires agency-issued transponder ID, NOT appropriate for public tolling without agency agreement; C-V2X / 5G-V2X on 5.9 GHz ITS band per FCC 20-164 + 3GPP Release 14/16 — distinct technology from passive UHF vehicle identification, both coexist for different purposes.

## Hygiene fixes (all 6 SKUs)

- Legacy `/product/...` imageSourceRoutes → intra-cluster `/products/rfid-labels/...` (2 entries per SKU).
- One legacy `/product/rfid-windshield-tag/` resourceCard link on rfid-airline-baggage-tag redirected to `/products/rfid-labels/uhf-rfid-windshield-label/`.
- primaryAction.href `/contact/` → `/contact/rfid-labels-tags/`.
- Dates: publishedAt 2026-04-22 + modifiedAt 2026-04-23 + reviewedAt 2026-04-22 → 2026-04-23.
- sources[] arrays appended (8 entries each, schema: label + url, publisher optional).

## Verification

- `npx astro sync` — clean generation (833 ms).
- Legacy `/product/` route count across all 6 SKUs: **0**.
- Primary action href across all 6 SKUs: **/contact/rfid-labels-tags/**.
- sources[] across all 6 SKUs: **8 entries each**.
- All 6 SKUs at ≥3 sections, 5 FAQs, 8 sources.

## Thematic cohesion

Batch 13 clusters two logistics/mobility domains:

1. **Supply-chain logistics (4 SKUs)** — airline baggage, shipping, asset and pallet labels. The through-line is GS1 EPCIS 2.0 + SSCC-96 + IATA Resolution 753 + retail supplier mandate certification (Auburn ARC). All four pages converge on the same data-standard architecture (GS1 Digital Link URI) that will carry the 2027 Sunrise / DPP transition.
2. **Automotive / vehicle mobility (2 SKUs)** — tire and windshield labels. Through-line is regulatory-driven lifecycle tracking — TREAD Act + EU 2020/740 for tires, E-ZPass 6C + C-V2X for vehicle access — with careful honest framing that RFID is the physical-identity anchor and not a replacement for TPMS, active V2X telematics or regulatory QR labeling.

## Cluster progress

- rfid-labels total: 58 SKUs.
- Refined through Batch 13: 30 SKUs (~52% — over half-way).
- Remaining: 28 SKUs spanning library/laundry/jewelry/retail-apparel + remaining thin pages (nfc-cannabis-tracking-label, nfc-food-traceability-label, nfc-art-provenance-tag, nfc-electronics-warranty-label, nfc-event-ticket-sticker) + the long-tail blank/paper media SKUs.

## Next batch proposal — Batch 14

**Retail / apparel / library / laundry bundle** (6 SKUs):
- `uhf-rfid-apparel-hang-tag-retail`
- `uhf-rfid-jewelry-label`
- `uhf-rfid-retail-price-label`
- `rfid-book-spine-label`
- plus 2 thin-page catch-ups (e.g., `nfc-food-traceability-label` [2-sec] + `nfc-event-ticket-sticker` [2-sec])

Thematic anchor: EPC Gen2 retail mandate rollout 2024-2026 + FTC Green Guides / EU Textile Strategy + ISO 18000-63 item-level tagging.

## Task status

- #138 Batch 13 audit parent → **completed**.
- #139–140 individual SKU refine tasks → **completed** (SKU refinements tracked under Batch 13 audit umbrella).
- Batch 14 tasks pending creation on user authorization.
