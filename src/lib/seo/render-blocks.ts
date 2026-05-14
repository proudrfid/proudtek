/**
 * Pure HTML string render helpers for cross-page UI blocks.
 *
 * Used to render: trust bar, growth hub cards, quote brief checklist,
 * home industry selector, blog growth hub, and the article support
 * panel. No cheerio mutation — these return HTML strings that are
 * later injected into a page body by the body-normalization layer.
 *
 * Extracted from seo.ts during the P4b split (2026-05-08).
 */
import type { GrowthGroup } from "../seo";
import type { PageContext } from "./types";

import {
  HOME_GROWTH_GROUPS,
  HOME_COMPARE_LINKS,
  BLOG_GROWTH_GROUPS,
  HOME_GROWTH_BRIEF,
  GROWTH_ACTIONS,
} from "../seo-content";

import { escapeXml } from "./utils";

/* ── Trust bar ─────────────────────────────────────────────────── */

export function renderTrustBar(): string {
  return `<section class="codex-trust-bar" aria-label="Manufacturing credentials">
    <div class="codex-trust-bar__item">
      <strong>10+</strong><span>Years RFID Manufacturing</span>
    </div>
    <div class="codex-trust-bar__item">
      <strong>ISO 9001</strong><span>Certified Factory</span>
    </div>
    <div class="codex-trust-bar__item">
      <strong>500+</strong><span>Enterprise Clients</span>
    </div>
    <div class="codex-trust-bar__item">
      <strong>Shenzhen</strong><span>Factory Direct</span>
    </div>
  </section>`;
}

/* ── Growth hub blocks ─────────────────────────────────────────── */

export function renderGrowthHub(group: GrowthGroup): string {
  return `<section class="codex-growth-hub__group">
    <div class="codex-growth-hub__intro">
      <p class="codex-growth-hub__eyebrow">Priority path</p>
      <h2>${escapeXml(group.title)}</h2>
      <p>${escapeXml(group.description)}</p>
    </div>
    <div class="codex-growth-hub__grid">
      ${group.cards
        .map(
          (card) => `<a class="codex-growth-hub__card" href="${escapeXml(card.href)}">
            <span class="codex-growth-hub__card-eyebrow">${escapeXml(card.eyebrow)}</span>
            <strong>${escapeXml(card.title)}</strong>
            <span>${escapeXml(card.description)}</span>
          </a>`,
        )
        .join("")}
    </div>
  </section>`;
}

export function renderGrowthBrief(
  heading: string,
  description: string,
  briefEntries: string[] = HOME_GROWTH_BRIEF,
  actions: Array<{ label: string; href: string }> = GROWTH_ACTIONS,
): string {
  const checkSvgs = [
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 0 0-8 0v2"/><circle cx="12" cy="15" r="1"/></svg>`,
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  ];
  return `<section class="codex-quote-brief" aria-label="Quote checklist">
    <div class="codex-quote-brief__inner">
      <div class="codex-quote-brief__copy">
        <p class="codex-quote-brief__eyebrow">Ready to start?</p>
        <h2>${escapeXml(heading)}</h2>
        <p>${escapeXml(description)}</p>
        <div class="codex-quote-brief__cta">
          ${actions.map((entry, i) =>
            `<a class="codex-quote-brief__btn${i === 0 ? " codex-quote-brief__btn--primary" : ""}" href="${escapeXml(entry.href)}">${escapeXml(entry.label)}</a>`
          ).join("")}
        </div>
      </div>
      <div class="codex-quote-brief__checklist">
        <div class="codex-quote-brief__step-label">Include in your message</div>
        ${briefEntries.map((entry, i) =>
          `<div class="codex-quote-brief__item">
            <span class="codex-quote-brief__icon">${checkSvgs[i % checkSvgs.length]}</span>
            <span>${escapeXml(entry)}</span>
          </div>`
        ).join("")}
      </div>
    </div>
  </section>`;
}

/* ── Home industry selector ────────────────────────────────────── */

export function renderHomeIndustrySelector(): string {
  const group = HOME_GROWTH_GROUPS[0];
  if (!group) return "";

  const colors = ["#3d6b6b", "#2d6a4f", "#c39a5f", "#4a5568"];

  return `<section class="codex-industry-selector" aria-label="Choose your industry">
    <div class="codex-industry-selector__header">
      <h2>Find the right product path</h2>
      <p>Select your industry to get matched guides, samples and pricing.</p>
    </div>
    <div class="codex-industry-selector__grid">
      ${group.cards
        .map(
          (card, i) => `<a class="codex-industry-selector__card" href="${escapeXml(card.href)}" style="--accent: ${colors[i % colors.length]}">
            <span class="codex-industry-selector__eyebrow">${escapeXml(card.eyebrow)}</span>
            <strong>${escapeXml(card.title)}</strong>
            <span>${escapeXml(card.description)}</span>
            <span class="codex-industry-selector__arrow">&rarr;</span>
          </a>`,
        )
        .join("")}
    </div>
    <div class="codex-industry-selector__compare">
      <span>Need to compare options?</span>
      ${HOME_COMPARE_LINKS.map(
        (link) => `<a href="${escapeXml(link.href)}">${escapeXml(link.label)}</a>`,
      ).join(" · ")}
    </div>
  </section>`;
}

export function renderHomeQuoteBrief(): string {
  return renderGrowthBrief(
    "What to send for a quote",
    "A short, specific message gets you to the right sample plan or quote faster than another round of browsing.",
  );
}

/* ── Home resource trio — surfaces P0 entry pages ──────────────── */

