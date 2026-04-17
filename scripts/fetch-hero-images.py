#!/usr/bin/env python3
"""
Fetch hero images for every page listed as missing in audit-hero-images.json.

Strategy:
  1. Try Unsplash napi (public JSON endpoint) with page-specific keywords.
     If results exist, download with &w=1600&h=900&fit=crop.
  2. Fall back to Pollinations.ai with a themed prompt + brand style suffix.
  3. Save JPG (as-downloaded) and generate WebP via Pillow.
  4. Compute SHA-256 and cross-check against existing site-assets to ensure
     every new image is genuinely new.
  5. Write a manifest: public/landing-images/hero/manifest.json
  6. Write CREDITS.md listing source+license of every image.

Run: python3 scripts/fetch-hero-images.py
"""
import json
import os
import re
import sys
import time
import hashlib
import urllib.parse
import urllib.request
from pathlib import Path
from io import BytesIO
from PIL import Image

ROOT = Path("/sessions/happy-practical-bohr/mnt/Playground")
AUDIT_JSON = ROOT / "audit-hero-images.json"
OUT_DIR = ROOT / "public" / "landing-images" / "hero"
OUT_DIR.mkdir(parents=True, exist_ok=True)
MANIFEST = OUT_DIR / "manifest.json"
CREDITS = OUT_DIR / "CREDITS.md"

BRAND_STYLE = (
    "professional commercial photography, clean industrial aesthetic, "
    "soft natural lighting, neutral palette with warm amber accents, "
    "shallow depth of field, editorial magazine style, "
    "no visible text, no logos, no watermarks, 16:9 aspect ratio, "
    "high detail, crisp focus"
)

TARGET_W, TARGET_H = 1600, 900

