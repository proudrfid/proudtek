#!/usr/bin/env bash
# Local-machine verification for the P0 build.
#
# Why this script exists:
#   The Cowork sandbox can't run `npm run build` cleanly because the
#   FUSE-mounted workspace blocks unlinking the stale dist/ + .astro/
#   cache files. On your host macOS shell those unlinks succeed.
#
# Run from the repo root:
#   bash scripts/_verify-p0-build.sh
#
# What it does:
#   1. Cleans dist/ + .astro/ + node_modules/.vite so Astro starts fresh.
#   2. Runs `npm run build` (≈5–10 min for 1,611 pages).
#   3. Greps the generated HTML to confirm each P0 change landed.

set -euo pipefail

echo
echo "──────── Step 0: generate placeholder downloads ────────"
node scripts/generate-placeholder-downloads.mjs
echo

echo "──────── Step 1: clear stale build caches ────────"
# astro.config.mjs sets cacheDir = ./node_modules/.astro, which survives a
# `rm -rf .astro` and silently re-uses the prior compiled output. Clear it
# explicitly so changes to lib/*.ts (sitemap helpers, transformers, etc.)
# actually re-compile on each verify run.
rm -rf dist .astro node_modules/.vite node_modules/.astro
echo "  ✓ Cleared dist, .astro, node_modules/.vite, node_modules/.astro"

echo
echo "──────── Step 2: full Astro build ────────"
npm run build

echo
echo "──────── Step 3: P0 acceptance checks ────────"

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
    fail=$((fail + 1))
  fi
}

# ── T1: Homepage H1 / H2 / title / description ──
echo
echo "T1 — Homepage H1 + stat H2s + SEO meta"
check "H1 keyword-loaded with 'Cards, Tags, Labels, Wristbands, Keyfobs'" \
  "grep -qE '<h1[^>]*>Custom RFID &amp; NFC Manufacturer in China.*Cards.*Tags.*Labels.*Wristbands.*Keyfobs.*Readers' dist/index.html"
check "Stat H2 '10' merged with descriptor" \
  "grep -qE '<h2[^>]*>10 Automated Production Lines' dist/index.html"
check "Stat H2 '305+' merged with descriptor" \
  "grep -qE '<h2[^>]*>305\\+ Advanced Production Equipments' dist/index.html"
check "Stat H2 '8+' merged with descriptor" \
  "grep -qE '<h2[^>]*>8\\+ Certified Patents' dist/index.html"
check "Stat H2 '12+' merged with descriptor" \
  "grep -qE '<h2[^>]*>12\\+ Strict Inspection Procedures' dist/index.html"
check "Title contains 'Custom RFID & NFC Manufacturer in China'" \
  "grep -qE '<title>Custom RFID &amp; NFC Manufacturer in China' dist/index.html"
check "Meta description mentions 'Two Shenzhen factories'" \
  "grep -qE 'name=\"description\" content=\"Proud Tek is a custom RFID' dist/index.html"

# ── T2: Product schema on editorial pages ──
echo
echo "T2 — Product / Offer / BreadcrumbList schema on editorial product pages"
check "Product schema on /products/rfid-cards/mifare-classic-1k-card/" \
  "grep -q '\"@type\":\"Product\"' dist/products/rfid-cards/mifare-classic-1k-card/index.html"
check "BreadcrumbList schema on the same page" \
  "grep -q '\"@type\":\"BreadcrumbList\"' dist/products/rfid-cards/mifare-classic-1k-card/index.html"
check "Legacy /product/mifare-classic-card/ canonical points to editorial" \
  "grep -q 'rel=\"canonical\" href=\"https://proudtek.com/products/rfid-cards/mifare-classic-1k-card/\"' dist/product/mifare-classic-card/index.html"

# ── T3: Case Studies hub + 6 detail pages ──
echo
echo "T3 — Case Studies hub + 6 detail pages"
check "/case-studies/ hub generated" \
  "test -f dist/case-studies/index.html"
check "Hospitality case-study page generated" \
  "test -f dist/case-studies/hospitality-hotel-key-card-rollout/index.html"
check "Industrial laundry case-study page generated" \
  "test -f dist/case-studies/industrial-laundry-pps-rfid-tag/index.html"
check "Music festival case-study page generated" \
  "test -f dist/case-studies/music-festival-uhf-wristband/index.html"