/**
 * Three-card strip injected on the homepage between the hero and the
 * industry selector. Surfaces the highest-intent entry pages added in
 * the P0 lift (case studies, sample pack, comparison library) so they
 * are discoverable from the homepage, not just the Resources menu.
 */
export function renderHomeResourceTrio(): string {
  const cards = [
    {
      eyebrow: "Real deployments",
      title: "Case Studies — 6 industries",
      description:
        "Documented Proud Tek programmes across hospitality, industrial laundry, events, retail apparel, libraries, pharmaceuticals and restaurants. Chip choice, alternatives rejected, volume, and measured operational results.",
      href: "/case-studies/",
      accent: "#3d6b6b",
    },
    {
      eyebrow: "Free, 5-field form",
      title: "Sample Pack & RFQ Wizard",
      description:
        "Hold the chip first: a free 8–12-SKU sample pack (LF / HF / UHF) ships in 5–10 days. Or skip to a structured quote with the 5-step RFQ wizard — product family, frequency, quantity, printing, contact — under 2 minutes.",
      href: "/sample-pack/",
      accent: "#2d6a4f",
    },
    {
      eyebrow: "Settle the chip question",
      title: "Compare 31+ chip & material pairs",
      description:
        "MIFARE Classic vs Plus vs DESFire EV3, NTAG213/215/216, UCODE 8/9 vs Monza R6 vs Higgs-9, EM4100 vs T5577, PPS vs silicone laundry tag, UHF vs HF — side-by-side specifications, cloning economics, deployment fit.",
      href: "/compare/",
      accent: "#c39a5f",
    },
  ];

  return `<section class="codex-industry-selector codex-industry-selector--resources" aria-label="Resources for your project">
    <div class="codex-industry-selector__header">
      <h2>Skip the catalog — start with what your peers already chose</h2>
      <p>Case studies, a free sample pack and 31+ comparison pages drive most decisions before a quote conversation begins.</p>
    </div>
    <div class="codex-industry-selector__grid">
      ${cards
        .map(
          (card) => `<a class="codex-industry-selector__card" href="${escapeXml(card.href)}" style="--accent: ${card.accent}">
            <span class="codex-industry-selector__eyebrow">${escapeXml(card.eyebrow)}</span>
            <strong>${escapeXml(card.title)}</strong>
            <span>${escapeXml(card.description)}</span>
            <span class="codex-industry-selector__arrow">&rarr;</span>
          </a>`,
        )
        .join("")}
    </div>
  </section>`;
}

export function renderHomeGrowthHub(): string {
  return renderHomeIndustrySelector();
}

export function renderBlogGrowthHub(): string {
  return `<section class="codex-growth-hub codex-growth-hub--blog" aria-label="Research to inquiry paths">
    <div class="codex-growth-hub__hero">
      <p class="codex-growth-hub__eyebrow">From article to action</p>
      <h2>Use the blog to move into real buying decisions</h2>
      <p>The best article journeys lead into solution, comparison, compatibility, or contact pages that help buyers make a real decision.</p>
    </div>
    ${BLOG_GROWTH_GROUPS.map((group) => renderGrowthHub(group)).join("")}
    ${renderGrowthBrief(
      "What to send when you are ready to inquire",
      "Once the application is clear, a short project summary is enough to move from research into a real first conversation.",
    )}
  </section>`;
}

/* ── Article support panel ─────────────────────────────────────── */

export function renderArticleSupportBlock(context: PageContext): string {
  const summaryHtml =
    context.articleSummary.length > 0
      ? `<section class="codex-article-support__panel codex-article-summary"><h2>Guide summary</h2><ul>${context.articleSummary
          .map((entry) => `<li>${escapeXml(entry)}</li>`)
          .join("")}</ul></section>`
      : "";

  const guidanceHtml =
    context.articleGuidanceFields.length > 0
      ? `<section class="codex-article-support__panel codex-article-guidance"><h2>Buyer checklist</h2><dl>${context.articleGuidanceFields
          .map(
            (entry) =>
              `<div class="codex-article-support__row"><dt>${escapeXml(entry.label)}</dt><dd>${escapeXml(entry.value)}</dd></div>`,
          )
          .join("")}</dl></section>`
      : "";

  const relatedHtml =
    context.articleRelatedPages.length > 0
      ? `<section class="codex-article-support__panel codex-article-related"><h2>Best next pages</h2><ul>${context.articleRelatedPages
          .map((entry) => `<li><a href="${escapeXml(entry.url)}">${escapeXml(entry.name)}</a></li>`)
          .join("")}</ul></section>`
      : "";

  const sourcesHtml =
    context.articleSourceLinks.length > 0
      ? `<section class="codex-article-support__panel codex-article-sources"><h2>Sources</h2><ul>${context.articleSourceLinks
          .map((entry) => `<li><a href="${escapeXml(entry.url)}" rel="noopener noreferrer">${escapeXml(entry.name)}</a></li>`)
          .join("")}</ul></section>`
      : "";

  const faqHtml =
    context.faqEntries.length > 0
      ? `<section class="codex-article-support__panel codex-article-faq"><h2>Common questions</h2>${context.faqEntries
          .map(
            (entry) =>
              `<details><summary>${escapeXml(entry.question)}</summary><p>${escapeXml(entry.answer)}</p></details>`,
          )
          .join("")}</section>`
      : "";

  if (!summaryHtml && !guidanceHtml && !sourcesHtml && !relatedHtml && !faqHtml) {
    return "";
  }

  return `<section class="codex-article-support" aria-label="Article summary, buyer guidance, sources, and related pages"><div class="codex-article-support__grid">${summaryHtml}${guidanceHtml}${sourcesHtml}${relatedHtml}</div>${faqHtml}</section>`;
}
