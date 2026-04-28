# Page 4/5 — rfid-blocking-card.json (Task #292)

**Before:** SHALLOW — no keywords array, string-array brief, 0 sources, no block sections, AND unsubstantiated quantitative claims ("25-35 % higher contactless adoption", "90 %+ recipient satisfaction", "zero unauthorized badge cloning incidents").
**After:** DEEP framework complete + honest threat-model reframing.

## Editorial reset — threat-model honesty

The previous copy overclaimed on a product class that research since 2012 has substantially de-risked. The rewrite acknowledges upfront that:

- EMV tokenisation means the card's PAN is not transmitted in cleartext during a contactless tap — a skimmer captures a one-time cryptogram, not reusable card data.
- EMVCo contactless transaction caps (EUR 50 / GBP 100 / USD 100 floor limits without CVM) bound the per-tap fraud ceiling.
- UK Finance Annual Fraud Report and FTC consumer guidance both consistently describe consumer contactless skimming as a marginal fraud vector versus card-not-present and phishing.
- Academic literature (Kfir & Wool 2005 on the theoretical skimming range; Garcia et al. ESORICS 2008 on MIFARE Classic cryptography) predates and motivates the EMVCo tokenisation architecture deployed since.

Blocking cards therefore position honestly as: a low-cost wallet-kit / welcome-kit accessory whose primary jobs are customer reassurance and corporate-gift giveaway utility, not demonstrable fraud reduction on EMV-tokenised payment cards. They remain genuinely useful against legacy MIFARE Classic 1K access badges (Garcia 2008 crack still applicable) and passport chips in high-risk transit scenarios.

## Anchor stack

ISO/IEC 14443 · ISO/IEC 10373-6 · ISO/IEC 7810 · EMVCo Contactless Specifications (tokenisation + transaction caps) · Kfir & Wool 2005 (Picking Virtual Pockets) · Garcia et al. ESORICS 2008 (MIFARE Classic crypto) · UK Finance Annual Fraud Report · FTC consumer guidance · ICAO Doc 9303 (ePassport).

## DEEP block summary

- **keywords[6]** — RFID blocking card, contactless shielding card, wallet RFID protection card, corporate welcome-kit accessory, bank co-brand blocking card, access badge portfolio protection card.
- **brief[12]** — labelled objects on threat-model reality (EMVCo tokenisation, transaction caps), ISO/IEC 14443 coupling fundamentals, how shielding works (passive e-field detuning vs active jamming), construction options (carbon paper, aluminum laminate, active ~13.56 MHz jammer with coin cell), ISO 7810 form-factor compatibility, academic literature, customer reassurance positioning, corporate welcome-kit / bank co-brand use cases, legacy-access-badge shielding (MIFARE Classic context), travel-accessory retail packaging, regulatory posture (not a radio transmitter under EMC rules when passive; active jammer variants require specific regional evaluation), end-of-life disposal.
- **statBar** — ~30 dB attenuation at 13.56 MHz (typical passive laminate card), 2-3 cm shield radius (passive), 2-3 yr coin-cell life (active variant), ISO 7810 ID-1 form factor.
- **comparePanel** — Passive shielding card vs active 13.56 MHz jammer card vs RFID-blocking wallet / sleeve on shielding mechanism, power requirement, typical attenuation, regulatory posture, retail price tier.
- **dataHighlight** — **"EUR 50 / GBP 100 / USD 100"** — the EMVCo contactless transaction cap that bounds the theoretical per-tap skimming loss. The real fraud surface, not an inflated vendor claim.
- **timeline** — ISO/IEC 14443 (2000) → Kfir & Wool (2005) → first contactless card issuance at scale (mid-2000s) → Garcia MIFARE Classic crack (2008) → EMVCo tokenisation (2012) → UK contactless cap £30 → £45 → £100 (2010s-2020) → FTC / UK Finance guidance → integrator deployment closer.
- **sources[9]** — ISO/IEC 14443-1, ISO/IEC 10373-6, ISO/IEC 7810, EMVCo Contactless Specifications, Kfir & Wool 2005, Garcia et al. ESORICS 2008, UK Finance Annual Fraud Report, FTC consumer guidance, ICAO Doc 9303.
- **Blocker C** — "Deployment patterns integrators follow on consumer-wallet-shielding, bank-co-brand-promotion, corporate-welcome-kit, travel-accessory-retail and access-badge-portfolio-protection blocking-card programmes."

## Validation

`npx astro sync` — clean, 933 ms.
Inbound refs — 4 (_pillar + lp/bulk-rfid-cards **[added]** + lp/rfid-card-manufacturer-china **[added]** + lp/rfid-smart-card-manufacturer **[added]**).

## Note on sources count (9 vs 10)

Blocking-card is the only page in the batch at the 9-source floor rather than 10. This is intentional: padding to 10 would have required reaching for weaker secondary citations and I preferred to stay tight on authoritative sources. Framework minimum is ≥8.
