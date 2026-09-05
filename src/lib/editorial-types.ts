/**
 * Shared type definitions for editorial content.
 *
 * Extracted from editorial-pages.ts so that both the data-loading layer
 * and Astro components can import them without circular dependencies.
 */

export type EditorialGroup = "solutions" | "compare" | "contact" | "compatibility" | "guides" | "blog" | "products" | "lp" | "markets" | "about" | "resources" | "home" | "faq" | "research" | "case-studies";

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
    /** `id` is an optional stable anchor (e.g. author slug on the
     *  review-board page) rendered as the feature card's `id` attribute. */
    features: Array<{ icon: string; title: string; text: string; id?: string }>;
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
  layout?: "default" | "split" | "split-reverse" | "columns";
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
  /** Hero layout override — "stacked" forces the single-column hero even on
   *  group=products pages that otherwise get the product two-column split. */
  heroLayout?: "stacked";
  /**
   * Optional attribution metadata for the hero image. Required when the
   * image is sourced under a Creative Commons or similar license that
   * mandates author credit. Rendered as a small caption beneath the
   * hero figure (`.codex-editorial-hero-credit`). Absent for in-house
   * product photography.
   */
  imageCredit?: {
    /** Photographer / author name. */
    author: string;
    /** Optional link to the original source page (Wikimedia, Flickr, etc.). */
    sourceUrl?: string;
    /** License identifier — e.g. "CC BY-SA 4.0", "CC0". */
    license?: string;
    /** Optional link to the license deed (e.g. https://creativecommons.org/licenses/by-sa/4.0/). */
    licenseUrl?: string;
  };
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
  /** Industry slugs where this SKU is deployed (e.g. ["retail-apparel", "hospitality"]).
   *  Consumed by renderRelatedIndustriesGrid in editorial-pages.ts. Schema-defined
   *  in src/content.config.ts:200. Moved into canonical Definition during Stage 1.5
   *  consolidation, 2026-05. */
  relatedIndustries?: string[];
}

/** Minimal author record shape; mirrors authorSchema in src/content.config.ts. */
export interface EditorialAuthor {
  slug: string;
  /** schema.org type for the byline entity. Functions/teams are Organization
   *  (the default since 2026-09-02); a Person record needs a verifiable
   *  public profile in `sameAs`. */
  type?: "Person" | "Organization";
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

/** Stable anchor id for the inline quick-quote RFQ form (audit C-11).
 *  InlineRfqForm.astro stamps it on its outer section; EditorialArticle.astro
 *  points the hero primary CTA at `#quick-quote` and appends the "Get a
 *  quote" jump-nav entry. Outline ids below are slug-generated from labels —
 *  no current section label slugifies to "quick-quote"; avoid introducing
 *  one (it would produce a duplicate id on the page). */
export const QUICK_QUOTE_ID = "quick-quote";

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

/**
 * Citation context. When supplied, `[^N]` markers in inline text are rewritten
 * into `<sup class="codex-citation"><a href="#${sourcesId}-N">[N]</a></sup>`
 * anchors that deep-link to the Sources block. Lifted out of editorial-pages.ts
 * 2026-05 (Stage 1 cleanup) so the single canonical renderInlineLinks lives here.
 */
export type CitationCtx = {
  sourcesId: string;
  sourcesCount: number;
};

export function renderInlineLinks(text: string, citations?: CitationCtx): string {
  // Convert markdown-style [label](url) or [label](url "title") to HTML
  // links, escape everything else.
  //
  // Strategy:
  //   1. Rewrite [^N] citation markers to opaque tokens (CITEOPEN/CITECLOSE
  //      pairs) so they survive subsequent regex passes intact.
  //   2. Walk the text linearly, extracting [label](url[ "title"]) segments.
  //      Inside each: escape label, url, and title separately. Outside:
  //      escape the surrounding plain text.
  //   3. Rewrite citation tokens to <sup><a>…</a></sup> anchors.
  //
  // Step 2 is the BUG-1 fix (2026-05). The previous implementation called
  // `escapeHtml(text)` over the FULL string first, which turned `&` into
  // `&amp;` inside URLs; the regex then captured the already-escaped URL
  // and ran `escapeAttribute` on it, double-escaping `&` to `&amp;amp;`.
  // Per-segment escaping eliminates that interaction.
  //
  // 2026-05-12 (Stage 3 sprint 1): optional ` "title"` segment added to the
  // markdown syntax so `injectContextualLinksToParagraphs` (in
  // editorial-shadow-normalizers.ts) can emit `[label](href "label")` and
  // get a `title="..."` attribute on the rendered <a>, matching the legacy
  // cheerio-side injectContextualLinks output. URLs are now bounded by
  // `[^)\s]+` (no spaces in the URL portion) — verified no editorial JSON
  // fixture relies on a space-containing URL.
  const CITE_OPEN = "CITEOPEN";
  const CITE_CLOSE = "CITECLOSE";
  const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g;

  let working = text;

  if (citations && citations.sourcesCount > 0) {
    working = working.replace(/\[\^(\d+)\]/g, (match, raw) => {
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 1 || n > citations.sourcesCount) return match;
      return `${CITE_OPEN}${n}${CITE_CLOSE}`;
    });
  }

  let html = "";
  let lastIdx = 0;
  for (const match of working.matchAll(LINK_RE)) {
    const idx = match.index ?? 0;
    const [full, label, url, title] = match;
    html += escapeHtml(working.slice(lastIdx, idx));
    const titleAttr = title !== undefined ? ` title="${escapeAttribute(title)}"` : "";
    html += `<a href="${escapeAttribute(url)}"${titleAttr}>${escapeHtml(label)}</a>`;
    lastIdx = idx + full.length;
  }
  html += escapeHtml(working.slice(lastIdx));

  if (citations) {
    const re = new RegExp(`${CITE_OPEN}(\\d+)${CITE_CLOSE}`, "g");
    html = html.replace(re, (_match, n) => {
      const href = `#${citations.sourcesId}-${n}`;
      return `<sup class="codex-citation"><a href="${escapeAttribute(href)}" aria-label="Citation ${n}, see Sources block">[${n}]</a></sup>`;
    });
  }

  return html;
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
  return route === "/" || route === "/solutions/" || route === "/compare/" || route === "/compatibility/" || route === "/guides/" || route === "/contact/" || route === "/resources/" || route === "/about/" || route === "/blog/" || route === "/faq/" || route === "/products/all/" || route === "/industries/" || route === "/markets/" || route === "/lp/" || route === "/research/" || route === "/case-studies/";
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
    case "research": return "research";
    case "case-studies": return "case-studies";
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
