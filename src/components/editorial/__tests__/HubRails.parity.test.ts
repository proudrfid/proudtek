/**
 * Parity tests for HubRail.astro ↔ renderHubRail and
 * GroupedHubRail.astro ↔ renderGroupedHubRail.
 *
 * Stage 3.x. The rail variants both include an inline `<script>` tag with
 * drawer-toggle logic; the shared script body in `_railDrawerScript.ts`
 * matches the TS template literal byte-for-byte so normalize handles the
 * `is:inline` directive stripping.
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import HubRail from "../HubRail.astro";
import GroupedHubRail from "../GroupedHubRail.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import {
  minimalHubEntries,
  typicalHubEntries,
  minimalGroupedHubData,
  typicalGroupedHubData,
} from "../../../lib/__tests__/fixtures/editorial";

async function renderRail(items: typeof minimalHubEntries, currentRoute: string, sectionLabel: string): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(HubRail, { props: { items, currentRoute, sectionLabel } });
}

async function renderGroupedRail(groups: typeof minimalGroupedHubData, currentRoute: string, sectionLabel: string): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(GroupedHubRail, { props: { groups, currentRoute, sectionLabel } });
}

describe("HubRail.astro ↔ renderHubRail parity", () => {
  it("empty items: both sides render nothing", async () => {
    expect(normalizeHtml(await renderRail([], "/", "Industries"))).toBe(
      normalizeHtml(__TEST__.renderHubRail([], "/", "Industries")),
    );
    expect(normalizeHtml(await renderRail([], "/", "Industries"))).toBe("");
  });

  it("minimal: 1 entry (no active match)", async () => {
    expect(normalizeHtml(await renderRail(minimalHubEntries, "/other/", "Industries"))).toBe(
      normalizeHtml(__TEST__.renderHubRail(minimalHubEntries, "/other/", "Industries")),
    );
  });

  it("typical: 3 entries with one active", async () => {
    const currentRoute = typicalHubEntries[1].route;
    expect(normalizeHtml(await renderRail(typicalHubEntries, currentRoute, "Industries"))).toBe(
      normalizeHtml(__TEST__.renderHubRail(typicalHubEntries, currentRoute, "Industries")),
    );
  });

  it("HTML-significant chars in entry label", async () => {
    expect(normalizeHtml(await renderRail(typicalHubEntries, "/", "Industries"))).toBe(
      normalizeHtml(__TEST__.renderHubRail(typicalHubEntries, "/", "Industries")),
    );
  });

  it("multi-word sectionLabel: slugified into rail modifier class", async () => {
    expect(normalizeHtml(await renderRail(minimalHubEntries, "/", "Lock Compatibility"))).toBe(
      normalizeHtml(__TEST__.renderHubRail(minimalHubEntries, "/", "Lock Compatibility")),
    );
  });
});

describe("GroupedHubRail.astro ↔ renderGroupedHubRail parity", () => {
  it("empty groups: both sides render nothing", async () => {
    expect(normalizeHtml(await renderGroupedRail([], "/", "Solutions"))).toBe(
      normalizeHtml(__TEST__.renderGroupedHubRail([], "/", "Solutions")),
    );
    expect(normalizeHtml(await renderGroupedRail([], "/", "Solutions"))).toBe("");
  });

  it("minimal: 1 group, 1 item", async () => {
    expect(normalizeHtml(await renderGroupedRail(minimalGroupedHubData, "/", "Solutions"))).toBe(
      normalizeHtml(__TEST__.renderGroupedHubRail(minimalGroupedHubData, "/", "Solutions")),
    );
  });

  it("typical: 2 groups with mixed item counts + active entry", async () => {
    const currentRoute = typicalGroupedHubData[1].items[0].route;
    expect(normalizeHtml(await renderGroupedRail(typicalGroupedHubData, currentRoute, "Solutions"))).toBe(
      normalizeHtml(__TEST__.renderGroupedHubRail(typicalGroupedHubData, currentRoute, "Solutions")),
    );
  });

  it("filters out empty groups", async () => {
    const groups = [
      ...typicalGroupedHubData,
      { groupLabel: "Empty group", groupSlug: "empty", emoji: "○", iconSlug: "folder", items: [] },
    ];
    expect(normalizeHtml(await renderGroupedRail(groups, "/", "Solutions"))).toBe(
      normalizeHtml(__TEST__.renderGroupedHubRail(groups, "/", "Solutions")),
    );
  });

  it("HTML-significant chars in group label", async () => {
    const groups = [
      {
        groupLabel: 'Cards & "passes"',
        groupSlug: "cards",
        emoji: "🎫",
        iconSlug: "card",
        items: minimalHubEntries,
      },
    ];
    expect(normalizeHtml(await renderGroupedRail(groups, "/", "Solutions"))).toBe(
      normalizeHtml(__TEST__.renderGroupedHubRail(groups, "/", "Solutions")),
    );
  });
});
