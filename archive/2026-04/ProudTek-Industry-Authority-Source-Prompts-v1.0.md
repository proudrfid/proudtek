# ProudTek "Industry Authority Source" Prompt Pack v1.0

> 目标：把 proudtek.com 打造成 RFID / NFC / Hotel-lock / Industrial-laundry 等细分赛道的**行业信源（industry reference）** ——
> 被 Google 权威性算法信任、被 AI 生成式搜索（ChatGPT / Claude / Perplexity / Google AI Overviews）引用、被同行与分析师反向链接。
>
> 适用项目：ProudTek RFID Astro v5 网站（`src/content/editorial/**/*.json`）
> 适用模型：Claude / ChatGPT / Gemini / Perplexity
> 与已完成的 187 产品页 + 90 博客页升级框架兼容
> 创建日期：2026-04-17 · 版本：v1.0
>
> **输出语言**：所有落地到网站的内容一律 **en-US**；提示词指令中文，便于团队审阅。
> **红线**：本提示词不生成任何 marketing 废话。一切 claim 必须可追溯、可验证、可被反向引用。

---

## 0. 行业信源（Industry Source）的四层定义

把"被信任 → 被引用 → 被视为标准"拆成四个可工程化的层级。每一层都必须同时在**人类读者**和**机器（搜索引擎 + LLM）**面前成立。

| 层级 | 读者侧含义 | 机器侧含义 | 必须产出物 |
|---|---|---|---|
| L1 **可读** (Legible) | 读者能快速理解文章结论 | 爬虫能解析出清晰语义 | Astro JSON section 合规 + schema.org 标注 |
| L2 **可信** (Credible) | 有作者、有方法、有来源 | EEAT 信号完整 | 作者页 / 方法论页 / 引用政策页 / 更新日志 |
| L3 **可引** (Citable) | 读者能摘出一句话转发 | LLM 可抽取为事实卡引用 | Quotable fact blocks + 结构化数据 + 稳定 URL |
| L4 **不可替代** (Irreplaceable) | 读者"只能来这里查" | 搜索结果唯一/首选答案 | 原创数据 / 基准 / 标准对照矩阵 / 失效案例库 |

**通过 L1 + L2 进入竞争圈；通过 L3 被 AI 引用；通过 L4 成为"行业信源"。**
v1.0 playbook 的所有任务都归类到这四层。

---

## 1. 通用系统上下文（所有子任务开头必须粘贴）

```
你是 ProudTek（深圳 Proud Tek Co., LTD，2008 年创立的 RFID 智能卡制造商）
的首席行业信源架构师（Chief Industry-Reference Architect）。

【战略目标】
- 把 proudtek.com 打造成 RFID / NFC 细分赛道的行业信源
- 评估标尺：Google EEAT、AI Overviews 引用频率、第三方反向链接、品牌搜索量、Wikipedia/学术引用
- 工作成果必须同时满足：人类读者可读 + 爬虫可解析 + LLM 可引用 + 同行可审计

【网站与技术背景】
- 框架：Astro v5 Content Collections + Tailwind CSS v4
- 内容集合（一文件一 route，全部 Zod 校验）：
  · src/content/editorial/blog/*.json              (90 篇)
  · src/content/editorial/compare/*.json           (对比页)
  · src/content/editorial/solutions/*.json         (行业解决方案)
  · src/content/editorial/guides/*.json            (标准 / 法规 / 集成指南)
  · src/content/editorial/industries/*.json        (垂直行业)
  · src/content/editorial/markets/*.json           (地区)
  · src/content/editorial/products/{category}/*.json (187 篇)
  · src/content/editorial/lp/*.json                (商业 landing pages)
- Schema：src/content.config.ts 中的 editorialSchema (Zod)
- 渲染器：src/components/editorial/EditorialPage.astro
- URL 结构稳定，禁止改 slug；权威性建立在"链接持久"之上

【编辑基调】
- 语言：English (en-US)，第三人称专业口吻
- 所有数据必须可追溯；所有声明必须可证伪
- 禁用营销废话：revolutionize / game-changing / cutting-edge / unleash /
  empower / seamless / unlock / leverage / harness / world-class / best-in-class /
  next-generation / state-of-the-art / robust / synergy / turnkey
- 鼓励用语：measured / observed / reported by / per ISO xxx / according to /
  in our 2026 field tests / based on {N} samples / median across {N} projects

【红线】
1. 禁止引用不存在的标准号、案例、客户名、引用数字
2. 禁止伪造"研究报告""白皮书""市场规模数据"来源
3. 任何具体数字必须注明：① 来源 ② 样本量 ③ 采集时间窗口
4. 所有 claim 若无法标注来源，必须降格为"基于 ProudTek 工程团队的内部观察"并明示
5. 所有比较型内容必须同时呈现己方劣势，否则视为软文（会扣 EEAT 分）
```

