# Content Roadmap — 12 Weeks

Companion to `topical-authority-audit.md`. Each row: week, topic, type (new / upgrade), cluster, priority, rationale.

Priority codes: P0 = ship this week or lose cluster uplift; P1 = high; P2 = medium.

## Weeks 1-2 — Pillar pages for weakest + largest clusters (foundation)
Pillar pages are the single highest-leverage move: they rescue orphaned SKU pages, consolidate internal-link equity, and give AI engines a canonical anchor.

| Week | Topic | Type | Cluster | Priority | Rationale |
|---|---|---|---|---|---|
| 1 | Complete guide to RFID labels & inlays (/products/rfid-labels/) | New pillar | products/rfid-labels | P0 | Anchors 56 orphan pages; highest-traffic product cluster |
| 1 | Complete guide to RFID tags (/products/rfid-tags/) | New pillar | products/rfid-tags | P0 | Anchors 70 pages — largest cluster, most immediate lift |
| 2 | Complete guide to RFID cards (/products/rfid-cards/) | New pillar | products/rfid-cards | P0 | Zero-freshness cluster needs anchor + 2026 framing |
| 2 | Complete guide to RFID wristbands (/products/rfid-wristbands/) | New pillar | products/rfid-wristbands | P0 | Anchors 20 pages |
| 2 | Complete guide to RFID keyfobs (/products/rfid-keyfobs/) | New pillar | products/rfid-keyfobs | P0 | Zero-freshness cluster; anchor + refresh in one |

Additional week 1-2 micro-tasks (batched, not own row): cross-link campaign — every product-cluster supporting page should link to its pillar in `resourceCards`; `modifiedAt` refresh for all pillars.

## Weeks 3-4 — Industries cluster lift + pillar
Industries is the weakest cluster on internal linking (0.1 links/page). Fixing it multiplies equity flowing to products.

| Week | Topic | Type | Cluster | Priority | Rationale |
|---|---|---|---|---|---|
| 3 | /industries/ master pillar with filter-by-use-case | New pillar | industries | P0 | Gives 15 (soon 25) industry pages a hub |
| 3 | Automotive & tire OEM (industry page) | New | industries | P1 | Tire reg 2024+ hot; have tire tag, no industry |
| 3 | Aerospace & aviation MRO | New | industries | P1 | ATA Spec 2000 traffic |
| 4 | Data center & IT asset tracking | New | industries | P1 | Enterprise RFP fit |
| 4 | Government & defense supply chain | New | industries | P1 | High ASP segment |
| 4 | Cold chain / food traceability | New | industries | P1 | Adjacent to pharma; ties to temperature-sensor tag |
| 4 | Industry-page internal-link pass (each of 15 existing pages links to 5-8 product + 2-3 guide pages) | Upgrade | industries | P0 | Fixes 0.1 same-cluster metric |

## Weeks 5-6 — High-priority SKU gaps + chip encyclopedia (guides)

| Week | Topic | Type | Cluster | Priority | Rationale |
|---|---|---|---|---|---|
| 5 | NXP UCODE 9 chip encyclopedia (guides) | New | guides | P1 | Cited by engineers; currently bundled |
| 5 | NXP UCODE 8 chip encyclopedia (guides) | New | guides | P1 | Large installed base |
| 5 | Impinj Monza R6 / R6-P / 4QT encyclopedia (guides) | New | guides | P1 | Industrial buyer content |
| 5 | UCODE 8 vs UCODE 9 vs Monza R6 vs Higgs-9 (4-way UHF comparison) | New | compare | P0 | Top long-tail SERP — unowned |
| 6 | NTAG21x family encyclopedia (guides) | New | guides | P1 | Foundational, heavily searched |
| 6 | NTAG424 DNA SUN + CMAC authentication encyclopedia | New | guides | P0 | AI-citation gold; anti-counterfeit |
| 6 | MIFARE DESFire EV3 command & file types | New | guides | P1 | Integrator content |
| 6 | Impinj M730 & M750 & M800 — individual SKU pages | New (3) | products/rfid-labels | P1 | Break out from bundled inlay page |

## Week 7 — Reader cluster seed (net-new)
The absence of any RFID reader content is a brand-trust issue. Even a small seed cluster fixes it.

| Week | Topic | Type | Cluster | Priority | Rationale |
|---|---|---|---|---|---|
| 7 | /products/rfid-readers/ pillar (new cluster) | New pillar | products/rfid-readers | P1 | Stakes ground before competitors claim citations |
| 7 | Fixed UHF reader product page (Impinj R700 class) | New | products/rfid-readers | P1 | Most-searched reader form factor |
| 7 | Handheld UHF reader product page | New | products/rfid-readers | P1 | Asset tracking SERP |
| 7 | Desktop NFC reader/encoder product page | New | products/rfid-readers | P1 | Card issuance buyer |
| 7 | Impinj R700 vs Zebra FX9600 comparison (compare cluster) | New | compare | P1 | Lucrative reader comparison SERP |

