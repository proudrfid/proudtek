# Batch 30 — Page 3: rfid-screw-tag

**Route:** `/products/rfid-tags/rfid-screw-tag/`
**Date:** 2026-04-23 (Page 3 of Batch 30)

## Regulatory anchor profile

Assembly-level fastener + switchgear-terminal + bioprocess screw identity — ASME B18.6.3 machine screws + ASME B18.6.1 wood screws + ASME B18.3 socket-head cap screws + ISO 4762 / DIN 912 socket-head cap screws + ASTM A574 alloy-steel SHCS + ASTM F3148 structural bolting combined tension + ISO 898-1 mechanical properties of carbon-steel fasteners + ISO 3506-1 corrosion-resistant stainless-steel fasteners + NDS (National Design Specification for Wood Construction) Chapter 12 wood-screw connections + IEC 60947-7 low-voltage switchgear terminal blocks + ASME BPE bioprocessing equipment sanitary fastener.

## DEEP framework compliance

- keywords[6]: passed
- brief[≥11] array-of-objects `{label, items[]}` — passed
- sources[≥8] all five-field — passed
- sections[] all titled, includes all 4 DEEP blocks — passed
- statBar + comparePanel + dataHighlight + timeline — all wrapped in titled sections per Blocker C — passed
- Blocker C de-identification anchor phrase "Deployment patterns integrators follow on screw-identification programmes" — passed

## Schema validation

`npx astro sync` — clean (887 ms this session).

## Inbound references

5 inbound files — exceeds ≥4 floor (lifted from 2 by adding cross-links in rfid-bolt-tag, rfid-nail-tag, rfid-anchor-bolt-tag).

## Six SKUs covered

1. M3×8 slotted cheese-head machine screw — ISO 1207 / DIN 84 (instrumentation / electronics enclosure)
2. M4×10 socket-head cap screw — ISO 4762 / DIN 912 / ASTM A574 Class 12.9
3. M5×12 flat countersunk machine screw — ISO 10642 / DIN 7991
4. #8×1/2″ self-tapping thread-forming screw — IFI-100 / ISO 7049 (sheet-metal / enclosure)
5. #10×1-1/4″ wood screw — ASME B18.6.1 / NDS Chapter 12 Table 12.2A
6. M6×16 sanitary 316L hex-socket — ASME BPE / ISO 3506-1 A4-80 (bioprocess / pharmaceutical)

## Distinguishing regulatory profile

Anchors assembly-level fastener + switchgear-terminal + bioprocess sanitary screw envelope. Differs from Page 1 (bolt / structural pre-tensioned AISC RCSC F3125 A325 / A490) by load class (assembly-level vs. structural pre-tensioned) and from Page 2 (nail / driven-fastener ASTM F1667) by installation method (threaded rotational engagement vs. impact-driven withdrawal).
