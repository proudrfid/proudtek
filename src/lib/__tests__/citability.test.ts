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

import { load } from "cheerio";
import homePage from "../../data/pages/index.json";
import { prepareSnapshot } from "../render-snapshot";
import { buildPageSeo } from "../seo";
import type { SnapshotPage } from "../site-data";
import { formatResponsePolicy, formatSamplePolicy, formatSamplePolicyShort } from "../seo-content";

describe("policy sentences (one source)", () => {
  it("state the one sample policy and response promise", () => {
    expect(formatSamplePolicy()).toContain("2-3 SKUs");
    expect(formatSamplePolicy()).toContain("$25–60");
    expect(formatSamplePolicy()).toContain("1 business day");
    expect(formatSamplePolicyShort()).toContain("2–3 SKUs");
    expect(formatResponsePolicy()).toContain("24-48 hours");
    expect(formatResponsePolicy()).toContain("2-4 hours");
  });
});

describe("live homepage snapshot after the citability pass", () => {
  const page = homePage as unknown as SnapshotPage;
  const snapshot = prepareSnapshot(page);
  const seo = buildPageSeo({
    ...page,
    htmlAttrs: snapshot.htmlAttrs,
    bodyAttrs: snapshot.bodyAttrs,
    headHtml: snapshot.headHtml,
    bodyHtml: snapshot.bodyHtml,
  });
  const $ = load(seo.bodyHtml);
  $("script, style, noscript").remove();
  const text = $("main").text().replace(/\s+/g, " ");

  it.each([
    "two self-owned",
    "305",
    "8+ Certified Patents",
    "10% of our annual profits",
    "meticulous craftsmanship",
    "cutting-edge design",
    "OUR CHIP PARTNERS",
    "seamless compatibility",
    "complete RFID hardware suites",
    "Proven Reliability",
    "WHAT MAKES US DIFFERENT",
    "Trusted by Clients Worldwide",
    "Comprehensive Manufacturing Excellence",
    "top industry experts",
    "8–12-SKU",
    "5–10 days",
    "under ISO 9001 documented procedures",
  ])("no longer says %s", (phrase) => {
    expect(text).not.toContain(phrase);
  });

  it.each([
    "Supported chip families",
    "What customers wrote to us",
    "not independently verified reviews",
    "Company-stated",
    "Verified certificate",
    "98026Q00274R000",
    "depends on the reader model",
    "What we own, and what runs on partner lines",
    "2–3 SKUs",
    "Freight at your cost",
  ])("now says %s", (phrase) => {
    expect(text).toContain(phrase);
  });

  it("renders the evidence strip once with three cards and keeps one H1", () => {
    expect($(".codex-home-evidence").length).toBe(1);
    expect($(".codex-home-evidence__card").length).toBe(3);
    expect($("main h1").length).toBe(1);
    // The neighbouring WordPress rows survive the row replacement.
    expect(text).toContain("CERTIFICATIONS");
    expect(text).toContain("EASY PROCESS");
  });
});
