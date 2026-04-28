# Batch 27 — RFID Tags MID → DEEP Upgrade Summary

**Cluster**: Defense / tool-control / PPE / structural-fastener
**Pages**: 6
**Status**: ✅ Complete — all pages DEEP-compliant, schema-valid, orphan-free

## Scope

Batch 27 upgraded six MID-tier rfid-tags SKUs anchored on distinct regulatory
axes to avoid compliance-keyword collision across the cluster:

| # | Page | Regulatory anchor |
|---|------|-------------------|
| 1 | rfid-weapon-tracking-tag | MIL-STD-130N IUID · AR 190-11 AA&E · ATF 27 CFR Part 478 FFL · NATO STANAG 2495 · NIBIN / EU 2021/555 |
| 2 | rfid-ammo-can-tag | MIL-STD-129R / 1168D DODIC-NALC-LOT · DOT 49 CFR §173.62 Class 1 · ITAR USML Cat. III · NATO STANAG 2493 · ATF 27 CFR Part 555 |
| 3 | rfid-tool-tag | FAA AC 120-72B · 14 CFR §145.211(c) · AS9100D §8.1.3 · AS9146 · NAS 412 FOD |
| 4 | rfid-tool-tracking-tag | ISO/IEC 17025:2017 §7.8 · ANSI/NCSL Z540.3 · AS9100D §7.1.5.2 · IATF 16949 MSA · NAS 9300 PME |
| 5 | rfid-helmet-tag | ANSI/ISEA Z89.1-2014 (R2019) · EN 397 / 443 · NFPA 1971 / 1851 / 1977 · MIL-DTL-44099 ACH · NIJ 0106 |
| 6 | rfid-anchor-bolt-tag | ASTM F3125 / F3148 / F1554 · AISC 360-22 + RCSC · ACI 318-19 Ch. 17 · AASHTO LRFD + FHWA 23 CFR Part 650 · IEC 61400-6 / DNV-ST-0126 |

## DEEP threshold audit

All six pages meet every DEEP-framework threshold:

| Check | Target | Result |
|-------|--------|--------|
| keywords[] length | ≥ 6 | 6 / 6 pages pass |
| brief[] fields | ≥ 11 | 1×11, 5×12 — all pass |
| sources[] length | ≥ 8 | 10 on every page |
| sources[] 5-field complete | label + url + publisher + publishedAt + accessedAt | 100 % |
| statBar section | present | 6 / 6 |
| comparePanel section | present | 6 / 6 |
| dataHighlight section | present | 6 / 6 |
| timeline section | present | 6 / 6 |

## Cross-reference health

| Page | Inbound refs | Outbound unique | Orphans (post-fix) |
|------|-------------:|-----------------|-------------------:|
| rfid-weapon-tracking-tag | 7 | 9 | 0 |
| rfid-ammo-can-tag | 6 | 10 | 0 |
| rfid-tool-tag | 12 | 9 | 0 |
| rfid-tool-tracking-tag | 20 | 10 | 0 |
| rfid-helmet-tag | 7 | 8 | 0 |
| rfid-anchor-bolt-tag | 7 | 9 | 0 |

All pages ≥ 4 inbound refs (minimum observed: 6 on rfid-ammo-can-tag).
Initial scan surfaced 13 orphan `/product/...` legacy-namespace references
plus one missing `rfid-weld-mount-tag` route; all resolved by redirecting
to valid `/products/...` routes within the same semantic cluster.

## Validation

`npx astro sync` completed clean on all six pages — 852-895 ms each, no
Zod violations. Final sync after orphan-ref repair: 826 ms clean.

## Blocker C (de-identification)

All six pages use the standards-cited "Deployment patterns integrators follow
on [domain] programmes" framing. No fabricated customer numerics. Directional
benchmarks cite MIL-STD, DoD, ATF, FAA, ISO/IEC, ANSI, AISC, ACI, AASHTO,
FHWA, IEC, DNV, NFPA, EN, and NIJ references.

## Files touched

- `src/content/editorial/products/rfid-tags/rfid-weapon-tracking-tag.json`
- `src/content/editorial/products/rfid-tags/rfid-ammo-can-tag.json`
- `src/content/editorial/products/rfid-tags/rfid-tool-tag.json`
- `src/content/editorial/products/rfid-tags/rfid-tool-tracking-tag.json`
- `src/content/editorial/products/rfid-tags/rfid-helmet-tag.json`
- `src/content/editorial/products/rfid-tags/rfid-anchor-bolt-tag.json`

## Related tasks

- #201 Batch 27 audit (parent)
- #202 Page 1/6 rfid-weapon-tracking-tag
- #203 Page 2/6 rfid-ammo-can-tag
- #204 Page 3/6 rfid-tool-tag
- #205 Page 4/6 rfid-tool-tracking-tag
- #206 Page 5/6 rfid-helmet-tag
- #207 Page 6/6 rfid-anchor-bolt-tag
- #208 Batch 27 verify
- #209 Batch 27 per-page reports (this directory)
