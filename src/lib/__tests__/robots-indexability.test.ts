/**
 * Unit tests for the canonical-origin indexing gate in buildRobotsValue.
 *
 * Policy: only the canonical production origin (CANONICAL_ORIGIN) may be
 * indexed. Any other origin — e.g. a *.vercel.app staging/preview deployment
 * of the in-progress rebuild — is forced to `noindex`, so the rebuild stays
 * out of search and never competes with the live site. A page that is already
 * non-indexable stays noindex regardless of origin.
 *
 * The origin flag is injected explicitly here so the logic is deterministic
 * and independent of the test environment's SITE_ORIGIN. The default-argument
 * wiring (flag derived from the build's resolved origin) is exercised by the
 * full-page snapshot tests, which render under the default (canonical) origin.
 */
import { describe, it, expect } from "vitest";

import { buildRobotsValue } from "../seo/utils";

const INDEX = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
const NOINDEX = "noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

describe("buildRobotsValue — canonical-origin indexing gate", () => {
  it("indexes an indexable page on the canonical production origin", () => {
    expect(buildRobotsValue(true, true)).toBe(INDEX);
  });

  it("forces noindex on a non-canonical (staging/preview) origin even when the page is indexable", () => {
    expect(buildRobotsValue(true, false)).toBe(NOINDEX);
  });

  it("keeps a non-indexable page noindex on the canonical origin", () => {
    expect(buildRobotsValue(false, true)).toBe(NOINDEX);
  });

  it("keeps a non-indexable page noindex on a non-canonical origin", () => {
    expect(buildRobotsValue(false, false)).toBe(NOINDEX);
  });
});
