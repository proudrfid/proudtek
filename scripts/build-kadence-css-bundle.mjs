#!/usr/bin/env node
/**
 * build-kadence-css-bundle.mjs — combine 29 separate Kadence / WordPress /
 * WooCommerce / TranslatePress / kadence-blocks CSS files into a single
 * concatenated bundle, served via one HTTP request instead of 16+ — and
 * (since June 2026, audit C-12) purge selectors that can never match any
 * markup this site still renders.
 *
 * Why
 * ───
 * The WP snapshot pages emit one `<link rel="stylesheet">` per Kadence
 * theme module + each kadence-blocks block actually used on the page +
 * fonts + plugin CSS. Even with HTTP/2 multiplexing, 16+ parallel requests
 * still cost per-resource fixed overhead (request header + parse) and the
 * slowest request gates first paint. Pre-cold load measurement (May 20,
 * 2026): the 16 Kadence CSS requests on `/` clustered around 280-570ms
 * each, with DomReady at 2988ms. Bundling these into a single CSS file
 * and rewriting the snapshot link tags shaved 300-500ms off LCP by
 * eliminating 15+ HTTP requests.
 *
 * Audit C-12 (June 2026): the concatenated bundle weighed ~1.49MB raw /
 * ~119KB gzip and was render-blocking on every page, against an 80KB-gzip
 * site CSS budget. Most rules target WP/WooCommerce markup that no longer
 * renders on this static, RFQ-model site (cart, checkout, payment,
 * select2, wc-blocks, flexslider…). The purge below removes selectors
 * whose class/id tokens provably appear nowhere in the shipped markup.
 *
 * Strategy
 * ────────
 * 1. Scan every page JSON in src/data/pages/ and every editorial JSON in
 *    src/content/editorial/ for `<link rel="stylesheet" href="/site-assets/...">`
 *    URLs. Collect the union.
 * 2. Build the "used markup corpus" (see buildCorpus below): every class
 *    and id token that can appear in shipped HTML, drawn from
 *      (a) page/editorial/author JSON snapshots (class="…" / id="…"
 *          attributes inside headHtml/bodyHtml strings + htmlAttrs/
 *          bodyAttrs `class`/`id` keys),
 *      (b) every HTML-emitting source file (src/lib, src/components,
 *          src/layouts, src/pages, src/data — .ts/.astro/.js/.mjs), using
 *          a PurgeCSS-style whole-file token extraction so classes built
 *          via template literals / cheerio addClass / classList.* are all
 *          captured,
 *      (c) the runtime JS that still ships with snapshots (everything in
 *          the snapshots' <script src> set minus the scripts that
 *          render-snapshot.ts strips), via string-literal token
 *          extraction (e.g. Kadence navigation.min.js toggles).
 * 3. Sort sources by cascade priority: WP core → WC → TranslatePress →
 *    Kadence theme → kadence-blocks → fonts → other plugins → easy-table-of-contents.
 *    Within each tier, alphabetical for stability.
 * 4. Read each `public/<url>` file, purge unused selectors (unless
 *    --no-purge), and concatenate with a `@source: url` CSS comment
 *    delimiter so unminify / debug is possible.
 * 5. SHA256 the concat result; write to
 *    `public/site-assets/codex-kadence-bundle.<hash>.css`.
 * 6. Emit a manifest JSON to `src/data/.codex-kadence-bundle.json`
 *    containing { bundleUrl, sourceUrls[] }. render-snapshot.ts reads
 *    this at build time and replaces all `<link>` tags accordingly.
 *
 * Purge safety rules (conservative by construction)
 * ─────────────────────────────────────────────────
 * - A selector is dropped only when it requires (outside any
 *   :is()/:where()/:not()/:has()/attribute-bracket context) at least one
 *   class/id token that appears nowhere in corpus ∪ PURGE_SAFELIST.
 * - Selectors with no class/id token at all (tag / attribute / pseudo
 *   selectors, :root, html, body) are always kept.
 * - Selectors containing CSS escapes (`\`) are kept verbatim (too rare to
 *   be worth decoding; keep-biased).
 * - @font-face, @import, @charset, @keyframes (all vendor prefixes),
 *   @page, @namespace, @property, @counter-style and unknown at-rules are
 *   kept wholesale. @media/@supports/@container are recursed into and the
 *   wrapper removed only if it ends up empty (an empty wrapper is inert).
 * - If postcss is unavailable or a source fails to parse, that file is
 *   bundled unpurged with a warning — the build never breaks on purge.
 * - Corpus building walks directories in sorted order and the purge is a
 *   pure function of (CSS, corpus), so the output — and therefore the
 *   content hash — is deterministic across runs.
 *
 * Escape hatches
 * ──────────────
 * `node scripts/build-kadence-css-bundle.mjs --no-purge` re-creates the
 * plain concatenated bundle (byte-identical to the pre-C-12 output).
 * `PROUDTEK_SKIP_KADENCE_BUNDLE` env var still skips the whole script.
 *
 * Idempotency
 * ───────────
 * The hash in the bundle filename means content-addressed caching — if
 * no source CSS and no corpus-relevant markup changed, the bundle name is
 * the same and CDN caches persist. Re-running this script is safe.
 */

