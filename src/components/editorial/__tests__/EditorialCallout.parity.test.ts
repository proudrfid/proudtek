/**
 * Parity test — EditorialCallout.astro ↔ editorial-pages.ts inline callout.
 *
 * Stage 2. Exercises optional `href` rendering and the inline-link arrow span.
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import EditorialCallout from "../EditorialCallout.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import {
  sectionWithVariant,
  minimalCallout,
  typicalCallout,
  typicalCitations,
  noCitations,
} from "../../../lib/__tests__/fixtures/editorial";

const ASIDE_RE = /<aside class="codex-editorial-callout">[\s\S]*?<\/aside>/;

function extractCallout(sectionHtml: string): string {
  const match = sectionHtml.match(ASIDE_RE);
  if (!match) throw new Error(`callout fragment not found:\n${sectionHtml}`);
  return match[0];
}

async function renderAstro(props: {
  label: string;
  text: string;
  href?: string;
  citations?: { sourcesId: string; sourcesCount: number };
}): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(EditorialCallout, { props });
}

describe("EditorialCallout.astro ↔ editorial-pages.ts parity", () => {
  it("minimal: no href", async () => {
    const section = sectionWithVariant("callout", minimalCallout);
    const tsFragment = extractCallout(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(minimalCallout);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("typical: with href + inline link + citation marker", async () => {
    const section = sectionWithVariant("callout", typicalCallout);
    const tsFragment = extractCallout(__TEST__.renderSection(section as never, "test-id", typicalCitations));
    const astroHtml = await renderAstro({ ...typicalCallout, citations: typicalCitations });
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("HTML-significant chars in label", async () => {
    const fixture = {
      label: 'Note "important" & visible',
      text: "Plain body copy.",
    };
    const section = sectionWithVariant("callout", fixture);
    const tsFragment = extractCallout(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(fixture);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("href with query string and ampersand (escape parity)", async () => {
    const fixture = {
      label: "Note",
      text: "Body.",
      href: "/products/all/?cluster=rfid-cards&utm=callout",
    };
    const section = sectionWithVariant("callout", fixture);
    const tsFragment = extractCallout(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(fixture);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });
});
