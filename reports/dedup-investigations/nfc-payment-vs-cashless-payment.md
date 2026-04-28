# Dedup Investigation — `nfc-payment-wristband` vs `cashless-payment-rfid-wristband`

**Date:** 2026-04-23
**Status:** Investigation complete. Awaiting merge-vs-keep decision.

## Pages under investigation

| | `cashless-payment-rfid-wristband.json` | `nfc-payment-wristband.json` |
|---|---|---|
| **Route** | `/products/rfid-wristbands/cashless-payment-rfid-wristband/` | `/products/rfid-wristbands/nfc-payment-wristband/` |
| **Title** | RFID Wristband with Cashless Payment Chip — Festival & Resort Payment Bands from Proud Tek | NFC Payment Wristbands — Cashless Tap-to-Pay for Festivals, Parks & Venues |
| **Length** | 149 lines | 214 lines |
| **Refinement status** | Batch 6 refined (2026-04-22) — all hrefs resolve, claims softened, PCI-DSS scope clarified in FAQ | NOT refined — carries full episodic-claim load |
| **Structural angle** | Chip-first (DESFire / Ultralight / NTAG selection → materials) | Outcome-first (challenges → solution → results → how-it-works → chip-table → benefits) |
| **Chip families** | `ntag21x, mifare-desfire, mifare-ultralight` | `ntag21x, mifare-classic, mifare-desfire` |
| **Environments** | `outdoor, tamper` | `outdoor` |
| **Industries** | `events-venues, hospitality` | `events-venues, hospitality` |
| **primaryAction** | `/contact/event-rfid/` (fixed) | `/contact/` (broken) |

## Topical overlap

**~70% content overlap.** Both pages cover:

- Same use-case (festival / theme-park / resort cashless commerce)
- Same platform partners (Tappit, Glownet, PlayPass, Intellitix)
- Same chip-decision framing (DESFire for offline stored-value, NTAG for cloud-based, MIFARE Classic/Ultralight for budget)
- Same form-factor options (silicone, fabric, Tyvek)
- Same industry targeting (events-venues + hospitality)
- Same buyer (event operator / festival producer)

## Structural differentiation

### Unique to `nfc-payment-wristband` (the stronger-structure page)

- **5-step "How cashless wristband payments work" walkthrough** — a clean conversion funnel for operators new to cashless. Cashless-payment covers the same material in bullets inside the "How cashless payment wristbands work at events" section; the 5-step format is scannable-Q/A-engine-friendly.
- **Chip-selection TABLE** — columns: Chip / Security / Offline capable / Cost / Best for. Rows: MIFARE Classic 1K, DESFire EV2, DESFire EV3, NTAG213. Much more scannable than cashless-payment's bullet-list chip-selection section.
- **"Offline vs online transactions" callout block** — explicit clarification of the DESFire-on-chip vs NTAG-cloud-lookup distinction, anchored as a `section.callout`.
- **Challenges section** — queue times, cash shrinkage, POS connectivity, vendor-analytics opacity, wristband-sharing prevention. Strong event-operator pain-point framing for answer-engine "why cashless wristbands" queries.
- **Results section** — per-capita spend, shrinkage recovery, queue reduction, analytics-driven restocking. Complements the Challenges section (pain → result arc).
- **Benefits section** — 6-bullet operator-facing benefits (higher revenue, faster service, analytics, shrinkage reduction, sponsor integration, post-event engagement).
- **POS-hardware FAQ** — "Can we use our own POS system or do we need special hardware?" — addresses real procurement anxiety.

### Unique to `cashless-payment-rfid-wristband` (the Batch-6-refined page)

- **PCI-DSS scope clarification in FAQ 2** — "Closed-loop wallet architectures typically keep the wristband itself out of PCI-DSS scope — confirm the scope assessment with your cashless-platform vendor." This is a **materially important legal/compliance line** for B2B buyers and is absent from nfc-payment.
- **Wristband-materials section as first-class content** — silicone adjustable / woven fabric / Tyvek disposable each with one-line spec. Cleaner than nfc-payment's treatment (which carries materials only as a `brief` block + bullets).
- **MIFARE Ultralight EV1** — covered as a distinct token-based-cashless chip option; nfc-payment omits this.
- **Already Batch-6-refined cross-links** — resourceCards hit Batch 3 (`mifare-plus-ev2-vs-desfire-ev3` compare) + Batch 4 (`rfid-event-access-control` solution) + Batch 2 industry landings + pillar. nfc-payment's resourceCards are a single "Related wristband products" block with 3 links, 2 of which are broken `/product/<slug>/` routes.
- **Companion blog** — `/blog/cashless-payment-rfid-wristbands/` forms a topical cluster with this SKU. `/blog/rfid-event-wristband-revenue-impact/` shares its heroImage. nfc-payment has no blog cluster.
- **`envFamilies` — `tamper`** — correctly flagged for one-time-sliding-lock tamper-evidence. nfc-payment omits the tamper env.

