/**
 * Parity tests for ResourceCard / ResourceGrid / Faq shadow components.
 *
 * Stage 2. These mirror the existing leaf-snapshot tests; the parity test
 * here asserts the same output through the .astro path.
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import ResourceCard from "../ResourceCard.astro";
import ResourceGrid from "../ResourceGrid.astro";
import Faq from "../Faq.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import {
  minimalResourceCard,
  fullResourceCard,
  minimalResourceCards,
  fullResourceCards,
  minimalFaq,
  typicalFaq,
} from "../../../lib/__tests__/fixtures/editorial";

async function renderCard(card: typeof minimalResourceCard): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(ResourceCard, { props: { card } });
}
async function renderGrid(cards: typeof minimalResourceCards, id: string): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(ResourceGrid, { props: { cards, id } });
}
async function renderFaq(faq: typeof minimalFaq, id: string): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(Faq, { props: { faq, id } });
}

describe("ResourceCard.astro ↔ renderResourceCard parity", () => {
  it("minimal: 1 link without description", async () => {
    expect(normalizeHtml(await renderCard(minimalResourceCard))).toBe(
      normalizeHtml(__TEST__.renderResourceCard(minimalResourceCard)),
    );
  });

  it("full: 2 links, second with description", async () => {
    expect(normalizeHtml(await renderCard(fullResourceCard))).toBe(
      normalizeHtml(__TEST__.renderResourceCard(fullResourceCard)),
    );
  });

  it("HTML-significant chars in title and link label", async () => {
    const card = {
      title: 'NFC & RFID — "comparison" cards',
      description: 'Tom <Co.> says: pick this category for >80% of indoor use cases.',
      links: [{ href: "/products/all/?cat=nfc&type=sticker", label: 'NFC "stickers"' }],
    };
    expect(normalizeHtml(await renderCard(card))).toBe(
      normalizeHtml(__TEST__.renderResourceCard(card)),
    );
  });
});

describe("ResourceGrid.astro ↔ renderResourceGrid parity", () => {
  it("minimal: 1 card", async () => {
    expect(normalizeHtml(await renderGrid(minimalResourceCards, "test-resources"))).toBe(
      normalizeHtml(__TEST__.renderResourceGrid(minimalResourceCards, "test-resources")),
    );
  });

  it("full: 2 cards with mixed link counts", async () => {
    expect(normalizeHtml(await renderGrid(fullResourceCards, "full-resources"))).toBe(
      normalizeHtml(__TEST__.renderResourceGrid(fullResourceCards, "full-resources")),
    );
  });
});

describe("Faq.astro ↔ renderFaq parity", () => {
  it("single FAQ entry", async () => {
    expect(normalizeHtml(await renderFaq(minimalFaq, "test-faq"))).toBe(
      normalizeHtml(__TEST__.renderFaq(minimalFaq, "test-faq")),
    );
  });

  it("3 FAQ entries", async () => {
    expect(normalizeHtml(await renderFaq(typicalFaq, "typical-faq"))).toBe(
      normalizeHtml(__TEST__.renderFaq(typicalFaq, "typical-faq")),
    );
  });

  it("HTML-significant chars in question and answer", async () => {
    const faq = [{
      question: 'Are "Walmart" & Target RFID specs interchangeable?',
      answer: "Mostly yes; differences are in <placement> and EDI.",
    }];
    expect(normalizeHtml(await renderFaq(faq, "test-faq"))).toBe(
      normalizeHtml(__TEST__.renderFaq(faq, "test-faq")),
    );
  });
});
