# SiteShell Hub Canary Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put `/guides/`, `/solutions/`, and `/blog/` behind the existing exact-route `SiteShell` canary without changing the default build, page bodies, or SEO/data contracts.

**Architecture:** Keep `route-registry.ts` responsible for static route ownership and extend only `NATIVE_SHELL_CANARY_ROUTES` in `rollout.ts`. Rewire each dedicated hub from `BaseLayout` to `ShellSwitchLayout`; the page retains its manual SEO/donor extraction and renders both donor fragments only when the native shell is disabled. Keep `SiteShell` as the only native chrome, and make its drawer focus behavior explicit and testable without changing menu data or page content.

**Tech Stack:** Astro 6 static output, TypeScript, Astro Container, Vitest, Cheerio/XML parsing in Node audit scripts, existing `PROUDTEK_NATIVE_SHELL` build-time flag.

---

## File map

- Modify `src/lib/rollout.ts`: add the three exact hub paths to the existing native-shell allowlist.
- Modify `src/lib/__tests__/route-registry.test.ts`: lock the five-route allowlist and exact-route default/flag behavior.
- Modify `src/pages/blog/index.astro`: preserve manual SEO and donor extraction, switch the outer layout, and gate both donor fragments.
- Modify `src/pages/guides/index.astro`: same shell wiring and donor-fragment gating as blog.
- Modify `src/pages/solutions/index.astro`: same shell wiring and donor-fragment gating as blog.
- Modify `src/components/shell/SiteHeader.astro`: store the opening trigger, focus into the drawer on open, and restore focus on close/Escape/backdrop/close-button actions.
- Modify `src/components/shell/__tests__/site-shell.test.ts`: assert the rendered shell exposes the focus-management hooks needed by the client behavior.
- Modify `scripts/site-contract-audit.mjs`: make `buildContract(distPath = DIST)` and `diffComparable` reusable, accept `--dist <path>` for CLI verification, and guard the CLI `main()` so importing the module does not execute it. Keep the committed baseline path and comparison semantics unchanged.
- Create `scripts/native-shell-canary-audit.mjs`: compare default and flagged build outputs for exact native-shell marker paths, duplicate chrome IDs, output-path/contract invariants, selected-hub baseline HTML, and image-sitemap equality. It imports the shared contract helpers rather than duplicating contract logic.
- Modify `package.json`: expose the new audit script as `audit:native-shell-canary`.
- Create `src/pages/__tests__/native-hub-shell.test.ts`: render `/blog/`, `/guides/`, and `/solutions/` through Astro Container under disabled and enabled rollout module states and assert main/body and donor-fragment branch contracts.
- No changes to `src/lib/route-registry.ts`, menu data, editorial content, `PageSeoData` construction, machine endpoints, or `site-contract.v1.json` are expected.

## Task 0: Capture a clean origin/main baseline before implementation

**Files:**
- No tracked source files modified.
- Temporary output: `/tmp/proudtek-siteshell-baseline`

- [ ] **Step 1: Confirm the working tree is not used for the baseline**

Create a UUID-unique detached worktree from the remote base and prove its provenance before building:

```bash
BASELINE_WT=/tmp/proudtek-siteshell-baseline-<uuid>
git worktree add --detach "$BASELINE_WT" origin/main
test "$(git -C "$BASELINE_WT" rev-parse HEAD)" = "$(git rev-parse origin/main)"
git -C "$BASELINE_WT" status --short
```

The status must be clean. Do not reset or delete the current worktree's unrelated untracked files. The baseline must come from the committed `origin/main` state, not from the implementation branch.

- [ ] **Step 2: Build the clean baseline**

Run from the clean origin worktree:

```bash
rm -rf /tmp/proudtek-siteshell-baseline
ASTRO_OUT_DIR=/tmp/proudtek-siteshell-baseline npm run build
```

Expected: a complete static output directory containing the hub HTML files, `image-sitemap.xml`, sitemap, site-index, and machine routes.

- [ ] **Step 3: Record the baseline path for later audit**

Keep the exact absolute path available for Task 4. Do not commit generated output or change `src/data/site-contract.v1.json`.

## Task 1: Lock the exact five-route rollout contract

**Files:**
- Modify: `src/lib/rollout.ts:31-45`
- Test: `src/lib/__tests__/route-registry.test.ts:47-71`

