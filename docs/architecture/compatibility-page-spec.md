# Compatibility-page spec

Template for the seven `/compatibility/{vendor}-hotel-key-cards/` pages
(`be-tech`, `hafele-dialock`, `miwa`, `onity`, `saflok`, `salto`, `vingcard`).
Authored after the Saflok rewrite (May 2026) which set the bar.

## Goal

Each page should be the **top organic and AI-engine result** for procurement-
intent queries about that vendor's hotel locks and card stock — outranking the
manufacturer's own product pages (which are PDP-shaped, not buyer-guide-shaped)
and the small set of card-OEM competitor pages already on the first SERP.

That is achievable because the competitive set is shallow:

- **Manufacturer pages** (dormakaba.com, assaabloy.com) are well-authored but
  product-cataloged: feature lists, no chip-compatibility matrices, no firmware
  lifecycle context, no buyer-checklist framing.
- **Card-OEM competitors** (rfidcard.com, frontdesksupply.com, hotelandresortkeycards.com,
  printplast.com) are commerce-driven: short, repetitive, sparse on technical
  depth, almost never cite sources.
- **Hospitality-press articles** are episodic and dateable but rarely structured
  for procurement reuse.

A buyer-guide that combines (1) full generation taxonomy, (2) per-generation
chip matrix, (3) encoder hardware lifecycle, (4) PMS integration map, (5) any
named CVE / security disclosure, (6) Mobile Access narrative, (7) field-failure
playbook, (8) material constraints, (9) validation checklist, (10) authoritative
sources, beats every page on the current SERP on technical depth.

## Required structure

Each compatibility page is one entry under `src/content/editorial/compatibility/`
with the following shape. Section titles can be renamed for the vendor's
own naming conventions, but the **information shape** is fixed.

### Top-level metadata
- **`title`** — long-form, year-pinned, signals the structure: `"{Vendor} Hotel Key Cards Compatibility Guide ({year}): Lock Generations, Encoders, Chip Families[, CVE if applicable]"`.
- **`summary`** — 60–80 word abstract that names the generations, the encoder stack, and the audience. Mentions CVE if one exists.
- **`heroPoints`** — 3–4 punchy facts that frame the procurement decision. First should be "identify the generation before specifying a chip". Last should be "validate on the real estate before scaling".
- **`keywords`** — 4–6 short phrases; mix product-name + technical (`"{vendor} hotel key card compatibility"`, `"{vendor} MIFARE DESFire EV3"`, etc.).
- **`publishedAt`** + **`modifiedAt`** — both ISO-8601 dates. `modifiedAt` controls the JSON-LD `Article.dateModified` field.
- **`heroImage`** — vendor-specific where possible. Fall back to the shared hotel-key card hero only if no vendor-specific image exists.
- **`authorSlug: "editorial-board"`** + **`reviewedBySlug: "peter-zhang"`** + **`reviewedAt`**.

### Brief (above-the-fold quick-reference)
Same shape as Saflok: four labelled blocks — *Best fit*, *What to send*,
*Testing checklist*, *Reference pages*. The first three are bullet lists of
3–5 items each. The fourth is a links block.

### Sections (8–10 of them, in this order)

1. **`"{Vendor} lock generations and what they accept"`** — narrative intro
   + **mandatory table**. Columns: *Generation* / *Era* / *Native credential*
   / *Typical encoder* / *Door-thickness range* / *Notes*. One row per generation;
   include the door-thickness range column even if it's identical across rows —
   that's a real procurement question and it's missing from every SERP competitor.

2. **`"Chip-family compatibility per generation"`** — bullet list mapping each
   chip family (Classic, Plus, DESFire EV1/EV2/EV3, Ultralight C, magstripe,
   125 kHz prox) to which generations accept it. Note sector-zero / key-derivation
   handling where the vendor's behaviour is documented. Include an
   illustrative card-family image.

3. **`"Encoder stack"`** — bullets per back-end platform + **mandatory model-
   number table**. Columns: *Encoder model* / *Generation* / *Interface* /
   *Chip support* / *Platform pairing*. List both legacy and current encoder
   SKUs with explicit "supersedes X" callouts. This is where the page out-
   technical-depths the manufacturer PDPs.

