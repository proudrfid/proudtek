# 02 — RFID Cable Tie Tag

**File:** `src/content/editorial/products/rfid-tags/rfid-cable-tie-tag.json`
**Route:** `/products/rfid-tags/rfid-cable-tie-tag/`
**Status:** Full framework rewrite. Schema-valid. Fabricated "Results clients achieve" section de-identified. 15 inbound links.

## Audit (pre-refinement)

- Batch 5 era. Carried the same class of fabricated "Results clients achieve" episodic claims as the anti-metal pilot — utility 12,000-valve deployment, DC tag-read accuracy 94→99.8%, rental-tool 4-month ROI, oil-gas pipeline segment tracking. These were never tied to any named customer case study and drifted into ProudTek brand-voice claims with specific numerics.
- `brief[]` had 7 fields. No `keywords[]`, no `sources[]`, no extended blocks, no answer-first intros.
- FAQ count: 3.

## Changed (critical — Blocker C resolution)

**Fabricated "Results clients achieve" section removed.** Replaced with a new section titled **"Deployment patterns integrators follow on cable and pipe programs"** — neutral-voice pattern description wrapped in a `timeline` block with accompanying disclaimer paragraph that explicitly declines to attribute specific-customer performance. Timeline phases: site survey & tie-size selection → pilot on 50-200 assets → reader infrastructure & EPCIS integration → staged rollout. No specific customer numerics, no episodic "14,800 assets inventoried in 6 weeks" style claims.

## Changed (framework upgrade)

**Brief.** 7 → 11 fields. Added EPC scheme (GIAI-96 for individual assets / SGTIN-96 for serialised goods) and compliance (TIA-606-C structured cabling identification, RAIN Alliance ARC Cat F/H).

**Keywords (new).** 6 entries: `"RFID cable tie tag", "UHF zip-tie asset tag", "GIAI-96 asset identification", "TIA-606-C cable label", "data-center cable tracking", "pipe identification RFID"`.

**Sections.** 3 → 8 with extended blocks:
1. H2 intro — who needs this and what problem it solves.
2. `statBar` — tie-length range / read range / IP rating.
3. `comparePanel` — adhesive label vs cable tie vs zip-tie on bundled cable.
4. Procurement challenges bullets.
5. Attachment-pattern bullets.
6. `dataHighlight` — 2-4 mm air-gap performance band with antenna-theory citation.
7. **Deployment patterns (replaces fabricated Results).** Timeline + disclaimer paragraph.
8. Construction / variant table.

**FAQ.** 3 → 6. Added: GIAI-96 vs SGTIN-96 encoding choice; price / MOQ; outdoor / UV life; re-tag on tie breakage; data-center TIA-606-C integration; cable-tie vs zip-tie selection.

**Sources (new).** 9 entries with full 5-field metadata. Citations: GS1 EPC TDS 2.0 GIAI-96 section, GS1 EPCIS 2.0 / ISO/IEC 19987:2015, RAIN Alliance ARC Cat F/H, TIA-606-C structured cabling identification standard, ANSI/TIA-942 data center infrastructure, IEEE 802.3 Ethernet cabling references, Balanis "Antenna Theory" (air-gap near-field behavior), FCC 47 CFR 15.247, ETSI EN 302 208.

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/rfid-labels-tags/`.

**Metadata.** Standard Batch 21 set.

## SEO / GEO shape

Strong. Framework conversion from episodic Batch-5-era content to standards-anchored content (GIAI-96, TIA-606-C, RAIN ARC Cat F/H) is substantive SEO improvement — search and answer engines prefer standards-cited content for technical buyer queries. `dataHighlight` of 2-4 mm air-gap band with Balanis antenna-theory citation is a rare claim of technical precision for this SKU category. 15 inbound links.

## Framework metrics

- Title: 94 chars (flagship cluster norm)
- Sections: 8 | heroPoints: 3 | brief fields: 11 | keywords: 6
- FAQ: 6 | sources: 9 (all 9 5-field-complete) | inbound: 15
