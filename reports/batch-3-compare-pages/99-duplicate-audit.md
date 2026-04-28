# 99 — Duplicate-pair audit (Batch 3)

Scope: three sibling-compare duplicate pairs flagged during the Batch 3 audit. Per user direction ("audit + recommend canonical, no deletion"), no pages were removed. Each pair is left intact with a recommendation for the longer-running reorganization.

## Pair 1 — MIFARE Plus vs DESFire

**The two pages:**
- `/compare/mifare-plus-vs-desfire/` (family-level)
- `/compare/mifare-plus-ev2-vs-desfire-ev3/` (chip-generation-specific — see page 01 report)

**Overlap:** High. The family-level page and the chip-specific page both answer "should I pick Plus or DESFire". The chip-specific page answers it with the current-generation silicon (EV2 vs EV3), which is the only defensible answer in 2026 — the EV1 generations are end-of-life at NXP and EV0 is not in volume supply. The family-level page ends up carrying a subset of the same answer but with softer specificity and older references.

**Recommendation:** Keep `/compare/mifare-plus-ev2-vs-desfire-ev3/` as canonical. 301-redirect `/compare/mifare-plus-vs-desfire/` to it after the following merge work:

- **Absorb Plus SE notes.** The family-level page has a paragraph on MIFARE Plus SE (the entry-level variant below Plus EV2). The chip-specific page mentions Plus SE only in the resourceCards. Move the family-level SE paragraph into the chip-specific page's "When to choose Plus SE instead of Plus EV2" bullet.
- **Absorb DESFire Light notes.** Similarly, the family-level page has a paragraph on DESFire Light (the budget DESFire variant). Move this content into the chip-specific page's "When to choose DESFire Light instead of EV3" bullet.
- **After merge, 301** the family-level route to the chip-specific route. Add an inline redirect hint to any external inbound link that survived on documentation sites.

**Do not redirect until merge is done** — the family-level page currently carries Plus SE and DESFire Light variant content that the chip-specific page doesn't. Redirecting first loses that content.

## Pair 2 — PPS vs silicone laundry tags

**The two pages:**
- `/compare/pps-vs-silicone-laundry-tags/` (binary, two-way)
- `/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/` (three-way)

**Overlap:** High on the PPS and silicone halves. The three-way page adds textile-heatseal tags as the third option, which is the right framework for 2026 laundry procurement — healthcare / hospitality / industrial laundry operators are comparing all three attachment methods rather than just PPS-vs-silicone. The binary page has deeper content on the PPS-to-silicone attachment-method cost delta that isn't carried in the three-way page.

**Recommendation:** Keep `/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/` as canonical (three-way is the richer framework). 301-redirect `/compare/pps-vs-silicone-laundry-tags/` to it after:

- **Merge the attachment-method cost deltas.** The binary page has a worked cost section on sew-in vs heat-seal vs ultrasonic-weld attachment for silicone tags. Move this into the three-way page's "attachment method + durability" section, since it answers a real operator question.
- **Check the binary page's wash-cycle endurance data.** The binary page cites specific wash-cycle endurance figures (200 / 300 wash cycles for PPS vs silicone). Those figures exist on the three-way page already but are slightly different — reconcile before redirecting.
- **After merge, 301** the binary route to the three-way route.

## Pair 3 — RFID vs magnetic hotel card

**The two pages:**
- `/compare/rfid-vs-magnetic-hotel-key-cards/`
- `/compare/rfid-hotel-card-vs-magnetic-stripe/`

**Overlap:** Medium. Both pages answer "should a hotel pick RFID or magnetic stripe". But the reading / buying persona differs:

- `rfid-vs-magnetic-hotel-key-cards` is written for the **procurement / operator** persona: BOM costs, reader install cost, breakage / replacement economics, PCI / data-security for the mag-stripe side. Has pricing tables, a TCO section, and a vendor-list aside.
- `rfid-hotel-card-vs-magnetic-stripe` is written for the **executive / marketing** persona: guest experience, brand-perception, sustainability framing, the room-key-as-mobile-app future. No TCO table, no pricing; it is framed as a strategic-decision narrative.

**Recommendation:** Leave both pages in place. Do not redirect.

- The two pages serve different search intent and different buyer stages. A procurement manager searching "hotel key card cost comparison" lands on one; a GM / brand strategist searching "why are hotels switching to RFID keys" lands on the other. Redirecting would break one of the two intent paths.
- **Wire them together.** Add cross-links in both directions: the procurement page should cite the executive page for the strategic / brand framing, and the executive page should cite the procurement page for the TCO / BOM detail.
- **Watch for keyword cannibalization.** If Search Console data shows both pages competing for the same hotel-operator procurement queries, revisit and consolidate. Current content pattern suggests they'll rank for different query shapes, but verify with 90 days of Search Console data before deciding.

## Summary table

| Pair | Canonical | Action |
|---|---|---|
| MIFARE Plus vs DESFire | `mifare-plus-ev2-vs-desfire-ev3` | Merge Plus SE + DESFire Light content from family-level → 301 family-level to chip-specific |
| PPS / silicone laundry | `pps-vs-silicone-vs-textile-rfid-laundry-tags` | Merge attachment-method cost deltas from binary → 301 binary to three-way |
| Hotel RFID vs magnetic | — (leave both) | Wire with cross-links; monitor Search Console for cannibalization |

## Open items

- The merge-then-301 work on pairs 1 and 2 is not in scope for Batch 3 (which is refinement, not content-restructure). Needs its own dedicated editorial pass.
- Redirect map is not yet written. Recommend adding 301 rules to `astro.config.mjs` (or wherever the site currently handles redirects — confirm the framework's redirect convention) once the merges ship.
- Search Console monitoring for pair 3 is a 90-day-after-publish task; add to the editorial calendar rather than solving here.
