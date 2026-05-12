/**
 * Parity tests for DecisionSnapshot.astro ↔ renderDecisionSnapshot and
 * Trail.astro ↔ renderTrail.
 *
 * Stage 2.
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import DecisionSnapshot from "../DecisionSnapshot.astro";
import Trail from "../Trail.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml, rewriteLegacyContactLinks } from "./_parity-helpers";
import { minimalDefinition, typicalDefinition } from "../../../lib/__tests__/fixtures/editorial";
import { resolveArticleInquiryAction } from "../../../lib/seo/normalize-body";

function applyContactRewrite(html: string, def: typeof minimalDefinition): string {
  const routed = resolveArticleInquiryAction(def.route, def.title).href;
  return rewriteLegacyContactLinks(html, routed);
}

async function renderSnapshot(definition: typeof minimalDefinition, id: string): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(DecisionSnapshot, { props: { definition, id } });
}
async function renderTrail(definition: typeof minimalDefinition): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(Trail, { props: { definition } });
}

describe("DecisionSnapshot.astro ↔ renderDecisionSnapshot parity", () => {
  it("blog group (default builder): falls back to heroPoints[0]", async () => {
    expect(normalizeHtml(await renderSnapshot(minimalDefinition, "at-a-glance"))).toBe(
      normalizeHtml(applyContactRewrite(
        __TEST__.renderDecisionSnapshot(minimalDefinition, "at-a-glance"),
        minimalDefinition,
      )),
    );
  });

  it("typical definition with brief fields", async () => {
    expect(normalizeHtml(await renderSnapshot(typicalDefinition, "at-a-glance"))).toBe(
      normalizeHtml(applyContactRewrite(
        __TEST__.renderDecisionSnapshot(typicalDefinition, "at-a-glance"),
        typicalDefinition,
      )),
    );
  });

  it("compare group: uses comparison-specific card builder", async () => {
    const def = {
      ...typicalDefinition,
      group: "compare" as const,
      sections: [
        {
          title: "Decision table",
          table: {
            columns: ["Option", "Range", "Cost"],
            rows: [["NTAG215", "~5 cm", "$0.18"], ["UHF inlay", "10 m", "$0.05"]],
          },
        },
        { title: "What decides the choice", intro: "Read range vs. cost trade-off." },
        { title: "How to confirm", intro: "Get a free sample of each." },
      ],
    };
    expect(normalizeHtml(await renderSnapshot(def, "at-a-glance"))).toBe(
      normalizeHtml(applyContactRewrite(
        __TEST__.renderDecisionSnapshot(def, "at-a-glance"),
        def,
      )),
    );
  });

  it("4-field brief: extra fields surface as supplementary dl below cards", async () => {
    const def = {
      ...typicalDefinition,
      brief: [
        ...(typicalDefinition.brief ?? []),
        { label: "Lead time", text: "10-14 business days for stock SKUs." },
        { label: "Compliance", items: ["RoHS", "REACH", "FCC Part 15"] },
      ],
    };
    expect(normalizeHtml(await renderSnapshot(def, "at-a-glance"))).toBe(
      normalizeHtml(applyContactRewrite(
        __TEST__.renderDecisionSnapshot(def, "at-a-glance"),
        def,
      )),
    );
  });
});

describe("Trail.astro ↔ renderTrail parity", () => {
  it("blog route: Resources / Blog / Page", async () => {
    expect(normalizeHtml(await renderTrail(minimalDefinition))).toBe(
      normalizeHtml(__TEST__.renderTrail(minimalDefinition)),
    );
  });

  it("industries route", async () => {
    const def = { ...minimalDefinition, route: "/industries/luxury-brands/", title: "Luxury Brands" };
    expect(normalizeHtml(await renderTrail(def))).toBe(
      normalizeHtml(__TEST__.renderTrail(def)),
    );
  });

  it("compare route", async () => {
    const def = { ...minimalDefinition, group: "compare" as const, route: "/compare/x-vs-y/" };
    expect(normalizeHtml(await renderTrail(def))).toBe(
      normalizeHtml(__TEST__.renderTrail(def)),
    );
  });

  it("solutions route", async () => {
    const def = { ...minimalDefinition, group: "solutions" as const, route: "/solutions/hotel-key-cards/" };
    expect(normalizeHtml(await renderTrail(def))).toBe(
      normalizeHtml(__TEST__.renderTrail(def)),
    );
  });

  it("section root (no third crumb)", async () => {
    const def = { ...minimalDefinition, group: "solutions" as const, route: "/solutions/" };
    expect(normalizeHtml(await renderTrail(def))).toBe(
      normalizeHtml(__TEST__.renderTrail(def)),
    );
  });

  it("long title: gets shortened by split + 60-char cap", async () => {
    const def = {
      ...minimalDefinition,
      title: "RFID Access Control — HID Seos / DESFire EV3 / OSDP v2.2 / UL 294 / NIST SP 800-116 PACS",
    };
    expect(normalizeHtml(await renderTrail(def))).toBe(
      normalizeHtml(__TEST__.renderTrail(def)),
    );
  });

  it("title with HTML-significant chars in current-page crumb", async () => {
    const def = { ...minimalDefinition, title: 'Tom & Co. — "RFID solutions"' };
    expect(normalizeHtml(await renderTrail(def))).toBe(
      normalizeHtml(__TEST__.renderTrail(def)),
    );
  });
});
