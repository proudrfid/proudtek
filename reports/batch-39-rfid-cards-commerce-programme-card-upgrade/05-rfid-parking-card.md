# rfid-parking-card — SHALLOW → DEEP

**Route.** `/products/rfid-cards/rfid-parking-card/`

**Anchor standards & citations.**
- UHF 860-960 MHz, EPC Gen2 (ISO/IEC 18000-63) — 2-5 m windshield read for drive-through barrier arms without stopping.
- HF 13.56 MHz (ISO/IEC 14443) — 3-8 cm tap at pedestal readers.
- LF 125 kHz (ISO/IEC 18000-2) — proximity read on legacy installed bases.
- Silicon: Impinj Monza R6 / R6-P; NXP UCODE 8 / 9 — the dominant UHF tag ICs for automotive / fleet.
- Secure HF options: MIFARE DESFire EV3 + AN10922 key diversification where cloning is a risk (corporate campuses, gated communities).
- Integrator compatibility: Skidata, HID Global (iCLASS / SEOS), Nedap, 3M / TransCore — the dominant parking/tolling head-end ecosystems.
- ISO/IEC 7810 ID-1 form factor for windshield-card variants; hangtag form factors for mirror mount.

**DEEP block inventory.**
- `statBar.items[4]` — UHF 2-5 m / HF 3-8 cm / <2 s gate pass (UHF) vs 8-15 s manual / MOQ 500.
- `comparePanel` — UHF windshield card (long-range, drive-through) vs HF tap card (pedestal, shorter queue) vs LF proximity (legacy compatibility) — across read distance, cloning resistance, reader CAPEX, environmental tolerance.
- `dataHighlight` — "4-8 min → <60 s" peak-hour garage-entry queue collapse when moving from ticket-dispenser to UHF windshield credential.
- `timeline` — 1991 TransCore / Title 21 → 2004 ISO/IEC 18000-63 (EPC Gen2) → 2014 UHF on-metal/windshield maturity → 2026 Today (Blocker C anchor: "corporate-campus-employee, commercial-garage-subscriber, gated-community-resident, university-semester-permit, and hospital-staff-physician-visitor programmes").

**Brief.** 12 `{label, items[]}` objects covering frequency selection (UHF / HF / LF), chip option matrix, windshield mount vs card-in-hand UX, anti-tamper (one-time-peel windshield adhesive), legacy-reader compatibility, Skidata / HID / Nedap integration, MOQ and personalization, artwork/branding, privacy/GDPR for subscriber data, CAPEX/OPEX framing, lost-card workflow, and end-of-life.

**Sources[10].** ISO/IEC 18000-63, ISO/IEC 14443, ISO/IEC 18000-2, Impinj Monza R6/R6-P data sheet, NXP UCODE 8/9 data sheet, NXP AN10922, Skidata integrator guide, HID Global iCLASS portfolio page, Nedap AVI product page, ISO/IEC 7810.

**Inbound refs (5).** `_pillar`, `lp/bulk-rfid-cards`, `industries/fitness`, `solutions/rfid-parking-management`, `guides/em4100-em4305-t5577-lf-chip-encyclopedia`.

**Outbound orphan scan.** 0 orphans across 6 hrefs.

**Task.** #310 completed.
