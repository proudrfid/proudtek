import fs from "node:fs/promises";
import path from "node:path";
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/* ── WordPress snapshot page metadata ──────────────────────────────── */

/**
 * Custom loader that reads the lightweight site-meta.json index (~200KB)
 * instead of globbing all 1,611 page JSON files (~200MB).
 * Only metadata (route, title, sourceUrl) is loaded into the Content
 * Collections store — full HTML stays on disk and is loaded on demand
 * via loadPageFromDisk() in site-data.ts.
 */
const wpPagesLoader = {
  name: "wp-pages",
  load: async ({ store }: { store: { clear: () => void; set: (entry: { id: string; data: Record<string, unknown> }) => void } }) => {
    const metaPath = path.join(process.cwd(), "src", "data", "site-meta.json");
    const content = await fs.readFile(metaPath, "utf8");
    const meta = JSON.parse(content) as {
      generatedAt: string;
      siteOrigin: string;
      pageCount: number;
      pages: Array<{ route: string; title: string; sourceUrl: string }>;
    };

    store.clear();
    for (const page of meta.pages) {
      store.set({
        id: page.route,
        data: {
          route: page.route,
          title: page.title,
          sourceUrl: page.sourceUrl,
          siteOrigin: meta.siteOrigin,
          generatedAt: meta.generatedAt,
        },
      });
    }
  },
};

const wpPageSchema = z.object({
  route: z.string(),
  title: z.string(),
  sourceUrl: z.string(),
  siteOrigin: z.string(),
  generatedAt: z.string(),
});

/* ── Shared sub-schemas ─────────────────────────────────────────────── */

const linkSchema = z.object({
  href: z.string(),
  label: z.string(),
  description: z.string().optional(),
});

const tableSchema = z.object({
  columns: z.array(z.string()),
  rows: z.array(z.array(z.string())),
});

const sectionSchema = z.object({
  title: z.string(),
  intro: z.string().optional(),
  paragraphs: z.array(z.string()).optional(),
  bullets: z.array(z.string()).optional(),
  table: tableSchema.optional(),
  image: z.object({ src: z.string(), alt: z.string() }).optional(),
  callout: z
    .object({ label: z.string(), text: z.string(), href: z.string().optional() })
    .optional(),
  /* Extended section fields (keyword landings) */
  statBar: z
    .object({ items: z.array(z.object({ value: z.string(), label: z.string() })) })
    .optional(),
  /** Claim / evidence-tier / verify cards (2026-09-05 citability uplift). */
  evidenceCards: z
    .array(
      z.object({
        claim: z.string(),
        tier: z.enum([
          "OFFICIAL_STANDARD",
          "CHIP_VENDOR_DATASHEET",
          "THIRD_PARTY_TEST",
          "PROUD_TEK_INTERNAL_TEST",
          "PROUD_TEK_SELF_REPORTED",
          "COMMERCIAL_POLICY",
          "GENERAL_EXPLANATION",
          "UNSUPPORTED",
        ]),
        evidence: z.string(),
        href: z.string().optional(),
        linkLabel: z.string().optional(),
      }),
    )
    .optional(),
  comparePanel: z
    .object({
      beforeHeading: z.string().optional(),
      afterHeading: z.string().optional(),
      before: z.array(z.string()),
      after: z.array(z.string()),
    })
    .optional(),
  featureGrid: z
    .object({
      features: z.array(
        z.object({
          icon: z.string(),
          title: z.string(),
          text: z.string(),
          /** Optional stable anchor id rendered on the feature card. Used by
           *  the review-board page to give each author/reviewer a permanent
           *  `/about/review-board/#<author-slug>` URL that bylines and
           *  Person JSON-LD link to. Must match the record slug in
           *  src/content/authors/. */
          id: z.string().optional(),
        }),
      ),
    })
    .optional(),
  dataHighlight: z
    .object({
      value: z.string(),
      heading: z.string(),
      text: z.string(),
      source: z.string().optional(),
    })
    .optional(),
  timeline: z
    .object({ items: z.array(z.object({ label: z.string(), text: z.string() })) })
    .optional(),
  testimonial: z.object({ text: z.string(), source: z.string() }).optional(),
  checklist: z.array(z.string()).optional(),
  layout: z.enum(["default", "split", "split-reverse", "columns"]).optional(),
});

const briefFieldSchema = z.object({
  label: z.string(),
  text: z.string().optional(),
  items: z.array(z.string()).optional(),
  links: z.array(linkSchema).optional(),
});

const resourceCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  links: z.array(linkSchema),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

/* ── Authority layer sub-schemas (added 2026-04) ───────────────────── */

/**
 * A single cited source that appears inline on an editorial page.
 * Rendered by EditorialPage.astro into a uniform citations block and
 * emitted into Article.citation[] JSON-LD for machine-readability.
 */
const sourceSchema = z.object({
  /** Short human label shown in the rendered citation — e.g. "ISO/IEC 14443-3:2018" */
  label: z.string(),
  /** Canonical URL — must be the primary/authoritative host (iso.org, gs1.org, nxp.com, fcc.gov, europa.eu, etc.) */
  url: z.string(),
  /** Issuing organisation — "ISO", "GS1", "NXP", "FCC". Optional but recommended. */
  publisher: z.string().optional(),
  /** Document/standard publication date in YYYY or YYYY-MM-DD. */
  publishedAt: z.string().optional(),
  /** Date we last verified the cited URL resolves and the claim matches — ISO-8601. */
  accessedAt: z.string().optional(),
  /** Free-text note, e.g. "§8.2, table 4". */
  note: z.string().optional(),
});

/* ── Editorial definition schema ────────────────────────────────────── */

/**
 * Editorial schema.
 *
 * Common fields apply to every group. The "Products-only fields" block at
 * the bottom (`chipFamilies`, `envFamilies`, `relatedIndustries`) is only
 * meaningful for entries with `group: "products"` — they feed the catalog
 * facet filter on /products/all/ and the "Used in these industries" card
 * grid on SKU pages. A `.superRefine()` enforces this so a future
 * editorial author can't bolt them onto a compare/guide/blog page by
 * accident. As of 2026-05, all 194 files using these fields are in the
 * products group; the refine is purely a guardrail against drift.
 */
const editorialSchema = z.object({
  route: z.string(),
  group: z.enum(["solutions", "compare", "contact", "compatibility", "guides", "blog", "products", "lp", "markets", "about", "resources", "home", "faq", "research", "case-studies"]),
  title: z.string(),
  kicker: z.string(),
  summary: z.string(),
  heroPoints: z.array(z.string()),
  imageAlt: z.string(),
  /** Routes to harvest hero-image src from when the editorial entry has no
   *  explicit `heroImage`. Optional — if you set `heroImage` directly this
   *  array can be left out entirely. Defaults to []. */
  imageSourceRoutes: z.array(z.string()).optional().default([]),
  heroImage: z.string().optional(),
  /** Hero layout override. "stacked" forces the single-column hero (image
   *  stacked full-width under the title) even on group=products pages that
   *  otherwise inherit the product image-left / copy-right split. Used by the
   *  /industries/ hub — grouped under products, but a pillar hub, not a SKU. */
  heroLayout: z.enum(["stacked"]).optional(),
  /** Optional attribution metadata for hero images sourced under Creative
   *  Commons or similar licenses. EditorialHero.astro renders a small
   *  caption beneath the figure when this is present. */
  imageCredit: z.object({
    author: z.string(),
    sourceUrl: z.string().optional(),
    license: z.string().optional(),
    licenseUrl: z.string().optional(),
  }).optional(),
  brief: z.array(briefFieldSchema).optional(),
  sections: z.array(sectionSchema),
  resourceCards: z.array(resourceCardSchema),
  faq: z.array(faqSchema),
  primaryAction: linkSchema,
  secondaryActions: z.array(linkSchema),
  /** Optional ISO-8601 content freshness dates; preferred over build-time fallback for JSON-LD Article datePublished / dateModified. */
  publishedAt: z.string().optional(),
  modifiedAt: z.string().optional(),
  /** Optional keyword phrases for Article/Product JSON-LD; preferred over tokenized title. 2-6 short phrases. */
  keywords: z.array(z.string()).optional(),
  /** Primary author slug (key into the `authors` collection). Drives byline + Article.author JSON-LD. */
  authorSlug: z.string().optional(),
  /** Free-text author name fallback if no author entry exists yet. Prefer authorSlug for EEAT signals. */
  author: z.string().optional(),
  /** Optional reviewer slug (key into `authors`) for technical/fact review. Drives Article.reviewedBy JSON-LD. */
  reviewedBySlug: z.string().optional(),
  /** Free-text reviewer name fallback. */
  reviewedBy: z.string().optional(),
  /** ISO-8601 date the reviewer last signed off on the content. */
  reviewedAt: z.string().optional(),
  /** Authoritative sources cited by this page. Rendered as a uniform citations block + Article.citation JSON-LD. */
  sources: z.array(sourceSchema).optional(),

  /* ── Products-only fields (group === "products") ─────────────────────── */
  /** Industry slugs (matching `src/content/editorial/industries/<slug>.json`) where this SKU is deployed. Renders a "Used in these industries" card grid on SKU pages. Products-only. */
  relatedIndustries: z.array(z.string()).optional(),
  /** Explicit chip-family facet values for the catalog filter on /products/all/. Takes precedence over the regex scan of title+summary+route — use when the SKU supports multiple chips in a compatibility matrix and the filter should surface it for every chip. Valid values match FACET_RULES.chip values in catalog-pages.ts: ntag21x, ntag424, mifare-classic, mifare-desfire, mifare-ultralight, mifare-plus, icode, em-tk5, impinj-m7, alien-higgs, ucode. Products-only. */
  chipFamilies: z.array(z.string()).optional(),
  /** Explicit environment-tag facet values for the catalog filter on /products/all/. Takes precedence over the regex scan of title+summary+route — use when the SKU's environmental specs (IP rating, temperature range, mount type, tamper behaviour) live deep in spec tables. Valid values match FACET_RULES.env values in catalog-pages.ts: anti-metal, high-temp, outdoor, embed, tamper, sensor. Products-only. */
  envFamilies: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
  // Guardrail: the catalog-facet and industry-grid fields are only
  // consumed when group === "products". If a future editorial author
  // sets them on a compare/guide/blog/solutions entry, fail at build
  // time with a clear message instead of letting the field silently
  // do nothing.
  if (data.group === "products") return;
  for (const field of ["relatedIndustries", "chipFamilies", "envFamilies"] as const) {
    if (data[field] !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [field],
        message: `${field} is only meaningful for group: "products" — this entry has group: "${data.group}". Move it or drop the field.`,
      });
    }
  }
});

