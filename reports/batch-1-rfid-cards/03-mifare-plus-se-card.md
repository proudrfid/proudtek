# 03 — MIFARE Plus SE Cards

**Route:** `/products/rfid-cards/mifare-plus-se-card/`
**File:** `src/content/editorial/products/rfid-cards/mifare-plus-se-card.json`
**Title:** MIFARE Plus SE Cards — AES-128 Classic Upgrade Path (53 chars)

## Audit — what the old page was missing

- Did not clearly distinguish Plus SE from Plus S / X / EV1 / EV2, which is the #1 confusion point for this SKU.
- No structured migration path — buyers landed on the page without a sequence to follow.
- Page carried an unverified "$250k–$750k migration budget" synthetic estimate.
- FAQ 3 entries. No sources, no author, no dates.
- `secondaryActions` pointed to dead `/product/*/` URLs.

## Changed — what the new page contains

- **Structure (7 sections):** What is + `statBar` (AES-128, Security Level 1/2/3, ISO 14443-3 + -4, 1 KB) → Security Level 1/2/3 decision `table` → 5-phase migration `timeline` → "rip-and-replace vs phased" `comparePanel` → 6-reason `featureGrid` → reader firmware compatibility + healthcare.webp → "when to pick Plus SE vs DESFire EV3" bullets.
- **Dollar estimate removed:** "$250k–$750k" replaced with "reader firmware + key-management spend dominates the migration budget — the exact number depends on the size of the reader estate and whether key ceremonies can run on the existing HSM".
- **Security Level framing:** explicit table row per level (1 = Classic compat / 2 = AES auth / 3 = full AES secure messaging) — the single artifact that explains why Plus SE exists.
- **HeroPoints:** 3 answer-first bullets (AES-128, same form factor as Classic, Security Level configurability).
- **FAQ:** 7 entries (Plus SE vs Plus EV1, reader firmware upgrade path, re-personalisation scope, CRYPTO-1 fallback, phased vs bulk migration, MOQ, downgrade risk).
- **Cross-links:** 3 `resourceCards` (related SKUs → Classic 1K, DESFire EV3, dual-frequency; compare → Plus vs DESFire, Plus EV2 vs DESFire EV3; hotel lock compatibility).
- **Fixed routes:** all `/product/*/` → `/products/rfid-cards/*/`.
- **Facets:** `chipFamilies: ["mifare-plus"]`, `envFamilies: ["embed"]`, `relatedIndustries: ["healthcare","hospitality","education","brand-protection"]`.

## SEO & GEO

- **Title** 53 chars, keyword first with positioning tail.
- **Summary** answer-first: "MIFARE Plus SE is NXP's AES-128 upgrade for MIFARE Classic estates — same form factor, same reader protocol, new security level".
- **keywords:** "MIFARE Plus SE cards", "MIFARE Plus AES-128", "MIFARE Classic upgrade", "Security Level 3 access cards", "MIFARE migration cards", "NXP MIFARE Plus SE".
- **GEO hooks:** explicit Security Level 1/2/3 table and 5-phase migration timeline are both high-value answer snippets for "how do I migrate from MIFARE Classic to AES".

## Sources cited (5)

NXP MIFARE Plus SE product brief · ISO/IEC 14443-3:2018 · ISO/IEC 14443-4:2018 · NIST SP 800-38B (CMAC) · ENISA RFID Security Recommendations.

## Verification

- ✅ JSON parses; Zod schema validates.
- ✅ All `href`s resolve.
- ✅ `heroImage` and section `image.src` (healthcare.webp) exist.
- ⚠️ Lighthouse — not run; see batch summary.

## Open items

- The "Security Level 3" row in the decision table leans on AES-128 secure messaging. If the ISO/IEC 14443-4 revision expected in 2027 changes the messaging framing, revisit.
- Confirm Proud Tek actually personalises Plus SE cards at Security Level 3 vs. shipping them at Level 1 for customer-side key ceremony — the FAQ currently says "we can ship at any level", which should be validated with the fulfilment team.
