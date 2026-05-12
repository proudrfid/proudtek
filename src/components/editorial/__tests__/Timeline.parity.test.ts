/**
 * Parity test — Timeline.astro ↔ editorial-pages.ts inline timeline.
 *
 * Stage 2.
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Timeline from "../Timeline.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import {
  sectionWithVariant,
  minimalTimeline,
  typicalTimeline,
  typicalCitations,
  noCitations,
} from "../../../lib/__tests__/fixtures/editorial";

const OL_RE = /<ol class="codex-editorial-timeline">[\s\S]*?<\/ol>/;

function extractTimeline(sectionHtml: string): string {
  const match = sectionHtml.match(OL_RE);
  return match ? match[0] : "";
}

async function renderAstro(items: Array<{ label: string; text: string }>, citations?: { sourcesId: string; sourcesCount: number }): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(Timeline, { props: { items, citations } });
}

describe("Timeline.astro ↔ editorial-pages.ts parity", () => {
  it("minimal: 1 step, no citations", async () => {
    const section = sectionWithVariant("timeline", minimalTimeline);
    const tsFragment = extractTimeline(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(minimalTimeline.items);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("typical: 3 steps + inline link + citation marker", async () => {
    const section = sectionWithVariant("timeline", typicalTimeline);
    const tsFragment = extractTimeline(__TEST__.renderSection(section as never, "test-id", typicalCitations));
    const astroHtml = await renderAstro(typicalTimeline.items, typicalCitations);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("empty: both sides render nothing", async () => {
    const section = sectionWithVariant("timeline", { items: [] });
    const tsFragment = extractTimeline(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro([]);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
    expect(normalizeHtml(astroHtml)).toBe("");
  });

  it("HTML-significant chars in label (escape parity on plain {expression})", async () => {
    const items = [
      { label: 'Week 1 — "Discovery"', text: "Audit & artwork sign-off." },
      { label: "Week 3", text: "Encoding <pilot> batch." },
    ];
    const section = sectionWithVariant("timeline", { items });
    const tsFragment = extractTimeline(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(items);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });
});
