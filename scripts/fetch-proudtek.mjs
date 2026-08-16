import crypto from "node:crypto";
import fs from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { load } from "cheerio";
import { XMLParser } from "fast-xml-parser";

const SITE_ORIGIN = process.env.SITE_ORIGIN ?? "https://proudtek.com";

// ── STOP sentinel (same drop-file convention as STOP_CHIP_MIGRATION) ──
// This script was written for the one-time WordPress → Astro migration.
// proudtek.com now serves THIS Astro build, so re-running the fetch would
// re-crawl our own output and overwrite the WordPress-era snapshots in
// src/data/pages/ that editorial pages still depend on for chrome/fallback
// (index.json among them). Guard against a reflexive `npm run fetch`.
const STOP_SENTINEL = path.join(process.cwd(), "STOP_FETCH");
if (existsSync(STOP_SENTINEL) && process.env.FORCE_FETCH !== "1") {
  console.error("✋ STOP_FETCH sentinel present — refusing to run.\n");
  console.error(readFileSync(STOP_SENTINEL, "utf8"));
  console.error(
    "\nOverride with FORCE_FETCH=1 only if SITE_ORIGIN points at a source that is NOT this Astro build.",
  );
  process.exit(1);
}
const USER_AGENT = "Mozilla/5.0 (compatible; Codex Static Migration Bot/1.0)";
const PROJECT_ROOT = process.cwd();
const DATA_OUTPUT_PATH = path.join(PROJECT_ROOT, "src", "data", "site-data.json");
const META_OUTPUT_PATH = path.join(PROJECT_ROOT, "src", "data", "site-meta.json");
const PAGES_OUTPUT_DIR = path.join(PROJECT_ROOT, "src", "data", "pages");
const ASSET_OUTPUT_ROOT = path.join(PROJECT_ROOT, "public", "site-assets");
const XML = new XMLParser({ ignoreAttributes: false });
const LOCALIZE_ASSETS = process.env.LOCALIZE_ASSETS === "1";
const SITEMAP_CONCURRENCY = 4;
const PAGE_CONCURRENCY = 8;
const EXTRA_SEED_PATHS = [
  "/",
  "/products/all/page/2/",
  "/products/rfid-cards/page/2/",
  "/products/all/page/3/",
  "/products/all/page/4/",
];

const assetTasks = new Map();

function ensureArray(value) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function hash(value) {
  return crypto.createHash("sha1").update(value).digest("hex").slice(0, 8);
}

function isInternalUrl(url) {
  try {
    return new URL(url).origin === SITE_ORIGIN;
  } catch {
    return false;
  }
}

function toAbsoluteUrl(value, baseUrl) {
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return null;
  }
}

function normalizePageUrl(url) {
  const normalized = new URL(url, SITE_ORIGIN);
  normalized.hash = "";
  normalized.search = "";

  if (!path.posix.extname(normalized.pathname) && !normalized.pathname.endsWith("/")) {
    normalized.pathname = `${normalized.pathname}/`;
  }

  return normalized.toString();
}

function routeFromUrl(url) {
  const parsed = new URL(url, SITE_ORIGIN);
  let route = parsed.pathname || "/";

  if (!path.posix.extname(route) && !route.endsWith("/")) {
    route = `${route}/`;
  }

  return route;
}

function isLocalizedPath(pathname) {
  return /^\/(ar|da|de|es|fa|fr|he|it|ja|pt|ru|tr|zh)(\/|$)/.test(pathname);
}

function isIgnoredPagePathname(pathname) {
  if (isLocalizedPath(pathname)) {
    return true;
  }

  if (
    pathname === "/xmlrpc.php" ||
    pathname === "/wp-comments-post.php" ||
    pathname.startsWith("/wp-admin/") ||
    pathname.startsWith("/wp-json/") ||
    pathname === "/wp-json/" ||
    pathname === "/wp-json" ||
    pathname.includes("/wp-json/") ||
    pathname.endsWith("/wp-json") ||
    pathname.includes("/oembed/") ||
    pathname.endsWith("/feed/") ||
    pathname === "/feed/" ||
    pathname === "/feed" ||
    pathname.includes("/feed/")
  ) {
    return true;
  }

  if (pathname.endsWith(".php")) {
    return true;
  }

  return false;
}

