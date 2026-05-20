/**
 * Vitest global setup file — registered via `vitest.config.ts` setupFiles.
 * Runs once per test process before any test file is loaded.
 *
 * Pins two pieces of environment so snapshots are byte-identical across
 * developer machines and CI:
 *
 *   1. process.env.TZ = "UTC" — components like Sources.astro format
 *      `accessedAt` dates with `.toLocaleDateString("en-US", ...)`, which
 *      reads the system timezone. Without this pin, a developer on
 *      America/New_York and a GitHub Actions Ubuntu runner on UTC produce
 *      "Apr 21, 2026" vs "Apr 22, 2026" for the same ISO date string —
 *      causing snapshot mismatches that aren't real bugs. Setting TZ
 *      before any test code imports happens means every Date / Intl call
 *      resolves under UTC, matching what CI sees natively.
 *
 *   2. Path-normalisation snapshot serializer — replaces the project root
 *      with `<project-root>` so Astro's `data-astro-source-file` absolute
 *      paths don't pin the snapshots to whoever generated them.
 */

// Set TZ before anything else loads. Process.env mutation here only
// affects this test process; the developer's shell environment is
// unchanged.
process.env.TZ = "UTC";

import { expect } from "vitest";

import { pathNormalizerSerializer } from "./normalize-paths-serializer";

expect.addSnapshotSerializer(pathNormalizerSerializer);
