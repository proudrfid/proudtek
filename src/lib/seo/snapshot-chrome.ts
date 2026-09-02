/**
 * Snapshot chrome extractor — pulls the WP site header + footer wrapper out of
 * a "donor" snapshot page so native .astro pages (e.g. cluster hubs) can wrap
 * their own content in the same chrome that all other pages render with.
 *
 * Why this exists:
 *   The site header + footer markup originates from the WordPress snapshot
 *   bodyHtml dumped via `<Fragment set:html={seo.bodyHtml} />` in
 *   SnapshotLayout.astro. BaseLayout.astro is intentionally chrome-free.
 *   New native .astro pages that bypass SnapshotLayout (the path-3 pattern)
 *   therefore lose the masthead and footer.
 *
 *   Rather than duplicating the header/footer markup or extracting it into
 *   yet another partial that drifts out of sync with WP, this helper pulls
 *   the chrome from any existing snapshot, runs it through `prepareSnapshot`
 *   (so it gets the same nav/footer mutations every other page gets), then
 *   slices out the `<main>` section. The native .astro page renders its own
 *   `<main>` between `beforeMainHtml` and `afterMainHtml`.
 *
 * Used by:
 *   - src/pages/guides/[cluster].astro (cluster hubs at /guides/{cluster}/)
 *
 * Future native .astro pages should use this helper rather than re-rolling
 * the chrome themselves. See docs/architecture/editorial-rendering-debt.md
 * for the broader path-3 migration plan.
 */
import { load } from "cheerio";

import type { SnapshotPage } from "../site-data";
import { prepareSnapshot } from "../render-snapshot";
import { sanitizeHead, sanitizeBody } from "./sanitize-html";
import { sanitizeHtmlAttrs, stripNoiseHtmlComments } from "./utils";
import { inventoryDonorHead } from "./donor-head-inventory";
import { applyHeadPolicy, rebuildHeadHtml } from "./head-policy";

export interface SnapshotChrome {
  htmlAttrs: Record<string, string>;
  bodyAttrs: Record<string, string>;
  /** Sanitized <head> HTML (post-prepareSnapshot — duplicate strips done). */
  headHtml: string;
  /**
   * Everything inside <body> from its open down to (but not including) the
   * `<main>` opening tag. Includes #wrapper, skip-link, masthead, and the
   * opening of #inner-wrap / #primary / .content-container.
   */
  beforeMainHtml: string;
  /**
   * Everything inside <body> from immediately after the `</main>` close to
   * the body close. Includes the closing of .content-container / #primary /
   * #inner-wrap, the footer, and #wrapper close.
   */
  afterMainHtml: string;
}

/**
 * Extract chrome from a donor snapshot page.
 *
 * @param donor         Any snapshot page with a `<main>` element (e.g. /guides/).
 * @param currentRoute  The route of the page consuming the chrome. Passed to
 *                      `prepareSnapshot` so the active-nav highlighter targets
 *                      the right top-level menu item (e.g. /guides/{cluster}/
 *                      should keep Resources highlighted).
 */