- [ ] **Step 1: Extend the failing rollout expectation**

Update the rollout test to expect the existing two routes plus, in this order, `/guides/`, `/solutions/`, and `/blog/`. Use `vi.stubEnv`, `vi.resetModules`, and a dynamic import (or the repository-supported equivalent) to test the module with `PROUDTEK_NATIVE_SHELL=1`; do not confuse the second `getRouteRollout` argument with the shell flag—it is `hasEditorialDefinition`.

Required default and exactness assertions:

```ts
expect(NATIVE_SHELL_CANARY_ROUTES).toEqual([
  "/glossary/",
  "/tools/rfid-tag-cost-estimator/",
  "/guides/",
  "/solutions/",
  "/blog/",
]);
expect(getRouteRollout("/guides/", false).shell).toBe("snapshot");
expect(getRouteRollout("/solutions/", false).shell).toBe("snapshot");
expect(getRouteRollout("/blog/", false).shell).toBe("snapshot");
expect(getRouteRollout("/guides/example/", true).shell).toBe("snapshot");
expect(getRouteRollout("/blog/example/", true).shell).toBe("snapshot");
expect(getRouteRollout("/solutions/example/", true).shell).toBe("snapshot");
expect(getRouteRollout("/guides", false).shell).toBe("snapshot");
```

The flag-on dynamic-import test must assert native shell for all five exact routes and snapshot shell for each near-miss and at least one unrelated route. Restore the stubbed environment and modules in `finally`/`afterEach` so the default test module is not polluted.

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
npm test -- src/lib/__tests__/route-registry.test.ts
```

Expected: FAIL because the allowlist still contains only the two existing routes.

- [ ] **Step 3: Add the three routes to the allowlist**

Change only `NATIVE_SHELL_CANARY_ROUTES` and its explanatory comment in `src/lib/rollout.ts`. Preserve exact trailing slashes, the strict `1`/`true` parser, and the existing kill-switch name.

- [ ] **Step 4: Run the focused test to verify it passes**

Run:

```bash
npm test -- src/lib/__tests__/route-registry.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit the rollout contract**

```bash
git add src/lib/rollout.ts src/lib/__tests__/route-registry.test.ts
git commit -m "feat: add hub routes to SiteShell canary"
```

## Task 2: Rewire the three hubs without changing page content

**Files:**
- Modify: `src/pages/blog/index.astro:20,203-248`
- Modify: `src/pages/guides/index.astro:17,144-187`
- Modify: `src/pages/solutions/index.astro:21,208-253`
- Test: `src/pages/__tests__/native-hub-shell.test.ts`

- [ ] **Step 1: Add the shell-switch imports and route rollout value**

In each hub, replace the direct `BaseLayout` import with `ShellSwitchLayout` from `../../layouts/ShellSwitchLayout.astro` and import `shouldUseNativeShell` from `../../lib/rollout`. After `ROUTE` is defined, add:

```ts
const useNativeShell = shouldUseNativeShell(ROUTE);
```

Do not change the hand-built `PageSeoData`, donor fallback order, `extractChromeFromSnapshot` call, `seo.htmlAttrs` merge, `seo.bodyAttrs` merge, or `seo.headHtml` merge. Do not add machine paths or alternate links.

- [ ] **Step 2: Replace only the outer layout and gate both donor fragments**

For each hub, change:

```astro
<BaseLayout seo={seo}>
  <Fragment set:html={chrome.beforeMainHtml} />
  <main>...</main>
  <Fragment set:html={chrome.afterMainHtml} />
</BaseLayout>
```

to:

```astro
<ShellSwitchLayout seo={seo} currentRoute={ROUTE}>
  {!useNativeShell && <Fragment set:html={chrome.beforeMainHtml} />}
  <main>...</main>
  {!useNativeShell && <Fragment set:html={chrome.afterMainHtml} />}
</ShellSwitchLayout>
```

Preserve every existing `<main>` attribute, rail, section, card loop, script, whitespace-sensitive snapshot fixture, and closing structure. The native branch must contain exactly one page `<main>` and no donor `beforeMainHtml`/`afterMainHtml`; the default branch must render both donor fragments exactly as before. Do not wrap the page body in an additional element.

