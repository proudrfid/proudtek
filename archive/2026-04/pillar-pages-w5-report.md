# Chip Encyclopedia + UHF Comparison P0 — Week 5 Delivery Report

**Scope:** Two P0 deep-technical pages from the W5-6 chip encyclopedia batch — NTAG424 DNA SUN + CMAC authentication encyclopedia (`/guides/`) and the 4-way UHF chip comparison (`/compare/`).
**Author:** editorial-board · **Reviewed by:** peter-zhang · **Reviewed at:** 2026-04-18

## Intent

W3-4 anchored the *taxonomy* layer (industries hub + 15 industry pages, bidirectional SKU↔industry linking via `relatedIndustries`). W5 starts the *technical-depth* layer that actually earns the AI citations the topical-authority audit identified as the biggest unowned-SERP opportunity. The pattern is: pick chips and standards that are heavily searched by integrators and procurement engineers, write them at a depth no competitor currently matches, and let the existing internal-link mesh distribute the authority back into the SKU pages.

The two P0 picks for this round were chosen because:

1. **NTAG424 DNA SUN + CMAC** — the canonical anti-counterfeit / EU Digital Product Passport HF chip. Searched constantly by integrators, currently bundled into thin product-page descriptions across the industry. AI engines have nowhere good to cite for the SUN message format and CMAC verification flow.
2. **UCODE 8 / UCODE 9 / Monza R6 / Higgs-9 4-way UHF comparison** — the four chips that dominate global passive UHF inlay manufacturing. Long-tail SERP for any combination of these names is unowned by an authoritative resource; existing comparisons are 1:1 ("UCODE 8 vs UCODE 9") with shallow depth.

## Pages shipped

### `/guides/ntag424-dna-sun-cmac-authentication/`

A complete technical encyclopedia for NTAG424 DNA covering the chip family and part numbers (NT4H2421Gx baseline + NT4H2421Tx Tag-Tamper variant), the 416-byte memory architecture across three files, the SUN message generation step-by-step with AN12196 references, AES-128 key management with HSM/KMS integration patterns, seven commercial application categories, when NTAG424 DNA is overkill (NTAG213/216, MIFARE DESFire EV3 alternatives), the official NXP reference document set, and a 12-row specifications table comparing the baseline against the TT variant. Seven FAQs cover server-side verification, iOS NFC compatibility, UID cloning defense, counter wrap behavior, pre-encoding workflow, EU DPP fit, and the NTAG424 DNA vs DESFire EV3 decision.

- File: `src/content/editorial/guides/ntag424-dna-sun-cmac-authentication.json`
- Sections: 8 · FAQs: 7 · Tables: 1 (12 rows × 4 cols)
- Hero image: `/landing-images/ntag424-dna-tamper-evident-tag.jpg` (already in catalog)
- Rendered HTML: 159,742 bytes · 6,182 words

### `/compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9/`

A four-way UHF chip comparison sized to the new P0 depth bar. Three tables (specifications side-by-side with 13 spec rows × 6 chip columns; real-world read-range table covering free-air / apparel hangtag / on-metal / liquid / pallet portal mounting; decision matrix mapping 8 application categories to recommended chips). Eight content sections cover chip family overview, full specifications, real-world deployed range, EPC Gen2 v2 privacy/authentication features (Untraceable, Authenticate, Hide-EPC, Crypto Suite negotiation), sensor and specialty variants (UCODE 9xe, UCODE DNA, Monza R6-P with Authenticity service), application decision matrix, ISO/IEC 18000-63 + GS1 EPC Gen2 v2 standards parity, and procurement / inlay availability across the global converter ecosystem (Avery Dennison, Smartrac, Arizon, HID, Beontag, etc.). Seven FAQs cover real-world range, reader/chip vendor lock-in, the User memory dependency, UCODE DNA vs UCODE 9 + Authenticate decision, EPC Gen2 v1 backward compatibility, counterfeit silicon defense, and FCC vs ETSI deployment differences.

- File: `src/content/editorial/compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9.json`
- Sections: 8 · FAQs: 7 · Tables: 3
- Hero image alt: documented; uses the existing UHF inlay imagery via `imageSourceRoutes`
- Rendered HTML: 165,636 bytes · 6,941 words

