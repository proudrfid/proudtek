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
];

const donorFixture = {
  route: "/resources/",
  sourceUrl: "https://proudtek.com/resources/",
  title: "Test chrome donor",
  htmlAttrs: { lang: "en", "data-donor-html": "yes" },
  bodyAttrs: { class: "donor-body" },
  headHtml: '<meta name="donor-head-marker" content="yes">',
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
    route: "/solutions/",
    heading: "RFID & NFC Solutions",
    cardTitle: "Test solution",
    loadPage: () => import("../solutions/index.astro"),
    assertActiveRoute: ($) => {
      expect($('#site-navigation a[href="/solutions/"][aria-current="page"]')).toHaveLength(1);
    },
  },
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

  const Page = (await hub.loadPage()).default;
  const container = await AstroContainer.create();
  return container.renderToString(Page as never);
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.clearAllMocks();
  vi.doUnmock("astro:content");
  vi.doUnmock("../../lib/site-data");
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
    hub.assertActiveRoute($);
  });
});
