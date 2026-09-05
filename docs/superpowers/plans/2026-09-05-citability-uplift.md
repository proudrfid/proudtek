# Citability Uplift Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage, About cluster, sample-policy pages and FAQ safe to quote by answer engines: every claim scoped or labelled, one sample/response policy, evidence tiers rendered as a reusable block, and a regression test that keeps retired claims out.

**Architecture:** Three layers. (1) Constants: `src/lib/seo-content.ts` stays the single fact source; a new `src/data/evidence-tiers.ts` names the eight evidence tiers. (2) Rendering: a new `evidenceCards` editorial block (schema + `EvidenceCards.astro`), a homepage citability transform in `src/lib/render-snapshot.ts` that rewrites the live WordPress snapshot body, and shared copy helpers in `render-blocks.ts`. (3) Content: hand-aligned JSON for `/about/`, `/about/factory/`, `/about/certifications/`, `/about/methodology/`, `/sample-pack/`, `/faq/`, editorial `index.json`. A vitest file pins all of it.

**Tech Stack:** Astro 6 (static), TypeScript, cheerio (snapshot transforms), vitest + `experimental_AstroContainer`, zod content schema.

**Spec:** `docs/superpowers/specs/2026-09-05-citability-uplift-design.md`

**Worktree:** `/tmp/pt-citability-f2b48a92` on branch `geo/citability-uplift` (node_modules symlinked to the main checkout). Run every command from that directory. Use absolute binaries (`/usr/bin/git`, `/usr/local/bin/npm` or `npm` in simple one-liners).

---

## File map

| File | Responsibility |
| --- | --- |
| `src/data/evidence-tiers.ts` (new) | Eight evidence tier ids + buyer-facing label/gloss |
| `src/lib/editorial-types.ts` | Add `EvidenceCard` type and `evidenceCards?` on `EditorialSectionData` |
| `src/content.config.ts` | zod: `evidenceCards` on `sectionSchema` |
| `src/components/editorial/EvidenceCards.astro` (new) | Renders the block |
| `src/components/editorial/EditorialSection.astro` | Mount `EvidenceCards` after `statBar` |
| `src/components/editorial/Testimonial.astro` | Disclosure note |
| `src/styles/codex-components.css` | `.codex-evidence-cards*`, `.codex-editorial-testimonial__note`, `.codex-home-evidence*` |
| `src/lib/seo-content.ts` | `ORGANIZATION_OPERATIONS.samples.kit` + `standardPack`, `formatSamplePolicy()`, `formatResponsePolicy()` |
| `src/lib/seo/render-blocks.ts` | Trust bar + resource trio use the helpers; `renderHomeEvidenceStrip()` |
| `src/lib/render-snapshot.ts` | `applyHomepageCitabilityPass()` |
| `src/data/home-v2.ts` | `HOME_EVIDENCE` reused by the strip; sample copy from helper |
| `src/lib/seo-feeds.ts` | Quick facts: sample + response policy lines |
| `src/content/editorial/about.json`, `about/factory.json`, `about/certifications.json`, `about/methodology.json`, `lp/sample-pack.json`, `faq.json`, `index.json` | Content alignment |
| `public/diagrams/about/supply-chain.svg` | Remove markup percentage text |
| `src/lib/__tests__/citability.test.ts` (new) | Homepage render + denylist + component test |

---

### Task 1: Evidence tiers module + `evidenceCards` block (schema, component, style)

**Files:**
- Create: `src/data/evidence-tiers.ts`
- Modify: `src/lib/editorial-types.ts:21-52`
- Modify: `src/content.config.ts:64-116`
- Create: `src/components/editorial/EvidenceCards.astro`
- Modify: `src/components/editorial/EditorialSection.astro`
- Modify: `src/styles/codex-components.css` (append after `.codex-editorial-stat-bar__label` block)
- Test: `src/lib/__tests__/citability.test.ts` (component part)

- [ ] **Step 1: Write the failing component test**

