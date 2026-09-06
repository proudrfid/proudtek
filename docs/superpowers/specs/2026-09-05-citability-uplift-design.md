# Citability uplift — homepage, About, Certifications, sample policy (design)

Date: 2026-09-05 · Author: Claude (Fable 5.1) · Status: draft for implementation

## 1. Problem

An external answer-engine diagnosis (2026-09-05) concluded that proudtek.com is
"easy for machines to read but easy for machines to misquote". Its findings,
checked against the live site and the repository on 2026-09-05:

| Diagnosis finding | Live / repo state on 2026-09-05 | Still open? |
| --- | --- | --- |
| Homepage repeats unevidenced numbers (two factories, 10 lines, 305 machines, 8 patents, 12 inspections, 10 % R&D) | Already stripped by `applyHomepageClaimCorrections` in `src/lib/render-snapshot.ts` (Phase 14). Raw snapshot JSON still carries them but they never render. | No (guard with a test) |
| "ISO 9001 Certified Factory" wording exceeds certificate scope | Trust strip, llms.txt and certifications page already scope-accurate | No (guard with a test) |
| Homepage marketing adjectives ("meticulous craftsmanship", "cutting-edge design", "Proven Reliability", "superior … molds") | Live | **Yes** |
| "complete RFID hardware suites … seamless compatibility" | Live | **Yes** |
| "Our Chip Partners" implies vendor partnership | Live | **Yes** |
| Testimonials shown as "Trusted by Clients Worldwide" with no disclosure | Live | **Yes** |
| Sample policy told five different ways (8–12 SKU / 5–10 days; 2–3 SKU / 5–20 pcs / 3–6 days; 5–7 working days; "1 day reply" vs "2–4 h") | Live on `/`, `/sample-pack/`, `/faq/`, machine mirror of `/` | **Yes** |
| About page competitive claims (15–30 % trading markup, "no middlemen", "single biggest lever", "no premium for non-standard") | Live in `about.json` + `supply-chain.svg` | **Yes** |
| DPP / Battery Regulation / FSMA / DSCSA / Walmart stated as product compliance | Live in `about.json`, `certifications.json` | **Yes** |
| "Every SKU built to a standard … tested against NFC Forum reference devices", "Auburn ARC-graded inlays", "FCC IDs per SKU" | Live in `certifications.json` | **Yes** |
| No evidence tier labels; generic references do not support specific claims | Fact registry exists only as a markdown doc; no rendered evidence status on About/Factory | **Yes** |
| Methodology page says wash-durability testing is in-house; Factory page says it is per programme on partner lines / third-party labs | Contradiction in repo | **Yes** |
| Review board should name people | Owner decided 2026-09-02 (D-06) to credit functions, not individuals | Out of scope (owner decision) |
| Company numbers need owner evidence (patents, factories, clients) | Owner evidence not supplied | Out of scope (cannot fabricate) |

## 2. Goals and non-goals

Goals

1. Every remaining company/product claim on `/`, `/about/`, `/about/factory/`,
   `/about/certifications/`, `/about/methodology/`, `/sample-pack/`, `/faq/`
   carries a scope, a condition or an evidence label an answer engine can quote
   without turning it into a guarantee.
2. One sample policy and one response-time promise, sourced from
   `ORGANIZATION_OPERATIONS` / `COMMERCIAL_TERMS` in `src/lib/seo-content.ts`,
   repeated verbatim on every surface.
3. Evidence tiers become a rendered, reusable primitive (an `evidenceCards`
   section block) rather than prose.
4. A regression test keeps retired claims from coming back.

Non-goals

- Do not switch the homepage to the V2 native body (`PROUDTEK_HOME_V2`); that is
  an owner visual sign-off. Keep `home-v2.ts` consistent so either body is safe.
- Do not add facts that need owner evidence (patent numbers, factory addresses,
  client counts, per-SKU bench data). Where evidence is absent, narrow or remove.
- Do not touch legal pages, redirects, schema generators, nav, or case studies.
- Do not mass-edit 199 product pages by hand.

## 3. Design

### 3.1 Evidence tiers (single vocabulary)

New module `src/data/evidence-tiers.ts` exporting the eight labels from the
diagnosis, each with a short buyer-facing gloss:

`OFFICIAL_STANDARD`, `CHIP_VENDOR_DATASHEET`, `THIRD_PARTY_TEST`,
`PROUD_TEK_INTERNAL_TEST`, `PROUD_TEK_SELF_REPORTED`, `COMMERCIAL_POLICY`,
`GENERAL_EXPLANATION`, `UNSUPPORTED`.

Used by: the `evidenceCards` block (below), the homepage evidence strip, and a
new "Evidence tiers used on this site" section on `/about/methodology/`.

### 3.2 `evidenceCards` editorial block

Schema (`src/lib/editorial-types.ts` + `src/content.config.ts`):

