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

### 3.2 Page entry points and donor chrome

The three dedicated hub entry points currently construct `PageSeoData` manually and merge attributes/head markup from an extracted WordPress donor snapshot. This slice must preserve that pipeline exactly; it must not migrate the hubs to `buildPageSeo`.

Each hub must replace its outer `BaseLayout` with `ShellSwitchLayout`, pass its exact route as `currentRoute`, and conditionally omit **both** donor-chrome fragments when native shell is active:

```astro
const useNativeShell = shouldUseNativeShell(ROUTE);

<ShellSwitchLayout seo={seo} currentRoute={ROUTE}>
  {!useNativeShell && <Fragment set:html={chrome.beforeMainHtml} />}
  <main id="main">...</main>
  {!useNativeShell && <Fragment set:html={chrome.afterMainHtml} />}
</ShellSwitchLayout>
```

The branch contract is:

- flag off: render both `chrome.beforeMainHtml` and `chrome.afterMainHtml`, preserving the current snapshot header/footer;
- flag on: omit both donor fragments so `SiteShell` provides the only header and footer;
- either branch: render the existing `<main>` and its internal order unchanged.

Do not copy the cost estimator's one-fragment pattern: these hubs have both pre-main and post-main donor chrome. Rendering either donor fragment in the native branch would duplicate site navigation, footer, and compatibility IDs.

The current `extractChromeFromSnapshot` calls, donor fallback order, and merging of `seo.htmlAttrs`, `seo.bodyAttrs`, and `seo.headHtml` remain unchanged. They are still required by the default branch and must not be refactored as part of this shell migration.

The hub HTML currently has no machine-alternate links. Keep that head contract unchanged: do not add `machineJsonPath`, `machineTextPath`, or `<link rel="alternate">` to these page entry points. Independent machine JSON/TXT outputs and `site-index.json` membership must remain unchanged; “machine route preservation” in this spec refers to those independent generated outputs, not new alternates in the hub HTML.

Do not move body composition into `SiteShell`. `SiteShell` owns only site chrome; each hub page owns its `<main>`.

### 3.3 Native shell behavior

`PageFrameLayout` remains the native wrapper. It continues to use `BaseLayout` for document-level SEO/head handling, then injects `SiteShell` around the existing page slot.

The native shell must preserve:

- `#masthead`, `#site-navigation`, `#primary-menu`, `#mobile-drawer`, and `#mobile-menu` compatibility hooks;
- the active desktop navigation state based on `currentRoute`;
- the existing RFQ and sample-pack destinations;
- keyboard-operable mobile drawer behavior, Escape close, and `aria-expanded`/`aria-hidden` state;
- focus management that stores the opening trigger, moves focus into the drawer on open, and returns focus to that trigger on close;
- 44px touch targets, focus rings, reduced-motion behavior, and token-only styling.

No menu item is added, removed, renamed, or reordered in this slice. Menu data remains sourced from `src/lib/menu-structure`.

## 4. Rendering and data flow

For each of the three hub routes:

1. Astro resolves the dedicated hub page rather than the catch-all snapshot page because the route is already marked `ownsStaticPath` in `route-registry.ts`.
2. The page constructs its existing manual `PageSeoData`, extracts the same donor snapshot, and performs the same HTML/body/head attribute merge.
3. The page passes its exact route to `ShellSwitchLayout` and computes `useNativeShell` from the same rollout registry.
4. `ShellSwitchLayout` calls `shouldUseNativeShell(route)`.
5. When the build flag is disabled, the page renders both donor-chrome fragments around the unchanged `<main>`.
6. When the flag is enabled and the route is in the exact allowlist, the page omits both donor fragments and `PageFrameLayout` renders `BaseLayout` plus the native `SiteShell` around the unchanged `<main>`.
7. The same body data, manual SEO metadata, canonical, schema, independent machine outputs, and sitemap registry are emitted in either branch.

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
- Mobile drawer failures must fail closed: the initial state is closed; Escape, the close button, and the backdrop restore `aria-expanded="false"` and `aria-hidden="true"`; focus returns to the trigger that opened the drawer.

### Rollback procedure

1. Redeploy with `PROUDTEK_NATIVE_SHELL` unset or set to a disabled value.
2. Confirm the default build returns to the previous shell for all routes.
3. Keep the allowlist code in place for the next canary after the defect is understood; do not broaden the route batch while investigating.

