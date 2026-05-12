/**
 * Parity test — EditorialFigure.astro ↔ editorial-pages.ts inline image.
 *
 * Stage 2. Pure attribute-mapping component; no markdown / citation routing.
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import EditorialFigure from "../EditorialFigure.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import {
  sectionWithVariant,
  minimalImage,
  noCitations,
} from "../../../lib/__tests__/fixtures/editorial";

const FIGURE_RE = /<figure class="codex-editorial-figure">[\s\S]*?<\/figure>/;

function extractFigure(sectionHtml: string): string {
  const match = sectionHtml.match(FIGURE_RE);
  if (!match) throw new Error(`figure fragment not found:\n${sectionHtml}`);
  return match[0];
}

async function renderAstro(props: { src: string; alt: string }): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(EditorialFigure, { props });
}

describe("EditorialFigure.astro ↔ editorial-pages.ts parity", () => {
  it("minimal: simple src and alt", async () => {
    const section = sectionWithVariant("image", minimalImage);
    const tsFragment = extractFigure(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(minimalImage);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("HTML-significant chars in alt text", async () => {
    const fixture = {
      src: "/landing-images/heroes/factory.jpg",
      alt: 'RFID inlay reels on a factory floor — "Project Helios" & QA station',
    };
    const section = sectionWithVariant("image", fixture);
    const tsFragment = extractFigure(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(fixture);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("src with query string (escape parity)", async () => {
    const fixture = {
      src: "/_image?path=/heroes/factory.jpg&w=1200&format=webp",
      alt: "Factory hero",
    };
    const section = sectionWithVariant("image", fixture);
    const tsFragment = extractFigure(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(fixture);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });
});