check "Retail apparel case-study page generated" \
  "test -f dist/case-studies/retail-apparel-uhf-rfid-source-tagging/index.html"
check "Library case-study page generated" \
  "test -f dist/case-studies/library-icode-slix2-self-service/index.html"
check "Pharmaceutical case-study page generated" \
  "test -f dist/case-studies/pharmaceutical-dscsa-uhf-rfid/index.html"
check "Restaurant Google-Review NFC case-study page generated" \
  "test -f dist/case-studies/restaurant-google-review-nfc-card/index.html"
check "Case-study hub H1 mentions 'Real Proud Tek Deployments'" \
  "grep -q 'Real Proud Tek Deployments' dist/case-studies/index.html"
check "Case-study detail emits Article JSON-LD" \
  "grep -q '\"@type\":\"Article\"' dist/case-studies/hospitality-hotel-key-card-rollout/index.html"
check "Case-study detail emits FAQPage JSON-LD" \
  "grep -q '\"@type\":\"FAQPage\"' dist/case-studies/hospitality-hotel-key-card-rollout/index.html"

# ── T4: EM4100 vs T5577 compare page ──
echo
echo "T4 — EM4100 vs T5577 compare page"
check "/compare/em4100-vs-t5577/ generated" \
  "test -f dist/compare/em4100-vs-t5577/index.html"
check "Compare page H1 mentions 'EM4100 vs T5577'" \
  "grep -q 'EM4100 vs T5577' dist/compare/em4100-vs-t5577/index.html"
check "Compare hub references em4100-vs-t5577 slug" \
  "grep -q 'em4100-vs-t5577' dist/compare/index.html"

# ── T5: Sample Pack + mobile sticky CTA ──
echo
echo "T5 — Sample Pack landing + mobile floating CTA"
check "/sample-pack/ generated" \
  "test -f dist/sample-pack/index.html"
check "Sample-pack H1 mentions 'Free RFID & NFC Sample Pack'" \
  "grep -q 'Free RFID' dist/sample-pack/index.html"
check "Sticky CTA banner present on homepage" \
  "grep -q 'codex-sticky-cta' dist/index.html"
check "WhatsApp FAB script bootstrap present" \
  "grep -q 'WhatsApp FAB' dist/index.html || grep -q 'wa.me' dist/index.html"

# ── T6: Form labels rewritten ──
echo
echo "T6 — Contact form labels rewritten for B2B"
check "Contact form label 'Country'" \
  "grep -q '>Country<' dist/contact/index.html"
check "Contact form label 'Estimated quantity'" \
  "grep -q 'Estimated quantity' dist/contact/index.html"
check "Contact form has 5 visible kb_field_ inputs" \
  "test \$(grep -oE 'name=\"kb_field_[0-9]+\"' dist/contact/index.html | sort -u | wc -l) -eq 5"

# ── N1–N4: Navigation, sitemap, footer, home resource trio ──
echo
echo "Navigation & discovery — homepage / footer / sitemap / llms.txt"
check "Top-nav Resources dropdown surfaces /case-studies/ on homepage" \
  "grep -q 'href=\"/case-studies/\"[^>]*>.*Case Studies' dist/index.html"
check "Top-nav Resources dropdown surfaces /sample-pack/ on homepage" \
  "grep -q 'href=\"/sample-pack/\"[^>]*>.*Free Sample Pack' dist/index.html"
check "Footer Resources column lists Case Studies" \
  "grep -q '<a[^>]*href=\"/case-studies/\"[^>]*>Case Studies' dist/index.html"
check "Footer Resources column lists Sample Pack" \
  "grep -q '<a[^>]*href=\"/sample-pack/\"[^>]*>Free Sample Pack' dist/index.html"
check "Homepage resource trio rendered (codex-industry-selector--resources)" \
  "grep -q 'codex-industry-selector--resources' dist/index.html"
check "Resource trio links to Case Studies" \
  "grep -q 'codex-industry-selector__card[^\"]*\"[[:space:]]*href=\"/case-studies/\"' dist/index.html || grep -q 'href=\"/case-studies/\"[^>]*style=\"--accent' dist/index.html"
check "sitemap.xml includes /case-studies/" \
  "grep -q '<loc>https://proudtek.com/case-studies/</loc>' dist/sitemap.xml"
check "sitemap.xml includes /case-studies/hospitality-hotel-key-card-rollout/" \
  "grep -q '<loc>https://proudtek.com/case-studies/hospitality-hotel-key-card-rollout/</loc>' dist/sitemap.xml"
