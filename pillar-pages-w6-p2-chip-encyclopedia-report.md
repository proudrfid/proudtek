# W6-P2 — Chip Encyclopedia Batch (Classic 1K/4K, Ultralight C, EM family, ICODE SLIX)

**Date:** 2026-04-19
**Scope:** Ship the next four chip-encyclopedia guide pages in the W6 series. These cover the remaining high-volume / installed-base chip families not yet on the site: MIFARE Classic 1K + 4K, MIFARE Ultralight C, the 125 kHz LF trio (EM4100 / EM4305 / T5577), and the ISO 15693 ICODE SLIX / SLIX2 family.
**Outcome:** Four new `/guides/*-chip-encyclopedia/` pages, each ~500+ words per section with 8 sections, a specs table, 3 resource-card sidebars, 7 FAQ entries, and full EEAT frontmatter. Every card on `/products/all/` with a chip-family facet now has a dedicated reference page behind it.

---

## 1. Scope

After the W5-P1 batch (UCODE 8, UCODE 9, Monza R6, NTAG21x, MIFARE DESFire EV3) shipped five chip pages, four high-volume chip families remained with dense filter representation on `/products/all/` but no dedicated reference page:

| Chip family | Filter-pill cards | Pre-pass guide | Post-pass guide |
|---|---:|---|---|
| MIFARE Classic | 43 | — | `/guides/mifare-classic-1k-4k-chip-encyclopedia/` |
| MIFARE Ultralight (C variant) | 11 | — | `/guides/mifare-ultralight-c-chip-encyclopedia/` |
| EM / T5577 (LF) | 21 | — | `/guides/em4100-em4305-t5577-lf-chip-encyclopedia/` |
| ICODE SLIX | 13 | — | `/guides/icode-slix-chip-encyclopedia/` |

Each pairs a chip-filter pill on `/products/all/` to a dedicated deep-dive. The catalog's chip facets are now 9-for-9 on dedicated reference pages (the only remaining chip filter, MIFARE Plus with 4 cards, is correctly deferred — the content is better served by the existing `/compare/mifare-plus-ev2-vs-desfire-ev3/` page).

---

## 2. Page structure

Every new guide follows the W5-P1 template established by `ucode-9-uhf-chip-encyclopedia.json`:

```
Frontmatter
  route, group, title, kicker, summary
  heroPoints × 3  (each ~60–80 words, deep technical claim)
  imageAlt, heroImage, imageSourceRoutes
  keywords × 8–9
  publishedAt, modifiedAt, authorSlug=editorial-board, reviewedBySlug=peter-zhang, reviewedAt

Sections × 8
  1. Family and part numbers        — model variants, counterfeit-watch
  2. Memory architecture            — layout, blocks, lock mechanism
  3. Crypto / command set           — authentication protocol, ISO compliance
  4. Air interface specifics        — ATQA/SAK or equivalent identifiers
  5. Antenna, physical, environmental — impedance, form factors, temp range
  6. Commercial deployments         — real-world segments + fit/anti-fit guidance
  7. Reference documents            — NXP / ISO / NIST documents list
  8. Specifications at a glance     — comparative table across variants

resourceCards × 3
  - Product pages (Proud Tek SKUs)
  - Related comparisons and guides (internal cross-link graph)
  - Authoritative external references (2 NXP or ISO links each)

faq × 7 (covers: is-it-secure, variant selection, backwards-compat,
         edge cases, phone compatibility, write endurance, cloning)

primaryAction — "Request [chip] samples" → /contact/
secondaryActions × 3 — product page + comparison + related guide
```

Chip-specific deep-dive examples:

- **Classic 1K/4K** spends a full section on CRYPTO1 (48-bit state, 3-pass handshake, nested/darkside/hardnested break history 2008-2015) and lays out the Plus EV2 migration path via NXP AN1305.
- **Ultralight C** walks through the 3DES (TDEA-EDE3, NIST SP 800-67) mutual-auth handshake, the 24-bit one-way counter and its use for single-use event-ticket validation, and the NIST SP 800-131A deprecation timeline through 2030.
- **EM / T5577** devotes a section to T5577 cloning: the reader-hardware options (Proxmark3 + commercial duplicators), the format-emulation table (EM4100, HID Prox H10301, Indala, AWID, ioProx), and the legitimate vs pentest operational-hardening implications for legacy LF installations.
- **ICODE SLIX** covers the ISO 15693 vicinity air interface, the EAS (Electronic Article Surveillance) bit with library checkout/return/gate-alarm workflow, the SLIX2 PRIVACY command + 64-bit passwords, and the NFC Forum Type 5 Tag compatibility with Android + iOS Core NFC.

---

## 3. File change summary

New (5):

