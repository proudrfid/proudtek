/**
 * Phase 1: Native-safe head filtering policy
 *
 * Filters donor head assets based on route type and asset classification.
 * Native routes block legacy-shell CSS to prevent Kadence/WooCommerce conflicts.
 */

import type { DonorHeadAsset, DonorAssetClassification } from './donor-head-inventory';

export interface HeadPolicyConfig {
  blockedCategories: DonorAssetClassification[];
  allowedCategories: DonorAssetClassification[];
}

/**
 * Native routes block legacy-shell CSS (Kadence/WooCommerce theme CSS)
 * but retain WordPress core, fonts, analytics, dependencies, and plugins.
 */
export const NATIVE_HEAD_POLICY: HeadPolicyConfig = {
  blockedCategories: ['legacy-shell'],
  allowedCategories: ['wp-core', 'base', 'font', 'analytics', 'dependency', 'wp-plugin', 'seo'],
};

/**
 * Apply head filtering policy based on route type.
 *
 * @param route - The current route (e.g., '/blog/')
 * @param assets - Donor head assets from Phase 0 inventory
 * @param isNativeRoute - Whether this route uses native SiteShell
 * @returns Filtered assets (removes legacy-shell CSS for native routes)
 */
export function applyHeadPolicy(
  route: string,
  assets: DonorHeadAsset[],
  isNativeRoute: boolean,
): DonorHeadAsset[] {
  if (!isNativeRoute) {
    // Snapshot routes: keep all donor assets (legacy behavior)
    return assets;
  }

  // Native routes: filter according to policy
  const filtered = assets.filter((asset) => {
    // Block legacy-shell CSS
    if (NATIVE_HEAD_POLICY.blockedCategories.includes(asset.classification)) {
      if (import.meta.env.DEV) {
        console.log(`[HeadPolicy] Filtered ${asset.classification}: ${asset.source.substring(0, 60)}...`);
      }
      return false;
    }

    // Allow everything else
    return true;
  });

  if (import.meta.env.DEV) {
    console.log(`[HeadPolicy] ${route}: ${assets.length} → ${filtered.length} assets (${assets.length - filtered.length} filtered)`);
  }

  return filtered;
}

/**
 * Reconstruct filtered headHtml from filtered assets.
 *
 * @param filteredAssets - Assets that passed the head policy
 * @returns Reconstructed headHtml string
 */
export function rebuildHeadHtml(filteredAssets: DonorHeadAsset[]): string {
  return filteredAssets.map((asset) => asset.source).join('\n');
}
