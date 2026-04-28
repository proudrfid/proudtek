# Batch 23 / Page 3 — rfid-library-book-tag

**Route:** `/products/rfid-tags/rfid-library-book-tag/`
**Upgrade:** MID → DEEP (incremental edits — no Blocker C needed)
**Sync:** clean (Zod pass)
**Inbound:** 10 references

## What changed

- `keywords[6]`: "RFID library book tag", "ISO 28560 library RFID", "ICODE SLIX2 AFI EAS", "SIP2 self-checkout RFID", "NISO RP-6-2012 library RFID", "patron-privacy ALA RFID".
- `brief[]` 7 → 11 fields — adds Operating temperature, Compliance (NISO RP-6-2012, ALA 2005 RFID Privacy Resolution, IFLA 2015 RFID Statement, BSI PD 6669:2007, FERPA, GDPR Art. 5(1)(c), ADA 2010 §707, EN 301 549), Platform integration (Koha / Polaris / Sierra / SirsiDynix / Alma / OCLC WMS / Evergreen / TLC CARL-X via SIP2 + NCIP; Bibliotheca / Tech Logic / D-Tech / Lyngsoe / MK Solutions / FE Technologies self-check kiosks; security-gate vendors).
- `statBar` on Problems: 30,000+ libraries / 50-200k items typical / 5-10 books stack read / >97% AFI switch accuracy.
- `comparePanel` on "How Proud Tek solves": generic NFC sticker vs ISO 28560-2/3 pre-encoded HF tag.
- `dataHighlight` on outcomes: minutes → seconds per-shelf inventory with AFI privacy layer preserved.
- 4-phase `timeline`: Weeks 1-3 ILS audit → 4-6 pilot branch → Months 3-9 tagging project → Month 10+ steady-state.
- Sources 8 → 10 at 5-field; added ISO 28560-3:2022 + SIP2 (3M Standard Interchange Protocol v2) references.

## Standards cited

ISO 28560-1/2/3:2022 · ISO/IEC 15693-3:2019 (AFI byte §7.4) · NXP ICODE SLIX / SLIX2 · SIP2 v2 · NISO Z39.83 NCIP v2.02 · NISO RP-6-2012 · ALA 2005 RFID Privacy Resolution · IFLA 2015 RFID Statement · FERPA · GDPR Art. 5(1)(c) · ADA 2010 §707 · EN 301 549.