export function extractChromeFromSnapshot(
  donor: SnapshotPage,
  currentRoute: string,
  isNativeRoute = false,
): SnapshotChrome {
  // Phase 0 Deliverable 3: Zero-output integration
  // Inventory donor head assets in dev mode for visibility, but don't modify output.
  // Phase 1: Apply native-safe head filtering when isNativeRoute = true
  let filteredHeadHtml = donor.headHtml;

  if (donor.headHtml) {
    const inventory = inventoryDonorHead(donor.headHtml);

    if (import.meta.env.DEV) {
      const byClassification = inventory.reduce((acc, asset) => {
        acc[asset.classification] = (acc[asset.classification] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log(`[Phase 0] Donor head inventory for ${donor.route}:`);
      console.log(`  Total: ${inventory.length} assets`);
      Object.entries(byClassification)
        .sort((a, b) => b[1] - a[1])
        .forEach(([classification, count]) => {
          console.log(`  ${classification}: ${count}`);
        });
    }

    // Phase 1: Apply filtering for native routes
    if (isNativeRoute) {
      const filteredAssets = applyHeadPolicy(currentRoute, inventory, true);
      filteredHeadHtml = rebuildHeadHtml(filteredAssets);

      if (import.meta.env.DEV) {
        console.log(`[Phase 1] Native-safe head filtering enabled for ${currentRoute}`);
        console.log(`  Filtered: ${inventory.length} → ${filteredAssets.length} assets`);
      }
    }
  }

  // Clone donor with route override so markActiveNav inside prepareSnapshot
  // targets the consuming page's route, not the donor's.
  const snap = prepareSnapshot({ ...donor, route: currentRoute, headHtml: filteredHeadHtml });

  // sanitizeHead strips <title>, <meta description/robots/og/twitter/article>,
  // canonical, JSON-LD, etc. — every tag SeoHead.astro re-emits authoritatively
  // for the consuming page. Without this, we'd ship a duplicate <title> that
  // wins (browsers use the first one), so the donor's /guides/ title would
  // silently override the cluster page's title.
  const $head = load(`<head>${snap.headHtml}</head>`);
  sanitizeHead($head);
  // sanitizeHead's selectors remove the *elements* (script/meta tags), but a
  // CSS selector can't touch the HTML comment markers Site Kit wraps around
  // them (e.g. `<!-- Google tag (gtag.js) snippet added by Site Kit -->`) —
  // those are sibling text nodes, not part of the element being matched.
  // buildPageSeo() already runs its head/body output through this same
  // stripNoiseHtmlComments() pass for exactly that reason; this helper
  // didn't, so donor chrome carried a few dozen dead comment bytes per hub
  // page even after the "real" element was gone.
  const sanitizedHeadHtml = stripNoiseHtmlComments($head("head").html() ?? "");

  // sanitizeBody strips WP/WooCommerce admin remnants, tracking pixels, and
  // dead third-party embeds (e.g. the "Sign in with Google" button Site Kit
  // injects into every WP page's chrome — visitor-facing pages have no use
  // for it, it's a WP-admin-login artifact, but it still cost every hub page
  // borrowing this donor's chrome a live accounts.google.com/gsi/client
  // fetch). buildPageSeo() already runs bodyHtml through sanitizeBody for
  // pages that render their full snapshot body; this helper only ran
  // sanitizeHead, so any donor whose pre-/post-main chrome carried one of
  // these artifacts leaked it into every hub page consuming that chrome.
  const $body = load(`<body>${snap.bodyHtml}</body>`);
  sanitizeBody($body);
  const bodyHtml = stripNoiseHtmlComments($body("body").html() ?? "");

  // Find the <main> opening tag. Naive but reliable: snapshots have exactly
  // one <main> and it's at top level under the wrapper / inner-wrap / primary
  // / content-container chain. No nested <main> in this codebase's snapshots.
  const mainOpenMatch = bodyHtml.match(/<main\b[^>]*>/i);
  if (!mainOpenMatch || mainOpenMatch.index === undefined) {
    throw new Error(
      `extractChromeFromSnapshot: donor route ${donor.route} has no <main> open tag`,
    );
  }
  const mainOpenStart = mainOpenMatch.index;

  // Match the LAST </main> in the document — defensive against nested <main>
  // appearing in third-party blocks (none today, but cheap insurance).
  const mainCloseStart = bodyHtml.lastIndexOf("</main>");
  if (mainCloseStart === -1 || mainCloseStart < mainOpenStart) {
    throw new Error(
      `extractChromeFromSnapshot: donor route ${donor.route} has no </main> close tag`,
    );
  }
  const mainCloseEnd = mainCloseStart + "</main>".length;

  // PR-5 a11y P0: strip H1 elements from the pre-main chrome.
  //
  // Background: extractChromeFromSnapshot is called by hub pages
  // (/blog/, /case-studies/, /products/all/page/N/, /compare/,
  // /guides/, etc.) to reuse the WP masthead + footer of an archive
  // donor. WP archive pages emit their own
  //   <h1 class="page-title post-home-title archive-title">…</h1>
  // in the pre-main region. Every Astro hub template then emits a
  // second H1 inside its own content. Net result: 2 H1s per page,
  // violating WCAG 1.3.1 (Info & Relationships).
  //
  // Chrome is intended to carry header / nav / breadcrumbs, NOT
  // content headings — the consuming template owns the H1. Strip
  // any <h1>…</h1> from before-main here so every consumer is safe
  // without needing local regex (was previously fixed only in
  // blog/index.astro; case-studies and products/all paginations
  // were still emitting 2 H1s).
  const beforeMainRaw = bodyHtml.slice(0, mainOpenStart);
  const beforeMainStripped = beforeMainRaw.replace(
    /<h1\b[^>]*>[\s\S]*?<\/h1>/gi,
    "",
  );

  return {
    // Same <html> attribute policy as buildPageSeo: drop the WP microdata
    // leftovers (itemtype without itemscope) and normalise lang to en-US so
    // native hubs match the other 581 pages (audit 2026-09-01 T15).
    htmlAttrs: sanitizeHtmlAttrs(snap.htmlAttrs),
    bodyAttrs: snap.bodyAttrs,
    headHtml: sanitizedHeadHtml,
    beforeMainHtml: beforeMainStripped,
    afterMainHtml: bodyHtml.slice(mainCloseEnd),
  };
}
