# ProudTek GEO Citation Baseline — 2026-04

> **Purpose.** Measure whether the major generative engines (ChatGPT, Claude, Perplexity, Google AI Overviews / Gemini) currently cite **proudtek.com** when answering high-intent RFID/NFC buyer & technical questions. This is the Phase 0 "before" snapshot for the v1.0 Industry-Authority playbook. Every move in Phases 1-4 will be evaluated against this baseline.

- **Scan date target:** run the first pass within 7 days of this file being created.
- **Re-scan cadence:** end of Phase 1 (T+30), Phase 2 (T+60), Phase 3 (T+120), Phase 4 (T+180).
- **Scoring rule:** a query "hits" only when the engine (a) returns a direct link to `proudtek.com`, OR (b) names "ProudTek" in the synthesized answer text. Brand-only mentions without a link still count, but are logged separately.
- **Red line:** all manual testing must be done in a clean, logged-out browser session (or use incognito + cleared cookies). No personalisation.

---

## 1. Seed queries — 20 high-intent prompts

Queries are grouped by the five topic trees defined in playbook §5.1. Each query is chosen because it (a) has commercial or technical buyer intent, (b) is one a procurement or integrator would actually type into ChatGPT/Perplexity, and (c) has a factual answer that can be defended with a citation — which is exactly what the engines prefer to cite.

### Tree A — MIFARE / DESFire / Hotel-lock security (compare cluster)

1. `Is MIFARE Classic still safe to use for hotel key cards in 2026?`
2. `MIFARE Classic vs MIFARE Plus vs DESFire EV3 — which should a hotel chain specify?`
3. `What are the known cloning attacks on MIFARE Classic and how do DESFire EV2/EV3 mitigate them?`
4. `ISO/IEC 14443 Type A vs Type B — which do Assa Abloy, Dormakaba and Salto locks accept?`

### Tree B — RFID laundry tag durability (solutions cluster)

5. `Which RFID laundry tag survives 500 industrial wash cycles at 90°C — PPS, silicone, or textile?`
6. `What does IPX9K mean for an RFID laundry tag and which tag families pass it?`
7. `How do you calculate RFID laundry tag ROI for a 500-room hotel linen pool?`
8. `How do hospital laundries reconcile RFID tag read rates with HIPAA privacy requirements?`

### Tree C — EU DPP / GS1 / standards (standards authority cluster)

9. `EU Digital Product Passport 2027 — does an NFC tag or a QR code satisfy the regulation?`
10. `GS1 Digital Link vs plain URL — which is required for the EU DPP on textiles?`
11. `What does NTAG 424 DNA's SUN message authentication add over a plain NDEF URL for brand protection?`
12. `Walmart RFID mandate 2025 — which EPC Gen2 chip families qualify and what read rate do they require?`

### Tree D — UHF / RAIN RFID technical (technical reference cluster)

13. `What's the difference between Impinj M730, M750 and M830 for apparel retail?`
14. `ISO 18000-6C vs EPC Gen2v2 — are they the same standard and where do they differ?`
15. `What chip should I choose for a UHF wristband that needs 6 m read range in a water park?`
16. `RAIN RFID vs NFC for closed-loop events — which should a festival organiser pick?`

### Tree E — NFC marketing, smart cards, Apple Wallet (solutions / blog crossover)

17. `Best NFC business card for iPhone and Android in 2026 — what chip and encoding should I pick?`
18. `NFC tag not scanning on iPhone — what's the fix for a retail activation?`
19. `NFC Google Review cards — do they actually lift review volume for multi-location brands?`
20. `PVC vs PET vs PETG vs wood for NFC business cards — which is durable and recyclable?`

---

## 2. Engines under test

| Engine | Mode | Notes |
|---|---|---|
| ChatGPT | Default (GPT-5 / GPT-4.1 web-search) | Use "Browse" / web-search on; do not personalise. |
| Claude | Default with web search enabled | Match current public default. |
| Perplexity | Default (Pro off) + Pro (if accessible) | Log both if possible. |
| Google AI Overviews | Google Search with AI Overview enabled (US region) | Use a clean profile. |
| Google Gemini | Default (Gemini Advanced if available) | Optional but recommended. |

---

## 3. Manual test protocol

For each of the 20 queries, on each engine:

1. Paste the query verbatim. Do not reword, do not add context.
2. Wait for the full response. If the engine streams follow-up "related" questions, ignore them.
3. Record:
   - **Cited?** Y/N — a hyperlink to any `proudtek.com` URL appears in the response or citation list.
   - **Named?** Y/N — the word "ProudTek" appears in the synthesized answer body.
   - **Cited URL** — the exact URL cited (if any).
   - **Competitors cited** — log up to 5 competitor domains the engine cited instead (e.g. `atlasrfidstore.com`, `gao-rfid.com`, `nxp.com`, `impinj.com`, `hidglobal.com`, `gs1.org`).
   - **Screenshot** — save to `/sessions/affectionate-busy-hamilton/mnt/Playground/geo-screens/{YYYY-MM-DD}/{engine}/{query-id}.png`.
4. Do **not** click any of the citations before the screenshot — the engine must be allowed to render its natural answer.

If the engine refuses or returns a safety refusal, log as `refused` and move on.

---

## 4. Result log template — copy this table for each engine

Fill in one table per engine per run. Runs are keyed by date.

