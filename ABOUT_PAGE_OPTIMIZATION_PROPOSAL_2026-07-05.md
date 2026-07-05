# About Page Optimization Proposal — proudtek.com/about/

**Date:** 2026-07-05 · **Source file:** `src/content/editorial/about.json` · **Status:** for approval before build

---

## 1. TL;DR

The **copy is already very good** — 722 words, answer-first, entity-rich, with a stat bar, factory-vs-trading compare, capability grid, procurement timeline, compliance list, an 8-question FAQ, and cited sources. It does most of what SEO and LLM-citation best practice asks for. **We should keep almost all of it.**

The page has **two real weaknesses**, both fixable without touching the substance:

1. **Imagery.** One generic warehouse-aisle stock photo (`factory-production.webp`) is reused **4+ times** — as the hero *and* the "Case Studies," "Certifications," and other cards — each time with **different, mismatched alt text**. It shows pallet racks, not RFID production. Research is blunt here: *users ignore stock photos and engage with authentic images* (NN/g). This directly undercuts the "direct factory" claim the whole page is built on.
2. **No proof-visual layer.** 27 headings, almost no supporting graphics — the capability grid leans on emoji, the timeline and compare panel are text-only. It reads as a wall of text, and it's **missing the "factory-scale" proof** (floor area, headcount, monthly capacity, certification wall) that both Chinese-RFID buyers and LLM answer-engines reward.

**Plan:** keep the copy, add a visual + proof layer (on-brand SVG diagrams now, real-photo shot-list for you to fill later), add a factory-scale stat band + certification/standards band + a spec table, tighten the hero, fix the image reuse/alt text, and layer in a few GEO structure wins (TL;DR block, data tables, visible freshness).

---

## 2. What top-ranking pages do (benchmark)

### Direct China-RFID competitors
Pages that rank for "RFID manufacturer China" (MoreRFID, Chuangxinjia/CXJ, Zhanfeng/zfcards, D.O RFID, STARNFC) share a consistent convention:

- **Lead with concrete factory scale** — founding year, workshop floor area (e.g. "12,000 m²"), headcount ("200+ employees"), monthly output ("18M pcs/month"), R&D team size.
- **100% QC + ISO 9001** stated up top, often repeated.
- **Certification logo wall** (ISO, RoHS, REACH, CE, FCC, SGS/TÜV).
- **Production-line photos** and often a **facility video**.
- **OEM / ODM / CM** positioning, free samples, warranty.
- **An inquiry CTA repeated after every block** (trust signal within reach of every CTA).

Proud Tek already beats them on content depth — but under-uses factory-scale proof and the visual/trust layer they all lead with.

### B2B "About" best practice (2026)
- Five core elements: **origin story, value proposition, social proof, team/facility photos, clear CTA.**
- **300–800 words** (Proud Tek at 722 — good).
- **Start with "why," not "what";** make the customer the hero; concrete proof points; one clear next step.
- **A trust signal within view of every major CTA.**
- **Authentic images >> stock**; infographics and a facility walkthrough video add credibility.

### GEO / LLM-citation (how ChatGPT, Perplexity, Claude pick sources)
- First-party pages ≈ **44% of AI citations** — the About page is prime real estate.
- Reward: **TL;DR summaries, claims-with-evidence, Q&A blocks, data tables, visible author + published/updated dates, strong entity clarity.**
- **Freshness matters:** content updated within 30 days gets ~3.2× more AI citations.
- Answer the exact questions buyers ask ("Is it a factory or trader?", "certifications?", "MOQ?", "lead time?") — Proud Tek's FAQ already nails this.

---

## 3. Gap analysis — current vs. best practice

