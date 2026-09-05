# Phase 8 — Page Briefs (P0/P1 candidates; drafts pending approval)

Rules applied: a brief is prepared only where the page's essential evidence is either already verified or is limited to a listed, resolvable owner item; where the essential evidence is missing (factory capability, case-study results), the brief stops at "Human evidence required" and no content is to be drafted (Phase 9 gate). Direct answers below contain **only** facts verified in Phase 4 or neutral statements; bracketed items are placeholders that must be filled from owner evidence or removed. Word counts are not forced.

---

## B1 — `/` Homepage
- **Page role**: entity page + router to families, solutions and evidence.
- **Primary buyer question**: "Is this a credible RFID/NFC supplier for my programme, and where do I start?"
- **Search intent**: navigational/brand; secondary "custom RFID NFC manufacturer China" (commercial).
- **Preferred query cluster**: brand (#16); supplier evaluation (#18) secondary.
- **Entity definition**: Proud Tek — trading name of [legal name per registration; certificate: Shenzhen Proud Tek Co., Ltd / 深圳市奥科物联有限公司], Shenzhen; supplies RFID cards, tags, labels, wristbands, keyfobs and readers to B2B buyers.
- **Direct answer (draft, 52 words)**: Proud Tek is a Shenzhen-based supplier of custom RFID and NFC credentials — cards, tags, labels, wristbands, keyfobs and readers — for hotels, laundries, events, retail and industrial programmes. Our sales and service operation is certified to ISO 9001:2015, ISO 14001:2015 and ISO 45001:2018 (certificate numbers published). [Production model statement per owner decision.]
- **Verified facts to retain**: three ISO certificates (numbers, issuer CAIC, scope "sales service…", 2026-06-10 → 2029-06-09); address A2109 Zhantao Building; contact channels; founding year 2008 (consistent across all properties, document pending).
- **Unverified claims to resolve**: two self-owned factories, 10 lines, 305+ machines, 8+ patents, 12+ inspections, 10 % R&D, 500+ clients / 50+ countries, 18+ years, OEKO/REACH/RoHS "by TÜV", testimonials permission, "free samples with every order".
- **H1**: Custom RFID & NFC cards, tags and labels — Shenzhen (keep current H1 if the "manufacturer in China" claim is confirmed).
- **Outline**: H2 Start with your task (identify / validate / quote) · H2 Product families (6 cards) · H2 Solutions by operation (6 groups) · H2 Evidence you can check (certificates with numbers, methodology, factory page) · H2 How we work (inquiry → samples → quote → production → QC → delivery, without unverified SLAs unless confirmed) · H2 From buyers (only permissioned quotes).
- **Spec table**: none (router page).
- **Selection criteria / trade-offs / limitations**: point to compare hub; state what Proud Tek does not supply (lock systems, reader software, integration) — supply boundary.
- **Testing methodology**: link to `/about/methodology/`.
- **Compatibility process**: link to compatibility guides + `intent=compatibility` contact.
- **Relevant standards**: ISO/IEC 14443, 15693, 18000-63 (as families supported).
- **Internal links**: 6 family hubs, 6 solution groups, certifications, methodology, sample pack, RFQ.
- **External sources**: cnca.gov.cn certificate lookup; NXP/Impinj/EM chip pages (as "chips we build with").
- **FAQs**: only if answers are visible: "Do you sell direct?", "How do I check your certificates?", "What do you not supply?"
- **Schema**: Organization (corrected legalName/sameAs/address), WebSite, WebPage, VideoObject. Remove FAQPage/Article unless FAQs are visible.
- **CTA**: primary "Request a quote" (`/rfq/`); secondary "Free sample pack".
- **Human evidence required**: production-model decision (Phase 3 C2); patent numbers; client/country basis; testimonial permissions; OEKO-TEX/TÜV documents; legal name.

## B2 — `/about/certifications/` (model page — mostly verified)
- **Role**: evidence page; **buyer question**: "Which certificates does Proud Tek hold, for what scope, and how do I verify them?"; **intent**: evaluation (#18).
- **Direct answer (draft, 61 words)**: Proud Tek holds three management-system certificates issued by Anhui Certification and Inspection Co., Ltd (CAIC): ISO 9001:2015 (98026Q00274R000), ISO 14001:2015 (98026E00200R000) and ISO 45001:2018 (98026S00203R000), first certified 10 June 2026 and valid to 9 June 2029. The certified scope is the sales service of smart cards (PVC and wooden cards) and RFID tags. Verify any number at cnca.gov.cn or zjcaic.com.
- **Verified facts**: all of the above (certificate PDF). **Unverified**: OEKO-TEX Standard 100 coverage, RoHS/REACH "declarations on file", FCC/CE/MIC/CCC approvals per SKU, TÜV/SGS/Intertek/BV reports, "manufacturing sites are certified separately".
- **H1**: Certifications and compliance documentation. **Outline**: H2 Management-system certificates (table: standard · number · holder · scope · issuer · valid) · H2 How to verify (CNCA lookup steps) · H2 Product compliance documents we can supply per order (declarations — labelled as declarations, not certifications) · H2 Third-party testing (only labs actually used, with report numbers) · H2 What these certificates do not cover (scope honesty).
- **Spec table**: certificate table. **Standards**: ISO 9001/14001/45001; RoHS 2011/65/EU; REACH; FCC Part 15; EN 300 330 / 302 208 (only where a DoC exists).
- **Internal links**: factory, methodology, sample pack, RFQ. **External**: cnca.gov.cn, zjcaic.com, EUR-Lex for RoHS/REACH.
- **FAQs**: "Can I get the PDF?", "Does ISO 9001 cover manufacturing?" (answer: no — sales service scope; explain what that means).
- **Schema**: AboutPage + Organization.hasCredential ×3 (EducationalOccupationalCredential/Certification with issuer, id, validThrough).
- **CTA**: "Request certificate PDFs" (contact intent). **Human evidence**: OEKO-TEX certificate; FCC/CE documents; lab report numbers.

## B3 — `/about/factory/` — **BLOCKED (do not draft)**
Essential evidence missing and contradicted (Phase 3 C2, Phase 4 K-02–K-04, K-13). Human evidence required: factory lease/ownership or partner-line contracts, equipment register or third-party audit, bonded-warehouse licence, QC procedure list. Two acceptable outcomes: (a) evidence supplied → brief written around documented sites/lines; (b) owner adopts the partner-line model → page becomes "How our production is organised and controlled" with in-house specification, QC and records described truthfully.

## B4 — `/solutions/hotel-key-cards/` (P1, cluster #8)
- **Role**: application/buy page for hotel key cards; **question**: "Which RFID key card works with my lock system and what should I order?"; **intent**: commercial → RFQ; competing pages: compatibility ×8 (validate), compare ×2 (decide), guides hub (learn), industry page (who), blog how-it-works (learn).
- **Entity**: hotel key card = ISO/IEC 7810 ID-1 contactless card with a 13.56 MHz chip (MIFARE Classic 1K/4K, MIFARE Plus, MIFARE DESFire EV2/EV3, MIFARE Ultralight) encoded by the property's lock system.
- **Direct answer (draft, 58 words)**: Hotel key cards are ISO/IEC 14443 contactless cards whose chip family must match the lock estate: MIFARE Classic for legacy systems, MIFARE Plus or DESFire EV3 (AES) where the lock supports it. Proud Tek supplies blank or printed cards in PVC, wood or recycled stock for [lock brands per compatibility guides]; the property's encoder programmes them. Validate with samples on your locks first.
- **Verified**: chip facts (NXP); standards. **Unverified**: lock-brand acceptance tables (needs test matrix), price ranges, MOQ, lead time, "28-property rollout" case.
- **H1**: RFID hotel key cards — choosing the card for your lock system. **Outline**: H2 Which chip your locks accept (table by brand → link to 8 compatibility guides) · H2 Card materials and printing · H2 What Proud Tek supplies / what your lock vendor supplies · H2 Validation process (sample → encode on your encoder → test on doors) · H2 Ordering (MOQ/lead time from owner table) · H2 Limitations (Crypto-1 caveat; no lock firmware support) · FAQ (3–4 visible).
- **Spec table**: chip · memory · crypto · ISO · typical lock generations. **Standards**: ISO/IEC 14443, 7810. **Testing**: methodology page + compatibility process. **Internal links**: compatibility guides, MIFARE Classic vs Plus vs DESFire compare, Classic 1K / DESFire EV3 SKUs, sample pack, RFQ. **External**: NXP MIFARE family pages; lock vendors' public card specifications where cited.
- **Schema**: WebPage + Article (if authored) + FAQPage (visible only); no Product. **CTA**: "Request key card samples for your lock" (sample pack with lock-model field). **Human evidence**: compatibility test log; MOQ/lead-time table; price basis.

## B5 — `/products/rfid-cards/mifare-desfire-ev3-card/` (P1, cluster #1)
- **Question**: "Should I buy DESFire EV3 (or EV2) cards and what do I get?"; **intent**: E→P.
- **Direct answer (draft, 55 words)**: MIFARE DESFire EV3 is NXP's ISO/IEC 14443-4 contactless IC with AES-128/3DES authentication and 2 K, 4 K or 8 K byte configurations, used for transit, access and multi-application cards. Proud Tek supplies EV3 cards in PVC or [materials], printed or blank, pre-personalised on request. [EV2 availability statement per owner.] Validate with samples on your reader or lock.
- **Verified**: NXP EV3 specifications (cite MF3D(H)x3 datasheet section). **Unverified**: price 0.80–2.00 USD, MOQ, lead time, EV2 supply, "Bulk … Access" positioning.
- **H1** = visible product name; **title** ≤ 60 chars ("MIFARE DESFire EV3 Cards — 2K/4K/8K, AES-128 | Proud Tek"). **Outline**: answer · definition · spec table (EV2 vs EV3 columns) · selection (when EV3 over Plus/Classic) · test conditions (read range n/a for cards; personalisation/encoding checks) · compatibility (readers/locks supporting DESFire; SAM requirements) · application fit · limitations · procurement (MOQ/lead/price only if confirmed) · sources · FAQ · CTA.
- **Schema**: Product (name = H1, no invented sku/mpn, AggregateOffer only if price confirmed), BreadcrumbList, FAQPage (visible). **CTA**: RFQ prefilled with product. **Human evidence**: EV2 status, price/MOQ/lead time.

## B6 — `/products/rfid-cards/mifare-classic-1k-card/` (P1, cluster #2)
- **Direct answer (draft, 60 words)**: MIFARE Classic 1K is NXP's 13.56 MHz ISO/IEC 14443-3 Type A card IC with 1 KB EEPROM (16 sectors × 4 blocks × 16 bytes), 106 kbit/s and CRYPTO1 sector keys, introduced in 1994 and still the most widely installed HF credential. Choose it for legacy-reader compatibility and low cost; choose Plus or DESFire where cloning resistance matters. Proud Tek supplies blank or printed CR80 cards.
- **Corrections**: "launched 1997" → 1994 (NXP); cite MF1S50yyX/V1 datasheet for memory layout; Crypto-1 weakness → cite Garcia et al. (2008) rather than the Flipper Zero device/time claim.
- **Rest as B5**; add "mifare card size/dimensions" answer (ISO/IEC 7810 ID-1 85.60 × 53.98 × 0.76 mm) since queries show that need. **Human evidence**: price/MOQ/lead time.

## B7 — `/products/rfid-labels/ntag213-nfc-sticker/` (P1, cluster #6)
- **Direct answer (draft, 57 words)**: NTAG213 is NXP's NFC Forum Type 2 tag IC with 144 bytes of user memory, ISO/IEC 14443-A air interface and an ECC originality signature; it is the standard chip for URL, marketing and simple automation stickers. Proud Tek supplies NTAG213 wet inlays and printed stickers [sizes per spec table]. For 504 or 888 bytes choose NTAG215 or NTAG216.
- **Verified**: NXP datasheet Rev 3.2. **Unverified**: price 0.10–0.30 USD @ 5k+, sizes/adhesive claims (check against spec table), read-range figures (need conditions).
- Note: MIFARE-sticker demand redirected here (Phase 5 #6) — add a visible sentence "Looking for MIFARE Classic labels? [status]" only after the owner confirms the product status.
- **Schema/CTA/evidence** as B5.

## B8 — `/solutions/rfid-laundry-tags/` (P1, cluster #15; consolidated buy page)
- **Question**: "Which laundry tag survives my wash process and how do I attach it?"; competing: laundry-management, laundry-tracking (to be merged into one system page), industry page, PPS product, compares, guide, blog ROI, case study.
- **Direct answer (draft, 60 words)**: Industrial laundry RFID tags are UHF (ISO/IEC 18000-63) or HF transponders sealed in PPS, silicone or textile housings so they survive washing, extraction, tunnel drying and ironing. PPS tags are the most chemical- and heat-resistant; silicone and textile tags are softer and cheaper. Proud Tek supplies sew-on, heat-seal and patch formats; wash-cycle ratings are stated with the ISO 6330 conditions used.
- **Verified**: standards; methodology page commits to ISO 6330 conditions. **Unverified**: "250+ wash cycles" figures (need test report per SKU), OEKO-TEX, case-study results, price.
- **Outline**: answer · tag types table (housing · frequency · attachment · temperature · cycles *with conditions*) · selection by laundry process · attachment methods · what Proud Tek supplies vs the laundry software/reader vendor · validation (sample wash plan) · limitations · procurement · sources (ISO 6330, ISO/IEC 18000-63, NXP UCODE) · FAQ · CTA "Request laundry tag samples".
- **Human evidence**: wash-test reports; OEKO-TEX certificate; price/MOQ.

## B9 — `/solutions/google-review-nfc-card/` (P1, cluster #14; hub replacing 10 venue variants)
- **Question**: "How do NFC review cards work and what do I order for my venue?"
- **Direct answer (draft, 52 words)**: A Google review NFC card is an NTAG21x tag (card, stand or sticker) encoded with your Google Business Profile review link; a customer taps a phone to open the review form. Proud Tek supplies printed PVC, wood or metal cards and tabletop stands, pre-encoded. Placement and staff prompts differ by venue — see the sections below.
- **Verified**: NTAG facts; Google Business Profile review-link documentation (cite). **Unverified**: "3.1× / 320 % review lift" cases (label as examples or remove), pricing.
- **Outline**: answer · how it works (NDEF URL, iOS/Android behaviour with Apple/Android docs) · product options (2 SKUs + stand) · venue sections (restaurants, hotels, retail/checkout — ≤3, only where placement genuinely differs) · compliance note (Google review policies: no incentivised reviews — cite policy) · limitations · procurement · FAQ · CTA.
- **Redirect impact**: 10 venue URLs → this page (0 impressions, no backlinks) — owner approval.

## B10 — `/case-studies/` pillar — **BLOCKED pending evidence** (Phase 4 CS-00)
Two possible briefs: (a) evidence supplied for N cases → pillar lists only those, with customer profile, permission status, method and period; (b) no evidence → pillar becomes "Worked examples: what a typical programme looks like", every number derived from stated assumptions (DERIVED_CALCULATION), and the words "deployment", "measured" and "customer permission" are removed. No drafting until the owner chooses.

## B11 — `/products/rfid-tags/` family hub (P1, indexed 2026-09-02)
- **Question**: "Which RFID tag form factor and frequency for my asset/environment?"
- **Direct answer (draft, 54 words)**: RFID tags are transponders packaged for a surface or environment — on-metal, high-temperature, laundry, outdoor, animal, cable-tie or embedded formats — in LF (125 kHz), HF/NFC (13.56 MHz) or UHF (860–960 MHz). Choose by read distance, surface and environment first, then chip. This hub lists Proud Tek's 69 tag SKUs by environment with their frequency and attachment method.
- **Outline**: selection table (environment × frequency × attachment × temperature → SKU) · how to shortlist · sample plan · links to 69 SKUs grouped · compare pages · CTA.
- **Schema**: CollectionPage + ItemList. **Evidence**: none beyond SKU specs (each SKU page carries its own).

---
Briefs not written (evidence-blocked or P2): `/about/` (depends on B3 decision), `/about/leadership/` (identities), LP/markets consolidation pages (owner decision first), remaining SKUs (template fix applies).
