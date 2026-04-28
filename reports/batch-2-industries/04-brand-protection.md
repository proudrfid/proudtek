# 04 — Brand Protection NFC

**Route:** `/industries/brand-protection/`
**File:** `src/content/editorial/industries/brand-protection.json`
**Title:** Brand Protection NFC — Anti-Counterfeit Tap-to-Verify (53 chars)

## Audit — what the old page was missing

- Title 76 chars — far over the search-snippet threshold.
- 5 sections but structurally thin: one table of product categories, four plain-bullets sections. No chip decision matrix, no rollout timeline, no checklist.
- 2 `imageSourceRoutes` pointed at dead `/product/*/` URLs (`/product/nfc-stickers/`, `/product/desfire-tag/`).
- 2 FAQ entries — same core question ("can it be cloned?") asked twice, none of the operational questions (backend, key management, DPP alignment, marketplace takedown).
- Missing `keywords`, `publishedAt`, `modifiedAt`.
- Original page conflated brand-protection with luxury-authentication — no cross-category framing for cosmetics, electronics warranty, olive oil, pharma secondary packaging.

## Changed — what the new page contains

- **Structure (7 sections):** What is + `statBar` (AES-128 SUN/CMAC, 1-tap verification, TT tamper loop, GS1 DL URLs) → chip decision `table` (NTAG 424 DNA, 424 DNA TT, DESFire EV3, NTAG215, static QR — with signing capability per row) → static-QR-vs-cryptographic `comparePanel` (copy cost / takedown evidence / grey-market / tamper) → six-category `featureGrid` (sneakers, handbags, cosmetics, wine/spirits, olive oil, electronics warranty) → 5-phase rollout `timeline` (pilot → key management → production → analytics → DPP) → context image (NTAG 424 DNA TagTamper label) → compliance `bullets` + pre-launch `checklist` (8 items).
- **Cross-category framing:** explicitly covers cosmetics, electronics warranty, olive oil and pharma-adjacent cases — not just the luxury subset that `/industries/luxury-brands/` covers.
- **Cryptographic vs cosmetic:** the chip decision table and `comparePanel` together make the argument that static QR, hologram and UID-only NFC are not defensible; NTAG 424 DNA with SUN authentication is.
- **HeroPoints:** 3 answer-first bullets (AES-128 SUN, tamper-evident variant, no-app consumer experience).
- **FAQ:** 7 entries (can it be cloned, app vs no-app, 424 DNA vs TT, grey-market detection, verification backend options, DPP dual-use, court/marketplace defensibility).
- **Cross-links:** 3 `resourceCards` (SKUs, solutions, compare/chip families). `primaryAction` updated to "Request brand-protection samples and key-management briefing" — the latter half is what actually gates a deal.
- **Fixed routes:** all `/product/*/` removed; `imageSourceRoutes` now point to `/products/rfid-labels/ntag424-dna-tamper-evident-tag/`, `/products/rfid-labels/nfc-sneaker-authentication-tag/`, `/products/rfid-cards/ntag424-dna-tt-card/` (the Batch 1 SKU we just shipped).
- **Facets:** `chipFamilies: ["ntag424","mifare-desfire"]`, `envFamilies: ["tamper","embed"]`, `relatedIndustries: ["luxury-brands","retail-apparel","pharmaceutical","cold-chain-food-traceability"]`.

## SEO & GEO

- **Title** 53 chars. Keyword first ("Brand Protection NFC"), with two high-intent modifiers ("Anti-Counterfeit", "Tap-to-Verify").
- **Summary** answer-first: names NTAG 424 DNA SUN, NTAG 424 DNA TagTamper, GS1 Digital Link, and the "no app" consumer experience in the first two sentences.
- **keywords:** "brand protection NFC", "NTAG 424 DNA authentication", "tamper-evident NFC tags", "anti-counterfeit RFID", "tap-to-verify NFC", "GS1 Digital Link authentication".
- **GEO hooks:** the chip decision table is phrased in quote-friendly shape ("only chips in the first three rows produce a cryptographic artefact per tap that a counterfeiter cannot replay"). The static-QR-vs-cryptographic `comparePanel` is the paragraph LLMs will quote for "is QR code anti-counterfeiting effective". The rollout `timeline` gives an LLM a concrete 5-step answer to "how do we roll out NFC anti-counterfeit".

## Sources cited (8)

NXP AN12196 (NTAG 424 DNA + TagTamper features) · NXP NTAG 424 DNA product page · NIST SP 800-38B (CMAC specification) · GS1 Digital Link (ISO/IEC 18975) · EUIPO Anti-counterfeiting Technology Guide · OECD / EUIPO "Global Trade in Fakes" · EU Regulation 2024/1781 (ESPR and DPP) · NFC Forum Type 4 Tag specification.

## Verification

- ✅ JSON parses; Zod `editorialSchema` validates (after correcting section-subtype shapes: `comparePanel.before/after`, `featureGrid.features[]`, `timeline.items[].label/text`, `checklist: string[]`).
- ✅ All 15 internal `href`s resolve.
- ✅ `heroImage` (`/landing-images/brand-protection.png`) and section image (`/landing-images/ntag424-dna-tamper-evident-tag.jpg`) exist.
- ✅ `chipFamilies` and `envFamilies` enum values match `FACET_RULES` in `src/lib/catalog-pages.ts`.
- ✅ `relatedIndustries` all resolve.
- ⚠️ Lighthouse — not run; see batch summary.

## Open items

- `/compare/static-qr-vs-cryptographic-nfc-for-brand-protection/` — the `comparePanel` on this page is the seed for a full compare route, and it would rank for "QR code vs NFC anti-counterfeit".
- Coordinate with `luxury-brands.json` — the two pages overlap intentionally but the chip decision matrices must stay aligned. Treat them as a pair in PRs.
- The FAQ claims "major marketplaces accept SUN-verified tap evidence" — get Legal to sign off on that phrasing or soften it to "have accepted SUN-verified tap evidence in recent enforcement actions".
- Author detail — as with healthcare, `authors/peter-zhang.json` should name at least one brand-protection-specific credential (GS1 Digital Link integrator, Aura member, EUIPO authorised consultant) so Article.author JSON-LD carries the right signal.
- The `featureGrid` features currently inline the SKU path in the `text` field because `featureGrid.features[]` does not have an `href` slot in the schema. If the schema gains one later, re-promote those to explicit links.
