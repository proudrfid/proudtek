# Tokenized SVG spec — Proudtek blog illustrations

Why hex, not `var()`: these are static files under `public/`, served through
plain `<img>` — CSS custom properties never resolve there. The hexes below
deliberately mirror `src/styles/codex-tokens.css`; if the two ever diverge,
the CSS file wins (CLAUDE.md rule) — re-check it, then update this doc.

Before drawing, open 1–2 recent files in `public/diagrams/blog/` (e.g.
`nfc-protocol-stack.svg`) and imitate their scale and density. They are the
living style guide; this doc is the checklist.

## Canvas skeleton (copy this structure)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img"
     aria-labelledby="t d"
     font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
  <title id="t">One-line summary of the diagram</title>
  <desc id="d">Full prose description of everything the diagram shows —
  write it like generous alt text; screen readers and crawlers read it.</desc>
  <defs>
    <radialGradient id="bg" cx="50%" cy="16%" r="94%">
      <stop offset="0%" stop-color="#f8ead0"/><stop offset="100%" stop-color="#f4efe4"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <rect x="16" y="16" width="1168" height="643" rx="20" fill="#ffffff"
        stroke="#e6dfd2" stroke-width="2"/>
  <!-- gold ALL-CAPS kicker, then content -->
  <text x="600" y="56" text-anchor="middle" font-size="21" font-weight="800"
        letter-spacing="0.5" fill="#6d5a3a">KICKER LINE IN CAPS</text>
</svg>
```

viewBox is **exactly `0 0 1200 675`** (16:9) — components render
`<img width="1200" height="675">`, anything else letterboxes or distorts.

## Palette (hex ↔ token)

| Role | Hex | Token |
|---|---|---|
| ink / primary text | `#291c0e` | `--codex-dark` |
| muted / subtle text | `#4f4f4f` / `#5c5c5c` | `--codex-text-muted` / `-subtle` |
| gold accent | `#c39a5f` | `--codex-gold` |
| gold light | `#d4a755` | `--codex-gold-light` |
| gold muted (kickers, micro-labels) | `#6d5a3a` | `--codex-gold-muted` |
| gold border | `#e4c98f` | — |
| **teal — default editorial accent** | `#3d6b6b` | `--codex-teal` |
| teal dark | `#2c5454` / `#234a4a` | `--codex-teal-dark` |
| steel (industrial / heavy-asset topics) | `#4a5568` | `--codex-steel` |
| forest (sustainability / compliance) | `#2d6a4f` / `#1b4332` | `--codex-forest` / `-dark` |
| success green | `#1f6f3a` | `--codex-success` |
| **red — RISK/FAILURE STATES ONLY** | `#8b2d2d` | `--codex-error` |
| cyan (sparing; "action" moments) | `#1fcefb` | `--codex-cyan` |
| card surface | `#ffffff` | `--codex-surface` |
| card border | `#e6dfd2` | — |
| cream background | `#f8ead0` → `#f4efe4` | — |

Accent selection: teal by default; steel for industrial/logistics topics;
forest for sustainability/compliance. Red is never decorative — if the
diagram has no genuine failure/risk state, it contains no red.

Light tints and washes *of these hues* are welcome (the corpus uses e.g.
`#eef5f5` teal wash, `#f7edd6` cream panel, `#177a92` text-safe cyan ink) —
what's off-brand is a foreign hue: purple, magenta, blue-violet, neon green.
`check-svg.mjs` warns on those.

## Text rules (each one is a repaired production bug)

- **One `<text>` element per visual line. Never stack lines with `<tspan>`
  dy offsets** — stacked tspans overlap in real renderers. Wrap manually:
  compute the lines yourself and give each its own absolute `y`
  (line-height ≈ 1.4 × font-size).
- Sizes: display title 34–44 in `font-family="Lora, Georgia, serif"`; kicker
  21 (weight 800, ALL-CAPS, letter-spacing 0.5); body labels 14–18; captions
  12.5–14. Nothing below 12 — unreadable at article width.
- Width budget: Inter runs ≈ 0.55 × font-size per character. Keep text ≥ 48px
  from card edges; shorten labels rather than shrinking type.
- `letter-spacing` on ALL-CAPS only; `text-anchor` for alignment.

## Composition patterns that work at 1200×675

Layered stack · left/right comparison · 3–5-step flow with arrows · annotated
anatomy (central object + callout lines) · 2×2 decision grid · timeline.
One diagram makes **one point**: 5–9 labeled elements, generous whitespace —
the cream canvas is part of the brand. Tier B topics: sober, clinical,
no whimsical props.

## Naming & paths

- Directory: `public/diagrams/blog/`
- Hero: `<post-slug>-hero.svg`
- Sections: descriptive kebab names by *topic*, not post
  (`nfc-protocol-stack.svg`) so other posts can reuse them.

## Verify

`node .claude/skills/blog-transform/scripts/check-svg.mjs <files…>`, then
render each to PNG (`rsvg-convert -w 900` or `magick`) and **look at it** —
text overlap and edge collisions only show up visually.
