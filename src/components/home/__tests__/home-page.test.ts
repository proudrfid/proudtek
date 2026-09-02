import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import HomePage from "../HomePage.astro";

describe("HomePage V2", () => {
  it("renders a verification-first procurement path without overstating factory certification", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HomePage);

    expect(html).toContain("Specify the tag. Verify the evidence. Move to samples.");
    expect(html).toContain("Start an RFQ");
    expect(html).toContain("Verified certificate");
    expect(html).toContain("ISO 9001:2015");
    expect(html).toContain("Company-stated record");
    expect(html).toContain("Production organisation and QC");
    expect(html).toContain("Browse the full product catalog");
    expect(html).not.toMatch(/ISO 9001 audited factories/i);
    expect(html).not.toContain("191 catalog variants");
  });
});
