# 04 — NTAG 424 DNA TT Cards

**Route:** `/products/rfid-cards/ntag424-dna-tt-card/`
**File:** `src/content/editorial/products/rfid-cards/ntag424-dna-tt-card.json`
**Title:** NTAG 424 DNA TT Cards — Tamper-Detect NFC Authentication (58 chars)

## Audit — what the old page was missing

- Old page had two deep bullet-list sections and no table / timeline / statBar. Buyers could not scan it.
- `imageSourceRoutes` and one `secondaryAction` pointed to dead `/product/nfc-business-card/` and `/product/nfc-stickers/` URLs.
- FAQ 3 entries. No sources, no author, no dates.
- No explicit GS1 Digital Link / EU Digital Product Passport framing — the 2025–27 buyer segment for this SKU is exactly DPP-driven.
- `relatedIndustries` included `pharmaceuticals` (plural), which does not match the actual `industries/pharmaceutical.json` slug.

## Changed — what the new page contains

- **Structure (7 sections):** What is + `statBar` (AES-128 CMAC, NFC Forum Type 4, hardware tamper loop, no-app) → "424 DNA TT vs 424 DNA vs DESFire EV3 vs NTAG215" decision `table` → 5-step SUN/CMAC authentication `timeline` (tap → SUN generation → server lookup → counter + tamper check → branded response) → "static QR vs dynamic NFC" `comparePanel` → 6-reason brand-protection `featureGrid` → luxury / pharma / cosmetics applications + brand-protection image → standards bullets + `checklist` (key diversification, tap counter policy, tamper state, grey-market signal, DPP readiness).
- **HeroPoints:** 3 answer-first bullets (SUN dynamic URL, hardware tamper loop, no-app phone verification).
- **FAQ:** 7 entries (tamper loop reset, backend server requirement, 424 DNA vs 424 DNA TT, app requirement, EU DPP fit, MOQ, replay prevention).
- **Cross-links:** 3 `resourceCards` (related SKUs → DESFire EV3, Plus SE, Classic 1K; brand-protection solutions → NFC brand authentication, Digital Product Passport; technical reference → NTAG424 DNA SUN + CMAC guide, MIFARE Plus vs DESFire compare).
- **Fixed routes:** all `/product/*/` URLs removed; `secondaryActions` now route to `/solutions/nfc-brand-authentication/`, `/solutions/digital-product-passport/`, `/products/rfid-cards/mifare-desfire-ev3-card/`.
- **Industry slug fix:** `pharmaceuticals` → `pharmaceutical` (matches `industries/pharmaceutical.json`).
- **Facets:** `chipFamilies: ["ntag424"]`, `envFamilies: ["embed","tamper"]`, `relatedIndustries: ["luxury-brands","brand-protection","pharmaceutical","logistics"]`.

## SEO & GEO

- **Title** 58 chars, keyword first with tamper-detect differentiator.
- **Summary** answer-first: "NTAG 424 DNA TT cards pair NXP's AES-128 SUN authentication with a hardware tamper loop…" — directly answers "what is NTAG 424 DNA TT".
- **keywords:** "NTAG 424 DNA TT cards", "NFC tamper detection", "SUN authentication NFC", "anti-counterfeit NFC", "AES-128 NFC product authentication", "digital product passport NFC".
- **GEO hooks:** the 5-step SUN timeline and "static QR vs dynamic NFC" comparison panel are the single most-cited shapes in LLM answers for "how does NFC tag authentication work". Both now live on the page as structured fields, not prose.

## Sources cited (6)

NXP NTAG 424 DNA TT product page · NFC Forum Type 4 Tag Operation Specification · ISO/IEC 14443-3:2018 · GS1 Digital Link standard · EU Ecodesign for Sustainable Products Regulation (DPP) · NIST SP 800-38B (CMAC).

## Verification

- ✅ JSON parses; Zod schema validates.
- ✅ All `href`s resolve (fixed missing `/compare/nfc-chip-families/` → `/compare/mifare-plus-vs-desfire/`).
- ✅ `heroImage` `/landing-images/ntag424-dna-tt-card.png` exists.
- ✅ Section image `/landing-images/brand-protection.png` exists.
- ✅ `relatedIndustries` all resolve after `pharmaceuticals` → `pharmaceutical` fix.
- ⚠️ Lighthouse — not run; see batch summary.

## Open items

- Consider adding an `/compare/ntag424-dna-vs-ntag215/` comparison page in the compare batch — it is the most common pre-purchase question and we currently link a less-targeted fallback.
- When the EU DPP implementing acts publish delegated regulations, revisit the DPP section to add a dated citation.
- The `checklist` item on key-diversification policy ("master key in HSM, per-card keys derived from UID") should be verified against Proud Tek's actual personalisation service before the page ships.
