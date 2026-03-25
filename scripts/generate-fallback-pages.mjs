import fs from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";

const PROJECT_ROOT = process.cwd();
const DATA_PATH = path.join(PROJECT_ROOT, "src", "data", "site-data.json");
const DIST_ROOT = path.join(PROJECT_ROOT, "dist");
const LOGO_SRC = "/site-assets/wp-content/uploads/2024/04/cropped-cropped-proudtek-logo.png";

function normalizeRoute(route) {
  if (!route) {
    return "/";
  }

  if (!route.startsWith("/")) {
    route = `/${route}`;
  }

  if (!path.posix.extname(route) && !route.endsWith("/")) {
    route = `${route}/`;
  }

  return route;
}

function routeToOutputPath(route) {
  const normalized = normalizeRoute(route);

  if (normalized === "/") {
    return path.join(DIST_ROOT, "index.html");
  }

  return path.join(DIST_ROOT, normalized, "index.html");
}

function slugToTitle(value) {
  return decodeURIComponent(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function stripSiteSuffix(title) {
  return title
    .replace(/\s*[–-]\s*Custom RFID.*$/i, "")
    .replace(/\s*[–-]\s*Proud Tek.*$/i, "")
    .trim();
}

function extractFirstImage(bodyHtml) {
  const $ = load(bodyHtml, { decodeEntities: false });
  const preferredSelectors = [
    ".woocommerce-product-gallery__image img",
    ".entry-content img",
    ".content-wrap img",
    "img",
  ];

  for (const selector of preferredSelectors) {
    const element = $(selector).get(0);

    if (!element) {
      continue;
    }

    const src = $(element).attr("src");

    if (src && src.startsWith("/site-assets/")) {
      return src;
    }
  }

  return "";
}

function extractProductLinks(bodyHtml) {
  const $ = load(bodyHtml, { decodeEntities: false });
  const links = new Set();

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");

    if (href?.startsWith("/product/")) {
      links.add(normalizeRoute(href));
    }
  });

  return [...links];
}

function extractTagLinks(bodyHtml) {
  const $ = load(bodyHtml, { decodeEntities: false });
  const tags = [];

  $("a[href^=\"/product-tag/\"]").each((_, element) => {
    const href = normalizeRoute($(element).attr("href") ?? "");
    const label = $(element).text().replace(/\s+/g, " ").trim();

    if (href) {
      tags.push({ href, label: label || slugToTitle(href.split("/").filter(Boolean).pop() ?? "") });
    }
  });

  return tags;
}

function paginate(items, size) {
  const pages = [];

  for (let index = 0; index < items.length; index += size) {
    pages.push(items.slice(index, index + size));
  }

  return pages;
}

