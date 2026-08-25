import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { afterEach, describe, expect, it, vi } from "vitest";
import { audit } from "../../scripts/native-shell-canary-audit.mjs";
import { buildContract } from "../../scripts/site-contract-audit.mjs";
import LEAF_ROUTE_REGISTRY from "../../scripts/native-canary-leaf-routes.json";

// The fixture now materializes 115 outputs x 3 dists per test and the audit
// deep-checks all of them; under full-suite parallel workers individual
// audits can take tens of seconds. Keep well clear of the default 5s.
vi.setConfig({ testTimeout: 120_000 });

type FixturePaths = { baselineDist: string; defaultDist: string; flaggedDist: string };
type Mutation = (paths: FixturePaths) => Promise<void>;

const temporaryDirs: string[] = [];
const AUDIT_CLI = fileURLToPath(new URL("../../scripts/native-shell-canary-audit.mjs", import.meta.url));
const SITE_CONTRACT_CLI = fileURLToPath(new URL("../../scripts/site-contract-audit.mjs", import.meta.url));
const tmpAlias = (filePath: string) => filePath.replace(/^\/private\/tmp\//, "/tmp/");
const execFileAsync = promisify(execFile);

// Leaf outputs derive from the shared registry (single source with
// scripts/native-shell-canary-audit.mjs).
const LEAF_OUTPUTS: string[] = (
  LEAF_ROUTE_REGISTRY as { routes: string[] }
).routes.map((route) => route.slice(1) + "index.html");

async function fixture(): Promise<FixturePaths> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "native-shell-canary-test-"));
  temporaryDirs.push(root);
  const baselineDist = path.join(root, "baseline");
  const defaultDist = path.join(root, "default");
  const flaggedDist = path.join(root, "flagged");
  // Hub-shaped flagged outputs plus one unflagged control page. Leaf paths
  // mirror scripts/native-shell-canary-audit.mjs LEAF_PATHS (phase 6b).
  const outputs = [
    "glossary/index.html",
    "tools/rfid-tag-cost-estimator/index.html",
    "guides/index.html",
    "guides/google-review-cards/index.html",
    "guides/hotel-keycards/index.html",
    "guides/chip-encyclopedias/index.html",
    "guides/standards-encoding/index.html",
    "guides/compliance-regulatory/index.html",
    "guides/integration-tools/index.html",
    "guides/buying-reference/index.html",
    "solutions/index.html",
    "blog/index.html",
    "compare/index.html",
    "compare/chip-vs-chip/index.html",
    "compare/reader-vs-reader/index.html",
    "compare/form-factor-material/index.html",
    "compare/frequency-tech/index.html",
    "case-studies/index.html",
    "compatibility/index.html",
    "compatibility/be-tech-hotel-key-cards/index.html",
    "compatibility/hafele-dialock-hotel-key-cards/index.html",
    "compatibility/miwa-hotel-key-cards/index.html",
    "compatibility/onity-hotel-key-cards/index.html",
    "compatibility/saflok-hotel-key-cards/index.html",
    "compatibility/salto-hotel-key-cards/index.html",
    "compatibility/vingcard-hotel-key-cards/index.html",
    ...LEAF_OUTPUTS,
    "unflagged-control/index.html",
  ];
  const flagged = new Set(outputs.filter((relativePath) =>
    relativePath !== "unflagged-control/index.html",
  ));
  for (const dist of [baselineDist, defaultDist, flaggedDist]) {
    for (const relativePath of outputs) {
      const filePath = path.join(dist, relativePath);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, html(relativePath, dist === flaggedDist && flagged.has(relativePath)));
    }
    await fs.writeFile(path.join(dist, "image-sitemap.xml"), imageSitemap());
    await fs.writeFile(path.join(dist, "_redirects"), "/legacy /current 301\n");
  }
  return { baselineDist, defaultDist, flaggedDist };
}

function html(relativePath: string, native: boolean) {
  // Every flagged output is hub-shaped in this fixture (native shell with
  // landmark ids + a main#main); only the unflagged-control page is not.
  const hub = relativePath !== "unflagged-control/index.html";
  const shell = native ? '<div class="codex-native-shell" data-native-site-shell><header id="masthead"><nav id="site-navigation"><ul id="primary-menu"></ul></nav><div id="mobile-drawer"><ul id="mobile-menu"></ul></div></header>' : '<header data-donor="masthead"></header>';
  const footer = native ? '<footer id="colophon"></footer></div>' : '<footer data-donor="footer"></footer>';
  return `<!doctype html><html><head><title>${relativePath}</title><link rel="canonical" href="https://proudtek.com/${relativePath.replace("index.html", "")}"/><meta name="description" content="fixture"/></head><body>${shell}${hub ? '<main id="main" class="hub-main" data-rail-key="fixture" aria-label="Fixture hub"><h1>Fixture hub</h1><p>Body <a href="/guides/original/" class="hub-link">Read guide</a></p></main>' : '<main id="main"><h1>Fixture</h1></main>'}${footer}</body></html>`;
}

