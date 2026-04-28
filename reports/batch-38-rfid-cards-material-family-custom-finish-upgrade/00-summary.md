# Batch 38 — rfid-cards material-family + custom-finish cluster (SHALLOW → DEEP)

**Parent task:** #297 (completed)
**Per-page tasks:** #298 / #299 / #300 / #301 / #302 (all completed)
**Verify task:** #303 (completed)
**Reports task:** #304 (this batch)

## Cluster theme

Five rfid-cards pages covering material-substrate and custom-finish decisions: three wooden/natural-substrate variants differentiated by vertical, a metal B2B vCard card, and the custom-printing master page tying the cluster to offset / UV digital / dye-sub production.

## Pages upgraded

| # | Slug | Focus | DEEP blocks | Sources | Inbound refs |
|---|------|-------|-------------|---------|--------------|
| 1 | rfid-bamboo-card | Fastest-renewable ESG narrative (Moso 3–5yr vs hardwood 30–80yr) | statBar + comparePanel + dataHighlight + timeline | 10 | 7 |
| 2 | rfid-wooden-card | Access / loyalty variant — FSC / PEFC hardwood, grain-pattern uniqueness | statBar + comparePanel + dataHighlight + timeline | 10 | 8 |
| 3 | wooden-nfc-business-card-engraved | Bespoke B2B vCard tap-card — CO2 laser + NTAG216 | statBar + comparePanel + dataHighlight + timeline | 10 | 5 |
| 4 | rfid-metal-business-card | Premium executive — 316L / brass / PVD + ferrite decoupling + fibre laser | statBar + comparePanel + dataHighlight + timeline | 10 | 8 |
| 5 | nfc-card-custom-printing | Custom print master — CMYK offset / UV digital / dye-sub / finishing | statBar + comparePanel + dataHighlight + timeline | 10 | 4 |

## Framework audit summary

Every page in the batch satisfies the DEEP framework baseline:

- `keywords[6]` on every page
- `brief[12]` labelled `{label, items[]}` objects on every page
- `sections[]` containing one each of `statBar`, `comparePanel`, `dataHighlight`, `timeline`
- `sources[10]` five-field (`label, url, publisher, publishedAt, accessedAt, note`)
- Blocker C anchor phrase (`"Deployment patterns integrators follow on …"`) present in the final timeline item on every page

## Validation gates

- `npx astro sync` — clean, 659 ms on the final pass.
- Inbound-ref threshold — all 5 pages ≥ 4.
- Orphan-ref scan — zero unresolved internal hrefs across all 5 pages.
- DEEP block audit — 100 % pass across all 5 pages.

## Differentiation across the three wooden variants

The three wooden/bamboo pages share substrate and chip choices but diverge sharply in narrative and Blocker C anchors:

- **rfid-bamboo-card** — sustainable-gift, hotel-eco-programme, conference-giveaway, brand-activation-eco, nfc-welcome-card. Lead with Moso 3–5 year regrowth vs 30–80 year hardwood (dataHighlight).
- **rfid-wooden-card** — sustainable-hotel-key, premium-brand-giveaway, wine-estate-tasting-room, real-estate-lead-magnet, artisan-retail-packaging. Lead with grain-pattern uniqueness (every card unique).
- **wooden-nfc-business-card-engraved** — architect-studio, luxury-boutique, high-end-realtor, executive-exec-portfolio, sustainability-consulting. Lead with NTAG216 888-byte full vCard in one NDEF record.

Each page's comparePanel explicitly positions against the other two, so the cluster reads as a coherent material-family decision tool rather than three near-duplicates.

## Deferred

- Task #296 — 4 rfid-cards duplicate-pair merge-dedup investigation (mifare-desfire-ev3 singular/plural, mifare-ultralight-c singular/plural, dual-frequency vs rfid-dual-frequency, transparent-nfc vs transparent-clear-nfc). Defer to a dedicated merge batch.