import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const PAGES_DIR = join(ROOT, "src/data/pages");
const EDITORIAL_DIR = join(ROOT, "src/content/editorial");
const AUTHORS_DIR = join(ROOT, "src/content/authors");
const MANIFEST_PATH = join(ROOT, "src/data/.codex-kadence-bundle.json");

const NO_PURGE = process.argv.includes("--no-purge");

if (process.env.PROUDTEK_SKIP_KADENCE_BUNDLE) {
  console.log("[kadence-bundle] PROUDTEK_SKIP_KADENCE_BUNDLE set — skipping bundle build.");
  process.exit(0);
}

// ─────────────────────────────────────────────────────────────────────────
// PURGE_SAFELIST — class/id tokens kept even when absent from the corpus.
//
// These cover state classes that JavaScript may toggle at runtime and
// accessibility/WP-environment classes that can appear outside the build's
// view. Patterns are matched against single class/id tokens.
//
// Tuning notes (2026-06, C-12):
// - No blanket `wp-` / `woocommerce-` prefixes here on purpose: every
//   WordPress/WooCommerce runtime script is stripped by render-snapshot.ts
//   (jquery, woocommerce.min, add-to-cart, flexslider, zoom, photoswipe
//   init, kb-form-block…), so no JS can mint new wp-*/woocommerce-*
//   classes in the browser. The ones that really render are all present
//   in the snapshot JSONs and reach the corpus from there. Blanket
//   prefixes would keep ~400KB of dead cart/checkout/select2 CSS.
// - Kadence navigation.min.js + product-cls.min.js + the FontAwesome kit
//   DO still ship — their toggled classes are extracted from the JS
//   string literals in buildCorpus step (c), and the generic state
//   patterns below back them up.
// ─────────────────────────────────────────────────────────────────────────
const PURGE_SAFELIST = [
  /^(is|has|js)-/, // state prefixes (is-active, has-dropdown, js-…)
  /^(active|open|opened|show|shown|hide|hidden|visible|focused|selected|current|disabled|loading|loaded|toggled|toggled-on|expanded|collapsed|sticky|stuck|scrolled|transparent|no-js|rtl)$/,
  /^(screen-reader|sr-|skip-link)/, // a11y helpers
  /^(admin-bar|logged-in|customize-support)/, // WP environment classes
  /^(kb-form|kadence-blocks-form)/, // form plumbing + JS-added validation states
];

// At-rules copied through wholesale — never descended into, never dropped.
const KEEP_AT_RULES = new Set([
  "charset",
  "import",
  "font-face",
  "keyframes",
  "-webkit-keyframes",
  "-moz-keyframes",
  "-o-keyframes",
  "page",
  "namespace",
  "property",
  "counter-style",
  "font-feature-values",
  "viewport",
]);

