# Batch 36 — rfid-cards flagship chip-family MID → DEEP upgrade

**Cluster**: `products/rfid-cards/` flagship chip-family pages
**Framework target**: DEEP (keywords 6, brief ≥11 labelled objects, statBar + comparePanel + dataHighlight + timeline in titled sections, sources ≥8 five-field, Blocker C de-identification anchor in final timeline item)
**Pages upgraded**: 5
**Status**: ✅ All pages pass DEEP audit · astro sync clean · inbound-ref ≥4 · no orphan internal refs

## Pages

| # | Slug | Anchor shift | DEEP blocks | Sources | Inbound refs |
|---|------|--------------|-------------|---------|--------------|
| 1 | `mifare-desfire-ev3-card` | ISO/IEC 14443 + 7816-4 + FIPS 197 + SP 800-38B + CC EAL5+ + NXP AN10922/AN12343 + NFC Forum T4 + APTA TCRP 115 + EN 1545 + Garcia CRYPTO 2008 | 4/4 | 12 | 42 |
| 2 | `ntag424-dna-tt-card` | ISO/IEC 14443 + NFC Forum T4 + NXP AN12196 (SUN/SDM) + AN10922 + FIPS 197 + SP 800-38B + GS1 Digital Link 1.3 + EU ESPR 2024/1781 + EU FMD 2011/62/EU + Delegated Reg 2016/161 + OECD/EUIPO 2021 | 4/4 | 11 | 19 |
| 3 | `mifare-plus-se-card` | ISO/IEC 14443 + ISO/IEC 7810 + FIPS 197 + SP 800-38B + NXP Plus SE datasheet + AN10922 + CC EAL4+ + HID iCLASS SE / SALTO XS4 / Aperio / dormakaba refs + Garcia CRYPTO 2008 + ISO/IEC 10373-6 | 4/4 | 10 | 19 |
| 4 | `mifare-classic-1k-card` | ISO/IEC 14443 + 7810 + 7811-2 + 10373-6 + NXP MF1ICS50 + MAD AN103787 + Nohl & Plötz 24C3 + Garcia ESORICS 2008 + de Koning Gans CARDIS 2008 + Flipper FZS-1 / Proxmark3 | 4/4 | 9 | 31 |
| 5 | `em4100-rfid-card` | EM Micro EM4100/EM4200 + ISO/IEC 18000-2 + 7810 + 10373-6 + HID Prox + Nohl USENIX 2008 + Proxmark3 iceman + Flipper FZS-1 | 4/4 | 9 | 13 |

## Verification evidence

- `npx astro sync` → clean (667 ms after final Page 5/5 write; 936 ms after Page 5/5 individual sync)
- Inbound-ref threshold: min 13 (`em4100-rfid-card`), max 42 (`mifare-desfire-ev3-card`) — all ≥ 4 target
- Orphan-ref scan: 0 true internal orphans (first pass flagged 5 matches — all external `nxp.com/products/rfid-nfc/...` and `hidglobal.com/products/cards-and-credentials/...` citation URLs inside `sources[].url`, not Astro routes)
- DEEP audit pass on all 5: keywords 6, brief 12 labelled objects, sources 9–12 with full 5-field structure (label/url/publisher/publishedAt/accessedAt/note), statBar + comparePanel + dataHighlight + timeline all present, Blocker C anchor phrase ("Deployment patterns integrators follow on …") present in final timeline item of every page

## De-identification anchor (Blocker C) — per-page phrases

1. **mifare-desfire-ev3-card**: *transit-fare-collection, campus-multi-application-credential, enterprise-access-control, government-employee-ID and hospitality-keycard DESFire-EV3 programmes*
2. **ntag424-dna-tt-card**: *luxury-goods-authentication, pharmaceutical-tamper-seal, wine-spirits-provenance, cosmetics-warranty and digital-product-passport NTAG-424-DNA-TT programmes*
3. **mifare-plus-se-card**: *large-enterprise-Classic-migration, multi-year-campus-rollout, hospitality-keycard-upgrade, healthcare-staff-ID and phased-access-control MIFARE-Plus-SE programmes*
4. **mifare-classic-1k-card**: *gym-membership-issuance, event-badge-programme, budget-hospitality-keycard, time-attendance-terminal and loyalty-card-fleet MIFARE-Classic-1K programmes*
5. **em4100-rfid-card**: *residential-apartment-access, factory-time-attendance, parking-barrier-gate, construction-site-entry and contractor-visitor-badge EM4100-125-kHz programmes*

## dataHighlight focal values (per-page decision pivots)

1. **DESFire EV3** — *150–180 ms* fare-gate tap cycle vs *USD 30* Flipper Zero Classic 1K clone rig (throughput vs security economics)
2. **NTAG 424 DNA TT** — *USD 464B* OECD 2021 global counterfeit trade (3.3% of world trade) set against *2⁻¹²⁸* AES-CMAC collision ceiling
3. **MIFARE Plus SE** — *70–85%* reader capex deferred across a 3–5 year window on a 5,000-reader estate (EUR 2.0–3.5M) vs DESFire rip-and-replace
4. **MIFARE Classic 1K** — *~10 B* cumulative MIFARE ICs shipped vs *<60 s* Flipper Zero Classic 1K clone time
5. **EM4100 125 kHz** — *<5 s* T5577 clone time with a EUR 20 duplicator as the EM4100-vs-Plus-SE threat-model pivot

## Workflow notes

- Per-page sequence on every SKU: Read → Write full page (single Write tool call) → `npx astro sync` → TaskUpdate → next page
- No errors encountered; all 5 pages passed sync on first write
- Missing `dataHighlight` block was added to every page (none of the prior MID versions contained one)
- Every `sources[]` entry upgraded from 3–4 field partials to the full 5-field (label / url / publisher / publishedAt / accessedAt / note) shape
- Brief arrays raised from 8–10 string entries to 12 labelled `{label, items[]}` objects on every page

## Next

Batch 36 closes the `rfid-cards/` flagship chip-family MID → DEEP sweep (5/5 complete). The rfid-cards cluster now has every flagship chip-family page on the DEEP framework. Downstream batches can target `rfid-cards/` residual specialty SKUs or move to the next product-family cluster per the broader SHALLOW → DEEP programme.
