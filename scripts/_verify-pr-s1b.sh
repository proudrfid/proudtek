#!/usr/bin/env bash
# Verify PR-S1-B (Internal Linking + Breadcrumb).

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
echo "──────── PR-S1-B source-side ────────"
check "related-articles.ts helper exists" \
      "test -f src/lib/seo/related-articles.ts"
check "RelatedArticles.astro component exists" \
      "test -f src/components/editorial/RelatedArticles.astro"
check "EditorialPageLayout imports RelatedArticles" \
      "grep -q 'RelatedArticles' src/layouts/EditorialPageLayout.astro"
check "EditorialPageLayout renders <RelatedArticles related={relatedArticles}/>" \
      "grep -q '<RelatedArticles related={relatedArticles}' src/layouts/EditorialPageLayout.astro"
check "/rfq/ has visible breadcrumb" \
      "grep -q 'codex-rfq-breadcrumb' src/pages/rfq.astro"
check "codex-related-articles CSS rule present" \
      "grep -q '.codex-related-articles {' src/styles/codex-components.css"

echo
echo "──────── PR-S1-B build-output ────────"
# Coverage: sample editorial page types should have a Related section
SAMPLE_EDITORIAL_PAGES=(
  "dist/case-studies/hospitality-hotel-key-card-rollout/index.html"
  "dist/solutions/rfid-laundry-tags/index.html"
  "dist/compare/em4100-vs-t5577/index.html"
  "dist/products/rfid-cards/mifare-classic-1k-card/index.html"
)
related_pages=0
for page in "${SAMPLE_EDITORIAL_PAGES[@]}"; do
  [ -f "$page" ] || { echo "  - skip $page (not built)"; continue; }
  rel="${page#dist/}"
  if grep -q 'codex-related-articles' "$page"; then
    echo "  v $rel has Related Articles section"
    related_pages=$((related_pages + 1))
    pass=$((pass + 1))
  else
    echo "  x $rel MISSING Related Articles section"
    fail=$((fail + 1))
  fi
done

# Total related-article sections across the whole dist
SITE_RELATED_COUNT=$(grep -rl 'codex-related-articles' dist 2>/dev/null | wc -l | tr -d ' ')
echo "  Total dist pages with Related Articles: $SITE_RELATED_COUNT"
if [ "$SITE_RELATED_COUNT" -gt 200 ]; then
  echo "  v Related Articles applied site-wide"
  pass=$((pass + 1))
else
  echo "  x expected 200+ pages with Related, found $SITE_RELATED_COUNT"
  fail=$((fail + 1))
fi

# /rfq/ visible breadcrumb
if [ -f dist/rfq/index.html ]; then
  if grep -q 'codex-rfq-breadcrumb' dist/rfq/index.html; then
    echo "  v /rfq/ has visible breadcrumb nav"
    pass=$((pass + 1))
  else
    echo "  x /rfq/ missing visible breadcrumb"
    fail=$((fail + 1))
  fi
fi

echo
echo "──────── Summary ────────"
echo "  Passed: $pass"
echo "  Failed: $fail"
if [ "$fail" -gt 0 ]; then
  echo
  echo "[FAIL] PR-S1-B verification failed."
  exit 1
fi
echo
echo "[OK] PR-S1-B acceptance checks passed."
