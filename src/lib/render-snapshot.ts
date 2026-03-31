import type { SnapshotPage } from "./site-data";

import { load } from "cheerio";

import { LOW_VALUE_ROUTE_PREFIXES } from "./route-overrides";

const TRANSLATE_SELECTORS = [
  'link[rel="alternate"][hreflang]',
  'link[id^="trp-"]',
  'link[href*="translatepress"]',
  'script[src*="translatepress"]',
  "#trp-floater-ls",
  ".trp-language-switcher",
  ".trp-language-switcher-container",
  ".trp_language_switcher_shortcode",
  "template#tp-language",
];

// ── Performance: remove unused WordPress/WooCommerce assets ──
// These are dead weight on a static site with no cart or WP admin.
const UNUSED_HEAD_ASSET_PATTERNS: Array<string | RegExp> = [
  // WooCommerce block styles — no cart/checkout on static site
  'link[id*="wc-blocks"]',
  'link[id*="wc-all-blocks"]',
  // WooCommerce theme overrides
  'link[id*="kadence-woocommerce"]',
  // jQuery & WooCommerce scripts (fully unused — were only deferred before)
  'script[src*="jquery"]',
  'script[src*="jquery-migrate"]',
  'script[src*="blockui"]',
  'script[src*="add-to-cart"]',
  'script[src*="woocommerce"]',
  'script[src*="js.cookie"]',
];

const NOISY_EXTERNAL_HREF_PATTERNS = [
  /^https?:\/\/themes\.kadencethemes\.com\/ascend-5\//i,
];

const LOW_VALUE_CONTAINERS = [
  ".tagged_as",
  ".posted_in",
  ".cat-links",
  ".tags-links",
  ".tag-cloud",
  ".widget_tag_cloud",
  ".wp-block-tag-cloud",
  ".wp-block-kadence-advancedbtn",
];

export interface RenderSnapshot {
  htmlAttrs: Record<string, string>;
  bodyAttrs: Record<string, string>;
  headHtml: string;
  bodyHtml: string;
}

export function prepareSnapshot(page: SnapshotPage): RenderSnapshot {
  const $head = load(`<head>${page.headHtml}</head>`);
  const $body = load(`<body>${page.bodyHtml}</body>`);

  for (const selector of TRANSLATE_SELECTORS) {
    $head(selector).remove();
    $body(selector).remove();
  }

  // Strip unused WP/WooCommerce assets from head and body
  for (const selector of UNUSED_HEAD_ASSET_PATTERNS) {
    if (typeof selector === "string") {
      $head(selector).remove();
      $body(selector).remove();
    }
  }

  // Remove WP font preloads — we add our own preloads in the Astro layout
  $head('link[rel="preload"][as="font"]').remove();

  $body("a[href]").each((_, element) => {
    const href = $body(element).attr("href") ?? "";
    const normalized = collapseFirstPagePagination(href);

    if (normalized !== href) {
      $body(element).attr("href", normalized);
    }

    if (isPrunableHref(normalized)) {
      removeLowValueLink($body, element);
    }
  });

  removeEmptyContainers($body);

  // ── Accessibility hardening ──
  // Add aria-label to form inputs that use data-label but lack proper labelling
  $body("input[data-label]").each((_, el) => {
    const input = $body(el);
    if (!input.attr("aria-label") && !input.attr("aria-labelledby")) {
      input.attr("aria-label", input.attr("data-label") ?? "");
    }
  });

  // Ensure <main> has id="main" for skip-link target
  const mainEl = $body("main, [role='main']").first();
  if (mainEl.length && !mainEl.attr("id")) {
    mainEl.attr("id", "main");
  }

  // ── LCP optimization ──
  // Upgrade the first product/hero image in main content to eager loading.
  // Skip tiny badges/icons (width ≤ 100) — they're not LCP candidates.
  const lcpCandidates = $body("main img, [role='main'] img, .entry-content img").toArray();
  for (const candidate of lcpCandidates) {
    const img = $body(candidate);
    const width = parseInt(img.attr("width") ?? "999", 10);
    if (width <= 100) continue; // Skip badges and icons
    if (img.attr("loading") === "lazy") {
      img.attr("loading", "eager");
      img.attr("fetchpriority", "high");
    }
    break;
  }

  return {
    htmlAttrs: {
      ...page.htmlAttrs,
      lang: "en-US",
      class: stripTranslateClasses(page.htmlAttrs.class),
    },
    bodyAttrs: {
      ...page.bodyAttrs,
      class: stripTranslateClasses(page.bodyAttrs.class),
    },
    headHtml: $head("head").html() ?? "",
    bodyHtml: $body("body").html() ?? "",
  };
}

function stripTranslateClasses(value: string | undefined): string {
  return (value ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .filter((className) => !className.startsWith("translatepress-"))
    .join(" ");
}

function collapseFirstPagePagination(href: string): string {
  if (!href) {
    return href;
  }

  return href.replace(/(https?:\/\/[^/]+)?(\/.+?)\/page\/1\/(?=($|[#?]))?/i, (_, origin = "", route = "") => `${origin}${route}/`);
}

function isPrunableHref(href: string): boolean {
  if (!href) {
    return false;
  }

  const normalized = href.replace(/^https?:\/\/[^/]+/i, "");

  if (LOW_VALUE_ROUTE_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
    return true;
  }

  return NOISY_EXTERNAL_HREF_PATTERNS.some((pattern) => pattern.test(href));
}

function removeLowValueLink($body: ReturnType<typeof load>, element: unknown): void {
  const link = $body(element);

  for (const selector of LOW_VALUE_CONTAINERS) {
    const container = link.closest(selector);

    if (container.length) {
      container.remove();
      return;
    }
  }

  const listItem = link.closest("li");
  if (listItem.length) {
    const otherLinks = listItem.find("a[href]").toArray().filter((node) => node !== element);

    if (otherLinks.length === 0) {
      listItem.remove();
      return;
    }
  }

  link.remove();
}

function removeEmptyContainers($body: ReturnType<typeof load>): void {
  $body(".widget, .widget_block, .product_meta, .tag-cloud, .posted_in, .tagged_as, li, ul, ol").each((_, element) => {
    const node = $body(element);
    const hasLinks = node.find("a[href]").length > 0;
    const text = node.text().replace(/\s+/g, " ").trim();

    if (hasLinks) {
      return;
    }

    if (!text) {
      node.remove();
    }
  });
}
