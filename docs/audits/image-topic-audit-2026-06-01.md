# Image Audit — Check A (image ↔ title/topic match) — full sweep — 2026-06-01

Scope: all 4 editorial groups (blog + solutions + guides + products) via `/image-audit`.
Method: 289 distinct hero images inspected pixel-by-pixel across 400 page-uses, fanned out over 12 subagents. Conservative bar (flag only a *clear* product-category / off-topic contradiction; generic-but-on-theme and sub-variant doubt left clean).

## Summary
- Audited: 400 page-uses · 289 distinct hero images
- **Clear mismatches: 20 findings** (19 distinct images; `rfid-nail-tag.jpg` hits 2 pages)
- **Broken / wrong-path: 2** (1 one-line repoint, 1 placeholder 404)
- Borderline left CLEAN (UNCERTAIN, optional review): ~22
- Competitor-brand candidates spotted in passing (Check B follow-up): 5
- Clean: the remainder (~248 images)

Report-only (per skill): no files were edited.

---

## Flagged — clear mismatches (with replacement search queries; verify license before use)

### Off-topic subject (wrong scene entirely)
1. **rfid-reader-not-detecting-tags-troubleshooting** (blog) — `/blog-images/rfid-reader-not-detecting-tags-troubleshooting.jpg`
   - shows: a vintage Soviet CI-93 oscilloscope. Page: RFID reader troubleshooting guide.
   - queries: "UHF RFID reader antenna fixed mount installation", "RFID reader handheld scanning tags warehouse troubleshooting"
2. **how-to-program-nfc-tags** (blog) — `/blog-images/how-to-program-nfc-tags.jpg`
   - shows: a COVID contact-tracing app on a phone. Page: how to program/encode NFC tags.
   - queries: "writing NFC tag with smartphone NFC app screen", "person encoding NFC sticker phone tap NDEF"
3. **nfc-tag-programming-android-guide** (guides) — `/blog-images/smartphone-nfc.jpg`
   - shows: an Apple **iPhone (iOS)**. Page: Android NFC stack developer guide — wrong platform.
   - queries: "android phone nfc tag tap programming", "samsung android smartphone writing nfc tag"
4. **google-review-cards-for-dental-groups** (guides) — `/blog-images/healthcare-rfid.jpg`
   - shows: a hospital surgical operating room. Page: NFC review cards for dental practices.
   - queries: "dental office reception desk modern", "dentist patient checkout front desk clinic"
5. **rfid-attendance-system** (solutions) — `/landing-images/hero/solutions-rfid-attendance-system.webp`
   - shows: an upscale restaurant dining room. Page: workforce time-and-attendance clock-in.
   - queries: "employee tapping RFID badge on wall time clock reader", "RFID access card turnstile attendance clock-in office"
6. **rfid-keyfobs-access-control** (solutions) — `/landing-images/hero/solutions-rfid-keyfobs-access-control.webp`
   - shows: a cafe/coffee-bar back counter. Page: RFID keyfobs for building access control.
   - queries: "RFID keyfob access control door reader closeup", "hand presenting RFID fob to wall reader office entrance"
7. **google-review-card-placement-guide** (guides) — `/blog-images/business-card-hand.jpg`
   - shows: a graphic-design/typography flat-lay (tablet, headphones, design mag). Page: where to place NFC review cards.
   - queries: "NFC review card on cafe checkout counter tap", "QR/NFC Google review card table tent front desk"
8. **google-review-cards-for-clinics** (solutions) — `/landing-images/nfc-medical-alert-wristband.jpg`
   - shows: a transit fare-card tap at a turnstile. Page: clinic/dental NFC review-prompt cards.
   - queries: "patient tapping NFC review card phone clinic reception", "NFC Google review card dental office front desk"

### Wrong product category (product page shows a different product)
9. **rfid-temperature-sensor-tag** (products) — `/landing-images/rfid-temperature-sensor-tag.jpg`
   - shows: a standalone **testo** temperature data-logger. Page: passive UHF RFID temp-sensor tag. (also rival brand "testo")
   - queries: "passive UHF RFID temperature sensor tag inlay", "RFID cold chain temperature logging label EM4325 Magnus S3"
