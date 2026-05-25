// Single source of truth for chip specifications.
// Backed by src/data/chip-specs.json (manually verified against vendor datasheets;
// see memory/rfid-chip-facts-verified.md for the verification trail).
//
// Pages and components that mention chip specs should reference this module
// rather than inline free-text spec numbers. This is the long-term answer to
// the chip-attribution hallucination problem (see memory/feedback-verify-chip-claims.md).

import data from '../data/chip-specs.json' with { type: 'json' };

export type ChipFrequency = 'LF' | 'HF' | 'UHF' | 'HF+UHF';
export type ChipStatus = 'active' | 'active (legacy)' | 'discontinued' | 'fabricated';

export interface ChipMemory {
  epc_bits?: number;
  epc_bits_min?: number;
  epc_bits_max?: number;
  user_bits?: number;
  user_bytes?: number;
  user_bytes_1k_variant?: number;
  user_bytes_2k_variant?: number;
  tid_bits?: number;
  tid_unique_bits?: number;
  totalEEPROM_bytes?: number;
  totalEEPROM_bits?: number;
  totalNVM_bits?: number;
  totalMemory_bits?: number;
  hf_eeprom_bits?: number;
  uhf_eeprom_bits?: number;
  rewritable_bits?: number;
  eeprom_bits?: number;
  password_bits?: number;
  frame_bits?: number;
  id_bits?: number;
  sectors?: number;
  blocks?: number;
  block_bits?: number;
  blocks_per_sector?: number;
  variants_kbyte?: number[];
  configurable?: boolean;
  unique_serial_bits?: number;
}

export interface ChipRF {
  read_sensitivity_dbm?: number;
  write_sensitivity_dbm?: number;
  read_sensitivity_label?: string;
}

export interface ChipEnvironment {
  temp_min_c?: number;
  temp_max_c?: number;
  peak_temp_c?: number;
  peak_temp_duration_min?: number;
}

export interface ChipCrypto {
  algorithm?: string;
  algorithms?: string[];
  standard?: string;
  keySize?: number;
  alsoSupports?: string[];
  status?: string;
}

export interface ChipLimits {
  max_applications?: number;
  max_keys_per_app?: number;
  max_files_per_app?: number;
}

export interface ChipSpec {
  manufacturer?: string;
  displayName: string;
  /**
   * Manufacturer-stripped short form (e.g. "NTAG 213" vs displayName
   * "NXP NTAG 213"). Optional — only set for chips whose prose commonly
   * elides the vendor prefix. Resolves via `{chip:slug:short_name}`.
   * Falls back to `displayName` when absent.
   */
  shortName?: string;
  partNumber?: string;
  frequency?: ChipFrequency;
  standard?: string[];
  memory?: ChipMemory;
  rf?: ChipRF;
  environment?: ChipEnvironment;
  features?: string[];
  crypto?: ChipCrypto | null;
  certification?: string;
  status: ChipStatus;
  sourceUrl?: string;
  notes?: string;
  knownFabrications?: string[];
}

export interface ChipSpecsFile {
  _meta: Record<string, unknown>;
  chips: Record<string, ChipSpec>;
}

const typed: ChipSpecsFile = data as ChipSpecsFile;

/**
 * Look up a chip by its slug (e.g. "nxp-ucode-9xe"). Returns undefined if not found.
 * For type-safe access in Astro pages.
 */
export function getChipSpec(slug: string): ChipSpec | undefined {
  return typed.chips[slug];
}

/**
 * List all chip slugs in the catalogue.
 */
export function listChipSlugs(): string[] {
  return Object.keys(typed.chips);
}

/**
 * Format a chip's memory fields as a buyer-readable string.
 * Picks the relevant fields per chip type (UHF Gen2 vs HF NFC vs LF).
 */
export function formatMemorySummary(slug: string): string {
  const chip = getChipSpec(slug);
  if (!chip?.memory) return '';
  const m = chip.memory;
  const parts: string[] = [];
  if (m.epc_bits !== undefined) parts.push(`${m.epc_bits}-bit EPC`);
  if (m.epc_bits_min !== undefined && m.epc_bits_max !== undefined) {
    parts.push(`${m.epc_bits_min}-${m.epc_bits_max}-bit EPC`);
  }
  if (m.user_bits !== undefined) {
    parts.push(m.user_bits === 0 ? '0-bit user' : `${m.user_bits}-bit user`);
  }
  if (m.user_bytes !== undefined && m.user_bits === undefined) {
    parts.push(`${m.user_bytes} bytes user`);
  }
  if (m.tid_bits !== undefined) parts.push(`${m.tid_bits}-bit TID`);
  return parts.join(' + ');
}

/**
 * Returns true if the chip is no longer manufactured and should not be recommended
 * for new procurement.
 */
export function isDiscontinued(slug: string): boolean {
  const chip = getChipSpec(slug);
  return chip?.status === 'discontinued' || chip?.status === 'fabricated';
}

/**
 * Returns true if the chip is documented as a fabrication / does not exist.
 */
export function isFabricated(slug: string): boolean {
  return getChipSpec(slug)?.status === 'fabricated';
}

export { typed as chipSpecs };
