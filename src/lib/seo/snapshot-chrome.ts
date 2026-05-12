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
import { sanitizeHead } from "./sanitize-html";

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
): SnapshotChrome {
  // Clone donor with route override so markActiveNav inside prepareSnapshot
  // targets the consuming page's route, not the donor's.
  const snap = prepareSnapshot({ ...donor, route: currentRoute });

  // sanitizeHead strips <title>, <meta description/robots/og/twitter/article>,
  // canonical, JSON-LD, etc. — every tag SeoHead.astro re-emits authoritatively
  // for the consuming page. Without this, we'd ship a duplicate <title> that
  // wins (browsers use the first one), so the donor's /guides/ title would
  // silently override the cluster page's title.
  const $head = load(`<head>${snap.headHtml}</head>`);
  sanitizeHead($head);
  const sanitizedHeadHtml = $head("head").html() ?? "";

  const bodyHtml = snap.bodyHtml;

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

  return {
    htmlAttrs: snap.htmlAttrs,
    bodyAttrs: snap.bodyAttrs,
    headHtml: sanitizedHeadHtml,
    beforeMainHtml: bodyHtml.slice(0, mainOpenStart),
    afterMainHtml: bodyHtml.slice(mainCloseEnd),
  };
}