/* ── Authors collection schema (added 2026-04) ─────────────────────── */

/**
 * NOTE (2026-06): runtime resolution of author records does NOT go through
 * `getCollection("authors")` anymore — src/lib/authors.ts imports the same
 * JSON files statically so plain-ts modules (seo-content.ts) and vitest can
 * share one registry. This collection definition stays as the build-time
 * schema gate for those files. When adding an author, also register the
 * import in src/lib/authors.ts.
 */
const authorSchema = z.object({
  /** Slug used as the `authorSlug` / `reviewedBySlug` foreign key from editorial pages. */
  slug: z.string(),
  /** schema.org type of the byline entity — a function/team (Organization) or
   *  a person with a verifiable public profile. */
  type: z.enum(["Person", "Organization"]).optional(),
  /** Full display name, e.g. "Proud Tek Editorial Team". */
  name: z.string(),
  /** One-line role / title shown under the byline. */
  jobTitle: z.string(),
  /** Longer bio, 80-200 words, real experience + credentials. Rendered on the author detail page. */
  bio: z.string(),
  /** Short one-sentence blurb for cross-page bylines. */
  shortBio: z.string().optional(),
  /** 1-3 primary expertise tags, e.g. ["MIFARE DESFire security", "RAIN RFID retail", "EU DPP"]. */
  expertise: z.array(z.string()),
  /** Years of industry experience. Integer. */
  yearsExperience: z.number().int().nonnegative().optional(),
  /** Credentials / certifications, e.g. ["GS1 Digital Link certified integrator"]. */
  credentials: z.array(z.string()).optional(),
  /** Portrait path under /public. */
  avatar: z.string().optional(),
  /** Canonical profile URL — the author's anchor on the review-board page:
   *  /about/review-board/#{slug}. Byline links and Person JSON-LD use this. */
  url: z.string().optional(),
  /** External profiles that prove identity for EEAT — LinkedIn, ORCID, GitHub, company-about. */
  sameAs: z.array(z.string()).optional(),
  /** Email (optional, for editors@ alias or sameAs mailto). */
  email: z.string().optional(),
});

/* ── Collections ────────────────────────────────────────────────────── */

const wpPages = defineCollection({
  loader: wpPagesLoader,
  schema: wpPageSchema,
});

const editorial = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/editorial" }),
  schema: editorialSchema,
});

const authors = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/authors" }),
  schema: authorSchema,
});

export const collections = { wpPages, editorial, authors };
