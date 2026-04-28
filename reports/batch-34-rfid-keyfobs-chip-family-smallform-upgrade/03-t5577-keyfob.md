# Page 3/6 — t5577-keyfob.json

**Route:** `/products/rfid-keyfobs/t5577-keyfob/`
**Prior depth:** SHALLOW → **DEEP**
**Status:** ✅ sync clean, DEEP audit clean, inbound-ref 4 (post-wiring).

## Anchor set

ISO/IEC 18000-2 (125 kHz LF), ATA5577 datasheet (Atmel / Microchip T5577), HID Prox H10301 + Corporate 1000 emulation, SIA OSDP v2.2, BSI TR-02102-1, IEC 60529, RoHS 3, REACH.

## DEEP blocks

- `statBar` — 330-bit user memory / 30+ encoding protocol envelope / Manchester / PSK / FSK / Biphase modulation / 100k write cycles.
- `comparePanel` — EM4305 tenant-reuse posture vs T5577 universal-emulation posture (integrator / locksmith / red-team / reader-commissioning envelope).
- `dataHighlight` — Integrator-inventory SKU reduction — 60-80 % collapse in programmer-bench test-credential inventory by replacing 30+ chip-specific SKUs with a single T5577 emulation SKU.
- `timeline` — 5-envelope legitimate-use rollout with Blocker C phrase in the final item: *"Deployment patterns integrators follow on multi-vendor-legacy, locksmith-duplication, reader-commissioning, red-team-audit and 30-protocol integrator-inventory T5577-keyfob programmes."*

## Brief (11 objects)

Air-interface envelope / chip memory + programmability / emulation posture / multi-vendor-legacy / locksmith-duplication / reader-commissioning / red-team-audit / integrator test-inventory / form-factor / regulatory / end-of-life.

## Sources (8 five-field)

All 8 include full five-field shape. Spans ISO/IEC 18000-2, ATA5577 datasheet, HID Prox / Corporate 1000 documentation, SIA OSDP v2.2, BSI TR-02102-1, IEC 60529, RoHS 3, REACH.

## Inbound-ref count

4 (post-wiring) — pillar + em4305-keyfob + abs-keyfob + metal-keyfob. Wiring edits added rfid-abs-keyfob resourceCards link + rfid-metal-keyfob resourceCards link to clear ≥4 threshold.

## Differentiator vs em4305

Both share ISO/IEC 18000-2 anchor, but T5577 is distinguished as "universal integrator / locksmith / red-team envelope" with 30+ protocol-emulation posture + commercial use-case validation, while em4305 stays on "tenant-reuse / OSDP retrofit" anchor.
