# Product Page #4 (Data Injection) + #8 (GEO Retrofit) — Execution Spec

Target: Astro v5 editorial JSON files under `src/content/editorial/products/{category}/*.json`

## Source Policy (4 allowed categories)

Every concrete number (#4) must be attributable to ONE of these sources. If a number cannot be sourced, DO NOT invent it — skip or use a generic qualitative statement.

1. **Public industry reports** — IDTechEx, GS1, Gartner, Markets & Markets, Auvik, ABI Research, Grand View Research. Use rounded, well-known figures (e.g. "global RFID market reached USD 17.3 billion in 2025 — IDTechEx").
2. **ISO/EPC/NFC Forum specifications** — ISO 14443 (13.56 MHz @ 106 kbit/s), ISO 15693 (1 m vicinity), ISO 18000-6C / EPC Gen2 UHF (860–960 MHz, 8 m+), NFC Forum Type 2/5 specs. These are immutable spec constants and safe to cite.
3. **Competitor datasheet specs** — HID, Avery Dennison, Impinj, NXP, Zebra public product pages. Cite generically as "major vendor datasheets indicate…" or with vendor name.
4. **Proudtek internal data** — Use `[Proudtek internal]` or `Proudtek QA data` as source tag. When the current file already contains Proudtek-specific metrics (yield rates, lot data, customer case percentages), preserve them.

### Source citation format in JSON

- **statBar items** — append source short-form after value OR inline in label:
  ```json
  { "value": "8 m+", "label": "Read range (EPC Gen2, per ISO 18000-6C)" }
  ```
- **dataHighlight** — use the `source` field:
  ```json
  { "value": "USD 17.3 B", "heading": "Global RFID market 2025", "text": "...", "source": "IDTechEx 2025" }
  ```
- **In paragraph text** — use em-dash inline: "— per IDTechEx 2025", "— ISO 14443-3", "— HID ProxPro II datasheet"

**Never** invent specific percentages or dollar figures that cannot be sourced. Vague qualifiers ("significantly reduced", "industry-leading") are fine without citation.

## #4 Data Injection — Requirements per file

1. **statBar** (mandatory if exists) — Ensure 3–4 items, each with a concrete number. Replace any vague values like "Fast" or "Reliable" with sourced metrics. Example items (for UHF tag):
   - `{"value": "860–960 MHz", "label": "Frequency range (EPC Gen2)"}`
   - `{"value": "8–12 m", "label": "Typical read range"}`
   - `{"value": "≥ 100,000", "label": "Read cycles (NXP UCODE 9)"}`
   - `{"value": "IP68", "label": "Ingress protection"}`

2. **dataHighlight** (recommended — currently only 3 exist out of 189, add 1 per file). Place in a mid-to-late section. Must include `source`. Example:
   ```json
   "dataHighlight": {
     "value": "73%",
     "heading": "Hotels replacing magstripe with RFID",
     "text": "Report reduction in guest lockout incidents after switching to RFID keycards.",
     "source": "Oracle Hospitality 2024 Tech Survey"
   }
   ```

3. **Paragraph stat anchors** — Add 1–2 sourced numbers to existing detail paragraphs where natural. Do not bloat; replace vague phrases with specific ones.

## #8 GEO Retrofit — Requirements per file

1. **FAQ first-sentence conclusion** — Every FAQ's `answer` must start with a direct, standalone answer sentence. LLM crawlers extract first sentences. Examples:
   - Q: "What frequency does this card operate on?"
     A: **"This card operates on 13.56 MHz (ISO 14443-A).** It supports MIFARE Classic 1K encoding and …"
   - Q: "Can this tag survive autoclaving?"
     A: **"Yes — this tag withstands 200+ autoclave cycles at 134°C per EN 285.** Construction uses…"

2. **TL;DR opening** on first paragraph of sections — where missing, prepend one decisive sentence. Do NOT use the literal prefix "TL;DR:" — just a direct lead. Example:
   - Before: "Enterprises upgrading from legacy 125 kHz access control face a costly dilemma…"
   - After: **"Dual-frequency cards eliminate the rip-and-replace cost of legacy access upgrades.** Enterprises upgrading from legacy 125 kHz access control face…"

3. **Summary TL;DR check** — First sentence of top-level `summary` should be a direct categorical statement, not a marketing hook. If current summary opens weakly, strengthen the first sentence.

4. **No buzzword openings** — Remove "In today's fast-paced world…", "Are you looking for…", "Discover the…". Kill all AI-speak.

5. **Question-answer duality in FAQ** — If a question has multiple parts, answer each in the first 2 sentences.

## Schema Constraints (do not break)

- Top-level `summary` is `z.string()` — single string, NOT an array. Do not convert.
- Paragraphs within `sections[].paragraphs` are `z.array(z.string())`.
- `statBar.items[].value` and `.label` must both be strings.
- `dataHighlight.source` is optional but should be present for every dataHighlight you add.
- `faq[].answer` is `z.string()` — can contain multiple sentences but no markdown headers.
- All internal links stay in the existing whitelist format (`/products/{cat}/{slug}/`, `/blog/...`, `/solutions/...`, `/guides/...`, `/compare/...`, `/compatibility/...`, `/industries/...`, `/contact`, `/quote`). NO `https://` external links. NO legacy `/product/` format.

## Output Rules

1. Modify files in place. Preserve all existing structure, order, and unrelated fields.
2. Validate JSON parseable after every file write.
3. Do NOT change `route`, `group`, `slug`, `heroImage`, `imageSourceRoutes`, or any top-level routing fields.
4. Do NOT introduce new section types outside the schema.
5. Keep existing `/products/{cat}/{slug}/` links intact; do not add or remove inter-product links.

## Per-File Workflow (agent must follow this exactly)

For each assigned JSON file:
1. Read file and parse JSON.
2. For each FAQ answer: inspect first sentence. If it doesn't directly answer the question, rewrite just the opener. Keep the rest.
3. For the `summary` field: check first sentence opener. Fix if weak/buzzwordy.
4. For each section in `sections`: check first paragraph opener, strengthen if weak.
5. For statBar: ensure 3–4 items, each with a concrete sourceable value. Append source tag in label where applicable.
6. If no `dataHighlight` exists on any section, add one to a suitable mid-section — with `value`, `heading`, `text`, and `source`.
7. Write modified JSON back (pretty-printed with 2-space indent, UTF-8).
8. Re-parse written file to confirm validity.

## Known Sourceable Numbers (reference library)

Use these safely; they are well-established:

- **RFID market size (global, 2025)**: ~USD 17.3 B — IDTechEx
- **NFC-enabled smartphone penetration (2024)**: >85% of new smartphones — NFC Forum
- **ISO 14443-A**: 13.56 MHz, 106 kbit/s, 0–10 cm read range
- **ISO 15693**: 13.56 MHz vicinity, up to 1 m read range
- **ISO 18000-6C / EPC Gen2**: 860–960 MHz, 6–10 m typical, up to 12 m with high-gain antenna
- **NXP NTAG213**: 144 bytes user memory, 100,000 write cycles, 10-year data retention
- **NXP NTAG215**: 504 bytes user memory
- **NXP NTAG216**: 888 bytes user memory
- **NXP MIFARE Classic 1K**: 1024 bytes, 16 sectors, 200 ms transaction
- **NXP MIFARE DESFire EV3**: AES-128, 8 KB, 2 KB, or 4 KB variants
- **Impinj Monza R6**: 96-bit EPC, 32-bit TID, −20 dBm sensitivity
- **NXP UCODE 9**: 96-bit EPC, 48-bit TID, supports EPC Gen2V2
- **Alien Higgs-9**: 96-bit EPC, −22.5 dBm read sensitivity
- **Autoclave cycles for medical tags**: EN 285 / ISO 17665 — 134°C, 18 min min
- **Laundry washing cycles (UHF laundry tag)**: 200+ cycles typical for industrial laundry tags
- **IP ratings**: IP65 (dust-tight + jets), IP67 (1 m immersion 30 min), IP68 (extended immersion)
- **Operating temp range for PVC cards**: -20°C to +70°C
- **ABS keyfob temp range**: -25°C to +85°C typical

Do NOT cite these with made-up precise percentages. Cite generically or use ranges.

## Validation Checklist (run at agent end)

After modifying all assigned files, the agent must report:
- Number of files modified
- Number of FAQ first-sentence rewrites
- Number of statBar items updated
- Number of dataHighlights added
- Number of buzzword openings removed
- JSON parse: all files valid (fail if any error)
- Legacy `/product/` link check: 0 remaining (fail if any)
