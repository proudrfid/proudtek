# markets/ playbook (10 pages, all thin — rebuild mode)

Buyer state of mind: "can a Shenzhen factory actually serve *my country* —
compliance, radio bands, shipping, duties, time zones, references." These
pages exist to answer the objections that stop a US/EU buyer from emailing a
Chinese supplier. Today they are 2-3K-char shells; they target exactly the
regions the business wants (usa, uk, germany…), so the upgrade ROI is the
highest on the site.

## Target shape (per region)

1. **Answer-first summary**: what Proud Tek ships to this region, the one
   compliance fact that matters most there, and the delivery reality
   (typical door-to-door days, DDP available or not) — canonical company
   facts only.
2. **Regional compliance section + table** — the section only a serious
   supplier writes:
   - USA: FCC Part 15 (intentional radiators), UHF band 902-928 MHz,
     NDAA §889 / TAA for government-adjacent buyers (link the access-control
     compliance content), UL 294 context for access products, CCPA.
   - EU/UK/DE: CE + RED 2014/53/EU, UHF band 865-868 MHz (ETSI EN 302 208),
     GDPR for credential/data products, REACH/RoHS, UKCA divergence for UK.
   - Other regions: the local radio allocation + the one big regulation.
   Every row sourced (FCC eCFR, ETSI, EUR-Lex). **The UHF band difference is
   the single most valuable fact on these pages** — wrong-band inventory is
   the classic cross-border sourcing mistake; say it plainly and link the
   frequency guide.
3. **Frequency/SKU fit table**: which chip/inlay variants are stocked for
   the region's band ({chip:} placeholders — e.g. UCODE/Monza inlays tuned
   for 902-928 vs 865-868).
4. **Shipping & Incoterms**: lanes (DHL/FedEx/sea), typical transit days,
   EXW vs DDP, duty/HS-code note (link the HS/tariff content if it exists).
   Company-fact rules apply: reuse canonical claims, [OWNER-CONFIRM] gaps.
5. **Proof for the region**: testimonial/case snippets already on the site
   for that region (grep first — Brazil/UAE/Australia quotes exist);
   never fabricate regional clients.
6. **FAQ ≥4**: "do you ship DDP to the US", "are your UHF tags FCC band",
   "what's the MOQ for EU orders", "how do time zones work with support".
7. **brief[] + keywords[]**: "rfid supplier for <region>", "<region> rfid
   manufacturer factory-direct", band-specific long-tails.

## Rules

- No invented lead times, duty rates, or client names. Regulatory facts get
  primary sources in sources[]; company logistics claims get grepped from
  existing pages or [OWNER-CONFIRM]-flagged.
- Keep the existing hero photo + imageSourceRoutes; a compliance-lanes or
  band-map SVG is the optional second visual.
- These pages sit near lp/ pages in intent — check the lp/ sibling for the
  same region/keyword to avoid duplicating (one topic, one page).
