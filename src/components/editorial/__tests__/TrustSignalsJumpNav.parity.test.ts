/**
 * Parity tests for the two simplest top-level renderers: TrustSignals
 * (static) and JumpNav (link list).
 *
 * Stage 2.
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import TrustSignals from "../TrustSignals.astro";
import JumpNav from "../JumpNav.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";

describe("TrustSignals.astro ↔ renderTrustSignals parity", () => {
  it("static output matches", async () => {
    const container = await AstroContainer.create();
    const astroHtml = await container.renderToString(TrustSignals);
    const tsHtml = __TEST__.renderTrustSignals();
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsHtml));
  });
});

describe("JumpNav.astro ↔ renderJumpNav parity", () => {
  it("minimal: 2 links", async () => {
    const links = [
      { id: "at-a-glance", label: "At a glance" },
      { id: "next-step", label: "Next step" },
    ];
    const container = await AstroContainer.create();
    const astroHtml = await container.renderToString(JumpNav, { props: { links } });
    const tsHtml = __TEST__.renderJumpNav(links);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsHtml));
  });

  it("typical: 6 links covering sections + faq + sources", async () => {
    const links = [
      { id: "at-a-glance", label: "At a glance" },
      { id: "why-rfid", label: "Why RFID?" },
      { id: "implementation-workflow", label: "Implementation workflow" },
      { id: "faq", label: "FAQ" },
      { id: "sources", label: "Sources" },
      { id: "next-step", label: "Next step" },
    ];
    const container = await AstroContainer.create();
    const astroHtml = await container.renderToString(JumpNav, { props: { links } });
    const tsHtml = __TEST__.renderJumpNav(links);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsHtml));
  });

  it("HTML-significant chars in label (escape parity)", async () => {
    const links = [
      { id: "id-1", label: 'Tom & "Jerry" <intro>' },
    ];
    const container = await AstroContainer.create();
    const astroHtml = await container.renderToString(JumpNav, { props: { links } });
    const tsHtml = __TEST__.renderJumpNav(links);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsHtml));
  });

  it("empty links: both sides render nothing", async () => {
    const container = await AstroContainer.create();
    const astroHtml = await container.renderToString(JumpNav, { props: { links: [] } });
    const tsHtml = __TEST__.renderJumpNav([]);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsHtml));
    expect(normalizeHtml(astroHtml)).toBe("");
  });
});
