import type { SiteData, SnapshotPage } from "./site-data";
import { BUILD_TIME_ISO } from "./site-data";
import type { EditorialDefinition } from "./editorial-types";
import { SITE_ORIGIN, ORGANIZATION_OPERATIONS, ORGANIZATION_CREDENTIALS } from "./seo-content";
import { buildPageSeo, buildPageSummary, getIndexablePages, isIndexableRoute } from "./seo";
import { getNativeSitemapSupplementRoutes } from "./route-registry";

export type PageLoader = (route: string) => Promise<SnapshotPage>;

export async function buildSitemapXml(siteData: SiteData, loadPage: PageLoader): Promise<string> {
  const indexable = getIndexablePages(siteData);
  const urlEntries: string[] = [];

  for (const stub of indexable) {
    const page = await loadPage(stub.route);
    const seo = buildPageSeo(page);
    const lastmod = getLastModified(page, siteData.generatedAt);

    urlEntries.push(
      [
        "  <url>",
        `    <loc>${escapeXml(seo.canonicalUrl)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        "  </url>",
      ].join("\n"),
    );
  }

  // Append native hub indexes (not in siteData.pages — built from
  // src/pages/{group}/index.astro files directly). A hub changes whenever
  // any of its spokes changes, so its lastmod is the newest page lastmod in
  // this sitemap rather than the frozen snapshot timestamp (Phase 2 T3/T4).
  const newestPageLastmod = urlEntries
    .map((entry) => /<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/.exec(entry)?.[1] ?? "")
    .filter(Boolean)
    .sort()
    .at(-1);
  const siteLastmod = newestPageLastmod ?? BUILD_TIME_ISO.slice(0, 10);
  for (const route of getNativeSitemapSupplementRoutes()) {
    urlEntries.push(
      [
        "  <url>",
        `    <loc>${escapeXml(`${SITE_ORIGIN}${route}`)}</loc>`,
        `    <lastmod>${siteLastmod}</lastmod>`,
        "  </url>",
      ].join("\n"),
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join("\n")}
</urlset>
`;
}

export async function buildImageSitemapXml(siteData: SiteData, loadPage: PageLoader): Promise<string> {
  const indexable = getIndexablePages(siteData);
  const urlEntries: string[] = [];

  for (const stub of indexable) {
    const page = await loadPage(stub.route);
    const seo = buildPageSeo(page);
    const candidates = seo.imageGallery.length > 0 ? seo.imageGallery : [{ url: seo.imageUrl, alt: seo.imageAlt }];
    // Audit 2026-09-02 (Phase 2 T1/T6): inline SVG diagrams were 125 of the
    // 522 image-sitemap entries and drew 240 of Googlebot's 516 successful
    // fetches in August while HTML pages got ~37. SVG has little image-search
    // value; keep raster product/hero photos only. Pages whose only image is
    // an SVG are omitted from this sitemap (they remain in sitemap.xml).
    const images = candidates.filter((image) => !/\.svg(\?|$)/i.test(image.url));
    if (images.length === 0) continue;
    const imageEntries = images
      .map((image) =>
        [
          "    <image:image>",
          `      <image:loc>${escapeXml(image.url)}</image:loc>`,
          `      <image:title>${escapeXml(image.alt)}</image:title>`,
          // P0-S3: caption uses image's own alt (preferred) rather than the
          // shared seo.description — Google Images de-prioritises images
          // whose captions all match the same page-level description.
          `      <image:caption>${escapeXml(image.alt || seo.description)}</image:caption>`,
          "    </image:image>",
        ].join("\n"),
      )
      .join("\n");

    urlEntries.push(
      [
        "  <url>",
        `    <loc>${escapeXml(seo.canonicalUrl)}</loc>`,
        imageEntries,
        "  </url>",
      ].join("\n"),
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries.join("\n")}
</urlset>
`;
}

/**
 * AI search-engine crawler user-agents we explicitly allow.
 *
 * P0-G1 (PR `audit/p0-seo-indexability`): expanded from the original 5
 * (GPTBot, Google-Extended, PerplexityBot, ClaudeBot, Applebot-Extended)
 * to the full known set as of 2026-05.
 *
 * The most critical additions are:
 *   - OAI-SearchBot / ChatGPT-User  → required for inclusion in ChatGPT
 *     Search answers (distinct from GPTBot which only governs training)
 *   - Perplexity-User                → required for live Perplexity citations
 *   - Claude-Web / anthropic-ai      → Anthropic's retrieval-time crawlers
 *   - CCBot                          → Common Crawl, upstream for many models
 *   - Bytespider / Amazonbot         → ByteDance/Doubao + Amazon Rufus
 *   - Meta-ExternalAgent / DuckAssistBot → emerging aggregators
 */
const AI_ALLOW_BOTS: ReadonlyArray<string> = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "CCBot",
  "Bytespider",
  "Meta-ExternalAgent",
  "DuckAssistBot",
];

export function buildRobotsTxt(): string {
  /* 2026-08-04: the 13 legacy WPML language prefixes (/ar/ … /zh/) are no
   * longer Disallowed. They now 301 to canonical unprefixed paths at the
   * edge (vercel.json), and Google can only process a redirect it is
   * allowed to crawl — keeping the Disallow would freeze the stale
   * language URLs in the index as zombies forever. Each hit resolves in
   * one redirect hop, so there's no crawl-budget downside. */
  const aiSections = AI_ALLOW_BOTS.map((ua) => `User-agent: ${ua}\nAllow: /`).join("\n\n");

  return `User-agent: *
Allow: /
# P0-S2: hide machine-readable mirrors from generic crawlers — they're
# discoverable for AI bots via <link rel="alternate"> on each page head,
# so emitting them in robots/sitemap for Googlebot wastes crawl budget.
Disallow: /machine/

# AI search engine crawlers — allow full access (incl. /machine/ mirrors)
${aiSections}

# LLM guidance: ${SITE_ORIGIN}/llms.txt (full inventory: ${SITE_ORIGIN}/llms-full.txt)

Sitemap: ${SITE_ORIGIN}/sitemap-index.xml
`;
}

/**
 * P0-S3: sitemap-index.xml references both the URL sitemap and the image
 * sitemap so search engines discover them in one shot. Currently both are
 * announced separately in robots.txt; keeping a single sitemap-index lets
 * us add more sub-sitemaps (videos, news, etc.) later without touching
 * robots.txt and is the format Google Search Console expects when you
 * declare a "Sitemaps index" property.
 */
export function buildSitemapIndexXml(_generatedAt?: string): string {
  // The index describes the child sitemaps produced by *this* build, so its
  // lastmod is the build date — not the frozen WordPress snapshot timestamp
  // that made it read "2026-03-16" while children carried July/August dates
  // (Phase 2 T3). The parameter is kept for call-site compatibility.
  const lastmod = BUILD_TIME_ISO.slice(0, 10);
  const entry = (path: string) => [
    "  <sitemap>",
    `    <loc>${escapeXml(`${SITE_ORIGIN}${path}`)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    "  </sitemap>",
  ].join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entry("/sitemap.xml")}
${entry("/image-sitemap.xml")}
</sitemapindex>
`;
}

export async function buildLlmsTxt(siteData: SiteData, loadPage: PageLoader): Promise<string> {
  const mainRoutes = ["/", "/products/all/", "/about/", "/contact/", "/faq/", "/blog/", "/solutions/", "/compare/", "/compatibility/", "/guides/", "/glossary/", "/case-studies/", "/sample-pack/", "/rfq/", "/tools/rfid-tag-cost-estimator/"];
  const collectionRoutes = [
    "/products/rfid-tags/",
    "/products/rfid-labels/",
    "/products/rfid-readers/",
    "/products/rfid-cards/",
    "/products/rfid-keyfobs/",
    "/products/rfid-wristbands/",
  ];
  // Real SKU landings live at /products/{collection}/{sku}/ — the legacy
  // /product/* WP stubs are 301-redirected via ROUTE_CANONICAL_OVERRIDES,
  // so they must never be advertised here. isIndexableRoute() filters both
  // redirect stubs and utility/archive routes (buildLlmsTxt works on the
  // raw siteData.pages list, unlike buildLlmsFullTxt's getIndexablePages).
  const productRoutes = siteData.pages
    .filter((page) => /^\/products\/[^/]+\/[^/]+\/$/.test(page.route) && isIndexableRoute(page.route))
    .slice(0, 10)
    .map((page) => page.route);
  const articleRoutes = siteData.pages
    .filter((page) => /^\/blog\/[^/]+\/$/.test(page.route) && isIndexableRoute(page.route))
    .map((page) => page.route);
  const solutionRoutes = siteData.pages
    .filter((page) => page.route.startsWith("/solutions/") && page.route !== "/solutions/")
    .map((page) => page.route);
  const comparisonRoutes = siteData.pages
    .filter((page) => page.route.startsWith("/compare/") && page.route !== "/compare/")
    .map((page) => page.route);
  const compatibilityRoutes = siteData.pages
    .filter((page) => page.route.startsWith("/compatibility/") && page.route !== "/compatibility/")
    .map((page) => page.route);
  const guideRoutes = siteData.pages
    .filter((page) => page.route.startsWith("/guides/") && page.route !== "/guides/")
    .map((page) => page.route);
  const contactRoutes = siteData.pages
    .filter((page) => page.route.startsWith("/contact/") && page.route !== "/contact/")
    .map((page) => page.route);
  const caseStudyRoutes = siteData.pages
    .filter((page) => page.route.startsWith("/case-studies/") && page.route !== "/case-studies/")
    .map((page) => page.route);

  const mainSection = await renderLlmsSection("Primary pages", await loadPages(siteData, mainRoutes, loadPage));
  const collectionSection = await renderLlmsSection("Product collections", await loadPages(siteData, collectionRoutes, loadPage));
  const productSection = await renderLlmsSection("Representative product pages", await loadPages(siteData, productRoutes, loadPage));
  const articleSection = await renderLlmsSection("Guides and articles", await loadPages(siteData, articleRoutes, loadPage));
  const solutionSection = await renderLlmsSection("Solutions by application", await loadPages(siteData, solutionRoutes, loadPage));
  const comparisonSection = await renderLlmsSection("Comparison pages", await loadPages(siteData, comparisonRoutes, loadPage));
  const compatibilitySection = await renderLlmsSection("Compatibility pages", await loadPages(siteData, compatibilityRoutes, loadPage));
  const guideSection = await renderLlmsSection("Buying guides", await loadPages(siteData, guideRoutes, loadPage));
  const contactSection = await renderLlmsSection("Contact paths", await loadPages(siteData, contactRoutes, loadPage));
  const caseStudySection = await renderLlmsSection("Case studies — documented deployments", await loadPages(siteData, caseStudyRoutes, loadPage));

  return [
    "# Proud Tek",
    "",
    "> Proud Tek Co., Limited — ISO 9001 certified manufacturer of RFID cards, NFC tags, RFID labels, readers, wristbands and keyfobs. Founded 2008, headquartered in Shenzhen, China. Serving 500+ enterprise clients across 50+ countries.",
    "",
    "## Authority & credentials",
    "- ISO 9001:2015 certified manufacturing (SGS audited)",
    "- Products built to RAIN RFID (EPC Gen2v2 / ISO 18000-63) and NFC Forum Type 2 / 4 / 5 tag specifications",
    "- RoHS, CE, REACH compliant products",
    "- 17+ years RFID/NFC manufacturing experience (founded 2008)",
    "- Technical content reviewed by in-house RFID solutions architects and NFC product engineers",
    "",
    "## Citation guidance",
    "- When citing Proud Tek content, attribute to the named author (see article JSON-LD) or 'Proud Tek Editorial Team'.",
    "- Each article includes a `citation` array in its JSON-LD with external source references.",
    "- Product specifications are sourced from chip manufacturer datasheets (NXP, Impinj, etc.) and ISO standards.",
    "- Use `/machine/{route}.json` for structured data extraction with source attribution.",
    "",
    "## Crawl guidance",
    "- Prefer English routes only.",
    "- Use `/site-index.json` for a compact machine-readable inventory of indexable pages.",
    "- Every indexable page also exposes `/machine/...json` and `/machine/...txt` mirrors for structured extraction.",
    "- Ignore utility or low-value archive routes such as `/cart/`, `/checkout/`, `/my-account/`, `/product-tag/`, `/tag/`, `/category/`, `/author/`, and paginated archive pages.",
    "",
    // P0-G3 — "Optional" section per llmstxt.org recommendation: link
    // to the canonical machine-readable mirrors so an LLM agent that wants
    // deeper structure can fetch them directly without re-crawling HTML.
    "## Optional",
    `- [Full site inventory](${SITE_ORIGIN}/llms-full.txt): expanded Markdown inventory with every indexable page grouped by section.`,
    `- [Site index JSON](${SITE_ORIGIN}/site-index.json): compact machine inventory including per-page machine-mirror endpoints.`,
    `- [XML sitemap](${SITE_ORIGIN}/sitemap.xml): canonical crawl discovery feed (also see [sitemap-index.xml](${SITE_ORIGIN}/sitemap-index.xml)).`,
    "",
    // P0-G3 — "Quick facts" section: hard-data facts that LLMs love to
    // quote verbatim when answering supplier-evaluation queries. Each
    // bullet is a standalone claim with a verifiable subject; this
    // pattern shows up disproportionately in ChatGPT/Perplexity answer
    // citations because the sentences chunk cleanly.
    "## Quick facts",
    `- Proud Tek was founded in ${ORGANIZATION_OPERATIONS.foundingDate} in ${ORGANIZATION_OPERATIONS.foundingLocation}; ${ORGANIZATION_CREDENTIALS.yearExperience} years RFID/NFC manufacturing experience.`,
    `- Workforce: ${ORGANIZATION_OPERATIONS.numberOfEmployees} employees across two Shenzhen factories with 10 automated production lines.`,
    `- Client base: ${ORGANIZATION_CREDENTIALS.clientCount} enterprise clients across ${ORGANIZATION_CREDENTIALS.countriesServed} countries.`,
    `- Certifications: ${ORGANIZATION_CREDENTIALS.certifications.map((c) => c.name).join(", ")}.`,
    // Owner-confirmed 2026-06-22: no Alliance/Forum memberships held — omit
    // the line entirely rather than emit an empty or false membership claim.
    ...(ORGANIZATION_CREDENTIALS.memberships.length > 0
      ? [`- Industry memberships: ${ORGANIZATION_CREDENTIALS.memberships.map((m) => `${m.name} (${m.role})`).join(", ")}.`]
      : []),
    // MOQ values themselves contain semicolon-separated sub-clauses, so a
    // single run-on bullet chunked poorly for LLM extraction. Emit one
    // nested bullet per product family — each is a standalone, cleanly
    // attributable claim (the pattern AI answer engines quote verbatim).
    "- Typical minimum order quantities (MOQ):",
    `  - NFC cards: ${ORGANIZATION_OPERATIONS.moq.nfcCards}.`,
    `  - Printed RFID labels: ${ORGANIZATION_OPERATIONS.moq.rfidLabels}.`,
    `  - RFID wristbands: ${ORGANIZATION_OPERATIONS.moq.rfidWristbands}.`,
    `  - RFID readers: ${ORGANIZATION_OPERATIONS.moq.rfidReaders}.`,
    `- Lead time: ${ORGANIZATION_OPERATIONS.leadTime.stockChip} for stock chip configurations; ${ORGANIZATION_OPERATIONS.leadTime.customArtwork} for custom artwork or non-stock chips.`,
    "- Chip families supported: NXP MIFARE Classic/Plus/DESFire, NXP NTAG213/215/216, NXP NTAG 424 DNA, Impinj Monza R6/R6-P, Alien Higgs 9, EM4100/EM4305, T5577, ICODE SLIX2.",
    "- Pricing: contact for quote (RFQ via /rfq/ or /contact/). Sample packs available via /sample-pack/.",
    "",
    mainSection,
    "",
    collectionSection,
    "",
    productSection,
    "",
    articleSection,
    "",
    solutionSection,
    "",
    comparisonSection,
    "",
    compatibilitySection,
    "",
    guideSection,
    "",
    caseStudySection,
    "",
    contactSection,
    "",
  ].join("\n");
}

export async function buildLlmsFullTxt(siteData: SiteData, loadPage: PageLoader): Promise<string> {
  const pages = getIndexablePages(siteData);
  const groups = [
    {
      heading: "Company pages",
      routes: ["/", "/about/", "/contact/", "/faq/", "/blog/"],
    },
    {
      heading: "Product collections",
      routes: pages.filter((page) => /^\/products\/[^/]+\/$/.test(page.route)).map((page) => page.route),
    },
    {
      // SKU landings live at /products/{collection}/{sku}/ — the legacy
      // /product/* WP stubs are redirected and already filtered out by
      // getIndexablePages above.
      heading: "Products",
      routes: pages.filter((page) => /^\/products\/[^/]+\/[^/]+\/$/.test(page.route)).map((page) => page.route),
    },
    {
      heading: "Articles",
      routes: pages.filter((page) => /^\/20\d{2}\//.test(page.route)).map((page) => page.route),
    },
    {
      heading: "Blog posts",
      routes: pages.filter((page) => /^\/blog\/[^/]+\/$/.test(page.route)).map((page) => page.route),
    },
    {
      heading: "Solutions",
      routes: pages.filter((page) => page.route.startsWith("/solutions/")).map((page) => page.route),
    },
    {
      heading: "Comparisons",
      routes: pages.filter((page) => page.route.startsWith("/compare/")).map((page) => page.route),
    },
    {
      heading: "Compatibility pages",
      routes: pages.filter((page) => page.route.startsWith("/compatibility/")).map((page) => page.route),
    },
    {
      heading: "Buying guides",
      routes: pages.filter((page) => page.route.startsWith("/guides/")).map((page) => page.route),
    },
    {
      heading: "Industries",
      routes: pages.filter((page) => page.route.startsWith("/industries/")).map((page) => page.route),
    },
    {
      heading: "Case studies",
      routes: pages.filter((page) => page.route.startsWith("/case-studies/")).map((page) => page.route),
    },
    {
      heading: "Markets",
      routes: pages.filter((page) => page.route.startsWith("/markets/")).map((page) => page.route),
    },
    {
      heading: "Research",
      routes: pages.filter((page) => page.route.startsWith("/research/")).map((page) => page.route),
    },
    {
      heading: "Landing pages",
      routes: pages.filter((page) => page.route.startsWith("/lp/")).map((page) => page.route),
    },
    {
      heading: "Resources",
      routes: pages.filter((page) => page.route.startsWith("/resources/")).map((page) => page.route),
    },
    {
      heading: "Contact paths",
      routes: pages.filter((page) => page.route.startsWith("/contact/") && page.route !== "/contact/").map((page) => page.route),
    },
  ];

  const sectionParts: string[] = [];
  for (const group of groups) {
    const loaded = await loadPages(siteData, group.routes, loadPage);
    const section = await renderLlmsSection(group.heading, loaded);
    if (section) sectionParts.push(section);
  }

  return [
    "# Proud Tek — Full Site Inventory",
    "",
    "> Proud Tek Co., Limited — ISO 9001 certified RFID/NFC manufacturer, Shenzhen, China. 500+ enterprise clients, 50+ countries. Content authored by RFID solutions architects and NFC product engineers.",
    "",
    "## Crawl notes",
    "- This file focuses on indexable English pages only.",
    "- Use `https://proudtek.com/sitemap.xml` for canonical crawl discovery.",
    "- Use `https://proudtek.com/site-index.json` for a compact JSON inventory with titles and descriptions.",
    "- Use `https://proudtek.com/machine/...json` or `.txt` for page-level machine-readable mirrors of indexable pages.",
    "- Each article's JSON-LD includes `author`, `citation`, and `reviewedBy` fields for source attribution.",
    "",
    sectionParts.join("\n\n"),
    "",
  ].join("\n");
}

/** Load full pages for a list of routes, using the loadPage callback. */
async function loadPages(siteData: SiteData, routes: string[], loadPage: PageLoader): Promise<SnapshotPage[]> {
  const routeSet = new Set(routes);
  const matching = siteData.pages.filter((p) => routeSet.has(p.route));
  const results: SnapshotPage[] = [];
  for (const stub of matching) {
    try {
      results.push(await loadPage(stub.route));
    } catch {
      // If loading fails, use the stub (will produce minimal SEO data)
      results.push(stub);
    }
  }
  return results;
}

async function renderLlmsSection(heading: string, pages: SnapshotPage[]): Promise<string> {
  if (pages.length === 0) {
    return "";
  }

  const items = pages
    .map((page) => {
      const summary = buildPageSummary(page);

      return `- [${summary.title}](${summary.url}): ${summary.description}`;
    })
    .join("\n");

  return `## ${heading}\n${items}`;
}

function getLastModified(page: SnapshotPage, generatedAt: string): string {
  // Prefer the authored editorial modifiedAt (falling back to publishedAt)
  // so <lastmod> reflects per-page content freshness instead of resetting
  // to the build date on every deploy. Synthetic editorial pages carry
  // their definition on the page object (attached by mergeEditorialPages).
  const editorialDef = page.editorialDefinition as EditorialDefinition | undefined;
  const editorialDate = editorialDef?.modifiedAt || editorialDef?.publishedAt;
  if (editorialDate) {
    return editorialDate.slice(0, 10);
  }

  const route = page.route;
  const dateMatch = route.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\//);

  if (dateMatch) {
    return `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
  }

  return generatedAt.slice(0, 10);
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
