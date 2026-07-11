/**
 * Regression guard for the 2026-07-10 nav change: "Blog" was promoted out of
 * the Resources mega-menu ("Decide" column) into its own standalone top-level
 * item, positioned immediately after About. It renders as a *plain* link — no
 * caret, no sub-menu — because BLOG_MENU has zero groups.
 *
 * Runs the real nav-injection + active-state pipeline (prepareSnapshot →
 * injectCustomNav → markActiveNav) on the /blog/ fixture so a future menu
 * re-order or a regression in the `groups.length === 0` plain-link branch
 * can't silently move Blog back under Resources or turn it into a dropdown.
 */
import { describe, expect, it } from "vitest";
import { load } from "cheerio";

import blogPage from "../../data/pages/blog.json";
import { prepareSnapshot } from "../render-snapshot";
import type { SnapshotPage } from "../site-data";

describe("Blog promoted to a top-level nav item (2026-07-10)", () => {
  const page = blogPage as unknown as SnapshotPage;
  const snapshot = prepareSnapshot(page);
  const $ = load(snapshot.bodyHtml);
  const primary = $("ul#primary-menu").first();

  it("injected the custom nav into the fixture", () => {
    expect(primary.length).toBe(1);
    expect(primary.children("li.codex-mega-item").length).toBeGreaterThan(0);
  });

  it("renders a standalone top-level Blog link (plain — no dropdown)", () => {
    const blog = primary.children("li.codex-mega-item--blog");
    expect(blog.length).toBe(1);
    // Plain link: not a dropdown, no caret / sub-menu.
    expect(blog.hasClass("menu-item-has-children")).toBe(false);
    expect(blog.find(".codex-mega-dropdown").length).toBe(0);
    expect(blog.children("a").attr("href")).toBe("/blog/");
    expect(blog.children("a").text().trim()).toBe("Blog");
  });

  it("places Blog immediately after About in the bar", () => {
    const topLevel = primary.children("li.codex-mega-item").toArray();
    const aboutIdx = topLevel.findIndex((li) =>
      $(li).hasClass("codex-mega-item--about"),
    );
    const blogIdx = topLevel.findIndex((li) =>
      $(li).hasClass("codex-mega-item--blog"),
    );
    expect(aboutIdx).toBeGreaterThan(-1);
    expect(blogIdx).toBe(aboutIdx + 1);
  });

  it("no longer lists Blog inside the Resources dropdown", () => {
    const resources = primary.children("li.codex-mega-item--resources");
    expect(resources.length).toBe(1);
    const hrefs = resources
      .find("a")
      .map((_, a) => $(a).attr("href"))
      .toArray();
    expect(hrefs).not.toContain("/blog/");
    // Sanity: the sibling "Decide" links still survive the removal.
    expect(hrefs).toContain("/guides/");
    expect(hrefs).toContain("/faq/");
  });

  it("highlights Blog (not Resources) as the active item on /blog/", () => {
    const blog = primary.children("li.codex-mega-item--blog");
    expect(blog.hasClass("current-menu-item")).toBe(true);
    expect(blog.children("a").attr("aria-current")).toBe("page");

    const resources = primary.children("li.codex-mega-item--resources");
    expect(resources.hasClass("current-menu-item")).toBe(false);
  });
});
