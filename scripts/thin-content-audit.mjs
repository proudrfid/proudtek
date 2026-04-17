#!/usr/bin/env node
/**
 * Thin-content audit script.
 *
 * Scans all editorial JSON definitions and reports:
 * - Near-duplicate clusters (>70% content similarity)
 * - Per-page unique content estimate
 * - Boilerplate ratio after dedup rules
 * - Pages with <300 words of unique content
 */
import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "node:fs";
import { promisify } from "node:util";

const globP = promisify(glob);

const EDITORIAL_DIR = path.join(process.cwd(), "src", "content", "editorial");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function wordCount(s) {
  return s.split(/\s+/).filter(Boolean).length;
}

function collectBriefTexts(brief) {
  const texts = new Set();
  for (const field of brief ?? []) {
    for (const item of field.items ?? []) texts.add(norm(item));
    if (field.text) texts.add(norm(field.text));
  }
  return texts;
}

function collectBriefLinkHrefs(brief) {
  const hrefs = new Set();
  for (const field of brief ?? []) {
    for (const link of field.links ?? []) hrefs.add(link.href);
  }
  return hrefs;
}

function isSectionDuplicateOfBrief(section, briefTexts) {
  const bullets = section.bullets ?? [];
  if (bullets.length === 0) return false;
  const matchCount = bullets.filter(b => briefTexts.has(norm(b))).length;
  return matchCount / bullets.length > 0.8;
}

// Estimate unique word count for a definition (after dedup rules)
function estimateUniqueWords(def) {
  const briefTexts = collectBriefTexts(def.brief);
  const briefLinkHrefs = collectBriefLinkHrefs(def.brief);

  let words = 0;

  // Summary + heroPoints (always unique per page)
  words += wordCount(def.summary);
  words += def.heroPoints.reduce((sum, p) => sum + wordCount(p), 0);

  // Brief fields
  for (const field of def.brief ?? []) {
    words += wordCount(field.label);
    if (field.text) words += wordCount(field.text);
    for (const item of field.items ?? []) words += wordCount(item);
  }

  // Sections (after dedup)
  const sections = def.sections.filter(s => !isSectionDuplicateOfBrief(s, briefTexts));
  for (const s of sections) {
    words += wordCount(s.title);
    if (s.intro) words += wordCount(s.intro);
    for (const p of s.paragraphs ?? []) words += wordCount(p);
    for (const b of s.bullets ?? []) words += wordCount(b);
    if (s.table) {
      for (const row of s.table.rows) words += row.reduce((sum, cell) => sum + wordCount(cell), 0);
    }
    // Extended section fields
    if (s.featureGrid) {
      for (const f of s.featureGrid.features ?? []) {
        words += wordCount(f.title) + wordCount(f.text);
      }
    }
    if (s.dataHighlight) {
      words += wordCount(s.dataHighlight.heading) + wordCount(s.dataHighlight.text);
      if (s.dataHighlight.source) words += wordCount(s.dataHighlight.source);
    }
    if (s.comparePanel) {
      for (const item of s.comparePanel.before ?? []) words += wordCount(item);
      for (const item of s.comparePanel.after ?? []) words += wordCount(item);
    }
    if (s.timeline) {
      for (const item of s.timeline.items ?? []) {
        words += wordCount(item.label) + wordCount(item.text);
      }
    }
    if (s.checklist) {
      for (const item of s.checklist) words += wordCount(item);
    }
    if (s.testimonial) {
      words += wordCount(s.testimonial.text) + wordCount(s.testimonial.source);
    }
    if (s.statBar) {
      for (const item of s.statBar.items ?? []) {
        words += wordCount(item.label);
      }
    }
  }

  // FAQ
  for (const f of def.faq) {
    words += wordCount(f.question) + wordCount(f.answer);
  }

  // ResourceCards (after dedup)
  const dedupedCards = def.resourceCards.filter(card => {
    const uniqueLinks = card.links.filter(l => !briefLinkHrefs.has(l.href));
    return uniqueLinks.length > 0;
  });
  for (const card of dedupedCards) {
    words += wordCount(card.title) + wordCount(card.description);
  }

  return words;
}