function imageSitemap() {
  return `<?xml version="1.0"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://proudtek.com/guides/</loc>
    <image:image>
      <image:loc>https://proudtek.com/fixture.jpg</image:loc>
      <image:title>Fixture title</image:title>
      <image:caption>Fixture caption</image:caption>
    </image:image>
  </url>
</urlset>
`;
}

async function replace(filePath: string, pattern: RegExp, replacement: string) {
  const original = await fs.readFile(filePath, "utf8");
  let count = 0;
  const updated = original.replace(pattern, () => {
    count += 1;
    return replacement;
  });
  if (count !== 1) throw new Error(`fixture replacement expected exactly one match in ${filePath}; got ${count}`);
  if (updated === original) throw new Error(`fixture replacement made no change in ${filePath}`);
  await fs.writeFile(filePath, updated);
}

async function expectFailure(mutation: Mutation, message: string) {
  const paths = await fixture();
  await mutation(paths);
  await expect(audit(paths)).rejects.toThrow(message);
}

afterEach(async () => {
  await Promise.all(temporaryDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe("native shell canary output audit", () => {
  it("passes the CLI with exit 0 and reports the summary", async () => {
    const paths = await fixture();
    const { stdout } = await execFileAsync(process.execPath, [AUDIT_CLI, "--baseline-dist", paths.baselineDist, "--default-dist", paths.defaultDist, "--flagged-dist", paths.flaggedDist]);
    expect(stdout).toContain("[native-shell-canary] PASS");
  });

  it("executes both CLIs through the macOS /tmp alias", async () => {
    const paths = await fixture();
    const { stdout } = await execFileAsync(process.execPath, [tmpAlias(AUDIT_CLI), "--baseline-dist", paths.baselineDist, "--default-dist", paths.defaultDist, "--flagged-dist", paths.flaggedDist]);
    expect(stdout).toContain("[native-shell-canary] PASS");
    await expect(execFileAsync(process.execPath, [tmpAlias(SITE_CONTRACT_CLI), "--dist"])).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining("--dist requires") });
  });
  it("fails the CLI with exit 1 and reports the first actionable path", async () => {
    const paths = await fixture();
    await replace(path.join(paths.defaultDist, "unflagged-control/index.html"), /<body/, "<body data-native-site-shell");
    await expect(execFileAsync(process.execPath, [AUDIT_CLI, "--baseline-dist", paths.baselineDist, "--default-dist", paths.defaultDist, "--flagged-dist", paths.flaggedDist])).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining("unflagged-control/index.html") });
  });

  it.each([
    [["--dist", "x", "--dist", "y"], "duplicate --dist"],
    [["--write-baseline", "--write-baseline"], "duplicate --write-baseline"],
    [["--unknown"], "unknown option --unknown"],
    [["positional"], "unexpected argument positional"],
    [["--dist", "x", "trailing"], "unexpected argument trailing"],
    [["--dist"], "--dist requires"],
    [["--dist", "--write-baseline"], "--dist requires"],
  ])("rejects malformed site-contract dist arguments", async (args: string[], message: string) => {
    await expect(execFileAsync(process.execPath, [path.resolve("scripts/site-contract-audit.mjs"), ...args])).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining(message) });
  });

  it.each([
    [["--default-dist", "x", "--flagged-dist", "y"], "missing --baseline-dist"],
    [["--default-dist", "--flagged-dist", "x"], "--default-dist requires"],
    [["--default-dist", "x", "--default-dist", "y", "--flagged-dist", "z", "--baseline-dist", "b"], "duplicate --default-dist"],
    [["--default-dist", "x", "--flagged-dist", "y", "--baseline-dist", "b", "--unknown", "z"], "unknown option --unknown"],
  ])("rejects malformed native audit arguments", async (args: string[], message: string) => {
    await expect(execFileAsync(process.execPath, [AUDIT_CLI, ...args])).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining(message) });
  });
  it("reports the audited custom path when sitemap is missing", async () => {
    const paths = await fixture();
    await fs.rm(path.join(paths.defaultDist, "image-sitemap.xml"));
    const contract = await buildContract(paths.defaultDist);
    expect(contract.knownWarnings).toContainEqual({ code: "SITEMAP_MISSING", file: path.join(paths.defaultDist, "sitemap.xml") });
  });
  it("passes a clean deterministic default and flagged fixture", async () => {
    await expect(audit(await fixture())).resolves.toMatchObject({
      hubs: 547,
      flaggedMarkers: expect.arrayContaining([
        "compare/index.html",
        "compare/chip-vs-chip/index.html",
        "compare/reader-vs-reader/index.html",
        "compare/form-factor-material/index.html",
        "compare/frequency-tech/index.html",
      ]),
    });
  });

  it("normalizes formatting-only HTML and XML changes", async () => {
    const paths = await fixture();
    await replace(path.join(paths.defaultDist, "guides/index.html"), /<main id="main" class="hub-main" data-rail-key="fixture" aria-label="Fixture hub">/, '<main id="main" class="hub-main" data-rail-key="fixture" aria-label="Fixture hub">\n  ');
    const imagePath = path.join(paths.flaggedDist, "image-sitemap.xml");
    const before = await fs.readFile(imagePath, "utf8");
    await replace(imagePath, /<image:loc>/, "\n      <image:loc>");
    const after = await fs.readFile(imagePath, "utf8");
    expect(after).not.toBe(before);
    await expect(audit(paths)).resolves.toBeTruthy();
  });

  it("rejects an unexpected native marker with its output path", async () => {
    await expectFailure(({ defaultDist }) => replace(path.join(defaultDist, "unflagged-control/index.html"), /<body/, "<body data-native-site-shell"), "default build has invalid native shell marker placement in unflagged-control/index.html");
  });

  it("rejects a valid native wrapper marker in the default build", async () => {
    await expectFailure(({ defaultDist }) => replace(path.join(defaultDist, "unflagged-control/index.html"), /<body>/, '<body><div class="codex-native-shell" data-native-site-shell></div>'), "default build has unexpected native marker in unflagged-control/index.html");
  });
  it("rejects a missing guides marker with its output path", async () => {
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "guides/index.html"), / data-native-site-shell/g, ""), "flagged build is missing native marker in guides/index.html");
  });


  it.each([
    ["main", /<main id="main" class="hub-main" data-rail-key="fixture" aria-label="Fixture hub"><h1>Fixture hub<\/h1><p>Body <a href="\/guides\/original\/" class="hub-link">Read guide<\/a><\/p><\/main>/, "</div><main id=\"main\" class=\"hub-main\" data-rail-key=\"fixture\" aria-label=\"Fixture hub\"><h1>Fixture hub</h1><p>Body <a href=\"/guides/original/\" class=\"hub-link\">Read guide</a></p></main>", "main#main"],
    ["navigation", /<nav id="site-navigation"><ul id="primary-menu"><\/ul><\/nav>/, "</div><nav id=\"site-navigation\"><ul id=\"primary-menu\"></ul></nav>", "site-navigation"],
    ["mobile drawer", /<div id="mobile-drawer"><ul id="mobile-menu"><\/ul><\/div>/, "</div><div id=\"mobile-drawer\"><ul id=\"mobile-menu\"></ul></div>", "mobile-drawer"],
  ])("rejects %s outside the native shell root", async (_name: string, pattern: RegExp, replacement: string, label: string) => {
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "guides/index.html"), pattern, replacement), `guides/index.html has 0 ${label} landmarks inside native shell; expected exactly one`);
  });

  it("rejects multiple native shell roots in a flagged hub", async () => {
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "guides/index.html"), /<body>/, "<body><div data-native-site-shell></div>"), "flagged build has invalid native shell marker placement in guides/index.html");
  });
  it.each([
    ["header", "<header class=\"site-header\" id=\"legacy-header\"></header>"],
    ["footer", "<footer class=\"site-footer\" id=\"legacy-footer\"></footer>"],
  ])("rejects extra legacy donor %s markup even with different IDs", async (_landmark: string, donor: string) => {
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "guides/index.html"), /<\/div><\/body>/, `</div>${donor}</body>`), "guides/index.html has legacy donor header/footer markup outside native shell");
  });
  it.each([
    ["masthead", /<header id="masthead">/, "<header id=\"masthead\"></header><header id=\"masthead\">", "2 masthead"],
    ["footer", /<footer id="colophon"><\//, "<footer id=\"colophon\"></footer><footer id=\"colophon\">", "2 footer#colophon"],
  ])("rejects a duplicate %s with its hub path", async (_landmark: string, pattern: RegExp, opening: string, label: string) => {
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "guides/index.html"), pattern, `${opening} data-test-duplicate="true"`), `guides/index.html has ${label} landmarks; expected exactly one`);
  });

  it.each([
    ["malformed XML", "<urlset><url>", "image-sitemap.xml is malformed"],
    ["wrong root", "<not-urlset><url></url></not-urlset>", "image-sitemap.xml must contain a urlset root"],
  ])("rejects %s image-sitemap files with actionable errors", async (_name: string, xml: string, message: string) => {
    const paths = await fixture();
    await fs.writeFile(path.join(paths.flaggedDist, "image-sitemap.xml"), xml);
    await expect(audit(paths)).rejects.toThrow(message);
  });

  it.each([
    ["appended unrelated root", "<urlset></urlset><extra></extra>"],
    ["duplicate urlset roots", "<urlset></urlset><urlset></urlset>"],
  ])("rejects %s in image-sitemap files", async (_name: string, xml: string) => {
    const paths = await fixture();
    await fs.writeFile(path.join(paths.flaggedDist, "image-sitemap.xml"), xml);
    await expect(audit(paths)).rejects.toThrow("image-sitemap.xml must contain exactly one urlset root");
  });

  it("allows a valid empty urlset image-sitemap", async () => {
    const paths = await fixture();
    const empty = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"></urlset>';
    await fs.writeFile(path.join(paths.defaultDist, "image-sitemap.xml"), empty);
    await fs.writeFile(path.join(paths.flaggedDist, "image-sitemap.xml"), empty);
    await expect(audit(paths)).resolves.toBeTruthy();
  });
  it.each([
    ["namespace removal", / xmlns:image="[^"]+"/, "", "root attribute @_xmlns:image"],
    ["root attribute addition", /<urlset /, "<urlset data-version=\"2\" ", "root attribute @_data-version"],
    ["root extension addition", /<\/urlset>/, "  <x:meta>new</x:meta>\n</urlset>", "root extension metadata"],
    ["root extension removal", / {2}<x:meta>baseline<\/x:meta>\n<\/urlset>/, "</urlset>", "root extension metadata"],
    ["root extension change", /<x:meta>baseline<\/x:meta>/, "<x:meta>changed</x:meta>", "root extension metadata"],
  ])("rejects image-sitemap %s with an actionable root diagnostic", async (name: string, pattern: RegExp, replacement: string, field: string) => {
    if (name === "root extension removal" || name === "root extension change") {
      const paths = await fixture();
      await replace(path.join(paths.defaultDist, "image-sitemap.xml"), /<\/urlset>/, "  <x:meta>baseline</x:meta>\n</urlset>");
      await replace(path.join(paths.flaggedDist, "image-sitemap.xml"), /<\/urlset>/, "  <x:meta>baseline</x:meta>\n</urlset>");
      await replace(path.join(paths.flaggedDist, "image-sitemap.xml"), pattern, replacement);
      await expect(audit(paths)).rejects.toThrow(`image-sitemap mismatch at ${field}`);
      return;
    }
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "image-sitemap.xml"), pattern, replacement), `image-sitemap mismatch at ${field}`);
  });
  it("allows duplicate sitemap URL and image entries when multiplicity is identical", async () => {
    const urlPaths = await fixture();
    for (const dist of [urlPaths.defaultDist, urlPaths.flaggedDist]) {
      await replace(path.join(dist, "image-sitemap.xml"), /<\/urlset>/, "  <url><loc>https://proudtek.com/guides/</loc></url>\n</urlset>");
    }
    await expect(audit(urlPaths)).resolves.toBeTruthy();

    const imagePaths = await fixture();
    for (const dist of [imagePaths.defaultDist, imagePaths.flaggedDist]) {
      await replace(path.join(dist, "image-sitemap.xml"), / {2}<\/url>\n<\/urlset>/, "      <image:image><image:loc>https://proudtek.com/fixture.jpg</image:loc></image:image>\n  </url>\n</urlset>");
    }
    await expect(audit(imagePaths)).resolves.toBeTruthy();
  });

  it("rejects changed duplicate sitemap URL and image multiplicity", async () => {
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "image-sitemap.xml"), /<\/urlset>/, "  <url><loc>https://proudtek.com/guides/</loc></url>\n</urlset>"), "image-sitemap mismatch at URL membership count mismatch for URL https://proudtek.com/guides/ expected=1 actual=2");
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "image-sitemap.xml"), / {2}<\/url>\n<\/urlset>/, "      <image:image><image:loc>https://proudtek.com/fixture.jpg</image:loc></image:image>\n  </url>\n</urlset>"), "image-sitemap mismatch at https://proudtek.com/guides/ image membership count mismatch for image https://proudtek.com/fixture.jpg expected=1 actual=2");
  });

  it("rejects an image-sitemap URL mutation with its URL field", async () => {
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "image-sitemap.xml"), /<image:loc>[^<]+/, "<image:loc>https://proudtek.com/mutated-url.jpg"), "image-sitemap mismatch at https://proudtek.com/guides/ image membership missing image https://proudtek.com/fixture.jpg");
  });

  it("rejects an image-sitemap membership mutation with its URL", async () => {
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "image-sitemap.xml"), /<loc>([^<]+)/, "<loc>https://proudtek.com/mutated-page/"), "image-sitemap mismatch at URL membership missing URL https://proudtek.com/guides/");
  });

  it("rejects an image-sitemap URL entry addition and removal with exact URLs", async () => {
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "image-sitemap.xml"), /<\/urlset>/, "  <url><loc>https://proudtek.com/added-page/</loc></url>\n</urlset>"), "image-sitemap mismatch at URL membership added URL https://proudtek.com/added-page/");
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "image-sitemap.xml"), /\s*<url>[\s\S]*?<\/url>\s*<\/urlset>/, "</urlset>"), "image-sitemap mismatch at URL membership missing URL https://proudtek.com/guides/");
  });

  it("rejects an image-sitemap image entry addition and removal with exact image locs", async () => {
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "image-sitemap.xml"), /<\/url>\s*<\/urlset>/, "    <image:image><image:loc>https://proudtek.com/added-image.jpg</image:loc></image:image>\n  </url>\n</urlset>"), "image-sitemap mismatch at https://proudtek.com/guides/ image membership added image https://proudtek.com/added-image.jpg");
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "image-sitemap.xml"), /\s*<image:image>[\s\S]*?<\/image:image>\s*<\/url>/, "</url>"), "image-sitemap mismatch at https://proudtek.com/guides/ image membership missing image https://proudtek.com/fixture.jpg");
  });

  it("rejects an image-sitemap title mutation with its image field", async () => {
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "image-sitemap.xml"), /<image:title>([^<]*)/, "<image:title>mutated title"), "image-sitemap mismatch at https://proudtek.com/guides/ image https://proudtek.com/fixture.jpg.title");
  });

  it("rejects an image-sitemap caption mutation with its image field", async () => {
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "image-sitemap.xml"), /<image:caption>([^<]*)/, "<image:caption>mutated caption"), "image-sitemap mismatch at https://proudtek.com/guides/ image https://proudtek.com/fixture.jpg.caption");
  });

  it("preserves exact XML text values such as 001 versus 1", async () => {
    const paths = await fixture();
    await replace(path.join(paths.defaultDist, "image-sitemap.xml"), /<\/urlset>/, "  <x:code>001</x:code>\n</urlset>");
    await replace(path.join(paths.flaggedDist, "image-sitemap.xml"), /<\/urlset>/, "  <x:code>1</x:code>\n</urlset>");
    await expect(audit(paths)).rejects.toThrow("image-sitemap mismatch at root extension metadata");
  });

  it.each([
    ["image loc", /<image:loc>([^<]*)/, "<image:loc> https://proudtek.com/fixture.jpg", "image membership"],
    ["image title", /<image:title>([^<]*)/, "<image:title> Fixture title", ".title"],
    ["image caption", /<image:caption>([^<]*)/, "<image:caption>Fixture caption ", ".caption"],
    ["root extension", /<\/urlset>/, "  <x:meta> padded </x:meta>\n</urlset>", "root extension metadata"],
  ])("preserves leading and trailing whitespace in %s", async (_name: string, pattern: RegExp, replacement: string, message: string) => {
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "image-sitemap.xml"), pattern, replacement), message);
  });

  it.each([
    ["sitemap.xml", "<urlset>text</urlset>", "must contain an object urlset root"],
    ["sitemap-index.xml", "<sitemapindex>text</sitemapindex>", "must contain an object sitemapindex root"],
    ["sitemap.xml", "<urlset><url>", "is malformed"],
    ["sitemap.xml", "<not-urlset></not-urlset>", "must contain a urlset root"],
    ["sitemap.xml", "<urlset></urlset><extra></extra>", "must contain exactly one urlset root"],
    ["sitemap-index.xml", "<sitemapindex><sitemap>", "is malformed"],
    ["sitemap-index.xml", "<not-sitemapindex></not-sitemapindex>", "must contain a sitemapindex root"],
    ["sitemap-index.xml", "<sitemapindex></sitemapindex><extra></extra>", "must contain exactly one sitemapindex root"],
  ])("rejects invalid shared %s contracts", async (fileName: string, xml: string, message: string) => {
    const paths = await fixture();
    await fs.writeFile(path.join(paths.defaultDist, fileName), xml);
    await expect(buildContract(paths.defaultDist)).rejects.toThrow(`${fileName} ${message}`);
  });

  it("preserves leading and trailing whitespace in shared sitemap locations", async () => {
    const paths = await fixture();
    await fs.writeFile(path.join(paths.defaultDist, "sitemap.xml"), '<urlset><url><loc> https://proudtek.com/padded/ </loc></url></urlset>');
    await fs.writeFile(path.join(paths.defaultDist, "sitemap-index.xml"), '<sitemapindex><sitemap><loc> https://proudtek.com/index.xml </loc></sitemap></sitemapindex>');
    const contract = await buildContract(paths.defaultDist);
    expect(contract.sitemap.urls).toEqual([" https://proudtek.com/padded/ "]);
    expect(contract.sitemap.index).toEqual([" https://proudtek.com/index.xml "]);
  });
  it("accepts canonical as a tokenized rel value", async () => {
    const paths = await fixture();
    await replace(path.join(paths.flaggedDist, "guides/index.html"), /rel="canonical"/, "rel=\"canonical alternate\"");
    await expect(audit(paths)).resolves.toBeTruthy();
  });

  it("detects drift inside an object-valued JSON-LD graph", async () => {
    const paths = await fixture();
    await replace(path.join(paths.defaultDist, "guides/index.html"), /<\/head>/, '<script type="application/ld+json">{"@graph":{"@type":"Thing","name":"one"}}</script></head>');
    await replace(path.join(paths.flaggedDist, "guides/index.html"), /<\/head>/, '<script type="application/ld+json">{"@graph":{"@type":"Thing","name":"two"}}</script></head>');
    await expect(audit(paths)).rejects.toThrow(/JSONLD_CHANGED|default\/flagged contract drift/);
  });
  it("compares generated Netlify redirect output between default and flagged builds", async () => {
    const paths = await fixture();
    await replace(path.join(paths.flaggedDist, "_redirects"), /\/legacy \/current 301/, "/legacy /changed 302");
    const defaultContract = await buildContract(paths.defaultDist);
    const flaggedContract = await buildContract(paths.flaggedDist);
    expect((await import("../../scripts/site-contract-audit.mjs")).diffComparable(defaultContract, flaggedContract)).toContainEqual({ code: "CONTRACT_SECTION_CHANGED", field: "redirects" });
    await expect(audit(paths)).rejects.toThrow(/redirects/);
  });


  it("reports missing generated Netlify redirect output explicitly", async () => {
    const paths = await fixture();
    await fs.rm(path.join(paths.flaggedDist, "_redirects"));
    await expect(buildContract(paths.flaggedDist)).rejects.toThrow(`missing generated Netlify redirects ${path.join(paths.flaggedDist, "_redirects")}`);
  });

  it.each([
    ["sitemap.xml scalar child", "<urlset><url>text</url></urlset>", "sitemap.xml url[0] must be an object with a non-empty loc"],
    ["sitemap.xml missing loc", "<urlset><url></url></urlset>", "sitemap.xml url[0] must be an object with a non-empty loc"],
    ["sitemap-index.xml scalar child", "<sitemapindex><sitemap>text</sitemap></sitemapindex>", "sitemap-index.xml sitemap[0] must be an object with a non-empty loc"],
    ["sitemap-index.xml missing loc", "<sitemapindex><sitemap></sitemap></sitemapindex>", "sitemap-index.xml sitemap[0] must be an object with a non-empty loc"],
  ])("rejects malformed %s", async (_name: string, xml: string, message: string) => {
    const paths = await fixture();
    const fileName = _name.startsWith("sitemap-index") ? "sitemap-index.xml" : "sitemap.xml";
    await fs.writeFile(path.join(paths.defaultDist, fileName), xml);
    await expect(buildContract(paths.defaultDist)).rejects.toThrow(message);
  });

  it.each([
    ["scalar URL child", "<urlset><url>text</url></urlset>", "image-sitemap.xml url[0] must be an object with a non-empty loc"],
    ["missing URL loc", "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\"><url></url></urlset>", "image-sitemap.xml url[0] must be an object with a non-empty loc"],
    ["scalar image child", "<urlset><url><loc>https://proudtek.com/page/</loc><image:image>text</image:image></url></urlset>", "image-sitemap.xml url[0] image[0] must be an object with a non-empty image loc"],
    ["missing image loc", "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\"><url><loc>https://proudtek.com/guides/</loc><image:image></image:image></url></urlset>", "image-sitemap.xml url[0] image[0] must be an object with a non-empty image loc"],
  ])("rejects malformed %s", async (_name: string, xml: string, message: string) => {
    const paths = await fixture();
    await fs.writeFile(path.join(paths.flaggedDist, "image-sitemap.xml"), xml);
    await expect(audit(paths)).rejects.toThrow(message);
  });
  it("rejects malformed JSON-LD on a flagged hub with an actionable route", async () => {
    const paths = await fixture();
    await replace(path.join(paths.flaggedDist, "guides/index.html"), /<\/head>/, '<script type="application/ld+json">{"broken":</script></head>');
    await expect(execFileAsync(process.execPath, [AUDIT_CLI, "--baseline-dist", paths.baselineDist, "--default-dist", paths.defaultDist, "--flagged-dist", paths.flaggedDist])).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringMatching(/JSON-LD.*\/guides\//),
    });
  });


  it("includes duplicate canonical links in comparable page contracts", async () => {
    const paths = await fixture();
    const defaultContract = await buildContract(paths.defaultDist);
    await replace(path.join(paths.flaggedDist, "research/index.html"), /<\/head>/, '<link rel="canonical" href="https://proudtek.com/duplicate/"/></head>');
    const flaggedContract = await buildContract(paths.flaggedDist);
    expect(flaggedContract.pages.find((page: { outputPath: string; canonicalCount?: number }) => page.outputPath === "research/index.html")?.canonicalCount).toBe(2);
    expect((await import("../../scripts/site-contract-audit.mjs")).diffComparable(defaultContract, flaggedContract)).toContainEqual(expect.objectContaining({ code: "PAGE_FIELD_CHANGED", outputPath: "research/index.html", field: "canonicalCount" }));
  });

  it.each([
    ["wrapper marker removal", / data-native-site-shell/, "", "flagged build is missing native marker in guides/index.html"],
    ["body stray marker", /<body>/, "<body data-native-site-shell>", "flagged build has invalid native shell marker placement in guides/index.html"],
    ["wrong tag marker", /<div class="codex-native-shell" data-native-site-shell>/, "<section class=\"codex-native-shell\" data-native-site-shell>", "flagged build has invalid native shell marker placement in guides/index.html"],
    ["wrong class marker", /<div class="codex-native-shell" data-native-site-shell>/, "<div class=\"other-shell\" data-native-site-shell>", "flagged build has invalid native shell marker placement in guides/index.html"],
  ])("rejects %s", async (_name: string, pattern: RegExp, replacement: string, message: string) => {
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "guides/index.html"), pattern, replacement), message);
  });

  it("rejects an extra stray marker outside the native wrapper", async () => {
    await expectFailure(({ flaggedDist }) => replace(path.join(flaggedDist, "guides/index.html"), /<\/body>/, '<div data-native-site-shell></div></body>'), "flagged build has invalid native shell marker placement in guides/index.html");
  });
  it("rejects flagged hub main DOM href drift", async () => {
    const paths = await fixture();
    await replace(path.join(paths.flaggedDist, "guides/index.html"), /href="\/guides\/original\/"/, 'href="/guides/changed/"');
    await expect(audit(paths)).rejects.toThrow("guides/index.html main DOM differs between default and flagged builds");
  });

  it("allows formatting-only structural whitespace inside flagged hub main", async () => {
    const paths = await fixture();
    for (const dist of [paths.defaultDist, paths.flaggedDist]) {
      await replace(path.join(dist, "guides/index.html"), /<\/h1><p>/, "</h1>\n    <p>");
    }
    await expect(audit(paths)).resolves.toBeTruthy();
  });

  it("allows formatting-only whitespace between HTML tags", async () => {
    const paths = await fixture();
    await replace(path.join(paths.defaultDist, "guides/index.html"), /<\/header><main/, "</header>\n    <main");
    await expect(audit(paths)).resolves.toBeTruthy();
  });

  it("rejects removal of whitespace between inline siblings", async () => {
    const paths = await fixture();
    await replace(path.join(paths.baselineDist, "guides/index.html"), /<\/body>/, "<p><strong>wide</strong> <em>world</em></p></body>");
    await replace(path.join(paths.defaultDist, "guides/index.html"), /<\/body>/, "<p><strong>wide</strong><em>world</em></p></body>");
    await expect(audit(paths)).rejects.toThrow("guides/index.html differs from clean baseline");
  });

  it.each([
    ["p leading inline", "<p> <strong>wide</strong></p>", "<p><strong>wide</strong></p>"],
    ["p trailing inline", "<p><strong>wide</strong> </p>", "<p><strong>wide</strong></p>"],
    ["div leading inline", "<div> <span>wide</span></div>", "<div><span>wide</span></div>"],
    ["div trailing inline", "<div><span>wide</span> </div>", "<div><span>wide</span></div>"],
  ])("preserves whitespace at %s boundaries", async (_name: string, baselineMarkup: string, defaultMarkup: string) => {
    const paths = await fixture();
    await replace(path.join(paths.baselineDist, "guides/index.html"), /<\/body>/, `${baselineMarkup}</body>`);
    await replace(path.join(paths.defaultDist, "guides/index.html"), /<\/body>/, `${defaultMarkup}</body>`);
    await expect(audit(paths)).rejects.toThrow("guides/index.html differs from clean baseline");
  });

  it.each([
    ["unknown before structural", "<x-widget></x-widget> <div>block</div>", "<x-widget></x-widget><div>block</div>"],
    ["structural before unknown", "<div>block</div> <x-widget></x-widget>", "<div>block</div><x-widget></x-widget>"],
  ])("preserves whitespace with %s elements", async (_name: string, baselineMarkup: string, defaultMarkup: string) => {
    const paths = await fixture();
    await replace(path.join(paths.baselineDist, "guides/index.html"), /<\/body>/, `${baselineMarkup}</body>`);
    await replace(path.join(paths.defaultDist, "guides/index.html"), /<\/body>/, `${defaultMarkup}</body>`);
    await expect(audit(paths)).rejects.toThrow("guides/index.html differs from clean baseline");
  });

  it("preserves authored data-astro-source-note attributes", async () => {
    const paths = await fixture();
    await replace(path.join(paths.baselineDist, "guides/index.html"), /<main id="main" class="hub-main" data-rail-key="fixture" aria-label="Fixture hub">/, '<main id="main" class="hub-main" data-rail-key="fixture" aria-label="Fixture hub" data-astro-source-note="authored-one">');
    await replace(path.join(paths.defaultDist, "guides/index.html"), /<main id="main" class="hub-main" data-rail-key="fixture" aria-label="Fixture hub">/, '<main id="main" class="hub-main" data-rail-key="fixture" aria-label="Fixture hub" data-astro-source-note="authored-two">');
    await expect(audit(paths)).rejects.toThrow("guides/index.html main DOM differs between default and flagged builds");
  });

  it.each([
    ["script", "script"],
    ["style", "style"],
  ])("preserves data-astro-source-like strings inside %s content", async (_name: string, tag: string) => {
    const paths = await fixture();
    await replace(path.join(paths.baselineDist, "guides/index.html"), /<\/body>/, `<${tag}>const marker = ' data-astro-source-file="one"';</${tag}></body>`);
    await replace(path.join(paths.defaultDist, "guides/index.html"), /<\/body>/, `<${tag}>const marker = ' data-astro-source-file="two"';</${tag}></body>`);
    await expect(audit(paths)).rejects.toThrow("guides/index.html differs from clean baseline");
  });
  it.each([
    ["li", "<ul><li>one</li>\n  <li>two</li></ul>", "<ul><li>one</li><li>two</li></ul>"],
    ["dt/dd", "<dl><dt>term</dt>\n  <dd>definition</dd></dl>", "<dl><dt>term</dt><dd>definition</dd></dl>"],
    ["table rows", "<table><tbody><tr><td>one</td></tr>\n  <tr><td>two</td></tr></tbody></table>", "<table><tbody><tr><td>one</td></tr><tr><td>two</td></tr></tbody></table>"],
    ["table cells", "<table><tbody><tr><td>one</td>\n  <td>two</td></tr></tbody></table>", "<table><tbody><tr><td>one</td><td>two</td></tr></tbody></table>"],
    ["figure caption", "<figure><div>image</div>\n  <figcaption>caption</figcaption></figure>", "<figure><div>image</div><figcaption>caption</figcaption></figure>"],
  ])("ignores formatting indentation between structural %s elements", async (_name: string, baselineMarkup: string, defaultMarkup: string) => {
    const paths = await fixture();
    await replace(path.join(paths.baselineDist, "guides/index.html"), /<\/body>/, `${baselineMarkup}</body>`);
    await replace(path.join(paths.defaultDist, "guides/index.html"), /<\/body>/, `${defaultMarkup}</body>`);
    await expect(audit(paths)).resolves.toBeTruthy();
  });

  it.each([
    ["pre", "pre"],
    ["textarea", "textarea"],
    ["script", "script"],
    ["style", "style"],
  ])("preserves whitespace-only payloads inside %s", async (_name: string, tag: string) => {
    const paths = await fixture();
    await replace(path.join(paths.baselineDist, "guides/index.html"), /<\/body>/, `<${tag}>  \n </${tag}></body>`);
    await replace(path.join(paths.defaultDist, "guides/index.html"), /<\/body>/, `<${tag}> \n </${tag}></body>`);
    await expect(audit(paths)).rejects.toThrow("guides/index.html differs from clean baseline");
  });

  it.each([
    ["visible text", "p"],
    ["pre", "pre"],
    ["textarea", "textarea"],
    ["script", "script"],
    ["style", "style"],
  ])("rejects whitespace drift inside %s content", async (_name: string, tag: string) => {
    const paths = await fixture();
    await replace(path.join(paths.baselineDist, "guides/index.html"), /<\/body>/, `<${tag}>alpha  beta</${tag}></body>`);
    await replace(path.join(paths.defaultDist, "guides/index.html"), /<\/body>/, `<${tag}>alpha beta</${tag}></body>`);
    await expect(audit(paths)).rejects.toThrow("guides/index.html differs from clean baseline");
  });
});