## 6. Verification plan

### Unit and component tests

Update the rollout tests to assert:

- the canary list contains exactly the existing two routes plus `/guides/`, `/solutions/`, and `/blog/`;
- default rollout remains `shell: "snapshot"` for the three hub routes;
- `PROUDTEK_NATIVE_SHELL=1` enables only those five exact routes;
- near-miss routes remain snapshot-shell routes, including `/guides/example/`, `/blog/example/`, `/solutions/example/`, and `/guides` without the trailing slash;
- non-canary routes remain snapshot-shell routes;
- the kill-switch name remains `PROUDTEK_NATIVE_SHELL`.

Add or extend page-level tests for each hub to assert the page still renders its existing `<main>` content and passes the correct route into the shell switch. The tests must also cover the two-fragment branch contract: flag off keeps both donor fragments, while flag on omits both. Reuse the existing `SiteShell` compatibility tests for header/footer landmarks and navigation hooks; add only route-specific assertions that are not already covered.

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

Run a second flagged build with `PROUDTEK_NATIVE_SHELL=1` and repeat the relevant checks. The flagged build may differ in shell HTML for exactly these five output paths:

- `glossary/index.html`
- `tools/rfid-tag-cost-estimator/index.html`
- `guides/index.html`
- `solutions/index.html`
- `blog/index.html`

It must not change:

- the 595 output-path set;
- canonical URLs;
- robots directives;
- sitemap membership;
- redirect mappings;
- independent machine JSON/TXT route membership and `site-index.json` membership;
- JSON-LD type and entity-ID sets;
- hub HTML machine-alternate links, which remain absent;
- page body content outside the intended shell boundary.

Because `audit:site-contract` intentionally compares normalized page/main contracts rather than full header/footer HTML, add explicit build-output assertions:

1. In the default build, `[data-native-site-shell]` appears in zero HTML files.
2. In the flagged build, that marker appears only in the five exact output paths above.
3. Each of the three new hub outputs contains exactly one `#masthead`, `#site-navigation`, `#primary-menu`, `#mobile-drawer`, `#mobile-menu`, `main#main`, and `footer#colophon`.
4. The default build's three hub outputs retain both donor-chrome boundaries and match the clean `origin/main` build for those selected HTML regions. Do not compare only the `<main>` hash.
5. The flagged build's three hub outputs contain no donor masthead/footer in addition to the native shell.
6. Normalize and compare `dist/image-sitemap.xml` between default and flagged builds; its membership/content must be identical. The current site-contract audit does not parse image-sitemap membership, so this comparison is required by the implementation verification and is not claimed as coverage by the audit.

### Accessibility and browser checks

For each new canary route, verify:

- one visible H1 remains in the page body;
- header, main, footer, and navigation landmarks are present;
- desktop active navigation identifies the current hub;
- the mobile drawer starts closed;
- hamburger activation opens it and updates `aria-expanded="true"`/`aria-hidden="false"`;
- Escape, the close button, and the backdrop close it and restore `aria-expanded="false"`/`aria-hidden="true"`;
- focus moves into the drawer on open and returns to the opening trigger on close;
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

The only allowed shared-shell behavior change is the native drawer focus-management fix required to satisfy the rebuild blueprint accessibility gate: store the opening trigger, focus the drawer close control or first drawer focusable on open, and restore focus to the trigger on close. That change belongs in `src/components/shell/SiteHeader.astro` and its shell tests, not in hub content.

## 8. Acceptance criteria

The slice is complete when:

1. The three hub routes use native `SiteShell` only in an explicitly flagged build.
2. The default build is unchanged for all routes.
3. The flagged build preserves all URL, SEO, sitemap, redirect, machine-route, and JSON-LD contracts.
4. Existing body content and hub behavior are unchanged.
5. Header/footer compatibility hooks, drawer focus management, and mobile navigation behavior pass tests and browser checks.
6. The implementation remains limited to the route allowlist, required hub entry-point wiring, the native drawer focus-management fix in `SiteHeader.astro`, tests, and documentation.

## 9. Follow-up decision

After this batch passes the contract and browser gates, decide whether to:

- expand the shell to another low-risk hub batch;
- migrate one commercial page with a separate contract allowlist; or
- pause shell work and prioritize the RFQ/CTA consolidation.

That decision is outside this slice and must not be smuggled into the implementation PR.
