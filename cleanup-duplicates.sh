#!/bin/bash
# ============================================================
# cleanup-duplicates.sh
#
# Removes all duplicate/numbered-variant files and directories
# from the Proud Tek static site.
#
# Pattern: files/dirs with " N" suffix (space + number)
#   e.g. "guide-name 2/", "index 3.html", "image 4.jpg"
#
# These are artifacts from content generation/migration and
# are 100% orphaned (no links point to them).
#
# SAFE: Only deletes items matching the " <number>" pattern.
#       Original pages (without numeric suffix) are untouched.
#
# Usage: cd to project root, then:
#   bash cleanup-duplicates.sh          # dry run (default)
#   bash cleanup-duplicates.sh --delete # actually delete
# ============================================================

set -euo pipefail

DIST="dist-restored"
MODE="${1:-dry-run}"

if [ ! -d "$DIST" ]; then
  echo "ERROR: $DIST directory not found. Run from project root."
  exit 1
fi

echo "Mode: $MODE"
echo ""

# 1. Duplicate directories (contain index.html pages)
echo "=== DUPLICATE DIRECTORIES ==="
DIR_COUNT=0
while IFS= read -r -d '' dir; do
  DIR_COUNT=$((DIR_COUNT + 1))
  if [ "$MODE" = "--delete" ]; then
    rm -rf "$dir"
    echo "  DELETED: $dir"
  else
    echo "  WOULD DELETE: $dir"
  fi
done < <(find "$DIST" -type d -regex '.* [0-9]+$' -print0)
echo "  Total: $DIR_COUNT directories"
echo ""

# 2. Duplicate top-level files (sitemap, robots, index, llms, etc.)
echo "=== DUPLICATE TOP-LEVEL FILES ==="
TOP_COUNT=0
while IFS= read -r -d '' file; do
  TOP_COUNT=$((TOP_COUNT + 1))
  if [ "$MODE" = "--delete" ]; then
    rm -f "$file"
    echo "  DELETED: $file"
  else
    echo "  WOULD DELETE: $file"
  fi
done < <(find "$DIST" -maxdepth 1 -type f -regex '.* [0-9]+\.[a-z]+$' -print0)
echo "  Total: $TOP_COUNT files"
echo ""

# 3. Duplicate image and data files in subdirs
echo "=== DUPLICATE IMAGES & DATA FILES ==="
IMG_COUNT=0
while IFS= read -r -d '' file; do
  IMG_COUNT=$((IMG_COUNT + 1))
  if [ "$MODE" = "--delete" ]; then
    rm -f "$file"
    echo "  DELETED: $file"
  else
    echo "  WOULD DELETE: $file"
  fi
done < <(find "$DIST" -mindepth 2 -not -type d -regex '.* [0-9]+\.[a-z]+$' -print0)
echo "  Total: $IMG_COUNT files"
echo ""

# 4. Source code duplicate
echo "=== SOURCE CODE DUPLICATE ==="
SRC_DUP="src/lib/faq-page 2.ts"
if [ -f "$SRC_DUP" ]; then
  if [ "$MODE" = "--delete" ]; then
    rm -f "$SRC_DUP"
    echo "  DELETED: $SRC_DUP"
  else
    echo "  WOULD DELETE: $SRC_DUP"
  fi
fi
echo ""

TOTAL=$((DIR_COUNT + TOP_COUNT + IMG_COUNT))
echo "============================================"
echo "SUMMARY"
echo "  Directories:  $DIR_COUNT"
echo "  Top files:    $TOP_COUNT"
echo "  Image/data:   $IMG_COUNT"
echo "  Source code:   1"
echo "  TOTAL:        $((TOTAL + 1)) items"
echo "============================================"

if [ "$MODE" != "--delete" ]; then
  echo ""
  echo "This was a DRY RUN. To actually delete, run:"
  echo "  bash cleanup-duplicates.sh --delete"
fi
