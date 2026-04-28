# Merge Executed — `nfc-payment-wristband` → `cashless-payment-rfid-wristband`

**Date:** 2026-04-23
**Status:** Complete. JSON parses, hrefs resolve, heroImage verified, redirect in place.

## Summary

Merged the two near-duplicate payment wristband pages into a single canonical URL (`cashless-payment-rfid-wristband`) per the investigation recommendation. The merged page is the best-of-both: structurally richer (5-step walkthrough + chip-selection table + offline/online callout + challenges/results/benefits arc lifted from nfc-payment) and editorially clean (PCI-DSS FAQ, CRYPTO-1 caveat, Batch 6 claim-hygiene, Batch 2/3/4 cross-links preserved from the refined cashless-payment page).

## What was lifted from `nfc-payment-wristband`

All content was rewritten with Batch 6 claim-hygiene (attribution intros, softened specific %/$/time figures, preserved datasheet-anchored facts with source attribution):

1. **5-step "How cashless wristband payments work" walkthrough.** Now a dedicated section. Softened "within 3-7 business days" in step 5 → "typically within a few business days, subject to the cashless-platform's refund policy".
2. **Chip-selection TABLE** (columns: Chip / Security / Offline capable / Cost tier / Best for). Expanded from 4 rows to 5 rows by adding **MIFARE Ultralight EV1** (lifted from the cashless-payment original chip-bullets). Added explicit CRYPTO-1 caveat on the MIFARE Classic 1K row ("CRYPTO-1 (legacy, known academic attacks) ... Short-duration budget closed-loop events only"). Dollar-cost column reframed as "Cost tier" with `$` / `$$` / `$$$` (no absolute dollar figures).
3. **"Offline vs online transactions" callout block.** Lifted as-is; expanded with outdoor-field deployment recommendation.
4. **Challenges section.** Reframed with `intro` literature-attribution citing Intellitix / Glownet / PlayPass / Tappit / Live Nation / AEG. All specific figures softened:
   - "5,000+ attendees / 4-8 minutes queue" → "large festivals / meaningful queue wait times during peak service periods per the published festival-operations literature"
   - "2-5% of gross revenue / $10,000-$25,000 direct losses / $500,000 revenue event" → "recognised shrinkage rate on gross revenue...per the festival-cashless literature — a material direct loss at any event scale"
5. **Results section.** Title changed to "Typical outcomes event organizers achieve with cashless wristbands" with literature-attribution `intro`. All specific figures softened:
   - "15-30% per-capita spend uplift" → "meaningful per-capita spend uplift ... per the published festival-cashless literature"
   - "2-4% gross revenue recovery" → "cash-handling-loss portion of gross revenue"
   - "4-8 minutes → under 90 seconds / 45-90 seconds for cash" → "drop substantially at peak load versus cash operations"
   - "8-12% sold-out reduction" → "reducing 'sold out' revenue losses versus retrospective cash-register totals"
6. **Benefits section.** Lifted as 6-bullet operator-facing list; softened "15-30% higher" → "meaningful per-capita uplift per the published festival-cashless literature"; softened "under 200 ms" → "in a tap at ISO/IEC 14443-4 reader timing" (retains a datasheet anchor while removing the episodic-ms figure).
7. **POS-hardware FAQ** ("Can we use our own POS system?"). Lifted as-is — it's a procurement-process FAQ with no specific claims.

## What was preserved from `cashless-payment-rfid-wristband`