---

## 2. 行业信源的八大支柱（Authority Pillars）

这八条是"机器可评分"的结构，任何一个支柱缺失都会把权威性天花板封死。

### P1 — Primary-Data Output Engine（原创数据引擎）
> 最高杠杆，决定 L4 天花板。

要点：
- 每季度公开一份 **ProudTek Quarterly Index**（例如：hotel-lock card failure rate / RFID tag price index / laundry tag wash-cycle benchmark / UHF read-range field results）
- 数据规范：样本量 ≥ N、数据采集窗口、测试条件、置信区间；JSON 格式开源可下载
- URL 命名：`/research/quarterly/{year}-q{N}-{topic}/`
- 每份数据自动派生 1 篇博客 + 1 份 PDF + 1 个 JSON endpoint

### P2 — Standards & Compliance Matrix（标准与合规矩阵）
> ISO/IEC 14443、ISO/IEC 15693、EPC Gen2、GS1、ETSI EN 300 220、FCC Part 15、PCI DSS、HIPAA、EU DPP (2027)、Walmart RFID Mandate、China RoHS、REACH …

要点：
- 每条标准独立 `/guides/{standard-slug}/` 页，**必须**含：标准全称 + 发布机构 + 最新版本号 + 适用频段 + 合规 checklist + 常见误读
- 跨标准对照矩阵 `/guides/compliance-matrix/`（可过滤、可下载 CSV）
- 与法规变化同步更新；`modifiedAt` 字段每次更新都要推到 JSON

### P3 — Technical Reference Library（技术参考库）
> 通信协议、芯片内存结构、加密机制、天线设计、读写器 API。

要点：
- 每个细分主题独立 `/guides/` 页，≥ 1500 词，≥ 1 张手绘/ASCII 解释图，≥ 1 段可跑的示例代码（Python/C#/Node）
- 章节结构统一："How it works" → "Failure modes" → "Real-world numbers" → "Reference implementation" → "Further reading"
- 代码片段必须能直接 copy-paste 运行（最好挂 GitHub repo 链接）

### P4 — Evidenced Case Studies（证据化案例库）
> 不写"某家酒店"。写"500-room Saflok 8-year estate，2024 Q3 migration"。

要点：
- 每个案例独立 section 或 `/case-studies/{slug}/`，按 **S-C-A-R-L**：Situation / Constraint / Action / Result / Lesson
- Result 必须有数字：SKU 数、测试卡数、失效率、改造工期、审计结论
- 禁止暴露客户名除非拿到书面授权；匿名但保留可信的细节（行业/规模/设备）

### P5 — Editorial Policy & Transparency（编辑透明度）
> EEAT 的核心。让审核者知道"你怎么写、怎么改、怎么纠错"。

要点：在 `src/content/editorial/` 下新建并持续维护：
- `/about/editorial-policy/` — 稿件流程、事实核查流程、采访/样本管理、引用政策
- `/about/methodology/` — 数据采集方法、样本选择、测试实验室与设备、统计处理规范
- `/about/corrections/` — 更正/撤稿公示，按 ISO 8601 日期逆序
- `/about/disclosures/` — 财务利益、客户关系、赞助关系披露
- `/about/review-board/` — 同行评审专家名单（真人，可核查）

