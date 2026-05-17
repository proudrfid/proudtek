#!/usr/bin/env bash
# Verify PR-7 (CTA hierarchy + dark-mode hint P0) acceptance checks.

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
echo "──────── PR-7 source-side changes ────────"
check "color-scheme: light dark token in source" \
      "grep -q 'color-scheme: light dark' src/styles/codex-components.css"
check ".codex-cta base class defined" \
      "grep -qE '^\\.codex-cta\\s*\\{' src/styles/codex-components.css"
check ".codex-cta--primary defined" \
      "grep -q '\\.codex-cta--primary' src/styles/codex-components.css"
check ".codex-cta--secondary defined" \
      "grep -q '\\.codex-cta--secondary' src/styles/codex-components.css"
check ".codex-cta--ghost defined" \
      "grep -q '\\.codex-cta--ghost' src/styles/codex-components.css"

echo
echo "──────── PR-7 build-output checks ────────"
NEW_BUNDLE=$(ls dist/_astro/BaseLayout*.css 2>/dev/null | head -1)
if [ -z "$NEW_BUNDLE" ]; then
  echo "  [WARN] no BaseLayout css bundle found in dist/_astro/"
else
  HASH=$(basename "$NEW_BUNDLE" .css | sed 's/^BaseLayout\.//')
  echo "  bundle: $NEW_BUNDLE (hash $HASH)"
  if grep -qE -- 'color-scheme:[[:space:]]*light[[:space:]]*dark' "$NEW_BUNDLE"; then
    echo "  v color-scheme: light dark IS in bundle"
    pass=$((pass + 1))
  else
    echo "  x color-scheme rule missing in bundle"
    fail=$((fail + 1))
  fi
  if grep -q 'codex-cta--primary' "$NEW_BUNDLE"; then
    echo "  v .codex-cta--primary rule IS in bundle"
    pass=$((pass + 1))
  else
    echo "  x .codex-cta--primary missing"
    fail=$((fail + 1))
  fi
  if grep -q 'codex-cta--ghost' "$NEW_BUNDLE"; then
    echo "  v .codex-cta--ghost rule IS in bundle"
    pass=$((pass + 1))
  else
    echo "  x .codex-cta--ghost missing"
    fail=$((fail + 1))
  fi
fi

echo
echo "──────── Summary ────────"
echo "  Passed: $pass"
echo "  Failed: $fail"
if [ "$fail" -gt 0 ]; then
  echo
  echo "[FAIL] PR-7 verification failed."
  exit 1
fi
echo
echo "[OK] PR-7 acceptance checks passed."
