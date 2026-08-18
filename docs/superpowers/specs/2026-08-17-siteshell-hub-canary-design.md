# Native SiteShell Hub Canary Expansion

**Date:** 2026-08-17  
**Status:** Draft for user review  
**Scope:** `/guides/`, `/solutions/`, and `/blog/` only

## 1. Goal

Extend the existing native `SiteShell` canary from the two current low-risk routes to three hub/index routes:

- `/guides/`
- `/solutions/`
- `/blog/`

The change is a shell-only migration. The three pages keep their current body renderer, content, URL, canonical, sitemap behavior, machine-readable routes, redirects, and JSON-LD. With the rollout flag disabled, the production output must remain unchanged. With `PROUDTEK_NATIVE_SHELL=1`, only the selected routes receive the native header and footer.

This is the next small batch in the progressive rebuild. It is not the homepage migration, a content rewrite, a navigation redesign, a RFQ change, or a product-page migration.

## 2. Current architecture

The project already has the pieces needed for an exact-route shell canary:

- `src/lib/route-registry.ts` owns native Astro route definitions and catch-all ownership.
- `src/lib/rollout.ts` owns build-time rollout flags and the exact native-shell allowlist.
- `src/layouts/ShellSwitchLayout.astro` chooses `PageFrameLayout` when the current route is enabled and otherwise delegates to `BaseLayout`.
- `src/layouts/PageFrameLayout.astro` wraps the existing SEO-capable `BaseLayout` with `SiteShell`.
- `src/components/shell/SiteHeader.astro` and `SiteFooter.astro` preserve the compatibility hooks expected by existing page scripts while using the native shell styles.
- Dedicated native hub pages already own `/blog/`, `/guides/`, and `/solutions/` in `route-registry.ts`; the catch-all therefore excludes their snapshot paths.

The important boundary is that route ownership and shell rollout are separate. `route-registry.ts` prevents duplicate static route generation. `rollout.ts` decides which renderer is used for a deployment. This design keeps those responsibilities separate.

## 3. Proposed design

### 3.1 Route rollout

Add the three hub routes to `NATIVE_SHELL_CANARY_ROUTES` in `src/lib/rollout.ts`:

```ts
export const NATIVE_SHELL_CANARY_ROUTES = [
  "/glossary/",
  "/tools/rfid-tag-cost-estimator/",
  "/guides/",
  "/solutions/",
  "/blog/",
] as const;
```

No new environment variable is introduced. `PROUDTEK_NATIVE_SHELL` remains the single kill switch:

- unset or any value other than `1`/`true`: all five routes keep their current shell;
- `1` or `true`: only the exact five routes use `PageFrameLayout` through `ShellSwitchLayout`;
- all other routes remain on their existing shell path.

The route strings must retain their trailing slash because rollout matching is exact and the site uses trailing-slash URLs.

### 3.2 Page entry points

The implementation should inspect the existing dedicated Astro entry points for the three hubs and make the smallest possible change needed to route their shell through `ShellSwitchLayout`. If a hub already uses `ShellSwitchLayout`, no page-level change is needed; only the rollout allowlist changes.

Each hub entry point must continue to:

1. build SEO metadata through the existing `buildPageSeo` pipeline;
2. emit the same machine JSON and text paths;
3. render the existing hub body unchanged;
4. pass its exact route to the shell switch;
5. keep any snapshot compatibility fragment only for the snapshot branch, as the cost estimator currently does.

Do not move body composition into `SiteShell`. `SiteShell` owns only site chrome; the hub page owns its `<main>`.

### 3.3 Native shell behavior

`PageFrameLayout` remains the native wrapper. It continues to use `BaseLayout` for document-level SEO/head handling, then injects `SiteShell` around the existing page slot.

The native shell must preserve:

- `#masthead`, `#site-navigation`, `#primary-menu`, `#mobile-drawer`, and `#mobile-menu` compatibility hooks;
- the active desktop navigation state based on `currentRoute`;
- the existing RFQ and sample-pack destinations;
- keyboard-operable mobile drawer behavior, Escape close, and `aria-expanded`/`aria-hidden` state;
- 44px touch targets, focus rings, reduced-motion behavior, and token-only styling.

No menu item is added, removed, renamed, or reordered in this slice. Menu data remains sourced from `src/lib/menu-structure`.

## 4. Rendering and data flow

For each of the three hub routes:

1. Astro resolves the dedicated hub page rather than the catch-all snapshot page because the route is already marked `ownsStaticPath` in `route-registry.ts`.
2. The page builds its existing `PageSeoData` and machine route paths.
3. The page passes its exact route to `ShellSwitchLayout`.
4. `ShellSwitchLayout` calls `shouldUseNativeShell(route)`.
5. When the build flag is disabled, the page follows its current `BaseLayout`/snapshot-compatible shell branch.
6. When the flag is enabled and the route is in the exact allowlist, `PageFrameLayout` renders `BaseLayout` plus native `SiteShell` around the unchanged page body.
7. The same body data, SEO metadata, canonical, schema, machine routes, and sitemap registry are emitted in either branch.

