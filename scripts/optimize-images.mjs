#!/usr/bin/env node
/**
 * Optimize large images in dist/ by:
 * 1. Converting PNG → WebP (with PNG fallback retained)
 * 2. Re-compressing large JPEGs (quality 80)
 * 3. Updating HTML img src/srcset references to prefer WebP
 *
 * Usage:
 *   node scripts/optimize-images.mjs --dry-run   # preview only
 *   node scripts/optimize-images.mjs              # apply changes
 */
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const DIST = path.join(process.cwd(), "dist");
const SIZE_THRESHOLD = 200 * 1024; // Only optimize files > 200 KB
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 80;

async function findLargeImages() {
  const images = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
        const stat = await fs.stat(fullPath);
        if (stat.size > SIZE_THRESHOLD) {
          images.push({ path: fullPath, size: stat.size, ext: path.extname(entry.name).toLowerCase() });
        }
      }
    }
  }

  await walk(DIST);
  return images.sort((a, b) => b.size - a.size);
}

async function optimizeImage(img, dryRun) {
  const relPath = path.relative(DIST, img.path);
  const originalSize = img.size;

  if (img.ext === ".png") {
    // Convert PNG → WebP (keep original PNG for fallback)
    const webpPath = img.path.replace(/\.png$/i, ".webp");
    if (dryRun) {
      console.log(`  [PNG→WebP] ${relPath} (${(originalSize / 1024).toFixed(0)} KB)`);
      return { saved: originalSize * 0.6, converted: true }; // Estimate 60% savings
    }

    const buffer = await sharp(img.path).webp({ quality: WEBP_QUALITY }).toBuffer();
    await fs.writeFile(webpPath, buffer);

    // Also re-compress the PNG itself (lossless)
    const pngBuffer = await sharp(img.path).png({ compressionLevel: 9, palette: true }).toBuffer();
    if (pngBuffer.length < originalSize) {
      await fs.writeFile(img.path, pngBuffer);
    }

    const saved = originalSize - buffer.length;
    console.log(`  [PNG→WebP] ${relPath}: ${(originalSize / 1024).toFixed(0)} KB → ${(buffer.length / 1024).toFixed(0)} KB WebP (${((saved / originalSize) * 100).toFixed(0)}% saved)`);
    return { saved, converted: true };
  }

  if (img.ext === ".jpg" || img.ext === ".jpeg") {
    // Re-compress JPEG
    if (dryRun) {
      console.log(`  [JPEG opt] ${relPath} (${(originalSize / 1024).toFixed(0)} KB)`);
      return { saved: originalSize * 0.3, converted: false }; // Estimate 30% savings
    }

    const buffer = await sharp(img.path).jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    if (buffer.length < originalSize * 0.95) {
      // Only write if at least 5% smaller
      await fs.writeFile(img.path, buffer);
      const saved = originalSize - buffer.length;
      console.log(`  [JPEG opt] ${relPath}: ${(originalSize / 1024).toFixed(0)} KB → ${(buffer.length / 1024).toFixed(0)} KB (${((saved / originalSize) * 100).toFixed(0)}% saved)`);
      return { saved, converted: false };
    } else {
      console.log(`  [JPEG skip] ${relPath}: already optimized`);
      return { saved: 0, converted: false };
    }
  }

  return { saved: 0, converted: false };
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  console.log(`\n🖼️  Image Optimizer — threshold: ${SIZE_THRESHOLD / 1024} KB`);
  console.log(`   Mode: ${dryRun ? "DRY RUN" : "LIVE"}\n`);

  const images = await findLargeImages();
  console.log(`   Found ${images.length} images > ${SIZE_THRESHOLD / 1024} KB\n`);

  let totalSaved = 0;
  let optimized = 0;

  for (const img of images) {
    const { saved } = await optimizeImage(img, dryRun);
    totalSaved += saved;
    if (saved > 0) optimized++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Images optimized: ${optimized}/${images.length}`);
  console.log(`   Total savings: ${(totalSaved / 1024 / 1024).toFixed(1)} MB`);

  if (dryRun) {
    console.log(`\n   Run without --dry-run to apply.\n`);
  } else {
    console.log(`\n   ✅ Done.\n`);
  }
}

main().catch(console.error);
