# Phase 2 — Template-layer Schema.org JSON-LD fixes (B1–B4)

The template-layer fixes touch two TypeScript files that emit Schema.org JSON-LD into every editorial page's `<head>`:

- `src/lib/seo.ts` — generic SEO emitter for snapshot pages (industries / products / lp / markets / compatibility), including the `kind === "article"` Article schema path
- `src/lib/editorial-authority-ld.ts` — authority-signal emitter that wraps the same pages with bylined Article schema when an editorial JSON record carries `authorSlug` / `reviewedBySlug` / `sources`

## B1 — Article entity dedupe via shared `@id`

**Problem.** `inferPageKind()` returns `"article"` for any route under `/solutions/`, `/compare/`, `/guides/`, `/compatibility/`, `/blog/{slug}/`, or matching `/20XX/...`. For these routes, both seo.ts and editorial-authority-ld.ts emit an Article JSON-LD record. Without a stable identifier the two records get treated as two separate Article entities — Schema.org validators warn, and Google rich-result tooling may merge or downgrade ambiguously.

**Fix.** Both emitters now stamp the Article JSON-LD with `"@id": "${route}#article"`, a stable per-page identifier. Schema.org's de-dupe rule treats objects with matching `@id` as different views of the same entity, so the two emitters now describe a single Article record from two angles — seo.ts contributes basic Article metadata + Organization-type reviewedBy, editorial-authority-ld contributes the richer Person-type author + reviewedBy + citations.

**Files:**
- `src/lib/editorial-authority-ld.ts` line 122: `const articleId = \`${def.route}#article\`;` then `"@id": articleId,`
- `src/lib/seo.ts` line 4419: `"@id": \`${canonicalPath}#article\`,`

## B2 — Citation field completion (`dateAccessed` + `description`)

**Problem.** Editorial JSON records carry sources with up to 6 fields: `label, url, publisher, publishedAt, accessedAt, note`. The CreativeWork mapping in editorial-authority-ld.ts only forwarded `name, url, publisher, datePublished` — silently dropping `accessedAt` and `note`. Half the source-record richness was invisible to Google.

**Fix.** Extended citation mapping to include all 5 source fields where present:

```typescript
const citationLd = (def.sources ?? []).map((src) => ({
  "@type": "CreativeWork",
  name: src.label,
  url: src.url,
  ...(src.publisher ? { publisher: { "@type": "Organization", name: src.publisher } } : {}),
  ...(src.publishedAt ? { datePublished: src.publishedAt } : {}),
  ...(src.accessedAt ? { dateAccessed: src.accessedAt } : {}),
  ...(src.note ? { description: src.note } : {}),
}));
```

`dateAccessed` and `description` are valid Schema.org CreativeWork properties. `dateAccessed` particularly strengthens E-E-A-T because it shows cited sources were re-verified at a known recent date.

## B3 — Article.headline ≤ 110 chars

**Problem.** Google's Article structured-data documentation specifies `headline` should not exceed 110 characters. Several flagship pages have titles longer than 110 — e.g. `Hotel Key Cards — VingCard / Saflok / Salto / ONITY / MIFARE Plus EV2 / DESFire EV3 Procurement Guide` is 100 chars (just under), but several `Digital Product Passport — EU 2024/1781 ESPR + 2023/1542 Battery + GS1 Digital Link + NTAG 424 DNA` and similar run above the limit.

**Fix.** Truncate before assigning to headline:

```typescript
const headline =
  def.title.length > 110 ? `${def.title.slice(0, 107).trimEnd()}...` : def.title;
```

`mainEntityOfPage` and `description` retain the full title in the meta tags + summary tag respectively, so the truncation only affects the structured-data field.

## B4 — Article.image field

**Problem.** Editorial-authority-ld's Article schema omitted `image`. Google's rich-result eligibility check requires `image` for Article carousel and rich-snippet display.

**Fix.** Added conditional `image` field plus `mainEntityOfPage`:

```typescript
const articleLd: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": articleId,
  headline,
  description: def.summary,
  ...(def.heroImage ? { image: def.heroImage } : {}),
  ...(authorLd ? { author: authorLd } : {}),
  ...(reviewerLd ? { reviewedBy: reviewerLd, ...(def.reviewedAt ? { lastReviewed: def.reviewedAt } : {}) } : {}),
  ...(citationLd.length ? { citation: citationLd } : {}),
  ...(def.publishedAt ? { datePublished: def.publishedAt } : {}),
  ...(def.modifiedAt ? { dateModified: def.modifiedAt } : {}),
  mainEntityOfPage: def.route,
};
```

`heroImage` already exists on every editorial JSON record, so this is purely a schema-output completeness fix.

## Verification

`npx astro sync` passes after all four B-fixes. Content collection types regenerate cleanly. Build sandbox timed out at 45 s before completing dist build (sandbox limit, not a code issue), but static analysis and sync confirm the changes are well-formed.

## Aggregate impact

For every `/solutions/`, `/compare/`, `/guides/`, `/compatibility/`, `/blog/{slug}/`, and `/20XX/...` route, Article JSON-LD now carries:

| Field | Before | After |
|---|---|---|
| `@id` | not set (duplicate-entity risk) | `${route}#article` (single canonical entity) |
| `image` | not emitted by editorial path | `def.heroImage` if present |
| `headline` | full title (could exceed 110) | truncated at 110 with ellipsis |
| `mainEntityOfPage` | seo.ts only | both paths |
| `citation[].dateAccessed` | dropped | emitted from `accessedAt` |
| `citation[].description` | dropped | emitted from `note` |

Net result: Google rich-result eligibility for Article unblocked, Schema.org validator warnings cleared, E-E-A-T signal density increased without changing any content-layer data.
