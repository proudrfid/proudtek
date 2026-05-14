#!/usr/bin/env bash
# Verify PR-3 (audit/p0-perf-head) acceptance checks.
#
# Run after a fresh build:
#   npm run build && bash scripts/_verify-pr-3.sh
#
# Uses BSD-grep-compatible patterns (no -P / no \1 lookbehind etc.).

set -eo pipefail
cd "$(dirname "$0")/.."

if [ ! -d dist ]; then
  echo "[ERROR] dist/ not found. Run: npm run build"
  exit 1
fi

pass=0
fail=0
check() {
  local name="$1"
  local cmd="$2"
  if eval "$cmd" > /dev/null 2>&1; then
    echo "  v $name"
    pass=$((pass + 1))
  else
    echo "  x $name"
    eval "$cmd" 2>&1 | head -5 | sed 's/^/      /'
    fail=$((fail + 1))
  fi
}

# Pages we inspect for head-content checks.
SAMPLE_PAGES=(
  "dist/index.html"
  "dist/about/index.html"
  "dist/contact/index.html"
  "dist/products/rfid-cards/mifare-desfire-ev3-card/index.html"
  "dist/case-studies/hospitality-hotel-key-card-rollout/index.html"
  "dist/compare/em4100-vs-t5577/index.html"
  "dist/blog/index.html"
)

echo
echo "──────── P0-P1 — LCP preload href fallback ────────"
# Pages that DO emit an LCP preload (home + contact skip it by design).
LCP_PAGES=(
  "dist/about/index.html"
  "dist/products/rfid-cards/mifare-desfire-ev3-card/index.html"
  "dist/case-studies/hospitality-hotel-key-card-rollout/index.html"
)
for page in "${LCP_PAGES[@]}"; do
  [ -f "$page" ] || { echo "  - skip $page (not built)"; continue; }
  rel="${page#dist/}"
  head_section=$(awk '/<head>/,/<\/head>/' "$page")
  # Find an as="image" preload that ALSO has href= (the P0-P1 fix).
  has_lcp_with_href=$(echo "$head_section" | grep -c 'rel="preload"[^>]*as="image"[^>]*href=')
  check "$rel — LCP preload has href fallback" "test $has_lcp_with_href -ge 1"
done

echo
echo "──────── P0-P2 — GA4 Consent Mode v2 + region1 preconnect ────────"
# Write home head to a temp file once. Avoids the eval-with-embedded-HTML
# pitfall: HTML attribute parens like `<svg viewBox="0 0 ...">` blow up
# the shell parser when re-evaluated via check()'s eval pipeline.
HOME_HEAD_FILE=$(mktemp -t _verify-pr-3-home-head.XXXXXX)
trap "rm -f '$HOME_HEAD_FILE'" EXIT
awk '/<head>/,/<\/head>/' "dist/index.html" > "$HOME_HEAD_FILE"

check "preconnect to googletagmanager.com [Astro-emitted]" \
      "grep -q 'preconnect[^>]*googletagmanager.com' '$HOME_HEAD_FILE'"
check "preconnect to region1.google-analytics.com [PR-3 add]" \
      "grep -q 'preconnect[^>]*region1.google-analytics.com' '$HOME_HEAD_FILE'"
# Use .* between known tokens — the source `gtag('consent', 'default', {`
# has variable single/double quote rendering between Astro versions, and
# fixed-length . classes are brittle. Patterns below match the semantics
# rather than exact byte sequences.
check "Consent Mode default block present" \
      "grep -q 'gtag.*consent.*default' '$HOME_HEAD_FILE'"
check "ad_storage defaulted to denied" \
      "grep -q 'ad_storage.*denied' '$HOME_HEAD_FILE'"
check "analytics_storage defaulted to denied" \
      "grep -q 'analytics_storage.*denied' '$HOME_HEAD_FILE'"
check "ad_user_data defaulted to denied [v2]" \
      "grep -q 'ad_user_data.*denied' '$HOME_HEAD_FILE'"
check "ad_personalization defaulted to denied [v2]" \
      "grep -q 'ad_personalization.*denied' '$HOME_HEAD_FILE'"

# Order check: consent default block must come before gtag.js loader.
consent_line=$(grep -n "gtag..consent...default" "$HOME_HEAD_FILE" | head -1 | cut -d: -f1)
gtagjs_line=$(grep -n "googletagmanager.com/gtag/js" "$HOME_HEAD_FILE" | head -1 | cut -d: -f1)
if [ -n "$consent_line" ] && [ -n "$gtagjs_line" ] && [ "$consent_line" -lt "$gtagjs_line" ]; then
  echo "  v consent default runs BEFORE gtag.js loads"
  pass=$((pass + 1))
else
  echo "  x consent default runs BEFORE gtag.js loads  (consent_line=$consent_line, gtagjs_line=$gtagjs_line)"
  fail=$((fail + 1))
fi

echo
echo "──────── P0-P4 — image-variants script is recursive ────────"
check "build-image-variants.py uses rglob" \
      "grep -q 'rglob' scripts/build-image-variants.py"
check "build-image-variants.py no longer uses iterdir" \
      "! grep -q 'TARGET_DIR.iterdir()' scripts/build-image-variants.py"
check "package.json defines prebuild hook" \
      "grep -q '\"prebuild\":' package.json"
check "prebuild hook calls images:build-webp" \
      "grep -A1 '\"prebuild\":' package.json | grep -q 'images:build-webp'"

echo
echo "──────── P0-HEAD-BLOAT (conservative) — WP block-library + WooCommerce stripped ────────"
for page in "${SAMPLE_PAGES[@]}"; do
  [ -f "$page" ] || { echo "  - skip $page (not built)"; continue; }
  rel="${page#dist/}"
  head_section=$(awk '/<head>/,/<\/head>/' "$page")
  no_block_lib=$(echo "$head_section" | grep -c 'id="wp-block-library-css"' || true)
  no_classic=$(echo "$head_section" | grep -c 'id="classic-theme-styles-inline-css"' || true)
  no_woo=$(echo "$head_section" | grep -c 'id="woocommerce-inline-inline-css"' || true)

  check "$rel — wp-block-library-css stripped" "test $no_block_lib -eq 0"
  check "$rel — classic-theme-styles stripped" "test $no_classic -eq 0"
  check "$rel — woocommerce-inline stripped" "test $no_woo -eq 0"
done

echo
echo "──────── HEAD byte size — gauge of overall bloat reduction ────────"
for page in "${SAMPLE_PAGES[@]}"; do
  [ -f "$page" ] || continue
  rel="${page#dist/}"
  size=$(awk '/<head>/,/<\/head>/' "$page" | wc -c | tr -d ' ')
  printf "  • %-58s head section %6s bytes\n" "$rel" "$size"
done

echo
echo "──────── Kadence palette preserved (regression guard) ────────"
# codex-tokens.css references --global-palette*; the Kadence inline block
# defines these. If we accidentally strip it, sites lose brand colours.
check "kadence-global-inline-css still present on /" \
      "grep -q 'id=\"kadence-global-inline-css\"' dist/index.html"
check "--global-palette1 still defined somewhere in / head" \
      "awk '/<head>/,/<\\/head>/' dist/index.html | grep -q -- '--global-palette1'"

echo
echo "──────── Summary ────────"
echo "  Passed: $pass"
echo "  Failed: $fail"
if [ "$fail" -gt 0 ]; then
  echo
  echo "[FAIL] PR-3 verification failed. See output above."
  exit 1
fi
echo
echo "[OK] PR-3 acceptance checks passed."