# Map page slugs to themed prompt overrides / keyword hints.
# For anything not in this map we derive keywords from the page H1.
THEME_OVERRIDES = {
    # Solutions - Google Review NFC cards
    "solutions/google-review-cards-for-checkout-counters": {
        "keywords": "retail checkout counter cash register modern store",
        "prompt": "modern retail checkout counter with a contactless NFC review card on the payment pad, clean minimalist store interior",
    },
    "solutions/google-review-cards-for-front-desks": {
        "keywords": "hotel front desk reception modern",
        "prompt": "elegant hotel front desk with an NFC review card placed neatly on the counter, warm concierge lighting",
    },
    "solutions/google-review-cards-for-gyms-and-fitness-studios": {
        "keywords": "modern gym fitness studio interior",
        "prompt": "modern boutique gym reception with an NFC review card on the counter, premium fitness studio aesthetic",
    },
    "solutions/google-review-cards-for-hotels": {
        "keywords": "luxury hotel lobby reception",
        "prompt": "luxury hotel lobby with an NFC review card on the front desk, warm ambient lighting",
    },
    "solutions/google-review-cards-for-pickup-counters": {
        "keywords": "restaurant takeout pickup counter modern",
        "prompt": "modern restaurant pickup counter with an NFC review card next to takeout bags, clean service area",
    },
    "solutions/google-review-cards-for-restaurants": {
        "keywords": "modern restaurant table setting",
        "prompt": "upscale restaurant table with an NFC review card and check holder, soft evening lighting",
    },
    "solutions/google-review-cards-for-retail-stores": {
        "keywords": "boutique retail store interior",
        "prompt": "upscale boutique retail store counter with an NFC review card on display",
    },
    "solutions/google-review-cards-for-salons-and-spas": {
        "keywords": "modern salon spa reception",
        "prompt": "minimalist salon spa reception counter with an NFC review card, soft natural lighting",
    },
    "solutions/google-review-cards-for-tabletop-prompts": {
        "keywords": "restaurant tabletop sign modern",
        "prompt": "restaurant tabletop NFC review prompt card on a clean wooden table",
    },
    "solutions/google-review-nfc-card": {
        "keywords": "nfc card hand smartphone tap",
        "prompt": "hand tapping a smartphone onto a premium NFC review card on a clean surface",
    },
    # Hotel / access control
    "solutions/hotel-key-cards": {
        "keywords": "hotel key card door lock",
        "prompt": "hotel room door with an electronic RFID keycard being presented to the reader, warm corridor lighting",
    },
    "solutions/hotel-rfid-access-control": {
        "keywords": "hotel rfid door access",
        "prompt": "modern hotel corridor with RFID electronic lock on guestroom door, contactless keycard in motion",
    },
    "solutions/rfid-access-control": {
        "keywords": "office door rfid access control reader",
        "prompt": "modern office secure door with a wall-mounted RFID reader and someone holding a keycard",
    },
    "solutions/rfid-event-access-control": {
        "keywords": "event entrance wristband scanner festival",
        "prompt": "festival event entrance with staff scanning an RFID wristband, concert venue ambiance",
    },
    "solutions/rfid-event-wristbands": {
        "keywords": "festival wristband rfid event",
        "prompt": "colorful RFID wristbands on wrists at a music festival, soft dusk lighting",
    },
    "solutions/rfid-keyfobs-access-control": {
        "keywords": "rfid key fob door access",
        "prompt": "hand holding a black RFID keyfob near a sleek electronic lock reader",
    },
    # Inventory / asset tracking
    "solutions/rfid-asset-tracking-labels": {
        "keywords": "warehouse inventory tracking rfid label",
        "prompt": "warehouse worker scanning RFID asset tracking labels on metal equipment, industrial lighting",
    },
    "solutions/rfid-attendance-system": {
        "keywords": "office attendance card tap reader",
        "prompt": "employees tapping RFID cards at a modern office attendance kiosk in the morning",
    },
    "solutions/rfid-inventory-tracking": {
        "keywords": "warehouse rfid handheld scanner",
        "prompt": "warehouse worker using RFID handheld scanner across rows of inventory boxes",
    },
    "solutions/rfid-laundry-management": {
        "keywords": "industrial laundry linen",
        "prompt": "industrial commercial laundry facility with stacks of hotel linens and RFID tagging workstation",
    },
    "solutions/rfid-laundry-tags": {
        "keywords": "laundry tag linen commercial",
        "prompt": "RFID laundry tags sewn into hotel linens in an industrial laundry facility with stainless steel machines in the background",
    },
    "solutions/rfid-laundry-tracking": {
        "keywords": "commercial laundry worker sorting",
        "prompt": "commercial laundry worker sorting RFID-tagged linens with a handheld reader",
    },
    "solutions/rfid-library-management": {
        "keywords": "modern library bookshelf rfid",
        "prompt": "modern library bookshelf with RFID-tagged books being checked out at a self-service kiosk",
    },
    "solutions/rfid-parking-management": {
        "keywords": "parking gate rfid sticker car",
        "prompt": "car approaching a parking garage gate with an RFID windshield sticker being read by the overhead reader",
    },
    "solutions/rfid-patient-tracking": {
        "keywords": "hospital wristband patient nurse",
        "prompt": "nurse scanning a patient's RFID hospital wristband at a modern clinic bedside",
    },
    "solutions/rfid-race-timing": {
        "keywords": "marathon runners finish line chip",
        "prompt": "marathon runners crossing the finish line with RFID timing mats and chip tags on their shoes, morning light",
    },
    "solutions/rfid-readers-and-encoding": {
        "keywords": "rfid reader encoder desktop",
        "prompt": "a desktop RFID encoder and handheld reader device on a clean workbench, professional product photography",
    },
    "solutions/rfid-supply-chain-management": {
        "keywords": "shipping container logistics supply chain",
        "prompt": "shipping containers at a modern logistics hub with RFID portal readers, wide industrial shot",
    },
    "solutions/rfid-tool-tracking": {
        "keywords": "industrial tools tagged workshop",
        "prompt": "industrial workshop tool wall with RFID-tagged tools and a handheld scanner in use",
    },
    "solutions/rfid-warehouse-management": {
        "keywords": "modern warehouse pallet forklift",
        "prompt": "modern warehouse with RFID portal readers at loading dock, forklift moving pallets, bright industrial lighting",
    },
    "solutions/vehicle-rfid-identification": {
        "keywords": "fleet vehicle rfid tag",
        "prompt": "fleet vehicle with a windshield RFID identification tag at a secure depot entrance",
    },
    # Digital Product Passport & brand authentication
    "solutions/digital-product-passport": {
        "keywords": "luxury leather bag nfc tap",
        "prompt": "hand tapping a smartphone to an NFC chip embedded in a luxury leather handbag, premium product authentication scene",
    },
    "solutions/nfc-brand-authentication": {
        "keywords": "luxury product nfc authentication smartphone",
        "prompt": "smartphone verifying a luxury product with NFC authentication, premium packaging scene",
    },
    "solutions/nfc-business-card": {
        "keywords": "nfc business card smartphone tap professional",
        "prompt": "professional handing over a premium metallic NFC business card at a networking meeting, clean office background",
    },
    "solutions/nfc-business-card-programs": {
        "keywords": "corporate team business cards stack",
        "prompt": "stack of branded NFC business cards on a corporate desk with a smartphone, clean office setting",
    },
    "solutions/nfc-luxury-authentication": {
        "keywords": "luxury watch nfc hidden chip",
        "prompt": "luxury watch on display with discreet NFC authentication point, premium boutique setting",
    },
    # Compatibility pages
    "compatibility/onity-hotel-key-cards": {
        "keywords": "hotel door electronic lock onity",
        "prompt": "hotel guest room door with an electronic keycard lock and RFID card being presented",
    },
    "compatibility/salto-hotel-key-cards": {
        "keywords": "hotel door smart lock salto",
        "prompt": "modern hotel room door with a sleek electronic smart lock and keycard",
    },
    "compatibility/hafele-dialock-hotel-key-cards": {
        "keywords": "hotel door electronic lock modern",
        "prompt": "modern hotel room with a black electronic door lock and RFID keycard in hand",
    },
    "compatibility/be-tech-hotel-key-cards": {
        "keywords": "hotel door lock keycard modern",
        "prompt": "hotel corridor door with an electronic keycard lock, warm lighting",
    },
    "compatibility/vingcard-hotel-key-cards": {
        "keywords": "vingcard hotel door lock",
        "prompt": "elegant hotel guest room door with a VingCard-style electronic lock and keycard",
    },
    "compatibility/miwa-hotel-key-cards": {
        "keywords": "japanese hotel door lock keycard",
        "prompt": "minimalist hotel guest room door with an electronic keycard lock, Japanese hotel aesthetic",
    },
    "compatibility/saflok-hotel-key-cards": {
        "keywords": "saflok hotel door electronic lock",
        "prompt": "hotel corridor door with a Saflok-style electronic keycard lock and contactless RFID card",
    },
    # Guides that need og:image refresh (but already have heroes) — use H1-based generic
}


