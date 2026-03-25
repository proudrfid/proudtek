/**
 * Tagged template literal for safe HTML generation.
 *
 * All interpolated values are automatically escaped. Use `raw()` to
 * insert pre-escaped or trusted HTML without double-escaping.
 *
 * @example
 * ```ts
 * const title = 'Cards & Tags';
 * const inner = html`<li>${title}</li>`;
 * const result = html`<ul>${raw(inner)}</ul>`;
 * ```
 */

const RAW_MARKER = Symbol("raw");

interface RawHtml {
  [RAW_MARKER]: true;
  value: string;
}

export function raw(value: string): RawHtml {
  return { [RAW_MARKER]: true, value };
}

export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  let result = strings[0] ?? "";

  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    if (value != null && typeof value === "object" && RAW_MARKER in value) {
      result += (value as RawHtml).value;
    } else {
      result += escapeHtml(String(value ?? ""));
    }

    result += strings[i + 1] ?? "";
  }

  return result;
}

export function attr(value: string): RawHtml {
  return raw(escapeHtml(value));
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
