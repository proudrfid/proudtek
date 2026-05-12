# Proud Tek 2026 RFID Industry Adoption Index — research project launch pack

**Version 1.0 · 2026-05-11**
**Sponsor:** Peter Zhang · **Lead:** ProudTek Editorial Board

This folder contains everything a research team needs to launch and run a primary-data, vendor-neutral RFID adoption survey of 200 buyers across 20 industries. The deliverables below are organized in the order you actually use them.

---

## What's in the pack

| # | File | Pages | What it is | When you use it |
|---|---|---|---|---|
| 0 | `../../src/content/editorial/research/_pillar.json` | n/a | `/research/` hub page (Astro editorial JSON). Public face of the program. | Live now — sets the program's permanent home and is the canonical URL the press release links to. |
| 0 | `../../src/content/editorial/research/2026-rfid-industry-adoption-index.json` | n/a | `/research/2026-rfid-industry-adoption-index/` landing page (Astro editorial JSON). Status, timeline, methodology, FAQ. | Live now — refresh weekly during recruitment + fieldwork. |
| 1 | `docs/01-project-charter.docx` / `.pdf` | 18 | Binding scope, methodology, governance, RACI, risk register, budget. | **Sign before recruitment opens.** Once signed it's the binding contract; changes require a written addendum. |
| 2 | `docs/02-recruitment-and-consent.docx` / `.pdf` | 26 | 20-persona table, 5-channel playbook with V1/V2/V3 outreach copy, 5-item screener, full GDPR/CCPA Participant Information Sheet, 10 consent statements, 8-step anonymization protocol, Centiment SOW outline. | Operational manual for the recruitment team. Reviewed by external research-ethics adviser before send. |
| 3 | `docs/05-survey-instrument.xlsx` | 8 sheets | 25 common-stem questions + 100 industry-specific items, recruitment funnel tracker, raw data template, pre-registered analysis cross-tabs, dashboard, methodology metadata. **241 formulas, 0 errors.** | Lives with the recruitment + analysis team end-to-end. Drop Qualtrics CSV into Raw Data sheet → cross-tabs and dashboard auto-refresh. |
| 4 | `docs/03-report-skeleton.docx` / `.pdf` | 48 | The annual report itself, structured as a real document with `[DATA]` / `[CHART]` / `[QUOTE]` / `[TABLE]` placeholders the analyst fills in after data closes. 20 one-page industry fact sheets. | Used at Week 12+ when data is frozen. Fill placeholders against the cross-tabs and dashboard. |
| 5 | `docs/04-media-and-pr-launch-pack.docx` / `.pdf` | 34 | Master press release, 10 trade-press pitch emails, 5-post LinkedIn launch sequence, CEO post, 12-Q journalist FAQ, asset inventory, crisis-comms playbook. | Loaded for D-day launch (2026-10-30). |

Generator scripts (traceable build history) live in `../../../outputs/generators/` (sandboxed; not on disk for the user).

---

## Runbook — 12-week timeline

| Week | Date | What happens | Deliverable used |
|---|---|---|---|
| W1 | 2026-05-11 → 2026-05-17 | Charter sign-off. Pre-registration submitted to Center for Open Science. Instrument frozen. | Charter (1), Survey workbook (3) |
| W2 | 2026-05-18 → 2026-05-24 | Recruitment build: outreach copy ethics-reviewed; Centiment SOW signed; LinkedIn lists built; trade-association emails sent. | Recruitment pack (2) |
| W3 | 2026-05-25 → 2026-05-31 | Recruitment opens. Daily quota dashboard review starts. | Survey workbook → Respondent DB sheet |
| W4 | 2026-06-01 → 2026-06-07 | Pilot N=20 in field. Completion-time monitoring. Attention-check calibration. | Survey workbook → Question Bank |
| W5 | 2026-06-08 → 2026-06-14 | Instrument iteration (non-hypothesis-affecting only). Reliability α confirmed ≥ 0.75. | Charter §6.3 |
| W6 | 2026-06-15 → 2026-06-21 | Main fieldwork opens. Recruitment ramps across 5 channels. | Recruitment pack (2) |
| W7–8 | 2026-06-22 → 2026-07-05 | Mid-field monitoring. Reminder sends. Channel-mix dashboard reviewed twice weekly. | Survey workbook → Dashboard |
| W9 | 2026-07-13 | Boost outreach unlocks for underfilled industries (typically agriculture, defense, aerospace, libraries). | Recruitment pack (2) §4 |
| W10 | 2026-08-15 | Fieldwork target close. Underfilled industries get a 7-day boost window. | Survey workbook → Respondent DB quotas |
| W11 | 2026-08-16 → 2026-08-22 | Data cleaning. Exclusion rules applied. Anonymization. Weighting calibrated. | Recruitment pack (2) §9, Charter §8 |
| W12 | 2026-09-05 | Analytic dataset frozen. All pre-registered analyses run. Draft report and data brief. | Report skeleton (4), Survey workbook → Analysis Cross-tabs |
| +6w | 2026-09-15 | First data brief published. Embargoed media preview opens. | Media pack (5) |
| +9w | 2026-10-30 | **D-day.** Full report + .pptx + social cards + press release wire. | Media pack (5) — hour-by-hour D-day timeline |
| +12w | 2027-01-28 | Anonymized dataset (CC-BY-4.0) + analysis code released on GitHub. | Methodology Metadata sheet |

