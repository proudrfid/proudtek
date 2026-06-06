#!/usr/bin/env python3
"""
image-audit replacement pipeline — license-aware image sourcing + hero swap.

Companion to the image-audit skill. When Check A finds a hero that does NOT
match the page topic, this sources a topic-relevant, *license-clear* image and
swaps it in — WITHOUT clobbering the (possibly shared) original file.

Two subcommands:

  search  — query Openverse (aggregates CC / public-domain / commercial-OK
            images WITH license + attribution metadata) for the page topic.
            Prints JSON candidates so the agent can VISUALLY verify a thumbnail
            before applying. License-aware by design (never random web URLs).

  apply   — place a chosen image (downloaded URL or a local path) as the page's
            NEW per-page hero `/landing-images/<slug>-hero.<ext>`, regenerate the
            sibling .webp, repoint THIS page's heroImage, set imageCredit (the
            EditorialHero renders it as a "Photo: …" caption), bump modifiedAt,
            and record provenance. The old hero file is left untouched so any
            OTHER page that shares it keeps working.

Guardrails:
  * A URL source REQUIRES --license and --creator (no unlicensed web images).
  * Never overwrites an existing non-generated hero (new per-page file + repoint).
  * Downloads are size-capped (15 MB) and Content-Type must be an image.
  * --dry-run prints the plan and writes nothing.

Usage:
  python3 scripts/image-audit-replace.py search --query "RFID warehouse rack" --count 5
  python3 scripts/image-audit-replace.py search --query "..." --aspect wide --json
  python3 scripts/image-audit-replace.py apply --slug <slug> --group <group> \
      --src <imageURL|localPath> --source-url <pageURL> \
      --license "CC BY 4.0" --license-url <url> --creator "Name" [--dry-run]
"""
import argparse
import datetime
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
LANDING = PUBLIC / "landing-images"
EDITORIAL = ROOT / "src" / "content" / "editorial"
CREDITS = LANDING / "_credits"

WEBP_QUALITY = 82
WEBP_METHOD = 6
JPG_QUALITY = 90
MAX_WIDTH = 1600
MAX_BYTES = 15 * 1024 * 1024
UA = "Mozilla/5.0 (proudtek image-audit replace bot)"


def http_get(url, as_json=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=40) as r:
        if as_json:
            return json.loads(r.read().decode("utf-8")), r.headers
        data = r.read(MAX_BYTES + 1)
        return data, r.headers


def fmt_license(lic, ver):
    """Openverse license codes → human label (e.g. 'by' → 'CC BY 4.0')."""
    lic = (lic or "").lower()
    ver = ver or ""
    if lic in ("cc0",):
        return ("CC0 " + ver).strip()
    if lic in ("pdm", "pdmark"):
        return "Public Domain Mark"
    label = "CC " + lic.upper().replace("-", "-")
    return (label + " " + ver).strip()


# ── search ────────────────────────────────────────────────────────────────────
def cmd_search(a):
    params = {
        "q": a.query,
        "page_size": str(a.count),
        # commercial use + modification allowed → safe to use AND crop/recolor.
        "license_type": "commercial,modification",
        "mature": "false",
    }
    if a.aspect:
        params["aspect_ratio"] = a.aspect  # wide | tall | square
    url = "https://api.openverse.org/v1/images/?" + urllib.parse.urlencode(params)
    try:
        data, _ = http_get(url, as_json=True)
    except Exception as e:
        print(json.dumps({"error": f"openverse query failed: {e}",
                          "hint": "no network? fall back to the WebSearch tool, then `apply` with the chosen URL + its license."}, indent=2))
        sys.exit(1)
    out = []
    for r in data.get("results", []):
        out.append({
            "title": r.get("title"),
            "url": r.get("url"),                       # full image
            "thumbnail": r.get("thumbnail"),            # small preview to Read/verify
            "license": fmt_license(r.get("license"), r.get("license_version")),
            "license_version": r.get("license_version"),
            "license_url": r.get("license_url"),
            "creator": r.get("creator"),
            "attribution": r.get("attribution"),
            "source": r.get("source"),
            "foreign_landing_url": r.get("foreign_landing_url"),
            "width": r.get("width"), "height": r.get("height"),
        })
    if a.json:
        print(json.dumps({"query": a.query, "count": len(out), "candidates": out}, indent=2, ensure_ascii=False))
        return
    print(f"\nOpenverse — {len(out)} license-clear candidate(s) for: {a.query!r}")
    print("(all commercial-use + modification-allowed; verify the actual pixels before apply)\n")
    for i, c in enumerate(out, 1):
        print(f"{i}. {c['title'] or '(untitled)'}   [{c['license']}]  {c['width']}x{c['height']}")
        print(f"   image:     {c['url']}")
        print(f"   thumbnail: {c['thumbnail']}   (Read this to confirm it matches the topic)")
        print(f"   creator:   {c['creator']}   · source: {c['source']}")
        print(f"   apply: python3 scripts/image-audit-replace.py apply --slug <slug> --group <group> \\")
        print(f"            --src '{c['url']}' --source-url '{c['foreign_landing_url'] or ''}' \\")
        print(f"            --license '{c['license']}' --license-url '{c['license_url'] or ''}' --creator '{(c['creator'] or 'Unknown')}'")
        print("")


# ── apply ───────────────────────────────────────────────────────────────────────
def find_page(slug, group):
    base = EDITORIAL / group
    hits = list(base.rglob(f"{slug}.json")) if base.exists() else []
    return hits[0] if hits else None


