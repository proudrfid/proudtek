/**
 * Parity test — StatBar.astro ↔ editorial-pages.ts inline statBar.
 *
 * Stage 2 (path-3 prep). See ./Testimonial.parity.test.ts for parity strategy.
 *
 * Exercises the array-iteration pattern (`{items.map(...)}`) — the first
 * variant covered that doesn't just render a single object. If empty arrays
 * are handled the same on both sides, the iteration pattern is solid for
 * every subsequent variant (timeline, comparePanel, featureGrid, checklist).
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import StatBar from "../StatBar.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import {
  sectionWithVariant,
  minimalStatBar,
  typicalStatBar,
  noCitations,
} from "../../../lib/__tests__/fixtures/editorial";

const UL_RE = /<ul class="codex-editorial-stat-bar"[\s\S]*?<\/ul>/;

function extractStatBar(sectionHtml: string): string {
  const match = sectionHtml.match(UL_RE);
  // statBar guard clause: when items is empty the TS side renders "" so the
  // entire <ul> won't appear. Return empty string to mirror that.
  return match ? match[0] : "";
}

async function renderAstro(items: Array<{ value: string; label: string }>): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(StatBar, { props: { items } });
}

describe("StatBar.astro ↔ editorial-pages.ts parity", () => {
  it("minimal: 1 item", async () => {
    const section = sectionWithVariant("statBar", minimalStatBar);
    const tsFragment = extractStatBar(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(minimalStatBar.items);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("typical: 3 items", async () => {
    const section = sectionWithVariant("statBar", typicalStatBar);
    const tsFragment = extractStatBar(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(typicalStatBar.items);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("empty items: both sides render nothing", async () => {
    const section = sectionWithVariant("statBar", { items: [] });
    const tsFragment = extractStatBar(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro([]);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
    // And explicitly: both should be empty
    expect(normalizeHtml(astroHtml)).toBe("");
  });

  it("HTML-significant chars in value and label (auto-escape parity)", async () => {
    const items = [
      { value: "5K+", label: 'min "wholesale" qty' },
      { value: "<50ms", label: "Per-tag latency" },
      { value: "Tom & Co.", label: "Anchor partner" },
    ];
    const section = sectionWithVariant("statBar", { items });
    const tsFragment = extractStatBar(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(items);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });
});
