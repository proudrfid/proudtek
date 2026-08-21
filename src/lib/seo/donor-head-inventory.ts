/**
 * Phase 0 Deliverable 1: Donor head asset inventory and classification
 *
 * Parses donor WordPress/Kadence headHtml and classifies each asset by type
 * and purpose. This is a read-only analysis step with no output changes.
 */

export type DonorAssetType = 'style' | 'link' | 'script' | 'meta' | 'font' | 'unknown';

export type DonorAssetClassification =
  | 'legacy-shell'     // Kadence header/drawer/footer CSS
  | 'seo'              // OG, Twitter, canonical, description
  | 'analytics'        // GA4, GTM, third-party tracking
  | 'font'             // @font-face, font preloads
  | 'base'             // Resets, base styles, global tokens
  | 'wp-core'          // WordPress core features (emoji, no-js)
  | 'wp-plugin'        // WordPress plugin assets (ez-toc, translatepress)
  | 'dependency'       // jQuery, libraries
  | 'unknown';         // Unclassified, needs review

export interface DonorHeadAsset {
  type: DonorAssetType;
  source: string;
  classification: DonorAssetClassification;
  reason?: string;
}

/**
 * Classify a single HTML fragment from donor headHtml.
 */
function classifyAsset(source: string): Pick<DonorHeadAsset, 'type' | 'classification' | 'reason'> {
  const lowerSource = source.toLowerCase();

  // Determine type
  let type: DonorAssetType = 'unknown';
  if (lowerSource.startsWith('<style')) type = 'style';
  else if (lowerSource.startsWith('<link')) type = 'link';
  else if (lowerSource.startsWith('<script')) type = 'script';
  else if (lowerSource.startsWith('<meta')) type = 'meta';

  // Classify by patterns

  // SEO meta tags
  if (type === 'meta') {
    if (
      lowerSource.includes('property="og:') ||
      lowerSource.includes('name="twitter:') ||
      lowerSource.includes('name="description"') ||
      lowerSource.includes('rel="canonical"')
    ) {
      return { type, classification: 'seo', reason: 'OG/Twitter/SEO meta tag' };
    }
  }

  // Analytics/tracking
  if (
    lowerSource.includes('google-analytics') ||
    lowerSource.includes('googletagmanager') ||
    lowerSource.includes('gtag') ||
    lowerSource.includes('analytics.js') ||
    lowerSource.includes('fbevents.js')
  ) {
    return { type, classification: 'analytics', reason: 'Third-party analytics' };
  }

  // Fonts
  if (
    lowerSource.includes('@font-face') ||
    lowerSource.includes('fonts.googleapis.com') ||
    lowerSource.includes('fonts.gstatic.com') ||
    (type === 'link' && lowerSource.includes('rel="preload"') && lowerSource.includes('as="font"'))
  ) {
    return { type, classification: 'font', reason: 'Font asset or preload' };
  }

  // Kadence/WordPress legacy shell CSS
  if (type === 'style' || (type === 'link' && lowerSource.includes('rel="stylesheet"'))) {
    if (
      lowerSource.includes('#masthead') ||
      lowerSource.includes('.site-header') ||
      lowerSource.includes('#mobile-drawer') ||
      lowerSource.includes('.mobile-toggle') ||
      lowerSource.includes('#colophon') ||
      lowerSource.includes('.site-footer') ||
      lowerSource.includes('kadence') ||
      lowerSource.includes('woocommerce') ||
      lowerSource.includes('.drawer-') ||
      lowerSource.includes('--global-palette')
    ) {
      return { type, classification: 'legacy-shell', reason: 'Kadence/WP shell component CSS' };
    }
  }

  // Base/reset styles and WordPress global-styles
  if (type === 'style') {
    if (
      lowerSource.includes('id="global-styles-inline-css"') ||
      lowerSource.includes('--wp--preset--')
    ) {
      return { type, classification: 'base', reason: 'WordPress global styles / CSS custom properties' };
    }

    if (source.length < 500 && (
      lowerSource.includes('* {') ||
      lowerSource.includes('html {') ||
      lowerSource.includes('body {') ||
      lowerSource.includes(':root {')
    )) {
      return { type, classification: 'base', reason: 'Reset or root-level base style' };
    }
  }

  // WordPress core features
  if (
    lowerSource.includes('no-js') ||
    lowerSource.includes('emoji') ||
    lowerSource.includes('wp-smiley') ||
    lowerSource.includes('_wpemojisettings') ||
    lowerSource.includes('id="wp-emoji-') ||
    lowerSource.includes('id="classic-theme-styles-')
  ) {
    return { type, classification: 'wp-core', reason: 'WordPress core feature (emoji, theme compat, no-js)' };
  }

  // WordPress plugins
  if (
    lowerSource.includes('/wp-content/plugins/') ||
    lowerSource.includes('id="ez-toc-') ||
    lowerSource.includes('translatepress') ||
    lowerSource.includes('trp-')
  ) {
    return { type, classification: 'wp-plugin', reason: 'WordPress plugin asset' };
  }

  // jQuery and common dependencies
  if (
    lowerSource.includes('jquery') ||
    lowerSource.includes('/wp-includes/js/')
  ) {
    return { type, classification: 'dependency', reason: 'jQuery or WordPress bundled library' };
  }

  // Default: unknown
  return { type, classification: 'unknown' };
}

/**
 * Parse donor headHtml and return an inventory of classified assets.
 *
 * This function does NOT modify any output. It is a pure analysis tool
 * for Phase 0 visibility.
 */
export function inventoryDonorHead(headHtml: string): DonorHeadAsset[] {
  const inventory: DonorHeadAsset[] = [];

  // Simple regex-based parser (sufficient for Phase 0 classification)
  // Matches: <style...>...</style>, <link.../>, <script...>...</script>, <meta.../>
  const tagPattern = /<(style|link|script|meta)(\s[^>]*)?>[\s\S]*?<\/\1>|<(style|link|script|meta)(\s[^>]*)?\/>/gi;

  let match;
  while ((match = tagPattern.exec(headHtml)) !== null) {
    const source = match[0];
    const { type, classification, reason } = classifyAsset(source);
    inventory.push({ type, source, classification, reason });
  }

  return inventory;
}