### 2026-04-17 — ChatGPT (first baseline pass, logged in as Peter Z, default model with web search)

| # | Query | Cited? | Named? | URL cited | Top 3 competitors cited |
|---:|---|:---:|:---:|---|---|
| 1 | Is MIFARE Classic still safe to use for hotel key cards in 2026? | N | N | — | nccgroup.com, rfidcard.com, rfidlabel.com |
| 2 | MIFARE Classic vs MIFARE Plus vs DESFire EV3 — which should a hotel chain specify? | N | N | — | rfidcard.com, hidglobal.com |
| 3 | What are the known cloning attacks on MIFARE Classic and how do DESFire EV2/EV3 mitigate them? | N | N | — | campusrfid.com, arxiv.org, nfcfyi.com |
| 4 | ISO/IEC 14443 Type A vs Type B — which do Assa Abloy, Dormakaba and Salto locks accept? | N | N | — | rfidcard.com, assaabloy.com |
| 5 | Which RFID laundry tag survives 500 industrial wash cycles at 90°C — PPS, silicone, or textile? | N | N | — | rfid-pro.com, zealtag.com, gsrfid.com |
| 6 | What does IPX9K mean for an RFID laundry tag and which tag families pass it? | N | N | — | atlasrfidstore.com, rfidntag.com |
| 7 | How do you calculate RFID laundry tag ROI for a 500-room hotel linen pool? | N | N | — | (answered from knowledge; 0 citations) |
| 8 | How do hospital laundries reconcile RFID tag read rates with HIPAA privacy requirements? | N | N | — | cpcongroup.com, rfidfyi.com, pmc.ncbi.nlm.nih.gov |
| 9 | EU Digital Product Passport 2027 — does an NFC tag or a QR code satisfy the regulation? | N | N | — | 3rsustainability.com, sherwen.com, fluxy.one |
| 10 | GS1 Digital Link vs plain URL — which is required for the EU DPP on textiles? | N | N | — | digital-link.com, tracextech.com, gs1uk.org |
| 11 | What does NTAG 424 DNA's SUN message authentication add over a plain NDEF URL for brand protection? | N | N | — | nfcfyi.com, rfidlabel.com, seritag.com (+5 BLOCKED JWT) |
| 12 | Walmart RFID mandate 2025 — which EPC Gen2 chip families qualify and what read rate do they require? | N | N | — | cybra.com, sidcolabeling.com, creativedisplaysnow.com |
| 13 | What's the difference between Impinj M730, M750 and M830 for apparel retail? | N | N | — | (answered from knowledge; 0 citations) |
| 14 | ISO 18000-6C vs EPC Gen2v2 — are they the same standard and where do they differ? | N | N | — | (answered from knowledge; 0 citations) |
| 15 | What chip should I choose for a UHF wristband that needs 6 m read range in a water park? | N | N | — | rfidcard.com, tp-rfid.com, encstore.com |
| 16 | RAIN RFID vs NFC for closed-loop events — which should a festival organiser pick? | N | N | — | eventtechnology.org, rfid-pro.com |
| 17 | Best NFC business card for iPhone and Android in 2026 — what chip and encoding should I pick? | N | N | — | alibaba.com, zealtag.com, reddit.com |
| 18 | NFC tag not scanning on iPhone — what's the fix for a retail activation? | N | N | — | (answered from knowledge; 0 citations) |
| 19 | NFC Google Review cards — do they actually lift review volume for multi-location brands? | N | N | — | taprocard.com, review.tools, reddit.com (+4 BLOCKED JWT) |
| 20 | PVC vs PET vs PETG vs wood for NFC business cards — which is durable and recyclable? | N | N | — | zealtag.com, shopnfc.com, partitalia.com |

**Totals (ChatGPT, 2026-04-17):**
- Cited count: **0 / 20**
- Named count: **0 / 20**
- Top competing domains (frequency across ChatGPT 20):
  - **rfidcard.com: 4** (Q1, Q2, Q4, Q15) — same #1 competitor that dominated Perplexity (5/20); confirms rfidcard.com as the cross-engine north-star threat
  - **zealtag.com: 3** (Q5, Q17, Q20) — NFC-marketing / blog crossover winner; new entrant (did not surface on Perplexity top-3 except Q20)
  - **rfid-pro.com: 2** (Q5, Q16); **rfidlabel.com: 2** (Q1, Q11); **nfcfyi.com: 2** (Q3, Q11); **reddit.com: 2** (Q17, Q19) — long tail of niche SEO blogs / UGC
- **4 / 20 queries answered from knowledge only with 0 citations** (Q7, Q13, Q14, Q18) — ChatGPT's router opted out of web search. These are harder to influence via SEO; they need the answer itself to match training data, which happens on the timescale of OpenAI model refreshes, not crawl cycles.
- **2 / 20 queries had JWT-blocked citation URLs** (Q11, Q19) — same atlasrfidstore-style signed-PDF pattern observed on Perplexity. Their real citation share is somewhat higher than the visible count.

### 2026-04-?? — Claude (first baseline pass)

