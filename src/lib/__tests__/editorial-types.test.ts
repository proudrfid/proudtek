/**
 * Unit tests for pure helpers exported from editorial-types.ts.
 *
 * These functions are not HTML renderers — they are reusable pure
 * functions (text helpers, outline builder, type predicates) that any
 * future componentization will reuse. Locking their behavior makes the
 * path-3 refactor safer.
 */
import { describe, it, expect } from "vitest";

import {
  escapeHtml,
  escapeAttribute,
  renderInlineLinks,
  truncateEditorialText,
  isWorkflowSection,
  isSectionRoot,
  resolvePageType,
  detectSectionType,
  summarizeBriefField,
  summarizeSection,
  buildEditorialOutline,
} from "../editorial-types";

describe("escapeHtml", () => {
  it("escapes the 5 HTML-significant chars", () => {
    expect(escapeHtml("&<>\"'")).toBe("&amp;&lt;&gt;&quot;&#39;");
  });

  it("leaves plain text unchanged", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });

  it("escapes ampersand-then-special-char correctly", () => {
    expect(escapeHtml("Tom & Jerry < Movie >")).toBe("Tom &amp; Jerry &lt; Movie &gt;");
  });
});

describe("escapeAttribute", () => {
  it("delegates to escapeHtml", () => {
    expect(escapeAttribute("a & b \"quoted\"")).toBe("a &amp; b &quot;quoted&quot;");
  });
});

describe("renderInlineLinks", () => {
  it("escapes plain text without markdown links", () => {
    expect(renderInlineLinks("plain & text")).toBe("plain &amp; text");
  });

  it("converts a single markdown link to anchor", () => {
    expect(renderInlineLinks("see [docs](https://example.com)")).toBe(
      'see <a href="https://example.com">docs</a>',
    );
  });

  it("converts multiple markdown links", () => {
    expect(
      renderInlineLinks("read [a](/a) and [b](/b)"),
    ).toBe('read <a href="/a">a</a> and <a href="/b">b</a>');
  });

  it("escapes & inside the URL exactly once (BUG-1 fixed, Stage 1 2026-05)", () => {
    // Was: BUG-1 produced `&amp;amp;y` (double-escape) because escapeHtml
    // ran over the full text first, then escapeAttribute re-escaped the
    // already-escaped URL. Fixed in renderInlineLinks by walking the text
    // linearly and escaping link segments separately.
    // See docs/architecture/editorial-rendering-debt.md → BUG-1 row.
    expect(renderInlineLinks("[x](/path?q=&y)")).toBe(
      '<a href="/path?q=&amp;y">x</a>',
    );
  });

  it("escapes special chars in the label exactly once", () => {
    // Regression guard for the corner case where the label contains an
    // HTML-significant character. Prior to BUG-1 fix the label was
    // re-emitted from the regex match without explicit re-escape — it
    // happened to already be escaped by the upfront escapeHtml pass.
    // After the fix labels are escaped explicitly per segment.
    expect(renderInlineLinks("[a & b](/path)")).toBe(
      '<a href="/path">a &amp; b</a>',
    );
  });

  it("escapes surrounding text and link contents independently", () => {
    expect(
      renderInlineLinks("see Tom & Jerry [docs](https://x.test/?a=1&b=2) <here>"),
    ).toBe(
      'see Tom &amp; Jerry <a href="https://x.test/?a=1&amp;b=2">docs</a> &lt;here&gt;',
    );
  });
});

describe("truncateEditorialText", () => {
  it("returns short text unchanged", () => {
    expect(truncateEditorialText("hello", 100)).toBe("hello");
  });

  it("collapses whitespace runs", () => {
    expect(truncateEditorialText("a   b\n\nc", 100)).toBe("a b c");
  });

  it("truncates with ellipsis at limit", () => {
    expect(truncateEditorialText("aaaaaaaaaa", 5)).toBe("aaaa...");
  });
});

