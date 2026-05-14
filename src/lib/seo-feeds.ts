import type { SiteData, SnapshotPage } from "./site-data";
import { SITE_ORIGIN } from "./seo-content";
import { buildPageSeo, buildPageSummary, getIndexablePages } from "./seo";

export type PageLoader = (route: string) => Promise<SnapshotPage>;

/**
 * Native `.astro` hub indexes that aren't in `siteData.pages` (they're
 * built directly by Astro from files under `src/pages/{group}/index.astro`,
 * not from WP-snapshot data). Without this list they'd be missing from the
 * sitemap even though they're real, indexable pages in production.
 *
 * Audit on 2026-05-12 confirmed `/blog/`, `/research/`, `/compatibility/`,
 * `/industries/`, `/solutions/` already appear in sitemap (their hub
 * indexes ARE in siteData.pages) — only `/compare/` and `/guides/` are
 * missing because they were added as native hubs later.
 */
const NATIVE_HUB_ROUTES: ReadonlyArray<string> = ["/compare/", "/guides/", "/rfq/"];

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
  // src/pages/{group}/index.astro files directly).
  const siteLastmod = (siteData.generatedAt ?? new Date().toISOString()).slice(0, 10);
  for (const route of NATIVE_HUB_ROUTES) {
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
    const images = seo.imageGallery.length > 0 ? seo.imageGallery : [{ url: seo.imageUrl, alt: seo.imageAlt }];
    const imageEntries = images
      .map((image) =>
        [
          "    <image:image>",
          `      <image:loc>${escapeXml(image.url)}</image:loc>`,
          `      <image:title>${escapeXml(image.alt)}</image:title>`,
          `      <image:caption>${escapeXml(seo.description)}</image:caption>`,
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

export function buildRobotsTxt(): string {
  const disallowedPrefixes = ["ar", "da", "de", "es", "fa", "fr", "he", "it", "ja", "pt", "ru", "tr", "zh"]
    .map((prefix) => `Disallow: /${prefix}/`)
    .join("\n");

  return `User-agent: *
Allow: /
${disallowedPrefixes}

# AI search engine crawlers — allow full access
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
Sitemap: ${SITE_ORIGIN}/image-sitemap.xml
`;
}

export async function buildLlmsTxt(siteData: SiteData, loadPage: PageLoader): Promise<string> {
  const mainRoutes = ["/", "/products/all/", "/about/", "/contact/", "/faq/", "/blog/", "/solutions/", "/compare/", "/compatibility/", "/guides/", "/case-studies/", "/sample-pack/", "/rfq/", "/resources/downloads/"];
  const collectionRoutes = [
    "/products/rfid-tags/",
    "/products/rfid-labels/",
    "/products/rfid-readers/",
    "/products/rfid-cards/",
    "/products/rfid-keyfobs/",
    "/products/rfid-wristbands/",
  ];
  const productRoutes = siteData.pages
    .filter((page) => page.route.startsWith("/product/"))
    .slice(0, 10)
    .map((page) => page.route);
  const articleRoutes = siteData.pages
    .filter((page) => /^\/20\d{2}\//.test(page.route))
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
    "- RAIN RFID Alliance member · NFC Forum implementer member",
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
      heading: "Products",
      routes: pages.filter((page) => page.route.startsWith("/product/")).map((page) => page.route),
    },
    {
      heading: "Articles",
      routes: pages.filter((page) => /^\/20\d{2}\//.test(page.route)).map((page) => page.route),
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