4. **`"Mobile Access — {vendor's mobile platform}"`** — required even if the
   vendor's mobile track is thin. Bullets covering: vendor's mobile-key
   programme name (e.g. Saflok Mobile Access Solutions, SALTO JustIN), BLE +
   NFC + digital-wallet (Apple Wallet / Google Wallet) support, third-party
   mobile-key partners (OpenKey, HID Origo, etc.) and their integration
   status, and the operational reason every mobile-first property still
   needs a card-stack baseline (ADA, device failure, walk-ins, override).

5. **`"PMS integration"`** — bullets covering the major PMS pairings (Oracle
   OPERA 5 + Cloud, Mews, Protel, Agilysys LMS / rGuest) and any vendor-
   specific drivers / agents. Always include a "PMS driver version is the
   limiting factor, not the chip" callout.

6. **`"Security update — {CVE name and number}"`** — **mandatory if the
   vendor has a public security disclosure** (Saflok has CVE-2024-29916;
   check Onity / VingCard / SALTO for equivalents during their rewrite —
   most do not, in which case omit this section). When included: short
   intro, two-paragraph technical explanation, an actionable procurement
   callout.

7. **`"Common field failure modes"`** — 5–7 bullets. Should read like a
   support-engineer's troubleshooting list: sector-key mismatch, encoder
   firmware mismatch, antenna / material issues, sector-0 collision with
   third-party apps, etc. This is the most snippet-worthy section for AI
   answer engines.

8. **`"Card material and thickness constraints"`** — 5–6 bullets covering
   ISO/IEC 7810 ID-1 baseline (0.76 mm), tolerance for premium PVC / wood /
   bamboo / metal-edge cards, dual-interface stack thickness, vendor-
   specific reader-tolerance behaviour.

9. **`"What to validate before scaling"`** — 5 bullets, opinionated.
   Always includes: test on at least N generations of door controller,
   exercise full PMS round-trip (issue → extend → re-encode → cancel),
   log firmware versions, magstripe-track-format verification, small first
   production batch.

### Resource cards (4 cards, ordered)

1. **Card products that ship on {vendor}** — links to relevant SKUs.
2. **Related guides and comparisons** — internal links to `/guides/*` and
   `/compare/*` pages relevant to the decision.
3. **Related editorial** — `/blog/*` background articles.
4. **Platform references** — external links to manufacturer product pages.
   These are user-facing references, not citations (`sources[]` is for citations).

### FAQ (minimum 7 questions)

Required FAQ archetypes (paraphrase per vendor):

- "How do I identify the {vendor} lock generation before ordering cards?"
- "Can I put DESFire EV3 on a {vendor} estate that still has Classic-era doors?"
- "Does {vendor} use sector 0 of MIFARE Classic cards?" (or analogous chip-internals question)
- "Will premium-material cards (1.0 mm bamboo/wood) read reliably on {vendor}?"
- "What PMS systems are certified on {vendor}?"
- "How do I handle a magstripe → RFID migration window?"
- "What is the difference between {vendor's Gen I and Gen II encoder}?"

If a CVE exists, add:
- "Is the {CVE name/number} vulnerability still a concern for new card orders?"
- "Does {chip-family backward compatibility note} still apply for {vendor's current generation}?"

### `sources[]` — at least 12 entries, mandatory

Every page must have a populated `sources` array. Citation tiers:

- **Tier 1 (manufacturer + standards body)**: vendor's product pages, any
  vendor datasheets (PDFs), ISO/IEC standards (`iso.org/standard/XYZ`),
  NXP chip datasheets. The non-negotiable foundation.
- **Tier 2 (security disclosure)**: NVD / CVE entries, researcher
  publications (KU Leuven, university affiliations), authoritative
  security press (Wired, SecurityWeek, The Register, ASIS).
- **Tier 3 (trade press + integration partners)**: Hotel Management Magazine,
  Hospitality Net, Locksmith Ledger, integration partner pages (OpenKey,
  HID, PMS vendor KBs).

Each source entry follows the `sourceSchema` in `src/content.config.ts`:
```json
{
  "label": "Short human name",
  "url": "https://primary.host/exact-page",
  "publisher": "Organisation name",
  "publishedAt": "YYYY-MM-DD or YYYY",
  "accessedAt": "YYYY-MM-DD",
  "note": "What specific claim this source supports"
}
```

Sources MUST be on primary / authoritative hosts. Do NOT cite:
- Other reseller-OEM blogs (cardco, rfidcard, etc.) — they're competitors.
- Cached mirrors (manualslib, manua.ls) unless no primary source exists.
- Forums (except `community.nxp.com` for chip-vendor confirmation).

