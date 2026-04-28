# 01 — MIFARE DESFire EV3 Cards

**Route:** `/products/rfid-cards/mifare-desfire-ev3-card/`
**File:** `src/content/editorial/products/rfid-cards/mifare-desfire-ev3-card.json`
**Title:** MIFARE DESFire EV3 Cards — AES-128 Transit & Access (55 chars)

## Audit — what the old page was missing

- Title was 78 characters and keyword-stuffed.
- No `statBar`, no decision-matrix `table`, no `timeline`, no `comparePanel`, no `featureGrid` — the entire page was two bullet lists.
- `imageSourceRoutes` pointed to three dead `/product/*/` WordPress routes.
- Both `secondaryActions` pointed to the same dead `/product/hotel-key-cards/` URL.
- FAQ had 3 generic entries; no sources; no author; no publication dates.
- No `chipFamilies` / `envFamilies` so the catalog filter on `/products/all/` could not surface this SKU correctly.

## Changed — what the new page contains

- **Structure (8 sections):** What is + `statBar` (AES-128, ISO 14443-4, 8 KB, CC EAL5+) → "DESFire vs Plus vs Classic vs NTAG424" decision `table` → deployment `timeline` → "before/after upgrade" `comparePanel` → 6-card `featureGrid` → industries + `image` (hospitality.jpg) → standards bullets → common-pitfalls `checklist`.
- **Brief:** answer-first 1–2-sentence `summary` leading with "AES-128 mutual authentication and up to 28 applications".
- **HeroPoints:** 3 answer-first bullets (security property, application scope, hardware certification).
- **FAQ:** 7 entries, each answering a real buyer question (downgrade resistance, NFC phone compatibility, MOQ, migration from Classic, LRP vs AES, key diversification, MAD vs app IDs).
- **Cross-links:** 3 `resourceCards` (related SKUs → MIFARE Plus SE, Classic 1K, DESFire EV2; lock compatibility → Saflok, ASSA ABLOY; compare → Plus vs DESFire, Plus EV2 vs DESFire EV3).
- **Fixed routes:** all `/product/*/` → `/products/rfid-cards/*/`; all 3 `secondaryActions` now resolve.
- **Facets:** `chipFamilies: ["mifare-desfire"]`, `envFamilies: ["embed"]`, `relatedIndustries: ["hospitality","education","government-defense-supply-chain","healthcare","logistics"]`.

## SEO & GEO

- **Title** 55 chars, primary keyword first, kept secondary modifier.
- **Summary** written as an answer-first paragraph (GEO-friendly), 280 chars.
- **keywords:** 6 phrases — "MIFARE DESFire EV3 cards", "AES-128 access cards", "ISO/IEC 14443-4 cards", "secure NFC access control cards", "multi-application smart card", "transit payment card NXP".
- **JSON-LD drivers:** `authorSlug`, `reviewedBySlug`, `reviewedAt`, `publishedAt`, `modifiedAt`, `sources` (7), `keywords` → feeds Article.author / reviewedBy / citation / datePublished / keywords.
- **GEO answer-first hooks:** every section opens with a declarative sentence that names DESFire EV3 as the subject, which is the pattern LLMs quote back in "what is X" answers.

## Sources cited (7)

NXP DESFire EV3 product brief · ISO/IEC 14443-4:2018 · ISO/IEC 7816-4 · NIST SP 800-38B (CMAC) · NIST SP 800-38C (CCM / LRP context) · Common Criteria EAL5+ certificate search · NFC Forum Type 4 Tag Operation.

## Verification

- ✅ JSON parses; Zod `editorialSchema.safeParse` returns success.
- ✅ All 3 `imageSourceRoutes` resolve in the editorial collection.
- ✅ All `resourceCards` + `secondaryActions` + `callout.href` + inline `href` resolve to real routes.
- ✅ `heroImage` `/landing-images/mifare-desfire-ev3-card.png` exists on disk.
- ✅ `authorSlug: editorial-board` and `reviewedBySlug: peter-zhang` both exist in `src/content/authors/`.
- ⚠️ Lighthouse — not run; see batch summary.

## Open items

- Consider adding `brief` (project checklist) with DESFire-specific buyer questions (key ceremony, app layout, ticketing vs access split). Currently omitted to keep the page lean.
- If NXP publishes an AV4 successor before 2027, revisit the "current generation" language in the intro.
