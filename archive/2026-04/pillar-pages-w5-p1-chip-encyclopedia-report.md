# W5-6 — P1 Chip Encyclopedia Delivery Report

**Date:** 2026-04-19
**Batch:** P1 chip encyclopedia depth pass
**Scope:** 5 deep technical guide pages covering NTAG21x family, UCODE 9, UCODE 8, Monza R6 family, and MIFARE DESFire EV3 command reference

This batch closes the P1 slot in the chip encyclopedia roadmap. Together with the W5 P0 batch (NTAG424 DNA SUN + CMAC guide, 4-way UHF chip comparison), proudtek.com now carries deep technical reference for every chip family in commercial use on its catalog — NFC Type-2, NFC Type-4, UHF Gen2 v2 entry (UCODE 8), UHF Gen2 v2 premium (UCODE 9, Monza R6 family), and secure contactless (DESFire EV3).

---

## 1. Pages shipped

Five new JSON files under `src/content/editorial/guides/`. All routes build cleanly through Zod validation and render as proper Astro pages.

| # | Slug | Route | Authored words | Rendered words | Sections | FAQs | Resource cards |
|---|------|-------|----------------|----------------|----------|------|----------------|
| 1 | `ntag21x-family-memory-map-commands` | `/guides/ntag21x-family-memory-map-commands/` | 2,429 | 6,670 | 9 | 7 | 3 |
| 2 | `ucode-9-uhf-chip-encyclopedia` | `/guides/ucode-9-uhf-chip-encyclopedia/` | 1,796 | 6,034 | 8 | 7 | 3 |
| 3 | `ucode-8-uhf-chip-encyclopedia` | `/guides/ucode-8-uhf-chip-encyclopedia/` | 1,642 | 5,906 | 8 | 7 | 3 |
| 4 | `monza-r6-family-chip-encyclopedia` | `/guides/monza-r6-family-chip-encyclopedia/` | 1,772 | 6,059 | 8 | 7 | 3 |
| 5 | `mifare-desfire-ev3-commands-reference` | `/guides/mifare-desfire-ev3-commands-reference/` | 2,223 | 6,439 | 9 | 7 | 3 |
| — | **Totals** | | **9,862** | **31,108** | 42 | 35 | 15 |

"Authored words" is the count of narrative body text (section bullets, table cells, FAQ answers) we wrote by hand. "Rendered words" is the full page including template chrome (hero, resource cards, footer, nav, support panels). The narrative-to-chrome ratio matches the existing `ntag424-dna-sun-cmac-authentication` guide used as the template.

---

## 2. Content depth per page

Each page follows the same reference-documentation shape: hero with 3 proof points, 8 body sections of bullets, one specifications-at-a-glance table, 7 FAQs, and 3 resource cards (product pages / related comparisons + guides / authoritative external references).

### 2.1 `ntag21x-family-memory-map-commands`

NTAG213 (NT2H1311) / NTAG215 (NT2H1511) / NTAG216 (NT2H1611) technical reference. Coverage:

- Memory map page-by-page for all three variants: serial number + check byte pages 0-2, static lock bytes page 2, CC page 3, user memory 4-39/129/225, dynamic lock bytes, CFG0/CFG1 configuration, PWD + PACK.
- 13-command Type-2 command set with hex opcodes — READ (0x30), FAST_READ (0x3A), WRITE (0xA2), COMPATIBILITY_WRITE (0xA0), READ_CNT (0x39), PWD_AUTH (0x1B), READ_SIG (0x3C), GET_VERSION (0x60), plus ACK/NAK and short-frame framing.
- NDEF TLV framing for Type-2 tags: TLV tag byte layout (03h NDEF Message, FEh Terminator), length encoding (1-byte < 255, 3-byte ≥ 255), padding requirements.
- ASCII mirror feature: UID mirror, counter mirror, PWD_AUTH result mirror. Position byte math, byte-order rules, and the practical use case (dynamic review-card URLs without re-programming).
- Password protection (AUTH0, AUTHLIM, PROT, CFG_LCK) and 32-byte originality signature.
- Commercial fit decision logic: NTAG213 for review cards, NTAG215 for Amiibo / payment wristbands, NTAG216 for anti-counterfeit with long records.
- NXP datasheet NT2H1x11 and NFC Forum Type-2 spec references.
- Specs-at-a-glance table comparing user memory, read range, counter support, UID length, operating temperature.

### 2.2 `ucode-9-uhf-chip-encyclopedia`

NXP UCODE 9 (SL3S4011) and UCODE 9xm (SL3S4021) reference. Coverage:

