# 04 — RFID Anti-Metal Tag (Pilot Re-Upgrade + Merge Absorb)

**File:** `src/content/editorial/products/rfid-tags/rfid-anti-metal-tag.json`
**Route:** `/products/rfid-tags/rfid-anti-metal-tag/`
**Status:** Batch-5 pilot re-upgraded to Batch 21 framework + content absorbed from merged `rfid-on-metal-uhf-tag`. Schema-valid. 59 inbound links (absorbing merge).

## Context

This page was the Batch 5 pilot and already carried solid structure (construction-type table, on-metal physics explanation, "Problems / How we solve / Typical outcomes" pattern). Batch 21 goals:
1. **Re-upgrade** to full framework parity with the other 3 Batch 21 pages (brief 11 fields, keywords, extended blocks, sources 5-field, deployment timeline, etc.).
2. **Absorb** unique content from the merged `rfid-on-metal-uhf-tag` page so that after the merge no value is lost.

## Absorb content from merged SKU

Unique claims that existed on `rfid-on-metal-uhf-tag` but not on `rfid-anti-metal-tag` pre-merge, now folded in:

- **Ground-plane effect physics** — "+3 to +6 dB gain" from the metal surface acting as a ground plane for the tag antenna. Added as a dedicated `dataHighlight` block with Balanis "Antenna Theory" + Impinj application-note citation. This is the single best technical claim the merged page held — it reframes metal from "enemy of UHF" to "antenna-enhancing ground plane when the tag is correctly designed for it".
- **Copper / brass read-range delta** — 80-90% of steel read-range on copper and brass. Added to `brief[]` as "Substrate tolerance" field and to a new dedicated FAQ: "Does the tag work on aluminum / copper / brass?"
- **200×30 mm industrial long-range variant** — extended the construction-type table with a new row for long-range industrial tags suitable for shipping containers / heavy industrial equipment. Summary and hero reframed to "10×10 mm micro to 200×30 mm industrial" so the absorbed size range is surfaced in SEO-critical fields.
- **MIL-STD-130N IUID / FAA AC 20-162A suitability** — added as a dedicated FAQ.

## Changed (framework upgrade)

**Brief.** 7 → 11 fields including the new `substrateTolerance` field.

**Keywords (new).** 6 entries: `"anti-metal RFID tag", "on-metal UHF tag", "ferrite isolation tag", "aluminum RFID tag", "steel asset tracking", "MIL-STD-130N IUID"`.

**Sections.** 4 → 10 with the full extended-block set:
1. H2 intro + answer-first framing.
2. `statBar` — read range on steel / temp range / size range.
3. `layout: split` with per-section image — Why standard UHF fails on metal.
4. `dataHighlight` — **"+3 to +6 dB Ground-plane effect"** (absorbed from merge).
5. Revised Typical-Outcomes paragraph (no episodic numerics).
6. `comparePanel` — standard UHF tag vs anti-metal construction on steel surface.
7. Construction-types table **extended with 200×30 mm industrial row** (absorbed from merge).
8. `timeline` — 4-phase deployment (sample / pilot portal / integration / rollout).
9. Chip-family selection (Impinj M7xx vs NXP UCODE vs Alien H9).
10. Mounting / adhesive / weld-bracket guidance.

**FAQ.** 4 → 6. New entries: aluminum / copper / brass suitability (absorbed); MIL-STD-130N IUID / FAA AC 20-162A suitability (absorbed). Revised existing FAQs for Batch 21 voice consistency.

**Sources.** Expanded to 10 entries with full 5-field metadata. Absorbed citations: MIL-STD-130N Identification Marking of US Military Property, FAA AC 20-162A Aircraft Parts Identification, Balanis "Antenna Theory: Analysis and Design" (ground-plane antenna behavior). Kept: GS1 EPC TDS, RAIN ARC, FCC 15.247, ETSI EN 302 208, Impinj M7xx datasheet, NXP UCODE family datasheet, Auburn RFID Lab ARC.

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/rfid-labels-tags/`. `secondaryActions[1]` broken `/product/rfid-tag-with-led-light/` → `/products/rfid-tags/anti-metal-uhf-it-asset-tag/`.

**Metadata.** `publishedAt: 2026-04-22`, `modifiedAt: 2026-04-23`, `reviewedAt: 2026-04-23`.

## Merge mechanics

`rfid-on-metal-uhf-tag.json` deleted. `/products/rfid-tags/rfid-on-metal-uhf-tag/` → `/products/rfid-tags/rfid-anti-metal-tag/` canonical override registered in `src/lib/route-overrides.ts` (consumed by `seo.ts` for canonical link emission + legacy link rewriter). 8 inbound `.json` references rewritten + 3 `.ts` code-path references rewritten or neutralised. Dormant batch15 route-definition block scrubbed for safety. See `05-merge-rfid-on-metal-uhf-tag.md` for full merge detail.

## SEO / GEO shape

After absorb: **59 inbound links** — by far the highest-density internal linking of any page in the rfid-tags cluster. 10 sources (highest of Batch 21). The ground-plane `dataHighlight` with Balanis citation is a standout claim — few competitor pages reframe metal as antenna-enhancing rather than antenna-hostile. Construction-type table (ceramic / PCB / ABS / flexible / industrial) with size × read-range × temp × best-for columns is one of the most reader-useful tables in the whole product-pages corpus and is well-positioned for answer-engine extraction.

## Framework metrics

- Title: 78 chars (flagship cluster norm)
- Sections: 10 | heroPoints: 3 | brief fields: 11 | keywords: 6
- FAQ: 6 | sources: 10 (all 10 5-field-complete) | inbound: 59
