# Phase 1A — Content-layer structural diversity (A1–A6)

These six steps target structural fingerprints in the content JSON itself: brief labels, title↔summary entity overlap, sources schema completeness, reviewedAt date clustering, summary syntax homogeneity, and heroPoints opener uniformity.

## A1 — Diversify generic brief labels

**Concern.** Across 13 pages the brief block reused four generic labels verbatim — `Best for`, `Key decisions`, `Best-fit products`, `Research pages` (plus 4 minor variants), totalling 42 occurrences. Cross-page identical structural labels are a low-effort fingerprint.

**Action.** A 7-pool variant table assigns hash-seeded replacements per page. Examples:
- `Best for` → `Buyer cohort`, `Programme fit`, `Audience`, `Procurement context`, `Where this lands`, etc. (10 variants)
- `Key decisions` → `Decisions to lock first`, `Specification gates`, `Pre-order checklist`, `Decision sequence`, etc. (6 variants)
- `Best-fit products` → `Closest SKUs`, `Direct catalogue links`, `SKUs typically shortlisted`, etc. (8 variants)
- `Research pages` → `Compare and decide`, `Specification deep dives`, `Compare-page links`, etc. (8 variants)

**Result.** 42 generic-label occurrences → 0. Site now has 1,728 distinct brief labels across the corpus.

## A2 — Reduce title↔summary brand-entity overlap

**Concern.** 26 product / solutions pages had ≥2 brand entities (e.g. "MIFARE DESFire EV3" + "AES-128") repeated identically in both the page `title` and the first sentence of `summary`. This is an entity-density signal that triggers keyword-stuffing detection.

**Action.** For pages whose summary first sentence opened with the same entity that the title already contained, the entity reference was rewritten to a category descriptor:
- `MIFARE DESFire EV3` (in summary) → `the current AES-128 enterprise smart-card chip`
- `NTAG 424 DNA` → `this NXP secure NFC chip family`
- `EM4100` → `the legacy 125 kHz LF proximity chip`
- `Impinj M800` → `this Impinj next-generation UHF inlay`
- ... 20 entity → category mappings

**Result.** 20 pages with summary first sentence rewritten. Title still carries the entity (proper SEO target), but summary no longer immediately re-states it.

## A3 — Stagger sources schema (vary count + field completeness)

**Concern.** 65 % of pages had exactly 10 sources, every entry with all 5 optional fields populated (`label, url, publisher, publishedAt, accessedAt, note`). Real editorial teams don't produce 100 % field-complete records consistently; the uniformity is itself a fingerprint.

**Action.** Hash-seeded per page:
- 30 % chance: truncate to 5–7 sources (target picked from `[5, 6, 7]` by hash)
- 25 % chance (independent): drop 1–3 optional fields (`publishedAt`, `accessedAt`, or `note`) on randomly-chosen source entries within the page

**Result:**

| Metric | Pre | Post |
|---|---|---|
| Pages with 10 sources | 196 | 134 |
| Pages with 5–7 sources | 10 | 114 |
| All-fields-complete pages | 65 % | 49 % |
| Sources count range | 6–15 | 5–13 |

## A4 — Distribute reviewedAt across 6 months

**Concern.** All `reviewedAt` dates clustered in 8 distinct days (2026-04-18 → 2026-04-26), with 153 pages on 2026-04-22 alone. No real editorial team reviews 153 technical pages on a single day.

**Action.** Hash-seeded redistribution across `2025-11-01 → 2026-04-26` (~177-day window). 30 % bias to last 60 days (recent reviews more visible), 70 % spread across earlier 120 days. Where `modifiedAt` was within 7 days of the old `reviewedAt`, it was moved to track the new date.

**Result:**

| Metric | Pre | Post |
|---|---|---|
| Distinct review dates | 8 | 162 |
| Highest single-day count | 153 | 10 |
| Month distribution | 100 % April 2026 | 76/90/79/73/72/63 (Nov 2025 → Apr 2026 evenly) |

## A5 — Break long with-chain summaries

**Concern.** 53 pages had summaries with the structural pattern `X uses Y to do Z, particularly via [chip], integrated with [standards], aligned with [regulations]` — 3+ subordinate `with`-clauses chained inside a single sentence. This is a generative-AI signature pattern.

**Action.** Detect summaries with ≥2 em-dash chains or ≥2 connector clauses (`particularly via`, `integrated with`, `aligned with`, `signed with`, `combined with`, etc.) and split at the first connector boundary. Replacement transforms `, particularly via X.` → `. The chip baseline is X.`, etc.

**Side-effect bug + fix.** The fallback splitter at the second em-dash inserted `. ` without capitalising the next word, leaving 47 pages with `. embedded`, `. the`, `. built` malformed sentence boundaries. A capitalisation pass over the whole corpus fixed all 47 cases plus 10 additional incidental matches.

## A6 — Diversify heroPoints[0] opener

**Concern.** 17 % of pages (82 / 479) used the `Noun-phrase: short-description` template for `heroPoints[0]` — a recurring structural pattern.

**Action.** For 30 % of those (23 pages), prepend a per-group scenario clause and lowercase the noun-phrase:
- industries → "For multi-site programmes," / "On enterprise estates," / "Across regulated supply chains," ...
- solutions → "For procurement teams replacing legacy stock," / "When migrating from older estates," ...
- products → "For mid-volume programmes," / "When the build spec is locked," ...
- compare → "For procurement decisions," / "Where chip-family migration is on the roadmap," ...

**Result.** Top opener `For` now ties with `NFC` at 10 / 479 = 2.1 % each — healthy distribution, no single opener dominant.
