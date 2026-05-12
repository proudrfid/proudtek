# Stage 2 component SOP — building shadow `.astro` components with parity tests

**Status:** **Stage 2 + optimization + Stage 3.x rail-hub all complete.** 37 shadow components shipped. Every block in EditorialArticle is now a typed Astro component fed by `buildEditorialScaffold` — zero `<Fragment set:html>` delegations remain. End-to-end parity green against 5 production fixtures.
**Last reviewed:** 2026-05-12.
**Owner:** whoever picks up Stage 3 production cutover.

This is the operational playbook for building the remaining Stage 2 shadow components. Follow it mechanically — the first three components proved out every pattern below, so deviations are likely bugs, not improvements.

---

## What "shadow" means

The `.astro` component lives at `src/components/editorial/<Name>.astro`. It is **not used by any production route**. The production rendering still flows through `editorial-pages.ts` → `bodyHtml` string → `<Fragment set:html={...}>` in the page layout. The shadow component exists solely to be parity-tested against the inline template-literal expression in `editorial-pages.ts`.

When all 13 variants have green parity tests, Stage 3 cutover becomes safe: either `renderSection()` can internally delegate to `container.renderToString(<EditorialSection ... />)` (once Astro Container API reaches GA), or each page route can flip to `<EditorialArticle definition={...} />` behind a flag.

Until that cutover, the shadow components are dead code that exists to keep production safe.

---

## Toolchain setup

Already done in the first Stage 2 session — listed here so any future debug knows the moving parts:

- **`vitest.config.ts`** uses `getViteConfig` from `astro/config` instead of vitest's plain `defineConfig`. This makes `.astro` imports work inside `*.test.ts` files. Without this wrap, vitest's vite pipeline rejects `.astro` files as "invalid JS syntax."
- **`experimental_AstroContainer`** from `astro/container` renders an `.astro` component to a string. The API is `experimental_` in Astro 4-6 but stable enough for tests; production code must NOT depend on it.
- **`normalizeHtml()`** in `src/components/editorial/__tests__/_parity-helpers.ts` is the bridge between Astro and the TS template-literal renderers. It strips Astro dev attributes (`data-astro-source-file` etc.), collapses whitespace runs, and canonicalizes character entities (Astro emits numeric entities like `&#34;`; the TS side emits named entities like `&quot;`).

Apply `normalizeHtml()` to **both** sides of every parity comparison.

---

## Component anatomy — the Testimonial template

The smallest real component, used as the reference for every subsequent variant.

```astro
---
/**
 * Editorial section variant — testimonial quote block.
 *
 * Shadow component (Stage 2). Mirrors the inline expression in
 * editorial-pages.ts `const testimonialHtml = section.testimonial ? ... : ""`.
 *
 * Schema: src/lib/editorial-types.ts → EditorialSectionData["testimonial"]
 */
import { renderInlineLinks, type CitationCtx } from "../../lib/editorial-types";

interface Props {
  text: string;
  source: string;
  citations?: CitationCtx;
}

const { text, source, citations } = Astro.props;
const textHtml = renderInlineLinks(text, citations);
---
<figure class="codex-editorial-testimonial">
  <blockquote><p set:html={textHtml} /></blockquote>
  <figcaption>— {source}</figcaption>
</figure>
```

Five rules baked into the template:

1. **Frontmatter docblock** — pointer to the inline expression it replaces, pointer to the schema definition, and a one-line statement that this is shadow / not yet wired.
2. **Props interface** — derives from `EditorialSectionData["<variant>"]` shape plus an optional `citations?: CitationCtx`. Don't widen props or import the whole `EditorialSectionData`; pick out exactly the fields the variant uses.
3. **Plain-text fields** use `{expression}` — Astro's default auto-escape matches the TS side's `escapeHtml()`.
4. **Markdown-bearing text** (anything with `[label](url)` or `[^N]`) is pre-rendered via `renderInlineLinks(text, citations)` and inserted with `set:html={textHtml}`. Inlining the call inside the JSX expression `set:html={renderInlineLinks(text, citations)}` also works.
5. **No conditionals at the top level when the wrapper is optional.** If the inline TS expression renders nothing when input is absent (`section.x ? "..." : ""`), the corresponding `.astro` component should wrap the whole body in `{cond && (...)}` so the empty case emits an empty string too. See `StatBar.astro` for the array-empty pattern.

