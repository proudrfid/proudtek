/**
 * Product JSON-LD offers — AggregateOffer derived from the editorial
 * "Typical pricing" brief (GSC 2026-09-01: 6/6 crawled product pages
 * invalid for missing offers.price).
 */

import { describe, it, expect } from 'vitest';
import { parseTypicalPriceRange, buildProductOffers, formatSchemaPrice } from '../seo/product-offer';
import type { EditorialBriefField } from '../editorial-types';

const brief = (text: string, label = 'Typical pricing'): EditorialBriefField[] => [
  { label: 'Air-interface + CR80 envelope', items: ['ISO/IEC 14443 Type A at 13.56 MHz — 106 kbit/s'] },
  { label, text },
];

describe('parseTypicalPriceRange', () => {
  it('parses the canonical "USD a–b /pc @ qty" form and ignores the quantity tier', () => {
    expect(
      parseTypicalPriceRange(brief('USD 0.30–0.50 /pc @ 5k–50k (typical FOB Shenzhen range) — firm quote in one business day.')),
    ).toEqual({ low: 0.3, high: 0.5, currency: 'USD' });
  });

  it('spans all tiers of a multi-tier quote', () => {
    expect(
      parseTypicalPriceRange(brief('USD 0.15–0.25 @ 1k · 0.05–0.10 @ 100k+ (typical FOB Shenzhen range) — firm quote in one business day.')),
    ).toEqual({ low: 0.05, high: 0.25, currency: 'USD' });
  });

  it('accepts an ASCII hyphen and "@ 5k+" tiers', () => {
    expect(parseTypicalPriceRange(brief('USD 0.10-0.30 /pc @ 5k+ (typical FOB Shenzhen range)'))).toEqual({
      low: 0.1,
      high: 0.3,
      currency: 'USD',
    });
  });

  it('returns null when there is no pricing field', () => {
    expect(parseTypicalPriceRange(undefined)).toBeNull();
    expect(parseTypicalPriceRange([{ label: 'Memory architecture', items: ['1 KB EEPROM'] }])).toBeNull();
  });

  it('ignores prose that merely mentions USD (never fabricates a price)', () => {
    // Bench-kit description, not a unit price → no offers.
    expect(
      parseTypicalPriceRange(brief('Typical bench: 1× ACR1252U + 1× Zebra ZC300 card printer — USD figures vary by bureau.')),
    ).toBeNull();
    // Market-size prose under a non-pricing label must not be picked up.
    expect(
      parseTypicalPriceRange(brief('U.S. alone tops USD 170 B annually, 30–40 % of it in retail.', 'Market context')),
    ).toBeNull();
  });

  it('rejects implausible ranges', () => {
    expect(parseTypicalPriceRange(brief('USD 0–0 /pc'))).toBeNull();
    expect(parseTypicalPriceRange(brief('USD 500000–900000 /pc'))).toBeNull();
  });
});

describe('buildProductOffers', () => {
  it('emits an AggregateOffer with 2-decimal string prices', () => {
    const offers = buildProductOffers(
      { low: 0.3, high: 0.5, currency: 'USD' },
      'https://proudtek.com/products/rfid-cards/mifare-classic-1k-card/',
      'https://proudtek.com/#organization',
    );
    expect(offers).toEqual({
      '@type': 'AggregateOffer',
      url: 'https://proudtek.com/products/rfid-cards/mifare-classic-1k-card/',
      priceCurrency: 'USD',
      lowPrice: '0.30',
      highPrice: '0.50',
      availability: 'https://schema.org/InStock',
      seller: { '@id': 'https://proudtek.com/#organization' },
    });
  });

  it('returns null (caller omits offers) when no range is known', () => {
    expect(buildProductOffers(null, 'https://proudtek.com/products/x/', 'https://proudtek.com/#organization')).toBeNull();
  });

  it('formats prices without float noise', () => {
    expect(formatSchemaPrice(0.1 + 0.2)).toBe('0.30');
    expect(formatSchemaPrice(2)).toBe('2.00');
  });
});