```
src/content/editorial/guides/mifare-classic-1k-4k-chip-encyclopedia.json        (+193 lines)
src/content/editorial/guides/mifare-ultralight-c-chip-encyclopedia.json          (+193 lines)
src/content/editorial/guides/em4100-em4305-t5577-lf-chip-encyclopedia.json       (+207 lines)
src/content/editorial/guides/icode-slix-chip-encyclopedia.json                   (+201 lines)
pillar-pages-w6-p2-chip-encyclopedia-report.md                                   (this report)
```

No schema change. No existing-page touch. Content-only pass — the ISR-relevant plumbing (SnapshotLayout rendering of guide JSON, `/guides/*` slug routing via `[...slug].astro`, sitemap emission, internal-link rewriting) was already in place.

---

## 4. Build verification

**Command:** `ASTRO_OUT_DIR=./dist-restored npm run build`
**Wall clock:** 91.94 s (consistent with prior builds after W3-4d⁵ 195-card catalog)
**Exit status:** Completed. Trailing EPERM on `.prerender` cleanup is the known virtiofs quirk.

**Spot-checks:**

- All 4 `/guides/*-chip-encyclopedia/index.html` pages built successfully.
- Each page renders H1 + At-a-glance + 8 content sections + Useful-next-pages + 3 resource-card sections + FAQ (9 H3 entries: 7 FAQ questions + 2 shared-layout headings).
- Each page contains exactly 1 `<table>` (the Specifications at a glance variant-comparison table).
- Sitemap (`dist-restored/sitemap.xml`) contains all 4 new routes.
- Page sizes 162-166 KB each (within range of the existing W5-P1 chip-guide pages: UCODE 9 = 158 KB, Monza R6 = 161 KB, DESFire EV3 = 165 KB).

**Sitemap entries:**

```
/guides/mifare-classic-1k-4k-chip-encyclopedia/
/guides/mifare-ultralight-c-chip-encyclopedia/
/guides/em4100-em4305-t5577-lf-chip-encyclopedia/
/guides/icode-slix-chip-encyclopedia/
```

---

## 5. Net of W5 + W6 chip-encyclopedia series

| Pass | Pages shipped | Chip family |
|---|---|---|
| W5-P1 | `/guides/ucode-8-uhf-chip-encyclopedia/` | NXP UCODE 8 UHF |
| W5-P1 | `/guides/ucode-9-uhf-chip-encyclopedia/` | NXP UCODE 9 UHF |
| W5-P1 | `/guides/monza-r6-family-chip-encyclopedia/` | Impinj Monza R6 UHF |
| W5-P1 | `/guides/ntag21x-family-memory-map-commands/` | NXP NTAG213/215/216 HF NFC |
| W5-P1 | `/guides/mifare-desfire-ev3-commands-reference/` | NXP DESFire EV3 HF |
| **W6-P2** | `/guides/mifare-classic-1k-4k-chip-encyclopedia/` | NXP MIFARE Classic 1K/4K HF |
| **W6-P2** | `/guides/mifare-ultralight-c-chip-encyclopedia/` | NXP Ultralight C HF |
| **W6-P2** | `/guides/em4100-em4305-t5577-lf-chip-encyclopedia/` | EM / Atmel-T5577 LF |
| **W6-P2** | `/guides/icode-slix-chip-encyclopedia/` | NXP ICODE SLIX HF |

Nine chip-encyclopedia pages total spanning UHF (3), HF 14443 (4), HF 15693 (1), and LF 125 kHz (1). Every chip-family filter pill on `/products/all/` (with ≥10 cards) now has a dedicated reference.

Topical authority depth on `proudtek.com/guides/` is now at a level where a manufacturer procurement engineer asking "what's on the market for [use case]" can land on the relevant chip guide, read a credible technical reference (spec table + 7 FAQs + NXP/ISO document list), and click through to SKUs, comparisons, or solution pages without needing to leave the site.

---

## 6. Next natural follow-ups

- **W7 chip-encyclopedia tail** — Alien Higgs-9, Fudan FM11RF08 (the Chinese-origin MIFARE Classic-compatible silicon), NTAG424 DNA (currently has SUN-auth guide but no full chip encyclopedia). Lower priority because filter-pill card counts are smaller (Alien Higgs 10, others under 5).
- **W10 compare-cluster depth pass** — with the chip-encyclopedia set now 9-deep, each compare-cluster page can now cite 2-3 chip references rather than generic "see datasheet" links. Extend thin `/compare/*` pages to 700+ words each using this deeper source.
- **Internal-link audit pass** — cross-link each chip-encyclopedia to the others where it's in the same family tree (Classic → Plus → DESFire, Ultralight → NTAG21x → NTAG424). This follow-up could be a short sweep on the relatedComparisons / seeAlso fields of each guide's JSON.
- **Solution-page upgrade** — refresh `/solutions/hotel-key-cards/`, `/solutions/rfid-library-management/`, `/solutions/rfid-laundry-tags/` and similar pillars to cite the new chip guides in their reference sections.
