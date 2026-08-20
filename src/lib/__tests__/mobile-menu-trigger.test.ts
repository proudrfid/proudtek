import { describe, expect, it } from "vitest";
import { load } from "cheerio";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

import SiteHeader from "../../components/shell/SiteHeader.astro";
import readersPage from "../../data/pages/products/rfid-readers.json";
import { prepareSnapshot } from "../render-snapshot";
import type { SnapshotPage } from "../site-data";

describe("mobile menu trigger clarity", () => {
  it("adds a visible Menu label to the legacy snapshot trigger", () => {
    const snapshot = prepareSnapshot(readersPage as unknown as SnapshotPage);
    const $ = load(snapshot.bodyHtml);
    const trigger = $("#mobile-toggle").first();

    expect(trigger.length).toBe(1);
    expect(trigger.attr("aria-label")).toBe("Open menu");
    expect(trigger.find(".codex-mobile-menu-label").text().trim()).toBe("Menu");
  });

  it("renders the same visible Menu label in the native shell", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SiteHeader, {
      props: { currentRoute: "/blog/" },
    });
    const $ = load(html);
    const trigger = $("[data-native-drawer-open]").first();

    expect(trigger.attr("aria-label")).toBe("Open menu");
    expect(trigger.find(".codex-mobile-menu-label").text().trim()).toBe("Menu");
  });
});
