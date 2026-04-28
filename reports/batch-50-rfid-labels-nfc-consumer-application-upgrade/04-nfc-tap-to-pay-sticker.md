# nfc-tap-to-pay-sticker — SHALLOW → DEEP

**Route.** `/products/rfid-labels/nfc-tap-to-pay-sticker/`

**Anchor standards & citations.**
- EMVCo Contactless Specifications Books A-D v2.11.
- EU PSD2 Directive 2015/2366 + RTS-SCA Reg 2018/389.
- PCI DSS v4.0 — sticker out-of-scope (URL only, no cardholder data).
- NFC Forum NDEF + URI Record Type Definition.
- NXP NTAG 424 DNA + AN12196 SUN cryptographic anti-skimming.
- Apple Core NFC framework (iOS 14+ background NDEF).
- W3C Payment Request API.
- US CFPB Reg E (12 CFR Part 1005) chargeback rights.
- Open Banking PIS / Pix / UPI / Bizum A2A rails.

**DEEP block inventory.**
- `statBar.items[4]` — USD 200-800 traditional POS terminal upfront + USD 30-50/mo fees / 30-50% cash-only sales loss in cashless-preferred markets / 30-60 sec QR-code 5-7 step process time / <5 sec NFC tap + Face ID / Touch ID confirm time.
- `comparePanel` — Traditional POS / mobile card reader / QR code / cash only vs NFC sticker tap-to-pay + hosted checkout + mobile-wallet (this page).
- `dataHighlight` — <5 sec tap-to-pay confirmation time vs 30-60 sec QR-code 5-7 step process; PSD2 SCA satisfied via mobile-wallet device-biometric + device-binding flow without 3-D Secure; NTAG 424 DNA SUN AES-128 MAC option defeats clone + replace fraud server-side.
- `timeline` — 2007 EMVCo Contactless Specifications Books A-D published → 2014 Apple Pay launches with iPhone 6 → 2015-2016 Google Pay (Android Pay) + Samsung Pay → 2018 EU PSD2 SCA + Apple iOS 12 background NFC → 2019-2021 COVID-19 contactless inflection + tip-jar NFC explosion → 2022-2023 A2A rails + Open Banking + Pix + UPI scale → 2024 PCI DSS v4.0 effective + W3C Payment Request API → 2026 Today (Blocker C: micro-merchant-pop-up, tip-jar-coffee-shop, vending-machine-unattended, event-vendor-booth, hotel-self-check-in, unattended-kiosk programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon options, form factors + sizes, substrate + adhesive, NDEF + payment-launch architecture, mobile-wallet platform support, regional payment-rail support (US/EU + China + Japan + Korea + SE Asia + A2A), regulatory framework (PSD2 + PCI DSS + EMVCo + Reg E + FCA), anti-fraud architecture, hosted checkout integration (Stripe / PayPal / Square / Adyen / Razorpay), customer UX flow, application verticals, procurement.

**Sources[10].** EMVCo Contactless Books A-D, EU PSD2 + RTS-SCA, PCI DSS v4.0, NFC Forum NDEF + URI RTD, NXP AN12196 SUN, Apple Core NFC, W3C Payment Request API, CFPB Reg E, Open Banking PIS.

**Inbound refs (5).** Pillar, sibling NFC consumer-application products (event-ticket / table-stand / smart-poster / social-media) + NTAG 424 DNA flagship + industries/events-venues.

**Outbound orphan scan.** 0 orphans across 5 hrefs.

**Magnuson-Moss positioning equivalent.** PCI DSS scope kept minimal at sticker layer because chip carries only URL — no PAN, no cardholder data. Hosted checkout page (Stripe / Adyen / PayPal) sits inside PCI boundary as Level 1 service provider. PSD2 SCA satisfied via mobile-wallet device-biometric (inherence) + device-binding (possession) — Apple Pay / Google Pay flow without 3-D Secure friction.

**Task.** #392 completed.
