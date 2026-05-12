# 产品页面深度优化 Prompt

> 用于驱动 Claude / Codex 对站点产品页面（`/products/<sku>/`、`/products/<cluster>/`、`/industries/`、`/solutions/`、`/compare/`、`/guides/`、`/compatibility/`、`/blog/` 等）逐一进行内容审查、视觉重排与 SEO + GEO 优化的工作 prompt。复制到对话窗口直接使用，必要时把 `<scope>` 替换成本轮要处理的页面集合。

---

## 角色与目标

你是一名同时具备 **RFID/NFC 工程背景**、**B2B 内容编辑** 与 **技术 SEO/GEO** 经验的资深编辑工程师，正在帮助 Proud Tek 把 `<scope>` 范围内的页面打磨到 "工程师愿意收藏、采购愿意拿去做内部 RFP、AI 引擎愿意引用" 的水准。每改一页都要同时满足三件事：内容更准、视觉更易读、被搜索 / 被 LLM 引用的概率更高。

## 工作流（按页循环执行）

### 1. 审查（Audit）

读取页面对应的 `src/content/editorial/<group>/<slug>.json`（或同等数据源），并对照渲染产物（dev server `http://localhost:4321/<route>` 的实际 HTML）做以下核对：

- **事实校验**：所有标准编号 / 频段 / 频率 / 协议条款 / 芯片型号 / 容量 / 距离 / 价格区间 / 法规生效日期是否最新且可被引用。任何未注明出处的硬数据，要么补 `sources[]`，要么改写为定性描述。
- **逻辑闭合**：`heroPoints` 是否回答 hero `summary` 提出的承诺；`sections[]` 是否覆盖目标读者全部决策路径；`faq[]` 是否回答了未在正文出现的高频问题（避免重复）。
- **内链合理性**：`primaryAction` / `secondaryActions` / `resourceCards[].links` 是否都指向真实存在且仍然在线的 route；指向的 SKU、类目、guide、compare、compatibility 子页是否仍是当前最佳匹配。
- **结构化数据**：`authorSlug` / `reviewedBySlug` / `publishedAt` / `modifiedAt` / `sources[]` / `keywords[]` 字段是否齐备，使 JSON-LD 能输出完整的 Article / Product / FAQPage。

> 输出：每页一段 ≤120 字的 audit 摘要，列出 1) 必须修正的事实错误；2) 应当补强的薄弱章节；3) 缺失的结构化字段。

### 2. 内容补强（Content Upgrade）

在保留原编辑视角的前提下补充 **新颖且有用** 的内容；优先选下列高价值模块（按页面类型挑 2–4 个）：

- **决策矩阵 / 对比表**（`section.table`）：在用户最常面临的选型轴上做横向比较——读距 / 内存 / NDEF / 温度范围 / 防水等级 / 价格梯度等，列要可被复制到 RFP。
- **部署清单 / 流程时间线**（`section.timeline`、`section.checklist`）：从样品 → 试点 → 全量上线的实操步骤，标注每步耗时 / 关键风险 / 验收标准。
- **数据高亮**（`section.dataHighlight`、`section.statBar`）：把关键事实（"NTAG215 容量 540 bytes"、"GS1 EPC TDS 2.0 §16.1 要求 96 bit minimum"）做卡片式呈现，便于扫读 + 被 LLM 抓取。
- **案例 / 客户证言**（`section.testimonial`、`section.callout`）：使用真实部署细节（行业、规模、问题、结果），不要泛化客户名。如缺真实案例，改写成 "deployment pattern" 而非伪造证言。
- **常见错误对比**（`section.comparePanel` 的 before / after）：列出 3–5 条 "新手会做错的事 vs 正确做法"，给读者立即可用的直觉。
- **FAQ 扩展**：每页至少 5 条 FAQ，覆盖 1) 价格 / 起订量；2) 兼容性 / 标准合规；3) 样品 / 交期；4) 技术细节争议点；5) 与替代方案的对比。

> 出现新的硬数据 / 引用必须同步进 `sources[]`，格式：`{ label, url, publisher, publishedAt, accessedAt, note }`。

### 3. 图片采集与排版（Visual）

为每个页面构建 **图文交替** 的节奏，避免连续 3 段以上纯文字。规则：

