import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createDrawerFixture } from "./drawer-focus.fixture";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import SiteHeader from "../SiteHeader.astro";
import SiteFooter from "../SiteFooter.astro";
import SiteShell from "../SiteShell.astro";

function normalizeHtml(html: string): string {
  return html
    .replace(/\s+data-astro-source-[a-z]+="[^"]*"/g, "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

describe("native SiteShell dark launch", () => {
  it("renders the compatibility hooks required by PageScript", async () => {
    const container = await AstroContainer.create();
    const html = normalizeHtml(await container.renderToString(SiteHeader, {
      props: { currentRoute: "/products/rfid-cards/" },
    }));

    expect(html).toContain('id="masthead"');
    expect(html).toContain('id="site-navigation"');
    expect(html).toContain('id="primary-menu"');
    expect(html).toContain('id="mobile-drawer"');
    expect(html).toContain('id="mobile-menu"');
    expect(html).toContain('aria-controls="mobile-drawer"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('id="mobile-drawer" class="codex-native-drawer" aria-hidden="true"');
    expect(html).toContain('data-native-drawer-open');
    expect(html).toContain('data-native-drawer-close');
    const headerSource = readFileSync(new URL("../SiteHeader.astro", import.meta.url), "utf8");
    const shellCss = readFileSync(new URL("../../../styles/codex-shell.css", import.meta.url), "utf8");
    expect(headerSource).not.toContain("#masthead[data-native-shell-header] #main-header");
    expect(shellCss).toContain("#masthead[data-native-shell-header] #main-header");
    expect(html).toContain('href="/rfq/"');
    expect(html).toContain('href="/sample-pack/"');
  });

  it("keeps legacy drawer ownership out of native shell pages", () => {
    const source = readFileSync(new URL("../../../layouts/partials/PageScript.astro", import.meta.url), "utf8");

    expect(source).toContain("new MutationObserver");
    expect(source).toContain("var __nativeSiteShell = document.querySelector('[data-native-site-shell]')");
    expect(source).toContain("if (__nativeSiteShell || document.querySelector('[data-native-site-shell]')) return;");
    expect(source).toContain("if (!__nativeSiteShell)");
  });

  it("executes drawer focus management for open, Escape and backdrop close", async () => {
    const fixture = createDrawerFixture();

    fixture.openButton.click();
    fixture.flushAnimationFrames();
    expect(fixture.document.activeElement).toBe(fixture.closeButton);

    fixture.document.dispatchEvent({ type: "keydown", key: "Escape" });
    fixture.flushAnimationFrames();
    expect(fixture.openButton.getAttribute("aria-expanded")).toBe("false");
    expect(fixture.drawer.getAttribute("aria-hidden")).toBe("true");
    expect(fixture.document.activeElement).toBe(fixture.openButton);

    fixture.openButton.click();
    fixture.flushAnimationFrames();
    fixture.backdrop.click();
    fixture.flushAnimationFrames();
    expect(fixture.document.activeElement).toBe(fixture.openButton);
  });

  it("restores the trigger through the close-button click path after a competing focus", () => {
    const fixture = createDrawerFixture();

    fixture.openButton.click();
    fixture.flushAnimationFrames();
    expect(fixture.document.activeElement).toBe(fixture.closeButton);

    fixture.closeButton.addEventListener("click", () => fixture.scheduleAnimationFrame(() => {
      fixture.document.activeElement = fixture.closeButton;
    }));
    fixture.closeButton.click();
    fixture.flushAnimationFrames();

    expect(fixture.document.activeElement).toBe(fixture.openButton);
  });
  it("skips a CSS-hidden close button and focuses the visible drawer fallback", () => {
    const fixture = createDrawerFixture({ hiddenCloseButton: true });

    fixture.openButton.click();
    fixture.flushAnimationFrames();

    expect(fixture.document.activeElement).toBe(fixture.firstLink);
  });

  it("closes the drawer when the viewport crosses to desktop", () => {
    const fixture = createDrawerFixture();

    fixture.openButton.click();
    fixture.flushAnimationFrames();
    expect(fixture.document.activeElement).toBe(fixture.closeButton);

    fixture.setViewport(1280);
    fixture.flushAnimationFrames();

    expect(fixture.drawer.getAttribute("aria-hidden")).toBe("true");
    expect(fixture.openButton.getAttribute("aria-expanded")).toBe("false");
    expect(fixture.document.activeElement).toBe(fixture.document.body);
  });
  it.each(["missing", "null", "throw"] as const)(
    "keeps drawer handlers working when matchMedia is %s",
    (matchMedia) => {
      const fixture = createDrawerFixture({ matchMedia });

      fixture.openButton.click();
      fixture.flushAnimationFrames();
      expect(fixture.openButton.getAttribute("aria-expanded")).toBe("true");

      fixture.document.dispatchEvent({ type: "keydown", key: "Escape" });
      fixture.flushAnimationFrames();
      expect(fixture.openButton.getAttribute("aria-expanded")).toBe("false");
      expect(fixture.drawer.getAttribute("aria-hidden")).toBe("true");
    },
  );
  it("falls back past hidden and disabled drawer controls", () => {
    const fixture = createDrawerFixture({ disabledCloseButton: true, hiddenFirstLink: true });

    fixture.openButton.click();
    fixture.flushAnimationFrames();

    expect(fixture.document.activeElement).toBe(fixture.fallbackLink);
  });

  it.each([
    ["hidden", (fixture: ReturnType<typeof createDrawerFixture>) => { fixture.triggerAncestor.hidden = true; }],
    ["inert", (fixture: ReturnType<typeof createDrawerFixture>) => { fixture.triggerAncestor.setAttribute("inert", ""); }],
    ["CSS-hidden", (fixture: ReturnType<typeof createDrawerFixture>) => { fixture.triggerAncestor.rendered = false; }],
  ])("does not claim %s trigger restoration after open and blurs drawer focus", (_label, hideTrigger) => {
    const fixture = createDrawerFixture();

    fixture.openButton.click();
    fixture.flushAnimationFrames();
    expect(fixture.document.activeElement).toBe(fixture.closeButton);

    hideTrigger(fixture);
    fixture.document.dispatchEvent({ type: "keydown", key: "Escape" });
    fixture.flushAnimationFrames();

    expect(fixture.document.activeElement).toBe(fixture.document.body);
    expect(fixture.document.activeElement).not.toBe(fixture.openButton);
  });
  it("marks the relevant desktop route active without changing the menu data", async () => {
    const container = await AstroContainer.create();
    const html = normalizeHtml(await container.renderToString(SiteHeader, {
      props: { currentRoute: "/products/rfid-cards/" },
    }));

    expect(html).toContain('class="menu-item codex-native-nav__item menu-item-has-children codex-mega-item current-menu-item codex-active"');
    expect(html).toContain('href="/products/all/" aria-current="page"');
    expect(html).toContain("RFID Cards");
    expect(html).toContain("Hotel Key Cards");
  });

  it("renders supplier qualification, contact and legal footer paths", async () => {
    const container = await AstroContainer.create();
    const html = normalizeHtml(await container.renderToString(SiteFooter));

    expect(html).toContain('id="colophon"');
    expect(html).toContain("Supplier qualification");
    expect(html).toContain('href="/about/certifications/"');
    expect(html).toContain('href="mailto:info@proudtek.com"');
    expect(html).toContain('href="/about/privacy-policy/"');
  });

  it("composes native header and footer without exposing a production route", async () => {
    const container = await AstroContainer.create();
    const html = normalizeHtml(await container.renderToString(SiteShell, {
      props: { currentRoute: "/guides/" },
      slots: { default: '<main id="main"><h1>Shell canary</h1></main>' },
    }));

    expect(html).toContain('data-native-site-shell');
    expect(html).toContain('<main id="main"><h1>Shell canary</h1></main>');
    expect(html).toContain('id="masthead"');
    expect(html).toContain('id="colophon"');
  });
});
