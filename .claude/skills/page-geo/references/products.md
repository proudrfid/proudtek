# products/ playbook (104 mid-quality pages)

Buyer state of mind: "is this the right product, can this factory make it,
what will it cost me to find out." Product pages are money pages — every
section either qualifies the product or advances the sample request.

## Target shape

1. **S0 — problem/fit**: who this product is for, statBar with the 3-4
   headline numbers (wash cycles, read range, MOQ, unit-price band at
   volume). Numbers must be canonical company facts or sourced.
2. **Spec table** (the core upgrade for most product pages):
   columns like `Attribute | Value | Notes`. Rows: chip options (as
   `{chip:slug:short_name}` placeholders when in chip-specs.json), frequency
   band, size options, materials, attachment method, operating temp, wash
   cycles / IP rating, MOQ, lead time, certifications. One table per
   section (schema limit) — split spec vs commercial tables across sections
   if needed.
3. **Applications**: featureGrid or short bullets mapping verticals →
   which variant fits. Link the matching solutions/ page.
4. **Comparison hook**: comparePanel or a short section positioning against
   the adjacent form factor, linking the full compare/ page.
5. **Integration/encoding**: readers, protocols, encoding services,
   compatibility notes — link the compatibility/ page if one exists.
6. **FAQ ≥5**: MOQ, samples, lead time, artwork/personalization, encoding,
   compliance (REACH/RoHS/CE; NDAA/TAA when access-control adjacent),
   shipping. Reuse canonical answers from siblings, do not contradict them.
7. **sources[]**: chip datasheets for every chip family named; standards
   for every certification claimed.

## Preserve on augment

- Existing statBar/comparePanel/dataHighlight/timeline content — extend,
  don't rewrite what's already answer-first.
- Top-level fields: chipFamilies, envFamilies, relatedIndustries,
  resourceCards, brief — products pages carry these; strict zod validates.
- All `{chip:}` lines byte-frozen (gates.md).

## Common gaps found in the 2026-07-11 scan

Zero section images (hero photo only), FAQ 3-5 but generic, no spec table
(specs buried in prose bullets), summary descriptive rather than
answer-first. Fixing exactly these four moves a page from "中等" to the
completeness line — do them before considering anything fancier.