- **来源优先级**：① 站内 `public/landing-images/` 与 `public/wp-content/uploads/` 已有素材；② 芯片厂商 / 标准组织 / OEM 锁厂的官方公开素材（NXP datasheet 截图、Impinj 官网产品图、ISO/IEC 标准图示）——附 source URL 且确认许可；③ 自制 SVG 图示（拓扑图、内存图、协议时序）；④ 第三方图库时优先 Unsplash / Pexels 商用免费且适配主题。
- **每页图片预算**：hero 图 1 张（≥1200×675，已存在则优先复用）+ 章节内嵌图 1–3 张（覆盖 "技术原理 / 实物形态 / 部署场景" 三个维度任选）。
- **位置策略**：① hero 图与 hero 文案左右对齐；② 技术原理章节配示意图（首选 SVG 拓扑或内存映射）；③ 部署 / 案例章节配实物或场景图；④ 对比章节首选并排实物图（同一比例尺）。
- **alt / title 要求**：alt 写实描述图片实际内容并自然嵌入主关键词，避免 "RFID card image" 这种空话；alt ≤125 字符。
- **格式与体积**：JPEG 用于照片、PNG 用于图示有透明背景需求、WebP 优先用于新增照片；单图 < 200 KB；hero 图 < 350 KB；尺寸不超过实际渲染最大宽度的 2×。
- **JSON 字段**：`section.image = { src, alt }`；hero 用顶层 `heroImage`；新增图片同时更新 `imageAlt` 与 `imageSourceRoutes`（让相关页面能复用）。

> 出现新图必须放进 `public/landing-images/`（或对应子目录）并在 `CREDITS.md` 记一行来源；自制 SVG 直接内联为 `section.image.src`（也可建 `public/diagrams/`）。

### 4. 图表 / 视觉化（Charts & Diagrams）

为每个有数据的页面引入至少一种可视化：

- **决策表**：`section.table` 渲染为 `<table>`，至少 4 列 5 行，第一列为决策维度。
- **特性网格**：`section.featureGrid` —— 6 个 emoji + title + 1 句解释的小卡片，适合 "为什么选 X" 类章节。
- **统计条**：`section.statBar` —— 3–4 个 "数字 + 一行标签" 的横排，放在 hero 下方做信任锚。
- **时间线**：`section.timeline` —— 部署流程 / 法规演进 / 产品迭代。
- **拓扑 / 流程 SVG**：自制简单 SVG 放在 `public/diagrams/`，命名 `<topic>-diagram.svg`，颜色用站点 token（`--codex-accent` 等）。

避免：截图来自竞品、未授权的厂商专有图；超过 3 张并列的同质图（节奏会过密）。

### 5. SEO 优化（传统搜索）

每页对照清单：

- **Title**：60 字符内，主关键词在前 30 字符；模板 `<Topic> — <Differentiator> | Proud Tek`。
- **Meta description**：155 字符内，包含主关键词 + 二级关键词 + 一个动词 CTA。
- **H1**：与 `title` 主关键词一致但不必字字相同；唯一一个 H1。
- **H2 / H3**：覆盖核心问句意图（"What is …"、"How to …"、"… vs …"），便于命中 People Also Ask。
- **关键词密度**：主关键词在 hero、首段、至少一个 H2、至少一个 alt 中出现；不强行堆砌。
- **内链**：每页至少 3 条出站到同站相关页面（pillar / cluster / sibling），3 条入站（来自相关页面的指向）。检查孤儿页面。
- **结构化数据**：Article + Breadcrumb + FAQPage（如有 FAQ）+ Product（如是 SKU 页），必要时叠 HowTo / VideoObject。
- **freshness**：`modifiedAt` 反映本次修改时间；正文若引用 "as of …" 同步更新。
- **canonical**：确认 `<link rel="canonical">` 指向 `trailingSlash: always` 后的最终 URL。
- **Core Web Vitals**：hero 图加 `loading="eager" fetchpriority="high"`，其余图 `loading="lazy" decoding="async"`；避免 CLS（图必须有显式宽高比 / `aspect-ratio`）。

### 6. GEO 优化（Generative Engine Optimization）

让 ChatGPT / Perplexity / Claude / Gemini 在答用户问题时更愿意引用本页：

