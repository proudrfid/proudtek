import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

interface FixtureOptions {
  disabledCloseButton?: boolean;
  hiddenFirstLink?: boolean;
  hiddenCloseButton?: boolean;
}

class FakeElement {
  readonly tagName: string;
  readonly children: FakeElement[] = [];
  readonly listeners = new Map<string, Array<(event: Record<string, unknown>) => void>>();
  parentElement: FakeElement | null = null;
  isConnected = true;
  rendered = true;
  hidden = false;
  open = true;
  tabIndex = 0;
  private readonly attributes = new Map<string, string>();
  private readonly classes = new Set<string>();
  fixtureDocument: FakeDocument | null = null;

  constructor(tagName: string, attributes: Record<string, string> = {}) {
    this.tagName = tagName.toUpperCase();
    Object.entries(attributes).forEach(([name, value]) => {
      this.attributes.set(name, value);
      if (name === "tabindex") this.tabIndex = Number(value);
    });
  }

  append(child: FakeElement): void {
    child.parentElement = this;
    child.assignFixtureDocument(this.fixtureDocument);
    this.children.push(child);
  }

  assignFixtureDocument(document: FakeDocument | null): void {
    this.fixtureDocument = document;
    this.children.forEach((child) => child.assignFixtureDocument(document));
  }

