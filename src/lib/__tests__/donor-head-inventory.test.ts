/**
 * Phase 0 Deliverable 2: Parser fixtures for edge cases
 *
 * Tests donor head asset classification against real WordPress/Kadence/plugin patterns.
 */

import { describe, it, expect } from 'vitest';
import { inventoryDonorHead } from '../seo/donor-head-inventory';
import { readFileSync } from 'fs';
import { join } from 'path';

const fixturesDir = join(__dirname, 'donor-head-fixtures');

function loadFixture(filename: string): string {
  return readFileSync(join(fixturesDir, filename), 'utf-8');
}

describe('inventoryDonorHead - WordPress core patterns', () => {
  it('classifies no-js script as wp-core', () => {
    const html = loadFixture('wp-no-js.html');
    const inventory = inventoryDonorHead(html);

    expect(inventory).toHaveLength(1);
    expect(inventory[0]).toMatchObject({
      type: 'script',
      classification: 'wp-core'
    });
  });

  it('classifies emoji assets as wp-core', () => {
    const html = loadFixture('wp-emoji.html');
    const inventory = inventoryDonorHead(html);

    // Should find emoji script + emoji styles
    expect(inventory.length).toBeGreaterThanOrEqual(2);

    const emojiAssets = inventory.filter(a =>
      a.source.includes('emoji') || a.source.includes('wp-smiley')
    );

    expect(emojiAssets.length).toBeGreaterThan(0);
    emojiAssets.forEach(asset => {
      expect(asset.classification).toBe('wp-core');
    });
  });

  it('classifies global-styles as base', () => {
    const html = loadFixture('wp-global-styles.html');
    const inventory = inventoryDonorHead(html);

    expect(inventory).toHaveLength(1);
    expect(inventory[0]).toMatchObject({
      type: 'style',
      classification: 'base'
    });
  });
});

describe('inventoryDonorHead - WordPress plugins', () => {
  it('classifies plugin assets as wp-plugin', () => {
    const html = loadFixture('wp-plugins.html');
    const inventory = inventoryDonorHead(html);

    expect(inventory.length).toBeGreaterThan(0);

    const pluginAssets = inventory.filter(a =>
      a.source.includes('ez-toc') || a.source.includes('translatepress')
    );

    expect(pluginAssets.length).toBeGreaterThan(0);
    pluginAssets.forEach(asset => {
      expect(asset.classification).toBe('wp-plugin');
    });
  });
});

describe('inventoryDonorHead - jQuery dependencies', () => {
  it('classifies jQuery and jQuery migrate as dependency', () => {
    const html = loadFixture('jquery-deps.html');
    const inventory = inventoryDonorHead(html);

    expect(inventory).toHaveLength(2);
    inventory.forEach(asset => {
      expect(asset.type).toBe('script');
      expect(asset.classification).toBe('dependency');
    });
  });
});

describe('inventoryDonorHead - Kadence patterns (from existing tests)', () => {
  it('classifies Kadence header CSS as legacy-shell', () => {
    const html = '<style id="kadence-global-inline-css">#masthead { z-index: 100; }</style>';
    const inventory = inventoryDonorHead(html);

    expect(inventory).toHaveLength(1);
    expect(inventory[0]).toMatchObject({
      type: 'style',
      classification: 'legacy-shell',
      reason: 'Kadence/WP shell component CSS'
    });
  });
});
