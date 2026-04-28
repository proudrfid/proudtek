# cashless-payment-rfid-wristband — SHALLOW → DEEP

**Route.** `/products/rfid-wristbands/cashless-payment-rfid-wristband/`

**Anchor standards & citations.**
- ISO/IEC 14443-A — 13.56 MHz HF air interface; sub-second tap-to-pay latency at ISO 14443-4.
- Silicon: NXP MIFARE DESFire EV2 / EV3 (AES-128 mutual auth + Secure Dynamic Messaging on EV3); MIFARE Ultralight EV1 (token-only); MIFARE Classic 1K (CRYPTO-1 — academic break, legacy only); NTAG213 / 216 (NFC Forum Type 2, cloud-lookup).
- NXP Application Note AN10922 — per-card key diversification for DESFire deployments.
- Courtois / Meijer / Verdult (and Garcia et al.) — academic CRYPTO-1 cryptanalysis underlying the Classic→DESFire migration recommendation.
- EU PSD2 Directive (EU) 2015/2366 Art. 3(k) — limited-network exemption for closed-loop event stored-value.
- PCI-DSS v4.0 — segmentation rules for top-up infrastructure that touches credit-card data.
- Platform vendors: Intellitix, Glownet, PlayPass, Tappit, CrowdBlink (festival-cashless dominant ecosystem).
- Theme-park lineage: Disney MagicBand, Universal TapuTapu — consumer-scale demonstration of NFC payment wristband at the venue layer.

**DEEP block inventory.**
- `statBar.items[4]` — Sub-second tap-to-pay latency / AES-128 DESFire EV3 mutual auth / Offline-capable on-chip stored value / Closed-loop typical PCI-out-of-scope.
- `comparePanel` — Server-side wallet (Ultralight / NTAG, USD 0.30-0.70, connectivity-required, halts on outage) vs On-chip stored value (DESFire EV2/EV3, USD 0.80-1.50, offline-capable, AES-128 + AN10922 + EV3 SDM CMAC, lost-band-without-account-registration loses balance).
- `dataHighlight` — "30-50%" typical peak-load throughput uplift at bars and food stalls (sub-second tap vs 25-40s cash workflow); per-capita spend uplift consistently reported in published festival-cashless literature; cash-handling shrinkage low-single-digit percent eliminated entirely.
- `timeline` — 1994 NXP MIFARE Classic → 2008 CRYPTO-1 break → 2010-2014 Intellitix / Glownet / PlayPass / Tappit scale festival cashless → 2015 EU PSD2 Art. 3(k) → 2017-2020 Disney MagicBand / Universal TapuTapu consumer-scale → 2021-2024 DESFire EV3 SDM ships → 2026 Today (Blocker C anchor: "festival-multi-day, all-inclusive-resort, theme-park-payment, cruise-cabin-tab, and corporate-campus-cafeteria programmes").

**Brief.** 12 `{label, items[]}` objects covering chip options, air interface, on-chip vs server-side wallet trade-off, security posture (AES-128 + diversification + SDM), PCI-DSS scoping, regulatory frame (PSD2 / CARD Act), platform compatibility, wristband substrates, closure as anti-sharing control, top-up/redemption/refund flow, operational ROI signals, branding/sponsorship/post-event afterlife.

**Sources[10].** ISO/IEC 14443-1..4, NXP MIFARE DESFire EV3 data sheet, NXP AN10922 key diversification, NXP MIFARE Ultralight EV1 data sheet, Courtois/Meijer/Verdult CRYPTO-1 cryptanalysis, EU PSD2 Directive 2015/2366, PCI-DSS v4.0, Intellitix platform overview, Glownet platform, Tappit platform.

**Inbound refs (17).** Strong cross-link density — pillar pages, festival blog content, multiple wristband SKUs, industries/events-venues, hospitality, solutions/rfid-event-access-control.

**Outbound orphan scan.** 0 orphans across 16 hrefs.

**Task.** #323 completed.