- [ ] **Step 3: Add page-level branch tests**

Create `src/pages/__tests__/native-hub-shell.test.ts` using `experimental_AstroContainer`. Because Vitest aliases `astro:content` to `src/lib/__tests__/stubs/astro-content.ts`, add deterministic test fixtures/mocks before importing the hub modules:

- mock `astro:content`'s `getCollection("editorial")` with the minimum blog/guide/solution entries needed to render one card per hub;
- mock `../../lib/site-data`'s `getPageByRoute` (or provide a test-only donor fixture through the existing module boundary) with a snapshot containing `htmlAttrs`, `bodyAttrs`, `headHtml`, `beforeMainHtml`, and `afterMainHtml` that expose unmistakable donor markers;
- preserve the existing `resolveChipPlaceholdersDeep` and rail-builder interfaces so the page modules execute their real branch logic rather than a source-string substitute;
- reset mocks and modules between disabled and enabled flag cases.

Cover all three dedicated hub components under the default module state and under a re-imported `PROUDTEK_NATIVE_SHELL=1` state. For each route, assert:

- the expected existing hub H1 and `main#main` are present;
- the default render contains both donor fixture boundaries/landmarks and no native-shell marker;
- the flagged render contains `data-native-site-shell`, one `main#main`, and no donor fixture markers or duplicate donor masthead/footer;
- the component passes the exact route into `ShellSwitchLayout` indirectly through the active-nav `aria-current`/selected state or a route-specific shell assertion.

If Astro Container cannot safely re-import a page module with a different `import.meta.env` value in one process, split the enabled assertions into a separate test command/file loaded with `PROUDTEK_NATIVE_SHELL=1`; do not weaken the branch contract to a static source-string assertion.

- [ ] **Step 4: Run focused static and page/shell tests**

Run:

```bash
npm test -- src/lib/__tests__/route-registry.test.ts src/pages/__tests__/native-hub-shell.test.ts src/components/shell/__tests__/site-shell.test.ts
npm run check
```

Expected: PASS. The build check is required because Astro template branches and imports are compile-time checked.

- [ ] **Step 5: Commit the three hub wiring changes**

```bash
git add src/pages/blog/index.astro src/pages/guides/index.astro src/pages/solutions/index.astro src/pages/__tests__/native-hub-shell.test.ts
git commit -m "feat: route hub pages through SiteShell canary"
```

## Task 3: Make native drawer focus behavior explicit

**Files:**
- Modify: `src/components/shell/SiteHeader.astro:45-63`
- Test: `src/components/shell/__tests__/site-shell.test.ts:15-67`

- [ ] **Step 1: Extend the shell contract test**

Add assertions that the rendered native header contains the drawer close hook and the open button’s state attributes. Keep the existing compatibility assertions. The test should remain an Astro Container render test and should not claim to execute browser events; browser interaction is verified in Task 5.

- [ ] **Step 2: Implement the smallest explicit focus controller**

In the existing inline script:

1. Store the opening trigger as `HTMLElement | null` before opening.
2. When opening, set the existing body class and ARIA attributes, then on the next animation frame focus the drawer close button (or the first focusable element inside `#mobile-drawer` if the close button is unavailable).
3. When closing, restore the existing body class and ARIA attributes, then focus the stored trigger if it is still connected and focusable.
4. Clear the stored trigger after restoration.
5. Keep Escape, close button, and backdrop listeners on the existing `setDrawer` path.
6. Leave the initial closed state unchanged and do not alter menu labels, hrefs, IDs, CSS tokens, or reduced-motion handling.

Guard browser-only values and avoid throwing if the drawer or trigger is absent. The existing global `PageScript` observer may also observe `drawer-open`; the local controller must remain idempotent and not change the expected final focus target.

- [ ] **Step 3: Run shell tests and type checking**

Run:

```bash
npm test -- src/components/shell/__tests__/site-shell.test.ts
npm run check
```

Expected: PASS.

- [ ] **Step 4: Commit the drawer behavior**

```bash
git add src/components/shell/SiteHeader.astro src/components/shell/__tests__/site-shell.test.ts
git commit -m "fix: restore focus after native drawer closes"
```

## Task 4: Add build-output canary audit

**Files:**
- Create: `scripts/native-shell-canary-audit.mjs`
- Modify: `package.json:15-25`

