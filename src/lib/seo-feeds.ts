import type { SiteData, SnapshotPage } from "./site-data";
import { SITE_ORIGIN } from "./seo-content";
import { buildPageSeo, buildPageSummary, getIndexablePages } from "./seo";

export function buildSitemapXml(siteData: SiteData): string {
  const urls = getIndexablePages(siteData)
    .map((page) => {
      const seo = buildPageSeo(page);
      const lastmod = getLastModified(page, siteData.generatedAt);

      return [
        "  <url>",
        `    <loc>${escapeXml(seo.canonicalUrl)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function buildImageSitemapXml(siteData: SiteData): string {
  const urls = getIndexablePages(siteData)
    .map((page) => {
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

      return [
        "  <url>",
        `    <loc>${escapeXml(seo.canonicalUrl)}</loc>`,
        imageEntries,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
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

Sitemap: ${SITE_ORIGIN}/sitemap.xml
Sitemap: ${SITE_ORIGIN}/image-sitemap.xml
`;
}

export function buildLlmsTxt(siteData: SiteData): string {
  const mainRoutes = ["/", "/products/all/", "/about/", "/contact/", "/faq/", "/blog/", "/solutions/", "/compare/", "/compatibility/", "/guides/"];
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

  const mainSection = renderLlmsSection("Primary pages", pickRoutes(siteData, mainRoutes));
  const collectionSection = renderLlmsSection("Product collections", pickRoutes(siteData, collectionRoutes));
  const productSection = renderLlmsSection("Representative product pages", pickRoutes(siteData, productRoutes));
  const articleSection = renderLlmsSection("Guides and articles", pickRoutes(siteData, articleRoutes));
  const solutionSection = renderLlmsSection("Solutions by application", pickRoutes(siteData, solutionRoutes));
  const comparisonSection = renderLlmsSection("Comparison pages", pickRoutes(siteData, comparisonRoutes));
  const compatibilitySection = renderLlmsSection("Compatibility pages", pickRoutes(siteData, compatibilityRoutes));
  const guideSection = renderLlmsSection("Buying guides", pickRoutes(siteData, guideRoutes));
  const contactSection = renderLlmsSection("Contact paths", pickRoutes(siteData, contactRoutes));

  return [
    "# Proud Tek",
    "",
    "> English-only static export of Proud Tek, a manufacturer of RFID and NFC products based in Shenzhen, China.",
    "",
    "## Guidance",
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
    contactSection,
    "",
  ].join("\n");
}

export function buildLlmsFullTxt(siteData: SiteData): string {
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

  const sections = groups
    .map((group) => renderLlmsSection(group.heading, pickRoutes(siteData, group.routes)))
    .filter(Boolean)
    .join("\n\n");

  return [
    "# Proud Tek",
    "",
    "> Expanded machine-readable inventory of the English Proud Tek site.",
    "",
    "## Crawl notes",
    "- This file focuses on indexable English pages only.",
    "- Use `https://proudtek.com/sitemap.xml` for canonical crawl discovery.",
    "- Use `https://proudtek.com/site-index.json` for a compact JSON inventory with titles and descriptions.",
    "- Use `https://proudtek.com/machine/...json` or `.txt` for page-level machine-readable mirrors of indexable pages.",
    "",
    sections,
    "",
  ].join("\n");
}

function pickRoutes(siteData: SiteData, routes: string[]): SnapshotPage[] {
  const routeSet = new Set(routes);

  return siteData.pages.filter((page) => routeSet.has(page.route));
}

function renderLlmsSection(heading: string, pages: SnapshotPage[]): string {
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
