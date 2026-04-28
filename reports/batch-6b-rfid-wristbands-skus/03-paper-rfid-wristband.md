# 03 — Paper RFID Wristband

**File:** `src/content/editorial/products/rfid-wristbands/paper-rfid-wristband.json`
**Route:** `/products/rfid-wristbands/paper-rfid-wristband/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage: /landing-images/paper-rfid-wristband.jpg` verified on disk.
- `publishedAt` / `modifiedAt` absent.
- `imageSourceRoutes` contained 2 broken singular `/product/...` routes (`rfid-wristbands-for-events`, `nfc-stickers`).
- `heroPoints[0]` carried "50-70% less than silicone or fabric alternatives" specific % delta.
- `sections[0]` "Where paper RFID wristbands are the right choice" bullet 1 carried "4-12 hours" wear duration + "50,000+ attendees" volume claim.
- `sections[1]` spec section was factually sound (NTAG213 144B, NTAG216 888B, etc.).
- `faq[2]` carried "10-15 business days ... 7 business days ... 50,000+ bands ... 6-8 weeks" multiple specific timings.
- `resourceCards` had 2 cards with 1 broken `/product/...` route; no Batch 2 industry, Batch 4 solution cross-links.
- `primaryAction.href: /contact/` (broken).
- `secondaryActions[0]` broken `/product/...`.
- `relatedIndustries: ["healthcare","events-venues","luxury-brands","brand-protection"]` — `luxury-brands` + `brand-protection` weak fits for a disposable day-pass wristband.
- `chipFamilies: ["ntag21x","mifare-classic","impinj-m7","ucode"]` — correct.
- `envFamilies: ["outdoor","tamper"]` — correct.

## Changed

**Image.** No change.

**Metadata.** Added `publishedAt: "2026-04-23"`, `modifiedAt: "2026-04-23"`; updated `reviewedAt` to `2026-04-23`.

**`imageSourceRoutes`.** Broken singular routes → `/products/rfid-wristbands/rfid-tyvek-wristband/` (festival-operations sibling) + `/products/rfid-wristbands/tyvek-rfid-wristband/` (procurement-cost sibling). Paper-and-Tyvek are the two adjacent format siblings.

**Claim hygiene — heroPoints[0].** "cost 50-70% less than silicone or fabric alternatives" → "paper-label tier — materially cheaper than silicone or fabric alternatives" (tier language replaces specific % delta).

**Claim hygiene — Where-paper-is-right section, bullet 1.** "attendees wear the wristband for 4-12 hours ... events with 50,000+ attendees" → "attendees wear the wristband for the duration of the event ... at very large event scales" (both figures softened to qualitative).

**Claim hygiene — FAQ 3 lead-time.** "Standard 10-15 business days ... rush 7 business days ... 50,000+ bands ... 6-8 weeks" → "Standard custom-print lead times are on the order of two weeks ... rush production available for moderate quantities ... very large events — tens of thousands of bands and above ... six to eight weeks ahead" (specific-business-day counts removed; qualitative).

**Cross-link density.** Expanded `resourceCards` from 2 → 3 entries (broken route removed):
1. **Related disposable and reusable event wristbands** — 4 entries: rfid-tyvek-wristband (Batch 6, festival angle), tyvek-rfid-wristband (Batch 6b, procurement angle), fabric-rfid-wristband (Batch 6b), rfid-vinyl-wristband (reference to sibling not-yet-refined).
2. **Industry landings** — events-venues + healthcare (Batch 2; healthcare covers the ED / outpatient visitor-pass use-case).
3. **Related solutions, compares and pillar** — rfid-event-access-control (Batch 4), NTAG memory compare (Batch 3), UHF chip compare (Batch 3), wristband pillar.

**`relatedIndustries` tightening.** `["healthcare","events-venues","luxury-brands","brand-protection"]` → `["events-venues","healthcare"]`. Luxury-brands + brand-protection were inherited ghost values for a disposable day-pass wristband; events-venues + healthcare are the true first-order verticals.

**Routing fix.** `primaryAction.href: /contact/` → `/contact/event-rfid/`. `secondaryActions[0]` broken singular route → `rfid-tyvek-wristband`.

## SEO / GEO shape

Strong. Summary opens answer-first (Tyvek or coated-paper band with embedded NFC/UHF chip and peel-and-stick tamper-evident adhesive closure). The "Where paper RFID wristbands are the right choice" 5-bullet section is the strongest answer-engine target — each bullet is a discrete use-case (single-day events, hospital ED, waterpark day pass, food/drink festivals, corporate visitor management).

The "Proud Tek paper RFID wristband specifications" 5-bullet spec section (material, chip, closure, printing, MOQ) is a clean Q/A target for "paper RFID wristband specs" queries.

FAQ covers 3 practitioner questions (waterproof boundary with waterpark pouch option, NFC phone-readability, lead times with softened framing).

## Verification

- JSON parses ✅
- Zod schema shape ✅
- `heroImage: /landing-images/paper-rfid-wristband.jpg` exists on disk ✅
- 15 internal hrefs, all resolve ✅
- `chipFamilies: ["ntag21x","mifare-classic","impinj-m7","ucode"]` correct ✅
- `envFamilies: ["outdoor","tamper"]` correct ✅
- `relatedIndustries` tightened from 4 (2 weak fits) → 2 first-order verticals ✅
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **Paper vs Tyvek terminological overlap.** The page covers both "paper" and "Tyvek" disposable wristbands under one SKU — which is accurate (Tyvek is a coated/spunbond synthetic that functions like paper for printing but is more durable). Consider whether the SKU should be split into a pure-paper (coated cellulose) entry and a Tyvek entry, given that the existing `rfid-tyvek-wristband` and `tyvek-rfid-wristband` already cover the Tyvek case in depth.
- **Waterpark RFID-pouch sub-option.** FAQ 1 mentions "we seal the RFID module in a waterproof pouch within the Tyvek band" for single-day waterpark use — this is a product variant. Consider whether a dedicated `/products/rfid-wristbands/waterpark-paper-rfid-wristband/` page is warranted or whether a feature bullet on this page is sufficient.
- **Coated-paper grade specifics.** "Tyvek (synthetic, water-resistant, tear-resistant) or coated paper (lower cost, adequate for indoor events)" — the coated-paper grade is unspecified. Naming the typical print paper grade (e.g., 170 gsm synthetic-coated) would strengthen the EEAT signal.
- **`sources` block absent.** Adding DuPont Tyvek 1073D datasheet, ISO/IEC 14443-3, NXP NTAG21x datasheet, and 1 hospital-visitor-management or festival-operations reference would match Batch 4 EEAT baseline.