---

## Parity test anatomy — the Testimonial template

```ts
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Testimonial from "../Testimonial.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import {
  sectionWithVariant,
  minimalTestimonial,
  typicalCitations,
  noCitations,
} from "../../../lib/__tests__/fixtures/editorial";

// Pinpoint the variant fragment inside the full section HTML produced by
// __TEST__.renderSection. Match the outer element of the inline TS expression.
const FIGURE_RE = /<figure class="codex-editorial-testimonial">[\s\S]*?<\/figure>/;

function extractFragment(sectionHtml: string): string {
  const match = sectionHtml.match(FIGURE_RE);
  if (!match) throw new Error(`fragment not found:\n${sectionHtml}`);
  return match[0];
}

async function renderAstro(props: ...): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(Testimonial, { props });
}

describe("Testimonial.astro ↔ editorial-pages.ts parity", () => {
  it("minimal fixture, no citations", async () => {
    const section = sectionWithVariant("testimonial", minimalTestimonial);
    const tsFragment = extractFragment(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro({ ... });
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  // ... additional cases ...
});
```

Why through `__TEST__.renderSection` rather than the inline template-literal expression directly?

Because the inline expression isn't a named export; it's embedded in `renderSection`. Going through `renderSection` with a fixture where ONLY this variant's field is populated is the cleanest way to invoke the production code without a refactor. The fragment-extraction regex pulls out the variant's portion. The trade-off: the surrounding `<section>` shell is part of the full TS output but excluded from the comparison.

---

## Required test cases per component

At minimum, every parity test must cover:

1. **Minimal** — smallest valid input shape from `fixtures/editorial.ts`.
2. **Typical** — realistic production-shape fixture, ideally one that exercises every optional sub-field.
3. **HTML-significant chars** — at least one fixture with `&`, `<`, `>`, `"` in a text field. This is the case that surfaced the named-vs-numeric entity divergence; if a future variant exercises a new attribute, it'll need a matching guard here.

If the variant supports any of the below, add cases:

4. **Citations** — input with `[^N]` markers. Pass `typicalCitations` to both sides.
5. **Inline markdown link** — input with `[label](/url)`. Tests the `renderInlineLinks` integration in `set:html`.
6. **Empty / absent fields** — if the variant has an optional field whose presence changes output (e.g. `dataHighlight.source?`, `statBar.items.length === 0`), add a case for each branch.

Keep test cases tight. 3–5 cases per component is plenty.

---

## Variant-to-component mapping (remaining 10)

Sort by simplicity ascending; pick from the top when you're next in this file.

### Variant + section-level (Stage 2 sessions 1-2)

| # | Variant | Inline TS in editorial-pages.ts | Difficulty | Status |
|---|---------|--------------------------------:|:----------:|--------|
| 1 | testimonial | ~ line 2050 | easy | ✓ |
| 2 | dataHighlight | ~ 2030 | easy | ✓ |
| 3 | statBar | ~ 1965 | easy | ✓ |
| 4 | checklist | ~ 2060 | easy | ✓ |
| 5 | timeline | ~ 2035 | easy | ✓ |
| 6 | callout | ~ 1955 | easy | ✓ |
| 7 | image (`<figure>`) | ~ 1940 | easy | ✓ |
| 8 | comparePanel | ~ 1985 | medium | ✓ |
| 9 | featureGrid + FeatureIcon sub | ~ 2000 | medium | ✓ |
| 10 | table | ~ 1945 (via `renderTable`) | medium | ✓ |
| 11 | section body slots (Intro / Paragraphs / List) | ~ 1925 + `renderSectionList` | medium | ✓ |
| 12 | EditorialSection.astro (composer) | n/a | hard | ✓ — passes parity against all 24 variant fixtures |

### Page-level sub-renderers (Stage 2 session 3)

