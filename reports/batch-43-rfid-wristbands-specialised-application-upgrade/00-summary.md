# Batch 43 — RFID-wristbands specialised-application cluster SHALLOW → DEEP

**Scope.** Five rfid-wristbands SKUs covering distinct specialised use-case anchors — child safety with parent-pair UID workflow, corrections / behavioural-health tamper-evident TPU, NFC medical alert with on-chip emergency profile, gym fitness member-tier credential, and hybrid QR + NFC reader-redundancy. Together with Batch 41 (flagship cluster) and Batch 42 (material family), 15 of 18 wristband SKUs now stand at the current DEEP framework. Remaining 3 (rfid-adjustable-silicone-wristband, rfid-nylon-wristband, elastic-rfid-wristband) for Batch 44 closeout.

**Pages.**
1. `rfid-child-wristband` — parent-child UID-pair workflow, lost-child / school-trip / summer-camp safety, U.S. CPSIA + ASTM F963 + EU Toy Safety Directive 2009/48/EC + EN 71 children's-product compliance, NCMEC Code Adam reference, COPPA + GDPR Art. 8 minimisation.
2. `rfid-prison-wristband` — UHF EPC Gen2v2 ceiling-reader headcount + HF DESFire EV3 cryptographic positive-ID, one-way locking clasp + frangible antenna trace, ACA Performance-Based Standards + NIJ inmate-tracking + PREA chain-of-custody + Joint Commission Behavioural Health Care Standards.
3. `nfc-medical-alert-wristband` — NTAG216 NDEF on-chip emergency profile + cloud-linked HIPAA-compliant full history, MedicAlert Foundation alignment, EMS / ED tap-to-identify, Joint Commission NPSG.01.01.01 + AHRQ + WHO Patient Safety Solutions Solution 2.
4. `nfc-fitness-wristband` — Mindbody / ABC Fitness Solutions / PerfectGym / Glofox / Wodify / Club Automation platform integration, Apple Wallet PassKit + Google Wallet API mirroring, IP68 sweat-tolerant medical-grade silicone with antimicrobial-additive option.
5. `rfid-wristband-qr-nfc` — hybrid dual-credential ISO/IEC 14443-A NFC + ISO/IEC 18004 QR Code with GS1 Digital Link cross-rail URI grammar, reader-redundancy as design principle, accessibility / multi-language / industrial-scanner / EMS-handheld fallback.

**Framework compliance.** Each page ships `keywords[6]`, `brief[12]` array-of-`{label,items[]}`, one of each titled DEEP block, 10 five-field `sources[]`, and a Blocker C de-identification anchor phrase in the final timeline item. Audit script confirmed 5/5 PASS.

**Inbound references (≥4 target).** Initial scan showed 4 of 5 pages below target (child 2, prison 2, medical-alert 3, qr-nfc 1; fitness already at 6). After ref-boost edits to industries/healthcare, industries/education, industries/events-venues, solutions/rfid-event-access-control, and solutions/rfid-patient-tracking, all 5 pages cleared:
- rfid-child-wristband: 7 refs (+5)
- rfid-prison-wristband: 4 refs (+2)
- nfc-medical-alert-wristband: 5 refs (+2)
- nfc-fitness-wristband: 6 refs (no boost needed)
- rfid-wristband-qr-nfc: 4 refs (+3)

**Host-page ref-boost edits.** 5 host pages updated:
- `industries/healthcare.json` — added medical-alert + child + prison to "Access-control credentials for clinical staff".
- `industries/education.json` — added child + qr-nfc to "Core SKUs for campus deployments".
- `industries/events-venues.json` — added qr-nfc + child to "Event guides".
- `solutions/rfid-event-access-control.json` — added qr-nfc + child + cashless-payment to "Best-fit products".
- `solutions/rfid-patient-tracking.json` — added medical-alert + prison + child to "Patient tracking wristband products".

**Orphan-ref scan.** Cross-checked against the full route set (content collections + legacy WP pages in `src/data/pages/` + `public/_redirects` sources). All 74 outbound hrefs across the five pages resolve; 0 orphans.

**Sync.** `npx astro sync` clean on every per-page pass and final pass.

**rfid-wristbands category status.** 15 of 18 wristband SKUs now at current DEEP framework standard (5 Batch 41 flagship + 5 Batch 42 material-family + 5 Batch 43 specialised-application). Remaining 3 (rfid-adjustable-silicone-wristband, rfid-nylon-wristband, elastic-rfid-wristband) for Batch 44 closeout.

**Tasks.** #338 #339 #340 #341 #342 completed per-page; #343 Batch 43 verify completed; #337 parent closes on commit of these reports.
