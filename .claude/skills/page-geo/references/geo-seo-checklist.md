# Shared GEO + SEO checklist

Why both: Google ranks pages; AI engines quote them. The same structural
moves serve both, but the *unit of optimization* differs — SEO optimizes the
page, GEO optimizes every extractable block (a summary, a FAQ answer, a table
row, a stat line can each be lifted alone into an AI answer).

## Answer-first, everywhere

- **Summary**: first sentence answers the page's core query with numbers
  ("RFID textile laundry tags are … rated for 200+ industrial wash cycles at
  60-75 °C, from $0.4x at 10K qty"). Detail after, never before. This is what
  Google shows as the snippet and what AI engines quote.
- **Section intros**: one or two sentences that state the takeaway of the
  section before the evidence. A reader who only reads intros should still
  leave informed.
- **FAQ answers**: self-contained — repeat the subject noun ("Textile
  laundry tags survive 200+ cycles…" not "They survive…"), one direct answer
  plus one qualifier, no "see above".

## Quotable stat lines

AI engines prefer sentences that carry number + unit + context in one line.
"Read range: 2-5 m on a handheld, 5-8 m through a portal (UHF 860-960 MHz)"
beats the same facts spread across three sentences. Put the strongest ones in
statBar/dataHighlight — those components exist so the page's key numbers are
machine-obvious.

## Sources are ranking fuel, not decoration

sources[] entries render as a citations block and flow into Article JSON-LD
`citation[]`. AI engines weight cited pages heavily. Primary only: vendor
datasheets (NXP, Impinj), standards bodies (ISO, ETSI, FCC, GS1), regulators
(eCFR, EUR-Lex). Verify each URL actually loads and actually contains the
claim before citing it — a 404 or a bot-wall means find another source or
drop the claim (precedent: laundry post shipped with sources[]=0 rather than
unverifiable links).

## Keywords and titles

- Title pattern: `<what it is> — <sharpest differentiator>` under ~60 chars
  of the click-relevant part. Commercial pages carry commercial modifiers
  (manufacturer, supplier, MOQ, price, buy); guides carry question words.
- keywords[]: 4-7 entries, one head term + long-tails mirroring real buyer
  phrasing ("rfid laundry tag 200 wash cycles", "ntag 213 stickers bulk
  MOQ"). These feed meta and the machine endpoints.
- kicker: the category label buyers scan for; don't duplicate an H2 (kicker
  collisions with section headings have been flagged in QA before).

## Internal links

3+ per page, placed inside intros as natural markdown links, never bare
"click here". Triangle rule: a money page links to (a) the guide that
educates the buyer, (b) the compare page that closes the decision, (c) a
sibling money page one step up or down the funnel. Links resolve on the
current site — check `public/_redirects` history if a slug looks old; do not
link to a 301'd path (this fired on walmart-mandate: blog path had moved to
/guides/).

## Cross-site rule (two-brand strategy)

proudtek = informational hub. Its money pages may CTA to proudtek's own
contact/sample routes as configured in primaryAction — do not invent
cross-domain CTAs to rfidak.com inside editorial JSON unless the owner asks;
the cross-site funnel is a site-level decision, not a per-page edit.

## E-E-A-T signals already wired — keep them alive

authorSlug + reviewedBySlug + reviewedAt render bylines and Person JSON-LD;
preserve them, bump modifiedAt (never touch reviewedAt without a real
re-review). brief[] is the machine-brief block AI crawlers parse via
/machine/<slug>.txt|json — every rebuilt page gets one (label + text or
items; schema in content.config.ts).

## Visual hierarchy beats prose mass

The 2026-07 condense pass proved it: bullet walls (7-11 × 300-400 chars)
convert into tables/comparePanels/statBars/checklists with zero fact loss and
a large readability gain. Write short bullets (≤200 chars); when a list of
parallel facts crosses ~5 items, it probably wants to be a table.
