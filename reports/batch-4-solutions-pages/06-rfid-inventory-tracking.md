# 06 — RFID Inventory Tracking

**File:** `src/content/editorial/solutions/rfid-inventory-tracking.json`
**Route:** `/solutions/rfid-inventory-tracking/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage` was `/landing-images/retail-apparel.jpg` — semantically reasonable (retail apparel is the dominant item-level UHF RFID vertical) and file verified on disk; **no change needed**.
- `publishedAt` and `modifiedAt` were absent.
- **Multiple unattributed numeric claims** throughout the page:
  - `statBar` item 4: `$0.03 / From per tag` — this is a commonly-cited number but silicon allocation at NXP / Impinj / Alien plus converter markup (Avery Dennison / Smartrac, Beontag, Arizon) swing the realised cost significantly by quarter, by geography and by quantity tier. Carrying `$0.03` as a hard number was a claim-hygiene liability.
  - `dataHighlight` and related bullets carried `25×` and `99%+` figures without attribution — both are Auburn RFID Lab findings and are defensible, but were presented as proprietary Proud Tek claims.
  - `sections[*].bullets` included "80% dock-door processing time reduction", "30-50% labor reduction", "99.9% library circulation accuracy" — all directionally correct but episodic, specific to particular deployments, and not defensible as universal claims.
  - `faq[0]` answer cited "$0.03-0.08 per tag", "$0.05-0.15 source tag", "ROI within 6-12 months" as bare benchmarks.
- `resourceCards` had only 1 entry. Cross-links into Batch 2 industry landings (retail-apparel, logistics, industrial, pharmaceutical, libraries, cold-chain) and Batch 3 compare pages (uhf-vs-hf-rfid, ucode8-vs-ucode9-vs-monza-r6-vs-higgs9) were absent — these are the two most directly relevant Batch 3 compare pages for inventory-tracking buyer research.
- `primaryAction.href` was bare `/contact/` (broken).

## Changed

**Image.** No change — `retail-apparel.jpg` is the correct hero image for the item-level UHF inventory-tracking story.

**Metadata.** Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`.

**Claim hygiene — statBar.** Item 4 rewritten:

Before:
```json
{ "value": "$0.03", "label": "From per tag" }
```

After:
```json
{ "value": "Single-digit ¢", "label": "Typical paper-label tag, at volume" }
```

Defensible across the realistic range of silicon + converter pricing without committing to a specific cents figure.

**Claim hygiene — Auburn attribution.** `statBar` items 1 and 2 (`~25×` and `99%+`) now explicitly carry `(Auburn RFID Lab)` as the label source. `dataHighlight` in `sections[2]` already attributed Auburn; retained as-is. The `sections[2].bullets` retail-apparel entry now reads `"barcode-era baselines (typically 65–85%) into the 95%+ range, with Auburn-reported sales lift in the 2–10% range from reduced out-of-stocks"` — attribution explicit.

**Claim hygiene — softened episodic claims.**
- **80% dock-door processing time reduction** → "materially reducing dock-door processing time (exact reduction depends on dock layout, reader placement and carton density — quantify against your real flow before quoting a figure)".
- **30-50% labor reduction** → "materially reduce labor cost per scan event and to eliminate most line-of-sight picking errors. The realised labour delta depends on prior automation level, conveyor / portal layout and the mix of cased vs loose SKU flow; quantify against your own DC."
- **99.9% library circulation accuracy** → "circulation-accuracy figures that the library-RFID literature consistently puts above 99%" (defensible against the published library-RFID case-study corpus without committing to a specific decimal place).

**Claim hygiene — FAQ cost answer.** Rewritten to:
- Soften `$0.03-0.08` and `$0.05-0.15` to "single-digit cents range per tag at volume" and "at a modest premium to plain paper labels depending on form factor and chip".
- Soften `ROI within 6-12 months` to `"typically puts payback within the first year on retail item-level deployments through reduced out-of-stocks, lower cycle-count labour and decreased shrinkage"` with Auburn RFID Lab + Zebra Retail Vision Study cited as ROI-framing sources.
- Add explicit instruction to "request a quote against your real BOM".

**Cross-link density.** Expanded `resourceCards` from 1 → 3 entries:
1. **RFID tags for inventory tracking** — 3 Batch 1 SKUs: UHF retail price label, RFID garment source tag, UHF pallet label.
2. **Industry landings — where item-level UHF deploys** — 6 Batch 2 industry landings: retail-apparel, logistics, industrial, pharmaceutical, libraries, cold-chain-food-traceability.
3. **Chip and frequency compares** — 3 links including the two most directly relevant Batch 3 compare pages (`uhf-vs-hf-rfid`, `ucode8-vs-ucode9-vs-monza-r6-vs-higgs9`) and the retail-inventory guide.

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/rfid-labels-tags/` (verified to resolve).

