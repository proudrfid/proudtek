# Batch 15 — rfid-labels specialty verticals (regulatory-driven)

**Date:** 2026-04-23
**Cluster:** `rfid-labels`
**SKUs refined:** 6
**Cluster progress after batch:** 42 / 58 (~72 %)

## Scope

Batch 15 targeted the remaining thin SKUs in the rfid-labels cluster whose value narrative is driven primarily by a specific **regulatory / compliance framework** rather than chip-family or form-factor specs. Each SKU sits at the intersection of RFID item-level traceability and a named statute / directive / international standard, which made the depth extension a matter of naming the framework precisely and mapping the EPC + user-memory payload to the required compliance fields.

| SKU | Regulatory anchor |
| --- | --- |
| nfc-cannabis-tracking-label | State seed-to-sale (Metrc, BioTrack, Leaf Data, MJ Freeway, OpenTHC) + 2018 Farm Bill / CSA + Canadian CTLS |
| nfc-art-provenance-tag | UNESCO 1970 / UNIDROIT 1995 / CITES / NAGPRA / EU 2019/880; ALR / Interpol / TPC databases |
| nfc-electronics-warranty-label | Magnuson-Moss Warranty Act / FTC 2018 warnings / EU 2019/771 / EU 2024/1799 R2R / EU 2024/1781 ESPR DPP |
| long-range-uhf-windshield-sticker | Fleet/yard TMS+WMS integration (Manhattan, Blue Yonder, SAP, Oracle, Körber, PINC, C3) + RFID-vs-ALPR trade-off |
| rfid-frozen-food-label | HACCP Codex CAC/RCP 1-1969 + FSMA 204 Food Traceability List + EU 852/2004 + cold-chain loggers (Sensitech, ELPRO, Berlinger) |
| rfid-plant-nursery-label | USDA APHIS PPQ + ISPM 15 + EU Plant Health Reg 2016/2031 + plant passport (2017/2313); nursery ERP (SBI, ANS, MyPlantShop) |

## Treatment (applied uniformly to all 6 SKUs)

1. **Sections 2 → 4** — appended two regulatory-framework + integration-layer sections per SKU.
2. **FAQ 3 → 5** — appended one regulatory-compliance Q&A + one software/integration Q&A per SKU.
3. **Dates** — added `publishedAt: "2026-04-22"` + `modifiedAt: "2026-04-23"` + bumped `reviewedAt` to `"2026-04-23"`.
4. **Sources** — appended 8-entry `sources[]` array to each SKU (label + url + publisher, schema-valid).
5. **imageSourceRoutes** — migrated any legacy `/product/...` to intra-cluster `/products/rfid-labels/<slug>/` neighbors.
6. **primaryAction** — migrated `/contact/` → `/contact/rfid-labels-tags/`.

## Verification

- `npx astro sync` — clean, 806 ms, zero schema errors.
- `grep -c '"/product/'` across all 6 — all 0.
- Counts: all 6 show `sec=4`, `faq=5`, `src=8`, `rev=2026-04-23`, `pa=/contact/rfid-labels-tags/`.

## Thematic cohesion

Batch 15 reads as the **regulatory-driven specialty verticals** layer of the rfid-labels cluster — each SKU's competitive moat is not the chip or substrate (those are commodified) but rather the **correct encoding of the regulatory payload into the EPC + user-memory** and the **integration with the reference software stack** for that vertical. The batch captures six parallel frameworks:

- **Controlled-substance supply chain** (cannabis seed-to-sale across fragmented state regimes)
- **Cultural-heritage due diligence** (art provenance under overlapping international conventions)
- **Consumer-protection warranty** (electronics DPP under Magnuson-Moss + EU ESPR)
- **Fleet/yard access control** (windshield sticker as RFID-vs-ALPR choice in TMS+WMS stack)
- **Cold-chain food safety** (frozen food under FSMA 204 + HACCP + EU hygiene package)
- **Plant health phytosanitary** (nursery stock under APHIS PPQ + ISPM 15 + EU plant passport)

Taken together with Batches 13-14 (retail/apparel/jewelry + retail-media + library/book + ticketing), Batch 15 closes the **high-regulatory-intensity** SKUs and leaves Batch 16 to finish the **commodity inlay/paper/blank media** tail plus the remaining **generic NFC form factors** (tap-to-pay, shelf label, smart poster, table stand).

## Batch 16 candidates

- **Thin generic NFC SKUs:** `nfc-tap-to-pay-sticker`, `nfc-shelf-label`, `nfc-smart-poster-tag`, `nfc-social-media-tag`, `nfc-table-stand`, `nfc-gaming-collectible-tag`
- **Commodity media tail:** `uhf-rfid-paper-label`, `uhf-rfid-blank-label`, `uhf-rfid-inlay`, `nfc-wet-inlay`, `nfc-dry-inlay`
- **Remaining inlay SKUs:** `impinj-m730-uhf-inlay`, `impinj-m750-uhf-inlay`
- **Remaining specimen/thin:** `rfid-specimen-slide-label`

Estimated Batch 16 size: 6 SKUs → cluster 48 / 58 (~83 %).
