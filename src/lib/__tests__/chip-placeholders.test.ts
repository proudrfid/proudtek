// Tests for {chip:slug:field} placeholder resolution.

import { describe, it, expect } from 'vitest';
import { resolveChipPlaceholders, resolveChipPlaceholdersDeep } from '../chip-placeholders';

describe('resolveChipPlaceholders', () => {
  it('returns text unchanged if no placeholders', () => {
    const t = 'NXP UCODE 9xe is the extended-EPC variant.';
    expect(resolveChipPlaceholders(t)).toBe(t);
  });

  it('resolves :name to displayName', () => {
    expect(resolveChipPlaceholders('Use {chip:nxp-ucode-9xe:name} for extended-EPC.'))
      .toBe('Use NXP UCODE 9xe for extended-EPC.');
  });

  it('resolves :short_name to manufacturer-stripped form', () => {
    expect(resolveChipPlaceholders('{chip:nxp-ntag-213:short_name} is fine for review URLs.'))
      .toBe('NTAG 213 is fine for review URLs.');
    expect(resolveChipPlaceholders('{chip:nxp-mifare-desfire-ev3:short_name} for AES-128.'))
      .toBe('MIFARE DESFire EV3 for AES-128.');
    // The shortName alias works too
    expect(resolveChipPlaceholders('{chip:alien-higgs-9:shortName}'))
      .toBe('Higgs-9');
  });

  it(':short_name falls back to displayName when chip has none declared', () => {
    // impinj-monza-x-2k has no shortName field (only top drift chips got one
    // in the initial pass) — should fall back to displayName.
    expect(resolveChipPlaceholders('{chip:impinj-monza-x-2k:short_name}'))
      .toBe('Impinj Monza X-2K');
  });

  it('resolves :partNumber', () => {
    expect(resolveChipPlaceholders('{chip:nxp-ucode-9xe:partNumber}')).toBe('SL3S1216');
  });

  it('resolves :epc_bits and :user_bits', () => {
    expect(resolveChipPlaceholders('{chip:nxp-ucode-9xe:epc_bits}-bit EPC + {chip:nxp-ucode-9xe:user_bits}-bit user'))
      .toBe('128-bit EPC + 0-bit user');
  });

  it('resolves :user_bytes for HF NFC chips', () => {
    expect(resolveChipPlaceholders('NTAG 424 DNA = {chip:nxp-ntag-424-dna:user_bytes} bytes'))
      .toBe('NTAG 424 DNA = 416 bytes');
  });

  it('resolves :memory to memory summary', () => {
    const out = resolveChipPlaceholders('Spec: {chip:nxp-ucode-9xe:memory}.');
    expect(out).toContain('128-bit EPC');
    expect(out).toContain('0-bit user');
    expect(out).toContain('96-bit TID');
  });

  it('resolves :rf for UHF chips', () => {
    const out = resolveChipPlaceholders('{chip:nxp-ucode-9:rf}');
    expect(out).toContain('-23.5');
    expect(out).toContain('dBm');
  });

  it('resolves :crypto for UCODE DNA → AES-128 with ISO standard', () => {
    const out = resolveChipPlaceholders('{chip:nxp-ucode-dna:crypto}');
    expect(out).toContain('AES-128');
    expect(out).toContain('ISO/IEC 29167-10');
  });

  it('resolves :crypto for M775 → PRESENT-80, NOT AES', () => {
    const out = resolveChipPlaceholders('{chip:impinj-m775:crypto}');
    expect(out).toContain('PRESENT-80');
    expect(out).not.toContain('AES');
  });

  it('resolves :crypto for M730 (no crypto) → "no on-chip crypto"', () => {
    expect(resolveChipPlaceholders('{chip:impinj-m730:crypto}')).toBe('no on-chip crypto');
  });

  it('resolves :status for active chip', () => {
    expect(resolveChipPlaceholders('{chip:nxp-ucode-dna:status}')).toBe('currently manufactured');
  });

  it('resolves :status for discontinued UCODE DNA City', () => {
    expect(resolveChipPlaceholders('{chip:nxp-ucode-dna-city:status}'))
      .toBe('no longer manufactured');
  });

  it('resolves :status for fabricated M860', () => {
    expect(resolveChipPlaceholders('{chip:impinj-m860:status}')).toContain('does not exist');
  });

  it('resolves dotted-path fields like memory.epc_bits', () => {
    expect(resolveChipPlaceholders('{chip:nxp-ucode-9xe:memory.epc_bits}')).toBe('128');
    expect(resolveChipPlaceholders('{chip:impinj-m775:crypto.algorithm}')).toBe('PRESENT-80');
  });

  it('leaves unknown chip slug unresolved (visible authoring error)', () => {
    const input = 'The {chip:nxp-fictional-1234:name} chip.';
    expect(resolveChipPlaceholders(input)).toBe(input);
  });

  it('leaves unknown field unresolved (visible authoring error)', () => {
    const input = '{chip:nxp-ucode-9xe:nonexistent_field}';
    expect(resolveChipPlaceholders(input)).toBe(input);
  });

  it('handles multiple placeholders in one string', () => {
    const out = resolveChipPlaceholders(
      'Compare {chip:nxp-ucode-9xe:name} ({chip:nxp-ucode-9xe:epc_bits}-bit EPC) with {chip:nxp-ucode-9xm:name} ({chip:nxp-ucode-9xm:memory.epc_bits} bits EPC)'
    );
    expect(out).toContain('NXP UCODE 9xe (128-bit EPC)');
    expect(out).toContain('NXP UCODE 9xm (496 bits EPC)');
  });
});

