/**
 * Parity test — EditorialSection.astro ↔ editorial-pages.ts renderSection().
 *
 * Stage 2 integration. This is the meaningful step: previous parity tests
 * verified each variant in isolation; this test asserts the composer
 * produces the SAME section-level output for every fixture covered by the
 * variant snapshot suite. When all 25 fixtures pass, the composer is
 * proven equivalent to renderSection.
 *
 * Strategy:
 *   - Reuse all variant fixtures from `editorial-pages-variants.snapshot.test.ts`.
 *   - For each, render via __TEST__.renderSection AND
 *     container.renderToString(EditorialSection, { props }).
 *   - Compare normalized outputs.
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import EditorialSection from "../EditorialSection.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import {
  sectionWithVariant,
  noCitations,
  typicalCitations,
  // statBar
  minimalStatBar,
  typicalStatBar,
  // comparePanel
  minimalComparePanel,
  typicalComparePanel,
  citationsComparePanel,
  // featureGrid
  minimalFeatureGrid,
  typicalFeatureGrid,
  // dataHighlight
  minimalDataHighlight,
  typicalDataHighlight,
  // timeline
  minimalTimeline,
  typicalTimeline,
  // testimonial
  minimalTestimonial,
  // checklist
  minimalChecklist,
  typicalChecklist,
  // image / callout
  minimalImage,
  minimalCallout,
  typicalCallout,
  // body slots
  introOnlySection,
  paragraphsSection,
  bulletsPlainSection,
  bulletsWorkflowSection,
  // layout
  splitLayoutSection,
  splitReverseLayoutSection,
  // table
  minimalTable,
} from "../../../lib/__tests__/fixtures/editorial";

const ID = "test-section-id";

async function renderSectionAstro(section: unknown, citations?: { sourcesId: string; sourcesCount: number }): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(EditorialSection, {
    props: { section, id: ID, citations },
  });
}

interface ParityCase {
  label: string;
  section: unknown;
  citations?: { sourcesId: string; sourcesCount: number };
}

const cases: ParityCase[] = [
  // statBar
  { label: "statBar minimal", section: sectionWithVariant("statBar", minimalStatBar) },
  { label: "statBar typical", section: sectionWithVariant("statBar", typicalStatBar) },
  // comparePanel
  { label: "comparePanel minimal", section: sectionWithVariant("comparePanel", minimalComparePanel) },
  { label: "comparePanel typical", section: sectionWithVariant("comparePanel", typicalComparePanel) },
  { label: "comparePanel with citations", section: sectionWithVariant("comparePanel", citationsComparePanel), citations: typicalCitations },
  // featureGrid
  { label: "featureGrid minimal", section: sectionWithVariant("featureGrid", minimalFeatureGrid) },
  { label: "featureGrid typical (5 icon arms)", section: sectionWithVariant("featureGrid", typicalFeatureGrid) },
  // dataHighlight
  { label: "dataHighlight minimal", section: sectionWithVariant("dataHighlight", minimalDataHighlight) },
  { label: "dataHighlight typical", section: sectionWithVariant("dataHighlight", typicalDataHighlight), citations: typicalCitations },
  // timeline
  { label: "timeline minimal", section: sectionWithVariant("timeline", minimalTimeline) },
  { label: "timeline typical", section: sectionWithVariant("timeline", typicalTimeline), citations: typicalCitations },
  // testimonial
  { label: "testimonial minimal", section: sectionWithVariant("testimonial", minimalTestimonial) },
  // checklist
  { label: "checklist minimal", section: sectionWithVariant("checklist", minimalChecklist) },
  { label: "checklist typical", section: sectionWithVariant("checklist", typicalChecklist), citations: typicalCitations },
  // image / callout
  { label: "image minimal", section: sectionWithVariant("image", minimalImage) },
  { label: "callout minimal", section: sectionWithVariant("callout", minimalCallout) },
  { label: "callout typical", section: sectionWithVariant("callout", typicalCallout), citations: typicalCitations },
  // body slots
  { label: "intro only", section: introOnlySection },
  { label: "paragraphs with citation", section: paragraphsSection, citations: typicalCitations },
  { label: "bullets plain", section: bulletsPlainSection },
  { label: "bullets workflow (ordered)", section: bulletsWorkflowSection },
  // layout attributes
  { label: "layout split", section: splitLayoutSection },
  { label: "layout split-reverse", section: splitReverseLayoutSection },
  // table-only
  { label: "table only", section: sectionWithVariant("table", minimalTable) },
];

describe("EditorialSection.astro ↔ renderSection parity (variant snapshot fixtures)", () => {
  it.each(cases)("$label", async ({ section, citations }) => {
    const tsHtml = __TEST__.renderSection(section as never, ID, citations);
    const astroHtml = await renderSectionAstro(section, citations);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsHtml));
  });
});
