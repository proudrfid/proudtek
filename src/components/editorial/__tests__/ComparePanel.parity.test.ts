/**
 * Parity test — ComparePanel.astro ↔ editorial-pages.ts inline comparePanel.
 *
 * Stage 2. Exercises:
 *   - default-heading fallback (`?? "Before"` / `?? "After"`)
 *   - parallel arrays (before / after) iterated through renderInlineLinks
 *   - HTML-significant chars in heading attribute (auto-escape on plain text)
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import ComparePanel from "../ComparePanel.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import {
  sectionWithVariant,
  minimalComparePanel,
  typicalComparePanel,
  citationsComparePanel,
  typicalCitations,
  noCitations,
} from "../../../lib/__tests__/fixtures/editorial";

const DIV_RE = /<div class="codex-editorial-compare"[\s\S]*?<\/div>\s*<\/div>/;

function extractCompare(sectionHtml: string): string {
  const match = sectionHtml.match(DIV_RE);
  if (!match) throw new Error(`comparePanel fragment not found:\n${sectionHtml}`);
  return match[0];
}

async function renderAstro(props: {
  before: string[];
  after: string[];
  beforeHeading?: string;
  afterHeading?: string;
  citations?: { sourcesId: string; sourcesCount: number };
}): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(ComparePanel, { props });
}

describe("ComparePanel.astro ↔ editorial-pages.ts parity", () => {
  it("minimal: default headings", async () => {
    const section = sectionWithVariant("comparePanel", minimalComparePanel);
    const tsFragment = extractCompare(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(minimalComparePanel);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("typical: custom headings + inline link in items", async () => {
    const section = sectionWithVariant("comparePanel", typicalComparePanel);
    const tsFragment = extractCompare(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(typicalComparePanel);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("with citation markers in items", async () => {
    const section = sectionWithVariant("comparePanel", citationsComparePanel);
    const tsFragment = extractCompare(__TEST__.renderSection(section as never, "test-id", typicalCitations));
    const astroHtml = await renderAstro({ ...citationsComparePanel, citations: typicalCitations });
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("HTML-significant chars in heading (escape parity on {h3 text})", async () => {
    const fixture = {
      beforeHeading: 'Without RFID & "manual" workflow',
      afterHeading: "With <RAIN UHF> RFID portal",
      before: ["Slow"],
      after: ["Fast"],
    };
    const section = sectionWithVariant("comparePanel", fixture);
    const tsFragment = extractCompare(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(fixture);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });
});