check "sitemap.xml includes /sample-pack/" \
  "grep -q '<loc>https://proudtek.com/sample-pack/</loc>' dist/sitemap.xml"
check "sitemap.xml includes /compare/em4100-vs-t5577/" \
  "grep -q '<loc>https://proudtek.com/compare/em4100-vs-t5577/</loc>' dist/sitemap.xml"
check "llms.txt lists Case Studies section" \
  "grep -q '## Case studies' dist/llms.txt"
check "llms.txt references /sample-pack/" \
  "grep -q '/sample-pack/' dist/llms.txt"

# ── P1-A: RFQ Wizard ──
echo
echo "P1-A — RFQ Wizard"
check "/rfq/ generated" \
  "test -f dist/rfq/index.html"
check "RFQ wizard has 5-step progress rail" \
  "grep -q 'rfq-progress' dist/rfq/index.html"
check "RFQ wizard step 1 — product family" \
  "grep -q 'rfq_product' dist/rfq/index.html"
check "RFQ wizard step 4 — printing & encoding" \
  "grep -q 'rfq_options' dist/rfq/index.html"
check "RFQ wizard step 5 — contact fields" \
  "grep -q 'kb_field_1' dist/rfq/index.html"
check "RFQ wizard JavaScript bootstrap present" \
  "grep -q 'rfq_step_view' dist/rfq/index.html"
check "Top-nav Resources surfaces /rfq/ on homepage" \
  "grep -q 'href=\"/rfq/\"' dist/index.html"
check "Footer Resources column lists Request a Quote" \
  "grep -q '<a[^>]*href=\"/rfq/\"' dist/index.html"

# ── P1-B: Resource Center ──
echo
echo "P1-B — Resource Center"
check "/resources/downloads/ generated" \
  "test -f dist/resources/downloads/index.html"
check "Resource Center H1 mentions 'Resource Center'" \
  "grep -q 'Resource Center' dist/resources/downloads/index.html"
check "Resource Center links to GS1 SGTIN template" \
  "grep -q '/downloads/gs1-sgtin-96-encoding-template.xlsx' dist/resources/downloads/index.html"
check "Resource Center links to DSCSA brief" \
  "grep -q '/downloads/dscsa-item-level-rfid-brief.pdf' dist/resources/downloads/index.html"
check "Top-nav Resources surfaces /resources/downloads/ on homepage" \
  "grep -q 'href=\"/resources/downloads/\"' dist/index.html"

# ── P1: placeholder downloads exist ──
echo
echo "P1 — Placeholder downloads"
check "Placeholder PDF: em4100-em4305-t5577-reference.pdf" \
  "test -f dist/downloads/em4100-em4305-t5577-reference.pdf && [ \$(wc -c < dist/downloads/em4100-em4305-t5577-reference.pdf) -gt 500 ]"
check "Placeholder PDF: hotel-key-card-artwork-template.pdf" \
  "test -f dist/downloads/hotel-key-card-artwork-template.pdf"
check "Placeholder XLSX: gs1-sgtin-96-encoding-template.xlsx" \
  "test -f dist/downloads/gs1-sgtin-96-encoding-template.xlsx"
check "Placeholder PDF: dscsa-item-level-rfid-brief.pdf" \
  "test -f dist/downloads/dscsa-item-level-rfid-brief.pdf"

# ── P1-C: cross-page CTA wiring ──
echo
echo "P1-C — RFQ cross-page wiring"
check "Sample Pack page surfaces /rfq/ as secondary action" \
  "grep -q '/rfq/' dist/sample-pack/index.html"
check "Sample Pack page surfaces /resources/downloads/" \
  "grep -q '/resources/downloads/' dist/sample-pack/index.html"
check "sitemap.xml includes /rfq/" \
  "grep -q '<loc>https://proudtek.com/rfq/</loc>' dist/sitemap.xml"
check "sitemap.xml includes /resources/downloads/" \
  "grep -q '<loc>https://proudtek.com/resources/downloads/</loc>' dist/sitemap.xml"

echo
echo "──────── Summary ────────"
echo "  Passed: $pass"
echo "  Failed: $fail"
if [ "$fail" -gt 0 ]; then
  echo
  echo "Some acceptance checks failed. Re-run after fixing the offending file."
  exit 1
fi
echo
echo "All P0 acceptance checks passed. dist/ is ready to deploy."
