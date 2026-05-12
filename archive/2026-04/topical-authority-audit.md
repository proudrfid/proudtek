# Topical Authority Audit — Proud Tek (proudtek.com)

Audit date: 2026-04-18
Auditor: SEO/GEO strategist pass (read-only)
Source of truth: `src/content/editorial/` (Astro content collections)
Helper scripts: `/sessions/affectionate-brave-clarke/cluster_metrics.mjs`, `/sessions/affectionate-brave-clarke/cluster_titles.mjs`

---

## Executive summary

- **Cluster count:** 13 active editorial clusters.
- **Total pages:** 429 editorial JSON pages (5 product clusters = 189, industries = 15, blog = 90, guides = 39, compare = 27, compatibility = 7, solutions = 37, lp = 15, markets = 10).
- **Strongest clusters:** `products/rfid-labels` (56 pages, 779 avg words, 8.8 chip hits/page, 26 fresh-year hits, 3.8 same-cluster links/page); `products/rfid-tags` (70 pages, 763 avg words, deepest SKU breadth); `guides` (5.1 standards hits/page — the only cluster carrying real spec-number authority).
- **Weakest clusters:** `compatibility` (7 pages, 235 avg words, 0 standards hits, 0 frequency hits — barely scored content); `markets` (10 pages, 0 same-cluster links, no freshness signal); `products/rfid-keyfobs` (only 14 pages, 0 fresh-year hits, low standards density).
- **5 biggest strategic gaps** (these move the needle most):
  1. **No product pillar / "ultimate guide" pages** — all 5 product clusters have supporting pages but no authoritative hub page in `src/content/editorial/` at the cluster root. The pillars on proudtek.com today are WooCommerce category listing pages (detected in `site-meta.json`), not editorial anchors. This is the single biggest GEO problem.
  2. **Missing RFID readers product cluster** — `site-meta.json` references `/products/rfid-readers/`, but no editorial content exists. An RFID manufacturer claiming industry authority without reader content is a glaring hole (Zebra, Impinj, HID all dominate this SERP).
  3. **Thin "industries" cluster** — only 15 pages, 587 avg words, 0.1 same-cluster links — the lowest internal-link density of any cluster, meaning industry pages are dead-ends with no children under them. No `/industries/automotive/`, `/industries/aerospace/`, `/industries/government-defense/`, `/industries/data-center/`, `/industries/automotive-tire-oem/` etc.
  4. **No canonical chip/standards encyclopedia** — spec-number authority lives in `guides/` (5.1 hits/page) but only 39 pages exist and they skew toward regulation (California privacy, DPP, Walmart mandate). Missing: dedicated encyclopedia pages for NTAG21x family, NTAG424 DNA SUN, DESFire EV3 file types, Impinj M700/M750/M800 comparison, NXP UCODE 9 vs UCODE 8, ISO 18000-63 air interface deep-dive. These are the pages AI engines cite.
  5. **Compare cluster is shallow** — 27 pages but average only 326 words and **0.3 same-cluster links** (comparison pages don't link to each other or back to product pages). Comparisons are classic long-tail traffic magnets; the current set is barely above a snippet card.

All raw counts below come from the attached scripts and are reproducible.

---

## Scoring rubric (0-10 per dimension)

Scores are calibrated from observable page data; see each cluster's "justification" line.

| Score | Breadth | Depth per page | Freshness | Authority signals | Internal links | Pillar / hub |
|---|---|---|---|---|---|---|
| 9-10 | 50+ pages, covers all major SKUs, variants, materials, applications | 1000+ avg words, 20+ bullets, 5+ FAQ | 5+ references to 2024-2026 standards/events per page | 10+ specific data points (ISO, chip, MHz, range) per page | 5+ same-cluster links/page; every page interlinks to 3+ siblings | Dedicated pillar exists, ≥1500 words, links out to every supporting page, is linked FROM every supporting page |
| 7-8 | 20-49 pages, most major SKUs present | 700-999 words, 15-19 bullets, 4-5 FAQ | 2-4 fresh-year hits per page | 6-9 data points per page | 3-5 same-cluster links/page | Pillar exists but is thin (<1000 words) or missing some supporting-page links |
| 5-6 | 10-19 pages, several notable SKU gaps | 500-699 words, 12-14 bullets, 3 FAQ | 1 fresh-year hit per page | 3-5 data points per page | 1-2 same-cluster links/page | Pillar exists in an ambient sense (e.g. `/compare/` index) but doesn't function as a hub |
| 3-4 | 5-9 pages, coverage obviously incomplete | 300-499 words, 8-11 bullets, 1-2 FAQ | Sporadic fresh-year references | 1-2 data points per page | <1 same-cluster link/page | No pillar, or pillar is just a category route in site-meta with no editorial content |
| 0-2 | <5 pages or a skeleton cluster | <300 words, few bullets | Reads like pre-2023 evergreen | No standards, chip, or frequency references | Pages are dead-ends | No hub — page list only |

Interpretation shortcut:
- **Breadth** uses the page count and the qualitative SKU-coverage check in the "gap list".
- **Depth** uses avg-words and avg-bullets from the metrics script.
- **Freshness** uses total `2024|2025|2026|2027` matches divided by page count.
- **Authority** = (standards hits + chip hits + frequency hits) per page.
- **Internal linking** uses the `avgSameClusterLinks` metric.
- **Pillar** is binary evidence: does a `<cluster>.json` editorial file exist and does it link to all supporting pages?

---

## Per-cluster chapters

### 1. `products/rfid-labels` (56 pages)

**Sample pages (selected, full list in `/sessions/affectionate-brave-clarke/_titles.json`):**

| Route | Title |
|---|---|
| /products/rfid-labels/ntag213-nfc-sticker/ | NTAG213 NFC Stickers — 144-Byte URL & Review Tag Stickers |
| /products/rfid-labels/ntag215-nfc-sticker/ | NTAG215 NFC Stickers — 504-Byte Amiibo-Compatible |
| /products/rfid-labels/ntag216-nfc-sticker/ | NTAG216 NFC Stickers — 888-Byte |
| /products/rfid-labels/ntag424-dna-tamper-evident-tag/ | NTAG424 DNA Tamper-Evident Tags — AES-128 |
| /products/rfid-labels/impinj-m700-uhf-inlay/ | Impinj M700 UHF Inlay — High-Sensitivity RAIN RFID |
| /products/rfid-labels/impinj-m800-uhf-inlay/ | Impinj M800 UHF Inlay — Next-Generation RAIN RFID |
| /products/rfid-labels/alien-higgs-9-uhf-inlay/ | Alien Higgs-9 UHF Inlay |
| /products/rfid-labels/uhf-rfid-inlay/ | UHF RFID Inlays — M730/M750, UCODE 8/9 |
| /products/rfid-labels/nfc-wet-inlay/ /nfc-dry-inlay/ /rfid-wet-inlay/ /rfid-dry-inlay/ | Inlay base products (4) |
| /products/rfid-labels/rfid-airline-baggage-tag/ | IATA Resolution 753 tag |
| /products/rfid-labels/uhf-rfid-tire-label/ | Tire vulcanization label |
| /products/rfid-labels/nfc-digital-product-passport-tag/ | EU ESPR-compliant DPP |
| /products/rfid-labels/nfc-battery-passport-tag/ | EU Battery Regulation |
| /products/rfid-labels/nfc-luxury-handbag-tag/ | Luxury authentication |
| /products/rfid-labels/nfc-sneaker-authentication-tag/ | Cryptographic NFC |
| ...plus 41 more (wine, olive oil, pharmaceutical, cannabis, asset, book spine, cryogenic specimen, pallet, shipping, medication vial, etc.) |

**Scores:**
| Dimension | Score | Justification |
|---|---|---|
| Breadth | 9 | 56 pages cover inlays, NFC stickers, NTAG21x family, DPP tags, industry-specific labels. Only gap is missing individual chip pages for Impinj M730/M750 and UCODE 9 (bundled into `uhf-rfid-inlay`). |
| Depth per page | 8 | 779 avg words, 20.6 bullets, 3.2 FAQ — solid but below the 1000-word tier that AI engines prefer for citation. |
| Freshness | 6 | 26 total fresh-year hits across 56 pages (0.5/page). DPP, Walmart, battery passport pages carry the signal; many older SKU pages don't. |
| Authority signals | 8 | 8.8 chip hits + 2.3 standards + 6.4 frequency = 17.5 authority points/page. Best of any cluster in raw chip density. |
| Internal links | 7 | 3.8 same-cluster links/page — healthy sideways linking between NTAG variants. |
| Pillar / hub | 3 | No `rfid-labels.json` editorial pillar exists. The route `/products/rfid-labels/` today is a WooCommerce category listing. |

**Gap list:**
| Topic | Gap type | Intent | Priority | Why |
|---|---|---|---|---|
| `/products/rfid-labels/` pillar "Complete guide to RFID labels & inlays" | Pillar | Informational | **High** | Without it, all 56 pages have no anchor; competitors (Avery Dennison, SML Group) own this SERP |
| NXP UCODE 9 dedicated page | SKU | Commercial | High | Bundled into inlay page; competitor searches treat it as standalone |
| NXP UCODE 8 dedicated page | SKU | Commercial | Medium | Large installed base, search volume justifies standalone |
| Impinj M730 dedicated page | SKU | Commercial | Medium | Mentioned in inlay page, no standalone |
| Impinj M750 dedicated page | SKU | Commercial | Medium | Same as above |
| "Wet inlay vs dry inlay" dedicated comparison | Comparison | Informational | High | Foundational label-converter decision; currently only implied |
| "RFID label printer compatibility — Zebra ZT411 vs SATO CL4NX vs Printronix" | Comparison | Commercial | High | Converts thermal-transfer printer searchers |
| "How to encode a UHF label with a desktop printer (step-by-step)" | How-to | Transactional | High | Strong bottom-funnel intent |
| "RAIN RFID sensitivity / orientation testing methodology" | Standards | Informational | High | Cites Voyantic / Tagformance — AI-engine gold |
| "EU Digital Product Passport label selection guide" | Standards | Informational | High | Already have DPP product page; missing decision-framework page |
| Dedicated "on-metal label vs anti-metal label vs embedded label" explainer | Comparison | Informational | Medium | Common buyer confusion |
| NFC shelf-edge label vs ESL electronic shelf label | Comparison | Informational | Medium | Hot category; retailers conflate them |

**Pillar analysis:** There is no `src/content/editorial/rfid-labels.json`. A 1500-2000 word pillar "The complete guide to RFID labels, inlays, and smart labels" needs to exist at `/products/rfid-labels/`, linking to all 56 supporting pages grouped by sub-theme (inlay, NFC sticker, UHF label, industry label, authentication label). Without it the cluster has no topical anchor.

---

### 2. `products/rfid-cards` (29 pages)

**Sample pages:** MIFARE Classic 1K, DESFire EV3, MIFARE Plus SE, Ultralight C, NTAG424 DNA TT, EM4100, ICODE SLIX, UHF RFID card, dual-frequency, metal business card, wooden card, bamboo card, transparent card, employee badge, membership, loyalty, gift card, student ID, parking, Assa-Abloy-compatible, magstripe combo, RFID-blocking, NFC warranty, custom printing.

**Scores:**
| Dimension | Score | Justification |
|---|---|---|
| Breadth | 6 | 29 pages; missing DESFire EV1/EV2 historical pages, MIFARE Plus EV1/EV2, HID iCLASS, HID Seos, LEGIC advant, FeliCa, CIPURSE — all competitor-held SERPs. |
| Depth per page | 7 | 710 words, 19.2 bullets, 3.2 FAQ. |
| Freshness | 2 | Only **1 fresh-year hit total across 29 pages**. This cluster reads like 2022. |
| Authority signals | 9 | 11.4 chip hits/page — very chip-dense; 9.3 freq, 2.4 standards. |
| Internal links | 5 | 2.1 same-cluster links/page — below target. |
| Pillar / hub | 3 | No `rfid-cards.json` editorial pillar. |

**Gap list:**
| Topic | Gap type | Intent | Priority | Why |
|---|---|---|---|---|
| `/products/rfid-cards/` pillar | Pillar | Informational | **High** | Same problem as labels |
| HID iCLASS (SE, SR, Seos) compatible card pages | SKU | Commercial | **High** | HID owns US enterprise access; compatibility traffic is huge |
| LEGIC advant / LEGIC Prime card pages | SKU | Commercial | Medium | European access market |
| FeliCa card page | SKU | Commercial | Medium | Asia-Pacific market (JR, Suica, Octopus) |
| MIFARE DESFire EV2 standalone page (blog mentions EV1/EV2/EV3 but no product page) | SKU | Commercial | Medium | Still shipping; search demand |
| MIFARE Plus EV1 / EV2 / X standalone pages | SKU | Commercial | Medium | Migration traffic from MIFARE Classic |
| NTAG424 DNA SUN message authentication explainer | Standards | Informational | High | AI engines cite; no existing explainer |
| "DESFire EV3 application file structure" guide | Standards | Informational | High | Integrator-level content; high citation value |
| "MIFARE Classic 1K vs 4K vs Mini" | Comparison | Informational | Medium | Foundational question |
| "HID iCLASS vs MIFARE DESFire for enterprise access" | Comparison | Commercial | High | Converts RFP decision makers |
| "PVC vs PET vs ABS vs polycarbonate card body" complete guide | Comparison | Informational | Medium | Have a blog but no comparison page |
| "Hotel key card encoding with L1/L2 level keys" how-to | How-to | Informational | Medium | Hotel operators search this |
| "NFC card battery powered (active) vs passive" | Explainer | Informational | Low | Smaller audience |

**Pillar analysis:** Missing. Zero freshness signals is the standout problem — refreshing headlines, adding 2026 references, and adding a pillar is the fastest lift for this cluster.

---

### 3. `products/rfid-tags` (70 pages)

**Sample pages:** Anti-metal, ceramic (high-temp), PCB, concrete-embed, bolt/nail/screw, livestock ear, fish, glass capsule pet, blood bag, surgical instrument, temperature sensor, race timing, tire, gas cylinder, IBC drum, keg, library book, tamper seal, bolt seal (ISO 17712), mining, oil&gas pipe, helmet, guard tour, returnable container, jewelry, waste bin, ammo can, weapon, utility pole, manhole cover, valve, fire extinguisher, hose, tool/tool-tracking, aircraft part, textile laundry, PPS laundry chip, zip-tie, cable-tie, wedge, flag, magnet-mount, eyelet, hang tag, tree, pet NFC, windshield already lives under labels.

**Scores:**
| Dimension | Score | Justification |
|---|---|---|
| Breadth | 10 | 70 pages — the deepest industrial-tag taxonomy on the site. Easily matches Xerafy / Omni-ID range. |
| Depth per page | 8 | 763 words, 21.7 bullets (highest) but low chip density (2.2/page) because these are form-factor pages not chip pages. |
| Freshness | 2 | 9 fresh-year hits / 70 pages; 11 pages with 2010-2023 year refs (old-ish). |
| Authority signals | 6 | 2.2 chip hits + 2.2 standards + 7.2 freq = 11.6/page. Many tags cite ISO 11784/85 (livestock), ISO 17712 (seals), IATA 753. |
| Internal links | 8 | 4.0 same-cluster links/page — best cross-linking of any cluster. |
| Pillar / hub | 3 | No `rfid-tags.json` pillar editorial. |

**Gap list:**
| Topic | Gap type | Intent | Priority | Why |
|---|---|---|---|---|
| `/products/rfid-tags/` pillar | Pillar | Informational | **High** | 70-page cluster without an anchor is wasted equity |
| Dedicated page per chip: Monza R6 / R6-P / 4QT / X-2K / X-8K | SKU (5 pages) | Commercial | High | Zero chip-specific tag pages exist |
| Alien Higgs-3 / Higgs-4 / Higgs-EC pages | SKU (3) | Commercial | Medium | Older but still specified |
| "ATEX Zone 1 / IECEx RFID tag" dedicated page | SKU | Commercial | High | Mining tag page exists but no ATEX/IECEx-specific explainer |
| "RFID temperature logger vs battery-assisted sensor tag" | Comparison | Informational | High | Cold chain pharma is hot |
| "Passive UHF vs BAP vs Active RFID tag" comparison | Comparison | Informational | High | Foundational; fits between cluster and blog |
| "ISO 17712 high-security seals — RFID integration guide" | Standards | Informational | High | Already have bolt-seal page; no standards deep-dive |
| "ISO 11784/11785 FDX-B vs HDX for livestock" | Standards | Informational | Medium | Ag-tech SERP |
| "EU Tire Regulation 2024 UHF tagging requirements" | Standards | Informational | High | Have the product page; no compliance pillar |
| "ATA Spec 2000 RFID for aerospace MRO" detailed spec guide | Standards | Informational | Medium | Aerospace has it at product level only |
| "RFID tool tracking for FAA FOD compliance" | Application | Informational | Medium | Aerospace/mfg specific |
| "RFID for tire OEM vs aftermarket tagging" | Comparison | Commercial | Medium | Tire page exists but no OEM/AM split |
| "How to choose a UHF tag for challenging materials (metal, liquid, cryogenic)" decision tree | How-to | Informational | High | Foundational decision page |

**Pillar analysis:** Missing. Given this is the largest cluster (70 pages, 4.0 same-cluster links/page — already interlinked), a pillar here would lift the most pages with least effort.

---

### 4. `products/rfid-wristbands` (20 pages)

**Pages:** Tyvek, silicone (MIFARE Classic, adjustable), PVC, fabric/woven, paper, nylon, vinyl, elastic, hospital patient ID, child safety, prison/inmate, cashless payment, NFC payment, NFC fitness, NFC medical alert, UHF, water park, waterpark, QR+NFC dual-tech.

**Scores:**
| Dimension | Score | Justification |
|---|---|---|
| Breadth | 7 | 20 pages cover main materials and applications. Missing dedicated "RFID festival wristband 2026", "silicone slap band", and "cruise line wristband" (though blog has some of these). |
| Depth per page | 6 | 657 avg words (lowest of product clusters), 17.4 bullets. |
| Freshness | 3 | 3 fresh-year hits / 20 pages. Events/festivals is a freshness-hungry sub-category. |
| Authority signals | 5 | 5.2 chip hits + 0.7 standards + 4.2 freq = 10.1/page. Low standards density because wristbands have fewer external standards. |
| Internal links | 5 | 2.4 same-cluster links/page. |
| Pillar / hub | 3 | No pillar. |

**Gap list:**
| Topic | Gap type | Intent | Priority | Why |
|---|---|---|---|---|
| `/products/rfid-wristbands/` pillar "Complete guide to RFID wristbands" | Pillar | Informational | High | 20-page cluster needs anchor |
| RFID slap-band / snap-band | SKU | Commercial | Medium | Common festival form factor, missing |
| RFID cruise line wristband (Carnival OceanMedallion pattern) | SKU | Commercial | Medium | Distinct from water park |
| NFC concert VIP wristband | SKU | Commercial | Medium | Higher ASP |
| "RFID wristband IC chip choice: NTAG213 vs MIFARE Classic 1K vs EM4200" | Comparison | Informational | High | Common buyer decision not yet a page |
| "Cashless wristband payment architecture" deep-dive | Standards | Informational | High | Cites PCI, EMV Contactless |
| "RFID wristband closure types — adjustable, one-time, slap" | Comparison | Informational | Medium | Have materials, not closure comparison |
| "Festival RFID wristband system cost ROI calculator" | Application | Commercial | Medium | High long-tail conversion |
| "Hospital wristband ISO/IEC 15693 vs ISO 14443 decisions" | Standards | Informational | Medium | Healthcare integrator question |

**Pillar analysis:** Missing.

---

### 5. `products/rfid-keyfobs` (14 pages)

**Pages:** ABS, coin, leather, metal, silicone, epoxy, wood/bamboo, NFC epoxy key tag, wristwatch-tag, EM4305, T5577, MIFARE DESFire, dual-frequency, coin-keyfob, coin-tag.

**Scores:**
| Dimension | Score | Justification |
|---|---|---|
| Breadth | 5 | Only 14 pages; missing HID Prox-compatible fob, Indala, AWID, pivCLASS, and per-chip pages like MIFARE Classic fob, NTAG213 fob. |
| Depth per page | 6 | 685 words, 18.6 bullets, 3 FAQ. |
| Freshness | 0 | Zero fresh-year hits across 14 pages — this cluster has not been touched for freshness. |
| Authority signals | 8 | Highest chip hits/page of any cluster (16.1), 9.1 freq — driven by dense cross-chip compatibility language. |
| Internal links | 4 | 1.6 same-cluster links/page. |
| Pillar / hub | 3 | No pillar. |

**Gap list:**
| Topic | Gap type | Intent | Priority | Why |
|---|---|---|---|---|
| `/products/rfid-keyfobs/` pillar | Pillar | Informational | High | Anchor a 14-page cluster |
| HID Prox II / iCLASS SE compatible fob | SKU | Commercial | High | HID dominates US market |
| Indala 26-bit / 125 kHz Motorola compatible fob | SKU | Commercial | Medium | Large installed base |
| NFC smart ring product page | SKU | Commercial | Medium | Blog only; product page missing |
| NTAG213 keyfob / NTAG215 keyfob standalone | SKU | Commercial | Medium | Covered generically only |
| UHF keyfob product page | SKU | Commercial | Medium | Covered in wristband only |
| "Keyfob vs card vs wristband" comparison (exists in /compare/ but not linked from keyfobs) | Internal link | Informational | High | Already exists; needs pathway in |
| "LF access fob cloning security myths" | FAQ/how-to | Informational | Medium | Blog-adjacent; cluster should own it |
| "Keyfob IP-rating tests (IP67, IP68)" methodology | Standards | Informational | Low | Niche but citation-worthy |

**Pillar analysis:** Missing. Zero freshness signal is the single weakest metric site-wide. Each keyfob SKU page needs a 2026 refresh plus a new pillar.

---

### 6. `industries` (15 pages)

**Pages:** agriculture, brand-protection, education, eu-compliance, events-venues, fitness, healthcare, hospitality, industrial, laundry-services, libraries, logistics, luxury-brands, pharmaceutical, retail-apparel.

**Scores:**
| Dimension | Score | Justification |
|---|---|---|
| Breadth | 5 | 15 pages cover core industries. Missing: automotive/tire OEM, aerospace/aviation, government/defense, data-center/IT asset, oil-gas, mining, cannabis, food-beverage, cold-chain, construction, postal/courier, waste-management, public-transit, ski-resort. |
| Depth per page | 5 | 587 words avg (low), 16.1 bullets. |
| Freshness | 5 | 15 fresh-year hits / 15 pages = 1.0/page — consistent but not heavy. |
| Authority signals | 4 | 1.0 chip + 0.8 std + 3.9 freq = 5.7/page — industries pages are narratively thin on specs. |
| Internal links | 1 | **0.1 same-cluster links/page** — industry pages are dead-ends. |
| Pillar / hub | 3 | No `industries.json` editorial file (only in `site-meta.json` as route). |

**Gap list:**
| Topic | Gap type | Intent | Priority | Why |
|---|---|---|---|---|
| `/industries/` pillar page | Pillar | Informational | **High** | No hub at all for a 15-page cluster |
| Automotive / Tire OEM industry page | Application | Commercial | **High** | $ volume; tire regulation 2024+ |
| Aerospace / Aviation MRO | Application | Commercial | High | ATA Spec 2000 alignment |
| Government / Defense supply chain | Application | Commercial | High | Military compliance content |
| Data center / IT asset tracking | Application | Commercial | High | Large enterprise RFP fit |
| Oil & gas upstream / downstream | Application | Commercial | Medium | Hazardous locations, ATEX/IECEx |
| Mining (surface and underground) | Application | Commercial | Medium | Ruggedized tag fit |
| Cannabis seed-to-sale | Application | Commercial | Medium | Compliant-tag demand |
| Food & beverage (cold chain, traceability) | Application | Commercial | Medium | Adjacent to pharma |
| Construction | Application | Commercial | Medium | Concrete embed, tool tracking |
| Public transit (ISO 14443, DESFire) | Application | Commercial | Medium | Transit cards |
| Ski resorts / snow sports | Application | Commercial | Low | Seasonal |
| Postal / courier / parcel sortation | Application | Commercial | Medium | UHF lot |
| Waste management / pay-as-you-throw | Application | Commercial | Medium | Have a tag; no industry page |
| Sub-page gap per industry: each industry page should link to all relevant products/solutions pages | Internal link | Informational | **High** | Currently near zero; single biggest quick-win for whole site |

**Pillar analysis:** Missing. The industries cluster is the weakest by internal-link density and needs both a top-level pillar and down-links to products.

---

### 7. `blog` (90 pages)

**Mix:** How-RFID-works, chip comparisons, cost/ROI, industry trends, troubleshooting, festival/hotel/event narrative posts, plus long-tail "why is my hotel keycard not working" troubleshooting angles.

**Scores:**
| Dimension | Score | Justification |
|---|---|---|
| Breadth | 9 | 90 pages cover most major informational queries. |
| Depth per page | 7 | 683 words, 18.1 bullets, 3.8 FAQ (highest FAQ density). |
| Freshness | 7 | 66 fresh-year hits / 90 = 0.7/page; "rain-rfid-2026-trends", "cost-per-rfid-tag-2026", "rfid-market-trends-forecast" carry load. But 16 pages have older 2018-2023 year refs that need refresh review. |
| Authority signals | 7 | 5.5 chip + 1.4 std + 9.0 freq = 15.9/page. |
| Internal links | 2 | 0.6 same-cluster links/page — blog posts don't link to related blog posts enough. |
| Pillar / hub | 2 | No `/blog/` editorial pillar; blog index is a generic archive (in `site-meta.json`). |

**Gap list:**
| Topic | Gap type | Intent | Priority | Why |
|---|---|---|---|---|
| Blog pillar hub that organises 90 posts into topic clusters (Hotel, Events, Inventory, Compliance, Chips, etc.) | Pillar | Informational | High | Converts archive into a navigable knowledge base |
| "NTAG213 vs NTAG215 vs NTAG216" exists as BLOG but not as a guides page; promote to `/guides/` | Upgrade | Informational | High | Buyers cite; should be under guides |
| "DESFire EV1 vs EV2 vs EV3" same as above | Upgrade | Informational | High | Same reason |
| Missing: "UCODE 8 vs UCODE 9" | Comparison | Informational | High | Exists at inlay level only |
| Missing: "Monza R6 vs R6-P vs Monza 4QT" | Comparison | Informational | High | Classic chip question |
| Missing: "RFID read range calculator" (interactive or tabular) | How-to | Informational | High | Citation gold |
| Missing: "FCC Part 15 vs ETSI EN 302 208 UHF power limits" | Standards | Informational | Medium | Regulatory clarity |
| Cross-link campaign across existing blog | Internal link | Informational | High | 0.6 same-cluster links is too low |

**Pillar analysis:** The blog needs a navigable hub by theme (Hotel, Events, Inventory, Compliance, Chips, Troubleshooting, Cost/ROI).

---

### 8. `guides` (39 pages)

**Mix:** Standards (ISO 14443, ISO 18000-6C, EPC Gen2, NDEF, NFC Forum Type), regulations (California privacy, CE marking, RoHS/REACH, EU DPP, Walmart, FDA, food safety), integrations (SAP, Oracle NetSuite, Shopify), Google review guides, hotel key card practical guides, NFC Android/iPhone programming.

**Scores:**
| Dimension | Score | Justification |
|---|---|---|
| Breadth | 7 | 39 pages; missing major chip-family encyclopedia pages (NTAG21x, DESFire, ICODE, Monza), missing RAIN RFID RSSI/PC/EPC bit-level guide. |
| Depth per page | 5 | 460 avg words (lowest among key clusters), 14.3 bullets. |
| Freshness | 4 | 14 hits / 39 = 0.4/page. |
| Authority signals | 10 | **5.1 standards hits/page** — by far the densest standards cluster. Plus 2.3 chip, 5.6 freq = 13.0 total. |
| Internal links | 5 | 1.7 same-cluster links/page. |
| Pillar / hub | 5 | `guides.json` pillar EXISTS (editorial). Need to verify it's deep. |

**Gap list:**
| Topic | Gap type | Intent | Priority | Why |
|---|---|---|---|---|
| NTAG21x chip family encyclopedia | Standards | Informational | **High** | Foundational, highly cited |
| NTAG424 DNA SUN message + CMAC encyclopedia | Standards | Informational | **High** | AI-citation-gold |
| MIFARE DESFire EV3 command set & file types encyclopedia | Standards | Informational | High | Integrator content |
| ICODE SLIX / SLIX2 / DNA encyclopedia | Standards | Informational | Medium | Library segment |
| Impinj Monza R6 / R6-P / 4QT / X-2K encyclopedia | Standards | Informational | High | Industrial buyer content |
| NXP UCODE 8/9/DNA encyclopedia | Standards | Informational | High | RAIN industry content |
| ISO 18000-63 air-interface deep-dive (beyond EPC Gen2 high-level page) | Standards | Informational | Medium | Engineer-grade content |
| NFC Forum Type 2/4/5 comparison deep-dive | Standards | Informational | Medium | Rounds out existing NDEF page |
| "EPC Gen2 v3 encoding" | Standards | Informational | Medium | Current v2, moving to v3 |
| RAIN RFID tag sensitivity testing methodology (Voyantic Tagformance, ETSI EN 302 208) | Standards | Informational | **High** | Test methodology is rare online; owns AI citation |
| "RAIN RFID RSSI, PC word, XPC bit" encoding guide | Standards | Informational | Medium | Engineer-grade |
| "RFID read range math — free space path loss, reader power, tag sensitivity" | Standards | Informational | High | Converts engineers |
| "ISO 28560 library standard complete guide" | Standards | Informational | Medium | Library niche |
| "GS1 EPC Gen2 tag data standard (TDS) 2.0 complete field guide" | Standards | Informational | High | Supply chain engineer content |

**Pillar analysis:** A pillar does exist. Depth is the weak point — 460 words avg means pillar is skeletal. Upgrading 20-30 of these guides to 1000+ words would transform the cluster.

---

### 9. `compare` (27 pages)

**Pages:** NTAG213/215/216, MIFARE Classic/Plus/DESFire, DESFire vs Plus, HF vs UHF, 125 kHz vs 13.56 MHz, active vs passive, RFID vs barcode, RFID vs BLE, RFID vs QR, RFID vs magstripe, keyfob vs card vs wristband, silicone vs fabric vs woven, PPS vs silicone, laundry-tag UHF vs HF, metal vs wood vs PVC NFC card, hotel key cards vs wristbands, NFC review card vs QR, on-metal vs standard sticker, NFC vs Bluetooth.

**Scores:**
| Dimension | Score | Justification |
|---|---|---|
| Breadth | 6 | 27 pages cover many foundational comparisons but missing key chip-to-chip ones and reader comparisons. |
| Depth per page | 3 | **326 avg words** — thinnest of all clusters. |
| Freshness | 3 | 5 fresh-year hits/27 pages. |
| Authority signals | 7 | 3.8 chip + 0.2 std + 7.3 freq = 11.3/page — chip refs are present; standards are sparse. |
| Internal links | 2 | 0.3 same-cluster links/page — almost no cross-comparison linking. |
| Pillar / hub | 5 | `compare.json` pillar exists. |

**Gap list:**
| Topic | Gap type | Intent | Priority | Why |
|---|---|---|---|---|
| UCODE 8 vs UCODE 9 vs Monza R6 vs Higgs-9 4-way UHF chip comparison | Comparison | Informational | **High** | Top long-tail |
| NTAG424 DNA vs NTAG213 for authentication | Comparison | Informational | High | Anti-counterfeit buyer |
| MIFARE Ultralight C vs NTAG213 vs NTAG215 for event tickets | Comparison | Commercial | Medium | Event integrators |
| HID iCLASS vs DESFire EV3 for enterprise access | Comparison | Commercial | High | RFP decision |
| Impinj R700 vs Zebra FX9600 reader comparison | Comparison | Commercial | High | Reader SERP is lucrative and unowned by this site |
| Zebra ZT411 vs SATO CL4NX RFID printer | Comparison | Commercial | Medium | Label-converter buyer |
| ISO 14443 Type A vs Type B | Comparison | Informational | Medium | Foundational standards question |
| RAIN RFID vs NFC vs BLE asset tracking (3-way) | Comparison | Informational | High | Have 2-ways only |
| Deepen all 27 pages to 700+ words (currently 326 avg) | Upgrade | Informational | **High** | Biggest single lift in this cluster |
| Cross-link every compare page to the 2 SKU pages it discusses | Internal link | — | **High** | 0.3 links/page is near-zero |

**Pillar analysis:** Pillar exists but supporting pages are thin. Upgrading depth is higher priority than breadth here.

---

### 10. `compatibility` (7 pages)

**Pages:** be-tech, hafele-dialock, miwa, onity, saflok, salto, vingcard — all hotel lock brand compatibility pages.

**Scores:**
| Dimension | Score | Justification |
|---|---|---|
| Breadth | 4 | 7 pages cover major hotel-lock brands but miss Kaba, SALTO KS, dormakaba, Ving C-Line specifics; also no scope beyond hotels (no enterprise access, no apartment lock brands, no transit fare-system compatibility). |
| Depth per page | 2 | **235 avg words** — thinnest cluster on site. |
| Freshness | 0 | Zero fresh-year hits. |
| Authority signals | 0 | Zero standards, near-zero chip refs, zero frequency refs. |
| Internal links | 3 | 1.0 same-cluster link/page. |
| Pillar / hub | 5 | `compatibility.json` exists. |

**Gap list:**
| Topic | Gap type | Intent | Priority | Why |
|---|---|---|---|---|
| Kaba / dormakaba compatibility page | SKU | Commercial | High | Major hotel lock brand |
| Messerschmitt compatibility | SKU | Commercial | Medium | European chains |
| HID Global Edge / iCLASS SE access-control compatibility | SKU | Commercial | **High** | Enterprise access is huge |
| SALTO KS enterprise vs hotel split | SKU | Commercial | Medium | Different product lines |
| HID Mercury MR52 / Lenel compatibility | SKU | Commercial | High | US enterprise |
| Transit fare-system compatibility (Cubic, Scheidt & Bachmann, Vix) | SKU | Commercial | Medium | Transit card manufacturers |
| Apartment lock compatibility (Igloohome, Latch, Brivo) | SKU | Commercial | Medium | Multifamily market |
| Upgrade every existing page to 700+ words with chip compatibility table, encoding notes, and standards references | Upgrade | Informational | **High** | 235 avg is unacceptable |

**Pillar analysis:** Pillar exists. The cluster is the thinnest on the site by depth, freshness, and authority — needs urgent expansion.

---

### 11. `solutions` (37 pages)

**Mix:** Hotel key cards, RFID access, event access/wristbands, inventory, laundry (3 variants), library, parking, patient tracking, race timing, readers/encoding, supply chain, tool tracking, warehouse, vehicle ID, google-review cards by vertical (restaurants, hotels, gyms, clinics, retail, salons, pickup counters, front desks, checkout, tabletop, NFC business cards), DPP, luxury auth, brand auth.

**Scores:**
| Dimension | Score | Justification |
|---|---|---|
| Breadth | 7 | 37 pages cover many verticals; overweighted on Google Review cards (8+ pages). |
| Depth per page | 4 | 417 avg words. |
| Freshness | 4 | 12 hits/37 = 0.3/page. |
| Authority signals | 5 | 2.5 chip + 0.5 std + 4.5 freq = 7.5/page. |
| Internal links | 2 | 0.6 same-cluster links/page. |
| Pillar / hub | 5 | `solutions.json` pillar exists. |

**Gap list:**
| Topic | Gap type | Intent | Priority | Why |
|---|---|---|---|---|
| Kiosk / self-check-in solution page | Application | Commercial | Medium | Hotel + airport |
| Point-of-sale NFC payment integration | Application | Commercial | Medium | Adjacent to cashless wristband |
| Fleet management / vehicle solution page | Application | Commercial | Medium | Complements vehicle-id |
| Cold chain RFID solution page | Application | Commercial | High | Have tag, no solution page |
| Retail electronic shelf label (ESL) integration | Application | Commercial | Medium | Adjacent to NFC shelf label |
| Digital twin / IoT platform integration | Application | Informational | Low | Enterprise |
| Deepen all pages to 700+ words | Upgrade | Informational | High | 417 is thin |

**Pillar analysis:** Pillar exists. Depth is the weak point.

---

### 12. `lp` (15 pages)

**Mix:** Manufacturer / factory-direct / supplier / wholesale landing pages (Shenzhen, China, bulk, custom printing, encoding service, tag factory, UHF tag manufacturer, label manufacturer, smart card manufacturer, wristband manufacturer, solution provider).

**Scores:**
| Dimension | Score | Justification |
|---|---|---|
| Breadth | 6 | 15 pages cover main commercial landing intents. Missing: "RFID custom size tag", "RFID rush order factory", "RFID sample order". |
| Depth per page | 5 | 516 avg words. |
| Freshness | 0 | **Zero fresh-year hits across 15 pages.** These are timeless-format pages but should still reference 2026 capacity, certifications, etc. |
| Authority signals | 7 | 8.1 chip + 3.2 std + 7.7 freq = 19.0/page — actually high density. |
| Internal links | 4 | 1.6 same-cluster links/page. |
| Pillar / hub | 2 | No `lp.json` pillar. LP pages are commercial so pillar less critical. |

**Gap list:**
| Topic | Gap type | Intent | Priority | Why |
|---|---|---|---|---|
| "RFID small batch / low MOQ manufacturer" | SKU | Commercial | Medium | SMB demand |
| "RFID sample order" landing page | How-to | Transactional | High | Bottom-funnel converter |
| "RFID custom printed cards wholesale" dedicated page | SKU | Commercial | Medium | Have custom printing but not wholesale variant |
| "RFID ODM vs OEM manufacturing" explainer | Explainer | Informational | Low | Industry-educational |
| Add 2026 freshness (production capacity, certifications, timelines) to all 15 | Upgrade | Commercial | High | Zero fresh signal |

**Pillar analysis:** Not critical here — LP pages are by design direct-response.

---

### 13. `markets` (10 pages)

**Pages:** africa, australia, brazil, dubai-uae, germany, india, japan, south-africa, uk, usa.

**Scores:**
| Dimension | Score | Justification |
|---|---|---|
| Breadth | 4 | 10 pages; missing France, Italy, Spain, Netherlands, Mexico, Southeast Asia (Singapore/Indonesia/Thailand/Vietnam), Canada, Saudi Arabia, South Korea, China mainland. |
| Depth per page | 5 | 598 avg words. |
| Freshness | 1 | 1 fresh-year hit/10 pages. |
| Authority signals | 6 | 7.1 chip + 2.1 std + 5.9 freq. |
| Internal links | 0 | **0 same-cluster links/page** — markets pages are complete dead-ends. |
| Pillar / hub | 2 | No `markets.json` pillar. |

**Gap list:**
| Topic | Gap type | Intent | Priority | Why |
|---|---|---|---|---|
| Missing countries: France, Italy, Spain, Netherlands, Mexico, Canada, Singapore, Indonesia, Thailand, Vietnam, Saudi Arabia, South Korea | SKU (12) | Commercial | Medium | Geographic SEO |
| Regional frequency/regulation reference (ETSI EN 302 208 for EU, FCC Part 15 for US, Mexico 902-928 MHz, Japan 916-922, Korea 917-923) | Standards | Informational | High | Cited by engineers & AI |
| Markets cluster interlinking (each country should link to 3-5 industry/solution pages relevant locally) | Internal link | — | **High** | Zero right now |

**Pillar analysis:** No pillar. This cluster is low priority unless Peter wants geographic SEO.

---

## Cross-cluster patterns worth noting

1. **Freshness drought in commercial pages.** Keyfobs, lp, cards — all show zero or near-zero fresh-year hits. These are the commercial-intent pages; lack of 2026 freshness signals hurts AI engine preference.
2. **Pillar gaps for product clusters.** None of the 5 product clusters has an editorial pillar file; only `compare.json`, `guides.json`, `solutions.json`, `compatibility.json` exist.
3. **Industries cluster is a dead-end.** 0.1 links/page out to children, yet 15 industry pages should be linking to ~30-50 product/guide pages each.
4. **Compare cluster is under-written.** 326 avg words is snippet-card territory; needs a 2-3x lift.
5. **No "readers" cluster exists** — route referenced in site-meta.json (WooCommerce legacy), zero editorial content.

---

## Confidence & caveats

- **Confidence: High** on counts, breadth, and link-density metrics (scripted, reproducible).
- **Confidence: Medium** on depth scores — word count is a proxy, not a quality measure. A 500-word razor-sharp page can outrank a 1200-word fluff page.
- **Confidence: Medium** on freshness — the regex captures literal 2024-2027 mentions but not conceptual freshness (e.g. a page could describe 2026 tech without writing "2026").
- **Caveat:** Competitor comparison ("HID has X, we don't") is based on general industry knowledge, not a fresh crawl of each competitor today.
- **Caveat:** Pages may include metadata fields (`modifiedAt`, `updatedAt`) not factored into freshness score. A modifiedAt-based freshness pass is a natural follow-up.
- **Not in scope:** This audit does not evaluate schema.org markup, `llms.txt` quality, hero image alt text, or internal-anchor text — all relevant to GEO but out of scope here.