## SEO / GEO shape

Strong. Summary first sentence is answer-first and ends with the three-tier deployment surface (retail stores, warehouses, distribution centers). The page uses three rich-content block types: `statBar` (4 fact-tokens), `timeline` (5-step inventory-tracking sequence), and `dataHighlight` (the attributed Auburn sales-lift callout). This mix is well-suited for both "how does RFID inventory tracking work" and "what accuracy gain does RFID deliver" answer-engine queries.

FAQ has 3 Q/A pairs covering the three most-asked practitioner questions: tag cost, accuracy improvement, chip selection. The chip-selection answer names Impinj M700 and NXP UCODE 8 — matching the `/compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9/` compare page, so the cross-link is contextually tight.

**Sources block is strong for the UHF / retail inventory topic.** 8 references: ISO/IEC 18000-63 (UHF Gen2 air interface), GS1 TDS 2.1 (EPC encoding), GS1 EPCIS 2.0 (event-sharing), Auburn RFID Lab (the authoritative source for the 25× and 99%+ claims), Impinj library, Zebra Retail Vision Study, Impinj R700 reader, Zebra FX9600 reader. This covers standards, academic research, industry research, and the two reference-architecture reader SKUs.

## Verification

- JSON parses ✅
- Zod schema ✅
- `heroImage: /landing-images/retail-apparel.jpg` exists on disk ✅
- 15 internal hrefs, all resolve ✅
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **`/products/rfid-labels/uhf-rfid-retail-price-label/`, `/products/rfid-labels/rfid-garment-source-tag/`, `/products/rfid-labels/uhf-rfid-pallet-label/`** — all three Batch 1 UHF label SKUs linked from this page have **not** been Batch-1-refined (Batch 1 focused on HF RFID cards). They are the natural Batch 1b / UHF-label batch.
- **`/industries/logistics/`, `/industries/industrial/`, `/industries/libraries/`** — three industry landings linked but not Batch-2-refined. All three represent significant verticals for UHF-RFID-supplied business; candidates for a Batch 2b.
- **`/blog/rfid-retail-inventory-management/`** linked but not audited — blog-tier backlog.
- **Pharmacy vs general healthcare** — the page notes hospital supply tracking in the industries bullet, but the current `/industries/pharmaceutical/` industry page is DSCSA-focused (serialization-adjacent) rather than inventory-tracking-focused. If RFID pharmacy inventory (not DSCSA) is a vertical priority, this is a gap.
- **Cold-chain vs food traceability** — the `/industries/cold-chain-food-traceability/` landing is linked but cold-chain-specific RFID tag requirements (temperature-logging ICs like EM4325, BLE / NFC dual-interface loggers) are not called out on this solution page. Flag as a solution-page extension candidate if cold-chain is a priority.
- The Auburn RFID Lab attribution is now explicit in both the statBar and the dataHighlight, but the specific Auburn publications underlying the 25× / 99%+ / 2-10% sales-lift claims could be cited by URL or report name in the `sources` block for a further EEAT upgrade (currently the Auburn entry is just the lab homepage).