| # | Component | TS function | Difficulty | Status |
|---|-----------|-------------|:----------:|--------|
| 13 | TrustSignals | `renderTrustSignals` | trivial | ✓ |
| 14 | JumpNav | `renderJumpNav` | trivial | ✓ |
| 15 | ResourceCard | `renderResourceCard` | easy | ✓ |
| 16 | ResourceGrid | `renderResourceGrid` | easy | ✓ |
| 17 | Faq | `renderFaq` | easy | ✓ |
| 18 | Sources | `renderSources` | medium | ✓ |
| 19 | BriefField | `renderBriefField` | medium | ✓ |
| 20 | Brief | `renderBrief` | medium | ✓ |
| 21 | ActionBar | `renderActionBar` | medium | ✓ |
| 22 | DecisionSnapshot | `renderDecisionSnapshot` | medium | ✓ |
| 23 | Trail | `renderTrail` | medium | ✓ |
| 24 | EditorialHero | inline in `renderEditorialMain` (~line 1605) | hard | ✓ |

### Page-level composer (Stage 2 finale)

| # | Component | TS function | Difficulty | Status |
|---|-----------|-------------|:----------:|--------|
| 25 | EditorialArticle.astro | `renderEditorialMain` | hard | ✓ — passes parity against all 5 integration fixtures (lp/industries/compare/guides/blog) |

EditorialArticle composes all 24 components above plus uses `<Fragment set:html>` delegation for 4 "infrastructure" blocks, fed by a single new TS export `buildEditorialScaffold(definition)`:

- **Rail / hub blocks** (`renderHubRail`, `renderHubGrid`, `renderGroupedHubRail`, `renderResourcesCategoryHub`) — collection-dependent; stubbed empty in tests. The scaffold helper handles all branching and emits the right block per route.
- **Product grids** (`renderIndustryProductGrid` / `renderSolutionProductGrid` / `renderRelatedIndustriesGrid`) — route-specific, mostly empty in test environment but real on production industries/solutions pages.
- **Inline RFQ form** (`renderInlineRfqForm`) — long form generator, kept in TS because it's low Stage-3 value (it isn't visually variable; Stage 3 won't gain much from componentizing it).
- **Contact channels** (`renderContactChannels`) — only renders when `group === "contact"`; none of the 5 integration fixtures are contact pages, but the conditional is preserved.

This keeps the editorial-pages.ts public-API change minimal — just one new exported helper (`buildEditorialScaffold` + its `EditorialScaffold` interface), one new public export of `buildIntentHref`, one rename + export of `isBreadcrumbSectionRoot`, and `export` keywords added to `getPillarClusterId`, `PILLAR_CLUSTER_LABELS`, `buildDecisionSnapshotCards`.

### Stage 2 final state (2026-05-12)

| Metric | Pre-Stage 2 | Post-Stage 2 + optimization |
|--------|------------:|----------------------------:|
| `.astro` editorial components | 0 | **33** |
| Parity test files | 0 | 20 |
| Parity test cases | 0 | 126 |
| Total tests (incl. Stage 0/1/1.5 snapshots) | 77 | **203** |
| Snapshot drift across Stage 2 | n/a | **0** |
| editorial-pages.ts new public exports | 0 | 7 (scaffold + 6 helpers + 2 data-card types) |
| `set:html` delegations remaining in EditorialArticle | n/a | 2 (rail + hub-grid, both with inline `<script>`) |
| Normalize rules in _parity-helpers.ts | n/a | 7 (whitespace, Astro debug attrs, named-vs-numeric entities, apostrophe, void self-close, SVG empty self-close, pre-`>` whitespace, attribute-value `<`/`>` escape) |

### Stage 2 optimization pass — what closed

| # | Component | TS function | Status |
|---|-----------|-------------|--------|
| 26 | InlineRfqForm.astro | `renderInlineRfqForm` | ✓ |
| 27 | ContactChannels.astro | `renderContactChannels` | ✓ |
| 28 | RelatedIndustriesGrid.astro | `renderRelatedIndustriesGrid` (data via `buildRelatedIndustriesData`) | ✓ |
| 29 | IndustryProductGrid.astro | `renderIndustryProductGrid` (data via `buildIndustryProductGridData`) | ✓ |
| 30 | SolutionProductGrid.astro | `renderSolutionProductGrid` (data via `buildSolutionProductGridData`) | ✓ |

`buildEditorialScaffold` was restructured during the optimization pass to return **structured card data** (`EditorialRelatedIndustryCard[]`, `EditorialProductGridCard[]`) instead of pre-rendered HTML strings for the grid blocks. The new components consume the data directly, keeping path-3 components stateless renderers. Module-private data (`_editorialImageMap`, `_wpProductImageMap`, `_solutionsHubData`) stays private — the scaffold helper extracts the relevant data fields into the typed return shape.