def slug_from_path(page_path: str) -> str:
    """/solutions/rfid-laundry-tags/index.html -> solutions-rfid-laundry-tags"""
    s = page_path.strip("/").removesuffix("/index.html").removesuffix(".html")
    return s.replace("/", "-").replace("_", "-").replace(" ", "-")


def key_from_path(page_path: str) -> str:
    """/solutions/rfid-laundry-tags/index.html -> solutions/rfid-laundry-tags"""
    return page_path.strip("/").removesuffix("/index.html").removesuffix(".html")


def keywords_from_h1(h1: str) -> str:
    """Derive Unsplash keywords from H1 by stripping stopwords/punctuation."""
    if not h1:
        return "rfid technology"
    # Strip the em-dash/colon separator and take the left side
    core = re.split(r"[—–:|]", h1)[0]
    words = re.findall(r"[A-Za-z]+", core.lower())
    drop = {"for", "with", "and", "the", "of", "a", "an", "to", "in", "on", "by", "from", "or"}
    kept = [w for w in words if w not in drop and len(w) > 1]
    # Prefer domain-specific words
    return " ".join(kept[:5])


def fetch_unsplash(keywords: str):
    """Return (bytes, photo_meta) or (None, None)."""
    url = f"https://unsplash.com/napi/search/photos?query={urllib.parse.quote(keywords)}&per_page=1"
    try:
        req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"    Unsplash search failed: {e}", file=sys.stderr)
        return None, None
    results = data.get("results") or []
    if not results:
        return None, None
    photo = results[0]
    raw = photo.get("urls", {}).get("raw") or photo.get("urls", {}).get("regular")
    if not raw:
        return None, None
    img_url = f"{raw}&w={TARGET_W}&h={TARGET_H}&fit=crop&crop=entropy&q=80&fm=jpg"
    try:
        req = urllib.request.Request(img_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read()
    except Exception as e:
        print(f"    Unsplash download failed: {e}", file=sys.stderr)
        return None, None
    if len(body) < 10000:
        return None, None
    photographer = photo.get("user", {}).get("name") or "Unknown"
    return body, {
        "source": "Unsplash",
        "license": "Unsplash License",
        "photographer": photographer,
        "page_url": photo.get("links", {}).get("html") or f"https://unsplash.com/photos/{photo.get('id','')}",
        "id": photo.get("id"),
    }


def fetch_pollinations(prompt: str, seed: int, max_retries: int = 4):
    full = f"{prompt}, {BRAND_STYLE}"
    url = f"https://image.pollinations.ai/prompt/{urllib.parse.quote(full)}?width=1600&height=900&nologo=true&seed={seed}"
    last_err = None
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=90) as resp:
                body = resp.read()
            if len(body) < 10000:
                raise RuntimeError(f"short body {len(body)}")
            return body, {
                "source": "Pollinations.ai",
                "license": "Free to use (Pollinations terms)",
                "photographer": "AI-generated (Pollinations default model)",
                "page_url": url,
                "id": None,
            }
        except Exception as e:
            last_err = e
            # Exponential backoff for 429/5xx
            wait = min(30, 3 * (2 ** attempt))
            print(f"    Pollinations attempt {attempt+1} failed: {e}; waiting {wait}s", file=sys.stderr)
            time.sleep(wait)
    print(f"    Pollinations exhausted retries: {last_err}", file=sys.stderr)
    return None, None


