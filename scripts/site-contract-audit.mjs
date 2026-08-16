#!/usr/bin/env node
/**
 * Build-output contract audit for the Proudtek progressive rebuild.
 *
 * Usage:
 *   node scripts/site-contract-audit.mjs --write-baseline
 *   node scripts/site-contract-audit.mjs
 *
 * The baseline freezes the deployed output contract: HTML files, routes,
 * canonicals, robots, JSON-LD type/@id pairs, sitemap URLs, machine routes,
 * redirect maps and normalized <main> hashes. Later rebuild PRs can then prove
 * which URLs changed intentionally and which would be accidental SEO drift.
 */
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import { XMLParser } from "fast-xml-parser";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const DIST = path.join(ROOT, "dist");
const BASELINE = path.join(ROOT, "src", "data", "site-contract.v1.json");
const SITE_ORIGIN = "https://proudtek.com";

const args = new Set(process.argv.slice(2));
const writeBaseline = args.has("--write-baseline");

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sortObject(value) {
  if (Array.isArray(value)) return value.map(sortObject);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortObject(value[key])]));
}

function stableJson(value) {
  return JSON.stringify(sortObject(value));
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
  const out = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

function outputPathToRoute(relativePath) {
  if (relativePath === "404.html") return "/404/";
  if (relativePath === "index.html") return "/";
  if (relativePath.endsWith("/index.html")) return `/${relativePath.slice(0, -"/index.html".length)}/`;
  return `/${relativePath.replace(/\.html$/i, "")}`;
}

function normalizeText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\bGenerated at:?\s*\d{4}-\d{2}-\d{2}[^\s]*/gi, "Generated at")
    .trim();
}

function collectJsonLd($, route, warnings) {
  const entries = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text().trim();
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      const nodes = [];
      const pushNode = (node) => {
        if (!node || typeof node !== "object") return;
        if (Array.isArray(node)) {
          node.forEach(pushNode);
          return;
        }
        if (Array.isArray(node["@graph"])) {
          node["@graph"].forEach(pushNode);
        }
        if (node["@type"] || node["@id"]) nodes.push(node);
      };
      pushNode(parsed);
      for (const node of nodes) {
        const type = Array.isArray(node["@type"]) ? node["@type"].join("|") : node["@type"] ?? null;
        entries.push({ type, id: node["@id"] ?? null, hash: sha256(stableJson(node)) });
      }
    } catch (err) {
      warnings.push({ code: "JSONLD_PARSE_ERROR", route, message: err.message });
    }
  });
  return entries.sort((a, b) => `${a.type}:${a.id}`.localeCompare(`${b.type}:${b.id}`));
}

async function parseHtmlOutputs(warnings) {
  const files = (await walk(DIST)).filter((file) => file.endsWith(".html"));
  const pages = [];
  for (const file of files.sort()) {
    const relativePath = path.relative(DIST, file).replace(/\\/g, "/");
    const route = outputPathToRoute(relativePath);
    const html = await fs.readFile(file, "utf8");
    const $ = cheerio.load(html);
    const canonicalLinks = $('link[rel="canonical"]').map((_, el) => $(el).attr("href") ?? "").get().filter(Boolean);
    const robots = $('meta[name="robots"]').attr("content") ?? null;
    const title = normalizeText($("title").first().text());
    const description = $('meta[name="description"]').attr("content") ?? null;
    const h1Count = $("main h1, body h1").length;
    const mainCount = $("main").length;
    const mainText = normalizeText($("main").first().text() || "");
    const mainTextHash = sha256(mainText);
    const mainTextLength = mainText.length;
    const mainTextPreview = mainText.slice(0, 240);
    const machineAlternates = $('link[rel="alternate"]').map((_, el) => ({
      type: $(el).attr("type") ?? "",
      href: $(el).attr("href") ?? "",
    })).get().filter((item) => /application\/json|text\/plain/.test(item.type));

    if (canonicalLinks.length !== 1) warnings.push({ code: "CANONICAL_COUNT", route, count: canonicalLinks.length });
    if (mainCount !== 1 && relativePath !== "404.html") warnings.push({ code: "MAIN_COUNT", route, count: mainCount });
    if (h1Count !== 1 && relativePath !== "404.html") warnings.push({ code: "H1_COUNT", route, count: h1Count });

    pages.push({
      route,
      outputPath: relativePath,
      canonical: canonicalLinks[0] ?? null,
      robots,
      title,
      description,
      h1Count,
      mainCount,
      mainTextHash,
      mainTextLength,
      mainTextPreview,
      jsonLd: collectJsonLd($, route, warnings),
      machineAlternates,
    });
  }
  return pages;
}

function toArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

