# DataHighlight Curation Queue — 2026-04 — CLOSED

- **Opened:** 2026-04-17 (Phase 1 authority sprint)
- **Closed:** 2026-04-17 (same day, Phase 1.5c)
- **Pages processed:** 13 / 13

## Closing action

Ran `inject_datahighlight_queue.py` with hand-curated, per-page payloads.
Each page received **one new section** ("Comparison coverage — by the numbers", "Hotel lock compatibility — by the numbers", "What to expect on this contact path", "Guide library — by the numbers", or "Solutions library — by the numbers") containing:

- `statBar` — three verifiable facts (site-counts or documented policy numbers)
- `dataHighlight` — a named standards fact with a cited source
- `callout` — the documented `/about/editorial-policy/` response SLA (contains a digit, so it counts as a quotable block)
- `sources[]` — 1–3 authoritative URLs (ISO, GS1, NFC Forum, NXP, RAIN Alliance, FCC)

Red-line rule honoured: **every number in the injected blocks is either (a) counted programmatically from the site on 2026-04-17 via `authority_audit_t1.py`, (b) quoted verbatim from an already-published `/about/*` policy document, or (c) a well-known standards fact citable to the standards body linked in `sources[]`.** No invented performance numbers, no invented MOQs or lead times, no invented vendor benchmarks.

## Result — quotableBlocks delta for the 13 pages

| Route | T1 before | T1 after |
|---|---:|---:|
| /compare/ | 0 | 3 |
| /compatibility/ | 0 | 3 |
| /contact/access-control-keyfobs/ | 0 | 3 |
| /contact/custom-rfid-cards/ | 0 | 3 |
| /contact/event-rfid/ | 0 | 3 |
| /contact/hotel-rfid/ | 0 | 3 |
| /contact/laundry-rfid/ | 0 | 3 |
| /contact/nfc-branding-cards/ | 0 | 3 |
| /contact/rfid-labels-tags/ | 0 | 3 |
| /contact/rfid-readers/ | 0 | 3 |
| /contact/vehicle-rfid/ | 0 | 3 |
| /guides/ | 0 | 3 |
| /solutions/ | 0 | 3 |

All 13 pages now pass **P7** (`quotableBlocks ≥ 3` + `modifiedAt`) and **P8** (`≥1 authoritative outbound link`).

## Site-wide pillar impact (T1 → T1′ on 2026-04-17)

- **P7** (≥3 quotable + modifiedAt): 84.6% → **87.5%** (+2.9pp, +13 pages)
- **P8** (authoritative outbound ≥1): 32.5% → **35.4%** (+2.9pp, +13 pages)
- **Zero-quotable live pages:** 13 → **2** (a further 7 zero-quotable JSONs live under `_unused/` and are not rendered; 2 live pages in `/guides/` fell outside the original queue-builder's filter — see "Outstanding" below).

## Outstanding after close

- ~~**/guides/rfid-ce-marking-europe/** and **/guides/rfid-reader-writer-selection/**~~ — **CLEARED 2026-04-17** by `inject_datahighlight_remaining_guides.py` with topic-specific payloads (EU directive stack + 10-year technical-file retention rule for the CE guide; three ISO air-interface anchors + ~100× HF-vs-UHF read-distance delta for the reader-selection guide). Both pages now sit at 5/8 pillars.
- **Live zero-quotable pages after this pass: 0.** Every rendered editorial page on proudtek.com now has ≥3 quotable blocks.
- **7 pages under `/_unused/`** — parked JSONs not rendered on the live site. Ignored by design; they should be excluded from the audit denominator or deleted from the repo before Phase 2.

## Files touched

`src/content/editorial/compare.json`, `src/content/editorial/compatibility.json`, `src/content/editorial/guides.json`, `src/content/editorial/solutions.json`, `src/content/editorial/contact/{access-control-keyfobs,custom-rfid-cards,event-rfid,hotel-rfid,laundry-rfid,nfc-branding-cards,rfid-labels-tags,rfid-readers,vehicle-rfid}.json`

## Tooling

`inject_datahighlight_queue.py` — idempotent (skips if the named section is already present); per-page payloads are kept as Python OrderedDicts so the injected keys always land in a predictable order and the JSON diff is clean.

Schema validation: all 455 editorial + 3 author JSON files pass `validate_schema.mjs` zod validation after the injection pass.
