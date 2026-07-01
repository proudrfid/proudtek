import { describe, it, expect } from "vitest";
import type { SnapshotPage } from "../site-data";
import { extractChromeFromSnapshot } from "../seo/snapshot-chrome";

/**
 * Regression test for a 2026-07-01 finding: extractChromeFromSnapshot()
 * sanitized headHtml (via sanitizeHead) but shipped bodyHtml raw, so any
 * donor snapshot's dead WP body scripts (Site Kit's "Sign in with Google"
 * button, WP-Statistics tracker, etc. — leftovers from the old WordPress
 * site, irrelevant to visitors) leaked into every native hub page that
 * borrows that donor's chrome (/blog/, /compare/, /guides/, /solutions/,
 * /compatibility/, /case-studies/, /products/all/page/N/). Confirmed live
 * via Lighthouse: /blog/ was fetching accounts.google.com/gsi/client
 * (~96 KiB) on every load with zero visitor-facing function. 98.6% of
 * src/data/pages/*.json (1588/1611) carry this string somewhere in their
 * raw bodyHtml, since Site Kit injected it site-wide on the original WP
 * install — the fix (running bodyHtml through sanitizeBody before slicing)
 * closes it for every hub page in one place instead of per-donor.
 */
describe("extractChromeFromSnapshot", () => {
  function buildDonor(bodyHtml: string): SnapshotPage {
    return {
      route: "/blog/",
      sourceUrl: "https://proudtek.com/blog/",
      title: "Blog",
      htmlAttrs: { lang: "en-US" },
      bodyAttrs: { class: "page" },
      headHtml: "<title>Blog</title>",
      bodyHtml,
    };
  }

  it("strips the Site Kit 'Sign in with Google' script from chrome", () => {
    const donor = buildDonor(`
      <div id="wrapper">
        <header id="masthead">nav here</header>
        <!-- Sign in with Google button added by Site Kit -->
        <script src="https://accounts.google.com/gsi/client"></script>
        <!-- End Sign in with Google button added by Site Kit -->
        <main id="main">donor main content, discarded by hub pages</main>
        <footer id="colophon">footer here</footer>
      </div>
    `);

    const chrome = extractChromeFromSnapshot(donor, "/blog/");
    const combined = chrome.beforeMainHtml + chrome.afterMainHtml;
    expect(combined).not.toContain("gsi/client");
    expect(combined).not.toContain("accounts.google.com");
    // Sanity: the real chrome content survives untouched.
    expect(combined).toContain("masthead");
    expect(combined).toContain("colophon");
  });

  it("still strips WP-Statistics tracker scripts from chrome (pre-existing sanitizeBody coverage)", () => {
    const donor = buildDonor(`
      <div id="wrapper">
        <header id="masthead">nav here</header>
        <script id="wp-statistics-js-extra">var WP_Statistics_Tracker_Object = {};</script>
        <main id="main">donor main content, discarded by hub pages</main>
        <footer id="colophon">footer here</footer>
      </div>
    `);

    const chrome = extractChromeFromSnapshot(donor, "/blog/");
    const combined = chrome.beforeMainHtml + chrome.afterMainHtml;
    expect(combined).not.toContain("WP_Statistics_Tracker_Object");
  });
});
