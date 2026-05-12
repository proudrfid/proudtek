#!/usr/bin/env bash
# P0 SEO completeness + dead code cleanup (audit follow-up, 2026-05-12)
#
# What this does:
#   1. Delete orphan src/components/editorial/Brief.astro (P1.1, no consumers)
#   2. Run vitest — must stay 78/78 PASS (snapshot changes expected since
#      HowTo JSON-LD and FAQ JSON-LD are now emitted on more pages)
#   3. Run production build smoke test
#   4. Quick sanity checks on the new SEO output:
#      - sitemap.xml should contain /compare/ and /guides/
#      - At least some /guides/ pages should now carry HowTo JSON-LD
#      - All /lp/ pages should carry FAQ JSON-LD
#
# Safe to re-run.

set -e
cd "$(dirname "$0")"

echo "==> 1. Deleting orphan Brief.astro"
rm -f src/components/editorial/Brief.astro

echo ""
echo "==> 2. Running vitest (snapshots will likely need update — review before -u)"
npm test || {
  echo ""
  echo "Tests failed — likely shadow-component snapshot needs update."
  echo "Review the diff carefully, then re-run: npm test -- -u"
  exit 1
}

echo ""
echo "==> 3. Production build smoke test"
npm run build

echo ""
echo "==> 4. Sanity checks on new SEO output"
echo "--- /compare/ in sitemap:"
grep -c "https://proudtek.com/compare/<" dist/sitemap.xml && echo "  ✓ present"
echo "--- /guides/ in sitemap:"
grep -c "https://proudtek.com/guides/<" dist/sitemap.xml && echo "  ✓ present"
echo "--- Total sitemap URLs:"
grep -c "<loc>" dist/sitemap.xml
echo "--- /guides/ pages with HowTo JSON-LD:"
grep -l '"@type":"HowTo"' dist/guides/*/index.html 2>/dev/null | wc -l
echo "--- /lp/ pages with FAQ JSON-LD:"
grep -l '"@type":"FAQPage"' dist/lp/*/index.html 2>/dev/null | wc -l
echo "  (should be 15/15)"

echo ""
echo "==> Done. Review the metrics above before commit."
