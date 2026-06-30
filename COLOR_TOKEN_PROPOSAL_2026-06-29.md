# 色彩令牌方案草案 — 收编 130 处无令牌裸色

**日期:** 2026-06-29 · **状态:待你审批** · **目标:** 把 `src/styles` 里 130 处"无对应令牌"的裸 hex 收编进 `--codex-*` 体系(`SITE_AUDIT_2026-06-29.md` §二① 的剩余决策项)· **不改 DESIGN.md / tokens.css,直到你批**

---

## 一句话

这 130 处不是失控,而是**两件事**:① 全站没有"白色"令牌(77 处 `#fff`/`#ffffff` 只能裸写);② DESIGN.md 记录的"询盘表单冷色子板"(`--codex-color-accent/-ink`)在实现里**靠裸 hex 补了一堆中间档**(钢蓝文字、冷色边框/卡面),外加几处给现有 teal/forest 令牌配的"深色渐变搭档"。把这些立成令牌即可收编 ~100/130;剩下约 30 处是真一次性色,建议**并入现有令牌或保留**,不为它们单独立牌(过度令牌化本身也是反模式)。

## 关键区分(box-shadow 那一课)

和阴影不同,**色彩可以零回归收编**——只要新令牌的值 = 原裸值,`#fff → var(--codex-surface)` 渲染像素完全一致。所以下面分两类,审批时请分别看:

- **🟢 精确(零回归):** 令牌值 == 原值,纯属"给已有颜色起个名"。无视觉变化,只需你认可命名。
- **🟡 合并(微位移):** 把几个肉眼难辨的近邻值(如 `#f5f9fc`/`#fcfdfe`)收敛到一个令牌。会有 ≤ 几个 RGB 点的位移,需你接受。

---

## 二、建议新增的令牌

### A. 白色(最高 ROI,77 处)🟢

| 提议令牌 | 值 | 角色 | 覆盖 | 类型 |
| --- | --- | --- | --- | --- |
| `--codex-surface` | `#ffffff` | 白色面/卡背景 | `#fff`/`#ffffff` 的 `background` ~33 处 | 🟢 精确 |
| `--codex-text-inverse` | `#ffffff` | 深底上的白字 | `#fff`/`#ffffff` 的 `color` ~40 处 | 🟢 精确 |

> 两者同值、不同语义(背景 vs 反白文字),这是设计系统惯例,便于将来各自微调。**若你嫌多**,可合成单一 `--codex-white: #ffffff` 一锅端——告诉我取哪种。白色 swap 需按属性分流(`color:`→inverse、`background:`→surface),脚本可自动判。

### B. 询盘/采购冷色子板扩展(DESIGN.md 已记此子板,这里补齐它一直裸写的中间档)

