# Image attributions

Third-party images used in `public/landing-images/` that require attribution
under their source license are listed here.

## sheraton-hotel-keycard.jpg

- **Source:** Wikimedia Commons — "Hotel Room Magnetic Stripe Key Card - Sheraton"
- **URL:** https://commons.wikimedia.org/wiki/File:Hotel_Room_Magnetic_Stripe_Key_Card_-_Sheraton_(43777103072).jpg
- **Original Flickr URL:** https://www.flickr.com/photos/diversey/43777103072/
- **Author:** Tony Webster (Flickr user `diversey`, Minneapolis, MN, USA)
- **License:** Creative Commons Attribution 2.0 Generic (CC BY 2.0) — https://creativecommons.org/licenses/by/2.0/
- **Modifications:** downloaded the 1,280 × 840 Wikimedia thumbnail of the 7,023 × 4,607 original; no color or content alteration. A matching `sheraton-hotel-keycard.webp` was re-encoded from this JPEG at quality 85 via Pillow.
- **Used on:** `/guides/hotel-key-card-artwork-and-printing-checklist/` (2026-05-11 hero fix). Replaces `ppc-custom-rfid-cards.jpg` on that page, which was an airport employee-pass photo and did not match the hotel key-card artwork brief the article describes. The Sheraton card shown here illustrates a real branded hotel key card with matte finish, foil-stamped logo and small chip cut-out — visually accurate for the substrate, finish-stack and brand-color choices the checklist walks through. The old `ppc-custom-rfid-cards.{jpg,webp}` files are retained unchanged for the other 12 pages that reference them.

## impinj-m700-uhf-inlay.jpg

- **Source:** Wikimedia Commons — "RFID tag in a label 1"
- **URL:** https://commons.wikimedia.org/wiki/File:RFID_tag_in_a_label_1.png
- **License:** Creative Commons Zero (CC0 1.0) — public-domain dedication, attribution not legally required but credited here for transparency.
- **Modifications:** flattened RGBA → RGB on white, resized from 2214 × 1024 to 1600 × 740, re-encoded as JPEG q85 progressive.
- **Used on:** `/products/rfid-labels/impinj-m700-uhf-inlay/` (round-3 hero fix, 2026-04-22). Replaces a stock photo of HF/NFC copper loop antennas that did not match the UHF inlay subject. The new image shows a real UHF inlay (dipole + central UHF chip strap) embedded under a printed shipping/asset label — visually accurate for the M700's primary retail/logistics use cases. The same image now also drives the M730 catalog tile via `CATALOG_IMAGE_OVERRIDES` (M730 shares the M700 inlay reference per the comment in `src/lib/catalog-pages.ts`).

## rfid-wet-inlay.jpg

- **Source:** Wikimedia Commons — "IC Inlay of Standard Ticket Transit Card"
- **URL:** https://commons.wikimedia.org/wiki/File:IC_Inlay_of_Standard_Ticket_Transit_Card.jpg
- **Author:** Tobyraccoon (Wikimedia Commons contributor)
- **License:** Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) — https://creativecommons.org/licenses/by-sa/4.0/
- **Modifications:** cropped and resized from the 4281 × 3211 original to a
  1200 × 729 hero image; no color or content alteration beyond framing.
- **Used on:** `/products/rfid-labels/rfid-wet-inlay/` (and the matching
  `/products/all/` catalog card via `CATALOG_IMAGE_OVERRIDES` in
  `src/lib/catalog-pages.ts`).

## rfid-tire-label.jpg

- **Source:** Wikimedia Commons — "Car tire closeup 1 2019-01-15"
- **URL:** https://commons.wikimedia.org/wiki/File:Car_tire_closeup_1_2019-01-15.jpg
- **Author:** Fastily (Wikimedia Commons contributor)
- **License:** Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) — https://creativecommons.org/licenses/by-sa/4.0/
- **Modifications:** cropped and resized to a 1200 × 1120 hero image; no color
  or content alteration beyond framing.
- **Used on:** `/products/rfid-labels/rfid-tire-label/` (round-2 hero fix,
  2026-04-18).

## rfid-ibc-chemical-drum-tag.jpg

- **Source:** Wikimedia Commons — "Barrels filled with sealants"
- **URL:** https://commons.wikimedia.org/wiki/File:Barrels_filled_with_sealants.jpg
- **Author:** Cjp24 (Wikimedia Commons contributor)
- **License:** Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0) — https://creativecommons.org/licenses/by-sa/3.0/
- **Modifications:** resized from 2400 × 1319 to 1200 × 659; no color or
  content alteration.
- **Used on:** `/products/rfid-tags/rfid-ibc-chemical-drum-tag/` (round-2 hero
  fix, 2026-04-18).

## rfid-helmet-tag.jpg

- **Source:** Flickr — "Safety Helmets" (Wikimedia Commons mirror)
- **URL:** https://commons.wikimedia.org/wiki/File:Safety_Helmets_(33050546420).jpg
- **Author:** Michael Coghlan (Flickr user mikecogh)
- **License:** Creative Commons Attribution-ShareAlike 2.0 Generic (CC BY-SA 2.0) — https://creativecommons.org/licenses/by-sa/2.0/
- **Modifications:** resized from 1474 × 1140 to 1200 × 928; no color or
  content alteration.