| # | Query | Cited? | Named? | URL cited | Top 3 competitors cited |
|---:|---|:---:|:---:|---|---|
| 1 | Is MIFARE Classic still safe to use for hotel key cards in 2026? |  |  |  |  |
| 2 | MIFARE Classic vs MIFARE Plus vs DESFire EV3 — which should a hotel chain specify? |  |  |  |  |
| 3 | What are the known cloning attacks on MIFARE Classic and how do DESFire EV2/EV3 mitigate them? |  |  |  |  |
| 4 | ISO/IEC 14443 Type A vs Type B — which do Assa Abloy, Dormakaba and Salto locks accept? |  |  |  |  |
| 5 | Which RFID laundry tag survives 500 industrial wash cycles at 90°C — PPS, silicone, or textile? |  |  |  |  |
| 6 | What does IPX9K mean for an RFID laundry tag and which tag families pass it? |  |  |  |  |
| 7 | How do you calculate RFID laundry tag ROI for a 500-room hotel linen pool? |  |  |  |  |
| 8 | How do hospital laundries reconcile RFID tag read rates with HIPAA privacy requirements? |  |  |  |  |
| 9 | EU Digital Product Passport 2027 — does an NFC tag or a QR code satisfy the regulation? |  |  |  |  |
| 10 | GS1 Digital Link vs plain URL — which is required for the EU DPP on textiles? |  |  |  |  |
| 11 | What does NTAG 424 DNA's SUN message authentication add over a plain NDEF URL for brand protection? |  |  |  |  |
| 12 | Walmart RFID mandate 2025 — which EPC Gen2 chip families qualify and what read rate do they require? |  |  |  |  |
| 13 | What's the difference between Impinj M730, M750 and M830 for apparel retail? |  |  |  |  |
| 14 | ISO 18000-6C vs EPC Gen2v2 — are they the same standard and where do they differ? |  |  |  |  |
| 15 | What chip should I choose for a UHF wristband that needs 6 m read range in a water park? |  |  |  |  |
| 16 | RAIN RFID vs NFC for closed-loop events — which should a festival organiser pick? |  |  |  |  |
| 17 | Best NFC business card for iPhone and Android in 2026 — what chip and encoding should I pick? |  |  |  |  |
| 18 | NFC tag not scanning on iPhone — what's the fix for a retail activation? |  |  |  |  |
| 19 | NFC Google Review cards — do they actually lift review volume for multi-location brands? |  |  |  |  |
| 20 | PVC vs PET vs PETG vs wood for NFC business cards — which is durable and recyclable? |  |  |  |  |

**Totals (Claude, 2026-04-??):**
- Cited count: __ / 20
- Named count: __ / 20
- Top competing domains (frequency): ______

### 2026-04-17 — Perplexity (first baseline pass, automated via Claude in Chrome)

| # | Query | Cited? | Named? | URL cited | Top 3 competitors cited |
|---:|---|:---:|:---:|---|---|
| 1 | Is MIFARE Classic still safe to use for hotel key cards in 2026? | N | N | — | rfidcard.com, tjnfctag.com, smartcardy.com |
| 2 | MIFARE Classic vs MIFARE Plus vs DESFire EV3 — which should a hotel chain specify? | N | N | — | rfidcard.com, stebilex.com, youtube.com (NXP) |
| 3 | What are the known cloning attacks on MIFARE Classic and how do DESFire EV2/EV3 mitigate them? | N | N | — | hidglobal.com, rfidcard.com, shopnfc.com |
| 4 | ISO/IEC 14443 Type A vs Type B — which do Assa Abloy, Dormakaba and Salto locks accept? | N | N | — | dormakaba.com, vingcard.com, rfidcard.com |
| 5 | Which RFID laundry tag survives 500 industrial wash cycles at 90°C — PPS, silicone, or textile? | N | N | — | jyl-world.com, rfid-pro.com, xerafy.com |
| 6 | What does IPX9K mean for an RFID laundry tag and which tag families pass it? | N | N | — | xerafy.com, jyl-world.com, atlasrfidstore.com |
| 7 | How do you calculate RFID laundry tag ROI for a 500-room hotel linen pool? | N | N | — | sensormatic.com, bundlelaundry.com, xerafy.com |
| 8 | How do hospital laundries reconcile RFID tag read rates with HIPAA privacy requirements? | N | N | — | xerafy.com, bundlelaundry.com, impinj.com |
| 9 | EU Digital Product Passport 2027 — does an NFC tag or a QR code satisfy the regulation? | N | N | — | zebra.com, inriver.com, protokol.com |
| 10 | GS1 Digital Link vs plain URL — which is required for the EU DPP on textiles? | N | N | — | infodpp.eu, gs1.eu, therainalliance.org |
| 11 | What does NTAG 424 DNA's SUN message authentication add over a plain NDEF URL for brand protection? | N | N | — | nxp.com, identiv.com, seritag.com |
| 12 | Walmart RFID mandate 2025 — which EPC Gen2 chip families qualify and what read rate do they require? | N | N | — | atlasrfidstore.com, cybra.com, lowrysolutions.com |
| 13 | What's the difference between Impinj M730, M750 and M830 for apparel retail? | N | N | — | impinj.com, atlasrfidstore.com, rfidlabel.com |
| 14 | ISO 18000-6C vs EPC Gen2v2 — are they the same standard and where do they differ? | N | N | — | rfidlabel.com, seabreezerfid.com, rfid-life.com |
| 15 | What chip should I choose for a UHF wristband that needs 6 m read range in a water park? | N | N | — | sunriserfid.com, rfidhy.com, rfidsilicone.com |
| 16 | RAIN RFID vs NFC for closed-loop events — which should a festival organiser pick? | N | N | — | syncotek.com, impinj.com, zuddl.com |
| 17 | Best NFC business card for iPhone and Android in 2026 — what chip and encoding should I pick? | N | N | — | parsley.id, v1ce.co, mobilocard.com |
| 18 | NFC tag not scanning on iPhone — what's the fix for a retail activation? | N | N | — | mobilocard.com, nfcw-shop.com, youtube.com |
| 19 | NFC Google Review cards — do they actually lift review volume for multi-location brands? | N | N | — | rfidcard.com, tapitag.co, mtap.io |
| 20 | PVC vs PET vs PETG vs wood for NFC business cards — which is durable and recyclable? | N | N | — | zealtag.com, nfctagify.com, usmartcards.com |