## Inbound link audit

**nfc-payment-wristband — 12 references across 11 files:**

- `_pillar.json` × 1 (application-specific list)
- `tyvek-rfid-wristband.json` × 1 (Batch 6b, resourceCards)
- `lp/rfid-wristband-manufacturer.json` × 1
- `industries/education.json` × 1 (campus events use-case)
- `industries/events-venues.json` × 2
- `industries/hospitality.json` × 1
- `solutions/rfid-event-wristbands.json` × 1
- `guides/ntag21x-family-memory-map-commands.json` × 1
- `compare/nfc-vs-bluetooth.json` × 2
- `compare/rfid-wristband-vs-rfid-card.json` × 1
- `compare/rfid-wristbands-hotels-vs-events-vs-resorts.json` × 1

**cashless-payment-rfid-wristband — 7 references across 6 files:**

- `_pillar.json` × 2 (application-specific list + secondary reference)
- `rfid-tyvek-wristband.json` × 1 (Batch 6, resourceCards)
- `rfid-adjustable-silicone-wristband.json` × 1 (Batch 6b, resourceCards)
- `fabric-rfid-wristband.json` × 3 (Batch 6b — imageSourceRoutes + resourceCards + secondaryActions)
- `blog/cashless-payment-rfid-wristbands.json` × 1 (companion blog — topical-cluster signal)
- `blog/rfid-event-wristband-revenue-impact.json` × 1 (shared hero image)

## SEO cannibalization assessment

**Risk: HIGH.** Both pages target the same core keyword cluster:

- "NFC payment wristband"
- "cashless payment wristband"
- "RFID payment wristband"
- "festival cashless wristband"

Google's keyword cannibalization penalty here means **neither page ranks as well as a single consolidated page would.** Search Console data (not yet audited in this investigation) would likely show the two pages splitting impressions / click-through on the same queries.

## Recommendation: MERGE into `cashless-payment-rfid-wristband` URL

### Rationale for URL choice

The kept URL should be `cashless-payment-rfid-wristband` because:

1. **Buyer-intent slug.** B2B event operators search "cashless wristband" / "cashless payment wristband" more than "NFC payment wristband" — NFC is the underlying tech, cashless is the buyer's language.
2. **Already Batch-6 refined.** PCI-DSS clarification, refined cross-links, tightened claim-hygiene, structured resourceCards with Batch 2/3/4 connections, `envFamilies: tamper` correctly set. Merging into this URL preserves that refinement work.
3. **Topical-cluster signal.** `/blog/cashless-payment-rfid-wristbands/` + `/blog/rfid-event-wristband-revenue-impact/` both anchor on the cashless-payment URL's hero image and naming. The blog cluster already points this direction.
4. **Title alignment.** "RFID Wristband with Cashless Payment Chip" reads as a canonical product title; "NFC Payment Wristbands" reads more like a category/landing.

### What to lift from `nfc-payment-wristband` into the merged page

Lift the structurally superior content and apply Batch-6 claim hygiene to each lifted block:

