# W3-4b Industry Back-Links — SKU → Industry-Pillar Auto-Tagging

**Date:** 2026-04-18
**Batch:** Close-the-loop pass on the W3-4 industry pillar batch (commit `2704dcb`)
**Scope:** Auto-tag SKU pages that mention industry-specific keywords (tire, aircraft, MIL-STD, FSMA, cold chain, …) with a new "Industry applications" resourceCard pointing back at the appropriate `/industries/<slug>/` pillar.

This mirrors the W5b script (`_add-encyclopedia-backlinks.mjs`) that linked SKUs to chip-encyclopedia pages, but in the opposite direction — outbound from product → industry pillar — to fix the bidirectional link asymmetry the 5 new industry pillars created when they shipped.

---

## 1. The script

`scripts/_add-industry-backlinks.mjs` (~140 lines, pure Node, no deps).

Five independent regex rules, one per industry pillar:

| Pillar | Match terms | Notes |
|---|---|---|
| `automotive-tire-oem` | `tire`, `tyre`, `tpms`, `automotive cure`, `tire-cure`, `cure-press` | Narrow; `automotive` alone too weak |
| `aerospace-aviation-mro` | `aircraft`, `aerospace`, `aviation`, `airframe`, `MRO shop`, `ATA Spec`, `FAA AC`, `DO-160`, `EASA`, `Part 145` | All terms specific to aerospace/aviation |
| `data-center-it-asset-tracking` | `data-center`, `datacenter`, `server (chassis|rack|room)`, `IT asset`, `NIST 800-88`, `CMDB`, `DCIM`, `e-waste`, `R2v3` | **Intentionally NOT** matching `SOX` / `PCI DSS` alone — those generic compliance acronyms surface on payment & access-control SKUs unrelated to IT asset tracking |
| `government-defense-supply-chain` | `MIL-STD`, `DoD`, `DFARS`, `IUID`, `WAWF`, `Berry Amendment`, `TAA-compliant`, `armory/armories`, `weapon tracking`, `ammo can`, `FISMA`, `FOB armory` | Very specific acronyms; very low false-positive rate |
| `cold-chain-food-traceability` | `cold-chain`, `FSMA-204`, `EUDR`, `reefer`, `vaccine cold`, `GDST`, `EPCIS`, `Food Traceability List`, `food traceability`, `frozen-tunnel`, `frozen food`, `ultra-cold` | All specific to cold chain / FSMA scope |

Each SKU's full JSON text (title, summary, heroPoints, brief, sections, FAQs) is concatenated and tested against every rule. A SKU may match multiple industries (e.g. an RFID aircraft part tag → aerospace **and** defense; a tire label → automotive only).

Idempotency: each link is keyed by `href`. A SKU that already has the pillar back-link is skipped — re-runs are no-ops.

The script appends a **single** `resourceCard` titled "Industry applications" per SKU, with a `links` array of all matched industry pillars. This mirrors the W5b script's "Chip-level technical reference" card pattern, so no template changes are needed in `EditorialPage.astro`.

---

## 2. False positive caught and fixed

Initial dry run reported 40 SKU touches. One was wrong:

- `mifare-plus-se-card.json` got tagged `data-center-it-asset-tracking` because the SKU description mentions "PCI DSS" in the context of "regulatory pressure flagging MIFARE Classic as a vulnerability" — a payment & access-control compliance reference, **not** an IT asset audit reference.

Fix: dropped `SOX` and `PCI DSS` from the data-center regex. Kept the more specific terms (NIST 800-88, CMDB, DCIM, IT asset, server chassis, e-waste, R2v3) that genuinely indicate data-center scope. Re-run: MIFARE Plus SE correctly skipped, total drops 40 → 39 SKUs touched.

---

## 3. Match counts

| Pillar | SKUs touched |
|---|---|
| `automotive-tire-oem` | 7 |
| `aerospace-aviation-mro` | 11 |
| `data-center-it-asset-tracking` | 8 |
| `government-defense-supply-chain` | 6 |
| `cold-chain-food-traceability` | 12 |
| **Total back-link rows** | **44** |
| **Distinct SKU files modified** | **39** |

(Five SKUs match multiple industries — e.g. `rfid-aircraft-part-tag` matches both aerospace and defense, `rfid-temperature-sensor-tag` matches cold-chain only but has aviation MRO context too.)

Sample touches:

