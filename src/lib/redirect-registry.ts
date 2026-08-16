import { ROUTE_CANONICAL_OVERRIDES } from "./route-overrides";

export interface CanonicalRedirect {
  source: string;
  destination: string;
}

/**
 * Typed adapter over the existing canonical override map.
 *
 * PR-01 intentionally does not rewrite vercel.json or public/_redirects: those
 * deployed files are already part of the frozen site contract. Later cleanup
 * PRs can generate them from this registry with explicit contract allowlists.
 */
export const CANONICAL_REDIRECTS: readonly CanonicalRedirect[] = Object.entries(
  ROUTE_CANONICAL_OVERRIDES,
).map(([source, destination]) => ({ source, destination }));

const canonicalRedirectMap = new Map(
  CANONICAL_REDIRECTS.map((entry) => [entry.source, entry.destination]),
);

export function getCanonicalRedirect(source: string): string | undefined {
  return canonicalRedirectMap.get(source);
}

export function getCanonicalRedirects(): readonly CanonicalRedirect[] {
  return CANONICAL_REDIRECTS;
}
