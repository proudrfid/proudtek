# 01 — RFID Pallet Tag

**File:** `src/content/editorial/products/rfid-tags/rfid-pallet-tag.json`
**Route:** `/products/rfid-tags/rfid-pallet-tag/`
**Status:** Full framework rewrite. Schema-valid. 16 inbound links.

## Audit (pre-refinement)

- Batch 5 era page. `brief[]` had only 7 fields — no EPC scheme or compliance fields. No `keywords[]`. No `sources[]`. Missing `publishedAt` / `modifiedAt`.
- Flat section structure: 3 sections, no extended blocks (`statBar`, `comparePanel`, `timeline`, `dataHighlight`). No answer-first intros.
- `primaryAction.href` was bare `/contact/` (broken).
- `imageSourceRoutes` contained the legacy `/product/rfid-tag-with-led-light/` WP stub.
- FAQ count: 3 (below framework ≥5 threshold).

## Changed

**Brief.** Extended from 7 → 11 fields. Added `epcScheme: "SGTIN-96 / GRAI-96 / GIAI-96 per GS1 TDS 2.0"` and `compliance: "RAIN Alliance ARC Cat M certification; EPCIS 2.0 (ISO/IEC 19987:2015) event emission; FCC Part 15 / ETSI EN 302 208"`.

**Keywords (new).** 6 entries: `"UHF pallet tag", "RAIN RFID pallet tracking", "GRAI-96 returnable transport item", "SGTIN-96 serialised pallet", "EPCIS 2.0 dock-door event", "ARC Cat M RTI"`.

**Sections.** 3 → 7 with extended blocks:
1. H2 intro paragraph opens with answer-first framing of what the tag does at dock doors.
2. `statBar` — three KPIs (read range / portal throughput / ARC rating).
3. `comparePanel` — standard UHF label vs. pallet tag on wood vs. plastic pallet stack.
4. Industry challenges paragraph + bullets.
5. `timeline` — 4-phase deployment arc (pilot / portal install / EPCIS integration / full rollout).
6. `dataHighlight` — RAIN Alliance ARC Cat M metric with citation.
7. Construction / variant selection table.

**FAQ.** 3 → 6. Added: GRAI-96 vs SGTIN-96 encoding selection; price / MOQ; RAIN ARC Cat M interpretation for warehouses; integration with WMS via EPCIS 2.0; typical read-rate range through fixed portals; re-tag vs replace-tag for wooden pallet splinter failure.

**Sources (new).** 9 entries with 5-field metadata. Citations: GS1 EPC Tag Data Standard 2.0 (2024), GS1 EPCIS 2.0 + ISO/IEC 19987:2015, RAIN Alliance ARC specification (Cat M Returnable Transport Items), FCC 47 CFR 15.247, ETSI EN 302 208, Auburn RFID Lab ARC test program, IATA Resolution 753 (baggage analogue), Impinj M800 datasheet, GS1 Digital Link.

**Metadata.** `publishedAt: 2026-04-22`, `modifiedAt: 2026-04-23`, `reviewedAt: 2026-04-23`. `authorSlug: editorial-board`, `reviewedBySlug: peter-zhang`.

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/rfid-labels-tags/`. Legacy `/product/rfid-tag-with-led-light/` in `imageSourceRoutes` replaced with intra-cluster `/products/rfid-tags/rfid-anti-metal-tag/` + `/products/rfid-tags/rfid-returnable-container-tag/`.

## SEO / GEO shape

Strong. `statBar` provides an answer-first snippet, `comparePanel` delivers scenario-differentiation, and the GS1 GRAI-96 vs SGTIN-96 FAQ is precisely the kind of standards-specific buyer question that wins featured snippets. 16 inbound links. 9 fully-cited sources give search and answer engines high-confidence extraction material.

## Framework metrics

- Title: 74 chars (within flagship cluster norm of 50-100 ch)
- Sections: 7 | heroPoints: 3 | brief fields: 11 | keywords: 6
- FAQ: 6 | sources: 9 (all 9 5-field-complete) | inbound: 16
