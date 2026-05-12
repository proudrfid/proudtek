#!/usr/bin/env bash
# Stage 3 cleanup — option A+ (2026-05-12)
#
# Run from Playground root: bash .cleanup-stage3.sh
#
# What this does:
#   1. Delete 22 parity tests + _parity-helpers.ts (legacy comparison is gone)
#   2. Delete _stage3/lp-experiment.astro (quarantine page)
#   3. Delete scripts/stage3-diff.mjs + stage3-debug-single.mjs (verification tooling)
#   4. Delete old snapshot files so vitest regenerates from shadow components
#   5. Run vitest to verify + regenerate snapshots
#   6. Run production build smoke test
#
# Safe to re-run — uses rm -f.

set -e

cd "$(dirname "$0")"

echo "==> 1. Removing 22 parity tests + _parity-helpers.ts"
rm -f src/components/editorial/__tests__/Checklist.parity.test.ts \
      src/components/editorial/__tests__/ComparePanel.parity.test.ts \
      src/components/editorial/__tests__/ContactChannels.parity.test.ts \
      src/components/editorial/__tests__/DataHighlight.parity.test.ts \
      src/components/editorial/__tests__/DecisionSnapshotTrail.parity.test.ts \
      src/components/editorial/__tests__/EditorialArticle.parity.test.ts \
      src/components/editorial/__tests__/EditorialCallout.parity.test.ts \
      src/components/editorial/__tests__/EditorialFigure.parity.test.ts \
      src/components/editorial/__tests__/EditorialHero.parity.test.ts \
      src/components/editorial/__tests__/EditorialSection.parity.test.ts \
      src/components/editorial/__tests__/EditorialTable.parity.test.ts \
      src/components/editorial/__tests__/FeatureGrid.parity.test.ts \
      src/components/editorial/__tests__/HubGrids.parity.test.ts \
      src/components/editorial/__tests__/HubRails.parity.test.ts \
      src/components/editorial/__tests__/InlineRfqForm.parity.test.ts \
      src/components/editorial/__tests__/ResourcesAndFaq.parity.test.ts \
      src/components/editorial/__tests__/SectionBodySlots.parity.test.ts \
      src/components/editorial/__tests__/SourcesBriefActionBar.parity.test.ts \
      src/components/editorial/__tests__/StatBar.parity.test.ts \
      src/components/editorial/__tests__/Testimonial.parity.test.ts \
      src/components/editorial/__tests__/Timeline.parity.test.ts \
      src/components/editorial/__tests__/TrustSignalsJumpNav.parity.test.ts \
      src/components/editorial/__tests__/_parity-helpers.ts

echo "==> 2. Removing _stage3 quarantine page"
rm -rf src/pages/_stage3

echo "==> 3. Removing stage3 diff scripts"
rm -f scripts/stage3-diff.mjs scripts/stage3-debug-single.mjs

echo "==> 4. Removing old snapshot files (new snapshots regenerate from shadow components)"
rm -f src/lib/__tests__/__snapshots__/editorial-pages-leaf.snapshot.test.ts.snap \
      src/lib/__tests__/__snapshots__/editorial-pages-variants.snapshot.test.ts.snap \
      src/lib/__tests__/__snapshots__/editorial-pages-integration.snapshot.test.ts.snap

echo "==> 5. Removing stage3:diff npm script from package.json"
# Use a sed in-place edit on macOS (which needs '' after -i)
sed -i '' '/"stage3:diff":/d' package.json 2>/dev/null || sed -i '/"stage3:diff":/d' package.json

echo ""
echo "==> 6. Running vitest (will regenerate the 3 snapshot files)"
npm test

echo ""
echo "==> 7. Production build smoke test"
npm run build

echo ""
echo "==> Cleanup done. Remaining tests:"
find src/ -type f \( -name "*.test.ts" \) | sort

echo ""
echo "==> Next: git status to see the cleanup diff, then commit + push."
