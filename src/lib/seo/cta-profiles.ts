/**
 * Inquiry CTA profile resolvers for product / collection pages.
 *
 * Maps canonical routes to a curated InquiryCtaProfile (eyebrow,
 * description, brief checklist, contact href). Drives:
 *   - the in-body product CTA card (renderProductCta)
 *   - the collection support block (resolveCollectionCtaProfile)
 *
 * Profiles are essentially hardcoded configuration tables; renderProductCta
 * is the only function here that emits HTML.
 *
 * Extracted from seo.ts during the P4c split (2026-05-08).
 */
import type { InquiryCtaProfile } from "../seo";
import type { PageContext } from "./types";

import { absoluteUrl, escapeXml, normalizeRoute } from "./utils";

export function renderProductCta(context: PageContext): string {
  const canonicalPath = normalizeRoute(new URL(context.canonicalUrl).pathname);
  const profile = resolveProductCtaProfile(canonicalPath, context.contentTitle);

  return `<section class="codex-product-cta" aria-label="Fast product inquiry path">
    <div class="codex-product-cta__copy">
      <p class="codex-product-cta__eyebrow">Product inquiry</p>
      <h2>Get pricing, samples, or compatibility help</h2>
      <p>${escapeXml(profile.description)}</p>
    </div>
    <ul class="codex-product-cta__brief">
      ${profile.briefItems.map((item) => `<li>${escapeXml(item)}</li>`).join("")}
    </ul>
    <div class="codex-product-cta__actions">
      <a class="codex-product-cta__primary" href="${escapeXml(profile.href)}">${escapeXml(profile.label)}</a>
    </div>
  </section>`;
}

export function resolveProductCtaProfile(canonicalPath: string, contentTitle: string): InquiryCtaProfile {
  const normalized = canonicalPath.toLowerCase();

  if (/rfid-wristbands-for-hotels/.test(normalized) || /(hotel|room-key|key-card)/.test(normalized)) {
    return {
      href: "/contact/hotel-rfid/",
      label: "Get hotel lock compatibility check",
      description:
        "Use the hotel RFID route when the next step is lock compatibility, sample planning, encoding support or a production quote.",
      briefItems: [
        "Lock, encoder or PMS environment",
        "Card or wristband format, material and encoding need",
        "Sample quantity, property count and target date",
      ],
    };
  }

  if (/(laundry|linen)/.test(normalized)) {
    return {
      href: "/contact/laundry-rfid/",
      label: "Request laundry tag samples",
      description:
        "Use the laundry RFID route when wash durability, attachment method and reader validation matter more than broad catalog browsing.",
      briefItems: [
        "Wash profile, textile type and attachment method",
        "Reader environment, tag form factor and size limit",
        "Sample split, validation site and rollout timing",
      ],
    };
  }

  if (/(wristband|event|coconut-shell)/.test(normalized)) {
    return {
      href: "/contact/event-rfid/",
      label: "Request event RFID quote",
      description:
        "Use the event RFID route when the brief needs to cover gate flow, wristband format, numbering logic and launch timing together.",
      briefItems: [
        "Attendance, gate flow and event format",
        "Band style, chip choice and access logic",
        "Sample deadline, event date and reorder expectations",
      ],
    };
  }

  if (/(reader|scanner|acr122u)/.test(normalized)) {
    return {
      href: "/contact/rfid-readers/",
      label: "Ask for reader recommendation",
      description:
        "Use the reader route when protocol support, SDK requirements and pilot hardware fit are the real buying decision.",
      briefItems: [
        "Chip standards, interface and read-range target",
        "SDK, middleware or software environment",
        "Pilot quantity, accessory needs and integration timing",
      ],
    };
  }

  if (/(windshield|vehicle|headlight|transponder|\bcar\b)/.test(normalized)) {
    return {
      href: "/contact/vehicle-rfid/",
      label: "Request vehicle RFID guidance",
      description:
        "Tell us where the tag mounts (windshield inside, headlight, bumper), your required read range, and whether you need tamper-evident anti-transfer — we'll match the right UHF label.",
      briefItems: [
        "Mounting position and vehicle type",
        "Required read distance and reader setup (portal, handheld)",
        "Pilot fleet size and rollout date",
      ],
    };
  }

  if (/(key-fob|keyfob|fob)/.test(normalized)) {
    return {
      href: "/contact/access-control-keyfobs/",
      label: "Request keyfob quote",
      description:
        "Use the keyfob route when reader compatibility, shell style and branding requirements need to be confirmed in the first reply.",
      briefItems: [
        "Reader compatibility and chip family",
        "Shell style, numbering and logo needs",
        "Sample target, reorder volume and timing",
      ],
    };
  }

  if (/(google-review|review)/.test(normalized)) {
    return {
      href: "/contact/nfc-branding-cards/",
      label: "Request custom review card",
      description:
        "Use the NFC branding route when the real decision is about review flow, placement, phone compatibility and branded rollout.",
      briefItems: [
        "Review flow, redirect or QR logic",
        "Card or stand format and phone behavior",
        "Pilot quantity, locations and rollout date",
      ],
    };
  }

  if (/(business-card|metal-nfc-card|wooden-rfid-card|eco_rfid_card|nfc-ring|nfc-cards?)/.test(normalized)) {
    return {
      href: "/contact/nfc-branding-cards/",
      label: "Request custom NFC card",
      description:
        "Use the NFC branding route when the shortlist depends on material, phone compatibility, encoding workflow and premium finish decisions.",
      briefItems: [
        "Target phones and tap or redirect workflow",
        "Material, finish and personalization needs",
        "Sample quantity, team rollout and timing",
      ],
    };
  }

  if (/(label|sticker|tag)/.test(normalized)) {
    return {
      href: "/contact/rfid-labels-tags/",
      label: /nfc-stickers/.test(normalized) ? "Request NFC sticker quote" : "Request label and tag quote",
      description:
        "Use the labels and tags route when surface, adhesive, read environment and converting details control the buying decision.",
      briefItems: [
        "Mounting surface, adhesive or on-metal need",
        "Chip choice, read environment and print or encoding",
        "Sample rolls, application method and launch date",
      ],
    };
  }

  return {
    href: "/contact/custom-rfid-cards/",
    label: "Get custom RFID card quote",
    description: `Use the card inquiry route when ${contentTitle} is already close to the right fit and the next step is pricing, samples or customization confirmation.`,
    briefItems: [
      "Chip family, protocol or security requirement",
      "Material, print, numbering or encoding needs",
      "Sample quantity, annual volume and target date",
    ],
  };
}

