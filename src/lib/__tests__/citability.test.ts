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

  it("keeps the heading outline and AA-safe inline links (Lighthouse a11y ≥ 0.95)", () => {
    // The renamed Capabilities sub-heading must still be promoted h4 → h3 by
    // enhance-page.ts, otherwise heading-order fails.
    expect($("main h4").length).toBe(0);
    expect($("main h3").filter((_, el) => $(el).text().trim() === "What we own, and what runs on partner lines").length).toBe(1);
    // Injected links must not inherit the gold Kadence link colour.
    expect($('a.codex-home-inline-link[href="/about/factory/"]').length).toBe(1);
    expect($('a.codex-home-inline-link[href="/about/"]').length).toBe(1);
    expect($('.codex-home-evidence__header a.codex-home-inline-link').length).toBe(1);
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

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import Testimonial from "../../components/editorial/Testimonial.astro";

describe("Testimonial disclosure", () => {
  it("labels every editorial testimonial as unverified", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Testimonial, {
      props: { text: "Great tags.", source: "Procurement lead, anonymised" },
    });
    expect(html).toContain("not an independently verified review");
  });
});

/**
 * Retired-claim denylist. Each phrase was removed after the 2026-09-02 audit
 * or the 2026-09-05 diagnosis because it had no evidence on file, overstated
 * a certificate scope, or contradicted the one commercial policy. If a phrase
 * comes back, the test names the file.
 */
const RETIRED_PHRASES = [
  "ISO 9001 Certified Factory",
  "SGS audited",
  "Chip Partners",
  "no middlemen",
  "15-30% markup",
  "15–30% markup",
  "15-30% margin",
  "15–30% margin",
  "20-30% markup",
  "Every order includes free samples",
  "seamless compatibility",
  "ARC-graded UHF inlays for Walmart",
  "5–7 working days",
  "two self-owned factories",
  "305+ ",
  "8–12-SKU",
  "meet the air-interface and memory requirements for EU DPP",
];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "_unused") continue;
      walk(full, out);
    } else if (full.endsWith(".json")) {
      out.push(full);
    }
  }
  return out;
}

/** Code files may mention a retired phrase in a comment explaining why it went. */
function stripComments(file: string, source: string): string {
  if (file.endsWith(".json")) return source;
  return source
    .split("\n")
    .filter((line) => !/^\s*(\/\/|\/?\*)/.test(line))
    .join("\n");
}

describe("retired claims stay retired", () => {
  const root = path.resolve(__dirname, "../..");
  const files = [
    ...walk(path.join(root, "content/editorial")),
    path.join(root, "data/home-v2.ts"),
    path.join(root, "lib/seo-content.ts"),
    path.join(root, "lib/seo/render-blocks.ts"),
    path.join(root, "components/editorial/TrustSignals.astro"),
    path.join(root, "components/editorial/AboutTrustBand.astro"),
  ];

  it.each(RETIRED_PHRASES)("no content file contains %s", (phrase) => {
    const hits = files.filter((file) => stripComments(file, readFileSync(file, "utf8")).includes(phrase));
    expect(hits.map((f) => path.relative(root, f))).toEqual([]);
  });
});