describe("isWorkflowSection", () => {
  it.each([
    ["Implementation workflow", true],
    ["Steps to deploy", true],
    ["Rollout playbook", true],
    ["Pricing", false],
    ["Why us", false],
  ])("isWorkflowSection(%j) === %s", (input, expected) => {
    expect(isWorkflowSection(input)).toBe(expected);
  });
});

describe("isSectionRoot", () => {
  it.each([
    ["/", true],
    ["/blog/", true],
    ["/products/all/", true],
    ["/blog/some-post/", false],
    ["/products/rfid-cards/", false],
  ])("isSectionRoot(%j) === %s", (input, expected) => {
    expect(isSectionRoot(input)).toBe(expected);
  });
});

describe("resolvePageType", () => {
  it.each([
    ["solutions", "solution"],
    ["compare", "compare"],
    ["blog", "blog"],
    ["faq", "faq"],
  ] as const)("resolvePageType(%j) === %j", (input, expected) => {
    expect(resolvePageType(input)).toBe(expected);
  });
});

describe("detectSectionType", () => {
  it.each([
    ["How we solve it", "solution"],
    ["Customer success story", "results"],
    ["Common pain points", "pain"],
    ["Project overview", ""],
  ])("detectSectionType(%j) === %j", (input, expected) => {
    expect(detectSectionType(input)).toBe(expected);
  });
});

describe("summarizeBriefField", () => {
  it("uses text when present", () => {
    expect(summarizeBriefField({ label: "X", text: "Hello world" })).toBe("Hello world");
  });

  it("falls back to first 2 items joined", () => {
    expect(
      summarizeBriefField({ label: "X", items: ["one", "two", "three"] }),
    ).toBe("one two");
  });

  it("default when nothing present", () => {
    expect(summarizeBriefField({ label: "X" })).toMatch(/checklist below/);
  });
});

describe("summarizeSection", () => {
  it("prefers intro", () => {
    expect(summarizeSection({ title: "T", intro: "Intro text." })).toBe("Intro text.");
  });

  it("falls back to first paragraph", () => {
    expect(
      summarizeSection({ title: "T", paragraphs: ["Para 1.", "Para 2."] }),
    ).toBe("Para 1.");
  });

  it("falls back to first 2 bullets", () => {
    expect(
      summarizeSection({ title: "T", bullets: ["Bullet A", "Bullet B", "Bullet C"] }),
    ).toBe("Bullet A Bullet B");
  });
});

describe("buildEditorialOutline", () => {
  it("computes ids + jump links for a typical definition", () => {
    const outline = buildEditorialOutline({
      route: "/blog/x/",
      group: "blog",
      title: "X",
      kicker: "K",
      summary: "S",
      heroPoints: [],
      imageAlt: "alt",
      imageSourceRoutes: [],
      sections: [{ title: "First Section" }, { title: "Second Section" }],
      resourceCards: [],
      faq: [{ question: "q?", answer: "a" }],
      primaryAction: { href: "/c/", label: "Contact" },
      secondaryActions: [],
    });

    expect(outline.snapshotId).toBe("at-a-glance");
    expect(outline.sectionLinks.map((s) => s.id)).toEqual(["first-section", "second-section"]);
    expect(outline.faqId).toBe("faq");
    expect(outline.nextStepId).toBe("next-step");
    expect(outline.jumpLinks.map((j) => j.label)).toEqual([
      "At a glance",
      "First Section",
      "Second Section",
      "Useful next pages",
      "FAQ",
      "Next step",
    ]);
  });

  it("omits faqId when faq is empty", () => {
    const outline = buildEditorialOutline({
      route: "/blog/y/",
      group: "blog",
      title: "Y",
      kicker: "K",
      summary: "S",
      heroPoints: [],
      imageAlt: "alt",
      imageSourceRoutes: [],
      sections: [],
      resourceCards: [],
      faq: [],
      primaryAction: { href: "/", label: "Go" },
      secondaryActions: [],
    });
    expect(outline.faqId).toBeNull();
  });
});
