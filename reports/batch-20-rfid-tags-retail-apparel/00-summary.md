# Batch 20 — rfid-tags retail / apparel / high-value-item cohort

**Date:** 2026-04-23
**Cluster:** `rfid-tags`
**SKUs refined:** 6
**Cluster progress after batch:** **18 / 70 (26 %)** (Batches 5 + 6 priors + Batch 19 + Batch 20)

## Scope

Batch 20 advances the rfid-tags cluster with the retail / apparel / high-value-item cohort. These six SKUs cluster around item-level retail inventory, anti-shrink EAS convergence, textile care-label integration, circular-economy / Digital Product Passport buyers, and the library + jewellery vertical-retail use cases:

- `uhf-rfid-apparel-hang-tag` — GS1 TDS 2.0 SGTIN-96 + EPCIS 2.0 + Digital Link (Sunrise 2027) + EU ESPR textile DPP + Walmart / Target / Macy's / Kohl's / Inditex / Nike mandate alignment + Auburn ARC Cat F/H.
- `uhf-rfid-hard-tag` — converged EAS + RFID gate integration (Checkpoint EVOLVE, Sensormatic Synergy, Nedap iSense) + EN 50357 / EN 50364 / ICNIRP 2020 + NRF ORC Survey + INFORM Consumers Act.
- `uhf-rfid-woven-care-label` — textile-compliance anchors (EU 1007/2011, FTC 16 CFR 423, ISO 3758:2023, ISO 6330:2021, OEKO-TEX STANDARD 100) + EU ESPR textile DPP + circular-economy resale platforms (StockX, Vestiaire Collective, Rent the Runway, Renewcell).
- `rfid-textile-laundry-tag` — sewn-in uniform / scrub / linen lifecycle with Positek / Datamars / Jensen / Kannegiesser / InvoTech integration + CDC HICPAC + TJC IC.02.02.01 + CMS 42 CFR §482.42 + ISO 14644-5 + NFPA 2112 + ASTM F1506-22.
- `rfid-jewelry-tag` — SGTIN-198 + GS1 Digital Link client-grade provenance + Cegid / LVMH Aura Blockchain Consortium integration + INFORM Act + RJC COP 2019 + Kimberley Process + CIBJO Blue Book.
- `rfid-library-book-tag` — ISO 28560-2:2022 / ISO 28560-3:2022 + ISO/IEC 15693-3:2019 + NISO RP-6-2012 + ALA Privacy Principles + SIP2 + NISO Z39.83 NCIP v2.02 + Bibliotheca / 3M / D-Tech / FE Technologies / Lyngsoe gate + AMH vendor matrix.

## Treatment (uniform across all 6 SKUs)

1. **Legacy `/product/...` imageSourceRoutes + resourceCards** → migrated to intra-cluster `/products/rfid-tags/<slug>/` or `/products/rfid-labels/<slug>/` neighbours. (uhf-rfid-hard-tag + uhf-rfid-woven-care-label carried legacy `/product/` paths; all corrected.)
2. **FAQ 3 → 5** — appended one platform/integration Q&A + one regulatory/standards Q&A per SKU.
3. **Sources 0 → 8** — schema-valid label/url/publisher triples per SKU.
4. **Dates** — confirmed `publishedAt: "2026-04-22"` + `modifiedAt: "2026-04-23"` + bumped `reviewedAt` to `"2026-04-23"`.
5. **primaryAction** — migrated (`/contact/`, `/contact/laundry-rfid/`, `/contact/apparel-hang-tag/`) → `/contact/rfid-labels-tags/`.
6. **resourceCards hygiene** — uhf-rfid-woven-care-label had broken legacy `/product/rfid-laundry-tags/` → corrected to `/products/rfid-tags/rfid-textile-laundry-tag/`.

## Regulatory / platform anchors

| SKU | Anchor |
| --- | --- |
| uhf-rfid-apparel-hang-tag | GS1 TDS 2.0 + EPCIS 2.0 + GS1 Digital Link Sunrise 2027 + EU Regulation (EU) 2024/1781 ESPR textile DPP + Walmart Supplier RFID Programme + Target/Macy's/Kohl's/Inditex/Nike mandates + Auburn ARC Cat F/H + NXP UCODE 9 + ISO/IEC 18000-63:2015 |
| uhf-rfid-hard-tag | Checkpoint EVOLVE + Sensormatic Synergy + Nedap iSense + EN 50357 + EN 50364 + ICNIRP 2020 + NRF ORC Survey + INFORM Consumers Act + RAIN Alliance Retail Ref Impl 2.1 + EPCIS 2.0 + Monza R6 |
| uhf-rfid-woven-care-label | EU 1007/2011 + FTC 16 CFR Part 423 + ISO 3758:2023 + ISO 6330:2021 + OEKO-TEX STANDARD 100 + EU Regulation (EU) 2024/1781 ESPR textile DPP + StockX/Vestiaire Collective/Rent the Runway/Renewcell resale integration + GS1 TDS 2.0 + EPCIS 2.0 |
| rfid-textile-laundry-tag | ISO 6330:2021 + ISO 15797:2017 + ISO 14644-5:2004 + CDC HICPAC + TJC IC.02.02.01 + CMS 42 CFR §482.42 + AORN + OSHA 29 CFR §1910.1030 + AHLA Safe Stay + EU Ecolabel Commission Decision (EU) 2017/175 + NFPA 2112 §4.5.2 + ASTM F1506-22 + Positek/Datamars/Jensen/Kannegiesser/InvoTech + EPCIS 2.0 + Monza R6 |
| rfid-jewelry-tag | GS1 TDS 2.0 SGTIN-198 + EPCIS 2.0 + GS1 Digital Link + EU Regulation (EU) 2024/1781 ESPR + INFORM Consumers Act 15 U.S.C. §45f + EU DSA Article 31 + Responsible Jewellery Council COP 2019 + Kimberley Process + OECD Due Diligence + CIBJO Blue Book + Cegid Retail + LVMH Aura Blockchain Consortium + Lightspeed + The Edge + Jewelers Mutual/Chubb/AIG insurance |
| rfid-library-book-tag | ISO 28560-1/-2/-3:2022 + ISO/IEC 15693-3:2019 + ISO/IEC 18000-63:2015 + NISO RP-6-2012 + ALA RFID Privacy Principles + IFLA Privacy Statement 2015 + BSI PD 6669:2007 + SIP2 + NISO Z39.83 NCIP v2.02 + FERPA + GDPR Article 5(1)(c) + ADA 2010 Section 707 + EN 301 549 V3.2.1 + Bibliotheca + 3M/Tech Logic + D-Tech + FE Technologies + Lyngsoe + MK Solutions + Koha + Polaris + Sierra + Alma + OCLC + Evergreen + NXP ICODE SLIX/SLIX2 |