1. **5-step how-it-works walkthrough** — soften "under 200 ms" → "in a tap" (keep the 200 ms figure only if anchored to an ISO/IEC 14443-4 tpoll reference).
2. **Chip-selection TABLE** — keep as-is but add a CRYPTO-1 security-caveat footer row under MIFARE Classic 1K (matching the Batch-6 silicone-mifare-classic + adjustable-silicone pattern). Add MIFARE Ultralight EV1 row from cashless-payment.
3. **"Offline vs online transactions" callout** — keep as-is. Strong technical clarification.
4. **Challenges section** — lift with heavy claim softening: "5,000+ attendees / 4-8 minutes queue / 2-5% cash shrinkage / $10,000-$25,000 direct losses / $500,000 revenue event" → attribution intro citing Intellitix/Glownet/Tappit + softened qualitative framing ("large events / meaningful queue times at peak / a recognised shrinkage rate on cash-only operations per the published festival-cashless literature").
5. **Results section** — lift with claim softening: "15-30% per-capita spend / 2-4% gross revenue recovery / 4-8 minutes → under 90 seconds / 45-90 seconds for cash / 8-12% sold-out reduction" → attribution intro + qualitative framing, matching Batch 6 cashless-payment-rfid-wristband treatment already established.
6. **Benefits section** — condense into a single 6-bullet block with softened figures.
7. **POS-hardware FAQ** — lift as-is (no specific claims to soften; it's a procurement-process FAQ).

### What to keep from `cashless-payment-rfid-wristband`

- **Hero content + brief + existing structure** as the frame.
- **PCI-DSS scope FAQ line.** Critical legal/compliance clarification.
- **Materials section.** Keep as first-class content.
- **Existing resourceCards.** Already Batch-2/3/4 connected.
- **primaryAction** (`/contact/event-rfid/`), secondaryActions, relatedIndustries, envFamilies (`outdoor, tamper`).

### Post-merge mechanical tasks

1. **Write merged `cashless-payment-rfid-wristband.json`** with lifted + softened content. `modifiedAt: "2026-04-23"` unchanged, add a note to the audit trail.
2. **Update inbound links.** 12 references across 11 files currently point to `/products/rfid-wristbands/nfc-payment-wristband/`. Mechanically replace each with `/products/rfid-wristbands/cashless-payment-rfid-wristband/`. One exception: `_pillar.json` line 63 lists both in the application-specific list — remove `[NFC payment wristband]` from that list.
3. **Add a 301 redirect** from `/products/rfid-wristbands/nfc-payment-wristband/` → `/products/rfid-wristbands/cashless-payment-rfid-wristband/` in the site's redirect table (wherever that lives — likely `astro.config.mjs` `redirects` or a Netlify/Cloudflare `_redirects` file).
4. **Delete `nfc-payment-wristband.json`** from `src/content/editorial/products/rfid-wristbands/`.
5. **Verify.** Run the href-resolution script; confirm no broken links remain.

### Alternative (if merge feels aggressive): KEEP BOTH with tight angle split

If you want to preserve the "NFC-branded" URL for Apple Pay / tap-to-pay-terminology searchers:

- `cashless-payment-rfid-wristband` = **event-operator / B2B procurement angle** (materials, PCI-DSS, chip-selection-by-platform). Current refined content stays.
- `nfc-payment-wristband` = **consumer-facing / tap-to-pay-literacy angle** (outcome-first, 5-step how-it-works, chip-comparison table, results-oriented). Full Batch-6 refinement pass required (claim hygiene, ghost-slug fix, `/contact/` fix, resourceCards expansion).
- Add explicit scope-boundary sentences at the top of each page pointing to the other.
- **Risk:** Google may still keep ranking one and suppressing the other regardless of the angle split. Cannibalization is a probabilistic penalty, not a deterministic one.

## Decision matrix

| | Merge | Keep both with angle split | Do nothing |
|---|---|---|---|
| **SEO upside** | Strong (one page ranks for full cluster) | Mild (two pages compete) | None (current state) |
| **Content-work cost** | Merge + 12 inbound-link updates + 1 redirect + 1 delete | Full Batch-6 refinement of nfc-payment (same cost as any Batch 6c SKU) + scope-boundary sentences on both pages | 0 |
| **Risk** | Low — 301 handles external equity; inbound links are all internal and mechanically updatable | Medium — cannibalization may persist; ongoing maintenance burden of two near-duplicate pages | High — status quo compounds |
| **Editorial result** | One canonical, well-structured, well-sourced page | Two pages competing for similar intent, editorially defensible but redundant | Two pages competing with one unrefined |

## My recommendation

**Merge.** The structural content in `nfc-payment-wristband` is materially stronger (5-step funnel, chip-table, challenges/results framing) and the refinement work in `cashless-payment-rfid-wristband` (PCI-DSS, cross-links, softened claims) is already done. Merging yields a page that's the best of both, ranks for the full keyword cluster, and eliminates cannibalization risk.

The mechanical work (12 inbound-link updates + 1 redirect + 1 delete) is ~20 minutes of routine work plus a full Batch-6 claim-hygiene pass on the lifted content (~40 minutes). Total ~1 hour.

## Open items for your call

1. **Merge vs keep-split decision.** My recommendation is merge; you may prefer keep-split for link-equity or category-navigation reasons I don't have visibility into.
2. **Merged-URL choice.** My recommendation is keep `cashless-payment-rfid-wristband`; inverting to keep `nfc-payment-wristband` (higher raw inbound link count) is defensible but loses the Batch-6 refinement + blog-cluster alignment.
3. **Scope for next batch.** Batch 6c (remaining 7 wristband SKUs after this dedup resolves) vs Batch 5b (~60 rfid-labels SKUs). Ready for your pick.
