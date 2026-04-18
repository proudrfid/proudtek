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
      features: z.array(z.object({ icon: z.string(), title: z.string(), text: z.string() })),
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
  layout: z.enum(["default", "split", "split-reverse"]).optional(),
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

const editorialSchema = z.object({
  route: z.string(),
  group: z.enum(["solutions", "compare", "contact", "compatibility", "guides", "blog", "products", "lp", "markets", "about"]),
  title: z.string(),
  kicker: z.string(),
  summary: z.string(),
  heroPoints: z.array(z.string()),
  imageAlt: z.string(),
  imageSourceRoutes: z.array(z.string()),
  heroImage: z.string().optional(),
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
  /** Industry slugs (matching `src/content/editorial/industries/<slug>.json`) where this SKU is deployed. Renders a "Used in these industries" card grid on SKU pages. */
  relatedIndustries: z.array(z.string()).optional(),
  /** Explicit chip-family facet values for the catalog filter on /products/all/. Takes precedence over the regex scan of title+summary+route — use when the SKU supports multiple chips in a compatibility matrix and the filter should surface it for every chip. Valid values match FACET_RULES.chip values in catalog-pages.ts: ntag21x, ntag424, mifare-classic, mifare-desfire, mifare-ultralight, mifare-plus, icode, em-tk5, impinj-m7, alien-higgs, ucode. */
  chipFamilies: z.array(z.string()).optional(),
});

/* ── Authors collection schema (added 2026-04) ─────────────────────── */

const authorSchema = z.object({
  /** Slug used as the `authorSlug` / `reviewedBySlug` foreign key from editorial pages. */
  slug: z.string(),
  /** Full display name, e.g. "Peter Zhang". */
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
  /** Canonical URL (the author detail page). Usually /about/authors/{slug}/. */
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