---

## Hardening checklist before sign-off

- [ ] Charter signed by sponsor + research lead (Section 15).
- [ ] Statistical adviser identified and contracted (Charter Section 12 — `R/A` for analyses).
- [ ] Qualtrics XM license confirmed active.
- [ ] Centiment SOW signed (Recruitment pack §10).
- [ ] LinkedIn Sales Navigator seats provisioned (3).
- [ ] Participant Information Sheet reviewed by external research-ethics adviser (Recruitment pack §7).
- [ ] Pre-registration submitted to Center for Open Science and timestamp URL recorded.
- [ ] Conflict-of-interest register published at `/research/methodology/conflicts/`.
- [ ] Embargoed media preview email list compiled.
- [ ] CEO LinkedIn launch post draft approved.
- [ ] Crisis-comms holding statement reviewed by legal.

---

## Budget summary (from Charter Section 11)

Total: **USD 28,500**. Cash budget only — internal staff time tracked separately.

Top line items: Centiment B2B panel ($4,500), statistical adviser ($4,500), report design ($4,500), expert-interview honoraria ($4,000), incentives ($3,000), prize draw ($2,500), Qualtrics ($1,800), press wire ($1,200), LinkedIn Sales Nav ($750), Otter.ai ($160), 5% contingency ($1,590).

---

## Success metrics (from Charter Section 14)

**Tier 1 — research integrity (must-meet):** N≥200 with N≥8 per industry; α ≥ 0.75; attention-check failure rate <15%; κ ≥ 0.70 on qual coding; 100% of pre-registered analyses run unmodified.

**Tier 2 — citations (90 days post-launch):** ≥3 trade-press placements; named in ≥2 AI-search answers; ≥10 inbound links; ≥1,000 PDF downloads.

**Tier 3 — business impact (12 months):** ≥3-position SEO lift on ≥10 of the 20 `/industries/` pages; ≥10 inbound inquiries naming the report; ≥1 named customer engagement traceable to the report.

---

## Open questions for sponsor sign-off

1. Statistical adviser identity — Charter assumes "to be confirmed at Week 1". Decide before W1 close.
2. Charity list for incentive donations — Charter assumes Doctors Without Borders / WFP / Khan Academy. Confirm or substitute.
3. Centiment vs alternate B2B panel (Prolific Pro, Pollfish, Cint) — sponsor preference?
4. Embargo policy — current draft offers 72-hour advance access to credentialed journalists. Adjust if needed.
5. Conference submissions — RFID Journal Live! 2027 abstract deadline is typically November 2026. Decide submission topic during W12 reporting.

---

## File integrity (as generated 2026-05-11)

| File | Size | Validation |
|---|---|---|
| `docs/01-project-charter.docx` | 28.7 KB | docx schema PASS |
| `docs/02-recruitment-and-consent.docx` | 35.3 KB | docx schema PASS |
| `docs/03-report-skeleton.docx` | 34.7 KB | docx schema PASS |
| `docs/04-media-and-pr-launch-pack.docx` | 34.3 KB | docx schema PASS |
| `docs/05-survey-instrument.xlsx` | 34.7 KB | 241 formulas, 0 errors |
| PDF previews | 18 + 26 + 48 + 34 = **126 pages total** | Generated via LibreOffice |

All five deliverables match a consistent visual identity: Arial body, Proud Tek gold (`#C39A5F`) accents, ink-black headers, gold-edged callout boxes, page-numbered footers.
