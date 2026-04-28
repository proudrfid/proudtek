# 05 — EM4100 RFID Cards

**Route:** `/products/rfid-cards/em4100-rfid-card/`
**File:** `src/content/editorial/products/rfid-cards/em4100-rfid-card.json`
**Title:** EM4100 RFID Cards — 125 kHz Read-Only Proximity Cards (55 chars)

## Audit — what the old page was missing

- Factually imprecise intro: called the frame a "40-bit ID" without mentioning the 64-bit Manchester frame (9-bit header + 40-bit payload + parity + stop) that EM4100 actually transmits.
- `chipFamilies: ["mifare-classic","mifare-desfire","mifare-plus","em-tk5"]` was wrong — this SKU is LF EM4100, not MIFARE.
- `imageSourceRoutes` and both `secondaryActions` pointed to dead `/product/*/` URLs.
- No explicit "HID Prox ≠ EM4100" clarification, which is the #1 buyer mistake on this SKU.
- FAQ 3 entries. No sources, no author, no dates.

## Changed — what the new page contains

- **Structure (7 sections):** What is + `statBar` (125 kHz, 40-bit ID in 64-bit frame, read-only, 5–15 cm) → "EM4100 vs HID Prox vs MIFARE Classic vs DESFire EV3" decision `table` with explicit "HID Prox is not EM4100" callout → "why 125 kHz EM4100 still ships in 2026" `timeline` (pre-2005 install wave → 2007–08 Classic break → 2010s dual-freq cards → 2020s mobile → 2026) → "right choice vs wrong choice" `comparePanel` → 6-deployment `featureGrid` including a "where we refuse EM4100" tile (data centres, energy substations, dispensary vaults) → reader-compatibility cheat sheet + industrial.webp image → configuration options + `checklist`.
- **Factual fix:** "40-bit ID" → "64-bit Manchester frame carrying a 40-bit unique ID" with full frame structure described.
- **Facet fix:** `chipFamilies: ["em-tk5"]` only. Removed the incorrect MIFARE entries that were polluting the `/products/all/` catalog filter.
- **HeroPoints:** 3 answer-first bullets (read-only 64-bit frame, LF RF tolerance, lowest per-card cost).
- **FAQ:** 7 entries (cloning, HID reader compatibility, EM4100 vs EM4102, buy-or-migrate in 2026, stored data, MOQ, read range).
- **Cross-links:** 3 `resourceCards` (upgrade paths → Classic 1K, Plus SE, DESFire EV3; compatibility + compare → `/compatibility/`, `/compare/125khz-vs-13.56mhz-rfid/`; solutions → `/solutions/rfid-attendance-system/`, `/solutions/rfid-access-control/`).
- **Fixed routes:** all `/product/*/` removed. `secondaryActions` now route to `/products/rfid-cards/mifare-classic-1k-card/`, `/solutions/rfid-access-control/`, `/compare/125khz-vs-13.56mhz-rfid/`.
- **Image fix:** section image `/landing-images/manufacturing.png` did not exist. Replaced with `/landing-images/industrial.webp` (which does exist and matches the factory-floor use case).
- **Facets:** `chipFamilies: ["em-tk5"]`, `envFamilies: ["embed"]`, `relatedIndustries: ["education","logistics","industrial","events-venues"]`.

## SEO & GEO

- **Title** 55 chars, keyword first with both "125 kHz" and "read-only proximity" modifiers (which buyers search for).
- **Summary** answer-first: "EM4100 is the most widely deployed 125 kHz read-only RFID chip — a fixed-ID proximity card with no encryption…". Sets expectations honestly.
- **keywords:** "EM4100 RFID cards", "125 kHz proximity cards", "EM4102 cards", "read-only RFID cards", "legacy access control cards", "dual-frequency 125 kHz 13.56 MHz cards".
- **GEO hooks:** the HID-Prox-vs-EM4100 callout is answer-shaped and directly addresses the most-asked LLM question on this SKU ("will EM4100 open my HID reader"). The "right choice vs wrong choice" panel gives LLMs a defensible use-case list to quote.

## Sources cited (5)

EM Microelectronic EM4100 datasheet · EM Microelectronic EM4102 / EM4200 family page · ISO/IEC 18000-2 (RFID at ≤135 kHz) · HID Global Prox technology overview · Nohl et al. "Reverse-Engineering a Cryptographic RFID Tag" (USENIX 2008) — for the framing of "when do I migrate off LF to HF".

## Verification

- ✅ JSON parses; Zod schema validates.
- ✅ All `href`s resolve (fixed `/compare/125-khz-vs-13-56-mhz/` → `/compare/125khz-vs-13.56mhz-rfid/`; `/solutions/workforce-time-attendance/` → `/solutions/rfid-attendance-system/`; `/solutions/facility-access-control/` → `/solutions/rfid-access-control/`).
- ✅ `heroImage` and section image (`industrial.webp`) exist.
- ⚠️ Lighthouse — not run; see batch summary.

## Open items

- Confirm with fulfilment whether EM4100 SKUs actually ship with EM4102 chips (the FAQ says so but this should be verified per recent lot).
- Consider an `/compare/em4100-vs-hid-prox/` page — "will this open my HID reader" is a repeated sales question and currently the answer lives inside the FAQ rather than on a dedicated compare route.
- The `checklist` assumes the buyer's access control system is the source of truth for expiry/revocation. If Proud Tek ships EM4100 cards with pre-programmed expiry dates (unlikely on a read-only chip, but worth confirming) the language should change.
