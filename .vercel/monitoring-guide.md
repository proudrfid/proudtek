# Phase 1 Production Monitoring Guide

## Overview

After deploying `PROUDTEK_NATIVE_SHELL=1` to production for `/blog/`, monitor these metrics for 24 hours before considering the deployment stable.

---

## Critical Metrics (First Hour)

### Vercel Dashboard

**Location:** Vercel Dashboard → Project → Analytics

**Monitor:**
- **Error Rate:** Should remain < 0.1%
  - Baseline: Check last 7 days average
  - Alert threshold: > 0.5% sustained for 10+ minutes
  
- **Response Time (P95):** Should not increase > 10%
  - Baseline: Last 7 days P95
  - Alert threshold: > 20% increase sustained
  
- **Status Codes:**
  - 200s: Should remain > 99%
  - 500s: Should remain < 0.1%
  - 404s: Should not spike (indicates broken assets)

**Check frequency:** Every 15 minutes for first hour

---

## User-Facing Metrics (First 24 Hours)

### Google Analytics (if available)

**Path:** `/blog/`

**Monitor:**
- **Bounce Rate:** Should remain within ±5% of baseline
  - Baseline: Last 30 days `/blog/` bounce rate
  - Alert: > 10% increase

- **Avg. Time on Page:** Should remain within ±10% of baseline
  - Baseline: Last 30 days `/blog/` avg time
  - Alert: > 20% decrease (users leaving faster = broken)

- **Mobile vs. Desktop Split:** Should match historical ratio
  - Watch for sudden drops in mobile traffic (indicates mobile breakage)

**Check frequency:** Every 2 hours for first 24 hours

---

## Browser Console Monitoring

### Real User Monitoring (if available)

**Tools:** Sentry, LogRocket, or manual testing

**Watch for:**
- JavaScript errors on `/blog/`
- CSS load failures
- 404s for missing assets
- CORS errors
- Uncaught exceptions

**Alert threshold:** > 5 new unique errors in first hour

---

## Visual Regression Testing

### Manual Spot Checks

**Test matrix (first hour after production deploy):**

| Device | Browser | URL | Status |
|--------|---------|-----|--------|
| Desktop | Chrome | https://proudtek.com/blog/ | [ ] PASS |
| Desktop | Firefox | https://proudtek.com/blog/ | [ ] PASS |
| Desktop | Safari | https://proudtek.com/blog/ | [ ] PASS |
| iPhone | Safari | https://proudtek.com/blog/ | [ ] PASS |
| Android | Chrome | https://proudtek.com/blog/ | [ ] PASS |

**Critical checks:**
- [ ] Mobile drawer opens/closes smoothly
- [ ] No dark/empty drawer appearance
- [ ] Header visible and functional
- [ ] Footer visible
- [ ] Card grid renders correctly

---

## Support Channel Monitoring

### User Reports

**Check these channels every 2 hours:**
- [ ] Support email inbox
- [ ] Live chat (if active)
- [ ] Social media mentions
- [ ] Contact form submissions

**Watch for keywords:**
- "blog broken"
- "menu not working"
- "drawer empty"
- "can't see navigation"
- "page looks weird"

**Escalation:** Any user report of broken `/blog/` → investigate immediately

---

## Performance Monitoring

### Lighthouse Scores

**Run hourly for first 6 hours:**

```bash
# Desktop
npm run lh:collect -- --url https://proudtek.com/blog/

# Mobile
npm run lh:collect -- --url https://proudtek.com/blog/ --emulated-form-factor mobile
```

**Alert thresholds:**
- Performance: < 80 (if baseline was > 90)
- Accessibility: < 90
- Best Practices: < 80

### Core Web Vitals (Chrome User Experience Report)

**Check after 24 hours:**
- LCP (Largest Contentful Paint): Should be < 2.5s
- FID (First Input Delay): Should be < 100ms
- CLS (Cumulative Layout Shift): Should be < 0.1

**Note:** CUE data has 28-day latency, so use Field Data from PageSpeed Insights instead.

---

## Rollback Triggers

**Immediate rollback if any of:**
1. Error rate > 1% sustained for 10+ minutes
2. Multiple user reports of broken `/blog/` within 1 hour
3. Mobile drawer completely broken (verified on real device)
4. SEO metadata missing/wrong (check with `curl -s https://proudtek.com/blog/ | grep "<title>"`)
5. Lighthouse Performance score drops > 20 points
6. 404s for CSS assets > 5% of requests

---

## Rollback Procedure

**Time to execute: ~2 minutes**

```bash
# 1. Remove environment variable (Vercel Dashboard)
# Settings → Environment Variables → PROUDTEK_NATIVE_SHELL → Delete from Production

# 2. Trigger redeployment
vercel --prod --scope proudrfid

# 3. Purge CDN cache
vercel --prod --scope proudrfid purge /blog/*

# 4. Verify rollback
curl -s https://proudtek.com/blog/ | grep -c "kadence-global-inline-css"
# Should return > 0 (CSS is back)
```

**Post-rollback:**
- Announce in team channels
- Document the issue
- Investigate root cause locally
- Fix and re-test in preview before retry

---

## Success Criteria (24 Hours)

**Deployment is considered stable if:**
- [ ] Error rate remains < 0.1%
- [ ] No user reports of broken `/blog/`
- [ ] Bounce rate within ±5% of baseline
- [ ] Lighthouse scores within ±5 points of baseline
- [ ] Mobile drawer functional (verified on real devices)
- [ ] All manual spot checks pass

**If all criteria met:**
- Mark deployment as stable
- Schedule replication to `/guides/`, `/solutions/`
- Update team documentation

**If any criteria fail:**
- Rollback immediately
- Investigate root cause
- Fix and re-deploy to preview first

---

## Monitoring Schedule

**Hour 0-1:** Check every 15 minutes (critical window)  
**Hour 1-6:** Check every 1 hour  
**Hour 6-24:** Check every 2-4 hours  
**Day 2-7:** Daily checks  

**Automated alerts (if available):**
- Set up Vercel webhook for error rate > 0.5%
- Set up GA alert for bounce rate > baseline + 10%
- Set up uptime monitor (e.g., Pingdom) for `/blog/` 200 status

---

## Contact & Escalation

**If issues detected:**
1. Check this monitoring guide for rollback triggers
2. If rollback needed, execute immediately (don't wait)
3. Post-rollback, document issue and plan fix

**Team notification:**
- Deployment start: "Phase 1 deployed to production, monitoring active"
- 1 hour update: "Hour 1 metrics: [status]"
- 24 hour update: "Deployment stable / rolled back"

---

## Monitoring Log Template

```
Date: ____________________
Time: ____________________
Metric: ___________________
Baseline: _________________
Current: __________________
Status: [ ] NORMAL / [ ] WARNING / [ ] ALERT
Action Taken: _____________
```

Use this template to log checks during the 24-hour monitoring window.
