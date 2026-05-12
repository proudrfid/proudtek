# W3-4 Industry Backlog — 5 New Vertical Pillars

**Date:** 2026-04-18
**Batch:** Industry-page backlog from the W3-4 roadmap
**Scope:** Build dedicated industry pillar pages for the 5 verticals previously called out as "served but not editorialized"

The W3 industries hub launched with 15 vertical landings. The hub's "Do you serve industries outside these 15?" FAQ acknowledged that Proud Tek had repeat project experience in 5 more verticals — automotive (tire), aerospace, defense, IT/data center, and cold chain food — but with no dedicated editorial coverage. This batch closes that gap.

---

## 1. New industry landing pages

All 5 follow the established industry-pillar pattern from `eu-compliance.json` / `retail-apparel.json` / `brand-protection.json`: 6-section structure (challenges, how-we-solve, results, product table, regulatory timeline, FAQs, resourceCards, primary/secondary actions), 800-2,000 words each, full EEAT frontmatter (publishedAt, modifiedAt, authorSlug, reviewedBySlug, reviewedAt, keywords).

### `automotive-tire-oem.json`
- **Position:** Cure-survivable UHF tire labels + Tier-1 OEM supplier programs (Michelin, Bridgestone, Continental, Pirelli, Goodyear, Hankook), TPMS-pair workflow, USTMA & UN R30 / EU GSR2 traceability
- **Hero:** `/landing-images/rfid-tire-tag.jpg`
- **Standards cited:** USTMA, UN R30/R54, EU GSR2 (Reg. 2019/2144), FMVSS 139, EU End-of-Life Tyre Directive
- **Products linked:** UHF tire label, RFID tire tag, anti-metal UHF, bolt seal, 200°C high-temp
- **5 FAQs** including the cure-press survival question, OEM program access, TPMS-pair workflow, recall traceability, MOQ
- **Render size:** 143 KB

### `aerospace-aviation-mro.json`
- **Position:** ATA Spec 2000 Ch. 9-5 / FAA AC 20-162A part-level serialization, MRO tool control, 30-year airframe-life on-metal tags
- **Hero:** `/landing-images/rfid-aircraft-part-tag.jpg`
- **Standards cited:** ATA Spec 2000 Ch. 9-5, FAA AC 20-162A, SAE AS5678, EASA ETSO-2C513, MIL-STD-130N, RTCA DO-160G, FAA Part 145
- **Products linked:** Aircraft part tag, 200°C high-temp, tool tracking tag, NTAG424 DNA tamper, anti-metal UHF
- **5 FAQs** covering RFID requirement, chip families, DO-160G survivability, tool control workflow, on-metal LRU treatment
- **Render size:** 143 KB

### `data-center-it-asset-tracking.json`
- **Position:** SOX / PCI / NIST 800-53 quarterly asset audit via on-metal UHF; NIST 800-88 sanitization chain of custody; e-waste R2v3 provenance
- **Hero:** `/landing-images/anti-metal-uhf-it-asset-tag.jpg`
- **Standards cited:** SOX 404 / ITGC, PCI DSS v4.0 Req. 9.5/9.9, NIST SP 800-53 CM-8, NIST SP 800-88 Rev. 1, HIPAA Security Rule, R2v3, e-Stewards, EU WEEE Directive
- **Products linked:** Anti-metal UHF asset tag, RFID asset label, PCB / screw-mount tag, NTAG424 DNA tamper, document tracking label
- **5 FAQs** on UHF interference, anti-metal vs regular labels, tag adhesion lifetime, NIST 800-88 chain of custody, MOQ
- **Render size:** 143 KB

### `government-defense-supply-chain.json`
- **Position:** MIL-STD-129R unit-load passive UHF RFID; MIL-STD-130N IUID; weapon-system accountability; DFARS 252.211-7006 WAWF iRFID submission; Berry Amendment / TAA support
- **Hero:** `/landing-images/rfid-weapon-tracking-tag.jpg`
- **Standards cited:** MIL-STD-129R, MIL-STD-130N, DFARS 252.211-7006/7003, MIL-STD-31000B, NIST SP 800-88, FISMA / NIST 800-53 CM-8, Berry Amendment, TAA
- **Products linked:** MIL-STD-129R unit-load label, IUID dual-mark nameplate, weapon tracking tag, NTAG424 DNA tamper, anti-metal UHF
- **5 FAQs** on DoD RFID requirement, IUID vs MIL-STD-129R distinction, Berry/TAA support, armory workflow, WAWF iRFID
- **Render size:** 144 KB

