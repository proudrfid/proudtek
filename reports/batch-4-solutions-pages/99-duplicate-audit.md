# 99 — Batch 4 Duplicate-Cluster Audit

**Scope:** Identify potential topical overlap within `solutions/` (and adjacent content surfaces that the flagship 6 pages link into) and recommend a canonical-vs-keep decision per cluster, with **no deletions** per user preference.

**Audit date:** 2026-04-23

## Method

For each pair / cluster:
1. What's the overlap?
2. Who is the target reader and buyer intent, and do they diverge enough to justify two pages?
3. What's the canonical recommendation (merge, keep-both-as-hub-and-spoke, keep-both-as-topical-siblings, or strengthen-differentiation)?
4. What's the cross-link / 301 / redirect implication?

No deletions are recommended. Where a merge is on the table, the recommendation is always "merge + 301 from the deprecated slug to the canonical slug" so no inbound links are lost.

## Cluster 1 — NTAG 424 DNA silicon siblings (three solution pages)

**Pages in cluster:**
- `/solutions/nfc-brand-authentication/` — the topic-general anti-counterfeit story (Batch 4 refined).
- `/solutions/digital-product-passport/` — the EU-regulation-driven compliance story (Batch 4 refined).
- `/solutions/nfc-luxury-authentication/` — (referenced from both pages above, not audited in Batch 4, assumed to exist as a vertical-specific sub-story for handbags / watches / sneakers).

**Overlap:** All three share the **same silicon** (NTAG 424 DNA with SUN/CMAC) and all three implement the **same consumer experience** (tap to verify). A buyer researching "NFC anti-counterfeit for luxury handbags" could land on any of the three.

**Buyer intent divergence (why three pages is justified):**
- **Brand authentication** — horizontal story, audience is a brand-protection counsel or marketing team across any product category where counterfeiting is a material commercial / IP problem. EEAT anchored to OECD / EUIPO / CBP.
- **Digital Product Passport** — regulatory-compliance story, audience is a sustainability / compliance / procurement team navigating ESPR / Battery Regulation. EEAT anchored to EU regulations, CIRPASS-2, GS1 Digital Link.
- **NFC luxury authentication** — vertical story, audience is a luxury / fashion / watch brand's digital or supply-chain director deciding on concession-grade implementation. EEAT anchored to specific product-category case studies.

These are **three distinct buyer intents** that an answer engine will route to differently (an LLM answer for "what is the EU Digital Product Passport" should surface the DPP page, not the luxury page). Merging would harm discoverability for at least two of the three intents.

**Recommendation:** **Keep all three. Strengthen the hub-and-spoke.** Each of the three pages should explicitly cross-link the other two as "siblings on the same silicon, different buyer frames". This is already done post-refinement on `nfc-brand-authentication` (links to DPP + luxury) and on `digital-product-passport` (links to brand-auth + luxury). The `/solutions/nfc-luxury-authentication/` page was not audited in this batch — **action: include it in the next solutions batch** and ensure it links to both siblings and to `/industries/luxury-brands/` (Batch 2, already refined).

**No deletion. No 301. Strengthen cross-links only.** Canonical = the page whose slug matches the query intent (authentication vs DPP vs luxury).

## Cluster 2 — Hotel key cards ↔ RFID access control

**Pages in cluster:**
- `/solutions/hotel-key-cards/` — Batch 4 refined.
- `/solutions/rfid-access-control/` — Batch 4 refined.
- `/solutions/hotel-rfid-access-control/` — referenced from `rfid-access-control`'s resource card but **not audited in Batch 4**.

**Overlap:** Hotel key cards are the hospitality-specific subset of RFID access control. The two flagship pages share ~30% of their surface (chip families, encoding workflow, lock-brand compatibility).

**Buyer intent divergence:**
- **RFID access control** — horizontal, audience is a facilities / security manager across corporate, residential, campus, healthcare, industrial. Chip discussion extends from EM4100 through DESFire EV3, fobs, wristbands, dual-frequency.
- **Hotel key cards** — vertical, audience is hospitality procurement / FF&E. The decision surface is different: lock-estate compatibility first (VingCard, Saflok, ONITY, Salto, Häfele, MIWA, Be-Tech), then chip, then material (PVC vs wood vs PLA vs bamboo), then encoding workflow.

These are genuinely different buyer journeys — the hotel page correctly foregrounds lock compatibility (which the horizontal access-control page does not), and the access-control page correctly foregrounds chip-tier-by-security-level (which the hotel page does not). **Keep both.**

**The third page — `/solutions/hotel-rfid-access-control/` — is the concern.** If it exists, it is a likely three-way overlap: hospitality + access control + hotel-specific. The slug suggests a generic rewrite of the hotel story that duplicates the flagship `hotel-key-cards` page.

**Recommendation:**
- **Keep** `hotel-key-cards` (canonical for hospitality procurement).
- **Keep** `rfid-access-control` (canonical for horizontal access-control buyer).
- **Audit** `/solutions/hotel-rfid-access-control/` in the next solutions batch. Likely outcome: merge content that isn't already on the flagship hotel-key-cards page into it (lock-brand technical detail, encoder setup), then **301 `/solutions/hotel-rfid-access-control/` → `/solutions/hotel-key-cards/`**. No deletion today — action held pending audit.

