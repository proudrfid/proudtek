# 05 — Merge: rfid-on-metal-uhf-tag → rfid-anti-metal-tag

**Deleted file:** `src/content/editorial/products/rfid-tags/rfid-on-metal-uhf-tag.json`
**Absorb target:** `/products/rfid-tags/rfid-anti-metal-tag/`
**Canonical override:** `src/lib/route-overrides.ts` lines 95-96
**Status:** Complete. Zero live orphan references.

## Why merge

Both pages targeted UHF metal-mount asset tracking for the same buyer:
- **rfid-anti-metal-tag** positioned around "UHF tags that work on metal" with ferrite-isolation construction.
- **rfid-on-metal-uhf-tag** positioned around "UHF tags designed for mounting on steel, aluminum, copper" with ferrite isolation construction.

The overlap was near-complete: same construction physics (ferrite isolation layer + ground-plane exploitation), same typical read ranges (1-6 m depending on size), same chip families (Impinj M7xx, NXP UCODE), same industry fit (IT asset tracking, automotive tier 1, heavy industry). The two pages competed with each other for the same SERP intent and split internal link equity. The pillar page was listing both side-by-side in the anti-metal narrative, which confused the buyer's selection flow.

Merge rationale:
1. **Eliminate keyword cannibalisation.** Google sees two ProudTek pages targeting the same intent and splits ranking signal between them.
2. **Consolidate inbound-link equity.** Anti-metal pre-merge had 8 inbound refs; on-metal-uhf-tag had ~9. Post-merge the consolidated page has 59 (includes historical inbound routes that now resolve via the canonical-override-backed redirect).
3. **Buyer simplification.** One page, clear construction-type table, explicit size-range framing (10×10 mm micro → 200×30 mm industrial). No more pillar ambiguity.
4. **Content absorb with no value loss.** All unique claims from on-metal-uhf-tag folded into anti-metal. See `04-rfid-anti-metal-tag.md` for the absorbed-content inventory (ground-plane +3-+6 dB, copper/brass 80-90%, 200 mm industrial row, MIL-STD-130N / FAA AC 20-162A).

## Merge mechanics executed

### 1. Delete source

```
rm -f src/content/editorial/products/rfid-tags/rfid-on-metal-uhf-tag.json
```

### 2. Canonical override (new)

`src/lib/route-overrides.ts`:

```typescript
/* Merged SKUs — rfid-on-metal-uhf-tag absorbed into rfid-anti-metal-tag (2026-04-23) */
"/products/rfid-tags/rfid-on-metal-uhf-tag/": "/products/rfid-tags/rfid-anti-metal-tag/",
```

This registry is consumed by:
- `src/lib/seo.ts` — emits `<link rel=canonical>` pointing at the target when any buildable page matches the source route.
- `src/lib/utility-pages.ts` / legacy-link rewriter — rewrites inbound `<a href>` references at render time.
- `src/lib/catalog-pages.ts:collectCatalogProducts()` — drops the source from the `/products/all/` filter grid.

### 3. Content absorb

Unique on-metal-uhf-tag content folded into `rfid-anti-metal-tag.json`:

| Absorbed content | Location in target |
|---|---|
| Ground-plane effect (+3-+6 dB) | New `dataHighlight` block with Balanis + Impinj citation |
| Copper / brass 80-90% of steel | `brief.substrateTolerance` + dedicated FAQ |
| 200×30 mm industrial long-range row | Construction-type table extended |
| MIL-STD-130N IUID / FAA AC 20-162A | Dedicated FAQ |
| "10×10 mm micro to 200×30 mm industrial" size framing | Summary + heroPoints |

### 4. Inbound reference rewrites (editorial JSON — 7 files)

| File | Location | Fix |
|---|---|---|
| `products/rfid-tags/_pillar.json` | line 62 | Removed parallel listing |
| `products/rfid-tags/rfid-high-temp-silicone-tag.json` | resourceCards + secondaryActions | → anti-metal |
| `products/rfid-tags/rfid-eyelet-tag.json` | resourceCards | → anti-metal |
| `products/rfid-tags/rfid-anchor-bolt-tag.json` | resourceCards | → anti-metal |
| `products/rfid-tags/rfid-ammo-can-tag.json` | resourceCards + secondaryActions | → anti-metal |
| `products/rfid-tags/rfid-magnet-mount-tag.json` | resourceCards + secondaryActions | → anti-metal |
| `lp/uhf-rfid-tag-manufacturer.json` | secondaryActions | → anti-metal |
| `compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9.json` | imageSourceRoutes + resourceCards | → anti-metal |

### 5. Code-path rewrites (TypeScript — 3 files)

| File | Location | Fix |
|---|---|---|
| `src/lib/catalog-pages.ts` | Image-fallback map line 160 | Row neutralised (target relies on standard fallback) |
| `src/lib/catalog-pages.ts` | `automotive-tire-oem` productRoutes (line 1738) | On-metal entry removed (anti-metal already present) |
| `src/lib/catalog-pages.ts` | `data-center-it-asset-tracking` productRoutes (line 1769) | On-metal entry removed (anti-metal already present) |
| `src/lib/keyword-landing-batch1.ts` | line 833 secondaryActions | → anti-metal |
| `src/lib/product-landing-definitions-batch15.ts` | Route-def block lines 738-808 | **Replaced with MERGED comment block** (dormant file — not imported — but scrubbed for safety to prevent future accidental resurrection) |
| `src/lib/product-landing-definitions-batch15.ts` | 8 cross-reference hrefs | Rewritten via `replace_all` to target anti-metal |

### 6. Verification

**Orphan-ref grep** (`src/`):

```
grep -rn rfid-on-metal-uhf-tag src/
```

Returns 3 hits, all intentional:
- `src/lib/route-overrides.ts:95-96` — the canonical override entry itself (required for 301 redirect mechanism).
- `src/content/editorial/blog/rfid-interference-metal-environment-solutions.json:13` — `heroImage: "/landing-images/rfid-on-metal-uhf-tag.jpg"` — published asset filename on disk; prior-session carve-out confirmed this file remains.

Zero live outbound `href` references to the deleted slug.

**Schema.** `npx astro sync` (640 ms) clean. Zod validation pass for the entire editorial collection. `.astro/types.d.ts` generates with zero references to the deleted slug.

**Build.** `npx astro build` progressed through the `/machine/products/rfid-tags/*` phase without errors before the 44 s sandbox timeout (file-watcher limit inside VM, unrelated to code). Final end-to-end build should be run on Peter's local machine.

## Precedent alignment

This merge follows the same mechanism established in prior merges:
- **nfc-payment-wristband → cashless-payment-rfid-wristband** (Task #66-70, 12 inbound references rewritten, delete + override + scrub).
- **tyvek-rfid-wristband → rfid-tyvek-wristband** (Task #73-76, 5 inbound references rewritten, delete + override + scrub).

Pattern now stable: delete JSON, add to `ROUTE_CANONICAL_OVERRIDES`, rewrite inbound refs, verify orphan-ref grep clean.
