#!/usr/bin/env node
/**
 * Generate WebP siblings for every .jpg / .png under
 * public/site-assets/wp-content/uploads/, leaving the originals
 * intact as <img src> fallbacks.
 *
 * Why we keep originals:
 *   render-snapshot.ts's upgradeImagesToPicture() wraps each <img>
 *   in a <picture> with a <source type="image/webp"> entry, but the
 *   inner <img src="*.jpg"> is the fallback for browsers without
 *   WebP support (~0.2% global today, still useful belt+braces). It
 *   also keeps backward compatibility with any hardcoded /uploads/
 *   .jpg paths inside structured data, social share previews, etc.
 *
 * Idempotent: if `<base>.webp` already exists, skip. Re-running this
 * script after adding new images only converts the new ones.
 *
 * Usage:
 *   node scripts/_generate-webp.mjs            # default
 *   FORCE=1 node scripts/_generate-webp.mjs    # re-encode even if .webp exists
 *
 * Output rule: WebP quality 80 (sharp default for "visually lossless"
 * for photos). Skips files smaller than 8KB (likely icons that won't
 * save measurable bytes on WebP and might increase size for tiny PNGs).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const UPLOADS_ROOT = path.join(REPO_ROOT, "public", "site-assets", "wp-content", "uploads");

const FORCE = process.env.FORCE === "1";
// Lowered to 2 KB so small site-wide assets like the header logo
// (~3-4 KB) get converted. Smaller files than 2 KB are typically
// favicons/sprites where WebP overhead outweighs savings.
const MIN_BYTES = 2 * 1024;
const QUALITY = 80;

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

async function main() {
  console.log(`[webp] scanning ${UPLOADS_ROOT}`);
  const files = await walk(UPLOADS_ROOT);
  console.log(`[webp] found ${files.length} source images`);

  let converted = 0;
  let skipped = 0;
  let savedBytes = 0;
  let smaller = 0;

  for (const file of files) {
    const webpPath = file.replace(/\.(jpe?g|png)$/i, ".webp");
    const stat = await fs.stat(file);
    if (stat.size < MIN_BYTES) {
      skipped++;
      continue;
    }
    if (!FORCE) {
      try {
        await fs.stat(webpPath);
        skipped++;
        continue;
      } catch {
        /* ENOENT → fall through to convert */
      }
    }
    try {
      await sharp(file).webp({ quality: QUALITY, effort: 4 }).toFile(webpPath);
      const webpStat = await fs.stat(webpPath);
      const delta = stat.size - webpStat.size;
      // Small PNGs (logos, icons) sometimes encode LARGER as WebP due
      // to the format's header/metadata overhead. If WebP isn't
      // smaller, delete it so render-snapshot.ts's upgradeImagesToWebP
      // sees no .webp sibling and the original is served unwrapped.
      if (webpStat.size >= stat.size) {
        await fs.unlink(webpPath);
        skipped++;
        continue;
      }
      savedBytes += delta;
      smaller++;
      converted++;
      if (converted % 50 === 0) {
        console.log(`[webp] ${converted} converted, ${(savedBytes / 1024 / 1024).toFixed(1)} MB saved so far`);
      }
    } catch (err) {
      console.error(`[webp] failed ${file}: ${err.message}`);
    }
  }

  console.log("");
  console.log(`[webp] DONE`);
  console.log(`  converted:        ${converted}`);
  console.log(`  skipped (exists): ${skipped}`);
  console.log(`  webp smaller:     ${smaller} / ${converted}`);
  console.log(`  total saved:      ${(savedBytes / 1024 / 1024).toFixed(2)} MB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