### Stage 3.x — rail / hub composer pass

The four rail/hub renderers that previously stayed as `set:html` delegations have all been shadow-componentized:

| # | Component | TS function | Parity cases |
|---|-----------|-------------|--------------|
| 31 | HubRail.astro | `renderHubRail` | 5 |
| 32 | GroupedHubRail.astro | `renderGroupedHubRail` | 5 |
| 33 | HubGrid.astro | `renderHubGrid` | 6 |
| 34 | ResourcesCategoryHub.astro | `renderResourcesCategoryHub` | 4 |

Shared script: `_railDrawerScript.ts` exports a single `RAIL_DRAWER_SCRIPT` string — the open/close handler IIFE used by both rail variants. Emitted via `<script is:inline set:html={RAIL_DRAWER_SCRIPT}>` so Astro doesn't process the script body and the byte output matches the TS template literal.

`buildEditorialScaffold` was further restructured: `railHtml` / `hubGridHtml` strings replaced with discriminated descriptors:

```ts
rail: { kind: "flat", items, currentRoute, sectionLabel }
    | { kind: "grouped", groups, currentRoute, sectionLabel }
    | null

hubGrid: { kind: "flat", items, sectionLabel }
       | { kind: "resourcesCategory", groups, sectionLabel }
       | null
```

EditorialArticle dispatches on `rail.kind` and `hubGrid.kind`. The TS rail/hub renderers (`renderHubRail`, etc.) stay in editorial-pages.ts for the legacy `renderEditorialMain` path; Stage 3 production cutover removes them.

### Stage 0 → Stage 3.x final state (2026-05-12)

| Metric | Pre-Stage 2 | Post-Stage 3.x |
|--------|------------:|---------------:|
| `.astro` editorial components | 0 | **37** |
| Parity test files | 0 | 22 |
| Parity test cases | 0 | 146 |
| Total tests (incl. snapshots) | 77 | **223** |
| Snapshot drift across Stage 0-3.x | n/a | **0** |
| editorial-pages.ts new public exports | 0 | 9 (scaffold + 5 helpers + 3 data-card / descriptor types + 2 hub types) |
| `set:html` delegations in EditorialArticle | n/a | **0** |
| Normalize rules in _parity-helpers.ts | n/a | 7 |

Stage 3 cutover is now an engineering execution problem with zero "is the rewrite correct" risk hanging over it.

---

## When parity diffs, the diagnostic ladder

If `expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment))` fails, walk this ladder in order:

1. **Read the diff carefully.** Vitest's diff highlighter usually puts the divergent chars first; the first difference is almost always the root cause.
2. **Whitespace?** If only whitespace differs, your normalize step is incomplete. Add a rule to `_parity-helpers.ts` — but only if both forms render identically to the browser. Don't paper over real diffs.
3. **Entity form?** If `&quot;` vs `&#34;` shows up, `canonicalizeEntities()` should have caught it — make sure the parity-helpers file is imported.
4. **Attribute ordering?** Astro emits attributes in source order; the TS template-literal emits them in template order. If they differ, fix the `.astro` file's attribute order to match the TS.
5. **Self-closing tags?** Astro auto-closes void elements (`<img />`); the TS side uses explicit close form sometimes. Check for `<img>` vs `<img />`.
6. **Real divergence?** If the diff is structural (an attribute, a wrapper element, an inner text), the `.astro` implementation has a real bug. Fix the component, not the test.

A real divergence in production behavior would be **a discovery** like BUG-1 / BUG-2. Treat it that way: add a new BUG-N row in `docs/architecture/editorial-rendering-debt.md`, decide explicitly which side is correct, update snapshots and parity tests together with `-u` and explicit review.

---

## When you're done with all 13

1. All parity tests green at variant level (1–8 in the table above).
2. EditorialSection.astro (#9) passes parity against `renderSection` for every fixture in `editorial-pages-variants.snapshot.test.ts`.
3. EditorialArticle.astro (#10) passes parity against `renderEditorialMain` for every fixture in `editorial-pages-integration.snapshot.test.ts`.

At that point the system has two byte-equivalent implementations of the same contract. Stage 3 cutover proposals (Container-API-internal vs per-route-flag) become evaluable on their own merits without any "but is the rewrite correct" risk hanging over the decision.
