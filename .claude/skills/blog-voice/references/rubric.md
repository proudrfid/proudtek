# Scoring rubric — humor & enjoyable

Two independent 0–10 axes. They are not the same thing: a post can be unfunny
but very readable, or the reverse. Score them separately, back every score with
a quoted phrase, and check against the acceptance bar.

## How to score (the discipline)

1. **Score each axis on two scales.** An *absolute* 0–10, and a *genre-relative*
   0–10 (how it compares to other B2B-SEO posts, a famously dry genre). A post
   can be a genre standout yet only mid on the absolute scale — say both, e.g.
   "humor 2/10 absolute, 3/10 vs B2B-SEO peers." The **acceptance bar is the
   absolute scale** (SKILL.md Step 5), so we push real quality instead of just
   clearing a low genre bar; the relative score is for telling the user how it
   stacks up against its peers.
2. **Cite evidence by quoting the phrase, not the line number.** Quote the exact
   words you are scoring ("the most-feared scenarios are the least-supported by
   physics"). Line numbers drift the moment the file is edited — phrases don't.
3. **End with a one-line verdict.** A single sentence capturing the post's
   character — e.g. "accurate but no fun: earns its enjoyable score on
   specificity, not voice; humor is almost all involuntary." It forces you to
   name what kind of post this is, which tells you which recipe moves to reach
   for.

## Humor (0–10) — "is the writer actively trying to amuse me?"

| Dimension | 0 looks like | 10 looks like |
|-----------|--------------|---------------|
| Deliberate beats | no jokes at all | designed bits, callbacks, puns |
| Wit / irony | flat exposition | crisp dry wit, clean irony |
| Playful register | corporate-neutral | the writer is clearly enjoying it |
| Surprise / timing | fully predictable | a comedic turn you didn't see coming |

Watch the difference between **deliberate** and **involuntary** wit. A dry post
can score a 1–2 purely by accident — an unexpected word in a list ("Punctures,
**bites**, and aggressive label removal" — who is biting their keycard?), or an
oddly human detail ("awkward generic 'Visitor 0042' printing"). That is not the
writer trying to amuse you; it leaked out. Only deliberate beats move the score.
This workflow targets **dry professional wit**, so the ceiling that matters is
~5–6: a few intentional, on-tone beats on harmless targets. A 9–10
(laugh-out-loud) is *off-spec* for B2B procurement — do not chase it.

## Enjoyable (0–10) — "do I want to keep reading?"

| Dimension | low | high |
|-----------|-----|------|
| Narrative pull | a loose pile of facts | a hook that makes you read on (myth → truth) |
| Voice / humanity | no "person" present | a real voice, a scene, a first-person take |
| Concreteness | vague adjectives | numbers, named brands, vivid physical detail |
| Payoff | nothing learned | a counter-intuitive "aha" |
| Skimmability | dense wall of bullets | scannable, conclusion-first |

Concreteness is usually a dry post's *strongest* axis — protect it. Named parts,
real numbers, and physical detail are why a technical post feels trustworthy and
reads fast. The enjoyable gap is almost always **voice and skimmability**, not
facts, so that is where the recipe spends its effort.

## Common enjoyable drags → the move that fixes each

When a post scores below the bar, the cause is usually one of these. Map it to a
recipe move (SKILL.md Step 2) instead of rewriting blindly:

| Drag | What it looks like | Fix |
|------|--------------------|-----|
| No "person" | corporate-neutral; no scene, no anecdote | **Move A** (cold open) + **B** (a voice beat) |
| Dense, monotone bullets | every bullet a paragraph; every section the same list shape | **Move D** (de-dense, conclusion-first) |
| Procurement-tail fatigue | accurate SOP detail (MOQs, EPC re-association) that exhausts a general reader | trim, or **Move D**; keep it but don't lead with it |
| Soft-sell breaks the spell | "[Brand] supplies…" snapping the neutral-explainer tone | leave the fact, keep the voice neutral — don't add sell |

## Acceptance bands (absolute scale)

- **Tier A:** enjoyable ≥ 8, humor 5–6.
- **Tier B:** enjoyable ≥ 8, humor ≤ 2 (readability lift only; no jokes on the
  harm outcome).
- Both tiers: facts diff = 0, and all lint / check / snapshot gates green.

## Calibration anchor (keep scores consistent across sessions)

`rfid-card-demagnetized-myth-explained.json` (Tier A), the pilot.

**Before — humor 2/10 (≈3/10 vs genre), enjoyable 6.5/10 (≈8/10 vs genre).**

- Humor was *all involuntary*: the surprise word "bites" in a damage list, the
  human "awkward generic 'Visitor 0042' printing", and one genuinely sharp line —
  "the most-feared scenarios are the least-supported by physics" — which is a
  quotable aphorism, not a joke. Zero deliberate beats → a 2.
- Enjoyable was already strong *for the genre* on **specificity and payoff**: a
  "myth → real fix" title hook; hard numbers and named brands (25 µm bond wire;
  70 / 75–80 / 100 / 200 °C; $0.30–0.60; Salto / VingCard / Saflok / Onity); and
  a counter-intuitive "what does NOT damage a card" list (MagSafe, fridge magnet,
  airport X-ray) that answers a real anxiety. What held it under 8: no human
  anchor (no scene, no first person), dense same-shape bullets, a procurement SOP
  tail, and a soft-sell line that broke the neutral tone.

**After — humor 5/10, enjoyable 8/10.** One human anchor (the front-desk cold
open) + a single dry-wit beat ("cards conscripted into bottle-opener … duty") +
a voice beat in the summary ("the slightly awkward truth"). **Every spec
sentence unchanged** (25 µm, the °C figures, the pricing).

**The teaching point:** the 6.5 → 8 lift came almost entirely from adding *one
human anchor*, not from jokes — voice moves enjoyable far more than humor does.
And leaving the already-strong closer alone (skipping Move C) was correct:
knowing when *not* to add is part of the craft.
