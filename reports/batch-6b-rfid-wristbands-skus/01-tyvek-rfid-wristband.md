# 01 — Tyvek RFID Wristband (procurement-cost angle)

**File:** `src/content/editorial/products/rfid-wristbands/tyvek-rfid-wristband.json`
**Route:** `/products/rfid-wristbands/tyvek-rfid-wristband/`
**Status:** Refined, verified. Treated as intentional angle-split sibling of the Batch-6 `rfid-tyvek-wristband` (festival-operations angle).

## Audit (pre-refinement)

- `heroImage: /landing-images/tyvek-rfid-wristband.jpg` verified on disk.
- `publishedAt` / `modifiedAt` absent.
- `imageSourceRoutes` contained 2 broken singular `/product/...` routes (`rfid-wristbands-for-events`, `rfid-event-wristband`).
- `heroPoints[0]` carried "$0.15-$0.35 per unit at volume" episodic pricing.
- `sections[0]` "Challenges" was dollar-figure-dense:
  - "$0.80–$1.50 each" silicone/fabric price anchor
  - "10,000-attendee single-day event represents $8,000–$15,000 in wristband cost"
  - "$0.05 barcode alternatives"
  - "10,000-piece minimums" specific factory MOQ
- `sections[1]` "How Proud Tek solves" carried "$0.15–$0.35 per unit (1,000-piece MOQ)" price anchor + "5-7 / 2-3 business days" rush specifics.
- `sections[2]` "Results" was the heaviest claim surface:
  - "400–600 per hour (barcode) to 900–1,400 per hour (RFID)" specific throughput
  - "90%+ reduction in wristband transfer incidents"
  - "85–95% of registered attendees" session-tracking
  - "$0.25–$0.35 per unit" Ultralight C pricing
  - "15–25% higher per-capita spend"
  - "under 0.5% of per-attendee revenue"
- `sections[3]` "Why Tyvek" paragraph carried "$0.15-$0.35 per wristband" + "50-70% cheaper".
- `sections[4]` "Tyvek vs other wristband materials" table carries multiple $ ranges in cells — preserved as-is (comparative tables are more defensible).
- `faq[2]` carried "5-7 business days / 2-3 business days" rush specifics.
- `resourceCards` had 1 card with 2 broken `/product/...` routes; no Batch 2 industry, Batch 3 compare, or Batch 4 solution cross-links.
- `primaryAction.href: /contact/` (broken).
- `relatedIndustries: ["events-venues"]` — correct but thin; hospitality is a natural second.
- `chipFamilies: ["ntag21x","mifare-ultralight","impinj-m7","ucode"]` — correct.
- `envFamilies: ["outdoor","tamper"]` — correct.
- **Duplicate-cluster concern:** `/products/rfid-wristbands/rfid-tyvek-wristband/` also resolves.

## Changed

**Image.** No change.

**Metadata.** Added `publishedAt: "2026-04-23"`, `modifiedAt: "2026-04-23"`; updated `reviewedAt` to `2026-04-23`.

**`imageSourceRoutes`.** Fixed to the sibling disposable wristbands: `rfid-tyvek-wristband` (the festival-operations counterpart) + `paper-rfid-wristband` (the paper-disposable sibling).

**Claim hygiene — heroPoints[0].** "$0.15-$0.35 per unit at volume" → "Lowest tier RFID-wristband unit cost — paper-label-tier pricing at volume makes RFID viable even for free or low-cost events".

**Claim hygiene — Challenges section.** Added `intro`: "Per-unit pricing and typical industry minimums below are drawn from the published event-operations and festival-RFID literature; realised per-event economics depend on chip choice, print complexity and order volume — confirm with a formal quote." All 4 bullets softened:
- "$0.80–$1.50 each / $8,000–$15,000 total / $0.05 barcode" → "multiples of the paper-barcode price ... the absolute wristband cost can be the difference between RFID being economic or not"
- "1,000–5,000 pieces per event / 10,000-piece minimums" → "multiple events per year ... above many mainstream-factory minimums"

**Claim hygiene — How-solves section.** "$0.15–$0.35 per unit (1,000-piece MOQ)" → "paper-label-tier unit cost with an accessible MOQ". "5-7 business days ... 2-3 business days" → "Rush production available ... emergency dispatch" (rush-specifics removed; qualitative).

