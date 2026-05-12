# W3-4d² — Chip-Family Facet Expansion (Keyfobs + Wristbands)

**Date:** 2026-04-19
**Scope:** Backfill chip-family tags on `/products/rfid-keyfobs/` and `/products/rfid-wristbands/` SKUs
**Outcome:** Chip-filter coverage on `/products/all/` lifted from **32 cards (13.0 %)** to **63 cards (25.6 %)**

This pass closes the biggest blind spot in the W3-4d faceted filter: multi-chip SKUs whose chip compatibility matrix lives deep in a section table rather than in the title or summary. The catalog-pages.ts facet scanner only ever looked at `title + summary + route` — a 120-character signal — so a keyfob or wristband that "supports 10+ chip options across 125 kHz and 13.56 MHz" would never light up any chip filter even though users click the chip filter first when shopping for credentials.

---

## 1. Root cause

`deriveFacets()` in `src/lib/catalog-pages.ts` runs the chip regex against `title + summary + route`. For category-level SKUs like `rfid-abs-keyfob` the title is "RFID ABS Key Fobs — Rugged IP68 Waterproof Credentials for Building & Campus Access Control" and the summary covers housing and deployment — neither mentions a specific chip. The actual chip vocabulary lives in a `Chip compatibility guide` section table that looks like:

```
EM4100               | 125 kHz   | Most budget LF readers
T5577                | 125 kHz   | HID Prox, EM, Indala emulation
HID Prox             | 125 kHz   | HID ProxPoint, ProxPro readers
MIFARE Classic 1K    | 13.56 MHz | Turnstiles, elevators
MIFARE DESFire EV3   | 13.56 MHz | High-security access
NTAG213              | 13.56 MHz | Smart locks, smartphone-based access
```

Six chip values, all invisible to the facet scanner.

**Pre-pass audit:** of 34 keyfob + wristband SKUs, only 5 carried any chip tag (`em4305-keyfob`, `mifare-desfire-keyfob`, `t5577-keyfob`, `cashless-payment-rfid-wristband`, `silicone-wristband-mifare-classic`). The remaining 29 — despite listing 2-6 supported chips in their bodies — were invisible to the chip filter.

---

## 2. Solution

Two-part change:

### 2.1 Schema + catalog-pages.ts (plumbing)

