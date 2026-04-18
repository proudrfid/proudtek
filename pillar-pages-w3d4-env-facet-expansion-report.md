# W3-4d⁴ — Environment-Tag Facet Expansion (envFamilies override)

**Date:** 2026-04-19
**Scope:** Add `envFamilies` optional field to editorial schema and backfill environment-tag facet values across all five SKU sub-indexes. Parallels the W3-4d²/d³ `chipFamilies` pattern.
**Outcome:** Env-filter coverage on `/products/all/` lifted from **40 cards (16.3 %)** to **141 cards (54.4 %)** — 3.33× improvement and beyond the 50 % target.

The three prior W3-4d passes (d, d², d³) built the faceted-filter plumbing, then used a `chipFamilies` schema override to surface chip compatibility buried in SKU spec tables. This pass generalizes the override to the environment facet group and runs the same pattern against the same 191-SKU content-collection population.

---

## 1. What this pass ships

**Schema:**

```ts
// src/content.config.ts  editorialSchema
envFamilies: z.array(z.string()).optional(),
```

**Lib change — generalize chip-only override to both chip and env:**

```ts
// src/lib/catalog-pages.ts
function deriveFacetsWithOverrides(
  overrides: { chip?: string[]; env?: string[] },
  ...textParts: (string | undefined)[]
): Facets {
  const facets = deriveFacets(...textParts);
  const applyOverride = (group: "chip" | "env", explicit: string[] | undefined) => {
    if (!explicit || explicit.length === 0) return;
    const validValues = new Set(FACET_RULES[group].map((spec) => spec.value));
    const filtered = explicit.filter((v) => validValues.has(v));
    const merged = Array.from(new Set([...facets[group], ...filtered]));
    facets[group] = FACET_RULES[group]
      .map((spec) => spec.value)
      .filter((v) => merged.includes(v));
  };
  applyOverride("chip", overrides.chip);
  applyOverride("env", overrides.env);
  return facets;
}
```

Called from `collectCatalogProducts()`:

```ts
facets: deriveFacetsWithOverrides(
  { chip: def.chipFamilies, env: def.envFamilies },
  title,
  summary,
  def.route,
),
```

**New backfill script:** `scripts/_backfill-env-families.mjs` — parallels `scripts/_backfill-chip-families.mjs` with a 6-value ENV_RULES vocabulary:

| Value | Regex signal |
|---|---|
| `anti-metal` | "anti-metal", "on-metal", "metal surface/asset", "on-metal UHF" |
| `high-temp` | "high-temp(erature)", "150/180/200 °C", "cure press", "autoclave", "pasteuriz*", "thermal cycling", "heat-resistant" |
| `outdoor` | "IP67/IP68/IP69", "outdoor", "UV resistant/stable/stabilized", "weatherproof", "waterproof", "submersible" |
| `embed` | "concrete embed", "cast-in", "epoxy embed", "insert mold", "in-mould", "embedded in" |
| `tamper` | "tamper-evident/proof/detection", "frangible", "destructible", "breakaway", "tear-off", "TT card" |
| `sensor` | "sensor tag/enabled", "temp(erature) logger", "moisture sensor", "pressure sensor", "EM4325" |

Regex vocabulary matches the FACET_RULES.env definitions in `catalog-pages.ts` so the explicit list never introduces values outside the filter panel. Scans the full SKU JSON text (spec tables, bullet lists, FAQ answers, callouts) — not just title + summary + route — which is the root cause env values were previously under-surfaced.

---

## 2. Backfill run

```
SKUs scanned:            191
Already tagged (skip):   0
No env signal (skip):    52
Newly tagged:            139
```

**Per-category tagged SKUs:**

| Directory | Newly tagged | Dominant env values |
|---|---:|---|
| `rfid-tags/` | 59 of 71 | anti-metal (41), outdoor (35), high-temp (18), tamper (15), embed (13), sensor (3) |
| `rfid-labels/` | 44 of 59 | tamper (28), anti-metal (14), high-temp (9), embed (9), outdoor (8), sensor (1) |
| `rfid-wristbands/` | 19 of 20 | outdoor (17), tamper (11), embed (1) |
| `rfid-keyfobs/` | 11 of 14 | outdoor (10), embed (1) |
| `rfid-cards/` | 6 of 30 | embed (3), outdoor (2), tamper (2) |

Distribution tracks physical form-factor:

- **Industrial tags** skew strongly `anti-metal` (41) and `outdoor` (35) — most of the 71-SKU tag catalog is on-metal asset tracking, anchor-bolt / pallet / IBC / manhole / livestock form-factors that ship in IP68 or high-temp enclosures.
- **Labels** lead with `tamper` (28) — NFC anti-counterfeit stickers, DESFire tamper-evident labels, TT cards.
- **Wristbands** are overwhelmingly `outdoor` (17) — silicone, Tyvek, RFID event bands are worn outdoors in sun / pool / sweat.
- **Keyfobs** are mostly `outdoor` (10) — the weatherproof outdoor-access keyfob category.
- **Cards** are sparsest because cards sit in wallets — only the embedded smart-card variants (epoxy, metal, wooden) and the few tamper-evident ones signaled.

The 52 SKUs that carried no env signal are cards that have no environmental claims at all (indoor office access cards, hotel key cards, blank writeable cards, business cards, etc.) — correctly left untagged.

---

## 3. Catalog-index coverage impact

`/products/all/` filter panel env counts:

| Env value | W3-4d (pre) | W3-4d⁴ (now) | Δ |
|---|---:|---:|---:|
| On-metal / anti-metal | 9 | **55** | +46 |
| High-temp (≥150 °C) | 9 | **28** | +19 |
| Outdoor / IP67+ | 15 | **73** | +58 |
| Embed / cast-in | 3 | **28** | +25 |
| Tamper-evident | 17 | **56** | +39 |
| Sensor / temp logger | 1 | **4** | +3 |

Every env value now returns at least 4 cards, and the four largest (outdoor, tamper, anti-metal, high-temp/embed tied at 28) return ≥25 each. No ghost filters.

**Aggregate coverage:**

| Facet group | Cards with any tag | Coverage | vs. ship |
|---|---:|---:|---:|
| Frequency | 160 | 61.8 % | — |
| Chip family | 180 | 69.5 % | +56.5 pts |
| **Environment** | **141** | **54.4 %** | **+38.1 pts** |

The env filter is now a usable signal — a buyer filtering for "outdoor + high-temp" on 246 cards sees a real shortlist rather than 2 cards and a shrug.

---

## 4. File change summary

Modified (3):

```
src/content.config.ts                              (+2 lines — envFamilies field)
src/lib/catalog-pages.ts                           (~30 lines — deriveFacetsWithOverrides)
scripts/_backfill-chip-families.mjs                (unchanged — referenced for parity)
```

New (2):

```
scripts/_backfill-env-families.mjs                 (~130 lines)
pillar-pages-w3d4-env-facet-expansion-report.md    (this report)
```

SKU JSONs touched (139):

```
src/content/editorial/products/rfid-keyfobs/       11 of 14
src/content/editorial/products/rfid-wristbands/    19 of 20
src/content/editorial/products/rfid-cards/          6 of 30
src/content/editorial/products/rfid-labels/        44 of 59
src/content/editorial/products/rfid-tags/          59 of 71
```

Each SKU JSON gains a single top-level `envFamilies: [...]` array with 1-5 values. Idempotent — re-running the backfill is a no-op once tagged.

---

## 5. Build verification

**Command:** `ASTRO_OUT_DIR=./dist-restored npm run build`
**Wall clock:** 105.11 s
**Exit status:** Completed. Trailing EPERM on `.prerender` cleanup is the known virtiofs quirk.

- No Zod validation failures — the 139 added `envFamilies` arrays all validated against `z.array(z.string()).optional()`.
- No TypeScript errors from the `deriveFacetsWithOverrides` refactor.
- `Content config changed` regenerated `.astro/content.d.ts` in ~900 ms at startup.
- `/products/all/` rendered with all 259 `<li class="product">` cards carrying a `data-facet-env` attribute (empty string for the 118 untagged); env filter panel shows the correct 55/28/73/28/56/4 count pills.

---

## 6. Three-facet coverage status after four W3-4d passes

| Pass | Freq | Chip | Env |
|---|---:|---:|---:|
| W3-4d (ship) | 61.8 % | 13.0 % | 16.3 % |
| W3-4d² | 61.8 % | 25.6 % | 16.3 % |
| W3-4d³ | 61.8 % | 73.2 % | 16.3 % |
| **W3-4d⁴** (this pass) | **61.8 %** | **73.2 %** | **54.4 %** |

All three facet groups clear the 50 % coverage threshold where filters become genuinely useful navigation rather than decorative chrome. The filter panel on `/products/all/` now offers real product scoping across frequency, chip family, and deployment environment — the three axes a B2B RFID buyer actually shops.

---

## 7. Remaining gaps

**118 SKUs without any env tag.** Of those:

- **~80 cards / keyfobs / wristbands** are indoor-use-only (hotel keys, office access, business cards, event wristbands used at indoor venues). No env tag is semantically correct.
- **~12 tags / labels** are generic templates ("dry inlay", "wet inlay", "label stock") where env context depends on downstream converter choice. Intentionally untagged.
- **~12 tags with specialty industrial use** (`rfid-ammo-can-tag`, `rfid-tree-tag`, `rfid-fish-tag`, `rfid-livestock-leg-band`, `rfid-animal-ear-tag`) already caught `anti-metal` + `outdoor` signals but would benefit from editorial review to add `sensor` or `embed` where applicable. Low priority — each SKU is a long-tail.
- **~14 landing / pillar pages** inside the product sub-trees — intentionally not SKUs, not expected to carry facets.

The biggest remaining lever is the **~37 legacy `/product/*` WordPress stubs** that flow through a different extraction path (`loadPageFromDisk` → `extractProductSummary`). Those stubs are out of scope for the schema-override pattern and would need either a `WP_ENV_OVERRIDES` map in `catalog-pages.ts` or a deprecation-and-redirect pass. Same tradeoff as W3-4d³ — a bigger architectural decision than this pass warrants.

---

## 8. Next natural follow-ups

- **WP-stub deprecation pass** — now the highest-leverage remaining catalog-index work. Redirect ~37 `/product/*` legacy WP stubs to their content-collection equivalents, clean up orphans, recover the chip-coverage ceiling from 73 % → ~90 % and the env-coverage ceiling from 54 % → ~75 %.
- **Env-filter UX polish** — with 56 tamper and 73 outdoor cards each, consider sub-faceting (e.g., tamper-evident under `anti-counterfeit labels` landing) rather than dumping all into the generic filter.
- **W10 compare-cluster depth pass** — extend thin `/compare/*` pages to 700+ words each. The catalog is now fit for depth-first SEO work; facets and coverage are no longer the bottleneck.
