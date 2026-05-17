#!/usr/bin/env bash
# Verify PR-S1-D (404 + Sitemap health, last PR in Sprint 1).

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
echo "──────── PR-S1-D source-side ────────"
check "_audit-sitemap.mjs script exists" \
      "test -f scripts/_audit-sitemap.mjs"
check "/404/ page source exists" \
      "test -f src/pages/404.astro"
check "/404/ has popular-categories section" \
      "grep -q 'error-categories' src/pages/404.astro"
check "/404/ has Browse All Products CTA" \
      "grep -q 'Browse All Products' src/pages/404.astro"

echo
echo "──────── PR-S1-D build-output ────────"
# Verify 404 builds correctly
if [ -f dist/404.html ]; then
  echo "  v dist/404.html built"
  pass=$((pass + 1))
  if grep -q 'Page not found' dist/404.html; then
    echo "  v dist/404.html has 'Page not found' heading"
    pass=$((pass + 1))
  else
    echo "  x dist/404.html missing expected heading"
    fail=$((fail + 1))
  fi
else
  echo "  x dist/404.html NOT built"
  fail=$((fail + 1))
fi

echo
echo "──────── PR-S1-D sitemap health audit ────────"
set +e
node scripts/_audit-sitemap.mjs > /tmp/audit-sitemap.log 2>&1
AUDIT_RC=$?
set -e
cat /tmp/audit-sitemap.log
if [ "$AUDIT_RC" = "0" ]; then
  echo "  v sitemap audit passed"
  pass=$((pass + 1))
else
  echo "  x sitemap audit FAILED (rc=$AUDIT_RC) — see log above"
  fail=$((fail + 1))
fi

echo
echo "──────── Summary ────────"
echo "  Passed: $pass"
echo "  Failed: $fail"
if [ "$fail" -gt 0 ]; then
  echo
  echo "[FAIL] PR-S1-D verification failed."
  exit 1
fi
echo
echo "[OK] PR-S1-D acceptance checks passed."