10. **rfid-wristwatch-tag** (products) — `/landing-images/rfid-wristwatch-tag.jpg`
    - shows: a vintage mechanical Atlantic wristwatch. Page: RFID/NFC wearable access credential.
    - queries: "NFC RFID wristband watch access silicone band", "RFID wearable watch tag resort waterpark credential"
11. **uhf-rfid-retail-price-label** (products) — `/landing-images/uhf-rfid-retail-price-label.jpg`
    - shows: a vintage cardboard "Alexander's" punch price ticket. Page: modern UHF RAIN RFID inlay label.
    - queries: "RAIN RFID adhesive retail price label shelf", "UHF RFID apparel hang tag printed barcode inlay"
12. **uhf-rfid-card** (products) — `/landing-images/uhf-rfid-card.jpg`
    - shows: a short-range NFC digital business/contact card + phone. Page: long-range UHF (EPC Gen2v2) access card.
    - queries: "UHF RFID card vehicle parking gate reader", "long range RFID card access control reader"
13. **rfid-nail-tag** (products) — `/landing-images/rfid-nail-tag.jpg`
    - shows: flat adhesive RFID label strips on cardboard boxes. Page: hammer-in UHF nail/spike transponder.
    - queries: "RFID nail tag hammer-in UHF transponder steel nail", "UHF RFID spike nail tag wood pallet timber"
14. **rfid-tree-tag** (products) — `/landing-images/rfid-nail-tag.jpg` (same image, 2nd page)
    - shows: label strips on boxes. Page: forestry tree tag (nailed to trees, chain-of-custody).
    - queries: "RFID tree tag forestry nail-on plastic", "UHF RFID tag attached to tree trunk forest inventory"
15. **waterproof-uhf-rfid-outdoor-tag** (products) — `/landing-images/waterproof-uhf-rfid-outdoor-tag.jpg`
    - shows: a **Caterpillar (CAT)** excavator, no tag. Page: rugged waterproof UHF RFID tag. (also rival brand "CAT")
    - queries: "rugged waterproof UHF RFID hard tag on metal asset outdoor", "IP68 industrial UHF RFID tag mounted equipment marine"
16. **rfid-cable-tie-tag** (products) — `/landing-images/rfid-cable-tie-tag.jpg`
    - shows: a fire-extinguisher inspection-record tag (likely an image swap with the fire-extinguisher page). Page: cable-tie asset tag for pipes/cables.
    - queries: "RFID nylon cable tie tag wrapped around pipe UHF", "self-locking RFID zip tie tag cable conduit asset"
17. **rfid-surgical-instrument-tag** (products) — `/landing-images/rfid-surgical-instrument-tag.jpg`
    - shows: an "Anti-Liquid UHF Tag" banner for blood bags. Page: autoclave-proof tag for surgical instruments.
    - queries: "tiny RFID tag surgical instrument forceps autoclave", "ceramic UHF RFID tag laser-marked surgical instrument tray"
18. **nfc-warranty-seal-tag** (products) — `/landing-images/nfc-warranty-seal-tag.jpg`
    - shows: a wine-bottle retail display, no seal/tag product. Page: destructible-vinyl NFC tamper seal.
    - queries: "tamper evident destructible vinyl security label seal closeup", "NFC tamper seal sticker on product box void label"
19. **nfc-medical-alert-wristband** (products) — `/site-assets/wp-content/uploads/2024/09/RFID_silicone_wristband_application.jpg`
    - shows: a **Visa**-branded payment wristband tapping a POS terminal. Page: emergency medical-alert wristband. (wrong application + payment brand)
    - queries: "medical alert silicone wristband NFC tap emergency", "medical ID bracelet allergy band hospital"
20. **nfc-art-provenance-tag** (products) — `/landing-images/nfc-art-provenance-tag.jpg`
    - shows: bulk rolls of generic round NFC party stickers. Page: NTAG 424 DNA cryptographic art certificate. (NOTE: same image is fine on its other page, the wine/spirits blog)
    - queries: "NFC tag on artwork frame certificate of authenticity", "tamper-evident NFC seal label fine art provenance"

---

