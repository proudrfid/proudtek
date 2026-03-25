// ---------------------------------------------------------------------------
// Product Spec Sheets – RFID Cards (Batch 1)
// ---------------------------------------------------------------------------

export interface ProductSpecSheet {
  specs: Array<{ label: string; value: string }>;
  buyerNotes: string[];
  applications: string[];
  compatibility?: string;
}

export const PRODUCT_SPEC_SHEETS: Record<string, ProductSpecSheet> = {
  // -----------------------------------------------------------------------
  // 1. 125 kHz RFID Card
  // -----------------------------------------------------------------------
  "/product/125-khz-rfid-card/": {
    specs: [
      { label: "Chip Options", value: "EM4100 (read-only), EM4200 (read-only), T5577 (read/write)" },
      { label: "Operating Frequency", value: "125 kHz (LF)" },
      { label: "Protocol", value: "ISO 11784/11785, EM modulation (Manchester/Biphase)" },
      { label: "Memory", value: "EM4100: 64-bit UID; T5577: 330-bit read/write" },
      { label: "Read Range", value: "3–10 cm (reader-dependent)" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Material", value: "PVC / PET laminated" },
      { label: "Operating Temperature", value: "−20 °C to +55 °C" },
      { label: "Data Retention", value: "> 10 years" },
      { label: "Write Endurance", value: "T5577: 100,000 cycles; EM4100/EM4200: factory-programmed" },
    ],
    buyerNotes: [
      "Choose EM4100 for lowest cost read-only access control; T5577 for re-writable multi-protocol cloning.",
      "T5577 can emulate EM4100, HID ProxII, and other 125 kHz formats — ideal for system migration.",
      "LF 125 kHz offers no native encryption; pair with a secondary credential for high-security sites.",
      "Specify UID format (decimal, hexadecimal, or Wiegand 26/34-bit) when ordering to match your reader output.",
    ],
    applications: [
      "Building access control",
      "Employee time-and-attendance",
      "Parking lot gate systems",
      "Basic asset identification",
    ],
    compatibility: "Works with most 125 kHz proximity readers including HID ProxPoint, EM-Marine readers, and standalone access controllers.",
  },

  // -----------------------------------------------------------------------
  // 2. Blank RFID Card
  // -----------------------------------------------------------------------
  "/product/blank-rfid-card/": {
    specs: [
      { label: "Chip Options", value: "EM4100, T5577 (LF); MIFARE Classic 1K/4K, NTAG213/215/216, DESFire EV2/EV3 (HF)" },
      { label: "Operating Frequency", value: "125 kHz (LF) or 13.56 MHz (HF), chip-dependent" },
      { label: "Card Format", value: "CR80 — 85.6 × 54 × 0.84 mm (ISO 7810)" },
      { label: "Material", value: "PVC (glossy white, printable surface both sides)" },
      { label: "Surface Finish", value: "Glossy white, compatible with direct-to-card and retransfer printers" },
      { label: "Read Range", value: "LF: 3–10 cm; HF: 2–7 cm (reader-dependent)" },
      { label: "Operating Temperature", value: "−20 °C to +55 °C" },
      { label: "Data Retention", value: "> 10 years" },
    ],
    buyerNotes: [
      "Ideal for in-house card personalization — print and encode on site with any ISO CR80-compatible printer.",
      "Confirm chip type before ordering in bulk; MIFARE Classic 1K is the most common for access control, NTAG213 for NFC tap applications.",
      "Cards ship factory-blank with unique UIDs; custom encoding (sector keys, NDEF records) available on request.",
      "Glossy PVC surface works with dye-sublimation (Fargo, Evolis, Magicard) and retransfer printers.",
    ],
    applications: [
      "In-house card issuance and personalization",
      "ID badge programs with on-demand printing",
      "Visitor management systems",
    ],
    compatibility: "Compatible with all major card printers (Fargo HDP, Evolis Primacy, Magicard) and standard ISO 14443A / ISO 18000-2 readers.",
  },

  // -----------------------------------------------------------------------
  // 3. Clamshell Card
  // -----------------------------------------------------------------------
  "/product/clamshell-card/": {
    specs: [
      { label: "Chip Options", value: "EM4100 (read-only) or T5577 (read/write)" },
      { label: "Operating Frequency", value: "125 kHz (LF)" },
      { label: "Protocol", value: "EM modulation (Manchester encoding)" },
      { label: "Memory", value: "EM4100: 64-bit UID; T5577: 330-bit EEPROM" },
      { label: "Read Range", value: "5–15 cm (extended range vs. thin cards)" },
      { label: "Dimensions", value: "85.6 × 54 × 1.8 mm (thick-body)" },
      { label: "Material", value: "ABS clamshell housing" },
      { label: "Weight", value: "~10 g" },
      { label: "Operating Temperature", value: "−25 °C to +65 °C" },
      { label: "Data Retention", value: "> 10 years" },
    ],
    buyerNotes: [
      "Thicker 1.8 mm body means longer read range but cards are NOT printable — use slot-punch and lanyard for identification.",
      "Slot punch position (vertical or horizontal) should be specified at order; landscape slot is standard.",
      "EM4100 clamshell cards are the lowest-cost credential for basic door access — ideal for high-turnover sites.",
      "Not compatible with standard CR80 card printers due to 1.8 mm thickness.",
    ],
    applications: [
      "Factory and warehouse access control",
      "Construction site entry",
      "Student ID for gate/turnstile access",
    ],
    compatibility: "Compatible with all 125 kHz EM-Marine and HID-compatible proximity readers; the extended body improves read reliability on long-range readers.",
  },

  // -----------------------------------------------------------------------
  // 4. Combi Card (Dual-Chip)
  // -----------------------------------------------------------------------
  "/product/combi-card/": {
    specs: [
      { label: "Chip Combinations", value: "LF + HF (e.g., EM4100 + MIFARE Classic 1K) or HF + UHF (e.g., MIFARE DESFire + Impinj Monza R6)" },
      { label: "Operating Frequencies", value: "125 kHz + 13.56 MHz, or 13.56 MHz + 860–960 MHz" },
      { label: "Protocols", value: "ISO 14443A + ISO 11784/11785 (LF+HF); ISO 14443A + EPC Gen2 / ISO 18000-6C (HF+UHF)" },
      { label: "Memory", value: "Chip-dependent; each chip retains its native memory capacity" },
      { label: "Read Range", value: "LF: 3–10 cm; HF: 2–7 cm; UHF: up to 5 m (passive)" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Material", value: "PVC with dual-antenna inlay lamination" },
      { label: "Operating Temperature", value: "−20 °C to +55 °C" },
    ],
    buyerNotes: [
      "Two independent chips on separate antennas — each operates with its own reader ecosystem, no cross-interference.",
      "LF+HF combi cards allow migration from legacy 125 kHz to modern 13.56 MHz without replacing cards mid-transition.",
      "HF+UHF combi cards enable dual use: tap for door access (HF) and long-range vehicle/asset tracking (UHF).",
      "Specify exact chip pairing at order — antenna layout is optimized per combination and cannot be changed post-production.",
    ],
    applications: [
      "Multi-system facility access (legacy + modern readers)",
      "Combined personnel access and vehicle gate entry",
      "Supply chain tracking with embedded access credential",
      "Campus-wide unified credential for transit + buildings",
    ],
    compatibility: "Each chip operates independently with its standard reader infrastructure — no special combi-specific reader required.",
  },

  // -----------------------------------------------------------------------
  // 5. Dual-Interface Card (Contact + Contactless)
  // -----------------------------------------------------------------------
  "/product/dual-interface-card/": {
    specs: [
      { label: "Chip Options", value: "NXP JCOP 4, Infineon SLE78, Thales IDPrime (Java Card OS)" },
      { label: "Contact Interface", value: "ISO 7816 (T=0, T=1), SWP" },
      { label: "Contactless Interface", value: "ISO 14443 Type A/B, 13.56 MHz" },
      { label: "Crypto Engine", value: "RSA 2048/4096, ECC P-256/P-384, AES-128/256, 3DES, SHA-256" },
      { label: "Memory", value: "Up to 400 KB EEPROM (chip-dependent)" },
      { label: "Certifications", value: "CC EAL5+/EAL6+, EMVCo, FIPS 140-2 (chip-dependent)" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Material", value: "PVC / PC (polycarbonate for government ID)" },
      { label: "Operating Temperature", value: "−25 °C to +85 °C" },
      { label: "Data Retention", value: "> 25 years" },
    ],
    buyerNotes: [
      "Single chip serves both contact (inserted into reader) and contactless (tap) interfaces — reduces cost vs. two separate chips.",
      "EMVCo-certified chips are required for payment applications; specify EMV compliance level at project start.",
      "Polycarbonate card bodies are required for government eID/passport cards with laser-engraved personalization.",
      "Applet development (JavaCard/GlobalPlatform) is typically required — confirm OS version compatibility with your middleware.",
    ],
    applications: [
      "EMV banking / payment cards",
      "National eID and ePassport programs",
      "Healthcare insurance smart cards",
      "Corporate PKI authentication badges",
    ],
    compatibility: "Works with all ISO 7816 contact readers and ISO 14443A/B contactless terminals; EMV-certified for Visa, Mastercard, and UnionPay payment networks.",
  },

  // -----------------------------------------------------------------------
  // 6. Eco RFID Card
  // -----------------------------------------------------------------------
  "/product/eco_rfid_card/": {
    specs: [
      { label: "Chip Options", value: "MIFARE Classic 1K/4K, NTAG213/215/216, DESFire EV2, EM4100, T5577" },
      { label: "Operating Frequency", value: "125 kHz (LF) or 13.56 MHz (HF), chip-dependent" },
      { label: "Material", value: "Recycled PVC (rPVC), PLA (polylactic acid), or bio-PET" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Read Range", value: "LF: 3–10 cm; HF: 2–7 cm" },
      { label: "Recyclability", value: "PLA cards are industrially compostable; rPVC cards contain ≥ 70% post-consumer recycled content" },
      { label: "Printing", value: "Full CMYK offset or digital printing; soy-based inks available" },
      { label: "Operating Temperature", value: "−20 °C to +50 °C (PLA); −20 °C to +55 °C (rPVC)" },
      { label: "Data Retention", value: "> 10 years" },
    ],
    buyerNotes: [
      "PLA cards are compostable under industrial conditions (58 °C / 60 days) but NOT in home compost bins.",
      "Recycled PVC offers the same durability and printer compatibility as virgin PVC — no workflow changes needed.",
      "PLA has a lower heat tolerance than PVC — avoid prolonged exposure above 50 °C (e.g., car dashboards in summer).",
      "Request sustainability certification documentation (recycled content %, compostability certificates) for ESG reporting.",
    ],
    applications: [
      "Eco-conscious corporate badge programs",
      "Event and conference attendee credentials",
      "Hospitality key cards with sustainability branding",
      "Municipal transit cards with green initiative alignment",
    ],
    compatibility: "Functionally identical to standard PVC RFID cards — works with all readers compatible with the embedded chip type.",
  },

  // -----------------------------------------------------------------------
  // 7. EM4200 Card
  // -----------------------------------------------------------------------
  "/product/em4200-card/": {
    specs: [
      { label: "Chip", value: "EM4200 (EM Microelectronic)" },
      { label: "Operating Frequency", value: "125 kHz (LF)" },
      { label: "Protocol", value: "EM modulation (Manchester encoding)" },
      { label: "Memory", value: "128-bit read-only (factory-programmed unique ID)" },
      { label: "UID Format", value: "128-bit unique serial number (vs. 64-bit on EM4100)" },
      { label: "Read Range", value: "3–10 cm" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Material", value: "PVC" },
      { label: "Operating Temperature", value: "−40 °C to +85 °C" },
      { label: "Data Retention", value: "> 10 years (no battery required)" },
    ],
    buyerNotes: [
      "EM4200 has a 128-bit UID (double the 64-bit EM4100), greatly reducing collision risk in large deployments.",
      "Read-only and factory-locked — cannot be cloned to another EM4200, but a T5577 can emulate its output.",
      "Pin-compatible upgrade from EM4100 — same readers and antennas work without hardware changes.",
      "Best suited for deployments > 100,000 cards where EM4100's 64-bit namespace may produce UID collisions.",
    ],
    applications: [
      "Large-scale access control (campuses, enterprise)",
      "Government-issued proximity ID cards",
      "Library patron identification",
    ],
    compatibility: "Drop-in replacement for EM4100 on any EM-Marine 125 kHz reader; the extended UID requires reader firmware that can process 128-bit IDs.",
  },

  // -----------------------------------------------------------------------
  // 8. EM4305 Card
  // -----------------------------------------------------------------------
  "/product/em4305-card/": {
    specs: [
      { label: "Chip", value: "EM4305 (EM Microelectronic)" },
      { label: "Operating Frequency", value: "125 kHz (LF)" },
      { label: "Protocol", value: "EM modulation (Manchester / Biphase)" },
      { label: "Memory", value: "512-bit EEPROM (15 × 32-bit user words)" },
      { label: "Read/Write", value: "Read/write with password protection (32-bit write password)" },
      { label: "Read Range", value: "3–10 cm" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Material", value: "PVC" },
      { label: "Operating Temperature", value: "−40 °C to +85 °C" },
      { label: "Write Endurance", value: "100,000 cycles" },
      { label: "Data Retention", value: "> 10 years" },
    ],
    buyerNotes: [
      "512-bit user memory allows encoding custom data beyond a simple UID — useful for storing facility codes or user metadata.",
      "32-bit write password prevents unauthorized re-programming; however, the RF interface is unencrypted.",
      "Can emulate EM4100/EM4200 output format for backward compatibility while adding write capability.",
      "Less common than T5577 — verify your encoder/writer supports EM4305 before specifying at scale.",
    ],
    applications: [
      "Re-writable access control credentials",
      "Animal identification (ISO 11784/11785 compliant)",
      "Industrial asset tagging with updatable data",
    ],
    compatibility: "Compatible with EM-Marine 125 kHz readers; re-write requires an EM4305-capable programmer (e.g., EM4095-based encoder).",
  },

  // -----------------------------------------------------------------------
  // 9. FeliCa Card
  // -----------------------------------------------------------------------
  "/product/felica-card/": {
    specs: [
      { label: "Chip", value: "Sony FeliCa Standard / FeliCa Lite-S (RC-S966/RC-S711)" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "JIS X 6319-4 (FeliCa), ISO 18092 (NFC-F / Type 3 Tag)" },
      { label: "Memory", value: "FeliCa Standard: up to 32 KB; FeliCa Lite-S: 224 bytes" },
      { label: "Transaction Speed", value: "< 0.1 seconds (212 kbps / 424 kbps)" },
      { label: "Encryption", value: "FeliCa Standard: Triple DES mutual authentication; Lite-S: MAC-based one-way authentication" },
      { label: "Read Range", value: "2–5 cm" },
      { label: "Dimensions", value: "85.6 × 54 × 0.76 mm (CR80, ISO 7810)" },
      { label: "Operating Temperature", value: "−20 °C to +60 °C" },
      { label: "Data Retention", value: "> 10 years" },
    ],
    buyerNotes: [
      "FeliCa dominates transit systems in Japan (Suica, PASMO), Hong Kong (Octopus), and Singapore (EZ-Link).",
      "FeliCa Lite-S is lower cost and sufficient for loyalty/membership; Standard is required for stored-value e-money.",
      "NFC-F (Type 3) is natively supported by all NFC-enabled smartphones for tap-to-read applications.",
      "FeliCa uses a proprietary crypto system — keys and system codes must be registered with Sony/FeliCa Networks.",
    ],
    applications: [
      "Public transit fare collection (Suica, Octopus, EZ-Link)",
      "Electronic money / stored-value payments",
      "University campus cards (Japan)",
      "Corporate cafeteria and vending machine payments",
    ],
    compatibility: "Requires FeliCa-compatible readers (Sony RC-S380, PaSoRi); supported by NFC-F on Android and iOS for reading.",
  },

  // -----------------------------------------------------------------------
  // 10. Google Review NFC Card
  // -----------------------------------------------------------------------
  "/product/google-review-nfc-card/": {
    specs: [
      { label: "Chip Options", value: "NTAG213 (144 bytes) or NTAG215 (504 bytes)" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A, NFC Forum Type 2 Tag" },
      { label: "Pre-Programmed Data", value: "NDEF URL record redirecting to Google Review page" },
      { label: "URL Encoding", value: "Locked NDEF record — tamper-proof, cannot be overwritten" },
      { label: "Read Range", value: "1–4 cm (phone tap)" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Printing", value: "Full CMYK offset or digital print, custom branding both sides" },
      { label: "Material", value: "PVC with matte or gloss lamination" },
    ],
    buyerNotes: [
      "Each card is pre-encoded with your specific Google Maps Place ID URL — provide your Google Business listing link at order.",
      "NTAG213 is sufficient for a single URL redirect; choose NTAG215 only if encoding additional NDEF records.",
      "NDEF lock bit is set after programming to prevent accidental or malicious overwriting by customers.",
      "Works with any NFC-enabled smartphone (iPhone XS+ / Android 5.0+) — no app install required.",
    ],
    applications: [
      "Restaurant and retail review collection",
      "Service-business reputation management",
      "Hotel and hospitality guest feedback",
    ],
    compatibility: "Tap-compatible with all NFC-enabled smartphones (iOS 13+ for background NDEF, Android 5.0+ for native NFC).",
  },

  // -----------------------------------------------------------------------
  // 11. HITAG 2 Card
  // -----------------------------------------------------------------------
  "/product/hitag-2-card/": {
    specs: [
      { label: "Chip", value: "HITAG 2 (NXP Semiconductors, PCF7936)" },
      { label: "Operating Frequency", value: "125 kHz (LF)" },
      { label: "Protocol", value: "Proprietary HITAG air interface" },
      { label: "Memory", value: "256-bit (8 × 32-bit pages), 2 pages user data" },
      { label: "Encryption", value: "48-bit proprietary stream cipher with mutual authentication" },
      { label: "Read Range", value: "3–10 cm" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Material", value: "PVC" },
      { label: "Operating Temperature", value: "−40 °C to +85 °C" },
      { label: "Data Retention", value: "> 10 years" },
    ],
    buyerNotes: [
      "HITAG 2 encryption has been publicly broken (2008/2012 academic attacks) — do NOT use for new high-security deployments.",
      "Still widely used in automotive immobilizers and legacy access control systems requiring backward compatibility.",
      "Replacement for legacy HITAG 1 (plain-text) installations that need an encryption upgrade path.",
      "Consider migrating to HITAG-AES or MIFARE DESFire for new projects requiring modern cryptography.",
    ],
    applications: [
      "Automotive immobilizer systems (legacy)",
      "Legacy encrypted access control",
      "Industrial machine authentication",
    ],
    compatibility: "Requires HITAG 2-compatible readers (NXP HITAG reader ICs); not compatible with standard EM-Marine or HID readers.",
  },

  // -----------------------------------------------------------------------
  // 12. Hotel Key Cards
  // -----------------------------------------------------------------------
  "/product/hotel-key-cards/": {
    specs: [
      { label: "Chip Options", value: "MIFARE Classic 1K (MF1S50), MIFARE Classic 4K (MF1S70), MIFARE DESFire EV2/EV3" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A" },
      { label: "Memory", value: "Classic 1K: 1024 bytes / 16 sectors; Classic 4K: 4096 bytes / 40 sectors; DESFire: 2–8 KB" },
      { label: "Read Range", value: "2–5 cm (optimized for door lock proximity)" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Material", value: "PVC with matte/gloss lamination, custom hotel branding" },
      { label: "Printing", value: "Full CMYK offset/digital, UV spot, foil stamping available" },
      { label: "Operating Temperature", value: "−20 °C to +55 °C" },
      { label: "Durability", value: "Rated for 500+ insertion cycles in compatible lock encoders" },
    ],
    buyerNotes: [
      "Verify your lock system brand (Assa Abloy/VingCard, Salto, Onity/Allegion, KABA) — each uses specific chip types and encoding formats.",
      "MIFARE Classic 1K is the most common for Assa Abloy VingCard and Onity locks; DESFire is required for newer Salto XS4 systems.",
      "Magnetic stripe overlay is available for backward compatibility with legacy magstripe lock systems.",
      "Custom key card sleeves with Wi-Fi login, room info, and hotel branding are available as an add-on.",
    ],
    applications: [
      "Hotel and resort guest room access",
      "Elevator and floor-level access control",
      "Spa, gym, and amenity area access",
      "Resort cashless payment integration",
    ],
    compatibility: "Compatible with Assa Abloy VingCard, Salto, Onity, dormakaba, and ASSA ABLOY Hospitality lock systems (chip-dependent).",
  },

  // -----------------------------------------------------------------------
  // 13. Inkjet PVC ID Card
  // -----------------------------------------------------------------------
  "/product/inkjet-pvc-id-card/": {
    specs: [
      { label: "Chip Options", value: "Available blank (no chip) or with embedded RFID (MIFARE Classic 1K, NTAG213, etc.)" },
      { label: "Material", value: "PVC with inkjet-receptive microporous coating (both sides)" },
      { label: "Dimensions", value: "85.6 × 54 × 0.76 mm (CR80, ISO 7810)" },
      { label: "Print Resolution", value: "Up to 5760 × 1440 dpi (printer-dependent)" },
      { label: "Ink Compatibility", value: "Dye-based inkjet inks (Epson, Canon PVC tray printers)" },
      { label: "Drying Time", value: "~30 seconds for handling; 2+ hours for full cure" },
      { label: "Print Area", value: "Full-bleed both sides via PVC card tray" },
      { label: "Surface Finish", value: "Glossy inkjet-receptive coating" },
      { label: "Operating Temperature", value: "−20 °C to +55 °C" },
    ],
    buyerNotes: [
      "Requires a printer with a PVC card tray (Epson L805/L810/L850, Canon G-series with tray) — not for standard paper feed.",
      "Inkjet-printed cards are less durable than dye-sublimation — apply a clear laminate overlay for abrasion resistance.",
      "Cost-effective for small runs (< 500 cards); for larger volumes, professional offset or dye-sub printing is more economical.",
      "Available with or without embedded RFID chip — specify chip type if combining print-at-home convenience with RFID functionality.",
    ],
    applications: [
      "Small-office ID badge printing",
      "School and club membership cards",
      "Prototype and sample card runs",
    ],
    compatibility: "Works with Epson L-series (L805, L810, L850, L8050) and Canon G-series printers equipped with a PVC card printing tray.",
  },

  // -----------------------------------------------------------------------
  // 14. Java Card
  // -----------------------------------------------------------------------
  "/product/java-card/": {
    specs: [
      { label: "Chip Options", value: "NXP JCOP 4 P71, Infineon SLE78, Thales (Gemalto) IDPrime" },
      { label: "Operating System", value: "Java Card 3.0.5 / GlobalPlatform 2.3" },
      { label: "Contact Interface", value: "ISO 7816 (T=0, T=1)" },
      { label: "Contactless Interface", value: "ISO 14443 Type A, 13.56 MHz (dual-interface)" },
      { label: "Crypto Engine", value: "RSA 2048/4096, ECC P-256/P-384/P-521, AES-128/256, SHA-256/384/512, 3DES" },
      { label: "Memory", value: "144–400 KB EEPROM (chip-dependent)" },
      { label: "Certifications", value: "CC EAL5+ / EAL6+, FIPS 140-2 Level 3 (chip-dependent)" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Operating Temperature", value: "−25 °C to +85 °C" },
      { label: "Data Retention", value: "> 25 years" },
    ],
    buyerNotes: [
      "Java Card allows loading custom applets post-issuance — multiple applications (PKI, payment, access) on a single card.",
      "GlobalPlatform Secure Channel Protocol (SCP02/SCP03) manages applet lifecycle and key provisioning.",
      "Specify required certifications (CC, FIPS, EMVCo) early — they constrain chip and OS selection.",
      "JCOP 4 P71 is the most widely deployed chip for government eID and banking programs worldwide.",
    ],
    applications: [
      "Government eID and ePassport programs",
      "Banking EMV payment cards",
      "Corporate PKI / digital signature",
      "Telecom SIM/USIM cards",
    ],
    compatibility: "Supported by all GlobalPlatform-compliant card management systems; dual-interface works with ISO 7816 contact and ISO 14443A contactless readers.",
  },

  // -----------------------------------------------------------------------
  // 15. LEGIC Card
  // -----------------------------------------------------------------------
  "/product/legic-card/": {
    specs: [
      { label: "Chip Options", value: "LEGIC Prime MIM256/MIM1024, LEGIC Advant ATC2048/ATC4096" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "Proprietary LEGIC RF Standard (Prime); ISO 14443A (Advant)" },
      { label: "Memory", value: "Prime MIM256: 256 bytes; MIM1024: 1024 bytes; Advant ATC4096: 4096 bytes" },
      { label: "Encryption", value: "Prime: proprietary LEGIC encryption; Advant: AES-128, 3DES" },
      { label: "Read Range", value: "2–5 cm" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Material", value: "PVC" },
      { label: "Operating Temperature", value: "−25 °C to +70 °C" },
      { label: "Data Retention", value: "> 10 years" },
    ],
    buyerNotes: [
      "LEGIC is a proprietary ecosystem — cards and readers must be sourced through LEGIC-authorized partners.",
      "LEGIC Prime is legacy; Advant supports ISO 14443A and allows multi-application (access + time/attendance + cashless vending).",
      "Commonly deployed with dormakaba (formerly KABA) and other LEGIC-ecosystem lock and reader hardware.",
      "Master-token authorization model: system master cards control which reader groups a credential can access.",
    ],
    applications: [
      "Corporate campus access (dormakaba/KABA systems)",
      "Multi-application facility management (access + cafeteria + printing)",
      "Government and defense installations (LEGIC-ecosystem)",
    ],
    compatibility: "Requires LEGIC-certified readers and infrastructure (dormakaba, Interflex, PCS); LEGIC Advant can coexist with ISO 14443A readers in hybrid mode.",
  },

  // -----------------------------------------------------------------------
  // 16. Metal NFC Card
  // -----------------------------------------------------------------------
  "/product/metal-nfc-card/": {
    specs: [
      { label: "Chip Options", value: "NTAG213 (144 bytes), NTAG216 (888 bytes)" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A, NFC Forum Type 2 Tag" },
      { label: "Card Body", value: "Stainless steel (304/316) or brass (nickel/gold/matte black plated)" },
      { label: "Dimensions", value: "85.6 × 54 × 0.8 mm (CR80) or custom shapes" },
      { label: "Weight", value: "~25 g (stainless steel); ~30 g (brass)" },
      { label: "NFC Antenna", value: "Ferrite-shielded inlay embedded in cutout or laminated to card surface" },
      { label: "Read Range", value: "1–3 cm (reduced vs. PVC due to metal shielding)" },
      { label: "Personalization", value: "Laser engraving, chemical etching, UV color printing, mirror polish" },
      { label: "Finishing Options", value: "Matte, brushed, mirror polish, PVD coating (gold, rose gold, black)" },
    ],
    buyerNotes: [
      "Metal body requires a ferrite barrier layer between NFC chip and metal — without it, the tag will not scan.",
      "Read range is shorter (1–3 cm) than PVC cards — instruct users to hold the card flat against the phone's NFC reader position.",
      "NTAG216 provides 888 bytes — enough for a URL, vCard, and social media links in a single NDEF message.",
      "Premium weight and finish create a luxury impression — popular for high-end business networking and VIP membership.",
    ],
    applications: [
      "Premium digital business cards",
      "VIP and luxury membership credentials",
      "High-end brand promotional cards",
    ],
    compatibility: "Tap-compatible with all NFC-enabled smartphones (iOS 13+ background read, Android 5.0+); no app required for NDEF URL/vCard.",
  },

  // -----------------------------------------------------------------------
  // 17. MIFARE 4K Card
  // -----------------------------------------------------------------------
  "/product/mifare-4k-card/": {
    specs: [
      { label: "Chip", value: "MIFARE Classic 4K (MF1S70, NXP Semiconductors)" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A (Type A)" },
      { label: "Memory", value: "4096 bytes — 40 sectors (32 × 4-block sectors + 8 × 16-block sectors), 256 blocks total" },
      { label: "UID", value: "4-byte NUID or 7-byte UID" },
      { label: "Encryption", value: "Crypto-1 (48-bit proprietary stream cipher)" },
      { label: "Read Range", value: "2–7 cm (reader-dependent)" },
      { label: "Data Transfer Rate", value: "106 kbps" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Operating Temperature", value: "−20 °C to +55 °C" },
      { label: "Write Endurance", value: "100,000 cycles" },
      { label: "Data Retention", value: "> 10 years" },
    ],
    buyerNotes: [
      "4× the memory of MIFARE Classic 1K — use when applications need to store data on-card (e.g., cashless purse + access + loyalty).",
      "Crypto-1 encryption is known to be vulnerable — suitable for moderate-security use but not recommended for payment or government ID.",
      "Backward compatible with MIFARE Classic 1K infrastructure — readers and software work with both card types.",
      "7-byte UID variants are recommended to avoid UID collision and support random-UID (NUID) detection in newer readers.",
    ],
    applications: [
      "Multi-application campus cards (access + cashless + library)",
      "Transit fare collection with stored-value purse",
      "Loyalty programs requiring on-card data storage",
      "Facility access with sector-separated credential zones",
    ],
    compatibility: "Compatible with all MIFARE Classic readers (NXP MFRC522, ACR122U, HID iCLASS SE in MIFARE mode); backward compatible with Classic 1K infrastructure.",
  },

  // -----------------------------------------------------------------------
  // 18. MIFARE Classic Card (1K)
  // -----------------------------------------------------------------------
  "/product/mifare-classic-card/": {
    specs: [
      { label: "Chip", value: "MIFARE Classic EV1 1K (MF1S50, NXP Semiconductors)" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A (Type A)" },
      { label: "Memory", value: "1024 bytes — 16 sectors × 4 blocks × 16 bytes (768 bytes usable after keys/access bits)" },
      { label: "UID", value: "4-byte NUID or 7-byte UID" },
      { label: "Encryption", value: "Crypto-1 (48-bit proprietary stream cipher)" },
      { label: "Read Range", value: "2–7 cm (reader-dependent)" },
      { label: "Data Transfer Rate", value: "106 kbps" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Operating Temperature", value: "−20 °C to +55 °C" },
      { label: "Write Endurance", value: "100,000 cycles" },
      { label: "Data Retention", value: "> 10 years" },
    ],
    buyerNotes: [
      "MIFARE Classic 1K is the world's most widely deployed contactless smart card — massive reader infrastructure already in place.",
      "Crypto-1 has known vulnerabilities (Darkside, nested attacks) — for high-security, consider MIFARE Plus (security level 3) or DESFire.",
      "EV1 revision adds originality check (NXP signature verification) to detect counterfeit cards.",
      "16 independently keyed sectors allow multi-tenant use — e.g., sector 1 for access, sector 2 for cashless, sector 3 for library.",
    ],
    applications: [
      "Building and office access control",
      "Public transit ticketing",
      "University campus multi-application cards",
      "Cashless vending and cafeteria payments",
    ],
    compatibility: "Works with all ISO 14443A MIFARE-compatible readers (NXP, HID, STMicroelectronics); the largest installed reader base of any contactless smart card.",
  },

  // -----------------------------------------------------------------------
  // 19. MIFARE DESFire Cards
  // -----------------------------------------------------------------------
  "/product/mifare-desfire-cards/": {
    specs: [
      { label: "Chip Options", value: "MIFARE DESFire EV1 (MF3ICD41/81), EV2 (MF3D(H)x2), EV3 (MF3D(H)x3)" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A (Type A), ISO 7816-4 APDU wrapping" },
      { label: "Memory Options", value: "2 KB, 4 KB, or 8 KB (chip-dependent)" },
      { label: "Encryption", value: "AES-128, 3DES (168-bit), 3K3DES; hardware crypto accelerator" },
      { label: "Authentication", value: "3-pass mutual authentication per application/file" },
      { label: "File System", value: "Flexible file types: Standard Data, Backup Data, Value, Linear/Cyclic Record, Transaction MAC" },
      { label: "Read Range", value: "2–7 cm" },
      { label: "Data Transfer Rate", value: "106 / 212 / 424 / 848 kbps" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Operating Temperature", value: "−25 °C to +70 °C" },
      { label: "Write Endurance", value: "500,000 cycles" },
    ],
    buyerNotes: [
      "DESFire is the security benchmark for contactless smart cards — AES-128 with hardware crypto replaces vulnerable Crypto-1.",
      "EV3 adds Secure Dynamic Messaging (SDM) for NFC phone interaction without a dedicated app — ideal for product authentication.",
      "Each application on the card has independent keys and access rights — true multi-application security isolation.",
      "Higher per-unit cost than MIFARE Classic, but essential for transit, government, and payment-grade deployments.",
    ],
    applications: [
      "Secure transit fare collection (EMV-compatible systems)",
      "Government employee and contractor badges",
      "Secure campus multi-application (access + payment + ID)",
      "Loyalty and membership with anti-counterfeiting",
    ],
    compatibility: "Compatible with all ISO 14443A readers; optimal performance with DESFire-aware readers (NXP CLRC663, HID iCLASS SE, OMNIKEY 5x2x).",
  },

  // -----------------------------------------------------------------------
  // 20. MIFARE DESFire EV2 Cards
  // -----------------------------------------------------------------------
  "/product/mifare-desfire-ev2-cards/": {
    specs: [
      { label: "Chip", value: "MIFARE DESFire EV2 (MF3D(H)x2, NXP Semiconductors)" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A (Type A), ISO 7816-4 APDU wrapping" },
      { label: "Memory Options", value: "2 KB (MF3DH22), 4 KB (MF3DH42), 8 KB (MF3DH82)" },
      { label: "Encryption", value: "AES-128 (hardware accelerated), 3DES, 3K3DES" },
      { label: "Authentication", value: "EV2 mutual authentication with PACE (Proximity Aware Chip Emulation) anti-relay" },
      { label: "File System", value: "Up to 28 applications, each with up to 32 files" },
      { label: "Transaction MAC", value: "Cryptographic transaction verification for audit trail" },
      { label: "Read Range", value: "2–7 cm" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Operating Temperature", value: "−25 °C to +70 °C" },
      { label: "Write Endurance", value: "500,000 cycles" },
      { label: "Data Retention", value: "> 10 years" },
    ],
    buyerNotes: [
      "EV2 introduces Proximity Check (PACE) to detect and prevent relay attacks — critical for access control and payment.",
      "Transaction MAC files provide cryptographic proof of every transaction — enables offline audit and fraud detection.",
      "Multi-application file system supports up to 28 isolated applications, each with independent AES key sets.",
      "Backward compatible with DESFire EV1 infrastructure while adding EV2-specific security features when readers support them.",
    ],
    applications: [
      "High-security government and defense access control",
      "Transit systems requiring relay-attack protection",
      "Multi-operator transit (interoperable fare media)",
      "Corporate badge with secure audit trail",
    ],
    compatibility: "Backward compatible with DESFire EV1 readers; EV2-specific features (PACE, Transaction MAC) require EV2-aware reader firmware.",
  },

  // -----------------------------------------------------------------------
  // 21. MIFARE Plus Card
  // -----------------------------------------------------------------------
  "/product/mifare-plus-card/": {
    specs: [
      { label: "Chip Options", value: "MIFARE Plus EV1 (MF1PLUS60/80), MIFARE Plus EV2" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A (Type A)" },
      { label: "Memory", value: "2 KB or 4 KB (organized in MIFARE Classic-compatible sector structure)" },
      { label: "Security Levels", value: "Level 0 (factory), Level 1 (MIFARE Classic compatible), Level 2 (AES auth, Classic data format), Level 3 (full AES)" },
      { label: "Encryption", value: "AES-128 (Security Level 2/3); Crypto-1 backward compatibility (Level 1)" },
      { label: "Read Range", value: "2–7 cm" },
      { label: "Data Transfer Rate", value: "106 / 212 / 424 / 848 kbps (at Security Level 3)" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Operating Temperature", value: "−25 °C to +70 °C" },
      { label: "Write Endurance", value: "200,000 cycles" },
      { label: "Data Retention", value: "> 10 years" },
    ],
    buyerNotes: [
      "Designed as a drop-in migration path from MIFARE Classic to AES security — same sector/block structure, upgraded crypto.",
      "Security Level 1 lets Plus cards work on existing Classic infrastructure immediately; upgrade readers later for Level 3.",
      "Phased migration: deploy Plus cards in Level 1, then switch readers to Level 3 sector-by-sector — no card swap needed.",
      "EV2 adds Proximity Check to prevent relay attacks — important for high-security deployments.",
    ],
    applications: [
      "MIFARE Classic-to-AES migration projects",
      "Transit systems upgrading security without replacing cards",
      "Access control with phased security enhancement",
      "Multi-building campuses with mixed-generation readers",
    ],
    compatibility: "Level 1: works on all MIFARE Classic readers; Level 2/3: requires AES-capable readers (NXP CLRC663, HID iCLASS SE R40).",
  },

  // -----------------------------------------------------------------------
  // 22. NFC Business Card
  // -----------------------------------------------------------------------
  "/product/nfc-business-card/": {
    specs: [
      { label: "Chip Options", value: "NTAG213 (144 bytes), NTAG215 (504 bytes), NTAG216 (888 bytes)" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A, NFC Forum Type 2 Tag" },
      { label: "Pre-Programmed Data", value: "NDEF URL record to digital profile (vCard, Popl, Linktree, custom landing page)" },
      { label: "Material Options", value: "PVC, metal (stainless steel/brass), bamboo, walnut, recycled plastic" },
      { label: "Dimensions", value: "85.6 × 54 mm (CR80) or custom die-cut shapes" },
      { label: "Personalization", value: "Laser engraving, UV printing, foil stamping, QR code backup" },
      { label: "Read Range", value: "PVC: 2–4 cm; Metal: 1–3 cm; Wood: 2–4 cm" },
    ],
    buyerNotes: [
      "NTAG213 is sufficient for a single URL redirect; NTAG216 for full vCard with photo, multiple social links, and fallback URL.",
      "Metal cards require ferrite shielding — verify NFC tap zone is clearly marked for consistent read performance.",
      "Include a printed QR code as fallback for phones with NFC disabled or older devices without NFC.",
      "URL-based profiles (Popl, Linktree, HiHello) allow updating contact info without reprogramming the card.",
    ],
    applications: [
      "Professional networking and contact sharing",
      "Real estate agent and sales team cards",
      "Executive and C-suite premium cards",
    ],
    compatibility: "Works with all NFC-enabled smartphones (iPhone XS and later, Android 5.0+); no app required for URL/vCard NDEF.",
  },

  // -----------------------------------------------------------------------
  // 23. NFC Cards (General)
  // -----------------------------------------------------------------------
  "/product/nfc-cards/": {
    specs: [
      { label: "Chip Options", value: "NTAG213/215/216, MIFARE Ultralight EV1, MIFARE Ultralight C, ICODE SLIX" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A (NTAG/MIFARE) or ISO 15693 (ICODE), NFC Forum Type 2/5 Tag" },
      { label: "Memory", value: "NTAG213: 144 bytes; NTAG215: 504 bytes; NTAG216: 888 bytes; Ultralight EV1: 48/128 bytes" },
      { label: "UID", value: "7-byte unique serial number (factory-set)" },
      { label: "Read Range", value: "2–5 cm" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Material", value: "PVC, with optional custom printing" },
      { label: "Operating Temperature", value: "−20 °C to +55 °C" },
      { label: "Write Endurance", value: "NTAG: 100,000 cycles; Ultralight EV1: 100,000 cycles" },
    ],
    buyerNotes: [
      "NTAG213 is the sweet spot for URL/URI NFC applications — 144 bytes is enough for any standard URL.",
      "NTAG215 is the required chip for Nintendo Amiibo cloning/NFC figurine projects (504 bytes).",
      "MIFARE Ultralight EV1 is optimized for single-use transit tickets and event passes — lowest per-unit cost.",
      "All NTAGs support NDEF lock bits and password-based access control (32-bit password, 16-bit pack).",
    ],
    applications: [
      "Marketing and smart poster tap-to-URL campaigns",
      "Contactless loyalty and rewards cards",
      "Event and conference NFC badges",
      "Smart product authentication tags",
    ],
    compatibility: "Compatible with all NFC-enabled smartphones and ISO 14443A readers; ICODE SLIX requires ISO 15693 reader support.",
  },

  // -----------------------------------------------------------------------
  // 24. Printed RFID Cards
  // -----------------------------------------------------------------------
  "/product/printed-rfid-cards/": {
    specs: [
      { label: "Chip Options", value: "Any LF (125 kHz) or HF (13.56 MHz) chip — MIFARE, NTAG, DESFire, EM4100, T5577, etc." },
      { label: "Printing Methods", value: "Offset lithography, digital (CMYK), UV flatbed, screen printing, dye-sublimation" },
      { label: "Print Quality", value: "Offset: 300+ LPI; Digital: 600–1200 dpi; UV: 720–1440 dpi" },
      { label: "Print Sides", value: "Full CMYK both sides (4/4), or front-only (4/0)" },
      { label: "Finishing Options", value: "Matte/gloss lamination, spot UV, foil stamping (gold/silver/holographic), embossing" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Material", value: "PVC core with RFID inlay lamination" },
      { label: "Variable Data", value: "Sequential numbering, UID printing, barcode/QR code, photo personalization" },
      { label: "Minimum Order", value: "Offset: 500+ cards; Digital/UV: 1+ cards (no minimum)" },
    ],
    buyerNotes: [
      "Offset printing is most cost-effective for runs of 1,000+ cards; digital printing is better for short runs or variable-data jobs.",
      "Chip placement affects print layout — avoid heavy ink coverage directly over the antenna to prevent delamination.",
      "Request a print-ready template from the manufacturer to ensure artwork aligns with chip and antenna position.",
      "Spot UV and foil stamping add premium look but increase lead time by 2–3 days.",
    ],
    applications: [
      "Branded employee and contractor ID badges",
      "Membership and loyalty cards with brand identity",
      "Event credentials with sponsor branding",
      "Retail gift cards with embedded RFID",
    ],
    compatibility: "Any chip can be embedded — printing process does not affect RF performance when manufactured with proper inlay lamination.",
  },

  // -----------------------------------------------------------------------
  // 25. RFID Paper Card
  // -----------------------------------------------------------------------
  "/product/rfid-paper-card/": {
    specs: [
      { label: "Chip Options", value: "MIFARE Ultralight EV1, NTAG213, MIFARE Classic 1K, ICODE SLIX" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A (MIFARE/NTAG) or ISO 15693 (ICODE)" },
      { label: "Material", value: "Coated cardstock (300–400 gsm) with embedded RFID inlay" },
      { label: "Dimensions", value: "85.6 × 54 mm (CR80) or custom sizes (e.g., transit ticket format)" },
      { label: "Thickness", value: "0.6–0.8 mm" },
      { label: "Read Range", value: "2–5 cm" },
      { label: "Printing", value: "Offset or thermal printing on paper surface" },
      { label: "Environmental", value: "Recyclable paper substrate (chip/antenna are not recyclable)" },
      { label: "Durability", value: "Limited — suitable for short-term use (days to months, not years)" },
    ],
    buyerNotes: [
      "Significantly lower cost than PVC cards — ideal for single-use or short-duration applications (events, transit tickets).",
      "MIFARE Ultralight EV1 is the standard chip for disposable transit tickets (used in London Oyster, Moscow Metro).",
      "Paper substrate is not waterproof — apply a thin PE coating if cards may be exposed to moisture.",
      "Not compatible with card printers designed for PVC (Fargo, Evolis) — use thermal or offset press printing.",
    ],
    applications: [
      "Single-use transit tickets",
      "Event and conference day passes",
      "Theme park and attraction entry tickets",
      "Disposable hospital patient wristband cards",
    ],
    compatibility: "Works with all standard ISO 14443A or ISO 15693 readers — same chip performance as PVC cards despite paper body.",
  },

  // -----------------------------------------------------------------------
  // 26. T5577 Card
  // -----------------------------------------------------------------------
  "/product/t5577-card/": {
    specs: [
      { label: "Chip", value: "T5577 (Atmel/Microchip ATA5577)" },
      { label: "Operating Frequency", value: "125 kHz (LF), configurable 100–150 kHz" },
      { label: "Protocol", value: "Configurable: EM4100, HID ProxII, Indala, AWID, GProx, Pyramid, and more" },
      { label: "Memory", value: "330-bit EEPROM (8 × 33-bit blocks, 7 user blocks + 1 config block)" },
      { label: "Read/Write", value: "Read/write with optional 32-bit password protection" },
      { label: "Multi-Protocol Emulation", value: "Can emulate 10+ LF card formats by changing modulation and data rate config" },
      { label: "Read Range", value: "3–10 cm" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80, ISO 7810)" },
      { label: "Operating Temperature", value: "−40 °C to +85 °C" },
      { label: "Write Endurance", value: "100,000 cycles" },
      { label: "Data Retention", value: "> 10 years" },
    ],
    buyerNotes: [
      "T5577 is the universal LF cloning card — a single card can emulate virtually any 125 kHz credential format.",
      "Set the 32-bit password after programming to prevent unauthorized re-writing of your credential data.",
      "Configuration block controls modulation (Manchester, PSK, FSK, Biphase), data rate, and protocol — powerful but complex.",
      "Widely used by locksmiths and security professionals for key duplication and system testing.",
    ],
    applications: [
      "125 kHz credential cloning and duplication",
      "Multi-site access with different LF formats",
      "Security audit and penetration testing",
      "System migration testing (emulate source format before hardware swap)",
    ],
    compatibility: "Can emulate credentials for HID ProxPoint, Indala, AWID, EM-Marine, and most other 125 kHz reader systems through protocol configuration.",
  },

  // -----------------------------------------------------------------------
  // 27. Wooden RFID Card
  // -----------------------------------------------------------------------
  "/product/wooden-rfid-card/": {
    specs: [
      { label: "Chip Options", value: "NTAG213 (144 bytes), NTAG216 (888 bytes), MIFARE Classic 1K" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A, NFC Forum Type 2 Tag (NTAG)" },
      { label: "Wood Species", value: "Bamboo, walnut, cherry, maple, beech" },
      { label: "Dimensions", value: "85.6 × 54 × 0.84 mm (CR80) or custom thickness up to 2 mm" },
      { label: "Weight", value: "~5–8 g (lighter than PVC)" },
      { label: "Personalization", value: "Laser engraving (both sides), UV direct printing, silk screen" },
      { label: "NFC Inlay", value: "Embedded between wood veneer layers with adhesive lamination" },
      { label: "Read Range", value: "2–5 cm (wood is RF-transparent)" },
      { label: "Surface Treatment", value: "Clear lacquer or oil finish for moisture resistance" },
    ],
    buyerNotes: [
      "Wood is RF-transparent (unlike metal), so NFC performance is equivalent to PVC — no ferrite shielding needed.",
      "Natural wood grain means every card is visually unique — set client expectations for color/pattern variation.",
      "Bamboo is the most durable and moisture-resistant wood option; walnut and cherry offer richer aesthetics.",
      "Laser engraving produces high-contrast permanent marking without ink — ideal for logos, text, and QR codes.",
    ],
    applications: [
      "Eco-friendly business cards",
      "Boutique hotel and resort key cards",
      "Membership cards for sustainability-focused brands",
      "Promotional and gift cards with natural aesthetic",
    ],
    compatibility: "Works with all NFC-enabled smartphones and ISO 14443A readers; wood does not interfere with RF signal.",
  },

  // -----------------------------------------------------------------------
  // RFID Tags
  // -----------------------------------------------------------------------

  // 28. MIFARE DESFire Tag
  "/product/desfire-tag/": {
    specs: [
      { label: "Chip Options", value: "MIFARE DESFire EV1, EV2, EV3" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A, ISO 7816-4 (T=CL)" },
      { label: "Memory", value: "EV1: 2 KB/4 KB/8 KB; EV2/EV3: 2 KB/4 KB/8 KB with enhanced file structure" },
      { label: "Security", value: "AES-128, 3DES/3K3DES encryption; EV2/EV3 add proximity check and Transaction MAC" },
      { label: "Housing", value: "ABS disc (30 mm, 35 mm, 50 mm diameters) or epoxy drop (various shapes)" },
      { label: "Mounting", value: "Adhesive backing, screw hole, or cable-tie slot (model-dependent)" },
      { label: "Read Range", value: "1–5 cm (housing-dependent)" },
      { label: "IP Rating", value: "IP65–IP68 (ABS housing), epoxy: splash-resistant" },
      { label: "Operating Temperature", value: "−25 °C to +85 °C" },
    ],
    buyerNotes: [
      "DESFire EV3 is recommended for new deployments — adds Secure Dynamic Messaging (SDM) for cloud-based authentication without reader-side SAM modules.",
      "Tag-format DESFire is ideal when card form factor is impractical: asset tracking on equipment, bin tagging, outdoor furniture.",
      "ABS disc tags with screw holes provide permanent, tamper-resistant mounting on metal or plastic surfaces (use ferrite pad on metal).",
      "Confirm application selection (AID) and file structure with your system integrator before bulk ordering pre-programmed tags.",
    ],
    applications: [
      "Industrial asset management and tracking",
      "Waste bin identification for smart city collection",
      "Secure access control for non-card form factors",
    ],
    compatibility: "Compatible with all ISO 14443A readers and NFC smartphones; fully supported by NXP MIFARE SDK, BALTECH, and HID iCLASS SE platforms.",
  },

  // 29. PPS RFID Laundry Tag
  "/product/pps-rfid-laundry-tag/": {
    specs: [
      { label: "Chip Options", value: "NXP UCODE 8, Impinj Monza R6 (UHF); NXP ICODE SLIX, MIFARE Classic 1K (HF)" },
      { label: "Operating Frequency", value: "13.56 MHz (HF) or 860–960 MHz (UHF), model-dependent" },
      { label: "Housing Material", value: "PPS (polyphenylene sulfide) — industrial-grade thermoplastic" },
      { label: "Dimensions", value: "Typical: 22 × 11 × 2.5 mm (button) or 70 × 15 × 3 mm (bar)" },
      { label: "Wash Durability", value: "200+ industrial wash cycles at up to 180 °C" },
      { label: "Chemical Resistance", value: "Resistant to bleach, perchloroethylene, alkaline detergents" },
      { label: "Press/Iron Resistance", value: "Withstands tunnel finisher press up to 195 °C" },
      { label: "Read Range", value: "HF: 2–5 cm; UHF: 1–3 m" },
      { label: "Weight", value: "1.5–5 g (size-dependent)" },
      { label: "IP Rating", value: "IP68" },
    ],
    buyerNotes: [
      "PPS is the premium laundry tag material — choose it for healthcare, hospitality, and uniform rental where 200+ wash cycles at high temps are required.",
      "UHF models enable bulk reading (300+ garments/minute on conveyor) vs. HF which requires individual scanning.",
      "Attach via heat-seal pouch, sew-in pocket, or direct sewing; heat-seal is fastest for mass deployment.",
      "Order sample quantities first and test through 10 wash cycles on your specific fabric and wash chemistry before committing to bulk.",
    ],
    applications: [
      "Commercial laundry inventory tracking",
      "Hospital linen and surgical textile management",
      "Uniform rental and tracking programs",
      "Cleanroom garment lifecycle management",
    ],
    compatibility: "UHF models work with Impinj, Zebra, and Alien fixed readers; HF models with any ISO 15693 or ISO 14443A reader.",
  },

  // 30. RFID Laundry Tags (General)
  "/product/rfid-laundry-tags/": {
    specs: [
      { label: "Chip Options", value: "HF: ICODE SLIX, MIFARE Classic 1K; UHF: Impinj Monza R6, NXP UCODE 8/9" },
      { label: "Operating Frequency", value: "13.56 MHz (HF) or 860–960 MHz (UHF)" },
      { label: "Housing Options", value: "PPS button, silicone bar, textile patch, heat-seal pouch" },
      { label: "Size Range", value: "Button: Ø 16–22 mm; Bar: 50–70 × 10–15 mm; Patch: 40 × 30 mm" },
      { label: "Wash Durability", value: "PPS: 200+ cycles at 180 °C; Silicone: 150+ cycles at 85 °C; Textile: 50+ cycles at 60 °C" },
      { label: "Read Range", value: "HF: 1–5 cm; UHF: 0.5–5 m (antenna/housing dependent)" },
      { label: "Attachment", value: "Sew-in, heat-seal, snap-rivet, or adhesive-backed pouch" },
      { label: "Operating Temperature", value: "−25 °C to +200 °C (PPS); −40 °C to +120 °C (silicone)" },
    ],
    buyerNotes: [
      "Match housing material to your wash process: PPS for industrial tunnel washers (180 °C+), silicone for standard commercial (85 °C), textile for retail/home laundering.",
      "UHF is strongly preferred for high-volume commercial laundries — enables conveyor-speed bulk reads without line-of-sight.",
      "Button-style tags are least intrusive for garments but bar-style tags offer longer UHF read range.",
      "Budget 3–5% tag replacement per year due to mechanical damage, not chip failure — factor this into TCO calculations.",
    ],
    applications: [
      "Commercial laundry sorting and inventory",
      "Hotel and hospitality linen tracking",
      "Healthcare textile management and compliance",
      "Uniform lifecycle and loss-prevention programs",
    ],
    compatibility: "Compatible with major laundry management systems including Datamars, Positek, RFID4U, and custom ERP integrations via RAIN RFID or ISO 15693.",
  },

  // 31. RFID Silicone Laundry Tag
  "/product/rfid-silicone-laundry-tag/": {
    specs: [
      { label: "Chip Options", value: "NXP ICODE SLIX (HF), Impinj Monza R6-P (UHF), Alien Higgs-3 (UHF)" },
      { label: "Operating Frequency", value: "13.56 MHz (HF) or 860–960 MHz (UHF)" },
      { label: "Housing Material", value: "Medical/food-grade silicone rubber" },
      { label: "Dimensions", value: "Typical: 65 × 15 × 3.5 mm (bar) or Ø 22 × 3 mm (disc)" },
      { label: "Wash Durability", value: "150+ commercial wash cycles at up to 85 °C" },
      { label: "Flexibility", value: "Fully flexible — conforms to garment folds without cracking" },
      { label: "Read Range", value: "HF: 1–3 cm; UHF: 0.5–3 m" },
      { label: "Chemical Resistance", value: "Resistant to standard laundry detergents and mild bleach solutions" },
      { label: "Weight", value: "2–4 g" },
    ],
    buyerNotes: [
      "Silicone tags are softer and more garment-friendly than PPS — preferred for guest-facing textiles where wearer comfort matters (hotel bathrobes, spa towels).",
      "Max temperature is 85 °C — not suitable for industrial tunnel washers. Use PPS tags for temperatures above 100 °C.",
      "Flexible silicone survives tumble drying and folding machinery better than rigid tags, reducing mechanical failure rates.",
      "Available in multiple colors for visual sorting by department, fabric type, or customer account.",
    ],
    applications: [
      "Hotel and spa towel/linen tracking",
      "Corporate uniform rental programs",
      "Fitness center towel management",
    ],
    compatibility: "Works with all standard ISO 15693 (HF) and RAIN RFID / ISO 18000-63 (UHF) readers and laundry management software.",
  },

  // 32. RFID Tag with LED Light
  "/product/rfid-tag-with-led-light/": {
    specs: [
      { label: "Chip", value: "Impinj Monza R6 or NXP UCODE 8 (UHF, passive)" },
      { label: "Operating Frequency", value: "860–960 MHz (UHF, RAIN RFID)" },
      { label: "Protocol", value: "ISO 18000-63 (EPC Gen2v2)" },
      { label: "LED Activation", value: "LED illuminates when tag is energized by UHF reader RF field" },
      { label: "LED Color", value: "Red, green, blue, or white (model-dependent)" },
      { label: "Power Source", value: "Passive — LED powered by harvested RF energy, no battery required" },
      { label: "Read Range", value: "1–5 m (LED activation range may be shorter than data read range)" },
      { label: "Dimensions", value: "Varies: card-size (85 × 54 mm) or label format (70 × 25 mm)" },
      { label: "Operating Temperature", value: "−20 °C to +65 °C" },
    ],
    buyerNotes: [
      "LED blinks when the tag receives sufficient RF energy — enables visual item location in warehouses, stockrooms, and filing cabinets.",
      "LED activation range is typically 30–50% shorter than data read range; position readers accordingly for visual-search use cases.",
      "No battery means unlimited shelf life and zero maintenance — LED brightness decreases with distance from reader antenna.",
      "Ideal for pick-to-light applications where staff need to visually locate a specific tagged item among many.",
    ],
    applications: [
      "Warehouse pick-to-light item location",
      "IT asset and cable identification",
      "File and document retrieval in archives",
      "Retail stockroom search and inventory",
    ],
    compatibility: "Compatible with all RAIN RFID / EPC Gen2 readers including Impinj, Zebra FX, and ThingMagic; no special reader firmware required.",
  },

  // -----------------------------------------------------------------------
  // RFID Labels / Stickers
  // -----------------------------------------------------------------------

  // 33. 125 kHz RFID Sticker
  "/product/125khz-rfid-sticker/": {
    specs: [
      { label: "Chip Options", value: "EM4100 (read-only), T5577 (read/write), EM4200 (read-only)" },
      { label: "Operating Frequency", value: "125 kHz (LF)" },
      { label: "Protocol", value: "EM modulation (Manchester/Biphase); T5577: multi-protocol configurable" },
      { label: "Memory", value: "EM4100: 64-bit UID; T5577: 330-bit read/write EEPROM" },
      { label: "Dimensions", value: "Ø 25 mm, Ø 30 mm coin; or 50 × 30 mm rectangular (custom sizes available)" },
      { label: "Adhesive", value: "3M pressure-sensitive adhesive backing" },
      { label: "Material", value: "PET/paper face with aluminum etched antenna" },
      { label: "Read Range", value: "1–5 cm (compact antenna limits range vs. card format)" },
      { label: "Operating Temperature", value: "−20 °C to +55 °C" },
    ],
    buyerNotes: [
      "Smaller antenna area than CR80 cards means 30–50% shorter read range — test with your specific reader before deployment.",
      "EM4100 stickers are the lowest-cost option for adding proximity access to existing ID badges or key fobs.",
      "T5577 stickers can be field-programmed to emulate any 125 kHz format — useful for multi-site deployments.",
      "Adhesive bond is permanent on smooth surfaces (plastic, glass, metal); not recommended for textured or porous surfaces.",
    ],
    applications: [
      "Retrofit access control on existing badges",
      "Asset tagging for proximity-based identification",
      "Parking permit windshield stickers",
      "Equipment and tool checkout tracking",
    ],
    compatibility: "Works with any 125 kHz proximity reader; T5577 can emulate EM4100, HID ProxII, Indala, AWID, and other LF formats.",
  },

  // 34. MIFARE Stickers
  "/product/mifare-stickers/": {
    specs: [
      { label: "Chip Options", value: "MIFARE Classic 1K (S50), MIFARE Classic 4K (S70), MIFARE Plus, MIFARE DESFire EV2/EV3" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A" },
      { label: "Memory", value: "Classic 1K: 1,024 bytes (16 sectors); Classic 4K: 4,096 bytes (40 sectors)" },
      { label: "Dimensions", value: "Ø 25 mm, Ø 30 mm, Ø 40 mm coin; or rectangular 45 × 25 mm" },
      { label: "Adhesive", value: "3M permanent adhesive; anti-metal version includes ferrite layer" },
      { label: "Material", value: "PET face, wet inlay with etched aluminum antenna" },
      { label: "Read Range", value: "Standard: 1–4 cm; anti-metal: 1–3 cm" },
      { label: "Operating Temperature", value: "−25 °C to +65 °C" },
    ],
    buyerNotes: [
      "Anti-metal versions include a ferrite absorber layer — required if mounting on metal surfaces (lockers, equipment, server racks).",
      "MIFARE Classic crypto1 is considered insecure for high-security applications — use DESFire EV2/EV3 stickers for AES-128 security.",
      "Classic 1K is the most widely deployed chip for access control — verify sector key configuration matches your existing system.",
      "Sticker format is ideal for converting non-RFID items (phones, ID badges, tools) into MIFARE credentials.",
    ],
    applications: [
      "Contactless access control credential add-on",
      "Cashless payment and stored-value applications",
      "Library and asset management tagging",
      "Anti-metal tagging for IT equipment and servers",
    ],
    compatibility: "Compatible with all MIFARE-certified readers from NXP partners (HID, Suprema, ZKTeco, Gallagher) and any ISO 14443A reader.",
  },

  // 35. NFC Stickers
  "/product/nfc-stickers/": {
    specs: [
      { label: "Chip Options", value: "NTAG213 (144 bytes), NTAG215 (504 bytes), NTAG216 (888 bytes)" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A, NFC Forum Type 2 Tag" },
      { label: "Dimensions", value: "Ø 25 mm, Ø 30 mm, Ø 38 mm; rectangular 45 × 25 mm; custom die-cut" },
      { label: "Adhesive", value: "3M permanent adhesive; optional anti-metal ferrite layer" },
      { label: "Material", value: "White PET, clear PET, or paper face stock" },
      { label: "Read Range", value: "Standard: 1–4 cm (phone tap); anti-metal: 1–3 cm" },
      { label: "Printability", value: "Thermal transfer, inkjet, or offset printable surface" },
      { label: "Operating Temperature", value: "−20 °C to +65 °C" },
      { label: "Data Retention", value: "> 10 years; 100,000 write cycles" },
    ],
    buyerNotes: [
      "NTAG213 is sufficient for URLs and vCards (144 bytes); choose NTAG216 for Wi-Fi provisioning profiles or multi-record NDEF messages.",
      "Anti-metal stickers are essential for phone cases, laptops, and metal shelving — standard stickers will not read on metal surfaces.",
      "Clear PET stickers are nearly invisible once applied — popular for product authentication and smart packaging.",
      "Pre-encode stickers with NDEF URL records and lock them read-only to prevent tampering in public-facing deployments.",
    ],
    applications: [
      "Marketing smart posters and tap-to-URL campaigns",
      "Product authentication and anti-counterfeiting",
      "Smart home NFC automation triggers",
      "Wi-Fi credential sharing stickers",
    ],
    compatibility: "Compatible with all NFC-enabled smartphones (iOS 13+, Android 5+) and ISO 14443A/NFC Forum readers.",
  },

  // 36. RFID Sticker on Headlight
  "/product/rfid-sticker-on-headlight/": {
    specs: [
      { label: "Chip", value: "Impinj Monza R6 or NXP UCODE 8" },
      { label: "Operating Frequency", value: "860–960 MHz (UHF, RAIN RFID)" },
      { label: "Protocol", value: "ISO 18000-63 (EPC Gen2v2)" },
      { label: "Memory", value: "96-bit EPC, 32-bit TID (unique), 64-bit user memory (chip-dependent)" },
      { label: "Form Factor", value: "Transparent or semi-transparent adhesive label designed for curved headlight lens" },
      { label: "Adhesive", value: "High-tack automotive-grade adhesive, UV and heat resistant" },
      { label: "Tamper Evidence", value: "Destructible facestock — label fractures on removal attempt" },
      { label: "Read Range", value: "2–6 m (with fixed UHF reader)" },
      { label: "Operating Temperature", value: "−40 °C to +85 °C (automotive grade)" },
      { label: "UV Resistance", value: "Rated for 5+ years outdoor UV exposure" },
    ],
    buyerNotes: [
      "Tamper-evident destructible facestock ensures the tag cannot be peeled off intact and transferred to another vehicle.",
      "Transparent material maintains headlight aesthetics — the tag is nearly invisible once applied inside or outside the lens.",
      "Automotive-grade adhesive withstands car wash jets, rain, and temperature cycling from −40 °C to +85 °C.",
      "Headlight mounting avoids the RF interference issues of metal body panels — provides consistent long-range reads.",
    ],
    applications: [
      "Vehicle identification and access control",
      "Toll collection and parking management",
      "Fleet tracking and yard management",
      "Vehicle anti-theft and registration verification",
    ],
    compatibility: "Works with all RAIN RFID fixed readers (Impinj, Zebra, Alien) and vehicle access control systems (TagMaster, Nedap, Feig).",
  },

  // 37. RFID Windshield Tag
  "/product/rfid-windshield-tag/": {
    specs: [
      { label: "Chip", value: "Impinj Monza R6, NXP UCODE 8/9, or Alien Higgs-3/9" },
      { label: "Operating Frequency", value: "860–960 MHz (UHF, RAIN RFID)" },
      { label: "Protocol", value: "ISO 18000-63 (EPC Gen2v2)" },
      { label: "Memory", value: "96-bit EPC (expandable to 496-bit); 32–64 bit user memory" },
      { label: "Form Factor", value: "Adhesive windshield label, 110 × 45 mm or 100 × 35 mm typical" },
      { label: "Adhesive", value: "Inside-glass mounting with tamper-evident destructible adhesive" },
      { label: "Read Range", value: "3–8 m through windshield glass (reader and antenna dependent)" },
      { label: "Operating Temperature", value: "−40 °C to +85 °C" },
      { label: "UV/Weather Resistance", value: "5+ year outdoor UV and moisture resistance" },
      { label: "Tamper Evidence", value: "Frangible facestock breaks apart on peel, preventing transfer" },
    ],
    buyerNotes: [
      "Inside-glass mounting protects the label from weather, car washes, and casual tampering while maintaining 3–8 m read range.",
      "Windshield tint and metallic coatings can reduce read range by 30–60% — test with tinted samples before deployment.",
      "Frangible destructible labels are the industry standard for toll and parking — prevents transfer fraud between vehicles.",
      "Specify regional frequency tuning: FCC (902–928 MHz) for Americas, ETSI (865–868 MHz) for EU/UK, or multi-region global.",
    ],
    applications: [
      "Electronic toll collection (ETC)",
      "Gated community and campus vehicle access",
      "Airport and logistics yard vehicle identification",
      "Parking garage access and payment",
    ],
    compatibility: "Compatible with all RAIN RFID infrastructure including Impinj, Zebra, Kathrein, and dedicated vehicle ID systems (Nedap, TagMaster, FEIG).",
  },

  // -----------------------------------------------------------------------
  // RFID Readers
  // -----------------------------------------------------------------------

  // 38. ACR122U NFC Reader
  "/product/acr122u/": {
    specs: [
      { label: "Model", value: "ACS ACR122U" },
      { label: "Interface", value: "USB 2.0 (Full Speed)" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Supported Standards", value: "ISO 14443A/B, ISO 18092 (NFC), MIFARE, FeliCa" },
      { label: "Supported Tags", value: "MIFARE Classic/Ultralight/DESFire, NTAG, JCOP, FeliCa" },
      { label: "Smart Card Standard", value: "PC/SC compliant, CCID class" },
      { label: "Read/Write Speed", value: "Up to 424 kbps" },
      { label: "Read Range", value: "0–5 cm (contact/near-field)" },
      { label: "LED/Buzzer", value: "Bi-color LED (red/green) and piezo buzzer for status indication" },
      { label: "OS Support", value: "Windows, macOS, Linux; Android via USB OTG" },
    ],
    buyerNotes: [
      "The ACR122U is the most widely used NFC desktop reader — extensive community support, sample code, and library availability.",
      "PC/SC and CCID compliance means it works as a plug-and-play smart card reader on Windows — no custom drivers needed.",
      "ACS provides a free SDK with libraries for C, C#, Java, VB.NET, and Python (via wrapper) — check ACS website for latest.",
      "For production deployments requiring SAM slot or faster read speeds, consider upgrading to the ACR1252U or ACR1552U.",
    ],
    applications: [
      "NFC tag reading/writing and encoding",
      "Desktop access control enrollment stations",
      "Smart card application development and testing",
      "Cashless payment terminal prototyping",
    ],
    compatibility: "Supports MIFARE Classic/Ultralight/DESFire, NTAG 2xx, JCOP cards, and FeliCa; PC/SC interface works with libnfc, PCSC-Lite, and Windows Smart Card service.",
  },

  // 39. Bluetooth RFID Scanner
  "/product/bluetooth-rfid-scanner/": {
    specs: [
      { label: "Frequency", value: "860–960 MHz (UHF) or 134.2 kHz (LF) for livestock ear tags" },
      { label: "Protocol", value: "ISO 18000-63 / EPC Gen2 (UHF); ISO 11784/11785 (LF livestock)" },
      { label: "Connectivity", value: "Bluetooth 4.0/5.0 BLE, USB charging" },
      { label: "Read Range", value: "UHF: 1–5 m (handheld); LF: 5–20 cm (ear tag contact)" },
      { label: "Display", value: "OLED or LCD screen for tag ID display" },
      { label: "Battery", value: "Rechargeable Li-ion, 8–12 hours continuous scanning" },
      { label: "Weight", value: "150–300 g (handheld form factor)" },
      { label: "IP Rating", value: "IP54 or IP65 (dust and splash resistant)" },
      { label: "Operating Temperature", value: "−10 °C to +50 °C" },
    ],
    buyerNotes: [
      "For livestock management, confirm the reader supports ISO 11784/11785 FDX-B at 134.2 kHz — this is the global standard for animal ear tags.",
      "Bluetooth BLE pairing with smartphone apps enables field data collection without a dedicated handheld computer.",
      "Battery life of 8–12 hours covers a full working day; carry a USB power bank for extended fieldwork.",
      "IP65 rating is recommended for outdoor livestock use — IP54 is adequate for warehouse and indoor environments only.",
    ],
    applications: [
      "Livestock ear tag reading and herd management",
      "Mobile UHF inventory scanning in warehouses",
      "Field asset auditing and verification",
      "Veterinary identification and health record lookup",
    ],
    compatibility: "Pairs via Bluetooth with iOS and Android devices; compatible with livestock management apps and UHF inventory platforms (Agrident, Allflex, Datamars, Zebra).",
  },

  // 40. NFC Reader/Writer with Free SDKs
  "/product/nfc-reader-writer-with-free-sdks/": {
    specs: [
      { label: "Interface", value: "USB 2.0 (HID and/or PC/SC)" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Supported Standards", value: "ISO 14443A/B, ISO 15693, ISO 18092 (NFC P2P)" },
      { label: "Tag Support", value: "MIFARE Classic/Ultralight/DESFire, NTAG 2xx, ICODE SLIX, FeliCa" },
      { label: "SDK Languages", value: "C, C++, C#, Java, Python, Node.js — free SDK download" },
      { label: "OS Support", value: "Windows, macOS, Linux" },
      { label: "Read/Write Speed", value: "Up to 848 kbps (depending on tag type)" },
      { label: "Antenna", value: "Built-in PCB antenna, 0–5 cm read range" },
      { label: "Form Factor", value: "Desktop device, approximately 70 × 70 × 12 mm" },
    ],
    buyerNotes: [
      "Free multi-language SDK is the key differentiator — no licensing fees for commercial application development.",
      "ISO 15693 support (ICODE SLIX) is not available on all NFC readers — verify if you need it for library or industrial tags.",
      "HID-mode operation allows keyboard-wedge UID reading without custom software — useful for quick integration with existing apps.",
      "Request SDK documentation and sample projects before purchasing to confirm API coverage for your use case.",
    ],
    applications: [
      "Custom NFC application development",
      "Tag encoding and data initialization stations",
      "Access control credential enrollment",
      "IoT prototyping and NFC integration projects",
    ],
    compatibility: "Cross-platform SDK supports Windows/macOS/Linux; compatible with NFC Forum Type 1–5 tags and most ISO 14443A/B and ISO 15693 transponders.",
  },

  // -----------------------------------------------------------------------
  // RFID Keyfobs
  // -----------------------------------------------------------------------

  // 41. Proximity Fobs (125 kHz)
  "/product/proximity-fobs/": {
    specs: [
      { label: "Chip Options", value: "EM4100 (read-only), T5577 (read/write), HID-compatible 125 kHz" },
      { label: "Operating Frequency", value: "125 kHz (LF)" },
      { label: "Protocol", value: "EM modulation, HID ProxII, Indala (chip-dependent)" },
      { label: "Housing", value: "ABS plastic, drop-resistant" },
      { label: "Dimensions", value: "Typical: 40 × 32 × 5 mm or Ø 35 mm disc with keyring hole" },
      { label: "Color Options", value: "Black, blue, red, green, grey, custom Pantone matching" },
      { label: "Read Range", value: "3–8 cm" },
      { label: "Key Ring", value: "Integrated stainless steel split ring or lanyard hole" },
      { label: "Operating Temperature", value: "−20 °C to +55 °C" },
      { label: "Data Retention", value: "> 10 years" },
    ],
    buyerNotes: [
      "EM4100 keyfobs are the most cost-effective option for basic 125 kHz access; HID-compatible fobs work with existing HID ProxPoint readers.",
      "T5577 keyfobs can be field-cloned to match any 125 kHz credential — popular with locksmiths and property managers.",
      "ABS housing is durable for daily keychain carry; specify drop-test requirements if used in industrial environments.",
      "Custom color coding helps tenants and staff distinguish between different access zones or buildings.",
    ],
    applications: [
      "Residential and commercial building access",
      "Gym and fitness center membership",
      "Parking garage access",
      "Gate and barrier control",
    ],
    compatibility: "EM4100 fobs work with EM-Marine readers; HID-compatible fobs work with HID ProxPoint Plus, ProxPro, and compatible third-party 125 kHz readers.",
  },

  // 42. RFID Key Fob (Multi-Chip)
  "/product/rfid-key-fob/": {
    specs: [
      { label: "Chip Options", value: "LF: EM4100, T5577; HF: MIFARE Classic 1K/4K, NTAG213/216, DESFire EV2" },
      { label: "Operating Frequency", value: "125 kHz (LF) or 13.56 MHz (HF), chip-dependent" },
      { label: "Housing Material", value: "ABS plastic or epoxy resin" },
      { label: "Form Factors", value: "Teardrop, rectangular, disc, oval; with keyring hole" },
      { label: "Dimensions", value: "35–50 mm length, 4–6 mm thick" },
      { label: "Personalization", value: "Laser engraving (logo, serial number, QR code), UV printing, epoxy dome label" },
      { label: "Read Range", value: "LF: 3–8 cm; HF: 2–5 cm" },
      { label: "Color Options", value: "Solid colors, dual-color, translucent, custom Pantone" },
      { label: "Operating Temperature", value: "−25 °C to +65 °C" },
    ],
    buyerNotes: [
      "Laser engraving is permanent and wear-resistant — preferred over printed logos for keyfobs that see daily use.",
      "Epoxy resin fobs have a premium glass-like finish; ABS is more cost-effective and better for high-volume deployments.",
      "Dual-frequency fobs (LF + HF in one body) are available for migration scenarios where both old and new readers coexist.",
      "Specify UID or serial number printing/engraving at the factory to simplify credential enrollment on delivery.",
    ],
    applications: [
      "Multi-site corporate access control",
      "Condo and apartment building entry",
      "Loyalty program identification",
      "Branded promotional merchandise with NFC functionality",
    ],
    compatibility: "LF fobs work with 125 kHz proximity readers; HF fobs with ISO 14443A readers. Compatible with major access platforms (HID, Gallagher, Salto, Kaba).",
  },

  // 43. NFC Ring
  "/product/nfc-ring/": {
    specs: [
      { label: "Chip Options", value: "NTAG213 (144 bytes), NTAG216 (888 bytes)" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A, NFC Forum Type 2 Tag" },
      { label: "Material", value: "Ceramic, carbon fiber, or resin composite" },
      { label: "Antenna", value: "Copper wire coil embedded in ring band" },
      { label: "Sizes", value: "US ring sizes 5–13 (inner diameter 15.7–22.3 mm)" },
      { label: "Read Range", value: "0.5–2 cm (close tap to reader or phone)" },
      { label: "Water Resistance", value: "IP68 — waterproof for daily wear including handwashing" },
      { label: "Weight", value: "5–10 g" },
      { label: "Data Retention", value: "> 10 years; 100,000 write cycles" },
    ],
    buyerNotes: [
      "Ring orientation matters — the antenna coil must be parallel to the reader antenna for reliable reads; users learn the best hand angle quickly.",
      "NTAG216 (888 bytes) is recommended if storing vCards, Wi-Fi configs, or multi-record NDEF messages; NTAG213 is enough for URLs.",
      "Ceramic rings are the most scratch-resistant and premium-looking; resin is lighter and more affordable for bulk promotional use.",
      "Ring sizing is critical — provide a ring sizer tool to end users or order sample sizes before committing to inventory.",
    ],
    applications: [
      "Contactless access control (door locks, gym turnstiles)",
      "Digital business card sharing via phone tap",
      "Cashless micro-payment at events and venues",
      "Smart home automation triggers (NFC readers at doorways)",
    ],
    compatibility: "Compatible with all NFC-enabled smartphones (iOS 13+, Android 5+) and ISO 14443A readers; works with smart locks from Yale, Samsung, Schlage with NFC support.",
  },

  // -----------------------------------------------------------------------
  // RFID Wristbands
  // -----------------------------------------------------------------------

  // 44. Coconut Shell RFID Wristband
  "/product/coconut-shell-rfid-wristband/": {
    specs: [
      { label: "Chip Options", value: "NTAG213, NTAG216, MIFARE Classic 1K, EM4100, T5577" },
      { label: "Operating Frequency", value: "13.56 MHz (HF) or 125 kHz (LF), chip-dependent" },
      { label: "Face Material", value: "Natural coconut shell disc (Ø 25–35 mm)" },
      { label: "Band Material", value: "Nylon/polyester woven strap with plastic snap or sliding lock" },
      { label: "Dimensions", value: "Band length: adjustable 180–250 mm; coconut disc: Ø 25–35 × 3 mm" },
      { label: "RFID Inlay", value: "Embedded inside coconut shell disc, sealed with clear resin" },
      { label: "Read Range", value: "HF: 1–4 cm; LF: 2–5 cm" },
      { label: "Personalization", value: "Laser engraving on coconut face, woven/printed logo on strap" },
    ],
    buyerNotes: [
      "Natural coconut shell gives each wristband a unique organic appearance — set expectations for color and pattern variation across units.",
      "Coconut is RF-transparent like wood, so NFC performance is unaffected by the shell housing.",
      "Eco-friendly positioning makes these ideal for sustainability-themed events, eco-resorts, and green brand activations.",
      "Nylon strap with sliding lock allows size adjustment and reuse; plastic snap closure is more tamper-evident for single-event use.",
    ],
    applications: [
      "Eco-resort and retreat guest identification",
      "Music festivals and outdoor events with sustainability branding",
      "Souvenir wristbands with NFC digital content",
    ],
    compatibility: "Works with all ISO 14443A (HF) or 125 kHz proximity readers; NFC chips are phone-tap compatible for post-event engagement.",
  },

  // 45. RFID Event Wristband (Tyvek/Paper)
  "/product/rfid-event-wristband/": {
    specs: [
      { label: "Chip Options", value: "NTAG213, NTAG215, MIFARE Ultralight EV1, ICODE SLIX" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A (NTAG/MIFARE) or ISO 15693 (ICODE)" },
      { label: "Band Material", value: "Tyvek (HDPE spunbond) or coated paper" },
      { label: "Closure", value: "Adhesive fold-over tab — tamper-evident, single-use" },
      { label: "Dimensions", value: "Band: 255 × 25 mm (one-size adjustable); RFID inlay area: 50 × 30 mm" },
      { label: "Printing", value: "Full-color CMYK on Tyvek face; sequential numbering, barcodes, QR codes" },
      { label: "Read Range", value: "1–4 cm (smartphone NFC tap)" },
      { label: "Water Resistance", value: "Tyvek: splash-resistant; paper: not water-resistant" },
    ],
    buyerNotes: [
      "Tyvek is tear-resistant and splash-proof — choose it over paper for multi-day outdoor festivals and water parks.",
      "Adhesive closure is designed for one-time use; once sealed, the band cannot be removed without visible destruction.",
      "MIFARE Ultralight EV1 is the lowest-cost NFC chip — ideal for single-day disposable event credentials.",
      "Full-color printing allows sponsor branding, event artwork, and variable data (attendee name, ticket tier) on each band.",
    ],
    applications: [
      "Music festivals and concert admission",
      "Conference and trade show attendee management",
      "Water park and theme park day passes",
      "Cashless food and drink payment at events",
    ],
    compatibility: "Compatible with all NFC smartphones and ISO 14443A/ISO 15693 event management readers (Intellitix, Glownet, PlayPass, RFID4U).",
  },

  // 46. RFID Silicone Wristbands
  "/product/rfid-silicone-wristbands/": {
    specs: [
      { label: "Chip Options", value: "MIFARE Classic 1K/4K, NTAG213/216, DESFire EV2/EV3, EM4100, T5577" },
      { label: "Operating Frequency", value: "13.56 MHz (HF) or 125 kHz (LF), chip-dependent" },
      { label: "Material", value: "Medical-grade silicone (hypoallergenic, latex-free)" },
      { label: "Closure", value: "Watch-style buckle, snap button, or continuous closed-loop" },
      { label: "Sizes", value: "Child (160 mm), Adult S (180 mm), Adult M (200 mm), Adult L (220 mm)" },
      { label: "Read Range", value: "HF: 1–5 cm; LF: 2–6 cm" },
      { label: "Water Resistance", value: "IP68 — fully waterproof (pool, ocean, shower)" },
      { label: "Personalization", value: "Debossed, embossed, silk-screen, or color-fill logo; Pantone color matching" },
      { label: "Operating Temperature", value: "−40 °C to +120 °C" },
      { label: "Durability", value: "Reusable for 2+ years with daily wear" },
    ],
    buyerNotes: [
      "Silicone is the best material for reusable, long-term RFID wristbands — waterproof, comfortable, and durable for daily wear.",
      "Watch-style buckle closure is adjustable and reusable; snap-button is more compact but limited to 2–3 size positions.",
      "DESFire EV2/EV3 chips are recommended for cashless payment wristbands — AES-128 encryption meets payment security requirements.",
      "Order multiple sizes (at least S/M/L) for any deployment — one-size-fits-all silicone bands do not exist comfortably.",
    ],
    applications: [
      "Water park and resort guest management",
      "Gym and fitness center membership bands",
      "Cashless payment wristbands for events and venues",
      "Hospital patient identification (hypoallergenic)",
    ],
    compatibility: "Compatible with all ISO 14443A/ISO 15693 (HF) and 125 kHz (LF) reader infrastructure; integrates with cashless payment platforms (Vantiv, Visa, Mastercard contactless).",
  },

  // 47. RFID Wristbands for Events
  "/product/rfid-wristbands-for-events/": {
    specs: [
      { label: "Chip Options", value: "NTAG213, NTAG215, MIFARE Ultralight EV1, MIFARE Classic 1K" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A, NFC Forum Type 2 (NTAG)" },
      { label: "Band Types", value: "Woven fabric, Tyvek, vinyl, silicone — event-grade" },
      { label: "Closure", value: "Fabric: anti-transfer sliding bead/crimp; Tyvek: adhesive tab; Vinyl: snap" },
      { label: "RFID Inlay Position", value: "Sewn-in fabric pocket or laminated into band (tamper-protected)" },
      { label: "Printing", value: "Woven jacquard, sublimation print, or screen print on fabric; CMYK on Tyvek" },
      { label: "Dimensions", value: "Fabric: 350 × 15 mm; Tyvek: 255 × 25 mm" },
      { label: "Read Range", value: "1–5 cm (NFC tap)" },
    ],
    buyerNotes: [
      "Fabric wristbands with sliding bead closure are the industry standard for multi-day music festivals — anti-transfer and comfortable for 3–5 day wear.",
      "Sublimation printing on polyester fabric produces vibrant, photo-quality full-color designs that do not crack or peel.",
      "Tyvek bands are lowest cost for single-day events; woven fabric bands have higher perceived value and become event souvenirs.",
      "Order 5–10% extra bands for on-site replacements due to encoding failures, sizing issues, or lost wristbands.",
    ],
    applications: [
      "Music festivals and multi-day concert events",
      "Conference and expo attendee credentialing",
      "VIP and tiered-access management",
      "Cashless food, drink, and merchandise payment",
    ],
    compatibility: "Works with all major event RFID platforms (Intellitix, PlayPass, Glownet, Weezevent) and NFC-enabled smartphones for attendee self-service.",
  },

  // 48. RFID Wristbands for Hotels
  "/product/rfid-wristbands-for-hotels/": {
    specs: [
      { label: "Chip Options", value: "MIFARE Classic 1K, MIFARE DESFire EV2, NTAG213" },
      { label: "Operating Frequency", value: "13.56 MHz (HF)" },
      { label: "Protocol", value: "ISO 14443A" },
      { label: "Material", value: "Soft silicone (hypoallergenic, latex-free)" },
      { label: "Water Resistance", value: "IP68 — pool, beach, and shower safe" },
      { label: "Closure", value: "Watch-style buckle or RFID-secured snap lock (non-removable without tool)" },
      { label: "Sizes", value: "Child (160 mm), Adult S/M/L (180–220 mm)" },
      { label: "Personalization", value: "Resort logo emboss/deboss, color coding by room tier, guest name printing" },
      { label: "Read Range", value: "2–5 cm" },
      { label: "Reusability", value: "Sanitizable and reusable for 500+ guest cycles" },
    ],
    buyerNotes: [
      "MIFARE DESFire EV2 is preferred for resorts with cashless payment — AES encryption secures stored-value wallet on the wristband.",
      "Non-removable snap lock closure prevents unauthorized sharing or loss at pool/beach — staff tool required for removal at checkout.",
      "Color coding by room tier (standard, suite, VIP) enables visual identification by staff without scanning.",
      "Silicone bands are sanitizable between guests with standard hospital-grade disinfectant — verify cleaning protocol with manufacturer.",
    ],
    applications: [
      "All-inclusive resort guest identification",
      "Hotel room door access (replaces key card)",
      "Poolside and beach cashless payment",
      "Spa, gym, and amenity access control",
    ],
    compatibility: "Compatible with hotel lock systems (Assa Abloy, Salto, Onity, Dormakaba) and POS cashless payment platforms using ISO 14443A.",
  },

  // 49. UHF Wristband
  "/product/uhf-wristband/": {
    specs: [
      { label: "Chip", value: "Impinj Monza R6, NXP UCODE 8, or Alien Higgs-3" },
      { label: "Operating Frequency", value: "860–960 MHz (UHF, RAIN RFID)" },
      { label: "Protocol", value: "ISO 18000-63 (EPC Gen2v2)" },
      { label: "Memory", value: "96-bit EPC, 32-bit TID, 0–64 bit user memory (chip-dependent)" },
      { label: "Material", value: "Silicone (reusable) or Tyvek (disposable)" },
      { label: "Read Range", value: "1–5 m (silicone); 0.5–3 m (Tyvek) — reader and antenna dependent" },
      { label: "Closure", value: "Silicone: adjustable watch buckle; Tyvek: adhesive single-use tab" },
      { label: "Water Resistance", value: "Silicone: IP68; Tyvek: splash-resistant" },
      { label: "Operating Temperature", value: "−25 °C to +65 °C" },
    ],
    buyerNotes: [
      "UHF wristbands enable hands-free, long-range identification — no need to tap a reader; detected automatically at 1–5 m distance.",
      "Long read range means UHF wristbands can be read unintentionally — implement EPC filtering and zone control to prevent false reads.",
      "UHF is not natively compatible with smartphones (phones use NFC/HF) — use HF/NFC wristbands if phone-tap interaction is required.",
      "Silicone UHF bands are ideal for reusable tracking (theme parks, camps); Tyvek UHF bands for disposable race timing and events.",
    ],
    applications: [
      "Marathon and race timing",
      "Theme park guest tracking and ride analytics",
      "Hospital patient and infant tracking",
      "Large-scale event crowd flow monitoring",
    ],
    compatibility: "Compatible with all RAIN RFID readers (Impinj, Zebra, Alien, ThingMagic) and timing systems (Chronotrack, MyLaps, RFID Race Timing Systems).",
  },

  // -----------------------------------------------------------------------
  // Other Products
  // -----------------------------------------------------------------------

  // 50. Car Transponder Chip
  "/product/car-transponder-chip/": {
    specs: [
      { label: "Chip Families", value: "Texas Instruments (TI) DST40/DST80, NXP/Philips PCF7935/7936/7939, Megamos Crypto (48), Temic, Silca" },
      { label: "Operating Frequency", value: "125 kHz (LF) or 134.2 kHz (LF), protocol-dependent" },
      { label: "Protocol", value: "Proprietary immobilizer protocols (varies by vehicle manufacturer)" },
      { label: "Form Factor", value: "Glass capsule (3 × 13 mm), carbon chip, ceramic wedge, or PCB module" },
      { label: "Transponder Types", value: "Fixed code, rolling code, and crypto transponders" },
      { label: "Common Vehicle Brands", value: "Toyota (4C/4D/8A), VW/Audi (48/Megamos), Ford (4D/4C), BMW (46/PCF7936)" },
      { label: "Cloning Support", value: "Model-dependent: some chips are clonable (4C, 46), others require OBD programming (4D+)" },
      { label: "Operating Temperature", value: "−40 °C to +85 °C (automotive grade)" },
      { label: "Data Retention", value: "> 20 years" },
    ],
    buyerNotes: [
      "Each vehicle manufacturer uses specific transponder protocols — identify the exact chip type (e.g., Toyota 4D67, VW 48) before ordering.",
      "Some transponder chips (e.g., TI DST80, NXP 7939FA) require OBD-II programming through the vehicle ECU — not all can be cloned externally.",
      "Glass capsule transponders are embedded inside the key head; carbon/ceramic chips are for key remotes and smart key housings.",
      "Professional automotive locksmith programming equipment (Autel, VVDI, Zed-Bull, T-Code) is required for most modern transponder chips.",
    ],
    applications: [
      "Car key duplication and replacement",
      "Automotive locksmith services",
      "Vehicle immobilizer system repair",
      "Fleet key management and spare key provisioning",
    ],
    compatibility: "Vehicle-specific — confirm transponder compatibility with OEM key specifications. Works with professional key programming tools from Autel, Xhorse, Silca, and Advanced Diagnostics.",
  },
};
