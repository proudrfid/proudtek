/**
 * Parity tests for Sources / Brief / BriefField / ActionBar shadow components.
 *
 * Stage 2. These wrap medium-complexity TS renderers — date formatting,
 * read-time math, intent-tagged hrefs — into one parity test file.
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Sources from "../Sources.astro";
import Brief from "../Brief.astro";
import BriefField from "../BriefField.astro";
import ActionBar from "../ActionBar.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import { minimalBriefFields, minimalDefinition, typicalDefinition } from "../../../lib/__tests__/fixtures/editorial";

async function renderSources(definition: typeof minimalDefinition, id: string): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(Sources, { props: { sources: definition.sources ?? [], id } });
}
async function renderBrief(fields: typeof minimalBriefFields, id: string): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(Brief, { props: { fields, id } });
}
async function renderBriefField(field: typeof minimalBriefFields[number]): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(BriefField, { props: { field } });
}
async function renderActionBar(definition: typeof minimalDefinition, id: string): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(ActionBar, { props: {
    group: definition.group,
    title: definition.title,
    route: definition.route,
    primaryAction: definition.primaryAction,
    secondaryActions: definition.secondaryActions,
    id,
  } });
}

// --- Sources ----------------------------------------------------------------

describe("Sources.astro ↔ renderSources parity", () => {
  it("empty: both render nothing", async () => {
    const def = { ...minimalDefinition, sources: [] };
    expect(normalizeHtml(await renderSources(def, "sources"))).toBe("");
    expect(normalizeHtml(__TEST__.renderSources(def, "sources"))).toBe("");
  });

  it("typical: 2 sources with full metadata", async () => {
    const def = {
      ...minimalDefinition,
      sources: [
        {
          label: "ISO/IEC 14443-3 Type A — collision arbitration",
          url: "https://www.iso.org/standard/70171.html",
          publisher: "ISO",
          publishedAt: "2018-07-15",
          accessedAt: "2026-05-01",
        },
        {
          label: "NTAG215 product short data sheet",
          url: "https://www.nxp.com/docs/en/data-sheet/NTAG215_216.pdf",
          publishedAt: "2024",
          accessedAt: "2026-04-30",
          note: 'Variant note with "quotes" & special chars.',
        },
      ],
    };
    const tsHtml = __TEST__.renderSources(def, "sources");
    const astroHtml = await renderSources(def, "sources");
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsHtml));
  });

  it("source with no publisher (falls back to displayHost)", async () => {
    const def = {
      ...minimalDefinition,
      sources: [{
        label: "FCC Part 15 Subpart C",
        url: "https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15",
      }],
    };
    expect(normalizeHtml(await renderSources(def, "sources"))).toBe(
      normalizeHtml(__TEST__.renderSources(def, "sources")),
    );
  });
});

// --- BriefField / Brief ----------------------------------------------------

describe("BriefField.astro ↔ renderBriefField parity", () => {
  it.each(minimalBriefFields)("field [$label]", async (field) => {
    expect(normalizeHtml(await renderBriefField(field))).toBe(
      normalizeHtml(__TEST__.renderBriefField(field)),
    );
  });

  it("HTML-significant chars in text / items / link label", async () => {
    const field = {
      label: 'Chip & "compatibility"',
      text: "Tom & Co. recommends NTAG215 for >80% of NFC use cases.",
      items: ["NTAG <215>", "ISO 14443-3 Type A"],
      links: [{ href: "/products/?cat=nfc&type=sticker", label: 'NFC "stickers"' }],
    };
    expect(normalizeHtml(await renderBriefField(field))).toBe(
      normalizeHtml(__TEST__.renderBriefField(field)),
    );
  });
});

describe("Brief.astro ↔ renderBrief parity", () => {
  it("minimal: 3 fields", async () => {
    expect(normalizeHtml(await renderBrief(minimalBriefFields, "brief"))).toBe(
      normalizeHtml(__TEST__.renderBrief(minimalBriefFields, "brief")),
    );
  });

  it("single field (singular 'field' label)", async () => {
    const oneField = [minimalBriefFields[0]];
    expect(normalizeHtml(await renderBrief(oneField, "brief"))).toBe(
      normalizeHtml(__TEST__.renderBrief(oneField, "brief")),
    );
  });
});

// --- ActionBar -------------------------------------------------------------

describe("ActionBar.astro ↔ renderActionBar parity", () => {
  it("non-contact group: standard heading + intent-tagged href", async () => {
    expect(normalizeHtml(await renderActionBar(minimalDefinition, "next-step"))).toBe(
      normalizeHtml(__TEST__.renderActionBar(minimalDefinition, "next-step")),
    );
  });

  it("typical definition with secondary actions", async () => {
    const def = {
      ...typicalDefinition,
      secondaryActions: [
        { href: "/products/all/", label: "Browse all products" },
        { href: "/guides/", label: "Buying guides" },
      ],
    };
    expect(normalizeHtml(await renderActionBar(def, "next-step"))).toBe(
      normalizeHtml(__TEST__.renderActionBar(def, "next-step")),
    );
  });

  it("contact group: alternate heading + description", async () => {
    const def = { ...minimalDefinition, group: "contact" as const };
    expect(normalizeHtml(await renderActionBar(def, "next-step"))).toBe(
      normalizeHtml(__TEST__.renderActionBar(def, "next-step")),
    );
  });

  it("primaryAction with existing query string (intent preservation)", async () => {
    const def = {
      ...minimalDefinition,
      primaryAction: { href: "/contact/?source=footer", label: "Contact us" },
    };
    expect(normalizeHtml(await renderActionBar(def, "next-step"))).toBe(
      normalizeHtml(__TEST__.renderActionBar(def, "next-step")),
    );
  });
});
