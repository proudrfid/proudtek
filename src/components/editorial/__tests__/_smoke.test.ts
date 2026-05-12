/**
 * Smoke test for Stage 2 toolchain: can vitest render an .astro component
 * via experimental_AstroContainer, and does the output look sensible?
 *
 * If this test fails to import or run, the Stage 2 plan needs to address
 * tooling before any real .astro components can be parity-tested.
 *
 * This file may be deleted once the first real parity test (Testimonial)
 * is green — its only purpose is to surface tooling issues early.
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Smoke from "./_smoke.astro";
import { normalizeHtml } from "./_parity-helpers";

describe("Stage 2 toolchain — smoke test", () => {
  it("Container API renders a trivial .astro component", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Smoke, { props: { msg: "hello" } });
    expect(normalizeHtml(html)).toBe('<p class="codex-smoke">hello</p>');
  });
});
