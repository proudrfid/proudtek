/**
 * Shared type definitions for editorial content.
 *
 * Extracted from editorial-pages.ts so that both the data-loading layer
 * and Astro components can import them without circular dependencies.
 */

export type EditorialGroup = "solutions" | "compare" | "contact" | "compatibility" | "guides" | "blog" | "products" | "lp" | "markets" | "about" | "resources" | "home" | "faq";

export interface EditorialLink {
  href: string;
  label: string;
  description?: string;
}

export interface EditorialTable {
  columns: string[];
  rows: string[][];
}

export interface EditorialSectionData {
  title: string;
  intro?: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: EditorialTable;
  image?: { src: string; alt: string };
  callout?: { label: string; text: string; href?: string };
  /* Extended section fields (keyword landings) */
  statBar?: { items: Array<{ value: string; label: string }> };
  comparePanel?: {
    beforeHeading?: string;
    afterHeading?: string;
    before: string[];
    after: string[];
  };
  featureGrid?: {
    features: Array<{ icon: string; title: string; text: string }>;
  };
  dataHighlight?: {
    value: string;
    heading: string;
    text: string;
    source?: string;
  };
  timeline?: { items: Array<{ label: string; text: string }> };
  testimonial?: { text: string; source: string };
  checklist?: string[];
  layout?: "default" | "split" | "split-reverse";
}

export interface EditorialBriefField {
  label: string;
  text?: string;
  items?: string[];
  links?: EditorialLink[];
}

export interface EditorialResourceCard {
  title: string;
  description: string;
  links: EditorialLink[];
}

export interface EditorialFaq {
  question: string;
  answer: string;
}

export interface EditorialSource {
  label: string;
  url: string;
  publisher?: string;
  publishedAt?: string;
  accessedAt?: string;
  note?: string;
}

export interface EditorialDefinition {
  route: string;
  group: EditorialGroup;
  title: string;
  kicker: string;
  summary: string;
  heroPoints: string[];
  imageAlt: string;
  imageSourceRoutes: string[];
  heroImage?: string;
  brief?: EditorialBriefField[];
  sections: EditorialSectionData[];
  resourceCards: EditorialResourceCard[];
  faq: EditorialFaq[];
  primaryAction: EditorialLink;
  secondaryActions: EditorialLink[];
  publishedAt?: string;
  modifiedAt?: string;
  keywords?: string[];
  /** Authority signals (added 2026-04). See src/content.config.ts for field contract. */
  authorSlug?: string;
  author?: string;
  reviewedBySlug?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  sources?: EditorialSource[];
}

/** Minimal author record shape; mirrors authorSchema in src/content.config.ts. */
export interface EditorialAuthor {
  slug: string;
  name: string;
  jobTitle: string;
  bio: string;
  shortBio?: string;
  expertise: string[];
  yearsExperience?: number;
  credentials?: string[];
  avatar?: string;
  url?: string;
  sameAs?: string[];
  email?: string;
}

// ---------------------------------------------------------------------------
// Outline builder — shared between components and data layer
// ---------------------------------------------------------------------------

export interface EditorialOutline {
  snapshotId: string;
  briefId: string | null;
  sectionLinks: Array<{ id: string; label: string }>;
  filteredSections: EditorialSectionData[];
  resourcesId: string;
  faqId: string | null;
  sourcesId: string | null;
  nextStepId: string;
  jumpLinks: Array<{ id: string; label: string }>;
}

