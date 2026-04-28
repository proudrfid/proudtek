# Batch 31 · Page 6 — rfid-pallet-runner-tag SHALLOW → DEEP

**File:** `src/content/editorial/products/rfid-tags/rfid-pallet-runner-tag.json`
**Route:** `/products/rfid-tags/rfid-pallet-runner-tag`
**Sync timing:** 905 ms clean
**Inbound refs:** 5

## Regulatory anchor profile

Pallet-pool + food-traceability stack:

- **ANSI MH1** — pallet, slip-sheet, unit-load standard (NA)
- **ISO 6780** — flat pallets intermodal materials handling
- **ISO 8611-1** — pallet load-test procedures
- **GS1 General Specifications — SSCC** — Serial Shipping Container Code (SSCC-96)
- **GS1 EPC Gen2v2** — UHF air interface with SSCC encoding
- **FSMA 204 / 21 CFR 1 Subpart S** — Food Traceability Rule (KDE / CTE for Food Traceability List)
- **EPAL** — European Pallet Association quality + repair rules
- **CHEP** — pallet-pool operator specifications
- **EUDR (EU 2023/1115)** — deforestation-free due-diligence (commodity supply chain)
- **GS1 EPCIS 2.0** — Electronic Product Code Information Services event stream (REST/JSON)

Embedded in runner cavity (no external exposure), survives 50–100+ pool-trip cycles + 80 °C caustic wash + 1,000 kg stack load per ISO 8611.

## DEEP framework compliance

- keywords = **6**
- brief = **11** `{label, items}` objects
- sources = **10** five-field entries
- sections[4] — one statBar + one comparePanel + one dataHighlight + one timeline, each in a titled section
- Blocker C phrase present in timeline: *"Deployment patterns integrators follow on pallet-pool programmes"*

## Distinguishing profile

Sole page in Batch 31 anchored on **ANSI MH1 / ISO 6780 / ISO 8611 pallet + GS1 SSCC-96 + FSMA 204 KDE / CTE + EUDR** pool-operator flow. Orthogonal to rfid-drum-tag (bulk chemical containment), rfid-cable-seal-tag (container seal), rfid-flag-tag (mill-to-fab steel). Unique runner-cavity embed geometry (zero protrusion + survives 50–100+ cycles + 80 °C caustic wash) and unique FSMA 204 / EUDR compliance path. Only page in the tree combining GS1 SSCC-96 serial encoding with EPCIS 2.0 event stream into FTL food traceability.
