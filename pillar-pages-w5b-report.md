# W5b — Close-the-Loop Delivery Report

**Date:** 2026-04-18
**Batch:** Close-the-loop after W5 P0 encyclopedia drops
**Scope:** Back-link every relevant SKU to the W5 encyclopedia pages + break out three M700-family inlay SKUs

This batch closes the topical-authority loop that opened when the W5 P0 batch (NTAG424 DNA SUN + CMAC guide, 4-way UHF chip comparison) shipped standalone. The encyclopedia pages now ship with inbound resource cards from every relevant SKU in the catalog, and the M700-family Impinj inlay lineup is broken out into three distinct SKU landings instead of one generic page.

---

## 1. Back-link script

New file: `scripts/_add-encyclopedia-backlinks.mjs` (~95 lines).

Two-pass script that walks every SKU JSON under `src/content/editorial/products/**/*.json` (excluding cluster pillar files `_pillar.json`), detects by regex which encyclopedia pages should be linked, and idempotently appends a new `resourceCard` entry titled "Chip-level technical reference".

### Match rules

- `NTAG424_RX = /\bntag\s?424\b/i` — matches both "NTAG424" and "NTAG 424" spellings. Tested against title + kicker + summary only (intentionally narrow — we don't want to splash the NTAG424 link onto pages that merely mention NTAG2xx).
- `UHF_CHIP_RX = /\b(ucode\s?[89]|monza\s?r6(?:-p)?|higgs[-\s]?9|m730|m750|m800)\b/i` — matches UCODE 8/9, Monza R6 / R6-P, Higgs-9, M730/M750/M800. Tested against the full JSON text (wider cast — any SKU that names any of these chips in any section should reference the comparison).

### Idempotency

Script inspects existing `resourceCards[].links[].href` values before appending. If the encyclopedia link is already present, the card is left alone. Safe to re-run in future passes.

### Usage

```
node scripts/_add-encyclopedia-backlinks.mjs        # dry run
node scripts/_add-encyclopedia-backlinks.mjs --write # apply
```

### Result

| Dimension | Count |
|---|---|
| SKU files scanned | 189 |
| SKU files excluded (cluster pillars) | 4 |
| NTAG424 back-links added | 5 |
| UHF chip back-links added | 74 |
| **Total SKU files touched** | **79** |
| SKU files unchanged | 110 |

Both links appended to the same card where both matched (e.g. `ntag424-dna-tt-card.json` references NTAG424 DNA encyclopedia; NTAG424-style UHF pages that also cite Monza silicon get both).

---

## 2. Break-out SKUs: Impinj M730 + M750

Two new standalone SKU landings under `src/content/editorial/products/rfid-labels/`:

### `impinj-m730-uhf-inlay.json`

- **Chip:** Impinj M730 (Monza R6 silicon class)
- **EPC / User / TID:** 96 bits / 0 bits / 96-bit factory-serialized (E280-1160 prefix)
- **Sensitivity:** −22.6 dBm read / −16.7 dBm write
- **Positioning:** Cost-optimized for billion-tag retail source tagging
- **Content depth:** 9-row brief spec table; 3 body sections (why it dominates retail; when it is NOT the right fit; standard antenna configurations); 5 FAQs answering the most-asked comparison questions (M730 vs M750, Monza R6 rebrand, real-world read range, reader-fleet compatibility, MOQ)
- **Backlinks:** related M700-family, cross-vendor Higgs-9, chip-level comparison
- **Hero image:** shares `/landing-images/impinj-m700-uhf-inlay.jpg` with the M700 (intentional — the inlay is physically the same; the difference is silicon, not form factor)
- **Related industries:** retail-apparel, logistics

### `impinj-m750-uhf-inlay.json`

- **Chip:** Impinj M750 (Monza R6-P silicon class)
- **EPC / User / TID:** 96 bits extensible to 128 / 32 bits / 96-bit factory-serialized (E280-6C0 prefix)
- **Sensitivity:** −22.0 dBm read / −18.3 dBm write
- **Positioning:** Brand-authentication and retail-privacy upgrade over the M730 — full EPC Gen2 v2 Authenticate (Crypto Suite 3 / AES-128), Untraceable, Hide-EPC support
- **Content depth:** 9-row brief spec table; 3 body sections (where the M750 is right; when to reach for NTAG424 DNA instead; Impinj Authenticity Cloud service context); 6 FAQs covering chip-authentication protocol, EU DPP fit, NTAG424 DNA comparison for luxury goods, Authenticate command details, MOQ, R700 firmware compatibility
- **Backlinks:** related M700-family, cross-reference NTAG424 DNA encyclopedia (for the "UHF vs HF brand-authentication" question that buyers hit constantly), chip-level comparison
- **Hero image:** `/landing-images/rfid-wet-inlay-alt.jpg`
- **Related industries:** brand-protection, eu-compliance, luxury-brands, pharmaceutical

### M800 (no new file)

Already exists as `impinj-m800-uhf-inlay.json`. It received the new "Chip-level technical reference" resourceCard link from the back-link script pass (detected via `m800` regex match).

---

## 3. Routing / catalog wiring

### `src/lib/catalog-pages.ts`

Added two new `CATALOG_IMAGE_OVERRIDES` entries between the existing M700 and M800 entries:

```ts
"/products/rfid-labels/impinj-m700-uhf-inlay/": "/landing-images/impinj-m700-uhf-inlay.jpg",
// M730 is physically the same inlay as the M700 generic reference — the differences are
// at the silicon (96-bit EPC, no User memory, no Authenticate). Shares the M700 hero.
"/products/rfid-labels/impinj-m730-uhf-inlay/": "/landing-images/impinj-m700-uhf-inlay.jpg",
"/products/rfid-labels/impinj-m750-uhf-inlay/": "/landing-images/rfid-wet-inlay-alt.jpg",
"/products/rfid-labels/impinj-m800-uhf-inlay/": "/landing-images/impinj-m800-uhf-inlay.jpg",
```

Inline comment documents the intentional hero-image duplicate so future catalog audits don't flag it as a bug.

### `src/content/editorial/products/rfid-labels/_pillar.json`

UHF inlays bullet rewritten to surface all three Impinj SKUs and the 4-way comparison:

```
UHF RFID inlays — [Impinj M700 family overview], [Impinj M730 (cost-optimized retail)],
[Impinj M750 (Authenticate + Untraceable)], [Impinj M800 (next-gen)], [Alien Higgs-9],
[NXP UCODE 8/8m/9 mixed UHF inlay]. Ready for retail, logistics, tire and apparel.
See the full [4-way UHF chip comparison] to choose the right silicon.
```

---

## 4. Build verification

```
ASTRO_OUT_DIR=./dist-restored npm run build      # clean pass
```

### Render spot-checks

| Route | Expected | Actual |
|---|---|---|
| `/products/rfid-labels/impinj-m730-uhf-inlay/` | renders | ✅ rendered |
| `/products/rfid-labels/impinj-m750-uhf-inlay/` | renders | ✅ rendered |
| `/products/rfid-labels/` cluster pillar | 3 M7xx references | ✅ pillar lists M700/M730/M750/M800 |
| `/products/all/` catalog index | M730 + M750 present | ✅ (4 references total) |
| `/compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9/` | still renders with inbound links | ✅ |

### Catalog audit delta

| Metric | Pre-W5b | Post-W5b |
|---|---|---|
| Products | 252 | 254 |
| Unique images | 252 | 253 |
| Duplicate groups | 0 | 1 (documented) |
| Affected routes | 0 | 2 (M700 + M730 sharing image intentionally) |

The single duplicate group is the documented M700/M730 pair. Both SKUs share the same reference antenna on the same inlay substrate; only the silicon differs. The inline comment in `catalog-pages.ts` documents this decision so future audits know not to "fix" it.

---

## 5. What ships next

Close-the-loop batch leaves the following queues:

### W5–6 P1 next pass
- NTAG21x family encyclopedia (NTAG213 / NTAG215 / NTAG216)
- UCODE 9 standalone encyclopedia
- UCODE 8 / UCODE 8m standalone encyclopedia
- Monza R6 / R6-P / 4QT encyclopedia
- MIFARE DESFire EV3 command + file-type encyclopedia

### W3–4 industry-page backlog
- automotive-tire-oem
- aerospace-aviation-mro
- data-center-it-asset-tracking
- government-defense-supply-chain
- cold-chain-food-traceability

### Other open work
- W10 compare-cluster depth pass (extend 15 thin compare pages to 700+ words)
- Manual top-up of 127 untagged SKUs for the `relatedIndustries` field

---

## 6. Files changed summary

| Category | Files | Change |
|---|---|---|
| New: SKU pages | 2 | `impinj-m730-uhf-inlay.json`, `impinj-m750-uhf-inlay.json` |
| New: helper script | 1 | `scripts/_add-encyclopedia-backlinks.mjs` |
| New: report | 1 | `pillar-pages-w5b-report.md` (this file) |
| Modified: SKUs (auto-linked) | 79 | appended resourceCard |
| Modified: cluster pillar | 1 | `products/rfid-labels/_pillar.json` |
| Modified: catalog routing | 1 | `src/lib/catalog-pages.ts` |

**Total diff:** 85 files changed.

---

## 7. Push reminder

The sandbox cannot push to origin (no credentials). Run from the user's local Playground:

```
cd /Users/zhangping/Projects/Playground
git push origin main
```
