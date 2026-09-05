/**
 * Citability uplift (2026-09-05) — regression guards for the answer-engine
 * diagnosis remediation. See docs/superpowers/specs/2026-09-05-citability-uplift-design.md.
 */
import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

import EvidenceCards from "../../components/editorial/EvidenceCards.astro";

describe("EvidenceCards block", () => {
  it("renders claim, tier label and verify link", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(EvidenceCards, {
      props: {
        cards: [
          {
            claim: "Founded 2008",
            tier: "PROUD_TEK_SELF_REPORTED",
            evidence: "Registration extract not yet published.",
            href: "/about/",
            linkLabel: "About",
          },
        ],
      },
    });
    expect(html).toContain("Founded 2008");
    expect(html).toContain("Company-stated");
    expect(html).toContain('href="/about/"');
    expect(html).toContain("codex-evidence-cards");
    expect(html).toContain('data-evidence-tier="PROUD_TEK_SELF_REPORTED"');
  });
});
