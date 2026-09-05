# Phase 11 — GEO Citation Benchmark (baseline)

Date: 2026-09-02 (00:40–01:05 EDT). Language: English queries; engine UI locale zh-CN. Location: Chrome session in China time zone (UTC+8), Google forced `hl=en&gl=us`.
Engines: **Perplexity** (perplexity.ai, web search mode) and **Google AI Overviews** (google.com). 
**Important limitation:** the non-personalised built-in browser could not be used — perplexity.ai served a Cloudflare "verify you are human" check (not bypassed, per rules) and google.com timed out. All runs below were made in the owner's Chrome profile, which is **signed in to Perplexity ("Peter Zhang", Max plan, with prior threads about proudtek.com and rfidak.com) and to Google**. Results may therefore be personalised in Proud Tek's favour and must be treated as an upper bound. A clean-profile re-run is scheduled in the measurement plan.

## 1. Fixed benchmark set and results

| # | Category | Exact query | Engine | Run | Sources cited (hosts, in order shown) | Proud Tek cited? | Cited URL | Supported claim | Position | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Chip comparison | NTAG213 vs NTAG215 vs NTAG216 difference which to choose | Perplexity | 1 | nxp.com, uelectronics.com, orangetags.com, cupass.com, rfid-pro.com, rfidcard.com, rfidmfg.com, docs.nxp.com, manuals.plus, nfc.cards, rfidsilicone.com, taptag.shop | No | — | — | — | Answer correct (144/504/888 B), NXP primary cited; competitor rfidmfg.com cited |
| 1g | Chip comparison | ntag213 vs ntag215 vs ntag216 | Google AIO | 1 | AIO: asiarfid.com, seritag.com, rfidcard.com, nfcw-shop.com | No | — | — | — | Proud Tek absent from AIO and top-10 |
| 2 | Product selection | which RFID chip for hotel key cards MIFARE Classic or DESFire | Perplexity | 1 | vingcard.com, community.nxp.com, cupass.com, wikipedia, rfidcard.com, dangerousthings forum, nexqo.com, dyezz.com, reddit, standardplasticcards.com, synometrix.com, hotelsmarters.com, focus-rfid.com | No | — | — | — | Recommends DESFire EV3; vendor (Vingcard) + NXP community cited |
| 3 | Troubleshooting | NFC tag not scanning on iPhone how to fix | Perplexity | 1 | apps.apple.com, nfctagify.com, community.nxp.com, howtoisolve.com, **proudtek.com**, community.st.com, discussions.apple.com, reddit, techwiser, shelpful, matteralpha, gototags, groovypost, dangerousthings, youtube | **Yes** | /blog/nfc-tag-not-scanning-iphone-fix/ | "the tag is rarely the culprit: every iPhone…" (troubleshooting steps) | 7 of 29 links | Page is **not indexed by Google** ("unknown"), yet Perplexity's index has it |
| 4 | Industrial laundry | RFID laundry tags PPS vs silicone which lasts longer in industrial laundry | Perplexity | 1 | cykeorfid.com, zealtag.com, jyl-world.com, **proudtek.com** (×2), rfidhy.com, rfidntag.com, gaorfid.com, rfid-pro.com, smart-rfidtag.com, rfidsilicone.com, gialer.com, rfidecho.com | **Yes** | /solutions/rfid-laundry-tags/ ; /products/rfid-tags/rfid-pps-laundry-chip/ | PPS durability vs silicone | 4 of 15 | Preferred buy page (Phase 5 #15) cited ✓ |
| 4g | Industrial laundry | rfid laundry tags pps vs silicone | Google AIO | 1 | AIO: xiucheng rfid (rfid-pro.com), Xinyetong; SERP: rfid-pro, asiarfid, jyl-world, cykeorfid, rfidhy… | No | — | — | — | — |
| 5 | Hotel key cards / supplier | RFID hotel key card manufacturer China | Perplexity | 1 | **rfidak.com**, rfidcardfactory.com, sunlanrfid.com, morerfid.com, made-in-china.com, linkedin.com, mindrfid.com | No (proudtek.com) — **rfidak.com cited first**; answer names "RFIDAK / Shenzhen Proud Tek" | — | — | rfidak #1 | Sister brand takes the supplier slot |
| 5 | | same | Perplexity | 2 | cdmind.en.made-in-china.com, **rfidak.com**, zfcards.com, rfidcardfactory.com, made-in-china.com, alibaba.com | No / rfidak yes | — | — | rfidak #2 | consistent |
| 5 | | same | Perplexity | 3 | cdmind.en.made-in-china.com, **rfidak.com**, made-in-china.com, zfcards.com, rfidcardfactory.com, alibaba.com | No / rfidak yes | — | — | rfidak #2 | consistent (3/3) |
| 5g | | rfid hotel key card manufacturer china | Google AIO | 1 | AIO: rfidcardfactory.com, sunlanrfid.com, made-in-china.com, morerfid.com, tjnfctag.com | No; rfidak no | — | — | — | — |
| 6 | Event wristbands | RFID wristbands for festivals bulk supplier silicone vs fabric | Perplexity | 1 | **rfidak.com**, rfidmfg.com, asiawristband.com, idcband.com, nexqo.com, zdrfid.com, morerfid.com, nfctagfactory.com, wristbandhy.com, wristways.com, reddit, wristband.com, ruixinggifts.com, aac.com.au | No / rfidak yes (#1) | — | — | rfidak #1 | Proud Tek's own wristband pages not cited |
| 7 | UHF labels | UHF RFID windshield tag read range for vehicle identification parking | Perplexity | 1 | emxaccesscontrolsensors.com, nedapidentification.com, rocketrfid.com, tagmaster.com, tagmasterna.com, idplate.com, jiarfidtag.com, alphaintercom.com, gaorfid.com, custom-rfid-tags.com, cykeorfid.com, szimagetech.com, rfidlabel.com | No | — | — | — | reader/system vendors dominate |
| 8 | NFC authentication | NTAG 424 DNA anti-counterfeit authentication how does SUN work | Perplexity | 1 | nxp.com, github.com, community.nxp.com, stackoverflow, reddit, rfidlabel.com, nfc.cool, rfidcard.com, dangerousthings, d-logic.com, store.gototags.com | No | — | — | — | primary (NXP) + developer sources |
| 9 | RFID pricing | how much does an RFID tag cost per unit 2026 UHF label vs NFC card | Perplexity | 1 | **proudtek.com** (×2), rfidak.com, rfidmfg.com, rfidfactoryhub.com, cpcongroup.com, accio.com, alibaba.com, m.made-in-china.com, cubitpackaging.com, accio.ai | **Yes** | /guides/rfid-card-cost/ ; /blog/cost-per-rfid-tag-2026/ | "$0.03–$0.08 per UHF label at high volume … $0.30–$0.70 per NFC card" attributed to proudtek | **1** | The cited figures are UNVERIFIED first-party claims (Phase 4 S-05/S-06) → **unsupported answer propagated** |
| 9 | | same | Perplexity | 2 | **proudtek.com** (×2), rfidmfg.com, rfidak.com, cpcongroup.com, alibaba.com, cubitpackaging.com, made-in-china.com, rfidtag.com, m.indiamart.com, accio.com | Yes | same two URLs | same | 1 | consistent (2/2) |
| 9g | | how much does an rfid tag cost per unit | Google AIO | 1 | AIO: rfidtag.com, rfidlabel.com, rfidjournal.com, senitron.net, cykeorfid.com, rfidhy.com, jnrfid.com, nfcwork.com, msmsolutions.com | No | — | — | — | — |
| 10 | Supplier evaluation | how to verify an RFID manufacturer in China ISO 9001 certificate and factory audit | Perplexity | 1 | iaf.nu, cnas.org.cn, aqiservice.com, iafcertsearch.org, tradeaiders.com, standards.iteh.ai, maplesourcing.com, streamline.business, easyimex.com, linkedin.com, chinacheckup.com, et2c.com, oxebridge.com | No | — | — | — | Proud Tek's certification/verification guides not cited |

Runs: 14 (Perplexity 10 queries, 2 repeated to 3 and 2 runs; Google AIO 4 queries). Repeats of the remaining priority queries were not practical in this session (rate/time); consistency is therefore established only for #5 and #9.

## 2. Rates (Perplexity, 10 distinct queries; personalised-session caveat applies)

| Metric | Definition | Result |
| --- | --- | --- |
| Brand mention rate | answer text mentions "Proud Tek" (or "Shenzhen Proud Tek") | 4/10 (Q3 via cited title, Q4, Q5 as "RFIDAK / Shenzhen Proud Tek", Q9) |
| Domain citation rate — proudtek.com | ≥1 proudtek.com URL among cited sources | **3/10** (Q3, Q4, Q9) |
| Domain citation rate — rfidak.com (sister brand) | | **3/10** (Q5, Q6, Q9) — never both brands for supplier queries; rfidak wins supplier/wristband intents |
| Preferred-page citation rate | cited URL equals the Phase 5 preferred URL for that intent | 2/3 of the proudtek citations (Q4 → /solutions/rfid-laundry-tags/ ✓; Q9 → cost guide/blog ✓ per #18; Q3 → troubleshooting blog, no preferred page defined) |
| Citation consistency | same result across repeated runs | Q5: rfidak 3/3, proudtek 0/3; Q9: proudtek #1 2/2 |
| Unsupported-answer rate | answers that repeat a Proud Tek claim not backed by evidence | **1/3 proudtek citations** (Q9 price ranges) — 0 of the other cited statements were unverifiable chip facts |
| Google AI Overview | AIO shown 4/4; proudtek cited 0/4; rfidak 0/4 | consistent with Google having indexed only 34 of 535 pages |

## 3. Observations (not causation)
- Where Perplexity cites Proud Tek, it cites specific, task-shaped pages (troubleshooting fix, PPS laundry tag, cost guide) — the same content shapes the Phase 5 map treats as preferred URLs.
- The sister brand rfidak.com occupies the supplier-evaluation and wristband-supplier citations; both sites present "Shenzhen Proud Tek" facts that disagree (Phase 3 C2/C4). An answer engine currently has to choose between two versions of the same company.
- The single most-cited Proud Tek content (pricing) is also the content with the weakest evidence — the risk the brief calls "unsupported-answer rate" is real today.
- Google AIO citations go to indexed pages of competitors (rfid-pro.com, asiarfid.com, rfidcardfactory.com…). Proud Tek cannot appear until Phase 2 T1 resolves.

## 4. Re-run protocol (for the measurement plan)
Same 10 queries, English, from a clean browser profile (no Perplexity/Google login) in two locations (US, EU) at weeks 4, 8 and 12; three runs each for #1, #4, #5, #9; record the same 13 columns; add ChatGPT search and Bing Copilot when an un-personalised account is available.
