/**
 * Shared rail builder + filter-script for hub pages.
 *
 * Background: blog, guides and compare each used to ship their own rail
 * builder + their own near-identical inline filter script, with three
 * different data-attribute names (`data-topic`, `data-cluster`,
 * `data-category`). This module consolidates them — one builder, one
 * filter script, one attribute name (`data-rail-key`).
 *
 * The thin per-hub wrappers (`buildBlogTopicsRailHtml`,
 * `buildGuideClustersRailHtml`, `buildCompareCategoriesRailHtml`) live in
 * their original files and now delegate here, keeping their existing call
 * sites untouched.
 *
 * Card markup contract:
 *   <a class="codex-card codex-blog-grid-card"
 *      href="…"
 *      data-rail-key="${itemId}"
 *      data-kicker="…">
 *
 * Rail link contract:
 *   <a class="codex-industries-rail__link"
 *      href="…"
 *      data-rail-key="${itemId | 'all'}">
 *
 * The filter script (see `buildRailFilterScript`) reads `data-rail-key`
 * on both rail links and cards to show/hide and sync the active state.
 *
 * Catalog pages still ship their own rail markup in
 * `src/lib/catalog-pages.ts` because their count-pill <-> facet-filter
 * sync uses a different attribute (`data-cat-count`) and runs on a
 * different model (faceted AND/OR over multiple groups, not single-key
 * filter).
 */

import { escapeXml } from "./utils";

export interface RailItem {
  /** URL-safe id used in data-rail-key attribute. */
  id: string;
  /** Human-readable label shown in the rail. */
  label: string;
  /** Single-emoji visual marker (or short string). */
  icon: string;
  /** Item count badge. */
  count: number;
  /** Anchor href for this item's rail link. */
  href: string;
}

export interface RailHtmlOptions {
  /** CSS modifier appended to .codex-catalog-rail — e.g. "blog", "guides", "compare". */
  modifier: string;
  /** Plural label shown above the rail nav and on the toggle button — "Topics", "Clusters", "Categories". */
  groupLabel: string;
  /** Emoji shown next to the toggle button. */
  toggleIcon: string;
  /** Aria-label for the toggle button. */
  toggleAriaLabel: string;
  /** Aria-label for the <aside>. */
  asideAriaLabel: string;
  /** Aria-label for the close button. */
  closeAriaLabel: string;
  /** Items shown after the "All …" link. */
  items: RailItem[];
  /** "All articles" / "All guides" / "All comparisons" link config. */
  allLink: {
    label: string;
    icon: string;
    href: string;
    count: number;
  };
  /** Active item id; pass undefined to highlight the "All …" link. */
  activeId?: string;
}

function renderRailLink(item: RailItem, isActive: boolean): string {
  return `<a href="${escapeXml(item.href)}" class="codex-industries-rail__link${isActive ? ' active' : ''}" data-rail-key="${escapeXml(item.id)}">
          <span class="codex-industries-rail__emoji">${item.icon}</span>
          <span class="codex-industries-rail__label">${escapeXml(item.label)}</span>
          <span class="codex-industries-rail__count">${item.count}</span>
        </a>`;
}

export function buildRailHtml(opts: RailHtmlOptions): string {
  const allActive = !opts.activeId;
  const itemsHtml = opts.items
    .map((item) => renderRailLink(item, item.id === opts.activeId))
    .join("");

  return `
    <button type="button"
            class="codex-catalog-rail-toggle"
            aria-expanded="false"
            aria-controls="codex-catalog-rail-panel"
            aria-label="${escapeXml(opts.toggleAriaLabel)}">
      <span class="codex-catalog-rail-toggle__icon" aria-hidden="true">${opts.toggleIcon}</span>
      <span class="codex-catalog-rail-toggle__label">${escapeXml(opts.groupLabel)}</span>
    </button>
    <div class="codex-catalog-rail-backdrop" hidden></div>
    <aside id="codex-catalog-rail-panel" class="codex-catalog-rail codex-catalog-rail--${escapeXml(opts.modifier)}" aria-label="${escapeXml(opts.asideAriaLabel)}">
      <button type="button" class="codex-catalog-rail__close" aria-label="${escapeXml(opts.closeAriaLabel)}">✕</button>
      <nav class="codex-industries-rail__nav">
        <div class="codex-industries-rail__title">${escapeXml(opts.groupLabel)}</div>
        <a href="${escapeXml(opts.allLink.href)}" class="codex-industries-rail__link${allActive ? ' active' : ''}" data-rail-key="all">
          <span class="codex-industries-rail__emoji">${opts.allLink.icon}</span>
          <span class="codex-industries-rail__label">${escapeXml(opts.allLink.label)}</span>
          <span class="codex-industries-rail__count">${opts.allLink.count}</span>
        </a>
        ${itemsHtml}
      </nav>
    </aside>`;
}

