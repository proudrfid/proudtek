# Batch 49 — rfid-labels NFC chip-family + inlay-stage flagship cluster (5 pages SHALLOW → DEEP)

**Cluster theme.** NFC chip-family backbone — these are the parent SKUs that every NFC application-specific product (Batches 46-48: brand-authentication / regulatory-compliance / regulated-product-traceability) references in chip-silicon brief lists. Plus the 2 inlay-stage flagship products (dry + wet inlay) used by label-converter and card-bureau integrators.

**Pages upgraded (5).**
1. `ntag213-nfc-sticker` — entry-tier NFC Forum Type 2 Tag, 144-byte user memory, ~132 char URL, MOQ 100 — chip-family-anchor for Google review / NFC marketing / vCard-shortlink / smart-poster (44 inbound refs — 2nd most-referenced product page on site).
2. `ntag215-nfc-sticker` — mid-tier 504-byte user memory, exact Nintendo Amiibo specification (NTAG213 too small, NTAG216 wrong layout), Wi-Fi WSC + RFC 6350 vCard support, chip-type verification certificate (9 inbound refs).
3. `ntag216-nfc-sticker` — high-memory 888-byte user memory, full RFC 6350 vCard 4.0 + multi-record NDEF + smart packaging + healthcare patient-info, capability-container chip verification (0xE1 0x10 0x6D 0x00) (14 inbound refs).
4. `nfc-dry-inlay` — adhesive-free 50 µm PET inlay-stage flagship for card-bureau lamination + injection-mould embedding; ISO 7810 CR-80 + ±2 µm thickness control + 140-150 °C PVC / 180 °C polycarbonate lamination + prelam sheet service + chip-type certificate (8 inbound refs).
5. `nfc-wet-inlay` — PSA-coated inlay-stage flagship for label-converter feed; ±0.5 mm pitch + ±0.3 mm chip placement + roll format on 3-inch core + single-chip-batch rolls + UID-CSV inventory list + 100% HF read-test (16 inbound refs).

**Verification.**
- `npx astro sync` — clean across all 5 (935-951ms).
- Inbound refs: NTAG213 44, NTAG215 9, NTAG216 14, dry-inlay 8, wet-inlay 16 (all well above ≥4).
- Outbound orphan scan — 0 orphans across 33 hrefs.
- DEEP audit — keywords 6/6 + brief 12/≥11 + all 4 blocks (statBar/comparePanel/dataHighlight/timeline) + sources 10/≥8 (10/10 5-field) + Blocker C anchor present on all 5 pages.

**Cross-cluster integration.**
- NTAG213 / 215 / 216 form the NFC Forum Type 2 chip-family hierarchy (entry / mid / high memory).
- NTAG 424 DNA flagship (Batch 47) is the Type 4 + AES-128 SUN cryptographic counterpoint to the Type 2 family.
- Dry inlay → card lamination + injection mould embedding workflow.
- Wet inlay → label-converter flatbed laminator workflow + smart packaging.
- All Batch 46-48 application SKUs reference NTAG213/215/216 + NTAG 424 DNA in their chip silicon brief lists.

**Task closures.**
- #382 / #383 / #384 / #385 / #386 — page-level (all completed).
- #387 — batch verify (in_progress, completing now).
- #381 — Batch 49 parent (to close after this report committed).

**Category status: rfid-labels.** 25 of 58 SKUs DEEP after Batches 45 (UHF-inlay flagship 5), 46 (NFC brand-authentication 5), 47 (DPP / regulatory-compliance 5), 48 (regulated-product traceability 5), 49 (NFC chip-family + inlay-stage flagship 5). Next batches will progress through environmental-specialty (anti-metal / waterproof / high-temperature) and consumer-NFC application verticals (tap-to-pay / event-ticket / smart-poster / table-stand / social-media / shelf-label / gaming-collectible / cannabis-tracking already done in B48).
