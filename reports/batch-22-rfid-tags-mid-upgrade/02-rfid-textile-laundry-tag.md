# Batch 22 · Page 2/6 — rfid-textile-laundry-tag.json

**Route:** `/products/rfid-tags/rfid-textile-laundry-tag/`
**Tier move:** MID → DEEP
**Reviewed:** 2026-04-24 · **Modified:** 2026-04-24

## Changes

- **Keywords (new):** 6 entries — "RFID textile laundry tag", "sewn-in UHF laundry tag", "GIAI-96 garment lifecycle", "ISO 15797 industrial wash RFID", "CDC HICPAC hospital textile tracking", "tunnel-reader laundry inventory".
- **Brief:** 9 → 12 fields. Added Operating/wash temperature (up to 75 °C tunnel), EPC scheme (GIAI-96 for reusable garments), Compliance (ISO 15797, CDC HICPAC, NFPA 2112, Joint Commission IC.02.02.01).
- **Section extensions:**
  - `statBar` on Problems: 1.5–2 mm tag thickness / 50–100 wash cycles lifetime / 2–5 m read range / 75 °C tunnel tolerance.
  - `comparePanel` on "How Proud Tek solves": paper log-card / manual count vs sewn-in RFID laundry tag — wash durability, shrinkage visibility, auditor evidence.
  - `dataHighlight` on "Typical outcomes": mid-double-digit → single-digit loss-per-cycle, tied to ISO 15797 + Joint Commission IC.02.02.01 evidence requirements.
  - New `timeline` section: Weeks 1–2 garment audit → 3–4 pilot batch → 5–8 tunnel reader commissioning → 9+ full rollout.
- **De-identification:** No customer-specific figures introduced; "Typical outcomes" normalised to directional benchmarks with standards citations.
- **Sources:** 8 → 9 entries, all 5-field. Added Joint Commission IC.02.02.01 (Infection Control — Reducing Risk from Reusable Textiles).

## Verification
- `npx astro sync` — clean.
- Inbound links: 10 references intact.
- Source URLs: 9/9 HTTPS.

## Status
`completed`.