// At-rules whose children are purged like top-level rules; the wrapper is
// kept unless it ends up completely empty.
const RECURSE_AT_RULES = new Set(["media", "supports", "container", "layer", "document", "-moz-document"]);

// Scripts that render-snapshot.ts strips from every snapshot
// (UNUSED_HEAD_ASSET_PATTERNS + TRANSLATE_SELECTORS). Used to decide which
// snapshot-referenced JS still ships and therefore feeds the corpus.
// ⚠ Keep in sync with src/lib/render-snapshot.ts.
const STRIPPED_SNAPSHOT_JS = [
  /jquery/,
  /blockui/i,
  /add-to-cart/,
  /woocommerce/,
  /js\.cookie/,
  /splide\.min/,
  /kb-splide-init/,
  /kb-advanced-heading/,
  /kt-accordion/,
  /kb-form-block/,
  /translatepress/,
];

// ── Priority tiers for the cascade order. Smaller number = earlier in the bundle. ──
function tierFor(url) {
  if (url.includes("/wp-includes/css/dist/block-library/")) return 10;
  if (url.includes("/woocommerce/packages/woocommerce-blocks/")) return 20;
  if (url.includes("/woocommerce/assets/")) return 25;
  if (url.includes("/translatepress-multilingual/")) return 30;
  if (url.includes("/themes/kadence/assets/css/global")) return 40;
  if (url.includes("/themes/kadence/assets/css/header")) return 41;
  if (url.includes("/themes/kadence/assets/css/content")) return 42;
  if (url.includes("/themes/kadence/assets/css/sidebar")) return 43;
  if (url.includes("/themes/kadence/assets/css/woocommerce")) return 44;
  if (url.includes("/themes/kadence/assets/css/footer")) return 45;
  if (url.includes("/themes/kadence/assets/css/kadence-splide")) return 46;
  if (url.includes("/themes/kadence/assets/css/")) return 49;
  if (url.includes("/kadence-blocks/")) return 50;
  if (url.includes("/easy-table-of-contents/")) return 60;
  if (url.includes("/wp-content/fonts/")) return 70;
  return 80;
}

async function collectCssUrlsFromHtml(html) {
  const found = new Set();
  if (!html) return found;
  const regex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = regex.exec(html)) !== null) {
    if (m[1].startsWith("/site-assets/")) found.add(m[1]);
  }
  return found;
}

// ─────────────────────────────────────────────────────────────────────────
// Corpus extraction helpers
// ─────────────────────────────────────────────────────────────────────────

/** Recursively list files under dir with one of the given extensions, sorted
 *  for determinism. `excludeDirRe` skips directory names (e.g. __tests__). */
async function walkFilesSorted(dir, exts, excludeDirRe = null) {
  const out = [];
  if (!existsSync(dir)) return out;
  const entries = (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (excludeDirRe && excludeDirRe.test(entry.name)) continue;
      out.push(...(await walkFilesSorted(full, exts, excludeDirRe)));
    } else if (exts.some((x) => entry.name.endsWith(x))) {
      out.push(full);
    }
  }
  return out;
}

const CLASS_ATTR_RE = /\bclass\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
const ID_ATTR_RE = /\bid\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

/** Pull class="…" / id="…" attribute tokens out of an HTML string. */
function addHtmlAttrTokens(str, classSet, idSet) {
  let m;
  CLASS_ATTR_RE.lastIndex = 0;
  while ((m = CLASS_ATTR_RE.exec(str)) !== null) {
    for (const t of (m[1] ?? m[2] ?? "").split(/\s+/)) if (t) classSet.add(t);
  }
  ID_ATTR_RE.lastIndex = 0;
  while ((m = ID_ATTR_RE.exec(str)) !== null) {
    for (const t of (m[1] ?? m[2] ?? "").split(/\s+/)) if (t) idSet.add(t);
  }
}