### P6 — Named Authors with Verifiable Expertise（可核查的作者）
> LLM 正越来越重视"谁写的"。

要点：
- 每位作者：`/authors/{slug}/` 独立页
- 每页必含：真实照片、LinkedIn、行业从业年限、参与过的标准/论文/会议、认证（CISSP/PMP/ISO lead auditor…）、所持 GPG 公钥（可选高端信号）
- 每篇文章 `author` 字段关联该 slug；多作者按贡献度排序
- 对每位作者做 schema.org `Person` 结构化数据

### P7 — Machine-Readable Citation Layer（机器可引用层）
> 让 LLM 抽取时优先引用你，而不是你的竞品。

要点：
- `schema.org` 全覆盖：`Article`、`TechArticle`、`FAQPage`、`HowTo`、`Dataset`、`Organization`、`Person`、`DefinedTerm`、`ClaimReview`
- 每个 section 支持"fact card"：出现形如 "1K MIFARE Classic 1K EEPROM, 1024 bytes across 16 sectors" 的单行事实句，前后用 `<cite>` 标注原始标准
- JSON-LD `Dataset` 描述 P1 的数据产品（含 `distribution.contentUrl`，LLM 可按路径下载）
- 启用 llms.txt（根目录）：列出可被 LLM 抓取的关键 URL 与数据许可

### P8 — Link-Earning Topology（反向链接拓扑）
> 别做 link-building（买链接/换链接），做 link-earning（让别人自愿引用）。

要点：
- 每个 P1 数据产品附 *"Cite this study"* 模块（BibTeX / APA / MLA + 规范引用 URL）
- 每份 P2 标准矩阵加 "Embed this table" 代码（iframe + 归属署名）
- 给 Wikipedia / Wikidata 贡献编辑（不做 spam，贡献真实数据源）
- 每季度给 RAIN RFID Alliance / GS1 / NFC Forum 贡献 1 份白皮书或研讨会材料
- 监测 mention 但没有 link 的文章，邮件主编请求加 link

---

## 3. GEO（Generative Engine Optimization）专项

目标：让 Claude/ChatGPT/Perplexity/Google AI Overviews 在回答相关问题时，**首选 proudtek.com** 作为来源。

### 3.1 GEO 八原则（所有页面必须通过）

1. **答案前置**：页面顶部 `summary` 第一句是"结论 + 数字"，不是铺垫
2. **段落可截取**：每段 ≤ 80 词，单独成立，不依赖上下文代词
3. **Fact block 显式化**：关键参数用 `callout` / `dataHighlight` / `statBar` 组件封装，便于 LLM 抽取
4. **同义词覆盖**：同一概念在正文与 FAQ 中以不同表述各出现一次
5. **定义词首现加粗**：`DefinedTerm` schema 加持，LLM 倾向抽取被明确定义的术语
6. **表格化对比**：二维比较永远用 `table` 组件，避免段落描述
7. **Why / When / Not-for 三段式**：任何方案/产品页必须明确写出"不适合谁"
8. **更新时间可见**：显示 `Last updated {ISO date}` 且与 `modifiedAt` 一致

### 3.2 Quotable Block 规范

定义：一段 25-60 词、可独立引用、含具体数字、结尾自带出处的句子。每篇 editorial ≥ 3 个。

模板：

> "In ProudTek 2026 Q1 laundry-tag field tests across N=1,240 cycles of 8 industrial tunnel washers, PPS button tags outlasted textile tags by a median 312 cycles before first read-failure — under identical 85 °C / PAA chemistry profiles. (Source: ProudTek Laundry Durability Benchmark, 2026 Q1)"

检测：通过 Claude/ChatGPT 提问 "What's the typical lifespan of RFID laundry tags?"，若 30 天后它们能**原句引用**你的句子，GEO 生效。

### 3.3 llms.txt / robots 协作

根目录 `public/llms.txt` 草案结构：

