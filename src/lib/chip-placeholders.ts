// Resolve {chip:slug:field} placeholders inside editorial text against the
// verified chip-specs schema. This is the runtime side of the
// "schema-driven chip specs" architecture documented in
// memory/feedback-verify-chip-claims.md.
//
// Usage in page JSON content:
//   "text": "NXP UCODE 9xe ({chip:nxp-ucode-9xe:memory}) is the
//   extended-EPC variant of UCODE 9."
//
// At render time the placeholder is replaced with the verified value
// from src/data/chip-specs.json. Any future AI rewrite that swaps the
// chip name or spec number can't drift the rendered output — the
// schema is the single source of truth.
//
// Supported placeholder fields:
//   :name           → displayName (e.g. "NXP UCODE 9xe")
//   :partNumber     → e.g. "SL3S1216"
//   :memory         → memory summary (e.g. "128-bit EPC + 0-bit user + 96-bit TID")
//   :rf             → RF summary (e.g. "-23.5 dBm read sensitivity")
//   :crypto         → crypto summary
//   :status         → status-aware narrative
//   :epc_bits       → "128"
//   :user_bits      → "0"
//   :user_bytes     → "416"
//   :tid_bits       → "96"
//   :read_sensitivity_dbm → "-23.5"
//   :frequency      → "UHF"
//
// Unknown chip slugs or fields render as the original placeholder text so
// authoring errors are visible (not silent).

import { getChipSpec, formatMemorySummary, type ChipSpec } from './chip-specs.js';

const PLACEHOLDER_RE = /\{chip:([a-z0-9\-]+):([a-z0-9_\.]+)\}/gi;

function formatRF(chip: ChipSpec): string {
  const rf = chip.rf;
  if (!rf?.read_sensitivity_dbm) return '';
  const label = rf.read_sensitivity_label ? ` ${rf.read_sensitivity_label}` : '';
  return `${rf.read_sensitivity_dbm} dBm${label} read sensitivity`;
}

function formatCrypto(chip: ChipSpec): string {
  if (chip.crypto === null || chip.crypto === undefined) return 'no on-chip crypto';
  if (chip.crypto.algorithms) {
    return `${chip.crypto.algorithms.join(' / ')}`;
  }
  if (chip.crypto.algorithm) {
    const std = chip.crypto.standard ? ` per ${chip.crypto.standard}` : '';
    return `${chip.crypto.algorithm}${std}`;
  }
  return '';
}

function formatStatus(chip: ChipSpec): string {
  if (chip.status === 'discontinued') return 'no longer manufactured';
  if (chip.status === 'fabricated') return 'does not exist (often confused with M830/M850)';
  if (chip.status === 'active (legacy)') return 'active (legacy)';
  return 'currently manufactured';
}

/**
 * Resolve a single field on a chip. Returns the formatted string, or
 * undefined if the field is unknown (caller leaves placeholder unresolved).
 */
function resolveField(chip: ChipSpec, field: string): string | undefined {
  switch (field) {
    case 'name':
    case 'displayName':
      return chip.displayName;
    case 'partNumber':
    case 'part_number':
      return chip.partNumber;
    case 'memory':
    case 'memory_summary':
      return formatMemorySummary(getSlugFor(chip)) || undefined;
    case 'rf':
    case 'rf_summary':
      return formatRF(chip);
    case 'crypto':
    case 'crypto_summary':
      return formatCrypto(chip);
    case 'status':
      return formatStatus(chip);
    case 'frequency':
      return chip.frequency;
    case 'epc_bits':
      return chip.memory?.epc_bits?.toString();
    case 'user_bits':
      return chip.memory?.user_bits?.toString();
    case 'user_bytes':
      return chip.memory?.user_bytes?.toString();
    case 'tid_bits':
      return chip.memory?.tid_bits?.toString();
    case 'read_sensitivity_dbm':
      return chip.rf?.read_sensitivity_dbm?.toString();
    default:
      // Allow dotted paths into the spec object: memory.epc_bits → chip.memory.epc_bits
      if (field.includes('.')) {
        const parts = field.split('.');
        let cur: any = chip;
        for (const p of parts) {
          if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
          else return undefined;
        }
        return cur == null ? undefined : String(cur);
      }
      return undefined;
  }
}

// Reverse lookup of slug from a ChipSpec ref — needed by memory_summary
// which calls formatMemorySummary(slug). We cache slug-to-spec in a Map
// because the data is small (~50 chips).
import { listChipSlugs } from './chip-specs.js';
const slugBySpec = new WeakMap<ChipSpec, string>();
for (const slug of listChipSlugs()) {
  const spec = getChipSpec(slug);
  if (spec) slugBySpec.set(spec, slug);
}
function getSlugFor(chip: ChipSpec): string {
  return slugBySpec.get(chip) ?? '';
}

/**
 * Replace all {chip:slug:field} placeholders in `text` with their resolved
 * values. Unknown slugs / fields are left as-is so the placeholder error
 * surfaces visibly rather than silently dropping content.
 */
export function resolveChipPlaceholders(text: string): string {
  if (!text || !text.includes('{chip:')) return text;
  return text.replace(PLACEHOLDER_RE, (full, slug: string, field: string) => {
    const chip = getChipSpec(slug);
    if (!chip) return full;
    const resolved = resolveField(chip, field);
    return resolved ?? full;
  });
}

/**
 * Recursively walk a value tree and resolve placeholders in every string
 * leaf. Used to pre-process editorial page JSON before rendering so all
 * downstream components see the resolved text without each needing to
 * call the resolver explicitly.
 */
export function resolveChipPlaceholdersDeep<T>(value: T): T {
  if (typeof value === 'string') {
    return resolveChipPlaceholders(value) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map(v => resolveChipPlaceholdersDeep(v)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = resolveChipPlaceholdersDeep(v);
    }
    return out as T;
  }
  return value;
}
