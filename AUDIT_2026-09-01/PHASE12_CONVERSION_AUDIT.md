# Phase 12 — Conversion Audit

Method: source review (`src/pages/rfq.astro`, `src/components/editorial/InlineRfqForm.astro`, `PageScript.astro` bundle, snapshot contact form), rendered-HTML field inventory (clean `HEAD` build), and live DOM interaction on `/rfq/` in Chrome **without submitting any form** (no real inquiry was sent; Formspree account not accessible — delivery is inferred from configuration only). No changes made.

## 1. Lead-capture inventory

| Form | Where | Endpoint | Required fields | Labels | Honeypot | Privacy text | Success state | Error state | Tracking |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RFQ wizard (5 steps) | `/rfq/` | Formspree `xlgorlog` via `fetch()`; native POST fallback | product, frequency, quantity, name, email, country (6 of 49 inputs) | 33 `<label>` + fieldset legends; `aria-live="polite"`, `aria-describedby` errors | `_gotcha` ✓ | **none** (no privacy sentence or link inside the form) | on-page `#rfq-success` with mailto/WhatsApp fallback ✓ | on-page `#rfq-error` with prefilled `mailto:` draft carrying answers ✓ | `generate_lead`, `form_submit`, hidden attribution (utm_*, referrer, landing_page, cta_tier, cta_label, ga_client_id) ✓ |
| Contact form (WordPress-era Kadence markup) | `/contact/` (+ 9 intent variants) | Formspree `xlgorlog`, plain POST | name, email, message | **5 labels for 20 inputs** (placeholder-driven) | `_gotcha` ✓ | "We'll only use this to reply" ✓ | **off-site**: browser navigates to Formspree's hosted thank-you page (no `_next`, no JS interception) | Formspree error page | attribution hidden fields ✓; no submit event captured (no JS handler for `.kb-form`) |
| Sample-pack form | `/sample-pack/` | Formspree `xlgorlog`, plain POST | **email only** (name, company, application optional) | 6 labels / 21 inputs | **none** | ✓ | off-site Formspree page | Formspree page | `generate_lead` fires client-side before navigation |
| Inline RFQ (product/solution/guide pages) | 511 pages | Formspree `xlgorlog`, plain POST (`_subject` = page title) | **email only** | 6 labels / 21 inputs | **none** | ✓ | off-site Formspree page | Formspree page | `generate_lead` (lead_source inline_rfq_form) |
| Newsletter (homepage) | `/` | `action=""` + hidden `action=kb_process_ajax_submit` (WordPress AJAX) | — | — | `_kb_verify_email` | — | **broken**: posts to nothing; `<noscript>` says "Please enable JavaScript … to submit the form" | — | — |
| WhatsApp | footer + FAB (all pages) | `https://wa.me/8618665820632?text=…` | — | — | — | — | opens WhatsApp ✓ | — | `contact_click{channel:whatsapp}` ✓ |
| Phone | footer | `tel:+8618665820632` (mobile) ✓ | — | — | — | — | — | — | `contact_click` |
| Email | footer + product pages | `mailto:info@proudtek.com` (+ prefilled subject/body on product pages) ✓ | — | — | — | — | — | — | `contact_click{channel:email}` ✓ |

Observed on `/rfq/` live: "Continue →" advances from step 1 to step 2 even when no product is selected (required radios are only enforced at final submit); focus moves to the next field (good); progress indicator present; Back disabled on step 1; one submit button "Send my quote request".

## 2. Findings

