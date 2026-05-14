#!/usr/bin/env python3
"""
DS-15 Phase 6 #6 — WebP variant generator.

Walks `public/landing-images/` and generates a sibling `.webp` file for
every `.jpg`/`.jpeg`/`.png`. Hero emit sites (editorial-pages.ts,
EditorialPage.astro, catalog-pages.ts) ship `<picture>` markup with a
`<source type="image/webp">` declaration that points at the sibling
file plus a `<img>` JPG/PNG fallback.

Usage:
    python3 scripts/build-image-variants.py            # only generate missing
    python3 scripts/build-image-variants.py --force    # regenerate everything
    python3 scripts/build-image-variants.py --quiet    # suppress per-file log

Quality settings — same trade-offs as the in-place re-encode pass in
PHASE-6-IMAGE-COMPRESSION.md:
- WebP quality 82 (visually indistinguishable from q90 source JPEG at
  hero/card sizes, 30–55% smaller bytes than the JPG sibling)
- method=6 (slowest encode, smallest output — fine for build-time)
"""

import argparse
import os
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
TARGET_DIR = ROOT / "public" / "landing-images"
EXTENSIONS = {".jpg", ".jpeg", ".png"}
WEBP_QUALITY = 82
WEBP_METHOD = 6


def generate_one(src: Path, force: bool, quiet: bool) -> tuple[bool, int, int]:
    """
    Generate a .webp sibling for `src`. Returns (did_generate, src_bytes, webp_bytes).
    """
    dst = src.with_suffix(".webp")
    src_bytes = src.stat().st_size

    if dst.exists() and not force:
        return (False, src_bytes, dst.stat().st_size)

    img = Image.open(src)
    if img.mode not in ("RGB", "RGBA"):
        # Convert palette / CMYK / grayscale to a WebP-friendly mode.
        img = img.convert("RGBA" if "A" in img.mode else "RGB")

    save_kwargs = {"quality": WEBP_QUALITY, "method": WEBP_METHOD}
    # Preserve transparency for PNGs that have an alpha channel.
    if img.mode == "RGBA":
        save_kwargs["lossless"] = False  # alpha-safe lossy is fine for hero photos
    img.save(dst, "WEBP", **save_kwargs)

    webp_bytes = dst.stat().st_size
    if not quiet:
        delta_pct = 100 * (1 - webp_bytes / src_bytes) if src_bytes else 0
        print(
            f"  {src.name:<55} {src_bytes/1024:>6.0f}KB → "
            f"{dst.name:<55} {webp_bytes/1024:>6.0f}KB  ({delta_pct:+.0f}%)"
        )
    return (True, src_bytes, webp_bytes)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="regenerate existing .webp files")
    ap.add_argument("--quiet", action="store_true", help="suppress per-file log lines")
    args = ap.parse_args()

    if not TARGET_DIR.is_dir():
        print(f"FATAL: {TARGET_DIR} not found", file=sys.stderr)
        return 1

    # PR-3 P0-P4: walk subdirectories too. The original `iterdir()` only
    # returned top-level files, so anything dropped into
    # `public/landing-images/hero/` or `public/landing-images/contact/`
    # quietly stopped generating WebP variants — degrading LCP for those
    # routes. rglob() with the same extension filter restores
    # comprehensive coverage and remains idempotent (already-encoded
    # files are skipped unless --force).
    sources = sorted(p for p in TARGET_DIR.rglob("*") if p.suffix.lower() in EXTENSIONS)
    if not sources:
        print(f"No source images found in {TARGET_DIR}")
        return 0

    print(f"Phase 6 #6 — generating WebP variants in {TARGET_DIR}")
    print(f"  source count: {len(sources)} (extensions: {sorted(EXTENSIONS)})")
    print(f"  quality: {WEBP_QUALITY}, method: {WEBP_METHOD}, force: {args.force}\n")

    generated = 0
    skipped = 0
    total_src = 0
    total_webp = 0
    for src in sources:
        try:
            did, sb, wb = generate_one(src, force=args.force, quiet=args.quiet)
        except Exception as exc:
            print(f"  ERROR {src.name}: {exc}", file=sys.stderr)
            continue
        total_src += sb
        total_webp += wb
        if did:
            generated += 1
        else:
            skipped += 1

    print(f"\nDone. generated={generated}, skipped={skipped}")
    print(
        f"  total source bytes:  {total_src/1024/1024:>6.2f} MB"
    )
    print(
        f"  total webp bytes:    {total_webp/1024/1024:>6.2f} MB  "
        f"({100 * (1 - total_webp/total_src):+.0f}%)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
