#!/usr/bin/env bash
# Verify PR-1 (audit/p0-seo-indexability) acceptance checks.
# Run after a clean build:
#   bash scripts/_verify-p0-build.sh         # full Phase -1 + PR-1 build
#   bash scripts/_verify-pr-1.sh             # PR-1 specific checks
#
# OR if you just want PR-1 checks against an existing dist/:
#   bash scripts/_verify-pr-1.sh

set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -d dist ]; then
  echo "✗ dist/ not found. Run: npm run build  (or bash scripts/_verify-p0-build.sh)"
  exit 1
fi

pass=0
fail=0
check() {
  local name="$1"
  local cmd="$2"
  if eval "$cmd" > /dev/null 2>&1; then
    echo "  ✓ $name"
    pass=$((pass + 1))
  else
    echo "  ✗ $name"
    eval "$cmd" 2>&1 | head -5 | sed 's/^/      /'
    fail=$((fail + 1))
  fi
}

echo
echo "──────── P0-S2/G1 — robots.txt AI crawler allow-list ────────"
ROBOTS="dist/robots.txt"
check "robots.txt exists"             "test -f $ROBOTS"
check "User-agent: GPTBot"            "grep -q '^User-agent: GPTBot$' $ROBOTS"
check "User-agent: ChatGPT-User"      "grep -q '^User-agent: ChatGPT-User$' $ROBOTS"
check "User-agent: OAI-SearchBot"     "grep -q '^User-agent: OAI-SearchBot$' $ROBOTS"
check "User-agent: ClaudeBot"         "grep -q '^User-agent: ClaudeBot$' $ROBOTS"
check "User-agent: Claude-Web"        "grep -q '^User-agent: Claude-Web$' $ROBOTS"
check "User-agent: anthropic-ai"      "grep -q '^User-agent: anthropic-ai$' $ROBOTS"
check "User-agent: PerplexityBot"     "grep -q '^User-agent: PerplexityBot$' $ROBOTS"
check "User-agent: Perplexity-User"   "grep -q '^User-agent: Perplexity-User$' $ROBOTS"
check "User-agent: Google-Extended"   "grep -q '^User-agent: Google-Extended$' $ROBOTS"
check "User-agent: Applebot-Extended" "grep -q '^User-agent: Applebot-Extended$' $ROBOTS"
check "User-agent: Amazonbot"         "grep -q '^User-agent: Amazonbot$' $ROBOTS"
check "User-agent: CCBot"             "grep -q '^User-agent: CCBot$' $ROBOTS"
check "User-agent: Bytespider"        "grep -q '^User-agent: Bytespider$' $ROBOTS"
check "Disallow: /machine/ for generic UA" \
      "awk '/^User-agent: \\*/,/^$/' $ROBOTS | grep -q 'Disallow: /machine/'"
check "Sitemap declares sitemap-index" \
      "grep -q 'Sitemap:.*sitemap-index.xml' $ROBOTS"

echo
echo "──────── P0-S3 — sitemap-index + image caption ────────"
check "sitemap-index.xml exists"      "test -f dist/sitemap-index.xml"
check "sitemap-index references sitemap.xml"     "grep -q '/sitemap.xml<' dist/sitemap-index.xml"
check "sitemap-index references image-sitemap.xml" "grep -q '/image-sitemap.xml<' dist/sitemap-index.xml"

# Image sitemap caption diversity: count distinct caption text, expect > 50.
# macOS ships BSD grep which lacks `-P`, so use sed for the extraction —
# portable across GNU/BSD/macOS.
distinct_captions=$(sed -n 's|.*<image:caption>\([^<]*\)</image:caption>.*|\1|p' dist/image-sitemap.xml | sort -u | wc -l | tr -d ' ')
check "image-sitemap captions are diverse (>50 distinct)" "test '$distinct_captions' -gt 50"
echo "      → $distinct_captions distinct captions"

echo
echo "──────── P0-S1 — head output order (no duplicate canonical/title) ────────"
SAMPLE_PAGES=(
  "dist/index.html"
  "dist/about/index.html"
  "dist/products/rfid-cards/mifare-desfire-ev3-card/index.html"
  "dist/case-studies/hospitality-hotel-key-card-rollout/index.html"
  "dist/compare/em4100-vs-t5577/index.html"
  "dist/blog/index.html"
  "dist/compatibility/index.html"
)
for page in "${SAMPLE_PAGES[@]}"; do
  if [ ! -f "$page" ]; then
    echo "  ⚠ skip $page (not built)"
    continue
  fi
  rel="${page#dist/}"
  head_section=$(awk '/<head>/,/<\/head>/' "$page")
  title_count=$(echo "$head_section" | grep -c '<title>')
  canonical_count=$(echo "$head_section" | grep -c '<link rel="canonical"')
  charset_count=$(echo "$head_section" | grep -ic 'meta charset=')
  dns_count=$(echo "$head_section" | grep -c '<link rel="dns-prefetch"')

  check "$rel — exactly 1 <title>"          "test $title_count -eq 1"
  check "$rel — exactly 1 canonical"        "test $canonical_count -eq 1"
  check "$rel — exactly 1 meta charset"     "test $charset_count -eq 1"
  check "$rel — no dns-prefetch (use preconnect)" "test $dns_count -eq 0"
done

echo
echo "──────── P0-G5 — speakable cssSelector cleaned ────────"
JSONLD_SAMPLE=$(awk '/<head>/,/<\/head>/' "dist/about/index.html" | grep -A 2 '"speakable"' | head -5)
check "speakable does NOT reference woocommerce" \
      "! grep -q 'woocommerce-product-details' dist/about/index.html"
check "speakable does NOT use meta[name=description]" \
      "! grep -q '\"meta\\[name.description.\\]\"' dist/about/index.html"
check "speakable uses codex-editorial-summary" \
      "grep -q 'codex-editorial-summary' dist/about/index.html"

echo
echo "──────── Summary ────────"
echo "  Passed: $pass"
echo "  Failed: $fail"
if [ "$fail" -gt 0 ]; then
  echo
  echo "✗ PR-1 verification failed. See output above."
  exit 1
fi
echo
echo "✅ PR-1 acceptance checks passed."
