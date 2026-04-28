# Page 5/5 — `em4100-rfid-card.json` MID → DEEP

**Route**: `/products/rfid-cards/em4100-rfid-card/`
**Previous state**: MID (LF-anchored narrative, 5 partial sources, no dataHighlight)
**Upgrade state**: DEEP (framework-complete)
**Inbound refs**: 13 · **Sync**: clean (936 ms)

## Anchor set

EM Microelectronic EM4100 / EM4200 datasheets · ISO/IEC 18000-2 (LF air-interface) · ISO/IEC 7810 ID-1 · ISO/IEC 10373-6 · HID Prox format · Nohl et al. USENIX Security 2008 (LF read-only analysis) · Proxmark3 iceman fork · Flipper Zero FZS-1

## DEEP block inventory

- `statBar`: 125 kHz LF ASK + 64-bit Manchester frame + read-only architecture + ISO/IEC 7810 card form factor
- `comparePanel`: EM4100 125 kHz vs HID Prox vs MIFARE Plus SE (LF read-only → HF encrypted migration ladder)
- `dataHighlight` (new): *"<5 s"* — T5577 clone time with a EUR 20 duplicator — framed as the EM4100-vs-Plus-SE threat-model pivot — section title *LF resilience vs trivial cloning — the decision pivot*
- `timeline`: EM Micro EM4100 LF chip launch → HID Prox co-evolution → Proxmark / T5577 clone era → 2026 residual-use phase containing the Blocker C anchor

## brief[]

12 labelled objects covering: (1) EM4100 / EM4200 chip genealogy, (2) 125 kHz LF ASK air-interface per ISO/IEC 18000-2, (3) 64-bit Manchester frame layout (header + customer ID + data), (4) read-only OTP architecture, (5) LF RF physics (metal/wet tolerance vs HF), (6) cloning posture (T5577 + Proxmark3 iceman + Flipper Zero FZS-1), (7) EM4100 vs HID Prox positioning, (8) residential-apartment-access deployment patterns, (9) factory-time-attendance use-cases, (10) parking-barrier-gate + construction-site-entry patterns, (11) dual-frequency (125 kHz + 13.56 MHz) combo card patterns, (12) regulatory posture (LF open globally, no regional restriction like HF/UHF).

## sources (9 five-field)

EM Microelectronic EM4100 datasheet + EM4200 datasheet + ISO/IEC 18000-2 + ISO/IEC 7810 + ISO/IEC 10373-6 + HID Prox technology page + Nohl et al. USENIX Security 2008 + Proxmark3 iceman fork repository + Flipper Zero FZS-1 documentation.

## Blocker C

Final timeline item (*2026 — Today*) closes with: *"Deployment patterns integrators follow on residential-apartment-access, factory-time-attendance, parking-barrier-gate, construction-site-entry and contractor-visitor-badge EM4100-125-kHz programmes."*

## Notes

- dataHighlight makes the EM4100 buying decision explicit: the chip is still the lowest-capex LF credential (EUR 0.10–0.30/card) and survives metal/wet environments where HF struggles, but *any* threat model past "we just need to know people's badges move through gates" needs migration to Plus SE or DESFire
- 5 partial sources → 9 five-field sources; EM4200 family reference + Proxmark3 iceman + Flipper Zero FZS-1 added as first-class citations rather than inline mentions
- brief[] restructured from 8 string entries to 12 labelled objects; regulatory notes (LF global openness) separated from access-control deployment patterns
- Closes the rfid-cards flagship chip-family MID → DEEP sweep (5/5 pages)
