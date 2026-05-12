/**
 * Parity test — Testimonial.astro ↔ editorial-pages.ts inline testimonial.
 *
 * Stage 2 (path-3 prep). The shadow .astro component must produce the same
 * HTML as the corresponding inline expression in `renderSection()` for every
 * fixture in the variant snapshot suite. When all 11 variants are parity-
 * verified, Stage 3 can cut over by either:
 *   (a) renderSection() internally delegating to `container.renderToString(...)`
 *       once Astro Container API reaches GA, OR
 *   (b) per-route flag flip from `<Fragment set:html={...}>` to a structured
 *       `<EditorialArticle definition={...} />` component tree.
 *
 * Parity strategy:
 *   - The TS side is hit through the existing `__TEST__.renderSection()` with
 *     a section fixture where ONLY `testimonial` is populated. We extract the
 *     `<figure class="codex-editorial-testimonial">…</figure>` fragment from
 *     the full section HTML so we're comparing apples to apples with the
 *     Astro component which renders only that fragment.
 *   - The Astro side is rendered via experimental_AstroContainer.
 *   - Both sides go through `normalizeHtml()` (see ./_parity-helpers.ts) which
 *     strips Astro's dev-only `data-astro-source-*` attributes and collapses
 *     interior whitespace runs. Neither transformation hides a real diff:
 *     the source attrs don't exist in production builds, and whitespace
 *     between tags is HTML-irrelevant.
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Testimonial from "../Testimonial.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import {
  sectionWithVariant,
  minimalTestimonial,
  typicalCitations,
  noCitations,
} from "../../../lib/__tests__/fixtures/editorial";

const FIGURE_RE = /<figure class="codex-editorial-testimonial">[\s\S]*?<\/figure>/;

function extractTestimonial(sectionHtml: string): string {
  const match = sectionHtml.match(FIGURE_RE);
  if (!match) throw new Error(`testimonial fragment not found in section HTML:\n${sectionHtml}`);
  return match[0];
}

async function renderAstroTestimonial(props: {
  text: string;
  source: string;
  citations?: { sourcesId: string; sourcesCount: number };
}): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(Testimonial, { props });
}

describe("Testimonial.astro ↔ editorial-pages.ts parity", () => {
  it("minimal fixture, no citations", async () => {
    const section = sectionWithVariant("testimonial", minimalTestimonial);
    const tsFragment = extractTestimonial(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstroTestimonial({
      text: minimalTestimonial.text,
      source: minimalTestimonial.source,
    });
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("with inline markdown link in text", async () => {
    const fixture = {
      text: "Cut receiving time by 40% — see [details](/case-studies/dc-1/).",
      source: "Operations Director, retail DC",
    };
    const section = sectionWithVariant("testimonial", fixture);
    const tsFragment = extractTestimonial(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstroTestimonial(fixture);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("with citation marker", async () => {
    const fixture = {
      text: "Read rates exceeded 99% across all pilots [^1].",
      source: "VP of Operations, Logistics Co.",
    };
    const section = sectionWithVariant("testimonial", fixture);
    const tsFragment = extractTestimonial(__TEST__.renderSection(section as never, "test-id", typicalCitations));
    const astroHtml = await renderAstroTestimonial({ ...fixture, citations: typicalCitations });
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });

  it("with HTML-significant chars in source (auto-escaped on both sides)", async () => {
    const fixture = {
      text: "Plain text.",
      source: 'CTO "Tom" & Co. <consulting>',
    };
    const section = sectionWithVariant("testimonial", fixture);
    const tsFragment = extractTestimonial(__TEST__.renderSection(section as never, "test-id", noCitations));
    const astroHtml = await renderAstroTestimonial(fixture);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsFragment));
  });
});