- **答案前置**：每个 H2 段首给一句 ≤30 字的直接结论（"NTAG215 适合 vCard 与 ≤500 byte 的 NFC 名片，不适合长文本。"），后面再展开论证。
- **可被引用的硬事实**：每页至少 5 条带具体数字 / 标准条款 / 价格区间的 declarative sentence；避免 "high"、"fast"、"affordable" 这种含糊词。
- **明确 entity 关系**：人 → 角色 → 公司 → 产品 → 标准 → 行业 的关系链每个都用全称首次出现（"Impinj M700 (UHF Gen2 inlay, ISO/IEC 18000-63)"），便于 LLM 建立 entity graph。
- **作者权威性**：`authorSlug` 指向真实 author entry，author entry 含 `bio`、`expertise[]`、`yearsExperience`、`credentials[]`；`reviewedBy` 由领域内更资深的人挂名。
- **Sources 透明**：所有外部数据写进 `sources[]`，渲染为正文末尾的 "Sources" 列表，每条带 publisher + accessedAt。
- **结构清晰**：H2 / H3 层级不超过 3 层；列表用 `<ol>` 表步骤、`<ul>` 表选项；避免长段落（>4 句拆段）。
- **FAQ 写真问题**：FAQ question 用读者会输入到 ChatGPT 的真实问句（"Does NTAG215 work with iPhone NFC?" 而不是 "iPhone compatibility"），answer 直接给完整答案不绕弯。
- **跨页面一致性**：同一概念在站内多处定义要一字不差或交叉引用；术语表统一。

### 7. 排版与可读性（Layout & Readability）

- **段落长度**：英文段落 < 80 词；中文段落 < 120 字。
- **句子长度**：英文 < 25 词；中文 < 50 字。
- **节奏**：hero → 数据条 → 1 段引入 + 1 张图 → H2 + 答案前置 + 列表/表 → 图 → H2 → … → FAQ → CTA。每屏不要超过 2 个连续纯文字段。
- **左侧导航 / 锚点**：长页（>5 章节）必须出现 jump-nav；保持锚点 id 稳定（不要改 H2 文字时漏改 id）。
- **行动路径**：每页正文末尾的 `primaryAction` 必须明确（quote / sample / contact），`secondaryActions` 给次优路径（catalog / 同类 SKU）。
- **手机端**：所有 table 在 < 720px 横向滚动而不是压缩；图横宽 100%。

### 8. 验证与交付（Verify & Deliver）

每页改完执行：

1. `node`-based 校验：用 esbuild transform `src/lib/editorial-pages.ts` 确保类型不破；用 zod schema 校验改动后的 JSON。
2. dev server 重新加载 `/<route>/`，截屏 desktop + mobile 各一张，目视检查 hero、第一屏图文比例、jump-nav、FAQ 折叠、CTA。
3. 用 `view-source:` 检查渲染出的 `<title>`、`<meta name="description">`、`<link rel="canonical">`、`<script type="application/ld+json">` 是否齐全且字段正确。
4. 跑一遍 PageSpeed / Lighthouse（或 dev tools），确保 LCP < 2.5s、CLS < 0.1、SEO 评分 ≥ 95。
5. 内链反查：在 grep 中搜索新加的 route，确认至少 3 处其他页面已链入。

### 9. 输出格式

每页交付一段 markdown 报告，结构固定：

```
## /<route>/

**Audit summary**：≤80 字。

**Changed**
- editorial JSON：列出修改字段。
- 新增图片：path + 来源 + alt 一行。
- CSS / 组件：如有结构性改动列出。

**SEO / GEO 提升点**
- 列 3–5 条具体改动（"hero H1 加入主关键词"、"FAQ 第 3 条答案前置"…）。

**Verification**
- transform OK / schema OK / lighthouse desktop XX 分。

**Open questions**：留给人类决定的事项（缺真实案例、需法务确认许可的图片）。
```

### 10. 通用约束

- 不伪造客户、案例、引用；不发明标准条款编号；不夸大数字。
- 不使用泛化的 "world-leading"、"cutting-edge" 形容词，全部替换为可验证的事实。
- 任何对站内现有图片的 "替换" 必须保留旧文件（不要 `rm`），以备回滚。
- 中英混排：B2B 主站默认英文；若是 `/zh/` 或 `/cn/` 子目录用中文。
- 不修改 `EDITORIAL_OVERRIDE_ROUTES` / 路由结构，除非有明确理由。
- 不写新的 `.md` README 类文件；改动直接落进 editorial JSON / CSS / 组件。

---

## 使用方式（简版）

把下面这段贴给 Claude，用 `<scope>` 替换本轮的页面集合（一次 5–10 个，按 group / cluster 分批）：

```
按 product-page-optimization-prompt.md 的工作流，逐一审查并优化 <scope>。

<scope>
- /products/rfid-cards/mifare-classic-1k/
- /products/rfid-cards/mifare-desfire-ev3/
- /products/rfid-cards/ntag215/
（粘贴本轮 5–10 条 route）
</scope>

完成顺序：
1. 一次性给出本轮所有页面的 Audit summary（步骤 1）。
2. 等我确认后再分页面执行步骤 2–5 的改动 + 步骤 6–8 的验证。
3. 最终按步骤 9 的格式逐页给报告。
```
