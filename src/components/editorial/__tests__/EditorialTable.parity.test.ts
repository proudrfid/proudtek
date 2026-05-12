/**
 * Parity test — EditorialTable.astro ↔ editorial-pages.ts renderTable().
 *
 * Stage 2. Locks:
 *  - first-column header (no sort attrs / no indicator)
 *  - subsequent-column header (data-sort-col / aria-sort / tabindex / role)
 *  - first-cell of each row as <th scope="row">
 *  - glyph-wrap for "Yes" / "No" / "✓" / "—" cells (DS-10 #4)
 *  - plain escape for non-glyph cells
 */
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import EditorialTable from "../EditorialTable.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import { minimalTable } from "../../../lib/__tests__/fixtures/editorial";

async function renderAstro(table: { columns: string[]; rows: string[][] }): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(EditorialTable, { props: { table } });
}

describe("EditorialTable.astro ↔ editorial-pages.ts parity", () => {
  it("minimal table (no glyphs)", async () => {
    const tsHtml = __TEST__.renderTable(minimalTable);
    const astroHtml = await renderAstro(minimalTable);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsHtml));
  });

  it("table with glyph cells (Yes / No / ✓ / —)", async () => {
    const table = {
      columns: ["Feature", "Plan A", "Plan B"],
      rows: [
        ["Read range", "Yes", "No"],
        ["NFC support", "✓", "—"],
        ["Custom artwork", "N/A", "Yes"],
      ],
    };
    const tsHtml = __TEST__.renderTable(table);
    const astroHtml = await renderAstro(table);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsHtml));
  });

  it("HTML-significant chars in headers (escape parity)", async () => {
    const table = {
      columns: ['Chip "family"', "Memory & cost"],
      rows: [
        ["NTAG215", "504 B / $0.18"],
      ],
    };
    const tsHtml = __TEST__.renderTable(table);
    const astroHtml = await renderAstro(table);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsHtml));
  });

  it("HTML-significant chars in body cells", async () => {
    const table = {
      columns: ["Chip", "Notes"],
      rows: [
        ["NTAG213", 'Tom & Co. "preferred" supplier'],
        ["NTAG215", "Use with <reader spec>"],
      ],
    };
    const tsHtml = __TEST__.renderTable(table);
    const astroHtml = await renderAstro(table);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsHtml));
  });
});
