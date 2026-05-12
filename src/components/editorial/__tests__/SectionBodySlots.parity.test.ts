/**
 * Parity test — SectionIntro / SectionParagraphs / SectionList ↔ inline
 * expressions in `renderSection()` and `renderSectionList()`.
 *
 * Stage 2. Body slots are split into 3 small components matching the TS
 * function structure 1:1.
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import SectionIntro from "../SectionIntro.astro";
import SectionParagraphs from "../SectionParagraphs.astro";
import SectionList from "../SectionList.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import {
  introOnlySection,
  paragraphsSection,
  bulletsPlainSection,
  bulletsWorkflowSection,
  typicalCitations,
  noCitations,
} from "../../../lib/__tests__/fixtures/editorial";

// --- helpers ---------------------------------------------------------------

const INTRO_RE = /<p class="codex-editorial-section-intro"[\s\S]*?<\/p>/;
const PARAS_RE = /<p>[\s\S]*?<\/p>/g; // multiple <p> in sequence
const LIST_UL_RE = /<ul class="codex-editorial-list">[\s\S]*?<\/ul>/;
const LIST_OL_RE = /<ol class="codex-editorial-step-list">[\s\S]*?<\/ol>/;

async function renderIntro(props: { text: string; citations?: { sourcesId: string; sourcesCount: number } }): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(SectionIntro, { props });
}
async function renderParagraphs(props: { paragraphs: string[]; citations?: { sourcesId: string; sourcesCount: number } }): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(SectionParagraphs, { props });
}
async function renderList(props: { title: string; bullets: string[]; citations?: { sourcesId: string; sourcesCount: number } }): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(SectionList, { props });
}

// --- tests -----------------------------------------------------------------

describe("SectionIntro.astro ↔ inline intro expression parity", () => {
  it("plain text intro", async () => {
    const sectionHtml = __TEST__.renderSection(introOnlySection as never, "id", noCitations);
    const match = sectionHtml.match(INTRO_RE);
    if (!match) throw new Error("intro fragment not found");
    const astroHtml = await renderIntro({ text: introOnlySection.intro });
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(match[0]));
  });

  it("intro with HTML-significant chars + inline link", async () => {
    const text = 'Tom & Co. — see [our guide](/guides/x/) for "details".';
    const section = { title: "Test variant block", intro: text };
    const sectionHtml = __TEST__.renderSection(section as never, "id", noCitations);
    const match = sectionHtml.match(INTRO_RE);
    if (!match) throw new Error("intro fragment not found");
    const astroHtml = await renderIntro({ text });
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(match[0]));
  });
});

describe("SectionParagraphs.astro ↔ inline paragraphs expression parity", () => {
  it("2 paragraphs with link + citation marker", async () => {
    const sectionHtml = __TEST__.renderSection(paragraphsSection as never, "id", typicalCitations);
    const concatenated = (sectionHtml.match(PARAS_RE) ?? []).join("");
    const astroHtml = await renderParagraphs({
      paragraphs: paragraphsSection.paragraphs,
      citations: typicalCitations,
    });
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(concatenated));
  });

  it("empty paragraphs array: renders nothing", async () => {
    const astroHtml = await renderParagraphs({ paragraphs: [] });
    expect(normalizeHtml(astroHtml)).toBe("");
  });
});

describe("SectionList.astro ↔ renderSectionList parity (workflow-vs-plain switch)", () => {
  it("plain title → <ul class=codex-editorial-list>", async () => {
    const sectionHtml = __TEST__.renderSection(bulletsPlainSection as never, "id", noCitations);
    const match = sectionHtml.match(LIST_UL_RE);
    if (!match) throw new Error("plain ul fragment not found");
    const astroHtml = await renderList({
      title: bulletsPlainSection.title,
      bullets: bulletsPlainSection.bullets,
    });
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(match[0]));
  });

  it("workflow title → <ol class=codex-editorial-step-list> with Step N labels", async () => {
    const sectionHtml = __TEST__.renderSection(bulletsWorkflowSection as never, "id", noCitations);
    const match = sectionHtml.match(LIST_OL_RE);
    if (!match) throw new Error("workflow ol fragment not found");
    const astroHtml = await renderList({
      title: bulletsWorkflowSection.title,
      bullets: bulletsWorkflowSection.bullets,
    });
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(match[0]));
  });

  it("empty bullets: renders nothing on both sides", async () => {
    const section = { title: "Implementation steps", bullets: [] };
    const sectionHtml = __TEST__.renderSection(section as never, "id", noCitations);
    expect(sectionHtml.match(LIST_UL_RE)).toBeNull();
    expect(sectionHtml.match(LIST_OL_RE)).toBeNull();
    const astroHtml = await renderList({ title: section.title, bullets: section.bullets });
    expect(normalizeHtml(astroHtml)).toBe("");
  });
});
