/**
 * Snapshot tests for leaf-level renderers in editorial-pages.ts.
 *
 * Path-4 guardrail. See docs/architecture/editorial-rendering-debt.md.
 *
 * "Leaf" renderers produce the smallest, most stable HTML units —
 * a single resource card, a FAQ block, a table. Locking these snapshots
 * prevents accidental output drift from refactors / dependency upgrades.
 */
import { describe, it, expect } from "vitest";

import { __TEST__ } from "../editorial-pages";
import {
  minimalResourceCard,
  fullResourceCard,
  minimalResourceCards,
  fullResourceCards,
  minimalFaq,
  typicalFaq,
  minimalTable,
} from "./fixtures/editorial";

describe("renderResourceCard", () => {
  it("minimal: 1 link without description", () => {
    expect(__TEST__.renderResourceCard(minimalResourceCard)).toMatchSnapshot();
  });

  it("full: 2 links, second with description", () => {
    expect(__TEST__.renderResourceCard(fullResourceCard)).toMatchSnapshot();
  });
});

describe("renderResourceGrid", () => {
  it("minimal: 1 card", () => {
    expect(__TEST__.renderResourceGrid(minimalResourceCards, "test-resources")).toMatchSnapshot();
  });

  it("full: 2 cards", () => {
    expect(__TEST__.renderResourceGrid(fullResourceCards, "full-resources")).toMatchSnapshot();
  });
});

describe("renderFaq", () => {
  it("single FAQ entry", () => {
    expect(__TEST__.renderFaq(minimalFaq, "test-faq")).toMatchSnapshot();
  });

  it("3 FAQ entries", () => {
    expect(__TEST__.renderFaq(typicalFaq, "typical-faq")).toMatchSnapshot();
  });
});

describe("renderTrustSignals", () => {
  it("static output (no input)", () => {
    expect(__TEST__.renderTrustSignals()).toMatchSnapshot();
  });
});

describe("renderTable", () => {
  it("minimal 2-col 3-row table", () => {
    expect(__TEST__.renderTable(minimalTable)).toMatchSnapshot();
  });
});