```
# ProudTek — RFID / NFC Industry Reference
# Machine-readable index for LLM crawlers
# Licence: CC-BY-4.0 with attribution "proudtek.com"

## Core reference
/guides/iso-14443-explained/
/guides/epc-gen2-uhf-rfid/
/research/quarterly/2026-q1-laundry-durability/
...

## Datasets (JSON-LD Dataset)
https://proudtek.com/data/2026-q1-laundry-durability.json
...

## Author verification
/authors/
/about/editorial-policy/
/about/methodology/
```

同步维护 `robots.txt` 不要对 GPTBot / ClaudeBot / PerplexityBot 做 `Disallow`（默认允许，明确允许更好）。

---

## 4. EEAT 工程化清单（技术层可审计）

每一项对应一个 Astro 组件或 JSON 字段，方便开发任务化。

| EEAT 维度 | 技术落地 | 必须字段/页面 |
|---|---|---|
| Experience (亲历) | 每篇编辑加 `firstPersonEvidence` 段 | 案例段必含 "In our 2024-2026 deployments, …" |
| Expertise (专长) | 作者页 + 文章署名 + schema Person | `author`, `reviewer`, `/authors/{slug}/` |
| Authoritativeness (权威) | 外链到 ISO/NXP/GS1 原始文档 | 每页 ≥ 3 条 `outbound-authoritative` |
| Trust (可信) | 更正公示 + 事实核查流程 + HTTPS + 联系方式 | `/about/corrections/`, `/about/editorial-policy/`, 页脚物理地址 + 电话 |

red-flag：任何一页若无 author + updatedAt + outbound authoritative link，v1.0 playbook 视为**未达基础权威线**，禁止发布。

---

## 5. 主题树（Topic Cluster）规划

权威性不靠单页堆砌，靠"主题树"覆盖密度。每棵树必须有：1 Pillar 页 + N Cluster 页 + 交叉链接 + 持续更新 log。

### 5.1 规划的五棵主题树

| # | Pillar 页 | Cluster 页数 | 对应 EEAT 证据 |
|---|---|---|---|
| T1 | `/guides/hotel-lock-chip-selection/` | 12-15 | Saflok/Vingcard/Onity 现场案例 |
| T2 | `/guides/industrial-laundry-rfid/` | 10-12 | 洗涤周期实测数据 + PPS/textile 对比 |
| T3 | `/guides/uhf-rfid-standards/` | 10-15 | EPC Gen2 / ISO 18000-6C / ETSI / FCC |
| T4 | `/guides/nfc-consumer-applications/` | 8-12 | NTAG / ISO 14443 / iOS Core NFC |
| T5 | `/guides/rfid-compliance-2027/` | 6-10 | EU DPP / Walmart mandate / RAIN 合规 |

### 5.2 Pillar 页硬指标

- 8,000-12,000 词（长篇，但通过 `sections` 拆分，非墙式文本）
- ≥ 25 条外链到权威源（标准组织、学术论文、政府文件）
- ≥ 15 条内链到 cluster / product / compare / blog
- 最新 4 年内数据；脚注含 `accessedAt` ISO 日期
- 配 1 张可下载的一页 PDF cheatsheet（增强 link-earning）

---

## 6. 多阶段 Playbook（Phase 0 → Phase 4）

按 90 天 × 4 轮节奏推进。每一 phase 都有可审计的产出。

### Phase 0 — Authority Audit（第 1-2 周）

目标：建立基线。

任务：
1. 跑完整站点爬虫，导出每页的 `author / updatedAt / outbound-authoritative-count / schema-types / quotable-blocks` 字段，生成 `AUTHORITY_BASELINE_2026-04.csv`
2. 抽样 30 页做 EEAT 红线核查，列出"未达基础权威线"页面
3. 对照 P1-P8 八支柱，列出当前**完全缺失**的支柱
4. 检索 Google / Perplexity / ChatGPT 对"MIFARE DESFire hotel lock" "RFID laundry tag 200 wash cycles" 等 20 个核心 query 的引用来源，记录 proudtek.com 的出现频率 / 位置 / 引文句