describe('resolveChipPlaceholdersDeep', () => {
  it('resolves placeholders inside nested objects and arrays', () => {
    const input = {
      title: '{chip:nxp-ucode-9xe:name} datasheet',
      brief: [
        { label: 'Memory', text: '{chip:nxp-ucode-9xe:memory}' },
        { label: 'Status', items: ['{chip:nxp-ucode-dna-city:status}'] },
      ],
    };
    const out = resolveChipPlaceholdersDeep(input);
    expect(out.title).toBe('NXP UCODE 9xe datasheet');
    expect(out.brief[0].text).toContain('128-bit EPC');
    expect(out.brief[1].items[0]).toBe('no longer manufactured');
  });

  it('leaves non-string leaves unchanged', () => {
    const input = { count: 42, active: true, ratio: 0.5, none: null };
    expect(resolveChipPlaceholdersDeep(input)).toEqual(input);
  });

  it('returns input as-is when no placeholders present', () => {
    const input = { title: 'No placeholders here', items: ['plain', 'text'] };
    const out = resolveChipPlaceholdersDeep(input);
    expect(out).toEqual(input);
  });
});

describe('chip-placeholders regression protection', () => {
  // Each of these asserts that a known-fabricated claim canNOT come out of
  // a placeholder — the schema enforces the verified value. If a future
  // chip-specs.json edit drifts, these tests catch it.

  it('NTAG 424 DNA never resolves to 256 bytes (sweep-13)', () => {
    const out = resolveChipPlaceholders('{chip:nxp-ntag-424-dna:user_bytes}');
    expect(out).not.toBe('256');
    expect(out).toBe('416');
  });

  it('UCODE 9xe never resolves to 208-bit or 448-bit EPC (sweep-10)', () => {
    const out = resolveChipPlaceholders('{chip:nxp-ucode-9xe:epc_bits}');
    expect(out).not.toBe('208');
    expect(out).not.toBe('448');
    expect(out).toBe('128');
  });

  it('M775 never resolves to 688-bit user memory (sweep-12, Higgs-9 swap)', () => {
    const out = resolveChipPlaceholders('{chip:impinj-m775:user_bits}');
    expect(out).not.toBe('688');
    expect(out).toBe('32');
  });

  it('M775 crypto never resolves to AES-128 (sweep-19)', () => {
    const out = resolveChipPlaceholders('{chip:impinj-m775:crypto.algorithm}');
    expect(out).not.toBe('AES-128');
    expect(out).toBe('PRESENT-80');
  });

  it('DESFire EV3 max_applications never resolves to 32 (sweep-14)', () => {
    const out = resolveChipPlaceholders('{chip:nxp-mifare-desfire-ev3:limits.max_applications}');
    expect(out).not.toBe('32');
    expect(out).toBe('28');
  });

  it('EM4423 frequency never resolves to "LF+UHF" (sweep-16)', () => {
    const out = resolveChipPlaceholders('{chip:em-microelectronic-em4423:frequency}');
    expect(out).not.toBe('LF+UHF');
    expect(out).toBe('HF+UHF');
  });
});