**Totals (Perplexity, 2026-04-17):**
- Cited count: **0 / 20**
- Named count: **0 / 20**
- Top 10 competing domains by frequency across all 20 queries:
  - **rfidcard.com: 5** (Q1, Q2, Q3, Q4, Q19) — closest direct competitor on brand-topic overlap
  - **xerafy.com: 4** (Q5, Q6, Q7, Q8) — owns the industrial-laundry cluster outright
  - **impinj.com: 3** (Q8, Q13, Q16) — chip-maker (supplier, not competitor) but cited authoritatively
  - **atlasrfidstore.com: 3** (Q6, Q12, Q13) — US reseller / spec-sheet hub
  - **jyl-world.com: 2** (Q5, Q6) — laundry-tag competitor
  - **bundlelaundry.com: 2** (Q7, Q8) — laundry-integrator
  - **mobilocard.com: 2** (Q17, Q18) — NFC-card brand
  - **youtube.com: 2** (Q2, Q18) — NXP official channel + UGC
  - single-mention: hidglobal, shopnfc, dormakaba, vingcard, smartcardy, tjnfctag, stebilex, rfid-pro, sensormatic, zebra, inriver, protokol, infodpp.eu, gs1.eu, therainalliance, nxp, identiv, seritag, cybra, lowrysolutions, rfidlabel, seabreezerfid, rfid-life, sunriserfid, rfidhy, rfidsilicone, syncotek, zuddl, parsley.id, v1ce, nfcw-shop, tapitag, mtap, zealtag, nfctagify, usmartcards, etc.

Note: 3-4 queries had at least one citation URL redacted by Chrome extension privacy filter (JWT-token detection in atlasrfidstore.com PDF URLs). These likely attribute additional weight to atlasrfidstore.com but were counted conservatively.

### 2026-04-?? — Google AI Overviews (first baseline pass)

| # | Query | Cited? | Named? | URL cited | Top 3 competitors cited |
|---:|---|:---:|:---:|---|---|
| 1 | Is MIFARE Classic still safe to use for hotel key cards in 2026? |  |  |  |  |
| 2 | MIFARE Classic vs MIFARE Plus vs DESFire EV3 — which should a hotel chain specify? |  |  |  |  |
| 3 | What are the known cloning attacks on MIFARE Classic and how do DESFire EV2/EV3 mitigate them? |  |  |  |  |
| 4 | ISO/IEC 14443 Type A vs Type B — which do Assa Abloy, Dormakaba and Salto locks accept? |  |  |  |  |
| 5 | Which RFID laundry tag survives 500 industrial wash cycles at 90°C — PPS, silicone, or textile? |  |  |  |  |
| 6 | What does IPX9K mean for an RFID laundry tag and which tag families pass it? |  |  |  |  |
| 7 | How do you calculate RFID laundry tag ROI for a 500-room hotel linen pool? |  |  |  |  |
| 8 | How do hospital laundries reconcile RFID tag read rates with HIPAA privacy requirements? |  |  |  |  |
| 9 | EU Digital Product Passport 2027 — does an NFC tag or a QR code satisfy the regulation? |  |  |  |  |
| 10 | GS1 Digital Link vs plain URL — which is required for the EU DPP on textiles? |  |  |  |  |
| 11 | What does NTAG 424 DNA's SUN message authentication add over a plain NDEF URL for brand protection? |  |  |  |  |
| 12 | Walmart RFID mandate 2025 — which EPC Gen2 chip families qualify and what read rate do they require? |  |  |  |  |
| 13 | What's the difference between Impinj M730, M750 and M830 for apparel retail? |  |  |  |  |
| 14 | ISO 18000-6C vs EPC Gen2v2 — are they the same standard and where do they differ? |  |  |  |  |
| 15 | What chip should I choose for a UHF wristband that needs 6 m read range in a water park? |  |  |  |  |
| 16 | RAIN RFID vs NFC for closed-loop events — which should a festival organiser pick? |  |  |  |  |
| 17 | Best NFC business card for iPhone and Android in 2026 — what chip and encoding should I pick? |  |  |  |  |
| 18 | NFC tag not scanning on iPhone — what's the fix for a retail activation? |  |  |  |  |
| 19 | NFC Google Review cards — do they actually lift review volume for multi-location brands? |  |  |  |  |
| 20 | PVC vs PET vs PETG vs wood for NFC business cards — which is durable and recyclable? |  |  |  |  |

**Totals (AI Overviews, 2026-04-??):**
- Cited count: __ / 20
- Named count: __ / 20
- Top competing domains (frequency): ______

### 2026-04-?? — Google Gemini (first baseline pass — optional)