The migration is intentionally build-time and deterministic. There is no cookie, user-agent, random split, runtime fetch, or client-side route decision.

## 5. Error handling and rollback

### Build-time safety

- Unknown routes must remain excluded from the native shell allowlist.
- A route must not be added to the canary list unless its dedicated entry point exists and its route registry definition is unique.
- Duplicate route definitions should fail the existing route-registry tests rather than silently selecting one renderer.
- The flag parser remains strict: only `1` and `true` enable the shell.

### Runtime safety

- If a page cannot render its native shell branch, the deployment is rolled back by disabling `PROUDTEK_NATIVE_SHELL`; no content or route data needs to be reverted.
- The page body must not depend on native-shell-only DOM. Existing compatibility IDs and classes remain in the native header/footer for scripts that query them.
- Mobile drawer failures must fail closed: the default state is closed, and Escape restores the closed state.

### Rollback procedure

1. Redeploy with `PROUDTEK_NATIVE_SHELL` unset or set to a disabled value.
2. Confirm the default build returns to the previous shell for all routes.
3. Keep the allowlist code in place for the next canary after the defect is understood; do not broaden the route batch while investigating.

## 6. Verification plan

### Unit and component tests

Update the rollout tests to assert:

- the canary list contains exactly the existing two routes plus `/guides/`, `/solutions/`, and `/blog/`;
- default rollout remains `shell: "snapshot"` for the three hub routes;
- non-canary routes remain snapshot-shell routes;
- the kill-switch name remains `PROUDTEK_NATIVE_SHELL`.

Add or extend page-level tests for each hub to assert the page still renders its existing `<main>` content and passes the correct route into the shell switch. Reuse the existing `SiteShell` compatibility tests for header/footer landmarks and navigation hooks; add only route-specific assertions that are not already covered.

### Contract and build checks

Run the full acceptance sequence required by the rebuild blueprint:

```bash
npm run lint
npm run lint:chip-claims
npm run lint:chip-placeholder-drift
npm run test
npm run check
npm run build
npm run audit:site-contract
```

`package.json` currently exposes `check` (Astro check) and `audit:site-contract`; it does not expose separate `astro:check`, `audit:seo-contract`, or `audit:redirects` scripts. The site-contract audit and the CI workflow are the source of truth for the current canonical, robots, sitemap, redirect, machine-route, and JSON-LD checks. If CI invokes an additional repository-local audit during implementation, run that exact CI command as well rather than inventing a new npm script.

Run a second flagged build with `PROUDTEK_NATIVE_SHELL=1` and repeat the relevant checks. The flagged build may differ in shell HTML for exactly `/guides/`, `/solutions/`, and `/blog/`, plus the two existing canaries. It must not change:

- the 595 output-path set;
- canonical URLs;
- robots directives;
- sitemap and image-sitemap membership;
- redirect mappings;
- machine JSON/TXT route membership;
- JSON-LD type and entity-ID sets;
- page body content outside the intended shell boundary.

### Accessibility and browser checks

For each new canary route, verify:

- one visible H1 remains in the page body;
- header, main, footer, and navigation landmarks are present;
- desktop active navigation identifies the current hub;
- mobile menu opens and closes with keyboard and restores state on Escape;
- focus-visible rings and touch targets meet the established token rules;
- no horizontal overflow appears at mobile, tablet, and desktop breakpoints.

A browser preview is useful for this visual/accessibility pass, but it is not a substitute for contract audits.

## 7. Non-goals

This slice does not:

- change hub copy, card ordering, images, metadata, or internal links;
- redesign the desktop or mobile menu;
- migrate `/contact/`, `/rfq/`, `/products/`, individual product pages, or solution detail pages;
- introduce a new rollout flag or runtime personalization;
- remove Kadence CSS, snapshot chrome, or donor extraction;
- fix the known duplicate sitemap warning; that remains a separate contract-allowlisted SEO cleanup;
- add evidence cards, catalog-v2 data, compare-builder behavior, or RFQ schema changes.

## 8. Acceptance criteria

The slice is complete when:

1. The three hub routes use native `SiteShell` only in an explicitly flagged build.
2. The default build is unchanged for all routes.
3. The flagged build preserves all URL, SEO, sitemap, redirect, machine-route, and JSON-LD contracts.
4. Existing body content and hub behavior are unchanged.
5. Header/footer compatibility hooks and mobile navigation behavior pass tests and browser checks.
6. The implementation remains limited to the route allowlist, any already-required hub entry-point wiring, tests, and documentation.

## 9. Follow-up decision

After this batch passes the contract and browser gates, decide whether to:

- expand the shell to another low-risk hub batch;
- migrate one commercial page with a separate contract allowlist; or
- pause shell work and prioritize the RFQ/CTA consolidation.

That decision is outside this slice and must not be smuggled into the implementation PR.
