# rfid-card-assa-abloy-compatible — SHALLOW → DEEP

**Route.** `/products/rfid-cards/rfid-card-assa-abloy-compatible/`

**Anchor standards & citations.**
- Assa Abloy Hospitality lock portfolio: VingCard Classic / Essence / Allure / Signature RFID (legacy and current-gen installed base) + Vostio cloud platform (current-gen).
- ISO/IEC 14443-A (13.56 MHz Type A) as the open air-interface; ISO/IEC 7810 ID-1 form factor; ISO/IEC 10373-1 durability tests.
- Silicon: NXP MIFARE Classic 1K (MF1ICS50), MIFARE Classic 4K (MF1ICS70), MIFARE DESFire EV2/EV3 with AES-128.
- Key diversification: NXP AN10922 CMAC-based scheme for DESFire migrations.
- Anti-tying backstop: Magnuson-Moss Warranty Act 15 U.S.C. §§ 2301-2312 (specifically §2302(c)) — the statute that permits third-party hospitality-card supply without voiding lock warranties.
- PMS neutrality: Oracle Opera Cloud, Mews, Cloudbeds, Infor HMS, Protel — all integrate at the lock/head-end layer, not the card.
- Crypto-1 break reference: Nohl / Plötz 2008 — drives the DESFire-upgrade recommendation for luxury / resort / casino / regulated-gaming tiers.

**DEEP block inventory.**
- `statBar.items[4]` — ISO 14443-A open interface / 30-50% below OEM pricing / 2-3 day blank dispatch / 5-7 day custom production.
- `comparePanel` — VingCard Classic/Essence/Allure (Classic 1K/4K silicon, Crypto-1, USD 0.18-0.30 MOQ-direct) vs Vostio/Signature RFID (DESFire EV3 AES-128, USD 0.50-0.80 MOQ-direct, mobile-key ready).
- `dataHighlight` — "30-50%" cost delta decomposed: Classic 1K USD 0.18-0.30 vs OEM USD 0.35-0.55; DESFire EV3 2-3× Classic in both channels.
- `timeline` — 1979 VingCard first electronic hotel lock → 1994 NXP MIFARE Classic → 2008 Crypto-1 break → 2013 Assa Abloy acquires VingCard Elsafe → 2016 Vostio cloud → 2020-22 mobile key + BLE → 2026 Today (Blocker C anchor: "hotel-chain-flagship, boutique-resort, extended-stay, student-housing, and cruise-cabin programmes").

**Brief.** 12 `{label, items[]}` objects covering air interface, chip matrix by VingCard generation, front-desk encoding (not factory), mixed-fleet/legacy bridging, warranty/anti-tying posture, PMS + head-end integration, print & personalization, durability + lifecycle economics, MIFARE Classic residual risk today, procurement & supply resilience, packaging/environmental options, and end-of-life.

**Sources[10].** Assa Abloy Global Solutions product portfolio page, NXP MIFARE Classic 1K data sheet, NXP MIFARE DESFire EV3 data sheet, ISO/IEC 14443 family, ISO/IEC 7810, ISO/IEC 10373-1, NXP AN10922, Magnuson-Moss Act (Cornell LII), Oracle Opera Cloud Hospitality PMS integration, Nohl/Plötz Crypto-1 cryptanalysis (USENIX 2008) — all with label + url + publisher + publishedAt + accessedAt + note.

**Inbound refs (7).** `_pillar`, `rfid-card-magnetic-stripe-combo`, `compatibility/vingcard-hotel-key-cards`, `solutions/rfid-access-control`, `solutions/hotel-key-cards`, `compare/mifare-classic-vs-plus-vs-desfire-hotel-locks`, `industries/hospitality`.

**Outbound orphan scan.** 0 orphans across 10 hrefs.

**Task.** #314 completed.
