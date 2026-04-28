# nfc-cosmetics-authentication-label — SHALLOW → DEEP

**Route.** `/products/rfid-labels/nfc-cosmetics-authentication-label/`

**Anchor standards & citations.**
- NXP NTAG 424 DNA (NT4H2421Gx) — AES-128 + Secure Dynamic Messaging.
- NXP AN12196 — SUN URL generation + antenna design for compact / curved-surface inlays.
- Regulation (EC) No 1223/2009 cosmetic products — Responsible Person, CPNP notification, Article 23 SUE adverse-event reporting.
- European Commission Cosmetic Products Notification Portal (CPNP).
- US Modernization of Cosmetics Regulation Act of 2022 (MoCRA) — FDA-administered facility registration, product listing, safety substantiation, adverse-event reporting.
- ISO 22715:2006 — Cosmetics packaging and labelling.
- NFC Forum Type 4 Tag Operation Specification.
- OECD / EUIPO counterfeit beauty market analyses (>USD 5B annually).
- Apple Core NFC framework (iOS 14+) + ISO/IEC 14443-4 transmission protocol.

**DEEP block inventory.**
- `statBar.items[4]` — 12 × 19 mm compact inlay footprint / >USD 5B counterfeit beauty market / EU 1223/2009 CPNP notification / US MoCRA 2022 facility registration.
- `comparePanel` — Hologram / static QR / serial-number sticker vs NTAG 424 DNA SUN flexible PET inlay (this page).
- `dataHighlight` — "12 × 19 mm" ultra-compact inlay footprint preserves premium cosmetics packaging aesthetic; transparent overlay + clear adhesive nearly invisible on transparent packaging.
- `timeline` — 2000s-2010s holograms / serials → 2009-2013 EU Regulation 1223/2009 + CPNP → 2014 iPhone NFC → 2017-2019 NTAG 424 DNA premium cosmetics early adopters → 2022 US MoCRA → 2024 EU 2024/1781 ESPR → 2026 Today (Blocker C: prestige-cosmetics-counter, e-commerce-cosmetics-verification, hair-care-professional-only, fragrance-anti-refill, K-beauty-export programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon options, inlay size and form factor, substrate and curved-surface compatibility, adhesive options, read distance by inlay size, counterfeit cosmetics market context, EU Cosmetic Products Regulation 1223/2009 + CPNP, US MoCRA 2022, refill-bottle anti-counterfeit, consumer engagement post-verification, procurement and integration, compliance posture.

**Sources[10].** NXP NTAG 424 DNA datasheet, NXP AN12196, EU Regulation 1223/2009, EU CPNP, US MoCRA 2022, ISO 22715:2006, NFC Forum Type 4 Tag specification, OECD / EUIPO Italian Economy counterfeit analysis, Apple Core NFC framework, ISO/IEC 14443-4.

**Inbound refs (5).** Pillar, sibling NFC authentication products, industries/brand-protection.

**Outbound orphan scan.** 0 orphans across 14 hrefs.

**Task.** #363 completed.