For comparison, the existing `/compare/ntag213-vs-ntag215-vs-ntag216/` page renders to 136,542 bytes — the new page substantially exceeds the prior compare-cluster baseline despite no chrome change, confirming the depth-bar lift.

## Schema + EEAT

Both pages use the full editorial frontmatter EEAT signals introduced earlier:

- `keywords`: 8-9 short phrases per page (chip names, standards, feature names)
- `publishedAt` / `modifiedAt` / `reviewedAt`: 2026-04-18
- `authorSlug`: `editorial-board` · `reviewedBySlug`: `peter-zhang`
- `heroImage` set explicitly on the guide; the comparison page declares `imageAlt` and lets the renderer pick from `imageSourceRoutes`

## Build verification

- `npm run build` (with `ASTRO_OUT_DIR=./dist-restored`) — completed in 98.26s
- Both pages render: `dist-restored/guides/ntag424-dna-sun-cmac-authentication/index.html` and `dist-restored/compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9/index.html`
- Guard-rails intact: neither page renders the "Used in these industries" SKU-only block (grep count 0/0)
- The SKU page `/products/rfid-labels/ntag424-dna-tamper-evident-tag/` still renders the industries block (grep count 1) — bidirectional linking from W4 unaffected
- Catalog image audit unchanged: 252 / 252 / 0 / 0 (guides + compare pages are not catalog products)
- Post-build `EPERM unlink dist-restored/.prerender/...` — benign sandbox cleanup failure; build itself completes successfully

## Files changed / created

- `src/content/editorial/guides/ntag424-dna-sun-cmac-authentication.json` — new (215 lines, ~1500 narrative words)
- `src/content/editorial/compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9.json` — new (~250 lines, ~1700 narrative words)
- `pillar-pages-w5-report.md` — this report

## Internal-link impact

Both new pages cross-link into the existing topical mesh:

- Guide → 2 NTAG424 DNA SKU pages, the new UHF chip comparison, and `/compare/uhf-vs-hf-rfid/`
- Comparison → 3 UHF inlay/tag SKU pages, the new NTAG424 guide (HF analogue), and `/compare/uhf-vs-hf-rfid/`
- External authoritative links: NXP datasheets (UCODE 8, 9, NT4H2421), Impinj Monza documentation, Alien Higgs-9 product page, GS1 EPC Gen2 v2 standard, ISO/IEC 18000-63 standard, NXP application notes (AN12196 referenced inline in the SUN+CMAC flow)

This wires the guides + compare clusters into the chip-family topical authority graph in both directions: the new pages cite the SKU pages as canonical commercial implementations, and the SKU pages already had `relatedIndustries` distribution from W4. The next round will close the loop the other way (SKU pages link *to* the encyclopedia pages via `resourceCards`).

## Deferred / next passes

1. **W5-6 P1 batch (5 pages)** — NTAG21x family encyclopedia, UCODE 9 standalone encyclopedia, UCODE 8 standalone encyclopedia, Monza R6 / R6-P / 4QT encyclopedia, Impinj M730 / M750 / M800 SKU break-out from the bundled inlay page. Estimated 3-4 days at the new depth bar.
2. **W6 P0 — MIFARE DESFire EV3 command & file types** — sized to NTAG424-guide depth, with the AID/file/command matrix and key derivation flow.
3. **SKU `resourceCards` back-references** — once the encyclopedia pages exist, every NTAG424 DNA SKU page should link to the new guide in its `resourceCards`, and every UHF UCODE/Monza/Higgs SKU page should link to the new comparison. ~30 SKU JSONs to update, scriptable.
4. **Compare cluster depth pass (W10)** — extend the 15 thin existing compare pages from ~300 to 700+ words. The two new compare pages set the new bar; existing thin pages should be brought up.
5. **`/landing-images/uhf-rain-rfid-chip-comparison.jpg`** — the new comparison page declares this hero path but the asset hasn't been generated yet. Either generate via the `_build-pillar-heroes.py` composition script (UHF-themed 6-tile composite) or assign an existing UHF inlay hero. Currently the page falls back to the imageSourceRoutes-derived image, which renders cleanly.

## Push instructions

The commit will land in the sandbox repo; push from your local terminal:

```sh
cd /Users/zhangping/Projects/Playground && git push origin main
```

This brings the open commits to three: `91ac7a0` (W3 industries pillar), `9499fe1` (W4 SKU relatedIndustries), and the W5 commit landing now.
