/**
 * One-time migration script: splits the monolithic site-data.json (~200 MB)
 * into a lightweight index (site-meta.json) plus individual per-page JSON files
 * under src/data/pages/.
 *
 * Usage:  node scripts/split-site-data.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";

const PROJECT_ROOT = process.cwd();
const SITE_DATA_PATH = path.join(PROJECT_ROOT, "src", "data", "site-data.json");
const META_OUTPUT_PATH = path.join(PROJECT_ROOT, "src", "data", "site-meta.json");
const PAGES_OUTPUT_DIR = path.join(PROJECT_ROOT, "src", "data", "pages");

/**
 * Convert a route like "/product/nfc-cards/" to a relative file path
 * like "product/nfc-cards.json". The root route "/" maps to "index.json".
 */
function routeToRelativePath(route) {
  const stripped = route.replace(/^\/+|\/+$/g, "");
  if (!stripped) return "index.json";

  // If the route ends in a directory-style segment (e.g. /products/rfid-cards/)
  // we store it as products/rfid-cards.json
  // But if the route is /products/rfid-cards/page/2/ we keep nesting:
  // products/rfid-cards/page/2.json
  return `${stripped}.json`;
}

async function main() {
  console.log(`Reading ${SITE_DATA_PATH} ...`);
  const raw = await fs.readFile(SITE_DATA_PATH, "utf8");
  const siteData = JSON.parse(raw);

  console.log(`Parsed ${siteData.pages.length} pages.`);

  // 1. Build the lightweight meta index
  const siteMeta = {
    generatedAt: siteData.generatedAt,
    siteOrigin: siteData.siteOrigin,
    pageCount: siteData.pages.length,
    pages: siteData.pages.map((page) => ({
      route: page.route,
      title: page.title,
      sourceUrl: page.sourceUrl,
    })),
  };

  await fs.mkdir(path.dirname(META_OUTPUT_PATH), { recursive: true });
  await fs.writeFile(META_OUTPUT_PATH, JSON.stringify(siteMeta, null, 2));
  console.log(`Wrote meta index to ${META_OUTPUT_PATH}`);

  // 2. Write individual page files
  await fs.mkdir(PAGES_OUTPUT_DIR, { recursive: true });

  let written = 0;
  for (const page of siteData.pages) {
    const relPath = routeToRelativePath(page.route);
    const outputPath = path.join(PAGES_OUTPUT_DIR, relPath);

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(page));
    written++;

    if (written % 200 === 0) {
      console.log(`  ... wrote ${written} / ${siteData.pages.length} pages`);
    }
  }

  console.log(`Wrote ${written} page files to ${PAGES_OUTPUT_DIR}/`);
  console.log("Done. You can now delete src/data/site-data.json if desired.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
