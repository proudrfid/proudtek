#!/usr/bin/env bash
# Verify PR-4 (audit/p0-pagescript-refactor) acceptance checks.
#
# Run after a fresh build:
#   npm run build && bash scripts/_verify-pr-4.sh
#
# All patterns are BSD-grep-compatible (no -P).

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
echo "──────── PR-4 source-side changes ────────"
check "PageScript no longer uses is:inline on its <script> tag" \
      "! grep -E '^\\s*<script is:inline' src/layouts/partials/PageScript.astro"
check "Single hoisted prefersReducedMotion declaration" \
      "test \$(grep -cE '^[[:space:]]+var prefersReducedMotion' src/layouts/partials/PageScript.astro) -eq 1"
check "Hoisted prefersReducedMotion uses try/catch wrapper" \
      "grep -EA1 '^[[:space:]]+var prefersReducedMotion' src/layouts/partials/PageScript.astro | grep -q 'try.*matchMedia.*catch'"

echo
echo "──────── PR-4 build-output checks ────────"
# Look for the Astro-bundled JS in dist/_astro/. Astro bundles all
# non-inline scripts into hashed files there.
check "Astro emitted bundled JS in dist/_astro/" \
      "ls dist/_astro/*.js >/dev/null 2>&1"

# Spot-check several page types for "no inline IIFE" — the giant PageScript
# IIFE should now live in an external .js file, not embedded in HTML.
INLINE_IIFE_SIGNATURE="Sticky site header"
SAMPLE_PAGES=(
  "dist/index.html"
  "dist/about/index.html"
  "dist/products/rfid-cards/mifare-desfire-ev3-card/index.html"
  "dist/case-studies/hospitality-hotel-key-card-rollout/index.html"
)
for page in "${SAMPLE_PAGES[@]}"; do
  [ -f "$page" ] || { echo "  - skip $page"; continue; }
  rel="${page#dist/}"
  if grep -q "$INLINE_IIFE_SIGNATURE" "$page"; then
    echo "  x $rel — PageScript IIFE STILL inline (signature 'Sticky site header' found)"
    fail=$((fail + 1))
  else
    echo "  v $rel — PageScript IIFE moved to external .js"
    pass=$((pass + 1))
  fi
done

# HTML byte-size compare: pages should be measurably smaller than before.
echo
echo "──────── HTML body size (informational) ────────"
for page in "${SAMPLE_PAGES[@]}"; do
  [ -f "$page" ] || continue
  rel="${page#dist/}"
  bytes=$(wc -c < "$page" | tr -d ' ')
  printf "  • %-58s %8s bytes\n" "$rel" "$bytes"
done

echo
echo "──────── Summary ────────"
echo "  Passed: $pass"
echo "  Failed: $fail"
if [ "$fail" -gt 0 ]; then
  echo
  echo "[FAIL] PR-4 verification failed."
  exit 1
fi
echo
echo "[OK] PR-4 acceptance checks passed."
echo
echo "REMINDER: PR-4 is the audit's only HIGH-RISK PR. Before merging to"
echo "main, manually test these 7 interactions in a browser (production"
echo "preview or local dev server):"
echo "  1. Mobile drawer — open/close, focus management"
echo "  2. Sticky CTA bar — appears on scroll, dismiss works"
echo "  3. WhatsApp FAB — appears after 300px scroll"
echo "  4. EditorialTable sortable columns — click headers, aria-sort updates"
echo "  5. Scroll-reveal — .codex-editorial-section fades in on viewport"
echo "  6. RFQ form — required-field validation triggers"
echo "  7. JumpNav active state — current section highlights as you scroll"
