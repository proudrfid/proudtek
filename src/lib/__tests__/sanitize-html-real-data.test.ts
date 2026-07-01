import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import type { SnapshotPage } from "../site-data";
import { extractChromeFromSnapshot } from "../seo/snapshot-chrome";
import { buildPageSeo } from "../seo";

/**
 * Regression coverage for the 2026-07-01 Site Kit residue audit, run against
 * REAL checked-in snapshot data (src/data/pages/*.json) rather than a
 * synthetic mock (see snapshot-chrome.test.ts for the mock-based test) — this
 * catches gaps the mock can't, since it exercises the exact strings the WP
 * "Site Kit by Google" plugin actually left behind.
 *
 * Two distinct bugs were found and fixed here:
 *   1. extractChromeFromSnapshot() ran sanitizeHead on headHtml but shipped
 *      bodyHtml raw, so the "Sign in with Google" <script src="accounts.
 *      google.com/gsi/client"> (a WP-admin-login artifact, zero visitor
 *      function) leaked into every hub page borrowing that donor's chrome.
 *   2. sanitizeHead/sanitizeBody's CSS-selector removal deletes the
 *      *element* but not the HTML comment markers Site Kit wraps around it
 *      (e.g. `<!-- Sign in with Google button added by Site Kit -->`) —
 *      those are separate sibling nodes. stripNoiseHtmlComments() already
 *      regex-stripped 3 of the 4 "added by Site Kit" comment pairs that
 *      exist anywhere in src/data/pages/**\/*.json (verified exhaustively
 *      via `grep -oh '<!-- [^>]*added by Site Kit[^>]*-->'`); the 4th
 *      (Sign in with Google) was missing from that list, and
 *      extractChromeFromSnapshot never called stripNoiseHtmlComments at all.
 */
function loadRealSnapshot(slug: string): SnapshotPage {
  const p = path.resolve(__dirname, "../../data/pages", `${slug}.json`);
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

describe("Site Kit residue: real snapshot data", () => {
  it("extractChromeFromSnapshot strips the gsi/client script from the real blog.json donor", () => {
    const donor = loadRealSnapshot("blog");
    expect(donor.bodyHtml).toContain("gsi/client"); // sanity: residue really is in source
    const chrome = extractChromeFromSnapshot(donor, "/blog/");
    const combined = chrome.headHtml + chrome.beforeMainHtml + chrome.afterMainHtml;
    expect(combined).not.toContain("gsi/client");
    expect(combined).not.toContain("accounts.google.com");
  });

  it("buildPageSeo strips gsi/client + gtag/AdSense/generator markers from the real faq.json (full-render path)", () => {
    const donor = loadRealSnapshot("faq");
    expect(donor.bodyHtml).toContain("gsi/client");
    expect(donor.headHtml).toContain("googletagmanager.com/gtag");
    const seo = buildPageSeo(donor);
    expect(seo.bodyHtml).not.toContain("gsi/client");
    expect(seo.bodyHtml).not.toContain("accounts.google.com");
    expect(seo.headHtml).not.toContain("googletagmanager.com/gtag");
    expect(seo.headHtml).not.toContain("google_gtagjs");
    expect(seo.headHtml).not.toContain("Site Kit");
    expect(seo.headHtml).not.toContain("google-adsense-platform");
  });

  it("extractChromeFromSnapshot strips the same head-side markers from a real donor", () => {
    const donor = loadRealSnapshot("faq");
    const chrome = extractChromeFromSnapshot(donor, "/faq/");
    expect(chrome.headHtml).not.toContain("googletagmanager.com/gtag");
    expect(chrome.headHtml).not.toContain("Site Kit");
  });

  it("no orphan 'added by Site Kit' HTML comments survive in either render path", () => {
    const donor = loadRealSnapshot("faq");

    const seo = buildPageSeo(donor);
    expect(seo.headHtml).not.toContain("Site Kit");
    expect(seo.bodyHtml).not.toContain("Site Kit");
    expect(seo.bodyHtml).not.toContain("Sign in with Google");

    const chrome = extractChromeFromSnapshot(donor, "/faq/");
    const combined = chrome.headHtml + chrome.beforeMainHtml + chrome.afterMainHtml;
    expect(combined).not.toContain("Site Kit");
    expect(combined).not.toContain("Sign in with Google");
  });
});
