# Phase 1 Preview Deployment Checklist

**Date:** 2026-08-22 (backfilled from live verification)
**Deployed by:** zhangping (Vercel dashboard, `PROUDTEK_NATIVE_SHELL=1`)
**Preview URL:** superseded — flag since enabled on Production; record below re-verified against https://proudtek.com

> Backfill note (2026-08-22): this checklist was executed during the Aug 21–22
> deploy window but never filled in. The verification record reflects a
> programmatic re-check of live production plus the repo's CI gates, not a
> fresh manual browser session.

## Verification record (2026-08-22)

| Check | Scope | Result |
| --- | --- | --- |
| Native shell marker (`data-native-shell-header`) | `/blog/`, `/guides/`, `/solutions/`, `/compare/`, 4 compare category hubs, `/glossary/`, `/tools/rfid-tag-cost-estimator/` | ✅ present on all 10 canary routes |
| Kadence/WooCommerce CSS filtered | same 10 routes | ✅ `kadence-global-inline-css` / `woocommerce-inline` absent from served HTML; only donor `theme-kadence` body class remains |
| Snapshot routes untouched | `/`, products, industries, about | ✅ homepage still serves full donor head (~857 kadence refs) — expected while `PROUDTEK_HOME_V2` is off |
| SEO head contract | all routes | ✅ dual-build site-contract audit passed in phase 1–3 gates (`ed1bdb1b`…`6538a3b9`): 595 paths, canonical/robots/sitemap/schema sets unchanged |
| Mobile drawer stacking fix | Compare flow (local browser) | ✅ backdrop `codex-z-base`, panel `codex-z-raised`; regression-tested in commit `1d1af151` |

### Still requires a human (not verifiable over HTTP)

- [ ] Real-device spot check: iOS Safari + Android Chrome drawer open/close on one canary route (e.g. `/compare/chip-vs-chip/`)
- [ ] 24h Vercel error-rate watch after each production enable

---

## Original checklist (kept for future route batches)

---

## Pre-Deployment

- [ ] All Phase 0 commits pushed to GitHub
- [ ] All Phase 1 commits pushed to GitHub
- [ ] Local tests passing (13/13 tests)
- [ ] Local browser verification complete
- [ ] Dual-build audit passed (-17,208 bytes, SEO preserved)

---

## Environment Setup

- [ ] `PROUDTEK_NATIVE_SHELL=1` set in Vercel Preview environment
- [ ] **NOT** enabled in Production yet
- [ ] Preview deployment triggered and completed
- [ ] Preview URL accessible

---

## Desktop Verification (All Browsers)

### Chrome
- [ ] `/blog/` loads without errors
- [ ] Header navigation works
- [ ] Footer visible and functional
- [ ] Blog card grid renders (3 columns)
- [ ] Topic filter rail functional
- [ ] No console errors
- [ ] No 404s in Network tab

### Firefox
- [ ] `/blog/` loads without errors
- [ ] Layout matches Chrome
- [ ] Interactive elements work
- [ ] No console errors

### Safari
- [ ] `/blog/` loads without errors
- [ ] Layout matches Chrome/Firefox
- [ ] Interactive elements work
- [ ] No console errors

---

## Mobile Verification (Critical)

### iOS Safari (Latest)
- [ ] `/blog/` loads on iPhone/iPad
- [ ] **Mobile drawer opens smoothly** (tap hamburger icon)
- [ ] **Mobile drawer closes smoothly** (tap X or overlay)
- [ ] **No dark empty-looking drawer** (previous bug)
- [ ] Header collapses on scroll
- [ ] Card grid responsive (1 column on mobile)
- [ ] Touch interactions work (tap, scroll, swipe)
- [ ] No z-index conflicts
- [ ] No console errors

### Android Chrome (Latest)
- [ ] `/blog/` loads on Android device
- [ ] Mobile drawer opens/closes smoothly
- [ ] Header responsive
- [ ] Card grid responsive
- [ ] Touch interactions work
- [ ] No console errors