export function buildEditorialOutline(definition: EditorialDefinition): EditorialOutline {
  const used = new Set<string>();
  const createId = (label: string): string => {
    const base =
      label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "section";
    let candidate = base;
    let suffix = 2;

    while (used.has(candidate)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }

    used.add(candidate);
    return candidate;
  };

  const snapshotId = createId("At a glance");
  const briefId = definition.brief && definition.brief.length > 0 ? createId("Project checklist") : null;
  const filteredSections = definition.sections.filter(
    (section) => !/^where\s+this\s+/i.test(section.title),
  );
  const sectionLinks = filteredSections.map((section) => ({ id: createId(section.title), label: section.title }));
  const resourcesId = createId("Useful next pages");
  const faqId = definition.faq.length > 0 ? createId("FAQ") : null;
  const sourcesId = definition.sources && definition.sources.length > 0 ? createId("Sources") : null;
  const nextStepId = createId("Next step");
  const jumpLinks = [
    { id: snapshotId, label: "At a glance" },
    ...sectionLinks,
    { id: resourcesId, label: "Useful next pages" },
    ...(faqId ? [{ id: faqId, label: "FAQ" }] : []),
    ...(sourcesId ? [{ id: sourcesId, label: "Sources" }] : []),
    { id: nextStepId, label: "Next step" },
  ];

  return {
    snapshotId,
    briefId,
    sectionLinks,
    filteredSections,
    resourcesId,
    faqId,
    sourcesId,
    nextStepId,
    jumpLinks,
  };
}

// ---------------------------------------------------------------------------
// Text helpers — used by components
// ---------------------------------------------------------------------------

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function escapeAttribute(value: string): string {
  return escapeHtml(value);
}

export function renderInlineLinks(text: string): string {
  return escapeHtml(text).replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match: string, label: string, url: string) => `<a href="${escapeAttribute(url)}">${label}</a>`,
  );
}

export function truncateEditorialText(value: string, limit: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, Math.max(0, limit - 1)).trimEnd()}...`;
}

export function isWorkflowSection(title: string): boolean {
  return /workflow|steps|playbook/i.test(title);
}

export function isSectionRoot(route: string): boolean {
  return route === "/" || route === "/solutions/" || route === "/compare/" || route === "/compatibility/" || route === "/guides/" || route === "/contact/" || route === "/resources/" || route === "/about/" || route === "/blog/" || route === "/faq/" || route === "/products/all/" || route === "/industries/" || route === "/markets/" || route === "/lp/";
}

export function resolvePageType(group: EditorialGroup): string {
  switch (group) {
    case "solutions": return "solution";
    case "compare": return "compare";
    case "guides": return "guide";
    case "compatibility": return "compatibility";
    case "contact": return "contact";
    case "products": return "product";
    case "resources": return "resources";
    case "home": return "home";
    case "faq": return "faq";
    case "about": return "about";
    case "blog": return "blog";
    case "markets": return "markets";
    case "lp": return "lp";
    default: return "";
  }
}

export function detectSectionType(title: string): string {
  const lower = title.toLowerCase();
  if (/solution|how .* solve|how .* help|our approach|how proud tek|what we offer/.test(lower)) return "solution";
  if (/result|case|success|outcome|client|customer .* story|impact|roi/.test(lower)) return "results";
  if (/pain|problem|challenge|issue|common .* face|why .* fail|risk|obstacle/.test(lower)) return "pain";
  return "";
}

export function summarizeBriefField(field: EditorialBriefField): string {
  if (field.text) return truncateEditorialText(field.text, 170);
  if (field.items && field.items.length > 0) return truncateEditorialText(field.items.slice(0, 2).join(" "), 170);
  if (field.links && field.links.length > 0) return truncateEditorialText(field.links.slice(0, 2).map((link) => link.label).join(" / "), 170);
  return "Use the checklist below to prepare a clear inquiry before you contact the team.";
}

export function summarizeSection(section: EditorialSectionData): string {
  if (section.intro) return truncateEditorialText(section.intro, 170);
  if (section.paragraphs && section.paragraphs.length > 0) return truncateEditorialText(section.paragraphs[0], 170);
  if (section.bullets && section.bullets.length > 0) return truncateEditorialText(section.bullets.slice(0, 2).join(" "), 170);
  return "Use the section below to choose the best option and what your inquiry should include.";
}
