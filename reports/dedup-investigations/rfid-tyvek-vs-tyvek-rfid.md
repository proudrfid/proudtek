# Dedup Investigation — `rfid-tyvek-wristband` vs `tyvek-rfid-wristband`

**Date:** 2026-04-23
**Status:** Investigation complete. Recommended merge target: `rfid-tyvek-wristband` URL.

## Pages under investigation

| | `rfid-tyvek-wristband.json` | `tyvek-rfid-wristband.json` |
|---|---|---|
| **Route** | `/products/rfid-wristbands/rfid-tyvek-wristband/` | `/products/rfid-wristbands/tyvek-rfid-wristband/` |
| **Title** | RFID Tyvek Wristband — Disposable NFC Wristband for Events | Tyvek RFID Wristbands — Lowest-Cost Disposable RFID Credentials for Events & Venues |
| **Length** | 162 lines | 287 lines |
| **Angle** | Festival-operations (why barcode fails, gate-throughput, operational outcomes) | Procurement-cost (per-unit sticker-shock, MOQ friction, short-run printing) |
| **Refinement status** | Batch 6 refined (2026-04-22, modifiedAt 2026-04-23) | Batch 6b refined (2026-04-23) |
| **heroImage** | `/landing-images/rfid-tyvek-wristband-alt.jpg` (on disk ✓) | `/landing-images/tyvek-rfid-wristband.jpg` (on disk ✓) |
| **Sections** | 3 main (Why-barcode-fails / Proud-Tek-features / Applications) | 8 main (Challenges / How-solves / Results / Why-Tyvek / Material-vs-others table / Applications / Customization) + `brief` block |
| **Chip families** | `ntag21x, impinj-m7, ucode` | `ntag21x, mifare-ultralight, impinj-m7, ucode` |
| **Env families** | `outdoor, tamper` | `outdoor, tamper` |
| **Industries** | `events-venues, hospitality, education, brand-protection` | `events-venues, hospitality` |
| **External inbound references** | 9 files | 5 files (3 overlap with rfid-tyvek) |

## Topical overlap

**~80% content overlap** — even higher than the nfc-payment/cashless-payment pair. Both pages cover:

- Same material (DuPont Tyvek spunbond HDPE)
- Same tamper-evident adhesive closure
- Same core chip options (NTAG213, UHF Impinj/UCODE — tyvek-rfid adds MIFARE Ultralight)
- Same applications (festivals, conferences, waterparks, corporate events)
- Same buyer (event organizer / festival procurement)

The positioning-angle split from Batch 6b (festival-operations vs procurement-cost) is editorially defensible but the content substantially duplicates.

## Unique content in each

### Unique to `tyvek-rfid-wristband` (the structurally richer page)

1. **`brief` spec block** — 7 fields including HF chip options / UHF chip options / band size / closure / MOQ / lead time. Highly scannable spec-sheet content.
2. **MIFARE Ultralight EV1/C chip option** — explicit coverage of budget Ultralight EV1 + 3DES-secure Ultralight C. Missing from rfid-tyvek.
3. **Material comparison table** (Tyvek vs Silicone vs Fabric vs PVC across 7 rows: cost / durability / water / comfort / closure / print / best-for). A genuinely unique asset — this is a decision-aid the buyer can't get anywhere else on the site.
4. **Customization section** — 6 bullets covering flexographic vs digital printing, sequential numbering, holographic/UV security features, sponsor panels, perforated stub, backer card.
5. **Challenges → How-solves → Results narrative arc** — the procurement-sticker-shock / MOQ-friction pain-point framing with softened outcome attribution.
6. **Applications bullet** — 6 bullets including nightclub age-verification use-case (missing from rfid-tyvek).
7. **Rush-production callout** — blank-stocked Tyvek with on-site thermal-overprint option for emergency dispatch.

### Unique to `rfid-tyvek-wristband` (the Batch 6 refined page)