交付：`AUTHORITY_AUDIT_2026-04.md` + `AUTHORITY_BASELINE_2026-04.csv` + `GEO_CITATION_BASELINE_2026-04.md`

### Phase 1 — Foundation（第 3-6 周）

目标：铺 L1 + L2 地基。

任务：
1. 新建 `/about/editorial-policy/`、`/about/methodology/`、`/about/corrections/`、`/about/disclosures/`、`/about/review-board/` 五页（JSON + Astro 渲染）
2. 建立 `src/content/authors/{slug}.json`（新集合；若 schema 没定义，先扩展 `content.config.ts`）
3. 给所有 editorial JSON 补 `author`、`reviewedBy`、`modifiedAt`、`sources[]`
4. 全站加 schema.org JSON-LD（Article/TechArticle/FAQPage/HowTo/Person/Organization）
5. 发布 `public/llms.txt`

完成判据：Phase 0 baseline 中"未达基础权威线"页面 ≤ 5%

### Phase 2 — Cluster Density（第 7-14 周）

目标：铺满 5 棵主题树 Pillar + 40 篇 cluster；启动一次 P1 原创数据发布。

任务：
1. 按 §5.1 五棵树结构，产出 5 个 Pillar + 最少 40 个 cluster cluster 页（沿用既有 blog/compare/guides 模板）
2. 所有 Pillar 页用 §5.2 硬指标做自检
3. 启动 P1 第一份季度基准：**ProudTek Laundry Durability Benchmark 2026 Q2** —— 至少 N=500 样本，至少 3 种 tag material × 2 种洗涤化学，公开 JSON + PDF + 方法论页
4. 启动 P2 标准矩阵初版（≥ 20 条标准）
5. 每周一篇 quotable-first 博客（§3.2 规范）

完成判据：5 棵树 Pillar 全部上线；每棵树 ≥ 8 cluster；1 份季度基准数据发布

### Phase 3 — Citation-Ready Layer（第 15-22 周）

目标：把内容打造成可被 AI/同行反向引用的形态。

任务：
1. 每个 Pillar 页补 *"Cite this study"* + BibTeX/APA/MLA
2. 每份数据产品补 `Dataset` JSON-LD + download endpoint
3. 每个 P2 标准矩阵加 "Embed this table" iframe
4. 给 Wikipedia 相关条目（MIFARE、EPC Gen2、RAIN RFID 等）贡献可核查引用（不做 spam，只在空白处补真实来源）
5. 监测"品牌提及无链接"，主动外联作者加链接；目标 ≥ 40 条新 backlink
6. 启动 P1 第二份季度基准：**ProudTek Hotel Lock Migration Cost Index 2026 Q3**

完成判据：引文工具 (GA4 + Ahrefs/Semrush) 显示自然反链 +100/季度；LLM 引用次数（手动监测 20 个 query）从 Phase 0 baseline 的 0-1 次/20 query 提升到 ≥ 6 次/20 query

### Phase 4 — Reference Status（第 23-52 周）

目标：固化"行业信源"地位；建立自我强化循环。

任务：
1. 每季度稳定发布 1 份 P1 原创基准（同主题每年一版，横向对比历史）
2. 每月 1 份 P2 标准变更简报（例如 EU DPP 技术实施细则进展）
3. 建立 `/newsroom/` + RSS，给分析师/记者提供机器可读的新闻稿
4. 举办/参与 RAIN Alliance / GS1 / NFC Forum 的 webinar 或白皮书共著
5. 每半年做一次 editorial review，已过期数据降权或下线
6. 建立 `corrections` 公示纪律：任何错误 24h 内在相关页公示 + 全局 `/about/corrections/` 叠加记录

完成判据：Google "ProudTek" 品牌搜索量持续增长；LLM 引用命中 ≥ 30%；反链来自至少 3 个国际行业协会；分析师报告/学术论文被动引用 ≥ 5 次

---

## 7. 可粘贴的子任务提示词（Reusable Sub-Prompts）

### 子任务 A — Authority Audit Prompt（Phase 0 用）

