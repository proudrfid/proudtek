/**
 * Parity test — ContactChannels.astro ↔ renderContactChannels.
 *
 * Stage 2 optimization. Only contact-group pages render this block in
 * production. Tests cover the mailto-from-primary path AND the fallback
 * path (built from title + kicker).
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import ContactChannels from "../ContactChannels.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import { minimalDefinition } from "../../../lib/__tests__/fixtures/editorial";

async function renderAstro(definition: typeof minimalDefinition): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(ContactChannels, { props: { definition } });
}

describe("ContactChannels.astro ↔ renderContactChannels parity", () => {
  it("fallback mailto (primaryAction.href is not a mailto)", async () => {
    const def = {
      ...minimalDefinition,
      group: "contact" as const,
      title: "Hotel Keycard Sample Inquiry",
      kicker: "Hotel Keycards",
      primaryAction: { href: "/contact/", label: "Contact" },
    };
    expect(normalizeHtml(await renderAstro(def))).toBe(
      normalizeHtml(__TEST__.renderContactChannels(def)),
    );
  });

  it("uses primaryAction mailto directly when provided", async () => {
    const def = {
      ...minimalDefinition,
      group: "contact" as const,
      primaryAction: { href: "mailto:samples@proudtek.com?subject=Bulk%20order", label: "Email samples" },
    };
    expect(normalizeHtml(await renderAstro(def))).toBe(
      normalizeHtml(__TEST__.renderContactChannels(def)),
    );
  });

  it("HTML-significant chars in title and kicker", async () => {
    const def = {
      ...minimalDefinition,
      group: "contact" as const,
      title: 'RFID & "Custom Cards" — Hotel Procurement',
      kicker: "RFID <Hotel> Sourcing",
    };
    expect(normalizeHtml(await renderAstro(def))).toBe(
      normalizeHtml(__TEST__.renderContactChannels(def)),
    );
  });
});
