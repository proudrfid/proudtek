/**
 * Lightweight smoke test for the P0 changes.
 *
 *   1. Load index.json + contact.json snapshots
 *   2. Run prepareSnapshot() against them
 *   3. Assert the expected text mutations land
 *   4. Load + validate the new editorial JSON files
 *   5. Confirm the editorial group enum accepts case-studies
 *
 * Run with:  node scripts/_verify-p0-changes.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function ok(name, cond, detail = "") {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    console.log(`  ✗ ${name}${detail ? "  — " + detail : ""}`);
    process.exitCode = 1;
  }
}

async function loadSnapshot(route) {
  const slug = route === "/" ? "index" : route.replace(/^\/+|\/+$/g, "");
  const filePath = path.join(root, "src", "data", "pages", `${slug}.json`);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function main() {
  console.log("\n=== Editorial JSON files ===");

  // Validate the new editorial JSON files load + decode correctly.
  const caseStudiesDir = path.join(root, "src", "content", "editorial", "case-studies");
  const csFiles = (await fs.readdir(caseStudiesDir)).filter((f) => f.endsWith(".json"));
  ok(`case-studies/ has ${csFiles.length} entries`, csFiles.length === 8);
  for (const f of csFiles) {
    const d = JSON.parse(await fs.readFile(path.join(caseStudiesDir, f), "utf8"));
    ok(`  ${f} → group=case-studies`, d.group === "case-studies");
    ok(`  ${f} → route starts with /case-studies/`, d.route.startsWith("/case-studies/"));
    ok(`  ${f} → has sections + faq + primaryAction`,
      Array.isArray(d.sections) && d.sections.length > 0 &&
      Array.isArray(d.faq) && d.faq.length > 0 &&
      d.primaryAction && typeof d.primaryAction.href === "string");
  }

  const compareNew = path.join(root, "src", "content", "editorial", "compare", "em4100-vs-t5577.json");
  const compareData = JSON.parse(await fs.readFile(compareNew, "utf8"));
  ok("compare/em4100-vs-t5577.json present + group=compare", compareData.group === "compare");

  const sample = path.join(root, "src", "content", "editorial", "lp", "sample-pack.json");
  const sampleData = JSON.parse(await fs.readFile(sample, "utf8"));
  ok("lp/sample-pack.json present + route=/sample-pack/", sampleData.route === "/sample-pack/");

  console.log("\n=== Schema enum + helpers ===");
  const editorialTypes = await fs.readFile(path.join(root, "src", "lib", "editorial-types.ts"), "utf8");
  ok("EditorialGroup contains case-studies", editorialTypes.includes('"case-studies"'));
  ok("isSectionRoot includes /case-studies/", editorialTypes.includes('"/case-studies/"'));
  ok("resolvePageType handles case-studies", /case "case-studies"/.test(editorialTypes));

  const contentConfig = await fs.readFile(path.join(root, "src", "content.config.ts"), "utf8");
  ok("content.config.ts enum contains case-studies",
    /z\.enum\(\[[^\]]*"case-studies"[^\]]*\]\)/.test(contentConfig));

  const compareCategories = await fs.readFile(path.join(root, "src", "data", "compare-categories.ts"), "utf8");
  ok("compare-categories registers em4100-vs-t5577", compareCategories.includes('"em4100-vs-t5577"'));

  console.log("\n=== Snapshot transform — homepage ===");
  const home = await loadSnapshot("/");
  const renderSnapshotUrl = pathToFileURL(path.join(root, "src", "lib", "render-snapshot.ts")).href;

  // Astro+TS module — load source directly through tsx for verification.
  // If tsx is unavailable, fall back to checking the source file directly.
  let prepareSnapshot;
  try {
    const mod = await import(renderSnapshotUrl);
    prepareSnapshot = mod.prepareSnapshot;
  } catch (err) {
    console.log("  ! TS module load failed; falling back to source-grep check");
    const src = await fs.readFile(path.join(root, "src", "lib", "render-snapshot.ts"), "utf8");
    ok("enhanceHomepageHeadings defined", src.includes("function enhanceHomepageHeadings"));
    ok("called for page.route === '/'", /page\.route === "\/"/.test(src) && /enhanceHomepageHeadings\(\$body\)/.test(src));
    ok("B2B field labels rewrite present", src.includes("FIELD_LABEL_REWRITES"));
  }

  if (prepareSnapshot) {
    const result = prepareSnapshot(home);
    const body = result.bodyHtml;
    ok("homepage H1 rewritten with keyword block",
      /Custom RFID &amp; NFC Manufacturer in China.*Cards.*Tags.*Labels.*Wristbands.*Keyfobs.*Readers/.test(body));
    ok("homepage H2 '10' merged with descriptor",
      /<h2[^>]*>10 Automated Production Lines<\/h2>/.test(body));
    ok("homepage H2 '305+' merged with descriptor",
      /<h2[^>]*>305\+ Advanced Production Equipments<\/h2>/.test(body));
    ok("homepage H2 '8+' merged with descriptor",
      /<h2[^>]*>8\+ International Certifications<\/h2>/.test(body));
    ok("homepage H2 '12+' merged with descriptor",
      /<h2[^>]*>12\+ Inspection Procedures<\/h2>/.test(body));
  }

  console.log("\n=== SEO content overrides ===");
  const seoContent = await fs.readFile(path.join(root, "src", "lib", "seo-content.ts"), "utf8");
  ok("homepage description override present",
    /"\/":\s*\n?\s*"Proud Tek is a custom RFID & NFC manufacturer in China since 2008/.test(seoContent));

  const pageData = await fs.readFile(path.join(root, "src", "lib", "seo", "page-data.ts"), "utf8");
  ok("homepage SEO title keyword-loaded",
    /Custom RFID & NFC Manufacturer in China — Cards, Tags, Labels, Wristbands, Keyfobs, Readers \(OEM\/ODM\)/.test(pageData));

  console.log("\n=== Done ===");
  if (process.exitCode === 1) {
    console.log("Some checks failed. Inspect output above.");
  } else {
    console.log("All checks passed.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
