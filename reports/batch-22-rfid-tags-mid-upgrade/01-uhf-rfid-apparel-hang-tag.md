# Batch 22 · Page 1/6 — uhf-rfid-apparel-hang-tag.json

**Route:** `/products/rfid-tags/uhf-rfid-apparel-hang-tag/`
**Tier move:** MID → DEEP
**Reviewed:** 2026-04-24 · **Modified:** 2026-04-24

## Changes

- **Keywords (new):** 6 entries — "UHF RFID apparel hang tag", "Auburn ARC Cat-F source tagging", "95% retail inventory accuracy", "SGTIN-96 apparel EPC", "RAIN Alliance endorsed inlay", "GS1 TDS 2.0 source-tagged hang tag".
- **Brief:** 8 → 11 fields. Added Operating temperature, EPC scheme (SGTIN-96 under GS1 TDS 2.0), Compliance (Auburn ARC Cat-F/H, RAIN Alliance, GS1, ISO/IEC 18000-63).
- **Section extensions:**
  - `statBar` on the Problems section: 200+ tags/s tunnel read / 95%+ inventory accuracy target / 3–8 m read range / <30 min cycle-count time for a 15k-unit store.
  - `comparePanel` on "Why source tagging wins": DC-side conversion vs at-source tagging — covers cost per tag, orphan rate, omni-channel readiness, audit evidence.
  - `dataHighlight` on "Typical outcomes": 65–85% manual audit → 95%+ RFID cycle count (Auburn RFID Lab benchmark).
  - New `timeline` section "Source-tagging onboarding timeline" — 4 phases (Spec → Lab submission → Pilot → Production).
- **De-identification:** No fabricated numerics in the prior copy; "Typical outcomes" already read as industry benchmarks, only reinforced with Auburn citation.
- **Sources:** 8 → 10 entries, all upgraded to 5-field (publishedAt, accessedAt, note). Added Impinj M7xx family reference and RAIN Alliance Endorsed programme.

## Verification
- `npx astro sync` — clean (Zod pass).
- Inbound links from `src/`: 8 references intact.
- Source URLs: 10/10 well-formed HTTPS.

## Status
`completed` — framework parity with Batch 21 DEEP standard.