- [ ] **Step 1: Define the audit CLI contract and shared parser boundary**

First update `scripts/site-contract-audit.mjs` so its parser can be imported without running the CLI:

- move `DIST`-dependent functions to accept a `distPath` parameter;
- export `buildContract(distPath)`, `diffComparable`, and the stable normalization helpers used by the existing audit;
- parse `--dist <path>` for CLI runs, defaulting to the current repository `dist/`;
- keep the committed baseline at `src/data/site-contract.v1.json` and preserve existing no-argument behavior;
- keep `main()` behind an `import.meta.url` entry-point guard so importing it from the new script does not execute `process.exit`.

Then implement `scripts/native-shell-canary-audit.mjs` with explicit arguments:

```text
node scripts/native-shell-canary-audit.mjs \
  --default-dist <path> \
  --flagged-dist <path> \
  --baseline-dist <path>
```

The new script must import the shared contract parser rather than duplicate sitemap, machine-route, redirect, JSON-LD, or page normalization logic. It must:

- walk all HTML files under each dist and normalize only documented build-source attributes/whitespace that are nondeterministic;
- require zero `[data-native-site-shell]` markers in `default-dist`;
- require markers only in `glossary/index.html`, `tools/rfid-tag-cost-estimator/index.html`, `guides/index.html`, `solutions/index.html`, and `blog/index.html` in `flagged-dist`;
- require exactly one `#masthead`, `#site-navigation`, `#primary-menu`, `#mobile-drawer`, `#mobile-menu`, `main#main`, and `footer#colophon` in each new flagged hub output;
- reject any extra donor masthead/footer in those flagged hub outputs;
- compare the shared contracts for default and flagged dist, allowing only the known native-shell HTML regions while requiring identical output paths, page SEO fields, JSON-LD, machine alternates, sitemap, site-index, machine route lists, and redirects;
- compare normalized `image-sitemap.xml` content between default and flagged dist;
- compare selected hub HTML between `default-dist` and `baseline-dist` after removing only documented Astro source attributes and normalizing whitespace, while preserving IDs, classes, links, landmarks, donor boundaries, and body content;
- exit 0 with a concise summary on success and exit 1 with the first actionable mismatch on failure.

Do not modify `src/data/site-contract.v1.json` or make either audit rewrite baselines. The scripts are verification tools only.

- [ ] **Step 2: Add the npm script**

Add:

```json
"audit:native-shell-canary": "node scripts/native-shell-canary-audit.mjs"
```

- [ ] **Step 3: Build and audit the separate outputs**

The clean baseline from Task 0 must already exist before this step. From the implementation worktree, run:

```bash
rm -rf /tmp/proudtek-siteshell-default /tmp/proudtek-siteshell-flagged
ASTRO_OUT_DIR=/tmp/proudtek-siteshell-default npm run build
PROUDTEK_NATIVE_SHELL=1 ASTRO_OUT_DIR=/tmp/proudtek-siteshell-flagged npm run build
npm run audit:site-contract -- --dist /tmp/proudtek-siteshell-default
npm run audit:native-shell-canary -- \
  --baseline-dist /tmp/proudtek-siteshell-baseline \
  --default-dist /tmp/proudtek-siteshell-default \
  --flagged-dist /tmp/proudtek-siteshell-flagged
```

Expected: both builds complete; the existing contract audit passes against the explicitly supplied default dist; the canary audit passes with native markers only in the exact five flagged outputs and identical non-shell contracts.

- [ ] **Step 4: Test the audit failure and success paths**

Run the new audit against deliberately copied fixture directories or temporary mutations that each introduce one known defect: an unexpected native marker in a non-canary HTML file, a missing marker in `guides/index.html`, a duplicate `#masthead`, and a changed image-sitemap URL, membership entry, or semantic image caption after normalization. Each defect must produce exit code 1 and identify the affected path/contract; formatting-only whitespace/XML changes must not fail. Then run the unmodified default/flagged/baseline command from Step 3 and require exit code 0. This keeps the verification tool itself from becoming a silent no-op.

- [ ] **Step 5: Commit the audit tool and parser support**

```bash
git add scripts/site-contract-audit.mjs scripts/native-shell-canary-audit.mjs package.json
git commit -m "test: add SiteShell canary output audit"
```

