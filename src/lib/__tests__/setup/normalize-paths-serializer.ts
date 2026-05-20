/**
 * Snapshot serializer that normalises the project's absolute path to the
 * placeholder `<project-root>` before a string is written to a `.snap`
 * file (or compared against an existing one).
 *
 * Why this exists
 * ───────────────
 * Astro injects `data-astro-source-file="<absolute path>"` attributes into
 * rendered HTML for dev-tools introspection. The snapshot tests in
 * `src/lib/__tests__/*.snapshot.test.ts` capture the rendered HTML byte-
 * for-byte, so those absolute paths land verbatim in the committed `.snap`
 * files. On a developer macOS box the path is
 *   /Users/<name>/Projects/Playground/src/components/editorial/...
 * On the GitHub Actions Ubuntu runner it's
 *   /home/runner/work/proudtek/proudtek/src/components/editorial/...
 * — and the snapshot comparison fails with hundreds of "expected vs.
 * received" diffs that aren't real test failures, just path drift.
 *
 * This serializer runs before snapshot persistence + comparison and
 * replaces the project root (whatever it is in the current process) with
 * the literal `<project-root>` placeholder. Both macOS and Linux runs
 * therefore normalise to the same string and the snapshots match.
 *
 * Registration is via `expect.addSnapshotSerializer({...})` in
 * vitest.config.ts setupFiles. Vitest passes string values through this
 * serializer when the `test()` predicate returns true. We only intercept
 * strings that actually contain the project root (anything else falls
 * through to vitest's default string serializer).
 *
 * IMPORTANT — keep `serialize()` returning a JSON-quoted string literal,
 * because that's what vitest's default string serializer would emit. If
 * we return a bare string, the `.snap` file gets unquoted content and
 * the next run mismatches everything.
 */
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Go up four levels: setup/ → __tests__/ → lib/ → src/ → project root
const PROJECT_ROOT = resolve(__dirname, "..", "..", "..", "..");

export const pathNormalizerSerializer = {
  test(val: unknown): boolean {
    return typeof val === "string" && val.includes(PROJECT_ROOT);
  },
  serialize(val: unknown): string {
    const normalized = String(val).split(PROJECT_ROOT).join("<project-root>");
    return JSON.stringify(normalized);
  },
};
