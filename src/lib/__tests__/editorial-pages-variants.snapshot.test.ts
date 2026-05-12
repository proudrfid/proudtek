/**
 * Snapshot tests for renderSection() — the 11 section variants.
 *
 * Path-3 prep (Stage 0). See docs/architecture/editorial-rendering-debt.md.
 *
 * renderSection() inlines the rendering logic for each section "variant"
 * (statBar, comparePanel, featureGrid, dataHighlight, timeline, testimonial,
 * checklist, callout, image, body slots, table) via template literals. This
 * file locks each variant's HTML output byte-for-byte so any future refactor
 * — physical file split, .astro componentization (path 3), or accidental
 * drift from dependency upgrades — surfaces as a snapshot diff.
 *
 * We test through renderSection() (the public surface in __TEST__) rather
 * than calling each variant's inline expression directly. This keeps the
 * tests black-box: they capture what production actually renders, including
 * the outer `<section>` wrapper, slot ordering, and empty-slot-collapse
 * behavior. The trade-off is each snapshot includes some constant boilerplate;
 * that's acceptable because the locked behavior is "production output for
 * this input", not "the inline expression in isolation".
 *
 * Each variant pairs:
 *   - minimal — smallest valid input
 *   - typical — realistic production input
 *   - with-citations — exercises renderInlineLinks `[^N]` rewrite path
 *     (only for variants whose text fields route through it)
 *
 * Branch coverage explicitly targeted:
 *   - featureGrid icon path-vs-glyph (renderSection lines ~2147-2156)
 *   - dataHighlight with/without `source`
 *   - comparePanel custom vs default headings
 *   - bullets workflow-vs-plain (renderSectionList ordered-list switch)
 *   - section layout=split / split-reverse data-attribute emission
 */
import { describe, it, expect } from "vitest";

import { __TEST__ } from "../editorial-pages";
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
} from "./fixtures/editorial";

const ID = "test-section-id";

// ---------------------------------------------------------------------------
// Extended section variants
// ---------------------------------------------------------------------------

describe("renderSection — statBar", () => {
  it("minimal: 1 item", () => {
    const section = sectionWithVariant("statBar", minimalStatBar);
    expect(__TEST__.renderSection(section as never, ID, noCitations)).toMatchSnapshot();
  });

  it("typical: 3 items", () => {
    const section = sectionWithVariant("statBar", typicalStatBar);
    expect(__TEST__.renderSection(section as never, ID, noCitations)).toMatchSnapshot();
  });
});

describe("renderSection — comparePanel", () => {
  it("minimal: default headings", () => {
    const section = sectionWithVariant("comparePanel", minimalComparePanel);
    expect(__TEST__.renderSection(section as never, ID, noCitations)).toMatchSnapshot();
  });

  it("typical: custom headings + inline link", () => {
    const section = sectionWithVariant("comparePanel", typicalComparePanel);
    expect(__TEST__.renderSection(section as never, ID, noCitations)).toMatchSnapshot();
  });

  it("with citations: [^N] markers rewrite into sup", () => {
    const section = sectionWithVariant("comparePanel", citationsComparePanel);
    expect(__TEST__.renderSection(section as never, ID, typicalCitations)).toMatchSnapshot();
  });
});

describe("renderSection — featureGrid", () => {
  it("minimal: 1 glyph icon", () => {
    const section = sectionWithVariant("featureGrid", minimalFeatureGrid);
    expect(__TEST__.renderSection(section as never, ID, noCitations)).toMatchSnapshot();
  });

  it("typical: mixed icons (glyph + abs path + https + data:image/)", () => {
    // Branch coverage: lines ~2147-2156 of editorial-pages.ts.
    // Each icon kind hits a different arm of the isPath check.
    const section = sectionWithVariant("featureGrid", typicalFeatureGrid);
    expect(__TEST__.renderSection(section as never, ID, noCitations)).toMatchSnapshot();
  });

  it("typical with citations", () => {
    // Feature text routes through renderInlineLinks(feature.text, citations).
    // The typical fixture already contains an inline markdown link; this case
    // adds the citation rewrite path on top of it.
    const featuresWithCitations = {
      features: typicalFeatureGrid.features.map((f, i) =>
        i === 0 ? { ...f, text: `${f.text} See [^1].` } : f,
      ),
    };
    const section = sectionWithVariant("featureGrid", featuresWithCitations);
    expect(__TEST__.renderSection(section as never, ID, typicalCitations)).toMatchSnapshot();
  });
});

