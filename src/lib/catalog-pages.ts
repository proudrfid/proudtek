import { load } from "cheerio";

import type { SiteData, SnapshotPage } from "./site-data";
import { html, raw } from "./html";
import { PRODUCT_LANDING_DEFINITIONS } from "./product-landing-definitions";
import { PRODUCT_LANDING_DEFINITIONS_BATCH2 } from "./product-landing-definitions-batch2";
import { PRODUCT_LANDING_DEFINITIONS_BATCH3 } from "./product-landing-definitions-batch3";
import { PRODUCT_LANDING_DEFINITIONS_BATCH4 } from "./product-landing-definitions-batch4";
import { PRODUCT_LANDING_DEFINITIONS_BATCH5 } from "./product-landing-definitions-batch5";
import { PRODUCT_LANDING_DEFINITIONS_BATCH6 } from "./product-landing-definitions-batch6";
import { PRODUCT_LANDING_DEFINITIONS_BATCH7 } from "./product-landing-definitions-batch7";
import { PRODUCT_LANDING_DEFINITIONS_BATCH8 } from "./product-landing-definitions-batch8";
import { INDUSTRY_LANDING_DEFINITIONS } from "./industry-landing-definitions";

const ALL_LANDING_DEFINITIONS = [
  ...PRODUCT_LANDING_DEFINITIONS,
  ...PRODUCT_LANDING_DEFINITIONS_BATCH2,
  ...PRODUCT_LANDING_DEFINITIONS_BATCH3,
  ...PRODUCT_LANDING_DEFINITIONS_BATCH4,
  ...PRODUCT_LANDING_DEFINITIONS_BATCH5,
  ...PRODUCT_LANDING_DEFINITIONS_BATCH6,
  ...PRODUCT_LANDING_DEFINITIONS_BATCH7,
  ...PRODUCT_LANDING_DEFINITIONS_BATCH8,
  ...INDUSTRY_LANDING_DEFINITIONS,
];

/** Returns a map of sidebar label → correct product count, usable by render-snapshot.ts */
export function getProductCategoryCounts(): Record<string, number> | null {
  const totalProducts = PRODUCT_CATEGORIES.reduce((sum, cat) => sum + cat.routes.length, 0);
  const result: Record<string, number> = { Products: totalProducts };
  for (const cat of PRODUCT_CATEGORIES) {
    result[cat.label] = cat.routes.length;
  }
  return result;
}

/* Show ALL products on a single page — no pagination */
const CATALOG_PAGE_SIZE = 999;

interface CatalogProduct {
  route: string;
  title: string;
  image: string;
  summary: string;
}

export function mergeCatalogPages(siteData: SiteData): SiteData {
  const template = pickCatalogTemplate(siteData);

  if (!template) {
    return siteData;
  }

  const products = collectCatalogProducts(siteData);

  if (products.length === 0) {
    return siteData;
  }

  const paginatedProducts = paginate(products, CATALOG_PAGE_SIZE);
  const overrides = [
    buildCatalogArchivePage(siteData, template, {
      route: "/products/all/",
      pageNumber: 1,
      totalPages: paginatedProducts.length,
      totalProducts: products.length,
      products: paginatedProducts[0] ?? [],
    }),
    buildCatalogRedirectPage(siteData, template, "/products/all/page/1/", "/products/all/", "Products"),
    buildCatalogRedirectPage(siteData, template, "/product-category/products/", "/products/all/", "Products"),
    buildCatalogRedirectPage(siteData, template, "/product-category/products/page/1/", "/products/all/", "Products"),
    ...buildLegacyCollectionAliasPages(siteData),
    buildIndustriesPage(siteData, template, products),
  ];

  for (let index = 1; index < paginatedProducts.length; index += 1) {
    const pageNumber = index + 1;

    overrides.push(
      buildCatalogArchivePage(siteData, template, {
        route: `/products/all/page/${pageNumber}/`,
        pageNumber,
        totalPages: paginatedProducts.length,
        totalProducts: products.length,
        products: paginatedProducts[index] ?? [],
      }),
    );

    overrides.push(
      buildCatalogRedirectPage(
        siteData,
        template,
        `/product-category/products/page/${pageNumber}/`,
        `/products/all/page/${pageNumber}/`,
        "Products",
      ),
    );
  }

  const mergedPages = new Map(siteData.pages.map((page) => [page.route, page]));

  overrides.forEach((page) => {
    mergedPages.set(page.route, page);
  });

  const pages = [...mergedPages.values()].sort((left, right) => left.route.localeCompare(right.route));

  return {
    ...siteData,
    pageCount: pages.length,
    pages,
  };
}

function pickCatalogTemplate(siteData: SiteData): SnapshotPage | undefined {
  return (
    siteData.pages.find((page) => page.route === "/products/all/") ??
    siteData.pages.find((page) => page.route === "/products/rfid-cards/") ??
    siteData.pages.find((page) => page.route.startsWith("/products/"))
  );
}

