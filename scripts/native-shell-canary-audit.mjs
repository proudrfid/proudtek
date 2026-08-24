#!/usr/bin/env node
/**
 * Verify default/flagged SiteShell canary build outputs.
 *
 * Canonical contract comparison intentionally uses generated default versus
 * flagged contracts. The committed baseline is used only for selected-hub
 * HTML comparison, so generatedAt in the baseline cannot cause false drift.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { realpathSync } from "node:fs";
import * as cheerio from "cheerio";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { buildContract, diffComparable } from "./site-contract-audit.mjs";

const __filename = fileURLToPath(import.meta.url);
const NATIVE_WRAPPER_SELECTOR = "div.codex-native-shell[data-native-site-shell]";

// Phase 6b: every guides + solutions editorial leaf enabled through
// EditorialPageLayout's native branch (slugs mirror
// src/content/editorial/{guides,solutions}/ one-to-one).
const LEAF_PATHS = [
  "guides/california-rfid-privacy-law/index.html",
  "guides/em4100-em4305-t5577-lf-chip-encyclopedia/index.html",
  "guides/epc-gen2-uhf-rfid/index.html",
  "guides/eu-digital-product-passport-2027/index.html",
  "guides/fda-rfid-pharmaceutical-tracking/index.html",
  "guides/google-review-card-design-and-copy/index.html",
  "guides/google-review-card-placement-guide/index.html",
  "guides/google-review-card-staff-prompt-playbook/index.html",
  "guides/google-review-cards-for-auto-dealerships/index.html",
  "guides/google-review-cards-for-dental-groups/index.html",
  "guides/google-review-cards-for-fitness-franchises/index.html",
  "guides/google-review-cards-for-hotel-groups/index.html",
  "guides/google-review-cards-for-multi-location-brands/index.html",
  "guides/google-review-cards-for-restaurant-franchises/index.html",
  "guides/google-review-cards-for-salon-chains/index.html",
  "guides/google-review-nfc-card-setup/index.html",
  "guides/gs1-epc-encoding-guide/index.html",
  "guides/hotel-key-card-artwork-and-printing-checklist/index.html",
  "guides/hotel-key-card-encoding/index.html",
  "guides/hotel-key-card-material-selection/index.html",
  "guides/hotel-key-card-sample-planning/index.html",
  "guides/icode-slix-chip-encyclopedia/index.html",
  "guides/iso-14443-explained/index.html",
  "guides/iso-18000-6c-uhf-rfid-standard/index.html",
  "guides/item-level-rfid-tagging-mandate/index.html",
  "guides/mifare-classic-1k-4k-chip-encyclopedia/index.html",
  "guides/mifare-desfire-ev3-commands-reference/index.html",
  "guides/mifare-ultralight-c-chip-encyclopedia/index.html",
  "guides/monza-r6-family-chip-encyclopedia/index.html",
  "guides/nfc-business-card-iphone-android-compatibility/index.html",
  "guides/nfc-ndef-format-explained/index.html",
  "guides/nfc-rohs-reach-compliance/index.html",
  "guides/nfc-tag-programming-android-guide/index.html",
  "guides/nfc-tag-programming-iphone/index.html",
  "guides/ntag21x-family-memory-map-commands/index.html",
  "guides/ntag424-dna-sun-cmac-authentication/index.html",
  "guides/python-rfid-reader-library/index.html",
  "guides/rain-rfid-explained/index.html",
  "guides/rfid-card-cost/index.html",
  "guides/rfid-ce-marking-europe/index.html",
  "guides/rfid-food-safety-traceability/index.html",
  "guides/rfid-oracle-netsuite-integration/index.html",
  "guides/rfid-reader-writer-selection/index.html",
  "guides/rfid-sap-wms-integration/index.html",
  "guides/rfid-shopify-inventory-integration/index.html",
  "guides/rfid-tag-card-wristband-lifespan/index.html",
  "guides/rfid-wristband-cost/index.html",
  "guides/ucode-8-uhf-chip-encyclopedia/index.html",
  "guides/ucode-9-uhf-chip-encyclopedia/index.html",
  "guides/uhf-rfid-reader-api-guide/index.html",
  "guides/walmart-rfid-tagging-mandate/index.html",
  "solutions/digital-product-passport/index.html",
  "solutions/google-review-cards-for-checkout-counters/index.html",
  "solutions/google-review-cards-for-clinics/index.html",
  "solutions/google-review-cards-for-front-desks/index.html",
  "solutions/google-review-cards-for-gyms-and-fitness-studios/index.html",
  "solutions/google-review-cards-for-hotels/index.html",
  "solutions/google-review-cards-for-pickup-counters/index.html",
  "solutions/google-review-cards-for-restaurants/index.html",
  "solutions/google-review-cards-for-retail-stores/index.html",
  "solutions/google-review-cards-for-salons-and-spas/index.html",
  "solutions/google-review-cards-for-tabletop-prompts/index.html",
  "solutions/google-review-nfc-card/index.html",
  "solutions/hotel-key-cards/index.html",
  "solutions/hotel-rfid-access-control/index.html",
  "solutions/nfc-brand-authentication/index.html",
  "solutions/nfc-business-card/index.html",
  "solutions/nfc-business-card-programs/index.html",
  "solutions/nfc-luxury-authentication/index.html",
  "solutions/rfid-access-control/index.html",
  "solutions/rfid-asset-tracking-labels/index.html",
  "solutions/rfid-attendance-system/index.html",
  "solutions/rfid-event-access-control/index.html",
  "solutions/rfid-event-wristbands/index.html",
  "solutions/rfid-inventory-tracking/index.html",
  "solutions/rfid-keyfobs-access-control/index.html",
  "solutions/rfid-laundry-management/index.html",
  "solutions/rfid-laundry-tags/index.html",
  "solutions/rfid-laundry-tracking/index.html",
  "solutions/rfid-library-management/index.html",
  "solutions/rfid-parking-management/index.html",
  "solutions/rfid-patient-tracking/index.html",
  "solutions/rfid-race-timing/index.html",
  "solutions/rfid-readers-and-encoding/index.html",
  "solutions/rfid-supply-chain-management/index.html",
  "solutions/rfid-tool-tracking/index.html",
  "solutions/rfid-warehouse-management/index.html",
  "solutions/vehicle-rfid-identification/index.html",
];

const FLAGGED_PATHS = new Set([
  "glossary/index.html",
  "tools/rfid-tag-cost-estimator/index.html",
  "guides/index.html",
  "guides/google-review-cards/index.html",
  "guides/hotel-keycards/index.html",
  "guides/chip-encyclopedias/index.html",
  "guides/standards-encoding/index.html",
  "guides/compliance-regulatory/index.html",
  "guides/integration-tools/index.html",
  "guides/buying-reference/index.html",
  "solutions/index.html",
  "blog/index.html",
  "compare/index.html",
  "compare/chip-vs-chip/index.html",
  "compare/reader-vs-reader/index.html",
  "compare/form-factor-material/index.html",
  "compare/frequency-tech/index.html",
  "case-studies/index.html",
  "compatibility/index.html",
  "compatibility/be-tech-hotel-key-cards/index.html",
  "compatibility/hafele-dialock-hotel-key-cards/index.html",
  "compatibility/miwa-hotel-key-cards/index.html",
  "compatibility/onity-hotel-key-cards/index.html",
  "compatibility/saflok-hotel-key-cards/index.html",
  "compatibility/salto-hotel-key-cards/index.html",
  "compatibility/vingcard-hotel-key-cards/index.html",
  ...LEAF_PATHS,
]);
const HUB_PATHS = [
  "guides/index.html",
  "guides/google-review-cards/index.html",
  "guides/hotel-keycards/index.html",
  "guides/chip-encyclopedias/index.html",
  "guides/standards-encoding/index.html",
  "guides/compliance-regulatory/index.html",
  "guides/integration-tools/index.html",
  "guides/buying-reference/index.html",
  "solutions/index.html",
  "blog/index.html",
  "compare/index.html",
  "compare/chip-vs-chip/index.html",
  "compare/reader-vs-reader/index.html",
  "compare/form-factor-material/index.html",
  "compare/frequency-tech/index.html",
  "case-studies/index.html",
  "compatibility/index.html",
  "compatibility/be-tech-hotel-key-cards/index.html",
  "compatibility/hafele-dialock-hotel-key-cards/index.html",
  "compatibility/miwa-hotel-key-cards/index.html",
  "compatibility/onity-hotel-key-cards/index.html",
  "compatibility/saflok-hotel-key-cards/index.html",
  "compatibility/salto-hotel-key-cards/index.html",
  "compatibility/vingcard-hotel-key-cards/index.html",
  ...LEAF_PATHS,
];
const REQUIRED_IDS = [
  ["#masthead", "masthead"],
  ["#site-navigation", "site-navigation"],
  ["#primary-menu", "primary-menu"],
  ["#mobile-drawer", "mobile-drawer"],
  ["#mobile-menu", "mobile-menu"],
  ["main#main", "main#main"],
  ["footer#colophon", "footer#colophon"],
];
const parser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: false,
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: false,
});

function parseArgs(argv) {
  const names = ["baseline-dist", "default-dist", "flagged-dist"];
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const option = argv[index];
    if (!option.startsWith("--")) throw new Error(`unexpected argument ${option}`);
    if (!names.includes(option.slice(2))) throw new Error(`unknown option ${option}`);
    if (values[option.slice(2)] !== undefined) throw new Error(`duplicate ${option}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`${option} requires a path`);
    values[option.slice(2)] = value;
    index += 1;
  }
  for (const name of names) {
    if (!values[name]) throw new Error(`missing --${name} <path>`);
  }
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, path.resolve(value)]));
}

async function exists(filePath) {
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function relativeHtmlPath(filePath, distPath) {
  return path.relative(distPath, filePath).replace(/\\/g, "/");
}

async function htmlFiles(distPath) {
  return (await walk(distPath)).filter((filePath) => filePath.endsWith(".html")).sort();
}

async function markerPaths(distPath) {
  const paths = [];
  for (const filePath of await htmlFiles(distPath)) {
    const html = await fs.readFile(filePath, "utf8");
    if (cheerio.load(html)(NATIVE_WRAPPER_SELECTOR).length) paths.push(relativeHtmlPath(filePath, distPath));
  }
  return paths;
}

async function markerPlacementErrors(distPath) {
  const errors = [];
  for (const filePath of await htmlFiles(distPath)) {
    const $ = cheerio.load(await fs.readFile(filePath, "utf8"));
    const markers = $("[data-native-site-shell]");
    const invalid = markers.filter((_, element) => !$(element).is(NATIVE_WRAPPER_SELECTOR));
    if (invalid.length) errors.push(relativeHtmlPath(filePath, distPath));
  }
  return errors;
}

const STRUCTURAL_ELEMENTS = new Set([
  "address", "article", "aside", "blockquote", "body", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "html", "li", "main", "nav", "ol", "p", "script", "section", "style", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul",
]);
const PHRASING_ELEMENTS = new Set([
  "a", "abbr", "b", "bdi", "bdo", "br", "button", "cite", "code", "data", "del", "dfn", "em", "i", "img", "input", "ins", "kbd", "label", "mark", "q", "s", "samp", "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr",
]);
const STRUCTURAL_CONTROL_CLASSES = new Set(["codex-skip-link", "skip-link", "codex-wa-fab"]);
const WHITESPACE_SENSITIVE_ELEMENTS = new Set(["pre", "textarea", "script", "style"]);
const ASTRO_COMPILER_ATTRIBUTES = new Set(["data-astro-source-file", "data-astro-source-loc"]);

function normalizeGeneratedAsset(value) {
  return value
    .replace(/codex-kadence-bundle\.[a-f0-9]+\.css/g, "codex-kadence-bundle.[hash].css")
    .replace(/PageScript\.astro_astro_type_script_index_0_lang\.[A-Za-z0-9_-]+\.js/g, "PageScript.astro_astro_type_script_index_0_lang.[hash].js");
}

function isElementNode(node) {
  return node?.type === "tag" || node?.type === "script" || node?.type === "style";
}

function elementCategory(node) {
  if (!isElementNode(node)) return null;
  const classes = String(node.attribs?.class ?? "").split(/\s+/);
  if (classes.some((name) => STRUCTURAL_CONTROL_CLASSES.has(name))) return "structural";
  if (STRUCTURAL_ELEMENTS.has(node.name)) return "structural";
  if (PHRASING_ELEMENTS.has(node.name)) return "phrasing";
  return "unknown";
}

function nearestElement(node, direction) {
  let sibling = node[direction];
  while (sibling && sibling.type === "comment") sibling = sibling[direction];
  return sibling;
}

function normalizeSourceHtml(value) {
  const $ = cheerio.load(value, { decodeEntities: false });
  $("*").each((_, element) => {
    for (const name of Object.keys(element.attribs ?? {})) {
      if (ASTRO_COMPILER_ATTRIBUTES.has(name)) $(element).removeAttr(name);
    }
    for (const name of ["href", "src"]) {
      const current = $(element).attr(name);
      if (current) $(element).attr(name, normalizeGeneratedAsset(current));
    }
  });
  const whitespaceNodes = $("*").contents().toArray().filter((node) => node.type === "text" && /^\s+$/.test(node.data ?? ""));
  for (const node of whitespaceNodes) {
    const sensitiveAncestor = $(node).parents().toArray().some((ancestor) => WHITESPACE_SENSITIVE_ELEMENTS.has(ancestor.name));
    if (sensitiveAncestor) continue;
    const previous = nearestElement(node, "prev");
    const next = nearestElement(node, "next");
    const previousCategory = elementCategory(previous);
    const nextCategory = elementCategory(next);
    const boundaryWhitespace = !previous ? nextCategory === "structural" : !next ? previousCategory === "structural" : false;
    const betweenStructural = previousCategory === "structural" && nextCategory === "structural";
    if (boundaryWhitespace || betweenStructural) node.data = "";
  }
  return $.html();
}

async function normalizedHtml(distPath, relativePath) {
  const filePath = path.join(distPath, relativePath);
  if (!(await exists(filePath))) throw new Error(`${relativePath} is missing from ${distPath}`);
  return normalizeSourceHtml(await fs.readFile(filePath, "utf8"));
}

async function normalizedMainHtml(distPath, relativePath) {
  const html = await normalizedHtml(distPath, relativePath);
  const $ = cheerio.load(html, { decodeEntities: false });
  const main = $("main#main").first();
  if (!main.length) throw new Error(`${relativePath} is missing main#main for DOM contract comparison`);
  return main.toString();
}

function normalizeXmlStructure(value) {
  if (Array.isArray(value)) return value.map(normalizeXmlStructure);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key, child]) => !(key === "#text" && typeof child === "string" && /^\s*$/.test(child)))
    .map(([key, child]) => [key, normalizeXmlStructure(child)]));
}

function sortSemantic(value) {
  if (Array.isArray(value)) return value.map(sortSemantic).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortSemantic(value[key])]));
}

function stableSemantic(value) {
  return JSON.stringify(sortSemantic(value));
}

function withoutKey(value, key) {
  const copy = { ...value };
  delete copy[key];
  return copy;
}

function semanticImageSitemap(xml) {
  const validation = XMLValidator.validate(xml);
  if (validation !== true) {
    const validationMessage = validation?.err?.msg ?? "";
    if (/multiple possible root nodes/i.test(validationMessage)) {
      throw new Error("image-sitemap.xml must contain exactly one urlset root");
    }
    const message = validationMessage ? `: ${validationMessage}` : "";
    throw new Error(`image-sitemap.xml is malformed${message}`);
  }
  let parsed;
  try {
    parsed = parser.parse(xml);
  } catch (error) {
    throw new Error(`image-sitemap.xml is malformed: ${error.message}`);
  }
  if (!parsed || typeof parsed !== "object" || !("urlset" in parsed)) {
    throw new Error("image-sitemap.xml must contain a urlset root");
  }
  const elementRootKeys = Object.keys(parsed).filter((key) => !key.startsWith("?"));
  if (elementRootKeys.length !== 1 || elementRootKeys[0] !== "urlset" || Array.isArray(parsed.urlset)) {
    throw new Error("image-sitemap.xml must contain exactly one urlset root");
  }
  if (parsed.urlset !== "" && (!parsed.urlset || typeof parsed.urlset !== "object")) {
    throw new Error("image-sitemap.xml must contain a urlset root");
  }
  const root = normalizeXmlStructure(parsed.urlset === "" ? {} : parsed.urlset);
  const urls = Object.prototype.hasOwnProperty.call(root, "url") ? (Array.isArray(root.url) ? root.url : [root.url]) : [];
  for (const [index, entry] of urls.entries()) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry) || typeof entry.loc !== "string" || !entry.loc) {
      throw new Error(`image-sitemap.xml url[${index}] must be an object with a non-empty loc`);
    }
    const images = Object.prototype.hasOwnProperty.call(entry, "image:image") ? (Array.isArray(entry["image:image"]) ? entry["image:image"] : [entry["image:image"]]) : [];
    for (const [imageIndex, image] of images.entries()) {
      if (!image || typeof image !== "object" || Array.isArray(image) || typeof image["image:loc"] !== "string" || !image["image:loc"]) {
        throw new Error(`image-sitemap.xml url[${index}] image[${imageIndex}] must be an object with a non-empty image loc`);
      }
    }
  }
  const rootAttributes = Object.fromEntries(Object.entries(root).filter(([key]) => key.startsWith("@_")).sort(([a], [b]) => a.localeCompare(b)));
  const rootExtensions = Object.fromEntries(Object.entries(root).filter(([key]) => key !== "url" && !key.startsWith("@_")).sort(([a], [b]) => a.localeCompare(b)));
  return {
    rootAttributes,
    rootExtensions: sortSemantic(rootExtensions),
    urls: urls.map((entry) => {
      const images = Object.prototype.hasOwnProperty.call(entry, "image:image") ? (Array.isArray(entry["image:image"]) ? entry["image:image"] : [entry["image:image"]]) : [];
      return {
        loc: entry.loc ?? "",
        raw: sortSemantic(entry),
        urlSemantic: sortSemantic(withoutKey(entry, "image:image")),
        images: images.map((image) => ({
          loc: image["image:loc"] ?? "",
          title: image["image:title"] ?? "",
          caption: image["image:caption"] ?? "",
          raw: sortSemantic(image),
        })).sort((a, b) => stableSemantic(a.raw).localeCompare(stableSemantic(b.raw))),
      };
    }).sort((a, b) => `${a.loc}|${stableSemantic(a.urlSemantic)}|${stableSemantic(a.images.map((image) => image.raw))}`.localeCompare(`${b.loc}|${stableSemantic(b.urlSemantic)}|${stableSemantic(b.images.map((image) => image.raw))}`)),
  };
}

async function imageSitemap(distPath) {
  const filePath = path.join(distPath, "image-sitemap.xml");
  if (!(await exists(filePath))) throw new Error(`image-sitemap.xml is missing from ${distPath}`);
  return semanticImageSitemap(await fs.readFile(filePath, "utf8"));
}

function countSelector(html, selector) {
  return cheerio.load(html)(selector).length;
}

async function assertMarkers(defaultDist, flaggedDist) {
  const defaultPlacementErrors = await markerPlacementErrors(defaultDist);
  if (defaultPlacementErrors.length) throw new Error(`default build has invalid native shell marker placement in ${defaultPlacementErrors[0]}`);
  const defaultMarkers = await markerPaths(defaultDist);
  if (defaultMarkers.length) throw new Error(`default build has unexpected native marker in ${defaultMarkers[0]}`);
  const flaggedPlacementErrors = await markerPlacementErrors(flaggedDist);
  if (flaggedPlacementErrors.length) throw new Error(`flagged build has invalid native shell marker placement in ${flaggedPlacementErrors[0]}`);
  const flaggedMarkers = await markerPaths(flaggedDist);
  const unexpected = flaggedMarkers.find((filePath) => !FLAGGED_PATHS.has(filePath));
  if (unexpected) throw new Error(`flagged build has unexpected native marker in ${unexpected}`);
  const missing = [...FLAGGED_PATHS].find((filePath) => !flaggedMarkers.includes(filePath));
  if (missing) throw new Error(`flagged build is missing native marker in ${missing}`);
}

async function assertFlaggedHubs(flaggedDist) {
  for (const relativePath of HUB_PATHS) {
    const html = await normalizedHtml(flaggedDist, relativePath);
    const $ = cheerio.load(html);
    const roots = $(NATIVE_WRAPPER_SELECTOR);
    if (roots.length !== 1) throw new Error(`${relativePath} has ${roots.length} native shell wrapper markers; expected exactly one`);
    const root = roots.first();
    for (const [selector, label] of REQUIRED_IDS) {
      const globalCount = $(selector).length;
      if (globalCount !== 1) throw new Error(`${relativePath} has ${globalCount} ${label} landmarks; expected exactly one`);
      const rootCount = root.find(selector).length;
      if (rootCount !== 1) throw new Error(`${relativePath} has ${rootCount} ${label} landmarks inside native shell; expected exactly one`);
    }
    const donorCount = $("header.site-header, footer.site-footer").filter((_, element) => !$(element).is("#masthead, footer#colophon")).length;
    if (donorCount) throw new Error(`${relativePath} has legacy donor header/footer markup outside native shell`);
    if ($(`${NATIVE_WRAPPER_SELECTOR} #masthead`).length !== 1 || $(`${NATIVE_WRAPPER_SELECTOR} footer#colophon`).length !== 1) {
      throw new Error(`${relativePath} has duplicate donor masthead/footer outside native shell`);
    }
  }
}

function countedMap(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, { item, count: 0 });
    map.get(key).count += 1;
  }
  return map;
}

function compareCounted(expectedMap, actualMap, labelFn, scope) {
  for (const [key, expectedEntry] of expectedMap) {
    const actualEntry = actualMap.get(key);
    if (!actualEntry) return `${scope} missing ${labelFn(expectedEntry.item)}`;
    if (expectedEntry.count !== actualEntry.count) return `${scope} count mismatch for ${labelFn(expectedEntry.item)} expected=${expectedEntry.count} actual=${actualEntry.count}`;
  }
  for (const [key, actualEntry] of actualMap) {
    if (!expectedMap.has(key)) return `${scope} added ${labelFn(actualEntry.item)}`;
  }
  return null;
}

function imageSitemapDiff(expected, actual) {
  const rootKeys = new Set([...Object.keys(expected.rootAttributes), ...Object.keys(actual.rootAttributes)]);
  for (const key of [...rootKeys].sort()) {
    if (expected.rootAttributes[key] !== actual.rootAttributes[key]) {
      return `image-sitemap mismatch at root attribute ${key} expected=${expected.rootAttributes[key] ?? "<missing>"} actual=${actual.rootAttributes[key] ?? "<missing>"}`;
    }
  }
  if (stableSemantic(expected.rootExtensions) !== stableSemantic(actual.rootExtensions)) return "image-sitemap mismatch at root extension metadata";
  const expectedUrlLocCounts = countedMap(expected.urls, (entry) => entry.loc);
  const actualUrlLocCounts = countedMap(actual.urls, (entry) => entry.loc);
  const urlLocDiff = compareCounted(expectedUrlLocCounts, actualUrlLocCounts, (entry) => `URL ${entry.loc}`, "image-sitemap mismatch at URL membership");
  if (urlLocDiff) return urlLocDiff;
  const expectedByLoc = new Map();
  const actualByLoc = new Map();
  for (const entry of expected.urls) {
    if (!expectedByLoc.has(entry.loc)) expectedByLoc.set(entry.loc, []);
    expectedByLoc.get(entry.loc).push(entry);
  }
  for (const entry of actual.urls) {
    if (!actualByLoc.has(entry.loc)) actualByLoc.set(entry.loc, []);
    actualByLoc.get(entry.loc).push(entry);
  }
  for (const [loc, expectedEntries] of expectedByLoc) {
    const actualEntries = actualByLoc.get(loc) ?? [];
    const expectedEntryCounts = countedMap(expectedEntries, (entry) => stableSemantic(entry.raw));
    const actualEntryCounts = countedMap(actualEntries, (entry) => stableSemantic(entry.raw));
    const urlEntryDiff = compareCounted(expectedEntryCounts, actualEntryCounts, (entry) => `URL ${entry.loc}`, "image-sitemap mismatch at URL semantic entry");
    if (urlEntryDiff && expectedEntries.length > 1) return urlEntryDiff;
    const expectedUrl = expectedEntries[0];
    const actualUrl = actualEntries[0];
    if (!actualUrl) continue;
    const expectedImages = countedMap(expectedUrl.images, (image) => image.loc);
    const actualImages = countedMap(actualUrl.images, (image) => image.loc);
    const imageCountDiff = compareCounted(expectedImages, actualImages, (image) => `image ${image.loc}`, `image-sitemap mismatch at ${loc} image membership`);
    if (imageCountDiff) return imageCountDiff;
    const expectedImagesByLoc = new Map();
    const actualImagesByLoc = new Map();
    for (const image of expectedUrl.images) {
      if (!expectedImagesByLoc.has(image.loc)) expectedImagesByLoc.set(image.loc, []);
      expectedImagesByLoc.get(image.loc).push(image);
    }
    for (const image of actualUrl.images) {
      if (!actualImagesByLoc.has(image.loc)) actualImagesByLoc.set(image.loc, []);
      actualImagesByLoc.get(image.loc).push(image);
    }
    for (const [imageLoc, expectedImageEntries] of expectedImagesByLoc) {
      const actualImageEntries = actualImagesByLoc.get(imageLoc) ?? [];
      const expectedImageCounts = countedMap(expectedImageEntries, (image) => stableSemantic(image.raw));
      const actualImageCounts = countedMap(actualImageEntries, (image) => stableSemantic(image.raw));
      const imageEntryDiff = compareCounted(expectedImageCounts, actualImageCounts, (image) => `image ${image.loc}`, `image-sitemap mismatch at ${loc} image semantic entry`);
      if (imageEntryDiff && expectedImageEntries.length > 1) return imageEntryDiff;
      const expectedImage = expectedImageEntries[0];
      const actualImage = actualImageEntries[0];
      if (!actualImage) continue;
      if (stableSemantic(expectedImage.raw) !== stableSemantic(actualImage.raw)) {
        for (const field of ["loc", "title", "caption"]) {
          if (expectedImage[field] !== actualImage[field]) {
            return `image-sitemap mismatch at ${loc} image ${expectedImage.loc}.${field} expected=${expectedImage[field]} actual=${actualImage[field]}`;
          }
        }
        return `image-sitemap mismatch at ${loc} image ${expectedImage.loc} semantic structure`;
      }
    }
    if (stableSemantic(expectedUrl.urlSemantic) !== stableSemantic(actualUrl.urlSemantic)) return `image-sitemap mismatch at ${loc} URL semantic structure`;
  }
  return null;
}

async function assertContracts(defaultDist, flaggedDist) {
  const defaultContract = await buildContract(defaultDist);
  const flaggedContract = await buildContract(flaggedDist);
  const diffs = diffComparable(defaultContract, flaggedContract);
  if (diffs.length) throw new Error(`default/flagged contract drift: ${JSON.stringify(diffs[0])}`);
  const defaultImages = await imageSitemap(defaultDist);
  const flaggedImages = await imageSitemap(flaggedDist);
  const imageDiff = imageSitemapDiff(defaultImages, flaggedImages);
  if (imageDiff) throw new Error(imageDiff);
}

async function assertHubDomContracts(defaultDist, flaggedDist) {
  for (const relativePath of HUB_PATHS) {
    const defaultMain = await normalizedMainHtml(defaultDist, relativePath);
    const flaggedMain = await normalizedMainHtml(flaggedDist, relativePath);
    if (defaultMain !== flaggedMain) throw new Error(`${relativePath} main DOM differs between default and flagged builds`);
  }
}

async function assertSelectedHubs(defaultDist, baselineDist) {
  for (const relativePath of HUB_PATHS) {
    const baselineHtml = await normalizedHtml(baselineDist, relativePath);
    const defaultHtml = await normalizedHtml(defaultDist, relativePath);
    if (baselineHtml !== defaultHtml) throw new Error(`${relativePath} differs from clean baseline outside documented Astro source/whitespace normalization`);
  }
}

export async function audit({ baselineDist, defaultDist, flaggedDist }) {
  await assertMarkers(defaultDist, flaggedDist);
  await assertFlaggedHubs(flaggedDist);
  await assertContracts(defaultDist, flaggedDist);
  await assertHubDomContracts(defaultDist, flaggedDist);
  await assertSelectedHubs(defaultDist, baselineDist);
  return { flaggedMarkers: [...FLAGGED_PATHS], hubs: HUB_PATHS.length };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await audit({
    baselineDist: args["baseline-dist"],
    defaultDist: args["default-dist"],
    flaggedDist: args["flagged-dist"],
  });
  console.log(`[native-shell-canary] PASS hubs=${result.hubs} markers=${result.flaggedMarkers.length} contracts=default==flagged image-sitemap=equal`);
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(__filename)) {
  main().catch((error) => {
    console.error(`[native-shell-canary] FAIL ${error.message}`);
    process.exit(1);
  });
}
