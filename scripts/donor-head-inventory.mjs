#!/usr/bin/env node
/**
 * Phase 0 Deliverable 1: Donor head inventory CLI
 *
 * Usage:
 *   npm run inventory -- --route /blog/
 *   npm run inventory -- --route /guides/ --format json
 *
 * Outputs classified donor head assets for the specified route.
 *
 * Note: Uses dynamic import to load the compiled TypeScript module.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const routeIndex = args.indexOf('--route');
const formatIndex = args.indexOf('--format');

if (routeIndex === -1) {
  console.error('Error: --route argument required');
  console.error('Usage: npm run inventory -- --route /blog/');
  process.exit(1);
}

const route = args[routeIndex + 1];
const format = formatIndex !== -1 ? args[formatIndex + 1] : 'text';

// Read the snapshot data for the route
const dataPath = join(process.cwd(), 'src/data/pages', route.replace(/^\//, '').replace(/\/$/, '') + '.json');

let pageData;
try {
  pageData = JSON.parse(readFileSync(dataPath, 'utf-8'));
} catch (err) {
  console.error(`Error: Could not read page data for route ${route}`);
  console.error(`Expected path: ${dataPath}`);
  process.exit(1);
}

// headHtml is at the top level in snapshot data files
if (!pageData.headHtml) {
  console.error(`Error: No headHtml found for route ${route}`);
  console.error(`Available keys: ${Object.keys(pageData).join(', ')}`);
  process.exit(1);
}

// Dynamic import of the TypeScript module (requires it to be compiled first)
let inventoryDonorHead;
try {
  const module = await import('../dist/_astro/donor-head-inventory.js').catch(() =>
    import('../src/lib/seo/donor-head-inventory.ts')
  );
  inventoryDonorHead = module.inventoryDonorHead;
} catch (err) {
  console.error('Error: Could not load donor-head-inventory module.');
  console.error('Make sure the project is built first: npm run build');
  console.error('Or run with tsx: npx tsx scripts/donor-head-inventory.mjs --route /blog/');
  process.exit(1);
}

const inventory = inventoryDonorHead(pageData.headHtml);

if (format === 'json') {
  console.log(JSON.stringify(inventory, null, 2));
} else {
  console.log(`\nDonor head inventory for ${route}:\n`);
  console.log(`Total assets: ${inventory.length}\n`);

  const byClassification = inventory.reduce((acc, asset) => {
    acc[asset.classification] = (acc[asset.classification] || 0) + 1;
    return acc;
  }, {});

  console.log('By classification:');
  Object.entries(byClassification)
    .sort((a, b) => b[1] - a[1])
    .forEach(([classification, count]) => {
      console.log(`  ${classification}: ${count}`);
    });

  console.log('\nDetailed assets:');
  inventory.forEach((asset, i) => {
    const preview = asset.source.substring(0, 80).replace(/\n/g, ' ');
    console.log(`\n[${i + 1}] ${asset.type} (${asset.classification})`);
    console.log(`    ${preview}...`);
    if (asset.reason) {
      console.log(`    Reason: ${asset.reason}`);
    }
  });
}
