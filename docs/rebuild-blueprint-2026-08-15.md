# Proudtek verification-first rebuild blueprint

Date: 2026-08-15

## Mission

Progressively rebuild Proudtek as the verification-first RFID/NFC manufacturing platform for global procurement teams while preserving the current domain, indexed URLs, canonical signals, structured data, verified claims, machine-readable routes, redirects and rollback capability.

The rebuild is not a visual reskin. It is a procurement platform migration: discovery, comparison, evidence, samples and RFQ must become one coherent decision path.

## Non-negotiable constraints

The existing 595 build outputs remain the deployment contract until an explicitly reviewed migration changes one. Existing canonical URLs, sitemap membership, schema entity IDs, redirect behavior and verified specifications are frozen by default. Preview deployments must remain noindex. Production rollout is deterministic by route and build, never randomized by visitor.

No claim may imply that ISO certificates cover manufacturing operations when their published scope does not. Chip, certification, memory, standards, environmental and performance claims remain buyer-verifiable and require source-backed provenance.

## Target architecture

The target has four independent layers.

The Route Contract determines which URLs build, their canonical/redirect/noindex/404 role, renderer, sitemap membership, machine mirrors and rollout state.

The SEO Contract owns title, description, canonical, robots, Open Graph, JSON-LD, sitemap, image sitemap, site index and machine-readable outputs. It never branches based on shell design.

The native Astro SiteShell owns the header, desktop navigation, mobile navigation, footer, consent, global conversion entry points, accessibility landmarks and shell scripts. It replaces snapshot donor chrome route by route.

Page composers own the body: HomePage, ProductFamilyPage, SkuPage, IndustryPage, ComparisonPage, EvidencePage, SamplePackPage and RFQ. They consume structured data rather than WordPress chrome.

## Rollout model

Each route has independent shell, body and data states:

```ts
{
  route: "/guides/",
  shell: "snapshot" | "native",
  body: "snapshot" | "editorial" | "native-home" | "native-hub" | "native-rfq",
  data: "legacy" | "catalog-v2"
}
```

Global build-time kill switches provide immediate rollback:

```text
PROUDTEK_NATIVE_SHELL=0
PROUDTEK_HOME_V2=0
PROUDTEK_CATALOG_V2=0
```

Flags are exact-route and deterministic. They must not affect canonical, robots, schema or sitemap membership.

## Design direction

The existing DESIGN.md and codex tokens remain authoritative. The visual identity evolves rather than resets.

The subject is industrial RFID/NFC procurement. The audience is a global buyer, engineer or integrator qualifying a supplier. The homepage's single job is to move that buyer from an operating constraint to a verifiable specification, sample plan or RFQ.

The palette remains the existing warm editorial procurement core: dark brown `#291c0e`, gold `#c39a5f`, warm surface, action cyan `#1fcefb`, procurement navy `#1f4e79`, and verified-status green `#1f6f3a`. Lora remains the restrained editorial display face, Inter the body face, and the mono token the utility/data face.

The signature element is a procurement evidence rail: every major promise is visibly classified as verified source, company-stated fact, available on request or pending evidence. This encodes truth status rather than adding decoration.

The homepage layout is a specification pathway, not a generic corporate landing page:

```text
┌─ Header / procurement navigation ─────────────────────┐
│ Hero thesis + project inputs      │ RFQ outcome panel │
├─ Evidence rail: claim · scope · verification ─────────┤
├─ Start by: product · application · compare · system ──┤
├─ Six product families + procurement constraints ──────┤
├─ Qualification matrix: frequency/material/environment ┤
├─ Proof, not promises: certificates/tests/cases ───────┤
├─ Sample-to-production workflow ───────────────────────┤
├─ Compare / case / compliance pathways ────────────────┤
├─ Compact brief → prefilled full RFQ ──────────────────┤
└─ Native footer / supplier qualification links ────────┘
```

The deliberate visual risk is making evidence status a first-class interface language across marketing pages. It is justified because verification is the positioning, not an ornamental theme.

## Information architecture

Existing canonical paths remain stable:

```text
/products/all/
/products/{family}/
/products/{family}/{sku}/
/industries/{industry}/
/solutions/{solution}/
/compare/{comparison}/
/compatibility/{system}/
/case-studies/
/about/certifications/
/about/factory/
/sample-pack/
/rfq/
/guides/{guide}/
/blog/{post}/
```