- **Used on:** `/products/rfid-tags/rfid-helmet-tag/` (round-2 hero fix,
  2026-04-18; replaced placeholder `eu-compliance.jpg`).

## nfc-battery-passport-tag.jpg

- **Source:** Wikimedia Commons — "Lithium-Ion Battery for BMW i3 - Battery Pack.JPG"
- **URL:** https://commons.wikimedia.org/wiki/File:Lithium-Ion_Battery_for_BMW_i3_-_Battery_Pack.JPG
- **Author:** RudolfSimon (Wikimedia Commons contributor)
- **License:** Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0) — https://creativecommons.org/licenses/by-sa/3.0/
- **Modifications:** resized from 3802 × 2770 to 1200 × 874; no color or content alteration.
- **Used on:** `/products/rfid-labels/nfc-battery-passport-tag/` (round-3 hero fix, 2026-04-18).

## rfid-book-spine-label.jpg

- **Source:** Wikimedia Commons — "Shelves of Language Books in Library.JPG"
- **URL:** https://commons.wikimedia.org/wiki/File:Shelves_of_Language_Books_in_Library.JPG
- **Author:** ParentingPatch (Wikimedia Commons contributor)
- **License:** Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0) — https://creativecommons.org/licenses/by-sa/3.0/
- **Modifications:** resized from 2592 × 1936 to 1200 × 896; no color or content alteration.
- **Used on:** `/products/rfid-labels/rfid-book-spine-label/` (round-3 hero fix, 2026-04-18).

## nfc-spirits-authentication-label.jpg

- **Source:** Wikimedia Commons — "Old Smuggler Scotch whisky.jpg"
- **URL:** https://commons.wikimedia.org/wiki/File:Old_Smuggler_Scotch_whisky.jpg
- **Author:** Makary (Wikimedia Commons contributor)
- **License:** Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0) — https://creativecommons.org/licenses/by-sa/3.0/
- **Modifications:** resized from 2069 × 3422 to 726 × 1200; no color or content alteration.
- **Used on:** `/products/rfid-labels/nfc-spirits-authentication-label/` (round-3 hero fix, 2026-04-18).

## rfid-panel-antenna.jpg

- **Source:** Wikimedia Commons — "Rfid-antenna.JPG"
- **URL:** https://commons.wikimedia.org/wiki/File:Rfid-antenna.JPG
- **Author:** Lvova (Wikimedia Commons contributor)
- **License:** Public domain — released worldwide by the author via Template:PD-self.
- **Modifications:** none beyond filename rename; original 2115 × 1722 retained.
- **Used on:** `/products/rfid-readers/fixed-uhf-rfid-reader/` (round-5 hero fix, 2026-04-22 — supersedes a round-4 pole-mounted TransCore shot that read as street/tolling photography rather than the warehouse-dock / portal context the page actually covers; the panel antenna is the most visually-recognisable part of a fixed R700 / FX9600 / ALR-F800 installation).

## Round-3 provenance-unverified images (2026-04-18)

The following hero images were reused from a prior agent's bulk CC-licensed download
(Wikimedia Commons / Flickr CC candidate pool) but the exact source URL was not
captured at download time. Filenames hint at original source; provenance
reconstruction was attempted but not conclusively matched within the session
budget. Peter should verify before release if rigorous licensing is needed.

| File | Topic / hint | Likely library |
|---|---|---|
| rfid-aircraft-part-tag.jpg | F-16 jet engine maintenance, US Air Force airmen | Wikimedia (DoD PD) / Flickr CC |
| rfid-ammo-can-tag.jpg | Olive-drab M60/M73 ammunition box with 200 cartridges markings | Wikimedia / Flickr CC |
| uhf-rfid-blank-label.jpg | Thermal label printer with blank label rolls on desk | Wikimedia / Flickr CC |
| nfc-cannabis-tracking-label.jpg | Single cannabis bud on reflective surface | Wikimedia / Flickr CC |
| nfc-food-traceability-label.jpg | Farmers' market produce baskets (tomatoes + corn) | Wikimedia / Flickr CC |
| nfc-luxury-handbag-tag.webp | Brown leather tooled handbags hanging in market | Wikimedia / Flickr CC |
| rfid-metal-keyfob.jpg | Metal "SE Special Edition" commemorative keyfob with leather strap | Flickr CC |
| waterproof-uhf-rfid-outdoor-tag.jpg | Caterpillar 325 yellow excavator on construction site | Wikimedia / Flickr CC |
| uhf-rfid-pallet-label.jpg | Warehouse with pallet racks, forklift, IBC totes | Wikimedia / Flickr CC |
| uhf-rfid-retail-price-label.jpg | Vintage "Alexander's" paper price tags with $2.99 price | Flickr CC |
| nfc-sneaker-authentication-tag.webp | Pair of white/neon athletic sneakers on concrete | Flickr CC |
| rfid-temperature-sensor-tag.jpg | Testo testostor 175 white data logger with ruler | Wikimedia (Testo product) |
| rfid-wristwatch-tag.jpg | Vintage "Atlantic" branded 17-jewel wristwatch | Wikimedia / Flickr CC |

Source: unverified — prior-agent download from CC-licensed library (Wikimedia/Flickr CC); provenance reconstruction incomplete. Flag for Peter to review — may need re-licensing or replacement if rigorous attribution is required.