/** Walk a parsed JSON value; harvest `class`/`className`/`id` keys (e.g.
 *  htmlAttrs/bodyAttrs) plus HTML attributes embedded in any string value. */
function walkJsonValue(value, key, classSet, idSet) {
  if (typeof value === "string") {
    if (key === "class" || key === "className") {
      for (const t of value.split(/\s+/)) if (t) classSet.add(t);
    } else if (key === "id") {
      for (const t of value.split(/\s+/)) if (t) idSet.add(t);
    }
    if (value.includes("=")) addHtmlAttrTokens(value, classSet, idSet);
  } else if (Array.isArray(value)) {
    for (const item of value) walkJsonValue(item, null, classSet, idSet);
  } else if (value && typeof value === "object") {
    for (const k of Object.keys(value)) walkJsonValue(value[k], k, classSet, idSet);
  }
}

// PurgeCSS-style broad token extraction for source code: any word-ish token
// might be (part of) a class name assembled in a template literal, cheerio
// addClass(), classList.add(), etc. Over-collection only makes the purge
// keep more — the safe direction.
const CODE_TOKEN_RE = /[A-Za-z0-9_-]{2,}/g;
function addCodeTokens(text, set) {
  let m;
  CODE_TOKEN_RE.lastIndex = 0;
  while ((m = CODE_TOKEN_RE.exec(text)) !== null) set.add(m[0]);
}