## Verification

- `npx astro sync` — clean, 842 ms, zero schema errors.
- `grep '"/product/'` across all 6 Batch 20 SKUs — **0 matches**. Legacy-route-free.
- Counts (Batch 20):
  - `uhf-rfid-apparel-hang-tag`: sec=8, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `uhf-rfid-hard-tag`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `uhf-rfid-woven-care-label`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `rfid-textile-laundry-tag`: sec=6, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `rfid-jewelry-tag`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `rfid-library-book-tag`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/

## Narrative observations

Batch 20 surfaces the rfid-tags cluster's second strategic axis after the Batch 19 industrial-compliance axis: the **retail / apparel / item-level-retail-RFID** axis. Where Batch 19 SKUs pivot on regulatory certification (ISO 17712, ATEX, NADCAP, DOT 49 CFR, TPED) and mechanical retrofit integration, Batch 20 SKUs pivot on:

1. **Retailer mandate compliance** — Walmart, Target, Macy's, Kohl's, Inditex, Nike, adidas, H&M each publish supplier RFID requirements that the apparel-hang-tag SKU must track by encoding scheme (SGTIN-96 vs SGTIN-198), chip generation (UCODE 8 vs UCODE 9 vs Monza R6-P), and tag-delivery format (pre-printed price + EPC vs blank-EPC encoded at the DC).
2. **Digital Product Passport positioning** — EU Regulation (EU) 2024/1781 (ESPR) and the accompanying Commission Delegated Acts make the textile DPP the first enforceable DPP tranche (Q1 2027 target for apparel + footwear). The apparel-hang-tag + woven-care-label + jewelry-tag SKUs each need to foreground DPP alignment as their primary 2026-2028 sales motion.
3. **Converged EAS + RFID** — uhf-rfid-hard-tag's buying decision has shifted from pure EAS (Checkpoint RF 8.2 MHz, Sensormatic AM 58 kHz) toward converged readers (Checkpoint EVOLVE, Sensormatic Synergy, Nedap iSense) that detect both legacy EAS and UHF RFID on the same gate. The tag must be specified with EAS-tech + chip generation + detach-key format compatible with the retailer's existing gate fleet during the multi-year rollover.
4. **Privacy + ethics-of-RFID** — rfid-library-book-tag's buying decision is still shaped materially by NISO RP-6-2012 + ALA + IFLA privacy frameworks. Library tags are a canonical example where patron-data minimisation is a first-class selection criterion — the tag data model must carry item identifiers only, never patron PII.

The combined Batches 19 + 20 (12 SKUs) capture both strategic axes of the rfid-tags cluster narrative. Remaining 58 SKUs will cluster into: high-traffic commodity (pallet, anti-metal, cable tie, zip tie, on-metal), automotive + logistics (tire, windshield, fleet vehicle, cargo pallet), authentication + laundry (silicone, wash care, PPS), living assets (animal ear, pet collar, tree), and industrial-spec extensions (keg, cylinder variants, IBC variants).

## Next batch candidates

64 → 58 rfid-tags SKUs remaining. Priority next batch candidates:

- **Batch 21 — high-traffic commodity**: rfid-pallet-tag, rfid-cable-tie-tag, rfid-zip-tie-tag, rfid-uhf-on-metal-tag (all dense retail/WMS buyer personas, high cross-reference value from the already-refined rfid-anti-metal-tag anchor).
- **Batch 22 — automotive + logistics**: rfid-tire-tag, rfid-vehicle-windshield-tag, rfid-fleet-vehicle-tag, rfid-cargo-pallet-tag, rfid-keg-tag (EU Tyre Regulation (EU) 2024/1805, DOT FMVSS 139, WCO SAFE, FISMA / ETC toll interoperability, TTB 27 CFR §25 for kegs).
- **Batch 23 — laundry + authentication extensions**: rfid-silicone-laundry-tag, rfid-wash-care-label, rfid-pps-laundry-chip, rfid-silicone-flexible-tag, rfid-heat-resistant-silicone-tag (pair with the already-refined textile-laundry-tag + uhf-rfid-laundry-tag anchors).
- **Batch 24 — living assets**: rfid-pet-collar-tag, rfid-tree-tag, rfid-fish-tag, rfid-beehive-tag (ICAR + EU Reg 2016/429 Animal Health Law + EUDR Deforestation Regulation for tree-tag).
