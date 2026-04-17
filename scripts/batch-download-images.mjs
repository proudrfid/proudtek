#!/usr/bin/env node
/**
 * Batch download and process images from a JSON manifest.
 *
 * Usage:
 *   node scripts/batch-download-images.mjs manifest.json
 *
 * manifest.json format:
 *   [
 *     { "filename": "target-name.jpg", "url": "https://image.made-in-china.com/..." },
 *     ...
 *   ]
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const LANDING_DIR = path.join(process.cwd(), "public", "landing-images");
const MAX_DIM = 800;
const JPEG_QUALITY = 82;

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      Accept: "image/*,*/*",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function processAndSave(buffer, targetFilename) {
  const targetPath = path.join(LANDING_DIR, targetFilename);
  const ext = path.extname(targetFilename).toLowerCase();

  let pipeline = sharp(buffer).resize(MAX_DIM, MAX_DIM, {
    fit: "inside",
    withoutEnlargement: true,
  });

  if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: JPEG_QUALITY });
  } else if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  await pipeline.toFile(targetPath);
  const stat = fs.statSync(targetPath);
  return stat.size;
}

async function main() {
  const manifestPath = process.argv[2];
  if (!manifestPath) {
    console.error("Usage: node scripts/batch-download-images.mjs <manifest.json>");
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  let success = 0;
  let failed = 0;

  for (const entry of manifest) {
    try {
      const buffer = await downloadImage(entry.url);
      const size = await processAndSave(buffer, entry.filename);
      console.log(`✓ ${entry.filename} (${size} bytes)`);
      success++;
    } catch (err) {
      console.error(`✗ ${entry.filename}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} succeeded, ${failed} failed`);
}

main();
