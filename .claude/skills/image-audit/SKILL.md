---
name: image-audit
description: >-
  Audit Proudtek editorial + product page images (src/content/editorial/** —
  blog, solutions, guides, products) for two specific problems: (1) the hero or
  section image does NOT match the page's title/topic (a wrong or off-topic
  picture), and (2) the image shows a rival RFID/NFC manufacturer's logo or
  branding (a competitor's mark on the company's own site). It resolves each
  page's image to its local file, visually inspects the actual image, compares
  it against the title/summary, tells rival-maker logos apart from allowed
  chip-supplier branding (NXP/Impinj/Alien), catches broken or wrong-path heroes,
  and suggests replacement images. Use this WHENEVER the user wants to check,
  review, QA, or audit page images / hero images / main images / article or
  product photos for correctness — including phrasings like "do the images match
  the articles/titles", "find pages with the wrong or off-topic main image", "any
  hero images showing a competitor's logo or brand", "audit the product-page
  photos", "which blog images are the wrong picture", "check the images for
  off-brand or rival logos". Invoke even if the user doesn't say "skill" or name a
  file. This is about IMAGE-vs-topic/brand fit — NOT rewriting page text (use
  page-voice / blog-voice for that) and NOT CSS/layout/visual-polish of UI
  components (use design-review for that).
---

# Image Audit — hero/section images vs title, and competitor logos

Proudtek (Proud Tek, a Shenzhen RFID/NFC manufacturer) has ~250 editorial and
product pages, each with a hero image and sometimes inline section images. Two
recurring problems are worth catching before a buyer sees them:

1. **Image ↔ title mismatch** — the picture depicts a different subject than the
   page is about (e.g. a hotel key-card photo on a warehouse-management guide).
   It looks careless and erodes trust with procurement readers.
2. **Competitor branding** — the image shows a *rival manufacturer's* logo or
   wordmark. On a manufacturer's own site that is an own-goal: it advertises the
   competition.

The images live as **local files under `public/`** (e.g. `heroImage:
"/landing-images/x.webp"` → `public/landing-images/x.webp`), so you can `Read`
each one and look at it directly. Web search is only for finding *replacements*.

This skill is **report-only**: it never edits content or downloads files. It
produces an audit you (or a follow-up task) can act on.

## Step 0 — Pick the scope and list targets

Auditing every image means reading ~250 files — heavy. Always start by listing
targets with the bundled script, which parses each page's JSON, resolves the
hero image to a `public/` path, checks the file exists, and pulls the title /
kicker / summary you need for the match check:

```bash
node .claude/skills/image-audit/scripts/list-targets.mjs --json        # all groups, machine-readable
node .claude/skills/image-audit/scripts/list-targets.mjs --group blog  # one group
node .claude/skills/image-audit/scripts/list-targets.mjs --slug rfid-warehouse-management   # one page
```

Each target carries: `slug, group, file, title, kicker, summary, heroImage,
heroPath, heroExists, sectionImages[]`. Two cases the script marks for you:

- **`heroExists: false`** — the referenced file is missing on disk. Before you
  call it broken, search `public/` for the image's basename
  (`find public -iname '<basename>*'`): the asset very often exists under a
  *different* folder — e.g. a hero pointing at `/landing-images/warehouse-led.jpg`
  when the file is really `/blog-images/warehouse-led.jpg`. That's a wrong-path
  bug, and "repoint the path" is a one-line fix and a far better finding than
  "source a new image." Only when the basename appears nowhere in `public/` do
  you recommend a replacement. Either way you can't inspect what isn't on disk.
- **`heroImage: null`** — the page has no explicit hero; the live hero is
  *harvested from `imageSourceRoutes`* at build time. Note these as
  "not inspected (image harvested from route)" rather than guessing.

If the user gave no scope, default to **blog + solutions + guides + products**
but confirm the size first — for a full sweep, fan out (see *Scaling* below)
rather than reading 250 images in one context.

## Step 1 — Inspect each image: describe, then judge

For each target, `Read` the `heroPath` (and any `sectionImages[].path`). The
single most important habit, because it is what keeps the audit honest:

**Describe what the image literally shows before you judge it.** Write one plain
sentence — the subject, setting, any visible text/logos — *then* compare against
the page. Judging straight from the filename or your expectation (instead of the
pixels) is how both false positives and missed problems happen.

### Check A — does the image match the title/topic?

Compare your description against `title` + `kicker` + `summary`. You are looking
for a *clear* contradiction, not a perfect illustration.

- **Fine (do not flag):** a generic-but-on-theme image (an abstract warehouse
  shot on a warehouse page; a close-up of an RFID tag on a tag guide). Stock and
  reused images are normal here — `industrial.webp` appears on dozens of pages.
- **Flag:** the subject is plainly a *different product category* — a card photo
  on a reader page, a wristband on a hard-tag SKU, a hotel lobby on a
  pharmaceutical-tracking guide, or no product at all on a product-selection page.

**On product / SKU pages, judge by product *category*, not by the iconic form.**
A product line legitimately ships in several forms, so a non-iconic shot is still
a match. Worked example: an *anti-metal tag* page whose hero is a roll of
flexible white on-metal **labels** is fine — flexible on-metal labels are a valid
anti-metal product, even though the iconic anti-metal tag is a rigid block. Don't
flag a plausible representation of the product just because it isn't the variant
you pictured; reserve the flag for a genuinely different category. When your only
doubt is "is this the exact sub-variant," lean clean.

When you flag, state *why* in terms of the gap: "image shows X; page is about Y."
If it's borderline, say so and lean toward **not** flagging — a weak-but-related
image is not worth a buyer-facing churn, and crying wolf makes the report
useless.

### Check B — is there a competitor's logo or branding?

Scan the image for any readable brand name, wordmark, or logo. List what you
actually see, then classify against `references/competitors.md`:

- **Flag** — a logo/wordmark of a rival RFID/NFC **product manufacturer** (HID,
  Zebra, Avery Dennison / Smartrac, Identiv, Honeywell, Confidex, Checkpoint,
  …). These compete with Proudtek; their branding does not belong here.
- **Allowed (do not flag)** — chip/silicon **suppliers** whose parts Proudtek
  builds on (NXP, Impinj, Alien, STMicroelectronics, EM, Infineon), standards
  bodies (GS1, ISO, NFC Forum), and Proudtek's own marks. A chip or inlay photo
  showing "NXP" or "Impinj" is legitimate — Proudtek sells products using those
  chips. See the reference for the full rationale and lists.

Logos are easy to misread. **Only flag a brand you can actually read**, and
attach a confidence ("clear" / "possible — small/blurred"). A plain unbranded
tag that merely *resembles* a competitor's product is not a finding. When you
genuinely can't tell, note it as "possible, needs human confirmation" rather
than asserting it.

Read `references/competitors.md` before Check B — it is the editable source of
truth for who is a competitor vs. an allowed supplier, and the user maintains it.

## Step 2 — For flagged pages only, find replacement candidates

For each flagged page, propose a better image. Derive 1–2 search queries from the
page's real subject (title + kicker), then use `WebSearch` (and `WebFetch` on a
result if you need to confirm what an image depicts).

Aim for sources the user can actually license: **royalty-free / CC** libraries
(Unsplash, Pexels, Pixabay, Wikimedia Commons) or Proudtek's own existing
`public/` library (a more fitting image may already be on disk — scan
`list-targets.mjs` output for a hero used by a closely-related page).

Return 1–3 candidates per page, each with the URL, the source, and one line on
why it fits. **Licensing is the user's call** — never claim an image is free to
use; say "verify license before use" and prefer sources with clear terms. If you
can't find a strong candidate, give the search queries and the best sources to
check rather than a weak link.

## Step 3 — Write the audit report

Lead with what's actionable. List flagged pages in full; collapse clean pages to
a count so the signal isn't buried. Use this structure:

```markdown
# Image Audit — <scope> (<YYYY-MM-DD>)

## Summary
- Audited: <N> pages · Flagged: <M> (mismatch <a> · competitor-logo <b> · both <c> · broken <d>)
- Not inspected (hero harvested from imageSourceRoutes): <k>
- Clean: <N − M − k>

## Flagged

### <slug> (<group>) — <mismatch | competitor-logo | broken image>
- Route: <route> · File: <file>
- Title: "<title>"
- Current image: `<heroImage>` (`public<heroImage>`)
- Image shows: <one-line objective description>
- Issue: <the gap, or the brand identified + confidence>
- Suggested replacements (verify license before use):
  1. <url> — <source> — <why it fits>
  2. <url> — <source> — <why it fits>
  - Search queries used: "<q1>", "<q2>"

### … (repeat per flagged page)

## Clean (by group)
- blog: <x> · solutions: <y> · guides: <z> · products: <w>

## Notes
- <broken-file paths, ambiguous logo calls left for human confirmation, etc.>
```

## Scaling — fan out for a full sweep

Reading ~250 images in one context is slow and lossy. For anything beyond ~15
pages, split the target list into batches (~15–25 pages each) and run one
subagent per batch. Give each subagent: the batch's target rows (slug, title,
heroPath, sectionImages), the two checks above, the contents of
`references/competitors.md`, and the per-page finding shape to return. Then merge
the structured findings into one report yourself. This keeps each agent's image
reads focused and lets the audit run in parallel.

A subagent's return shape, per page:
`{ slug, group, heroImage, imageShows, mismatch: {flagged, reason}, competitorLogo: {flagged, brand, confidence}, broken }`

## Guardrails

- **Report-only.** Don't edit JSON, download images, or change `heroImage`. If
  the user later wants a swap, that's a separate, explicit task.
- **False positives are the main failure mode.** A vague or reused-but-on-theme
  image is not a mismatch; an unbranded tag is not a competitor logo. Every flag
  costs the user a review; spend them only on real problems.
- **Inspect the pixels, not the filename.** The filename is a hint, not
  evidence — `retail-apparel.jpg` could be anything.
- **Don't assert licensing.** Replacement suggestions are leads to verify.
```

