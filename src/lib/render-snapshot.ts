import type { SnapshotPage } from "./site-data";

import { load } from "cheerio";

import { LOW_VALUE_ROUTE_PREFIXES } from "./route-overrides";
import {
  PRIMARY_MENU_DROPDOWNS,
  FOOTER_SECTIONS,
  type MenuDropdown,
  type MenuGroup,
  type FooterSection,
} from "./menu-structure";

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

  // ── Nav injection: add Industries / Solutions / Resources dropdowns + footer ──
  injectCustomNav($body);

  // ── Defang testimonial Splide carousel ──
  // Kadence's splide-init JS queries `.wp-block-kadence-testimonials .kt-blocks-carousel-init`
  // and restructures the DOM into a <div class="splide__track"><div class="splide__list">…</div></div>.
  // That conflicts with our 3-col static grid: the testimonials end up collapsed into one column.
  // We also inherit Kadence's `:not(.splide-initialized) .kt-blocks-testimonial-carousel-item { display: none }`
  // rule, which hides items 2 and 3 until JS init runs. Solution: strip the
  // `kt-blocks-carousel-init` class + Splide data-* attrs from testimonial wrappers
  // (leaves product/gallery carousels intact).
  $body(".wp-block-kadence-testimonials .kt-blocks-carousel-init").each((_, el) => {
    const $el = $body(el);
    $el.removeClass("kt-blocks-carousel-init kb-gallery-carousel");
    // Scrub Splide data-* hints so nothing can lazily reinitialize.
    const attribs = (el as unknown as { attribs: Record<string, string> }).attribs || {};
    for (const key of Object.keys(attribs)) {
      if (key.startsWith("data-slider-") || key.startsWith("data-columns-")) {
        $el.removeAttr(key);
      }
    }
  });

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

// ---------------------------------------------------------------------------
// Navigation injection — adds the new top-level dropdowns and footer sections.
// ---------------------------------------------------------------------------

const DROPDOWN_ARROW_SVG = `<span class="dropdown-nav-toggle"><span class="kadence-svg-iconset svg-baseline"><svg aria-hidden="true" class="kadence-svg-icon kadence-arrow-down-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>Expand</title><path d="M5.293 9.707l6 6c0.391 0.391 1.024 0.391 1.414 0l6-6c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg></span></span>`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Build a desktop mega-menu <li> matching Kadence structure.
 *
 * Produces:
 *   <li class="menu-item menu-item-has-children codex-mega-item codex-mega-item--industries">
 *     <a href="/industries/">
 *       <span class="nav-drop-title-wrap">Industries <svg… (arrow)></span>
 *     </a>
 *     <ul class="sub-menu codex-mega-dropdown">
 *       <li class="codex-mega-group">
 *         <span class="codex-mega-heading">Consumer & Hospitality</span>
 *         <ul class="codex-mega-list">
 *           <li class="menu-item"><a href="…">Hospitality</a></li>
 *           …
 *         </ul>
 *       </li>
 *       …
 *     </ul>
 *   </li>
 */
function buildDesktopDropdownHtml(dd: MenuDropdown, slug: string): string {
  const groupsHtml = dd.groups
    .map((g) => renderMegaGroupHtml(g))
    .join("");

  const isMega = dd.groups.length > 1;
  const extraClass = isMega ? " codex-mega-item--mega" : " codex-mega-item--simple";

  return `<li class="menu-item menu-item-has-children codex-mega-item codex-mega-item--${slug}${extraClass}"><a href="${escapeHtml(dd.href)}"><span class="nav-drop-title-wrap">${escapeHtml(dd.label)}${DROPDOWN_ARROW_SVG}</span></a><ul class="sub-menu codex-mega-dropdown${isMega ? " codex-mega-dropdown--mega" : ""}">${groupsHtml}</ul></li>`;
}

function renderMegaGroupHtml(g: MenuGroup): string {
  const links = g.links
    .map(
      (l) =>
        `<li class="menu-item"><a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a></li>`,
    )
    .join("");
  const heading = g.heading
    ? `<span class="codex-mega-heading">${escapeHtml(g.heading)}</span>`
    : "";
  return `<li class="codex-mega-group">${heading}<ul class="codex-mega-list">${links}</ul></li>`;
}

/**
 * Mobile drawer dropdown — flat nested <ul> that Kadence mobile toggle supports.
 * Kadence's mobile JS uses `.menu-item-has-children` + click on the item to
 * expand. We keep the same class so no extra JS is needed.
 */
function buildMobileDropdownHtml(dd: MenuDropdown, slug: string): string {
  const items: string[] = [];
  // Flatten: heading → links
  for (const g of dd.groups) {
    if (g.heading && dd.groups.length > 1) {
      items.push(
        `<li class="menu-item codex-mobile-heading"><span>${escapeHtml(g.heading)}</span></li>`,
      );
    }
    for (const l of g.links) {
      items.push(
        `<li class="menu-item"><a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a></li>`,
      );
    }
  }
  // Prepend "Overview" hub link
  const overview = `<li class="menu-item codex-mobile-overview"><a href="${escapeHtml(dd.href)}"><em>Overview →</em></a></li>`;
  return `<li class="menu-item menu-item-has-children codex-mega-item codex-mega-item--${slug}"><a href="${escapeHtml(dd.href)}"><span class="nav-drop-title-wrap">${escapeHtml(dd.label)}${DROPDOWN_ARROW_SVG}</span></a><ul class="sub-menu">${overview}${items.join("")}</ul></li>`;
}

