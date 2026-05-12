/**
 * Parity test — DataHighlight.astro ↔ editorial-pages.ts inline dataHighlight.
 *
 * Stage 2 (path-3 prep). See ./Testimonial.parity.test.ts for parity strategy.
 *
 * Exercises:
 *   - conditional source rendering (`{source && ...}`)
 *   - aria-label attribute binding from a dynamic prop (auto-escape parity)
 *   - the renderInlineLinks pathway with both inline markdown and citation
 *     markers in the text body
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import DataHighlight from "../DataHighlight.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import {
  sectionWithVariant,
  minimalDataHighlight,
  typicalDataHighlight,
  typicalCitations,
  noCitations,
} from "../../../lib/__tests__/fixtures/editorial";

const ASIDE_RE = /<aside class="codex-editorial-data-highlight"[\s\S]*?<\/aside>/;

function extractDataHighlight(sectionHtml: string): string {
  const match = sectionHtml.match(ASIDE_RE);
  if (!match) throw new Error(`dataHighlight fragment not found in section HTML:\n${sectionHtml}`);
  return match[0];
}

async function renderAstro(props: {
  value: string;
  heading: string;
  text: string;
  source?: string;
  citations?: { sourcesId: string; sourcesCount: number };
}): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(DataHighlight, { props });
}

describe("DataHighlight.astro ↔ editorial-pages.ts parity", () => {
  it("minimal fixture (no source)", async () => {
    const section = sectionWithVariant("dataHighlight", minimalDataHighlight);
    const tsFragment = extractDataHighlight(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro({ ...minimalDataHighlight });
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("typical fixture (with source + citation marker)", async () => {
    const section = sectionWithVariant("dataHighlight", typicalDataHighlight);
    const tsFragment = extractDataHighlight(__TEST__.renderSection(section as never, "test-id", typicalCitations));
    const astroHtml = await renderAstro({ ...typicalDataHighlight, citations: typicalCitations });
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("heading with HTML-significant chars (escape parity on aria-label)", async () => {
    const fixture = {
      value: "30 m",
      heading: 'Read range — "fixed UHF" & portals',
      text: "Verified across multiple [pilots](/case-studies/).",
      source: "GS1 EPC HF/UHF reference",
    };
    const section = sectionWithVariant("dataHighlight", fixture);
    const tsFragment = extractDataHighlight(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(fixture);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("source with HTML-significant chars (auto-escape on cite text)", async () => {
    const fixture = {
      value: "$1.4M",
      heading: "Annual COGS savings",
      text: "Post-deployment Year-2 figures.",
      source: 'Internal study, "Project Helios" & follow-up',
    };
    const section = sectionWithVariant("dataHighlight", fixture);
    const tsFragment = extractDataHighlight(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(fixture);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });
});