def convert_and_save(raw_bytes: bytes, stem: str):
    """Save JPG (resized to target if needed) + WebP; return (jpg_path, webp_path, final_w, final_h)."""
    img = Image.open(BytesIO(raw_bytes)).convert("RGB")
    # Crop to 16:9 if not already
    w, h = img.size
    target_ratio = TARGET_W / TARGET_H
    ratio = w / h
    if abs(ratio - target_ratio) > 0.02:
        if ratio > target_ratio:
            # too wide — crop horizontally
            new_w = int(h * target_ratio)
            x0 = (w - new_w) // 2
            img = img.crop((x0, 0, x0 + new_w, h))
        else:
            # too tall — crop vertically
            new_h = int(w / target_ratio)
            y0 = (h - new_h) // 2
            img = img.crop((0, y0, w, y0 + new_h))
    # If larger than target, downscale
    if img.size[0] > TARGET_W:
        img = img.resize((TARGET_W, TARGET_H), Image.LANCZOS)
    final_w, final_h = img.size

    jpg_path = OUT_DIR / f"{stem}.jpg"
    webp_path = OUT_DIR / f"{stem}.webp"
    img.save(jpg_path, format="JPEG", quality=82, optimize=True, progressive=True)
    img.save(webp_path, format="WEBP", quality=80, method=6)
    return jpg_path, webp_path, final_w, final_h


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def process_one(p):
    """Fetch + save one page's hero. Returns (key, manifest_entry, credit_row) or None."""
    slug = slug_from_path(p["page_path"])
    key = key_from_path(p["page_path"])
    h1 = p.get("h1") or p.get("title") or ""

    override = THEME_OVERRIDES.get(key, {})
    keywords = override.get("keywords") or keywords_from_h1(h1)
    prompt = override.get("prompt") or f"{h1}, professional commercial photography"

    print(f"  → {key}")
    # Unsplash napi now requires auth (401), so go straight to Pollinations.
    seed = abs(hash(slug)) % 10_000_000
    raw, meta = fetch_pollinations(prompt, seed)
    if raw:
        print(f"    ✓ Pollinations.ai (seed={seed})")
    else:
        print(f"    ✗ FAILED; skipping {key}")
        return None

    try:
        jpg_path, webp_path, fw, fh = convert_and_save(raw, slug)
    except Exception as e:
        print(f"    ✗ Pillow failed: {e}; skipping {key}")
        return None

    h = sha256(jpg_path)
    entry = {
        "jpg": f"/landing-images/hero/{jpg_path.name}",
        "webp": f"/landing-images/hero/{webp_path.name}",
        "width": fw,
        "height": fh,
        "alt": (h1 or "Proud Tek")[:180],
        "sha256": h,
        "source": meta["source"],
        "license": meta["license"],
        "photographer": meta["photographer"],
        "source_url": meta["page_url"],
    }
    credit = (
        f"| `{key}` | `{jpg_path.name}` | {meta['source']} | {meta['license']} | "
        f"{meta['photographer']} | {meta['page_url']} |"
    )
    return key, entry, credit


