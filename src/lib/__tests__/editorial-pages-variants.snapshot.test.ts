/**
 * Snapshot tests for EditorialSection.astro — the 11 section variants.
 *
 * Post-cutover (2026-05-12). Replaces the legacy `__TEST__.renderSection`-based
 * snapshot tests. EditorialSection.astro is now the single render path for
 * every variant (statBar, comparePanel, featureGrid, dataHighlight, timeline,
 * testimonial, checklist, callout, image, body slots, table). This file
 * locks each variant's shadow-tree HTML output byte-for-byte so any future
 * refactor or dependency upgrade surfaces as a snapshot diff.
 *
 * Each variant pairs:
 *   - minimal — smallest valid input
 *   - typical — realistic production input
 *   - with-citations — exercises renderInlineLinks `[^N]` rewrite path
 *     (only for variants whose text fields route through it)
 *
 * Branch coverage explicitly targeted:
 *   - featureGrid icon path-vs-glyph
 *   - dataHighlight with/without `source`
 *   - comparePanel custom vs default headings
 *   - bullets workflow-vs-plain (ordered-list switch via isWorkflowSection)
 *   - section layout=split / split-reverse data-attribute emission
 */
import { describe, it, expect, beforeAll } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

import EditorialSection from "../../components/editorial/EditorialSection.astro";
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

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

/** Render an EditorialSection via Astro Container and return the HTML. */
async function renderSec(section: unknown, citations = noCitations): Promise<string> {
  return container.renderToString(EditorialSection, {
    props: { section, id: ID, citations },
  });
}

// ---------------------------------------------------------------------------
// Extended section variants
// ---------------------------------------------------------------------------

describe("EditorialSection — statBar", () => {
  it("minimal: 1 item", async () => {
    expect(await renderSec(sectionWithVariant("statBar", minimalStatBar))).toMatchSnapshot();
  });

  it("typical: 3 items", async () => {
    expect(await renderSec(sectionWithVariant("statBar", typicalStatBar))).toMatchSnapshot();
  });
});

describe("EditorialSection — comparePanel", () => {
  it("minimal: default headings", async () => {
    expect(await renderSec(sectionWithVariant("comparePanel", minimalComparePanel))).toMatchSnapshot();
  });

  it("typical: custom headings + inline link", async () => {
    expect(await renderSec(sectionWithVariant("comparePanel", typicalComparePanel))).toMatchSnapshot();
  });

  it("with citations: [^N] markers rewrite into sup", async () => {
    expect(await renderSec(sectionWithVariant("comparePanel", citationsComparePanel), typicalCitations)).toMatchSnapshot();
  });
});

describe("EditorialSection — featureGrid", () => {
  it("minimal: 1 glyph icon", async () => {
    expect(await renderSec(sectionWithVariant("featureGrid", minimalFeatureGrid))).toMatchSnapshot();
  });

  it("typical: mixed icons (glyph + abs path + https + data:image/)", async () => {
    expect(await renderSec(sectionWithVariant("featureGrid", typicalFeatureGrid))).toMatchSnapshot();
  });

  it("typical with citations", async () => {
    const featuresWithCitations = {
      features: typicalFeatureGrid.features.map((f, i) =>
        i === 0 ? { ...f, text: `${f.text} See [^1].` } : f,
      ),
    };
    expect(await renderSec(sectionWithVariant("featureGrid", featuresWithCitations), typicalCitations)).toMatchSnapshot();
  });
});

describe("EditorialSection — dataHighlight", () => {
  it("minimal: no source", async () => {
    expect(await renderSec(sectionWithVariant("dataHighlight", minimalDataHighlight))).toMatchSnapshot();
  });

  it("typical: with source + citation marker", async () => {
    expect(await renderSec(sectionWithVariant("dataHighlight", typicalDataHighlight), typicalCitations)).toMatchSnapshot();
  });
});

describe("EditorialSection — timeline", () => {
  it("minimal: 1 step", async () => {
    expect(await renderSec(sectionWithVariant("timeline", minimalTimeline))).toMatchSnapshot();
  });

  it("typical: 3 steps + citation + inline link", async () => {
    expect(await renderSec(sectionWithVariant("timeline", typicalTimeline), typicalCitations)).toMatchSnapshot();
  });
});

describe("EditorialSection — testimonial", () => {
  it("minimal: text + source", async () => {
    expect(await renderSec(sectionWithVariant("testimonial", minimalTestimonial))).toMatchSnapshot();
  });
});

describe("EditorialSection — checklist", () => {
  it("minimal: 1 item", async () => {
    expect(await renderSec(sectionWithVariant("checklist", minimalChecklist))).toMatchSnapshot();
  });

  it("typical: link + citation marker", async () => {
    expect(await renderSec(sectionWithVariant("checklist", typicalChecklist), typicalCitations)).toMatchSnapshot();
  });
});

// ---------------------------------------------------------------------------
// Basic section slots (image / callout / body / layout / table)
// ---------------------------------------------------------------------------

describe("EditorialSection — image", () => {
  it("minimal: src + alt", async () => {
    expect(await renderSec(sectionWithVariant("image", minimalImage))).toMatchSnapshot();
  });
});

describe("EditorialSection — callout", () => {
  it("minimal: no href", async () => {
    expect(await renderSec(sectionWithVariant("callout", minimalCallout))).toMatchSnapshot();
  });

  it("typical: with href, inline link, citation", async () => {
    expect(await renderSec(sectionWithVariant("callout", typicalCallout), typicalCitations)).toMatchSnapshot();
  });
});

describe("EditorialSection — body slots (intro/paragraphs/bullets)", () => {
  it("intro only", async () => {
    expect(await renderSec(introOnlySection)).toMatchSnapshot();
  });

  it("paragraphs with link + citation", async () => {
    expect(await renderSec(paragraphsSection, typicalCitations)).toMatchSnapshot();
  });

  it("bullets — plain (unordered list)", async () => {
    expect(await renderSec(bulletsPlainSection)).toMatchSnapshot();
  });

  it("bullets — workflow title (ordered list with step-list class)", async () => {
    expect(await renderSec(bulletsWorkflowSection)).toMatchSnapshot();
  });
});

describe("EditorialSection — layout attribute", () => {
  it("split", async () => {
    expect(await renderSec(splitLayoutSection)).toMatchSnapshot();
  });

  it("split-reverse", async () => {
    expect(await renderSec(splitReverseLayoutSection)).toMatchSnapshot();
  });
});

describe("EditorialSection — table-only", () => {
  it("table inside section", async () => {
    expect(await renderSec(sectionWithVariant("table", minimalTable))).toMatchSnapshot();
  });
});
