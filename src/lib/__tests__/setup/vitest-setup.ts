/**
 * Vitest global setup file — registered via `vitest.config.ts` setupFiles.
 * Runs once per test process before any test file is loaded.
 *
 * Currently installs the path-normalisation snapshot serializer so the
 * committed `.snap` files don't carry the developer's home-directory path
 * verbatim (which breaks CI on the Ubuntu runner). See the serializer
 * module for the full rationale.
 */
import { expect } from "vitest";

import { pathNormalizerSerializer } from "./normalize-paths-serializer";

expect.addSnapshotSerializer(pathNormalizerSerializer);
