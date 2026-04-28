# Batch 30 — rfid-tags metal-fastener / anti-metal cluster SHALLOW→DEEP

**Scope:** Six SHALLOW rfid-tags pages upgraded to full DEEP framework (keywords[6] + brief[≥11] array of {label, items[]} + statBar + comparePanel + dataHighlight + timeline each in titled section + 5-field sources ≥8 + Blocker C de-identification).

**Dates:** 2026-04-23 → 2026-04-24

## Pages upgraded

| # | Page | Regulatory-anchor theme | Sync | Inbound refs |
|---|------|------------------------|------|--------------|
| 1 | rfid-bolt-tag | ASTM A325 + A490 + F3125 + AISC 360 + AASHTO LRFD + RCSC + FHWA NBI + API 510/570 + NACE MR0175 | 908 ms | 6 |
| 2 | rfid-nail-tag | ASTM F1667 + F547 + ISPM-15 + ANSI MH1 + EPAL + CHEP + AREMA + FRA 49 CFR 213 + ANSI O5.1 + RUS + IEEE C2 NESC | 919 ms | 6 |
| 3 | rfid-screw-tag | ASME B18.6.3 + B18.6.1 + B18.3 + ISO 4762 + DIN 912 + ASTM A574 + F3148 + ISO 898-1 + ISO 3506-1 + NDS Ch.12 + IEC 60947-7 + ASME BPE | 887 ms | 5 |
| 4 | rfid-wedge-tag | ASME A13.1 + ISO 14726 + ASME B31.1/3/5/8/9 + API 570/574/578/580 + NFPA 25/13 + NEMA VE 1/2 + IEC 61537 + ISO 19650 + COBie 2.4 | 886 ms | 6 |
| 5 | rfid-magnet-mount-tag | IEC 60404-8-1 + ASTM A977 + GB/T 13560 + JIS C 2514 + MMPA 0100 + ASTM F2503 + IATA DGR 2.14 + 49 CFR 173.21 | 887 ms | 7 |
| 6 | anti-metal-uhf-it-asset-tag | ISO/IEC 19770-1/2/3/4 + ITIL 4 SACM + ISO/IEC 27001 A.5.9/7.9/8.1 + NIST SP 800-53 CM-8 + CIS v8 C1 + PCI DSS 12.5.1 + SOX 404 + CMMC 2.0 + NERC CIP + ANSI/TIA-942 + ASHRAE TC 9.9 | 898 ms | 10 |

**All six pages: DEEP framework compliance — passed.**

## Distinguishing regulatory profiles

Each page anchors on a distinct non-overlapping regulatory envelope so that the six pages remain topically differentiated for SEO / LLM-retrieval:

- Page 1 (bolt): structural-steel + bridge + pressure-vessel — ASTM F3125 + AISC + RCSC + API 510 + NACE sour-service.
- Page 2 (nail): pallet + timber + railroad-tie + utility-pole — ISPM-15 + ANSI MH1 + AREMA + FRA 49 CFR 213 + ANSI O5.1 + RUS + NESC.
- Page 3 (screw): assembly-level fastener + switchgear-terminal + bioprocess — ASME B18 + ISO 898-1 + NDS Ch.12 + IEC 60947 + ASME BPE.
- Page 4 (wedge): pipe-identification + cable-tray + fire-protection + BIM — ASME A13.1 + B31 + API 570 + NFPA 25 + NEMA VE + ISO 19650.
- Page 5 (magnet-mount): permanent-magnet materials + MRI safety + magnetized transport — IEC 60404 + ASTM F2503 + IATA DGR 2.14.
- Page 6 (anti-metal IT-asset): IT-asset-management + governance-risk-compliance — ISO/IEC 19770 + NIST SP 800-53 + CMMC + PCI DSS + SOX + HIPAA + FedRAMP.

## Schema validation

`npx astro sync` → all clean (886–919 ms generation). Six sequential syncs + final verification sync all green.

## Inbound reference hygiene

All six pages ≥ 5 inbound refs (threshold ≥ 4). Added cross-links in rfid-bolt-tag, rfid-nail-tag, rfid-anchor-bolt-tag, rfid-hose-tag, rfid-flag-tag to lift rfid-screw-tag (2 → 5) and rfid-wedge-tag (1 → 6) above threshold.

## Verification

- Schema: clean (six syncs + final verification).
- Inbound refs: all ≥ 5.
- Orphan scan: no orphans in the six-page set.
- DEEP audit: keywords[6] + brief[≥12] + sources[10] five-field + statBar + comparePanel + dataHighlight + timeline — all wrapped in titled sections per Blocker C.
- Blocker C de-identification: timeline anchor phrase "Deployment patterns integrators follow on [domain] programmes" used on all six pages.
