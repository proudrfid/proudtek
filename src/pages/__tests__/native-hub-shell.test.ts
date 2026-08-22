import { afterEach, describe, expect, it, vi } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { load } from "cheerio";

const editorialFixtures = [
  {
    id: "blog/test-post",
    data: {
      group: "blog",
      route: "/blog/test-post/",
      title: "Test blog post",
      summary: "Blog fixture summary",
      kicker: "RFID Technology",
      heroImage: "",
    },
  },
  {
    id: "guides/google-review-card-design-and-copy",
    data: {
      group: "guides",
      route: "/guides/google-review-card-design-and-copy/",
      title: "Test guide",
      summary: "Guide fixture summary",
      kicker: "Google Review Cards",
      heroImage: "",
      imageAlt: "",
    },
  },
  {
    id: "solutions/rfid-access-control",
    data: {
      group: "solutions",
      route: "/solutions/rfid-access-control/",
      title: "Test solution",
      summary: "Solution fixture summary",
      kicker: "Access Control",
      heroImage: "",
    },
  },
  {
    id: "compare/test-chip-comparison",
    data: {
      group: "compare",
      route: "/compare/test-chip-comparison/",
      title: "Test chip comparison",
      summary: "Chip comparison fixture summary",
      kicker: "Chip vs Chip",
      heroImage: "",
    },
  },
  {
    id: "compare/test-reader-comparison",
    data: {
      group: "compare",
      route: "/compare/test-reader-comparison/",
      title: "Test reader comparison",
      summary: "Reader comparison fixture summary",
      kicker: "Reader vs Reader",
      heroImage: "",
    },
  },
  {
    id: "compare/test-material-comparison",
    data: {
      group: "compare",
      route: "/compare/test-material-comparison/",
      title: "Test material comparison",
      summary: "Material comparison fixture summary",
      kicker: "Form Factor & Material",
      heroImage: "",
    },
  },
  {
    id: "compare/test-frequency-comparison",
    data: {
      group: "compare",
      route: "/compare/test-frequency-comparison/",
      title: "Test frequency comparison",
      summary: "Frequency comparison fixture summary",
      kicker: "Frequency & Technology",
      heroImage: "",
    },
  },
];

const compareCategoryFixtures = [
  {
    id: "chip-vs-chip",
    label: "Chip vs Chip",
    icon: "◈",
    testTitle: "Test chip comparison",
    description: "Compare RFID and NFC chip families.",
    seoTitle: "Chip vs Chip Comparisons | Proud Tek",
    pillars: ["Memory", "Security", "Compatibility"],
    slugs: ["test-chip-comparison"],
  },
  {
    id: "reader-vs-reader",
    label: "Reader vs Reader",
    icon: "▣",
    testTitle: "Test reader comparison",
    description: "Compare reader classes.",
    seoTitle: "Reader vs Reader Comparisons | Proud Tek",
    pillars: ["Frequency", "Range", "Integration"],
    slugs: ["test-reader-comparison"],
  },
  {
    id: "form-factor-material",
    label: "Form Factor & Material",
    icon: "◇",
    testTitle: "Test material comparison",
    description: "Compare tag bodies and materials.",
    seoTitle: "Form Factor Comparisons | Proud Tek",
    pillars: ["Material", "Durability", "Use case"],
    slugs: ["test-material-comparison"],
  },
  {
    id: "frequency-tech",
    label: "Frequency & Technology",
    icon: "◉",
    testTitle: "Test frequency comparison",
    description: "Compare RFID frequency technologies.",
    seoTitle: "Frequency Comparisons | Proud Tek",
    pillars: ["Frequency", "Read range", "Environment"],
    slugs: ["test-frequency-comparison"],
  },
];

const donorFixture = {
  route: "/resources/",
  sourceUrl: "https://proudtek.com/resources/",
  title: "Test chrome donor",
  htmlAttrs: { lang: "en", "data-donor-html": "yes" },
  bodyAttrs: { class: "donor-body" },
  headHtml: `
    <meta name="donor-head-marker" content="yes">
    <style id="kadence-global-inline-css">#masthead { z-index: 1000; }</style>
    <style id="woocommerce-theme-marker">.woocommerce-product-gallery { opacity: 1; }</style>
  `,
  bodyHtml: `
    <div id="donor-wrapper">
      <header id="masthead" data-donor-before-marker>Snapshot header</header>
      <main id="donor-main">Discarded donor content</main>
      <footer id="colophon" data-donor-after-marker>Snapshot footer</footer>
    </div>
  `,
};

