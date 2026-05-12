# Design Critique — Proud Tek Homepage

**Reviewed:** `http://localhost:4321/` (localhost, latest build)
**Stage:** Early exploration / directional feedback
**Reviewer perspective:** B2B buyer landing on the site for the first time

---

## Overall Impression

A capable-looking manufacturer page with a clear English H1 and two CTAs, but the body is **~18 screens tall, filled with 29 H2s**, duplicated stats, and jarring typography inconsistencies that undermine the "trusted factory partner" story. The biggest opportunity is **aggressive cutting**: this page is trying to say everything and ends up saying nothing distinctive.

**Emotional first reaction:** "Looks like a WordPress theme dump." Not "Looks like a premium Shenzhen manufacturer I'd trust with a 500K-unit run." That gap is the core design problem.

---

## First Impression (2 seconds above fold)

| Element | Reads as | Is this right? |
|---|---|---|
| H1 "Custom RFID and NFC manufacturing for global buyers" | Clear category + audience | ✅ Good for SEO / B2B |
| Subheading "Samples, compatibility checks, and production support." | Generic — any factory could say this | ⚠️ Doesn't differentiate |
| 2× CTA "Request Quote" + "Request Samples" | Good — samples lowers the friction | ✅ |
| **No hero image** / visible product | Abstract, no proof | 🔴 Biggest lost opportunity |
| Sticky header with "Buying Guides" button | Discoverable learning path | ✅ Smart for B2B buyers |

**What's missing above the fold:** any evidence that this is actually a manufacturer — no factory photo, no product closeup, no certification badge, no social proof (client logos, years in business, ISO mark). Everything that makes buyers stop and think "serious supplier" is buried deep in the page.

---

## Usability

| # | Finding | Severity | Recommendation |
|---|---|---|---|
| 1 | Page is **13,104 px tall** (~18 viewport scrolls). 29 H2s on one page. Users won't make it past screen 3. | 🔴 Critical | Cut to 5–7 well-crafted sections. Move everything else into dedicated landing pages (you already have /solutions/, /compatibility/, /editorial/) |
| 2 | **Duplicate stat blocks** — "17+ years / 2 factories / 10 lines / 305+ equipment / 8+ patents / 12+ processes" at y=1772–2049, then **again** at y=9411 ("8+ / 305+ / 10% / 12+"). The numbers even contradict: "10+ years" vs "17+ years" at different points. | 🔴 Critical | Keep one stat block, early and memorable. Make sure every number is sourced and internally consistent |
| 3 | CTAs are only "Request Quote" / "Request Samples". No softer entry point (e.g., "Compare chips", "Check lock compatibility", "Read buying guide") for buyers in earlier research stage. | 🟡 Moderate | Add 1 low-commitment CTA in hero for research-stage buyers (you have great editorial content — surface it) |
| 4 | Industry selector "Find the right product path" is placed *second* (y=838) — good idea, but it's below-fold and the labels are on cards with no preview image. | 🟡 Moderate | Strong idea; just make it visually distinctive with category imagery |
| 5 | "What to send for a quote" + "Subscribe to newsletter" stack at the bottom — quote-prep checklist is valuable for B2B but lost at the end | 🟢 Minor | Pull the "what to send for a quote" into a collapsible near the top CTA, or a standalone /quote-checklist page linked from the CTA |

---

## Visual Hierarchy

**What draws the eye first:** header, then H1 → Request Quote button. Good. But then…

**Reading flow is broken by:**

- **Mixed capitalization madness.** Multiple H2s render as "nEW IN", "more SKUs", "vALUABLE PARTNERS", "eASY PROCESS". It looks like a broken `text-transform` rule is lowercasing the first letter of each heading (or the original WP content had intentional lowercase first letter + `text-transform: uppercase` applied inconsistently). The eye stops and re-reads every time.
- **Grammatical typo in a hero-level heading**: "WHAT MAKE US DIFFERENT" should be "WHAT MAKES US DIFFERENT" — this kills credibility for a precision manufacturer.
- **The "Our Capabilities" stats section** (you showed me earlier) is still laid out in a 91×91px grid that character-breaks labels like "Auto/mated". We rolled back my fix; this remains a problem.
- **29 H2s competing for attention** means there is effectively no hierarchy. Visually everything feels equally important → nothing is.

**Emphasis audit:**

| Section | Is it emphasized? | Should it be? |
|---|---|---|
| Hero H1 + CTAs | Yes | ✅ |
| "Find the right product path" | Yes, gold eyebrow text | ✅ |
| "Our Capabilities" stats | Yes, 6 large numbers | ⚠️ But text is broken |
| "6-step process" (Inquiry → Delivery) | Yes, big numbered cards | ⚠️ Too much emphasis for below-fold info |
| Certifications | Small badges only | ⚠️ Should be much bigger — this is trust |
| Client logos (vALUABLE PARTNERS) | Weak | 🔴 Should be strong trust signal |

