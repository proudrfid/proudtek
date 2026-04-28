# Batch 31 · Page 4 — rfid-cable-seal-tag SHALLOW → DEEP

**File:** `src/content/editorial/products/rfid-tags/rfid-cable-seal-tag.json`
**Route:** `/products/rfid-tags/rfid-cable-seal-tag`
**Sync timing:** 970 ms clean
**Inbound refs:** 10

## Regulatory anchor profile

Trade-security + container-seal stack:

- **ISO 17712** — freight-container seal mechanical security (Indicative / Security / High-Security)
- **ISO 18185** — electronic-seal (e-seal) data elements and 6-frame protocol
- **C-TPAT** — Customs Trade Partnership Against Terrorism (US trusted-trader)
- **WCO SAFE** — World Customs Organization SAFE Framework of Standards
- **EU AEO** — Authorized Economic Operator (EU trusted-trader)
- **CBSA PIP** — Canada Partners in Protection
- **ABF ATT** — Australia Border Force Australian Trusted Trader
- **GS1 EPC Gen2v2** — UHF air interface with cryptographic commands
- **ISO 668** — series-1 freight container dimensions / type codes
- **CBP ACE** — Automated Commercial Environment (US single-window customs)

Factory-locked TID + mechanical break = tamper-evident physical + cryptographic event log → customs single-window.

## DEEP framework compliance

- keywords = **6**
- brief = **11** `{label, items}` objects
- sources = **10** five-field entries
- sections[4] — one statBar + one comparePanel + one dataHighlight + one timeline, each in a titled section
- Blocker C phrase present in timeline: *"Deployment patterns integrators follow on C-TPAT / AEO / PIP e-seal programmes"*

## Distinguishing profile

Sole page in Batch 31 anchored on **ISO 17712 + ISO 18185 + WCO SAFE trusted-trader tiers**. No other rfid-tags page addresses cross-border chain-of-custody or the mechanical-break + cryptographic-event-log evidence pattern. Orthogonal to rfid-drum-tag (bulk hazmat inside a facility) and to rfid-flag-tag / rfid-concrete-embed-tag (product-identity tags without customs evidence role). Unique ISO 668 container-type-code integration + CBP ACE filing path.
