import { describe, expect, it } from "vitest";
import { truncateText } from "../seo/utils";

/**
 * Sentence/clause-aware truncation (2026-07-02).
 *
 * Meta descriptions are `truncateText(summary, 155)` (page-data.ts). Before
 * this change the cut always landed on the last word boundary, which left
 * 204/315 commercial pages ending mid-clause in SERP/AI snippets. The
 * function now prefers, in order: a sentence end in the back half of the
 * budget (no ellipsis — complete thought), a clause boundary (ellipsised),
 * then the legacy word-boundary fallback.
 */
describe("truncateText", () => {
  it("returns short values unchanged", () => {
    expect(truncateText("Short value.", 155)).toBe("Short value.");
  });

  it("ends on a sentence boundary when one lands in the back half of the budget", () => {
    const first = "Procurement-grade guide to RFID laundry tags for industrial linen programmes covering PPS, silicone and textile formats.";
    const value = `${first} It then maps chip choice, wash-cycle survival and fitting method to each laundry environment in detail.`;
    expect(truncateText(value, 155)).toBe(first);
  });

  it("keeps no ellipsis after a complete sentence", () => {
    const first = "NTAG213 stores 144 bytes of user memory and reads on any NFC phone.";
    const value = `${first} The rest of this page walks through the antenna sizes, lamination stacks and encoding options available at volume.`;
    expect(truncateText(value, 120)).toBe(first);
  });

  it("falls back to a clause boundary with ellipsis when no sentence fits", () => {
    const value =
      "Waterproof UHF RFID outdoor tag guide mapping IP68 and IP69K survival, corrosion posture on ISO 9227 salt-spray schedules, UV exposure classes and mounting substrates for coastal infrastructure";
    const out = truncateText(value, 155);
    expect(out.endsWith("...")).toBe(true);
    // Cut lands on the "ISO 9227 salt-spray schedules" clause comma, not mid-word.
    expect(out).toBe(
      "Waterproof UHF RFID outdoor tag guide mapping IP68 and IP69K survival, corrosion posture on ISO 9227 salt-spray schedules...",
    );
  });

  it("keeps legacy word-boundary behaviour for boundary-free strings", () => {
    const value = `${"A".repeat(80)} ${"B".repeat(120)}`;
    const out = truncateText(value, 155);
    expect(out).toBe(`${"A".repeat(80)}...`);
  });

  it("never exceeds maxLength", () => {
    const value =
      "First clause of a very long opening sentence that keeps going without any terminal punctuation, then a comma, and still more words after that point to overflow the budget comfortably";
    for (const max of [80, 120, 155, 240]) {
      expect(truncateText(value, max).length).toBeLessThanOrEqual(max);
    }
  });
});