1. **DuPont Tyvek 1073D/1082D material citation** — explicit datasheet-grade reference.
2. **"Why paper and barcode cannot support modern event operations" section** — competitive-framing intro with literature attribution; strong answer-engine target for "why RFID instead of barcode" queries.
3. **NTAG213/215 + Impinj Monza R6-P chip specificity** — Monza R6-P is named explicitly; tyvek-rfid names M730 + UCODE 8 generically.
4. **Ticketing-platform integration line** — Eventbrite / Universe / ShowClix / proprietary named explicitly.
5. **Pantone spot-colour print specificity** — "Up to 6 Pantone spot colors".
6. **Broader `relatedIndustries`** — includes `education` + `brand-protection`. (Though `brand-protection` is likely a weak fit for a disposable event wristband.)
7. **Gate-throughput FAQ** — quantified (softened) per-lane throughput for NFC vs UHF vs barcode — strongest answer-engine target for "how fast is RFID gate entry" queries.

## Inbound-link audit

**rfid-tyvek-wristband — 9 external inbound files:**

- `products/rfid-keyfobs/rfid-coin-keyfob.json`
- `products/rfid-wristbands/paper-rfid-wristband.json`
- `products/rfid-wristbands/cashless-payment-rfid-wristband.json` (just updated from nfc-payment merge)
- `products/rfid-wristbands/_pillar.json`
- `products/rfid-wristbands/fabric-rfid-wristband.json`
- `products/rfid-wristbands/rfid-nylon-wristband.json`
- `products/rfid-wristbands/uhf-rfid-wristband.json`
- `products/rfid-wristbands/rfid-vinyl-wristband.json`
- `lp/rfid-wristband-manufacturer.json`

**tyvek-rfid-wristband — 5 external inbound files:**

- `products/rfid-tags/rfid-race-timing-tag.json`
- `products/rfid-wristbands/paper-rfid-wristband.json` (also linked from rfid-tyvek)
- `products/rfid-wristbands/_pillar.json` (also linked from rfid-tyvek)
- `industries/events-venues.json`
- `solutions/rfid-event-wristbands.json`

## SEO cannibalization assessment

**Risk: HIGH — even higher than nfc-payment case.** Neither slug has a buyer-intent advantage ("rfid-tyvek" and "tyvek-rfid" are keyword-equivalent permutations). Google's BERT-style query understanding treats these as synonymous; ranking one over the other is essentially a coin-flip. Two pages competing for the same keyword cluster with functionally identical slugs is textbook keyword cannibalization.

## Recommendation: MERGE into `rfid-tyvek-wristband` URL

### Rationale for URL choice

1. **More inbound equity.** 9 external inbound files vs 5.
2. **Canonical naming pattern match.** The `rfid-<material>-wristband` pattern is used by all other refined siblings: `rfid-adjustable-silicone-wristband`, `rfid-waterpark-wristband`, `rfid-child-wristband`, `rfid-vinyl-wristband`, `rfid-nylon-wristband`, `rfid-prison-wristband`. The `tyvek-rfid-wristband` variant breaks this pattern.
3. **Already contains DuPont datasheet-grade material citation** — a hard factual anchor for EEAT.
4. **Competitive-framing intro section** (why barcode fails) is strong answer-engine content already in place.

### What to lift from `tyvek-rfid-wristband`

All content rewritten with Batch 6 claim-hygiene on any surviving episodic figures:

1. **`brief` spec block** — lift as-is. Soften MOQ line to qualitative ("accessible MOQs with standard custom-print lead times on the order of two weeks from artwork approval").
2. **MIFARE Ultralight EV1/C chip option** — lift; add to the how-solves section's chip-options bullet. Add `mifare-ultralight` to `chipFamilies`.
3. **Material comparison table** — lift as a new section between "Applications" and the FAQ. **Critical edit:** convert absolute dollar figures ($0.15-$0.35 / $0.80-$1.50 / etc.) to cost tiers ($ / $$ / $$$) matching the cashless-payment merged chip-selection table pattern.
4. **Customization section** — lift as-is (no claim-hygiene needed; all qualitative).
5. **Challenges section** with literature-attribution intro. Soften any specific figures (10,000-attendee, sticker-shock "multiples of barcode") to qualitative.
6. **Results section** with Eventbrite/Live Nation/AEG/Intellitix/Glownet/Tappit attribution intro — already softened in Batch 6b, lift as-is.
7. **Why-Tyvek paragraph** — preserve the "paper-label-tier" cost framing.
8. **Nightclub age-verification** application bullet — lift into the merged Applications section.
9. **Rush-production blank-stock** line — lift to the how-solves section.

