#!/usr/bin/env python3
"""page-geo selfcheck: formatting round-trip, chip-line integrity,
factscan mirror, strict zod (mirrored live from content.config.ts).

Usage:
  python3 selfcheck.py --repo <repo> \
    --old origin/main:src/content/editorial/<group>/<slug>.json \
    --new /tmp/<slug>_new.json \
    [--allow-new-tokens] [--allow-dropped '<token>' ...]

Exit 0 = all gates green. NEW tokens are non-fatal only with
--allow-new-tokens (justify each in NOTES.md). DROPPED tokens are fatal
unless individually whitelisted via --allow-dropped — the auditable escape
hatch for documented fact corrections (old wrong value drops, new sourced
value appears; record both in the NOTES.md Corrections block).
"""
import argparse, difflib, json, os, re, subprocess, sys, tempfile

RX = re.compile(
    r'(NTAG ?2[0-9]+|MIFARE [A-Za-z0-9]{0,10}|DESFire|EM4[0-9]+|T5577|ICODE|'
    r'UCODE ?[0-9]?|Monza|Higgs-?[0-9]?|M7[0-9]{2}|ISO ?[0-9]{4,5}|'
    r'IEC ?[0-9]{4,5}|CFR|\$[0-9][0-9,.]*[KMk]?|'
    r'[0-9][0-9,.]*\s?(?:%|kbit/s|cm|mm|µm|kHz|MHz|GHz|°C|°F|m\b|W\b|mW|dBm|bytes|kB|pcs|ms|h\b))')


def read_old(repo, spec):
    if ':' in spec and not os.path.exists(spec):
        ref, path = spec.split(':', 1)
        out = subprocess.run(['git', '-C', repo, 'cat-file', '-p', f'{ref}:{path}'],
                             capture_output=True, text=True)
        if out.returncode != 0:
            sys.exit(f'cannot read {spec}: {out.stderr.strip()}')
        return out.stdout
    return open(spec).read()


def zod_check(repo, new_path):
    src = open(os.path.join(repo, 'src/content.config.ts')).read()
    start = src.find('const linkSchema')
    end_anchor = src.find('const editorialSchema')
    if start == -1 or end_anchor == -1:
        return None, 'content.config.ts anchors not found — schema layout changed, update selfcheck.py'
    tail = src[end_anchor:]
    close = re.search(r'^\}\);\s*$', tail, re.M)
    if not close:
        return None, 'editorialSchema close not found'
    chunk = src[start:end_anchor + close.end()].replace(' as const', '')
    mjs = (f'import {{ z }} from "zod";\nimport {{ readFileSync }} from "node:fs";\n'
           f'{chunk}\n'
           'const data = JSON.parse(readFileSync(process.argv[2], "utf8"));\n'
           'const r = editorialSchema.strict().safeParse(data);\n'
           'if (!r.success) { for (const i of r.error.issues.slice(0, 20)) '
           'console.error(i.path.join(".") + " — " + i.message); process.exit(1); }\n'
           'console.log("zod strict OK");\n')
    d = tempfile.mkdtemp(prefix='pagegeo_zod_')
    open(os.path.join(d, 'zodmirror.mjs'), 'w').write(mjs)
    nm = os.path.join(d, 'node_modules')
    if not os.path.exists(nm):
        os.symlink(os.path.abspath(os.path.join(repo, 'node_modules')), nm)
    out = subprocess.run(['node', os.path.join(d, 'zodmirror.mjs'), os.path.abspath(new_path)],
                         capture_output=True, text=True)
    return out.returncode == 0, (out.stdout + out.stderr).strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', required=True)
    ap.add_argument('--old', required=True)
    ap.add_argument('--new', required=True)
    ap.add_argument('--allow-new-tokens', action='store_true')
    ap.add_argument('--allow-dropped', action='append', default=[],
                    help='whitelist a DROPPED token for a documented fact correction (repeatable)')
    a = ap.parse_args()

    old_raw, new_raw = read_old(a.repo, a.old), open(a.new).read()
    fails = []

    # 1. parse + round-trip
    try:
        d = json.loads(new_raw)
        rt = json.dumps(d, indent=2, ensure_ascii=False) + '\n'
        if rt != new_raw:
            fails.append('round-trip formatting differs — regenerate via json.dumps(indent=2, ensure_ascii=False) + "\\n"')
    except Exception as e:
        print(f'FAIL: new JSON does not parse: {e}'); sys.exit(1)

    # 2. diff-based checks
    ol, nl = old_raw.splitlines(), new_raw.splitlines()
    added = [l[1:] for l in difflib.unified_diff(ol, nl, n=0) if l.startswith('+') and not l.startswith('+++')]
    removed = [l[1:] for l in difflib.unified_diff(ol, nl, n=0) if l.startswith('-') and not l.startswith('---')]
    chip_added = [l for l in added if '{chip:' in l]
    if chip_added:
        fails.append(f'{len(chip_added)} added line(s) contain {{chip: — drift lint will fail. First: {chip_added[0].strip()[:100]}')

    minus = {m.group(0) for l in removed if 'modifiedAt' not in l for m in RX.finditer(l)}
    plus = {m.group(0) for l in added if 'modifiedAt' not in l for m in RX.finditer(l)}
    dropped = sorted(t for t in minus - plus if t not in new_raw)
    new_tokens = sorted(t for t in plus - minus if t not in old_raw)
    corrections = [t for t in dropped if t in a.allow_dropped]
    dropped = [t for t in dropped if t not in a.allow_dropped]
    if dropped:
        fails.append(f'factscan DROPPED: {dropped}')
    print(f'chip-added-lines: {len(chip_added)} | factscan DROPPED: {dropped or "[]"} | '
          f'NEW: {new_tokens or "[]"} | corrections (whitelisted drops): {corrections or "[]"}')
    if new_tokens and not a.allow_new_tokens:
        fails.append(f'factscan NEW tokens present — rerun with --allow-new-tokens only if each is sourced: {new_tokens}')

    # 3. zod strict
    ok, msg = zod_check(a.repo, a.new)
    print(f'zod: {msg}')
    if ok is False:
        fails.append('zod strict failed')
    elif ok is None:
        fails.append(msg)

    if fails:
        print('\nFAIL:')
        for f in fails: print(' -', f)
        sys.exit(1)
    print('\nPASS: all selfcheck gates green')


if __name__ == '__main__':
    main()
