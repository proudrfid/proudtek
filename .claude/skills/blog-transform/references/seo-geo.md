# Per-post SEO/GEO playbook — Proudtek blog

Context that shapes every move: the site's *pipeline* layer is already
top-tier (llms.txt + llms-full.txt, per-page `/machine/*.json|txt` mirrors,
15 AI crawlers allowlisted, 10 schema types incl. speakable/citation,
sitemaps, canonical/OG/Twitter). **Add no infra per post.** What moves
per-post visibility — per the Princeton GEO study (ACM KDD 2024): adding
statistics, citations, and quotable lines lifts generative-engine visibility
30–41% — is *content shaping*: extractability, answer-first structure,
freshness, entity consistency.

## Field mechanics — what surfaces where

Edit these knowing exactly what each feeds:

| JSON field | Surfaces as | Rule |
|---|---|---|
| `title` | `<title>`, og:title, Article headline (truncated 110) | Keep keyword structure; sharpen wording, never shuffle keywords out. |
| `summary` | meta description (**truncated 155 chars**) + the hero **"Quick answer" block** (a speakable JSON-LD target) + og:description | **Highest-leverage field on the page.** Sentence 1 = direct answer to the title query *with a hard number*. Front-load so the first ~150 chars stand alone. Voice beat comes after the answer, if at all. |
| `heroPoints[]` | hero bullet list | Conclusion-first; each carries a concrete number or name already in the post. |
| `sections[].title` | H2 | Phrase as the real question a buyer/LLM asks ("How far can a UHF tag actually read?") — matches conversational queries; corpus convention. |
| `faq[]` | visible `<details>` FAQ + **FAQPage JSON-LD (automatic)** | 3–6 entries. Answer in the first sentence, 40–80 words, one hard number each where truthful. Don't restate an H2 section verbatim — cover adjacent long-tail questions. |
| `sources[]` | authority Article `citation[]` — the strongest single GEO variable | **Only URLs you actually opened and verified this session.** Include `publisher`/`publishedAt` when known. No verifiable source → leave it absent; a fabricated citation is worse than none. |
| `authorSlug` / `reviewedBySlug` | Person entities in Article JSON-LD | If missing, set `authorSlug: "editorial-board"` (it exists in `src/content/authors/`). **Never add or change `reviewedBySlug`/`reviewedAt`** — human sign-off. |
| `keywords[]` | machine feeds | Curate 4–8 long-tail terms using chip/standard names already in the post. |
| `modifiedAt` | article:modified_time, sitemap lastmod | Set to today — this transform is a real content update, and AI engines show a ~3-month "citation cliff" for stale pages. Never bump without real changes. |

## Prose shaping (inside sections)

- **Answer-first**: the first sentence of every `intro` is the takeaway; LLMs
  extract whole paragraphs and skip buried conclusions. Then the wit.
- **Quotable stat lines**: upgrade vague claims to number-bearing sentences —
  "504 bytes of user memory" beats "a large memory" — using **only numbers
  already in the post or verified against a vendor datasheet**. Never invent,
  estimate, or round a spec: procurement teams cross-reference datasheets,
  and the facts freeze is CI-enforced.
- **Semantic chunking**: key conclusions live in standalone 2–4 sentence
  paragraphs or conclusion-first bullets, so an engine can lift them whole.
- **Internal links**: 2–4 contextual markdown links —
  `[MIFARE DESFire EV3](/guides/mifare-desfire-ev3-commands-reference/)` —
  to routes you've confirmed exist (check `src/content/editorial/` /
  `src/data/`). Existing links must all survive. One strong CTA can be a
  `callout: { label, text, href }` instead.
- **Entity consistency**: the brand is written **"Proud Tek"** (with the
  space) in prose — the no-space variant splits the knowledge-graph entity.
  Spell out full chip names on first prose mention — **but never on a line
  containing a `{chip:...}` placeholder; skip those lines entirely.**

## Anti-goals

Keyword stuffing · fabricated or unvisited sources · new/rounded statistics ·
touching `reviewedAt` · per-post schema or `<head>` hacks · inserting company
NAP/contact info into posts · burying the answer under the joke.
