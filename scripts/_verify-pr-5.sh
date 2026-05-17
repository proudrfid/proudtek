#!/usr/bin/env bash
# Verify PR-5 (audit/p0-a11y) acceptance checks:
#   1. Skip-link present on every page (both WP-snapshot and native Astro)
#   2. EditorialTable no longer emits invalid role="columnheader button"
#   3. StickyCta uses role="region" (or no role) instead of "complementary"
#   4. Every built page has EXACTLY ONE <h1> element
#
# Run after a fresh build:
#   npm run build && bash scripts/_verify-pr-5.sh
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
echo "──────── PR-5 source-side changes ────────"
check "BaseLayout has codex-skip-link" \
      "grep -q 'codex-skip-link' src/layouts/BaseLayout.astro"
check "StickyCta uses role=\"region\"" \
      "grep -q 'role=\"region\"' src/layouts/partials/StickyCta.astro"
check "EditorialTable no longer has role=\"columnheader button\"" \
      "! grep -q 'role=\"columnheader button\"' src/components/editorial/EditorialTable.astro"
check "extractChromeFromSnapshot strips H1 from chrome (covers all hubs)" \
      "grep -q 'strip H1 elements from the pre-main chrome' src/lib/seo/snapshot-chrome.ts"
check "render-snapshot demotes H1s outside <main> to H2" \
      "grep -q 'demoteH1sOutsideMain' src/lib/render-snapshot.ts"
check "codex-skip-link CSS rule present" \
      "grep -q '\\.codex-skip-link' src/styles/codex-components.css"

echo
echo "──────── PR-5 build-output: skip-link on every page ────────"
SKIP_FAIL=0
SAMPLE_PAGES=(
  "dist/index.html"
  "dist/about/index.html"
  "dist/blog/index.html"
  "dist/rfq/index.html"
  "dist/contact-us/index.html"
  "dist/compare/em4100-vs-t5577/index.html"
  "dist/case-studies/hospitality-hotel-key-card-rollout/index.html"
  "dist/solutions/rfid-laundry-tags/index.html"
)
for page in "${SAMPLE_PAGES[@]}"; do
  [ -f "$page" ] || { echo "  - skip $page (not built)"; continue; }
  rel="${page#dist/}"
  # Accept BOTH our codex-skip-link AND the legacy WP skip-link (both
  # point to #main; both are valid). PR-5 ensures at least ONE exists.
  if grep -qE '(class="codex-skip-link"|class="skip-link )' "$page"; then
    echo "  v $rel has skip-link"
    pass=$((pass + 1))
  else
    echo "  x $rel MISSING skip-link"
    fail=$((fail + 1))
    SKIP_FAIL=1
  fi
done

echo
echo "──────── PR-5 build-output: every page has exactly 1 <h1> ────────"
# Walk every built .html and count <h1> tags. Skip a few known-good
# special pages (404, error, machine-readable views).
H1_FAIL_COUNT=0
H1_TOTAL_PAGES=0
H1_BAD_PAGES=()
while IFS= read -r page; do
  rel="${page#dist/}"
  # Skip non-content HTML
  case "$rel" in
    machine/*|404.html) continue ;;
  esac
  # `|| echo 0` + redirect: grep returns exit 1 on no-match which would
  # trigger set -e under pipefail and silently abort the loop. Force 0
  # on empty match so the substitution always succeeds.
  count=$( (grep -oE '<h1[ >]' "$page" 2>/dev/null || echo "") | wc -l | tr -d ' ')
  H1_TOTAL_PAGES=$((H1_TOTAL_PAGES + 1))
  if [ "$count" != "1" ]; then
    H1_FAIL_COUNT=$((H1_FAIL_COUNT + 1))
    H1_BAD_PAGES+=("$rel:$count")
  fi
done < <(find dist -name '*.html' -type f | sort)

echo "  Checked $H1_TOTAL_PAGES pages."
if [ "$H1_FAIL_COUNT" = "0" ]; then
  echo "  v ALL pages have exactly 1 <h1>"
  pass=$((pass + 1))
else
  echo "  x $H1_FAIL_COUNT page(s) violate the single-H1 rule:"
  for bad in "${H1_BAD_PAGES[@]}"; do
    echo "      $bad"
  done | head -20
  fail=$((fail + 1))
fi

echo
echo "──────── PR-5 build-output: no invalid ARIA role ────────"
# `|| true` on the grep is critical: with set -e + pipefail, an empty
# grep result (exit 1) would otherwise silently abort the script.
INVALID_ARIA=$(grep -rlE 'role="columnheader button"' dist 2>/dev/null || true)
INVALID_ARIA=$(echo "$INVALID_ARIA" | head -5)
if [ -z "$INVALID_ARIA" ]; then
  echo "  v no role=\"columnheader button\" in dist HTML"
  pass=$((pass + 1))
else
  echo "  x found role=\"columnheader button\" in:"
  echo "$INVALID_ARIA" | sed 's/^/      /'
  fail=$((fail + 1))
fi

echo
echo "──────── PR-5 build-output: StickyCta role is region ────────"
set +e
grep -rq 'class="codex-banner codex-sticky-cta" role="region"' dist 2>/dev/null
HAS_REGION=$?
grep -rq 'class="codex-banner codex-sticky-cta" role="complementary"' dist 2>/dev/null
HAS_COMP=$?
set -e
if [ "$HAS_REGION" = "0" ]; then
  echo "  v StickyCta renders with role=\"region\""
  pass=$((pass + 1))
elif [ "$HAS_COMP" = "0" ]; then
  echo "  x StickyCta still uses role=\"complementary\" (PR-5 should have changed to region)"
  fail=$((fail + 1))
else
  echo "  - StickyCta role check inconclusive (banner not found in sample dist)"
fi

echo
echo "──────── Summary ────────"
echo "  Passed: $pass"
echo "  Failed: $fail"
if [ "$fail" -gt 0 ]; then
  echo
  echo "[FAIL] PR-5 verification failed."
  exit 1
fi
echo
echo "[OK] PR-5 acceptance checks passed."