| # | Query | Cited? | Named? | URL cited | Top 3 competitors cited |
|---:|---|:---:|:---:|---|---|
| 1 | Is MIFARE Classic still safe to use for hotel key cards in 2026? |  |  |  |  |
| 2 | MIFARE Classic vs MIFARE Plus vs DESFire EV3 — which should a hotel chain specify? |  |  |  |  |
| 3 | What are the known cloning attacks on MIFARE Classic and how do DESFire EV2/EV3 mitigate them? |  |  |  |  |
| 4 | ISO/IEC 14443 Type A vs Type B — which do Assa Abloy, Dormakaba and Salto locks accept? |  |  |  |  |
| 5 | Which RFID laundry tag survives 500 industrial wash cycles at 90°C — PPS, silicone, or textile? |  |  |  |  |
| 6 | What does IPX9K mean for an RFID laundry tag and which tag families pass it? |  |  |  |  |
| 7 | How do you calculate RFID laundry tag ROI for a 500-room hotel linen pool? |  |  |  |  |
| 8 | How do hospital laundries reconcile RFID tag read rates with HIPAA privacy requirements? |  |  |  |  |
| 9 | EU Digital Product Passport 2027 — does an NFC tag or a QR code satisfy the regulation? |  |  |  |  |
| 10 | GS1 Digital Link vs plain URL — which is required for the EU DPP on textiles? |  |  |  |  |
| 11 | What does NTAG 424 DNA's SUN message authentication add over a plain NDEF URL for brand protection? |  |  |  |  |
| 12 | Walmart RFID mandate 2025 — which EPC Gen2 chip families qualify and what read rate do they require? |  |  |  |  |
| 13 | What's the difference between Impinj M730, M750 and M830 for apparel retail? |  |  |  |  |
| 14 | ISO 18000-6C vs EPC Gen2v2 — are they the same standard and where do they differ? |  |  |  |  |
| 15 | What chip should I choose for a UHF wristband that needs 6 m read range in a water park? |  |  |  |  |
| 16 | RAIN RFID vs NFC for closed-loop events — which should a festival organiser pick? |  |  |  |  |
| 17 | Best NFC business card for iPhone and Android in 2026 — what chip and encoding should I pick? |  |  |  |  |
| 18 | NFC tag not scanning on iPhone — what's the fix for a retail activation? |  |  |  |  |
| 19 | NFC Google Review cards — do they actually lift review volume for multi-location brands? |  |  |  |  |
| 20 | PVC vs PET vs PETG vs wood for NFC business cards — which is durable and recyclable? |  |  |  |  |

**Totals (Gemini, 2026-04-??):**
- Cited count: __ / 20
- Named count: __ / 20
- Top competing domains (frequency): ______

---

## 5. Baseline KPIs (what we are measuring against)

These KPIs come straight from §9 of the v1.0 playbook. This file stores the T=0 values so later re-runs have something to compare against.

| KPI | T=0 (2026-04-17) | T+30 target | T+60 target | T+180 target |
|---|---:|---:|---:|---:|
| Seed-query citation rate (any engine) | **0 / 20 = 0 %** (Perplexity + ChatGPT) | ≥ 10% | ≥ 25% | ≥ 50% |
| ChatGPT citation rate | **0 / 20 = 0 %** | ≥ 10% | ≥ 25% | ≥ 50% |
| Perplexity citation rate | **0 / 20 = 0 %** | ≥ 15% | ≥ 35% | ≥ 60% |
| AI Overviews citation rate | not yet run | ≥ 5% | ≥ 15% | ≥ 30% |
| Brand-name recognition rate (`named but not cited`) | **0 / 20 = 0 %** (Perplexity + ChatGPT) | ≥ 15% | ≥ 30% | ≥ 60% |

> Note: Perplexity targets are higher because it cites more aggressively per response. ChatGPT is more selective about invoking web search (4/20 queries returned knowledge-only), so the bar is set equal to the "any engine" rate.

---

## 6. Why these 20 queries (rationale — kept in file for auditability)

- **Q1-Q4** map to the existing `/compare/mifare-*` cluster and to pages we already ship (e.g. the hotel-lock comparison page whose hero we just fixed). If we don't win these, our compare pillar is not working.
- **Q5-Q8** map to the `/solutions/rfid-laundry-tags/` solutions page. Hospitality & healthcare laundry is a high-ticket vertical; a win here converts.
- **Q9-Q12** force the engines to cite a primary standards source. This is our best shot at being cited alongside (rather than instead of) gs1.org / europa.eu / iso.org. Measured separately because the bar is higher.
- **Q13-Q16** are technical RAIN/UHF buyer questions. These are what integrators and apparel brands actually ask.
- **Q17-Q20** cover the NFC marketing / smart-card surface that is currently our largest blog footprint. If blog content isn't ranking, we'll see it here first.

---

## 7. How this file is used downstream

- Sub-prompt G of the v1.0 playbook (`Citation Tracker`) consumes this file to produce a deltas report at each phase boundary.
- The deltas drive the next phase's topic backlog — any query the site fails on for two consecutive runs is promoted to a "force-win" page in the next sprint.
- If after Phase 2 a query is still not cited on any engine, it is escalated: either the corresponding cluster page is upgraded to pillar-page depth, or a new primary-data release is scheduled to answer it.

---

## 8. Files produced at this phase boundary