| Element | Best practice | Proud Tek today | Action |
| --- | --- | --- | --- |
| Hero image | Authentic, specific to the claim | Generic warehouse stock, reused 4× | **Replace** with real production shot (shot-list) or SVG until supplied |
| Alt text | Accurate, unique per image | Same photo, 4 different alts | **Fix** — accurate, unique alt per placement |
| Factory-scale proof | Floor area, headcount, capacity | Not shown (only "2008 / 50+ countries / 6 families") | **Add** factory-scale stat band (you supply real numbers) |
| Visual pacing | Diagrams/infographics break text | Emoji icons + text only | **Add** 4–5 on-brand SVG diagrams |
| Certification wall | Logo/badge band | Listed in prose only | **Add** a standards/cert band (visual) |
| Spec / capability table | Data tables aid buyers + LLMs | Bullets + compare panel | **Add** one capability/spec table |
| Social proof | Testimonials, client logos, industries | One testimonial, no logos | **Strengthen** (2nd testimonial + industry logo row — you supply) |
| Freshness signal | Visible updated date | `modifiedAt` in data, faint on page | **Surface** "Last updated" near the byline |
| CTA repetition | Trust signal near every CTA | CTAs mostly at the end | **Add** one mid-page inquiry CTA after capabilities |
| Origin story | "Why we exist" narrative | Jumps straight to specs | **Add** a 2–3 sentence founder/why block |

---

## 4. Proposed page structure (wireframe)

New/changed blocks marked **[NEW]** / **[CHANGE]**. Order is top-to-bottom.

```
┌───────────────────────────────────────────────────────────┐
│ HERO  [CHANGE]                                             │
│  Kicker: About Proud Tek                                  │
│  H1 + 1-line "why" origin hook  [NEW]                     │
│  3 hero proof points (keep)                               │
│  Byline + "Last updated Jun 2026"  [CHANGE: surface date] │
│  Hero image → real production shot / SVG  [CHANGE]        │
├───────────────────────────────────────────────────────────┤
│ FACTORY-SCALE STAT BAND  [NEW]                            │
│  [ Founded 2008 ][ __ m² floor ][ __ staff ]             │
│  [ __ M pcs/mo ][ 50+ countries ][ 100% read-test ]     │
│   ← real numbers you confirm; SVG stat band              │
├───────────────────────────────────────────────────────────┤
│ "AT A GLANCE" brief (keep)                                │
├───────────────────────────────────────────────────────────┤
│ FACTORY-DIRECT vs TRADING  [CHANGE]                       │
│  Keep copy + add SVG flow graphic (2 supply chains)      │
├───────────────────────────────────────────────────────────┤
│ IN-HOUSE CAPABILITIES  [CHANGE]                           │
│  Keep 6-feature grid + add SVG capability/process map    │
│  + one CAPABILITY TABLE (substrate/chip/finish)  [NEW]   │
├───────────────────────────────────────────────────────────┤
│ MID-PAGE INQUIRY CTA  [NEW]  (trust line + button)       │
├───────────────────────────────────────────────────────────┤
│ PROCUREMENT WORKFLOW timeline  [CHANGE]                   │
│  Keep 4 steps + SVG 4-step process ribbon                │
├───────────────────────────────────────────────────────────┤
│ PRODUCT FAMILIES (keep) · INDUSTRIES (keep)               │
│  + optional industry logo/emblem row  [NEW, you supply]  │
├───────────────────────────────────────────────────────────┤
│ SOCIAL PROOF  [CHANGE]                                    │
│  Existing testimonial + 1 more  [NEW, you supply]        │
├───────────────────────────────────────────────────────────┤
│ COMPLIANCE & STANDARDS  [CHANGE]                          │
│  Keep list + add CERT/STANDARDS BAND (SVG badges)  [NEW] │
├───────────────────────────────────────────────────────────┤
│ RESOURCE CARDS (keep — but fix reused images)  [CHANGE]  │
│ FAQ (keep) · SOURCES (keep) · FINAL CTA (keep)           │
└───────────────────────────────────────────────────────────┘
```

---

## 5. Visual plan

### SVG diagrams I will build (on-brand, using `codex-tokens.css` colors — warm gold/brown core, cyan action)
1. **Factory-direct vs trading-company flow** — two supply-chain rows: `Factory → 1–2 middlemen → You (＋15–30%)` vs `Proud Tek → You`. Reinforces the page's core argument visually.
2. **Production & QC process ribbon** — Inlay bond → Lamination → Encode → 100% read-test → Laser number → Pack. Ties to the capability grid + timeline.
3. **Capability map** — one panel showing chip families (NXP/Infineon/Impinj/Alien/EM/Quanray) × form factors × finishes, as a tidy matrix.
4. **Certification & standards band** — ISO 9001 / RoHS / REACH / FCC / CE / MIC / CCC as clean tokenized badges (not fake third-party logos — typographic badges).
5. **Global-reach stat band** — the factory-scale numbers as a horizontal SVG band.

