# Competitor vs. supplier brands (for image Check B)

This is the editable source of truth for the competitor-logo check. The
distinction that matters: Proudtek is a **manufacturer** of RFID/NFC tags,
cards, labels, wristbands, keyfobs and readers. So the question is not "is there
a brand in this image" — it's "is there a brand of a company Proudtek *competes
with*."

- A **rival manufacturer's** logo on a hero image is a problem — the site would
  be advertising the competition. **Flag it.**
- A **chip/silicon supplier's** logo is fine — Proudtek buys those chips and
  builds products around them, and the chips are named all over the editorial
  content. A photo of an inlay marked "NXP" or "Impinj" is legitimate. **Allow.**

When a brand isn't on either list, use that principle: do they sell finished
RFID/NFC hardware that a buyer might purchase *instead of* Proudtek? If yes, lean
flag (note it as "unlisted competitor?"); if they're a chip maker, standards
body, or software/integration platform, lean allow. Flag only brands you can
actually read in the image, with a confidence note.

## FLAG — rival RFID/NFC product manufacturers

Finished-product makers (tags, inlays, labels, cards, wristbands, readers,
on-metal / specialty tags) that compete with Proudtek:

- HID Global (incl. iCLASS, Seos, Indala branding)
- Zebra Technologies
- Avery Dennison / Smartrac (inlays & labels — note: a supplier of inlays to
  some, but a direct competitor to Proudtek's label business → flag)
- Identiv
- Honeywell (AIDC / RFID hardware)
- Datalogic
- Confidex (specialty / on-metal tags)
- Xerafy (on-metal / embeddable tags)
- Omni-ID
- Checkpoint Systems
- SML Group
- Nedap
- Paragon ID
- Invengo
- Times-7
- Brady (RFID labels)
- Metalcraft
- William Frick & Company
- GAO RFID
- Trace-ID
- PCS Systemtechnik (INTUS access-control / time-recording terminals & RFID
  readers — added Jun 2026 from image audit; seen on
  access-card-copied-security-upgrade + rfid-frequencies-lf-hf-uhf-explained)
- RFIDCard (rfidcard.com — RFID/NFC cards & inlays — added Jun 2026 from image
  audit; seen on uhf-vs-hf-rfid-frequency-choice + the two mifare-ultralight-c
  pages)
- ACS / Advanced Card Systems (ACR-series NFC / smart-card readers — added Jun
  2026 from image audit; an ACR122U reader appears on the elastic-rfid-wristband
  product hero)
- Axess AG (ski-resort access gates & RFID ski-pass media — added Jun 2026 from
  image audit; seen on rfid-ski-pass-card-season)
- race result / raceresult (RFID race-timing transponders, decoders & timing
  bibs — added Jun 2026 from image audit; seen on rfid-marathon-race-timing-setup)

## ALLOW — chip/silicon suppliers, standards, platforms, own brand

Do **not** flag these — they are suppliers, neutral context, or Proudtek itself.

**Chip / IC vendors** (Proudtek builds products on these — branding is expected):
- NXP (NTAG, MIFARE, UCODE, ICODE)
- Impinj (Monza, M-series)
- Alien Technology (Higgs) — chip vendor; allowed per project decision
- STMicroelectronics (ST25)
- EM Microelectronic (EM4xxx, T5577)
- Infineon
- Quanray, FUDAN / Shanghai Fudan Microelectronics (clone-chip suppliers)

**Standards bodies / programs** (legitimate authority references):
- GS1 / EPCglobal, ISO/IEC, NFC Forum, RAIN Alliance, Auburn ARC, FCC, CE, UL

**Software / lock / integration platforms** (partners or context, not RFID-maker
competitors — out of scope for this check unless the user says otherwise):
- Genetec, Lenel, Salto, Honeywell Pro-Watch*, HID Origo*, Shopify, SAP, Oracle
  NetSuite, MindBody, Tracelink
  (*Honeywell/HID also make hardware — if the *hardware* logo is the subject of
  a product shot, treat as flag; a software/platform wordmark in a diagram is
  context.)

**Proudtek's own marks:** Proudtek, Proud Tek, proudrfid — always allowed.

## Maintenance

Add or move brands as the business view changes — this file is meant to be
edited. Keep the FLAG list to genuine finished-RFID-hardware rivals so the audit
doesn't drown in false positives.