function renderLayout({ title, heading, description, cards, eyebrow = "Proud Tek", bodyClass = "" }) {
  const cardsHtml =
    cards.length > 0
      ? `<div class="card-grid">${cards
          .map(
            (card) => `
              <article class="card">
                ${
                  card.image
                    ? `<a class="card-image" href="${card.href}"><img src="${card.image}" alt="${card.title}" loading="lazy"></a>`
                    : ""
                }
                <div class="card-body">
                  <p class="card-kicker">${card.kicker ?? ""}</p>
                  <h2><a href="${card.href}">${card.title}</a></h2>
                  ${card.description ? `<p>${card.description}</p>` : ""}
                </div>
              </article>
            `,
          )
          .join("")}</div>`
      : `<div class="empty-state"><p>No linked entries were available in the exported English snapshot.</p></div>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <style>
      :root {
        --bg: #f5f7fb;
        --panel: #ffffff;
        --text: #162033;
        --muted: #5a6883;
        --line: #d9e0ea;
        --accent: #0b7db8;
        --accent-2: #0e4f74;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Segoe UI", system-ui, sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(11, 125, 184, 0.08), transparent 32rem),
          linear-gradient(180deg, #f8fbff 0%, var(--bg) 100%);
      }
      a { color: inherit; }
      .shell { width: min(1180px, calc(100% - 2rem)); margin: 0 auto; }
      .site-header {
        position: sticky;
        top: 0;
        z-index: 2;
        backdrop-filter: blur(12px);
        background: rgba(248, 251, 255, 0.92);
        border-bottom: 1px solid rgba(217, 224, 234, 0.9);
      }
      .header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.25rem;
        padding: 0.9rem 0;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        text-decoration: none;
        font-weight: 700;
      }
      .brand img { height: 38px; width: auto; display: block; }
      .nav {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem 1rem;
      }
      .nav a {
        text-decoration: none;
        color: var(--muted);
        font-size: 0.95rem;
      }
      .hero {
        padding: 4rem 0 2rem;
      }
      .eyebrow {
        margin: 0 0 0.9rem;
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.78rem;
        font-weight: 700;
      }
      h1 {
        margin: 0;
        font-size: clamp(2rem, 4vw, 3.4rem);
        line-height: 1.05;
        max-width: 16ch;
      }
      .hero p {
        max-width: 44rem;
        margin: 1rem 0 0;
        color: var(--muted);
        font-size: 1.05rem;
        line-height: 1.7;
      }
      .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
        padding-bottom: 4rem;
      }
      .card {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 18px 50px rgba(13, 30, 64, 0.06);
      }
      .card-image {
        display: block;
        background: #eaf3fb;
        aspect-ratio: 4 / 3;
      }
      .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .card-body {
        padding: 1rem 1rem 1.15rem;
      }
      .card-kicker {
        margin: 0 0 0.55rem;
        color: var(--accent);
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-weight: 700;
      }
      .card h2 {
        margin: 0 0 0.55rem;
        font-size: 1.02rem;
        line-height: 1.35;
      }
      .card h2 a {
        text-decoration: none;
        color: var(--accent-2);
      }
      .card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
        font-size: 0.95rem;
      }
      .empty-state, .note {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 20px;
        padding: 1.25rem;
        color: var(--muted);
        margin-bottom: 2rem;
      }
      .site-footer {
        border-top: 1px solid var(--line);
        padding: 1.5rem 0 3rem;
        color: var(--muted);
        font-size: 0.92rem;
      }
      @media (max-width: 720px) {
        .header-row { align-items: flex-start; flex-direction: column; }
      }
    </style>
  </head>
  <body class="${bodyClass}">
    <header class="site-header">
      <div class="shell header-row">
        <a class="brand" href="/">
          <img src="${LOGO_SRC}" alt="Proud Tek">
          <span>Proud Tek</span>
        </a>
        <nav class="nav" aria-label="Primary">
          <a href="/products/all/">Products</a>
          <a href="/about/">About</a>
          <a href="/contact/">Contact</a>
          <a href="/blog/">Blog</a>
          <a href="/faq/">FAQ</a>
        </nav>
      </div>
    </header>
    <main class="shell">
      <section class="hero">
        <p class="eyebrow">${eyebrow}</p>
        <h1>${heading}</h1>
        <p>${description}</p>
      </section>
      ${cardsHtml}
    </main>
    <footer class="site-footer">
      <div class="shell">This page was generated from the exported English Proud Tek snapshot to cover missing internal routes.</div>
    </footer>
  </body>
</html>`;
}

