/**
 * Parity test — Checklist.astro ↔ editorial-pages.ts inline checklist.
 *
 * Stage 2. See ./Testimonial.parity.test.ts for parity strategy.
 *
 * Combines the array-iteration pattern (StatBar) with renderInlineLinks
 * routing (Testimonial / DataHighlight). First test that runs both at once.
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Checklist from "../Checklist.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import {
  sectionWithVariant,
  minimalChecklist,
  typicalChecklist,
  typicalCitations,
  noCitations,
} from "../../../lib/__tests__/fixtures/editorial";

const UL_RE = /<ul class="codex-editorial-checklist"[\s\S]*?<\/ul>/;

function extractChecklist(sectionHtml: string): string {
  const match = sectionHtml.match(UL_RE);
  return match ? match[0] : "";
}

async function renderAstro(items: string[], citations?: { sourcesId: string; sourcesCount: number }): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(Checklist, { props: { items, citations } });
}

describe("Checklist.astro ↔ editorial-pages.ts parity", () => {
  it("minimal: 1 item, no citations", async () => {
    const section = sectionWithVariant("checklist", minimalChecklist);
    const tsFragment = extractChecklist(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(minimalChecklist);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("typical: with inline link + citation marker", async () => {
    const section = sectionWithVariant("checklist", typicalChecklist);
    const tsFragment = extractChecklist(__TEST__.renderSection(section as never, "test-id", typicalCitations));
    const astroHtml = await renderAstro(typicalChecklist, typicalCitations);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("empty: both sides render nothing", async () => {
    const section = sectionWithVariant("checklist", []);
    const tsFragment = extractChecklist(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro([]);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
    expect(normalizeHtml(astroHtml)).toBe("");
  });

  it("HTML-significant chars in plain checklist text", async () => {
    const items = ['Lock artwork by deadline & Tom\'s sign-off', "Confirm <chip family>"];
    const section = sectionWithVariant("checklist", items);
    const tsFragment = extractChecklist(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(items);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });
});