## Broken / wrong-path
- **rfid-warehouse-management** (solutions) — `heroImage: /landing-images/warehouse-led.jpg` does not exist there, but the file IS on disk at **`public/blog-images/warehouse-led.jpg`**. → One-line fix: repoint `heroImage` to `/blog-images/warehouse-led.jpg` (no new image needed).
- **california-rfid-privacy-law** (guides) — `heroImage: /blog-images/access-control.jpg` is a **29-byte HTML "404" placeholder**, not a real image (renders nothing). → Source a real access-control / RFID-privacy image.

---

## Competitor / third-party brand candidates spotted during Check A (for the Check-B singleton follow-up — the pending "17th" competitor logo likely lives here)
- **testo** — `rfid-temperature-sensor-tag.jpg` (rival; also a topic mismatch above)
- **CAT / Caterpillar** — `waterproof-uhf-rfid-outdoor-tag.jpg` (also a topic mismatch above)
- **ETISOFT** — `rfid-hose-tag.jpg` (RFID label maker — rival)
- **HID** — `rfid-waste-bin-tag.png` (rival access/RFID maker)
- **ekster** — `rfid-blocking-card.png` (consumer brand, on-topic but a third-party mark)
- (lower priority / not RFID-maker rivals: "FIFA" on woven wristbands; Visa/Mastercard on payment-card shots; Samsung on the smart-lock photo — a lock, on-topic.)

---

## UNCERTAIN — borderline, left CLEAN per the conservative rule (optional review)
- icode-slix-card.jpg → icode-slix-card / icode-slix-chip-encyclopedia — cards read "NXP DESFire EV2" but pages are ICODE SLIX (wrong chip family named on-card)
- pvc-rfid-wristband.png → pvc-rfid-wristband — paper/Tyvek event band vs waterproof PVC SKU
- rfid-coin-tag.jpg → rfid-manhole-cover-tag — light white token disc on a rugged infrastructure page
- rfid-pcb-screw-mount-tag.png → rfid-screw-tag — on-metal disc, no screw/thread form
- rfid-loyalty-card.jpg → rfid-loyalty-card — wooden card vs "PVC ISO 7810" framing
- nfc-product-authentication.jpg → nfc-product-authentication — NFC *payment* scene vs product authentication
- rfid-tyvek-wristband-alt.jpg → rfid-tyvek-wristband — woven fabric band vs "Tyvek" title
- uhf-rfid-apparel-hang-tag-retail.jpg → uhf-rfid-apparel-hang-tag-retail — woven textile tags vs paper hang tags
- solutions-google-review-nfc-card.webp / solutions-google-review-cards-for-checkout-counters etc. — NFC payment scene vs review cards
- solutions-rfid-access-control.webp → rfid-access-control — reception desk, no access hardware
- coconut-shell-rfid-wristbands-eco.jpg — disposable paper band vs reusable-coconut thesis
- how-to-choose-rfid-wristband-material.jpg — woven cord bracelets vs silicone/fabric/Tyvek
- hotel-front-desk.jpg → google-review-card-staff-prompt-playbook — kitchen knife/herbs (filename says front-desk)
- nfc-event-ticket-sticker.jpg → nfc-event-ticket-sticker — transit fare validator vs event sticker
- rfid-dry-inlay-alt.jpg → rfid-dry-inlay — diagram labeled "RFID STICKER"/adhesive vs no-adhesive dry inlay
- solutions-google-review-cards-for-tabletop-prompts.webp — decorated table, product absent
- hotel-key-card-suppliers-guide.jpg — generic green PCBs, no card
- waterproof-rfid-tags-outdoor.jpg → waterproof-rfid-tags-outdoor — Garmin GPS watch (thematic stand-in)
- rfid-high-temperature-ceramic-tag.jpg → high-temp pages — black tag vs white ceramic
- nfc-food-traceability-label.jpg → nfc-food-traceability-label — produce stall, label not shown
- paper-rfid-wristband.jpg → paper-rfid-wristband — woven band vs "paper/disposable" title

---

## Notes
- Clean by group makes up the remainder; heavily-reused stock heroes (`industrial.webp` ×10, `retail-apparel.jpg` ×8, `brand-protection.png` ×4, `eu-compliance.jpg` ×5, `impinj-m700/m800` inlays, `hospital-patient-id-wristband.jpg` ×4) were all judged on-theme on every page they appear.
- Replacement candidates are search *queries*, not vetted licensed images — verify licensing before any use.