  addEventListener(type: string, listener: (event: Record<string, unknown>) => void): void {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  click(): void {
    this.dispatchEvent({ type: "click", target: this });
  }

  dispatchEvent(event: Record<string, unknown>): void {
    this.listeners.get(String(event.type))?.forEach((listener) => listener(event));
  }

  focus(): void {
    let ancestor: FakeElement | null = this;
    while (ancestor) {
      if (!ancestor.rendered
        || ancestor.hidden
        || ancestor.hasAttribute("inert")
        || ancestor.getAttribute("aria-hidden") === "true"
        || (ancestor.tagName === "DETAILS"
          && !ancestor.open
          && this.tagName !== "SUMMARY")) return;
      ancestor = ancestor.parentElement;
    }
    if (this.fixtureDocument) this.fixtureDocument.activeElement = this;
  }

  blur(): void {
    if (this.fixtureDocument?.activeElement === this) this.fixtureDocument.activeElement = this.fixtureDocument.body;
  }

  getBoundingClientRect(): { width: number; height: number } {
    return this.rendered ? { width: 44, height: 44 } : { width: 0, height: 0 };
  }

  get clientWidth(): number {
    return this.rendered ? 44 : 0;
  }

  get clientHeight(): number {
    return this.rendered ? 44 : 0;
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  hasAttribute(name: string): boolean {
    return this.attributes.has(name);
  }

  contains(node: FakeElement | null): boolean {
    if (!node) return false;
    if (node === this) return true;
    return this.children.some((child) => child.contains(node));
  }

  get classList() {
    return {
      toggle: (name: string, force?: boolean) => {
        const next = force === undefined ? !this.classes.has(name) : force;
        if (next) this.classes.add(name);
        else this.classes.delete(name);
        return next;
      },
      contains: (name: string) => this.classes.has(name),
    };
  }

  querySelector<T extends FakeElement>(selector: string): T | null {
    return this.querySelectorAll<T>(selector)[0] ?? null;
  }

  querySelectorAll<T extends FakeElement>(selector: string): T[] {
    return this.descendants().filter((element) => matchesSelector(element, selector)) as T[];
  }

  private descendants(): FakeElement[] {
    return this.children.flatMap((child) => [child, ...child.descendants()]);
  }
}

class FakeDocument {
  readonly body = new FakeElement("body");
  readonly listeners = new Map<string, Array<(event: Record<string, unknown>) => void>>();
  activeElement: FakeElement = this.body;
  private readonly elements = new Map<string, FakeElement>();

  constructor() {
    this.body.fixtureDocument = this;
  }

  register(id: string, element: FakeElement): void {
    element.assignFixtureDocument(this);
    this.elements.set(id, element);
  }

  getElementById(id: string): FakeElement | null {
    return this.elements.get(id) ?? null;
  }

  querySelector<T extends FakeElement>(selector: string): T | null {
    if (selector === "[data-native-drawer-open]") return this.elements.get("open") as T ?? null;
    return this.body.querySelector<T>(selector);
  }

  querySelectorAll<T extends FakeElement>(selector: string): T[] {
    return this.body.querySelectorAll<T>(selector);
  }

  addEventListener(type: string, listener: (event: Record<string, unknown>) => void): void {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  dispatchEvent(event: Record<string, unknown>): void {
    this.listeners.get(String(event.type))?.forEach((listener) => listener(event));
  }
}

function matchesSelector(element: FakeElement, selector: string): boolean {
  if (selector === "[data-native-drawer-close]") return element.hasAttribute("data-native-drawer-close");
  if (selector === 'a[href], button, summary, [tabindex]:not([tabindex="-1"])') {
    return element.tagName === "A"
      || element.tagName === "BUTTON"
      || element.tagName === "SUMMARY"
      || element.hasAttribute("tabindex");
  }
  return false;
}

function extractScript(): string {
  const source = readFileSync(new URL("../SiteHeader.astro", import.meta.url), "utf8");
  const match = source.match(/<script>\s*([\s\S]*?)\s*<\/script>/);
  if (!match) throw new Error("SiteHeader inline script not found");
  return match[1];
}

export function createDrawerFixture(options: FixtureOptions = {}) {
  const document = new FakeDocument();
  const openButton = new FakeElement("button", { "data-native-drawer-open": "", "aria-expanded": "false" });
  const header = new FakeElement("header");
  const drawer = new FakeElement("div", { id: "mobile-drawer", "aria-hidden": "true" });
  const closeButton = new FakeElement("button", { "data-native-drawer-close": "", "aria-label": "Close menu" });
  const firstLink = new FakeElement("a", { href: "/hidden" });
  const fallbackLink = new FakeElement("a", { href: "/fallback" });
  const backdrop = new FakeElement("button", { "data-native-drawer-close": "", tabindex: "-1" });

  if (options.disabledCloseButton) closeButton.setAttribute("disabled", "");
  if (options.hiddenCloseButton) closeButton.rendered = false;
  if (options.hiddenFirstLink) firstLink.hidden = true;
  drawer.append(closeButton);
  drawer.append(firstLink);
  drawer.append(fallbackLink);
  drawer.append(backdrop);
  header.append(openButton);
  document.body.append(header);
  document.body.append(drawer);
  document.register("mobile-drawer", drawer);
  document.register("open", openButton);
  document.register("open", openButton);

  const animationFrames: Array<() => void> = [];
  const windowListeners = new Map<string, Array<() => void>>();
  const window = {
    matchMedia: () => ({ matches: false }),
    addEventListener: (type: string, listener: () => void) => {
      const listeners = windowListeners.get(type) ?? [];
      listeners.push(listener);
      windowListeners.set(type, listeners);
    },
    dispatchEvent: (event: Record<string, unknown>) => {
      windowListeners.get(String(event.type))?.forEach((listener) => listener());
    },
  };
  const context = {
    document,
    window,
    getComputedStyle: (element: FakeElement) => ({
      display: element.rendered ? "block" : "none",
      visibility: element.rendered ? "visible" : "hidden",
    }),
    requestAnimationFrame: (callback: () => void) => {
      animationFrames.push(callback);
      return animationFrames.length;
    },
  };
  const script = ts.transpileModule(extractScript(), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
  }).outputText;
  runInNewContext(script, context);

  return {
    document,
    drawer,
    triggerAncestor: header,
    openButton,
    closeButton,
    firstLink,
    fallbackLink,
    backdrop,
    flushAnimationFrames: () => {
      while (animationFrames.length) animationFrames.shift()?.();
    },
    scheduleAnimationFrame: (callback: () => void) => {
      animationFrames.push(callback);
    },
    setViewport: (width: number) => {
      window.matchMedia = () => ({ matches: width >= 1280 });
      window.dispatchEvent({ type: "resize" });
    },
  };
}
