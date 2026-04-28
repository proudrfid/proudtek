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
  // Phase 7 — Kadence JS layer diagnostic (2026-04-27).
  // Three Kadence runtime scripts confirmed dead via emitter↔consumer
  // cross-reference (mirror of DS-16 methodology applied to JS):
  //   1. splide.min — testimonial carousel lib. Built HTML strips
  //      `.kt-blocks-carousel-init` from testimonial wrappers (this
  //      file, ~L153) so Splide finds nothing to bootstrap. ~13 KB
  //      transferred on home only.
  //   2. kb-splide-init.min — companion init that calls
  //      querySelectorAll(".wp-block-kadence-advancedgallery
  //      .kt-blocks-carousel-init") — same stripped class. ~2 KB.
  //   3. kb-advanced-heading.min — typed-text animation runtime.
  //      Polls every 125 ms for global `Typed` to exist (it never
  //      does — Typed.js is not bundled), and even if found, its
  //      target `.kt-typed-text` selector matches zero elements
  //      across all built routes. ~0.9 KB × 7 routes + a leaked
  //      polling interval that runs forever on every visit.
  // See PHASE-7-KADENCE-JS-DIAGNOSTIC.md for the full audit.
  'script[src*="splide.min"]',
  'script[src*="kb-splide-init"]',
  'script[src*="kb-advanced-heading"]',
  // Phase 9 — kt-accordion runtime no longer needed. seo.ts
  // enhanceFaqPage() converts every .wp-block-kadence-accordion to
  // native <details>/<summary> markup styled as .codex-disclosure.
  // Native expand/collapse + keyboard semantics come free from the
  // platform; the 13 KB Kadence runtime is dead weight on /faq/.
  'script[src*="kt-accordion"]',
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

  // ── Active nav state: route-aware highlight (DS-9 #2) ──
  // The crawled snapshot baked `is-active` / `current-menu-item` onto whatever
  // page the snapshot was captured from (most often About). Strip stale active
  // classes site-wide and re-apply them based on the current page.route so the
  // top nav correctly reflects where the user actually is.
  markActiveNav($body, page.route);

  // ── Page-specific redesigns ──
  if (page.route === "/contact/" || page.route === "/contact") {
    redesignContactPage($body);
  }

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
 * Mobile drawer dropdown — second-level accordion.
 *
 * When the dropdown has multiple groups with headings (Products / Industries /
 * Solutions), each group renders as a collapsible accordion row showing only
 * the heading by default; the user taps to expand and reveal its links. This
 * keeps the open Solutions menu under ~10 visible rows instead of ~46.
 *
 * When the dropdown has a single group or no headings (Resources), the flat
 * link list is preserved — collapsing a 6-item flat menu would be friction
 * without payoff.
 *
 * Behaviour is wired in `BaseLayout.astro` (inline script binds click +
 * keyboard to `.codex-mobile-group-toggle`). The buttons keep `aria-expanded`
 * synced with the `hidden` attribute on the sibling list, so screen readers
 * announce state and CSS can rotate the chevron.
 *
 * The outer top-level item still uses Kadence's `.menu-item-has-children`
 * convention so the existing mobile drawer toggle continues to expand it.
 */