export function resolveCollectionCtaProfile(canonicalPath: string): InquiryCtaProfile {
  const normalized = canonicalPath.toLowerCase();

  if (normalized === "/products/all/") {
    return {
      href: "/contact/",
      label: "Contact the right RFID specialist",
      description:
        "Not sure which product family fits your project? Tell us your application, reader environment, and timeline — we'll point you to the right collection and send matching samples.",
      briefItems: [
        "Your application (hotel, laundry, event, vehicle, etc.)",
        "Installed reader brand or chip preference",
        "Sample quantity and target delivery date",
      ],
      secondaryLinks: [
        { name: "Hotel key card guide", url: absoluteUrl("/solutions/hotel-key-cards/") },
        { name: "Laundry tags guide", url: absoluteUrl("/solutions/rfid-laundry-tags/") },
        { name: "Review card guide", url: absoluteUrl("/solutions/google-review-nfc-card/") },
      ],
    };
  }

  if (/(reader|scanner|acr122u|rfid-readers)/.test(normalized)) {
    return {
      href: "/contact/rfid-readers/",
      label: "Discuss reader requirements",
      description:
        "Tell us your chip type, host OS, and whether you need desktop USB or portable Bluetooth — we'll recommend the right reader and ship a test unit.",
      briefItems: [
        "Chip or tag type you need to read/write",
        "Host OS and SDK language preference",
        "Pilot quantity and integration timeline",
      ],
      secondaryLinks: [
        { name: "Reader and encoding guide", url: absoluteUrl("/solutions/rfid-readers-and-encoding/") },
        { name: "Reader selection guide", url: absoluteUrl("/guides/rfid-reader-writer-selection/") },
        { name: "ACR122U product page", url: absoluteUrl("/product/acr122u/") },
      ],
    };
  }

  if (/(key-fob|keyfob|fob|rfid-keyfobs)/.test(normalized)) {
    return {
      href: "/contact/access-control-keyfobs/",
      label: "Discuss keyfob requirements",
      description:
        "Share your access control reader brand and preferred fob shape — we'll confirm chip compatibility and send samples with your logo engraved.",
      briefItems: [
        "Reader brand and model (e.g. HID, MIFARE, iCLASS)",
        "Fob shape, logo artwork, and numbering range",
        "Pilot quantity and reorder expectations",
      ],
      secondaryLinks: [
        { name: "Keyfob access-control guide", url: absoluteUrl("/solutions/rfid-keyfobs-access-control/") },
        { name: "Keyfob vs card vs wristband", url: absoluteUrl("/compare/keyfob-vs-card-vs-wristband-access-control/") },
        { name: "Hotel RFID access guide", url: absoluteUrl("/solutions/hotel-rfid-access-control/") },
      ],
    };
  }

  if (/(wristband|rfid-wristbands)/.test(normalized)) {
    return {
      href: "/contact/event-rfid/",
      label: "Discuss wristband requirements",
      description:
        "Tell us your event type, expected attendance, and whether guests will be near water — we'll recommend band material, closure style, and chip, then send samples before your deadline.",
      briefItems: [
        "Event type (festival, hotel, waterpark, healthcare)",
        "Band material, closure style, and anti-transfer need",
        "Event date, sample deadline, and production quantity",
      ],
      secondaryLinks: [
        { name: "Event RFID access guide", url: absoluteUrl("/solutions/rfid-event-access-control/") },
        { name: "Hotels vs events vs resorts", url: absoluteUrl("/compare/rfid-wristbands-hotels-vs-events-vs-resorts/") },
        { name: "Silicone vs fabric vs woven", url: absoluteUrl("/compare/silicone-vs-fabric-vs-woven-rfid-wristbands/") },
      ],
    };
  }

  if (/(label|sticker|rfid-labels)/.test(normalized)) {
    return {
      href: "/contact/rfid-labels-tags/",
      label: "Discuss label requirements",
      description:
        "Tell us what surface the label sticks to, whether it needs phone-tap NFC or long-range UHF, and your print artwork — we'll recommend the right inlay and adhesive.",
      briefItems: [
        "Mounting surface (glass, metal, paper, curved)",
        "NFC phone-tap or UHF long-range use case",
        "Label size, print artwork, and roll quantity",
      ],
      secondaryLinks: [
        { name: "Asset-tracking label guide", url: absoluteUrl("/solutions/rfid-asset-tracking-labels/") },
        { name: "On-metal vs standard NFC stickers", url: absoluteUrl("/compare/on-metal-nfc-labels-vs-standard-nfc-stickers/") },
        { name: "Review card vs NFC sticker", url: absoluteUrl("/compare/google-review-nfc-card-vs-nfc-sticker/") },
      ],
    };
  }

  if (/(laundry|linen)/.test(normalized)) {
    return {
      href: "/contact/laundry-rfid/",
      label: "Discuss laundry tag requirements",
      description:
        "Share your wash cycle temperature, textile type, and daily volume — we'll recommend PPS, silicone, or textile tags and ship test samples for your laundry line.",
      briefItems: [
        "Wash temperature and cycle count (e.g. 200+ industrial washes)",
        "Textile type (uniform, linen, towel) and attachment method",
        "Pilot quantity and laundry facility location",
      ],
      secondaryLinks: [
        { name: "Laundry tags guide", url: absoluteUrl("/solutions/rfid-laundry-tags/") },
        { name: "Laundry tag material comparison", url: absoluteUrl("/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/") },
        { name: "HF vs UHF laundry tags", url: absoluteUrl("/compare/uhf-vs-hf-rfid-laundry-tags/") },
      ],
    };
  }

  if (/(windshield|vehicle|headlight|transponder|\bcar\b)/.test(normalized)) {
    return {
      href: "/contact/vehicle-rfid/",
      label: "Request vehicle RFID guidance",
      description:
        "Tell us where the tag mounts (windshield inside, headlight, bumper), your required read range, and whether you need tamper-evident anti-transfer — we'll match the right UHF label.",
      briefItems: [
        "Mounting position and vehicle type",
        "Required read distance and reader setup (portal, handheld)",
        "Pilot fleet size and rollout date",
      ],
      secondaryLinks: [
        { name: "Vehicle RFID guide", url: absoluteUrl("/solutions/vehicle-rfid-identification/") },
        { name: "Asset-tracking HF vs UHF", url: absoluteUrl("/compare/hf-vs-uhf-rfid-for-asset-tracking/") },
        { name: "RFID labels collection", url: absoluteUrl("/products/rfid-labels/") },
      ],
    };
  }

  if (/(tag|rfid-tags)/.test(normalized)) {
    return {
      href: "/contact/rfid-labels-tags/",
      label: "Discuss RFID tag requirements",
      description:
        "Share what you're tagging (garments, vehicles, assets), the operating environment, and your read distance — we'll recommend HF or UHF tags and send samples.",
      briefItems: [
        "Tagged item and mounting method (sew, stick, bolt)",
        "Operating environment (wash, outdoor UV, heat)",
        "Pilot quantity and target read distance",
      ],
      secondaryLinks: [
        { name: "Laundry tags guide", url: absoluteUrl("/solutions/rfid-laundry-tags/") },
        { name: "Vehicle RFID guide", url: absoluteUrl("/solutions/vehicle-rfid-identification/") },
        { name: "HF vs UHF for asset tracking", url: absoluteUrl("/compare/hf-vs-uhf-rfid-for-asset-tracking/") },
      ],
    };
  }

  return {
    href: "/contact/custom-rfid-cards/",
    label: "Discuss RFID card requirements",
    description:
      "Tell us your lock brand, chip preference, and quantity — we'll recommend the right card format, confirm print and encoding options, and send samples.",
    briefItems: [
      "Lock or reader brand and chip family",
      "Card material, print artwork, and encoding specs",
      "Sample quantity and production timeline",
    ],
    secondaryLinks: [
      { name: "Hotel key card guide", url: absoluteUrl("/solutions/hotel-key-cards/") },
      { name: "NFC business card guide", url: absoluteUrl("/solutions/nfc-business-card/") },
      { name: "MIFARE hotel lock comparison", url: absoluteUrl("/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/") },
    ],
  };
}

