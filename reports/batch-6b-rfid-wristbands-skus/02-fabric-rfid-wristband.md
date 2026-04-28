# 02 — Fabric RFID Wristband

**File:** `src/content/editorial/products/rfid-wristbands/fabric-rfid-wristband.json`
**Route:** `/products/rfid-wristbands/fabric-rfid-wristband/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage: /landing-images/fabric-rfid-wristband.jpg` verified on disk.
- `publishedAt` / `modifiedAt` absent.
- `imageSourceRoutes` contained 2 broken singular `/product/...` routes (`rfid-wristbands-for-events`, `rfid-silicone-wristbands`).
- `sections[0]` "Why event producers choose fabric" bullets were mostly defensible but carried one episodic claim: "increasing per-attendee spend by 15-30%" (festival-cashless outcomes are attested but the specific % range is best attributed).
- `sections[0]` also carried "in under 1 second" access-gate read-time specific.
- `resourceCards` had 2 cards with 1 broken `/product/...` route and no Batch 2 industry, Batch 3 compare, or Batch 4 solution cross-links.
- `primaryAction.href: /contact/` (broken).
- `secondaryActions[0], [1]` both broken `/product/...`.
- `relatedIndustries: ["events-venues","retail-apparel"]` — both defensible; kept as-is.
- `chipFamilies: ["ntag21x","mifare-classic","mifare-desfire","impinj-m7","ucode"]` — correct multi-chip coverage.
- `envFamilies: ["outdoor"]` — correct.

## Changed

**Image.** No change.

**Metadata.** Added `publishedAt: "2026-04-23"`, `modifiedAt: "2026-04-23"`; updated `reviewedAt` to `2026-04-23`.

**`imageSourceRoutes`.** Broken singular routes → `/products/rfid-wristbands/cashless-payment-rfid-wristband/` (the Batch-6 flagship cashless SKU this page deeply cross-references) + `/products/rfid-wristbands/silicone-wristband-mifare-classic/` (the silicone material sibling).

**Claim hygiene — Why-event-producers section.** "increasing per-attendee spend by 15-30%" → "per the published festival-cashless literature — driving a meaningful per-attendee spend uplift versus cash-only operations" (matches the Batch 6 cashless-payment scope-note + literature-attribution pattern). "access rights in under 1 second" → "access rights in a tap" (qualitative).

**Cross-link density.** Expanded `resourceCards` from 2 → 3 entries:
1. **Related festival and venue RFID wristbands** — 4 entries: cashless-payment-rfid-wristband (Batch 6), rfid-tyvek-wristband (Batch 6), paper-rfid-wristband (Batch 6b), rfid-adjustable-silicone-wristband (Batch 6b).
2. **Industry landings** — events-venues + hospitality (Batch 2).
3. **Related solutions, compares and pillar** — rfid-event-access-control (Batch 4), mifare-plus-ev2-vs-desfire-ev3 (Batch 3 cashless-security decision), ucode8/9/Monza/Higgs UHF compare (Batch 3), wristband pillar.

**Routing fix.** `primaryAction.href: /contact/` → `/contact/event-rfid/`. `secondaryActions[0], [1]` broken singular routes → cashless-payment-rfid-wristband + silicone-wristband-mifare-classic.

**`relatedIndustries`.** No change (`events-venues` + `retail-apparel` both defensible — fabric wristbands are a retail-apparel brand-wearable category beyond events).

## SEO / GEO shape

Strong. Summary opens answer-first (woven polyester band with embedded RFID, one-time sliding lock, full-colour sublimation). The "Why event producers choose fabric RFID wristbands" 5-bullet section is the strongest answer-engine extraction target — each bullet is a discrete benefit (multi-day comfort, cashless economy with softened framing, access zoning, souvenir value, sponsor integration).

The "Proud Tek fabric RFID wristband specifications" 5-bullet spec section (material, RFID module, lock, printing, lead time) is a clean Q/A target for "fabric RFID wristband specs" queries.

FAQ covers 3 practitioner questions (post-event NFC tap behavior for marketing retention, rain/washing durability with IP67 claim, MOQ/lead time).

## Verification

- JSON parses ✅
- Zod schema shape ✅
- `heroImage: /landing-images/fabric-rfid-wristband.jpg` exists on disk ✅
- 15 internal hrefs, all resolve ✅
- `chipFamilies: ["ntag21x","mifare-classic","mifare-desfire","impinj-m7","ucode"]` correct ✅
- `envFamilies: ["outdoor"]` correct ✅
- `relatedIndustries: ["events-venues","retail-apparel"]` preserved ✅
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **Woven-vs-dye-sub print quality claim.** The table "Print quality" row in the sibling tyvek-rfid-wristband page rates fabric as "Excellent (woven/dye-sub)" — this page's "full-color dye-sublimation printing edge-to-edge with photographic quality" is consistent but carries no attribution. If a photograph sample gallery is added, link it from this page.
- **"Souvenir value" post-event retention.** The claim is qualitatively defensible but has no measurement. If a case-study (e.g., Coachella post-event wristband-tap analytics) is available, link it here — this is a high-value EEAT anchor.
- **`sources` block absent.** Adding NFC Forum Type 2, ISO/IEC 14443-3, NXP NTAG21x datasheet, Impinj Monza R6 datasheet and 1-2 festival-fashion / brand-retention case studies would match Batch 4 EEAT baseline.
- **Sliding-lock spec depth.** "Stainless-steel lock with custom color and logo engraving" — if the lock is sourced from a specific partner (e.g., Tageos, Cmolo), naming the partner would strengthen the EEAT signal.
