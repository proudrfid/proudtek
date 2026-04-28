/**
 * icons.ts — central SVG icon library (DS-9 emoji-replacement, 2026-04-26).
 *
 * Replaces emoji characters used in sidebars, hub cards and group headings.
 * Emojis had two issues that this library fixes:
 *   1. Inconsistent rendering across OS / fonts (some fall back to glyphless
 *      tofu boxes on Linux, some skin-tone variants render at different
 *      sizes).
 *   2. Bad accessibility — screen readers announced "skull and crossbones
 *      emoji" / "purse emoji" which is noise next to already-labelled
 *      navigation links.
 *
 * Style: lucide-style 24×24 stroke icons (stroke-width 1.8, round caps +
 * joins) drawn at `currentColor` so they pick up the surrounding text
 * colour. Sized in CSS via `width/height` on the parent `<span>` wrapper
 * (.codex-industries-rail__emoji). All icons are decorative — wrapper
 * carries `aria-hidden="true"`, so the SVG itself omits aria attrs.
 *
 * To add an icon: pick a name (lowercase-kebab), paste the inner <path>(s)
 * from a lucide-static or hand-drawn 24×24 grid into ICONS below.
 */

const wrap = (path: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`;

const ICONS: Record<string, string> = {
  /* ─── Access / Auth ─── */
  key: wrap('<circle cx="7.5" cy="15.5" r="3.5"/><path d="M21 2l-9.6 9.6"/><path d="m18 5 3 3"/><path d="m15 8 3 3"/>'),
  lock: wrap('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
  door: wrap('<path d="M3 22h18"/><path d="M5 22V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18"/><path d="M14 12h.01"/>'),
  shield: wrap('<path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z"/>'),
  "shield-check": wrap('<path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z"/><path d="m9 12 2 2 4-4"/>'),
  fingerprint: wrap('<path d="M12 11v2a9 9 0 0 1-2 5.5"/><path d="M14 11a4 4 0 1 0-8 0c0 1 .2 2 .5 3"/><path d="M19 4a16.5 16.5 0 0 0-14 0"/><path d="M19 11c0 5-2 8-3 9"/>'),

  /* ─── Building / Place ─── */
  hotel: wrap('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h2"/><path d="M7 12h2"/><path d="M11 8h2"/><path d="M11 12h2"/><path d="M15 8h2"/><path d="M15 12h2"/><path d="M9 21v-4h6v4"/>'),
  factory: wrap('<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>'),
  warehouse: wrap('<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35"/><path d="M2 8.35 12 2l10 6.35"/><rect x="6" y="12" width="12" height="6"/>'),
  storefront: wrap('<path d="M3 7h18l-2 5H5z"/><path d="M5 12v9h14v-9"/><path d="M9 21v-6h6v6"/>'),
  library: wrap('<rect x="3" y="3" width="6" height="18"/><rect x="11" y="3" width="6" height="18"/><path d="M19 5l3 1-3 16-3-1z"/>'),
  hospital: wrap('<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M12 13v4"/><path d="M10 15h4"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>'),

  /* ─── Tag / Card / Token ─── */
  tag: wrap('<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1"/>'),
  "credit-card": wrap('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>'),
  "id-card": wrap('<rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M14 10h4"/><path d="M14 14h4"/><path d="M5 17.5c0-1.5 2-2.5 4-2.5s4 1 4 2.5"/>'),
  ticket: wrap('<path d="M3 10V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4z"/><path d="M9 6v12"/>'),
  bell: wrap('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>'),

  /* ─── Container / Logistics ─── */
  package: wrap('<path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/>'),
  truck: wrap('<path d="M5 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM15 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/><path d="M2 6h11v12H2z"/><path d="M13 8h5l3 4v6h-3"/>'),
  basket: wrap('<path d="m5 11 1 9h12l1-9"/><path d="M3 11h18"/><path d="m9 11-2-7"/><path d="m15 11 2-7"/>'),
  "shopping-bag": wrap('<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>'),
  "shopping-cart": wrap('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>'),
  snowflake: wrap('<path d="M2 12h20"/><path d="M12 2v20"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>'),

  /* ─── Tools / Operations ─── */
  wrench: wrap('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
  scissors: wrap('<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88"/><path d="M14.47 14.48 20 20"/><path d="M8.12 8.12 12 12"/>'),
  clipboard: wrap('<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6"/><path d="M9 16h4"/>'),
  receipt: wrap('<path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2"/><path d="M8 6h8"/><path d="M8 10h8"/><path d="M8 14h6"/>'),
  utensils: wrap('<path d="M3 2v7c0 1.1.9 2 2 2h2v11"/><path d="M5 11V2"/><path d="M19 2v9a3 3 0 0 1-3 3v8"/><path d="M16 11V2"/>'),
  "bar-chart": wrap('<path d="M3 21h18"/><rect x="5" y="14" width="3" height="6"/><rect x="10.5" y="9" width="3" height="11"/><rect x="16" y="4" width="3" height="16"/>'),
  refresh: wrap('<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>'),

  /* ─── Vehicle / Vehicle-id ─── */
  car: wrap('<path d="M5 17h14"/><path d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/><path d="M15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/><path d="M2 13h20l-2-6H4z"/><path d="M2 13v3a1 1 0 0 0 1 1h2"/><path d="M19 17h2a1 1 0 0 0 1-1v-3"/>'),
  parking: wrap('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>'),
  plane: wrap('<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>'),

  /* ─── People / Health ─── */
  "heart-pulse": wrap('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>'),
  stethoscope: wrap('<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3h6"/><path d="M8 4v3a4 4 0 0 0 8 0V4"/><path d="M16 11a3 3 0 1 1 6 0c0 1.66-1.34 3-3 3"/><path d="M19 14v3a5 5 0 0 1-10 0v-1"/>'),
  pill: wrap('<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>'),
  dumbbell: wrap('<path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>'),
  helmet: wrap('<path d="M3 13a9 9 0 0 1 18 0v4H3z"/><path d="M3 17h18"/><path d="M8 13v-3"/><path d="M16 13v-3"/>'),

  /* ─── Misc / Brand / Specialty ─── */
  star: wrap('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'),
  gem: wrap('<path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>'),
  handbag: wrap('<path d="M5 8h14l1 13H4z"/><path d="M9 8a3 3 0 0 1 6 0"/>'),
  flag: wrap('<path d="M4 22V4"/><path d="M4 4h12l3 4-3 4H4"/>'),
  "graduation-cap": wrap('<path d="M22 10v6"/><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 4 6 4s6-2 6-4v-5"/>'),
  wheat: wrap('<path d="M2 22 16 8"/><path d="M3.5 14a2.5 2.5 0 0 1 3-3 2.5 2.5 0 0 1 0 5"/><path d="M7.5 10a2.5 2.5 0 0 1 3-3 2.5 2.5 0 0 1 0 5"/><path d="M11.5 6a2.5 2.5 0 0 1 3-3 2.5 2.5 0 0 1 0 5"/><path d="M15.5 14a2.5 2.5 0 0 1 3-3 2.5 2.5 0 0 1 0 5"/><path d="M11.5 14a2.5 2.5 0 0 1 3-3 2.5 2.5 0 0 1 0 5"/>'),
  monitor: wrap('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>'),
  microscope: wrap('<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>'),
  radio: wrap('<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>'),
  clock: wrap('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),
  layers: wrap('<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>'),
  globe: wrap('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
  "folder-open": wrap('<path d="M6 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2H6a2 2 0 0 0-2 2v4z"/><path d="m2 19 3-7h17l-3 7z"/>'),
  folder: wrap('<path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  tent: wrap('<path d="M3.5 21 12 5l8.5 16"/><path d="M12 13.5 7.5 21"/><path d="M12 13.5 16.5 21"/>'),
  fork: wrap('<path d="M16 2v6"/><path d="M12 2v6"/><path d="M20 2v6"/><path d="M16 8a4 4 0 0 1 4 4v3a2 2 0 0 1-2 2h-2v5"/><path d="M16 8a4 4 0 0 0-4 4v3a2 2 0 0 0 2 2h2v5"/>'),
  cart: wrap('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>'),
};

const FALLBACK = wrap('<circle cx="12" cy="12" r="3" fill="currentColor"/>');

/**
 * Return the SVG markup for a named icon. Unknown names fall back to a small
 * filled dot so the layout never collapses to nothing.
 */
export function getIcon(name: string | undefined | null): string {
  if (!name) return FALLBACK;
  return ICONS[name] ?? FALLBACK;
}

/**
 * Returns true if an icon with this name is registered.
 */
export function hasIcon(name: string): boolean {
  return name in ICONS;
}
