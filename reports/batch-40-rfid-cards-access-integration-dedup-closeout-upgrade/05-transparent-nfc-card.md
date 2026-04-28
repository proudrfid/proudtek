# transparent-nfc-card — SHALLOW → DEEP (+ alternate-naming dedup)

**Route.** `/products/rfid-cards/transparent-nfc-card/`

**Anchor standards & citations.**
- Substrates: optical-grade polycarbonate (Covestro / Bayer MaterialScience Makrolon heritage — the passport data-page and secure-banking-card material family) + PETG (glycol-modified PET) for mid-tier promotional use; clear PVC reserved for disposable short-run.
- ISO/IEC 7810 ID-1 (85.60 × 53.98 × 0.76 mm) geometry preserved; ISO/IEC 10373-1 durability tests exceeded with margin on PC.
- Chip options: NTAG213 (144 B NFC Forum Type 2), NTAG216 (888 B), NTAG424 DNA (AES-128 SUN authentication), MIFARE Classic 1K / DESFire EV3, MIFARE Ultralight EV1.
- NFC Forum Type 2 Tag Operation Specification — governs public-page NDEF read behaviour.
- GS1 Digital Link 1.3 URI syntax — used when transparent cards double as authenticity / DPP credentials.
- Apple Core NFC Background Tag Reading (iOS 14+) + Android NFC documentation — underlie the no-app consumer tap flow.

**DEEP block inventory.**
- `statBar.items[4]` — PC / PETG optical-grade substrates / 0.76 mm ISO ID-1 thickness / 5+ year PC wallet lifecycle / MOQ 100 plain-clear, 200 printed, 500 full-custom.
- `comparePanel` — PETG / clear PVC (mid-tier, 3-5 year promotional) vs optical-grade polycarbonate (flagship, 5+ year membership; passport/banking material heritage; pairs naturally with laser etch + hot foil + spot UV).
- `dataHighlight` — "3-7 layer" typical ink stack on a premium clear card: optional frost/selective-opacity base → registered white underbase → CMYK → metallic/Pantone spot → spot UV / hot-foil → protective varnish; explains why lead time runs 15-18 business days vs 5-7 for PVC.
- `timeline` — 1985 ISO 7810 opaque PVC baseline → 1990s-2000s PC enters banking / national-ID → 2006-10 NXP NTAG & MIFARE commoditisation → 2014 Apple Pay normalises NFC tap → 2017-20 NTAG424 DNA + luxury anti-counterfeit → 2020-24 iOS 14 Core NFC Background Tag Reading universalises no-app tap → 2026 Today (Blocker C anchor: "luxury-retail-membership, hospitality-premium-tier, art-gallery-patron, premium-loyalty-tier, and designer-business-card programmes").

**Brief.** 12 `{label, items[]}` objects covering substrate & material tiers, geometry & ISO conformance, chip options, antenna as design element, ink stack & printing (white-ink underbase requirement), laser engraving & selective opacity, programme fit & positioning, interaction flow (no-app tap), security posture (Originality Signature vs 424 DNA SUN), durability & lifecycle, procurement realities, sustainability & end-of-life.

**Sources[10].** ISO/IEC 7810, ISO/IEC 10373-1, ISO/IEC 14443, NXP NTAG213/215/216 data sheet, NXP NTAG424 DNA data sheet, NFC Forum Type 2 Tag spec, GS1 Digital Link 1.3, Apple Core NFC Background Tag Reading docs, Android Developers NFC guide, Covestro Makrolon polycarbonate for ID cards material overview.

**Merge & dedup.** Absorbed the crystal-clear PVC/PETG premium-positioning and selective-frosting / spot-color / metallic-foil / laser-etch content from `transparent-clear-nfc-card.json` (alternate-name variant) into the canonical page's brief (Ink stack and printing / Laser engraving / Chip options) and sections. Added 301 redirect `/products/rfid-cards/transparent-clear-nfc-card/` → `/products/rfid-cards/transparent-nfc-card/` in `public/_redirects`. Alternate-name source file deleted.

**Inbound refs (4).** `_pillar`, `nfc-card-custom-printing`, `lp/custom-rfid-card-printing`, `solutions/nfc-business-card`.

**Outbound orphan scan.** 0 orphans across 12 hrefs.

**Task.** #318 completed.
