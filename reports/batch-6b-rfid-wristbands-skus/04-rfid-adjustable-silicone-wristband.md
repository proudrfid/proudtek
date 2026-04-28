# 04 — Adjustable Silicone RFID Wristband

**File:** `src/content/editorial/products/rfid-wristbands/rfid-adjustable-silicone-wristband.json`
**Route:** `/products/rfid-wristbands/rfid-adjustable-silicone-wristband/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage: /landing-images/rfid-adjustable-silicone-wristband.jpg` verified on disk.
- `publishedAt` / `modifiedAt` absent.
- `imageSourceRoutes` contained 2 broken singular `/product/...` routes (`rfid-silicone-wristbands`, `coconut-shell-rfid-wristband` — the second is a ghost slug with no SKU file).
- `heroPoints[0]` carried "10+ adjustment holes ... 130 mm (child) ... 230 mm (adult XL)" specific mm figures.
- `heroPoints[1]` carried "500+ read/write cycles" specific count.
- `sections[0]` "Why adjustable outperforms fixed-size" was claim-heavy:
  - "3-5 size SKUs" specific count
  - "50,000-200,000 units of plastic waste per season at a mid-size water park"
  - "80-90% material waste cut"
  - "$1-3 per member" disposable-band cost
- `sections[1]` "How Proud Tek solves" carried:
  - "10+ holes spans 130-230 mm" specific sizing
  - "60-80% inventory-management cut"
  - "-40 °C to +120 °C" specific temperature range
  - "500+ read/write cycle rating"
  - No CRYPTO-1 caveat on MIFARE Classic chip option (critical security disclosure missing — now added).
- `faq[0]` carried "130 mm ... 230 mm (adult XL)" specific mm figures.
- `faq[1]` carried "up to 5 ppm chlorine" specific pool chemistry figure.
- `faq[2]` carried "100,000+ write cycles" NTAG + "500,000+ write cycles" DESFire specific counts.
- `resourceCards` had 2 cards with 2 broken `/products/rfid-wristbands/...` routes (`rfid-silicone-wristband`, `rfid-event-wristband` — both ghost slugs not on disk).
- `primaryAction.href: /contact/` (broken).
- `secondaryActions[0]` broken `rfid-silicone-wristband` ghost slug; `secondaryActions[1]` broken `coconut-shell-rfid-wristband` ghost slug.
- `relatedIndustries: ["fitness"]` — thin; hospitality (waterpark / resort) + events-venues are natural first-order additions.
- `chipFamilies: ["ntag21x","mifare-classic","mifare-desfire","em-tk5","impinj-m7","ucode"]` — correct multi-chip coverage.
- `envFamilies: ["outdoor"]` — correct.

## Changed

**Image.** No change.

**Metadata.** Added `publishedAt: "2026-04-23"`, `modifiedAt: "2026-04-23"`; updated `reviewedAt` to `2026-04-23`.

**`imageSourceRoutes`.** Broken singular routes + ghost slug → `/products/rfid-wristbands/silicone-wristband-mifare-classic/` (the dominant silicone sibling from Batch 6) + `/products/rfid-wristbands/rfid-waterpark-wristband/` (Batch 6 waterpark use-case SKU).

**Claim hygiene — heroPoints.** "10+ adjustment holes fits wrist circumferences from 130 mm (child) to 230 mm (adult XL)" → "multiple adjustment holes fits wrist circumferences from child-small to adult-XL in a single SKU". "500+ read/write cycles" → "repeated read/write cycles" (specific cycle-count removed).

**Claim hygiene — Why-adjustable section.** All 4 bullets softened:
- "3-5 size SKUs" → "several size SKUs"
- "50,000-200,000 units of plastic waste per season ... 80-90% material waste cut" → "a substantial consumable-plastic footprint across a full operating season ... cut that material waste materially"
- "$1-3 per member" → "adds up at programme scale" (specific $ per-member cost removed)

**Claim hygiene — How-solves section.** All 5 bullets softened:
- "10+ holes spans 130-230 mm ... 60-80% inventory cut" → "multiple adjustment holes spans the full child-to-adult-XL wrist range ... materially reducing inventory-management overhead"
- "-40 °C to +120 °C" → "the full typical outdoor-to-commercial-kitchen temperature envelope per the underlying silicone specification"
- MIFARE Classic chip line expanded with inline CRYPTO-1 caveat + DESFire EV2/EV3 migration pointer (matches the Batch-6 silicone-mifare-classic and waterpark patterns)
- "500+ read/write cycle rating" → "Chip EEPROM is rated per the relevant NXP / Impinj datasheet for many thousands of write cycles with long data retention"