---

## Consistency

| Element | Issue | Recommendation |
|---|---|---|
| Heading case | "nEW IN", "more SKUs", "vALUABLE PARTNERS", "eASY PROCESS" — first letter lowercase, rest uppercase, no pattern | Pick one case style for section headings and apply via CSS only (remove WP content quirks) |
| Brand gold color | Used for eyebrow text AND body links AND stat numbers | After my A11y fix `--codex-gold` is `#8a6a36` — keep it strictly for eyebrows and accents, not body text |
| Section rhythm | Spacing between sections varies wildly — some have heavy top padding, some bleed into each other | Pick one vertical rhythm (e.g., 96/120px between sections) and apply it globally |
| Stat block format | Two different stat blocks with overlapping numbers | Unify into a single canonical format |
| CTA styles | "Request Quote" appears in cyan, orange, and dark variations across the page | Standardize: one primary button color, one secondary |
| Iconography | Stats have heterogeneous small icons (badge, factory, chip, medal, robot) — different illustration styles | Consider a unified line-icon set |

---

## Accessibility (post my earlier fix)

- ✅ Color contrast now passes WCAG 2.1 AA on the homepage (0 axe violations)
- ✅ H1 font-size 58px — excellent for readability
- ✅ `:focus-visible` outlines now present site-wide
- ⚠️ **Page-length concern is an accessibility issue too** — users with low stamina / cognitive load give up at 3–5 screens. 18 screens of content is inaccessible in practice

---

## What Works Well

- **H1 writes clearly for its audience**: "Custom RFID and NFC manufacturing for global buyers" — this is the right message in the right language for an export-focused manufacturer.
- **Dual CTA strategy** (Quote + Samples) correctly lowers friction for B2B prospects who rarely buy on first visit.
- **Editorial content hook** in header ("Buying Guides") is a smart way to capture research-stage traffic.
- **Industry selector** ("Find the right product path") is a great conceptual idea — giving visitors a tailored route.
- **Footer is now clean and B2B-appropriate** (after earlier work) — certifications, contact, social.

---

## Priority Recommendations (Early-Exploration Stage)

### 1. 🔴 Kill the duplication + typo; fix the text-transform bug
- Remove the duplicate stat block (y=9411). Keep only one, and make the numbers internally consistent.
- Fix "WHAT MAKES US DIFFERENT" typo.
- Find and remove the CSS rule causing "nEW IN" / "more SKUs" / "vALUABLE PARTNERS" case breakage. This is almost certainly a `text-transform: uppercase` on a heading that has a lowercase `::first-letter` pseudo-rule, or vice versa.

**Why this first**: Nothing else matters until buyers trust the craft. Typos and broken case on hero-level headings torpedo credibility before any other argument lands.

### 2. 🔴 Cut the homepage by 60%
- Aim for ≤ 5,000 px tall (≤ 6 viewport scrolls on a 1080p laptop).
- Target 7 sections: Hero → Industry selector → One stat block (proof) → Product category grid → Certifications + client logos → Process (condensed to 3 steps) → Final CTA with quote checklist.
- Move "eASY PROCESS 6 steps", "nEW IN / BEST COLLECTION / more SKUs" (product showcases), and newsletter to dedicated pages or lower-priority blocks.

**Why**: B2B buyers scan. They look for 3 answers in ≤ 30 seconds: "is this real?", "do they do my thing?", "how do I talk to them?" Everything else is friction.

### 3. 🟡 Add a real hero image that proves you're a manufacturer
- Either: photo of your Shenzhen factory floor, OR
- A macro shot of a premium RFID card / antenna etching, OR
- A composite of product samples (cards, tags, wristbands) on a clean dark background.
- The hero with text-only is the single weakest point for a factory trying to signal "we make things." You already have the hero image pipeline I built — generate one.

### 4. 🟡 Consolidate and elevate trust signals
- Client logos ("vALUABLE PARTNERS"), certifications (ISO 9001/14001, RAIN RFID, etc.), years in business — these are your closest analogs to social proof.
- Right now they're scattered and visually small. Pull into a single high-contrast "Trusted by" strip directly under the hero, above the industry selector.

### 5. 🟢 Strengthen the tagline for differentiation
Current: "Samples, compatibility checks, and production support."
Try something more specific and concrete:
- "17 years. 2 factories. Every order ships with free samples and compatibility guarantees."
- Or lean into one unique selling point ("Shipping RFID to 50+ countries since 2008. Compatibility-tested against every major hotel lock system.")

---

## Quick Wins (if you want something shippable fast)

- 30-minute wins: fix typo, fix case-transform rule, remove duplicate stat block
- 1-hour win: add hero image (pipeline ready)
- 2-hour win: consolidate trust signals into a single strip under hero
- Half-day win: cut 40% of below-fold sections to dedicated pages

---

*End of critique. Happy to zoom into any section (hero, industry selector, process flow) if you want sharper feedback there.*
