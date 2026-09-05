## Post-merge residuals after #1714 (batch B9)

Three one-concern commits, no content or URL changes.

| Commit | Change | Why |
|---|---|---|
| fix(footer) | `SiteFooter.astro` copyright `Proud Tek Co., Limited` → `{ORGANIZATION_NAME}` ("Shenzhen Proud Tek Co., Ltd") | Certificate holder name; already used by the Organization node, `/about/certifications/` and `llms.txt` since #1714. "Proud Tek Co., Limited" stays in `alternateName`. |
| fix(nav) | footer Resources label "Case Studies" → "Worked examples" | Matches the D-02 relabel and the About menu entry. |
| fix(nav) | header + footer label "Editorial & Review Board" → "Editorial & Review Functions" | Matches `/about/review-board/` H1/title after D-06. |

### Verification
- eslint clean (only the pre-existing "astro file ignored" notice)
- vitest: 23 files / 334 tests pass
- `astro build` 599 pages; `site-contract-audit` PASS outputs=599 warnings=1 (unchanged known warning)
- With `PROUDTEK_NATIVE_SHELL=1 PROUDTEK_HOME_V2=1 PROUDTEK_CATALOG_V2=1`: native footer renders "© 2026 Shenzhen Proud Tek Co., Ltd." on 532 pages, "Editorial & Review Functions" on 538 pages; zero "Case Studies" / "Review Board" labels remain.

### Deliberately not in this PR
- `/about/terms-of-use/` (11×) and `/about/privacy-policy/` (8×) still name "Proud Tek Co., Limited" as the contracting party — legal pages; waiting for the owner to confirm the registered English name (Phase 3 C1).

Details: `AUDIT_2026-09-01/PHASE14_IMPLEMENTATION_REPORT.md` §8.
