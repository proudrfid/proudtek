# AI image-generation prompts (optional raster path)

Default illustrations are tokenized SVGs — deterministic, on-brand, free, and
editable. Use this raster path only when the user asks for photographic or
richly rendered art (or wants both). The JSON wiring is identical to SVG.

## Prompt recipe — one prompt per slot

Build each prompt from four blocks:

1. **Subject** — the section's single takeaway rendered as a physical scene.
   Not "RFID technology" but "a hotel front desk with a stack of blank white
   key cards beside an encoder, one card mid-swipe".
2. **Brand style anchor** (keep verbatim, tune the props):
   > warm cream studio background (#f4efe4), brass and antique-gold accents,
   > muted teal props, soft directional editorial light, generous negative
   > space, premium B2B trade-publication aesthetic, subtle film grain
3. **Composition**: 16:9 wide, subject off-center with clear copy space,
   eye-level or gentle top-down.
4. **Hard negatives**: `no text, no words, no letters, no logos, no
   watermarks, no glossy stock-photo people, no neon`.
   Baked-in text is the reason: models misspell it, and it can't be edited,
   localized, or restyled later — words belong in HTML and SVG.

**Example (hero, hotel key-card post):**

> A neat stack of blank white RFID hotel key cards on a walnut front desk
> beside a card encoder, one card held mid-air by a concierge's hand; warm
> cream studio background (#f4efe4), brass and antique-gold accents, muted
> teal props, soft directional editorial light, generous negative space,
> premium B2B trade-publication aesthetic; 16:9, subject left-of-center with
> copy space right; no text, no words, no logos, no watermarks, no glossy
> stock-photo people, no neon

Tier B topics (medical/pharma): clinical, sober scenes — equipment and
process, never patients in distress.

## Integration

- Target 1200×675. Convert/compress before committing:
  `cwebp -q 82 in.png -o public/diagrams/blog/<slug>-hero.webp`
- Any `/diagrams/` path renders through the plain `<img>` branch — no WebP
  pipeline to configure, no `imageSourceRoutes`.
- Wire exactly like SVG: `heroImage` + `imageAlt`, or
  `sections[].image: { src, alt }`. Alt is still a full descriptive sentence.
- Record the prompt used in the PR/handoff notes so the image can be
  regenerated or extended in a consistent style later.
