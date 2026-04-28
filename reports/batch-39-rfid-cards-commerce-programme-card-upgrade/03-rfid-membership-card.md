# rfid-membership-card — SHALLOW → DEEP

**Route.** `/products/rfid-cards/rfid-membership-card/`

**Anchor standards & citations.**
- MIFARE Classic 1K (legacy Crypto-1) vs MIFARE DESFire EV3 (AES-128) — the upgrade path for any membership programme where cloning at turnstiles is a risk.
- NXP AN10922 — CMAC-based key diversification guidance for DESFire deployments (site-specific master key, per-card derived keys).
- ISO/IEC 19794-5 — face-image encoding for photo-ID membership cards.
- Integrators referenced: Mindbody, ABC Fitness Solutions, PerfectGym — the common club-management systems that consume the card UID.
- EU GDPR Art. 5/6/9 — lawful-basis selection, proportionality of biometrics if used, special-category data handling when health clubs retain medical disclosures.
- ISO/IEC 7810 (ID-1) + ISO/IEC 14443 Type A (HF contactless) + ISO/IEC 10373-1 (card durability tests).

**DEEP block inventory.**
- `statBar.items[4]` — 3-5 yr PVC lifecycle / 5-7 yr PET lifecycle / MOQ 500 printed / 100 blank / MIFARE Classic 1K vs DESFire EV3 AES-128 option matrix.
- `comparePanel` — MIFARE Classic 1K (legacy installed base) vs DESFire EV3 (secure upgrade) across cryptographic posture, reader-firmware requirement, CAPEX, and cloning resistance.
- `dataHighlight` — "3s vs 25s" — redemption latency collapse at the counter when loyalty stack moves from manual lookup to tap.
- `timeline` — 1994 MIFARE Classic launch → 2008 Crypto-1 academic break → 2016 DESFire EV2 / then EV3 → 2018 GDPR enforcement → 2026 Today (Blocker C anchor: "gym-chain-turnstile, country-club-facility, coworking-multi-site, association-event-check-in, and university-library-circulation programmes").

**Preserved sections.** The existing `challenges`, `howProudtekSolves`, `results`, and capability table were retained from the prior SHALLOW page and integrated alongside the DEEP blocks — nothing was dropped.

**Brief.** 12 `{label, items[]}` objects covering chip-family decision, photo-ID encoding, club-management-system integration, lifecycle/substrate, key-diversification per AN10922, turnstile read distances, lost-card workflow, GDPR stack, bulk issuance, artwork/numbering, accessibility, and end-of-life.

**Sources[10].** NXP MIFARE Classic 1K data sheet, NXP DESFire EV3 data sheet, AN10922, ISO/IEC 19794-5, Mindbody API docs, ABC Fitness integrator note, GDPR text, ISO/IEC 7810, ISO/IEC 14443, ISO/IEC 10373-1.

**Inbound refs (6).** `_pillar`, `mifare-ultralight-c-cards`, `lp/custom-rfid-card-printing`, `lp/bulk-rfid-cards`, `industries/fitness`, `guides/em4100-em4305-t5577-lf-chip-encyclopedia`.

**Outbound orphan scan.** 0 orphans across 6 hrefs.

**Task.** #308 completed.
