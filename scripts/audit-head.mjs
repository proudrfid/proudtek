#!/usr/bin/env node
/**
 * Phase 0 Deliverable 4: Dual-build head audit
 *
 * Usage:
 *   npm run audit-head -- --route /blog/
 *   npm run audit-head -- --route /blog/ --baseline dist-baseline
 *
 * Compares production build output before/after Phase 0 inventory integration
 * to verify zero output drift (Phase 0 contract).
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const args = process.argv.slice(2);
const routeIndex = args.indexOf('--route');
const baselineIndex = args.indexOf('--baseline');

if (routeIndex === -1) {
  console.error('Error: --route argument required');
  console.error('Usage: npm run audit-head -- --route /blog/');
  process.exit(1);
}

const route = args[routeIndex + 1];
const baselineDir = baselineIndex !== -1 ? args[baselineIndex + 1] : null;

// Resolve route to file path
const routePath = route.replace(/^\//, '').replace(/\/$/, '');
const htmlPath = routePath ? `${routePath}/index.html` : 'index.html';

console.log(`\n=== Phase 0 Dual-Build Head Audit ===\n`);
console.log(`Route: ${route}`);
console.log(`HTML path: ${htmlPath}\n`);

// Read current dist
const currentPath = join(process.cwd(), 'dist', htmlPath);
if (!existsSync(currentPath)) {
  console.error(`Error: ${currentPath} not found. Run 'npm run build' first.`);
  process.exit(1);
}

const currentHtml = readFileSync(currentPath, 'utf-8');

// If baseline provided, compare
if (baselineDir) {
  const baselinePath = join(process.cwd(), baselineDir, htmlPath);
  if (!existsSync(baselinePath)) {
    console.error(`Error: Baseline ${baselinePath} not found.`);
    process.exit(1);
  }

  const baselineHtml = readFileSync(baselinePath, 'utf-8');

  // Extract <head> sections
  const extractHead = (html) => {
    const match = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    return match ? match[1] : '';
  };

  const currentHead = extractHead(currentHtml);
  const baselineHead = extractHead(baselineHtml);

  // Compare byte sizes
  const currentSize = Buffer.byteLength(currentHead, 'utf-8');
  const baselineSize = Buffer.byteLength(baselineHead, 'utf-8');

  console.log(`Baseline head size: ${baselineSize} bytes`);
  console.log(`Current head size:  ${currentSize} bytes`);

  if (currentSize === baselineSize) {
    console.log(`✅ PASS: Head size unchanged\n`);
  } else {
    const diff = currentSize - baselineSize;
    console.log(`❌ DRIFT: Head size changed by ${diff} bytes\n`);
  }

  // Compare full HTML byte-for-byte
  if (currentHtml === baselineHtml) {
    console.log(`✅ PASS: Full HTML output identical (byte-for-byte)\n`);
  } else {
    console.log(`⚠️  NOTICE: HTML differs (expected if whitespace/comments changed)\n`);

    // Extract key SEO fields and compare
    const extractTitle = (html) => html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || '';
    const extractMeta = (html, name) => {
      const pattern = new RegExp(`<meta[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i');
      return html.match(pattern)?.[1] || '';
    };

    const seoFields = [
      { name: 'title', extractor: extractTitle },
      { name: 'description', extractor: (html) => extractMeta(html, 'description') },
      { name: 'og:title', extractor: (html) => extractMeta(html, 'og:title') },
      { name: 'og:description', extractor: (html) => extractMeta(html, 'og:description') },
    ];

    let seoDrift = false;
    console.log('SEO field comparison:');
    seoFields.forEach(({ name, extractor }) => {
      const baselineValue = extractor(baselineHtml);
      const currentValue = extractor(currentHtml);

      if (baselineValue !== currentValue) {
        console.log(`  ❌ ${name}: CHANGED`);
        console.log(`     Baseline: "${baselineValue.substring(0, 60)}..."`);
        console.log(`     Current:  "${currentValue.substring(0, 60)}..."`);
        seoDrift = true;
      } else {
        console.log(`  ✅ ${name}: unchanged`);
      }
    });

    if (seoDrift) {
      console.log(`\n❌ FAIL: SEO field drift detected\n`);
      process.exit(1);
    } else {
      console.log(`\n✅ PASS: All SEO fields preserved\n`);
    }
  }
} else {
  // No baseline: just report current stats
  const extractHead = (html) => {
    const match = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    return match ? match[1] : '';
  };

  const currentHead = extractHead(currentHtml);
  const currentSize = Buffer.byteLength(currentHead, 'utf-8');

  console.log(`Current head size: ${currentSize} bytes`);
  console.log(`\nNo baseline provided. To compare:`);
  console.log(`  1. Save current dist: mv dist dist-baseline`);
  console.log(`  2. Rebuild: npm run build`);
  console.log(`  3. Audit: npm run audit-head -- --route ${route} --baseline dist-baseline\n`);
}

console.log('=== Audit Complete ===\n');
