# Phase 1 Deployment Guide: Vercel Preview

## Pre-Deployment Checklist

✅ **Phase 0 Complete**
- Inventory CLI: 100% classification
- Parser fixtures: 6 tests passing
- Zero-output integration: verified
- Dual-build audit: byte-identical baseline

✅ **Phase 1 Complete**
- HeadPolicy implementation: 7 tests passing
- Integration: wired into extractChromeFromSnapshot
- Local dev verification: PASS (browser tested)
- Dual-build audit: -17,208 bytes head reduction, SEO fields preserved

---

## Vercel Preview Deployment

### Step 1: Set Environment Variable

In your Vercel project settings:

1. Navigate to: **Settings** → **Environment Variables**
2. Add new variable:
   - **Name:** `PROUDTEK_NATIVE_SHELL`
   - **Value:** `1`
   - **Environments:** ✅ Preview (only)
   - **Branch:** `main` (or your feature branch)

**Important:** Do NOT enable for Production yet—preview testing first.

### Step 2: Deploy to Preview

```bash
# Push your current branch (already pushed to main)
git push origin main

# Vercel will auto-deploy to preview with PROUDTEK_NATIVE_SHELL=1
```

Or manually trigger:

```bash
vercel --scope proudrfid
```

### Step 3: Verification Checklist

Once preview deployment is live:

#### Desktop Verification (Chrome, Firefox, Safari)
- [ ] `/blog/` page loads without errors
- [ ] Header navigation functional
- [ ] Footer visible and functional
- [ ] Blog card grid renders correctly
- [ ] Topic filter rail works
- [ ] No visual regressions vs. production

#### Mobile Verification (Required)
- [ ] **iOS Safari** (latest): Mobile drawer opens/closes smoothly
- [ ] **Android Chrome** (latest): Touch interactions work
- [ ] Header collapses correctly on scroll
- [ ] Card grid responsive (3 columns → 1 column)
- [ ] No z-index conflicts (drawer doesn't appear empty/dark)

#### Network Inspection
- [ ] Open DevTools → Network tab
- [ ] Filter by CSS
- [ ] Verify **0 requests** for:
  - `kadence-global-inline-css`
  - `woocommerce-inline-inline-css`
  - Any `/site-assets/*kadence*` bundles (except the main bundle)

#### Console Check
- [ ] No JavaScript errors
- [ ] No 404s for missing assets
- [ ] No CORS errors

### Step 4: Compare with Production

Open both URLs side-by-side:
- **Preview:** `https://<branch>-proudtek-<hash>.vercel.app/blog/`
- **Production:** `https://proudtek.com/blog/`

**Visual comparison:**
- Layout should be identical
- Mobile drawer behavior should match
- No missing fonts or broken styles

**SEO comparison (view page source):**
- `<title>` identical
- `<meta name="description">` identical
- Open Graph tags identical
- Canonical URL correct

---

## Expected Results

### What Should Change
- **Head size:** ~17KB smaller (Kadence/WooCommerce CSS removed)
- **CSS loaded:** 4 fewer inline `<style>` tags
- **Network requests:** No kadence-global/woocommerce-inline CSS

### What Should NOT Change
- SEO metadata (title, description, OG tags)
- Visual appearance (native components have standalone CSS)
- Mobile drawer functionality
- Header/footer behavior
- Page layout
- Card grid structure

---

## Rollback Procedure (If Issues Found)

If preview testing reveals problems:

1. **Immediate rollback:**
   ```bash
   # Remove env var from Vercel Preview
   # Redeploy without PROUDTEK_NATIVE_SHELL
   vercel --scope proudrfid
   ```

2. **Diagnose locally:**
   ```bash
   PROUDTEK_NATIVE_SHELL=1 npm run dev
   # Reproduce issue in http://localhost:4321/blog/
   ```

3. **Fix and re-test:**
   - Make code changes
   - Test locally first
   - Push and verify in preview again

---

## Production Deployment (After Preview Success)

**Only proceed if all preview tests pass.**

### Step 1: Enable in Production

In Vercel project settings:
1. Navigate to: **Environment Variables**
2. Find `PROUDTEK_NATIVE_SHELL`
3. Add to **Production** environment
4. Value: `1`

### Step 2: Deploy to Production

```bash
# From main branch
git push origin main

# Vercel auto-deploys to production
```

### Step 3: Monitor (24 hours)

**Metrics to watch:**
- Vercel error rate: should remain < 0.1%
- User reports: monitor support channels
- Analytics: bounce rate, time on page should be stable
- Lighthouse scores: should not drop > 5 points

**Cache management:**
```bash
# If needed, purge Vercel edge cache
vercel --prod --scope proudrfid purge /blog/*
```

### Fast Rollback (if production issues)

```bash
# 1. Remove PROUDTEK_NATIVE_SHELL from Production env
# 2. Redeploy (takes ~2 minutes)
vercel --prod --scope proudrfid

# 3. Purge cache
vercel --prod --scope proudrfid purge /blog/*
```

---

## Next Routes After `/blog/` Success

Once `/blog/` is stable in production, replicate to:

1. `/guides/` (same hub pattern, already in canary)
2. `/solutions/` (same hub pattern, already in canary)
3. `/glossary/` (simpler structure, lowest risk)
4. `/tools/rfid-tag-cost-estimator/` (interactive tool)

Each follows the same pattern:
```typescript
const chrome = extractChromeFromSnapshot(donorPage, ROUTE, useNativeShell);
```

Already implemented for `/blog/`, just update other hub pages.

---

## Success Criteria Summary

✅ All preview tests pass (desktop + mobile)  
✅ No visual regressions vs. production  
✅ Mobile drawer works without style conflicts  
✅ Network inspection shows 0 Kadence/WooCommerce CSS  
✅ SEO fields unchanged  
✅ Production monitoring stable for 24h  

**Estimated timeline:**
- Preview deployment: 5 minutes
- Preview verification: 30 minutes
- Production deployment: 5 minutes
- Production monitoring: 24 hours

**Total time to production:** ~25 hours from now (if preview passes immediately)

---

## Contact / Support

If issues arise during deployment:
- Check logs: Vercel dashboard → Deployments → Logs
- Local reproduction: `PROUDTEK_NATIVE_SHELL=1 npm run dev`
- Rollback: Remove env var + redeploy

Design doc: `~/.gstack/projects/proudrfid-proudtek/zhangping-main-design-20260821-080302.md`