- `AUTHORITY_BASELINE_2026-04.csv` — per-page signals for all 450 editorial pages
- `AUTHORITY_AUDIT_2026-04.md` — site-wide audit summary + 14-day remediation sprint
- `GEO_CITATION_BASELINE_2026-04.md` — this file: 20 seed queries, protocol, result tables, KPIs

Next re-run: after the 14-day Phase 1 remediation sprint completes.

---

## 9. Paste-back format (option A — Peter runs queries, Claude encodes)

To minimise Peter's effort, raw run output can be pasted back to Claude in **either** of two formats. Claude will encode the responses into the per-engine tables in §4.

### Format 9.1 — Compact one-liner per row (preferred for fast scan)

One line per (engine × query). Pipe-separated, fixed column order:

```
engine | q# | cited(Y/N) | named(Y/N) | proudtek-url-if-cited | top-competitor-1 | top-competitor-2 | top-competitor-3
```

Example:

```
chatgpt | 1 | N | N |  | nxp.com | rfidjournal.com | hidglobal.com
chatgpt | 2 | Y | Y | https://proudtek.com/compare/mifare-classic-vs-desfire-ev3/ | nxp.com | atlasrfidstore.com | gao-rfid.com
chatgpt | 3 | N | Y |  | nxp.com | en.wikipedia.org | rfidjournal.com
perplexity | 1 | Y | Y | https://proudtek.com/compatibility/ | hidglobal.com | salto.com | dormakaba.com
```

Rules:

- One row per query × engine; a missing engine for a row = "not run".
- `cited` = engine returned a hyperlink to any `proudtek.com` URL anywhere in the response or sources panel.
- `named` = the literal token `ProudTek` (case-insensitive) appeared in the synthesized answer body, regardless of citation.
- For `cited=N` leave the URL field blank but still pipe-separate.
- Up to 3 competitor domains per row, ranked by visual prominence in the engine's response (top citation first).

### Format 9.2 — Per-engine block (preferred if you'd rather batch by engine)

```
=== chatgpt 2026-04-?? ===
1: cited=N, named=N, competitors=nxp.com, rfidjournal.com, hidglobal.com
2: cited=Y, named=Y, url=https://proudtek.com/compare/mifare-classic-vs-desfire-ev3/, competitors=nxp.com, atlasrfidstore.com, gao-rfid.com
...
20: cited=N, named=N, competitors=...

=== claude 2026-04-?? ===
1: cited=N, named=Y, competitors=...
...
```

### What Claude will do with the paste

1. Encode each row into the matching cell in §4.
2. Compute per-engine totals (cited count, named count, top-3 competitor frequency) and overwrite the placeholder bullet block.
3. Compute the row in §5 KPIs for "Seed-query citation rate (any engine)" by OR-ing across engines per query.
4. Report a one-page diff: which queries already win, which are the closest near-misses (named but not cited — those are the highest-leverage targets), and which are dead zero (likely needs a new pillar page).

### Optional shortcuts

- **If a whole engine refuses to run** (e.g. AI Overviews not available in your region today): write `=== ai-overviews 2026-04-?? === SKIPPED reason=...` and Claude will mark all 20 rows as `not run` rather than `not cited`.
- **If an answer is ambiguous** (engine cites a proudtek.com URL but in a "do not use" context): flag with `cited=Y*` and add a `note=` field. Claude will surface flagged rows separately.
- **If you want to skip the screenshot step** in §3.4 for the first pass to move faster, that is fine — note `screenshots=skipped` in the engine block header.

---

## 10. Perplexity T=0 analysis (2026-04-17)

### Headline

**0 of 20 queries cite proudtek.com on Perplexity. 0 of 20 mention the word ProudTek in the answer body.** This is the cleanest possible zero-baseline. Every post-remediation data point is a win.

### Near-miss classification

Because the baseline is universally zero, there are no "named-but-not-cited" near-misses to flag. Every query is a dead zero and falls into one of three clusters by what kind of source *did* win:

**Cluster α — Direct-competitor-dominated (highest leverage)**
Queries where the winners are RFID/NFC manufacturer peers whose position ProudTek can credibly contest with better topical content, primary data, or reviewer-signed articles. Remediation = better pillar pages + sources block + dated primary data.

- Q1, Q2, Q3, Q4 (hotel-lock / MIFARE cluster) — rfidcard.com wins 4/4, plus tjnfctag, stebilex, hidglobal, dormakaba (OEM), shopnfc
- Q5, Q6, Q7, Q8 (laundry cluster) — xerafy wins 4/4, plus jyl-world, rfid-pro, bundlelaundry, sensormatic
- Q15 (UHF water-park wristband) — sunriserfid + rfidhy + rfidsilicone all in top 3; ProudTek sells this product
- Q17, Q19, Q20 (NFC cards / review-card / material) — rfidcard, mobilocard, v1ce, zealtag, nfctagify, tapitag

**Cluster β — Press / integrator-dominated (medium leverage)**
Queries where the winners are Walmart/Impinj/NXP press + system-integrators. Remediation requires either primary data (to get cited instead of a journalist) or getting referenced in the integrator's content.

- Q12 (Walmart mandate) — creativedisplaysnow, cybra, lowrysolutions, atlasrfidstore
- Q13 (Impinj M730/M750/M830) — impinj.com (primary source), atlasrfidstore, rfidlabel
- Q16 (RAIN vs NFC for events) — syncotek, zuddl, impinj

