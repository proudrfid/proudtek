#!/usr/bin/env bash
# Verify PR-S1-A (image performance + LCP P1) acceptance checks.

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
echo "──────── PR-S1-A source-side ────────"
check "_generate-webp.mjs exists" \
      "test -f scripts/_generate-webp.mjs"
check "render-snapshot has upgradeImagesToWebP" \
      "grep -q 'upgradeImagesToWebP' src/lib/render-snapshot.ts"
check "upgradeImagesToWebP is called in prepareSnapshot" \
      "grep -c 'upgradeImagesToWebP' src/lib/render-snapshot.ts | grep -qE '^[2-9]'"

echo
echo "──────── PR-S1-A WebP assets generated ────────"
WEBP_COUNT=$(find public/site-assets/wp-content/uploads -type f -name '*.webp' 2>/dev/null | wc -l | tr -d ' ')
JPG_PNG_COUNT=$(find public/site-assets/wp-content/uploads -type f \( -name '*.jpg' -o -name '*.jpeg' -o -name '*.png' \) 2>/dev/null | wc -l | tr -d ' ')
echo "  jpg/png count:  $JPG_PNG_COUNT"
echo "  webp count:     $WEBP_COUNT"
if [ "$WEBP_COUNT" -gt 800 ]; then
  echo "  v WebP siblings generated for the bulk of jpg/png images"
  pass=$((pass + 1))
else
  echo "  x expected 800+ WebP files, found $WEBP_COUNT"
  fail=$((fail + 1))
fi

# Sample WebP existence check on known large images
SAMPLE_IMAGES=(
  "public/site-assets/wp-content/uploads/2024/04/cropped-cropped-proudtek-logo.png"
  "public/site-assets/wp-content/uploads/2024/11/RFID_cards.jpg"
  "public/site-assets/wp-content/uploads/2024/08/RFID_key_fob_for_access_system.jpg"
)
for img in "${SAMPLE_IMAGES[@]}"; do
  [ -f "$img" ] || { echo "  - skip $img (source missing)"; continue; }
  webp="${img%.*}.webp"
  if [ -f "$webp" ]; then
    src_size=$(wc -c < "$img" | tr -d ' ')
    webp_size=$(wc -c < "$webp" | tr -d ' ')
    rel="${img#public/}"
    saved=$((src_size - webp_size))
    pct=$((saved * 100 / src_size))
    echo "  v ${rel}: webp -${pct}%"
    pass=$((pass + 1))
  else
    echo "  x ${img#public/}: no .webp sibling"
    fail=$((fail + 1))
  fi
done

echo
echo "──────── PR-S1-A dist HTML uses <picture> with WebP ────────"
PICTURE_COUNT=$(grep -rl '<source type="image/webp"' dist 2>/dev/null | wc -l | tr -d ' ')
echo "  pages with WebP <picture>: $PICTURE_COUNT"
if [ "$PICTURE_COUNT" -gt 200 ]; then
  echo "  v WebP <picture> wrappers present across the site"
  pass=$((pass + 1))
else
  echo "  x expected 200+ pages with WebP picture, found $PICTURE_COUNT"
  fail=$((fail + 1))
fi

# Sample page WebP check
for page in dist/index.html dist/about/index.html dist/case-studies/hospitality-hotel-key-card-rollout/index.html; do
  [ -f "$page" ] || { echo "  - skip $page (not built)"; continue; }
  rel="${page#dist/}"
  if grep -q '<source type="image/webp"' "$page"; then
    echo "  v $rel has WebP <picture>"
    pass=$((pass + 1))
  else
    echo "  x $rel missing WebP <picture>"
    fail=$((fail + 1))
  fi
done

echo
echo "──────── PR-S1-A LCP fetchpriority high ────────"
# Spot-check: homepage should have at least one img with fetchpriority=high
if grep -q 'fetchpriority="high"' dist/index.html 2>/dev/null; then
  echo "  v homepage has fetchpriority=\"high\" on LCP candidate"
  pass=$((pass + 1))
else
  echo "  - homepage doesn't have an explicit fetchpriority=\"high\" img"
  echo "    (may be fine — hero is a <video> not an <img>, so no img LCP)"
fi

echo
echo "──────── Summary ────────"
echo "  Passed: $pass"
echo "  Failed: $fail"
if [ "$fail" -gt 0 ]; then
  echo
  echo "[FAIL] PR-S1-A verification failed."
  exit 1
fi
echo
echo "[OK] PR-S1-A acceptance checks passed."
