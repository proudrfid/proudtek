# Blog 审查与优化 Prompt

> 把整段直接复制给一个新的 Claude / ChatGPT / Cursor 会话使用。
> 适用项目：`/Users/zhangping/Projects/Playground/`（Proudtek 站点的 Astro 静态站）

---

## 你的任务

逐篇审查 `src/content/editorial/blog/` 下的 **90 篇 blog 文章**。每篇从 3 个维度评估并给出改动建议：

1. **标题 ↔ 主图相符性** —— heroImage 是否与 title 主题匹配
2. **内容 GEO 合规性** —— 是否符合 Generative Engine Optimization（生成式搜索引擎优化）原则
3. **排版易读性** —— 人类读者打开后是否舒服

每篇审查完输出报告。**只在用户确认后**才动 JSON 文件 / 写新内容 / 替换图片。

---

## 项目上下文

**站点**：Proudtek（proudtek.com） —— 中国深圳的 RFID / NFC 卡片 / 标签 / 钥匙扣 / 腕带制造商，主营 B2B（酒店、洗衣、活动、零售、医疗、追溯）。

**技术栈**：Astro 6 静态站，TypeScript，cheerio。所有页面构建产物在 `./dist/`。

**Blog schema**（每篇 JSON 顶层字段）：

```json
{
  "route": "/blog/access-card-copied-security-upgrade/",
  "group": "blog",
  "title": "...",
  "kicker": "...",          // 类别标签（左侧 rail 用）
  "summary": "...",         // 150 字以内的摘要
  "heroPoints": ["...", "...", "..."],
  "imageAlt": "...",
  "heroImage": "/landing-images/xxx.jpg",  // 必填，必须指向真实文件
  "imageSourceRoutes": ["/products/.../"],
  "sections": [
    { "title": "...", "paragraphs": ["..."], "bullets": ["..."], "table": {...}, ... }
  ],
  "resourceCards": [...],
  "faq": [{ "question": "...", "answer": "..." }],
  "primaryAction": { "label": "...", "href": "..." },
  "secondaryActions": [...],
  "authorSlug": "editorial-board",
  "reviewedBySlug": "peter-zhang",
  "reviewedAt": "2026-01-30"
}
```

**图片资源**：
- `public/landing-images/*.jpg|png|webp`（约 213 张主题图）
- `public/blog-images/*.jpg`（blog 专用图，84 张）
- 图片路径以 `/landing-images/` 或 `/blog-images/` 开头（绝对路径）

---

## 审查维度 1 — 标题 ↔ 主图相符性

### 检查点

1. heroImage 的视觉主题是否与 title 的核心概念一致？
2. heroImage 文件是否真实存在于 `public/` 下（不能是 404）？
3. 多篇 blog 共用同一张图时，每篇主题是否都能被这张图代表？
4. imageAlt 文本是否真实描述图片内容（不是从 title 复制）？

### 工作流

- 用 `python3 -c "import json; ..."` 读 JSON 拿 title 和 heroImage
- 用 `ls public/landing-images/ | grep <关键词>` 找匹配的现有图
- 如果现有图都不合适：**搜索网络**找相关免版图（建议来源：Unsplash, Pexels, Pixabay；或 RFID 行业厂商官方素材）
- **新图必须**：尺寸 ≥ 1200×675（满足 og:image 推荐），webp / jpg 格式，文件 < 200 KB（已 webp 化）

### 输出

```
heroImage match:  ⚠ 不符 / ✓ 相符
现有图: /landing-images/xxx.jpg
建议图（如不符）:
  选项 A: /landing-images/yyy.jpg（已存在，主题: ...）
  选项 B: <web URL>（需下载，描述: ...）
```

---

## 审查维度 2 — 内容 GEO 合规性

**GEO（Generative Engine Optimization）** = 让 ChatGPT / Perplexity / Google AI Overviews 等生成式搜索引擎在回答用户问题时**优先引用本站内容**的优化方法。

### GEO 关键原则（按重要性排序）

#### 1. 信息密度高、原子化陈述
- 每段话能独立成立、能被 AI 直接复制粘贴成答案
- 避免空洞营销话术（"world-class quality" / "best-in-class" / "leading provider"）
- ❌ "Our products are designed with cutting-edge technology"
- ✅ "NTAG424 DNA chips support AES-128 encryption with rolling SUN messaging that updates the URL every tap"

