# Page 2/5 — `ntag424-dna-tt-card.json` MID → DEEP

**Route**: `/products/rfid-cards/ntag424-dna-tt-card/`
**Previous state**: MID (thin brief, 6 partial sources, no dataHighlight)
**Upgrade state**: DEEP (framework-complete)
**Inbound refs**: 19 · **Sync**: clean (907 ms)

## Anchor set

ISO/IEC 14443 Type A · NFC Forum Type 4 Tag · NXP AN12196 (SUN / SDM) · NXP AN10922 (key diversification) · NIST FIPS 197 · NIST SP 800-38B (CMAC) · GS1 Digital Link 1.3 · EU ESPR 2024/1781 (Digital Product Passport) · EU Falsified Medicines Directive 2011/62/EU · Commission Delegated Regulation (EU) 2016/161 · OECD/EUIPO *Global Trade in Fakes* 2021

## DEEP block inventory

- `statBar`: AES-128 CMAC + SUN / SDM dynamic URL + tamper-loop detection + NFC Forum Type 4 compliance
- `comparePanel`: NTAG 424 DNA TT vs standard NTAG 424 DNA vs NTAG 213 (brand-protection capability ladder)
- `dataHighlight` (new): *"USD 464B"* — OECD 2021 global counterfeit trade (3.3% of world trade) set against 2⁻¹²⁸ AES-CMAC collision ceiling — section title *Why brand-protection teams buy TT — the counterfeit economics*
- `timeline`: NTAG 424 DNA release (2019) → TT tamper-loop addition → ESPR DPP uptake → 2026 deployment phase containing the Blocker C anchor

## brief[]

12 labelled objects covering: (1) chip genealogy + NTAG family position, (2) SUN / SDM mechanics (MAC + encrypted counter), (3) tamper-loop break-detection physics, (4) ISO/IEC 14443 + NFC Forum T4 air-interface, (5) AES-128 + CMAC crypto stack, (6) AN10922 key diversification, (7) GS1 Digital Link 1.3 URL scheme, (8) EU ESPR DPP obligations (2027 textiles, 2030+ electronics/batteries), (9) EU FMD + Delegated Reg 2016/161 pharmaceutical serialization, (10) brand-protection ROI math (OECD base rate), (11) phone-tap verification UX, (12) reader-side + backend verification architecture.

## sources (11 five-field)

NXP NTAG 424 DNA + AN12196 SUN/SDM + AN10922 + FIPS 197 + SP 800-38B + ISO/IEC 14443 + NFC Forum T4 + GS1 Digital Link 1.3 + ESPR 2024/1781 + FMD 2011/62/EU + OECD/EUIPO 2021.

## Blocker C

Final timeline item (*Step 5 — 2026 → forward*) closes with: *"Deployment patterns integrators follow on luxury-goods-authentication, pharmaceutical-tamper-seal, wine-spirits-provenance, cosmetics-warranty and digital-product-passport NTAG-424-DNA-TT programmes."*

## Notes

- dataHighlight inserted as new section before timeline; anchors the brand-protection buying decision on public OECD counterfeit data
- 6 partial sources → 11 five-field sources; legal/regulatory anchors (ESPR, FMD, 2016/161) added first-class rather than inline mentions only
- brief[] restructured from 8 string entries to 12 labelled objects; no industry-specific deployment claims made in Outcome prose
