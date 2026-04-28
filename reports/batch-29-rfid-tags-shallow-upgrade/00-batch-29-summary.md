# Batch 29 — RFID Tags SHALLOW → DEEP Upgrade (Materials / Thermal Cluster)

**Batch date:** 2026-04-24
**Batch type:** SHALLOW → DEEP framework upgrade
**Cluster:** RFID-tag materials / thermal / chemical / flex / textile substrate variants
**Reviewer:** peter-zhang
**Author:** editorial-board

## Scope

Six SHALLOW-state materials / thermal / textile-substrate RFID-tag SKUs upgraded to the DEEP editorial framework — full `keywords[6] + brief[] ≥11 {label, items[]} + 10 five-field sources + 4 DEEP blocks (statBar + comparePanel + dataHighlight + timeline) wrapped in titled sections + Blocker C de-identification ("Deployment patterns integrators follow on...") + expanded narrative sections + regulatory anchors`.

Each page was anchored on a distinct regulatory-framework profile to avoid keyword-collision across the cluster:

| # | Page | Regulatory Anchor Profile |
|---|------|---------------------------|
| 1 | high-temperature-rfid-tag-200c | MIL-STD + AEC-Q100 + AMS 2750 + AAMI ST79 + laundry PPS (general 200 °C) |
| 2 | rfid-ceramic-tag | AMS 2750G + Nadcap AC7102 + ATA Spec 2000 + ISO 6474 + ISO 13356 (300-500 °C aerospace / medical ceramic) |
| 3 | rfid-high-temp-silicone-tag | ISO 10993 + FDA 21 CFR 177.2600 + AAMI ST79 + EN 13060 + EHEDG + 3-A Sanitary + EU GMP Annex 1 (medical silicone autoclave) |
| 4 | rfid-epoxy-tag | IPC-A-610H + J-STD-020 + JEDEC JESD22 + UL 94 + RoHS + REACH + ATEX Ex m + API 570 (epoxy encapsulation industrial) |
| 5 | rfid-silicone-flexible-tag | ISO 34-1 + IPC-6013 flex-PCB + SAE J517 hose + EN 397 PPE + ASTM D2137 cold-flex (flex conformable) |
| 6 | rfid-pps-laundry-chip | ISO 15797 + EN ISO 20471 + OEKO-TEX + EN 14065 RABC + TRSA HLAC + AAMI PB70 + ASTM F1671 (textile / uniform-rental) |

## Verification

| # | Page | keywords | brief[] | sources (5-field) | sections (titled) | statBar | compare | dataHi | timeline | inbound | de-id |
|---|------|----------|---------|-------------------|-------------------|---------|---------|--------|----------|---------|-------|
| 1 | high-temperature-rfid-tag-200c | 6 | 13 | 10 / all 5-field | 8 / 8 | yes | yes | yes | yes | 9 | yes |
| 2 | rfid-ceramic-tag | 6 | 14 | 10 / all 5-field | 11 / 11 | yes | yes | yes | yes | 7 | yes |
| 3 | rfid-high-temp-silicone-tag | 6 | 14 | 10 / all 5-field | 11 / 11 | yes | yes | yes | yes | 11 | yes |
| 4 | rfid-epoxy-tag | 6 | 14 | 10 / all 5-field | 11 / 11 | yes | yes | yes | yes | 8 | yes |
| 5 | rfid-silicone-flexible-tag | 6 | 15 | 10 / all 5-field | 11 / 11 | yes | yes | yes | yes | 7 | yes |
| 6 | rfid-pps-laundry-chip | 6 | 14 | 10 / all 5-field | 11 / 11 | yes | yes | yes | yes | 12 | yes |

## Schema validation

All six pages pass `npx astro sync` cleanly (800-930 ms each). Zero Zod-violation errors on post-Write validation.

## Inbound-reference audit

All six pages exceed the ≥4 inbound-ref floor (range 7-12). Cross-references within the batch are bidirectional — 13 intra-batch links observed across the cluster.

## Orphan scan

Zero orphans. Every page in the batch has both intra-batch cross-references (from `resourceCards.links` + `secondaryActions`) and external inbound references from other RFID-tag cluster pages, category hubs + industry landing pages.

## Blocker C de-identification

Every page contains the governing phrase "Deployment patterns integrators follow on..." in the validation + operator-integrator section, maintaining consistent boundary-marker neutral language across the cluster.

## Files produced

- `01-high-temperature-rfid-tag-200c.md`
- `02-rfid-ceramic-tag.md`
- `03-rfid-high-temp-silicone-tag.md`
- `04-rfid-epoxy-tag.md`
- `05-rfid-silicone-flexible-tag.md`
- `06-rfid-pps-laundry-chip.md`

## Batch status

**COMPLETE** — all six pages pass DEEP framework audit + schema validation + inbound-ref floor + orphan scan + Blocker C de-identification. Ready for publication.
