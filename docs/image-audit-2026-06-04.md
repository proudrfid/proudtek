# Image Audit — aggregated results

## Summary
- Results recorded: 400 / 400 inspectable heroes
- Topic mismatches: 42 · competitor logos: 15 · clean: 344
- Broken hero (file missing): 0 · no explicit hero: 0

## Topic mismatches (Check A)
### coconut-shell-rfid-wristbands-eco (blog)
- file: src/content/editorial/blog/coconut-shell-rfid-wristbands-eco.json · hero: /landing-images/coconut-shell-rfid-wristbands-eco-hero.jpg
- shows: Two clasped wrists at an outdoor festival; the visible band is a disposable green paper/Tyvek event wristband printed with the third-party URL 'pulseiravirtual.com.br'.
- why: Image shows a generic disposable paper festival wristband — the throwaway product the article explicitly contrasts against ('designed to be thrown away ... this one is designed to be kept') — and shows no RFID/NFC, coconut, or eco material. Page is about a keepable eco coconut-shell RFID/NFC wristband.
- ✅ replaced → /landing-images/coconut-shell-rfid-wristbands-eco-hero.jpg  (Proudtek own asset (no external license/attribution) · Proudtek · public/landing-images/fabric-rfid-wristband.jpg (existing Proudtek asset: woven fabric festival wristbands fitted with natural wood / coconut-shell RFID tokens, on clean white background))
- queries: "festival wristband", "rfid wristband", "nfc wristband", "fabric wristband"