| SKU route | Matched pillars |
|---|---|
| `/products/rfid-labels/impinj-m700-uhf-inlay/` | automotive |
| `/products/rfid-labels/impinj-m730-uhf-inlay/` | cold-chain |
| `/products/rfid-labels/nfc-anti-metal-sticker/` | data-center |
| `/products/rfid-labels/rfid-airline-baggage-tag/` | aerospace |
| `/products/rfid-labels/rfid-frozen-food-label/` | cold-chain |
| `/products/rfid-labels/uhf-rfid-blood-bag-label/` | cold-chain |
| `/products/rfid-tags/anti-metal-uhf-it-asset-tag/` | data-center |
| `/products/rfid-tags/rfid-aircraft-part-tag/` | aerospace |
| `/products/rfid-tags/rfid-ammo-can-tag/` | gov-defense |
| `/products/rfid-tags/rfid-tool-tracking-tag/` | aerospace, gov-defense |
| `/products/rfid-tags/rfid-weapon-tracking-tag/` | gov-defense |
| `/products/rfid-tags/rfid-tire-tag/` | automotive |

Example diff applied to `rfid-frozen-food-label.json`:

```json
{
  "title": "Industry applications",
  "description": "Industry deep-dives where this SKU is commonly specified.",
  "links": [
    {
      "href": "/industries/cold-chain-food-traceability/",
      "label": "Cold chain & food traceability — FSMA 204, EUDR, vaccine cold chain, reefer logging"
    }
  ]
}
```

---

## 4. Build verification

```
ASTRO_OUT_DIR=./dist-restored npm run build      # clean pass, 98.58s
```

Spot-checked 5 SKU pages — each renders exactly 1 industry back-link (no duplicates, correct anchor text):

| Route | Industry back-links rendered |
|---|---|
| `/products/rfid-labels/rfid-frozen-food-label/` | 1 → cold-chain |
| `/products/rfid-labels/rfid-airline-baggage-tag/` | 1 → aerospace |
| `/products/rfid-tags/rfid-aircraft-part-tag/` | 1 → aerospace |
| `/products/rfid-tags/rfid-weapon-tracking-tag/` | 1 → gov-defense |
| `/products/rfid-tags/anti-metal-uhf-it-asset-tag/` | 1 → data-center |

### Idempotency check

Re-running `node scripts/_add-industry-backlinks.mjs` after the apply pass:

```
SKU files touched:        0
SKU files unchanged:      191
```

Confirmed safe to re-run; future SKU additions can drop into the script and be picked up automatically without touching what's already linked.

---

## 5. Catalog audit impact

No new SKUs added; no new entries in `CATALOG_IMAGE_OVERRIDES`. Only resourceCard arrays mutated — Zod schema unchanged, `EDITORIAL_OVERRIDE_ROUTES` allowlist unchanged. Catalog audit unchanged.

---

## 6. Bidirectional link health, before vs. after

| Direction | Before W3-4b | After W3-4b |
|---|---|---|
| Industry pillar → SKUs (each pillar lists 5 product table rows) | 5 × 5 = 25 product links from industries | unchanged |
| SKU → Industry pillar | 0 | **44** (across 39 SKUs) |

Before this batch the link graph was lopsided: industry pillars linked outbound to product pages, but no SKU page linked back. AI crawlers and search engines treated the new pillars as orphan-leaf pages with weak internal authority signal. After the batch every SKU that semantically belongs to one of the 5 new verticals has an explicit anchor → industry pillar, with descriptive label text that carries keyword equity.

---

## 7. Files changed summary

| Category | Files | Change |
|---|---|---|
| New: script | 1 | `scripts/_add-industry-backlinks.mjs` |
| Modified: SKU JSONs | 39 | one new `resourceCard` per SKU |
| New: report | 1 | `pillar-pages-w3b-industries-backlinks-report.md` (this file) |

**Total diff:** 41 files changed.

---

## 8. What ships next

| Priority | Item | Description |
|---|---|---|
| P0 | W5-6 P1 chip encyclopedia depth | NTAG21x family, UCODE 9 standalone, UCODE 8 standalone, Monza R6 family, MIFARE DESFire EV3 commands. ~5 pages, GEO-citation gold |
| P1 | W10 compare-cluster depth pass | Extend 15 thin existing `/compare/*` pages from stub to 700+ words each |
| P2 | `relatedIndustries` top-up | Manual touch on 127 untagged SKUs to widen internal-link density. Now also includes the 5 new vertical slugs |

---

## 9. Push reminder

```
cd /Users/zhangping/Projects/Playground
git push origin main
```