// For shipped runtime JS we only mine string literals (class names in JS are
// always strings) — whole-file tokens on minified JS would add noise without
// adding safety.
const JS_STRING_RE = /(["'`])((?:\\.|(?!\1)[^\\\n])*)\1/g;
function addJsStringLiteralTokens(text, set) {
  let m;
  JS_STRING_RE.lastIndex = 0;
  while ((m = JS_STRING_RE.exec(text)) !== null) {
    let t;
    CODE_TOKEN_RE.lastIndex = 0;
    while ((t = CODE_TOKEN_RE.exec(m[2])) !== null) set.add(t[0]);
  }
}

/**
 * Build the used-markup corpus + collect stylesheet URLs in a single pass
 * over the snapshot JSONs.
 *
 * Returns:
 *   cssUrls      Set<string>  — /site-assets/*.css hrefs (bundle inputs)
 *   classTokens  Set<string>  — class attr tokens from JSON snapshots
 *   idTokens     Set<string>  — id attr tokens from JSON snapshots
 *   sharedTokens Set<string>  — tokens from source code + shipped JS
 *                               (can't be attributed to class vs id, so they
 *                               validate either — keep-biased)
 *   stats        per-bucket file/token counts for logging
 */
async function buildCorpusAndCollectCss() {
  const cssUrls = new Set();
  const classTokens = new Set();
  const idTokens = new Set();
  const sharedTokens = new Set();
  const scriptSrcs = new Set();
  const stats = {};

  // (a) snapshot + editorial + author JSON data
  const SCRIPT_SRC_RE = /<script[^>]*src=["']([^"']+)["']/g;
  for (const [label, dir] of [
    ["pagesJson", PAGES_DIR],
    ["editorialJson", EDITORIAL_DIR],
    ["authorsJson", AUTHORS_DIR],
  ]) {
    const beforeC = classTokens.size;
    const beforeI = idTokens.size;
    const files = await walkFilesSorted(dir, [".json"]);
    for (const file of files) {
      let data;
      try {
        data = JSON.parse(await readFile(file, "utf8"));
      } catch {
        continue; // non-JSON or unreadable — skip (matches historical behavior)
      }
      // Stylesheet URL collection (historical semantics: headHtml first).
      const html = data.headHtml || data.bodyHtml || "";
      for (const u of await collectCssUrlsFromHtml(html)) cssUrls.add(u);
      // Shipped-script collection for corpus step (c).
      const allHtml = (data.headHtml || "") + (data.bodyHtml || "");
      let sm;
      SCRIPT_SRC_RE.lastIndex = 0;
      while ((sm = SCRIPT_SRC_RE.exec(allHtml)) !== null) {
        if (sm[1].startsWith("/site-assets/")) scriptSrcs.add(sm[1]);
      }
      // Corpus tokens.
      walkJsonValue(data, null, classTokens, idTokens);
    }
    stats[label] = {
      files: files.length,
      newClassTokens: classTokens.size - beforeC,
      newIdTokens: idTokens.size - beforeI,
    };
  }

  // (b) HTML-emitting source code (template literals, cheerio class
  // manipulation, astro components, inline scripts).
  const codeFiles = [];
  for (const dir of ["src/lib", "src/components", "src/layouts", "src/pages", "src/data"]) {
    codeFiles.push(...(await walkFilesSorted(join(ROOT, dir), [".ts", ".tsx", ".astro", ".js", ".mjs"], /^__tests__$/)));
  }
  const shippingCode = codeFiles.filter((f) => !/\.(test|spec)\.[tj]sx?$/.test(f)).sort();
  for (const file of shippingCode) addCodeTokens(await readFile(file, "utf8"), sharedTokens);
  stats.code = { files: shippingCode.length, tokens: sharedTokens.size };

  // (c) runtime JS that actually ships (snapshot <script src> minus the
  // scripts render-snapshot.ts strips) — e.g. Kadence navigation.min.js
  // toggles header/drawer state classes at runtime.
  const shippedJs = [...scriptSrcs].filter((u) => !STRIPPED_SNAPSHOT_JS.some((re) => re.test(u))).sort();
  const beforeShared = sharedTokens.size;
  for (const url of shippedJs) {
    const filePath = join(PUBLIC, url);
    if (!existsSync(filePath)) continue;
    addJsStringLiteralTokens(await readFile(filePath, "utf8"), sharedTokens);
  }
  stats.shippedJs = { files: shippedJs.length, newTokens: sharedTokens.size - beforeShared };

  return { cssUrls, classTokens, idTokens, sharedTokens, stats };
}

// ─────────────────────────────────────────────────────────────────────────
// Selector analysis + purge
// ─────────────────────────────────────────────────────────────────────────

function isSafelisted(token) {
  return PURGE_SAFELIST.some((re) => re.test(token));
}

/**
 * Extract the class/id tokens a single selector REQUIRES to match.
 * Tokens inside functional pseudo-class parentheses (:is/:where/:not/:has/
 * :nth-child…) and attribute brackets are intentionally ignored — treating
 * them as requirements could drop selectors that still match (e.g.
 * `.kept:not(.unused)` matches plain `.kept` elements). Keep-biased.
 *
 * Returns `null` when the selector can't be analyzed confidently (CSS
 * escapes, malformed input) — callers must keep it.
 */
function requiredTokens(selector) {
  const tokens = [];
  let i = 0;
  let parens = 0;
  let brackets = 0;
  let quote = null;
  const n = selector.length;
  while (i < n) {
    const c = selector[i];
    if (quote) {
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c === quote) quote = null;
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      i++;
      continue;
    }
    if (c === "\\") return null; // CSS escape outside a string — keep selector
    if (c === "[") {
      brackets++;
      i++;
      continue;
    }
    if (c === "]") {
      brackets = Math.max(0, brackets - 1);
      i++;
      continue;
    }
    if (brackets > 0) {
      i++;
      continue;
    }
    if (c === "(") {
      parens++;
      i++;
      continue;
    }
    if (c === ")") {
      parens = Math.max(0, parens - 1);
      i++;
      continue;
    }
    if (parens > 0) {
      i++;
      continue;
    }
    if (c === "." || c === "#") {
      const kind = c === "." ? "class" : "id";
      let j = i + 1;
      let token = "";
      while (j < n && /[A-Za-z0-9_-]/.test(selector[j])) {
        token += selector[j];
        j++;
      }
      if (j < n && selector[j] === "\\") return null; // escape mid-token — keep
      if (token.length === 0) return null; // malformed — keep
      tokens.push({ kind, token });
      i = j;
      continue;
    }
    i++;
  }
  return tokens;
}

/** True when every class/id token the selector requires exists in the
 *  corpus (or safelist). Selectors with no class/id requirement always
 *  survive (tag/attr/pseudo selectors, :root, html, body…). */
function selectorSurvives(selector, corpus) {
  const tokens = requiredTokens(selector);
  if (tokens === null || tokens.length === 0) return true;
  return tokens.every(({ kind, token }) => {
    if (corpus.sharedTokens.has(token) || isSafelisted(token)) return true;
    return kind === "class" ? corpus.classTokens.has(token) : corpus.idTokens.has(token);
  });
}

function insideKeptAtRule(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (p.type === "atrule" && KEEP_AT_RULES.has(p.name.toLowerCase())) return true;
  }
  return false;
}