- **Summary, heroPoints, heroImage, imageSourceRoutes** — unchanged (Batch 6 refined).
- **PCI-DSS scope FAQ line** — preserved verbatim; extended with CRYPTO-1 MIFARE Classic caveat cross-reference and `sources` entry pointing to the Courtois/Meijer/Verdult attack-paper eprint.
- **Materials / form-factor section** — preserved; one bullet added to cover PVC (completing material coverage from 3 → 4 form-factors).
- **resourceCards** — preserved (Batch 2 industry landings, Batch 3 chip compare, Batch 4 event-access-control solution, festival-guide blog); expanded "Related event and festival RFID wristbands" card from 3 → 4 wristband links by adding `silicone-wristband-mifare-classic` (Batch 6 material sibling); added `cashless-payment-rfid-wristbands` companion blog to the solutions/compares card.
- **`chipFamilies`** — expanded from `["ntag21x","mifare-desfire","mifare-ultralight"]` to `["ntag21x","mifare-classic","mifare-desfire","mifare-ultralight"]` (the nfc-payment page had mifare-classic; merging absorbs the superset).
- **`envFamilies`** — preserved `["outdoor","tamper"]` (the tamper-env anchor comes from the one-time-sliding-lock + anti-transfer positioning in the Materials section; nfc-payment's narrower `["outdoor"]` would have dropped the tamper anchor).
- **`relatedIndustries`** — preserved `["events-venues","hospitality"]` (same on both source pages).
- **`modifiedAt`** — updated to 2026-04-23; `reviewedAt` updated to 2026-04-23.

## Inbound-reference updates (12 references across 11 files)

All 12 references to `/products/rfid-wristbands/nfc-payment-wristband/` replaced with `/products/rfid-wristbands/cashless-payment-rfid-wristband/`. Labels updated from "NFC payment wristband(s)" → "Cashless payment wristband" for consistency with the kept URL's positioning:

| File | Type of reference | Label change |
|---|---|---|
| `products/rfid-wristbands/tyvek-rfid-wristband.json:264` | resourceCards link | NFC payment wristbands → Cashless payment wristband |
| `products/rfid-wristbands/_pillar.json:63` | Application-specific list | **Removed duplicate entry** (was both "Cashless payment RFID wristband" + "NFC payment wristband" pointing to two URLs); now only the canonical entry remains |
| `lp/rfid-wristband-manufacturer.json:139` | resourceCards link | NFC payment wristbands → Cashless payment wristband |
| `industries/education.json:115` | Inline-text SKU mention | URL replaced; text preserved |
| `industries/events-venues.json:86` | Table-row SKU pointer | URL replaced |
| `industries/events-venues.json:188` | resourceCards link | Payment wristbands → (preserved, no change — already generic) |
| `industries/hospitality.json:97` | Table-row category name | NFC payment wristband → Cashless payment wristband |
| `industries/hospitality.json:171` | resourceCards link | NFC payment wristband → Cashless payment wristband |
| `solutions/rfid-event-wristbands.json:233` | resourceCards link | NFC payment wristband → Cashless payment wristband |
| `guides/ntag21x-family-memory-map-commands.json:305` | resourceCards link | NFC payment wristband → Cashless payment wristband |
| `compare/nfc-vs-bluetooth.json:22` | imageSourceRoutes | URL replaced |
| `compare/nfc-vs-bluetooth.json:125` | resourceCards link | NFC payment wristbands → Cashless payment wristband |
| `compare/rfid-wristband-vs-rfid-card.json:202` | resourceCards link | NFC payment wristbands → Cashless payment wristband |
| `compare/rfid-wristbands-hotels-vs-events-vs-resorts.json:211` | resourceCards link | NFC payment wristbands → Cashless payment wristband |

## 301 redirect

Added to `public/_redirects`:

```
# Wristband SKU dedup consolidations (2026-04-23)
/products/rfid-wristbands/nfc-payment-wristband/ /products/rfid-wristbands/cashless-payment-rfid-wristband/ 301
```

## File deletion

`src/content/editorial/products/rfid-wristbands/nfc-payment-wristband.json` — deleted.

## Verification

- ✅ Merged JSON parses (7 sections, 5 FAQs, 3 resourceCards, 4 chipFamilies)
- ✅ Zod schema shape matches existing editorial schema (no new fields introduced)
- ✅ `heroImage: /landing-images/cashless-payment-rfid-wristband.jpg` exists on disk
- ✅ All 16 internal hrefs in merged file resolve (1 external source link verified via redirect)
- ✅ 11 affected inbound-reference files all JSON-parse after mechanical URL + label swap
- ✅ No orphan `nfc-payment-wristband` references remain anywhere under `src/content/`
- ✅ 301 redirect present in `public/_redirects`
- ✅ `_pillar.json` application-specific list duplicate removed
- ✅ `modifiedAt` and `reviewedAt` both 2026-04-23

## Net result

- **1 canonical page** on the cashless-payment keyword cluster (was 2 cannibalizing pages)
- **Best-of-both structure:** 5-step funnel + chip table + offline callout + challenges/results (from nfc-payment) combined with PCI-DSS clarity + refined resourceCards + companion blog cluster (from cashless-payment)
- **Zero broken links** — 12 inbound updates all clean
- **External equity preserved** — 301 in place
- **Merged page has more chip options** (4 chipFamilies vs 3 previously) because the union captured both pages' coverage
- **Merged page retains `envFamilies: ["outdoor","tamper"]`** — the tamper anchor survives

## Open items post-merge

- **Build smoke-test.** Haven't run `astro build` in this session; when you next build, confirm the sitemap and internal-link-graph regenerate cleanly with the merged SKU as the sole payment-wristband entry.
- **Analytics continuity.** If the `nfc-payment-wristband` URL had its own GA4 / Search Console event-tagging, confirm that the 301 rolls the traffic / impressions onto the canonical URL within 2-4 weeks.
- **Backlink profile.** External sites still pointing at `/products/rfid-wristbands/nfc-payment-wristband/` will be served the 301; over time, high-authority external links are worth a manual outreach to update the anchor to the canonical URL directly (this preserves more equity than a 301 in the long run).
- **`sources` block.** The merged page has one `sources` entry (Courtois/Meijer/Verdult CRYPTO-1 papers) in FAQ 2. A pass to add the broader Batch 4 EEAT baseline (ISO/IEC 14443, Intellitix/Glownet case studies, NXP DESFire datasheet, PCI-DSS scope guidance document) would complete the source-attribution profile.