## Task 5: Run full verification and browser checks

**Files:**
- No source changes expected unless a verification failure identifies a defect.

- [ ] **Step 1: Run the full static/test gate**

```bash
npm run lint
npm run lint:chip-claims
npm run lint:chip-placeholder-drift
npm test
npm run check
```

Expected: all commands pass.

- [ ] **Step 2: Run both builds and contract audits**

Build the default and flagged outputs into separate temporary directories as in Task 4. Run:

```bash
npm run audit:site-contract -- --dist /tmp/proudtek-siteshell-default
npm run audit:native-shell-canary -- \
  --baseline-dist /tmp/proudtek-siteshell-baseline \
  --default-dist /tmp/proudtek-siteshell-default \
  --flagged-dist /tmp/proudtek-siteshell-flagged
```

Confirm the flagged build preserves the existing 595 output paths and the default build has zero native markers.

- [ ] **Step 3: Start a preview server for the flagged output**

For the temporary flagged preview, preserve the tracked `.claude/launch.json` before editing it:

```bash
cp .claude/launch.json /tmp/proudtek-siteshell-launch.json.bak
```

Add a temporary `flagged-static` configuration to `.claude/launch.json` with `runtimeExecutable: "python3"`, `runtimeArgs: ["-m", "http.server", "4324", "--directory", "/tmp/proudtek-siteshell-flagged"]`, and `port: 4324`. Start it with `preview_start` using `name: "flagged-static"`. After browser verification, stop it with `preview_stop`, restore the tracked file, and verify `git diff -- .claude/launch.json` is empty. Do not commit the temporary launch entry. Do not rely on the existing `astro preview` entry, because it serves `./dist` and cannot select the temporary flagged directory. Navigate explicitly to `/guides/`, `/solutions/`, and `/blog/`.

- [ ] **Step 4: Verify interactions in the browser**

For every new hub:

- confirm exactly one visible H1, header/main/footer/navigation landmarks, and the expected active desktop nav item;
- confirm the mobile drawer starts closed;
- activate the hamburger and confirm `aria-expanded="true"`, `aria-hidden="false"`, and focus inside `#mobile-drawer`;
- close with Escape, the close button, and the backdrop; confirm `aria-expanded="false"`, `aria-hidden="true"`, and focus returned to the opening trigger;
- confirm no horizontal overflow at mobile/tablet/desktop widths;
- verify touch targets on `[data-native-drawer-open]`, `[data-native-drawer-close]`, `.codex-native-header__quote`, and the primary drawer action links are at least 44px by 44px using `preview_inspect` bounding boxes at mobile width;
- verify focus-visible styling appears on the hamburger, close button, top-level nav link, and drawer action link by keyboard-tabbing and inspecting outline/box-shadow/color styles; do not accept mouse-only hover styles as focus proof;
- with reduced-motion emulation where supported by `preview_resize`/browser evaluation, verify drawer and focus behavior still works and no motion-only state is required for accessibility.

Use `preview_console_logs`, `preview_logs`, `preview_snapshot`, `preview_inspect`, `preview_click`, `preview_resize`, and `preview_screenshot` as required verification steps, not optional suggestions. For each hub, repeat the full open/close sequence three times: once closing with Escape, once with the close button, and once with the backdrop. Account for the existing `PageScript` mutation observer in `src/layouts/partials/PageScript.astro`; after every close path assert the final `document.activeElement` is the exact opening button, not merely any focusable element. Do not use temporary DOM mutation as implementation.

- [ ] **Step 5: Review the diff and commit any verification fix separately**

```bash
git diff origin/main...HEAD --stat
git status --short
git log --oneline -5
```

If a source fix was required, run the focused test and relevant build/audit again, then commit it with a targeted message. Do not alter unrelated pre-existing untracked files.

## Completion checklist

- [ ] Five-route rollout is exact and disabled by default.
- [ ] All three hubs use `ShellSwitchLayout` while preserving manual SEO and both donor fragments in the default branch.
- [ ] Flagged hubs render one native shell and one page main without duplicate donor chrome.
- [ ] Drawer open/close focus behavior is explicit and verified.
- [ ] Default/flagged contracts and image sitemap are compared.
- [ ] Full lint, tests, Astro check, builds, audits, and browser checks pass.