type HubCase = {
  route: string;
  heading: string;
  cardTitle: string;
  loadPage: () => Promise<{ default: unknown }>;
  props?: Record<string, unknown>;
  assertActiveRoute: ($: ReturnType<typeof load>) => void;
};

const hubs: HubCase[] = [
  {
    route: "/blog/",
    heading: "RFID & NFC Knowledge Base",
    cardTitle: "Test blog post",
    loadPage: () => import("../blog/index.astro"),
    assertActiveRoute: ($) => {
      expect($('#site-navigation a[href="/blog/"][aria-current="page"]')).toHaveLength(1);
    },
  },
  {
    route: "/guides/",
    heading: "RFID & NFC Buying Guides",
    cardTitle: "Test guide",
    loadPage: () => import("../guides/index.astro"),
    assertActiveRoute: ($) => {
      expect($('#site-navigation a[href="/resources/"][aria-current="page"]')).toHaveLength(1);
      expect($('#site-navigation a[href="/guides/"][aria-current="page"]')).toHaveLength(1);
    },
  },
  {
    route: "/compare/",
    heading: "RFID & NFC Comparison Library",
    cardTitle: "Test chip comparison",
    loadPage: () => import("../compare/index.astro"),
    assertActiveRoute: ($) => {
      expect($('#site-navigation a[href="/compare/"][aria-current="page"]')).toHaveLength(1);
    },
  },
  ...compareCategoryFixtures.map((category) => ({
    route: `/compare/${category.id}/`,
    heading: `${category.icon} ${category.label}`,
    cardTitle: category.testTitle,
    loadPage: () => import("../compare/[category].astro"),
    props: { category },
    assertActiveRoute: ($: ReturnType<typeof load>) => {
      expect($(`.codex-industries-rail__link.active[href="/compare/${category.id}/"]`)).toHaveLength(1);
    },
  })),
];

async function renderHub(hub: HubCase, nativeShell: boolean): Promise<string> {
  vi.stubEnv("PROUDTEK_NATIVE_SHELL", nativeShell ? "1" : "0");
  vi.stubEnv("PROUDTEK_HOME_V2", "0");
  vi.stubEnv("PROUDTEK_CATALOG_V2", "0");
  vi.resetModules();
  vi.doMock("astro:content", () => ({
    getCollection: vi.fn(async (name: string) => (name === "editorial" ? editorialFixtures : [])),
  }));
  vi.doMock("../../lib/site-data", () => ({
    getPageByRoute: vi.fn(async () => donorFixture),
  }));
  vi.doMock("../../data/compare-categories", () => ({
    COMPARE_CATEGORIES: compareCategoryFixtures,
    getTotalCompareCount: () => compareCategoryFixtures.length,
  }));

  const Page = (await hub.loadPage()).default;
  const container = await AstroContainer.create();
  return container.renderToString(Page as never, { props: hub.props });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.clearAllMocks();
  vi.doUnmock("astro:content");
  vi.doUnmock("../../lib/site-data");
  vi.doUnmock("../../data/compare-categories");
});

describe.each(hubs)("$route hub shell branches", (hub) => {
  it("keeps both donor chrome boundaries by default", async () => {
    const $ = load(await renderHub(hub, false));

    expect($("main#main")).toHaveLength(1);
    expect($("main#main h1").text().replace(/\s+/g, " ").trim()).toBe(hub.heading);
    expect($("main#main").text()).toContain(hub.cardTitle);
    expect($("[data-donor-before-marker]")).toHaveLength(1);
    expect($("[data-donor-after-marker]")).toHaveLength(1);
    expect($("[data-native-site-shell]")).toHaveLength(0);
    expect($("style#kadence-global-inline-css")).toHaveLength(1);
    expect($("style#woocommerce-theme-marker")).toHaveLength(1);
  });

  it("renders one native shell without donor chrome when flagged", async () => {
    const $ = load(await renderHub(hub, true));

    expect($("main#main")).toHaveLength(1);
    expect($("main#main h1").text().replace(/\s+/g, " ").trim()).toBe(hub.heading);
    expect($("main#main").text()).toContain(hub.cardTitle);
    expect($("[data-native-site-shell]")).toHaveLength(1);
    expect($("[data-donor-before-marker]")).toHaveLength(0);
    expect($("[data-donor-after-marker]")).toHaveLength(0);
    expect($("#masthead")).toHaveLength(1);
    expect($("footer#colophon")).toHaveLength(1);
    expect($("style#kadence-global-inline-css")).toHaveLength(0);
    expect($("style#woocommerce-theme-marker")).toHaveLength(0);
    hub.assertActiveRoute($);
  });
});