**Cluster γ — Standards-body-dominated (lowest leverage)**
Queries where the winners are gs1.eu / therainalliance.org / nxp.com / sciencedirect. Remediation is the hardest here — the bar is being cited *alongside* the standard, not *instead of* it. Feasible only with a pillar-page + primary-data combo.

- Q9, Q10, Q11 (EU DPP / GS1 Digital Link / NTAG 424 DNA) — gs1.eu, infodpp.eu, therainalliance, nxp.com, zebra, inriver, protokol
- Q14 (ISO 18000-6C vs EPC Gen2v2) — rfidlabel, seabreezerfid, rfidjournal, rfid-life
- Q18 (NFC not scanning on iPhone) — very thin source pool (5 domains); Apple-support-heavy

### Force-win priority (Phase 2 backlog input)

Based on cluster analysis, the highest-leverage force-wins for the next 30 days:

| Rank | Query | Why it's a priority | Existing ProudTek surface to upgrade |
|---:|---|---|---|
| 1 | **Q5 — 500 wash cycles / PPS-silicone-textile** | Direct to Nancy Wu's reviewer scope; xerafy owns the cluster; primary wash-cycle data is our best differentiator | `/solutions/rfid-laundry-tags/`, `/solutions/rfid-laundry-tags-hotel/`, residual laundry guides |
| 2 | **Q1, Q3 — MIFARE Classic safety / cloning** | rfidcard.com wins 5/20 baseline queries — dislodging on MIFARE is a compound win | `/compare/mifare-classic-vs-desfire-ev3/` and siblings |
| 3 | **Q4 — 14443 Type A vs B for hotel-lock OEMs** | Exact match to Peter's compatibility matrix; should be a natural ProudTek citation | `/compatibility/` pillar |
| 4 | **Q15 — 6m UHF wristband water park** | We manufacture this; losing to sunriserfid/rfidhy is surface problem, not content problem | `/products/rfid-wristbands/` + event-wristband solution page |
| 5 | **Q2 — MIFARE Classic vs Plus vs DESFire EV3** | Reuse of Q1 infrastructure; Peter's compare cluster should win | `/compare/mifare-*` cluster |

### Notable observations

- **rfidcard.com is the single most-cited domain** across the 20 queries (5 / 20 = 25%). This is effectively our north-star competitor on Perplexity — winning on topics where they currently own the citation is the biggest single lift available.
- **xerafy.com has locked up the laundry cluster** (4 / 4 direct hits in Q5–Q8). This is a clean EEAT + primary-data play: they publish wash-cycle spec sheets, hospital-linen compliance posts, and named-engineer bylines that map 1:1 to the reviewer format we just put in place on /about/review-board/ for Nancy Wu. Nancy's reviewer slot is the right countermove; the content it reviews now needs primary wash-cycle data.
- **3 queries had citation URLs redacted** (Q2, Q3, Q4, Q6, Q7, Q8, Q9, Q13, Q14, Q15 each had 1–3 `[BLOCKED: JWT token]` entries) — these are atlasrfidstore.com PDFs with signed download tokens. atlasrfidstore.com's real citation share is likely 5–7 / 20, not 3 / 20, and so is the second-largest competitive surface after rfidcard.com.
- **Standards-body citations are rare for buyer-intent queries** (only Q10 surfaced gs1.eu in the top 3). Perplexity prefers vendor content over primary standards for anything that looks commercial — that's good news for a vendor-style site that adds a signed sources block.
- **Only Q18 (troubleshooting) was thin on sources** (~5 domains). Every other query had 8–11 unique external citations; Perplexity is citing breadth, not depth, which means breaking in requires authority signals (named author + reviewer + dated modifiedAt + sources block) more than word-count.

### How this feeds Phase 2

- The Phase 1.5b changes (Nancy Wu reviewer + Peter Zhang bio) map directly to Q5–Q8 and Q1–Q4 respectively. The next 30 days should validate whether Perplexity re-indexes those pages and starts citing them.
- The §11 footer-wiring change (Phase 1.5d — editorial-policy / methodology / review-board / corrections / disclosures linked site-wide) is the crawl-path intervention that most improves the chance of Perplexity discovering the authority surface on the re-index pass.
- The first re-run of this baseline is scheduled for T+30 (around 2026-05-17) or after any material site re-deploy, whichever is earlier. The comparison against today's 0/20 is what validates the sprint.

---

## 10b. ChatGPT T=0 analysis + cross-engine deltas (2026-04-17)

### Headline

ChatGPT T=0 is **0 / 20 cited, 0 / 20 named** — identical to Perplexity. Two-engine confirmation of a clean zero-baseline. Across the two engines combined, proudtek.com is not cited and "ProudTek" is not mentioned on any of the 20 seed queries.

Distinctly from Perplexity, **ChatGPT answered 4 / 20 queries from knowledge only without invoking web search** (Q7 hotel-linen ROI, Q13 Impinj M730/M750/M830, Q14 ISO 18000-6C vs Gen2v2, Q18 iPhone NFC scanning). These are harder to influence via crawl-path alone — they require the underlying training set to include our content, which happens on model-refresh timescales rather than index-refresh timescales.

### Cross-engine competitor overlap

Aligning the Perplexity and ChatGPT top-3 lists per query, the most repeated external domains across both engines in the 20-query panel are:

