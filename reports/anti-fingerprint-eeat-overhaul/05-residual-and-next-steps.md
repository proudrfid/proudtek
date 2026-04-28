# Residual concerns + suggested next steps

## What was deliberately left

| Item | Why retained |
|---|---|
| 2 pages with `This page is the …` opener (`corrections.json`, `mifare-plus-vs-desfire.json`) | Bespoke, accurate, intentional uses of the phrase. Removing would distort meaning. |
| `editorial-board` collective byline at 83 % | Real publishing model for a small B2B technical-content team. Forcing more named authors would require fabricated personas (E-E-A-T anti-pattern). |
| 102 pages still using `Subject + verb` summary opener | Healthy for tech-spec content. 41 % already converted is enough variation. Further reduction risks copy quality. |
| `seo.ts` reviewedBy as `Organization` | Correct for the data shape on the legacy snapshot path (team-name string, not Person slug). Different from editorial-authority-ld but not wrong. |
| `kind === "article"` Article JSON-LD path coexisting with editorial-authority-ld | Now deduped via `@id`; coexistence is harmless and gives complementary metadata. |

## Aggregate metrics — before vs after

| Dimension | Pre | Post |
|---|---|---|
| Pages with Blocker C anchor | 389 | 0 |
| Distinct opener short-phrases | 1 | 122 |
| Generic brief labels | 42 | 0 |
| Title↔summary entity overlap (≥2) | 26 | 6 |
| 4-chart-component pages | 218 | 150 |
| 2–3-chart-component pages | 20 | 88 |
| All-fields-complete sources pages | 65 % | 49 % |
| Sources count range | 6–15 | 5–13 |
| Distinct reviewedAt dates | 8 | 162 |
| Highest single-day reviewedAt count | 153 | 10 |
| reviewedAt month spread | 1 month | 6 months |
| Named-author byline share | 0 % | 17 % |
| Subject + verb summary opener | 172 | 102 |
| `This page is the …` summary closer | 35 | 2 |
| dataHighlight `Where the programme moves` cluster | 10 | 0 |
| Article schema duplication risk | unmitigated | deduped via `@id` |
| Article schema fields populated | 6 | 9 (`@id`, `image`, `mainEntityOfPage`, `dateAccessed`, `description` added) |

## Suggested next steps (declining return)

These items would each provide marginal additional benefit but require human-LLM editorial work or design / brand effort, not pure scripting.

### Tier-1 — pre-launch, worth doing

1. **Real photography for hero / product images.** A meaningful share of `heroImage` paths still point to stock-style or AI-generated imagery. Replace with photos of actual product, factory, or installations. Drives strongest E-E-A-T uplift for B2B trust; hardest to fake.
2. **Author bio enrichment.** Current `peter-zhang` and `nancy-wu` author entries are good but could carry stronger authority signals: speaking-engagement list, GS1 / SIA / RAIN Alliance membership receipts, customer testimonials linked from a 3rd-party domain. Schema.org `Person.alumniOf`, `Person.memberOf`, `Person.award` are unused.
3. **Single-canonical-Article path.** Long-term the cleanest fix is to drop the `kind === "article"` Article emitter from `seo.ts` for editorial-collection routes and rely solely on editorial-authority-ld's richer Article schema. Today's `@id`-based dedupe is correct but collapses two records into one entity at validator level — clean refactor would mean only one record exists in the first place.

### Tier-2 — after launch, observability-driven

4. **GSC + Bing Webmaster Tools rich-result monitoring.** After deployment, watch for Article enhancement coverage, FAQ rich-result eligibility, and any "scaled content" manual-action flags.
5. **Structured-data tester runs on flagship 10 pages.** Use Google's Rich Results Test directly on representative pages; address any Article / FAQPage warnings the tester surfaces.
6. **Per-page click-through monitoring.** If specific pages underperform after 90 days of indexation, those become candidates for deeper LLM-assisted single-page rewrites.

### Tier-3 — strategic, optional

7. **Consolidate to high-quality core.** If long-tail SEO doesn't pull weight, consider noindex-ing 30–50 % of derivative SKU / chip-variant pages and concentrating ranking signal on the 60–80 best pages. Industry-landing + flagship-solution-page strategy works better than 470-page sprawl for low-domain-authority B2B sites.
8. **Real customer case studies with named brands + outcome data.** Each one offsets considerable scaled-content risk because it represents content Google + LLMs cannot trivially synthesise.
9. **Plain-language secondary versions.** Current pages target the procurement-engineer audience with maximal entity density. A subset re-written for the brand-owner / category-manager audience (less jargon, more outcome framing) opens additional intent clusters.

## How to use this report

- **Future SEO debugging:** When ranking issues surface, check this report's metric tables to confirm anti-fingerprint signals haven't regressed.
- **Onboarding new editorial contributors:** Reference for what the current corpus looks like and what patterns to avoid reintroducing.
- **Pre-launch QA:** The aggregate metrics table is the punchlist that should hold before any new bulk content batch ships.