async function parseSitemaps(warnings) {
  const parser = new XMLParser({ ignoreAttributes: false });
  const sitemapPath = path.join(DIST, "sitemap.xml");
  const indexPath = path.join(DIST, "sitemap-index.xml");
  const result = { urls: [], duplicates: [], index: [] };
  if (await exists(sitemapPath)) {
    const xml = parser.parse(await fs.readFile(sitemapPath, "utf8"));
    result.urls = toArray(xml.urlset?.url).map((u) => u.loc).filter(Boolean).sort();
    const seen = new Set();
    const dupes = new Set();
    for (const url of result.urls) {
      if (seen.has(url)) dupes.add(url);
      seen.add(url);
    }
    result.duplicates = [...dupes].sort();
    if (result.duplicates.length) warnings.push({ code: "SITEMAP_DUPLICATE_URLS", count: result.duplicates.length, urls: result.duplicates });
  } else {
    warnings.push({ code: "SITEMAP_MISSING", file: "dist/sitemap.xml" });
  }
  if (await exists(indexPath)) {
    const xml = parser.parse(await fs.readFile(indexPath, "utf8"));
    result.index = toArray(xml.sitemapindex?.sitemap).map((s) => s.loc).filter(Boolean).sort();
  }
  return result;
}

async function parseSiteIndex(warnings) {
  const file = path.join(DIST, "site-index.json");
  if (!(await exists(file))) {
    warnings.push({ code: "SITE_INDEX_MISSING" });
    return { pageCount: 0, pages: [], urls: [] };
  }
  const parsed = JSON.parse(await fs.readFile(file, "utf8"));
  const pages = Array.isArray(parsed.pages) ? parsed.pages : [];
  return {
    pageCount: parsed.pageCount ?? pages.length,
    pages: pages.map((page) => ({
      url: page.url,
      route: page.route,
      machineJson: page.machineJson,
      machineText: page.machineText,
    })).sort((a, b) => String(a.url).localeCompare(String(b.url))),
    urls: pages.map((page) => page.url).filter(Boolean).sort(),
  };
}

async function parseMachineRoutes() {
  const machineDir = path.join(DIST, "machine");
  if (!(await exists(machineDir))) return { json: [], txt: [] };
  const files = await walk(machineDir);
  return {
    json: files.filter((file) => file.endsWith(".json")).map((file) => path.relative(DIST, file).replace(/\\/g, "/")).sort(),
    txt: files.filter((file) => file.endsWith(".txt")).map((file) => path.relative(DIST, file).replace(/\\/g, "/")).sort(),
  };
}

function parseVercelRedirects(raw) {
  const parsed = JSON.parse(raw);
  return (parsed.redirects ?? []).map((r) => ({ source: r.source, destination: r.destination, permanent: Boolean(r.permanent) }));
}

function parseNetlifyRedirects(raw) {
  return raw.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#")).map((line) => {
    const [source, destination, status] = line.split(/\s+/);
    return { source, destination, status: status ?? "" };
  });
}

async function parseRedirects() {
  const vercelPath = path.join(ROOT, "vercel.json");
  const netlifyPath = path.join(ROOT, "public", "_redirects");
  return {
    vercel: await exists(vercelPath) ? parseVercelRedirects(await fs.readFile(vercelPath, "utf8")) : [],
    netlify: await exists(netlifyPath) ? parseNetlifyRedirects(await fs.readFile(netlifyPath, "utf8")) : [],
  };
}