```ts
evidenceCards?: Array<{
  claim: string;          // "Founded 2008 in Shenzhen"
  tier: EvidenceTier;     // "PROUD_TEK_SELF_REPORTED"
  evidence: string;       // what supports it, what is missing
  href?: string;          // where to verify
  linkLabel?: string;
}>;
```

Component `src/components/editorial/EvidenceCards.astro` renders a `<ul>` of
cards: claim (strong), tier pill (label + gloss as `title`), evidence sentence,
optional verify link. Rendered by `EditorialSection.astro` after `statBar`.
Styling reuses stat-bar/trust tokens (`--codex-bg-warm`, gold top rule,
`--codex-radius-card`, `--codex-space-*`); no new hex, z-index or shadows.

Content: About "Numbers buyers usually want first" (4 cards), Factory
"Capacity and responsibility" (3 cards), Certifications "Certifications Proud
Tek holds" (1 card explaining how to read the table's evidence).

### 3.3 Homepage (live WordPress snapshot) — `applyHomepageCitabilityPass`

New transform in `src/lib/render-snapshot.ts`, run right after
`applyHomepageClaimCorrections`, every mutation guarded by a text match:

1. Capabilities: remove the "We prioritize meticulous craftsmanship…" paragraph;
   "Comprehensive Manufacturing Excellence" → "What we own, and what runs on
   partner lines"; its blurb → one plain sentence linking to `/about/factory/`.
   QC paragraph: "under ISO 9001 documented procedures" → "under our documented
   QC procedures (our ISO 9001 certificate covers the sales and
   supplier-management operation)".
