#!/usr/bin/env python3
"""Standalone HTML preview for an editorial page JSON.

Usage:
  python3 build_preview.py --repo <repo> --json <page.json> --out <out.html>
      [--svg <dir-with-new-local-svgs>]

Resolves {chip:slug:field} via src/data/chip-specs.json, inlines SVG images
(--svg dir first, then origin/main blobs), renders every section component
in the site's order: intro, statBar, image, paragraphs, dataHighlight,
featureGrid, comparePanel, timeline, bullets, checklist, table, callout.
"""
import argparse, html, json, os, re, subprocess

ap = argparse.ArgumentParser()
ap.add_argument('--repo', required=True)
ap.add_argument('--json', required=True)
ap.add_argument('--out', required=True)
ap.add_argument('--svg', default=None)
a = ap.parse_args()

d = json.load(open(a.json))
chips = json.load(open(os.path.join(a.repo, 'src/data/chip-specs.json')))['chips']


def resolve_chip(m):
    slug, field = m.group(1), m.group(2)
    c = chips.get(slug)
    if not c: return m.group(0)
    if field in ('name', 'displayName'): return c.get('displayName', m.group(0))
    if field in ('short_name', 'shortName'): return c.get('shortName') or c.get('displayName', m.group(0))
    cur = c
    for p in field.split('.'):
        if isinstance(cur, dict) and p in cur: cur = cur[p]
        else: return m.group(0)
    return str(cur)


def T(s):
    s = html.escape(str(s), quote=False)
    s = re.sub(r'\{chip:([a-z0-9-]+):([a-z0-9_.]+)\}', resolve_chip, s)
    return re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', s)


def svg_inline(src):
    name = os.path.basename(src)
    if a.svg and os.path.exists(os.path.join(a.svg, name)):
        return open(os.path.join(a.svg, name)).read()
    out = subprocess.run(['git', '-C', a.repo, 'cat-file', '-p', f"origin/main:public/{src.lstrip('/')}"],
                         capture_output=True, text=True)
    if out.returncode == 0: return out.stdout
    return f'<div style="background:#eee;padding:40px;text-align:center;border-radius:12px">[image: {html.escape(src)}]</div>'


def img_or_svg(src):
    return svg_inline(src) if src.endswith('.svg') else f'<div style="background:#f4efe4;padding:40px;text-align:center;border-radius:12px;color:#6d5a3a">[photo: {html.escape(src)}]</div>'


P = [f'''<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>PREVIEW — {html.escape(str(d.get('title','')))}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Lora:wght@600;700&display=swap" rel="stylesheet">
<style>
body{{margin:0;font-family:Inter,system-ui,sans-serif;color:#291c0e;background:linear-gradient(#fff,#f6f2ea);line-height:1.6}}
.wrap{{max-width:1100px;margin:0 auto;padding:32px 24px 80px}}
.bar{{background:#291c0e;color:#f6f2ea;font-size:13px;padding:8px 16px;text-align:center}}
.kicker{{text-transform:uppercase;letter-spacing:.12em;font-weight:800;font-size:13px;color:#6d5a3a}}
h1{{font-family:Lora,serif;font-size:2.4rem;line-height:1.2;margin:.3em 0 .4em}}h2{{font-family:Lora,serif;font-size:1.8rem;margin:0 0 14px}}
.summary{{font-size:1.05rem;background:rgba(248,246,241,.92);border:1px solid rgba(195,154,95,.25);border-radius:16px;padding:20px 24px}}
.hp{{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin:18px 0;padding:0;list-style:none}}
.hp li{{background:#fff;border:1px solid rgba(41,28,14,.12);border-radius:12px;padding:12px 16px;font-size:.92rem}}
figure{{margin:22px 0}}figure svg{{width:100%;height:auto;border-radius:16px}}
section{{margin-top:56px}}.intro{{font-size:1.02rem;max-width:70ch}}
ul.b{{padding-left:1.2em}}ul.b li{{margin:.55em 0;max-width:70ch}}
table{{border-collapse:collapse;width:100%;margin:20px 0;font-size:.9rem;background:#fff;border-radius:12px;overflow:hidden}}
th{{background:#4a5568;color:#fff;text-align:left;padding:10px 12px;font-size:.82rem}}
td{{border-top:1px solid rgba(41,28,14,.12);padding:10px 12px;vertical-align:top}}tr:nth-child(even) td{{background:rgba(248,246,241,.6)}}
.sb{{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:18px 0}}
.sb div{{background:#fff;border:1px solid rgba(195,154,95,.25);border-radius:12px;padding:14px 16px}}
.sb b{{display:block;font-size:1.5rem;color:#6d5a3a;font-family:Lora,serif}}.sb span{{font-size:.8rem;color:#5c5c5c}}
.cmp{{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:18px 0}}
.cmp div{{border-radius:12px;padding:16px 18px}}.cmp .b4{{background:rgba(139,45,45,.06);border:1px solid rgba(139,45,45,.25)}}
.cmp .af{{background:rgba(31,111,58,.06);border:1px solid rgba(31,111,58,.25)}}.cmp h4{{margin:0 0 8px}}.cmp ul{{margin:0;padding-left:1.1em;font-size:.88rem}}
.ck{{list-style:none;padding:0}}.ck li{{padding-left:1.7em;position:relative;margin:.5em 0;max-width:70ch}}
.ck li::before{{content:"✓";position:absolute;left:0;color:#1f6f3a;font-weight:800}}
.co{{border-left:4px solid #c39a5f;background:rgba(248,246,241,.92);border-radius:0 12px 12px 0;padding:14px 18px;margin:18px 0}}
.fg{{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;margin:18px 0}}
.fg div{{background:#fff;border:1px solid rgba(41,28,14,.12);border-radius:12px;padding:14px 16px;font-size:.9rem}}
.dh{{display:flex;gap:18px;background:#fff;border:1px solid rgba(41,28,14,.12);border-radius:16px;padding:18px 22px;margin:18px 0}}
.dh .v{{font-family:Lora,serif;font-size:2.2rem;color:#2c5454;font-weight:700;white-space:nowrap}}.dh .t{{font-size:.88rem;color:#4f4f4f}}
.tl{{border-left:3px solid #c39a5f;margin:18px 0 0 8px;padding-left:22px}}.tl div{{margin-bottom:16px;position:relative}}
.tl div::before{{content:"";position:absolute;left:-29px;top:6px;width:11px;height:11px;border-radius:50%;background:#c39a5f}}
.tl p{{margin:.2em 0 0;font-size:.88rem;color:#4f4f4f;max-width:70ch}}
details{{background:#fff;border:1px solid rgba(41,28,14,.12);border-radius:10px;padding:10px 16px;margin:8px 0}}summary{{font-weight:600;cursor:pointer}}
a{{color:#2c5454}}.meta{{color:#5c5c5c;font-size:.8rem}}
@media(max-width:700px){{.cmp{{grid-template-columns:1fr}}}}
</style></head><body><div class="bar">PREVIEW · {html.escape(d.get('route',''))} · modifiedAt {html.escape(str(d.get('modifiedAt','')))}</div><div class="wrap">
<div class="kicker">{T(d.get('kicker',''))}</div><h1>{T(d.get('title',''))}</h1>
<div class="summary">{T(d.get('summary',''))}</div>
<ul class="hp">{''.join(f'<li>{T(p)}</li>' for p in d.get('heroPoints',[]))}</ul>
<figure>{img_or_svg(d['heroImage']) if d.get('heroImage') else ''}</figure>''']