### desfire-ev1-vs-ev2-vs-ev3 (blog)
- file: src/content/editorial/blog/desfire-ev1-vs-ev2-vs-ev3.json · hero: /landing-images/desfire-ev1-vs-ev2-vs-ev3-hero.jpg
- shows: Macro close-up of contact EMV payment/credit cards — a dark grey card with an embossed account number ('012 324...') and a gold contact chip pad, an orange card behind it, resting on a keyboard.
- why: Image shows a contact EMV banking card (gold contact pad + embossed PAN); the page is about NXP MIFARE DESFire contactless RFID smart cards for access-control and transit. Wrong interface technology (contact vs contactless) and wrong application domain (banking payment vs access/transit). The page's own alt text ('stack of white smart cards') also does not describe the current pixels.
- ✅ replaced → /landing-images/desfire-ev1-vs-ev2-vs-ev3-hero.jpg  (CC BY 2.0 · Payton Chung · https://www.flickr.com/photos/41813589@N00/2222047425)
- queries: "contactless smart card", "access control card", "key card"

### hotel-key-card-suppliers-guide (blog)
- file: src/content/editorial/blog/hotel-key-card-suppliers-guide.json · hero: /blog-images/hotel-key-card-suppliers-guide.jpg
- shows: Hero: rows of green PCB circuit boards with push-button switches in plastic packaging trays on an electronics production line.
- why: Section image hotel-front-desk.jpg is a CLEAR mismatch: it shows a kitchen cutting board with a chef's knife and a bunch of green herbs (a food flat-lay), not a hotel front desk or RFID key cards. The hero (PCB/electronics manufacturing line) is borderline — generic 'factory/production line' reads as on-theme for a supplier-selection guide, so left as-is; section 0 (resort pool) is on-theme/clean.

### how-to-program-nfc-tags (blog)
- file: src/content/editorial/blog/how-to-program-nfc-tags.json · hero: /landing-images/how-to-program-nfc-tags-hero.jpg
- shows: A smartphone on a wooden table displaying a COVID-19 contact-tracing app ('Contact detection — Is switched on', with Tested/New cases/Deceased counts and a Share app button).
- why: image shows a COVID-19 contact-tracing phone app; page is a technical guide on programming NFC tags and stickers (NDEF, encoding tools, batch encoding). No NFC tag, sticker, or encoding workflow appears. Section image /blog-images/program-nfc.jpg is also off-topic (a laptop glowing in a dark room) but the pipeline only repoints the hero.
- ✅ replaced → /landing-images/how-to-program-nfc-tags-hero.jpg  (CC BY-SA 4.0 · Sraleppal · https://commons.wikimedia.org/w/index.php?curid=36707221)
- queries: "NFC sticker", "NFC tag", "NFC antenna", "RFID inlay", "contactless phone", "smartphone NFC", "NFC chip"

### magnetic-stripe-vs-rfid-hotel-cards (blog)
- file: src/content/editorial/blog/magnetic-stripe-vs-rfid-hotel-cards.json · hero: /landing-images/magnetic-stripe-vs-rfid-hotel-cards-hero.jpg
- shows: A hand fans out four consumer bank payment cards (a Visa Debit card with contactless symbol, two Mastercards, and a red GPN card) against a white background.
- why: Image shows consumer bank/credit payment cards (Visa/Mastercard/GPN); page is a procurement comparison of magnetic-stripe vs RFID hotel KEY cards — a different product category. Replaced with a real magnetic-stripe hotel key card.
- ✅ replaced → /landing-images/magnetic-stripe-vs-rfid-hotel-cards-hero.jpg  (CC BY-SA 3.0 · Jackie · https://commons.wikimedia.org/w/index.php?curid=25025526)
- queries: "hotel key card"

### nfc-product-authentication (blog)
- file: src/content/editorial/blog/nfc-product-authentication.json · hero: /landing-images/nfc-product-authentication-hero.jpg
- shows: A hand holding a smartphone tapping it against a card-payment POS terminal at a checkout; the phone screen shows a payment/wallet card.
- why: Image shows a contactless mobile-PAYMENT transaction at a POS terminal; page is about NFC tags embedded in products/packaging for tap-to-verify AUTHENTICATION / anti-counterfeiting. Different NFC application (payment != authentication) — clear mismatch (the page's own alt text says 'tapping a product package', which the pixels do not show). NOTE: the lone section image (/blog-images/product-auth.jpg, alt 'NFC tag embedded in luxury product packaging') is ALSO off-topic — it shows a person browsing a Facebook profile on a MacBook while holding a phone; the replace pipeline only swaps the hero, so the section image still needs a human fix.
- ✅ replaced → /landing-images/nfc-product-authentication-hero.jpg  (CC BY 2.0 · melanie_hughes · https://www.flickr.com/photos/22658750@N02/4253803022)
- queries: "NFC tag product", "phone scanning product", "NFC smartphone", "product authentication", "RFID tag", "RFID label", "smart packaging"

### nfc-tap-google-review (blog)
- file: src/content/editorial/blog/nfc-tap-google-review.json · hero: /landing-images/nfc-tap-google-review-hero.jpg
- shows: A top-down café scene: a hand holding a smartphone taps a handheld card payment terminal (POS/PDQ) held by a second hand, next to a cup of coffee on a marble table.
- why: image shows a contactless mobile PAYMENT at a POS terminal (different product category + action); page is about NFC tap-to-Google-REVIEW tags/cards/table stands — no review tag, Google prompt or star rating appears in the photo.
- ✅ replaced → /landing-images/nfc-tap-google-review-hero.jpg  (internal / Proudtek own asset (no external license required for a local --src) · Proudtek · public/landing-images/nfc-table-stand.jpg (internal on-topic asset — an actual NFC Google-review table stand; aligns with this page's own imageSourceRoutes → /products/rfid-labels/nfc-table-stand/))
- queries: "NFC tag tap", "(then chose an on-topic internal asset over weak Openverse transit-NFC hits)"

### rfid-event-wristband-revenue-impact (blog)
- file: src/content/editorial/blog/rfid-event-wristband-revenue-impact.json · hero: /landing-images/rfid-event-wristband-revenue-impact-hero.jpg
- shows: A close-up of a wrist wearing a smartwatch (an Apple Watch with a white silicone band) being tapped on a black handheld card-payment terminal at a retail-style counter, with a laptop in the background.
- why: Image shows a consumer smartwatch making a contactless payment at a retail counter; page is about RFID/NFC cashless WRISTBANDS at events/festivals driving attendee spending. Different product category (Apple Watch smartwatch != passive RFID event wristband) and setting (retail != event), and no event wristband appears at all. Moderate mismatch: the cashless-tap-to-pay mechanic does overlap thematically, but the specific product the article sells is absent and replaced by a premium consumer device Proudtek does not make.
- ✅ replaced → /landing-images/rfid-event-wristband-revenue-impact-hero.jpg  (in-repo own asset — no external license · ? · public/landing-images/cashless-payment-rfid-wristband.jpg (in-repo own asset reused via --src; clean unbranded cashless RFID event wristbands — the actual product, vs the Apple Watch payment shot). The earlier swap was HELD only for lack of a better Openverse candidate; this in-repo asset the peer hadn't considered is a clear improvement. Pixel-verified.)
- queries: "festival wristband", "rfid wristband", "nfc wristband", "music festival", "event wristband", "cashless payment wristband", "festival payment"

### rfid-reader-not-detecting-tags-troubleshooting (blog)
- file: src/content/editorial/blog/rfid-reader-not-detecting-tags-troubleshooting.json · hero: /landing-images/rfid-reader-not-detecting-tags-troubleshooting-hero.jpg
- shows: A vintage Soviet-era analog oscilloscope (model С1-93, 'СДЕЛАНО В СССР'/Made in USSR, Cyrillic-labelled controls) with a green CRT trace, knobs and toggle switches; no RFID hardware present.
- why: Image shows a vintage Soviet analog oscilloscope; the page is a troubleshooting guide for modern RFID readers/antennas/tags. Different product category, zero RFID content, and the photo doesn't even match its own alt text ('engineer adjusting RF test equipment in a research laboratory' — there is no engineer and no lab).
- ✅ replaced → /landing-images/rfid-reader-not-detecting-tags-troubleshooting-hero.jpg  (CC BY-SA 4.0 · Larry D. Moore · https://commons.wikimedia.org/w/index.php?curid=25260253 (Wikimedia Commons — 'RFID antenna 2007'))
- queries: "RFID reader", "RFID antenna", "RFID handheld", "RFID warehouse", "RFID inventory"

### rfid-reseller-program-distributor-margin-math (blog)
- file: src/content/editorial/blog/rfid-reseller-program-distributor-margin-math.json · hero: /landing-images/logistics.jpg
- shows: Original hero (industrial.webp) was an automotive assembly line with blue welding robots and car bodies — no RFID, distribution, or business/channel content.
- why: Car-factory welding line on an RFID reseller/distributor margin-economics article — off-topic (confirmed by user; corrects my earlier over-lenient 'clean' call on the shared industrial.webp). Replaced with an on-topic distribution-warehouse image.
- ✅ replaced → /landing-images/logistics.jpg  (N/A — Proudtek own asset, no attribution required · ? · in-repo asset (public/landing-images/logistics.jpg) — Proudtek own image library, already used as a hero on 2 other posts)
- queries: "in-repo image library: logistics / warehouse / distribution / rfid label", "note: image-audit-replace.py pipeline absent in repo -> reused clean in-repo asset instead of hand-downloading"

### waterproof-rfid-tags-outdoor (blog)
- file: src/content/editorial/blog/waterproof-rfid-tags-outdoor.json · hero: /landing-images/waterproof-rfid-tags-outdoor-hero.jpg
- shows: A rugged Garmin GPS sport-watch with water beads on its face, worn on a wrist against a blurred green outdoor background.
- why: Image shows a branded consumer GPS watch (Garmin) — a genuinely different product category with no RFID product visible; the page is a technical guide on waterproofing RFID tags. The page's own imageAlt concedes it is a borrowed weatherproofing metaphor.
- ✅ replaced → /landing-images/waterproof-rfid-tags-outdoor-hero.jpg  (CC BY 2.0 · melanie_hughes · https://www.flickr.com/photos/22658750@N02/4253803022)
- queries: "RFID tag", "waterproof RFID", "RFID wristband", "RFID label", "industrial RFID"

### california-rfid-privacy-law (guides)
- file: src/content/editorial/guides/california-rfid-privacy-law.json · hero: /landing-images/california-rfid-privacy-law-hero.jpg
- shows: As-found: a 29-byte HTML '404' stub saved as .jpg — renders no image at all. Intended/restored subject: a wall-mounted RFID/NFC access-control terminal (keypad + contactless symbol) beside a 'PRIVATE GARDEN — NO ENTRY WITHOUT PERMISSION' sign.
- why: BROKEN HERO FILE, not a topic mismatch: /blog-images/access-control.jpg is a 29-byte '<html><body>404</body></html>' stub (a saved error page), so the hero rendered as a broken <img>. The intended access-control subject IS on-theme for an RFID privacy/compliance guide. FIXED by restoring the valid in-repo copy of the same photo (public/site-assets/wp-content/uploads/2024/01/access-control.jpg) as a per-page /landing-images/ hero, which also gains the WebP-first <picture> treatment. Shared broken file left untouched.
- ✅ replaced → /landing-images/california-rfid-privacy-law-hero.jpg  (n/a (Proudtek own asset) · Proudtek · local in-repo asset: public/site-assets/wp-content/uploads/2024/01/access-control.jpg)

### google-review-card-placement-guide (guides)
- file: src/content/editorial/guides/google-review-card-placement-guide.json · hero: /landing-images/google-review-card-placement-guide-hero.jpg
- shows: A typography/graphic-design flat-lay: a tablet displaying a hand-sketched serif letter 'A' on grid paper, an Apple Pencil, over-ear headphones with a coiled cable, and an open orange design magazine on a wood surface.
- why: Image shows a graphic-design / letterform workspace; the page is a placement playbook for Google review cards (front desk, checkout, tabletop, pickup, in-room). No review card, QR/NFC element, or business counter appears in the pixels — despite the filename business-card-hand.jpg there is no business card and no hand.
- ✅ replaced → /landing-images/google-review-card-placement-guide-hero.jpg  (CC BY 2.0 · Ben Sutherland · https://www.flickr.com/photos/60179301@N00/70575538)
- queries: "qr code restaurant", "feedback card", "table tent", "nfc business card"

### google-review-card-staff-prompt-playbook (guides)
- file: src/content/editorial/guides/google-review-card-staff-prompt-playbook.json · hero: /landing-images/google-review-card-staff-prompt-playbook-hero.jpg
- shows: A chef's knife and a bunch of fresh green herbs on a light wood board — a culinary/food-prep flat-lay; no people, desk, or card.
- why: Image shows a kitchen knife + herbs (food prep); the page is a Google review-card staff-prompt playbook about staff handing review cards during a service handoff. File is even named hotel-front-desk.jpg but its pixels are a cooking flat-lay.
- ✅ replaced → /landing-images/google-review-card-staff-prompt-playbook-hero.jpg  (CC BY 2.0 · Byron Villegas · Flickr via Openverse — https://www.flickr.com/photos/31171859@N06/4666247158)
- queries: "hotel reception desk", "front desk staff", "hotel front desk"

### google-review-cards-for-dental-groups (guides)
- file: src/content/editorial/guides/google-review-cards-for-dental-groups.json · hero: /landing-images/google-review-cards-for-dental-groups-hero.jpg
- shows: A hospital surgical operating theater — central operating table, large circular overhead surgical lights, ceiling-boom-mounted medical equipment and wall-mounted monitors in a sterile clinical suite.
- why: Image shows a hospital surgical operating room; the page is a multi-practice playbook for NFC/QR Google review cards in dental groups (its own imageAlt reads 'Dental clinic environment with NFC review card workflow'). Wrong setting (high-acuity surgery vs outpatient dental office) and wrong subject (surgical equipment, no review card / reception desk).
- ✅ replaced → /landing-images/google-review-cards-for-dental-groups-hero.jpg  (CC BY 2.0 · HerryLawford · https://www.flickr.com/photos/32662631@N00/424274849)
- queries: "dental clinic", "dentist patient", "dental office"

### google-review-cards-for-fitness-franchises (guides)
- file: src/content/editorial/guides/google-review-cards-for-fitness-franchises.json · hero: /landing-images/google-review-cards-for-fitness-franchises-hero.jpg
- shows: A pink braided elastic sport wristband with a translucent silicone AirTag/token holder and a metal buckle, on a plain white studio background.
- why: Image shows a fitness sport wristband (a token/AirTag holder); the page is a Google review-CARD deployment playbook for fitness franchises (NFC cards, stickers, countertop stands). Different product category — the guide never uses a wristband as a review device.
- ✅ replaced → /landing-images/google-review-cards-for-fitness-franchises-hero.jpg  (CC0 1.0 · Humphrey Muleba · https://stocksnap.io/photo/gym-interior-LNCLN1NE6K)
- queries: "gym interior", "fitness studio", "nfc card"

### google-review-nfc-card-setup (guides)
- file: src/content/editorial/guides/google-review-nfc-card-setup.json · hero: /landing-images/google-review-nfc-card-setup-hero.jpg
- shows: A person taps a smartphone (green payment-success screen) against a handheld POS card-payment terminal with a PIN keypad on a cafe table, next to a coffee cup — a contactless mobile-payment scene.
- why: Image shows contactless payment at a POS payment terminal; page is a setup guide for Google review NFC cards (a printed card a customer taps to open a Google review page). Different device and NFC use case (paying vs reviewing) — no review card in frame.
- ✅ replaced → /landing-images/google-review-nfc-card-setup-hero.jpg  (CC BY 2.0 · EEPaul · https://www.flickr.com/photos/28477990@N03/4727273093)
- queries: "NFC business card", "NFC tag phone", "smartphone QR code", "NFC smartphone", "NFC tag", "QR code table", "scan QR code", "five star review", "restaurant QR menu"

### hotel-key-card-material-selection (guides)
- file: src/content/editorial/guides/hotel-key-card-material-selection.json · hero: /landing-images/hotel-key-card-material-selection-hero.jpg
- shows: A 'HOTEL LOCK CHIP DECISION' infographic comparing three chip families — MIFARE Classic 1K (Crypto-1), MIFARE Plus (AES-128), DESFire EV3 (AES-128 mutual auth, PCI/HIPAA).
- why: image is a chip-family / security comparison; the page is a card MATERIAL selection guide (PVC, recycled PVC, wood, PLA, rPET, bamboo). Orthogonal decision axis — the hero answers 'which chip', the page asks 'which material'. Confirmed by shared-usage: the same infographic correctly fronts 5 chip-comparison pages and this material guide was the lone outlier.
- ✅ replaced → /landing-images/hotel-key-card-material-selection-hero.jpg  (Proudtek own asset (no external license; imageCredit omitted) · Proudtek · in-repo own asset: public/landing-images/rfid-wooden-card.jpg (sapele-wood RFID card))

### icode-slix-chip-encyclopedia (guides)
- file: src/content/editorial/guides/icode-slix-chip-encyclopedia.json · hero: /landing-images/icode-slix-chip-encyclopedia-hero.jpg
- shows: Two white PVC smartcards stamped in readable text 'NXP DESFire 8K EV2' and 'DESFire 4K EV2-0.80MM'.
- why: Image shows NXP MIFARE DESFire EV2 (ISO 14443 proximity secure-microcontroller) cards; page is the NXP ICODE SLIX / SLIX2 (ISO 15693 HF vicinity memory) chip encyclopedia — a different NXP chip family/standard, with the wrong chip's name printed on the card. Replaced.
- ✅ replaced → /landing-images/icode-slix-chip-encyclopedia-hero.jpg  (CC BY 2.0 · melanie_hughes · https://www.flickr.com/photos/22658750@N02/4253803022)
- queries: "RFID library book", "RFID inlay", "RFID tag"

### nfc-rohs-reach-compliance (guides)
- file: src/content/editorial/guides/nfc-rohs-reach-compliance.json · hero: /landing-images/nfc-rohs-reach-compliance-hero.jpg
- shows: Workers in blue uniforms and face masks manually sorting municipal waste (food scraps, plastic cups, drinking straws) on a conveyor belt at a waste-sorting/recycling facility.
- why: Image shows manual municipal-waste sorting (waste-management labor); page is a regulatory MATERIAL-COMPLIANCE documentation playbook (RoHS 3 substance restrictions, REACH SVHC declarations, material documentation) for NFC/RFID EU MARKET ENTRY. No electronics, e-waste, RFID/NFC product, documentation or EU/CE/regulatory element appears — the only link is the broadest 'environmental' umbrella, and even that points to waste disposal rather than substance-restriction compliance. The hero was clearly repurposed from a sustainability/circular-economy page (its filename). Clear mismatch.
- ✅ replaced → /landing-images/nfc-rohs-reach-compliance-hero.jpg  (CC BY-SA 2.0 · theglobalpanorama · https://www.flickr.com/photos/121483302@N02/13922878763)
- queries: "European Union flag", "circuit board", "electronics laboratory", "test laboratory"

### nfc-tag-programming-android-guide (guides)
- file: src/content/editorial/guides/nfc-tag-programming-android-guide.json · hero: /landing-images/nfc-tag-programming-android-guide-hero.jpg
- shows: A black Apple iPhone (iOS, with the notch) on a gray surface showing its iOS home screen full of app icons; no NFC tag or NFC interaction is visible.
- why: Image shows an iPhone running iOS with an app grid; the page is explicitly about Android NFC programming (android.nfc API, tag dispatch, HCE), repeatedly contrasts Android against iPhone, and its own imageAlt promises an 'Android smartphone tapping NFC tag'. Wrong mobile platform shown + no NFC depicted.
- ✅ replaced → /landing-images/nfc-tag-programming-android-guide-hero.jpg  (CC BY 2.0 · Mark Morgan Trinidad B · https://www.flickr.com/photos/46102325@N06/16725873143)
- queries: "NFC tag", "NFC phone", "NFC sticker"

### icode-slix-card (products)
- file: src/content/editorial/products/rfid-cards/icode-slix-card.json · hero: /landing-images/icode-slix-card-hero.jpg
- shows: Two blank white PVC cards printed 'NXP DESFire 8K EV2' and 'DESFire 4K EV2-0.80MM' on a white background.
- why: Image shows NXP MIFARE DESFire EV2 cards (ISO/IEC 14443 proximity secure cards); page is about ICODE SLIX, NXP's ISO/IEC 15693 vicinity card family for libraries/document-tracking. The card is explicitly printed with a different chip family than the page sells.
- ✅ replaced → /landing-images/icode-slix-card-hero.jpg  (CC BY 2.0 · SparkFunElectronics · https://www.flickr.com/photos/41898857@N04/8167533772)
- queries: "RFID card"

### nfc-event-ticket-sticker (products)
- file: src/content/editorial/products/rfid-labels/nfc-event-ticket-sticker.json · hero: /landing-images/nfc-event-ticket-sticker-hero.jpg
- shows: A masked woman tapping a PRESTO transit card reader on a public bus, with a bus driver and exit door visible in the background.
- why: image shows a public transit card tap on a bus fare reader; page is about NFC event ticket stickers for concert/event entry and cashless payment
- ✅ replaced → /landing-images/nfc-event-ticket-sticker-hero.jpg  (CC BY-SA 2.0 · isuperwang · https://www.flickr.com/photos/44376038@N00/1036022945)

### nfc-luxury-handbag-tag (products)
- file: src/content/editorial/products/rfid-labels/nfc-luxury-handbag-tag.json · hero: /landing-images/nfc-luxury-handbag-tag-hero.jpg
- shows: A cluster of rustic, hand-tooled brown leather satchels with folk/animal motifs hanging at a craft-market or souk stall, beside woven textiles and baskets.
- why: Image shows downmarket artisanal/folk-market leather satchels (and no NFC tag/label at all); page is a product page for NFC LUXURY handbag authentication tags explicitly for Hermes/LV/Gucci-class brands. The rustic-market bags contradict the page's defining luxury positioning.
- ✅ replaced → /landing-images/nfc-luxury-handbag-tag-hero.jpg  (CC BY 2.0 · janebelindasmith · https://www.flickr.com/photos/27042541@N06/3566073531)
- queries: "luxury handbag", "designer handbag", "leather handbag"

### nfc-medical-alert-wristband (products)
- file: src/content/editorial/products/rfid-wristbands/nfc-medical-alert-wristband.json · hero: /site-assets/wp-content/uploads/2024/09/RFID_silicone_wristband_application.jpg
- shows: A hand wearing a navy silicone NFC wristband branded with a Visa logo and a contactless-payment symbol, tapping a payment POS terminal on a counter.
- why: Image shows a contactless-PAYMENT wristband (prominent Visa wordmark + POS terminal); the page is an NFC MEDICAL-ALERT wristband for emergency medical info (allergies, medications, blood type, DNR, for EMS/ED/assisted-living). Same hardware category (NFC silicone band) but the depicted use case and branding are payment, not medical alert — misleading for a medical-alert SKU.
- queries: "medical alert bracelet", "medical id wristband"

### nfc-warranty-seal-tag (products)
- file: src/content/editorial/products/rfid-labels/nfc-warranty-seal-tag.json · hero: /landing-images/nfc-warranty-seal-tag-hero.jpg
- shows: A row of wine bottles lying in wooden display crates with straw packing — a wine-shop/cellar display, with no NFC tag, seal, or tamper-evident label anywhere in frame.
- why: Image showed wine bottles in crates; page is a product page for NFC Warranty Seal Tags (destructible-vinyl + NTAG 424 DNA NFC tamper seal). No product at all on a product page — clear mismatch. REPLACED.
- ✅ replaced → /landing-images/nfc-warranty-seal-tag-hero.jpg  (Proudtek own asset (no third-party license) · ? · public/landing-images/ntag424-dna-tamper-evident-tag.jpg (in-repo own asset — NFC tamper-evident NTAG 424 DNA inlay product photo, the exact chip family this page is about))
- queries: "tamper evident seal"

### paper-rfid-wristband (products)
- file: src/content/editorial/products/rfid-wristbands/paper-rfid-wristband.json · hero: /landing-images/paper-rfid-wristband-hero.jpg
- shows: A blue woven satin/fabric wristband with a moulded plastic slider bead (the bead reads 'FILA').
- why: image shows a WOVEN FABRIC festival wristband; page is about PAPER / synthetic-paper disposable wristbands (a different substrate/category).
- ✅ replaced → /landing-images/paper-rfid-wristband-hero.jpg  (in-repo own asset — no external license · ? · public/landing-images/tyvek-rfid-wristband.jpg (in-repo own asset reused via --src; Tyvek = synthetic-paper substrate, on-topic). Sidestepped the original Openverse 403 by using an in-repo asset; pixel-verified.)
- queries: "paper wristband", "tyvek event wristband"

### rfid-anchor-bolt-tag (products)
- file: src/content/editorial/products/rfid-tags/rfid-anchor-bolt-tag.json · hero: /landing-images/rfid-anchor-bolt-tag-hero.jpg
- shows: A yellow plastic CARGO/CONTAINER BOLT SEAL (bolt-pin + barcoded body with serial '000000').
- why: image shows a plastic security/cargo bolt SEAL; page is about RFID tags for STRUCTURAL ANCHOR BOLTS (ASTM F3125 fasteners) — a different product. Hero file is rfid-bolt-seal.jpg (name collision).
- ✅ replaced → /landing-images/rfid-anchor-bolt-tag-hero.jpg  (in-repo own asset — no external license · ? · public/landing-images/rfid-bolt-tag.jpg (in-repo own asset reused via --src; stainless hex-head RFID bolt tags — the actual threaded-fastener RFID product, vs the cargo bolt SEAL the old hero showed). Sidestepped the original Openverse 403; pixel-verified.)
- queries: "anchor bolt", "foundation bolt concrete"

### rfid-card-assa-abloy-compatible (products)
- file: src/content/editorial/products/rfid-cards/rfid-card-assa-abloy-compatible.json · hero: /landing-images/rfid-card-assa-abloy-compatible-hero.jpg
- shows: A large stack of photo ID badges featuring a person's headshot, Chinese text identifying an airport security-zone pass, and access-zone codes — not hotel key cards.
- why: image shows airport security photo ID badges with portrait photos; page is about MIFARE/DESFire hotel key cards for Assa Abloy lock platforms
- ✅ replaced → /landing-images/rfid-card-assa-abloy-compatible-hero.jpg  (CC BY 2.0 · nenadstojkovicart · https://www.flickr.com/photos/202846129@N03/54584344273)

### rfid-nail-tag (products)
- file: src/content/editorial/products/rfid-tags/rfid-nail-tag.json · hero: /landing-images/rfid-nail-tag-hero.jpg
- shows: Five upright cardboard archive/document boxes with white RFID label strips affixed to their faces, one strip partially peeled away.
- why: Image shows label-tagged cardboard boxes; page is about hammer-in nail-form RFID transponders for pallets, timber, railroad ties and utility poles.
- ✅ replaced → /landing-images/rfid-nail-tag-hero.jpg  (CC BY 2.0 · Walt Stoneburner · https://www.flickr.com/photos/8404611@N06/6244758934)

### rfid-prison-wristband (products)
- file: src/content/editorial/products/rfid-wristbands/rfid-prison-wristband.json · hero: /landing-images/rfid-prison-wristband-hero.jpg
- shows: A bright green satin/ribbon fabric wristband with a decorative wooden square buckle — an eco-festival style wristband.
- why: image shows a fabric/ribbon festival wristband with a wooden buckle; page is about tamper-evident TPU inmate wristbands with one-way locking clasp and frangible antenna for corrections facilities
- ✅ replaced → /landing-images/rfid-prison-wristband-hero.jpg  (in-repo asset (reused existing public/ image) · ? · public/landing-images/hospital-patient-id-wristband.jpg)

### rfid-temperature-sensor-tag (products)
- file: src/content/editorial/products/rfid-tags/rfid-temperature-sensor-tag.json · hero: /landing-images/rfid-temperature-sensor-tag-hero.jpg
- shows: A Testo brand 'testostor 175 Logger' standalone battery-powered temperature data logger device shown next to a ruler for scale.
- why: Image shows a third-party wired/battery data logger instrument (Testo testostor 175); page is about passive UHF RFID temperature sensor tags that log and store data on-chip for wireless retrieval.
- ✅ replaced → /landing-images/rfid-temperature-sensor-tag-hero.jpg  (CC BY-SA 2.0 · lumachrome · https://www.flickr.com/photos/99743766@N00/14491682406)

### rfid-tree-tag (products)
- file: src/content/editorial/products/rfid-tags/rfid-tree-tag.json · hero: /landing-images/rfid-tree-tag-hero.jpg
- shows: Five tall cardboard archive document boxes standing upright with white RFID label strips adhered to their spines, viewed from above.
- why: Image shows RFID labels on cardboard archive document boxes; page is about RFID tree tags for forestry, urban-forestry, and chain-of-custody applications.
- ✅ replaced → /landing-images/rfid-tree-tag-hero.jpg  (CC0 1.0 · Image Catalog · https://www.flickr.com/photos/132795455@N08/17270674212)

### rfid-utility-pole-tag (products)
- file: src/content/editorial/products/rfid-tags/rfid-utility-pole-tag.json · hero: /landing-images/rfid-utility-pole-tag-hero.jpg
- shows: White RFID cable-management tags clipped onto bundled grey data cables in what appears to be a server room or data center cable tray.
- why: Image shows RFID tags on data cables in an indoor IT/data center environment; the page is about outdoor utility pole tags for wood/steel/concrete electric and telecom poles.
- ✅ replaced → /landing-images/rfid-utility-pole-tag-hero.jpg  (CC BY-SA 2.0 · Chris Hunkeler · https://www.flickr.com/photos/14913305@N00/42498747332)

### uhf-rfid-card (products)
- file: src/content/editorial/products/rfid-cards/uhf-rfid-card.json · hero: /landing-images/uhf-rfid-card-hero.jpg
- shows: An NFC-enabled digital business card (name: Diane F. Hylton, Sales Executive) held in a hand alongside a smartphone showing the corresponding contact-profile landing page.
- why: image shows an NFC digital business/contact card with a personal profile; page is about UHF RFID cards for long-range parking gates, speed-lane turnstiles, and hands-free access control
- ✅ replaced → /landing-images/uhf-rfid-card-hero.jpg  (in-repo asset (reused existing public/ image) · ? · public/landing-images/rfid-employee-badge.jpg)

### uhf-rfid-retail-price-label (products)
- file: src/content/editorial/products/rfid-labels/uhf-rfid-retail-price-label.json · hero: /landing-images/uhf-rfid-retail-price-label-hero.jpg
- shows: An old perforated Kimball-style punch-card retail price tag branded 'Alexander's' showing size and price codes, pinned to a garment.
- why: image shows a vintage mechanical Kimball/punched-card price tag from a defunct US department store; page is about modern UHF RAIN RFID thermal-transfer price labels with GS1 Sunrise 2027 compliance
- ✅ replaced → /landing-images/uhf-rfid-retail-price-label-hero.jpg  (CC BY 2.0 · bradleygee · https://www.flickr.com/photos/13951072@N00/2843576226)

### uhf-rfid-tire-label (products)
- file: src/content/editorial/products/rfid-labels/uhf-rfid-tire-label.json · hero: /landing-images/uhf-rfid-tire-label-hero.jpg
- shows: Close-up of a silver car's front headlight assembly with a small RFID label sticker visible on the headlight lens — no tire in frame.
- why: image shows the headlight/body panel of a car with no tire visible; page is about UHF RFID labels embedded inside tire plies during vulcanisation
- ✅ replaced → /landing-images/uhf-rfid-tire-label-hero.jpg  (CC BY 2.0 · Steve Snodgrass · https://www.flickr.com/photos/10710442@N08/3553615373)

### google-review-cards-for-tabletop-prompts (solutions)
- file: src/content/editorial/solutions/google-review-cards-for-tabletop-prompts.json · hero: /landing-images/google-review-cards-for-tabletop-prompts-hero.jpg
- shows: A decorative dining table setting with lemons in a bowl, a white monkey figurine, glassware, ornate plates, an amber decanter, and linen curtains — no NFC cards, no tabletop card stands, no RFID technology.
- why: image shows a purely decorative restaurant/home table scene with no NFC or review-prompt product visible; page is about acrylic NFC tabletop stands and tent cards for Google review prompts
- ✅ replaced → /landing-images/google-review-cards-for-tabletop-prompts-hero.jpg  (in-repo asset (reused existing public/ image) · ? · public/landing-images/nfc-tap-google-review-hero.jpg)

### rfid-access-control (solutions)
- file: src/content/editorial/solutions/rfid-access-control.json · hero: /landing-images/rfid-access-control-hero.jpg
- shows: A woman standing at a reception desk or counter with a cluttered bulletin board behind her showing posters (including a 'The Doors' album cover) — no RFID hardware, cards, or access control equipment visible.
- why: image shows a generic reception/office scene with no RFID access control hardware or credentials; page is about RFID cards, fobs and readers for physical access control (HID Seos, DESFire EV3, OSDP)
- ✅ replaced → /landing-images/rfid-access-control-hero.jpg  (in-repo asset (reused existing public/ image) · ? · public/landing-images/ski-lift-access-control-gate.jpg)

### rfid-attendance-system (solutions)
- file: src/content/editorial/solutions/rfid-attendance-system.json · hero: /landing-images/rfid-attendance-system-hero.jpg
- shows: A dimly lit upscale restaurant dining room with white-set tables, wine glasses, candle holders, dark curtains, and wall sconces.
- why: Image shows a restaurant interior; page is about an RFID attendance tracking system for workforce clock-in/clock-out, schools, and events.
- ✅ replaced → /landing-images/rfid-attendance-system-hero.jpg  (in-repo asset (reused existing public/ image) · ? · public/landing-images/rfid-employee-badge.jpg)

### rfid-keyfobs-access-control (solutions)
- file: src/content/editorial/solutions/rfid-keyfobs-access-control.json · hero: /landing-images/rfid-keyfobs-access-control-hero.jpg
- shows: An overhead view of a busy café/coffee-bar counter with cups, an espresso machine, glass jars of candy/sugar, a notepad, and miscellaneous counter items.
- why: Image shows a café counter workspace; page is about RFID keyfobs for commercial access control (offices, gyms, multi-tenant buildings).
- ✅ replaced → /landing-images/rfid-keyfobs-access-control-hero.jpg  (in-repo asset (reused existing public/ image) · ? · public/landing-images/rfid-keyfobs-pillar.jpg)

### rfid-race-timing (solutions)
- file: src/content/editorial/solutions/rfid-race-timing.json · hero: /landing-images/rfid-race-timing-hero.jpg
- shows: An indoor concert or music festival crowd with confetti cannons firing, stage lighting in blues and purples, and audience members with hands raised.
- why: Image shows an indoor concert/festival crowd with confetti; page is about RFID race timing for running, cycling, triathlon, and obstacle-course events.
- ✅ replaced → /landing-images/rfid-race-timing-hero.jpg  (CC BY-SA 2.0 · charlie llewellin · https://www.flickr.com/photos/76913520@N00/4359758892)

## Competitor logos (Check B)
- access-card-copied-security-upgrade (blog) — pcs / PCS Systemtechnik GmbH (INTUS access-control & time-attendance terminals) — UNLISTED brand; logo text plainly readable twice (green 'pcs' top-right of screen + embossed 'pcs' at base of unit). German UI + date 24.07.2015 confirm a PCS INTUS terminal. Sells finished RFID-reading access-control hardware, so leans competitor per the unlisted-brand rule; needs human confirmation + possible add to competitors.md. [possible] · /blog-images/access-card-copied-security-upgrade.jpg
- coconut-shell-rfid-wristbands-eco (blog) — pulseiravirtual.com.br (Brazilian event-wristband vendor — unlisted competitor; URL plainly legible on the band) [clear] · /landing-images/coconut-shell-rfid-wristbands-eco-hero.jpg
- nfc-door-locks-rfid-cards (blog) — Samsung [clear] · /blog-images/nfc-door-locks-rfid-cards.jpg
- rfid-frequencies-lf-hf-uhf-explained (blog) — PCS (PCS Systemtechnik / INTUS — RFID access & time-recording terminals); UNLISTED in competitors.md, needs human confirmation [possible] · /blog-images/rfid-frequencies-lf-hf-uhf-explained.jpg
- rfid-marathon-race-timing-setup (blog) — race result (raceresult) — race-timing systems vendor; sells RFID timing transponders & pre-printed timing bibs, an unlisted finished-product rival for the timing niche. Needs human confirmation. [possible] · /landing-images/rfid-race-timing-tag.jpg
- rfid-ski-pass-card-season (blog) — Axess (Axess AG — ski-resort access gates & RFID ski-pass media); unlisted competitor in competitors.md [possible] · /landing-images/ski-lift-access-control-gate.jpg
- target-rfid-t2-t3-supplier-requirements (blog) — Zebra Technologies [clear] · /landing-images/retail-apparel.jpg
- uhf-vs-hf-rfid-frequency-choice (blog) — RFIDCard (likely rfidcard.com) — 'RFIDCard' wordmark + RF-wave logo on the card face; unlisted RFID-card maker, not Proudtek's own mark. Impinj/NXP marks on the card are allowed chip-supplier branding. [possible] · /landing-images/dual-frequency-rfid-card.webp
- which-nfc-chip-most-memory (blog) — Unidentified third-party NFC reseller/shop watermark — a circular arc ('C'-style) logo on the bottom banner; product-photo template resembles nfc.cards. The 'NTAG216' text is an NXP chip name (allowed); the separate vendor logo is neither Proudtek's mark nor an allowed chip-supplier mark. Cannot read the exact wordmark — needs human confirmation. [possible] · /landing-images/ntag216-nfc-sticker.jpg
- mifare-ultralight-c-chip-encyclopedia (guides) — RFIDCard (unlisted brand — possible rival RFID-card vendor, e.g. rfidcard.com; NOT one of Proudtek's own marks). NXP/MIFARE text on the same card is the allowed chip supplier and is fine. [possible] · /landing-images/mifare-ultralight-c-card.webp
- rfid-reader-writer-selection (guides) — Zebra / Symbol / Motorola MC9000-series rugged handheld (recognizable competitor product by form factor; no readable wordmark at this resolution) [possible] · /landing-images/rfid-handheld-reader-scanner.jpg
- walmart-rfid-tagging-mandate (guides) — Zebra Technologies (flagged competitor) — wordmark on the handheld RFID reader's top bezel. Corroborated: the identical shared asset (/landing-images/retail-apparel.jpg) is independently flagged 'Zebra Technologies [clear]' on target-rfid-t2-t3-supplier-requirements; a zoom/contrast-enhanced crop of this hero also shows a top-bezel wordmark consistent with Zebra's lowercase mark. [possible] · /landing-images/retail-apparel.jpg
- elastic-rfid-wristband (products) — ACS (Advanced Card Systems) — ACR122U NFC reader [clear] · /landing-images/elastic-rfid-wristband.jpg
- mifare-ultralight-c-card (products) — RFIDCard (unlisted — possible third-party/competitor watermark; NXP and ISO/IEC 14443-A on the card are allowed supplier/standard marks) [possible] · /landing-images/mifare-ultralight-c-card.webp
- ntag215-nfc-sticker (products) — UNIDENTIFIED third-party watermark — a stylized 'C'/arc emblem (bottom-left) baked into the image; brand name not legible, needs human confirmation. The only readable wordmark is 'NTAG215', which is an allowed NXP chip name. Looks like a borrowed reseller/catalog stock photo; if the emblem is a rival NFC-sticker vendor's mark it is an own-goal on Proudtek's own product hero. [possible] · /landing-images/ntag215-nfc-sticker.jpg