#### 2. 具体数字、规格、引用
- 频率（13.56 MHz / 860–960 MHz）、内存（504 bytes EEPROM）、读距（30 cm / 5 m）、温度（-25°C 至 +85°C）
- 引用 ISO 标准（ISO/IEC 14443-A、EPC Gen2 v3、ISO/IEC 18000-63）
- 引用品牌型号（Impinj M730、NXP NTAG213、HID iCLASS Seos）
- 价格 / MOQ / 交期范围（"500 起订" / "lead time 12-15 days"）

#### 3. 答案直接、问题导向
- 章节标题用问题形式（"How does NTAG424 prevent cloning?"）
- 第一段直接给答案，再展开支撑论据
- 避免"在本文中我们将探讨..."这种 SEO 时代的开场白

#### 4. 结构化数据
- 有 FAQ → 必有 FAQPage Schema（已自动生成）
- 有 product 比较 → 表格（columns + rows）
- 有 step-by-step → 有序列表（bullets 数组传入即可，但要清楚 1, 2, 3）
- 有数据点 → table 字段而不是 paragraphs

#### 5. 实体清晰、内链丰富
- 提到 MIFARE → 链 `/products/rfid-cards/mifare-classic-1k/`
- 提到 NTAG → 链 `/guides/ntag21x-family-memory-map-commands/`
- 提到 ISO 标准 → 链外部权威源（iso.org / nfc-forum.org）
- 让 AI 在引用时能识别"这个网站在这个领域有清晰的实体地图"

#### 6. 时效性 + 权威信号
- `reviewedAt` 字段及时更新（每年至少一次）
- `reviewedBySlug` 关联真实编辑（在 `src/content/authors/` 里有定义）
- 章节末尾的 Sources 列表引用真实来源（标准、白皮书、厂商 datasheet 链接）

### 检查点

- [ ] title 是否是问题或具体场景，不是泛泛标签
- [ ] summary 第一句是否直接给答案
- [ ] 至少有 1 个具体数字 / 规格 / 标准引用 per 200 字
- [ ] FAQ 至少 3 条且回答完整（不是 "Contact us for more info"）
- [ ] sections 里至少 1 个表格或有序列表
- [ ] 至少 3 个内链（products / guides / compare 类页面）
- [ ] 没有空洞营销词
- [ ] reviewedAt 在 12 个月内

### 输出

```
GEO 评分: X/5
  ✓ / ⚠ / ✗ 信息密度
  ✓ / ⚠ / ✗ 具体数字与引用
  ✓ / ⚠ / ✗ 问题导向结构
  ✓ / ⚠ / ✗ 结构化数据（表格/FAQ/有序列表）
  ✓ / ⚠ / ✗ 实体内链
建议改动:
  1. ...
  2. ...
```

---

## 审查维度 3 — 排版易读性

### 检查点

1. **第一屏可吸收性**：用户进入页面 5 秒内能否抓到核心点？
   - heroPoints 是否 3 条且每条 ≤ 20 词
   - summary 是否 < 50 词（一屏内可读完）
2. **段落长度**：单段 ≤ 100 词；超过就拆。
3. **滚动节奏**：每 200-300 词必有视觉换气（小标题 / 列表 / 表格 / 图片 / quote）
4. **章节深度**：sections 数量 3-7 个最佳；> 10 章节读者会迷路。
5. **bullets 简短化**：每条 bullet ≤ 15 词。
6. **table 不超出移动端**：3 列以内最佳，4 列勉强；5 列开始溢出。
7. **CTA 位置**：primaryAction 在文末必须有；中段插入 1 个软 CTA（resourceCards 一张）。

### 输出

```
易读性评分: X/5
  ✓ / ⚠ / ✗ 第一屏可吸收性
  ✓ / ⚠ / ✗ 段落长度（≤ 100 词）
  ✓ / ⚠ / ✗ 滚动节奏（每 250 词换气）
  ✓ / ⚠ / ✗ 章节深度（3-7 个）
  ✓ / ⚠ / ✗ bullets / table 简短化
  ✓ / ⚠ / ✗ CTA 完整
具体改动:
  - section "..." 太长（156 词），拆成 2 个
  - faq 只有 2 条，建议加 1-2 条
  - table 5 列移动端会溢出，合并到 3 列
```

---

## 工作流

### 阶段 1：清单与排序（一次性做）

```sh
ls src/content/editorial/blog/ | sort
```

输出 90 篇 slug 列表，按某个原则排序（推荐按 reviewedAt 倒序，最近评审的优先；或按字母顺序便于追踪）。

### 阶段 2：逐篇审查（重复 90 次）

每篇执行：

