/**
 * Phase 1: Native-safe head filtering tests
 */

import { describe, it, expect } from 'vitest';
import { applyHeadPolicy, rebuildHeadHtml, NATIVE_HEAD_POLICY } from '../seo/head-policy';
import type { DonorHeadAsset } from '../seo/donor-head-inventory';

describe('applyHeadPolicy', () => {
  const sampleAssets: DonorHeadAsset[] = [
    {
      type: 'style',
      source: '<style id="kadence-global">...</style>',
      classification: 'legacy-shell',
      reason: 'Kadence CSS',
    },
    {
      type: 'script',
      source: '<script>window._wpemojiSettings = {...};</script>',
      classification: 'wp-core',
      reason: 'WordPress emoji',
    },
    {
      type: 'script',
      source: '<script src="https://www.googletagmanager.com/gtag/js"></script>',
      classification: 'analytics',
      reason: 'Google Analytics',
    },
    {
      type: 'style',
      source: '<style id="woocommerce-inline">...</style>',
      classification: 'legacy-shell',
      reason: 'WooCommerce CSS',
    },
  ];

  it('keeps all assets for snapshot routes', () => {
    const filtered = applyHeadPolicy('/products/rfid-readers/', sampleAssets, false);
    expect(filtered).toHaveLength(4);
    expect(filtered).toEqual(sampleAssets);
  });

  it('filters legacy-shell CSS for native routes', () => {
    const filtered = applyHeadPolicy('/blog/', sampleAssets, true);

    expect(filtered).toHaveLength(2);
    expect(filtered.map((a) => a.classification)).toEqual(['wp-core', 'analytics']);

    // Verify Kadence and WooCommerce CSS were filtered
    expect(filtered.find((a) => a.source.includes('kadence'))).toBeUndefined();
    expect(filtered.find((a) => a.source.includes('woocommerce'))).toBeUndefined();
  });

  it('retains wp-core, analytics, fonts, dependencies on native routes', () => {
    const diverseAssets: DonorHeadAsset[] = [
      { type: 'style', source: '<style>kadence</style>', classification: 'legacy-shell' },
      { type: 'script', source: '<script>emoji</script>', classification: 'wp-core' },
      { type: 'link', source: '<link href="fonts.googleapis.com">', classification: 'font' },
      { type: 'script', source: '<script src="jquery.js">', classification: 'dependency' },
      { type: 'script', source: '<script src="gtag.js">', classification: 'analytics' },
      { type: 'style', source: '<style>ez-toc</style>', classification: 'wp-plugin' },
    ];

    const filtered = applyHeadPolicy('/guides/', diverseAssets, true);

    expect(filtered).toHaveLength(5);
    expect(filtered.find((a) => a.classification === 'legacy-shell')).toBeUndefined();
    expect(filtered.find((a) => a.classification === 'wp-core')).toBeDefined();
    expect(filtered.find((a) => a.classification === 'font')).toBeDefined();
    expect(filtered.find((a) => a.classification === 'dependency')).toBeDefined();
    expect(filtered.find((a) => a.classification === 'analytics')).toBeDefined();
    expect(filtered.find((a) => a.classification === 'wp-plugin')).toBeDefined();
  });
});

describe('rebuildHeadHtml', () => {
  it('concatenates filtered asset sources', () => {
    const assets: DonorHeadAsset[] = [
      { type: 'script', source: '<script>A</script>', classification: 'wp-core' },
      { type: 'style', source: '<style>B</style>', classification: 'base' },
    ];

    const html = rebuildHeadHtml(assets);
    expect(html).toBe('<script>A</script>\n<style>B</style>');
  });

  it('handles empty filtered arrays', () => {
    const html = rebuildHeadHtml([]);
    expect(html).toBe('');
  });
});

describe('NATIVE_HEAD_POLICY config', () => {
  it('blocks only legacy-shell', () => {
    expect(NATIVE_HEAD_POLICY.blockedCategories).toEqual(['legacy-shell']);
  });

  it('allows wp-core, base, fonts, analytics, dependencies, plugins', () => {
    expect(NATIVE_HEAD_POLICY.allowedCategories).toContain('wp-core');
    expect(NATIVE_HEAD_POLICY.allowedCategories).toContain('base');
    expect(NATIVE_HEAD_POLICY.allowedCategories).toContain('font');
    expect(NATIVE_HEAD_POLICY.allowedCategories).toContain('analytics');
    expect(NATIVE_HEAD_POLICY.allowedCategories).toContain('dependency');
    expect(NATIVE_HEAD_POLICY.allowedCategories).toContain('wp-plugin');
  });
});