```ts
// src/lib/__tests__/citability.test.ts (first describe block)
import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import EvidenceCards from "../../components/editorial/EvidenceCards.astro";

describe("EvidenceCards block", () => {
  it("renders claim, tier label and verify link", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(EvidenceCards, {
      props: {
        cards: [
          { claim: "Founded 2008", tier: "PROUD_TEK_SELF_REPORTED", evidence: "Registration extract not yet published.", href: "/about/", linkLabel: "About" },
        ],
      },
    });
    expect(html).toContain("Founded 2008");
    expect(html).toContain("Company-stated");
    expect(html).toContain('href="/about/"');
    expect(html).toContain("codex-evidence-cards");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/citability.test.ts`
Expected: FAIL — cannot resolve `EvidenceCards.astro`.

- [ ] **Step 3: Create `src/data/evidence-tiers.ts`**

```ts
/**
 * Evidence tiers — the single vocabulary for "how do we know this?" labels on
 * proudtek.com. Introduced 2026-09-05 after the external answer-engine
 * diagnosis: a number without scope, condition and source is "false
 * precision", and an answer engine will quote it as a guarantee.
 */
export const EVIDENCE_TIERS = {
  OFFICIAL_STANDARD: { label: "Official standard", gloss: "Taken from an ISO/IEC, GS1, NFC Forum or regulatory text; the standard is linked." },
  CHIP_VENDOR_DATASHEET: { label: "Chip-vendor datasheet", gloss: "A chip-level value from the vendor's datasheet; finished-product performance can differ." },
  THIRD_PARTY_TEST: { label: "Third-party test", gloss: "A certificate or report issued by an external registrar or laboratory; number and scope published." },
  PROUD_TEK_INTERNAL_TEST: { label: "Proud Tek internal test", gloss: "Measured by Proud Tek under the protocol on /about/methodology/; not independently audited." },
  PROUD_TEK_SELF_REPORTED: { label: "Company-stated", gloss: "Our own operational statement; verify by document request, visit or audit." },
  COMMERCIAL_POLICY: { label: "Commercial policy", gloss: "How we currently do business; confirmed in writing in every quotation." },
  GENERAL_EXPLANATION: { label: "General explanation", gloss: "Background about how the technology works; not a claim about a Proud Tek product." },
  UNSUPPORTED: { label: "Unsupported", gloss: "No evidence on file; treat as a question to ask us, not a fact." },
} as const;

export type EvidenceTier = keyof typeof EVIDENCE_TIERS;
export const EVIDENCE_TIER_IDS = Object.keys(EVIDENCE_TIERS) as EvidenceTier[];
```

- [ ] **Step 4: Extend the editorial type and zod schema**

`src/lib/editorial-types.ts`: add near the top
```ts
import type { EvidenceTier } from "../data/evidence-tiers";
export interface EvidenceCard { claim: string; tier: EvidenceTier; evidence: string; href?: string; linkLabel?: string; }
```
and inside `EditorialSectionData` after `statBar?`:
```ts
  evidenceCards?: EvidenceCard[];
```
`src/content.config.ts`: after `statBar` in `sectionSchema`:
```ts
  evidenceCards: z
    .array(
      z.object({
        claim: z.string(),
        tier: z.enum(["OFFICIAL_STANDARD", "CHIP_VENDOR_DATASHEET", "THIRD_PARTY_TEST", "PROUD_TEK_INTERNAL_TEST", "PROUD_TEK_SELF_REPORTED", "COMMERCIAL_POLICY", "GENERAL_EXPLANATION", "UNSUPPORTED"]),
        evidence: z.string(),
        href: z.string().optional(),
        linkLabel: z.string().optional(),
      }),
    )
    .optional(),
```

- [ ] **Step 5: Create `EvidenceCards.astro`**

```astro
---
/**
 * Editorial section variant — claim / evidence-tier / how-to-verify cards.
 * Schema: src/lib/editorial-types.ts → EditorialSectionData["evidenceCards"]
 * Tiers: src/data/evidence-tiers.ts
 */
import { EVIDENCE_TIERS } from "../../data/evidence-tiers";
import type { EvidenceCard } from "../../lib/editorial-types";

interface Props { cards: EvidenceCard[]; }
const { cards } = Astro.props;
---
{cards.length > 0 && (
  <ul class="codex-evidence-cards" role="list" aria-label="Claims and the evidence behind them">
    {cards.map((card) => {
      const tier = EVIDENCE_TIERS[card.tier];
      return (
        <li class="codex-evidence-cards__card" data-evidence-tier={card.tier}>
          <p class="codex-evidence-cards__tier" title={tier.gloss}>{tier.label}</p>
          <p class="codex-evidence-cards__claim">{card.claim}</p>
          <p class="codex-evidence-cards__evidence">{card.evidence}</p>
          {card.href && <a class="codex-evidence-cards__link" href={card.href}>{card.linkLabel ?? "Verify"} <span aria-hidden="true">→</span></a>}
        </li>
      );
    })}
  </ul>
)}
```

