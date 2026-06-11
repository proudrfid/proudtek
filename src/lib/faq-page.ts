import type { CheerioAPI } from "cheerio";

/* ═══════════════════════════════════════════════════════════════════
   FAQ Category & Data Types
   ═══════════════════════════════════════════════════════════════════ */

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  items: FaqItem[];
}

/* ═══════════════════════════════════════════════════════════════════
   100 RFID Industry FAQs — 10 categories x 10 questions
   ═══════════════════════════════════════════════════════════════════ */

export const FAQ_CATEGORIES: FaqCategory[] = [
  /* ── 1. General RFID/NFC Knowledge ──────────────────────────── */
  {
    id: "general",
    icon: "\u{1F4E1}",
    title: "General RFID / NFC Knowledge",
    description: "Fundamentals of radio-frequency identification and near-field communication technology.",
    color: "#3d6b6b",
    items: [
      {
        question: "What is RFID and how does it work?",
        answer:
          "RFID (Radio-Frequency Identification) uses electromagnetic fields to automatically identify and track tags attached to objects. A system consists of a reader that emits radio waves and a tag with an embedded microchip and antenna. When the tag enters the reader\u2019s field, the chip powers up and transmits its stored data back to the reader. This contactless exchange happens in milliseconds, making RFID ideal for access control, inventory tracking, and supply-chain management.",
      },
      {
        question: "What is the difference between RFID and NFC?",
        answer:
          "NFC (Near-Field Communication) is a subset of RFID that operates at 13.56 MHz with a typical read range of 1\u201310 cm. RFID is a broader category that also includes LF (125 kHz) and UHF (860\u2013960 MHz) frequencies with read ranges from a few centimeters to over 12 meters. NFC supports peer-to-peer communication and is built into most modern smartphones, which makes it popular for mobile payments, smart posters, and tap-to-connect applications. All NFC tags are RFID tags, but not all RFID tags are NFC.",
      },
      {
        question: "What are the main RFID frequency bands?",
        answer:
          "There are three primary bands. Low Frequency (LF) at 125\u2013134 kHz offers short read range (up to 10 cm) and strong performance near metal and liquids\u2014common in animal tracking and access control. High Frequency (HF) at 13.56 MHz provides moderate range (up to 1 m) and is used in library systems, payment cards, and hotel key cards. Ultra-High Frequency (UHF) at 860\u2013960 MHz delivers the longest range (up to 12+ m) and fastest bulk-read speed, making it dominant in logistics, warehousing, and retail inventory.",
      },
      {
        question: "What is the typical read range of RFID tags?",
        answer:
          "Read range depends on frequency, tag antenna design, chip sensitivity, and reader power. LF tags typically read at 1\u201310 cm. HF/NFC tags reach 1\u201310 cm for phone taps or up to 1 m with dedicated readers. UHF inlays commonly achieve 3\u20138 m in open air, while specialized long-range UHF tags (e.g., on-metal tags with ground planes) can exceed 15 m. Environmental factors like metal surfaces, liquids, and reader orientation also affect practical range.",
      },
      {
        question: "What data can be stored on an RFID tag?",
        answer:
          "Most RFID tags store a unique identifier (UID) that is factory-programmed and read-only. Many chips also include user-writable memory ranging from 48 bytes (NTAG210) to 8 KB (ICODE SLIX2) or more. Common stored data includes serial numbers, URLs (for NFC), product codes, timestamps, and encrypted access credentials. For larger data needs, the tag\u2019s UID is typically linked to a backend database where richer records are maintained.",
      },
      {
        question: "Can RFID tags be rewritten?",
        answer:
          "It depends on the chip. Read-only tags like EM4100 have a fixed UID that cannot be changed. Read/write chips such as NTAG213, NTAG215, Mifare Classic 1K, and Mifare DESFire support multiple write cycles\u2014typically 100,000 or more. Some chips also feature one-time-programmable (OTP) memory areas that can be permanently locked after a single write. For applications like hotel key cards, rewritable chips are essential because the same card must be re-encoded for every new guest.",
      },
      {
        question: "Are RFID tags safe for human use and the environment?",
        answer:
          "Yes. RFID systems use non-ionizing radio waves at very low power levels\u2014far below those of mobile phones. Passive tags contain no battery and emit no radiation on their own. The materials used in most RFID inlays (PET, copper, aluminum) are RoHS-compliant. Many NFC tags and wristbands are also tested for skin safety under EN 1811 nickel-release standards. At Proud Tek, our products carry RoHS, REACH, and CE certifications.",
      },
      {
        question: "What is the lifespan of an RFID tag?",
        answer:
          "Passive RFID tags have no battery, so their electronic lifespan is essentially unlimited\u2014typically rated for 10+ years. The practical lifespan depends on the physical housing: a PVC card may last 5\u201310 years under normal use, a silicone wristband 3\u20135 years, and an industrial ABS tag 15\u201320 years in harsh environments. Active RFID tags with built-in batteries have shorter lifespans, typically 3\u20135 years depending on broadcast interval and battery capacity.",
      },
      {
        question: "What is the difference between active and passive RFID?",
        answer:
          "Passive tags have no internal power source; they harvest energy from the reader\u2019s electromagnetic field. This makes them small, inexpensive, and maintenance-free, but limits their range. Active tags contain a battery that continuously or periodically broadcasts a signal, enabling read ranges of 50\u2013100+ meters. They are used for real-time location systems (RTLS) in hospitals, warehouses, and construction sites. Semi-passive (BAP) tags use a battery only to power the chip\u2019s circuitry while still relying on backscatter for communication.",
      },
      {
        question: "How many RFID tags can be read simultaneously?",
        answer:
          "UHF RFID systems support anti-collision protocols (EPC Gen2/ISO 18000-63) that allow a single reader to identify hundreds of tags per second. In practical warehouse or retail environments, reading 200\u2013600 tags per second is common. HF systems using ISO 15693 can read multiple tags simultaneously but at lower throughput. The exact speed depends on tag population density, reader antenna design, and the presence of interference sources.",
      },
    ],
  },

  /* ── 2. RFID Cards & Hotel Key Cards ────────────────────────── */
  {
    id: "cards",
    icon: "\u{1F4B3}",
    title: "RFID Cards & Hotel Key Cards",
    description: "PVC cards, hotel key cards, membership cards, and dual-frequency smart cards.",
    color: "#c39a5f",
    items: [
      {
        question: "What chip options are available for RFID hotel key cards?",
        answer:
          "The most popular chips for hotel key cards are Mifare Classic 1K (widely compatible with Onity, Assa Abloy, Salto, and dormakaba locks), Mifare DESFire EV2/EV3 (higher security with AES-128 encryption), and NTAG213 (for NFC-enabled locks). Some legacy systems still use LF chips like T5577 or EM4200. Proud Tek produces hotel key cards with all major chip types and can supply samples for lock-system compatibility testing before bulk orders.",
      },
      {
        question: "What is the standard size of an RFID card?",
        answer:
          "The global standard is CR80, measuring 85.6 mm \u00d7 54 mm \u00d7 0.76 mm (3.375\u2033 \u00d7 2.125\u2033 \u00d7 0.030\u2033)\u2014the same dimensions as a standard credit card, per ISO/IEC 7810 ID-1. This size fits all standard card printers and badge holders. Proud Tek also produces CR79 (slightly narrower, used with adhesive-backed overlays for proximity cards), mini cards, die-cut shaped cards, and oversized cards for special applications.",
      },
      {
        question: "Can RFID cards be custom printed with our hotel branding?",
        answer:
          "Absolutely. We support full-color CMYK offset printing (for orders of 5,000+) and digital printing (for shorter runs). Finishing options include matte or glossy lamination, spot UV coating, metallic foil stamping, embossed numbering, signature panels, magnetic stripes, and QR codes. Most hotel clients provide their Illustrator or PDF artwork and we handle prepress. Turnaround for printed cards is typically 7\u201312 working days after proof approval.",
      },
      {
        question: "What is a dual-frequency RFID card?",
        answer:
          "A dual-frequency card contains two separate chip-and-antenna systems operating on different frequencies\u2014most commonly an LF chip (125 kHz, e.g., EM4200 or HID Prox) and an HF chip (13.56 MHz, e.g., Mifare Classic or DESFire). This allows a single card to work with both legacy and modern access control systems during a migration period. Proud Tek laminate both antennas into a standard CR80 card body with no visible difference in thickness.",
      },
      {
        question: "How durable are PVC RFID cards?",
        answer:
          "Standard PVC RFID cards withstand 500,000+ flexion cycles per ISO/IEC 10373 and operate reliably in temperatures from \u221220 \u00b0C to +50 \u00b0C. The RFID inlay inside is sealed between PVC layers during lamination, protecting it from moisture and physical contact. For harsher environments (e.g., gym or pool access), we offer ABS or polycarbonate card bodies rated for higher temperatures and chemical exposure. All our cards undergo RF performance testing and 48-hour aging tests before shipment.",
      },
      {
        question: "What is the MOQ for custom RFID cards?",
        answer:
          "Our standard minimum order quantity for fully custom-printed RFID cards is 500 pieces. For plain white cards with chip encoding only, the MOQ drops to 200 pieces. Large hotel chains typically order in batches of 5,000\u201350,000 cards to benefit from volume pricing. We also provide free sample cards (usually 3\u20135 pieces of each chip type) so your integrator can verify compatibility with your lock system before committing to a bulk order.",
      },
      {
        question: "Can RFID hotel key cards be encoded before shipping?",
        answer:
          "Yes. Proud Tek offers pre-encoding services where we write specific data, sector keys, or access credentials onto each card before shipment. We support common hotel PMS formats including Onity HT24W, Assa Abloy Visionline/VingCard, Salto, and dormakaba. If your lock vendor provides the encoding specification or SDK, we can configure cards to be plug-and-play on arrival. Pre-encoding adds 1\u20132 days to production time.",
      },
      {
        question: "What security features are available for RFID smart cards?",
        answer:
          "Security ranges from basic to enterprise-grade. Mifare Classic offers 48-bit Crypto1 encryption (legacy, suitable for low-risk applications). Mifare DESFire EV2/EV3 provides AES-128 encryption, mutual authentication, and secure messaging\u2014recommended for government and corporate access control. Additional physical security features include holographic overlays, UV-fluorescent ink, microtext printing, laser-engraved serial numbers, and tamper-evident card construction.",
      },
      {
        question: "What is the difference between Mifare Classic and Mifare DESFire?",
        answer:
          "Mifare Classic uses Crypto1 encryption with 1 KB or 4 KB memory divided into sectors. It is widely deployed but its encryption has known vulnerabilities. Mifare DESFire uses AES-128 encryption, supports multiple applications on a single card, and offers 2 KB, 4 KB, or 8 KB memory. DESFire is required for higher-security applications such as government ID, transit, and corporate access. The cost difference is approximately $0.15\u2013$0.40 per card depending on volume.",
      },
      {
        question: "Can RFID cards include both a contactless chip and a magnetic stripe?",
        answer:
          "Yes. Combo cards with an embedded RFID chip and an ISO 7811-standard magnetic stripe (HiCo 2750 Oe or LoCo 300 Oe) are common in hotels that are transitioning from mag-stripe to RFID locks. The magnetic stripe can be encoded with track 1, 2, or 3 data alongside the RFID programming. Proud Tek also produces cards that combine RFID with contact chip modules (ISO 7816), barcode panels, or QR codes for multi-system interoperability.",
      },
    ],
  },

  /* ── 3. NFC Tags & Stickers ─────────────────────────────────── */
  {
    id: "nfc-tags",
    icon: "\u{1F4F1}",
    title: "NFC Tags & Stickers",
    description: "Smartphone-compatible NFC stickers, labels, and tap-to-connect solutions.",
    color: "#2d6a4f",
    items: [
      {
        question: "Which NFC chip should I choose for my project?",
        answer:
          "For most consumer-facing NFC applications, NTAG213 (144 bytes usable memory) is the best value\u2014it holds a URL up to ~132 characters, supports Android and iPhone, and costs the least. NTAG215 (504 bytes) is needed for Nintendo Amiibo clones or longer data payloads. NTAG216 (888 bytes) suits vCards or multi-record NDEF messages. For higher security, use NTAG424 DNA which offers AES-128 authentication and rotating encrypted URLs for anti-counterfeiting. Proud Tek stocks all four variants.",
      },
      {
        question: "Are NFC stickers compatible with both iPhone and Android?",
        answer:
          "Yes. All modern iPhones (iPhone 7 and later with iOS 11+) and virtually all Android phones with NFC support read NTAG213/215/216 stickers natively. iPhones read NFC tags in the background starting with iOS 14, so users no longer need to open a dedicated app\u2014they simply tap the phone against the sticker and a notification appears. For maximum compatibility, we recommend NTAG213 or NTAG216 formatted with standard NDEF URI records.",
      },
      {
        question: "What materials are NFC stickers made from?",
        answer:
          "Standard NFC stickers use a PET (polyester) face material with an acrylic-based permanent adhesive. The RFID inlay (chip + etched aluminum antenna) is sandwiched between the face and adhesive layers. For outdoor or industrial use, we offer vinyl face materials, weatherproof PP (polypropylene) substrates, and high-temperature polyimide labels. Anti-metal NFC stickers add a ferrite absorber layer so the tag functions correctly when placed on metal surfaces.",
      },
      {
        question: "What size options are available for NFC stickers?",
        answer:
          "Our most popular NFC sticker is a 25 mm (1-inch) round tag\u2014compact and discreet. We also produce 30 mm, 35 mm, and 45 mm round stickers, as well as rectangular formats (50 \u00d7 30 mm, 70 \u00d7 40 mm) for branding space. Die-cut shapes (stars, logos, custom outlines) are available at MOQ 3,000+. Larger antenna diameters generally produce longer read range, so for on-metal or challenging surfaces, we recommend the 35 mm or 45 mm option.",
      },
      {
        question: "Can NFC stickers be custom printed with our logo?",
        answer:
          "Yes. We print NFC stickers in full color using flexographic or digital presses. Options include surface printing on the face material or subsurface printing beneath a clear PET overlay for abrasion resistance. Pantone color matching is available. Variable data printing (sequential numbering, QR codes, unique barcodes) is also supported. Typical MOQ for custom-printed NFC stickers is 1,000 pieces, with a production lead time of 5\u20138 working days.",
      },
      {
        question: "What is an anti-metal NFC sticker?",
        answer:
          "Standard NFC stickers lose performance when placed on metal because the metal surface detunes the antenna and absorbs the RF signal. An anti-metal (or on-metal) NFC sticker includes a ferrite absorber layer between the antenna and the adhesive. This shielding restores normal read performance even on steel, aluminum, or other metallic surfaces. Anti-metal tags are slightly thicker (typically 1.5\u20133 mm vs. 0.3 mm for standard stickers) and cost 20\u201340% more, but are essential for asset tagging on equipment, machinery, and IT hardware.",
      },
      {
        question: "How do I encode a URL onto an NFC sticker?",
        answer:
          "NFC stickers formatted with NDEF (NFC Data Exchange Format) can store a URL record. You can write the URL using a free smartphone app like NFC Tools (Android/iOS) or Tagwriter (by NXP). For bulk encoding, Proud Tek offers pre-encoding services where we write your URL, vCard, Wi-Fi config, or custom payload onto every sticker before shipment. We can also set read-only locks to prevent tampering after encoding. Programming adds 1\u20132 days to production.",
      },
      {
        question: "What is the read range of a typical NFC sticker?",
        answer:
          "Standard NFC stickers deliver a tap range of 1\u20135 cm with a smartphone. The exact range depends on the phone model (antenna position and power), sticker size, and surface material. Larger stickers (35\u201345 mm) tend to read at slightly greater distance. On metal surfaces without an anti-metal layer, range drops to near zero. With dedicated desktop readers (ACR122U, etc.), read range can reach 5\u201310 cm for NTAG213 tags.",
      },
      {
        question: "Can NFC tags trigger specific apps or actions on a phone?",
        answer:
          "Yes. NFC tags can launch URLs, open apps, share Wi-Fi credentials, initiate phone calls, or trigger automation workflows. On Android, apps like Tasker or NFC Tools can map custom actions to specific tag UIDs. On iPhone, the Shortcuts app can execute automations when a specific NFC tag is scanned. For business applications, Proud Tek\u2019s NTAG424 DNA tags can deliver dynamic, encrypted URLs that change with every tap\u2014ideal for product authentication and loyalty programs.",
      },
      {
        question: "What is NTAG424 DNA and when should I use it?",
        answer:
          "NTAG424 DNA is NXP\u2019s latest high-security NFC chip. It features AES-128 encryption, SUN (Secure Unique NFC) messaging, and a tamper-detection loop. Each tap generates a unique encrypted URL so the backend server can verify authenticity and detect cloning attempts. It is ideal for brand protection, product authentication (pharmaceuticals, wine, luxury goods), tamper-evident seals, and loyalty programs that require per-tap verification. Proud Tek supplies NTAG424 DNA in sticker, card, and wristband formats.",
      },
    ],
  },

  /* ── 4. RFID Wristbands ─────────────────────────────────────── */
  {
    id: "wristbands",
    icon: "\u{1F4BF}",
    title: "RFID Wristbands",
    description: "Wristband solutions for events, resorts, water parks, and healthcare.",
    color: "#7c3aed",
    items: [
      {
        question: "What types of RFID wristbands does Proud Tek offer?",
        answer:
          "We manufacture five main types: (1) Silicone wristbands\u2014reusable, waterproof, available in molded or adjustable-strap styles for gyms, resorts, and water parks. (2) Fabric/woven wristbands\u2014soft, comfortable, popular for multi-day festivals and events. (3) Tyvek/paper wristbands\u2014single-use, low-cost, with tamper-evident closures for one-day events. (4) PVC snap wristbands\u2014durable and adjustable for long-term use. (5) Nylon stretch wristbands\u2014elastic, comfortable for hospitals and patient identification.",
      },
      {
        question: "Which chip is best for RFID event wristbands?",
        answer:
          "For most events, NTAG213 (HF 13.56 MHz) offers the best balance of cost, compatibility, and capacity. It works with all major event platforms (Intellitix, Playpass, Glownet) and supports NFC phone scanning at entry points. For events requiring longer read range (e.g., marathon timing), UHF chips like Impinj Monza R6 or Alien Higgs-3 are preferred. If cashless payment is the primary use, Mifare DESFire EV2 provides the necessary security for stored-value transactions.",
      },
      {
        question: "Are RFID wristbands waterproof?",
        answer:
          "Silicone and PVC wristbands are fully waterproof (IP67/IP68) and function normally when submerged. The RFID chip and antenna are sealed inside the silicone during injection molding, so there is no entry point for water. Fabric wristbands enclose the RFID inlay in a heat-sealed PVC pouch that is water-resistant but not designed for prolonged submersion. Tyvek wristbands are splash-resistant. For water parks, pools, and cruise ships, we recommend silicone wristbands.",
      },
      {
        question: "Can RFID wristbands support cashless payments at events?",
        answer:
          "Yes. The wristband chip stores a unique ID that links to a guest account in the event\u2019s cashless platform. When tapped at a point-of-sale terminal, the system deducts the purchase amount from the linked balance. Popular platforms like Intellitix, Tappit, and Glownet integrate directly with NFC wristbands. Security is handled server-side; the wristband itself only transmits its UID. For offline-capable payment, Mifare DESFire chips can store encrypted balance data on the wristband.",
      },
      {
        question: "What is the MOQ for custom RFID wristbands?",
        answer:
          "Minimum order quantities vary by type: silicone wristbands start at 500 pcs for standard colors and molds, or 1,000 pcs for fully custom molds and Pantone colors. Fabric wristbands start at 1,000 pcs with custom woven or sublimation-printed designs. Tyvek wristbands have an MOQ of 500 pcs for full-color printing. All types include free design assistance, and we ship 3\u20135 free samples of each type before production to verify fit, comfort, and RFID performance.",
      },
      {
        question: "How are RFID wristbands customized for branding?",
        answer:
          "Silicone wristbands can be color-matched to Pantone, debossed, embossed, silk-screen printed, or produced with color-fill lettering. Fabric wristbands support full-color sublimation printing across the entire surface\u2014ideal for event artwork. Tyvek wristbands are full-color digitally printed. PVC and silicone wristbands can also include laser-engraved logos or serial numbers. We provide free mockup renders before production so you can visualize the final product.",
      },
      {
        question: "Can RFID wristbands be used for access control at resorts?",
        answer:
          "Absolutely. Resort RFID wristbands serve as all-in-one room keys, restaurant charge cards, pool/spa access passes, and guest identification. The wristband chip links to the guest\u2019s folio in the property management system (PMS). Major hotel PMS platforms like Oracle Opera, Protel, and Mews support RFID wristband integration. Proud Tek supplies waterproof silicone wristbands with Mifare Classic 1K or DESFire chips that are compatible with Assa Abloy and dormakaba hotel locks.",
      },
      {
        question: "What is the production lead time for RFID wristbands?",
        answer:
          "Standard lead times are 7\u201310 working days for silicone wristbands, 5\u20138 days for fabric wristbands, and 3\u20135 days for Tyvek wristbands. Custom mold creation for new silicone shapes adds 5\u20137 days. Rush production (3\u20135 day turnaround for all types) is available at an additional 15\u201320% surcharge. These times cover production only; international shipping typically adds 3\u20135 days for express air freight or 18\u201325 days for sea freight.",
      },
      {
        question: "Are RFID wristbands safe for children and people with sensitive skin?",
        answer:
          "Yes. Our silicone wristbands are made from food-grade silicone (FDA 21 CFR 177.2600 compliant) and are free from BPA, latex, phthalates, and heavy metals. All silicone compounds pass EN 1811 nickel-release testing, making them safe for extended skin contact. Fabric wristbands use hypoallergenic polyester yarn. We hold SGS and Intertek test reports for skin irritation and toxicity, and can provide these certificates upon request for your compliance team.",
      },
      {
        question: "Can RFID wristbands be reprogrammed and reused?",
        answer:
          "Silicone and PVC wristbands with read/write chips (NTAG213, Mifare Classic 1K, DESFire) can be reprogrammed for reuse. This is common for gym memberships, resort guest wristbands, and recurring events. The chip supports 100,000+ write cycles. After each use, the wristband is sanitized and re-encoded. Fabric and Tyvek wristbands are designed for single use due to their tamper-evident closures. For reusable programs, we recommend silicone or adjustable PVC snap bands.",
      },
    ],
  },

  /* ── 5. RFID Labels & Inlays ────────────────────────────────── */
  {
    id: "labels",
    icon: "\u{1F3F7}\uFE0F",
    title: "RFID Labels & Inlays",
    description: "UHF and HF labels, inlays, and wet/dry inlays for logistics and retail.",
    color: "#e76f51",
    items: [
      {
        question: "What is the difference between an RFID inlay and an RFID label?",
        answer:
          "An RFID inlay is the raw functional component: a chip bonded to an antenna on a thin PET substrate. A \u201cdry inlay\u201d is just the inlay; a \u201cwet inlay\u201d adds a pressure-sensitive adhesive backing. An RFID label wraps the inlay inside a printable face material (paper, synthetic, polyester) with adhesive\u2014ready for direct application to products, cartons, or pallets. Labels can be printed with barcodes, text, or graphics using standard thermal-transfer printers like Zebra, SATO, or Honeywell.",
      },
      {
        question: "What UHF RFID chips are most popular for logistics labels?",
        answer:
          "The top chips for supply-chain labels are Impinj Monza R6-P (auto-tune for consistent performance on diverse materials), NXP UCODE 8/8m (extended memory, automotive and retail), and Alien Higgs-3 (cost-effective, 96-bit EPC + 512-bit user memory). For item-level retail tagging (RAIN RFID), Impinj M750 offers the industry\u2019s smallest footprint and highest sensitivity. Proud Tek can supply inlays or finished labels with any of these chip families.",
      },
      {
        question: "Can RFID labels be printed with a standard thermal printer?",
        answer:
          "Yes. RFID-enabled thermal-transfer printers (Zebra ZT411R, SATO CL4NX Plus, etc.) print and encode RFID labels in a single pass. The printer writes EPC data to the chip via its built-in UHF reader while simultaneously printing barcodes, text, and graphics on the label face. Proud Tek supplies labels on standard 3-inch core rolls that are compatible with these printers. We can also pre-encode the EPC on each label before shipment if you prefer.",
      },
      {
        question: "What read range can I expect from a UHF RFID label?",
        answer:
          "A typical UHF RFID label (e.g., Impinj Monza R6 on a 70 \u00d7 15 mm antenna) achieves 4\u20138 m read range in open air with a standard 30 dBm reader. On-metal labels with tuned antennas reach 2\u20135 m. Smaller inlays (e.g., 22 \u00d7 12 mm for item-level retail) deliver 1\u20133 m. Performance drops when the label is on or near liquids, metal, or densely packed products. We recommend pilot testing with your actual product packaging to confirm usable range.",
      },
      {
        question: "Are RFID labels suitable for food and pharmaceutical packaging?",
        answer:
          "Yes, with appropriate material selection. For food-contact applications, we use FDA-compliant adhesive and face materials. For pharmaceuticals, labels can include tamper-evident die-cuts that break when peeled, combined with NFC chips (NTAG424 DNA) for serialization and authentication. Our labels meet EU Regulation 1935/2004 for food-contact materials and can be produced in ISO 14644 Class 8 cleanroom conditions when required.",
      },
      {
        question: "What is the smallest RFID inlay available?",
        answer:
          "The smallest production UHF inlays measure approximately 8 \u00d7 8 mm (e.g., Impinj Monza M730/M750-based micro inlays). These are designed for item-level tagging of small items like eyewear, cosmetics, and jewelry. At HF/NFC, the smallest standard inlay is about 10 \u00d7 10 mm (NTAG213). Read range decreases with antenna size, so micro inlays typically achieve 0.5\u20131.5 m with UHF readers. Proud Tek stocks both standard and micro inlay formats.",
      },
      {
        question: "Can RFID labels withstand extreme temperatures?",
        answer:
          "Standard paper RFID labels operate from \u221240 \u00b0C to +80 \u00b0C. For higher temperatures, we offer polyester (PET) or polyimide (Kapton) face materials rated to +200 \u00b0C or beyond\u2014suitable for autoclave sterilization, engine parts, and industrial processes. Cryogenic labels for blood banks and pharmaceutical cold chains can withstand \u2212196 \u00b0C (liquid nitrogen). Adhesive selection is equally important: we match adhesive chemistry to your specific temperature profile.",
      },
      {
        question: "How are RFID inlays tested for quality?",
        answer:
          "Proud Tek performs 100% individual testing on all RFID inlays and labels. Each piece passes through an inline reader that verifies chip response, TID, EPC read/write, and minimum sensitivity threshold. Failed units are automatically rejected and replaced. We also conduct AQL 1.0 sampling inspection for print quality, adhesive peel strength, and dimensional accuracy. RF performance is validated against GS1/AIM specifications using Voyantic Tagformance test equipment.",
      },
      {
        question: "What is the typical order volume for RFID labels?",
        answer:
          "RFID labels are typically ordered in bulk. Our standard MOQ is 5,000 pieces for custom-printed labels and 1,000 pieces for blank labels with pre-encoded chips. High-volume customers (retail, logistics) order 100,000 to several million labels per batch. We supply labels on rolls (1,000\u20135,000 labels per roll on 3-inch or 6-inch cores), in sheets, or as fan-fold stacks depending on your printer and applicator requirements.",
      },
      {
        question: "Can RFID labels be applied automatically on a production line?",
        answer:
          "Yes. Our RFID labels are designed to work with standard label applicator machines (print-and-apply or apply-only). We ensure consistent roll tension, label spacing (gap or black-mark), and core compatibility for automated dispensing. For high-speed lines (200+ labels per minute), we recommend larger pitch distances and provide certified roll specifications. Proud Tek also offers integration support, connecting customers with applicator OEMs in their region.",
      },
    ],
  },

  /* ── 6. RFID Tags (Industrial) ──────────────────────────────── */
  {
    id: "industrial",
    icon: "\u{1F3ED}",
    title: "RFID Tags (Industrial)",
    description: "Rugged on-metal tags, laundry tags, animal ear tags, and harsh-environment solutions.",
    color: "#4a5568",
    items: [
      {
        question: "What are RFID on-metal tags and when are they needed?",
        answer:
          "On-metal RFID tags are specifically designed to perform on metallic surfaces. Standard RFID tags lose range or fail entirely on metal because the surface detunes the antenna and reflects the signal. On-metal tags incorporate a spacer or absorber layer (ceramic, foam, or ferrite) that isolates the antenna from the metal. Common applications include IT asset tracking (servers, laptops), manufacturing tool management, shipping container identification, and vehicle fleet tagging.",
      },
      {
        question: "What materials are used for industrial RFID tag housings?",
        answer:
          "Industrial tags use ruggedized housings such as ABS (general-purpose, IP65), polycarbonate (impact-resistant, transparent), ceramic (extreme heat, chemical resistance), epoxy (potted, waterproof), and stainless steel (autoclave and high-pressure washdown). The choice depends on the environment: ABS for warehouses and tools, ceramic for paint-shop ovens and autoclaves, epoxy for buried or underground assets, and stainless steel for food-processing equipment that undergoes CIP/SIP cycles.",
      },
      {
        question: "What is an RFID laundry tag?",
        answer:
          "An RFID laundry tag is a UHF transponder designed to survive commercial laundering cycles\u2014industrial washing at 60\u201395 \u00b0C, tumble drying up to 80 \u00b0C, ironing, and chemical dry-cleaning. They are encapsulated in silicone, PPS, or epoxy and sewn into, heat-sealed onto, or inserted into a pocket of each textile. Hotels, hospitals, and uniform services use laundry tags to automate linen sorting, inventory counting, and lifecycle tracking. Our tags survive 200+ wash cycles.",
      },
      {
        question: "Can RFID tags survive autoclave sterilization?",
        answer:
          "Yes, but only with appropriate housing materials. Ceramic and high-temperature PPS tags withstand autoclave conditions (134 \u00b0C, 2 bar, 18-minute cycles) for hundreds of cycles. These are used in hospitals for surgical instrument tracking and in pharmaceutical facilities for reusable container management. Standard ABS or silicone tags are not rated for autoclave temperatures. Proud Tek\u2019s ceramic UHF tag line (CeraTek series) is tested to 500+ autoclave cycles.",
      },
      {
        question: "What is an RFID animal ear tag?",
        answer:
          "RFID animal ear tags are used for livestock identification and traceability per government regulations (EU Regulation 21/2004, USDA RFID mandate). They embed an LF (134.2 kHz, ISO 11784/11785) or UHF transponder in a durable TPU ear tag that is applied to the animal at birth. The tag stores a unique 15-digit national animal ID. Proud Tek supplies both LF-only and dual-frequency (LF+UHF) ear tags for cattle, sheep, goats, and pigs.",
      },
      {
        question: "How do RFID tags perform in extreme cold environments?",
        answer:
          "Most RFID chips are rated for operation down to \u221240 \u00b0C, and specialty chips can function at \u221255 \u00b0C. The housing material matters more than the chip in extreme cold: materials must resist cracking and maintain adhesive bond. For cold-chain and frozen-food logistics, we use polyester-based labels with cryogenic adhesives or bolt-mount ABS tags. Ice or frost accumulation on the tag surface has minimal impact on UHF read performance but can slightly reduce HF/NFC range.",
      },
      {
        question: "Can RFID tags be embedded in concrete or asphalt?",
        answer:
          "Yes. Concrete-embeddable RFID tags (often called \u201cnail tags\u201d or \u201cdisk tags\u201d) are potted in epoxy and installed into drilled holes in concrete floors, bridge decks, runways, or road surfaces. They withstand crushing forces, vibration, and moisture. UHF versions achieve 1\u20133 m read range through concrete. Applications include infrastructure inspection, utility manhole identification, and indoor asset location. Proud Tek\u2019s epoxy-potted disk tags (30 mm diameter, IP68) are designed for this purpose.",
      },
      {
        question: "What IP rating should I look for in an industrial RFID tag?",
        answer:
          "IP65 is the minimum for most industrial environments\u2014it means the tag is dust-tight and protected against water jets. IP67 (temporary immersion to 1 m) is recommended for outdoor, washdown, and logistics applications. IP68 (continuous immersion beyond 1 m) is needed for underground, marine, or pressure-washdown environments. All Proud Tek industrial tags carry at least IP65, with our ceramic and epoxy lines rated at IP68.",
      },
      {
        question: "How are industrial RFID tags mounted?",
        answer:
          "Mounting methods include: adhesive (3M VHB or industrial-grade acrylic for flat surfaces), screw/bolt-mount (through-holes or flanges for permanent attachment), cable ties (zip-tie slots for pipes and conduits), magnet-mount (for temporary placement on steel), rivet-mount (for vehicle chassis), and embed (epoxy potting into drilled holes). Tag design determines mounting options. Proud Tek can customize tag housing to include your preferred mounting method at no additional tooling cost for standard modifications.",
      },
      {
        question: "What is the read range of an industrial UHF RFID tag?",
        answer:
          "Industrial UHF tags typically achieve 3\u201315 m read range depending on tag size, chip, mounting surface, and reader power. Larger tags (100 \u00d7 20 mm) with Impinj Monza R6 chips on metal surfaces can reach 8\u201312 m. Smaller tags (30 \u00d7 10 mm) on metal typically deliver 2\u20134 m. Free-air (non-metal) performance is usually 20\u201330% better. Proud Tek provides a guaranteed minimum read-range specification for each tag model, tested on the intended surface type.",
      },
    ],
  },

  /* ── 7. RFID Keyfobs & Readers ──────────────────────────────── */
  {
    id: "keyfobs",
    icon: "\u{1F511}",
    title: "RFID Keyfobs & Readers",
    description: "Keyfobs for access control and RFID reader hardware.",
    color: "#0891b2",
    items: [
      {
        question: "What chip types are available in RFID keyfobs?",
        answer:
          "Proud Tek keyfobs support all major LF and HF chips: EM4100 and EM4200 (LF 125 kHz, read-only, widely compatible with legacy access systems), T5577 (LF, multi-format programmable\u2014can emulate EM4100, HID Prox, Indala), Mifare Classic 1K/4K (HF 13.56 MHz, standard access control), Mifare DESFire EV2/EV3 (HF, high security), and NTAG213/216 (NFC, smartphone compatible). Dual-frequency keyfobs combining LF + HF are also available.",
      },
      {
        question: "What materials and shapes are RFID keyfobs made from?",
        answer:
          "Standard keyfobs use ABS plastic in teardrop, rectangular, or disc shapes with a key-ring hole. We also produce epoxy keyfobs (drip-cast, glossy finish, fully waterproof, available in any Pantone color), silicone keyfobs (soft-touch, child-safe), leather keyfobs (premium look for corporate clients), and wood keyfobs (eco-friendly). Custom mold design is available for unique shapes. Minimum order for custom-mold keyfobs is 2,000 pieces.",
      },
      {
        question: "Can RFID keyfobs be cloned from existing cards?",
        answer:
          "T5577 keyfobs can be programmed to emulate most LF card formats (EM4100, HID Prox 26-bit, Indala) using a portable cloner or desktop programmer. This is commonly used when a building manager needs to issue keyfobs to tenants who already have card credentials. However, HF chips with encrypted sectors (Mifare Classic sector keys, DESFire AES keys) cannot be cloned without the secret keys. For security, we recommend DESFire-based keyfobs to prevent unauthorized duplication.",
      },
      {
        question: "What types of RFID readers does Proud Tek supply?",
        answer:
          "We supply desktop USB readers (ACR122U, ACR1252U for NFC development and encoding), wall-mount access control readers (Wiegand 26/34 output, compatible with most access panels), long-range UHF readers (fixed and handheld, 1\u201312 m range for warehouse and logistics), embedded reader modules (for OEM integration), and mobile Bluetooth readers (for inventory management on the go). All readers ship with SDK documentation and sample code.",
      },
      {
        question: "What is a Wiegand interface and why does it matter for access control?",
        answer:
          "Wiegand is the dominant communication protocol between RFID readers and access control panels. Wiegand 26-bit sends a 24-bit card number plus 2 parity bits over two data wires. Wiegand 34-bit extends this to 32 data bits for larger card populations. Most commercial access control panels (Honeywell, Lenel, Gallagher, HID) accept Wiegand input. When ordering keyfobs or cards, ensure the chip format matches your panel\u2019s Wiegand bit length and facility code.",
      },
      {
        question: "Can I use a smartphone as an RFID reader?",
        answer:
          "Modern smartphones with NFC (iPhone 7+, most Android phones) can read HF/NFC tags at 13.56 MHz. This is sufficient for NTAG-based access systems, NFC business cards, and smart posters. However, smartphones cannot read LF (125 kHz) tags or UHF (860\u2013960 MHz) tags. For UHF, external Bluetooth readers (e.g., Zebra RFD40, TSL 1128) pair with the smartphone. Proud Tek can help you choose the right reader-tag combination for your mobile workflow.",
      },
      {
        question: "How far can a fixed UHF RFID reader scan?",
        answer:
          "Fixed UHF readers with external antennas typically scan 3\u201312 m depending on antenna gain, cable loss, and reader power output (up to 33 dBm EIRP in most regions). Circular-polarized antennas provide consistent reads regardless of tag orientation, while linear-polarized antennas offer longer range when tag alignment is controlled. For dock-door, conveyor, or vehicle-gate applications, Proud Tek recommends 4-port readers with 9 dBi antennas for optimal coverage.",
      },
      {
        question: "What is the difference between a proximity reader and a smart-card reader?",
        answer:
          "A proximity reader reads LF (125 kHz) cards like EM4100 or HID Prox\u2014it only reads the card\u2019s fixed ID number with no encryption or mutual authentication. A smart-card reader operates at HF (13.56 MHz) and supports encrypted communication with chips like Mifare DESFire or iCLASS SE. Smart-card readers provide much higher security because the card and reader authenticate each other before exchanging data. Upgrading from proximity to smart-card readers is the most impactful step in hardening physical access security.",
      },
      {
        question: "Can Proud Tek provide custom-branded RFID readers?",
        answer:
          "Yes. We offer OEM and white-label reader solutions. Options include custom housing colors, laser-engraved logos, custom LED indicators, branded packaging, and firmware pre-loaded with your facility codes. For larger volumes (1,000+ units), we can develop custom plastic molds for a completely unique reader enclosure. Readers are supplied with your company\u2019s branding on all documentation, SDK materials, and product labels.",
      },
      {
        question: "How do I choose between Wiegand and OSDP for my access control reader?",
        answer:
          "Wiegand is the legacy standard\u2014simple, universal, but unencrypted and unidirectional (reader to panel only). OSDP (Open Supervised Device Protocol) is the modern replacement: it supports AES-128 encrypted bidirectional communication, allows panel-to-reader commands (e.g., LED/buzzer control), and enables reader firmware updates over the wire. For new installations, OSDP is strongly recommended. For retrofit projects, Wiegand remains practical since most existing panels support it. Proud Tek readers support both protocols.",
      },
    ],
  },

  /* ── 8. Ordering & Customization ────────────────────────────── */
  {
    id: "ordering",
    icon: "\u{1F4E6}",
    title: "Ordering & Customization",
    description: "MOQs, lead times, samples, pricing, and shipping information.",
    color: "#b45309",
    items: [
      {
        question: "What is Proud Tek\u2019s standard production lead time?",
        answer:
          "Standard production lead time is 7\u201315 working days after artwork approval and payment confirmation. Simple products (blank white cards, standard keyfobs) ship in 5\u20137 days. Complex orders (custom-mold wristbands, multi-step printing, pre-encoding) require 10\u201315 days. Rush production is available with a 15\u201325% surcharge, reducing lead time to 3\u20137 days. We provide a detailed production schedule with milestones at order confirmation.",
      },
      {
        question: "Does Proud Tek provide free samples?",
        answer:
          "Yes. We provide free samples for most standard products\u2014typically 3\u20135 pieces per product type. Samples include the actual chip you intend to use so your integrator can test compatibility. Custom-printed samples incur a small setup fee ($30\u2013$80) for artwork preparation, which is credited against your production order. Sample delivery takes 3\u20135 days via DHL/FedEx. Request samples through our website contact form or email sales@proudtek.com.",
      },
      {
        question: "What payment methods does Proud Tek accept?",
        answer:
          "We accept bank wire transfer (T/T), PayPal, credit card (via PayPal or Stripe), and Western Union. For new customers, we typically require 50% deposit before production with the balance due before shipment. Established customers with good payment history may qualify for NET 30 terms. Letter of Credit (L/C) is accepted for orders above $10,000. All prices are quoted FOB Shenzhen or CIF to your destination port.",
      },
      {
        question: "What shipping options are available?",
        answer:
          "We ship worldwide via DHL, FedEx, UPS, and TNT for express delivery (3\u20135 business days to most destinations). Sea freight is available for large orders (delivery in 18\u201330 days depending on destination). Air freight offers a middle ground (7\u201310 days, more cost-effective than express for 50\u2013500 kg shipments). We handle all export documentation, including commercial invoices, packing lists, and certificates of origin. Dangerous goods documentation is not required for passive RFID products.",
      },
      {
        question: "Can I get a custom quote for my project?",
        answer:
          "Absolutely. Send us your project requirements including: product type, chip type, quantity, customization needs (printing, encoding, packaging), and delivery destination. We typically respond with a detailed quotation within 24 hours on business days. For complex projects, our engineering team may schedule a call to clarify specifications. Quotes include unit price, tooling fees (if any), sample costs, and estimated shipping. All quotes are valid for 30 days.",
      },
      {
        question: "What file formats does Proud Tek accept for artwork?",
        answer:
          "We prefer Adobe Illustrator (.AI) or PDF files with text converted to outlines and images at 300+ DPI. We also accept PSD (Photoshop), CDR (CorelDRAW), and high-resolution PNG/JPEG files. For best results, provide artwork in CMYK color mode with 3 mm bleed. Our design team offers free artwork adjustment and layout services\u2014if you send your logo and brand guidelines, we can create the print file for you at no charge.",
      },
      {
        question: "Does Proud Tek offer OEM and white-label manufacturing?",
        answer:
          "Yes. Many of our customers are system integrators, distributors, and brand owners who sell under their own labels. We provide full white-label service including custom packaging (boxes, bags, blister packs), branded user manuals, custom product labels, and private-label invoicing. NDAs are available upon request. We currently white-label for over 100 brands across 50+ countries and maintain strict confidentiality between competing customers.",
      },
      {
        question: "What quality control process does Proud Tek follow?",
        answer:
          "Our QC process includes: (1) Incoming material inspection\u2014chip wafers, PVC sheets, and antenna substrates are tested upon receipt. (2) In-process inspection\u2014RF performance is tested after antenna bonding and lamination. (3) 100% individual testing\u2014every finished tag/card passes through an inline reader to verify chip function. (4) AQL sampling\u2014print quality, dimensions, and cosmetic appearance are inspected per ISO 2859-1 at AQL 1.0. (5) Pre-shipment photos and test reports are shared with the customer.",
      },
      {
        question: "Can Proud Tek handle large-volume orders (millions of units)?",
        answer:
          "Yes. Our factory in Shenzhen has a monthly capacity of 10+ million RFID cards, 5+ million labels/inlays, and 2+ million wristbands. For very large orders, we provide a phased delivery schedule to match your deployment timeline. Volume pricing tiers apply: significant per-unit cost reductions begin at 10,000 units, with additional breaks at 50,000, 100,000, and 500,000+ units. We assign a dedicated project manager for orders exceeding 100,000 pieces.",
      },
      {
        question: "What happens if there is a quality issue with my order?",
        answer:
          "Proud Tek stands behind every shipment with a full quality guarantee. If defective units are found, we offer replacement at no cost or a proportional refund\u2014whichever you prefer. Claims must be submitted within 30 days of receipt with photos or test data showing the defect. For critical deployments, we recommend ordering 2\u20133% overage, which we supply at cost. Our historical defect rate is below 0.3%, verified by third-party QC audits.",
      },
    ],
  },

  /* ── 9. Technical Specifications ────────────────────────────── */
  {
    id: "technical",
    icon: "\u{2699}\uFE0F",
    title: "Technical Specifications",
    description: "Chip memory, frequencies, protocols, encoding, and performance data.",
    color: "#6366f1",
    items: [
      {
        question: "What is the memory capacity of common RFID chips?",
        answer:
          "Memory varies by chip family. LF chips: EM4100 has 64-bit read-only ID; T5577 has 330 bits of read/write memory. HF chips: Mifare Classic 1K has 1,024 bytes (16 sectors); Mifare DESFire EV2 offers 2, 4, or 8 KB. NFC chips: NTAG213 provides 144 bytes user memory; NTAG216 provides 888 bytes. UHF chips: Impinj Monza R6 has 96-bit EPC + 32-bit user memory; NXP UCODE 8 has 96-bit EPC + 128-bit user memory. Choose your chip based on how much data you need to store on the tag vs. in your backend database.",
      },
      {
        question: "What is EPC and TID on a UHF RFID chip?",
        answer:
          "EPC (Electronic Product Code) is the primary user-writable identifier on a UHF chip\u2014typically 96 bits (12 bytes), sufficient for a globally unique item-level code. The EPC bank can be written and rewritten. TID (Tag Identifier) is a factory-programmed, read-only serial number unique to each chip die. TID is used for chip authentication and cannot be cloned. Most inventory systems use EPC for item identification and TID for tag verification.",
      },
      {
        question: "What communication protocols do RFID systems use?",
        answer:
          "LF tags typically use proprietary modulation (Manchester, Biphase) without a standardized air interface. HF tags follow ISO 14443 Type A/B (for Mifare, DESFire, and NFC) or ISO 15693 (for ICODE SLIX, Tag-it). NFC adds the NDEF messaging format on top of ISO 14443. UHF tags follow EPC Gen2 (ISO 18000-63/GS1 EPC UHF Gen2v2), which defines the air interface, anti-collision, and security features. Reader-to-host communication uses protocols like LLRP, serial, TCP/IP, or USB HID.",
      },
      {
        question: "What is the operating temperature range for RFID chips?",
        answer:
          "Most RFID chips are rated for \u221240 \u00b0C to +85 \u00b0C operating temperature and \u221255 \u00b0C to +125 \u00b0C storage temperature. Specialty chips for automotive and industrial applications (NXP UCODE DNA, Impinj M700 in ATC packages) extend to \u221240 \u00b0C to +150 \u00b0C or higher. However, the tag\u2019s overall temperature rating depends on the housing and adhesive\u2014a PVC card will deform above 80 \u00b0C even though its chip is rated higher. Always specify your application\u2019s temperature range when ordering.",
      },
      {
        question: "What is the data retention period for RFID chips?",
        answer:
          "Non-volatile memory in RFID chips retains data for a minimum of 10 years at room temperature, with most manufacturers specifying 20\u201350 years depending on the chip family. Write endurance is typically 100,000 cycles for NFC chips (NTAG series) and 100,000\u20131,000,000 cycles for UHF EPC bank writes. Data retention decreases at elevated temperatures\u2014for high-temperature applications, verify the chip\u2019s data retention specification at your operating temperature.",
      },
      {
        question: "What is the difference between ISO 14443 and ISO 15693?",
        answer:
          "Both are HF (13.56 MHz) standards but serve different purposes. ISO 14443 operates at close range (up to 10 cm), supports high data rates (106\u2013848 kbps), and is used for payment cards, passports, and access control (Mifare, DESFire). ISO 15693 operates at longer range (up to 1.5 m with dedicated readers), uses lower data rates (26 kbps), and is designed for item management (library books, laundry, industrial assets). If you need smartphone compatibility, choose ISO 14443/NFC.",
      },
      {
        question: "What is NDEF and how does it relate to NFC tags?",
        answer:
          "NDEF (NFC Data Exchange Format) is a lightweight binary message format defined by the NFC Forum. It packages data (URLs, text, vCards, Wi-Fi credentials) into standardized records that any NFC-enabled device can interpret without custom software. An NDEF-formatted NFC tag can be read by any Android or iOS phone out of the box. Proud Tek ships NFC tags either NDEF-formatted and blank (ready to write) or pre-encoded with your specific NDEF records.",
      },
      {
        question: "What is the difference between NTAG and Mifare chip families?",
        answer:
          "Both are manufactured by NXP. NTAG (210, 213, 215, 216, 424 DNA) is designed specifically for NFC applications\u2014simple memory structure, NDEF-compatible, optimized for smartphone interaction. Mifare (Classic, Plus, DESFire) targets access control and transit with sector-based memory, encryption, and multi-application support. For NFC stickers, tags, and marketing, use NTAG. For door locks, payment, and transit cards, use Mifare. DESFire EV3 is the most versatile\u2014it supports both NFC/NDEF and secure sector-based access.",
      },
      {
        question: "How does RFID anti-collision work?",
        answer:
          "Anti-collision allows a reader to identify multiple tags in its field without signal interference. UHF systems use a probabilistic slotted-ALOHA algorithm (per EPC Gen2)\u2014the reader assigns time slots and tags randomly respond in different slots, with retries for collisions. HF systems (ISO 14443) use a binary search tree algorithm where the reader progressively narrows down tag UIDs. These protocols enable hundreds of tags to be read within seconds in dense populations.",
      },
      {
        question: "What is chip sensitivity and why does it affect read range?",
        answer:
          "Chip sensitivity, measured in dBm, indicates the minimum power the chip needs to activate and respond. A lower (more negative) number means better sensitivity. For example, Impinj M750 has \u221223.5 dBm sensitivity vs. \u221220 dBm for older chips\u2014this 3.5 dB difference translates to roughly 50% longer read range with the same reader power. When maximum range is critical, choose chips with the best (lowest) sensitivity rating and pair them with high-gain antennas.",
      },
    ],
  },

  /* ── 10. Compliance & Standards ─────────────────────────────── */
  {
    id: "compliance",
    icon: "\u{2705}",
    title: "Compliance & Standards",
    description: "Certifications, regulations, environmental standards, and export requirements.",
    color: "#059669",
    items: [
      {
        question: "What quality certifications does Proud Tek hold?",
        answer:
          "Proud Tek\u2019s factory is ISO 9001:2015 certified for quality management, ISO 14001:2015 certified for environmental management, and IATF 16949 certified for automotive-quality production processes. Our products carry CE marking for the European market, FCC Part 15 compliance for the US, and IC certification for Canada. Individual product lines hold additional certifications including RoHS, REACH, and CPSIA (for children\u2019s products). Certificates are available for download or upon request.",
      },
      {
        question: "Are Proud Tek\u2019s RFID products RoHS compliant?",
        answer:
          "Yes. All Proud Tek RFID products comply with EU Directive 2011/65/EU (RoHS 2) and its amendment 2015/863 (RoHS 3), restricting lead, mercury, cadmium, hexavalent chromium, PBB, PBDE, and four phthalates (DEHP, BBP, DBP, DIBP). We maintain material declarations and third-party test reports (SGS, Intertek, TUV) for all raw materials. RoHS certificates specific to your order can be provided upon request.",
      },
      {
        question: "Do RFID products require CE marking for sale in Europe?",
        answer:
          "Yes. Passive RFID tags sold in the EU must comply with the Radio Equipment Directive (RED) 2014/53/EU if they operate at UHF frequencies, or the EMC Directive 2014/30/EU for HF/LF products. CE marking confirms conformity with essential requirements for radio, EMC, safety, and health. Proud Tek handles CE testing and certification for all our standard products and can perform testing for custom designs. Declaration of Conformity (DoC) documents are supplied with each shipment.",
      },
      {
        question: "What FCC regulations apply to RFID in the United States?",
        answer:
          "In the US, passive UHF RFID tags and readers must comply with FCC Part 15. Tags operating at 902\u2013928 MHz (US UHF band) fall under Part 15.247 or 15.249 depending on power level. Readers require FCC certification (not just declaration). HF and LF RFID devices fall under Part 15.225 (13.56 MHz) and Part 15.209 (125 kHz) respectively, typically requiring only Supplier\u2019s Declaration of Conformity. Proud Tek\u2019s standard products are FCC-listed and ready for US market deployment.",
      },
      {
        question: "What is GS1 EPC encoding and is it required for retail?",
        answer:
          "GS1 EPC (Electronic Product Code) is a standardized numbering scheme that encodes a product\u2019s GTIN (barcode number) onto a UHF RFID tag\u2019s EPC memory bank. Major retailers (Walmart, Macy\u2019s, Decathlon, Inditex/Zara) require suppliers to apply RAIN RFID labels with GS1-compliant SGTIN-96 encoding at the item level. Proud Tek can pre-encode GS1 EPCs onto labels using your company\u2019s GS1 prefix and serialization scheme, ready for application at your factory or DC.",
      },
      {
        question: "Does Proud Tek comply with REACH regulations?",
        answer:
          "Yes. We comply with EU REACH Regulation (EC) No. 1907/2006 and maintain an updated SVHC (Substances of Very High Concern) declaration based on the latest ECHA Candidate List. Our raw materials are tested for SVHC content by accredited laboratories, and all substances are below the 0.1% (w/w) threshold. REACH compliance statements and supporting test reports are available for your supply-chain due-diligence requirements.",
      },
      {
        question: "What is ISO 18000 and how does it relate to RFID?",
        answer:
          "ISO 18000 is a family of air-interface standards for RFID. ISO 18000-2 covers LF (below 135 kHz), ISO 18000-3 covers HF (13.56 MHz), and ISO 18000-63 (formerly 18000-6C) covers UHF RAIN RFID (860\u2013960 MHz, equivalent to EPC Gen2v2). These standards define the radio communication protocol between readers and tags. When specifying RFID tags, referencing the appropriate ISO 18000 part ensures interoperability between different vendors\u2019 tags and readers.",
      },
      {
        question: "Are there restrictions on shipping RFID products internationally?",
        answer:
          "Passive RFID products are not classified as dangerous goods and have no IATA/ICAO shipping restrictions for air freight. However, UHF frequency allocations vary by region: 902\u2013928 MHz in the Americas, 865\u2013868 MHz in Europe, 920\u2013925 MHz in China/Japan. Tags designed for one region may not work optimally in another. Proud Tek manufactures region-specific UHF tags or global-band tags (860\u2013960 MHz compatible) to ensure compliance with your destination market\u2019s radio regulations.",
      },
      {
        question: "What environmental certifications are relevant for RFID products?",
        answer:
          "Key environmental certifications include: RoHS (hazardous substance restriction), REACH (chemical safety), WEEE (waste electrical and electronic equipment disposal\u2014applies to readers, not passive tags), FSC (for paper-based label face stocks from sustainable forestry), and ISO 14001 (environmental management system). For specific markets: California Proposition 65, CPSIA (US children\u2019s products), and EN 71 (EU toy safety) may apply. Proud Tek can advise which certifications your project requires.",
      },
      {
        question: "How does Proud Tek handle data privacy regulations (GDPR, etc.)?",
        answer:
          "While RFID tags themselves don\u2019t process personal data, the systems that use them may. Proud Tek does not access, store, or process any end-user personal data. Our encoding services use only serial numbers, EPCs, or URLs provided by the customer\u2014never personally identifiable information. For customers concerned about GDPR, CCPA, or other privacy regulations, we recommend encrypting any personal data stored on writable chips and conducting a Data Protection Impact Assessment (DPIA) for your deployment.",
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════════════ */

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* ═══════════════════════════════════════════════════════════════════
   Public: inject new FAQ page content into the main element
   Called from seo.ts enhanceFaqPage
   ═══════════════════════════════════════════════════════════════════ */

export function injectFaqPageContent($body: CheerioAPI): void {
  const sidebar = $body("aside.primary-sidebar, .widget-area").first();
  if (sidebar.length) sidebar.remove();
  const contentCol = $body(".content-area, .site-content > .ast-container > div").first();
  if (contentCol.length) {
    contentCol.css("width", "100%").css("max-width", "100%").css("float", "none");
  }

  const main = $body("main#main, main.site-main").first();
  if (!main.length) return;

  const categoryNav = FAQ_CATEGORIES.map(
    (cat) => `
    <a href="#${cat.id}" class="codex-faq-cat-card" style="--cat-color: ${cat.color}">
      <span class="codex-faq-cat-card__icon">${cat.icon}</span>
      <span class="codex-faq-cat-card__title">${esc(cat.title)}</span>
      <span class="codex-faq-cat-card__count">${cat.items.length} questions</span>
    </a>`,
  ).join("");

  const categorySections = FAQ_CATEGORIES.map(
    (cat, catIndex) => `
    <section class="codex-faq-category ${catIndex % 2 === 1 ? "codex-faq-category--alt" : ""}" id="${cat.id}">
      <div class="codex-faq-category__header">
        <span class="codex-faq-category__icon">${cat.icon}</span>
        <div>
          <h2 class="codex-faq-category__title">${esc(cat.title)}</h2>
          <p class="codex-faq-category__desc">${esc(cat.description)}</p>
        </div>
      </div>
      <div class="codex-faq-items">
        ${cat.items
          .map(
            (item, i) => `
          <details class="codex-faq-item" data-category="${cat.id}" data-question="${esc(item.question.toLowerCase())}">
            <summary>
              <span class="codex-faq-item__num">${String(i + 1).padStart(2, "0")}</span>
              <span class="codex-faq-item__q">${esc(item.question)}</span>
              <span class="codex-faq-item__chevron"></span>
            </summary>
            <div class="codex-faq-item__answer">
              <p>${esc(item.answer)}</p>
            </div>
          </details>`,
          )
          .join("")}
      </div>
    </section>`,
  ).join("");

  const totalQuestions = FAQ_CATEGORIES.reduce((sum, cat) => sum + cat.items.length, 0);

  main.html(`
    <div class="codex-faq-page">
      <section class="codex-faq-hero">
        <div class="codex-faq-hero__inner">
          <nav class="codex-editorial-trail" aria-label="Breadcrumb">
            <a href="/">Home</a><span>/</span><span aria-current="page">FAQ</span>
          </nav>
          <h1 class="codex-faq-hero__title">Frequently Asked Questions</h1>
          <p class="codex-faq-hero__subtitle">Answers to ${totalQuestions} common questions about RFID cards, NFC tags, wristbands, labels, and more &mdash; from Proud&nbsp;Tek, your RFID manufacturing&nbsp;partner.</p>
          <div class="codex-faq-hero__search">
            <input type="text" id="faqSearch" class="codex-faq-search-input" placeholder="Search questions&hellip; e.g. hotel key card, read range, MOQ" autocomplete="off">
            <span class="codex-faq-search-icon">&#128269;</span>
          </div>
          <div class="codex-faq-hero__stats">
            <span><strong>${totalQuestions}</strong> Questions</span>
            <span><strong>${FAQ_CATEGORIES.length}</strong> Categories</span>
            <span><strong>10+</strong> Years Expertise</span>
          </div>
        </div>
      </section>

      <section class="codex-faq-nav">
        <div class="codex-faq-nav__grid">
          ${categoryNav}
        </div>
      </section>

      <div class="codex-faq-body" id="faqBody">
        <p class="codex-faq-no-results" id="faqNoResults" style="display:none;">No questions match your search. Try a different keyword or <a href="/contact/">contact us directly</a>.</p>
        ${categorySections}
      </div>

      <section class="codex-faq-cta">
        <div class="codex-faq-cta__inner">
          <h2>Didn&rsquo;t find your answer?</h2>
          <p>Our RFID engineers are ready to help with your specific project requirements, chip selection, or custom design needs.</p>
          <div class="codex-faq-cta__buttons">
            <a href="/contact/" class="codex-faq-cta__btn codex-faq-cta__btn--primary">Contact Our Team</a>
            <a href="mailto:sales@proudtek.com" class="codex-faq-cta__btn codex-faq-cta__btn--secondary">Email sales@proudtek.com</a>
          </div>
        </div>
      </section>
    </div>
  `);
}

/**
 * Returns all 100 FAQ entries as {question, answer} pairs for JSON-LD injection.
 */
export function getAllFaqEntries(): Array<{ question: string; answer: string }> {
  return FAQ_CATEGORIES.flatMap((cat) => cat.items);
}
