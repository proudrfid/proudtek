#!/usr/bin/env node
/**
 * Download and process a single product image.
 *
 * Usage:
 *   node scripts/process-image.mjs <url> <targetFilename>
 *
 * Example:
 *   node scripts/process-image.mjs "https://example.com/img.jpg" "rfid-asset-label.jpg"
 */
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const LANDING_DIR = path.join(process.cwd(), "public", "landing-images");
const MAX_DIM = 800;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 82;

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "Accept": "image/*,*/*",
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
    pipeline = pipeline.webp({ quality: WEBP_QUALITY });
  } else if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else {
    // Default to JPEG
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  const output = await pipeline.toBuffer();
  await fs.writeFile(targetPath, output);

  const sizeKB = (output.length / 1024).toFixed(1);
  console.log(`✅ ${targetFilename} — ${sizeKB} KB`);
  return { path: targetPath, size: output.length };
}

async function main() {
  const [url, targetFilename] = process.argv.slice(2);
  if (!url || !targetFilename) {
    console.error("Usage: node scripts/process-image.mjs <url> <targetFilename>");
    process.exit(1);
  }

  await fs.mkdir(LANDING_DIR, { recursive: true });
  const buffer = await downloadImage(url);
  await processAndSave(buffer, targetFilename);
}

main().catch((err) => {
  console.error(`❌ ${err.message}`);
  process.exit(1);
});