function slugForLabel(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Inject new <li>s into #primary-menu and #mobile-menu. Idempotent: if the
 * injection class is already present, skip.
 */
function injectCustomNav($body: ReturnType<typeof load>): void {
  // Normalize an href to a pathname like "/industries/" for comparison.
  const normalizePath = (href: string): string =>
    (href || "")
      .replace(/^https?:\/\/[^/]+/i, "")
      .replace(/[?#].*$/, "")
      .replace(/\/?$/, "/")
      .toLowerCase();

  // Top-level items we'll replace with the new mega-menus (Industries) or cover
  // from the new Resources dropdown (Blog + FAQ). Strip these before injection
  // to avoid the duplicate top-level items visible to the user.
  const REPLACED_PATHS = new Set([
    "/industries/",
    "/blog/",
    "/faq/",
    "/case-studies/",
  ]);

  const stripReplacedItems = (list: ReturnType<typeof $body>): void => {
    list.children("li").each((_, li) => {
      const $li = $body(li);
      if ($li.hasClass("codex-mega-item")) return; // never strip our own
      const href = $li.children("a[href]").first().attr("href") ?? "";
      if (!href) return;
      if (REPLACED_PATHS.has(normalizePath(href))) {
        $li.remove();
      }
    });
  };

  // The first dropdown in PRIMARY_MENU_DROPDOWNS IS our Products mega-menu
  // (it replaces the legacy WooCommerce-generated "Products" top-level item).
  // We locate the WP Products <li>, insert the full combined dropdown HTML
  // just BEFORE it, then remove the WP item — so order becomes
  //   Home | [Products | Industries | Solutions | Resources] | …
  // If no Products anchor exists (e.g. hub page), we fall back to prepend.
  const replaceProductsAndInsert = (
    list: ReturnType<typeof $body>,
    htmlToInsert: string,
  ): void => {
    const anchor = list
      .children("li")
      .filter((_, li) => {
        const $li = $body(li);
        if ($li.hasClass("codex-mega-item")) return false;
        const href = $li.children("a[href]").first().attr("href") ?? "";
        const path = normalizePath(href);
        if (path === "/products/" || path.startsWith("/products/") || path === "/shop/") return true;
        const text = $li.children("a").first().text().trim().toLowerCase();
        return text === "products" || text === "shop";
      })
      .first();
    if (anchor.length) {
      anchor.before(htmlToInsert);
      anchor.remove();
    } else {
      list.prepend(htmlToInsert);
    }
  };

  // ── Desktop primary menu ──
  const primary = $body("ul#primary-menu").first();
  if (primary.length && primary.find(".codex-mega-item").length === 0) {
    stripReplacedItems(primary);
    // Build HTML in reverse order so successive after() preserves final order.
    const html = PRIMARY_MENU_DROPDOWNS
      .map((dd) => buildDesktopDropdownHtml(dd, slugForLabel(dd.label)))
      .join("");
    replaceProductsAndInsert(primary, html);
  }

  // ── Mobile drawer menu ──
  const mobile = $body("ul#mobile-menu").first();
  if (mobile.length && mobile.find(".codex-mega-item").length === 0) {
    stripReplacedItems(mobile);
    const html = PRIMARY_MENU_DROPDOWNS
      .map((dd) => buildMobileDropdownHtml(dd, slugForLabel(dd.label)))
      .join("");
    replaceProductsAndInsert(mobile, html);
  }

  // ── Footer expansion ──
  injectFooterSections($body);
}

/**
 * Insert the custom footer nav row BEFORE the existing bottom-footer row so
 * it sits above the logo/product-links/social/copyright strip.
 */
function injectFooterSections($body: ReturnType<typeof load>): void {
  const footer = $body("footer#colophon, footer.site-footer").first();
  if (!footer.length) return;
  if (footer.find(".codex-footer-nav").length > 0) return; // idempotent

  const sectionsHtml = FOOTER_SECTIONS.map((s) => renderFooterSection(s)).join("");
  const customRow = `<div class="codex-footer-nav" role="navigation" aria-label="Site links"><div class="codex-footer-nav__inner">${sectionsHtml}</div></div>`;

  // Insert before the bottom row if present, else prepend to footer wrap
  const bottomWrap = footer.find(".site-bottom-footer-wrap").first();
  if (bottomWrap.length) {
    bottomWrap.before(customRow);
  } else {
    const wrap = footer.find(".site-footer-wrap").first();
    if (wrap.length) wrap.prepend(customRow);
    else footer.prepend(customRow);
  }
}

function renderFooterSection(s: FooterSection): string {
  const links = s.links
    .map(
      (l) =>
        `<li><a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a></li>`,
    )
    .join("");
  return `<section class="codex-footer-nav__col"><h3 class="codex-footer-nav__heading">${escapeHtml(s.heading)}</h3><ul class="codex-footer-nav__list">${links}</ul></section>`;
}