### `cold-chain-food-traceability.json`
- **Position:** FSMA 204 (Jan 20, 2026 deadline), GS1 EPCIS, EUDR (Dec 30, 2025), vaccine cold chain, reefer-container temperature logging, GDST seafood traceability
- **Hero:** `/landing-images/rfid-frozen-food-label.jpg`
- **Standards cited:** FDA FSMA Section 204 (Food Traceability Final Rule), EU Deforestation Regulation 2023/1115, GS1 EPCIS 2.0, GDST 1.1, CDC Vaccines for Children, WHO PQS, USDA FSIS
- **Products linked:** Frozen food label, medication vial label, sensor / temp logger, anti-metal container tag, plant nursery / provenance label
- **5 FAQs** on FSMA 204 carrier requirements, sensor-enabled UHF chips, frozen-tunnel application survivability, EPCIS encoding, mRNA -70 °C cold chain
- **Render size:** 144 KB

---

## 2. Industries hub pillar updates

`src/content/editorial/industries/_pillar.json`:

- Title: "Complete guide to RFID & NFC by industry — a buyer's hub for **15** verticals" → "**20** verticals"
- Hero point: "**15** industry landing pages" → "**20** industry landing pages" (with the new 5 enumerated)
- New section: "The **20** verticals Proud Tek serves" — each new vertical added with one-line capsule + link
- Six-grouping section restructured to fold the new verticals into:
  - Industrial & Logistics: + data center & IT asset tracking, automotive & tire OEM
  - Primary Production & Food Chain (renamed from Primary Production): + cold chain & food traceability
  - **Regulated & Defense (new grouping)**: aerospace & aviation MRO, government & defense supply chain
- Mandate-driven bullet list extended with 4 new mandates: FSMA 204, EUDR, MIL-STD-129R/130N, ATA Spec 2000 Ch. 9-5 / FAA AC 20-162A
- FAQ updated: "Do you serve industries outside these **15**?" → "outside these **20**?", with the previous-list of automotive/aerospace/defense removed (those are now in-list)

---

## 3. Build verification

```
ASTRO_OUT_DIR=./dist-restored npm run build      # clean pass, 102.6s
```

| Route | Render size |
|---|---|
| `/industries/automotive-tire-oem/` | 143,489 bytes |
| `/industries/aerospace-aviation-mro/` | 143,643 bytes |
| `/industries/data-center-it-asset-tracking/` | 143,189 bytes |
| `/industries/government-defense-supply-chain/` | 143,926 bytes |
| `/industries/cold-chain-food-traceability/` | 144,562 bytes |

### Inbound link health

Industries hub `/industries/index.html` references the new pages:

| Page | References on hub |
|---|---|
| automotive-tire-oem | 2 |
| aerospace-aviation-mro | 3 |
| data-center-it-asset-tracking | 2 |
| government-defense-supply-chain | 3 |
| cold-chain-food-traceability | 4 |

(Multiple references = appearance in the 20-vertical list bullet AND in the new six-grouping AND in the mandate-driven section AND in some cases the hub-FAQ.)

### Outbound link health

Sample from `automotive-tire-oem` shows links to 14 other industries plus 4 product SKUs. Sample from `aerospace-aviation-mro` shows links to 8 catalog product routes — all resolve to real SKUs.

---

## 4. Catalog audit impact

No new SKUs added in this batch; no new entries in `CATALOG_IMAGE_OVERRIDES`. Catalog audit unchanged at 254/253/1/2 (carry-over from W5b).

The 5 new industry pages are editorial pillars at `/industries/<slug>/`, registered automatically via the `editorial` content collection glob — no `EDITORIAL_OVERRIDE_ROUTES` allowlist needed because there is no pre-existing WP snapshot at these routes.

---

## 5. What ships next

| Priority | Item | Description |
|---|---|---|
| P0 | W5–6 P1 chip encyclopedia depth | NTAG21x family, UCODE 9 standalone, UCODE 8 standalone, Monza R6 family, MIFARE DESFire EV3 commands. ~5 pages, GEO-citation gold |
| P1 | W10 compare-cluster depth pass | Extend 15 thin existing `/compare/*` pages from stub to 700+ words each |
| P2 | `relatedIndustries` top-up | Manual touch on 127 untagged SKUs to widen internal-link density. Now also includes the 5 new vertical slugs |
| P3 | Industry-page back-link script | Auto-tag SKUs with mentions of "tire", "aircraft", "data center", "DoD/MIL-STD", "FSMA/EUDR/cold chain" → resourceCard pointing at the new industry pillar |

---

## 6. Files changed summary

| Category | Files | Change |
|---|---|---|
| New: industry pages | 5 | All 5 pillars listed above |
| Modified: industries hub pillar | 1 | `industries/_pillar.json` (title, hero point, six-grouping, mandate-driven, vertical list, FAQ) |
| New: report | 1 | `pillar-pages-w3b-industries-report.md` (this file) |

**Total diff:** 7 files changed.

---

## 7. Push reminder

```
cd /Users/zhangping/Projects/Playground
git push origin main
```
