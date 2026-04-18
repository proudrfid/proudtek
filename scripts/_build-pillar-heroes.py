#!/usr/bin/env python3
"""Compose 1200x729 pillar hero collages from existing SKU images.

Layout: 3-column, 2-row grid (6 tiles) with white gutters.
Output: /public/landing-images/<cluster>-pillar.jpg

Run once to regenerate; safe to re-run.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "landing-images"

OUT_W, OUT_H = 1200, 729
COLS, ROWS = 3, 2
GUTTER = 12
BG = (255, 255, 255)

TILE_W = (OUT_W - GUTTER * (COLS + 1)) // COLS
TILE_H = (OUT_H - GUTTER * (ROWS + 1)) // ROWS


def tile(path: Path) -> Image.Image:
    """Open, EXIF-normalise, and cover-fit to TILE_W x TILE_H."""
    im = Image.open(path)
    im = ImageOps.exif_transpose(im).convert("RGB")
    return ImageOps.fit(im, (TILE_W, TILE_H), Image.LANCZOS)


def compose(sources: list[str], dest: Path) -> None:
    canvas = Image.new("RGB", (OUT_W, OUT_H), BG)
    for i, name in enumerate(sources[: COLS * ROWS]):
        row, col = divmod(i, COLS)
        src = SRC / name
        if not src.exists():
            print(f"  skip missing: {name}")
            continue
        t = tile(src)
        x = GUTTER + col * (TILE_W + GUTTER)
        y = GUTTER + row * (TILE_H + GUTTER)
        canvas.paste(t, (x, y))
    canvas.save(dest, "JPEG", quality=88, optimize=True)
    print(f"  wrote: {dest.relative_to(ROOT)}  ({dest.stat().st_size // 1024} KB)")


COMPOSITIONS = {
    "rfid-labels-pillar.jpg": [
        "impinj-m800-uhf-inlay.jpg",
        "ntag213-nfc-sticker.jpg",
        "nfc-digital-product-passport-tag.jpg",
        "rfid-wet-inlay.jpg",
        "uhf-rfid-tire-label.jpg",
        "ntag424-dna-tamper-evident-tag.jpg",
    ],
    "rfid-tags-pillar.jpg": [
        "high-temperature-rfid-tag-200c.jpg",
        "rfid-ear-tag-livestock.jpg",
        "rfid-tire-tag.jpg",
        "rfid-library-book-tag.jpg",
        "rfid-tool-tag.jpg",
        "rfid-bolt-seal.jpg",
    ],
    "rfid-cards-pillar.jpg": [
        "mifare-desfire-ev3-card.jpg",
        "ntag424-dna-tt-card.png",
        "rfid-employee-badge.jpg",
        "rfid-wooden-card.jpg",
        "ppc-nfc-business-cards.jpg",
        "dual-frequency-rfid-card.webp",
    ],
    "rfid-wristbands-pillar.jpg": [
        "tyvek-rfid-wristband.jpg",
        "silicone-wristband-mifare-classic.jpg",
        "fabric-rfid-wristband.jpg",
        "hospital-patient-id-wristband.jpg",
        "cashless-payment-rfid-wristband.jpg",
        "rfid-waterpark-wristband.jpg",
    ],
    "rfid-keyfobs-pillar.jpg": [
        "rfid-abs-keyfob.jpg",
        "rfid-leather-keyfob.jpg",
        "rfid-metal-keyfob.jpg",
        "rfid-silicone-keyfob.jpg",
        "rfid-epoxy-keyfob.jpg",
        "nfc-epoxy-key-tag.jpg",
    ],
    "industries-pillar.jpg": [
        "retail-apparel.jpg",
        "hospital-patient-id-wristband.jpg",
        "logistics.jpg",
        "events-venues.jpg",
        "eu-compliance.jpg",
        "rfid-library-book-tag.jpg",
    ],
}

if __name__ == "__main__":
    for out, srcs in COMPOSITIONS.items():
        print(f"Composing {out}:")
        compose(srcs, SRC / out)