Evidence begins as a cross-page data entity and component family. A new `/evidence/` canonical is deferred until search-intent overlap with case studies and certifications is assessed.

## Target data model

Core entities are ProductFamily, SKU, Industry, Comparison, Claim, Evidence, SamplePack and RfqIntent. Claim provenance is mandatory.

```ts
type VerificationStatus =
  | "verified-primary-source"
  | "verified-third-party"
  | "company-stated"
  | "available-on-request"
  | "needs-evidence"
  | "rejected";

interface Claim {
  id: string;
  statement: string;
  status: VerificationStatus;
  subjectId: string;
  scope?: string;
  sourceIds: string[];
  validFrom?: string;
  expiresAt?: string;
  lastVerifiedAt?: string;
}
```

RFQ intent must accept context from products, industries, comparisons and sample selection without duplicating form implementations.

## Migration sequence

### PR-00 — Site and SEO contract

Generate a committed baseline describing every current output route, role, canonical, robots, title, schema types/IDs, sitemap membership, image sitemap membership, machine routes and main-content hash. CI fails on unapproved drift.

### PR-01 — Route and rollout registry

Create one source of truth for native routes, redirects and exact-route rollout. Existing outputs remain unchanged.

### PR-02 — Native SiteShell dark launch

Build SiteHeader, DesktopNav, MobileNav, SiteFooter, SiteShell and PageFrameLayout using existing menu data and codex tokens. Preserve legacy DOM hooks initially. No production route switches.

### PR-03 — Canary shell rollout

Move low-risk routes, then native hubs, to SiteShell using exact-route flags. Validate URL/SEO contract, accessibility, visual regression and performance after each batch.

### PR-04 — Native procurement homepage

Replace the homepage body behind `PROUDTEK_HOME_V2`. Preserve `/`, canonical, sitemap membership and stable Organization/WebSite/WebPage entity IDs. Only homepage main-content changes are allowlisted.

### PR-05 — Catalog v2 data model

Add structured family, SKU, industry, comparison, claims and evidence collections without changing production rendering.

### PR-06 — Product family and SKU migration

Migrate one family at a time: readers, keyfobs, cards, wristbands, labels, tags. Preserve every canonical and legacy redirect.

### PR-07 — Industry and solution composers

Move project pages to operating problem, recommended architecture, product set, assumptions, test plan, deployment, evidence, compliance context and RFQ.

### PR-08 — Compare Builder

Add candidate selection, difference highlighting, recommendation rules, evidence and RFQ/sample prefill while preserving comparison canonicals.

### PR-09 — Evidence and supplier qualification

Create evidence-backed case, certificate, factory, test and compliance components. Do not expose unsupported numbers in visible copy or JSON-LD.

### PR-10 — Sample Basket and RFQ components

Unify sample selection and full RFQ around one typed intent schema, preserving Formspree, no-JS fallback and attribution.

### PR-11 — Snapshot chrome retirement

Only after all routes use native shell: remove donor extraction, main regex splitting and Kadence chrome injection. Keep immutable deployment rollback.

## Acceptance gates

Every PR runs lint, chip-claims lint, placeholder-drift lint, tests, Astro check, production build, site-contract audit, SEO-contract audit and redirect audit.

Shell-only PRs must keep the 595 output-path set, canonical set, robots set, sitemap set, JSON-LD type/ID set, redirect map, machine route set and main-content hashes unchanged.

Homepage migration may change only the homepage main-content hash. Product and content migrations require explicit route allowlists and verified-claim equivalence.

Accessibility requires one H1, complete landmarks, keyboard-operable navigation, focus restoration, 44px targets, reduced motion and current breakpoint discipline. Visual code may not introduce raw token-replaceable colors, off-grid spacing, magic z-index values or ad-hoc shadows.

## Evidence gaps requiring owner input

The platform can label missing evidence but cannot invent it. Owner inputs remain required for factory photos/video, equipment and capacity records, test procedures, valid certificate files and scope, SKU datasheets, MOQ/price/lead-time rules, customer disclosure permission, NDA policy, sample/RFQ SLA and sales workflow.

## Success metrics

The first success criterion is migration safety: zero unintended URL, canonical, schema, sitemap or redirect loss.

Commercial success is measured by product-path completion, compare-to-RFQ rate, RFQ start/completion, sample-to-RFQ conversion, certification verification clicks, qualified lead rate and response SLA.

Search growth is measured separately through non-brand impressions, indexed canonical pages, query-cluster rankings, external references and AI citation visibility.
