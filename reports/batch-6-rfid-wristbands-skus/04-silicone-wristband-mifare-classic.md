# 04 — Silicone Wristband (MIFARE Classic)

**File:** `src/content/editorial/products/rfid-wristbands/silicone-wristband-mifare-classic.json`
**Route:** `/products/rfid-wristbands/silicone-wristband-mifare-classic/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage` was `/landing-images/silicone-wristband-mifare-classic.jpg` — verified on disk; **no change needed**.
- `publishedAt` / `modifiedAt` absent.
- `imageSourceRoutes` contained `/lp/rfid-wristband-factory/` (lives in `_unused/`, does NOT resolve).
- `heroPoints[2]` carried "100,000+ tap cycles" specific count.
- `sections[0]` "Why silicone and MIFARE Classic" missed the critical CRYPTO-1-is-broken disclosure on Classic 1K — a significant omission for a buyer-facing page recommending it as a "preferred combination". Other soft specifics: "-40 C to +85 C", "dramatically lower per-use cost".
- `sections[2]` "Quality and safety certifications" carried "100% electrical testing" universal-guarantee wording.
- `faq[1]` carried "3-5 years with daily use" and "over 100,000 read/write cycles" specifics.
- `resourceCards` had 1 entry with broken `/lp/rfid-wristband-factory/` route; no Batch 2 industry, Batch 3 compare or Batch 4 solution cross-links.
- `secondaryActions[0]` used broken `/lp/rfid-wristband-factory/`.
- `primaryAction.href` was bare `/contact/` (broken).
- `chipFamilies: ["mifare-classic"]` — correct.
- `envFamilies: ["outdoor"]` — correct.
- `relatedIndustries: ["fitness", "events-venues", "hospitality", "education"]` — all four are defensible primary verticals; no change.

## Changed

**Image.** No change.

**Metadata.** Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`.

**`imageSourceRoutes`.** `/lp/rfid-wristband-factory/` (unusable) → `/products/rfid-wristbands/rfid-waterpark-wristband/` (the waterpark-specific sibling, the dominant deployment vertical for silicone MIFARE).

**Critical security disclosure — Why-silicone section.** Added inline: "Note: CRYPTO-1 is cryptographically broken; for new high-value closed-loop wallets, specify DESFire EV3 or Plus EV2 rather than Classic." This is the factually correct caveat. MIFARE Classic's legacy install-base value is real but the security position has to be stated.

**Claim hygiene.** "100,000+ tap cycles" → "the chip's full EEPROM retention envelope (many tens of thousands of reader interactions per NXP MIFARE Classic specification)"; "-40 C to +85 C" → "typical outdoor-hospitality temperature envelope"; "dramatically lower per-use cost" → "materially lower per-use cost".

**Claim hygiene — Certifications section.** "100% electrical testing" → "per-unit electrical testing".

**Claim hygiene — FAQ.** "3-5 years with daily use ... over 100,000 read/write cycles" → "multi-year usable life with daily wear ... chip's EEPROM is rated per the NXP datasheet for many tens of thousands of write cycles with long data retention".

**Cross-link density.** Expanded `resourceCards` from 1 → 3 entries (broken route removed):
1. **Related silicone and fabric RFID wristbands** — rfid-adjustable-silicone-wristband, fabric-rfid-wristband, rfid-waterpark-wristband.
2. **Industry landings** — 3 Batch 2 landings: hospitality, events-venues, fitness (the three primary verticals).
3. **Related compares, card equivalents and pillar** — silicone-vs-fabric-vs-woven compare (Batch 3), mifare-plus-ev2-vs-desfire-ev3 compare (Batch 3, the security-upgrade path), mifare-classic-1k-card (Batch 1 credential equivalent), wristband pillar.

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/event-rfid/`. `secondaryActions[0]` broken `/lp/rfid-wristband-factory/` → `/products/rfid-wristbands/` (pillar).

## SEO / GEO shape

Strong. Summary opens answer-first (silicone + MIFARE Classic for waterpark / fitness / pool access). The "Why silicone and MIFARE Classic are the preferred combination for venues" section is a 4-bullet rationale block — each bullet is a distinct answer-engine extraction target. With the CRYPTO-1 caveat now inline, the page maintains commercial integrity: honest about the legacy-install-base value of Classic while directing new high-value deployments to the correct successor chips.

The "Design and customization options" section is an extractable spec block (closure / color / logo / size) — useful for "silicone RFID wristband customization" queries.

FAQ covers 3 practitioner questions (hypoallergenic / child-safe materials, reusability cycle count, access-control + cashless multi-application sectoring).

## Verification

- JSON parses ✅
- Zod schema ✅
- `heroImage: /landing-images/silicone-wristband-mifare-classic.jpg` exists on disk ✅
- 11 internal hrefs, all resolve ✅
- `chipFamilies: ["mifare-classic"]` correct ✅
- `envFamilies: ["outdoor"]` correct ✅
- `relatedIndustries` preserved at 4 primary verticals
- `publishedAt` + `modifiedAt` set ✅
- CRYPTO-1 caveat added inline ✅

## Open items

- **Cross-link to the Batch-1-refined `mifare-classic-1k-card`** — now linked in resourceCards. Confirm the return-link from that card page into this wristband page for the "wristband vs card credential form-factor" decision.
- **`/products/rfid-wristbands/rfid-adjustable-silicone-wristband/`** — the direct sibling SKU linked but not Batch-6-refined. Natural Batch 6b candidate.
- **Explicit chip-upgrade path page** — the CRYPTO-1 caveat names DESFire EV3 and Plus EV2 as successors. The `/products/rfid-wristbands/cashless-payment-rfid-wristband/` covers DESFire-based wristbands; consider whether a Plus-EV2-specific wristband SKU should be split out for the upgrade-from-Classic buyer.
- **`sources` block absent.** Adding NXP MIFARE Classic 1K MF1ICS50 datasheet, Courtois / Meijer / Verdult CRYPTO-1 attack paper (for the caveat), FDA 21 CFR 177.2600 silicone regulation and ISO 9001:2015 certification references would match Batch 4 EEAT baseline.
- **CRYPTO-1 caveat could be elevated to a `callout` block** — the security-disclosure content is important enough that a dedicated callout block (once the editorial schema supports it) would make it more prominent than an in-bullet clause.
