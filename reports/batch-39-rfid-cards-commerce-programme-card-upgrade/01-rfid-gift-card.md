# rfid-gift-card — SHALLOW → DEEP

**Route.** `/products/rfid-cards/rfid-gift-card/`

**Anchor standards & citations.**
- ISO/IEC 7810 ID-1 form factor; ISO/IEC 14443 Type A for NTAG213/216 and DESFire EV3.
- U.S. CARD Act 2009 (Credit CARD Act) §402 — gift-card five-year minimum expiry, restrictions on service fees, clear disclosure.
- EU PSD2 (Directive (EU) 2015/2366) — limited-network exemption Art. 3(k) for closed-loop / branded stored-value cards.
- ASC 606 (FASB) / IFRS 15 — breakage revenue recognition when remote redemption becomes probable.
- NRF stored-value / gift-card market sizing (~USD 170B US activations) and industry-reported 6-12% breakage corridor.

**DEEP block inventory.**
- `statBar.items[4]` — USD 170B+ market / 6-12% breakage / 5-yr expiry floor / <500ms tap-to-auth.
- `comparePanel` — closed-loop NFC stored-value vs open-loop / paper gift cards across redemption rail, regulatory stack, reload economics.
- `dataHighlight` — "6-12%" breakage as structural margin.
- `timeline` — 2009 CARD Act → 2015 PSD2 → 2020 NFC tap-pay ubiquity on iOS/Android → 2026 Today (Blocker C anchor: "Deployment patterns integrators follow on retail-holiday-gift, hospitality-stored-value, restaurant-chain-gift, corporate-rewards-bulk, and e-gift-redemption-card programmes").

**Brief.** 12 `{label, items[]}` objects covering chip choice, stored-value architecture, CARD Act compliance, PSD2 exemption scope, breakage modeling, artwork/activation, NFC tap-pay UX, security posture, reload flows, POS integration, packaging, and supply chain.

**Sources[10].** CARD Act text, PSD2 text, NRF outlook, ASC 606 codification, IFRS 15 standard, NXP NTAG data sheet, NXP DESFire EV3 data sheet, ISO/IEC 7810, ISO/IEC 14443, and industry breakage study — all with label + url + publisher + publishedAt + accessedAt + note.

**Inbound refs (5).** `_pillar`, `rfid-loyalty-card`, `lp/custom-rfid-card-printing`, `lp/bulk-rfid-cards`, `industries/retail-apparel`.

**Outbound orphan scan.** 0 orphans across 5 hrefs.

**Task.** #306 completed.