- Added optional `chipFamilies: z.array(z.string()).optional()` to `editorialSchema` in `src/content.config.ts`. Comment documents the vocabulary: `ntag21x`, `ntag424`, `mifare-classic`, `mifare-desfire`, `mifare-ultralight`, `mifare-plus`, `icode`, `em-tk5`, `impinj-m7`, `alien-higgs`, `ucode` — same values as `FACET_RULES.chip` in catalog-pages.ts.
- Added `chipFamilies?: string[]` to the `LandingDef` interface in catalog-pages.ts.
- Added `deriveFacetsWithChipOverride(chipFamilies, ...textParts)` variant. When `chipFamilies` is present and non-empty, it validates values against the `FACET_RULES.chip` vocabulary, drops unknown values silently, and unions the explicit list with whatever the regex scan caught (so an editor's explicit "this SKU supports NTAG21x + DESFire" plus the regex picking up an "NTAG215" mention in the summary both land in the final chip set). Output is sorted in `FACET_RULES.chip` order for stable HTML.
- Wired into `collectCatalogProducts()` — line 487 now calls `deriveFacetsWithChipOverride(def.chipFamilies, title, summary, def.route)` instead of `deriveFacets(title, summary, def.route)`.

The existing `deriveFacets()` is preserved unchanged, so WP stub products and any other caller still gets regex-only behaviour.

### 2.2 Backfill script + SKU edits (content)

New script: `scripts/_backfill-chip-families.mjs` (~125 lines). Walks `src/content/editorial/products/{rfid-keyfobs,rfid-wristbands}/**/*.json`, scans the FULL JSON text (including section bullets and compatibility tables) with the same regex vocabulary as `FACET_RULES.chip`, and appends a sorted `chipFamilies` array to each SKU.

Idempotent — if the SKU already carries a non-empty `chipFamilies` array the script skips it. Dry-run by default, `--write` to apply.

---

## 3. Results

**Backfill run (applied):**

```
SKUs scanned:            34
Already tagged:          0
No chip signal:          0
Newly tagged:            34
```

**Per-category chip distribution:**

| Chip | Keyfob SKUs (14) | Wristband SKUs (20) | Total tagged |
|---|---:|---:|---:|
| ntag21x | 11 | 17 | 28 |
| mifare-desfire | 12 | 10 | 22 |
| mifare-classic | 10 | 11 | 21 |
| em-tk5 (EM/T5577/HID Prox) | 10 | 2 | 12 |
| impinj-m7 | 0 | 9 | 9 |
| ucode | 0 | 9 | 9 |
| mifare-ultralight | 0 | 5 | 5 |
| alien-higgs | 0 | 1 | 1 |

Both pillar index pages (`/products/rfid-keyfobs/`, `/products/rfid-wristbands/`) deliberately carry an empty chip facet — they're category landings, not SKUs, so surfacing them under a chip filter would be wrong.

**Catalog-index filter coverage on `/products/all/`:**

| Facet group | Cards with ≥1 value | Coverage | Δ vs pre-pass |
|---|---:|---:|---:|
| freq | 160 / 246 | 65.0 % | — |
| chip | 63 / 246 | **25.6 %** | **+12.6 pts** (was 13.0 %) |
| env | 40 / 246 | 16.3 % | — |

**Filter panel count pills (post-pass):**

| Chip value | Static count pill | Pre-pass |
|---|---:|---:|
| NTAG21x | 33 | 5 |
| MIFARE DESFire | 26 | 4 |
| MIFARE Classic | 26 | 5 |
| EM / T5577 (LF) | 15 | 3 |
| Impinj M7xx / M8xx | 14 | 5 |
| NXP UCODE 8/9 | 10 | 1 |
| MIFARE Ultralight | 7 | 2 |
| NTAG424 DNA | 3 | 3 |
| MIFARE Plus | 2 | 2 |
| ICODE SLIX | 2 | 2 |
| Alien Higgs | 2 | 1 |

Every chip value on the filter panel now returns ≥2 cards — no dead filters, no 0-count "ghost" chip options (the pre-pass surface had several single-digit chip values that looked broken).

---

## 4. Sample output

The `/products/rfid-wristbands/rfid-adjustable-silicone-wristband/` SKU — a workhorse waterpark-and-events wristband — now emits:

```
data-facet-chip="ntag21x mifare-classic mifare-desfire em-tk5 impinj-m7 ucode"
```

Before the pass it emitted `data-facet-chip=""`. The SKU is now surfaced under six chip-filter toggles (every MIFARE chip, NTAG21x, and both UHF chip families) which matches the chip compatibility matrix in the page body.

The single-chip SKUs are correctly scoped — `silicone-wristband-mifare-classic` stays as `mifare-classic` alone, `nfc-medical-alert-wristband` stays as `ntag21x` alone, `uhf-rfid-wristband` emits `impinj-m7 alien-higgs ucode`.

---

## 5. Build verification

**Command:** `ASTRO_OUT_DIR=./dist-restored npm run build`
**Wall clock:** 105.19 s (normal envelope). Content-config change was picked up — Astro logged `Content config changed → Clearing content store` on startup and the types sync regenerated in 910 ms.
**Exit status:** Completed. Trailing EPERM on `.prerender` cleanup is the known virtiofs quirk.

All 246 product cards still render with three facet attributes (`data-facet-freq`, `data-facet-chip`, `data-facet-env`). The filter panel's 11 chip count pills now show the updated totals. No TypeScript build errors, no Zod validation failures.

---

## 6. File change summary

Modified (2):

```
src/content.config.ts                                  (+2 lines)
src/lib/catalog-pages.ts                               (~25 lines added)
```

New script (1):

```
scripts/_backfill-chip-families.mjs                    (125 lines)
```

SKU JSONs touched (34):

```
src/content/editorial/products/rfid-keyfobs/dual-frequency-key-fob.json
src/content/editorial/products/rfid-keyfobs/em4305-keyfob.json
src/content/editorial/products/rfid-keyfobs/mifare-desfire-keyfob.json
src/content/editorial/products/rfid-keyfobs/nfc-epoxy-key-tag.json
src/content/editorial/products/rfid-keyfobs/nfc-wood-keychain-tag.json
src/content/editorial/products/rfid-keyfobs/rfid-abs-keyfob.json
src/content/editorial/products/rfid-keyfobs/rfid-coin-keyfob.json
src/content/editorial/products/rfid-keyfobs/rfid-coin-tag.json
src/content/editorial/products/rfid-keyfobs/rfid-epoxy-keyfob.json
src/content/editorial/products/rfid-keyfobs/rfid-leather-keyfob.json
src/content/editorial/products/rfid-keyfobs/rfid-metal-keyfob.json
src/content/editorial/products/rfid-keyfobs/rfid-silicone-keyfob.json
src/content/editorial/products/rfid-keyfobs/rfid-wristwatch-tag.json
src/content/editorial/products/rfid-keyfobs/t5577-keyfob.json
src/content/editorial/products/rfid-wristbands/cashless-payment-rfid-wristband.json
src/content/editorial/products/rfid-wristbands/elastic-rfid-wristband.json
src/content/editorial/products/rfid-wristbands/fabric-rfid-wristband.json
src/content/editorial/products/rfid-wristbands/hospital-patient-id-wristband.json
src/content/editorial/products/rfid-wristbands/nfc-fitness-wristband.json
src/content/editorial/products/rfid-wristbands/nfc-medical-alert-wristband.json
src/content/editorial/products/rfid-wristbands/nfc-payment-wristband.json
src/content/editorial/products/rfid-wristbands/paper-rfid-wristband.json
src/content/editorial/products/rfid-wristbands/pvc-rfid-wristband.json
src/content/editorial/products/rfid-wristbands/rfid-adjustable-silicone-wristband.json
src/content/editorial/products/rfid-wristbands/rfid-child-wristband.json
src/content/editorial/products/rfid-wristbands/rfid-nylon-wristband.json
src/content/editorial/products/rfid-wristbands/rfid-prison-wristband.json
src/content/editorial/products/rfid-wristbands/rfid-tyvek-wristband.json
src/content/editorial/products/rfid-wristbands/rfid-vinyl-wristband.json
src/content/editorial/products/rfid-wristbands/rfid-waterpark-wristband.json
src/content/editorial/products/rfid-wristbands/rfid-wristband-qr-nfc.json
src/content/editorial/products/rfid-wristbands/silicone-wristband-mifare-classic.json
src/content/editorial/products/rfid-wristbands/tyvek-rfid-wristband.json
src/content/editorial/products/rfid-wristbands/uhf-rfid-wristband.json
```

---

## 7. Gap analysis — remaining untagged cards

Of the 183 cards still without a chip facet:

| Category | Untagged cards |
|---|---:|
| rfid-tags | 71 |
| rfid-labels | 46 |
| rfid-cards | 21 |
| WP stub products (`/product/*`) | ~43 |
| Pillar index pages | 2 |

The pattern from this pass (content-collection `chipFamilies` override) extends directly to `rfid-cards`, `rfid-labels`, and `rfid-tags`. A natural follow-up pass using the same `_backfill-chip-families.mjs` script (pointed at those three directories) would lift chip-filter coverage from the current 25.6 % toward the original 40 % target quoted in the W3-4d report. No plumbing changes required — only re-running the backfill script with a wider directory list.

The WP-stub products would need a different approach (their content lives in legacy WordPress HTML snapshots, not in content-collection JSONs) — a separate effort.

---

## 8. Next natural follow-ups

- **Cards + labels + tags chip-family pass** — re-run `_backfill-chip-families.mjs` against the other three product sub-indexes to close the gap to 40 % chip-filter coverage. Expected reach: ~100 SKU JSONs, same script, same schema field.
- **Env-facet expansion** — 40/246 (16 %) is env-facet coverage. Same pattern (`envFamilies` override) could lift coverage on tags/labels that carry "IP68", "on-metal", "outdoor" or "autoclave" claims buried in spec sheets.
- **W10 compare-cluster depth pass** — extend 15 thin `/compare/*` pages to 700+ words each.