- [ ] **Step 6: Mount in `EditorialSection.astro`** — import `EvidenceCards` and add after the `statBar` line:
```astro
  {section.evidenceCards?.length && <EvidenceCards cards={section.evidenceCards} />}
```
Update the rendering-order comment (3a. evidenceCards).

- [ ] **Step 7: CSS** (tokens only; append after the stat-bar rules):
```css
/* Evidence cards (2026-09-05 citability uplift) — claim / tier / verify */
.codex-evidence-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--codex-space-3);
  margin: var(--codex-space-4) 0;
  padding: 0;
  list-style: none;
}
.codex-evidence-cards__card {
  display: flex;
  flex-direction: column;
  gap: var(--codex-space-2);
  padding: var(--codex-space-4) var(--codex-space-5);
  background: var(--codex-surface);
  border: 1px solid var(--codex-border);
  border-top: 3px solid var(--codex-gold);
  border-radius: var(--codex-radius-card);
  box-shadow: var(--codex-elevation-rest);
}
.codex-evidence-cards__tier {
  margin: 0;
  font-size: var(--codex-text-xs);
  font-weight: var(--codex-weight-bold, 700);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--codex-gold-muted);
}
.codex-evidence-cards__card[data-evidence-tier="THIRD_PARTY_TEST"] .codex-evidence-cards__tier,
.codex-evidence-cards__card[data-evidence-tier="OFFICIAL_STANDARD"] .codex-evidence-cards__tier { color: var(--codex-success); }
.codex-evidence-cards__card[data-evidence-tier="UNSUPPORTED"] .codex-evidence-cards__tier { color: var(--codex-error); }
.codex-evidence-cards__claim {
  margin: 0;
  font-family: var(--codex-font-heading);
  font-size: var(--codex-text-lg);
  line-height: var(--codex-leading-snug);
  color: var(--codex-text);
}
.codex-evidence-cards__evidence {
  margin: 0;
  font-size: var(--codex-text-sm-plus);
  line-height: var(--codex-leading-relaxed);
  color: var(--codex-text-muted);
}
.codex-evidence-cards__link {
  margin-top: auto;
  padding-top: var(--codex-space-2);
  font-size: var(--codex-text-sm);
  font-weight: var(--codex-weight-semibold, 600);
  color: var(--codex-color-accent);
  text-decoration: none;
}
.codex-evidence-cards__link:hover { text-decoration: underline; }
```

- [ ] **Step 8: Run test** — `npx vitest run src/lib/__tests__/citability.test.ts` → PASS.

- [ ] **Step 9: Commit**
```bash
/usr/bin/git add src/data/evidence-tiers.ts src/lib/editorial-types.ts src/content.config.ts src/components/editorial/EvidenceCards.astro src/components/editorial/EditorialSection.astro src/styles/codex-components.css src/lib/__tests__/citability.test.ts
/usr/bin/git commit -m "feat(editorial): evidenceCards block + evidence tier vocabulary"
```

---

### Task 2: One sample policy / response policy (constants + helpers + TS surfaces)

**Files:**
- Modify: `src/lib/seo-content.ts:123-152` (COMMERCIAL_TERMS), `:247-290` (ORGANIZATION_OPERATIONS)
- Modify: `src/lib/seo/render-blocks.ts:27-42, 153-208`
- Modify: `src/data/home-v2.ts` (no sample figures today — leave; import nothing)
- Modify: `src/components/editorial/TrustSignals.astro` note sentence
- Modify: `src/lib/seo-feeds.ts` Quick facts
- Test: `src/lib/__tests__/citability.test.ts` (denylist part, see Task 5) + inline unit test for the helper