function collectCatalogProducts(siteData: SiteData): CatalogProduct[] {
  const pageMap = new Map(siteData.pages.map((page) => [page.route, page]));

  const wpProducts = siteData.pages
    .filter((page) => page.route.startsWith("/product/"))
    .map((page) => ({
      route: page.route,
      title: stripSiteSuffix(page.title) || slugToTitle(page.route.split("/").filter(Boolean).pop() ?? "Product"),
      image: extractFirstImage(page.bodyHtml),
      summary: extractProductSummary(page.bodyHtml),
    }));

  const landingProducts = ALL_LANDING_DEFINITIONS.map((def) => {
    // Prefer heroImage if available, otherwise resolve from imageSourceRoutes
    let image = def.heroImage ?? "";
    if (!image) {
      for (const sourceRoute of def.imageSourceRoutes) {
        const sourcePage = pageMap.get(sourceRoute);
        if (sourcePage) {
          image = extractFirstImage(sourcePage.bodyHtml);
          if (image) break;
        }
      }
    }

    return {
      route: def.route,
      title: stripSiteSuffix(def.title) || slugToTitle(def.route.split("/").filter(Boolean).pop() ?? "Product"),
      image,
      summary: truncateText(def.summary, 160),
    };
  });

  return [...wpProducts, ...landingProducts].sort((left, right) => left.route.localeCompare(right.route));
}