## SEO + AI-engine signals

The page already gets `Article` + `BreadcrumbList` JSON-LD from
`editorial-pages.ts` based on the editorial schema. The `sources[]` array
emits `Article.citation` entries — every Tier-1 source becomes a JSON-LD
citation, which is a known AI-engine ranking signal (Perplexity and Claude
both quote sources from `citation` arrays preferentially).

To strengthen further:
- Title contains a year (`Guide (2026)`) — small but measurable freshness signal.
- Hero summary is 60–80 words — Google snippet sweet spot.
- First FAQ question is the highest-volume buyer query for the vendor
  (rank #1 within `FAQPage` schema).
- Tables have explicit `<th scope="col">` (already emitted by
  `editorial-pages.ts` table renderer).
- Image alt text is descriptive and specific (not "card image").

## Vendor-specific notes

### Saflok (✅ rewritten May 2026)
- Reference implementation. 9 sections, 9 FAQs, 19 sources, 34.8 KB.
- Has CVE-2024-29916 ("Unsaflok") section.
- Includes Mobile Access section (LEGIC Connect, OpenKey precedent).
- Encoder table covers Gen I (74750) → Gen II (75720) supersession.

### Onity (348 lines today — moderate)
- Owned by Dormakaba. Major budget-and-mid-market footprint.
- Check for any 2024–2025 vulnerability disclosures; HT-series locks
  had a famous 2012 hack (Cody Brocious / DEF CON 20), which is now
  historic but worth a "Security update" section reference.
- Encoder track: Onity TestaR + Advance + HT-series; the encoder
  lifecycle is documented in Onity's training materials.
- Mobile: DirectKey app + recent BLE generations.

### VingCard (355 lines today — moderate)
- ASSA ABLOY brand. Major in resorts; "VingCard Classic" is the
  industry term for early offline magstripe hotel locks.
- Mobile: VingCard Mobile Access (formerly VingCard Mobile Key).
- Encoder track: Visionline back-end + VingCard Allure, Signature,
  Essence; the Visionline encoder family is the analogue of Saflok
  System 6000 / Ambiance.

### SALTO (139 lines — thin, big upgrade needed)
- Independent vendor (not ASSA ABLOY / Dormakaba). Fastest-growing in
  the independent / boutique segment.
- Back-ends: SALTO Space (on-premise) → SALTO KS (cloud) progression
  is the SALTO equivalent of Saflok System 6000 → Ambiance.
- Mobile: SALTO JustIN Mobile is the mobile-key brand.
- No major public CVE as of May 2026; omit security section.

### Be-Tech (139 lines — thin)
- Chinese manufacturer. Growing in budget hotels in APAC and EMEA.
- Less third-party documentation. Tier-1 sources will lean on
  Be-Tech's own product pages + datasheets.

### Hafele Dialock (139 lines — thin)
- German manufacturer. Strong in European serviced apartments and
  cruise/yacht markets.
- Back-end: Hafele Dialock Manager.
- Mobile: Dialock Mobile Access via the Dialock Smartphone Key.

### MIWA (139 lines — thin)
- Japanese manufacturer (MIWA Lock Co.). Strong in APAC, growing
  presence in premium independents.
- Back-end: MIWA RFID Hotel System.
- Lock series: ALA-D2, ALG, AL3 — generation taxonomy needs research.

## Production workflow per page

Estimated 2–3 hours per page:

1. **Research (45 min)** — competitive SERP scan, identify CVEs/disclosures,
   collect manufacturer product page URLs, datasheet PDFs, integration
   partner pages. Output: a `sources[]` skeleton with 12–18 entries
   and a gap list against the current page.

2. **Generation table + chip-family matrix (30 min)** — these are the
   highest-value sections; get them right first.

3. **Encoder stack + Mobile Access + PMS + (optional) Security update
   (45 min)** — supporting sections.

4. **Field failures + Material constraints + Validation checklist (20 min)** —
   often mostly portable from Saflok with vendor-specific edits.

5. **FAQ (20 min)** — at least 7 questions; reuse archetypes from this spec.

6. **Cross-link audit (10 min)** — every `/products/`, `/compare/`,
   `/guides/`, `/blog/` mention should be a real route. Use `npm run dev`
   + click-through to catch dead links.

7. **JSON validation (5 min)** — `node -e "JSON.parse(require('fs').readFileSync('PATH','utf8'))"` before commit.