- [ ] **Step 1: Failing test for the helper**
```ts
import { formatSamplePolicy, formatResponsePolicy } from "../seo-content";
describe("policy sentences", () => {
  it("states the one sample policy", () => {
    const s = formatSamplePolicy();
    expect(s).toContain("2–3 SKUs");
    expect(s).toContain("$25–60");
    expect(s).toContain("1 business day");
    expect(formatResponsePolicy()).toContain("24–48 hours");
  });
});
```
- [ ] **Step 2: Run → FAIL (export missing).**
- [ ] **Step 3: Implement in `seo-content.ts`** — in `ORGANIZATION_OPERATIONS.samples` add `standardPack: "the full LF / HF / UHF stock pack is 8–12 SKUs (one to a few pieces each) when you ask for it"`, and export:
```ts
export function formatSamplePolicy(): string {
  return "Standard samples are free for qualified B2B buyers — typically 2–3 SKUs, 5–20 pieces across LF / HF / UHF (the full stock pack is 8–12 SKUs on request; larger kits for qualified pilots). Prepared in 1 business day; you cover DHL/FedEx freight ($25–60), refunded against your first production order. Custom samples (encoding, printing or a new housing) add 3–5 business days and a sample fee credited against the production PO.";
}
export function formatResponsePolicy(): string {
  return "First reply within 2–4 hours in Shenzhen business hours (Mon–Fri, GMT+8); written quote within 24–48 hours, valid 30 days.";
}
```
Keep `COMMERCIAL_TERMS.items[Samples].value` and `[Response].value` referencing the same figures (use the helpers' shortened forms; do not introduce new numbers).
- [ ] **Step 4: Use the helper** — `render-blocks.ts` resource-trio sample card description → `formatSamplePolicy()` short form: "Hold the chip first: standard samples are free for qualified B2B buyers (typically 2–3 SKUs, 5–20 pieces across LF / HF / UHF), prepared in 1 business day; you cover DHL/FedEx freight, refunded against your first production order."; trust bar "Free samples / Test before production" → "Free stock samples / Freight at your cost". `TrustSignals.astro` note keeps its sentence (already aligned). `seo-feeds.ts` Quick facts: add `- Sample policy: ${formatSamplePolicy()}` and `- Response: ${formatResponsePolicy()}`.
- [ ] **Step 5: Run tests → PASS. Commit** `fix(policy): one sample and response policy across TS surfaces`.

---

### Task 3: Homepage citability pass (snapshot transform + evidence strip)

**Files:**
- Modify: `src/lib/render-snapshot.ts` (add `applyHomepageCitabilityPass`, call it right after `applyHomepageClaimCorrections` at ~line 313)
- Modify: `src/lib/seo/render-blocks.ts` (add `renderHomeEvidenceStrip()` using `HOME_EVIDENCE` from `../../data/home-v2`)
- Modify: `src/styles/codex-components.css` (`.codex-home-evidence*`)
- Test: `src/lib/__tests__/citability.test.ts` (homepage render block)

- [ ] **Step 1: Failing test** — render `src/data/pages/index.json` through `prepareSnapshot` + `buildPageSeo` (pattern from `contact-form-formspree.smoke.test.ts`); assert absent: `meticulous craftsmanship`, `cutting-edge design`, `OUR CHIP PARTNERS`, `seamless compatibility`, `complete RFID hardware suites`, `Proven Reliability`, `WHAT MAKES US DIFFERENT`, `Trusted by Clients Worldwide`, `two self-owned`, `305`, `8+ Certified Patents`, `10% of our annual profits`, `Comprehensive Manufacturing Excellence`, `top industry experts`; assert present: `Supported chip families`, `What customers wrote to us`, `not independently verified`, `codex-home-evidence`, `Company-stated`, `depends on the reader model`.
- [ ] **Step 2: Run → FAIL.**
- [ ] **Step 3: Implement `applyHomepageCitabilityPass($body)`** — all cheerio, all guarded:
  1. `p` whose text starts with `We prioritize meticulous craftsmanship` → remove.
  2. `h4` text `Comprehensive Manufacturing Excellence` → `What we own, and what runs on partner lines`; the following `p` starting `We combine robust infrastructure` → `Specification, chip sourcing, first-article approval and QC are ours; tooling, lamination, printing and encoding run on contracted partner lines in Shenzhen. <a href="/about/factory/">Who does what, step by step →</a>`.
  3. QC paragraph (`<strong>3. Quality Control</strong>` set by the earlier pass): replace `under ISO 9001 documented procedures` with `under our documented QC procedures (our ISO 9001 certificate covers the sales and supplier-management operation)`.
  4. Feature paragraphs in the UNIQUE SERVICE row, matched by the preceding `h3` text:
     - Hardware Integration → "We configure and validate selected tags, readers, antennas and encoders against the buyer's stated environment. Final compatibility depends on the reader model, firmware, antenna setup, encoding and application software — it is confirmed with samples, not assumed."
     - product development → "Our RF and production engineering turns a brief into a manufacturable specification: chip family, antenna, material and encoding matched to the stated reader environment."
     - Performance Optimization → "Read range, orientation sensitivity and survivability depend on the surface, housing and duty cycle. We tune antenna and encapsulation per application and validate on your substrate before production."
     - Precision Mold Tooling → "Custom moulds are made on partner lines to our drawings; we approve the first article before any run."
     - Enclosure & Structural Design → "Injection-moulded and metal housings are designed to the application's mechanical, temperature and ingress requirements and sampled before tooling is released."
     - Tailored Branding Solutions → "Logo and artwork are applied to the approved proof; colour, position and durability are checked on the first article."
     - Branding & Personalization → keep (factual list of print methods), drop "Elevate your brand with our comprehensive customization services." sentence.
     - `h3` "product development" → "Product development" (capitalise).
  5. Row containing `h2` `WHAT MAKES US DIFFERENT` (`.kb-row-layout-id_774394-c4`, guard on heading text): `replaceWith(renderHomeEvidenceStrip())`.
  6. `h2` `OUR CHIP PARTNERS` → `Supported chip families`; following `p` starting `Through the repeated refinement` → "Chips we specify, stock and encode, bought through authorised distribution. 'Supported' means we have encoded and read-tested the family in Proud Tek products — it is not a vendor partnership. Family-by-family list on the <a href="/about/">About page</a>."
  7. `h3` `Trusted by Clients Worldwide` → `What customers wrote to us`, then insert after it `<p class="codex-home-testimonial-note">Excerpts from customer messages, shown with first name and country only. They are not independently verified reviews; named references are offered per programme.</p>`.
- [ ] **Step 4: `renderHomeEvidenceStrip()`** in `render-blocks.ts`:
```ts
export function renderHomeEvidenceStrip(): string {
  return `<section class="codex-home-evidence" aria-labelledby="codex-home-evidence-title">
    <div class="codex-home-evidence__header">
      <p class="codex-home-evidence__eyebrow">Proof, not adjectives</p>
      <h2 id="codex-home-evidence-title">What is verified, what is company-stated</h2>
      <p>Every claim on this site carries an evidence status. <a href="/about/methodology/#evidence-tiers">How to read the labels →</a></p>
    </div>
    <div class="codex-home-evidence__grid">
      ${HOME_EVIDENCE.map((item) => `<article class="codex-home-evidence__card"><p class="codex-home-evidence__status">${escapeXml(item.status)}</p><h3>${escapeXml(item.title)}</h3><p>${escapeXml(item.detail)}</p><a href="${escapeXml(item.href)}">${escapeXml(item.linkLabel)} <span aria-hidden="true">&rarr;</span></a></article>`).join("")}
    </div>
  </section>`;
}
```
Add a third/fourth card to `HOME_EVIDENCE` in `home-v2.ts`: status "Product-level certificate", title "OEKO-TEX STANDARD 100", detail "Certificate 23.HCN.97349 (Hohenstein, product class II) covers one article — our UHF laundry tag — valid Feb 2026 to Feb 2027.", href `/about/certifications/`. Keep the existing three.
- [ ] **Step 5: CSS** — `.codex-home-evidence` (warm band, `--codex-bg-warm`, padding `--codex-space-12` `4%`), `__grid` (auto-fit minmax(240px,1fr), gap space-4), `__card` (surface, border, radius-card, elevation-rest, flex column), `__status` (xs, bold, uppercase, success colour), `h3` heading font xl, `a` accent link margin-top auto, `.codex-home-testimonial-note` (sm-plus, muted, centred, max-width 70ch, margin auto). Mobile ≤600px: single column.
- [ ] **Step 6: Run test → PASS; run `npx vitest run` whole suite → PASS.**
- [ ] **Step 7: Commit** `feat(home): citability pass — evidence strip, conditional service copy, chip-family and testimonial disclosure`.

---

### Task 4: Content alignment (JSON + SVG)

**Files:** `src/content/editorial/about.json`, `about/factory.json`, `about/certifications.json`, `about/methodology.json`, `lp/sample-pack.json`, `faq.json`, `index.json`, `public/diagrams/about/supply-chain.svg`. Edit with a Python script per file (json load → mutate → dump with `ensure_ascii=False, indent=2` matching the existing style — check `git diff --stat` stays small) or targeted `Edit` calls.

- [ ] **Step 1: about.json** — apply spec §3.5 (brief items, section 2 rewrite to "Questions to ask any RFID supplier — and our answers" with compare panel headings "Ask any supplier" / "Proud Tek's answer", intro without percentages; section 7 intro "no premium" sentence; chip heroPoint; DPP FAQ + compliance bullet; add `evidenceCards` to "Numbers buyers usually want first":
  - Founded 2008, 18 years — PROUD_TEK_SELF_REPORTED — "Consistent across every Proud Tek property and our Made-in-China listing; the business-registration extract is not yet published. Ask for it with your supplier-qualification pack." href `/contact/`.
  - ISO 9001 / 14001 / 45001 — THIRD_PARTY_TEST — "Certificates 98026Q00274R000 / 98026E00200R000 / 98026S00203R000, issuer Anhui Certification and Inspection Co., Ltd; scope: sales service of smart cards and RFID tags; valid to 09 Jun 2029." href `/about/certifications/`.
  - 100 % functional read-test — PROUD_TEK_INTERNAL_TEST — "Every encoded unit is read-tested on the line and the lot's functional test report ships with the order; not audited by a third party." href `/about/factory/`.
  - Six product families — PROUD_TEK_SELF_REPORTED — "Catalogue count, generated from the product pages at build time." href `/products/all/`.
- [ ] **Step 2: supply-chain.svg** — replace text `+15–30% markup` → `markup and a queue you cannot see`, `manufacturer price direct` → `price quoted per programme`. Verify with `grep -c "15–30" public/diagrams/about/supply-chain.svg` → 0. Update the `image.alt` in about.json accordingly.
- [ ] **Step 3: certifications.json** — spec §3.6 edits (air-interface intro, NFC Forum feature, "Industry-specific encoding" ARC phrase, material-compliance 30-day target, regional-readiness bullets for DPP / Walmart / FSMA-DSCSA / FCC, Walmart FAQ) + one `evidenceCards` card on the first section: claim "How to read the table", tier THIRD_PARTY_TEST, evidence "Every row is a document issued by a registrar or laboratory; 'scope (as printed)' is the limit of what it proves. Nothing on this page is a Proud Tek self-assessment.", href `/about/methodology/#evidence-tiers`.
- [ ] **Step 4: factory.json** — `evidenceCards` on "Capacity and responsibility" (production model — PROUD_TEK_SELF_REPORTED, verify by visit / partner-line certificate; 100 % read-test — PROUD_TEK_INTERNAL_TEST; 7-year records — PROUD_TEK_SELF_REPORTED, ISO 9001 clause 7.5).
- [ ] **Step 5: methodology.json** — "What we test in-house" intro + first bullet aligned to factory model (wash durability arranged per programme under the protocol below); new final section `{"title":"Evidence tiers used on this site", "intro":"...", "table": {columns: ["Label","What it means","Example"], rows: 8 tiers}, "bullets": ["Every published number states scope, unit, condition, date or version, and source or test method.", "A typical result is never written as a guarantee; a product option is never written as a standard feature; a component property is never written as a finished-product rating; a compliance input is never written as full regulatory compliance."]}`. Section id will be derived from the title — confirm the anchor with `grep -o 'id="[^"]*evidence[^"]*"' dist/about/methodology/index.html` after build and adjust the `#evidence-tiers` links if the slug differs.
- [ ] **Step 6: sample-pack.json** — statBar → `2–3 / SKUs in a typical set (5–20 pieces)`, `1 day / Pack preparation`, `3–6 days / Door-to-door (DHL / FedEx)`, `LF·HF·UHF`; timeline "Day 5–10" → "Day 3–6"; brief "What is in the sample pack" label → "What can go in the pack (chosen with the specialist)" and add a first item "A typical set is 2–3 SKUs (5–20 pieces); the full stock pack below is 8–12 SKUs on request."; "Within 2-4 hours" timeline stays. Diagram alt "Step 2 … in 5–10 days" → "in 3–6 business days".
- [ ] **Step 7: faq.json** — "Sample turnaround: 5–7 working days …" → "Sample turnaround: standard samples prepared in 1 business day, express delivery 2–5 days; custom housings, encoding or printing add 3–5 business days." and the matching FAQ answer if one repeats it.
- [ ] **Step 8: index.json** (editorial `/`) — "Direct factory pricing: no middleman markup…" → "Manufacturing partner: specification, chip sourcing and QC in-house; production on contracted partner lines in Shenzhen — BOM breakdown on request."; "Sample-first sales motion: … 5–7 working days" → "prepared in 1 business day"; "Documentation discipline: RoHS, REACH, EU DPP, FCC, MIC and CE declarations issued per shipment" → "Documentation pack per shipment: sample-based RoHS, REACH SVHC and CE test reports (numbers on the certifications page), Certificate of Origin and the lot's functional test report; testing on your specification on request."; FAQ "How fast can samples arrive?" → aligned; FAQ "Do you provide compliance documentation?" → aligned (no "EU DPP technical files" as default).
- [ ] **Step 9: Run** `npx vitest run` and `node -e "JSON.parse(require('fs').readFileSync('src/content/editorial/about.json'))"` for each edited JSON. **Commit** `content(about,faq,lp): scope claims, one sample policy, evidence cards`.

---

### Task 5: Testimonial disclosure + retired-claim denylist test

**Files:** `src/components/editorial/Testimonial.astro`, `src/styles/codex-components.css`, `src/lib/__tests__/citability.test.ts`

- [ ] **Step 1: Failing test** — render `Testimonial.astro` via container → expect "not an independently verified review".
- [ ] **Step 2: Implement** — add after `<figcaption>`: `<p class="codex-editorial-testimonial__note">Customer message reproduced with identifying details withheld; not an independently verified review.</p>` + CSS (xs, muted, margin-top space-2).
- [ ] **Step 3: Denylist test** — walk `src/content/editorial/**/*.json`, plus `src/data/home-v2.ts`, `src/lib/seo-content.ts`, `src/lib/seo/render-blocks.ts`; for each retired phrase `["ISO 9001 Certified Factory","SGS audited","Chip Partners","no middlemen","15-30%","15–30%","20-30% markup","Every order includes free samples","seamless compatibility","ARC-graded UHF inlays for Walmart","5–7 working days for stocked chip","two self-owned factories","305+ "]` expect zero files. Exclude `src/content/editorial/_unused/`.
- [ ] **Step 4: Run → any hits are content still to fix (grep and fix), then PASS. Commit** `test(citability): retired-claim denylist + testimonial disclosure`.

---

### Task 6: Verification gates + PR

- [ ] `npm run lint` · `npm run lint:chip-claims` · `npm run lint:chip-placeholder-drift` · `npm run test` — all green.
- [ ] `npm run build` (flag-less) and `PROUDTEK_HOME_V2=1 npm run build` — both succeed; `grep -c "codex-home-evidence" dist/index.html` ≥ 1 in the flag-less build.
- [ ] `npm run audit:site-contract` → expect `MAIN_TEXT` diffs only on `/`, about pages, `/sample-pack/`, `/faq/`, machine mirrors; then `npm run audit:site-contract:write` and commit `chore(contract): rebaseline after citability uplift`.
- [ ] Browser check via `preview_start` on the worktree dev server (or `npm run preview`): `/` evidence strip + chip families + testimonial note; `/about/` evidence cards; screenshot.
- [ ] Update `docs/inquiry-plan/fact-registry.md` with the reconciled sample policy and a pointer to `evidence-tiers.ts`; commit.
- [ ] `/usr/bin/git push -u origin geo/citability-uplift` then `gh pr create` with the summary, evidence table and the list of remaining owner-evidence items (patents, factory documents, client counts, per-SKU bench data).
