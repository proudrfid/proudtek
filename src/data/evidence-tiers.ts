/**
 * Evidence tiers — the single vocabulary for "how do we know this?" labels on
 * proudtek.com.
 *
 * Introduced 2026-09-05 after the external answer-engine diagnosis: a number
 * without scope, condition and source is "false precision", and an answer
 * engine will quote it as a guarantee. Every evidence card, the homepage
 * evidence strip and the legend on /about/methodology/ use these ids.
 */
export const EVIDENCE_TIERS = {
  OFFICIAL_STANDARD: {
    label: "Official standard",
    gloss: "Taken from an ISO/IEC, GS1, NFC Forum or regulatory text; the standard is linked.",
  },
  CHIP_VENDOR_DATASHEET: {
    label: "Chip-vendor datasheet",
    gloss: "A chip-level value from the vendor's datasheet; finished-product performance can differ.",
  },
  THIRD_PARTY_TEST: {
    label: "Third-party certificate or test",
    gloss: "Issued by an external registrar or laboratory; number and scope are published.",
  },
  PROUD_TEK_INTERNAL_TEST: {
    label: "Proud Tek internal test",
    gloss: "Measured by Proud Tek under the protocol on /about/methodology/; not independently audited.",
  },
  PROUD_TEK_SELF_REPORTED: {
    label: "Company-stated",
    gloss: "Our own operational statement; verify by document request, visit or audit.",
  },
  COMMERCIAL_POLICY: {
    label: "Commercial policy",
    gloss: "How we currently do business; confirmed in writing in every quotation.",
  },
  GENERAL_EXPLANATION: {
    label: "General explanation",
    gloss: "Background on how the technology works; not a claim about a Proud Tek product.",
  },
  UNSUPPORTED: {
    label: "Unsupported",
    gloss: "No evidence on file; treat as a question to ask us, not a fact.",
  },
} as const;

export type EvidenceTier = keyof typeof EVIDENCE_TIERS;

export const EVIDENCE_TIER_IDS = Object.keys(EVIDENCE_TIERS) as EvidenceTier[];