function shouldCrawlPageUrl(url) {
  try {
    const parsed = new URL(url, SITE_ORIGIN);

    if (parsed.origin !== SITE_ORIGIN) {
      return false;
    }

    if (isLikelyAssetUrl(parsed.toString())) {
      return false;
    }

    return !isIgnoredPagePathname(parsed.pathname);
  } catch {
    return false;
  }
}

function isLikelyAssetUrl(url) {
  const parsed = new URL(url, SITE_ORIGIN);
  const extension = path.posix.extname(parsed.pathname).toLowerCase();

  return Boolean(
    extension &&
      [
        ".avif",
        ".bmp",
        ".css",
        ".gif",
        ".ico",
        ".jpeg",
        ".jpg",
        ".js",
        ".json",
        ".mjs",
        ".mp4",
        ".pdf",
        ".png",
        ".svg",
        ".ttf",
        ".txt",
        ".webm",
        ".webp",
        ".woff",
        ".woff2",
        ".xml",
      ].includes(extension),
  );
}

function shouldSkipUrl(value) {
  return (
    !value ||
    value.startsWith("#") ||
    value.startsWith("data:") ||
    value.startsWith("mailto:") ||
    value.startsWith("javascript:") ||
    value.startsWith("tel:")
  );
}

function sanitizeSegment(segment) {
  return segment.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function toLocalAssetHref(url) {
  const parsed = new URL(url, SITE_ORIGIN);
  const segments = parsed.pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => sanitizeSegment(decodeURIComponent(segment)));

  const extension = path.posix.extname(parsed.pathname);
  const baseName = segments.pop() ?? "asset";
  const parsedBase = path.posix.parse(baseName);
  const suffix = parsed.search ? `.${hash(parsed.search)}` : "";
  const finalFileName = extension
    ? `${sanitizeSegment(parsedBase.name)}${suffix}${parsedBase.ext}`
    : `${sanitizeSegment(parsedBase.base)}${suffix}`;

  return `/site-assets/${[...segments, finalFileName].join("/")}`;
}

function toLocalAssetPath(localHref) {
  return path.join(ASSET_OUTPUT_ROOT, localHref.replace(/^\/site-assets\//, ""));
}

async function fetchWithRetry(url, responseType = "text", timeoutMs = 30000, maxAttempts = 5) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": USER_AGENT,
          "accept-language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        throw new Error(`Request failed with ${response.status} for ${url}`);
      }

      if (responseType === "buffer") {
        return {
          body: Buffer.from(await response.arrayBuffer()),
          contentType: response.headers.get("content-type") ?? "",
        };
      }

      return {
        body: await response.text(),
        contentType: response.headers.get("content-type") ?? "",
      };
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }

  throw lastError;
}

function isNotFoundError(error) {
  return error instanceof Error && error.message.includes(" 404 ");
}

function isHtmlDocument(contentType, body) {
  const normalizedType = contentType.toLowerCase();

  if (!normalizedType) {
    return /<html[\s>]|<!doctype html/i.test(body);
  }

  if (normalizedType.includes("text/html") || normalizedType.includes("application/xhtml+xml")) {
    return true;
  }

  return false;
}