## Weeks 8-10 — Application use-cases + comparison depth

| Week | Topic | Type | Cluster | Priority | Rationale |
|---|---|---|---|---|---|
| 8 | RFID for pharmacy inventory management (industry/application) | New | industries/solutions | P1 | High-intent vertical |
| 8 | UHF RFID for tire OEM traceability (application) | New | solutions | P1 | Paired with automotive industry page |
| 8 | Hospital RFID instrument tracking (application deep-dive) | New | solutions | P1 | Adjacent to surgical-instrument tag |
| 8 | Cold chain RFID solution page | New | solutions | P1 | Closes pharma + food loop |
| 9 | Fleet / vehicle management RFID solution | New | solutions | P2 | Medium volume |
| 9 | Kiosk / self-check-in solution page | New | solutions | P2 | Hotel + airport |
| 9 | Cashless wristband payment architecture (guides) | New | guides | P1 | PCI/EMV Contactless content |
| 9 | Wet inlay vs dry inlay (compare upgrade to 900+ words) | Upgrade | compare | P1 | Current is 300-something words |
| 10 | HID iCLASS vs MIFARE DESFire for enterprise access | New | compare | P1 | RFP decision page |
| 10 | Passive UHF vs BAP vs Active RFID comparison | New | compare | P1 | Foundational |
| 10 | RFID temperature logger vs battery-assisted sensor | New | compare | P1 | Cold chain pharma |
| 10 | Compare-cluster depth pass: expand 15 existing compare pages from 300 to 700+ words with chip refs, standards, decision matrix | Upgrade | compare | P0 | Biggest single quality lift |

## Weeks 11-12 — FAQ / how-to / evergreen reference

| Week | Topic | Type | Cluster | Priority | Rationale |
|---|---|---|---|---|---|
| 11 | How to encode an NTAG213 with NDEF (how-to, with code samples) | New | guides | P1 | Transactional searcher |
| 11 | How to calculate RAIN RFID read range (math + calculator table) | New | guides | P0 | Citation-gold; engineers love it |
| 11 | How to choose a UHF tag for challenging materials (metal, liquid, cryo) — decision tree | New | guides | P1 | Foundational decision page |
| 11 | RAIN RFID sensitivity testing methodology (Voyantic Tagformance + ETSI EN 302 208) | New | guides | P0 | Rare online, owns AI citation |
| 12 | FCC Part 15 vs ETSI EN 302 208 vs Japan 916-922 MHz regional guide | New | guides | P1 | Regional engineer content |
| 12 | ISO 14443 Type A vs Type B (compare) | New | compare | P1 | Standards question |
| 12 | GS1 EPC Gen2 Tag Data Standard 2.0 field guide | New | guides | P1 | Supply chain engineers |
| 12 | Compatibility cluster depth pass: upgrade all 7 existing pages from 235 → 700 words | Upgrade | compatibility | P0 | Weakest-depth cluster on site |
| 12 | Blog cross-link campaign (raise same-cluster links from 0.6 → 2.5/page) | Upgrade | blog | P0 | Already have 90 posts — link equity unrealized |

---

## Summary by week

- Weeks 1-2: 5 product-cluster pillars (foundation fix)
- Weeks 3-4: Industries pillar + 5 new industry pages + link pass
- Weeks 5-6: Chip encyclopedia guides + high-value comparisons + break-out SKU pages
- Week 7: Seed a readers cluster
- Weeks 8-10: Application/use-case pages + comparison depth
- Weeks 11-12: How-to, evergreen reference, and site-wide linking pass

**Volume:** ~50 new/upgraded pages over 12 weeks = roughly 4-5 pages per week, matching Peter's cap.

**Expected outcomes if executed:**
- Every product SKU page gains a direct path to/from a pillar (AI citation boost)
- Industries cluster internal-link density goes from 0.1 → ~5 links/page
- Compare cluster average word count goes from 326 → 700+
- Guides cluster gets 10+ new standards/encyclopedia pages (AI citation gold)
- Freshness signals across keyfobs, cards, lp upgraded to 2026

**Not on this roadmap (intentionally):**
- Markets cluster expansion (low priority unless geo-SEO is reprioritized)
- LP cluster rewrites (commercial, already converting)
- Blog backfill for 2018-2023 pages (do as ongoing maintenance, not sprint)