async function validateMachineAlternates(pages, machine, warnings) {
  const machineFiles = new Set([...machine.json, ...machine.txt]);
  for (const page of pages) {
    for (const alt of page.machineAlternates) {
      if (!alt.href.startsWith(SITE_ORIGIN)) continue;
      const route = alt.href.slice(SITE_ORIGIN.length).replace(/^\//, "");
      if (!machineFiles.has(route)) warnings.push({ code: "MACHINE_ALTERNATE_MISSING_FILE", route: page.route, href: alt.href });
    }
  }
}

function summarizePages(pages) {
  return pages.map((page) => ({
    route: page.route,
    outputPath: page.outputPath,
    canonical: page.canonical,
    robots: page.robots,
    title: page.title,
    descriptionHash: page.description ? sha256(page.description) : null,
    h1Count: page.h1Count,
    mainCount: page.mainCount,
    mainTextHash: page.mainTextHash,
    mainTextLength: page.mainTextLength,
    mainTextPreview: page.mainTextPreview,
    jsonLd: page.jsonLd.map((node) => ({ type: node.type, id: node.id, hash: node.hash })),
    machineAlternates: page.machineAlternates,
  })).sort((a, b) => a.outputPath.localeCompare(b.outputPath));
}

function contractComparable(contract) {
  return {
    pages: contract.pages,
    sitemap: contract.sitemap,
    siteIndex: contract.siteIndex,
    machine: contract.machine,
    redirects: contract.redirects,
  };
}

function diffComparable(expected, actual) {
  const expectedJson = JSON.stringify(contractComparable(expected), null, 2);
  const actualJson = JSON.stringify(contractComparable(actual), null, 2);
  if (expectedJson === actualJson) return [];
  const diffs = [];
  const expectedPages = new Map(expected.pages.map((p) => [p.outputPath, p]));
  const actualPages = new Map(actual.pages.map((p) => [p.outputPath, p]));
  for (const key of expectedPages.keys()) if (!actualPages.has(key)) diffs.push({ code: "OUTPUT_REMOVED", outputPath: key });
  for (const key of actualPages.keys()) if (!expectedPages.has(key)) diffs.push({ code: "OUTPUT_ADDED", outputPath: key });
  for (const [key, expectedPage] of expectedPages.entries()) {
    const actualPage = actualPages.get(key);
    if (!actualPage) continue;
    for (const field of ["route", "canonical", "robots", "title", "descriptionHash", "h1Count", "mainCount", "mainTextHash", "mainTextLength", "mainTextPreview"]) {
      if (JSON.stringify(expectedPage[field]) !== JSON.stringify(actualPage[field])) {
        diffs.push({ code: "PAGE_FIELD_CHANGED", outputPath: key, field, expected: expectedPage[field], actual: actualPage[field] });
      }
    }
    if (JSON.stringify(expectedPage.jsonLd) !== JSON.stringify(actualPage.jsonLd)) diffs.push({ code: "JSONLD_CHANGED", outputPath: key });
    if (JSON.stringify(expectedPage.machineAlternates) !== JSON.stringify(actualPage.machineAlternates)) diffs.push({ code: "MACHINE_ALTERNATES_CHANGED", outputPath: key });
  }
  for (const field of ["sitemap", "siteIndex", "machine", "redirects"]) {
    if (JSON.stringify(expected[field]) !== JSON.stringify(actual[field])) diffs.push({ code: "CONTRACT_SECTION_CHANGED", field });
  }
  return diffs;
}

async function buildContract() {
  const warnings = [];
  if (!(await exists(DIST))) {
    throw new Error("dist/ does not exist. Run npm run build first.");
  }
  const pagesRaw = await parseHtmlOutputs(warnings);
  const sitemap = await parseSitemaps(warnings);
  const siteIndex = await parseSiteIndex(warnings);
  const machine = await parseMachineRoutes();
  await validateMachineAlternates(pagesRaw, machine, warnings);
  const redirects = await parseRedirects();
  const pages = summarizePages(pagesRaw);
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    origin: SITE_ORIGIN,
    counts: {
      htmlOutputs: pages.length,
      sitemapUrls: sitemap.urls.length,
      sitemapUniqueUrls: new Set(sitemap.urls).size,
      siteIndexPages: siteIndex.pages.length,
      machineJson: machine.json.length,
      machineTxt: machine.txt.length,
      vercelRedirects: redirects.vercel.length,
      netlifyRedirects: redirects.netlify.length,
      warnings: warnings.length,
    },
    knownWarnings: warnings,
    pages,
    sitemap,
    siteIndex,
    machine,
    redirects,
  };
}

async function main() {
  const contract = await buildContract();
  if (writeBaseline) {
    await fs.writeFile(BASELINE, JSON.stringify(contract, null, 2) + "\n");
    console.log(`[site-contract] wrote ${path.relative(ROOT, BASELINE)}`);
    console.log(`[site-contract] outputs=${contract.counts.htmlOutputs} sitemap=${contract.counts.sitemapUrls}/${contract.counts.sitemapUniqueUrls} machine=${contract.counts.machineJson}/${contract.counts.machineTxt} warnings=${contract.counts.warnings}`);
    return;
  }

  if (!(await exists(BASELINE))) {
    throw new Error(`missing baseline ${path.relative(ROOT, BASELINE)}; run --write-baseline after a clean build`);
  }
  const baseline = JSON.parse(await fs.readFile(BASELINE, "utf8"));
  const diffs = diffComparable(baseline, contract);
  if (diffs.length) {
    console.error(`[site-contract] contract drift detected (${diffs.length})`);
    for (const diff of diffs.slice(0, 40)) console.error(JSON.stringify(diff));
    if (diffs.length > 40) console.error(`... and ${diffs.length - 40} more`);
    process.exit(1);
  }
  console.log(`[site-contract] PASS outputs=${contract.counts.htmlOutputs} warnings=${contract.counts.warnings}`);
}

main().catch((err) => {
  console.error(`[site-contract] ${err.stack || err.message}`);
  process.exit(2);
});
