/**
 * Parity test — FeatureGrid.astro ↔ editorial-pages.ts inline featureGrid.
 *
 * Stage 2. The hardest variant so far:
 *   - delegates icon rendering to FeatureIcon.astro (sub-component)
 *   - FeatureIcon branches on the icon string shape (path vs glyph) —
 *     this is the EXACT class-of-bug that produced today's `__title`
 *     selector miss; the parity test must hit all 5 icon arms.
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import FeatureGrid from "../FeatureGrid.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import {
  sectionWithVariant,
  minimalFeatureGrid,
  typicalFeatureGrid,
  typicalCitations,
  noCitations,
} from "../../../lib/__tests__/fixtures/editorial";

const DIV_RE = /<div class="codex-editorial-feature-grid">[\s\S]*?<\/div>(?=\s*<|\s*$)/;

function extractFeatureGrid(sectionHtml: string): string {
  const match = sectionHtml.match(DIV_RE);
  if (!match) throw new Error(`featureGrid fragment not found:\n${sectionHtml}`);
  return match[0];
}

async function renderAstro(features: Array<{ icon: string; title: string; text: string }>, citations?: { sourcesId: string; sourcesCount: number }): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(FeatureGrid, { props: { features, citations } });
}

describe("FeatureGrid.astro ↔ editorial-pages.ts parity", () => {
  it("minimal: 1 glyph icon", async () => {
    const section = sectionWithVariant("featureGrid", minimalFeatureGrid);
    const tsFragment = extractFeatureGrid(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(minimalFeatureGrid.features);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("typical: 4 features covering all 5 icon arms (glyph, /abs, https, http, data:image/)", async () => {
    // Hits every branch of FeatureIcon.astro's isPath check.
    const section = sectionWithVariant("featureGrid", typicalFeatureGrid);
    const tsFragment = extractFeatureGrid(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(typicalFeatureGrid.features);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("with citations on feature text", async () => {
    const features = typicalFeatureGrid.features.map((f, i) =>
      i === 0 ? { ...f, text: `${f.text} See [^1].` } : f,
    );
    const section = sectionWithVariant("featureGrid", { features });
    const tsFragment = extractFeatureGrid(__TEST__.renderSection(section as never, "test-id", typicalCitations));
    const astroHtml = await renderAstro(features, typicalCitations);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("HTML-significant chars in title (escape parity)", async () => {
    const features = [
      { icon: "🎟️", title: 'Event credentials & "QR" pass', text: "Body." },
      { icon: "/icons/x.svg", title: "Asset <tags>", text: "Body." },
    ];
    const section = sectionWithVariant("featureGrid", { features });
    const tsFragment = extractFeatureGrid(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstro(features);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });
});