### What to keep from `rfid-tyvek-wristband`

- **Summary, heroPoints, heroImage, heroImage ALT** — unchanged.
- **DuPont Tyvek 1073D/1082D material citation** — preserved.
- **"Why paper and barcode cannot support modern event operations"** section as the opening — preserved.
- **NTAG213/215 + Impinj Monza R6-P chip specificity** — preserved, augmented with MIFARE Ultralight EV1/C from tyvek-rfid.
- **Pantone spot-colour spec** — preserved.
- **Ticketing-platform integration line** (Eventbrite / Universe / ShowClix) — preserved.
- **Gate-throughput FAQ with literature-attributed answer** — preserved.
- **resourceCards** — preserved (already Batch 2/3/4 connected); swap the pointer `/products/rfid-wristbands/cashless-payment-rfid-wristband/` which already points at the just-merged canonical URL.
- **`modifiedAt: 2026-04-23`** — kept; `reviewedAt` → 2026-04-23.

### `relatedIndustries` reconciliation

`rfid-tyvek-wristband` has `["events-venues","hospitality","education","brand-protection"]`; `tyvek-rfid-wristband` has `["events-venues","hospitality"]`. `brand-protection` is a weak fit for a disposable event wristband (inherited ghost value, same as was dropped on paper-rfid and nfc-medical-alert). Reconciled: `["events-venues","hospitality","education"]` — keep education (field-trip / campus-events use-case), drop brand-protection.

### Post-merge mechanical tasks

1. **Write merged `rfid-tyvek-wristband.json`** with lifted + softened content.
2. **Update inbound links.** 5 external files currently reference `/products/rfid-wristbands/tyvek-rfid-wristband/`. Mechanically replace. One is `_pillar.json` which may have a similar duplicate-entry issue as the nfc-payment case — verify and dedup.
3. **Add 301 redirect** `/products/rfid-wristbands/tyvek-rfid-wristband/` → `/products/rfid-wristbands/rfid-tyvek-wristband/` to `public/_redirects`.
4. **Delete `tyvek-rfid-wristband.json`**.
5. **Verify.** Schema / hrefs / no orphan refs.

### Second hero image — what to do with `tyvek-rfid-wristband.jpg`?

The deleted page's hero image `/landing-images/tyvek-rfid-wristband.jpg` remains on disk. Options:

1. **Repurpose as a secondary image** on the merged page (e.g., use as the image for the material-comparison-table section via a gallery / secondary-image slot — schema permitting).
2. **Leave on disk as an orphan** — no harm; no internal link references it after the merge; search-indexing will drop it naturally once the page is deleted.
3. **Delete.** Clean but loses a potentially useful product photograph.

My recommendation is option 2 (leave on disk) for now — low-cost, reversible, and the image may be useful later for a blog post or case study.

## Decision matrix

| | Merge | Keep split | Do nothing |
|---|---|---|---|
| **SEO upside** | Strong (one page, merged structural depth + literature citations) | Mild (two pages, likely cannibalized) | None |
| **Content-work cost** | ~45 min merge + ~15 min mechanical updates | N/A (already refined) | 0 |
| **Editorial integrity** | One canonical, richer, Batch-6-standard page | Two near-duplicates with artificial angle split | Two near-duplicates |

## My recommendation

**Merge into `rfid-tyvek-wristband`.** Same pattern, same rationale as the nfc-payment merge. The material-comparison table and `brief` block from tyvek-rfid, combined with the DuPont Tyvek datasheet anchor and competitive-framing intro from rfid-tyvek, yields a page that is materially stronger than either source.

## Open items

- **Secondary hero image use.** Schema does not currently support a second-hero or gallery field in the top-level page shape. If you want to use `tyvek-rfid-wristband.jpg` on the merged page, it would need a schema extension (`sections[].image` or similar) — or the image can stay orphan on disk.
- **Backlink profile — tyvek-rfid-wristband URL.** If any high-authority external site links to the `tyvek-rfid-wristband` slug, the 301 handles it. Outreach to update the canonical URL directly preserves more equity long-term.