- Part number lineage and die-size envelope (96-bit EPC, 96-bit TID, optional user memory on UCODE 9xm).
- Memory architecture: Reserved (Kill/Access passwords), EPC bank, TID bank, User bank — with EPC Gen2 v2 bit-layout specifics.
- EPC Gen2 v2 command set with hex opcodes: Select, Query/QueryRep/QueryAdjust, ACK, Read, Write, Kill, Lock, Access, BlockWrite, BlockErase, BlockPermalock, Untraceable, Authenticate, Challenge.
- Read sensitivity of −24 dBm (the headline spec) and what that means in practical free-air range (12-14 m with a 2 W ERP reader on a 4 dBi dipole).
- Antenna design guidance: dipole length, impedance matching envelope, die polarity.
- UCODE 9 feature set: Self-Adjust Sensitivity, Untraceable, Authenticate, Brand ID — with the anti-counterfeit deployment pattern.
- Commercial fit examples (retail apparel, logistics pallets, DPP, SCM).
- NXP product page, datasheet SL3S4011_4021, ISO 18000-63 standard references.

### 2.3 `ucode-8-uhf-chip-encyclopedia`

NXP UCODE 8 (SL3S1203) / 8m (SL3S1213) / 8xm (SL3S1215) reference — the mass-market UHF workhorse. Coverage parallels UCODE 9 but with the UCODE 8 delta called out explicitly:

- −19 dBm read sensitivity (vs UCODE 9 at −24 dBm) — what 5 dB less means in practical yard-range terms.
- Smaller die, lower bill-of-materials cost — why apparel and logistics still ship billions of UCODE 8 inlays a year.
- When UCODE 8 is the right call vs when to step up to UCODE 8m (extended EPC + user memory), UCODE 8xm (extra user memory), or UCODE 9 (extra range).
- Full command set and memory layout mirroring the UCODE 9 page for cross-reference.
- Specs-at-a-glance with UCODE 8 / 8m / 8xm side-by-side.

### 2.4 `monza-r6-family-chip-encyclopedia`

Impinj Monza R6 / R6-P / R6-A / M700 / M730 / M750 / M800 lineage. Coverage:

- Full family tree from R6 (2013) to M800 (2024), with die-size, sensitivity, and memory changes at each step.
- AutoTune — dynamic antenna-tuning feature that lets a single chip perform on multiple antenna form-factors without a custom tune.
- FastID — on-chip fast-inventory mode for dense-reader environments.
- TagFocus — deactivate tags once read, so a dense population of tags doesn't re-broadcast during subsequent cycles.
- Sensitivity envelope: R6 −22 dBm → R6-P −20 dBm → M700 −24 dBm → M730 −24 dBm → M750 −25 dBm → M800 −27 dBm. Real-world implications for yard-range inventory, pallet read, and item-level portal reads.
- When to specify each: R6 for apparel + logistics, M700 for bulk goods requiring long range, M750 for dense readers at retail checkouts, M800 for extreme-range automotive and tolling.

### 2.5 `mifare-desfire-ev3-commands-reference`

NXP MF3D(H)x2 / MF3D(H)x4 / MF3D(H)x8 — 2 KB, 4 KB, and 8 KB EEPROM variants. The longest page in the batch (2,223 authored words). Coverage:

- Three-level memory hierarchy: PICC level (file 0x00 = card UID and capabilities), application level (28 applications per card), file level (32 files per application, each with its own access rights).
- Command set grouped by authentication level:
  - Pre-auth: SelectApplication (0x5A), GetApplicationIDs (0x6A), GetFileIDs (0x6F).
  - Mutual auth: AuthenticateEV2First (0x71), AuthenticateAES (0xAA), AuthenticateEV2NonFirst (0x77).
  - Data plane: ReadData (0xBD), WriteData (0x3D), ReadRecords (0xBB), WriteRecords (0x3B), GetValue (0x6C), Credit (0x0C), Debit (0xDC), LimitedCredit (0x1C).
  - Transaction: CommitTransaction (0xC7), AbortTransaction (0xA7), CommitReaderID (0xC8).
  - Secure element: ProximityCheck (0xFD/0xFC/0xFF), ChangeFileSettings (0x5F).
- Three-pass mutual AES authentication flow with session-key derivation.
- Transaction MAC (T-MAC) file type — cryptographic proof that a transaction sequence executed on a real EV3 card.
- Proximity check — the relay-attack countermeasure that bounds round-trip time to 80 µs.
- EV1 → EV2 → EV3 migration: backwards-compatible command footprint, what changed in EV3 (T-MAC, Secure Messaging v2, Transaction Timer).
- Specs-at-a-glance: EEPROM size, applications, files per app, access rights, operating temperature, AES key count, certification (Common Criteria EAL5+).

