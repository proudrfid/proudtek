/**
 * Parity tests — HubGrid.astro ↔ renderHubGrid and
 * ResourcesCategoryHub.astro ↔ renderResourcesCategoryHub.
 *
 * Stage 3.x.
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import HubGrid from "../HubGrid.astro";
import ResourcesCategoryHub from "../ResourcesCategoryHub.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import {
  minimalHubEntries,
  typicalHubEntries,
  resourcesCategoryHubData,
} from "../../../lib/__tests__/fixtures/editorial";

async function renderGrid(items: typeof minimalHubEntries, sectionLabel: string): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(HubGrid, { props: { items, sectionLabel } });
}
async function renderHub(groups: typeof resourcesCategoryHubData, sectionLabel: string): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(ResourcesCategoryHub, { props: { groups, sectionLabel } });
}

describe("HubGrid.astro ↔ renderHubGrid parity", () => {
  it("empty items: both sides render nothing", async () => {
    expect(normalizeHtml(await renderGrid([], "industries"))).toBe(
      normalizeHtml(__TEST__.renderHubGrid([], "industries")),
    );
    expect(normalizeHtml(await renderGrid([], "industries"))).toBe("");
  });

  it("minimal: 1 entry, sectionLabel=industries (industries-specific intro)", async () => {
    expect(normalizeHtml(await renderGrid(minimalHubEntries, "industries"))).toBe(
      normalizeHtml(__TEST__.renderHubGrid(minimalHubEntries, "industries")),
    );
  });

  it("typical: 3 entries, sectionLabel=solutions (generic intro)", async () => {
    expect(normalizeHtml(await renderGrid(typicalHubEntries, "solutions"))).toBe(
      normalizeHtml(__TEST__.renderHubGrid(typicalHubEntries, "solutions")),
    );
  });

  it("entry without heroImage falls back to placeholder + icon", async () => {
    // typicalHubEntries[2] is retail-apparel with heroImage="" — exercises the placeholder branch.
    expect(normalizeHtml(await renderGrid(typicalHubEntries, "industries"))).toBe(
      normalizeHtml(__TEST__.renderHubGrid(typicalHubEntries, "industries")),
    );
  });

  it("HTML-significant chars in label (escape parity inside h3 + img alt + CTA)", async () => {
    const items = [
      {
        slug: "test",
        route: "/industries/test/",
        label: 'Tom & "Industry"',
        emoji: "🏨",
        iconSlug: "folder",
        summary: "Summary with > 80% accuracy.",
        heroImage: "/landing-images/heroes/test.webp",
      },
    ];
    expect(normalizeHtml(await renderGrid(items, "industries"))).toBe(
      normalizeHtml(__TEST__.renderHubGrid(items, "industries")),
    );
  });

  it("long summary: truncated at 140 chars", async () => {
    const longSummary = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.";
    const items = [{ ...minimalHubEntries[0], summary: longSummary }];
    expect(normalizeHtml(await renderGrid(items, "industries"))).toBe(
      normalizeHtml(__TEST__.renderHubGrid(items, "industries")),
    );
  });
});

describe("ResourcesCategoryHub.astro ↔ renderResourcesCategoryHub parity", () => {
  it("empty groups: both sides render nothing", async () => {
    expect(normalizeHtml(await renderHub([], "resources"))).toBe(
      normalizeHtml(__TEST__.renderResourcesCategoryHub([], "resources")),
    );
    expect(normalizeHtml(await renderHub([], "resources"))).toBe("");
  });

  it("typical: 4-category resources hub fixture", async () => {
    expect(normalizeHtml(await renderHub(resourcesCategoryHubData, "resources"))).toBe(
      normalizeHtml(__TEST__.renderResourcesCategoryHub(resourcesCategoryHubData, "resources")),
    );
  });

  it("group with 5+ items: only first 4 sampled", async () => {
    const manyItems = [...typicalHubEntries, ...typicalHubEntries].slice(0, 5);
    const groups = [{
      groupLabel: "Blog",
      groupSlug: "blog",
      emoji: "📝",
      iconSlug: "folder",
      items: manyItems,
    }];
    expect(normalizeHtml(await renderHub(groups, "resources"))).toBe(
      normalizeHtml(__TEST__.renderResourcesCategoryHub(groups, "resources")),
    );
  });

  it("filters out empty groups for the heading count", async () => {
    const groups = [
      resourcesCategoryHubData[0],
      { groupLabel: "Empty", groupSlug: "compatibility", emoji: "○", iconSlug: "folder", items: [] },
    ];
    expect(normalizeHtml(await renderHub(groups, "resources"))).toBe(
      normalizeHtml(__TEST__.renderResourcesCategoryHub(groups, "resources")),
    );
  });
});
