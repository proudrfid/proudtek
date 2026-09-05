import type { EditorialBriefField } from "../editorial-types";

/**
 * Product-page offer data for JSON-LD.
 *
 * GSC (2026-09-01) flagged every crawled product page in both the
 * "Product snippets" and "Merchant listings" reports: the emitted
 * `Offer` carried a `priceSpecification` with no `price`, which Google
 * treats as a critical error ("price or priceSpecification.price must
 * be specified").
 *
 * Pricing on this site is a *range* quoted in the editorial brief under
 * the "Typical pricing" label, e.g.
 *
 *   "USD 0.30–0.50 /pc @ 5k–50k (typical FOB Shenzhen range) — firm quote…"
 *   "USD 0.15–0.25 @ 1k · 0.05–0.10 @ 100k+ (typical FOB Shenzhen range)…"
 *
 * schema.org models a range as `AggregateOffer` (lowPrice / highPrice /
 * priceCurrency) — valid for Google Product snippets and, unlike
 * `Offer`, not eligible for Merchant listings, so the shipping / return
 * policy warnings disappear too. Pages without a parseable range emit
 * no `offers` at all: never invent a price (see CLAUDE.md, "Content
 * factual accuracy").
 */

/**
 * Evidence gate for machine-readable prices. The visible "Typical pricing"
 * ranges are indicative and not yet backed by a dated price list (Phase 4
 * S-05; owner decision 2026-09-02: keep as page text, do not emit offers).
 * Flip to true only when the ranges are confirmed as the current quoting
 * basis — then every priced product page emits an AggregateOffer.
 */
export const PRODUCT_OFFERS_ENABLED = false;

export interface ProductPriceRange {
  low: number;
  high: number;
  currency: "USD";
}

const PRICING_LABEL = /pricing|price/i;
const USD_PREFIX = /^\s*USD\b/;
// "a–b" or "a-b" decimal pairs. The negative look-aheads reject volume
// tiers such as "5k–50k" / "100k+" so only money pairs are captured.
const PAIR = /(\d+(?:\.\d+)?)(?![\d.]*k)\s*[–-]\s*(\d+(?:\.\d+)?)(?![\d.]*k)/g;
const MAX_SANE_UNIT_PRICE = 10_000;

function collectPricingStrings(brief: EditorialBriefField[] | undefined): string[] {
  if (!brief) return [];
  const out: string[] = [];
  for (const field of brief) {
    if (!PRICING_LABEL.test(field.label ?? "")) continue;
    if (field.text) out.push(field.text);
    for (const item of field.items ?? []) out.push(item);
  }
  return out;
}

/**
 * Parse the editorial "Typical pricing" brief into a low/high USD range.
 * Returns null when there is no pricing field, the text is not a USD
 * figure, or the numbers are implausible — callers must then omit
 * `offers` rather than fall back to a placeholder.
 */
export function parseTypicalPriceRange(brief: EditorialBriefField[] | undefined): ProductPriceRange | null {
  const candidates = collectPricingStrings(brief).filter((text) => USD_PREFIX.test(text));
  if (candidates.length === 0) return null;

  const values: number[] = [];
  for (const text of candidates) {
    // Only the money part — anything after "(" is commentary
    // ("(typical FOB Shenzhen range)").
    const head = text.split("(")[0];
    for (const match of head.matchAll(PAIR)) {
      const a = Number(match[1]);
      const b = Number(match[2]);
      if (Number.isFinite(a) && Number.isFinite(b)) values.push(a, b);
    }
  }
  if (values.length === 0) return null;

  const low = Math.min(...values);
  const high = Math.max(...values);
  if (!(low > 0) || !(high >= low) || high > MAX_SANE_UNIT_PRICE) return null;
  return { low, high, currency: "USD" };
}

/** Format for schema.org price fields — Google's examples use "0.30"-style strings. */
export function formatSchemaPrice(value: number): string {
  return value.toFixed(2);
}

/**
 * Build the `offers` value for a Product node, or null when the page has
 * no verifiable price range.
 */
export function buildProductOffers(
  range: ProductPriceRange | null,
  productUrl: string,
  sellerId: string,
): Record<string, unknown> | null {
  if (!range) return null;
  return {
    "@type": "AggregateOffer",
    url: productUrl,
    priceCurrency: range.currency,
    lowPrice: formatSchemaPrice(range.low),
    highPrice: formatSchemaPrice(range.high),
    availability: "https://schema.org/InStock",
    seller: { "@id": sellerId },
  };
}