def set_after(d, anchor, key, value):
    """Insert key right after `anchor` (clean diffs); replace in place if present."""
    if key in d:
        d[key] = value
        return d
    out = {}
    for k, v in d.items():
        out[k] = v
        if k == anchor:
            out[key] = value
    if key not in out:
        out[key] = value
    return out


def cmd_apply(a):
    page = find_page(a.slug, a.group)
    if not page:
        sys.exit(f"page not found: {a.group}/{a.slug}.json under {EDITORIAL}")

    is_url = a.src.startswith("http://") or a.src.startswith("https://")
    if is_url and not (a.license and a.creator):
        sys.exit("refusing to apply a web image without --license AND --creator "
                 "(attribution is required + recorded as imageCredit).")

    # 1. obtain source bytes
    tmp = Path("/tmp") / f"ia-src-{a.slug}"
    if is_url:
        data, headers = http_get(a.src)
        ct = headers.get("Content-Type", "")
        if "image" not in ct:
            sys.exit(f"source is not an image (Content-Type: {ct or 'unknown'})")
        if len(data) > MAX_BYTES:
            sys.exit("source image exceeds 15 MB cap")
        tmp.write_bytes(data)
        local = tmp
    else:
        local = Path(a.src)
        if not local.is_absolute():
            local = ROOT / a.src
        if not local.exists():
            sys.exit(f"local --src not found: {local}")

    # 2. normalize: RGB, cap width, target a per-page hero file (never overwrite the old one)
    im = Image.open(local).convert("RGB")
    if im.width > MAX_WIDTH:
        im = im.resize((MAX_WIDTH, round(im.height * MAX_WIDTH / im.width)))
    rel = f"/landing-images/{a.slug}-hero.jpg"
    out_jpg = PUBLIC / rel.lstrip("/")
    out_webp = out_jpg.with_suffix(".webp")

    data = json.loads(page.read_text(encoding="utf-8"))
    old_hero = data.get("heroImage")
    old_credit = data.get("imageCredit")
    now = a.now or datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    credit = None
    if a.license:
        credit = {"author": a.creator or "Unknown"}
        if a.source_url:
            credit["sourceUrl"] = a.source_url
        credit["license"] = a.license
        if a.license_url:
            credit["licenseUrl"] = a.license_url

    plan = {
        "page": str(page.relative_to(ROOT)),
        "oldHero": old_hero, "newHero": rel,
        "writes": [rel, rel.replace(".jpg", ".webp")],
        "imageCredit": credit, "modifiedAt": now,
        "clearsStaleCredit": bool(old_credit and not credit),
        "sharedOldHeroKept": True,
    }
    if a.dry_run:
        print(json.dumps({"dryRun": True, "plan": plan}, indent=2, ensure_ascii=False))
        return

    # 3. write the new hero + webp
    out_jpg.parent.mkdir(parents=True, exist_ok=True)
    im.save(out_jpg, quality=JPG_QUALITY, subsampling=0)
    im.save(out_webp, "WEBP", quality=WEBP_QUALITY, method=WEBP_METHOD)

    # 4. repoint heroImage + set imageCredit (after heroImage) + modifiedAt
    data["heroImage"] = rel
    if credit:
        data = set_after(data, "heroImage", "imageCredit", credit)
    else:
        # In-repo source carries no attribution — drop any pre-existing imageCredit
        # so the page never renders a stale "Photo: …" caption from a former hero.
        data.pop("imageCredit", None)
    # set_after replaces in place if modifiedAt exists, else inserts it after the
    # credit (or heroImage) block — clean diff either way.
    data = set_after(data, "imageCredit" if credit else "heroImage", "modifiedAt", now)
    page.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    # 5. provenance sidecar
    CREDITS.mkdir(parents=True, exist_ok=True)
    (CREDITS / f"{a.slug}.json").write_text(json.dumps({
        "slug": a.slug, "group": a.group, "page": str(page.relative_to(ROOT)),
        "newHero": rel, "replacedHero": old_hero,
        "src": a.src, "sourceUrl": a.source_url, "license": a.license,
        "licenseUrl": a.license_url, "creator": a.creator, "appliedAt": now,
    }, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(json.dumps({"applied": True, **plan}, indent=2, ensure_ascii=False))


# ── cli ───────────────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser(description="image-audit license-aware hero replacement")
    sub = ap.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("search", help="Openverse license-clear candidates for a topic")
    s.add_argument("--query", required=True)
    s.add_argument("--count", type=int, default=5)
    s.add_argument("--aspect", choices=["wide", "tall", "square"], default=None)
    s.add_argument("--json", action="store_true")
    s.set_defaults(fn=cmd_search)

    p = sub.add_parser("apply", help="swap a chosen image in as the page's hero")
    p.add_argument("--slug", required=True)
    p.add_argument("--group", required=True)
    p.add_argument("--src", required=True, help="image URL or local path")
    p.add_argument("--source-url", default=None, help="the page/landing URL to credit")
    p.add_argument("--license", default=None, help="e.g. 'CC BY 4.0' (required for URL sources)")
    p.add_argument("--license-url", default=None)
    p.add_argument("--creator", default=None, help="attribution author (required for URL sources)")
    p.add_argument("--now", default=None, help="ISO timestamp override for modifiedAt")
    p.add_argument("--dry-run", action="store_true")
    p.set_defaults(fn=cmd_apply)

    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
