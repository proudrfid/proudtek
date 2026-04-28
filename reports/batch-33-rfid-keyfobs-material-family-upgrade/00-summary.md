# Batch 33 — rfid-keyfobs material-family cluster SHALLOW → DEEP

## Scope + milestone

Batch 33 upgrades six `src/content/editorial/products/rfid-keyfobs/*.json` pages from the SHALLOW template to the DEEP framework. The six pages form a **material-family cluster** — one page per housing material — chosen so each regulatory envelope is mutually exclusive and no two pages compete on the same anchor set:

| # | Page | Housing material | Regulatory envelope anchor |
|---|---|---|---|
| 1 | `rfid-abs-keyfob` | Ultrasonically-welded ABS | IEC 62368-1 / UL 94 V-0 / RoHS / REACH / FCC Part 15 / SIA OSDP v2.2 / ISO/IEC 27001 / NIST SP 800-88 |
| 2 | `rfid-epoxy-keyfob` | Seamless epoxy encapsulation | IEC 60529 IP67 / IEC 60068-2-78 / IEC 60068-2-52 / ATEX Zone 2 / NEMA 4X / NFPA 70 Class I Div 2 / 21 CFR 117 / 21 CFR 211 |
| 3 | `rfid-metal-keyfob` | 316L stainless / die-cast zinc / anodised aluminium | ASTM A276 / ASTM A967 / EN 1811 ≤ 0.5 µg/cm²/wk Ni / REACH Annex XVII entries 27+63 / 21 CFR 175 / NSF/ANSI 51 / IEC 60068-2-32 / WEEE Annex VII |
| 4 | `rfid-silicone-keyfob` | Platinum-cured PDMS silicone | ISO 10993-1/5/10 / USP Class VI / FDA 21 CFR 177.2600 / LFGB § 31 / EN 1186 / IEC 60529 IP68 / ISO 20653 IP69K |
| 5 | `rfid-leather-keyfob` | LWG-Gold cowhide / chrome-free / microfiber PU | LWG Gold / IULTCS ISO 17226 Cr(VI) ≤ 3 mg/kg / REACH Annex XVII entries 27+47 / ZDHC MRSL v3.1 / OEKO-TEX Leather / CITES-free / EU Ecolabel |
| 6 | `nfc-wood-keychain-tag` | FSC / PEFC bamboo + walnut + maple + cherry | FSC-STD-40-004 / PEFC / ISO 38200 / EUDR (EU 2023/1115) / EUTR 995/2010 / FLEGT / EN 71-3 / EN 13986 E1 |

**Result:** the rfid-keyfobs material-family axis is now fully DEEP on the six core housing materials — ABS (office), epoxy (outdoor / ATEX), metal (premium / food-plant / NEBS), silicone (aquatic / healthcare / food-contact), leather (luxury hospitality / residential) and wood (sustainable / corporate-gift / EUDR-cleared). No two pages overlap on regulatory anchor set, and each defends its own deployment-pattern Blocker C domain.

## Sync timings

| Page | Sync time |
|---|---|
| `rfid-abs-keyfob` | 855 ms clean |
| `rfid-epoxy-keyfob` | 896 ms clean |
| `rfid-metal-keyfob` | 911 ms clean |
| `rfid-silicone-keyfob` | 973 ms clean |
| `rfid-leather-keyfob` | 917 ms clean |
| `nfc-wood-keychain-tag` | 930 ms clean |

All six pages clean through `npx astro sync` on first or post-fix pass.

## DEEP audit rollup

All six pages meet the DEEP framework floor:

- `keywords` = 6 on every page
- `brief` ≥ 11 `{label, items}` objects on every page
- `sections[]` contains exactly one `statBar`, one `comparePanel`, one `dataHighlight`, one `timeline` across four titled sections
- `sources` = 10-13 five-field entries (label / url / publisher / publishedAt / accessedAt / note) on every page
- Blocker C phrase present in every timeline: *"Deployment patterns integrators follow on [domain-specific] programmes"*

## Inbound-ref rollup

| Page | Inbound refs | Status |
|---|---|---|
| `rfid-abs-keyfob` | 17 | ≥ 4 ✓ |
| `rfid-epoxy-keyfob` | 7 | ≥ 4 ✓ |
| `rfid-metal-keyfob` | 6 | ≥ 4 ✓ |
| `rfid-silicone-keyfob` | 7 | ≥ 4 ✓ |
| `rfid-leather-keyfob` | 5 | ≥ 4 ✓ |
| `nfc-wood-keychain-tag` | 4 | ≥ 4 ✓ |

`nfc-wood-keychain-tag` initially registered 1 inbound ref (pillar only). Wired three sibling inbound refs into `rfid-cards/rfid-wooden-card.json`, `rfid-cards/rfid-bamboo-card.json` and `rfid-cards/wooden-nfc-business-card-engraved.json` (each as an additional `resourceCards[].links[]` entry) to lift the count to 4.

## Orphan-ref scan

All outbound `/products/…/` hrefs on the six pages resolve to existing routes. Two orphan refs were found and fixed on the first pass:

- `rfid-silicone-keyfob.json` → `/products/rfid-wristbands/rfid-hospital-wristband/` corrected to `/products/rfid-wristbands/hospital-patient-id-wristband/`
- `rfid-leather-keyfob.json` → `/products/rfid-cards/wooden-rfid-card/` corrected to `/products/rfid-cards/rfid-wooden-card/` (two occurrences)

Post-fix scan is clean across all six pages.

## Cross-batch de-identification

All six pages use the Blocker C anchor phrase (*"Deployment patterns integrators follow on [domain-specific] programmes"*) in the final timeline item and keep the downstream compliance-reporting stack generic (ISO/IEC 27001 + SOC 2 + HIPAA + PCI DSS + CSRD / ESRS scope-3 + Higg FEM / CDP), avoiding any named-client or named-deployment attribution. Each page's domain string is mutually distinct from the others in the cluster.

## Batch 33 in the programme

Batch 33 opens the `rfid-keyfobs` tree's SHALLOW → DEEP upgrade run after rfid-tags closed in Batch 32. Nine residual rfid-keyfobs SHALLOW pages remain for Batch 34+ (chip-family cluster: mifare-desfire-keyfob, em4305-keyfob, t5577-keyfob, dual-frequency-key-fob, rfid-coin-keyfob, rfid-wristwatch-tag, nfc-epoxy-key-tag, rfid-coin-tag and one pending material-adjacent page); the material-family axis chosen for Batch 33 deliberately anchors the tree before the chip-family axis in Batch 34, so the material-side regulatory envelopes are the scaffolding against which chip pages differentiate.
