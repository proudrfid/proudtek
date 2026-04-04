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

/* ── Editorial definition schema ────────────────────────────────────── */

const editorialSchema = z.object({
  route: z.string(),
  group: z.enum(["solutions", "compare", "contact", "compatibility", "guides", "blog", "products", "lp", "markets"]),
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

export const collections = { wpPages, editorial };
