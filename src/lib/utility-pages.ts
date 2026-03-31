import { load } from "cheerio";

import type { SiteData, SnapshotPage } from "./site-data";
import { loadPageFromDisk } from "./site-data";
import { ROUTE_CANONICAL_OVERRIDES } from "./route-overrides";
import { html, raw } from "./html";

export async function mergeUtilityPages(siteData: SiteData): Promise<SiteData> {
  const utilityPages = await buildUtilityPages(siteData);
  const pageMap = new Map(siteData.pages.map((page) => [page.route, page]));

  utilityPages.forEach((page) => {
    pageMap.set(page.route, page);
  });

  const pages = [...pageMap.values()].sort((left, right) => left.route.localeCompare(right.route));

  return {
    ...siteData,
    pageCount: pages.length,
    pages,
  };
}

async function buildUtilityPages(siteData: SiteData): Promise<SnapshotPage[]> {
  const templateRoutes = ["/blog/", "/about/", "/"];
  let template: SnapshotPage | undefined;
  for (const route of templateRoutes) {
    if (siteData.pages.some((p) => p.route === route)) {
      try {
        template = await loadPageFromDisk(route);
        break;
      } catch { /* skip */ }
    }
  }

  if (!template) {
    return [];
  }

  return [await buildCaseStudiesPage(siteData, template)];
}

async function buildCaseStudiesPage(siteData: SiteData, template: SnapshotPage): Promise<SnapshotPage> {
  const articleStubs = siteData.pages.filter((page) => /^\/20\d{2}\//.test(page.route));
  const posts: Array<{ route: string; title: string; image: string; summary: string }> = [];
  for (const stub of articleStubs) {
    try {
      const page = await loadPageFromDisk(stub.route);
      posts.push({
        route: ROUTE_CANONICAL_OVERRIDES[page.route] ?? page.route,
        title: stripSiteSuffix(page.title) || "Article",
        image: extractFirstImage(page.bodyHtml),
        summary: extractSummary(page.bodyHtml),
      });
    } catch {
      posts.push({
        route: ROUTE_CANONICAL_OVERRIDES[stub.route] ?? stub.route,
        title: stripSiteSuffix(stub.title) || "Article",
        image: "",
        summary: "",
      });
    }
  }

  const bodyHtml = buildArchiveBodyHtml(
    template.bodyHtml,
    "Case Studies",
    "The original Proud Tek English export did not include a standalone case-studies page. This local page groups the closest English articles and implementation references that remain available in the snapshot.",
    posts,
  );

  return {
    route: "/case-studies/",
    sourceUrl: `${siteData.siteOrigin}/case-studies/`,
    title: "Case Studies – Proud Tek",
    htmlAttrs: { ...template.htmlAttrs },
    bodyAttrs: { ...template.bodyAttrs },
    headHtml: template.headHtml,
    bodyHtml,
  };
}

function buildArchiveBodyHtml(
  templateBodyHtml: string,
  heading: string,
  description: string,
  entries: Array<{ route: string; title: string; image: string; summary: string }>,
): string {
  const $ = load(`<body>${templateBodyHtml}</body>`, { decodeEntities: false });
  const main = $("main#main, main.site-main").first();

  if (!main.length) {
    return templateBodyHtml;
  }

  main.html(html`
    <div class="woocommerce-notices-wrapper"></div>
    <header class="woocommerce-products-header">
      <h1 class="page-title archive-title">${heading}</h1>
      <div class="term-description">
        <p>${description}</p>
      </div>
    </header>
    <div class="codex-case-study-grid">
      ${raw(entries.map((entry) => renderEntryCard(entry)).join(""))}
    </div>
  `);

  return $("body").html() ?? templateBodyHtml;
}

function renderEntryCard(entry: { route: string; title: string; image: string; summary: string }): string {
  const imageHtml = entry.image
    ? html`<a class="codex-case-study-card__media" href="${entry.route}"><img src="${entry.image}" alt="${entry.title}" loading="lazy" decoding="async"></a>`
    : "";

  return html`
    <article class="codex-case-study-card">
      ${raw(imageHtml)}
      <div class="codex-case-study-card__body">
        <h2><a href="${entry.route}">${entry.title}</a></h2>
        <p>${entry.summary || "Open the related English article."}</p>
      </div>
    </article>
  `;
}

function extractFirstImage(bodyHtml: string): string {
  const $ = load(bodyHtml, { decodeEntities: false });
  const selectors = [".entry-content img", ".woocommerce-product-gallery__image img", "img"];

  for (const selector of selectors) {
    const element = $(selector).get(0);

    if (!element) {
      continue;
    }

    const src = ($(element).attr("data-large_image") ?? $(element).attr("src") ?? "").trim();

    if (src.startsWith("/site-assets/")) {
      return src;
    }
  }

  return "";
}

function extractSummary(bodyHtml: string): string {
  const $ = load(bodyHtml, { decodeEntities: false });
  const paragraphs = $(".entry-content p, article p")
    .toArray()
    .map((element) => cleanText($(element).text()))
    .filter((text) => text.length >= 70);

  return truncateText(paragraphs[0] ?? "", 180);
}

function stripSiteSuffix(title: string): string {
  return title
    .replace(/\s*[–-]\s*Custom RFID.*$/i, "")
    .replace(/\s*[–-]\s*Proud Tek.*$/i, "")
    .trim();
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

