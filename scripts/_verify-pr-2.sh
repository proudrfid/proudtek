#!/usr/bin/env bash
# Verify PR-2 (audit/p0-schema-upgrades) acceptance checks.
#
# Run after a clean build:
#   npm run build && bash scripts/_verify-pr-2.sh

set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -d dist ]; then
  echo "✗ dist/ not found. Run: npm run build"
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
echo "──────── P0-G3 — llms.txt Quick Facts + Optional section ────────"
LLMS="dist/llms.txt"
check "llms.txt exists"                              "test -f $LLMS"
check "has '## Optional' section"                    "grep -q '^## Optional$' $LLMS"
check "Optional links to llms-full.txt"              "grep -q 'llms-full.txt' $LLMS"
check "Optional links to site-index.json"            "grep -q 'site-index.json' $LLMS"
check "Optional links to sitemap-index.xml"          "grep -q 'sitemap-index.xml' $LLMS"
check "has '## Quick facts' section"                 "grep -q '^## Quick facts$' $LLMS"
check "Quick facts: founding year 2008"              "grep -q 'founded in 2008' $LLMS"
check "Quick facts: Shenzhen HQ"                     "grep -q 'Shenzhen' $LLMS"
check "Quick facts: MOQ for NFC cards"               "grep -q '100 pcs.*NFC cards' $LLMS"
check "Quick facts: MOQ for RFID labels"             "grep -q '500 pcs.*RFID labels' $LLMS"
check "Quick facts: lead time stock chip"            "grep -q '7-15 working days' $LLMS"
check "Quick facts: lead time custom"                "grep -q '20-30 working days' $LLMS"
check "Quick facts: NTAG 424 DNA listed"             "grep -q 'NTAG 424 DNA' $LLMS"
check "Quick facts: ISO 9001 listed"                 "grep -q 'ISO 9001:2015' $LLMS"
check "Quick facts: RAIN RFID Alliance listed"       "grep -q 'RAIN RFID Alliance' $LLMS"
check "Quick facts: NFC Forum listed"                "grep -q 'NFC Forum' $LLMS"

echo
echo "──────── P0-G2 — Organization JSON-LD entity signals ────────"
SAMPLE="dist/about/index.html"
ORG_BLOCK=$(awk '/"@type":[[:space:]]*"Organization"/,/^[[:space:]]*}$/' "$SAMPLE" | head -120)

check "Organization JSON-LD present on /about/" \
      "test -n \"$(echo \"$ORG_BLOCK\" | head -1)\""
check "Organization has foundingDate=2008" \
      "echo \"$ORG_BLOCK\" | grep -q '\"foundingDate\":\"2008\"'"
check "Organization has foundingLocation" \
      "echo \"$ORG_BLOCK\" | grep -q '\"foundingLocation\"'"
check "Organization has numberOfEmployees" \
      "echo \"$ORG_BLOCK\" | grep -q '\"numberOfEmployees\"'"
check "Organization has alternateName 'ProudTek'" \
      "echo \"$ORG_BLOCK\" | grep -q 'ProudTek'"
check "Organization sameAs contains wa.me link" \
      "echo \"$ORG_BLOCK\" | grep -q 'wa\\.me/'"

# Verify sameAs does NOT include empty strings (would be a regression):
empty_samesas=$(echo "$ORG_BLOCK" | grep -o '"sameAs":\[[^]]*\]' | grep -c '""' || true)
check "Organization sameAs has no empty entries" "test '$empty_samesas' -eq 0"

# Count populated sameAs — informational, expected min 1 (wa.me), more
# after user fills in LinkedIn/YouTube URLs.
sameAs_count=$(echo "$ORG_BLOCK" | grep -oE '"https?://[^"]+"' | grep -v '^"https://proudtek\.com' | sort -u | wc -l | tr -d ' ')
echo "      → sameAs populated entries: $sameAs_count"
if [ "$sameAs_count" -lt 3 ]; then
  echo "      ℹ When LinkedIn + YouTube URLs are filled in ORGANIZATION_SOCIAL,"
  echo "        this count should grow to ≥3 (recommended for Knowledge Graph)."
fi

echo
echo "──────── Summary ────────"
echo "  Passed: $pass"
echo "  Failed: $fail"
if [ "$fail" -gt 0 ]; then
  echo
  echo "✗ PR-2 verification failed. See output above."
  exit 1
fi
echo
echo "✅ PR-2 acceptance checks passed."
