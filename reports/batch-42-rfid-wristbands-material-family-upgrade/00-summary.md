# Batch 42 — RFID-wristbands material-family cluster SHALLOW → DEEP

**Scope.** Five rfid-wristbands SKUs covering the substrate-variant story across the wristband category — fabric (woven sublimation festival premium), paper (sub-Tyvek-tier disposable), PVC (waterproof reusable mid-tier), vinyl (multi-day extended-stay one-time), and water-park silicone (IP68 fully-submersible aquatic). Together with Batch 41's flagship cluster (UHF, cashless, silicone access, hospital, Tyvek), the material-family + flagship pages now anchor 10 of 18 wristband SKUs at the current DEEP framework.

**Pages.**
1. `fabric-rfid-wristband` — woven polyester / nylon-PA / Jacquard substrate, ISO 105-X12 / E04 colour-fastness, dye-sublimation full-bleed both faces, one-way aluminium / plastic sliding lock, NTAG216 / DESFire EV3 / Ultralight C / Monza R6-P chip pairing, premium multi-day festival positioning.
2. `paper-rfid-wristband` — coated paper / synthetic paper (Yupo / Polyart) / Tyvek-blend hybrid substrates, FSC-certified ESG variant, peel-and-stick adhesive tamper-evident closure, sub-Tyvek-tier disposable economics, indoor / sheltered single-day envelope.
3. `pvc-rfid-wristband` — soft PVC compound IP67 per IEC 60529, EU REACH SVHC + RoHS phthalate-free, snap / clip / breakaway closure spectrum, hotel-pool / cruise / water-park / resort positioning, DESFire EV3 cashless default.
4. `rfid-vinyl-wristband` — RF-welded hypoallergenic vinyl, one-time-adjustable snap-lock closure, 7-14 day continuous wear, ASSA ABLOY / Salto / dormakaba / VingCard hospitality lock compatibility, Royal Caribbean WowBand / MSC for Me cruise-line platform compatibility.
5. `rfid-waterpark-wristband` — medical-grade silicone IP68 per IEC 60529, FDA 21 CFR 177.2600 + ISO 10993-5/-10, Semnox / Gateway / Intercard / accesso cashless platform, electronic-locker-system compatibility (Foxtrot / Best Lockers / Ojmar), ride-photo / PhotoPass association, season-pass economics.

**Framework compliance.** Each page ships `keywords[6]`, `brief[12]` array-of-`{label,items[]}`, one of each titled DEEP block, 10 five-field `sources[]`, and a Blocker C de-identification anchor phrase in the final timeline item. Audit script confirmed 5/5 PASS.

**Inbound references (≥4 target).**
- fabric-rfid-wristband: 12 refs
- paper-rfid-wristband: 5 refs
- pvc-rfid-wristband: 6 refs
- rfid-vinyl-wristband: 5 refs
- rfid-waterpark-wristband: 7 refs

No host-page ref-boost edits required — strong cross-link density already in place from earlier upgrade waves and from this batch's own internal cross-references.

**Orphan-ref scan.** Cross-checked against the full route set (content collections + legacy WP pages in `src/data/pages/` + `public/_redirects` sources). All 77 outbound hrefs across the five pages resolve; 0 orphans.

**Sync.** `npx astro sync` clean on every per-page pass and final pass.

**rfid-wristbands category status.** 10 of 18 wristband SKUs now at current DEEP framework standard (5 from Batch 41 flagship + 5 from Batch 42 material-family). Remaining 8 (rfid-child-wristband, rfid-prison-wristband, elastic-rfid-wristband, rfid-nylon-wristband, nfc-fitness-wristband, rfid-wristband-qr-nfc, rfid-adjustable-silicone-wristband, nfc-medical-alert-wristband) are candidates for Batch 43-44.

**Tasks.** #330 #331 #332 #333 #334 completed per-page; #335 Batch 42 verify completed; #329 parent closes on commit of these reports.