function buildLegacyCollectionAliasPages(siteData: SiteData): SnapshotPage[] {
  return siteData.pages
    .filter((page) => /^\/products\/[^/]+\/(?:page\/\d+\/)?$/.test(page.route))
    .filter((page) => !page.route.startsWith("/products/all/"))
    .map((page) => cloneSnapshotPage(siteData, page, page.route.replace(/^\/products\//, "/product-category/products/")));
}

function buildCatalogArchivePage(
  siteData: SiteData,
  template: SnapshotPage,
  {
    route,
    pageNumber,
    totalPages,
    totalProducts,
    products,
  }: {
    route: string;
    pageNumber: number;
    totalPages: number;
    totalProducts: number;
    products: CatalogProduct[];
  },
): SnapshotPage {
  const title = pageNumber === 1 ? "Products" : `Products Page ${pageNumber}`;
  const bodyHtml = buildArchiveBodyHtml(template.bodyHtml, {
    route,
    title,
    description:
      pageNumber === 1
        ? "Browse the full exported English Proud Tek product catalog, covering RFID cards, tags, labels, readers, keyfobs and wristbands."
        : `Continue browsing the exported English Proud Tek product catalog on page ${pageNumber} of ${totalPages}.`,
    pageNumber,
    totalPages,
    totalProducts,
    products,
  });

  return {
    route,
    sourceUrl: `${siteData.siteOrigin}${route}`,
    title: pageNumber === 1 ? "Products – Proud Tek" : `Products – Page ${pageNumber} – Proud Tek`,
    htmlAttrs: { ...template.htmlAttrs },
    bodyAttrs: { ...template.bodyAttrs },
    headHtml: template.headHtml,
    bodyHtml,
  };
}

function cloneSnapshotPage(siteData: SiteData, sourcePage: SnapshotPage, route: string): SnapshotPage {
  return {
    route,
    sourceUrl: `${siteData.siteOrigin}${route}`,
    title: sourcePage.title,
    htmlAttrs: { ...sourcePage.htmlAttrs },
    bodyAttrs: { ...sourcePage.bodyAttrs },
    headHtml: sourcePage.headHtml,
    bodyHtml: sourcePage.bodyHtml,
  };
}

function buildCatalogRedirectPage(
  siteData: SiteData,
  template: SnapshotPage,
  route: string,
  target: string,
  label: string,
): SnapshotPage {
  return {
    route,
    sourceUrl: `${siteData.siteOrigin}${route}`,
    title: `Redirecting – ${label} – Proud Tek`,
    htmlAttrs: { ...template.htmlAttrs },
    bodyAttrs: { ...template.bodyAttrs },
    headHtml: `${template.headHtml}\n<meta http-equiv="refresh" content="0; url=${target}">`,
    bodyHtml: buildRedirectBodyHtml(template.bodyHtml, label, target),
  };
}

function buildArchiveBodyHtml(
  templateBodyHtml: string,
  {
    route,
    title,
    description,
    pageNumber,
    totalPages,
    totalProducts,
    products,
  }: {
    route: string;
    title: string;
    description: string;
    pageNumber: number;
    totalPages: number;
    totalProducts: number;
    products: CatalogProduct[];
  },
): string {
  const $ = load(`<body>${templateBodyHtml}</body>`, { decodeEntities: false });
  const main = $("main#main, main.site-main").first();

  if (!main.length) {
    return templateBodyHtml;
  }

  main.html(renderCatalogMain({ route, title, description, pageNumber, totalPages, totalProducts, products }));

  // Update sidebar category counts to match actual product totals
  updateSidebarCounts($, products);

  return $("body").html() ?? templateBodyHtml;
}

function buildRedirectBodyHtml(templateBodyHtml: string, label: string, target: string): string {
  const $ = load(`<body>${templateBodyHtml}</body>`, { decodeEntities: false });
  const main = $("main#main, main.site-main").first();

  if (!main.length) {
    return templateBodyHtml;
  }

  main.html(html`
    <div class="woocommerce-notices-wrapper"></div>
    <header class="woocommerce-products-header">
      <h1 class="page-title archive-title">Redirecting</h1>
      <div class="term-description">
        <p>This legacy Proud Tek catalog route now points to the current English ${label} archive.</p>
        <p><a href="${target}">Continue to ${label}</a></p>
      </div>
    </header>
  `);

  return $("body").html() ?? templateBodyHtml;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Product category definitions for the single-page catalog
 * ──────────────────────────────────────────────────────────────────────────── */
interface ProductCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  routes: string[];
}

/* Landing page routes grouped by category prefix */
const LANDING_CARD_ROUTES = ALL_LANDING_DEFINITIONS
  .filter((d) => d.route.startsWith("/products/rfid-cards/"))
  .map((d) => d.route);
const LANDING_KEYFOB_ROUTES = ALL_LANDING_DEFINITIONS
  .filter((d) => d.route.startsWith("/products/rfid-keyfobs/"))
  .map((d) => d.route);
const LANDING_WRISTBAND_ROUTES = ALL_LANDING_DEFINITIONS
  .filter((d) => d.route.startsWith("/products/rfid-wristbands/"))
  .map((d) => d.route);
const LANDING_LABEL_ROUTES = ALL_LANDING_DEFINITIONS
  .filter((d) => d.route.startsWith("/products/rfid-labels/"))
  .map((d) => d.route);
const LANDING_TAG_ROUTES = ALL_LANDING_DEFINITIONS
  .filter((d) => d.route.startsWith("/products/rfid-tags/"))
  .map((d) => d.route);
const LANDING_INDUSTRY_ROUTES = ALL_LANDING_DEFINITIONS
  .filter((d) => d.route.startsWith("/industries/"))
  .map((d) => d.route);

/* Categories match the WordPress WooCommerce sidebar exactly.
 * Products not listed in any WordPress category page (due to WP pagination)
 * are appended to RFID Cards as the catch-all. */
const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "rfid-cards",
    label: "RFID Cards",
    icon: "💳",
    description: "Contactless smart cards for access control, transit, hospitality, corporate ID and NFC applications.",
    routes: [
      /* WordPress /products/rfid-cards/ page-1 (16 items) */
      "/product/125-khz-rfid-card/",
      "/product/blank-rfid-card/",
      "/product/clamshell-card/",
      "/product/combi-card/",
      "/product/dual-interface-card/",
      "/product/eco_rfid_card/",
      "/product/em4200-card/",
      "/product/em4305-card/",
      "/product/felica-card/",
      "/product/google-review-nfc-card/",
      "/product/hitag-2-card/",
      "/product/hotel-key-cards/",
      "/product/inkjet-pvc-id-card/",
      "/product/java-card/",
      "/product/legic-card/",
      "/product/metal-nfc-card/",
      /* Previously uncategorized cards (WP pagination cut-off) */
      "/product/mifare-4k-card/",
      "/product/mifare-classic-card/",
      "/product/mifare-desfire-cards/",
      "/product/mifare-desfire-ev2-cards/",
      "/product/mifare-plus-card/",
      "/product/nfc-business-card/",
      "/product/nfc-cards/",
      "/product/printed-rfid-cards/",
      "/product/rfid-paper-card/",
      "/product/t5577-card/",
      "/product/wooden-rfid-card/",
      ...LANDING_CARD_ROUTES,
    ],
  },
  {
    id: "rfid-keyfobs",
    label: "RFID Keyfobs",
    icon: "🔑",
    description: "Durable RFID key fobs for door access, gate control and employee identification systems.",
    routes: [
      "/product/desfire-tag/",
      "/product/nfc-ring/",
      "/product/proximity-fobs/",
      "/product/rfid-key-fob/",
      ...LANDING_KEYFOB_ROUTES,
    ],
  },
  {
    id: "rfid-wristbands",
    label: "RFID Wristbands",
    icon: "⌚",
    description: "Silicone, fabric and disposable RFID wristbands for events, hotels, resorts and water parks.",
    routes: [
      "/product/coconut-shell-rfid-wristband/",
      "/product/rfid-event-wristband/",
      "/product/rfid-silicone-wristbands/",
      "/product/rfid-wristbands-for-events/",
      "/product/rfid-wristbands-for-hotels/",
      "/product/uhf-wristband/",
      ...LANDING_WRISTBAND_ROUTES,
    ],
  },
  {
    id: "rfid-labels",
    label: "RFID Labels",
    icon: "🏷️",
    description: "NFC stickers, RFID labels and windshield tags for product authentication, tracking and smart packaging.",
    routes: [
      "/product/125khz-rfid-sticker/",
      "/product/mifare-stickers/",
      "/product/nfc-sticker/",
      "/product/nfc-stickers/",
      "/product/rfid-sticker-on-headlight/",
      "/product/rfid-windshield-tag/",
      ...LANDING_LABEL_ROUTES,
    ],
  },
  {
    id: "rfid-readers",
    label: "RFID Readers",
    icon: "📡",
    description: "Desktop NFC reader/writer devices and Bluetooth RFID scanners for encoding, development and field use.",
    routes: [
      "/product/acr122u/",
      "/product/bluetooth-rfid-scanner/",
      "/product/nfc-reader-writer-with-free-sdks/",
    ],
  },
  {
    id: "rfid-tags",
    label: "RFID Tags",
    icon: "📌",
    description: "Industrial RFID laundry tags, asset tracking tags and specialty tags for harsh environments.",
    routes: [
      "/product/car-transponder-chip/",
      "/product/pps-rfid-laundry-tag/",
      "/product/rfid-laundry-tags/",
      "/product/rfid-silicone-laundry-tag/",
      "/product/rfid-tag-with-led-light/",
      ...LANDING_TAG_ROUTES,
    ],
  },
  {
    id: "industries",
    label: "Industry Solutions",
    icon: "🏭",
    description: "RFID and NFC solutions tailored for specific industries — hospitality, retail, healthcare, logistics and more.",
    routes: [...LANDING_INDUSTRY_ROUTES],
  },
];

function categorizeProducts(products: CatalogProduct[]): { category: ProductCategory; items: CatalogProduct[] }[] {
  const assignedRoutes = new Set<string>();
  const result: { category: ProductCategory; items: CatalogProduct[] }[] = [];

  for (const category of PRODUCT_CATEGORIES) {
    const routeSet = new Set(category.routes);
    const items = products.filter((product) => routeSet.has(product.route));
    items.forEach((item) => assignedRoutes.add(item.route));
    if (items.length > 0) {
      result.push({ category, items });
    }
  }

  // Catch any uncategorized products
  const uncategorized = products.filter((product) => !assignedRoutes.has(product.route));
  if (uncategorized.length > 0) {
    result.push({
      category: { id: "other", label: "Other Products", icon: "📦", description: "Additional RFID and NFC products.", routes: [] },
      items: uncategorized,
    });
  }

  return result;
}

function renderCatalogMain({
  route,
  title,
  description,
  totalProducts,
  products,
}: {
  route: string;
  title: string;
  description: string;
  pageNumber: number;
  totalPages: number;
  totalProducts: number;
  products: CatalogProduct[];
}): string {
  const categorized = categorizeProducts(products);

  const categoryNavHtml = categorized
    .map(({ category }) => `<a href="#${category.id}" class="codex-catalog-nav-chip">${category.icon} ${category.label}</a>`)
    .join("");

  const categorySectionsHtml = categorized
    .map(
      ({ category, items }) => `
        <section class="codex-catalog-category" id="${category.id}">
          <div class="codex-catalog-category-header">
            <h2>${category.icon} ${category.label}</h2>
            <p>${category.description}</p>
            <span class="codex-catalog-count">${items.length} products</span>
          </div>
          <ul class="products columns-4">
            ${items.map((product) => renderProductCard(product)).join("")}
          </ul>
        </section>`,
    )
    .join("");

  return html`
    <div class="woocommerce-notices-wrapper"></div>
    <header class="woocommerce-products-header">
      ${raw(renderBreadcrumbs(route, title))}
      <h1 class="page-title archive-title">${title}</h1>
      <div class="term-description">
        <p>${description}</p>
      </div>
    </header>
    <p class="woocommerce-result-count">${raw(`Showing all ${totalProducts} products`)}</p>
    <nav class="codex-catalog-nav" aria-label="Product categories">
      ${raw(categoryNavHtml)}
    </nav>
    ${raw(categorySectionsHtml)}
    <style>
      .codex-catalog-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 1.5rem 0 2rem;
        padding: 1rem 1.25rem;
        background: linear-gradient(135deg, #fdf8f0, #f5efe6);
        border-radius: 12px;
        border: 1px solid #e8dfd3;
      }
      .codex-catalog-nav-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.5rem 1rem;
        background: #fff;
        border: 1px solid #d4c9b8;
        border-radius: 999px;
        font-size: 0.9rem;
        font-weight: 500;
        color: #4a3f35;
        text-decoration: none;
        transition: all 0.2s ease;
        white-space: nowrap;
      }
      .codex-catalog-nav-chip:hover {
        background: #7c6a4f;
        color: #fff;
        border-color: #7c6a4f;
        transform: translateY(-1px);
        box-shadow: 0 3px 8px rgba(124, 106, 79, 0.25);
      }
      .codex-catalog-category {
        margin: 2.5rem 0;
        padding: 0;
      }
      .codex-catalog-category-header {
        margin-bottom: 1.25rem;
        padding: 1.25rem 1.5rem;
        background: linear-gradient(135deg, #faf6f0, #f0e9df);
        border-radius: 12px;
        border-left: 4px solid #7c6a4f;
      }
      .codex-catalog-category-header h2 {
        margin: 0 0 0.35rem;
        font-size: 1.5rem;
        color: #3d3425;
        line-height: 1.3;
      }
      .codex-catalog-category-header p {
        margin: 0;
        color: #6b5e50;
        font-size: 0.95rem;
        line-height: 1.5;
      }
      .codex-catalog-count {
        display: inline-block;
        margin-top: 0.5rem;
        padding: 0.15rem 0.6rem;
        background: #7c6a4f;
        color: #fff;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.03em;
      }
      .codex-catalog-category .products {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.75rem;
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .codex-catalog-category .product {
        display: flex;
        flex-direction: column;
        background: #fff;
        border: none;
        border-radius: 14px;
        padding: 0;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(41, 28, 14, 0.06);
        transition: all 0.25s ease;
      }
      .codex-catalog-category .product:hover {
        box-shadow: 0 12px 32px rgba(124, 106, 79, 0.15);
        transform: translateY(-4px);
      }
      .codex-catalog-category .product img {
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        background: #f8f6f2;
      }
      .codex-catalog-category .product .woocommerce-LoopProduct-link {
        text-decoration: none;
        color: inherit;
      }
      .codex-catalog-category .woocommerce-loop-product__title {
        padding: 1rem 1.25rem 0.35rem;
        font-size: 1rem;
        font-weight: 700;
        color: #3d3425;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .codex-catalog-category .codex-catalog-summary {
        padding: 0 1.25rem;
        font-size: 0.88rem;
        color: #7a6e60;
        line-height: 1.55;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        flex: 1;
      }
      .codex-catalog-category .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: auto 1.25rem 1.25rem;
        padding: 0.55rem 1.25rem;
        text-align: center;
        background: linear-gradient(135deg, #f5efe6, #ebe3d7);
        border: none;
        border-radius: 8px;
        color: #5c4d3a;
        font-size: 0.85rem;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s ease;
      }
      .codex-catalog-category .button:hover {
        background: #7c6a4f;
        color: #fff;
      }
      @media (max-width: 1024px) {
        .codex-catalog-category .products { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
      }
      @media (max-width: 768px) {
        .codex-catalog-category .products { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        .codex-catalog-nav { gap: 0.4rem; }
        .codex-catalog-nav-chip { font-size: 0.82rem; padding: 0.4rem 0.75rem; }
      }
      @media (max-width: 480px) {
        .codex-catalog-category .products { grid-template-columns: 1fr; }
      }
    </style>
  `;
}

function renderBreadcrumbs(route: string, title: string): string {
  const links = [
    { href: "/", label: "Home" },
    { href: "/products/all/", label: "Products" },
  ];

  if (route !== "/products/all/") {
    links.push({ href: route, label: title });
  }

  const breadcrumbItems = links
    .map((link, index) =>
      index === links.length - 1
        ? html`<span class="kadence-bread-current">${link.label}</span>`
        : html`<span><a href="${link.href}" itemprop="url"><span>${link.label}</span></a></span>`,
    )
    .join(' <span class="bc-delimiter">/</span> ');

  return html`<nav id="kadence-breadcrumbs" aria-label="Breadcrumbs" class="kadence-breadcrumbs">
    <div class="kadence-breadcrumb-container">${raw(breadcrumbItems)}</div>
  </nav>`;
}

function buildSrcset(_src: string): string {
  // WordPress resized variants use inconsistent sizes (600x599, 600x601, etc.)
  // that cause 404s. Disabled until a build-time check can verify variant existence.
  return "";
}

function renderProductCard(product: CatalogProduct): string {
  const srcset = product.image ? buildSrcset(product.image) : "";
  const imageHtml = product.image
    ? srcset
      ? html`<img src="${product.image}" srcset="${srcset}" sizes="(max-width: 768px) 50vw, 25vw" alt="${product.title}" loading="lazy" decoding="async">`
      : html`<img src="${product.image}" alt="${product.title}" loading="lazy" decoding="async">`
    : "";
  const summaryHtml = product.summary
    ? html`<p class="codex-catalog-summary">${product.summary}</p>`
    : "";

  return html`<li class="product type-product status-publish product-type-simple instock">
    <a href="${product.route}" class="woocommerce-LoopProduct-link woocommerce-loop-product__link">
      ${raw(imageHtml)}
      <h2 class="woocommerce-loop-product__title">${product.title}</h2>
    </a>
    ${raw(summaryHtml)}
    <a href="${product.route}" class="button product_type_simple">Read more</a>
  </li>`;
}

function renderPagination(pageNumber: number, totalPages: number): string {
  if (totalPages <= 1) {
    return "";
  }

  const items: string[] = [];

  if (pageNumber > 1) {
    const prevHref = pageNumber === 2 ? "/products/all/" : `/products/all/page/${pageNumber - 1}/`;
    items.push(html`<li><a class="prev page-numbers" href="${prevHref}">Previous</a></li>`);
  }

  for (let current = 1; current <= totalPages; current += 1) {
    if (current === pageNumber) {
      items.push(`<li><span aria-current="page" class="page-numbers current">${current}</span></li>`);
      continue;
    }

    const href = current === 1 ? "/products/all/" : `/products/all/page/${current}/`;
    items.push(html`<li><a class="page-numbers" href="${href}">${raw(String(current))}</a></li>`);
  }

  if (pageNumber < totalPages) {
    items.push(html`<li><a class="next page-numbers" href="${`/products/all/page/${pageNumber + 1}/`}">Next</a></li>`);
  }

  return `<nav class="woocommerce-pagination" aria-label="Products pagination"><ul class="page-numbers">${items.join("")}</ul></nav>`;
}

/* Update the WordPress sidebar product-category counts to reflect actual totals */
function updateSidebarCounts($: ReturnType<typeof load>, products: CatalogProduct[]): void {
  // Build a map of sidebar label → actual count based on our category definitions
  // Map sidebar labels to category IDs — "Products" is the total, others match by label
  const SIDEBAR_LABEL_TO_CATEGORY: Record<string, string | null> = {
    Products: null, // total
    "RFID cards": "rfid-cards",
    "RFID Keyfobs": "rfid-keyfobs",
    "RFID Wristbands": "rfid-wristbands",
    "RFID Labels": "rfid-labels",
    "RFID Readers": "rfid-readers",
    "RFID Tags": "rfid-tags",
  };

  const sidebar = $("aside.primary-sidebar, .widget-area").first();
  if (!sidebar.length) return;

  // Find all count elements in the sidebar and update them
  sidebar.find("a").each((_, el) => {
    const anchor = $(el);
    const text = anchor.text().trim();

    for (const [label, catId] of Object.entries(SIDEBAR_LABEL_TO_CATEGORY)) {
      if (text === label) {
        const parent = anchor.parent();
        const countEl = parent.find(".count, span");
        const actualCount = catId === null
          ? products.length
          : (PRODUCT_CATEGORIES.find((c) => c.id === catId)?.routes ?? []).filter((r) => products.some((p) => p.route === r)).length;

        countEl.each((_, ce) => {
          const countText = $(ce).text();
          if (/\d+/.test(countText)) {
            $(ce).text(String(actualCount));
          }
        });
        break;
      }
    }
  });
}

function extractFirstImage(bodyHtml: string): string {
  const $ = load(bodyHtml, { decodeEntities: false });
  const selectors = [".woocommerce-product-gallery__image img", ".entry-content img", ".product img", "img"];

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

function extractProductSummary(bodyHtml: string): string {
  const $ = load(bodyHtml, { decodeEntities: false });
  const selectors = [
    ".woocommerce-product-details__short-description p",
    ".entry-summary p",
    ".entry-content p",
  ];

  for (const selector of selectors) {
    const paragraph = $(selector)
      .toArray()
      .map((element) => cleanText($(element).text()))
      .find((text) => text.length >= 70);

    if (paragraph) {
      return truncateText(paragraph, 160);
    }
  }

  return "";
}

function paginate<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    pages.push(items.slice(index, index + size));
  }

  return pages;
}