---

## Network Inspection

- [ ] Open DevTools → Network → Filter: CSS
- [ ] **Verify 0 requests for:**
  - [ ] `kadence-global-inline-css`
  - [ ] `woocommerce-inline-inline-css`
  - [ ] Any kadence-specific CSS bundles
- [ ] WordPress core CSS still loaded (expected)
- [ ] Google Fonts still loaded (expected)
- [ ] Analytics scripts still loaded (expected)

---

## Visual Comparison

**Open side-by-side:**
- Preview: `https://<hash>.vercel.app/blog/`
- Production: `https://proudtek.com/blog/`

### Layout
- [ ] Header identical
- [ ] Footer identical
- [ ] Card grid layout identical
- [ ] Typography identical
- [ ] Spacing identical
- [ ] Colors identical

### Mobile Drawer (Most Critical)
- [ ] Drawer animation identical
- [ ] Drawer styling identical
- [ ] **No dark/empty appearance** (would indicate CSS missing)
- [ ] Menu items visible and clickable
- [ ] Close button functional

---

## SEO Verification

### View Page Source (Preview)
- [ ] `<title>` matches production
- [ ] `<meta name="description">` matches production
- [ ] `<meta property="og:title">` matches production
- [ ] `<meta property="og:description">` matches production
- [ ] `<link rel="canonical">` correct
- [ ] JSON-LD structured data present

### Head Size Comparison
```bash
# Run locally
npm run audit-head -- --route /blog/ --baseline dist-baseline
```
- [ ] Head size reduced by ~17KB
- [ ] SEO fields unchanged

---

## Performance Check

### Lighthouse (Preview /blog/)
- [ ] Performance score: ______ (should be similar to production)
- [ ] Accessibility score: ______ (should be 90+)
- [ ] Best Practices score: ______ (should be similar)
- [ ] SEO score: ______ (should be 100)

### Page Load Comparison
- [ ] Preview load time similar to production
- [ ] No additional network waterfalls
- [ ] No render-blocking CSS added

---

## Functional Testing

### Blog Hub Features
- [ ] Topic filter rail shows all topics
- [ ] Clicking a topic filters cards
- [ ] "All Topics" shows all cards
- [ ] Card thumbnails load
- [ ] Card links navigate correctly
- [ ] Breadcrumbs functional

### Search & Navigation
- [ ] Header search bar works (if present)
- [ ] Main navigation dropdown works
- [ ] Footer links navigate correctly
- [ ] Back button works

---

## Issue Checklist (If Problems Found)

If any test fails:

- [ ] Screenshot the issue
- [ ] Note browser/device details
- [ ] Check console for errors
- [ ] Try on different device/browser
- [ ] Reproduce locally with `PROUDTEK_NATIVE_SHELL=1 npm run dev`
- [ ] Document in issue tracker
- [ ] **Do NOT enable in Production**

---

## Sign-Off

**Preview Verification Result:** [ ] PASS / [ ] FAIL

**Issues found:** _______________________________________

**Ready for Production?** [ ] YES / [ ] NO

**Verified by:** ________________  
**Date:** ______________________

---

## Production Deployment (Only if Preview PASS)

- [ ] Enable `PROUDTEK_NATIVE_SHELL=1` in Production environment
- [ ] Deploy to production
- [ ] Monitor Vercel error rate for 1 hour
- [ ] Check user reports for 24 hours
- [ ] Run same verification tests on production URL
- [ ] Mark as stable or rollback

**Rollback procedure (if production issues):**
1. Remove `PROUDTEK_NATIVE_SHELL` from Production env
2. Redeploy: `vercel --prod --scope proudrfid`
3. Purge cache: `vercel --prod --scope proudrfid purge /blog/*`
4. Time to rollback: ~2 minutes
