/**
 * Snapshot tests for leaf-level editorial components (shadow tree).
 *
 * Post-cutover (2026-05-12). Replaces the legacy `__TEST__.renderXxx`-based
 * snapshot tests of the same name — renderers are gone, EditorialArticle.astro
 * + sub-components are the only render path. These snapshots lock the
 * shadow-component HTML output so any future drift surfaces in review.
 *
 * "Leaf" components produce the smallest, most stable HTML units —
 * a single resource card, a FAQ block, a table.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

import ResourceCard from "../../components/editorial/ResourceCard.astro";
import ResourceGrid from "../../components/editorial/ResourceGrid.astro";
import Faq from "../../components/editorial/Faq.astro";
import TrustSignals from "../../components/editorial/TrustSignals.astro";
import EditorialTable from "../../components/editorial/EditorialTable.astro";
import {
  minimalResourceCard,
  fullResourceCard,
  minimalResourceCards,
  fullResourceCards,
  minimalFaq,
  typicalFaq,
  minimalTable,
} from "./fixtures/editorial";

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

describe("ResourceCard.astro", () => {
  it("minimal: 1 link without description", async () => {
    const html = await container.renderToString(ResourceCard, { props: { card: minimalResourceCard } });
    expect(html).toMatchSnapshot();
  });

  it("full: 2 links, second with description", async () => {
    const html = await container.renderToString(ResourceCard, { props: { card: fullResourceCard } });
    expect(html).toMatchSnapshot();
  });
});

describe("ResourceGrid.astro", () => {
  it("minimal: 1 card", async () => {
    const html = await container.renderToString(ResourceGrid, { props: { cards: minimalResourceCards, id: "test-resources" } });
    expect(html).toMatchSnapshot();
  });

  it("full: 2 cards", async () => {
    const html = await container.renderToString(ResourceGrid, { props: { cards: fullResourceCards, id: "full-resources" } });
    expect(html).toMatchSnapshot();
  });
});

describe("Faq.astro", () => {
  it("single FAQ entry", async () => {
    const html = await container.renderToString(Faq, { props: { faq: minimalFaq, id: "test-faq" } });
    expect(html).toMatchSnapshot();
  });

  it("3 FAQ entries", async () => {
    const html = await container.renderToString(Faq, { props: { faq: typicalFaq, id: "typical-faq" } });
    expect(html).toMatchSnapshot();
  });
});

describe("TrustSignals.astro", () => {
  it("static output (no input)", async () => {
    const html = await container.renderToString(TrustSignals);
    expect(html).toMatchSnapshot();
  });
});

describe("EditorialTable.astro", () => {
  it("minimal 2-col 3-row table", async () => {
    const html = await container.renderToString(EditorialTable, { props: { table: minimalTable } });
    expect(html).toMatchSnapshot();
  });
});
