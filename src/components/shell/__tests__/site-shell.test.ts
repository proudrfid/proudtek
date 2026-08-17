import { describe, expect, it } from "vitest";
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
    expect(html).toContain('href="/rfq/"');
    expect(html).toContain('href="/sample-pack/"');
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