for s in d.get('sections', []):
    P.append(f'<section><h2>{T(s.get("title",""))}</h2>')
    if s.get('intro'): P.append(f'<p class="intro">{T(s["intro"])}</p>')
    if s.get('statBar'): P.append('<div class="sb">' + ''.join(f'<div><b>{T(i["value"])}</b><span>{T(i["label"])}</span></div>' for i in s['statBar']['items']) + '</div>')
    if s.get('image'): P.append(f'<figure>{img_or_svg(s["image"]["src"])}</figure>')
    for para in s.get('paragraphs', []) or []: P.append(f'<p class="intro">{T(para)}</p>')
    if s.get('dataHighlight'):
        dh = s['dataHighlight']; P.append(f'<div class="dh"><div class="v">{T(dh["value"])}</div><div class="t"><b>{T(dh["heading"])}</b><br>{T(dh["text"])}</div></div>')
    if s.get('featureGrid'): P.append('<div class="fg">' + ''.join(f'<div><b>{f.get("icon","")} {T(f["title"])}</b><br>{T(f["text"])}</div>' for f in s['featureGrid']['features']) + '</div>')
    if s.get('comparePanel'):
        cp = s['comparePanel']
        P.append(f'<div class="cmp"><div class="b4"><h4>{T(cp.get("beforeHeading","Before"))}</h4><ul>' + ''.join(f'<li>{T(x)}</li>' for x in cp['before']) + f'</ul></div><div class="af"><h4>{T(cp.get("afterHeading","After"))}</h4><ul>' + ''.join(f'<li>{T(x)}</li>' for x in cp['after']) + '</ul></div></div>')
    if s.get('timeline'): P.append('<div class="tl">' + ''.join(f'<div><b>{T(i["label"])}</b><p>{T(i["text"])}</p></div>' for i in s['timeline']['items']) + '</div>')
    if s.get('bullets'): P.append('<ul class="b">' + ''.join(f'<li>{T(b)}</li>' for b in s['bullets']) + '</ul>')
    if s.get('checklist'): P.append('<ul class="ck">' + ''.join(f'<li>{T(c)}</li>' for c in s['checklist']) + '</ul>')
    if s.get('table'):
        t = s['table']
        P.append('<table><thead><tr>' + ''.join(f'<th>{T(c)}</th>' for c in t['columns']) + '</tr></thead><tbody>' + ''.join('<tr>' + ''.join(f'<td>{T(c)}</td>' for c in row) + '</tr>' for row in t['rows']) + '</tbody></table>')
    if s.get('callout'):
        co = s['callout']; P.append(f'<div class="co"><b>{T(co["label"])}</b> — {T(co["text"])}</div>')
    P.append('</section>')

if d.get('faq'):
    P.append('<section><h2>FAQ</h2>' + ''.join(f'<details><summary>{T(f["question"])}</summary><p>{T(f["answer"])}</p></details>' for f in d['faq']) + '</section>')
P.append(f'<p class="meta">sources: {len(d.get("sources",[]))} · keywords: {len(d.get("keywords",[]))} · brief: {len(d.get("brief",[]))} · resourceCards: {len(d.get("resourceCards",[]))}</p>')
P.append('</div></body></html>')

open(a.out, 'w').write('\n'.join(P))
print('written', a.out)