## Cluster 3 — NFC business card ↔ NFC business card programs (suspected duplicate)

**Pages in cluster:**
- `/solutions/nfc-business-card/` — Batch 4 refined.
- `/solutions/nfc-business-card-programs/` — **referenced from the refined page's resource card, existence not verified in Batch 4**.

**Suspected overlap:** The slug `nfc-business-card-programs` strongly suggests a page about team / multi-user rollouts, which is exactly one of the four "Best for" bullets on the refined single `nfc-business-card` page, and which the refined page already addresses in the per-card URL personalisation bullet and in the cost-per-card FAQ. If `nfc-business-card-programs` exists as a separate page, the overlap is likely high enough that the two should **merge**.

**Buyer intent:** If the programs page exists, its implied audience is HR / marketing teams rolling out NFC cards to a full workforce; the flagship page's audience is individuals, founders and small teams. In practice most buyers start with the flagship page and only need a rollout-specific page if the flagship doesn't cover team-scale concerns. The refined flagship page now covers them explicitly (per-card personalisation, team rollouts, pricing at volume) — so the programs page may be redundant.

**Recommendation:**
- **Audit** `/solutions/nfc-business-card-programs/` in the next solutions batch to confirm it exists and characterise its current content.
- **If it exists with significant unique content (rollout playbooks, team onboarding, IT / security integration):** keep both and strengthen the hub-and-spoke.
- **If it is a thin re-statement of the flagship page:** merge the unique content into the flagship page and **301 `/solutions/nfc-business-card-programs/` → `/solutions/nfc-business-card/`**.
- **No deletion today.** The flagship page's new resource-card link to the programs page is a placeholder pending the audit outcome.

## Cluster 4 — RFID inventory tracking ↔ retail-apparel industry landing

**Pages in cluster:**
- `/solutions/rfid-inventory-tracking/` — Batch 4 refined.
- `/industries/retail-apparel/` — Batch 2 scope but **not Batch 2 refined** (was listed as an open item for a Batch 2b).

**Overlap:** Material overlap on item-level UHF retail source-tagging, which is both a solution (inventory accuracy, OOS reduction) and a vertical focus (apparel retail specifically).

**Buyer intent divergence:**
- **Inventory tracking solution** — horizontal, audience is a retail / warehouse / manufacturing operations leader deciding on an inventory-accuracy program across any product category. Discusses retail, 3PL, manufacturing, healthcare, libraries.
- **Retail & apparel industry landing** — vertical, audience is an apparel brand / retailer deciding on source-tagging, omnichannel, BOPIS, shrink reduction. Discusses retail-specific compliance (Amazon Vendor Central, Walmart RFID mandate, ESPR textile DPP).

**These are genuinely different buyer journeys — no merge needed.**

**Recommendation:** **Keep both.** When `/industries/retail-apparel/` is Batch-2-refined, it should cross-link to `/solutions/rfid-inventory-tracking/` as the horizontal solution and receive a return link from the solution page's industry resource card (already present post-Batch 4 refinement). Clean hub-and-spoke, no canonical conflict.

## Cross-cutting observation — the `/blog/...` and `/guides/...` layers

Every refined page surfaces blog and/or guide links that have not been audited. These are **not duplicates** in the topical sense — they're the supporting-content layer — but they share vocabulary with the solution pages and will compete for the same long-tail queries if not coordinated.

Example: `/blog/nfc-product-authentication/` and `/solutions/nfc-brand-authentication/` both answer "how does NFC product authentication work". The right canonical distribution is:
- **Solution page:** buyer-intent query ("NFC brand authentication for [use case]"), procurement surface, cross-sell into SKU / industry / compare.
- **Blog / guide page:** research-intent query ("how does NFC product authentication work"), educational depth, cross-link into solution.

Post-Batch-4 the solution pages are in good shape. The blog / guide layer is the next audit surface — once that's done, a **site-wide `rel="canonical"` audit** is the right final pass to make sure answer engines are routed to the correct intent-tier page for each query.

## Action summary

| Cluster | Action | Owner | Status |
|---------|--------|-------|--------|
| 1. NTAG 424 DNA siblings | Strengthen 3-way cross-links on all three pages; audit `nfc-luxury-authentication` | Next solutions batch | Pending |
| 2. Hotel / access control | Audit `hotel-rfid-access-control`; likely 301 → `hotel-key-cards` | Next solutions batch | Pending |
| 3. NFC business card / programs | Audit `nfc-business-card-programs`; likely merge + 301 | Next solutions batch | Pending |
| 4. Inventory tracking / retail-apparel | Keep both; refine retail-apparel industry landing | Batch 2b | Pending |
| Cross-cutting | Blog / guide audit + site-wide canonical sweep | Later batch | Pending |

**Deletions: zero.** Every action is either a strengthen-cross-link or a merge-plus-301. No canonical content is lost from the site regardless of which of these actions is executed.