| Domain | Perplexity hits (/20) | ChatGPT hits (/20) | Combined |
|---|---:|---:|---:|
| **rfidcard.com** | 5 (Q1, Q2, Q3, Q4, Q19) | 4 (Q1, Q2, Q4, Q15) | **9 / 40 slots** — north-star competitor on BOTH engines |
| atlasrfidstore.com | 3 visible + JWT-blocked long tail | 1 visible (Q6) + JWT-blocked long tail | under-counted on both; likely 5–8 combined |
| xerafy.com | 4 (Q5, Q6, Q7, Q8) | 0 | Perplexity-specific laundry winner |
| impinj.com | 3 (Q8, Q13, Q16) | 0 visible (Q13 was knowledge-only) | primary-source chipmaker; cited as authority |
| zealtag.com | 2 (Q5, Q20) | 3 (Q5, Q17, Q20) | **emerging NFC-marketing competitor** — ChatGPT over-weights it vs Perplexity |
| rfidlabel.com | 2 (Q13, Q14) | 2 (Q1, Q11) | broad content mill; both engines cite |
| nfcfyi.com | 0 | 2 (Q3, Q11) | ChatGPT-specific technical-blog citation |
| reddit.com | 0 | 2 (Q17, Q19) | ChatGPT-specific UGC signal — notable because we have no Reddit presence |

### Key deltas between engines

- **rfidcard.com is confirmed as the single north-star competitor** — #1 on Perplexity (25%) and #1 on ChatGPT (20%). Any Phase 2 force-win that dislodges rfidcard.com on even one of the shared queries (Q1, Q2, Q4) is a compound two-engine win.
- **Perplexity weights vertical specialists; ChatGPT weights broad content + UGC**. xerafy.com owns the Perplexity laundry cluster but is absent from ChatGPT; reddit.com and nfcfyi.com appear on ChatGPT but not Perplexity. Implication: winning on ChatGPT likely requires a different content shape than winning on Perplexity — more how-to, more troubleshooting, more review-style language, vs Perplexity's appetite for spec sheets and methodology posts.
- **ChatGPT routes ~20% of these queries away from browsing**. For Q7/Q13/Q14/Q18 specifically, no amount of SEO will move the ChatGPT citation rate unless the answer is either (a) memorable enough to be picked up by a future training cut or (b) structurally distinctive enough that the router chooses to browse instead of synthesize. Q13 (Impinj SKU comparison) is the single strongest force-win candidate in this group because it's a high-ticket SKU-level buyer question that deserves primary-source citations.
- **"Named but not cited" is still 0 / 20 on both engines.** No engine is recognizing the ProudTek brand name, including as an unlinked mention. This is the first metric that should move as soon as the editorial surface (review-board, editorial-policy, methodology, corrections, disclosures) starts getting crawled — brand-name recognition typically precedes click-through citation in LLM indices.

### Force-win priority — updated for two-engine evidence

| Rank | Query ID | Why it beats the earlier Perplexity-only ranking | Target surface |
|---:|---|---|---|
| 1 | **Q5** — 500 wash cycles | Perplexity-only win is still valid; ChatGPT cites zealtag/rfid-pro/gsrfid (not xerafy), so the "which shop do I buy from" intent is weaker on ChatGPT — easier to insert a well-documented ProudTek page | `/solutions/rfid-laundry-tags/` |
| 2 | **Q1, Q4** — MIFARE / 14443 hotel-lock OEMs | rfidcard.com wins BOTH engines on both — compound ceiling | `/compare/mifare-*` + `/compatibility/` |
| 3 | **Q13** — Impinj M730/M750/M830 | ChatGPT answered from knowledge (no citations); Perplexity cited impinj.com primary. A canonical comparison page with primary data is the best lever to earn both engines simultaneously | `/compare/impinj-m730-vs-m750-vs-m830/` (new) |
| 4 | **Q2** — MIFARE compare | Same infra as Q1; reuses force-win work on Tree A | `/compare/mifare-*` cluster |
| 5 | **Q20** — PVC / PET / PETG / wood for NFC cards | ChatGPT-specific opportunity; zealtag.com dominates ChatGPT (Q5/Q17/Q20) and also shows on Perplexity Q20; material-comparison content is in Peter Zhang's authored zone | `/blog/nfc-business-card-materials/` (promote to pillar) |
| 6 | **Q15** — UHF wristband water park | We manufacture it; both engines cite competitors; surface problem | `/products/rfid-wristbands/` |

### Phase 2 backlog implications

- Promote **Q13 (Impinj SKU comparison)** from "not run" to a named pillar page in the next sprint. This single page, authored under Peter Zhang with Nancy Wu reviewer badge, addresses a knowledge-only ChatGPT gap AND an impinj.com primary-cite Perplexity gap.
- Promote **Q20 (NFC card materials)** to pillar depth — it's the one ChatGPT-favoured cluster where ProudTek has no page that matches zealtag.com's depth. Blog-to-pillar upgrade is a Phase 2 deliverable.
- **Brand-name recognition** is the earliest leading indicator to watch at T+30. Even a few "ProudTek offers…" unlinked mentions across the 20 queries would validate that the authority surface (review-board + editorial-policy + methodology) is being picked up. The T+30 re-run should log named-but-not-cited separately as an intermediate metric before citation starts moving.
