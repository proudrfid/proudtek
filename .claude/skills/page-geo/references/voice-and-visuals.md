# Voice, visuals, and fact corrections

Three upgrades layered onto every page-geo pass (owner request, 2026-07-11):
the prose should be fun to read, the content should be illustrated where a
picture explains faster than a paragraph, and factual errors found along the
way get fixed — with proof — instead of politely preserved.

## Voice: procurement wit, not stand-up

The audience is a buyer risking their own reputation on a supplier choice.
The house voice (established by blog-transform/page-voice) is a premium trade
publication that enjoys its subject: dry, concrete, confident. Humor comes
from precision, not from jokes — "Wiegand is a 1974 protocol still guarding
2026 doors, and it shows" lands because it's true.

Calibration (mirrors the repo's blog-transform tiers):
- **Tier A pages** (products, compare, markets, lp, most case studies):
  humor 6-7/10 (owner dial, 2026-07-11 — the pages should be genuinely fun
  to read, not merely tolerable). Wit lives in section intros, cold opens,
  callout labels, timeline labels, comparison verdicts.
- **Tier B pages** (anything medical / patient-safety / pharma adjacent —
  hospital linen, surgical products, healthcare案例): humor ≤2/10, never on
  a harm outcome. When unsure, a page is Tier B.
- **Never funny, anywhere**: spec tables, FAQ answers, summary, compliance
  and legal claims, prices, anything inside sources[] or brief[]. These
  blocks get quoted verbatim by AI engines and procurement checklists —
  they must survive being lifted out of context with a straight face.

Mechanics that keep wit readable instead of cute: metaphors drawn from the
buyer's world (loading docks, audits, chargebacks — not pop culture);
one wit-beat per intro, not three; cut any sentence that's funny but adds no
information. If a line would embarrass the owner in a customer's
procurement review, it's out.

## Visuals: illustrate by content shape, not by quota

Every pass ships visuals — a dry wall of correct text is still a wall. The
question per section is "what shape is this information?":

| Content shape | Component |
| --- | --- |
| Parallel attributes (specs, prices, standards) | table |
| Two-way tradeoff | comparePanel |
| Process / sequence / rollout | timeline or checklist |
| 3-4 headline numbers | statBar |
| Physical structure, flow, map, anatomy, ladder | **SVG diagram** |
| One striking stat | dataHighlight |

SVG diagrams are the move when geometry carries the meaning: tag
construction cross-sections, credential→reader→panel flows, band maps
(902-928 vs 865-868 MHz), decision ladders, placement maps. Floor: hero +
2 section diagrams on any standard page; rebuilds usually land hero + 2-4
(a section whose payload is already a table may skip its image). Conventions: viewBox 1200×675, house palette (steel /
teal / gold on warm cream), red reserved for risk/failure rows only, one
`<text>` per line (no mixed tspans), `&` escaped, ≤44 chars for 12px detail
lines in a 304px chip. Verify with the blog-transform checker
(`node .claude/skills/blog-transform/scripts/check-svg.mjs <file>`) AND a
cairosvg PNG render you actually look at. Full style detail:
`.claude/skills/blog-transform/references/svg-style.md`.

Every diagram's facts must already exist in the page text or carry a
source — an SVG is prose to factscan's eyes even though the scanner can't
read it; never introduce numbers that live only in an image.

## Fact corrections: verify, fix, leave a paper trail

When a pass surfaces a factual error, fix it — but the repo's history says
corrections are where credibility goes to die if done casually (see
memory/feedback-verify-chip-claims.md: a past "correction" cycle had to be
re-verified against vendor datasheets). Protocol:

1. **Prove it first.** A correction requires a primary source in hand
   (vendor datasheet, standard text, regulator page) — fetched and read
   this session, not remembered. No source, no correction: flag it in
   NOTES.md instead.
2. **External facts** (chip specs, frequencies, standard numbers, dates):
   correct directly; add the source to sources[]; record in NOTES.md under
   a `## Corrections` heading: `wrong → right, per <source URL>`.
3. **Company facts** (wash cycles, MOQ, lead times, capacity): the owner is
   the source of truth. Check `references/canonical-facts.md` first — if
   the fact is ruled there, correct to it directly (cite the file). If it
   isn't ruled and the site contradicts itself, don't trust majority vote
   (it has voted wrong before — the textile wash-cycle incident,
   2026-07-11): flag `[OWNER-CONFIRM]` with the candidate values and let
   the owner rule; add the ruling to canonical-facts.md afterwards.
4. **Corrections inside frozen `{chip:}` lines** collide with the drift
   lint (any changed line containing a placeholder fails CI). Don't bury
   the fix: make it, run selfcheck, and document the expected drift-lint
   hit in NOTES.md as an intentional, owner-approved exception — or, if
   the wrong value is the placeholder-resolved field itself, the bug is in
   src/data/chip-specs.json and must be fixed there (separate, small PR).
5. **Gates**: a corrected number legitimately trips factscan (old token
   DROPPED, new token NEW). Pass explicit, auditable exceptions:
   `selfcheck.py --allow-dropped '<old token>' --allow-new-tokens`, and
   list every exception in the NOTES Corrections block. An unexplained
   DROPPED is still a failure — the flag exists for documented fixes only.