**Claim hygiene — FAQ.** FAQ 1 "130 mm ... 230 mm" → "from a small child's wrist through adult XL" + sample-request note. FAQ 2 "up to 5 ppm chlorine" → "at typical operating chlorine concentrations". FAQ 3 "100,000+ / 500,000+ write cycles" → "number of write cycles that, in practice, will outlast the physical band by a wide margin ... well inside the chip's rated envelope".

**Cross-link density.** Expanded `resourceCards` from 2 → 3 entries (both ghost-slug links replaced):
1. **Related silicone and reusable RFID wristbands** — 4 entries: silicone-wristband-mifare-classic (Batch 6), rfid-waterpark-wristband (Batch 6), fabric-rfid-wristband (Batch 6b), cashless-payment-rfid-wristband (Batch 6).
2. **Industry landings** — hospitality + events-venues (Batch 2).
3. **Related solutions, compares and pillar** — rfid-event-access-control (Batch 4), mifare-plus-ev2-vs-desfire-ev3 compare (Batch 3, the upgrade path from MIFARE Classic), 125khz-vs-13.56mhz-rfid compare (Batch 3, frequency-choice decision for LF-vs-HF adjustable-band buyer), UHF chip compare (Batch 3), wristband pillar.

**`relatedIndustries` expansion.** `["fitness"]` → `["hospitality","fitness","events-venues"]` — hospitality (resort/waterpark) is the dominant first-order vertical the page explicitly serves; events-venues is a natural second; fitness was the original (kept).

**Routing fix.** `primaryAction.href: /contact/` → `/contact/hotel-rfid/` (adjustable silicone is hospitality/resort-first by use-case). `secondaryActions[0]` ghost `rfid-silicone-wristband` → `silicone-wristband-mifare-classic`. `secondaryActions[1]` ghost `coconut-shell-rfid-wristband` → `rfid-waterpark-wristband`.

## SEO / GEO shape

Strong. Summary opens answer-first (adjustable watch-style buckle fitting any wrist size from child to adult, single-SKU elimination of size-variant inventory, ideal for waterparks / fitness / resorts / recurring membership). The "Why adjustable outperforms fixed-size" 4-bullet section is a clean inventory/waste/cost-framed answer block for "fixed vs adjustable RFID wristband" queries.

The "How Proud Tek solves" 5-bullet spec section (with the MIFARE Classic CRYPTO-1 caveat now inline) is the strongest spec-extraction target on the page — each bullet anchors a decision-point (sizing, material, chip choice, write-endurance, branding).

FAQ covers 3 practitioner questions (wrist-size range with sample-request note, pool-water survival, write-endurance with chip-datasheet framing).

## Verification

- JSON parses ✅
- Zod schema shape ✅
- `heroImage: /landing-images/rfid-adjustable-silicone-wristband.jpg` exists on disk ✅
- 16 internal hrefs, all resolve ✅
- `chipFamilies: ["ntag21x","mifare-classic","mifare-desfire","em-tk5","impinj-m7","ucode"]` correct ✅
- `envFamilies: ["outdoor"]` correct ✅
- `relatedIndustries` expanded from 1 → 3 (hospitality + events-venues added) ✅
- CRYPTO-1 caveat added to MIFARE Classic chip line ✅
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **`coconut-shell-rfid-wristband` ghost-slug resolution.** The previous `secondaryActions[1]` referenced a wristband SKU that doesn't exist on disk. If eco-material wristbands are a growth angle (they're increasingly popular in festivals for sustainability positioning), a dedicated `/products/rfid-wristbands/coconut-shell-rfid-wristband/` or `/products/rfid-wristbands/eco-rfid-wristband/` page is a clean content-extension candidate.
- **CRYPTO-1 caveat could be elevated to a `callout` block.** The security-disclosure content is important enough that a dedicated callout (once editorial schema is exercised for it — the schema already supports `section.callout`) would make it more prominent than an in-bullet clause. Matches the open item on the Batch-6 silicone-mifare-classic SKU.
- **Rated mm range as hidden spec.** The public-facing page now points to the spec sheet for exact mm range — ensure the spec sheet is available as a downloadable PDF.
- **`sources` block absent.** Adding NXP NTAG21x + MIFARE DESFire datasheets, FDA 21 CFR 177.2600 silicone regulation, Impinj Monza R6 datasheet and the Courtois/Meijer/Verdult CRYPTO-1 attack paper would match Batch 4 EEAT baseline.
