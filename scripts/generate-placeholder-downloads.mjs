/**
 * Generates branded placeholder PDFs + XLSX for /resources/downloads/ links.
 *
 * Why: the Resource Center editorial page links to 12 files under
 * /downloads/. Until the real datasheets / templates are produced by
 * the Proud Tek team, this script writes lightweight placeholders so
 * the links resolve (rather than 404) during a buyer's evaluation.
 *
 * Each PDF is a single page that names the asset, gives a short
 * one-paragraph description, and points the reader at the appropriate
 * contact path. The XLSX is a minimal SGTIN-96 worksheet.
 *
 * Run from repo root after `npm install`:
 *   node scripts/generate-placeholder-downloads.mjs
 *
 * Idempotent — overwrites existing placeholders.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public", "downloads");

await fs.mkdir(out, { recursive: true });

/**
 * Minimal valid PDF builder (single page, A4, plain text).
 * Pure string output — no external deps.
 */
function buildPdf(title, body) {
  // PDF spec: A4 = 595 x 842 pt
  // Build content stream with line-wrapping
  const lines = body.split("\n");
  const escape = (s) => s.replace(/[\\()]/g, "\\$&");

  let content = `BT
/F1 18 Tf
50 780 Td
(${escape(title)}) Tj
0 -28 Td
/F1 11 Tf
`;
  for (const line of lines) {
    // Word-wrap at ~70 chars
    let buf = line;
    while (buf.length > 0) {
      let take = buf.length > 78 ? buf.slice(0, 78).lastIndexOf(" ") : buf.length;
      if (take <= 0) take = buf.length;
      const seg = buf.slice(0, take).trim();
      content += `(${escape(seg)}) Tj\n0 -14 Td\n`;
      buf = buf.slice(take).trim();
    }
    content += `0 -6 Td\n`;
  }
  content += `ET`;

  const objects = [
    "<</Type/Catalog/Pages 2 0 R>>",
    "<</Type/Pages/Kids[3 0 R]/Count 1>>",
    "<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>",
    "<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>",
    `<</Length ${content.length}>>\nstream\n${content}\nendstream`,
  ];

  let body2 = "%PDF-1.4\n";
  const xref = [];
  for (let i = 0; i < objects.length; i++) {
    xref.push(body2.length);
    body2 += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefStart = body2.length;
  body2 += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const x of xref) body2 += `${String(x).padStart(10, "0")} 00000 n \n`;
  body2 += `trailer\n<</Size ${objects.length + 1}/Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(body2, "binary");
}

/**
 * Minimal SGTIN-96 XLSX with a header row and a couple example rows.
 * We hand-build the zip without external deps using a tiny zip writer.
 */
function buildXlsxSgtin() {
  const rows = [
    ["company_prefix", "item_reference", "serial_start", "serial_count", "epc_hex_first", "notes"],
    ["0614141", "12345", "1", "10000", "30 74 26 0F 00 00 30 39 00 00 00 01", "Example NTAG215 batch 1"],
    ["0614141", "12345", "10001", "5000", "30 74 26 0F 00 00 30 39 00 00 27 11", "Example NTAG215 batch 2"],
  ];
  // Build minimal XLSX (Office Open XML) — Sheet1 with above rows.
  const sheetXml =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>${rows
      .map(
        (r, ri) =>
          `<row r="${ri + 1}">${r
            .map((c, ci) => `<c r="${String.fromCharCode(65 + ci)}${ri + 1}" t="inlineStr"><is><t>${String(c).replace(/[<>&]/g, (m) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[m])}</t></is></c>`)
            .join("")}</row>`,
      )
      .join("")}</sheetData>
</worksheet>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="SGTIN-96" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;

  // Minimal zip writer (no compression — stored entries)
  const entries = [
    { name: "[Content_Types].xml", content: contentTypes },
    { name: "_rels/.rels", content: rootRels },
    { name: "xl/_rels/workbook.xml.rels", content: workbookRels },
    { name: "xl/workbook.xml", content: workbookXml },
    { name: "xl/worksheets/sheet1.xml", content: sheetXml },
  ];

  // CRC32 implementation
  const crcTable = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[i] = c >>> 0;
    }
    return t;
  })();
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xff];
    return (c ^ 0xffffffff) >>> 0;
  }

  const localChunks = [];
  const centralChunks = [];
  let offset = 0;

  for (const e of entries) {
    const data = Buffer.from(e.content, "utf8");
    const name = Buffer.from(e.name, "utf8");
    const crc = crc32(data);
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(data.length, 18);
    localHeader.writeUInt32LE(data.length, 22);
    localHeader.writeUInt16LE(name.length, 26);
    localHeader.writeUInt16LE(0, 28);
    localChunks.push(localHeader, name, data);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(data.length, 20);
    centralHeader.writeUInt32LE(data.length, 24);
    centralHeader.writeUInt16LE(name.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    centralChunks.push(centralHeader, name);
    offset += localHeader.length + name.length + data.length;
  }

  const central = Buffer.concat(centralChunks);
  const centralOffset = offset;
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(central.length, 12);
  eocd.writeUInt32LE(centralOffset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localChunks, central, eocd]);
}

const FILES = [
  {
    name: "em4100-em4305-t5577-reference.pdf",
    title: "EM4100 / EM4305 / T5577 — LF Reference Card",
    body: `LF 125 kHz chip family reference for Proud Tek buyers.

EM4100: factory-burned 40-bit UID, read-only, $0.08-$0.15 / card at 50k MOQ.
EM4305: 512-bit rewritable EEPROM, password-protectable.
T5577: 330-bit rewritable EEPROM, configurable to emulate EM4100, HID Prox,
       Indala, Pyramid, AWID. Industry standard for commodity cloning tools.

Compatibility: all 125 kHz ASK Manchester readers. Cannot be read by smartphones.

For the complete comparison page see /compare/em4100-vs-t5577/.
For sample requests see /sample-pack/.

This is a Proud Tek placeholder reference; the full datasheet is available on
written request to info@proudtek.com under NDA where required.

Last reviewed: 2026-05-13. Proud Tek Co., Limited.`,
  },
  {
    name: "mifare-classic-plus-desfire-reference.pdf",
    title: "MIFARE Classic / Plus / DESFire EV3 — HF Reference Card",
    body: `HF 13.56 MHz secure-credential reference for Proud Tek buyers.

MIFARE Classic 1K: 1KB EEPROM, Crypto-1 (broken since 2008). Legacy hotel
                    + access. $0.20-$0.30 / card.
MIFARE Plus EV2 SL3: AES-128 mutual authentication, drop-in upgrade from
                     Classic on most reader fleets.
MIFARE DESFire EV3:  AES-128 + ISO 7816-4 filesystem, CC EAL 5+. Current
                     gold standard for enterprise and government access.
                     $0.40-$0.80 / card.

For the chip-selection page see /compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/.
For DESFire vs Plus EV2 specifically see /compare/mifare-plus-ev2-vs-desfire-ev3/.

Last reviewed: 2026-05-13. Proud Tek Co., Limited.`,
  },
  {
    name: "ntag213-215-216-reference.pdf",
    title: "NTAG 213 / 215 / 216 — NFC Marketing Card Reference",
    body: `NFC Forum Type 2 chip family — read by every iPhone since iOS 13 and
every NFC-enabled Android since Android 4.4.

NTAG213: 144 bytes user memory. Sufficient for a short URL.
NTAG215: 504 bytes user memory. Workhorse for marketing cards.
NTAG216: 888 bytes user memory. Use when the NDEF payload exceeds 500 bytes.

Use cases: Google Review NFC cards, NFC business cards, marketing tap cards,
event credentials, loyalty.

For the comparison page see /compare/ntag213-vs-ntag215-vs-ntag216/.
For Google Review NFC card programmes see /solutions/google-review-nfc-card/.

Last reviewed: 2026-05-13. Proud Tek Co., Limited.`,
  },
  {
    name: "ntag424-dna-reference.pdf",
    title: "NTAG 424 DNA + SDM — Authenticated NFC Reference",
    body: `NTAG 424 DNA adds AES-128 cryptographic authentication to the NTAG family.
SDM (Secure Dynamic Messaging) lets each tap produce a cryptographically
unique URL — anti-clone, anti-counterfeit, suitable for luxury brand
authentication, NFC business cards with verified identity, and tamper-evident
labels.

Memory: 256 bytes user memory.
Authentication: AES-128 originality signature + SDM dynamic URL.
Apple Wallet / Google Wallet: supported via NDEF Type 4.

For the brand-authentication use case see /solutions/nfc-luxury-authentication/.
For the digital product passport use case see /solutions/digital-product-passport/.

Last reviewed: 2026-05-13. Proud Tek Co., Limited.`,
  },
  {
    name: "uhf-rain-monza-ucode-higgs-reference.pdf",
    title: "UHF RAIN — Monza / UCODE / Higgs Reference",
    body: `UHF RAIN (860-960 MHz) chip family reference for retail apparel,
industrial laundry, logistics, events, and pharmaceutical traceability.

Impinj Monza R6-P: Autotune-enabled. Apparel source-tagging standard.
NXP UCODE 8 / 9:    Pharmaceutical, industrial laundry, supply chain.
Alien Higgs-9:      Outdoor, high-temperature, long-range scenarios.

Read range: 1-10 m typical at a portal; up to 15 m with high-power readers.
Encoding: GS1 EPC Tag Data Standard 2.0 SGTIN-96 most common.

For the chip comparison page see /compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9/.
For EPC encoding template see /downloads/gs1-sgtin-96-encoding-template.xlsx.

Last reviewed: 2026-05-13. Proud Tek Co., Limited.`,
  },
  {
    name: "hotel-key-card-artwork-template.pdf",
    title: "Hotel Key Card Artwork Template (85 × 54 mm)",
    body: `Bleed-safe CMYK artwork template for hotel key cards.

Card dimensions: 85.6 × 53.98 mm (ISO/IEC 7810 ID-1).
Bleed: 3 mm on all sides. Safe-zone: 5 mm from cut edge.
Antenna keep-out zone: 12-mm-wide vertical band centred on the short axis.
                       Do not place dense ink, foil, or thick laminate in this band.

Magnetic stripe omit: most modern hotel key card programmes no longer use
magnetic stripes. Confirm with your lock-platform supplier before specifying.

For the artwork checklist see /guides/hotel-key-card-artwork-and-printing-checklist/.

This is a placeholder — the editable AI / PSD source template is sent on
request from your Proud Tek account manager.

Last reviewed: 2026-05-13. Proud Tek Co., Limited.`,
  },
  {
    name: "apparel-hang-tag-inlay-placement.pdf",
    title: "Apparel Hang-Tag UHF Inlay Placement",
    body: `Inlay placement guide for apparel hang tags with Impinj Monza R6-P
or NXP UCODE 9 UHF inlays.

Hang-tag size: 80 × 50 mm typical.
Antenna footprint: 64 × 12 mm strip with Monza R6-P; varies with UCODE 9.
                   Keep printed text and adhesive labels out of this strip.
Mounting: face-stock side, top of the tag. Avoid metal seam grommet
          placement that overlaps the antenna.

For the retail apparel case study see /case-studies/retail-apparel-uhf-rfid-source-tagging/.
For the GS1 SGTIN-96 encoding template see the same downloads page.

Last reviewed: 2026-05-13. Proud Tek Co., Limited.`,
  },
  {
    name: "ndef-record-cheatsheet.pdf",
    title: "NDEF Record Cheatsheet",
    body: `NDEF (NFC Data Exchange Format) record-type quick reference.

URI record (T = 0x55): UTF-8 URI with prefix byte. Most common for marketing
                        and Google Review tap cards.
Text record (T = 0x54): UTF-8 text with language code. Use for vCard
                        substitute or short identifier.
Smart Poster record:   Composite record combining URI + text + icon.
Launch app record:     Android-only AAR; iOS uses universal-link URLs.

Byte budget per chip:
  NTAG213: 144 bytes user memory; 132 bytes payload after NDEF framing.
  NTAG215: 504 bytes user memory; 492 bytes payload after NDEF framing.
  NTAG216: 888 bytes user memory; 868 bytes payload after NDEF framing.

For the Google Review NFC card setup see /guides/google-review-nfc-card-setup/.

Last reviewed: 2026-05-13. Proud Tek Co., Limited.`,
  },
  {
    name: "dscsa-item-level-rfid-brief.pdf",
    title: "DSCSA Item-Level RFID Compliance Brief",
    body: `Drug Supply Chain Security Act (DSCSA) item-level RFID implementation
brief for US specialty-pharmacy distributors.

Regulatory anchor: 21 U.S.C. Section 360eee-1 (Drug Supply Chain Security).
Enforcement: FDA Section 582 stabilisation period ended November 2024.
Data carrier: 2-D Data Matrix barcode or RFID. UHF RAIN with SGTIN-96 EPC
              is the high-throughput option.
Verification: GS1 EPCIS Lightweight Verification Service over HTTPS.
              SLA: manufacturer must respond within 24 hours; FDA expects
              99% verification success.

For the pharmaceutical case study see /case-studies/pharmaceutical-dscsa-uhf-rfid/.
For the GS1 encoding guide see /guides/gs1-epc-encoding-guide/.

Last reviewed: 2026-05-13. Proud Tek Co., Limited.`,
  },
  {
    name: "eu-dpp-espr-implementation-brief.pdf",
    title: "EU Digital Product Passport (ESPR) Implementation Brief",
    body: `EU Digital Product Passport (DPP) under the Ecodesign for Sustainable
Products Regulation (ESPR, EU 2024/1781) — implementation brief.

Scope: phased enforcement starting 2027 for textiles, batteries, electronics,
       construction, furniture and toys.
Data carrier: NFC Forum Type 4 (NTAG424 DNA recommended for cryptographic
              originality), QR code with linked URL, or both.
Required payload: unique product identifier, environmental footprint,
                  recyclability information, supply-chain attribution.

For the digital product passport solution overview see /solutions/digital-product-passport/.

Last reviewed: 2026-05-13. Proud Tek Co., Limited.`,
  },
  {
    name: "proudtek-sample-pack-request-brief.pdf",
    title: "Proud Tek Sample-Pack Request Brief (1 page)",
    body: `Five fields, one paragraph project brief, one-day reply.

What a procurement team should include in a sample-pack request to get
the most relevant 8-12 SKUs in a Proud Tek sample pack:

  1. Industry — hospitality, laundry, retail, events, library, pharma,
                 logistics, brand-protection, etc.
  2. Frequency band — LF 125 kHz, HF 13.56 MHz, UHF 860-960 MHz, multi-band.
  3. Quantity tier — pilot, 5-50k, 50-250k, 250k-1M, 1M+.
  4. Form factor — card, keyfob, label / inlay, wristband, tag.
  5. Launch window — calendar quarter or weeks-from-PO.

For the sample-pack request form see /sample-pack/.
For the RFQ wizard see /rfq/.

Last reviewed: 2026-05-13. Proud Tek Co., Limited.`,
  },
];

let count = 0;
for (const f of FILES) {
  const buf = buildPdf(f.title, f.body);
  await fs.writeFile(path.join(out, f.name), buf);
  count++;
}

// XLSX
await fs.writeFile(path.join(out, "gs1-sgtin-96-encoding-template.xlsx"), buildXlsxSgtin());
count++;

console.log(`Wrote ${count} placeholder downloads to ${out}`);
