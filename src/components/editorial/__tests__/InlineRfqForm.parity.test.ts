/**
 * Parity test — InlineRfqForm.astro ↔ renderInlineRfqForm.
 *
 * Stage 2 optimization. The form's HTML is invariant except for:
 *   - definition.title (interpolated into hidden inputs + page text)
 *   - definition.route (interpolated into the seed prefix for field IDs)
 *
 * So fixtures vary `route` and `title` to exercise both.
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import InlineRfqForm from "../InlineRfqForm.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import { minimalDefinition, typicalDefinition } from "../../../lib/__tests__/fixtures/editorial";

async function renderAstro(definition: typeof minimalDefinition): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(InlineRfqForm, { props: { definition } });
}

describe("InlineRfqForm.astro ↔ renderInlineRfqForm parity", () => {
  it("minimal definition", async () => {
    expect(normalizeHtml(await renderAstro(minimalDefinition))).toBe(
      normalizeHtml(__TEST__.renderInlineRfqForm(minimalDefinition)),
    );
  });

  it("typical definition (longer title)", async () => {
    expect(normalizeHtml(await renderAstro(typicalDefinition))).toBe(
      normalizeHtml(__TEST__.renderInlineRfqForm(typicalDefinition)),
    );
  });

  it("definition with HTML-significant chars in title", async () => {
    const def = { ...minimalDefinition, title: 'RFID & NFC — "Hotel Keycards"' };
    expect(normalizeHtml(await renderAstro(def))).toBe(
      normalizeHtml(__TEST__.renderInlineRfqForm(def)),
    );
  });

  it("long route: seed is capped at 32 chars", async () => {
    const def = {
      ...minimalDefinition,
      route: "/products/rfid-cards/very-long-product-name-that-should-be-truncated-by-the-seed-rule/",
    };
    expect(normalizeHtml(await renderAstro(def))).toBe(
      normalizeHtml(__TEST__.renderInlineRfqForm(def)),
    );
  });
});