describe("renderSection — dataHighlight", () => {
  it("minimal: no source", () => {
    const section = sectionWithVariant("dataHighlight", minimalDataHighlight);
    expect(__TEST__.renderSection(section as never, ID, noCitations)).toMatchSnapshot();
  });

  it("typical: with source + citation marker", () => {
    const section = sectionWithVariant("dataHighlight", typicalDataHighlight);
    expect(__TEST__.renderSection(section as never, ID, typicalCitations)).toMatchSnapshot();
  });
});

describe("renderSection — timeline", () => {
  it("minimal: 1 step", () => {
    const section = sectionWithVariant("timeline", minimalTimeline);
    expect(__TEST__.renderSection(section as never, ID, noCitations)).toMatchSnapshot();
  });

  it("typical: 3 steps + citation + inline link", () => {
    const section = sectionWithVariant("timeline", typicalTimeline);
    expect(__TEST__.renderSection(section as never, ID, typicalCitations)).toMatchSnapshot();
  });
});

describe("renderSection — testimonial", () => {
  it("minimal: text + source", () => {
    const section = sectionWithVariant("testimonial", minimalTestimonial);
    expect(__TEST__.renderSection(section as never, ID, noCitations)).toMatchSnapshot();
  });
});

describe("renderSection — checklist", () => {
  it("minimal: 1 item", () => {
    const section = sectionWithVariant("checklist", minimalChecklist);
    expect(__TEST__.renderSection(section as never, ID, noCitations)).toMatchSnapshot();
  });

  it("typical: link + citation marker", () => {
    const section = sectionWithVariant("checklist", typicalChecklist);
    expect(__TEST__.renderSection(section as never, ID, typicalCitations)).toMatchSnapshot();
  });
});

// ---------------------------------------------------------------------------
// Basic section slots (image / callout / body / layout / table)
// ---------------------------------------------------------------------------

describe("renderSection — image", () => {
  it("minimal: src + alt", () => {
    const section = sectionWithVariant("image", minimalImage);
    expect(__TEST__.renderSection(section as never, ID, noCitations)).toMatchSnapshot();
  });
});

describe("renderSection — callout", () => {
  it("minimal: no href", () => {
    const section = sectionWithVariant("callout", minimalCallout);
    expect(__TEST__.renderSection(section as never, ID, noCitations)).toMatchSnapshot();
  });

  it("typical: with href, inline link, citation", () => {
    const section = sectionWithVariant("callout", typicalCallout);
    expect(__TEST__.renderSection(section as never, ID, typicalCitations)).toMatchSnapshot();
  });
});

describe("renderSection — body slots (intro/paragraphs/bullets)", () => {
  it("intro only", () => {
    expect(__TEST__.renderSection(introOnlySection as never, ID, noCitations)).toMatchSnapshot();
  });

  it("paragraphs with link + citation", () => {
    expect(__TEST__.renderSection(paragraphsSection as never, ID, typicalCitations)).toMatchSnapshot();
  });

  it("bullets — plain (unordered list)", () => {
    expect(__TEST__.renderSection(bulletsPlainSection as never, ID, noCitations)).toMatchSnapshot();
  });

  it("bullets — workflow title (ordered list with step-list class)", () => {
    // isWorkflowSection() switches renderSectionList from ul → ol.codex-editorial-step-list
    expect(__TEST__.renderSection(bulletsWorkflowSection as never, ID, noCitations)).toMatchSnapshot();
  });
});

describe("renderSection — layout attribute", () => {
  it("split", () => {
    expect(__TEST__.renderSection(splitLayoutSection as never, ID, noCitations)).toMatchSnapshot();
  });

  it("split-reverse", () => {
    expect(__TEST__.renderSection(splitReverseLayoutSection as never, ID, noCitations)).toMatchSnapshot();
  });
});

describe("renderSection — table-only", () => {
  // renderTable is already covered standalone by the leaf snapshot file;
  // this case locks the wrapping behavior when a section carries only a table.
  it("table inside section", () => {
    const section = sectionWithVariant("table", minimalTable);
    expect(__TEST__.renderSection(section as never, ID, noCitations)).toMatchSnapshot();
  });
});