export interface RailFilterScriptOptions {
  /**
   * Behaviour when a rail link is clicked on the hub itself:
   *   - "in-place"   → preventDefault, filter the grid (blog hub default).
   *   - "alt-toggle" → navigate by default, only filter in-place on Alt-click
   *                    (compare hub default — sub-category pages exist as
   *                    real URLs, so most clicks should navigate).
   *   - "navigate"   → never filter, always navigate (guides hub — no
   *                    filter handler needed at all, but kept here for
   *                    completeness; equivalent to omitting the script).
   */
  filterMode: "in-place" | "alt-toggle" | "navigate";
  /** Id of the .codex-blog-index section that scrolls into view on filter. */
  hubAnchorId: string;
  /** Path of the hub itself — used to early-return when navigated to a
   *  sub-page so the filter script doesn't suppress navigation there. */
  hubPath: string;
  /**
   * CSS selector for cards the filter should show/hide.
   * Default: ".codex-blog-index .codex-blog-grid-card"
   */
  cardSelector?: string;
}

/**
 * Returns the inline JS body for the rail filter script. Wrap the result
 * in a `<script>` tag (or use Astro's `<script is:inline set:html={...}>`).
 *
 * The script handles five things uniformly:
 *   1. Toggle open/close at narrow viewports (button + backdrop + ESC key).
 *   2. Active-state class sync on rail links.
 *   3. Show/hide cards matching `data-rail-key`.
 *   4. Empty-state visibility (`.codex-blog-index__empty[hidden]`).
 *   5. Smooth scroll back to the hub anchor after filter.
 */
export function buildRailFilterScript(opts: RailFilterScriptOptions): string {
  const cardSelector = opts.cardSelector ?? ".codex-blog-index .codex-blog-grid-card";
  // String-build with literal interpolation; the values are non-user-input
  // constants from the call site, so no further escaping is needed.
  const filterModeJs = JSON.stringify(opts.filterMode);
  const hubAnchorIdJs = JSON.stringify(opts.hubAnchorId);
  const hubPathJs = JSON.stringify(opts.hubPath);
  const cardSelectorJs = JSON.stringify(cardSelector);

  return `(function () {
  var rail = document.getElementById('codex-catalog-rail-panel');
  var toggle = document.querySelector('.codex-catalog-rail-toggle');
  var backdrop = document.querySelector('.codex-catalog-rail-backdrop');
  var closeBtn = rail ? rail.querySelector('.codex-catalog-rail__close') : null;
  var links = rail ? rail.querySelectorAll('.codex-industries-rail__link') : [];
  var cards = document.querySelectorAll(${cardSelectorJs});
  var emptyState = document.querySelector('.codex-blog-index__empty');
  var emptyClear = emptyState ? emptyState.querySelector('.codex-blog-index__empty-clear') : null;
  var FILTER_MODE = ${filterModeJs};
  var HUB_ANCHOR_ID = ${hubAnchorIdJs};
  var HUB_PATH = ${hubPathJs};
  if (!rail) return;

  function setActiveKey(key) {
    var visible = 0;
    links.forEach(function (l) {
      if (l.getAttribute('data-rail-key') === key) l.classList.add('active');
      else l.classList.remove('active');
    });
    cards.forEach(function (card) {
      if (key === 'all' || card.getAttribute('data-rail-key') === key) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });
    if (emptyState) emptyState.hidden = visible !== 0;
  }

  function openRail() {
    rail.classList.add('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    if (backdrop) backdrop.hidden = false;
    document.body.classList.add('codex-catalog-rail-locked');
  }
  function closeRail() {
    rail.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (backdrop) backdrop.hidden = true;
    document.body.classList.remove('codex-catalog-rail-locked');
  }
  if (toggle) toggle.addEventListener('click', function () {
    if (rail.classList.contains('is-open')) closeRail();
    else openRail();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeRail);
  if (backdrop) backdrop.addEventListener('click', closeRail);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && rail.classList.contains('is-open')) closeRail();
  });

  if (FILTER_MODE !== 'navigate' && links.length && cards.length) {
    links.forEach(function (l) {
      l.addEventListener('click', function (e) {
        // On sub-pages (per-post, per-cluster, per-category), let the
        // anchor navigate back to the hub naturally — no filter to apply.
        if (window.location.pathname !== HUB_PATH) return;

        var shouldFilter =
          FILTER_MODE === 'in-place' ||
          (FILTER_MODE === 'alt-toggle' && e.altKey);
        if (!shouldFilter) return;

        e.preventDefault();
        var key = l.getAttribute('data-rail-key');
        setActiveKey(key);
        var idx = document.getElementById(HUB_ANCHOR_ID);
        if (idx) idx.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.matchMedia('(max-width: 1279px)').matches) closeRail();
      });
    });
  }

  if (emptyClear) emptyClear.addEventListener('click', function () {
    setActiveKey('all');
  });
})();`;
}
