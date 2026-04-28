# Batch 17 — rfid-labels inlay + commodity-media

**Date:** 2026-04-23
**Cluster:** `rfid-labels`
**SKUs refined:** 6
**Cluster progress after batch:** 54 / 58 (~93 %)

## Scope

Batch 17 is the **raw-component + commodity-media** layer of the rfid-labels cluster — the building-block inlays that label converters, tag manufacturers and card bureaus laminate or embed into finished products, plus the plain thermal-transfer UHF label stock that ships to high-volume retail programs:

- **UHF commodity media (sec already 7):** `uhf-rfid-paper-label`, `uhf-rfid-blank-label` — hygiene + FAQ 3→5 depth on retailer-mandate encoding workflow.
- **UHF inlays (sec 7):** `uhf-rfid-inlay` — chipset-breadth-and-antenna-design SKU, hygiene + FAQ 3→5 on converting-line yield + retailer QC documentation.
- **NFC inlays (sec 7-8):** `nfc-dry-inlay`, `nfc-wet-inlay` — card-lamination + NDEF/SUN brand-auth depth, hygiene + FAQ 3→5.
- **Chip-level inlay (sec 3):** `impinj-m730-uhf-inlay` — already had 5 FAQs from prior batch; only hygiene + sources + dates needed.

## Treatment (uniform across all 6 SKUs)

1. **Legacy `/product/...` imageSourceRoutes + resourceCards + secondaryActions** → migrated to intra-cluster `/products/rfid-labels/<slug>/` neighbors (inlay ↔ inlay, inlay → finished-label).
2. **FAQ 3 → 5** — appended one converting-operations Q&A + one regulatory/standards Q&A per SKU (except `impinj-m730-uhf-inlay` already at 5).
3. **Sources 0 → 8** — schema-valid label/url/publisher triples per SKU.
4. **Dates** — added `publishedAt: "2026-04-22"` + `modifiedAt: "2026-04-23"` + bumped `reviewedAt` to `"2026-04-23"`.
5. **primaryAction** — migrated `/contact/` → `/contact/rfid-labels-tags/`.

## Technical anchors

| SKU | Anchor |
| --- | --- |
| uhf-rfid-paper-label | GS1 TDS 2.0 SGTIN-96 + Auburn ARC + Walmart T2/T3/Target/Macy's mandates + Impinj M700 / NXP UCODE 9 / Zebra ZT411 |
| uhf-rfid-blank-label | Zebra ZPL ^RF commands + NiceLabel RFID Designer + inlay X-offset per printer (ZT411, SATO CL4NX Plus, Printronix T6000, TSC MB240T) |
| uhf-rfid-inlay | Pitch tolerance ±0.5 mm + Mark Andy P5/P7 + Nilpeter FA-17 + MPS EF-Symjet converting lines at 50-150 m/min + per-lot sensitivity histogram + EPC manifest |
| nfc-dry-inlay | ISO/IEC 7810:2019 CR-80 + ISO/IEC 14443 Type A/B + EMVCo Book D + ICAO Doc 9303 + Bürkle/Wickert/Agfa hydraulic platen lamination 140-180 °C / 200-300 psi |
| nfc-wet-inlay | NFC Forum NDEF + Type 2 / Type 4 specs + Apple Core NFC iOS 14+ + NTAG424 DNA SUN (AES-128 CMAC + tap counter) + SmartCosmos/Authena/Identiv backend verification |
| impinj-m730-uhf-inlay | Monza R6 silicon class + 96-bit EPC serialized TID (E280-1160 prefix) + Autotune + EPC Gen2v2 protocol 2.1 |

## Verification

- `npx astro sync` — clean, 853 ms, zero schema errors.
- `grep -c '"/product/'` across all 6 — all 0.
- Counts:
  - `uhf-rfid-paper-label`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `uhf-rfid-blank-label`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `uhf-rfid-inlay`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `nfc-dry-inlay`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `nfc-wet-inlay`: sec=8, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `impinj-m730-uhf-inlay`: sec=3, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/

## Thematic cohesion

Batch 17 reads as the **raw-component + converting-workflow** layer of the rfid-labels cluster. Every SKU pivots on two axes: (1) chip-and-antenna geometry that must fit converting-line tooling (Mark Andy / Nilpeter / MPS for labels; Bürkle / Wickert platen presses for cards) within tight pitch and placement tolerances, and (2) standards-driven encoding workflow (GS1 TDS 2.0 SGTIN-96 for UHF retail, NFC Forum NDEF + NTAG424 DNA SUN for NFC brand-auth, ISO/IEC 7810 + EMVCo Book D for payment-card construction). The cross-cluster navigation now routes buyers between chip-level SKUs (Impinj M700/M730/M750, UCODE 8/9, Higgs-9), inlay SKUs (wet/dry/UHF/Impinj-specific) and finished media (paper label, blank label, NTAG stickers) without any legacy `/product/` dead-ends.

## Batch 18 candidates (cluster completion)

Remaining rfid-labels SKUs for Batch 18 (4 left — 54/58 → 58/58 completion of the cluster):

- `impinj-m750-uhf-inlay` (sec=? hygiene + dates/sources check)
- `nfc-table-stand` (sec=7, hygiene-only)
- `rfid-document-tracking-label` (audit pending)
- `rfid-garment-source-tag` (audit pending)

Estimated Batch 18 size: 4 SKUs (hygiene + FAQ + sources on already-deep files) → cluster 58 / 58 (100 % completion of rfid-labels). Batch 18 closes out the rfid-labels cluster.
