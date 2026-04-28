# 02 — MIFARE Classic 1K Cards

**Route:** `/products/rfid-cards/mifare-classic-1k-card/`
**File:** `src/content/editorial/products/rfid-cards/mifare-classic-1k-card.json`
**Title:** MIFARE Classic 1K Cards — Bulk 13.56 MHz Access Cards (55 chars)

## Audit — what the old page was missing

- Title was generic and did not communicate the "bulk, low-cost, 1K memory" positioning.
- Page made unverified hard claims: "40–60 % less expensive than DESFire" with no source.
- Did not clearly frame the CRYPTO-1 break: readers got "no encryption" messaging without knowing the actual break history (Nohl 2007, Garcia 2008).
- `imageSourceRoutes` and `secondaryActions` pointed to dead `/product/*/` URLs.
- FAQ 3 entries, no sources, no author, no dates.

## Changed — what the new page contains

- **Structure (7 sections):** What is + `statBar` (13.56 MHz, 1 KB, ISO 14443 Type A, CRYPTO-1) → "Classic 1K vs Plus SE vs DESFire EV3" decision `table` → CRYPTO-1 break `timeline` (1997 → 2024) → "Do / Don't use for" `comparePanel` → 6-deployment `featureGrid` → reader compatibility + hospitality image → migration path bullets.
- **Cost claim softened:** "40–60 % less expensive" removed. Replaced with qualitative "lowest per-card cost in the MIFARE family — the reason large-MOQ programs still ship Classic".
- **CRYPTO-1 timeline:** cites the 2007/2008 academic reversal and frames current use as "appropriate only for low-risk, low-value closed-loop". Drives GEO pickup on "is MIFARE Classic secure".
- **HeroPoints:** 3 answer-first bullets (memory + price position, reader interoperability, honest security posture).
- **FAQ:** 7 entries (cloning risk, ISO 14443 Type A compatibility, lock compatibility, downgrade from Classic 4K, key management, MOQ, hotel safety).
- **Cross-links:** 3 `resourceCards` (upgrade paths → Plus SE, DESFire EV3, dual-frequency; hotel lock compatibility → Saflok, ASSA ABLOY; compare pages).
- **Fixed routes:** all `/product/*/` → real routes.
- **Facets:** `chipFamilies: ["mifare-classic"]`, `envFamilies: ["embed"]`, `relatedIndustries: ["fitness","events-venues","hospitality","education"]`.

## SEO & GEO

- **Title** 55 chars, keyword first, positioning second.
- **Summary** answer-first: "MIFARE Classic 1K is the lowest-cost 13.56 MHz smart card in the MIFARE family…".
- **keywords:** "MIFARE Classic 1K cards", "NXP MIFARE Classic", "13.56 MHz access cards", "hotel key cards MIFARE", "bulk RFID cards", "CRYPTO-1 cards".
- **GEO hooks:** timeline entries are discrete facts (year + event + citation) that LLMs cite verbatim for "when was CRYPTO-1 broken" style questions.
- **Honesty:** page explicitly names what MIFARE Classic is *not* suitable for, which reduces hostile search "MIFARE Classic hacked" friction and earns trust citations.

## Sources cited (6)

NXP MIFARE Classic datasheet · ISO/IEC 14443-3:2018 · Nohl et al., "Reverse-Engineering a Cryptographic RFID Tag" (USENIX 2008) · Garcia et al., "Dismantling MIFARE Classic" (ESORICS 2008) · ENISA — RFID Security Recommendations · NFC Forum Type 2 Tag Operation (for framing contrast).

## Verification

- ✅ JSON parses; Zod schema validates.
- ✅ All internal `href`s resolve to editorial or wpPages routes.
- ✅ `heroImage` and section `image.src` (hospitality.jpg) exist.
- ✅ `relatedIndustries` all resolve to `industries/*.json`.
- ⚠️ Lighthouse — not run; see batch summary.

## Open items

- `/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/` exists but is hotel-lock-scoped; a generic `/compare/mifare-classic-vs-desfire-ev3/` would be a better link target for this SKU's upgrade-path resource card. Recommend adding in the compare batch.
- The "hotel lock compatibility" callout currently links to `/compatibility/` (pillar). When individual lock-vendor compatibility pages exist (Saflok, Kaba, ASSA ABLOY), re-point.
