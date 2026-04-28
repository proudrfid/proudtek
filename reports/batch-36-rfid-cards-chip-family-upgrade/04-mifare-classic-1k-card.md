# Page 4/5 — `mifare-classic-1k-card.json` MID → DEEP

**Route**: `/products/rfid-cards/mifare-classic-1k-card/`
**Previous state**: MID (inbound-ref magnet, 6 partial sources, no dataHighlight)
**Upgrade state**: DEEP (framework-complete)
**Inbound refs**: 31 · **Sync**: clean (993 ms)

## Anchor set

ISO/IEC 14443 Type A · ISO/IEC 7810 ID-1 · ISO/IEC 7811-2 (magstripe combo) · ISO/IEC 10373-6 · NXP MF1ICS50 datasheet · NXP MAD (MIFARE Application Directory) AN103787 · Nohl & Plötz 24C3 (2007) *Crypto-1 reverse engineering* · Garcia et al. ESORICS 2008 · de Koning Gans et al. CARDIS 2008 · Flipper Zero FZS-1 / Proxmark3 clone tooling

## DEEP block inventory

- `statBar` (upgraded): *"~10 B"* cumulative MIFARE ICs shipped (NXP public figure) + Crypto-1 48-bit stream cipher + 16-sector / 1 KB layout + 13.56 MHz ISO/IEC 14443 compliance
- `comparePanel`: MIFARE Classic 1K vs Classic 4K vs MIFARE Plus SE (capacity + security posture ladder)
- `dataHighlight` (new): *"~10 B vs <60 s"* — cumulative MIFARE ICs shipped set against <60 s Flipper Zero Classic 1K clone time — section title *Volume vs threat — the economic decision pivot*
- `timeline`: MIFARE Classic launch (1994) → Crypto-1 break (2007–2008) → NXP Plus migration recommendation → Flipper Zero era → 2026 deployment phase containing the Blocker C anchor

## brief[]

12 labelled objects covering: (1) chip genealogy + MF1ICS50 history, (2) 16-sector / 1 KB memory map, (3) MIFARE Application Directory (MAD) AN103787, (4) Crypto-1 48-bit stream cipher mechanics, (5) ISO/IEC 14443 air-interface + 7810 / 7811-2 form factor, (6) cryptanalysis chain (Nohl+Plötz 24C3 → Garcia ESORICS → de Koning Gans CARDIS), (7) Flipper Zero FZS-1 + Proxmark3 clone capability (<60 s), (8) NXP Plus SE migration guidance, (9) legitimate residual use-cases where 10-second-clone risk is acceptable, (10) volume economics (~EUR 0.05–0.15/card bulk), (11) MAD-based multi-application usage, (12) end-of-life / replacement posture for security-sensitive estates.

## sources (9 five-field)

NXP MF1ICS50 datasheet + MAD AN103787 + ISO/IEC 14443 + ISO/IEC 7810 + ISO/IEC 10373-6 + Nohl & Plötz 24C3 (2007) + Garcia et al. ESORICS 2008 + de Koning Gans et al. CARDIS 2008 + Flipper Zero FZS-1 / Proxmark3 documentation.

## Blocker C

Final timeline item (*Flipper Zero era — 2023 → forward*) closes with: *"Deployment patterns integrators follow on gym-membership-issuance, event-badge-programme, budget-hospitality-keycard, time-attendance-terminal and loyalty-card-fleet MIFARE-Classic-1K programmes."*

## Notes

- statBar upgraded from the soft *"~1 B+"* claim to *"~10 B"* backed by NXP public cumulative shipment figure — more defensible citation
- dataHighlight makes the volume-vs-threat pivot explicit: Classic 1K is economically hard to dislodge (10B shipped, 31 inbound refs on-site) but trivially cloneable (<60 s on a EUR 150 tool), forcing the buying question to be "is your threat model gym + event badges?"
- 6 partial sources → 9 five-field sources; cryptanalysis citation chain now traceable end-to-end
- brief[] restructured from 10 string entries to 12 labelled objects
