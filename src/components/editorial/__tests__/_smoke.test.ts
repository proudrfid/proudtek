/**
 * Smoke test for the Stage 2 toolchain — sanity-check that vitest can render
 * an .astro component via experimental_AstroContainer.
 *
 * Post-cutover (2026-05-12): kept as a minimal canary for the test toolchain.
 * The 3 snapshot tests in src/lib/__tests__/ exercise Container API much more
 * thoroughly; this test stays mostly as a fast feedback signal if Container
 * API ever breaks.
 *
 * normalizeHtml is inlined here (was previously in _parity-helpers.ts which
 * is now gone with the rest of the parity test infrastructure).
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Smoke from "./_smoke.astro";

/**
 * Minimal normalize: strip Astro's dev-mode `data-astro-source-*` attrs
 * (only emitted under vitest / dev, not in production builds), then collapse
 * whitespace so the smoke assertion is stable.
 */
function normalizeHtml(html: string): string {
  return html
    .replace(/\s+data-astro-source-[a-z]+="[^"]*"/g, "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

describe("Stage 2 toolchain — smoke test", () => {
  it("Container API renders a trivial .astro component", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Smoke, { props: { msg: "hello" } });
    expect(normalizeHtml(html)).toBe('<p class="codex-smoke">hello</p>');
  });
});