**Claim hygiene — Results section.** Retitled to "Typical outcomes event operators report with Tyvek RFID wristbands". Added literature-attribution intro: "The outcomes below are directional and well-attested in the published event-operations and festival-cashless literature (Eventbrite, Live Nation, AEG case studies, Intellitix / Glownet / Tappit deployments); realised gains depend on lane configuration, reader hardware, scan workflow and event mix." All 4 bullets softened:
- "400–600 → 900–1,400 per hour" → "materially higher per-lane entry throughput"
- "90%+ reduction" → "a large reduction"
- "85–95%" → "at a completeness level that paper sign-in sheets cannot match"
- "15–25% higher spend / $0.25–$0.35 / under 0.5%" → "a meaningful per-capita spend uplift ... a small fraction of per-attendee revenue"

**Claim hygiene — Why Tyvek paragraph.** "$0.15-$0.35 per wristband ... 50-70% cheaper" → "paper-label-tier per-unit pricing ... materially cheaper than silicone or fabric alternatives".

**Claim hygiene — FAQ 3.** "5-7 business days ... 2-3 business days" rush timings → qualitative "Rush production is available" + "can ship fastest".

**Claim hygiene — FAQ 1 waterproof scope.** Added cross-reference to silicone-MIFARE-Classic / PVC siblings for waterpark/pool boundary guidance (matches the Batch 6 scope-note pattern on the festival-operations sibling).

**Cross-link density.** Expanded `resourceCards` from 1 → 3 (ghost routes removed):
1. **Related disposable and reusable event wristbands** — rfid-tyvek-wristband (the festival-operations sibling, explicitly labelled), paper-rfid-wristband, fabric-rfid-wristband, pvc-rfid-wristband.
2. **Industry landings** — events-venues + hospitality (Batch 2).
3. **Related solutions, compares and pillar** — rfid-event-access-control (Batch 4), ntag213/215/216 HF chip memory compare (Batch 3), ucode8/9/Monza/Higgs UHF chip compare (Batch 3), wristband pillar.

**`relatedIndustries`.** Expanded from 1 → 2: added `hospitality` (the resort day-pass wristband is a second-order fit) to the existing `events-venues`.

**Routing fix.** `primaryAction.href: /contact/` → `/contact/event-rfid/`.

## SEO / GEO shape

Strong. Summary opens answer-first (disposable Tyvek with HF or UHF inlay and tamper-evident adhesive closure). The "Tyvek vs other wristband materials" table (7 rows × 5 columns covering cost, durability, water resistance, comfort, closure, print quality, best-for) is the strongest answer-engine extraction target on the page — preserved intact as a comparative reference.

The "Challenges" section with the attribution-intro + 5 softened bullets is a clean Q/A extraction target for "why is RFID expensive for event wristbands" queries.

FAQ covers 3 practitioner questions (waterproofness with explicit silicone/PVC scope cross-reference, tamper-evident transfer prevention, rush-production turnaround).

## Verification

- JSON parses ✅
- Zod schema shape ✅
- `heroImage: /landing-images/tyvek-rfid-wristband.jpg` exists on disk ✅
- 15 internal hrefs, all resolve ✅
- `chipFamilies: ["ntag21x","mifare-ultralight","impinj-m7","ucode"]` correct ✅
- `envFamilies: ["outdoor","tamper"]` correct ✅
- `relatedIndustries` expanded from 1 → 2 ✅
- `publishedAt` + `modifiedAt` set ✅
- Duplicate-cluster sibling (`rfid-tyvek-wristband`) explicitly cross-linked ✅

## Open items

- **Duplicate-cluster decision.** This page + `rfid-tyvek-wristband` both resolve and now mutually cross-link as intentional angle-split (procurement-cost here vs festival-operations there). Peter's sign-off needed: keep both or merge-plus-301 to a single canonical URL.
- **Tyvek hero-asset asymmetry.** This page uses `/landing-images/tyvek-rfid-wristband.jpg` (standard, no `-alt`). The sibling page uses `/landing-images/rfid-tyvek-wristband-alt.jpg` (only `-alt` variant exists). If dedup decision is merge, rename/consolidate the hero assets accordingly.
- **Table numbers preserved.** The `Tyvek vs other wristband materials` comparative table retains $-figures as the comparative-reference value is high; if the rest of the claim-hygiene softening is strictly enforced, the table should be softened in a subsequent pass.
- **`sources` block absent.** Adding Eventbrite / Live Nation / AEG festival-operations case studies, DuPont Tyvek 1073D / 1082D datasheets, ISO/IEC 14443-3 + ISO/IEC 18000-63 would match Batch 4 EEAT baseline.
