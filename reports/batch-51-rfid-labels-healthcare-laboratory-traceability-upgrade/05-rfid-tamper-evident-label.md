# rfid-tamper-evident-label — SHALLOW → DEEP

**Route.** `/products/rfid-labels/rfid-tamper-evident-label/`

**Anchor standards & citations.**
- NXP NTAG 424 DNA TagTamper (NT4H2421Tx) — bridge-antenna CTTES register.
- NXP AN12196 — SUN/SDM + tamper-loop register behaviour.
- EU Commission Delegated Regulation (EU) 2016/161 Article 5 ATD.
- EU Falsified Medicines Directive 2011/62/EU.
- FDA Drug Supply Chain Security Act (DSCSA).
- GS1 DataMatrix — approved 2D serialisation carrier.
- ISO/IEC 14443-4 — proximity card transmission protocol.
- OECD Trade in Counterfeit and Pirated Goods.
- ICH E6(R2) GCP — clinical-trial IMP.
- FDA 21 CFR Part 11 — Electronic Records / Signatures.

**DEEP block inventory.**
- `statBar.items[4]` — USD 2-4T annual global counterfeiting cost / USD 0.01-0.03 illicit hologram reproduction cost per unit / <0.1% false-positive accidental-damage rate / <2 sec cloud authentication response time.
- `comparePanel` — Hologram + standard adhesive label + printed QR code vs destructive-antenna or NTAG 424 DNA TagTamper + cloud authentication (this page).
- `dataHighlight` — Two distinct tamper-detection mechanisms: destructive-antenna binary alive/dead (electronically dead on tamper) vs NTAG 424 DNA TagTamper persistent CTTES bit (chip alive but reports 'tampered' forever, survives re-bridging attacks).
- `timeline` — 1980s hologram + VOID sticker baseline → 2011 EU FMD Directive 2011/62/EU adopted → 2016 EU Delegated Reg 2016/161 + EMVS go live → 2018 NXP NTAG 424 DNA + AN12196 + iOS 12 background NFC → 2019-2020 NTAG 424 DNA TagTamper variant → 2022-2023 DSCSA preparation + Aura Blockchain Consortium → 2024 DSCSA Nov full enforcement + EU ESPR DPP → 2026 Today (Blocker C: premium-pharma-blister, vintage-wine-capsule, single-cask-spirits, luxury-handbag-seal, electronics-box-seal, clinical-trial-IMP, warranty-equipment-housing programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon (NTAG213 destructive + NTAG 424 DNA + TagTamper), tamper-detection mechanism — destructive antenna (binary alive/dead), tamper-detection mechanism — NTAG 424 DNA TagTamper (CTTES persistent bit), visual tamper indicators (VOID + fragmentation + thermochromic + holographic), form factors + sizes, substrate + adhesive (frangible PET + cold-chain + high-temp variants), cloud-authentication architecture (PCI DSS out-of-scope), pharmaceutical regulatory framework (EU FMD Article 5 ATD + FDA DSCSA + GS1 DataMatrix on-top-of), defence-in-depth anti-counterfeit stack (overt + semi-covert + covert + cryptographic), application verticals, comparison vs hologram + standard adhesive + QR code, procurement.

**Sources[10].** NXP NTAG 424 DNA TagTamper, NXP AN12196, EU Delegated Reg 2016/161, EU FMD Directive 2011/62/EU, FDA DSCSA, GS1 DataMatrix, ISO/IEC 14443-4, OECD Trade in Counterfeit, ICH E6(R2) GCP, FDA 21 CFR Part 11.

**Inbound refs (4).** Pillar, sibling NTAG 424 DNA flagship + nfc-warranty-seal-tag + nfc-pharmaceutical-label + rfid-wet-inlay/dry-inlay.

**Outbound orphan scan.** 0 orphans across 7 hrefs.

**Two-mechanism positioning.** Destructive-antenna for low-cost single-use seals (pharma blister / wine capsule / unboxing carton — binary alive/dead sufficient). NTAG 424 DNA TagTamper for forensic evidence beyond physical tamper — product must continue carrying DPP / warranty / authenticity data after opening, OR counterfeiters might re-bridge antenna with conductive paste. Defence-in-depth: outer destructive + inner TagTamper for highest threat profile (high-value pharma + limited-release luxury).

**Task.** #400 completed.
