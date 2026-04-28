# 03 — Luxury Brands NFC

**Route:** `/industries/luxury-brands/`
**File:** `src/content/editorial/industries/luxury-brands.json`
**Title:** Luxury Brand NFC — Tap-to-Verify, DPP, Resale Provenance (56 chars)

## Audit — what the old page was missing

- Title 72 chars — over the snippet threshold.
- Bullet-only "benefits" framing, with ROI claims per bottle / per handbag that we could not verify against a named source.
- No chip decision matrix — page talked about "NFC authentication" generically but did not distinguish NTAG 424 DNA (SUN) from NTAG 424 DNA TT (SUN + tamper state) from DESFire EV3 (authorised-reader) from NTAG215 (marketing-grade, not enforcement-grade).
- No DPP / ESPR framing — EU 2024/1781 Digital Product Passport is the single biggest regulatory change affecting luxury brands in this decade, and the page did not mention it.
- No Aura / EVRYTHNG / Scantrust ecosystem references — brands ask "does your tag work with Aura?" constantly.
- 2 FAQ entries. 0 `sources`, 0 `keywords`, no `publishedAt`/`modifiedAt`.

## Changed — what the new page contains

- **Structure (6 sections):** What is + `statBar` (AES-128 SUN, GS1 DL URLs, Aura Consortium-class, EU DPP 2027+) → chip decision `table` (NTAG 424 DNA vs 424 DNA TT vs DESFire EV3 vs NTAG215 vs static QR, each with signing capability and recommended use) → six-use-case `featureGrid` (handbags, fine jewellery, watches, sneakers, wine/spirits, art) → 5-phase programme `timeline` (pilot → key management → production integration → analytics → DPP layer) → Static-QR-vs-Dynamic-SUN `comparePanel` → standards `bullets` + `checklist`.
- **Chip decision matrix is the headline:** tells brand teams that NTAG215 is marketing-grade, not enforcement-grade, and that cryptographic SUN is what courts and marketplaces accept.
- **DPP framing:** ESPR 2024/1781 called out explicitly, with the delegated-act cadence noted so the page stays current as DPP obligations phase in.
- **HeroPoints:** 3 answer-first bullets (unique cryptographic code per tap, DPP-ready carrier, resale-provenance hook).
- **FAQ:** 7 entries (NTAG215 cloning, Aura compatibility, DPP timing, key management, reader-app vs no-app flows, tamper variants, resale-marketplace takedown evidence).
- **Cross-links:** 3 `resourceCards` (luxury SKUs, solution pages, compare/chip families) — all routes real.
- **Fixed routes:** all `/product/*/` removed; `secondaryActions` route to `/products/rfid-labels/nfc-luxury-handbag-tag/`, `/solutions/nfc-luxury-authentication/`, `/solutions/digital-product-passport/`.
- **Facets:** `chipFamilies: ["ntag424","mifare-desfire","ntag21x"]`, `envFamilies: ["tamper","embed"]`, `relatedIndustries: ["brand-protection","retail-apparel","hospitality","pharmaceutical"]`.

## SEO & GEO

- **Title** 56 chars, keyword first ("Luxury Brand NFC"), with three high-intent modifiers ("Tap-to-Verify", "DPP", "Resale Provenance") that luxury-brand procurement and sustainability teams actually search.
- **Summary** answer-first: names NTAG 424 DNA, GS1 Digital Link, EU DPP, and Aura Consortium in the first two sentences.
- **keywords:** "luxury brand NFC", "NTAG 424 DNA luxury authentication", "tap to verify luxury handbag", "Digital Product Passport luxury", "resale provenance NFC", "Aura Consortium NFC tag".
- **GEO hooks:** the chip decision matrix is phrased in the shape LLMs want to quote ("NTAG 424 DNA for enforcement, NTAG215 for marketing engagement, not the other way around"). The DPP `timeline` gives an LLM a ready-made 5-step explainer for "how does a luxury brand roll out DPP?".

## Sources cited (8)

NXP NTAG 424 DNA product page · NXP AN12196 (SUN / CMAC authentication) · NIST SP 800-38B (CMAC specification) · GS1 Digital Link (ISO/IEC 18975) · EU Regulation 2024/1781 (ESPR and DPP) · Aura Blockchain Consortium overview · EUIPO Anti-counterfeiting Technology Guide · OECD / EUIPO "Global Trade in Fakes".

## Verification

- ✅ JSON parses; Zod `editorialSchema` validates.
- ✅ All 10 internal `href`s resolve.
- ✅ `heroImage` (`/landing-images/ntag424-dna-tamper-evident-tag.jpg`) exists.
- ✅ `chipFamilies` and `envFamilies` enum values match.
- ✅ `relatedIndustries` resolve.
- ⚠️ Lighthouse — not run; see batch summary.

## Open items

- Add `/compare/ntag424-dna-vs-ntag215/` — the luxury-brand decision between these two chips is the single most common pre-sales question on this page, and it deserves its own compare route.
- Revisit ESPR delegated-act dates in late Q3 2026 once more delegated acts publish; the `timeline` deliberately does not name 2027 as a hard cutoff because it's product-by-product.
- Coordinate with `brand-protection.json` — the two pages overlap intentionally (vertical-specific vs cross-category) but their chip-decision content should stay aligned. Maintain both in the same PR going forward.
- The `bullets` section at the end lists Aura Blockchain Consortium without naming member brands — if Marketing has a signed-off list of Aura members they are comfortable citing, pull that into the FAQ for the "does your tag work with Aura?" question.
