// Tests for the chip-specs single-source-of-truth.
//
// Goal: guarantee the schema stays internally consistent and matches the verified
// memory file. Any drift between vendor facts and the schema would re-create the
// hallucinations sweeps 6-22 fixed.

import { describe, it, expect } from 'vitest';
import {
  getChipSpec,
  listChipSlugs,
  formatMemorySummary,
  isDiscontinued,
  isFabricated,
  chipSpecs,
} from '../chip-specs';

describe('chip-specs schema', () => {
  it('loads at least 40 chip entries (the verified catalogue from memory)', () => {
    const slugs = listChipSlugs();
    expect(slugs.length).toBeGreaterThanOrEqual(40);
  });

  it('every chip has a displayName and status', () => {
    for (const slug of listChipSlugs()) {
      const chip = getChipSpec(slug);
      expect(chip).toBeDefined();
      expect(chip!.displayName, `chip ${slug} missing displayName`).toBeTruthy();
      expect(chip!.status, `chip ${slug} missing status`).toBeTruthy();
    }
  });

  it('flags M860/M870/M880 as fabricated (do not exist in M800 series)', () => {
    expect(isFabricated('impinj-m860')).toBe(true);
    expect(isFabricated('impinj-m870')).toBe(true);
    expect(isFabricated('impinj-m880')).toBe(true);
  });

  it('flags UCODE DNA City and UCODE DNA Track as discontinued', () => {
    expect(isDiscontinued('nxp-ucode-dna-city')).toBe(true);
    expect(isDiscontinued('nxp-ucode-dna-track')).toBe(true);
  });

  it('flags regular UCODE DNA as active (currently manufactured)', () => {
    expect(isDiscontinued('nxp-ucode-dna')).toBe(false);
    expect(getChipSpec('nxp-ucode-dna')?.status).toBe('active');
  });

  describe('canonical verified specs match memory/rfid-chip-facts-verified.md', () => {
    it('NXP UCODE 9xe is 128-bit EPC + 0-bit user (sweep-10)', () => {
      const c = getChipSpec('nxp-ucode-9xe')!;
      expect(c.memory?.epc_bits).toBe(128);
      expect(c.memory?.user_bits).toBe(0);
    });

    it('NTAG 424 DNA is 416 bytes user memory (sweep-13)', () => {
      const c = getChipSpec('nxp-ntag-424-dna')!;
      expect(c.memory?.user_bytes).toBe(416);
    });

    it('ICODE DNA is 256 bytes / 2,048 bits (sweep-14)', () => {
      const c = getChipSpec('nxp-icode-dna')!;
      expect(c.memory?.user_bits).toBe(2048);
      expect(c.memory?.user_bytes).toBe(256);
    });

    it('ICODE SLIX2 is 2,528 bits user (not 2,560 which is total) (sweep-9)', () => {
      const c = getChipSpec('nxp-icode-slix2')!;
      expect(c.memory?.user_bits).toBe(2528);
      expect(c.memory?.totalEEPROM_bits).toBe(2560);
    });

    it('M775 is 32-bit user memory with PRESENT-80 crypto (sweep-12, 19)', () => {
      const c = getChipSpec('impinj-m775')!;
      expect(c.memory?.user_bits).toBe(32);
      expect(c.crypto?.algorithm).toBe('PRESENT-80');
      expect(c.crypto?.standard).toBe('ISO/IEC 29167-11');
    });

    it('Higgs-9 is 688-bit user memory (not M775) (sweep-12)', () => {
      const c = getChipSpec('alien-higgs-9')!;
      expect(c.memory?.user_bits).toBe(688);
    });

    it('M781 is 512-bit user memory (sweep-18)', () => {
      const c = getChipSpec('impinj-m781')!;
      expect(c.memory?.user_bits).toBe(512);
      expect(c.memory?.epc_bits).toBe(128);
    });

    it('M830 is 0-bit user memory (not "extended memory") (sweep-18)', () => {
      const c = getChipSpec('impinj-m830')!;
      expect(c.memory?.user_bits).toBe(0);
    });

    it('DESFire EV3 max applications = 28 (not 32) (sweep-13/14)', () => {
      const c = getChipSpec('nxp-mifare-desfire-ev3')!;
      expect((c as any).limits?.max_applications).toBe(28);
      expect((c as any).limits?.max_keys_per_app).toBe(14);
    });

    it('NTAG 216 user = 888, total = 924 (sweep-13)', () => {
      const c = getChipSpec('nxp-ntag-216')!;
      expect(c.memory?.user_bytes).toBe(888);
      expect(c.memory?.totalEEPROM_bytes).toBe(924);
    });

    it('Higgs-3 user = 512-bit, total NVM = 800-bit (sweep-20)', () => {
      const c = getChipSpec('alien-higgs-3')!;
      expect(c.memory?.user_bits).toBe(512);
      expect(c.memory?.totalNVM_bits).toBe(800);
    });

    it('Fujitsu MB97R8110 is 8 KByte user (not 64 KByte) (sweep-12)', () => {
      const c = getChipSpec('fujitsu-mb97r8110')!;
      expect(c.memory?.user_bytes).toBe(8192);
    });

    it('EM4423 is HF+UHF (not LF+UHF) (sweep-16)', () => {
      const c = getChipSpec('em-microelectronic-em4423')!;
      expect(c.frequency).toBe('HF+UHF');
    });

    it('Only UCODE DNA and M775 have on-chip UHF crypto', () => {
      const cryptoChips = listChipSlugs()
        .map(s => ({ slug: s, chip: getChipSpec(s)! }))
        .filter(({ chip }) => chip.frequency === 'UHF' && chip.crypto?.algorithm);
      const slugs = cryptoChips.map(c => c.slug).sort();
      expect(slugs).toEqual([
        'impinj-m775',
        'nxp-ucode-dna',
        'nxp-ucode-dna-city',
        'nxp-ucode-dna-track',
      ]);
    });
  });

  describe('formatMemorySummary', () => {
    it('formats UHF chips with EPC + user + TID', () => {
      expect(formatMemorySummary('nxp-ucode-9xe')).toBe('128-bit EPC + 0-bit user + 96-bit TID');
    });
    it('formats Higgs-9 with EPC range', () => {
      expect(formatMemorySummary('alien-higgs-9')).toContain('96-496-bit EPC');
      expect(formatMemorySummary('alien-higgs-9')).toContain('688-bit user');
    });
    it('returns empty string for chips with no memory info', () => {
      // Fabricated entries have no memory
      expect(formatMemorySummary('impinj-m860')).toBe('');
    });
  });
});