function purgeContainer(container, corpus, stats) {
  const removals = [];
  for (const node of container.nodes ?? []) {
    if (node.type === "rule") {
      if (insideKeptAtRule(node)) continue; // e.g. keyframe steps
      const selectors = node.selectors;
      stats.selectorsIn += selectors.length;
      stats.rulesIn += 1;
      const kept = selectors.filter((s) => selectorSurvives(s, corpus));
      stats.selectorsOut += kept.length;
      if (kept.length === 0) {
        stats.rulesDropped += 1;
        removals.push(node);
      } else if (kept.length !== selectors.length) {
        node.selectors = kept;
      }
    } else if (node.type === "atrule") {
      const name = node.name.toLowerCase();
      if (KEEP_AT_RULES.has(name)) continue;
      if (RECURSE_AT_RULES.has(name)) {
        purgeContainer(node, corpus, stats);
        if (!node.nodes || node.nodes.length === 0) removals.push(node); // empty wrapper is inert
      }
      // Unknown at-rules: keep untouched (conservative).
    }
    // decls/comments at top level: keep untouched.
  }
  for (const node of removals) node.remove();
}

/** Purge one source file's CSS against the corpus. Pure function of
 *  (cssText, corpus) → deterministic output. */
function purgeCssSource(postcss, cssText, corpus) {
  const stats = { rulesIn: 0, rulesDropped: 0, selectorsIn: 0, selectorsOut: 0 };
  const root = postcss.parse(cssText);
  purgeContainer(root, corpus, stats);
  return { css: root.toString(), stats };
}

