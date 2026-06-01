# Scoring rubric — page-voice (Solutions & Guides)

Same two independent 0–10 axes as blog-voice — **humor** ("is the writer actively
trying to amuse me?") and **enjoyable** ("do I want to keep reading?"). The full
scoring discipline, dimension tables, and the deliberate-vs-involuntary-wit
distinction live in the sibling doc and are not repeated here:

→ **Read `.claude/skills/blog-voice/references/rubric.md` for the base rubric.**

This file only records what is *different* about scoring non-blog pages.

## What's different on Solutions / Guides

1. **The cold open is almost always ADDED, not rewritten.** Blog posts open with
   `sections[0].intro`; these pages usually jump straight into `bullets` /
   `featureGrid` / `brief`. So Move A means *adding* a `sections[0].intro` (the
   schema allows it) or lifting the `summary`. Score the page as if that added
   intro is the front door — because for the reader it now is.

2. **Concreteness is already maxed — almost punishingly so.** These pages are
   denser with named standards (ISO/IEC, UL 294, NIST SP 800-116), platforms
   (Genetec, Lenel, SAP), and chip families than any blog post. Concreteness is
   never the gap. The gap is **voice and skimmability** — a wall of authoritative
   spec with no human anchor and no scene. Spend the whole effort there.

3. **Procurement-tail fatigue is the dominant enjoyable drag.** A solution page
   will list 4 security tiers, 7 PACS platforms, and a TCO model back-to-back.
   That's correct content for the buyer, but exhausting cold. Move D (de-dense:
   lead each bullet with its conclusion) lifts enjoyable here more than any joke.

4. **Two new score caps from the classifier's axes:**
   - **LEAN pages** (spec-dense, thin prose): humor target **3–4/10**, and you
     may *only* lift `summary` / `heroPoints`. A forced section cold-open on a
     LEAN page reads as a token edit stranded in a spec table — don't.
   - **SENSITIVE pages** (medical/patient-safety/pharma): humor **≤ 2/10**, never
     on a harm outcome — identical to blog-voice Tier B.

## Acceptance bands (absolute scale)

| | enjoyable | humor |
|---|---|---|
| RICH · STANDARD | ≥ 8 | 5–6 |
| LEAN · STANDARD | ≥ 8 | 3–4 (summary/hero lift only) |
| any · SENSITIVE | ≥ 8 | ≤ 2 (no jokes on the harm outcome) |

All bands: facts diff = 0; `{chip:}` and frozen structures (brief / table /
comparePanel / timeline / statBar / testimonial / featureGrid) untouched; vendor
& platform proper nouns preserved; lint / check / snapshots green.

## Calibration anchor

To be set after the pilot. The pilot target is a RICH · STANDARD **Solutions**
page (e.g. `rfid-access-control`): solution pages have the highest
prose-to-spec ratio and the clearest "outcome-first" framing to open on. Once
the pilot lands, record its before/after scores and the exact moves used here,
the same way blog-voice anchors on `rfid-card-demagnetized-myth-explained`.

**Expected shape of the lift** (from the blog pilot, which should transfer): the
enjoyable gain comes almost entirely from **one human anchor** (an added
`sections[0].intro` scene), not from jokes — voice moves enjoyable far more than
humor does. Leave an already-strong closer alone. Every spec sentence unchanged.