function buildMobileDropdownHtml(dd: MenuDropdown, slug: string): string {
  const useAccordion = dd.groups.length > 1 && dd.groups.some((g) => Boolean(g.heading));
  const items: string[] = [];

  // Standalone chevron (no Kadence wrapper classes — those carry parent
  // dropdown-toggle handlers that would interfere with our own click binding).
  const accordionChevron = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M5.293 9.707l6 6c0.391 0.391 1.024 0.391 1.414 0l6-6c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"/></svg>`;

  if (useAccordion) {
    // One collapsible row per group. Default collapsed.
    dd.groups.forEach((g, i) => {
      const groupId = `cmg-${slug}-${i}`;
      const linksHtml = g.links
        .map(
          (l) =>
            `<li class="menu-item codex-mobile-sublink"><a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a></li>`,
        )
        .join("");
      const heading = g.heading ?? "More";
      items.push(
        `<li class="menu-item codex-mobile-group">` +
          `<button type="button" class="codex-mobile-group-toggle" aria-expanded="false" aria-controls="${groupId}" data-codex-mobile-group-toggle>` +
            `<span class="codex-mobile-group-label">${escapeHtml(heading)}</span>` +
            `<span class="codex-mobile-group-count" aria-hidden="true">${g.links.length}</span>` +
            `<span class="codex-mobile-group-chevron" aria-hidden="true">${accordionChevron}</span>` +
          `</button>` +
          `<ul class="codex-mobile-group-list" id="${groupId}" hidden>${linksHtml}</ul>` +
        `</li>`,
      );
    });
  } else {
    // Flat: small dropdowns (Resources) keep the original behaviour.
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

// ---------------------------------------------------------------------------
// Active nav state — DS-9 #2 (2026-04-26)
// ---------------------------------------------------------------------------

/**
 * Apply route-aware active state to the top nav after `injectCustomNav` has
 * rebuilt the dropdown structure.
 *
 * Background: the original WP snapshot was crawled from the About page (or the
 * crawler followed an About link), so every snapshot's `#primary-menu` /
 * `#mobile-menu` hard-codes `current-menu-item` + `current_page_item` on the
 * About <li>. That makes ABOUT appear highlighted on every one of the ~470
 * generated pages. Flagged in the design-critique pass as Critical issue #2.
 *
 * Strategy:
 *   1. Strip every active-state class from all <li>/<a> in #primary-menu and
 *      #mobile-menu (defensive — covers Kadence + WP variants).
 *   2. Map the page's route to the correct top-level menu item via prefix
 *      rules (e.g. /products/* and /product/* both → Products dropdown).
 *   3. Add `current-menu-item current_page_item codex-active` to the matching
 *      top-level <li> and `aria-current="page"` to its anchor.
 *   4. Also mark exact-href sub-menu matches with `aria-current="page"` so
 *      keyboard / screen-reader users get precise location feedback.
 *
 * The Kadence theme CSS rule `.current-menu-item > a` provides the visible
 * gold underline; we don't need to ship our own CSS for the highlight.
 */
function markActiveNav($body: ReturnType<typeof load>, currentRoute: string): void {
  const ACTIVE_LI_CLASSES = [
    "current-menu-item",
    "current_page_item",
    "current-menu-parent",
    "current_page_parent",
    "current-menu-ancestor",
    "current_page_ancestor",
    "is-active",
    "codex-active",
  ];
  const ACTIVE_A_CLASSES = ["is-active", "current-menu-item", "codex-active"];

  const normalizePath = (href: string): string =>
    (href || "")
      .replace(/^https?:\/\/[^/]+/i, "")
      .replace(/[?#].*$/, "")
      .replace(/\/?$/, "/")
      .toLowerCase();

  const route = normalizePath(currentRoute);

  // Map route prefix → top-level menu href that should be highlighted.
  // Order matters: most-specific first; first match wins.
  // The href values mirror PRIMARY_MENU_DROPDOWNS exactly so anchor lookup is
  // a string-equality test.
  const TOP_LEVEL_RULES: Array<[RegExp, string]> = [
    [/^\/products\//, "/products/all/"],
    [/^\/product\//, "/products/all/"],
    [/^\/industries\//, "/industries/"],
    [/^\/solutions\//, "/solutions/"],
    [
      /^\/(blog|guides|compare|compatibility|case-studies|faq|resources)\//,
      "/resources/",
    ],
    [/^\/contact\//, "/contact/"],
    [/^\/about\//, "/about/"],
  ];

  let activeTopHref: string | null = null;
  for (const [pattern, href] of TOP_LEVEL_RULES) {
    if (pattern.test(route)) {
      activeTopHref = normalizePath(href);
      break;
    }
  }
  // Home page (/) and any unmatched route fall through with no active item.
  // The logo serves as the implicit Home link; not highlighting any top-nav
  // item on the homepage matches the convention used by most B2B sites.

  for (const menuId of ["#primary-menu", "#mobile-menu"]) {
    const menu = $body(menuId).first();
    if (!menu.length) continue;

    // 1. Strip stale active state from every li and anchor in this menu.
    menu.find("li").each((_, li) => {
      const $li = $body(li);
      for (const c of ACTIVE_LI_CLASSES) $li.removeClass(c);
    });
    menu.find("a").each((_, a) => {
      const $a = $body(a);
      for (const c of ACTIVE_A_CLASSES) $a.removeClass(c);
      $a.removeAttr("aria-current");
    });

    if (!activeTopHref) continue;

    // 2. Mark the matching top-level <li>.
    menu.children("li").each((_, li) => {
      const $li = $body(li);
      const $anchor = $li.children("a[href]").first();
      if (!$anchor.length) return;
      const path = normalizePath($anchor.attr("href") ?? "");
      if (path === activeTopHref) {
        $li.addClass("current-menu-item current_page_item codex-active");
        $anchor.attr("aria-current", "page");
      }
    });

    // 3. Mark exact-route sub-menu items so keyboard/AT users get precise
    //    location feedback inside the open dropdown.
    menu
      .find(
        "ul.sub-menu a[href], ul.codex-mega-list a[href], ul.codex-mobile-group-list a[href]",
      )
      .each((_, a) => {
        const $a = $body(a);
        const path = normalizePath($a.attr("href") ?? "");
        if (path === route) {
          $a.attr("aria-current", "page");
          const $parentLi = $a.parent("li");
          if ($parentLi.length) {
            $parentLi.addClass("current-menu-item codex-active");
          }
        }
      });
  }
}

/**
 * Replace the entire legacy footer body with a unified single-layer footer:
 *   1. Brand row: logo + tagline + Request-quote CTA
 *   2. Nav grid: 6 columns (Products / Industries / Solutions / Resources / Markets / Company)
 *   3. Bottom strip: copyright + contact + social icons
 *
 * The legacy `.site-bottom-footer-wrap` (logo strip + product nav + contact +
 * social) is removed because every piece of content has been folded into the
 * new layout — no more two-tier footer.
 */
function injectFooterSections($body: ReturnType<typeof load>): void {
  const footer = $body("footer#colophon, footer.site-footer").first();
  if (!footer.length) return;
  if (footer.find(".codex-footer").length > 0) return; // idempotent

  const sectionsHtml = FOOTER_SECTIONS.map((s) => renderFooterSection(s)).join("");
  const html =
    `<div class="codex-footer">` +
    renderFooterBrandRow() +
    `<div class="codex-footer-nav" role="navigation" aria-label="Site links"><div class="codex-footer-nav__inner">${sectionsHtml}</div></div>` +
    renderFooterBottomStrip() +
    `</div>`;

  // Wipe the entire legacy footer body and replace with the unified layout.
  // We keep the outer <footer id="colophon"> element so existing global CSS
  // hooks (and the WP-style page structure) continue to work.
  const wrap = footer.find(".site-footer-wrap").first();
  if (wrap.length) {
    wrap.empty().append(html);
  } else {
    footer.empty().append(html);
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

function renderFooterBrandRow(): string {
  return (
    `<div class="codex-footer-brand">` +
      `<div class="codex-footer-brand__inner">` +
        `<a class="codex-footer-brand__logo" href="/" aria-label="Proud Tek home">` +
          `<img src="/site-assets/wp-content/uploads/2024/04/proudtek-logo.png" alt="Proud Tek" width="220" height="60" loading="lazy" decoding="async">` +
        `</a>` +
        `<p class="codex-footer-brand__tagline">Custom RFID &amp; NFC manufacturer — cards, tags, labels, wristbands, keyfobs and readers shipped worldwide from China since 2010.</p>` +
        `<a class="codex-footer-brand__cta" href="/contact/">Request a quote <span aria-hidden="true">→</span></a>` +
      `</div>` +
    `</div>`
  );
}

function renderFooterBottomStrip(): string {
  const year = new Date().getFullYear();
  const social = [
    { href: "https://www.facebook.com/", label: "Facebook", svg: '<svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M31.997 16C31.997 7.164 24.834 0 16 0S0 7.164 0 16c0 7.985 5.85 14.604 13.5 15.804V20.625H9.438V16H13.5v-3.525c0-4.01 2.39-6.225 6.043-6.225 1.75 0 3.581.313 3.581.313v3.937h-2.017c-1.987 0-2.607 1.233-2.607 2.498V16h4.437l-.709 4.625H18.5v11.18C26.149 30.604 32 23.985 32 16z"/></svg>' },
    { href: "https://twitter.com/", label: "Twitter", svg: '<svg viewBox="0 0 26 28" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M25.312 6.375a10.6 10.6 0 0 1-2.531 2.609c.016.219.016.438.016.656 0 6.672-5.078 14.359-14.359 14.359-2.86 0-5.516-.828-7.75-2.266.406.047.797.063 1.219.063 2.359 0 4.531-.797 6.266-2.156-2.219-.047-4.078-1.5-4.719-3.5.313.047.625.078.953.078.453 0 .906-.063 1.328-.172-2.312-.469-4.047-2.5-4.047-4.953v-.063c.672.375 1.453.609 2.281.641-1.359-.906-2.25-2.453-2.25-4.203 0-.938.25-1.797.688-2.547 2.484 3.062 6.219 5.063 10.406 5.281a5.69 5.69 0 0 1-.125-1.156c0-2.781 2.25-5.047 5.047-5.047 1.453 0 2.766.609 3.687 1.594 1.141-.219 2.234-.641 3.203-1.219-.375 1.172-1.172 2.156-2.219 2.781 1.016-.109 2-.391 2.906-.781z"/></svg>' },
    { href: "https://www.linkedin.com/", label: "LinkedIn", svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.38-1.85c3.61 0 4.27 2.38 4.27 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45C23.21 24 24 23.23 24 22.28V1.72C24 .77 23.21 0 22.23 0h-.01z"/></svg>' },
  ];
  const socialHtml = social
    .map(
      (s) =>
        `<a class="codex-footer-bottom__social" href="${s.href}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}">${s.svg}</a>`,
    )
    .join("");

  return (
    `<div class="codex-footer-bottom">` +
      `<div class="codex-footer-bottom__inner">` +
        `<div class="codex-footer-bottom__copy">© ${year} Proud Tek — Custom RFID &amp; NFC manufacturer.</div>` +
        `<ul class="codex-footer-bottom__contact">` +
          `<li><a href="tel:+8618665820632">Tel: +86 186 6582 0632</a></li>` +
          `<li><a href="https://wa.me/8618665820632" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>` +
          `<li><a href="mailto:info@proudtek.com">info@proudtek.com</a></li>` +
        `</ul>` +
        `<div class="codex-footer-bottom__social-row" aria-label="Social profiles">${socialHtml}</div>` +
      `</div>` +
    `</div>`
  );
}

/**
 * Replace the legacy WordPress / Kadence contact page body with a single
 * clean two-column layout: contact methods on the left, message form on
 * the right, plus a single Google-Maps embed pinned to the actual office
 * coordinates in Shenzhen (the legacy embed had San Francisco lat/lng).
 */
function redesignContactPage($body: ReturnType<typeof load>): void {
  const article = $body("article#post-15, main#main article").first();
  if (!article.length) return;

  // Pull the existing form (preserve hidden fields + endpoint) so the
  // backend wiring keeps working — only re-skin the field markup.
  const legacyForm = article.find("form.kb-form").first();
  const formHtml = legacyForm.length
    ? legacyForm.prop("outerHTML")
    : "";

  const html = `
<div class="codex-contact">
  <header class="codex-contact__hero">
    <p class="codex-contact__eyebrow">Get in touch</p>
    <h1 class="codex-contact__title">Talk to a Proud Tek RFID specialist</h1>
    <p class="codex-contact__lede">Custom RFID &amp; NFC manufacturer since 2008 — cards, tags, labels, wristbands, keyfobs and readers. Tell us your project and we'll reply within one business day with a quote, samples options, and chip recommendations.</p>
  </header>

  <div class="codex-contact__grid">
    <aside class="codex-contact__side">
      <section class="codex-contact__channels" aria-label="Contact channels">
        <h2 class="codex-contact__h2">Reach us directly</h2>

        <a class="codex-contact__channel" href="mailto:info@proudtek.com">
          <span class="codex-contact__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
          </span>
          <span class="codex-contact__channel-body">
            <span class="codex-contact__label">Email</span>
            <span class="codex-contact__value">info@proudtek.com</span>
          </span>
        </a>

        <a class="codex-contact__channel" href="tel:+8618665820632">
          <span class="codex-contact__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>
          </span>
          <span class="codex-contact__channel-body">
            <span class="codex-contact__label">Phone</span>
            <span class="codex-contact__value">+86 186 6582 0632</span>
          </span>
        </a>

        <a class="codex-contact__channel" href="https://wa.me/8618665820632" target="_blank" rel="noopener noreferrer">
          <span class="codex-contact__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413"/></svg>
          </span>
          <span class="codex-contact__channel-body">
            <span class="codex-contact__label">WhatsApp</span>
            <span class="codex-contact__value">+86 186 6582 0632</span>
          </span>
        </a>

        <div class="codex-contact__channel codex-contact__channel--static">
          <span class="codex-contact__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </span>
          <span class="codex-contact__channel-body">
            <span class="codex-contact__label">Office</span>
            <span class="codex-contact__value">A2110, Zhantao Building, #1079 Minzhi Road, Longhua District, Shenzhen, China</span>
          </span>
        </div>

        <div class="codex-contact__hours">
          <span class="codex-contact__label">Business hours</span>
          <span>Mon &ndash; Fri · 9:00 &ndash; 18:00 GMT+8</span>
        </div>
      </section>
    </aside>

    <section class="codex-contact__form-card" aria-label="Send a message">
      <h2 class="codex-contact__h2">Send a message</h2>
      <p class="codex-contact__form-lede">Tell us about your RFID project — quantity, chip preference, environment and timeline. The more detail you share, the more accurate our quote.</p>
      ${formHtml}
    </section>
  </div>

  <section class="codex-contact__map" aria-label="Office location">
    <!--
      Phase 8 — Click-to-activate Maps embed (was eager-loaded iframe).
      Lighthouse counted ~370 KB of Google Maps API JS via the iframe's
      internal page load. Click-to-activate means the map JS only loads
      on user interaction. Graceful degradation: with JS disabled, the
      button is an <a> that opens Google Maps in a new tab.
    -->
    <div class="codex-contact__map-card" data-codex-map-card>
      <div class="codex-contact__map-card-body">
        <span class="codex-contact__map-card-pin" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </span>
        <div class="codex-contact__map-card-text">
          <strong class="codex-contact__map-card-title">Proud Tek office</strong>
          <span class="codex-contact__map-card-address">Zhantao Building, Minzhi Road, Longhua District, Shenzhen 518131, China</span>
        </div>
      </div>
      <a
        class="codex-contact__map-card-btn"
        href="https://www.google.com/maps?q=Zhantao+Building+Minzhi+Road+Longhua+Shenzhen"
        target="_blank"
        rel="noopener noreferrer"
        data-codex-map-show
      >
        <span>View interactive map</span>
        <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 13l6-6M7 7h6v6"/></svg>
      </a>
    </div>
    <template data-codex-map-iframe>
      <iframe
        title="Proud Tek office — Zhantao Building, Longhua District, Shenzhen"
        src="https://www.google.com/maps?q=Zhantao+Building+Minzhi+Road+Longhua+Shenzhen&output=embed"
        width="100%" height="360" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        style="border:0; display:block;"></iframe>
    </template>
  </section>
</div>`;

  // Replace the article body. Keep <article> wrapper so the global
  // .single-entry / .entry-content selectors continue to layout correctly.
  const entry = article.find(".entry-content").first();
  if (entry.length) {
    entry.empty().append(html);
  } else {
    article.find(".entry-content-wrap").first().empty().append(`<div class="entry-content single-content">${html}</div>`);
  }

  // Drop the leftover Kadence google-maps script that pinned the wrong
  // coordinates (San Francisco). Defense in depth — the entry replacement
  // already removes the original embed, but the bare <script> may live
  // outside the entry in some snapshots.
  $body('script:contains("kb_google_map15_1d62b5_2c")').remove();
}