These are illustrations/infographics, not photos — they legitimately break up the text and can ship immediately.

### Real-photo shot-list (for you to capture — authentic photos beat everything above)
Capture in landscape, good light, ~1600px. Suggested 8:

| # | Shot | Suggested alt text |
| --- | --- | --- |
| 1 | Wet-inlay bonding / antenna line (hero) | "Proud Tek wet-inlay assembly line bonding RFID chips to antennas, Shenzhen" |
| 2 | Card/label lamination press | "PVC and PET card lamination at Proud Tek's Shenzhen factory" |
| 3 | Encoding / personalization station | "Operator encoding NFC chips at a Proud Tek programming station" |
| 4 | 100% read-test QC bench | "100% functional read-test QC on every encoded RFID unit" |
| 5 | Laser numbering / marking | "Laser serialization of RFID cards for a customer program" |
| 6 | Finished cards/tags close-up | "Finished RFID cards, tags and wristbands produced by Proud Tek" |
| 7 | Warehouse / packing & dispatch | "Packed RFID orders staged for DHL/FedEx dispatch from Shenzhen" |
| 8 | Team / facility exterior (optional) | "Proud Tek production team, Shenzhen facility" |

When you supply these, I swap each SVG/hero for the matching photo and keep the SVGs as secondary infographics.

---

## 6. Specific copy changes (kept minimal — the writing is strong)

- **Hero:** add a 1-sentence "why" hook before the proof points (e.g. lead with the problem: buyers burned by traders/opaque quality → why Proud Tek runs its own floor). Keep everything else.
- **Surface freshness:** show "Last updated June 2026" by the byline (data already in `modifiedAt`).
- **Factory-scale band:** needs **real** numbers from you — floor area (m²), staff count, monthly capacity, R&D headcount, lines. I will **not** invent these (see §8).
- **One capability table** distilled from existing bullets (chip family × form factor × substrate × finish) — better for scanning and for LLM extraction.
- **Mid-page CTA** line: one short "Talk to an engineer / request samples" band after capabilities.
- **Alt text:** unique, accurate alt for every image placement; stop reusing one photo across unrelated cards.

No claims about certifications, chips, or standards will change — those stay exactly as written (they're buyer-verifiable per repo policy).

---

## 7. GEO / SEO enhancements

- **Add `Organization` (+ `Manufacturer`) structured data** if not already emitted for this route — name, foundingDate 2008, location, sameAs, contactPoint. (I'll check what the editorial layout already outputs before adding.)
- **TL;DR block** at top (repurpose the existing `summary` as a visible "In short" line).
- **Capability/spec table** = clean extractable data for answer engines.
- **Visible published + updated dates** (freshness signal).
- Keep the cited **Sources** section (already a strong GEO signal).

---

## 8. What I need from you (accuracy gate)

The repo's own rule (`CLAUDE.md` → "Content factual accuracy") is that buyer-verifiable claims must be real. So before I build the factory-scale band I need the **true** numbers, or I'll ship the band with clearly-marked placeholders you fill in:

- Factory floor area (m²), total staff, R&D/engineering headcount, number of production lines, monthly (or annual) capacity.
- Optional: 1 more testimonial (attributed as loosely as the current one), any client/industry logos you're cleared to show.

Everything else (SVG diagrams, alt-text fixes, hero de-duplication, table, mid-page CTA, freshness) I can build now with no new inputs.

---

## 9. Build order once approved

1. Author the 5 SVG diagrams (tokenized colors) → `src/` asset location used by editorial components.
2. Extend `about.json` (+ a small Astro partial if a new block type is needed) for: factory-scale band, capability table, cert band, mid-page CTA, hero "why" line, freshness.
3. Fix image reuse + alt text across the About cluster.
4. Add/confirm Organization schema.
5. Verify: `astro check` + lint + link-audit + contrast on new SVGs; screenshot the rebuilt page.
6. Hand off for your `git push` → Vercel deploy.

**Scope guardrail:** this is a native editorial page, so all changes are data + one or two components + CSS — no Kadence snapshot surgery.