2. "UNIQUE SERVICE" six feature texts rewritten to conditional, concrete
   wording. Hardware Integration becomes: "We configure and validate selected
   tags, readers, antennas and encoders against the buyer's stated environment.
   Final compatibility depends on the reader model, firmware, antenna setup,
   encoding and application software — confirmed with samples, not assumed."
   Superlatives ("top industry experts", "superior … molds", "exacting
   standards") removed.
3. "WHAT MAKES US DIFFERENT" row removed and replaced by an evidence strip
   rendered from `HOME_EVIDENCE` (`src/data/home-v2.ts`, shared with V2,
   unchanged) — three cards: verified certificate (ISO 9001) / company-stated
   production model / documentation pack available per programme, each with
   its status label and link.
4. "OUR CHIP PARTNERS" → "Supported chip families"; blurb → "Chips we specify,
   stock and encode, bought through authorised distribution. 'Supported' means
   we have encoded and read-tested the family in Proud Tek products; it is not
   a vendor partnership. Family-by-family list on the About page." Logos kept.
5. "Trusted by Clients Worldwide" → "What customers wrote to us" plus a
   disclosure paragraph: "Excerpts from customer messages, shown with first
   name and country only. They are not independently verified reviews;
   named references are offered per programme."
6. Resource trio sample card (`render-blocks.ts`) and trust bar copy derive
   from `ORGANIZATION_OPERATIONS.samples` / `.response` so they cannot drift.

### 3.4 Sample policy and response promise — one source

Canonical (already in `ORGANIZATION_OPERATIONS`, rfidak-aligned 2026-09-02):

- Standard samples free for qualified B2B buyers; typically 2–3 SKUs, 5–20
  pieces across LF/HF/UHF; larger kits for qualified pilots.
- Prepared in 1 business day; express 2–5 days; buyer pays DHL/FedEx freight
  ($25–60), refunded against the first production order.
- Custom samples (encoding/printing/new housing) add 3–5 business days; the
  sample fee is credited against the production PO.
- First reply within 2–4 hours in Shenzhen business hours; written quote within
  24–48 hours, valid 30 days.

The "8–12 SKU pack" figure is retired everywhere (spec review 2026-09-05): it
described a different product than the 2–3 SKU / 5–20 piece policy and could
not coexist with one sentence. `formatSamplePolicy()` / `formatResponsePolicy()`
helpers in `seo-content.ts` return the one-sentence versions used by the trust
bar, resource trio and llms Quick facts; `home-v2.ts` carries no sample figures.

JSON surfaces hand-aligned to the same words: `lp/sample-pack.json` (statBar
"8–12 SKUs" → "2–3 SKUs · 5–20 pieces"; "5–10 days" → "3–6 business days";
"1 day specialist reply" → "2–4 h first reply"; timeline day 5–10 → 3–6),
`faq.json` (sample turnaround 5–7 working days → prepared 1 business day +
2–5 days express), editorial `index.json`: the sample bullet (5–7 working days
→ prepared in 1 business day), the FAQ production lead time (5–7 working days
→ the canonical 7–15 business days from `ORGANIZATION_OPERATIONS.leadTime`),
"no middleman markup" → manufacturing-partner wording, "declarations issued per
shipment" → sample-based test reports wording. No "5–7 working days" remains.

### 3.5 About page (`about.json`)

- Brief "Direct manufacturer — no middlemen, no markup layers" → "Manufacturing
  partner — specification, chip sourcing and QC in-house; production on
  contracted partner lines in Shenzhen." "more than 50 countries" → no count.
- "Manufacturer-direct vs trading-company" section → "Questions to ask any
  RFID supplier — and our answers". Compare panel columns become "Ask" /
  "Proud Tek's answer"; no percentage markups, no "single biggest lever".
  `public/diagrams/about/supply-chain.svg` text edited to drop "+15–30%
  markup" and "manufacturer price direct" (→ "price quoted per programme").
- "no premium for going non-standard" → "non-standard formats carry tooling
  and MOQ conditions quoted per programme".
- Chip section heroPoint adds "purchased through authorised distribution;
  vendor names mean supported families, not partnerships".
- DPP / Battery FAQ and the "EU regulatory readiness" bullet → tag-level role
  only: "we supply the data carrier and its documentation; passport or
  traceability compliance is a property of the whole system".
- "Numbers" section gains `evidenceCards`.

### 3.6 Certifications page (`about/certifications.json`)

- Air-interface intro: conformance is the chip vendor's; Proud Tek does not run
  NFC Forum / ISO conformance testing on finished articles; reader/lock
  interoperability is confirmed by sample.
- NFC Forum feature text: "NDEF per Type 2/4/5 tag specifications; phone reads
  checked on our bench, not NFC Forum certified".
- "Auburn ARC inlay performance specifications" and Walmart bullets/FAQ: ARC
  grading belongs to the inlay design and is supplied by the inlay maker;
  Walmart sandbox testing is the supplier's step, Proud Tek supplies encoded
  samples and documentation.
- FSMA 204 / DSCSA bullet: tags carry identifiers; compliance is the
  record-keeping system's property.
- "FCC IDs and CE technical files maintained per SKU" → reader devices only,
  supplied for the specific device.
- ECHA 30-day review → "target: within 30 days" (policy, not fact).
- Section gains one `evidenceCards` card explaining the table's evidence
  column.

### 3.7 Factory + Methodology

- Factory: `evidenceCards` for 100 % read-test (internal test, per-lot report
  ships with the order), 7-year records (self-reported, ISO 9001 clause), and
  production model (self-reported; verify by visit / partner-line certificate).
- Methodology: "What we test in-house" aligned with the factory page — read
  range, tap robustness, lock compatibility and issuance in the Shenzhen lab;
  wash durability arranged per programme on the partner line or at an
  accredited lab **under the protocol on this page**. New section "Evidence
  tiers used on this site" listing the eight labels with one-line meanings
  and the rule that every number states scope, unit, condition, date and
  source.

### 3.8 Testimonial disclosure (global)

`Testimonial.astro` appends a `<p class="codex-editorial-testimonial__note">`:
"Customer message reproduced with the customer's identifying details
withheld; not an independently verified review." Only one editorial page uses
the block today (`about.json`).

### 3.9 Regression test — `src/lib/__tests__/citability.test.ts`

1. Renders `src/data/pages/index.json` through `prepareSnapshot` +
   `buildPageSeo` and asserts: absent — "two self-owned", "305", "8+ Certified
   Patents", "10% of our annual profits", "meticulous craftsmanship",
   "cutting-edge design", "OUR CHIP PARTNERS", "seamless compatibility",
   "Proven Reliability", "Trusted by Clients Worldwide", "8–12-SKU"; present —
   "Supported chip families", "Company-stated", "not independently verified".
2. Scans `src/content/editorial/**/*.json`, `src/data/home-v2.ts`,
   `src/lib/seo-content.ts`, `src/lib/seo/render-blocks.ts` for a retired-claim
   denylist: "ISO 9001 Certified Factory", "SGS audited", "Chip Partners",
   "no middlemen", "15-30%", "15–30%", "20-30% markup", "Every order includes
   free samples", "5–7 working days" (samples), "seamless compatibility",
   "ARC-graded UHF inlays for Walmart".
3. Renders `EvidenceCards.astro` via the Astro container and checks tier label
   + verify link.

## 4. Verification

`npm run lint`, `npm run lint:chip-claims`, `npm run lint:chip-placeholder-drift`,
`npm run test`, `npm run build` (flag-less and with `PROUDTEK_HOME_V2=1`),
regenerate the editorial-pages snapshot fixtures (`npx vitest run -u` on the
three `editorial-pages-*.snapshot.test.ts` files, review the diff, commit the
`.snap` files), `npm run audit:site-contract` then `audit:site-contract:write` (main-text hashes
change on `/`, the About pages, `/sample-pack/`, `/faq/` and every page carrying
a testimonial), browser check of `/` and `/about/` via the dev server with a
screenshot of the new homepage evidence strip.

## 5. Rollback

One PR on branch `geo/citability-uplift`; each concern its own commit. Revert
per commit; content JSON reverts restore text and schema together.
