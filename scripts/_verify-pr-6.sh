#!/usr/bin/env bash
# Verify PR-6 (typography baseline P0) acceptance checks.
#
# Run after a fresh build:
#   npm run build && bash scripts/_verify-pr-6.sh

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
echo "──────── PR-6 source-side changes ────────"
check "codex-line-height-base token defined" \
      "grep -q '\\-\\-codex-line-height-base:' src/styles/codex-components.css"
check "codex-content-measure token defined (70ch)" \
      "grep -q '\\-\\-codex-content-measure: 70ch' src/styles/codex-components.css"
check "body line-height: 1.6 baseline" \
      "grep -A2 '^body {' src/styles/codex-components.css | grep -q 'line-height: var(\\-\\-codex-line-height-base)'"
check "h1-h6 stay tight at 1.2" \
      "grep -q ':where(h1, h2, h3, h4, h5, h6)' src/styles/codex-components.css"
check "content paragraphs max-width: 70ch" \
      "grep -q 'codex-content-measure' src/styles/codex-components.css && grep -q ':where(p, li, dd)' src/styles/codex-components.css"

echo
echo "──────── PR-6 build-output checks ────────"
NEW_BUNDLE=$(ls dist/_astro/BaseLayout*.css 2>/dev/null | head -1)
if [ -z "$NEW_BUNDLE" ]; then
  echo "  [WARN] no BaseLayout css bundle found in dist/_astro/"
else
  HASH=$(basename "$NEW_BUNDLE" .css | sed 's/^BaseLayout\.//')
  echo "  bundle: $NEW_BUNDLE (hash $HASH)"
  # Minifier keeps the space after `:` in CSS custom properties
  # (`--foo: 1.6` not `--foo:1.6`), so the pattern must allow optional
  # whitespace. Use POSIX [[:space:]]* (works in BSD + GNU grep).
  if grep -qE -- '--codex-line-height-base:[[:space:]]*1\.6' "$NEW_BUNDLE"; then
    echo "  v --codex-line-height-base: 1.6 IS in bundle"
    pass=$((pass + 1))
  else
    echo "  x line-height token missing in bundle"
    fail=$((fail + 1))
  fi
  if grep -qE -- '--codex-content-measure:[[:space:]]*70ch' "$NEW_BUNDLE"; then
    echo "  v --codex-content-measure: 70ch IS in bundle"
    pass=$((pass + 1))
  else
    echo "  x content-measure token missing in bundle"
    fail=$((fail + 1))
  fi
  if grep -qE 'body\{line-height:var\(--codex-line-height-base\)' "$NEW_BUNDLE"; then
    echo "  v body line-height rule IS in bundle"
    pass=$((pass + 1))
  else
    echo "  x body line-height rule missing"
    fail=$((fail + 1))
  fi
fi

echo
echo "──────── Summary ────────"
echo "  Passed: $pass"
echo "  Failed: $fail"
if [ "$fail" -gt 0 ]; then
  echo
  echo "[FAIL] PR-6 verification failed."
  exit 1
fi
echo
echo "[OK] PR-6 acceptance checks passed."