async function main() {
  console.log("[kadence-bundle] Scanning page snapshots for /site-assets/*.css references…");
  const corpusStart = Date.now();
  const { cssUrls, classTokens, idTokens, sharedTokens, stats: corpusStats } = await buildCorpusAndCollectCss();
  const allUrls = cssUrls;
  console.log(`[kadence-bundle]   ${allUrls.size} unique CSS URLs found across snapshots.`);

  if (allUrls.size === 0) {
    console.log("[kadence-bundle] Nothing to bundle. Removing stale manifest if any.");
    if (existsSync(MANIFEST_PATH)) await writeFile(MANIFEST_PATH, JSON.stringify({ bundleUrl: null, sourceUrls: [] }, null, 2));
    return;
  }

  // Purge setup — postcss is a vite transitive dependency. If it ever goes
  // missing, fall back to the unpurged bundle rather than failing the build.
  let postcss = null;
  if (!NO_PURGE) {
    try {
      postcss = (await import("postcss")).default;
    } catch {
      console.warn("[kadence-bundle] ⚠ postcss not importable — building WITHOUT purge.");
    }
  }
  const purging = Boolean(postcss) && !NO_PURGE;
  const corpus = { classTokens, idTokens, sharedTokens };
  if (purging) {
    console.log(
      `[kadence-bundle] Corpus built in ${Date.now() - corpusStart}ms: ` +
        `${classTokens.size} class + ${idTokens.size} id tokens from snapshots ` +
        `(${corpusStats.pagesJson.files} page / ${corpusStats.editorialJson.files} editorial / ${corpusStats.authorsJson.files} author JSONs), ` +
        `${sharedTokens.size} code/JS tokens (${corpusStats.code.files} source files, ${corpusStats.shippedJs.files} shipped JS).`,
    );
  } else {
    console.log(`[kadence-bundle] Purge disabled (${NO_PURGE ? "--no-purge flag" : "postcss unavailable"}).`);
  }

  // Sort by tier, then alphabetical.
  const ordered = [...allUrls].sort((a, b) => {
    const ta = tierFor(a);
    const tb = tierFor(b);
    if (ta !== tb) return ta - tb;
    return a.localeCompare(b);
  });

  // Read each file from public/, purge, and concat.
  const chunks = [];
  let totalBytesIn = 0;
  let totalBytesOut = 0;
  let totalRules = 0;
  let totalRulesDropped = 0;
  let totalSelectorsIn = 0;
  let totalSelectorsOut = 0;
  for (const url of ordered) {
    const filePath = join(PUBLIC, url);
    if (!existsSync(filePath)) {
      console.warn(`[kadence-bundle]   ⚠ source CSS missing on disk, skipping: ${url}`);
      continue;
    }
    let content = await readFile(filePath, "utf8");
    totalBytesIn += content.length;
    if (purging) {
      try {
        const { css, stats } = purgeCssSource(postcss, content, corpus);
        if (stats.rulesDropped > 0 || stats.selectorsIn !== stats.selectorsOut) {
          console.log(
            `[kadence-bundle]   purge ${url.split("/").pop()}: ` +
              `${content.length} → ${css.length} bytes, rules ${stats.rulesIn - stats.rulesDropped}/${stats.rulesIn}, ` +
              `selectors ${stats.selectorsOut}/${stats.selectorsIn}`,
          );
        }
        totalRules += stats.rulesIn;
        totalRulesDropped += stats.rulesDropped;
        totalSelectorsIn += stats.selectorsIn;
        totalSelectorsOut += stats.selectorsOut;
        content = css;
      } catch (err) {
        console.warn(`[kadence-bundle]   ⚠ purge parse failed for ${url} — keeping unpurged. (${err.message})`);
      }
    }
    totalBytesOut += content.length;
    chunks.push(`/* @source: ${url} */\n${content.trim()}\n`);
  }

  if (purging) {
    const pct = totalBytesIn > 0 ? ((1 - totalBytesOut / totalBytesIn) * 100).toFixed(1) : "0.0";
    console.log(
      `[kadence-bundle] Purge totals: ${totalBytesIn} → ${totalBytesOut} bytes (-${pct}%), ` +
        `rules ${totalRules - totalRulesDropped}/${totalRules}, selectors ${totalSelectorsOut}/${totalSelectorsIn}.`,
    );
  }

  const bundleContent = chunks.join("\n");
  const hash = createHash("sha256").update(bundleContent).digest("hex").slice(0, 12);
  const bundleUrl = `/site-assets/codex-kadence-bundle.${hash}.css`;
  const bundlePath = join(PUBLIC, bundleUrl);
  await mkdir(dirname(bundlePath), { recursive: true });
  await writeFile(bundlePath, bundleContent);
  console.log(`[kadence-bundle] Wrote bundle: ${bundleUrl} (${bundleContent.length} bytes, ${ordered.length} files combined)`);

  // Emit manifest for render-snapshot.ts to consume.
  await mkdir(dirname(MANIFEST_PATH), { recursive: true });
  const manifest = {
    bundleUrl,
    sourceUrls: ordered,
    purge: {
      enabled: purging,
      corpusClassTokens: classTokens.size,
      corpusIdTokens: idTokens.size,
      corpusSharedTokens: sharedTokens.size,
      rawBytesBefore: totalBytesIn,
      rawBytesAfter: totalBytesOut,
    },
  };
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`[kadence-bundle] Wrote manifest: ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error("[kadence-bundle] Build failed:", err);
  process.exit(1);
});
