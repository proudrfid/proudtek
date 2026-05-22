// Known-wrong chip-spec patterns caught in sweeps 6-22.
// Each rule has: id, pattern (RegExp), reason, sweep, severity, optional `allowIf` to skip if context matches.
// Add a new entry whenever a sweep catches a fresh fabrication so the regression doesn't re-merge.
// Run with: npm run lint:chip-claims

export const rules = [
  // ── M700 family sensitivity (sweeps 6-7) ──
  {
    // Tighter: M7xx immediately followed by (paren) dBm pairing. Avoids false positives
    // where M770/M730/M750 share a sentence with "UCODE 9 (-23.5 dBm)".
    id: 'M700-23.5',
    pattern: /M(?:7(?:00|30|50|70))\s*\(?\s*-?\s*23\.5\s*dBm/i,
    reason: 'M700-family sensitivity is -22.1 to -22.7 dBm per Impinj M700 product brief. -23.5 dBm is UCODE 9, not M700.',
    sweep: 6,
  },
  {
    id: 'M730-24dBm',
    pattern: /M73[05]\s*\(?\s*-?\s*24\s*dBm/i,
    reason: 'M730 / M775 are -22.6 dBm typical per Impinj product brief. -24 dBm is over-claim.',
    sweep: 7,
    allowIf: /-22 to -24 dBm|-?22\.?\d?-?24/i, // legitimate range citations
  },
  {
    id: 'M770-24dBm',
    pattern: /M770[^"]{0,80}-?\s*24\s*dBm/i,
    reason: 'M770 is -22.6/-22.7 dBm typical per Impinj product brief. -24 dBm is over-claim.',
    sweep: 7,
  },
  {
    id: 'Higgs-9-20dBm',
    pattern: /Higgs-9[^"]{0,80}-?\s*20(?:\.0)?\s*dBm/i,
    reason: 'Higgs-9 is -23.2 dBm typical per Alien datasheet, more sensitive than M700. -20 dBm reverses the actual ranking.',
    sweep: 8,
  },

  // ── ICODE SLIX / SLIX2 memory (sweep 9) ──
  {
    id: 'SLIX-256-bytes',
    pattern: /ICODE\s*SLIX(?!2)[^"]{0,40}256\s*byte/i,
    reason: 'ICODE SLIX user memory is 896 bits (~112 bytes) per NXP SL2S2002 datasheet. 256 bytes is fabricated.',
    sweep: 9,
  },
  {
    id: 'SLIX2-2560-bit',
    pattern: /SLIX2[^"]{0,150}2,?560[\s-]*bit/i,
    reason: 'ICODE SLIX2 user memory is 2,528 bits (79 blocks × 32 bits) per NXP SL2S2602 datasheet. 2,560 is total EEPROM (80 blocks × 32 bits = user + system). User-memory citations should be 2,528 bits.',
    sweep: 9,
    allowIf: /total memory|total —|total -|total EEPROM|2,?560.*total/i,
  },

  // ── UCODE 9xe EPC (sweep 10) ──
  {
    id: 'UCODE-9xe-208-bit',
    pattern: /UCODE\s*9xe[^"]{0,60}208[\s-]*bit/i,
    reason: 'UCODE 9xe EPC is 128-bit per NXP SL3S1216 datasheet + Avery Dennison AD Line U9XE IML datasheet. 208-bit is fabricated.',
    sweep: 10,
  },
  {
    id: 'UCODE-9xe-448-bit',
    pattern: /UCODE\s*9xe[^"]{0,60}448[\s-]*bit\s*EPC/i,
    reason: 'UCODE 9xe is 128-bit EPC (not 448). 448-bit EPC range belongs to UCODE 9xm (SL3S1005).',
    sweep: 10,
  },
  {
    id: 'UCODE-9xe-user-memory',
    pattern: /UCODE\s*9xe[^"]{0,60}(?:9[26]|128|144|256)[\s-]*bit\s*user/i,
    reason: 'UCODE 9xe has 0-bit user memory per Avery Dennison AD Line U9XE IML datasheet ("EPC and User Memory: 128-bit and n/a"). Any user-memory claim is wrong.',
    sweep: 10,
  },

  // ── UCODE DNA City discontinued (sweep 11) ──
  {
    id: 'UCODE-DNA-City-active',
    pattern: /UCODE\s*DNA\s*City/i,
    reason: 'UCODE DNA City (SL3S5005N0FUD) is no longer manufactured per NXP product-status URL. Replace with regular UCODE DNA (SL3S5002N0FUD).',
    sweep: 11,
    allowIf: /no longer manufactured|discontinued|EOL/i,
  },

  // ── M775 + Fujitsu FRAM (sweep 12) ──
  {
    id: 'M775-688-bit',
    pattern: /M775[^"]{0,60}688[\s-]*bit/i,
    reason: 'M775 has 32-bit user memory + PRESENT-80 crypto per Impinj M775 product brief. 688-bit user is Alien Higgs-9, not M775.',
    sweep: 12,
  },
  {
    id: 'M775-4kbit',
    pattern: /M775[^"]{0,40}4[\s-]*kbit/i,
    reason: 'M775 has 32-bit user memory. 4 kbit user is a fabrication.',
    sweep: 12,
  },
  {
    id: 'M830-4kbit',
    pattern: /M830[^"]{0,40}4[\s-]*kbit/i,
    reason: 'M830 has 0-bit user memory per Impinj M800 product brief. 4 kbit is a fabrication.',
    sweep: 12,
  },
  {
    id: 'Fujitsu-MB97R-64KB',
    pattern: /MB97R[^"]{0,60}64\s*K?B?yte?\s*FRAM/i,
    reason: 'Fujitsu MB97R803A = 3,424 byte user; MB97R8110 = 8 KByte. 64 KByte is the Fujitsu AIT-64K tag-product SKU, not the IC.',
    sweep: 12,
    allowIf: /AIT-64K|tag product reaching 64|tag-product SKU/i, // legitimate citation of the tag-level product
  },

  // ── NTAG 424 DNA / total vs user memory (sweep 13) ──
  {
    id: 'NTAG-424-256-bytes',
    pattern: /NTAG\s*424\s*DNA[^"]{0,40}256\s*byte/i,
    reason: 'NTAG 424 DNA has 416 bytes user memory per NXP NT4H2421Gx datasheet. 256 bytes is fabricated.',
    sweep: 13,
  },
  {
    id: 'NTAG-216-924-user',
    pattern: /NTAG\s*216[^"]{0,40}924\s*byte[s\s]*user/i,
    reason: 'NTAG 216 user memory is 888 bytes. 924 bytes is total EEPROM (including config/UID/lock/CC).',
    sweep: 13,
  },
  {
    id: 'NTAG21x-180-user',
    pattern: /NTAG\s*213[^"]{0,40}180\s*B?\s*user/i,
    reason: 'NTAG 213 user memory is 144 bytes. 180 bytes is total EEPROM.',
    sweep: 13,
  },

  // ── DESFire / ICODE DNA (sweep 14) ──
  {
    id: 'DESFire-32-applications',
    pattern: /DESFire\s*EV3?[^"]{0,80}32\s*application/i,
    reason: 'DESFire EV3 max is 28 applications per NXP datasheet. 32 is a fabrication.',
    sweep: 14,
  },
  {
    id: 'DESFire-16-application-keys',
    pattern: /DESFire\s*EV3?[^"]{0,80}16\s*application\s*key/i,
    reason: 'DESFire EV3 supports up to 28 applications with up to 14 keys per application. "16 application key slots" is fabricated.',
    sweep: 16,
  },
  {
    id: 'ICODE-DNA-2016-bytes',
    pattern: /ICODE\s*DNA[^"]{0,40}2,?016\s*byte/i,
    reason: 'ICODE DNA user memory is 2,048 bits / 256 bytes per NXP ICODEDNALF brochure. 2,016 bytes is fabricated.',
    sweep: 14,
  },

  // ── Pillar / TID / tire-cure (sweep 15) ──
  {
    id: 'TID-64-bit',
    pattern: /M7\d\d[^"]{0,200}\b64[\s-]*bit\s*TID\b/i,
    reason: 'M700-family TID is 96-bit (48-bit unique serial) per Impinj product brief. "64-bit TID" is fabricated.',
    sweep: 15,
  },
  {
    id: 'TID-32-64-bit',
    pattern: /\b32-64\s*bit\s*TID\b/i,
    reason: 'TID is 96-bit on M700, UCODE 9, Monza R6 chips per vendor datasheets. "32-64 bit TID" is misleading for all modern RAIN chips — TID is always 96 bits (with variable unique-serial portion: 32-bit on some legacy chips, 48-bit on M700, 64-bit on Monza R6, etc.). Flag for human review.',
    sweep: 15,
  },
  {
    id: 'UCODE-8m-tire-cure',
    pattern: /UCODE\s*8m[^"]{0,100}tire[\s-]*cure/i,
    reason: 'UCODE 8m is -40 to +85 °C per NXP datasheet — NOT tire-cure qualified. Monza R6-P is the tire-cure chip.',
    sweep: 15,
    allowIf: /NOT tire-cure/i,
  },
  {
    id: 'Higgs-EC-tire-cure',
    pattern: /Higgs-EC[^"]{0,100}tire[\s-]*cure/i,
    reason: 'Higgs-EC is -40 to +85 °C per Alien datasheet — NOT tire-cure qualified. Monza R6-P is the tire-cure chip.',
    sweep: 15,
    allowIf: /NOT tire-cure/i,
  },

  // ── EM4423 frequency (sweep 16) ──
  {
    id: 'EM4423-LF-UHF',
    pattern: /EM4423[^"]{0,100}LF[\s+]*\+?[\s+]*UHF/i,
    reason: 'EM4423 is HF + UHF dual-frequency (ISO 14443A + EPC Gen2) per EM Microelectronic datasheet, NOT LF + UHF. Mis-recommendation creates ISO 11784 LF non-compliance.',
    sweep: 16,
    allowIf: /NOT LF|HF \+ UHF/i,
  },

  // ── UCODE 9xe sensor port (sweep 17) ──
  {
    id: 'UCODE-9xe-thermistor',
    pattern: /UCODE\s*9xe[^"]{0,80}(?:thermistor|temperature sensor port|external sensor)/i,
    reason: 'UCODE 9xe has no sensor port per NXP SL3S1216 datasheet — it is the extended-EPC variant. NXP\'s UHF+sensor chip is NHS3100 (UCODE I²C); Axzon Magnus-S3 and EM4325 are the sensor-equipped UHF chips.',
    sweep: 17,
    allowIf: /NOT UCODE 9xe|no sensor port/i,
  },

  // ── M781 user memory + M830 extended (sweep 18) ──
  {
    id: 'M781-64-128-bit',
    pattern: /M781[^"]{0,40}(?:64-128|64|128)[\s-]*bit\s*user/i,
    reason: 'M781 has 512-bit user memory + 128-bit EPC per Impinj M780/M781 product brief. Listing M781 in 64-128 bit user-memory tier is wrong (128-bit EPC is correct).',
    sweep: 18,
    allowIf: /128-bit EPC/i,
  },
  {
    id: 'M830-extended-memory',
    pattern: /M830[^"]{0,60}extended\s+memory/i,
    reason: 'M830 has 0-bit user memory per Impinj M800 product brief. Not the "extended memory" choice. Use M780/M781.',
    sweep: 18,
  },

  // ── M780/M770 crypto (sweep 19) ──
  {
    id: 'M780-with-crypto',
    pattern: /M780[^"]{0,60}(?:with\s+)?crypto/i,
    reason: 'M780 has no crypto engine. Only M775 has on-chip crypto (PRESENT-80) in the M700 family.',
    sweep: 19,
    allowIf: /no crypto|but no crypto|NOT.*crypto/i,
  },
  {
    id: 'M770-with-crypto',
    pattern: /M770[^"]{0,60}(?:with\s+)?crypto(?:\s|,)/i,
    reason: 'M770 has Protected Mode (privacy hiding) but no crypto engine. Only M775 has on-chip crypto in M700 family.',
    sweep: 19,
    allowIf: /no crypto engine|NOT.*crypto/i,
  },

  // ── Higgs-3 / Monza 4QT (sweep 20) ──
  {
    id: 'Higgs-3-800-bit-user',
    pattern: /Higgs-3[^"]{0,40}800[\s-]*bit\s*user/i,
    reason: 'Higgs-3 user memory is 512-bit per Alien ALN-9640 datasheet. 800-bit is total NVM (EPC + user + TID + reserve).',
    sweep: 20,
  },
  {
    id: 'Monza-4QT-kilobits',
    pattern: /Monza\s*4QT[^"]{0,60}\d+[\s-]*kilobit/i,
    reason: 'Monza 4QT has 128-bit user memory. The 2-64 kbit user-memory tier is UCODE DNA / Monza X / Fujitsu MB97R FRAM.',
    sweep: 20,
  },

  // ── Infineon SLE66CLX (sweep 21) ──
  {
    id: 'SLE66CLX-NTAG-equivalent',
    pattern: /SLE66CLX[^"]{0,80}(?:functional\s+equivalent|equivalent)[^"]{0,60}NTAG/i,
    reason: 'SLE66CLX is a high-end secure-element family (Java Card OS, AES/RSA/ECC, EAL4+/5+). NOT equivalent to NTAG 215 — different tier.',
    sweep: 21,
    allowIf: /NOT a functional equivalent/i,
  },

  // ── MIFARE Classic part-number/size mismatch (sweep 22) ──
  {
    id: 'MF1S70-as-1K',
    pattern: /Classic\s*EV1?\s*1K[^"]{0,40}MF1S70/i,
    reason: 'MF1S70YYX is the 4K variant. The 1K datasheet is MF1S50YYX.',
    sweep: 22,
  },
  {
    id: 'MF1S50-as-4K',
    pattern: /Classic\s*EV1?\s*4K[^"]{0,40}MF1S50/i,
    reason: 'MF1S50YYX is the 1K variant. The 4K datasheet is MF1S70YYX.',
    sweep: 22,
  },
];