| # | Pri | Finding | Evidence | Why it matters | Recommended fix | Validation |
| --- | --- | --- | --- | --- | --- | --- |
| CV-1 | **P0** | Homepage newsletter form is dead (WordPress AJAX endpoint on a static host) | `action=""`, hidden `kb_process_ajax_submit`, noscript fallback text visible | A visibly broken form on the homepage undermines every other trust signal; no lead is captured | Remove the block or wire it to Formspree/ESP with consent checkbox | click-through test after change |
| CV-2 | P1 | Three of four lead forms end on Formspree's hosted page, not on proudtek.com | no `_next`, no fetch handler for `.kb-form` / `.codex-inline-rfq-form` | No on-site thank-you (no next step, no expectation setting, no GA4 conversion page); off-brand handoff | Reuse the RFQ wizard's fetch + `#success` pattern for inline/contact/sample-pack forms (already coded once); or set `_next` to `/thank-you/` (noindex) | submit in Formspree test mode |
| CV-3 | P1 | Sample-pack and inline RFQ forms have **no honeypot** and require only an email | field inventory | Free-sample forms attract bots and low-intent leads; specialist time is the scarce resource | Add `_gotcha`; require name + company (B2B) + application; keep short | spam rate in Formspree |
| CV-4 | P1 | Response-time promise inconsistent: "one business day" (RFQ, sample-pack, leadership, homepage) vs "within 24 hours" (FAQ) vs "6 hours" (Made-in-China) vs "2–4 hours" (rfidak.com) | Phase 4 S-01 | Buyers compare; the promise is repeated on 500+ pages | One SLA, ideally measured ("median reply 4 h on business days, last 90 days") | mailbox export |
| CV-5 | P1 | RFQ form lacks a privacy statement/link; consent banner is separate | `privacyLink:false` | EU/UK buyers (DEU, FRA, GBR impressions) expect a privacy notice at the point of collection (GDPR Art. 13) | One line + link to `/about/privacy-policy/` under the submit button on all forms | legal review |
| CV-6 | P2 | Contact form: 5 labels for 20 inputs (placeholder-only fields) | field inventory | Accessibility and completion on mobile (placeholder disappears while typing) | Explicit labels (Kadence markup can be replaced by the inline RFQ component) | axe |
| CV-7 | P2 | Wizard advances without a selection on steps 1–4 | live DOM test | Users reach step 5, submit, and only then see 6 validation errors | Validate per step (`checkValidity()` on the active fieldset) | manual test |
| CV-8 | P2 | Competing CTAs: product pages carry 3 CTA links to 2–3 targets (RFQ, contact, sample-pack) plus sticky bar "Talk to engineering" plus WhatsApp FAB | Phase 6 metrics (median 3 CTA links; "Full terms in your quote →" 192 pages) | Diluted primary action; the sticky bar overlaps content on mobile screenshots | One primary CTA per page role (below); demote others to text links | click-map after change |
| CV-9 | P2 | GA4 events fire only after consent (`analytics_storage` denied by default) | consent-mode script | Lead counts in GA4 will under-report; Formspree submission count is the source of truth | Use Formspree export as the KPI; consider server-side/consentless counting of submissions | compare GA4 vs Formspree monthly |
| CV-10 | P2 | Formspree plan/limits unknown (free plan caps submissions/month and shows a first-time email confirmation step) | not verifiable | A cap would silently drop leads | Owner: confirm plan, notification recipients, spam filter, and that `info@proudtek.com` receives every form (contact page shows `info@` in mailto) | Formspree dashboard |
| CV-11 | info | Attribution fields (utm, referrer, landing page, CTA tier/label, GA client id) are captured on every form | hidden inputs | Good — enables lead-source reporting once forms land on-site | keep | — |

## 3. Next-step fit by page role (observed vs expected)

| Buyer stage → expected next step | Page roles | Observed | Fit |
| --- | --- | --- | --- |
| Research → compare / read guide | blog, guides | Guides link to compare and products (median 18 in-content links); 8 guides and 5 compare pages have **no** CTA link at all; most blog posts show the inline RFQ form (premature) | ◐ replace inline RFQ on informational pages with "Compare → Sample" path |
| Evaluation → compatibility review or sample | compare, compatibility, industries, product family hubs | Compatibility pages: CTA "Get RFID key card samples for your hotel" ✓ but no structured "send us your lock model" form; compare pages route to RFQ or nothing | ◐ add a compatibility-review intent (`/contact/?intent=compatibility` exists as URL param but no dedicated fields: lock/reader model, firmware) |
| Purchase → structured RFQ | products, solutions, lp | RFQ wizard ✓ (5 steps, attribution, on-site success); inline RFQ on every page duplicates it with fewer fields | ✓ but two RFQ paths compete |
| Existing customer → support/contact | contact, about | `/contact/` form + WhatsApp + email ✓; no "reorder / support" intent option (rfidak.com has `intent=repeat-order`) | ◐ |

## 4. Interpretation and expected impact
Lead capture works today mainly through the RFQ wizard, WhatsApp and email; the other three forms function but hand the buyer to a third-party page and accept anonymous single-field submissions. Fixing CV-1–CV-3 costs little (the site already contains the right pattern in `rfq.astro`) and directly affects qualified-inquiry rate — the success metric the brief defines. None of this changes rankings; it changes what happens to the visitors the site already gets.
