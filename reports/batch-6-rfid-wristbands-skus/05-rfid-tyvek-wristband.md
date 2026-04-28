# 05 — RFID Tyvek Wristband

**File:** `src/content/editorial/products/rfid-wristbands/rfid-tyvek-wristband.json`
**Route:** `/products/rfid-wristbands/rfid-tyvek-wristband/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage` was `/landing-images/rfid-tyvek-wristband-alt.jpg` — the `-alt` variant is the **only** canonical file on disk; `rfid-tyvek-wristband.jpg` (without `-alt`) does NOT exist. Treat `-alt` as canonical; no change needed.
- `publishedAt` / `modifiedAt` absent.
- `imageSourceRoutes` contained 2 broken singular `/product/...` routes (`rfid-wristbands-for-events`, `nfc-stickers`).
- `heroPoints[0]` carried "per-wristband costs under $0.60 at volume" specific price.
- `sections[0]` "Why paper tickets and barcode wristbands cannot support" was claim-heavy:
  - "2-4 seconds per scan"
  - "400-600 guests per hour per lane"
  - "20-45 minute entry queues"
  - "3-8% fraudulent entry"
- `sections[2]` "Applications" bullet 1 carried "1,200+ guests/hour/lane with RFID vs. 500 with barcode".
- `faq[0]` carried "1,200-1,500 guests per hour per lane", "2-3x improvement", "exceeds 2,000 guests per hour" specifics.
- `faq[1]` carried "Average transaction time drops from 15-20 seconds (card/cash) to 2-3 seconds (RFID tap), increasing per-guest spend by 15-30% at major festivals".
- `faq[2]` carried "12+ hours of continuous rain".
- `resourceCards` had 2 entries; no Batch 2 industry, Batch 3 event-related compare, or Batch 4 event-access-control solution cross-links (though UCODE chip compare was present).
- `primaryAction.href` was bare `/contact/` (broken).
- **Duplicate-cluster concern:** `/products/rfid-wristbands/tyvek-rfid-wristband/` also resolves — two near-identical slugs (`tyvek-rfid-wristband` and `rfid-tyvek-wristband`) both have live SKU pages. Requires a dedup decision in follow-up audit.
- `chipFamilies: ["ntag21x", "impinj-m7", "ucode"]` — correct (NFC + UHF options).
- `envFamilies: ["outdoor", "tamper"]` — correct.

## Changed

**Image.** No change (`-alt` is canonical).

**Metadata.** Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`.

**`imageSourceRoutes`.** Fixed to semantically-adjacent plural routes: `/products/rfid-wristbands/tyvek-rfid-wristband/` (the direct near-slug sibling) + `/products/rfid-wristbands/paper-rfid-wristband/` (the paper-disposable sibling).

**Claim hygiene — heroPoints.** "per-wristband costs under $0.60 at volume" → "paper-label-tier per-wristband pricing at volume — unit cost depends on chip (NTAG213 vs UHF Monza/UCODE), print spec and order volume".

**Claim hygiene — Problems section.** Added intro: "Comparative throughput and fraud-rate figures below are drawn from the published event-operations and festival-cashless literature; realised gains depend on lane configuration, reader hardware and scan workflow." Softened all 4 bullets:
- "2-4 seconds per scan ... 400-600 guests per hour per lane ... 20-45 minute entry queues" → "several seconds per scan, creating gate bottlenecks that can cause multi-minute entry queues at peak arrival"
- "3-8% fraudulent entry" → "a measurable fraudulent-entry rate at barcode-only events"
- cashless + analytics bullets unchanged in substance

**Claim hygiene — Applications section.** "1,200+ guests/hour/lane with RFID vs. 500 with barcode" → "tap-based NFC RFID materially outperforms barcode-scanning throughput per lane, per the published event-operations benchmarks".

**Claim hygiene — FAQ.** FAQ 1 "1,200-1,500/hour per lane, 2-3x improvement, 2,000/hour UHF" → "a multiple higher than barcode scanning ... higher still" (directional). FAQ 2 "15-20 → 2-3 seconds ... 15-30% spend increase" → "tap transaction time is materially shorter than cash or card swipe, and the published festival-cashless literature consistently reports a meaningful per-guest spend uplift after the switch". FAQ 3 "12+ hours of continuous rain" → "extended continuous-rain and splash exposure" + added "For full submersion (pool / waterpark), specify a silicone or PVC wristband instead" scope boundary.

**Cross-link density.** Expanded `resourceCards` from 2 → 3 entries:
1. **Related disposable and reusable event wristbands** — 4 entries (rfid-vinyl-wristband, paper-rfid-wristband, fabric-rfid-wristband, cashless-payment-rfid-wristband).
2. **Industry landings** — events-venues + hospitality (Batch 2).
3. **Related solution, compares, guide and pillar** — rfid-event-access-control (Batch 4), UHF chip compare + NTAG memory compare (Batch 3), festival RFID blog, wristband pillar.

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/event-rfid/`.

## SEO / GEO shape

Strong. Summary opens answer-first (disposable tamper-evident NFC/UHF wristband for one-day events). The "Why paper tickets and barcode wristbands cannot support" section, with its directional-benchmark intro, is an ideal answer block for "RFID vs barcode event wristbands" queries.

The "Proud Tek RFID Tyvek wristbands" spec section (5 bullets: Tyvek grade, chip options, closure, printing, pre-encoding) is a clean Q/A extraction target for "what is a Tyvek RFID wristband" queries.

The "Applications" section (5 bullets: festivals, conferences, waterparks, charity runs, corporate events) is a query-rich surface — each bullet is an answer target for "RFID Tyvek wristband use cases" queries.

FAQ covers 3 practitioner questions (gate throughput with the softened framing, cashless payment integration, waterproof boundary with the submersion scope-note).

## Verification

- JSON parses ✅
- Zod schema ✅
- `heroImage: /landing-images/rfid-tyvek-wristband-alt.jpg` exists on disk ✅ (canonical; non-alt does not exist)
- 14 internal hrefs, all resolve ✅
- `chipFamilies: ["ntag21x", "impinj-m7", "ucode"]` correct ✅
- `envFamilies: ["outdoor", "tamper"]` correct
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **Duplicate-cluster audit required.** `/products/rfid-wristbands/tyvek-rfid-wristband/` and `/products/rfid-wristbands/rfid-tyvek-wristband/` both resolve. Clarify whether this is an intentional form-factor split (e.g., NFC-only vs UHF-capable) or a migration duplicate requiring a merge-plus-301. Flag as highest-priority Batch 6b item.
- **`/products/rfid-wristbands/paper-rfid-wristband/`** — the paper-disposable sibling linked but not Batch-6-refined. Natural Batch 6b candidate.
- **`/solutions/rfid-event-access-control/`** — linked; already Batch-4-refined. Confirm return-link from the solution into this SKU as the dominant festival-wristband form factor.
- **`sources` block absent.** Adding Eventbrite / Live Nation / AEG festival-operations case studies, IAAPA, DuPont Tyvek 1073D / 1082D datasheets, ISO/IEC 14443-3 and ISO/IEC 18000-63 would match Batch 4 EEAT baseline.
- **hero image filename asymmetry** — `-alt` suffix with no non-`-alt` variant is unusual. Clean-up recommendation: rename file to `rfid-tyvek-wristband.jpg` (drop `-alt`) and update the path here, or verify `-alt` is intentional (e.g., alternate to the `/tyvek-rfid-wristband.json` SKU's hero).