// Jaccard similarity on normalized word sets
function contentSimilarity(def1, def2) {
  function allText(def) {
    const parts = [def.summary, ...def.heroPoints];
    for (const s of def.sections) {
      if (s.intro) parts.push(s.intro);
      for (const p of s.paragraphs ?? []) parts.push(p);
      for (const b of s.bullets ?? []) parts.push(b);
    }
    for (const f of def.faq) {
      parts.push(f.question, f.answer);
    }
    return norm(parts.join(" "));
  }

  const words1 = new Set(allText(def1).split(/\s+/));
  const words2 = new Set(allText(def2).split(/\s+/));
  const intersection = [...words1].filter(w => words2.has(w)).length;
  const union = new Set([...words1, ...words2]).size;
  return union > 0 ? intersection / union : 0;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const files = await globP(path.join(EDITORIAL_DIR, "**/*.json"));
  const definitions = [];

  for (const file of files) {
    if (file.includes("_unused")) continue;
    const content = await fs.readFile(file, "utf8");
    const def = JSON.parse(content);
    definitions.push(def);
  }

  console.log(`\n📊 Thin-Content Audit — ${definitions.length} editorial pages\n`);

  // 1. Per-page unique word estimate
  const pageStats = definitions.map(def => ({
    route: def.route,
    group: def.group,
    uniqueWords: estimateUniqueWords(def),
    sectionCount: def.sections.filter(s => !isSectionDuplicateOfBrief(s, collectBriefTexts(def.brief))).length,
    faqCount: def.faq.length,
  }));

  // 2. Thin pages (<300 unique words)
  const thinPages = pageStats.filter(p => p.uniqueWords < 300).sort((a, b) => a.uniqueWords - b.uniqueWords);

  console.log(`🔴 Thin pages (<300 unique words): ${thinPages.length}`);
  for (const p of thinPages.slice(0, 15)) {
    console.log(`   ${p.uniqueWords.toString().padStart(4)} words  ${p.sectionCount} sections  ${p.route}`);
  }
  if (thinPages.length > 15) console.log(`   ... and ${thinPages.length - 15} more`);

  // 3. Pages with 0 sections after dedup
  const noSections = pageStats.filter(p => p.sectionCount === 0);
  console.log(`\n⚠️  Pages with 0 content sections (all deduplicated): ${noSections.length}`);
  for (const p of noSections.slice(0, 10)) {
    console.log(`   ${p.uniqueWords.toString().padStart(4)} words  ${p.route}`);
  }

  // 4. Group averages
  console.log("\n📈 Average unique words by group:");
  const groups = {};
  for (const p of pageStats) {
    if (!groups[p.group]) groups[p.group] = [];
    groups[p.group].push(p.uniqueWords);
  }
  // Also by route prefix for products/industries
  const routeGroups = { "/products/": [], "/industries/": [], "/solutions/": [], "/compare/": [], "/guides/": [], "/blog/": [] };
  for (const p of pageStats) {
    for (const prefix of Object.keys(routeGroups)) {
      if (p.route.startsWith(prefix)) routeGroups[prefix].push(p.uniqueWords);
    }
  }
  for (const [prefix, words] of Object.entries(routeGroups)) {
    if (words.length === 0) continue;
    const avg = Math.round(words.reduce((a, b) => a + b, 0) / words.length);
    const min = Math.min(...words);
    const max = Math.max(...words);
    console.log(`   ${prefix.padEnd(16)} ${words.length.toString().padStart(3)} pages  avg ${avg}  min ${min}  max ${max}`);
  }

  // 5. Near-duplicate cluster detection (pairwise similarity > 0.7)
  console.log("\n🔍 Near-duplicate clusters (Jaccard > 0.70):");
  const clusters = [];
  const clustered = new Set();

  for (let i = 0; i < definitions.length; i++) {
    if (clustered.has(i)) continue;
    const cluster = [i];
    for (let j = i + 1; j < definitions.length; j++) {
      if (clustered.has(j)) continue;
      const sim = contentSimilarity(definitions[i], definitions[j]);
      if (sim > 0.70) {
        cluster.push(j);
        clustered.add(j);
      }
    }
    if (cluster.length > 1) {
      clustered.add(i);
      clusters.push(cluster.map(idx => ({
        route: definitions[idx].route,
        uniqueWords: estimateUniqueWords(definitions[idx]),
      })));
    }
  }

  for (const cluster of clusters) {
    console.log(`   Cluster (${cluster.length} pages):`);
    for (const p of cluster) {
      console.log(`     ${p.uniqueWords.toString().padStart(4)} words  ${p.route}`);
    }
  }

  if (clusters.length === 0) console.log("   None found.");

  console.log(`\n✅ Audit complete.`);
}

main().catch(console.error);
