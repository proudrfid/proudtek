#!/usr/bin/env python3
"""
DS-15 Phase 6 #6 — WebP variant generator.
2026-07-01b — width-tiered thumbnail variants (responsive srcset pipeline).

Walks `public/landing-images/` and `public/blog-images/` and generates a
sibling `.webp` file for every `.jpg`/`.jpeg`/`.png`. Hero emit sites
(editorial-pages.ts, EditorialPage.astro, catalog-pages.ts) ship `<picture>`
markup with a `<source type="image/webp">` declaration that points at the
sibling file plus a `<img>` JPG/PNG fallback.

2026-07-01: added `public/blog-images/` alongside `landing-images/`. Lighthouse
on /blog/ found the hub's thumbnail grid pulling ~6.3MB across 28 images with
zero WebP coverage — `blog-images/` had never been in scope for this script,
so every blog-post hero photo shipped as a raw JPG. blog/index.astro now
renders the same <picture>+webp pattern EditorialHero.astro already uses for
landing-images; this script just needs to cover the second source directory
so the sibling files actually exist for it to point at.

2026-07-01b: the WebP pass above only fixes *format* — every card-grid
thumbnail (`.codex-blog-grid-card__thumb`, used on /blog/, /compatibility/,
/solutions/, /guides/{cluster}/) still ships the FULL hero-sized image
(native width, often 1200px+) even though Lighthouse measures its rendered
size at ~279 CSS px on desktop. `uses-responsive-images` flagged 5,864 KiB of
potential savings on /blog/ alone (96% wasted on the single worst offender).
This pass adds two additional SMALLER width-tier siblings —
`{stem}-480w{ext}` and `{stem}-960w{ext}` (both original format and WebP) —
for the subset of images actually used as card-grid thumbnails (see
`get_thumbnail_context_images()`; intentionally narrower than the full
directory scan above, since most landing/blog images serve only as a single
page's own full-size hero and are never displayed at thumbnail size). Never
upscales: if a source is already narrower than a tier's target width, that
tier is generated at the source's native width instead (still written to the
expected filename — CardThumb.astro trusts this invariant with no runtime
existence check, matching EditorialHero.astro's existing untested-webp-
sibling convention). Consumed by `src/components/editorial/CardThumb.astro`.

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
import json
import re
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
TARGET_DIRS = [ROOT / "public" / "landing-images", ROOT / "public" / "blog-images"]
EXTENSIONS = {".jpg", ".jpeg", ".png"}
ALL_RASTER_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
WEBP_QUALITY = 82
WEBP_METHOD = 6
THUMB_WIDTHS = [480, 960]


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


def get_thumbnail_context_images() -> set[str]:
    """
    Scoped manifest of images actually displayed in a card-grid thumbnail
    context (`.codex-blog-grid-card__thumb`, rendered by blog/index.astro,
    compatibility/index.astro, solutions/index.astro, and
    guides/[cluster].astro). Deliberately narrower than TARGET_DIRS' full
    ~550 files — most landing/blog images serve only as a single page's own
    full-size hero and are never shown at thumbnail size, so width-tiering
    them would just bloat the repo with dead files.

    Sources, mirrored from the actual render paths:
      1. `heroImage` field on editorial JSON whose group is blog / solutions
         / guides / compatibility (src/content/editorial/**/*.json).
      2. BLOG_THUMBNAIL_MAP in src/data/blog-topics.ts — the fallback used by
         blog posts that don't set their own heroImage (regex-scraped rather
         than imported, since this is a plain script with no TS runtime).
      3. compatibility/index.astro's hardcoded `heroFor()` default image.

    Returns paths as they appear in source (leading `/landing-images/...` or
    `/blog-images/...`), not filesystem paths.
    """
    images: set[str] = set()

    editorial_dir = ROOT / "src" / "content" / "editorial"
    thumbnail_groups = {"blog", "solutions", "guides", "compatibility"}
    for f in editorial_dir.rglob("*.json"):
        try:
            data = json.loads(f.read_text())
        except (json.JSONDecodeError, OSError):
            continue
        if data.get("group") in thumbnail_groups and data.get("heroImage"):
            images.add(data["heroImage"])

    blog_topics_path = ROOT / "src" / "data" / "blog-topics.ts"
    if blog_topics_path.is_file():
        txt = blog_topics_path.read_text()
        for m in re.finditer(r'"(/(?:blog|landing)-images/[^"]+)"', txt):
            images.add(m.group(1))

    images.add("/landing-images/hero/compatibility-saflok-hotel-key-cards.webp")
    return images


def _resize_to_width(img: Image.Image, target_width: int) -> Image.Image:
    """Resize preserving aspect ratio. Never upscales — if img is already
    narrower than target_width, returns it unchanged (still re-saved by the
    caller so the expected filename exists)."""
    if img.width <= target_width:
        return img
    new_height = round(img.height * (target_width / img.width))
    return img.resize((target_width, new_height), Image.LANCZOS)


def generate_thumb_tiers(src: Path, force: bool, quiet: bool) -> tuple[int, int]:
    """
    Generate `{stem}-{width}w{ext}` (same format as src) and
    `{stem}-{width}w.webp` siblings for each width in THUMB_WIDTHS.
    If src is already .webp, only the .webp tier is generated (same-format
    would be an identical duplicate). Returns (files_generated, files_skipped).
    """
    ext = src.suffix.lower()
    is_webp_source = ext == ".webp"
    generated = 0
    skipped = 0

    src_img = None  # lazy-open; most runs skip everything (idempotent)
    for width in THUMB_WIDTHS:
        same_format_dst = src.with_name(f"{src.stem}-{width}w{src.suffix}")
        webp_dst = src.with_name(f"{src.stem}-{width}w.webp")
        targets = [webp_dst] if is_webp_source else [same_format_dst, webp_dst]

        for dst in targets:
            if dst.exists() and not force:
                skipped += 1
                continue
            if src_img is None:
                src_img = Image.open(src)
                if src_img.mode not in ("RGB", "RGBA"):
                    src_img = src_img.convert("RGBA" if "A" in src_img.mode else "RGB")
            resized = _resize_to_width(src_img, width)
            if dst.suffix.lower() == ".webp":
                save_kwargs = {"quality": WEBP_QUALITY, "method": WEBP_METHOD}
                resized.save(dst, "WEBP", **save_kwargs)
            elif dst.suffix.lower() in (".jpg", ".jpeg"):
                to_save = resized.convert("RGB") if resized.mode == "RGBA" else resized
                to_save.save(dst, "JPEG", quality=88)
            else:  # .png
                resized.save(dst, "PNG")
            generated += 1
            if not quiet:
                print(f"    {dst.name} ({resized.width}x{resized.height})")

    return (generated, skipped)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="regenerate existing .webp files")
    ap.add_argument("--quiet", action="store_true", help="suppress per-file log lines")
    args = ap.parse_args()

    existing_dirs = [d for d in TARGET_DIRS if d.is_dir()]
    if not existing_dirs:
        print(f"FATAL: none of {TARGET_DIRS} exist", file=sys.stderr)
        return 1
    for d in TARGET_DIRS:
        if d not in existing_dirs:
            print(f"  (skipping {d}, not found)", file=sys.stderr)

    # PR-3 P0-P4: walk subdirectories too. The original `iterdir()` only
    # returned top-level files, so anything dropped into
    # `public/landing-images/hero/` or `public/landing-images/contact/`
    # quietly stopped generating WebP variants — degrading LCP for those
    # routes. rglob() with the same extension filter restores
    # comprehensive coverage and remains idempotent (already-encoded
    # files are skipped unless --force).
    sources = sorted(
        p
        for d in existing_dirs
        for p in d.rglob("*")
        if p.suffix.lower() in EXTENSIONS
    )
    if not sources:
        print(f"No source images found in {existing_dirs}")
        return 0

    print(f"Phase 6 #6 — generating WebP variants in {', '.join(str(d) for d in existing_dirs)}")
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

    # ── Pass 2: width-tiered thumbnail variants (2026-07-01b) ──────────────
    thumb_images = get_thumbnail_context_images()
    thumb_paths = sorted(
        ROOT / "public" / rel.lstrip("/")
        for rel in thumb_images
        if Path(rel).suffix.lower() in ALL_RASTER_EXTENSIONS
    )
    existing_thumb_paths = [p for p in thumb_paths if p.is_file()]
    missing = len(thumb_paths) - len(existing_thumb_paths)

    print(f"\nPass 2 — width-tiered thumbnail variants ({THUMB_WIDTHS} px)")
    print(f"  thumbnail-context images: {len(thumb_images)} referenced, "
          f"{len(existing_thumb_paths)} found on disk"
          + (f", {missing} MISSING (referenced but not on disk — skipped)" if missing else ""))

    tier_generated = 0
    tier_skipped = 0
    for src in existing_thumb_paths:
        try:
            gen, skip = generate_thumb_tiers(src, force=args.force, quiet=args.quiet)
        except Exception as exc:
            print(f"  ERROR {src.name}: {exc}", file=sys.stderr)
            continue
        tier_generated += gen
        tier_skipped += skip

    print(f"\nPass 2 done. generated={tier_generated}, skipped={tier_skipped}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