function renderRedirectPage({ title, heading, description, target }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="0; url=${target}">
    <link rel="canonical" href="${target}">
    <title>${title}</title>
  </head>
  <body>
    <p>${heading}</p>
    <p>${description}</p>
    <p><a href="${target}">Continue</a></p>
  </body>
</html>`;
}

async function main() {
  const siteData = JSON.parse(await fs.readFile(DATA_PATH, "utf8"));
  const existingRoutes = new Set(siteData.pages.map((page) => page.route));
  const products = siteData.pages
    .filter((page) => page.route.startsWith("/product/"))
    .map((page) => ({
      route: page.route,
      title: stripSiteSuffix(page.title) || slugToTitle(page.route.split("/").filter(Boolean).pop() ?? ""),
      image: extractFirstImage(page.bodyHtml),
      tags: extractTagLinks(page.bodyHtml),
    }));
  const fullCatalogProducts = [...products].sort((left, right) => left.route.localeCompare(right.route));
  const fullCatalogPages = paginate(fullCatalogProducts, 16);
  const posts = siteData.pages
    .filter((page) => /^\/20\d\d\//.test(page.route))
    .map((page) => ({
      route: page.route,
      title: stripSiteSuffix(page.title),
      image: extractFirstImage(page.bodyHtml),
    }));
  const categoryProducts = new Map(
    ["/products/all/", "/products/rfid-cards/", "/products/rfid-tags/"].map((route) => [route, []]),
  );
  const legacyCollectionRedirects = new Map(
    siteData.pages
      .filter((page) => /^\/products\/[^/]+\/(?:page\/\d+\/)?$/.test(page.route))
      .filter((page) => !page.route.startsWith("/products/all/"))
      .map((page) => [page.route.replace(/^\/products\//, "/product-category/products/"), page.route]),
  );

  for (const route of categoryProducts.keys()) {
    const page = siteData.pages.find((entry) => entry.route === route);

    if (!page) {
      continue;
    }

    const relatedProducts = extractProductLinks(page.bodyHtml)
      .map((productRoute) => products.find((product) => product.route === productRoute))
      .filter(Boolean);

    categoryProducts.set(route, relatedProducts);
  }

  const missingRoutes = new Set();
  const tagMap = new Map();

  for (const product of products) {
    for (const tag of product.tags) {
      if (!existingRoutes.has(tag.href)) {
        missingRoutes.add(tag.href);
      }

      const current = tagMap.get(tag.href) ?? {
        route: tag.href,
        title: tag.label,
        products: [],
      };

      current.title = current.title || tag.label;
      current.products.push(product);
      tagMap.set(tag.href, current);
    }
  }

  const specialRoutes = [
    "/author/proudtek-wood/",
    "/case-studies/",
    "/my-account/lost-password/",
    "/products/rfid-cards/page/2/",
  ];

  const catalogRoutes = [
    "/products/all/",
    "/products/all/page/1/",
    ...fullCatalogPages.slice(1).map((_, index) => `/products/all/page/${index + 2}/`),
    "/product-category/products/",
    "/product-category/products/page/1/",
    ...fullCatalogPages.slice(1).map((_, index) => `/product-category/products/page/${index + 2}/`),
  ];

  let written = 0;

  const targetRoutes = new Set([...missingRoutes, ...catalogRoutes, ...legacyCollectionRedirects.keys(), ...specialRoutes]);

  for (const route of [...targetRoutes].sort()) {
    const outputPath = routeToOutputPath(route);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    let html = "";

    if (route.startsWith("/product-tag/")) {
      const tag = tagMap.get(route);
      const slug = route.split("/").filter(Boolean).pop() ?? "";
      const title = tag?.title || slugToTitle(slug);
      const cards = (tag?.products ?? []).map((product) => ({
        href: product.route,
        title: product.title,
        description: "Open the related product detail page.",
        image: product.image,
        kicker: "Product",
      }));

      html = renderLayout({
        title: `${title} | Proud Tek`,
        heading: title,
        description: "This related-topic archive was generated from the exported English product pages so internal tag links resolve correctly.",
        cards,
        eyebrow: "Product Tag",
      });
    } else if (route === "/author/proudtek-wood/") {
      html = renderLayout({
        title: "Proud Tek Author Archive",
        heading: "Proud Tek Articles",
        description: "English blog posts attributed to Proud Tek in the exported site snapshot.",
        cards: posts.map((post) => ({
          href: post.route,
          title: post.title,
          description: "Open the article page.",
          image: post.image,
          kicker: "Article",
        })),
        eyebrow: "Author Archive",
      });
    } else if (route === "/case-studies/") {
      html = renderLayout({
        title: "Case Studies | Proud Tek",
        heading: "Case Studies",
        description: "A dedicated English case-studies snapshot was not present in the exported source pages. These related articles are the closest available references from the current English site export.",
        cards: posts.map((post) => ({
          href: post.route,
          title: post.title,
          description: "Open the related article.",
          image: post.image,
          kicker: "Article",
        })),
        eyebrow: "Archive",
      });
    } else if (route === "/my-account/lost-password/") {
      html = renderLayout({
        title: "Lost Password | Proud Tek",
        heading: "Lost Password",
        description: "This static export cannot process password resets. Use the account page or contact Proud Tek directly for assistance.",
        cards: [
          {
            href: "/my-account/",
            title: "Open My Account",
            description: "Return to the account landing page.",
            image: "",
            kicker: "Account",
          },
          {
            href: "/contact/",
            title: "Contact Proud Tek",
            description: "Use the contact page for direct support.",
            image: "",
            kicker: "Support",
          },
        ],
        eyebrow: "Account Help",
      });
    } else if (route === "/products/all/") {
      html = renderLayout({
        title: "Products | Proud Tek",
        heading: "All Products",
        description: `This generated catalog page groups all ${fullCatalogProducts.length} exported English Proud Tek product pages in one place.`,
        cards: (fullCatalogPages[0] ?? []).map((product) => ({
          href: product.route,
          title: product.title,
          description: "Open the product detail page.",
          image: product.image,
          kicker: "Product",
        })),
        eyebrow: "Catalog Page",
      });
    } else if (route === "/products/all/page/1/") {
      html = renderRedirectPage({
        title: "Products | Page 1 | Proud Tek",
        heading: "Redirecting",
        description: "Page 1 of the catalog now lives at the main products archive.",
        target: "/products/all/",
      });
    } else if (/^\/products\/all\/page\/\d+\/$/.test(route)) {
      const pageNumber = Number(route.match(/\/page\/(\d+)\//)?.[1] ?? "1");
      const productsOnPage = fullCatalogPages[pageNumber - 1] ?? [];

      html = renderLayout({
        title: `Products | Page ${pageNumber} | Proud Tek`,
        heading: `All Products - Page ${pageNumber}`,
        description: `This generated catalog page continues the exported English Proud Tek product inventory on page ${pageNumber} of ${fullCatalogPages.length}.`,
        cards: productsOnPage.map((product) => ({
          href: product.route,
          title: product.title,
          description: "Open the product detail page.",
          image: product.image,
          kicker: "Product",
        })),
        eyebrow: "Catalog Page",
      });
    } else if (route === "/products/rfid-cards/page/2/") {
      const cards = (categoryProducts.get("/products/rfid-cards/") ?? []).map((product) => ({
        href: product.route,
        title: product.title,
        description: "Open the product detail page.",
        image: product.image,
        kicker: "RFID Cards",
      }));

      html = renderLayout({
        title: "RFID Cards | Page 2 | Proud Tek",
        heading: "RFID Cards",
        description: "This fallback page groups the exported English RFID card products referenced from the existing archive.",
        cards,
        eyebrow: "Archive Page",
      });
    } else if (route === "/product-category/products/") {
      html = renderRedirectPage({
        title: "Products Catalog | Proud Tek",
        heading: "Redirecting",
        description: "This legacy catalog route now points to the main exported products archive.",
        target: "/products/all/",
      });
    } else if (/^\/product-category\/products\/page\/\d+\/$/.test(route)) {
      const pageNumber = Number(route.match(/\/page\/(\d+)\//)?.[1] ?? "1");
      const target = pageNumber <= 1 ? "/products/all/" : `/products/all/page/${pageNumber}/`;

      html = renderRedirectPage({
        title: `Products Catalog | Page ${pageNumber} | Proud Tek`,
        heading: "Redirecting",
        description: "This legacy catalog route now points to the current exported products archive page.",
        target,
      });
    } else {
      const target = legacyCollectionRedirects.get(route);

      if (!target) {
        continue;
      }

      html = renderRedirectPage({
        title: `Redirecting | Proud Tek`,
        heading: "Redirecting",
        description: "This legacy route now points to the exported English archive.",
        target,
      });
    }

    await fs.writeFile(outputPath, html, "utf8");
    written += 1;
  }

  console.log(`Generated ${written} fallback pages in ${DIST_ROOT}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