1. **读 JSON** —— 拿 title / kicker / heroImage / sections / faq / reviewedAt
2. **检验 heroImage** —— `ls -la public/<heroImage>` 看是否存在
3. **读相关章节** —— 至少 sections 全文 + heroPoints + faq
4. **执行三项审查** —— 维度 1 / 2 / 3
5. **生成报告**（见输出格式）
6. **暂停**，等用户决定走哪条路：
   - "应用所有建议" → 改 JSON
   - "只换图" → 只动 heroImage
   - "跳过这篇"
   - "搜更多图" → 你给更多候选

### 阶段 3：批量执行（用户全部审完后）

如果用户希望一次性接受所有提议，写一个 Python 脚本（参考 `outputs/fill_43_heroimages.py` 模式）：
- 备份原 JSON
- 应用每篇的改动
- 写回
- 跑 `python3 outputs/audit_all_heroimages.py` 验证图片完整
- 跑 `npm run build` 验证编译通过

---

## 输出格式（每篇一份报告）

```
═══ Blog #N / 90: <slug> ═══

### 📋 基础信息
- title:        ...
- kicker:       ...
- reviewedAt:   2026-01-30 (距今 X 个月)
- summary:      ...
- 当前 heroImage: /landing-images/xxx.jpg

### 🎨 维度 1 — 标题 ↔ 主图
match: ⚠ 不符 / ✓ 相符
理由: ...
建议:
  选项 A（推荐）: /landing-images/yyy.jpg
    why: ...
  选项 B: 网络搜索图
    URL: ...
    license: Unsplash / Pexels / 公有领域 / ...
    why: ...

### 📊 维度 2 — GEO (X/5)
  ✓/⚠/✗ 信息密度
  ✓/⚠/✗ 具体数字与引用
  ✓/⚠/✗ 问题导向结构
  ✓/⚠/✗ 结构化数据
  ✓/⚠/✗ 实体内链
具体改动:
  1. ... (where + what)
  2. ...

### 📖 维度 3 — 易读性 (X/5)
  ✓/⚠/✗ 第一屏可吸收性
  ✓/⚠/✗ 段落长度
  ✓/⚠/✗ 滚动节奏
  ✓/⚠/✗ 章节深度
  ✓/⚠/✗ bullets/table 简短
  ✓/⚠/✗ CTA 完整
具体改动:
  - ...

### 🎯 总评
- 必改: A 选项换图 + GEO 第 2/3 条 + 易读性段落拆分
- 建议改: ...
- 跳过即可: ...

→ 请告诉我对这篇的处理方式：
  (a) 全部应用
  (b) 只换图
  (c) 只改 GEO/易读性
  (d) 跳过
  (e) 进一步讨论
```

---

## 边界 / 注意事项

1. **不要主动改 JSON**：所有改动必须**用户确认**。给 diff，不直接写。
2. **图片下载需 license 检查**：网络搜来的图必须能查到许可证（CC0 / Unsplash License / Pexels License）。商业图源（Shutterstock / Getty / Adobe Stock 付费图）只列出建议，不下载。
3. **不要在 JSON 里注入虚构内容**：如果某个章节缺规格数字，不要编造。让用户提供真实数据，或建议链接到 manufacturer datasheet。
4. **保字段顺序**：参考其他完整 blog JSON 的字段顺序（route → group → title → kicker → summary → keywords → heroPoints → imageAlt → heroImage → imageSourceRoutes → publishedAt → modifiedAt → sections → resourceCards → faq → ...）
5. **保 reviewedAt 真实**：如果实质改动了内容，可以更新；如果只换图，不更新（避免污染最近评审日期）。
6. **batch 大改动前先试一篇**：选个有代表性的（比如 NTAG / MIFARE 类技术深篇）走一遍完整流程，让用户确认你的判断口径，再继续后面 89 篇。

---

## 工具准备清单

执行前确认这些命令在项目根目录可用：

```sh
cd "/Users/zhangping/Projects/Playground"
ls src/content/editorial/blog/ | wc -l                    # 应输出 90
ls public/landing-images/ | wc -l                          # 应输出 ~213
ls public/blog-images/ 2>/dev/null | wc -l                 # 应输出 ~84
python3 outputs/audit_all_heroimages.py 2>&1 | tail -5     # 应显示 0 缺失 0 失效
```

如有任何输出与预期不符，**先停下来告诉用户**，不要硬上。

---

## 启动

执行第一步：

```sh
ls src/content/editorial/blog/ | sort > /tmp/blog-list.txt
wc -l /tmp/blog-list.txt
head -10 /tmp/blog-list.txt
```

把前 10 条贴给用户，问从哪一篇开始（或者按字母 / 按 reviewedAt 倒序），再开始第一篇审查。