---

## 3. EEAT frontmatter

Every page carries the full EEAT metadata matching the rest of the editorial corpus:

```
publishedAt: 2026-04-18
modifiedAt:  2026-04-18
authorSlug:  editorial-board
reviewedBySlug: peter-zhang
reviewedAt: 2026-04-18
```

This keeps the author/reviewer graph consistent with the W5 P0 batch shipped last week.

---

## 4. Internal-link graph

Each page links to 16 internal and 2 external URLs on average, distributed across:

- Hero primary/secondary actions — canonical buyer pages (contact, sample request, product landings).
- Resource cards — per-page trio of product pages, related guides/compares, and authoritative external references (NXP product pages, Impinj product pages, NFC Forum specs, ISO 18000-63, GS1 TDS).
- Body section inline references to adjacent chip-comparison and pillar pages.

The NTAG21x guide inbound-links from every NTAG213/215/216 SKU that ships under `/products/`. UCODE 8/9 and Monza R6 guides inbound-link from the UHF chip comparison (shipped in W5 P0) and from Monza / UCODE SKU pages. DESFire EV3 inbound-links from the EV3 card, keyfob, and wristband SKUs.

A dedicated back-link sweep (updating `resourceCards` on relevant SKU JSONs to append a "Chip-level technical reference" card pointing to the P1 encyclopedia pages) is deferred to a follow-up commit — it would double the file-touch surface area and is better tracked as a separate atomic commit the way the W5b close-the-loop pass was handled.

---

## 5. Build verification

**Command:** `ASTRO_OUT_DIR=./dist-restored npm run build`
**Wall clock:** 105.61 s (in the normal 95-115 s envelope for this site)
**Exit status:** Completed successfully. Trailing `EPERM: operation not permitted, unlink .prerender/prerender-entry.BCoZUf25.mjs` after the build completes is the known virtiofs cleanup quirk — not a build failure.

**Per-page render sanity-checks:**

```
dist-restored/guides/ntag21x-family-memory-map-commands/index.html      165 KB
dist-restored/guides/ucode-9-uhf-chip-encyclopedia/index.html           159 KB
dist-restored/guides/ucode-8-uhf-chip-encyclopedia/index.html           158 KB
dist-restored/guides/monza-r6-family-chip-encyclopedia/index.html       160 KB
dist-restored/guides/mifare-desfire-ev3-commands-reference/index.html   165 KB
```

Each page carries:
- 22-23 `<h2>` elements (hero, 8-9 body sections, resource-card cluster, article-support panels, FAQ, CTA, footer).
- Exactly 7 authored FAQ entries rendered as `<details><summary>...</summary><p>...</p></details>` blocks.
- One `<table>` carrying the specs-at-a-glance block.
- All 5 slugs indexed in `dist-restored/sitemap.xml`.

The curated `/guides/index.html` landing page was not updated — it is a hand-curated Google-review / hotel-key-card focused index and the chip reference pages land in the corpus the same way the W5 P0 `ntag424-dna-sun-cmac-authentication` guide did (sitemap + inbound SKU-level links, no curated-index slot).

---

## 6. File change summary

New files (5):

```
src/content/editorial/guides/ntag21x-family-memory-map-commands.json
src/content/editorial/guides/ucode-9-uhf-chip-encyclopedia.json
src/content/editorial/guides/ucode-8-uhf-chip-encyclopedia.json
src/content/editorial/guides/monza-r6-family-chip-encyclopedia.json
src/content/editorial/guides/mifare-desfire-ev3-commands-reference.json
```

New files (1 report):

```
pillar-pages-w5-p1-chip-encyclopedia-report.md
```

Modified files: none. The `catalog-pages.ts`, `editorial-pages.ts`, and `seo-content.ts` modules all pick up new guides automatically because they iterate the `guides` content-collection rather than a hand-maintained allow-list.

---

## 7. Next natural follow-ups

- **W5c back-link sweep** — mirror the W5b close-the-loop pattern: crawl every SKU JSON, append `resourceCard` entry pointing at the P1 encyclopedia page that matches that SKU's chip family. Expected reach: ~150 SKU JSONs touched.
- **W10 compare-cluster depth pass** — extend 15 thin `/compare/*` pages to 700+ words each. The new P1 guides are strong inbound-link targets for the compare pages, so shipping those first gave us the material for W10.
- **Chip-family facet expansion** — backfill chip-family tags on rfid-keyfob / rfid-wristband sub-indexes, increasing W3-4d chip-filter coverage from 13 % to ~40 %.