| 提议令牌 | 值 | 角色 | 覆盖 callsite | 类型 |
| --- | --- | --- | --- | --- |
| `--codex-color-ink-strong` | `#0a1a2c` | 比 `--codex-color-ink`(#18242c)更深的墨:skip-link 背景、深色 CTA 文字 | components.css:130/316/5380(×3) | 🟢 精确 |
| `--codex-steel-muted` | `#55687a` | 钢蓝次级文字 | components.css:4176/4192/4199(×3) | 🟢 精确 |
| `--codex-steel-subtle` | `#8a949c` | 表单占位/最弱文字 | rfq.css:273/506(×2) | 🟢 精确 |
| `--codex-border-cool` | `#e5e9ed` | 冷色表单边框/分隔线 | rfq.css:96/114/177/235(×4) | 🟢 精确 |
| `--codex-border-cool-light` | `#eef1f4` | 冷色发丝分隔 | rfq.css:317/507(×2) | 🟢 精确 |
| `--codex-surface-cool` | `#fcfdfe` | 冷色卡面 | rfq.css:181/239(×2) | 🟢 精确 |
| `--codex-surface-muted` | `#fafafa` | 中性浅背景(联系页) | pages.css:154/431/512(×3) | 🟢 精确 |

### C. 页面类型令牌的"深色渐变搭档"(与现有 teal/forest 配对)

| 提议令牌 | 值 | 角色 | 覆盖 callsite | 类型 |
| --- | --- | --- | --- | --- |
| `--codex-teal-dark` | `#2c5454` | `linear-gradient(135deg, #2c5454, var(--codex-teal))` 的深端 | components.css:3470 | 🟢 精确 |
| `--codex-forest-dark` | `#1b4332` | forest 渐变深端 | components.css:3482 | 🟢 精确 |

> 这两个本就和 `var(--codex-teal)`/`var(--codex-forest)` 同行出现,立牌后整条渐变全令牌化。

**小计:A–C 共 11 个新令牌,精确收编约 73(白)+ 19 ≈ 92 处,零视觉变化。**

---

## 三、建议"合并"的近邻值(🟡 需你接受微位移)

把这些肉眼难辨的近邻收敛到上面的令牌,再砍掉 ~12 处裸值:

| 原裸值 | 并入 | 位移 | callsite |
| --- | --- | --- | --- |
| `#f5f9fc` / `#fafbfc` / `#f7fafb` | `--codex-surface-cool`(#fcfdfe) | ≤6 RGB 点 | rfq.css:186/244、+2 |
| `#e4e8ed` / `#d6dde3` / `#ddd` | `--codex-border-cool`(#e5e9ed) | ≤8 点 | 各 1 处 |
| `#7a8690` | `--codex-steel-muted`(#55687a) | 较明显(差 ~38 点)→ **或**单立 `--codex-steel-soft` | rfq.css:95/115(×2) |
| `#0d3a2b` / `#1f5f47` | `--codex-forest-dark`(#1b4332) | 中等 | components.css:631 渐变 |

> `#7a8690` 与 `#55687a` 差得不算小,我倾向**给它单立 `--codex-steel-soft: #7a8690`**(回到 🟢 精确)而非硬并。你定。

## 四、建议"并入现有令牌或保留"——不单独立牌(避免过度令牌化)

约 30 处真一次性色,逐个立牌得不偿失:

- **暖色奶油面** `#faf8f4`/`#fbf7ee`/`#f0eee9`/`#f7efe1`/`#ece2cd`(各 1 处)→ 并入现有 `--codex-bg-warm`(≈#f8f6f1,🟡 微位移),或保留。
- **暖色深棕** `#1e150b`/`#3a2a16`/`#3d2a14`(各 1,渐变端/背景)→ 可保留,或新增 `--codex-dark-deep`(若你觉得值得)。
- **暖色棕褐文字/边** `#d4c5b0`/`#c8b89e`/`#f0e8dd`(各 1)→ 保留或并 `--codex-gold-muted` 系。
- **通用灰** `#000`(1)/`#999`(1)/`#555`(1)→ 分别并 `--codex-text-strong`/`--codex-border`/`--codex-text-muted`(🟡)或保留。
- **零散冷色** `#163b5c`(深navy,1)/`#0f6a7a`(teal文字,1)/`#eef5fa`(masthead 头部底,2)/`#eef4f7`(1)→ 量小,保留或并入 B 组最近邻。
- **品牌例外** `#25d366`(WhatsApp 绿)→ **保留**(品牌识别色);若想入册可叫 `--codex-brand-whatsapp`。

---

## 五、落地步骤(批准后,我来做)

1. 按你拍板的命名/取值,把新令牌加进 `src/styles/codex-tokens.css` 的 `:root`(分组注释,和现有风格一致)。
2. 用此前那套**注释/字符串遮罩 + var 回退跳过**的安全脚本,逐文件把裸值 swap 成 `var(--token)`;白色按属性分流(color→inverse、background→surface)。
3. `lint` + `vitest` 闸门;`git diff` 自查;🟢 项保证零视觉变化,🟡 项单独列出供你截图验收。
4. 同步更新 `DESIGN.md` 颜色表 + `SITE_AUDIT` 收尾(CLAUDE.md:DESIGN.md 须与 tokens.css 对齐)。

## 六、影响面

| | 处理 | 裸值收编 |
| --- | --- | --- |
| A 白色 | 2 令牌 | ~73 |
| B 冷色子板 | 7 令牌 | ~19 |
| C 渐变搭档 | 2 令牌 | ~2 |
| 三、合并 | 折入上列 | ~12 |
| 四、并入现有/保留 | 0 新牌 | ~24(其中 #25d366 有意保留) |

**≈ 11 个新令牌吃掉 ~106/130 处裸色;余 ~24 处并入现有令牌或有意保留。**

---

## 需你决定的 4 件事

1. 白色:语义双牌(`--codex-surface` + `--codex-text-inverse`,推荐)还是单一 `--codex-white`?
2. `#7a8690`:单立 `--codex-steel-soft`(🟢 零回归,推荐)还是并入 `--codex-steel-muted`(🟡)?
3. 第三/四节的 🟡 合并项:**全做**(最干净,~36 处全收)/ **只做零回归 🟢**(最稳,留近邻原样)/ **逐项挑**?
4. `#25d366` WhatsApp 绿:保留裸值 / 立 `--codex-brand-whatsapp`?

你勾完我就加令牌 + 跑 swap + 验证。