function stripSiteSuffix(title: string): string {
  return title
    .replace(/\s*[–-]\s*Custom RFID.*$/i, "")
    .replace(/\s*[–-]\s*Proud Tek.*$/i, "")
    .trim();
}

function slugToTitle(value: string): string {
  return decodeURIComponent(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/* ── Industries summary page ────────────────────────────────────────────── */
export const INDUSTRY_CATEGORIES: Array<{
  id: string;
  title: string;
  href: string;
  description: string;
  emoji: string;
  heroImage: string;
  productRoutes: string[];
}> = [
  {
    id: "hospitality",
    title: "Hospitality",
    href: "/industries/hospitality/",
    description: "RFID key cards, guest wristbands and linen tracking tags for hotels, resorts and serviced apartments.",
    emoji: "🏨",
    heroImage: "/landing-images/hospitality.jpg",
    productRoutes: [
      "/products/rfid-cards/mifare-desfire-ev3-cards/",
      "/product/hotel-key-cards/",
      "/product/rfid-wristbands-for-hotels/",
      "/product/rfid-laundry-tags/",
      "/product/rfid-silicone-laundry-tag/",
      "/product/pps-rfid-laundry-tag/",
      "/product/mifare-classic-card/",
      "/product/mifare-desfire-cards/",
      "/product/mifare-desfire-ev2-cards/",
    ],
  },
  {
    id: "retail-apparel",
    title: "Retail & Apparel",
    href: "/industries/retail-apparel/",
    description: "UHF RFID tags for item-level inventory, source tagging, anti-theft and omnichannel retail.",
    emoji: "🛍️",
    heroImage: "/landing-images/retail-apparel.jpg",
    productRoutes: [
      "/products/rfid-labels/rfid-garment-source-tag/",
      "/products/rfid-tags/uhf-rfid-apparel-hang-tag/",
      "/products/rfid-tags/uhf-rfid-woven-care-label/",
      "/products/rfid-tags/uhf-rfid-hard-tag/",
      "/products/rfid-tags/rfid-jewelry-tag/",
      "/products/rfid-labels/uhf-rfid-paper-label/",
      "/products/rfid-labels/uhf-rfid-blank-label/",
    ],
  },
  {
    id: "brand-protection",
    title: "Brand Protection",
    href: "/industries/brand-protection/",
    description: "NFC authentication tags for product verification, anti-counterfeit and consumer engagement.",
    emoji: "🛡️",
    heroImage: "/landing-images/brand-protection.png",
    productRoutes: [
      "/products/rfid-labels/nfc-sneaker-authentication-tag/",
      "/products/rfid-labels/nfc-luxury-handbag-tag/",
      "/products/rfid-labels/nfc-cosmetics-authentication-label/",
      "/products/rfid-labels/nfc-wine-bottle-tag/",
      "/products/rfid-labels/nfc-warranty-seal-tag/",
      "/products/rfid-labels/ntag424-dna-tamper-evident-tag/",
    ],
  },
  {
    id: "events-venues",
    title: "Events & Venues",
    href: "/industries/events-venues/",
    description: "RFID wristbands for ticketing, access control, cashless payment and guest experience at events and venues.",
    emoji: "🎪",
    heroImage: "/landing-images/events-venues.jpg",
    productRoutes: [
      "/product/rfid-wristbands-for-events/",
      "/product/rfid-event-wristband/",
      "/product/rfid-silicone-wristbands/",
      "/products/rfid-wristbands/pvc-rfid-wristband/",
      "/products/rfid-wristbands/nfc-payment-wristband/",
      "/products/rfid-tags/rfid-race-timing-tag/",
      "/product/coconut-shell-rfid-wristband/",
      "/product/uhf-wristband/",
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare",
    href: "/industries/healthcare/",
    description: "RFID solutions for patient identification, surgical instrument tracking, medication management and specimen labeling.",
    emoji: "🏥",
    heroImage: "/landing-images/healthcare.webp",
    productRoutes: [
      "/products/rfid-wristbands/hospital-patient-id-wristband/",
      "/products/rfid-tags/rfid-surgical-instrument-tag/",
      "/products/rfid-tags/rfid-blood-bag-tag/",
      "/products/rfid-labels/rfid-medication-vial-label/",
      "/products/rfid-labels/rfid-cryogenic-specimen-label/",
    ],
  },
  {
    id: "logistics",
    title: "Logistics & Supply Chain",
    href: "/industries/logistics/",
    description: "UHF RFID labels, pallet tags, container seals and shipping labels for supply chain visibility.",
    emoji: "📦",
    heroImage: "/landing-images/logistics.jpg",
    productRoutes: [
      "/products/rfid-labels/uhf-rfid-paper-label/",
      "/products/rfid-labels/rfid-shipping-label/",
      "/products/rfid-tags/rfid-pallet-tag/",
      "/products/rfid-tags/rfid-returnable-container-tag/",
      "/products/rfid-tags/rfid-bolt-seal/",
      "/products/rfid-labels/uhf-rfid-blank-label/",
      "/product/rfid-windshield-tag/",
    ],
  },
  {
    id: "industrial",
    title: "Industrial & Manufacturing",
    href: "/industries/industrial/",
    description: "Ruggedized RFID tags for harsh environments — high temperature, on-metal, chemical-resistant and embedded applications.",
    emoji: "🏭",
    heroImage: "/landing-images/industrial.webp",
    productRoutes: [
      "/products/rfid-tags/rfid-pcb-screw-mount-tag/",
      "/products/rfid-tags/rfid-high-temperature-ceramic-tag/",
      "/products/rfid-tags/rfid-anti-metal-tag/",
      "/products/rfid-tags/rfid-gas-cylinder-tag/",
      "/products/rfid-tags/rfid-tool-tracking-tag/",
      "/products/rfid-tags/rfid-cable-tie-tag/",
      "/products/rfid-tags/rfid-tire-tag/",
      "/products/rfid-tags/rfid-keg-beverage-tag/",
    ],
  },
  {
    id: "eu-compliance",
    title: "EU Compliance",
    href: "/industries/eu-compliance/",
    description: "NFC data carriers for EU Digital Product Passport, Battery Passport and product authentication mandates.",
    emoji: "🇪🇺",
    heroImage: "/landing-images/eu-compliance.jpg",
    productRoutes: [
      "/products/rfid-labels/nfc-digital-product-passport-tag/",
      "/products/rfid-labels/nfc-battery-passport-tag/",
      "/products/rfid-labels/ntag424-dna-tamper-evident-tag/",
    ],
  },
];

function buildIndustriesPage(
  siteData: SiteData,
  template: SnapshotPage,
  allProducts: CatalogProduct[],
): SnapshotPage {
  const $ = load(`<body>${template.bodyHtml}</body>`, { decodeEntities: false });
  const main = $("main#main, main.site-main").first();
  if (!main.length) {
    return {
      route: "/industries/",
      sourceUrl: `${siteData.siteOrigin}/industries/`,
      title: "Industries – Proud Tek",
      htmlAttrs: { ...template.htmlAttrs },
      bodyAttrs: { ...template.bodyAttrs },
      headHtml: template.headHtml,
      bodyHtml: template.bodyHtml,
    };
  }

  // Remove WordPress sidebar — full-width layout
  const sidebar = $("aside.primary-sidebar, .widget-area").first();
  if (sidebar.length) sidebar.remove();
  // Make content full-width
  const contentCol = $(".content-area, .site-content > .ast-container > div").first();
  if (contentCol.length) {
    contentCol.css("width", "100%").css("max-width", "100%").css("float", "none");
  }

  // Quick-nav pills
  const navPills = INDUSTRY_CATEGORIES.map((cat) =>
    `<a href="#${cat.id}" class="ind-pill">${cat.emoji} ${cat.title}</a>`
  ).join("");

  // Hero cards grid — each industry as a visual card
  const heroCards = INDUSTRY_CATEGORIES.map((cat) => {
    const count = cat.productRoutes.length;
    return `
      <a href="#${cat.id}" class="ind-hero-card">
        <div class="ind-hero-card__img" style="background-image:url('${cat.heroImage}')"></div>
        <div class="ind-hero-card__body">
          <span class="ind-hero-card__emoji">${cat.emoji}</span>
          <h3 class="ind-hero-card__title">${cat.title}</h3>
          <p class="ind-hero-card__desc">${cat.description}</p>
          <span class="ind-hero-card__count">${count} products &rarr;</span>
        </div>
      </a>`;
  }).join("");

  // Detail sections — each industry with product list
  const sections = INDUSTRY_CATEGORIES.map((cat) => {
    const productItems = cat.productRoutes.map((route) => {
      const wpProduct = allProducts.find((p) => p.route === route);
      const title = wpProduct?.title
        ?? route.split("/").filter(Boolean).pop()?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        ?? route;
      const img = wpProduct?.image;
      const summary = wpProduct?.summary ?? "";
      return `
        <a href="${route}" class="ind-product-card">
          ${img ? `<img src="${img}" alt="${escapeAttr(title)}" loading="lazy" width="280" height="200">` : `<div class="ind-product-card__placeholder"></div>`}
          <div class="ind-product-card__body">
            <h4>${title}</h4>
            ${summary ? `<p>${truncateText(cleanText(summary), 100)}</p>` : ""}
          </div>
        </a>`;
    }).join("");

    return `
      <section class="ind-section" id="${cat.id}">
        <div class="ind-section__header">
          <div class="ind-section__header-text">
            <span class="ind-section__emoji">${cat.emoji}</span>
            <h2><a href="${cat.href}">${cat.title}</a></h2>
            <p>${cat.description}</p>
          </div>
          <a href="${cat.href}" class="ind-section__cta">View ${cat.title} solutions &rarr;</a>
        </div>
        <div class="ind-product-grid">${productItems}</div>
      </section>`;
  }).join("");

  // Sidebar navigation
  const sidebarLinks = INDUSTRY_CATEGORIES.map((cat) =>
    `<a href="#${cat.id}" class="ind-sidebar__link" data-target="${cat.id}">
      <span class="ind-sidebar__emoji">${cat.emoji}</span>
      <span class="ind-sidebar__label">${cat.title}</span>
      <span class="ind-sidebar__count">${cat.productRoutes.length}</span>
    </a>`
  ).join("");

  main.html(`
    <div class="ind-page">
      <header class="ind-header">
        <nav class="woocommerce-breadcrumb"><a href="/">Home</a> / Industries</nav>
        <h1>RFID Solutions by Industry</h1>
        <p class="ind-header__sub">Select your industry to find the right RFID and NFC products. Each solution is tailored to meet sector-specific requirements for tracking, authentication and access control.</p>
      </header>
      <div class="ind-layout">
        <aside class="ind-sidebar">
          <nav class="ind-sidebar__nav">
            <div class="ind-sidebar__title">Industries</div>
            ${sidebarLinks}
          </nav>
        </aside>
        <div class="ind-content">
          <div class="ind-hero-grid">${heroCards}</div>
          ${sections}
        </div>
      </div>
    </div>
    <script>
    (function(){
      var links = document.querySelectorAll('.ind-sidebar__link');
      var sections = document.querySelectorAll('.ind-section');
      if (!links.length || !sections.length) return;
      function update(){
        var scrollY = window.scrollY + 120;
        var active = null;
        sections.forEach(function(s){
          if (s.offsetTop <= scrollY) active = s.id;
        });
        links.forEach(function(l){
          if (l.getAttribute('data-target') === active) l.classList.add('active');
          else l.classList.remove('active');
        });
      }
      window.addEventListener('scroll', update, {passive:true});
      update();
      links.forEach(function(l){
        l.addEventListener('click', function(e){
          e.preventDefault();
          var target = document.getElementById(l.getAttribute('data-target'));
          if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
        });
      });
    })();
    </script>
  `);

  return {
    route: "/industries/",
    sourceUrl: `${siteData.siteOrigin}/industries/`,
    title: "Industries – RFID Solutions by Sector | Proud Tek",
    htmlAttrs: { ...template.htmlAttrs },
    bodyAttrs: { ...template.bodyAttrs },
    headHtml: template.headHtml,
    bodyHtml: $("body").html() ?? template.bodyHtml,
  };
}

function escapeAttr(s: string | undefined | null): string {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