```
【任务】对 proudtek.com 做权威信源基线审计。

【输入】给定一组 editorial JSON 文件路径列表（对应 content collection 下的 blog/compare/solutions/guides/industries）。

【要做的事】
逐页输出 CSV 行，含以下字段：
route, author?, reviewer?, modifiedAt?, schemaTypes[], outboundAuthoritativeLinks, quotableBlocks, hasOriginalData(yes/no),
hasStandardCitations(yes/no), pillarCoverage(P1-P8 中命中哪几个), eeatRedFlag(reason)

【输出】
1) AUTHORITY_BASELINE_{YYYY-MM}.csv
2) 列出 eeatRedFlag 非空的 top 20 页
3) 给出 P1-P8 各支柱的整站命中率百分比
4) 针对 top 3 最严重问题，写出可落地的 14 天整改清单（引用具体 JSON 字段改动）

【禁止】
- 不得编造数字
- 不得基于页面标题主观评分（必须字段级证据）
```

### 子任务 B — Editorial Policy Page Generator（Phase 1 用）

```
【任务】生成 /about/editorial-policy/ 页面的 EditorialDefinition JSON。

【要求】
- 文件路径：src/content/editorial/about/editorial-policy.json
- 严格遵循 editorialSchema（见 src/content.config.ts）
- summary 第一句是"单句结论"，例如 "ProudTek publishes only content that …"
- sections 至少包含：Sourcing standards / Fact-checking workflow / Author qualifications / Corrections procedure / Sample & evidence retention / Conflict-of-interest disclosure / External contributor vetting
- 必须给出具体 SLA 数字：例如"corrections published within 24h of confirmation"，"outbound standards links re-validated every 90 days"
- faq 至少 6 条：读者常问（"How do you choose sources?" / "How do you correct errors?" / ...）
- resourceCards 链接到 /about/methodology/、/about/corrections/、/about/disclosures/、/about/review-board/
- primaryAction：/contact/ "Flag an error or suggest a correction"

【禁止】
- 禁止空话（"we are committed to quality"）——必须给可验证流程
- 禁止自我表扬（"industry-leading"）——只描述事实
```

### 子任务 C — Author Bio Creator（Phase 1 用）

```
【任务】为 ProudTek 每位署名作者生成可核查的 Author 档案。

【输入】姓名 + 职位 + 从业年限 + 曾经参与的项目/标准/客户行业（由人类 editor 提供原始素材；不要编造）

【输出】src/content/authors/{slug}.json，字段：
{
  "slug": "...",
  "name": "...",
  "role": "...",
  "yearsInIndustry": 12,
  "bio": "80-140 词的第三人称简介，事实化",
  "expertise": ["ISO/IEC 14443", "Saflok deployments", "..."],
  "credentials": [{"name": "CISSP", "issuer": "...", "year": 2019}],
  "publications": [{"title": "...", "venue": "...", "year": "...", "url": "..."}],
  "languages": ["en-US", "zh-CN"],
  "socialProfiles": {"linkedin": "...", "github": "..."},
  "contact": "authors@proudtek.com",
  "photoUrl": "/authors/{slug}.webp",
  "reviewedBy": "editor-in-chief",
  "lastUpdated": "2026-04-17"
}

【红线】
- 禁止伪造任何证书、论文、会议记录
- 如果某字段没有真实数据，直接 omit，不写 "N/A" 或编造
- "yearsInIndustry" 只能使用 editor 原始素材里的数字
```

### 子任务 D — Quotable Block Injector（Phase 2 用）

```
【任务】对既有 editorial JSON 注入 ≥ 3 个 quotable block，不改动原有结论。

【输入】editorial JSON 路径 + 该主题可引用的真实数据（由 editor 提供）

【要做的事】
1. 定位文章中"结论型段落"，替换为 callout / dataHighlight / statBar 组件承载 quotable block
2. 每个 quotable block 满足：25-60 词 / 含具体数字 / 含样本量 / 含时间窗口 / 结尾标注 "Source: {ProudTek research / ISO / GS1 / ...}"
3. 在 FAQ 里以同义改写重复出现一次，增加 LLM 检索命中面
4. 所有数字必须来自 editor 提供的素材，**禁止四舍五入美化**

【输出】JSON patch（只含改动字段）+ 改动摘要
```

