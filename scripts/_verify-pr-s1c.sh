#!/usr/bin/env bash
# Verify PR-S1-C (Schema deepening: VideoObject + Product sku/mpn).

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
    eval "$cmd" 2>&1 | head -3 | sed 's/^/      /'
    fail=$((fail + 1))
  fi
}

echo
echo "──────── PR-S1-C source-side ────────"
check "VideoObject schema branch in jsonld.ts" \
      "grep -q 'VideoObject' src/lib/seo/jsonld.ts"
check "Product sku derivation in jsonld.ts" \
      "grep -q 'productSku' src/lib/seo/jsonld.ts"
check "Product mpn derivation in jsonld.ts" \
      "grep -q 'productMpn' src/lib/seo/jsonld.ts"

echo
echo "──────── PR-S1-C dist HTML — VideoObject on homepage ────────"
if grep -q '"@type":"VideoObject"' dist/index.html 2>/dev/null; then
  echo "  v homepage has VideoObject schema"
  pass=$((pass + 1))
  # Spot-check required fields
  for field in name description contentUrl thumbnailUrl uploadDate; do
    if grep -qE "\"$field\":" dist/index.html 2>/dev/null; then
      echo "    v VideoObject has required field: $field"
      pass=$((pass + 1))
    else
      echo "    x VideoObject missing required field: $field"
      fail=$((fail + 1))
    fi
  done
else
  echo "  x homepage MISSING VideoObject schema"
  fail=$((fail + 1))
fi

echo
echo "──────── PR-S1-C dist HTML — Product sku/mpn on product page ────────"
SAMPLE_PRODUCT="dist/products/rfid-cards/mifare-classic-1k-card/index.html"
if [ -f "$SAMPLE_PRODUCT" ]; then
  if grep -qE '"sku":"PT-' "$SAMPLE_PRODUCT"; then
    echo "  v $SAMPLE_PRODUCT has sku: PT-*"
    pass=$((pass + 1))
  else
    echo "  x $SAMPLE_PRODUCT missing sku"
    fail=$((fail + 1))
  fi
  if grep -qE '"mpn":"' "$SAMPLE_PRODUCT"; then
    echo "  v $SAMPLE_PRODUCT has mpn"
    pass=$((pass + 1))
  else
    echo "  x $SAMPLE_PRODUCT missing mpn"
    fail=$((fail + 1))
  fi
  if grep -qE '"productID":"PT-' "$SAMPLE_PRODUCT"; then
    echo "  v $SAMPLE_PRODUCT has productID"
    pass=$((pass + 1))
  else
    echo "  x $SAMPLE_PRODUCT missing productID"
    fail=$((fail + 1))
  fi
else
  echo "  - skip sample product (not built)"
fi

# Site-wide product page coverage
PRODUCT_WITH_SKU=$(grep -rl '"sku":"PT-' dist/products 2>/dev/null | wc -l | tr -d ' ')
echo "  Product pages with sku schema: $PRODUCT_WITH_SKU"
if [ "$PRODUCT_WITH_SKU" -gt 30 ]; then
  echo "  v Product sku applied across product catalogue"
  pass=$((pass + 1))
else
  echo "  x expected 30+ product pages with sku, found $PRODUCT_WITH_SKU"
  fail=$((fail + 1))
fi

echo
echo "──────── Summary ────────"
echo "  Passed: $pass"
echo "  Failed: $fail"
if [ "$fail" -gt 0 ]; then
  echo
  echo "[FAIL] PR-S1-C verification failed."
  exit 1
fi
echo
echo "[OK] PR-S1-C acceptance checks passed."
