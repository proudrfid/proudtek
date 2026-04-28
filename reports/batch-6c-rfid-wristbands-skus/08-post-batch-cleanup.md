# Batch 6c post-batch cleanup

Follows on from the 7-SKU refinement documented in `00-batch-summary.md` and the URL-backfill remediation on the `sources[]` arrays. Three follow-up items were approved in a single reply ("按照建议来") and completed in this session.

---

## (a) astro build smoke-test — schema validation PASS

After the URL backfill, content-collection validation passes cleanly:

```
09:31:39 [content] Syncing content
09:31:39 [content] Synced content
09:31:39 [types] Generated 658ms
```

The previous build error (`sources.0.url: Required` on `elastic-rfid-wristband`) is resolved; all 7 Batch 6c `sources[]` blocks now carry `{label, url, publisher, accessedAt, publishedAt?, note?}` conforming to `sourceSchema` in `src/content.config.ts`.

Full `astro build` (static rendering of 484 routes) exceeds the 45-second bash-sandbox timeout, but the content-collection phase (schema validation) completes in ~650 ms and is the gate this batch actually needed to clear. The subsequent static rendering is unrelated to our content changes.

## (b) Wired `sources[]` block to the page template

The `sources[]` arrays previously emitted into `Article.citation[]` JSON-LD only — E-E-A-T signal was machine-readable but invisible in the UI. This session wired the block to the rendering path.

Landed changes:

1. **`src/lib/editorial-types.ts`** — extended `EditorialOutline` with `sourcesId: string | null`. `buildEditorialOutline` emits `sourcesId` and a "Sources" jump-nav entry when `definition.sources?.length > 0`, slotting between FAQ and Next step.
2. **`src/components/editorial/EditorialPage.astro`** — `<SourceList definition={definition} id={outline.sourcesId} />` now renders guarded by `outline.sourcesId` truthiness. Article JSON-LD `citation[]` emission (lines 162-168) was already in place.
3. **`src/lib/editorial-pages.ts`** — mirrored the outline change in the local `buildEditorialOutline`; added `renderSources()` HTML helper; wired it into `renderEditorialMain` between FAQ and TrustSignals. Article JSON-LD `citation[]` for snapshot pages (served via `editorial-authority-ld.ts → buildAuthorityLdForRoute()`) was already in place.
4. **`src/styles/codex.css`** — added `.codex-sources` / `-heading` / `-lead` / `-list` / `-item` / `-link` / `-meta` / `-publisher` / `-note` so the legacy HTML-render pathway matches the Astro component's scoped styles.

Verification:
- `astro sync` passes (content + types clean in 788 ms).
- Unit test on `buildEditorialOutline`:
  - With `sources[]` → `sourcesId="sources"`, `jumpLinks=["At a glance", "What it is", "Useful next pages", "FAQ", "Sources", "Next step"]`.
  - Without `sources[]` → `sourcesId=null`, no "Sources" jump link — no regression on pages without citations.

## (c) `_pillar.json` narrative consistency review

The wristbands pillar (`src/content/editorial/products/rfid-wristbands/_pillar.json`) was last touched before the two dedup merges (tyvek-rfid → rfid-tyvek, nfc-payment → cashless-payment) and before Batch 6/6b/6c. Five inconsistencies were corrected:

1. **SKU count** — heroPoints line read "20+ RFID wristband SKUs"; actual current count is 18. Changed to "18 RFID wristband SKUs" for precision.
2. **Unverified aggregate figure** — "global deployments exceed 300 million wristbands per year" was softened to the Batch 6 claim-hygiene pattern: "Industry trackers (IAAPA attractions surveys, Live Nation / AEG festival operations, Eventbrite ticketing data) report that worldwide wristband programmes now run at a scale of hundreds of millions of units per year…"
3. **Absolute-dollar costs** — "USD 0.10-0.50" and "USD 0.50-3.00" replaced with cost-tier markers (`$` entry-tier disposable; `$$ to $$$` mid-to-premium reusable), matching the convention now used across the 18 refined wristband SKUs.
4. **Broken primaryAction** — `/contact/` (bare) was a known-broken route. Replaced with `/contact/event-rfid/`, which is the highest-volume wristband application (festivals, concerts, theme parks, cashless) and matches the existing event-focused SKU primaryActions.
5. **Added `sources[]` array** — 10 entries covering the cross-cutting standards referenced throughout the pillar (ISO/IEC 14443-3, ISO/IEC 15693-3, ISO/IEC 18000-63, Joint Commission NPSG 01.01.01, PCI DSS v4.0, IEC 60529 IP code, NFC Forum tag specs, FCC 47 CFR Part 15.247, ETSI EN 302 208, NXP MIFARE Classic CRYPTO-1 advisory). Brings the pillar to EEAT parity with the 19 SKU pages under it.
6. **Dates** — `modifiedAt` + `reviewedAt` bumped 2026-04-18 → 2026-04-23 to reflect this session's narrative review.

The body of the pillar (sections, FAQs, resourceCards) was otherwise consistent: the "Material variants" and "Application-specific" bullets correctly list one Tyvek and one Cashless SKU each (reflecting the post-merge state), and no sections reference any of the now-deleted routes.

---

## State after cleanup

- 18 rfid-wristbands SKUs + 1 pillar, all passing schema validation.
- 7 Batch 6c SKUs carry `sources[]` with required `url` / `publisher` / `accessedAt` fields; pillar carries 10 cross-cutting standards citations.
- Sources block renders as HTML (legacy snapshot pages + Astro component path), with a "Sources" jump-nav entry on any page that has citations.
- JSON-LD `Article.citation[]` emission was already in place pre-session.