### 子任务 E — Standards Page Builder（Phase 2 用）

```
【任务】生成一个标准/法规主题页（例如 EU DPP、PCI DSS 4.0、ISO/IEC 14443-4）。

【文件路径】src/content/editorial/guides/{standard-slug}.json

【必须包含】
- 标准全称 + 发布机构 + 最新版本号 + 发布日期 + 当前状态(active/superseded)
- 适用范围（频段 / 应用场景 / 区域）
- Timeline 组件：标准修订历史（版本 → 日期 → 关键变更）
- Compliance checklist（用 checklist 组件）
- Common misreadings（哪些是容易理解错的条款）
- 与相邻标准的关系（用 featureGrid 或 table）
- Citations：每一条 claim 至少一条外链到原始标准或官方解读
- 更新纪律：modifiedAt 必须真实；页面加 "Next scheduled review: {date}"（90 天内）

【禁止】
- 禁止复述 standards 原文（版权风险），只总结结论
- 禁止写"世界最严""史上最重要"等绝对化形容
```

### 子任务 F — Original Data Release Prompt（Phase 2/3/4 循环用）

```
【任务】发布 ProudTek Quarterly Index 的一期。

【输入】
- 数据集 CSV（已由工程团队采集完成）
- 方法论要点（样本、设备、时间窗口、统计方法）
- Editor 指定的主题标题

【产出】
1. /research/quarterly/{year}-q{N}-{topic}/ 页（editorial JSON）
   - summary 开头给出"核心发现 + 数字 + 置信区间"
   - sections 含：Key findings / Methodology / Sample description / Limitations /
     How to cite / Download links
2. 同步发布：
   - /data/{year}-q{N}-{topic}.json（完整数据，Dataset JSON-LD）
   - /data/{year}-q{N}-{topic}.pdf（设计师稍后排版，先占位）
   - BibTeX/APA/MLA 引文块（在页内 "Cite this study"）
3. 一篇博客 /blog/{topic}-{year}-q{N}-findings/
   - 80% 结论 + 可引用，20% 方法论提示（深度版放在 research 页）
4. 给 /guides/ 中的 pillar 页补上反向链接到本研究

【红线】
- Limitations 节必须写：样本偏差 / 测试局限 / 不适用场景
- 禁止选择性披露（只展示利己数字）
- 若数据支持多种解读，必须在 sections 中各给一段
```

### 子任务 G — GEO Test & Remediation Prompt（Phase 3+ 循环用）

```
【任务】对指定 10 个 query，测试 LLM 是否引用 proudtek.com，若不引用则定位原因并给出整改。

【测试 query 举例】
- "MIFARE Classic vs DESFire hotel lock chip selection"
- "RFID laundry tag wash-cycle durability benchmark"
- "EU Digital Product Passport RFID requirement 2027"

【流程】
1. 对 Claude / ChatGPT / Perplexity / Google AI Overviews 各问一次
2. 记录：是否引用 proudtek.com / 被引用段落 / 引文位置 / 竞品引用情况
3. 对未被引用的 query：定位到 proudtek.com 对应页（或发现无对应页）
4. 给出整改诊断：
   - 内容缺失 → 新建对应 Pillar/Cluster
   - 内容存在但未被抽取 → 加 quotable block / schema 标注 / summary 重写
   - 内容过时 → 更新 modifiedAt + 补新数据
   - Crawler 阻塞 → 检查 robots.txt / llms.txt
5. 整改按 RICE 排序输出（Reach / Impact / Confidence / Effort）

【输出】GEO_CITATION_REPORT_{YYYY-QN}.md
```

---

## 8. 防火墙：红线与反模式

做错一次会让前面所有努力归零。