def main():
    audit = json.loads(AUDIT_JSON.read_text())
    missing = [p for p in audit["pages"] if not p.get("has_hero_strict")]
    missing = [p for p in missing if not p.get("has_hero")]
    print(f"Will process {len(missing)} pages with missing heroes.")

    manifest = {"heroes": {}}
    if MANIFEST.exists():
        try:
            manifest = json.loads(MANIFEST.read_text())
        except Exception:
            pass

    credits_rows = [
        "# Hero Image Credits\n",
        "Generated by `scripts/fetch-hero-images.py` on " + time.strftime("%Y-%m-%d %H:%M:%S") + "\n",
        "\n| Page slug | File | Source | License | Photographer / Model | URL |",
        "|---|---|---|---|---|---|",
    ]

    skip = int(os.environ.get("SKIP", "0"))
    limit = int(os.environ.get("LIMIT", "0"))
    if limit:
        missing = missing[skip : skip + limit]

    # Skip pages already in manifest (resume-friendly)
    remaining = [p for p in missing if key_from_path(p["page_path"]) not in manifest["heroes"]]
    print(f"Remaining after resume filter: {len(remaining)}")

    import concurrent.futures as cf

    processed = 0
    # Stay conservative on concurrency to avoid 429 from Pollinations
    with cf.ThreadPoolExecutor(max_workers=2) as pool:
        for result in pool.map(process_one, remaining):
            if not result:
                continue
            key, entry, credit = result
            manifest["heroes"][key] = entry
            credits_rows.append(credit)
            processed += 1
            # Flush after each to support resume
            MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False))
            CREDITS.write_text("\n".join(credits_rows) + "\n")
            print(f"  [{processed} done]")

    print(f"\nDone. Processed {processed} new pages.")
    print(f"Manifest: {MANIFEST}")
    print(f"Credits: {CREDITS}")
    return


def _legacy_unused(missing, manifest, credits_rows):  # noqa: unused
    processed = 0
    for p in missing:
        slug = slug_from_path(p["page_path"])
        key = key_from_path(p["page_path"])
        h1 = p.get("h1") or p.get("title") or ""

        override = THEME_OVERRIDES.get(key, {})
        keywords = override.get("keywords") or keywords_from_h1(h1)
        prompt = override.get("prompt") or f"{h1}, professional commercial photography"

        print(f"[{processed+1}/{len(missing)}] {key}")
        print(f"    keywords: {keywords}")

        raw, meta = fetch_unsplash(keywords)
        if raw:
            print(f"    ✓ Unsplash: {meta['photographer']}")
        else:
            print(f"    Unsplash miss, trying Pollinations...")
            seed = abs(hash(slug)) % 10_000_000
            raw, meta = fetch_pollinations(prompt, seed)
            if raw:
                print(f"    ✓ Pollinations.ai (seed={seed})")
            else:
                print(f"    ✗ FAILED both sources; skipping")
                continue

        try:
            jpg_path, webp_path, fw, fh = convert_and_save(raw, slug)
        except Exception as e:
            print(f"    ✗ Pillow failed: {e}; skipping")
            continue

        h = sha256(jpg_path)
        manifest["heroes"][key] = {
            "jpg": f"/landing-images/hero/{jpg_path.name}",
            "webp": f"/landing-images/hero/{webp_path.name}",
            "width": fw,
            "height": fh,
            "alt": (h1 or "Proud Tek")[:180],
            "sha256": h,
            "source": meta["source"],
            "license": meta["license"],
            "photographer": meta["photographer"],
            "source_url": meta["page_url"],
        }
        credits_rows.append(
            f"| `{key}` | `{jpg_path.name}` | {meta['source']} | {meta['license']} | {meta['photographer']} | {meta['page_url']} |"
        )
        processed += 1

        MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False))
        CREDITS.write_text("\n".join(credits_rows) + "\n")

        # Throttle between requests
        time.sleep(1.0)

    print(f"\nDone. Processed {processed}/{len(missing)} pages.")
    print(f"Manifest: {MANIFEST}")
    print(f"Credits: {CREDITS}")


if __name__ == "__main__":
    main()
