#!/usr/bin/env python3
"""page-geo dispatcher — live scan of origin/main for the next optimization
targets, with per-page GAP PROFILE (exactly what the page is missing).

The gap profile drives the pass: 图N → add SVG diagrams to the floor
(hero+2); FAQ n → extend to >=6 per the products playbook; 来源 n → add
primary sources for external facts; NK字符 → sections are thin, rebuild or
extend with tables. Completeness rubric matches gates.md (0-10, target >=8).

Self-maintaining: merged improvements score above the threshold and drop
off automatically — no static punch list to go stale.

Usage (run `git fetch origin main` first):
  python3 .claude/skills/page-geo/scripts/next.py                # products, top 10
  python3 .claude/skills/page-geo/scripts/next.py --group compare --top 6
  python3 .claude/skills/page-geo/scripts/next.py --all-groups
  python3 .claude/skills/page-geo/scripts/next.py --include-fixtures --include-claimed
"""
import argparse, json, re, subprocess, sys
from collections import Counter

# Full-page snapshot fixtures (editorial-pages-integration.snapshot.test.ts):
# changing any of these REQUIRES regenerating the .snap in a clean
# origin/main worktree (vitest -u) and shipping it with the branch.
SNAPSHOT_FIXTURES = {
    'lp/rfid-tag-wholesale', 'industries/luxury-brands',
    'compare/google-review-nfc-card-vs-nfc-sticker',
    'guides/icode-slix-chip-encyclopedia',
    'blog/case-study-restaurant-group-nfc-review-cards-google-reviews-320-percent',
    'products/rfid-keyfobs/rfid-wooden-keyfob',
}
GROUPS = ['products', 'compare', 'markets', 'lp', 'case-studies', 'industries']


def sh(*args):
    return subprocess.run(args, capture_output=True, text=True).stdout


def score(doc):
    secs = doc.get('sections', [])
    chars = sum(len(json.dumps(s, ensure_ascii=False)) for s in secs)
    imgs = sum(1 for s in secs if s.get('image')) + (1 if doc.get('heroImage') else 0)
    faq, src = len(doc.get('faq', [])), len(doc.get('sources', []))
    sc = ((2 if len(secs) >= 5 else 1 if len(secs) >= 3 else 0)
        + (2 if chars >= 8000 else 1 if chars >= 3000 else 0)
        + (2 if imgs >= 3 else 1 if imgs >= 1 else 0)
        + (1 if faq >= 4 else 0) + (1 if src >= 2 else 0)
        + (1 if doc.get('brief') else 0)
        + (1 if len(doc.get('keywords', [])) >= 4 else 0))
    gaps = []
    if imgs < 3: gaps.append(f'图{imgs}')
    if faq < 4: gaps.append(f'FAQ{faq}')
    if src < 2: gaps.append(f'来源{src}')
    if chars < 8000: gaps.append(f'{chars//1000}K字符')
    if not doc.get('brief'): gaps.append('无brief')
    if len(doc.get('keywords', [])) < 4: gaps.append('keywords不足')
    return sc, gaps


def claimed_files(repo):
    """Files genuinely touched by in-flight branches.

    Uses merge-base diffs — `git diff origin/main <stale-branch>` on an
    old-base branch reports hundreds of phantom files (main moved on) and
    once mass-claimed 40 pages. merge-base..branch = only the branch's own
    edits. Claims self-release: after a branch merges, its pages score
    above the threshold and drop off the list anyway."""
    files, slug_tokens = set(), set()
    local = [b.strip('* ').strip() for b in sh('git', '-C', repo, 'branch', '--list',
             'page-geo/*', 'fix/*', 'page-polish/*').splitlines() if b.strip()]
    for b in local:
        base = sh('git', '-C', repo, 'merge-base', 'origin/main', b).strip()
        if not base: continue
        for f in sh('git', '-C', repo, 'diff', '--name-only', base, b).splitlines():
            if f.startswith('src/content/editorial/'):
                files.add(f.replace('src/content/editorial/', '').replace('.json', ''))
    for line in sh('git', '-C', repo, 'ls-remote', 'origin',
                   'refs/heads/page-geo/*', 'refs/heads/fix/*').splitlines():
        name = line.split('refs/heads/')[-1]
        slug_tokens.add(name.split('/')[-1])
    return files, slug_tokens


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', default='.')
    ap.add_argument('--group', default='products', choices=GROUPS)
    ap.add_argument('--all-groups', action='store_true')
    ap.add_argument('--top', type=int, default=10)
    ap.add_argument('--threshold', type=int, default=7)
    ap.add_argument('--include-fixtures', action='store_true')
    ap.add_argument('--include-claimed', action='store_true')
    ap.add_argument('--json', action='store_true')
    a = ap.parse_args()

    groups = GROUPS if a.all_groups else [a.group]
    claimed, remote_slugs = claimed_files(a.repo)
    rows, skipped = [], Counter()
    for g in groups:
        ls = sh('git', '-C', a.repo, 'ls-tree', '-r', '--name-only', 'origin/main',
                f'src/content/editorial/{g}').splitlines()
        for f in [x for x in ls if x.endswith('.json')]:
            rel = f.replace('src/content/editorial/', '').replace('.json', '')
            if rel.endswith('_pillar') or rel.endswith('index') or rel.endswith('/all'):
                continue  # hubs/catalog pages score low by design — not content leaves
            raw = sh('git', '-C', a.repo, 'cat-file', '-p', f'origin/main:{f}')
            try: doc = json.loads(raw)
            except Exception: continue
            sc, gaps = score(doc)
            if sc > a.threshold: continue
            slug = rel.split('/')[-1]
            flags = []
            if rel in SNAPSHOT_FIXTURES:
                flags.append('SNAPSHOT-FIXTURE')
                if not a.include_fixtures: skipped['fixture'] += 1; continue
            if rel in claimed or slug in remote_slugs:
                flags.append('CLAIMED-BY-BRANCH')
                if not a.include_claimed: skipped['claimed'] += 1; continue
            rows.append({'score': sc, 'page': rel, 'route': doc.get('route', f'/{rel}/'),
                         'gaps': gaps, 'flags': flags})
    rows.sort(key=lambda r: r['score'])
    if a.json:
        print(json.dumps({'targets': rows[:a.top], 'remaining_total': len(rows),
                          'skipped': dict(skipped)}, ensure_ascii=False, indent=1))
        return
    if not rows:
        print(f'NO_TARGETS_REMAIN — {"/".join(groups)} 组已无 ≤{a.threshold} 分页面'
              f'(skipped: {dict(skipped)})。向用户报告,勿强找目标。')
        return
    print(f'{len(rows)} 页待改(≤{a.threshold}分,已剔除 {dict(skipped) or "0"} 个占用/fixture)。前 {min(a.top, len(rows))}:\n')
    for r in rows[:a.top]:
        print(f"  [{r['score']}分] {r['page']}")
        print(f"        缺口: {', '.join(r['gaps'])}   线上: https://proudtek.com{r['route']}")
    print(f'\n批次约定: 6 页/批,分支名 page-geo/<group>-batch-N(单页则 page-geo/<slug>),'
          f'preview-only 先出稿;fixture 页须随分支更新 .snap(gates.md)。')
    if len(rows) <= 8:
        print('FEW_TARGETS_REMAIN — 尾部已短,建议这一批收尾后向用户确认是否收官。')


if __name__ == '__main__':
    main()
