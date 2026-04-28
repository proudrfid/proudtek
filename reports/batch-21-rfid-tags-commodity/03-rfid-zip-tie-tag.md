# 03 — RFID Zip Tie Tag

**File:** `src/content/editorial/products/rfid-tags/rfid-zip-tie-tag.json`
**Route:** `/products/rfid-tags/rfid-zip-tie-tag/`
**Status:** Full framework rewrite. Schema-valid. Hero-image collision fixed. Cable-tie differentiation clarified. 5 inbound links.

## Audit (pre-refinement)

- **Thinnest of the 4 refined pages.** Only 2 sections, no `brief[]`, no `keywords[]`, no `sources[]`, no extended blocks. FAQ count: 2. The page was effectively a stub.
- **Hero image collision.** `heroImage` was `/landing-images/rfid-cable-tie-tag.jpg` — shared with the adjacent cable-tie page. This is a semantic duplication that Google and other search engines can penalise as thin-content or duplicate-imagery.
- `primaryAction.href`: `/contact/` (broken).
- Page lacked any differentiation from `rfid-cable-tie-tag`. Buyers landing on both pages saw overlapping content with no clear "use zip-tie when X vs cable-tie when Y" guidance.

## Changed

**Hero image collision — fixed.** `/landing-images/rfid-cable-tie-tag.jpg` → `/landing-images/rfid-zip-tie-tag.png` (verified file exists via `ls`).

**Cable-tie differentiation built-in.** Added a dedicated `comparePanel` explicitly differentiating:
- **Zip-tie (3-50 mm diameter)** — thinner cable/harness bundles, snap-lock single-use, screw-retention option for data center racks, lower cost per tag.
- **Cable-tie (5-200 mm diameter)** — larger pipe/conduit/cable bundles, higher tensile rating, outdoor-rated variants, multi-year reusability. Typical pricing 2-3× higher.

Buyers landing on zip-tie now have clear "pick zip-tie if your target bundle is ≤50 mm" guidance, and cable-tie now has clear "pick cable-tie if target is ≥50 mm or outdoor-exposed" guidance.

**Brief.** 0 → 11 fields (all Batch 21 standard including EPC scheme + compliance).

**Keywords (new).** 6 entries: `"RFID zip tie tag", "data-center cable tracking", "GIAI-96 network asset", "TIA-606-C compliant cable label", "harness identification RFID", "server rack cable management"`.

**Sections.** 2 → 6 with extended blocks:
1. H2 intro — who needs this and the bundle-size framing.
2. `statBar` — tie length / bundle-size range / read range.
3. `comparePanel` — zip-tie vs cable-tie selection matrix.
4. `dataHighlight` — TIA-606-C compliance metric.
5. `timeline` — data-center cable-management deployment phases.
6. Deployment-pattern bullets (neutral-voice, no specific-customer attribution).

**FAQ.** 2 → 5. Added: zip-tie vs cable-tie selection criteria; snap-lock vs screw-retention; data-center TIA-606-C cable label integration; EPCIS event emission at rack ingress/egress; single-use vs reusable classification.

**Sources (new).** 9 entries with full 5-field metadata. Shared citation base with cable-tie (TIA-606-C, GIAI-96, RAIN ARC) but page-specific bulletins added — TIA-569 telecom pathway spec, ISO/IEC 24764 generic cabling for data centres, BICSI 002 data-center best practices.

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/rfid-labels-tags/`.

**Metadata.** Standard Batch 21 set.

## SEO / GEO shape

Rebuilt from thin-page to framework-compliant. The explicit zip-tie vs cable-tie comparePanel is genuinely buyer-useful — most competitor pages sell the category-generic tag without surfacing bundle-size selection guidance. 5 inbound links is the lowest of the 4 pages (vs 15-59 elsewhere) reflecting the SKU's lower prominence in the pre-Batch 21 internal-link graph. A follow-up in Batch 22+ should add 2-3 more inbound links from data-center and network-asset industry landings.

## Framework metrics

- Title: 53 chars (below 60 — clean short-title)
- Sections: 6 | heroPoints: 3 | brief fields: 11 | keywords: 6
- FAQ: 5 | sources: 9 (all 9 5-field-complete) | inbound: 5