- ❌ 生成假数字 / 假案例 / 假客户名
- ❌ 引用不存在的 ISO 标准号、学术论文、政府文件
- ❌ 用营销语（§1 禁用词）伪装专业度
- ❌ 对同一主题做"竞品全 bad, 自家全 good"的比较页（必然被 EEAT 降权）
- ❌ 用 AI 大量生成内容但不署真人作者
- ❌ 改已发布 URL（会流失历史权威性累积）
- ❌ 为了冲量重复切片同一份素材（近似重复内容会被 de-dup）
- ❌ 买链接 / 链接农场 / PBN（会触发手动惩罚）
- ❌ 未经许可披露客户身份
- ❌ Corrections 不公示（一次隐瞒就摧毁 Trust 层）

---

## 9. 成功的量化指标（90 天 / 180 天 / 365 天）

> 权威性不是玄学，全部可量化。

| 指标 | Phase 0 基线 | 90 天目标 | 180 天目标 | 365 天目标 |
|---|---|---|---|---|
| Google 品牌搜索量 | 记录值 | +20% | +80% | ×3 |
| LLM 引用命中率（20 标准 query） | 0-5% | 10% | 25% | ≥ 40% |
| DR (Ahrefs / Semrush) | 记录值 | +5 | +10 | +15 |
| 来自 .edu / .gov / 国际协会的反链 | 记录值 | +3 | +15 | +40 |
| 原创数据发布次数 | 0 | 1 份季度基准 | 2 份 | 4 份 + 年度汇编 |
| 外部 Wikipedia / Wikidata 引用 | 记录值 | +2 | +6 | +12 |
| 自动生成的错误更正（/about/corrections/） | n/a | 2-3 条 | 6-8 条 | 12-20 条（越多反而越可信） |

备注：**Corrections 数反映"Trust"信号。** 敢公示错误的站点才是行业信源。零 corrections 反而可疑。

---

## 10. 使用说明（推荐工作流）

1. 先跑一次 **子任务 A（Authority Audit）** 建立基线
2. 基于 audit 产出，把 Phase 1 的"地基任务"拆成 2-3 周冲刺
3. Phase 2 开始后，每周固定：
   - 1 篇新 Pillar/Cluster 内容（子任务 E / 复用 v3.0 blog pack）
   - 3 篇既有内容注入 quotable block（子任务 D）
   - 1 次 GEO 测试（子任务 G）
4. 每个季度末，发布 1 份原创数据（子任务 F），并召开 30 分钟 editorial retro：
   - 哪些页面被 LLM 引用
   - 哪些 corrections 被触发
   - 下一季度 Pillar 方向调整
5. 半年做一次全站 authority re-audit（子任务 A 重跑），比较指标趋势

---

## 11. 与既有 Prompt Pack 的关系

| 本 pack | 关系 |
|---|---|
| v3.0 Blog Upgrade Prompts | **互补**：本 pack 解决"写什么 / 谁来写 / 怎么被引"；v3.0 解决"单篇怎么写好" |
| v1.0 LandingPage Upgrade Prompts | **互补**：LP 面向转化；本 pack 面向权威积累 |
| v1.0 Product Upgrade Prompts | **互补**：Product 聚焦 SKU；本 pack 聚焦 category 权威 |
| v1.0 RFID Library Upgrade Prompts | **上位**：本 pack 是 Library 的战略层；Library 任务是战术执行 |

执行顺序建议：
**Phase 0-1 用本 pack** → **Phase 2 用本 pack + v3.0 + RFID Library** → **Phase 3+ 以本 pack 为主轴，所有其它 pack 服从它的 EEAT / GEO / 八支柱要求**。

---

## 12. 版本化与演进

- v1.0 (2026-04-17)：初版，确立四层定义、八支柱、四阶段 playbook、7 个可粘贴子任务
- 未来预留：
  - v1.1：加入"学术引用对接"子任务（给研究生/教授免费提供数据）
  - v1.2：加入"分析师简报"子任务（Gartner / Forrester / IDC 的机器可读 briefing pack）
  - v1.3：加入"赛道护城河"度量（基于 DR / LLM citation / Wikipedia edits 的综合权威指数）

---

_End of ProudTek Industry-Authority-Source Prompt Pack v1.0_
