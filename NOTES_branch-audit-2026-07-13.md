# 分支审计 2026-07-13

基准:origin/main @61f4c99d(#1660,今晨 fetch)。本地 234 分支 / 远端 655。
结论:记忆中"15 个核心分支 UNPUSHED"已大面积过时——page-geo 四组(products 2-7 批、compare、case-studies、markets)、solutions CTR(#1660)、blog-transform/fable/port 等 70+ 分支**均已合并上线**。剩余情况如下。

> **更新(07-13 晚):A 组 5/5 全部合并上线——#1661 GA4 / #1662 batch-1 / #1663 wash-cycle(Claude 经 Chrome 代点 squash)/ #1664 shrinkage / #1665 walmart。本地 main 已快进到 9861a358,审计闭环。远端 fix/wash-cycle-standards 分支可在 GitHub 上删除(合并页有 Delete branch 按钮)。工作区归位时 switch 一度失败,后经全量核查确认现已无任何阻挡(skills 本地副本与 main 逐字节一致,read-tree 干跑的 README-zh 报错是其严格模式误报;误留的 index.lock 已清)。**

## A. 真正待上线 — 5 个分支,全部验证 clean(main 未动过其文件,零冲突)

| # | 分支 | 内容 | 文件 | 状态 |
|---|------|------|------|------|
| 1 | `fix/ga4-generate-lead-event` | RFQ+内联表单补发 GA4 标准 generate_lead(转化度量收官) | 2(+17 行) | **本地未推 ★最高优先** |
| 2 | `page-geo/products-batch-1` | 门禁/酒店线 6 页 GEO 重建(wood-card/epoxy/metal-keyfob/assa-abloy/magstripe/custom-printing)——唯一漏合并的批次 | 18 | 已推,未开 PR/未合并 |
| 3 | `fix/wash-cycle-standards` | 全站水洗次数标准纠正(~60 处);CI drift 恰 1 条为 owner-approved 预期 | 24 | 已推,未合并 |
| 4 | `blog-transform/rfid-retail-shrinkage-reduction-data` | 零售缩水数据文 transform(voice+7 SVG) | 8 | 本地未推 |
| 5 | `blog-transform/walmart-rfid-tagging-mandate` | Walmart mandate(guides 路由)transform | 8 | 本地未推 |

在 Mac 上执行(zsh):

```
git push origin fix/ga4-generate-lead-event
git push origin blog-transform/rfid-retail-shrinkage-reduction-data
git push origin blog-transform/walmart-rfid-tagging-mandate
```

开 PR:

- https://github.com/proudrfid/proudtek/compare/main...fix/ga4-generate-lead-event
- https://github.com/proudrfid/proudtek/compare/main...page-geo/products-batch-1
- https://github.com/proudrfid/proudtek/compare/main...fix/wash-cycle-standards
- https://github.com/proudrfid/proudtek/compare/main...blog-transform/rfid-retail-shrinkage-reduction-data
- https://github.com/proudrfid/proudtek/compare/main...blog-transform/walmart-rfid-tagging-mandate

注:2、3 可能已有 open PR,先在 GitHub Pulls 页确认再开新的。

## B. 勿再合并 — SUPERSEDED(约 55 个)

以下分支的目标文件**已被后来合并的 transform 重写**,现在合并会把线上内容倒退回旧版:

- `blog-voice/*` 全部剩余 ~30 个(1 文件/个的 rollout 尾部)
- `page-voice/*` 全部 16 个
- `blog-transform/pps-vs-silicone-vs-textile-laundry-tags`、`blog-transform/silicone-vs-fabric-vs-tyvek-wristbands`(残余 1 文件均为旧版 JSON)
- `blog-fable/rfid-hotel-keycard-cost-comparison`(被 blog-transform 同名分支取代,后者已合并)
- `blog-batch/3pl-walmart-event-cosmetics`(29 文件中 28 已在 main,残余为旧版 SKILL.md)
- `blog-transform/nfc-card-clone-security-prevention`(残余为旧版 seo-feeds.ts;当前 HEAD 停在此分支)
- 6 月杂项:`seo/staging-noindex`、`image-audit/fitness-franchises-hero`、`image-audit/hero-fix-google-review-uhf`、`fix/hub-content-width`、`fix/image-audit-broken-image-paths`(后者有 1 个 credit json 仍可干净应用,在意可单文件 cherry-pick,默认弃)
- 5 月 chip-specs 尾部:`chip-migration-wedge-tag-2026-05-24`、`chip-specs-batch-zhangping-*`×4、`chip-specs-migration/*`×3、`chip-specs-phase5-batch-1`、`zhang-phase4-batch5-*`、`cs-1107-rebase`、`data/chip-specs-phase2-batch2-*`、`clean-auto/linen/ops-*`×3

## C. 工作区 769 条"改动"是假象

HEAD 停在已合并的旧分支 `blog-transform/nfc-card-clone-security-prevention` 上:

- 修改的 132 个跟踪文件中 **125 个与 origin/main 逐字节一致**
- 613 个未跟踪 blog SVG 中 **599 个与 origin/main 一致**
- 7 个删除文件在 main 里同样已删
- 真实差异仅 7 文件 + 14 SVG,内容恰好就是 A-4/A-5 两个未推分支 + B 中已取代的 pps/tyvek 旧版

⚠ 直接 `git switch main` 会失败(2026-07-13 已验证):本地 main 落后 origin/main 116 个提交,旧 main 里那批 SVG 与工作区不一致所以拒绝覆盖;同时 132 个 tracked 脏文件也挡 switch;`git pull --ff-only` 在旧分支上跑只会输出 "Already up to date"。

**✅ 已完成(07-13 晚,Claude 在沙盒代执行)。** 最终生效的方法:

```
git symbolic-ref HEAD refs/heads/main
git reset --hard
```

过程记录与教训:`git switch --discard-changes` 连续两次失败的真正原因是——**switch/checkout 对"在途未跟踪文件"(checkout 需要写的路径上已有未跟踪文件)一律拒绝,与内容是否一致无关**;`--discard-changes` 只丢弃已跟踪文件的改动,不清未跟踪障碍(`git checkout -f` 才会)。最先挡路的是 `.claude/skills/blog-fable/README-zh.md`(与 main 逐字节一致仍被拒)。`symbolic-ref` 移 HEAD 不碰工作区,`reset --hard` 让索引+工作区强制等于 main,一次成功(更新 8146 文件)。

stash 已全部清零(07-13 深夜):backup-2026-07-13 三文件核实为被线上覆盖的旧版→丢弃;更老的 layout WIP stash 核实后——luxury-bags SVG 改造部分已全部在 main,唯一未上线的 3 行 columns 布局实验已移植为 **`industries/20-verticals-columns @ c3467317`**(基于最新 main,顶替原空壳分支;注意 renderer 尚未实现 columns,想上线需先在 EditorialArticle 实现;想备份到远端:`git push origin industries/20-verticals-columns`)。3 个指向已销毁沙盒路径的死 worktree 元数据已清(`git worktree list` 现仅剩主工作区)。`err.log`、`__wtest` 等垃圾已删;剩余 9 个 `??` 残留:4 个 `*-PREVIEW.html`(内容已上线,预览已过时可删)、`GROWTH_DIAGNOSIS_2026-07-11.md`、`PRODUCTS_PAGE_BACKLOG_2026-07-11.md`、`.compare-voice-snapshot/`、本文件——按需处置。

## D. 可选:分支大扫除

本地空壳/已进 main(安全删):

```
git branch -D _tmp_eufmd about/factory-hero-photo add-cosmetics-page content/cosmetics-rfid-fun-version industries/20-verticals-columns
git branch -D phase2-batch2-cards-wristbands phase5-jewelry-tag-compare-label zhang-session-batch4-pr1-noop
git branch -D worktree-agent-a0817ac254c6b3182 worktree-agent-a231571482894c062 worktree-agent-a48f00c9675401f3b worktree-agent-a717693860f7179c5
git branch -D worktree-agent-a8b421b9b014aa659 worktree-agent-a8ccb5bdf399719dd worktree-agent-ae226b67c1ba42e38 worktree-agent-af475b6a4867b796a
git branch -D worktree-chip-migration-batch-2026-05-26 worktree-chip-specs-batch-zhangping-1 blog-voice/access-card-cloning blog-voice/item-level-rfid-cosmetics-authentication
```

B 组 SUPERSEDED 分支确认放弃后同样 `git branch -D`(需先 `git switch main` 离开当前 HEAD 分支)。其余已合并的 blog-transform/page-geo 分支留着无害。