async function rewriteCssUrls(cssText, sourceUrl) {
  const matches = [...cssText.matchAll(/url\((['"]?)([^'")]+)\1\)/g)];
  const replacements = await Promise.all(
    matches.map(async (match) => {
      const originalValue = match[2].trim();

      if (shouldSkipUrl(originalValue)) {
        return { original: originalValue, replacement: originalValue };
      }

      const absoluteUrl = toAbsoluteUrl(originalValue, sourceUrl);

      if (!absoluteUrl) {
        return { original: originalValue, replacement: originalValue };
      }

      if (!isInternalUrl(absoluteUrl) || !isLikelyAssetUrl(absoluteUrl)) {
        return { original: originalValue, replacement: absoluteUrl };
      }

      const replacement = await downloadAsset(absoluteUrl);
      return { original: originalValue, replacement };
    }),
  );

  let updatedCss = cssText;

  for (const { original, replacement } of replacements) {
    updatedCss = updatedCss.split(original).join(replacement);
  }

  return updatedCss;
}

async function downloadAsset(url) {
  const normalizedUrl = new URL(url, SITE_ORIGIN);
  normalizedUrl.hash = "";

  const absoluteUrl = normalizedUrl.toString();

  if (!isInternalUrl(absoluteUrl) || !LOCALIZE_ASSETS) {
    return absoluteUrl;
  }

  if (assetTasks.has(absoluteUrl)) {
    return assetTasks.get(absoluteUrl);
  }

  const task = (async () => {
    const localHref = toLocalAssetHref(absoluteUrl);
    const outputPath = toLocalAssetPath(localHref);
    try {
      const { body, contentType } = await fetchWithRetry(absoluteUrl, "buffer", 120000, 2);

      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      if (
        contentType.includes("text/css") ||
        outputPath.endsWith(".css")
      ) {
        const rewrittenCss = await rewriteCssUrls(body.toString("utf8"), absoluteUrl);
        await fs.writeFile(outputPath, rewrittenCss, "utf8");
      } else {
        await fs.writeFile(outputPath, body);
      }
    } catch (error) {
      console.warn(`Skipping asset ${absoluteUrl}: ${error instanceof Error ? error.message : String(error)}`);
      return absoluteUrl;
    }

    return localHref;
  })();

  assetTasks.set(absoluteUrl, task);
  return task;
}

function normalizeAttrs(attributes = {}) {
  return Object.fromEntries(
    Object.entries(attributes).map(([key, value]) => [key, value == null ? "" : String(value)]),
  );
}

async function rewriteSrcset(value, baseUrl) {
  const sources = value
    .split(",")
    .map((candidate) => candidate.trim())
    .filter(Boolean);

  const rewritten = await Promise.all(
    sources.map(async (candidate) => {
      const [rawUrl, descriptor] = candidate.split(/\s+/, 2);

      if (shouldSkipUrl(rawUrl)) {
        return candidate;
      }

      const absoluteUrl = toAbsoluteUrl(rawUrl, baseUrl);

      if (!absoluteUrl) {
        return candidate;
      }

      const finalUrl =
        isInternalUrl(absoluteUrl) && isLikelyAssetUrl(absoluteUrl)
          ? await downloadAsset(absoluteUrl)
          : absoluteUrl;

      return descriptor ? `${finalUrl} ${descriptor}` : finalUrl;
    }),
  );

  return rewritten.join(", ");
}

async function rewriteInlineStyle(value, baseUrl) {
  return rewriteCssUrls(value, baseUrl);
}

async function rewriteAttribute(tagName, attrName, value, pageUrl) {
  if (shouldSkipUrl(value)) {
    return value;
  }

  const absoluteUrl = toAbsoluteUrl(value, pageUrl);

  if (!absoluteUrl) {
    return value;
  }

  if (!isInternalUrl(absoluteUrl)) {
    return absoluteUrl;
  }

  if (attrName === "href" && tagName === "a" && !isLikelyAssetUrl(absoluteUrl)) {
    const parsed = new URL(absoluteUrl);
    const route = routeFromUrl(parsed.toString());
    return `${route}${parsed.search}${parsed.hash}`;
  }

  if (attrName === "action" && !isLikelyAssetUrl(absoluteUrl)) {
    const parsed = new URL(absoluteUrl);
    const route = routeFromUrl(parsed.toString());
    return `${route}${parsed.search}${parsed.hash}`;
  }

  if (isLikelyAssetUrl(absoluteUrl)) {
    return downloadAsset(absoluteUrl);
  }

  const parsed = new URL(absoluteUrl);
  return `${routeFromUrl(parsed.toString())}${parsed.search}${parsed.hash}`;
}

async function rewriteDocument(html, pageUrl) {
  const $ = load(html, { decodeEntities: false });

  const assetAttributes = [
    "action",
    "href",
    "src",
    "poster",
    "data-thumb",
    "data-large_image",
    "data-src",
    "data-lazy-src",
    "imagesrcset",
    "data-srcset",
    "data-lazy-srcset",
  ];

  const tasks = [];

  $("script").each((_, element) => {
    const current = $(element).html() ?? "";

    if (current.includes("googlesitekit_auth")) {
      $(element).remove();
    }
  });

  $("style").each((_, element) => {
    tasks.push(
      (async () => {
        const current = $(element).html();

        if (current) {
          $(element).html(await rewriteCssUrls(current, pageUrl));
        }
      })(),
    );
  });

  $("meta[content]").each((_, element) => {
    tasks.push(
      (async () => {
        const current = $(element).attr("content");

        if (!current || !current.includes("://")) {
          return;
        }

        $(element).attr("content", await rewriteAttribute("meta", "content", current, pageUrl));
      })(),
    );
  });

  $("[style]").each((_, element) => {
    tasks.push(
      (async () => {
        const current = $(element).attr("style");

        if (current) {
          $(element).attr("style", await rewriteInlineStyle(current, pageUrl));
        }
      })(),
    );
  });

  $("*").each((_, element) => {
    const tagName = element.tagName?.toLowerCase() ?? "";

    for (const attrName of assetAttributes) {
      const value = $(element).attr(attrName);

      if (!value) {
        continue;
      }

      tasks.push(
        (async () => {
          $(element).attr(tagName === "link" && attrName === "imagesrcset" ? attrName : attrName, await rewriteAttribute(tagName, attrName, value, pageUrl));
        })(),
      );
    }

    for (const attrName of ["srcset", "data-srcset", "data-lazy-srcset"]) {
      const value = $(element).attr(attrName);

      if (!value) {
        continue;
      }

      tasks.push(
        (async () => {
          $(element).attr(attrName, await rewriteSrcset(value, pageUrl));
        })(),
      );
    }
  });

  await Promise.all(tasks);

  return {
    title: $("title").text().trim(),
    htmlAttrs: normalizeAttrs($("html").attr()),
    bodyAttrs: normalizeAttrs($("body").attr()),
    headHtml: $("head").html()?.trim() ?? "",
    bodyHtml: $("body").html()?.trim() ?? "",
  };
}

function extractInternalPageLinks(html, pageUrl) {
  const $ = load(html, { decodeEntities: false });
  const discovered = new Set();

  $("[href], [action]").each((_, element) => {
    for (const attrName of ["href", "action"]) {
      const value = $(element).attr(attrName);

      if (!value || shouldSkipUrl(value)) {
        continue;
      }

      const absoluteUrl = toAbsoluteUrl(value, pageUrl);

      if (!absoluteUrl || !shouldCrawlPageUrl(absoluteUrl)) {
        continue;
      }

      discovered.add(normalizePageUrl(absoluteUrl));
    }
  });

  return [...discovered];
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = [];
  const executing = new Set();
  let index = 0;

  for (const item of items) {
    const currentIndex = index;
    index += 1;
    const task = Promise.resolve().then(() => mapper(item, currentIndex));
    results.push(task);
    executing.add(task);
    task.finally(() => executing.delete(task));

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

async function getSeedPageUrls() {
  const { body } = await fetchWithRetry(`${SITE_ORIGIN}/wp-sitemap.xml`);
  const sitemapIndex = XML.parse(body);
  const sitemapUrls = ensureArray(sitemapIndex?.sitemapindex?.sitemap)
    .map((entry) => entry.loc)
    .filter(Boolean);

  const pageUrlGroups = await mapWithConcurrency(sitemapUrls, SITEMAP_CONCURRENCY, async (sitemapUrl) => {
    try {
      const { body: sitemapBody } = await fetchWithRetry(sitemapUrl);
      const parsed = XML.parse(sitemapBody);

      return ensureArray(parsed?.urlset?.url)
        .map((entry) => entry.loc)
        .filter(Boolean);
    } catch (error) {
      if (isNotFoundError(error)) {
        console.warn(`Skipping missing sitemap ${sitemapUrl}`);
        return [];
      }

      console.warn(`Skipping failed sitemap ${sitemapUrl}: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  });

  const uniqueUrls = [
    ...new Set(
      [...pageUrlGroups.flat(), ...EXTRA_SEED_PATHS.map((pathname) => `${SITE_ORIGIN}${pathname}`)]
        .filter((url) => shouldCrawlPageUrl(url))
        .map((url) => normalizePageUrl(url)),
    ),
  ];
  uniqueUrls.sort((left, right) => left.localeCompare(right));
  return uniqueUrls;
}

async function emptyOutputDirectories() {
  if (LOCALIZE_ASSETS) {
    await fs.rm(ASSET_OUTPUT_ROOT, { recursive: true, force: true });
    await fs.mkdir(ASSET_OUTPUT_ROOT, { recursive: true });
  }

  await fs.mkdir(path.dirname(DATA_OUTPUT_PATH), { recursive: true });
}

async function main() {
  await emptyOutputDirectories();

  const seedPageUrls = await getSeedPageUrls();
  const queue = [...seedPageUrls];
  const seenUrls = new Set(seedPageUrls);
  const pages = [];
  let cursor = 0;

  console.log(`Fetched ${seedPageUrls.length} English seed URLs from sitemap and configured entry paths.`);

  while (cursor < queue.length) {
    const batch = queue.slice(cursor, cursor + PAGE_CONCURRENCY);
    const batchStart = cursor;
    cursor += batch.length;

    const results = await Promise.all(
      batch.map(async (pageUrl, offset) => {
        console.log(`[${batchStart + offset + 1}/${queue.length}] ${pageUrl}`);

        try {
          const { body, contentType } = await fetchWithRetry(pageUrl);

          if (!isHtmlDocument(contentType, body)) {
            console.warn(`Skipping non-HTML page ${pageUrl} (${contentType || "unknown content-type"})`);
            return null;
          }

          const discoveredLinks = extractInternalPageLinks(body, pageUrl);
          const snapshot = await rewriteDocument(body, pageUrl);

          return {
            page: {
              route: routeFromUrl(pageUrl),
              sourceUrl: pageUrl,
              ...snapshot,
            },
            discoveredLinks,
          };
        } catch (error) {
          if (isNotFoundError(error)) {
            console.warn(`Skipping missing page ${pageUrl}`);
            return null;
          }

          console.warn(`Skipping failed page ${pageUrl}: ${error instanceof Error ? error.message : String(error)}`);
          return null;
        }
      }),
    );

    for (const result of results) {
      if (!result) {
        continue;
      }

      pages.push(result.page);

      for (const discoveredUrl of result.discoveredLinks) {
        if (!seenUrls.has(discoveredUrl)) {
          seenUrls.add(discoveredUrl);
          queue.push(discoveredUrl);
        }
      }
    }
  }

  const filteredPages = pages.filter(Boolean);
  filteredPages.sort((left, right) => left.route.localeCompare(right.route));

  const generatedAt = new Date().toISOString();

  // ── Write split format: site-meta.json + per-page files ──
  const siteMeta = {
    generatedAt,
    siteOrigin: SITE_ORIGIN,
    pageCount: filteredPages.length,
    pages: filteredPages.map((p) => ({ route: p.route, title: p.title, sourceUrl: p.sourceUrl })),
  };

  await fs.mkdir(path.dirname(META_OUTPUT_PATH), { recursive: true });
  await fs.writeFile(META_OUTPUT_PATH, JSON.stringify(siteMeta, null, 2));
  console.log(`Wrote site meta index to ${META_OUTPUT_PATH}`);

  // Clean and recreate pages directory
  await fs.rm(PAGES_OUTPUT_DIR, { recursive: true, force: true });
  await fs.mkdir(PAGES_OUTPUT_DIR, { recursive: true });

  for (const page of filteredPages) {
    const slug = page.route.replace(/^\/+|\/+$/g, "") || "index";
    const outputPath = path.join(PAGES_OUTPUT_DIR, `${slug}.json`);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(page));
  }
  console.log(`Wrote ${filteredPages.length} page files to ${PAGES_OUTPUT_DIR}/`);

  // ── Legacy: also write monolithic site-data.json for backward compat ──
  const siteData = {
    generatedAt,
    siteOrigin: SITE_ORIGIN,
    pageCount: filteredPages.length,
    pages: filteredPages,
  };

  await fs.writeFile(DATA_OUTPUT_PATH, JSON.stringify(siteData, null, 2));

  console.log(`Wrote legacy site data to ${DATA_OUTPUT_PATH}`);
  if (LOCALIZE_ASSETS) {
    console.log(`Downloaded ${assetTasks.size} assets to ${ASSET_OUTPUT_ROOT}`);
  } else {
    console.log("Asset localization was skipped; internal asset URLs remain pointed at the original site.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
