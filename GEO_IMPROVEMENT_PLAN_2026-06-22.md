# GEO 全面提升计划 — proudtek.com

**日期:** 2026-06-22 · **范围:** 纯 GEO / AI 答案引擎可见性(ChatGPT Search · Perplexity · Google AI Overviews · Gemini · Copilot · Claude)· **基线:** 2026-06-11 全量构建(`dist/` 608 页)+ `src/` 源码审查 · **方法:** 本地代码/产物审查 + 2026 年 GEO 研究对标 · **状态:** 4 组高确定性缺陷已当场修复(§2,改动在工作区未提交)

---

## TL;DR

1. **站内 GEO 基建已是头部水平**——15 家 AI 爬虫显式放行、`llms.txt` / `llms-full.txt`、每页 `/machine/*.json|txt` 机读镜像、10 类 Schema(含 `speakable` / `citation` / `reviewedBy`)、引用纪律好。站内"管道层"几乎没有低垂果实可摘了。

2. **2026 年的研究共识改变了打法。** AI 引用与 Google 排名的重合度已从 ~70% 跌到 **<20%**;真正决定"被不被引用"的是三件事——**链下实体存在(跨平台一致性)、内容可提取性(答案塑形)、新鲜度**。这三项恰好是本站当前最薄弱、ROI 最高的方向,而它们大多**不在**已经做得很好的站内管道层。

3. **本次已顺手修掉 4 组高确定性缺陷**(详见 §2):AI 馈送层残留旧电话/旧门牌(NAP 不一致正好落在 LLM 读取面)、品牌名 `ProudTek` / `Proud Tek` 全站分裂(dist 2,330 处)、作者库领英实体指向分裂、`llms.txt` 的 MOQ 速查句不可读。

4. **仍需你拍板的两类高价值项:** 链下**实体启动包**(Wikidata / Crunchbase / 三大平台档案 → 回填 `sameAs`)与**原创数据资产**(RFID 成本指数等"引用磁铁")。这是后续 90 天 GEO 增长的主战场。

---

## 1. 现状评分卡

| 维度 | 现状 | 证据 | 评级 |
|---|---|---|---|
| AI 爬虫准入 | 15 家显式 `Allow`,含 OAI-SearchBot / ChatGPT-User / Perplexity-User / ClaudeBot / CCBot;`/machine/` 对通用爬虫隐藏、对 AI 放行 | `src/lib/seo-feeds.ts:118` | ✅ 头部 |
| LLM 入口文件 | `llms.txt` + `llms-full.txt` + `site-index.json`,带 Quick facts / Citation guidance / Crawl guidance | `seo-feeds.ts:185` | ✅ 头部 |
| 机读镜像 | 每页 `/machine/{route}.json` + `.txt`,`<link rel=alternate>` 暴露给 AI | `SeoHead.astro:188` | ✅ 罕见的好 |
| 结构化数据 | Organization(`sameAs`/`alternateName`/`foundingDate`/`numberOfEmployees`)、WebSite、WebPage+`speakable`+`citation`、Breadcrumb、Product+`additionalProperty`、Article+`author`+`reviewedBy`+`citation`、FAQPage、ItemList、VideoObject、HowTo | `src/lib/seo/jsonld.ts` | ✅ 头部 |
| 引用纪律 | 平均 ~10 权威来源/页,Article `citation[]` 入 schema(Princeton 研究的最强变量) | 据 2026-06-10 审计 | ✅ 头部 |
| 内容深度 | 中位 ~1,797 词/页,531 页零重复标题/描述 | 据 2026-06-10 审计 | ✅ |
| 答案先行块 | 已有 `.codex-editorial-answer` / `-summary` / `.codex-decision-snapshot`,且 `speakable` 已指向 | `jsonld.ts:212` | ✅ |
| **实体图谱 `sameAs`** | **仅 LinkedIn + YouTube + WhatsApp;无 Wikidata / Crunchbase / 平台档案;且作者库领英 slug 分裂** | `seo-content.ts:175` | ⚠️ **最大短板** |
| **NAP 一致性** | HTML 已统一为 `+86 18665820632` / `A2109` / `#1079`,但旧电话 `15815501857` + 旧门牌 `A2110` **残留于 `llms.txt` / `llms-full.txt` / `site-index.json` / `machine/contact.*`**——正好是 AI 读取面 | dist 实测 5 处 | ⚠️ **已修** |
| **品牌实体名** | 规范名 `Proud Tek` 与无空格变体 `ProudTek` 全站并存 **dist 2,330 处**;作者职称/审稿团队名/部分正文用了无空格变体 | 作者库 + ~30 编辑 JSON | ⚠️ **已修** |
| **内容可提取性/深链锚点** | **正文 H2 全无 `id`**(实测某博客 13 个 H2 全部无锚点)→ AI 无法深链引用具体小节 | dist 实测 | ⚠️ 待办(P1) |
| 定义/术语权威 | 无 `/glossary/`、无 `DefinedTermSet`;定义型查询("what is NTAG215")的引用磁铁缺位 | src 全局无匹配 | ⚠️ 机会(P2) |
| 新鲜度信号 | `dateModified` 已取编辑日期(好),但**无系统化刷新节奏**应对"3 个月引用悬崖" | `seo-feeds.ts:436` | ⚠️ 待办(P1) |
| GEO 监测 | 无跨引擎引用追踪机制 | — | ⚠️ 待办(P2) |

**一句话:** 站内"能不能被抓取、能不能被解析"已经满分;现在的瓶颈是"链下是不是同一个可信实体""内容是不是能被整段摘取""够不够新"。

---

## 2. 本次已实施的速赢(改动在工作区,未提交)

> 全部为低风险、高确定性、可机械验证的修复。涉及内容文件的改动不触碰任何芯片规格/认证/标准声明(遵守 `CLAUDE.md` 事实准确性约束),仅做品牌名与 NAP 归一。

| # | 修复 | 根因与证据 | 验收 |
|---|---|---|---|
| 1 | **AI 馈送层 NAP 收口**:`src/data/pages/contact.json` 及 17 个 `industries` 数据文件中的旧电话 `15815501857`→`18665820632`、旧门牌 `A2110`→`A2109` | `/contact/` 快照描述喂 `buildPageSummary` → 旧 NAP 泄漏进 `llms.txt`/`llms-full.txt`/`site-index.json`/`machine/contact.*`(HTML 已是新值,唯独 AI 读取面残旧)。NAP 一致性是实体识别根基 | 重建后这 5 个馈送文件 `grep 15815501857` = 0 |
| 2 | **品牌实体名归一** `ProudTek`→`Proud Tek`:作者库 6 文件 + `src/content/editorial/**` 正文(职称、审稿团队名、bio、正文提及) | 规范名是 `Proud Tek`(`SITE_NAME`/`og:site_name`/`llms.txt` 标题均如此),但作者职称("Founder & Editor-in-Chief, **ProudTek**")、`Proud Tek Editorial Board`/`Engineering Team`、~30 编辑页正文用了无空格变体 → 实体名分裂削弱知识图谱聚合 | `grep` 仅余 `seo-content.ts` 的 `alternateName` 一处(**有意保留**,作为已知变体喂消歧) |
| 3 | **作者库领英 `sameAs` 对齐**:`editorial-board.json` 的 `linkedin.com/company/proudtek` → 规范 `company/proud-tek-co-ltd` | 与 `ORGANIZATION_SOCIAL.linkedin`(`seo-content.ts:178`)分裂为两个公司页 slug,稀释实体信号 | 全站领英公司 slug 唯一 |
| 4 | **`llms.txt` MOQ 速查句可读化**:`seo-feeds.ts` 的 Quick facts MOQ 行由一句多子句的 run-on 拆为清晰分项 | 原句"100 pcs (stock); 1,000 custom-printed for NFC cards, 500 pcs printed; inlays by the roll…"难解析,违背"干净分块=易被摘取" | LLM 可逐项摘取每个品类 MOQ |

> **提交前必跑:** `npx vitest run -u`(品牌归一会更新 `editorial-pages-integration` 快照,属预期)+ `npm run build` 全量 + 抽查 `dist/llms.txt`、`dist/machine/contact.json` 的 NAP 与品牌名。

---

## 3. P0 — 链下实体与跨平台一致性(最高 ROI)

**为什么是 P0:** 2026 研究显示,**跨平台一致存在 4+ 处的品牌,被 ChatGPT 推荐的概率高 2.8×**;且 AI 引用来源与 Google 排名重合度 <20%,**实体信号比页面排名更决定性**。本站站内 `sameAs` 仅 3 处、且作者领英分裂——这是唯一"站内已极好、却被链下短板拖累"的环节,补齐它收益最直接。

| # | 动作 | 谁来做 |
|---|---|---|
| P0-1 | **三大 B2B 平台名称统一**:Alibaba / Made-in-China / Global Sources 既有账号统一为 `Proud Tek` + `proudtek.com` + `A2109` 地址(喂 Google 品牌图谱 + AI 答案的交叉验证) | 你(2-3h) |
| P0-2 | **创建/认领 Wikidata 实体**:类型 `organization`,补 `instance of` / `country` / `inception 2008` / 官网 / 领英 / 行业。Wikidata 是多数 LLM 实体消歧的根节点 | 你(或我给逐步稿) |
| P0-3 | **Crunchbase 公司档案** + **NFC Forum Adopter 列名**(免费,官网列名=强免费实体信号)+ **Europages** 供应商档案 | 你 |
| P0-4 | **领英公司页统一**到 `proud-tek-co-ltd`(本次已修代码侧分裂;线上确认页面存在) | 你 |
| P0-5 | **回填 `ORGANIZATION_SOCIAL` → `sameAs`**:以上档案一旦建立,把 URL 加入 `seo-content.ts:175`,全站 Organization JSON-LD 自动带上 | 我代做 |
| P0-6 | **NAP 单一事实源守护**:本次已收口 AI 馈送层;后续任何展示 NAP 处只引 `ORGANIZATION_CONTACT`,杜绝再分裂 | 我代做 |

**验收:** 站外 ≥4 个权威档案与站内 NAP/品牌名逐字一致;`sameAs` 从 3 项扩到 ≥7 项;1-2 个月后在 Wikidata/Google 品牌面板可见。

---

## 4. P1 — 内容可提取性与"答案塑形"

**为什么:** Princeton GEO 论文(ACM KDD 2024)实测——**加入统计数据、引用、直接引述可把生成式引擎可见性提升 30–41%**,其中"加统计数据"与"引用可靠外部来源"是单项最强变量。AI 偏好**答案先行、结构清晰、可整段摘取**的内容。本站引用纪律已好,但"可深链 + 数字密度 + 整段可摘"仍有空间。

| # | 动作 | 实现提示 |
|---|---|---|
| P1-1 | **H2/H3 锚点 `id` + `scroll-margin`** | `render-blocks.ts` 两处 `<h2>${title}</h2>`(L49/L82)注入 `id="${slugify(title)}"`;CSS 加 `scroll-margin-top` 适配 sticky 头。**风险:** 改 ~500 页 DOM,会刷 snapshot → `vitest -u`;需去重同名 id。建议批量一次铺开 |
| P1-2 | **"答案先行"块强化**:已有 `.codex-editorial-answer` 首句必须**直接点名+直接回答**,并嵌 1 个硬数据 | `speakable` 已指向这些选择器,放大其价值 |
| P1-3 | **统计/引述密度**:把已有来源升级为**带数字的可摘句**("NTAG215 有 504 字节用户内存"优于"内存较大") | Princeton 最强变量;优先金钱词页 |
| P1-4 | **语义分块**:关键结论独立成短段(2-4 句),便于 LLM 整段摘取;避免把结论埋进长段 | 编辑规范,新页适用 |
| P1-5 | **"Key takeaways / TL;DR"模块标准化**:对比页、指南页顶部统一可摘要点块 | answer-engine 偏好的高摘取率结构 |

**验收:** 抽 20 个金钱词页,每页有锚点 H2、答案块首句直答、≥3 个带数字可摘句;`dist` 中 `<h2 id=` 覆盖率 ≥90%。

---

## 5. P1 — 新鲜度与"引用悬崖"

**为什么:** 2026 年出现明显的**"3 个月引用悬崖"**——超过 ~90 天未实质更新的页面,AI 可见性显著下降。本站 `dateModified` 已正确取编辑日期(非构建时刻),底子好,缺的是**节奏**。

| # | 动作 |
|---|---|
| P1-6 | **季度刷新核心金钱词页**(芯片对比 / 成本 / 兼容)——回填真实增量(新规格、新年份数据)并更新 `modifiedAt`,而非空改日期 |
| P1-7 | **`llms.txt` 增"最近更新"区**:列最近刷新的 N 页,给 Perplexity/Anthropic 这类会读 `llms.txt` 的引擎一个新鲜度抓手 |
| P1-8 | **监测临界页**:被引页一旦接近 90 天未更 → 进刷新队列优先处理 |

**验收:** 核心 ~30 页 90 天内均有真实 `modifiedAt`;`sitemap.xml` `lastmod` 反映真实更新。

---

## 6. P2 — 结构化数据深化

| # | 动作 | 价值 |
|---|---|---|
| P2-1 | **`/glossary/` + `DefinedTermSet`/`DefinedTerm`** | 定义型查询("what is X")的引用磁铁;LLM 极爱摘取干净定义 |
| P2-2 | **`Dataset` schema** 给"RFID 成本指数"等原创数据 | 数据资产=引用磁铁+外链;Dataset 让 AI 识别为可引用数据源 |
| P2-3 | **Product `offers` 决策**:B2B 无价 → 评估去 `offers` 留 `additionalProperty` 规格表,或加 `priceRange`/`priceSpecification.minPrice` | 消除 GSC 报警 + 改善 AI 价格问答可引用性 |
| P2-4 | **作者 `Person` 实体补 `sameAs`**;`reviewedBy` 由 Organization 升级为具名 `Person` | 强化 E-E-A-T 与作者实体可消歧性 |
| P2-5 | **`QAPage`** 用于长尾单问答页(区别于 FAQPage 的多问答聚合) | 对话式查询匹配 |

---

## 7. P2 — GEO 监测与度量(没有度量=盲飞)

| # | 动作 |
|---|---|
| P2-6 | **每周固定 prompt 面板**:10–20 个目标问题 × ChatGPT / Perplexity / Gemini / Copilot / Claude,记录①是否提及 Proud Tek ②引用了哪一页 ③同框竞品(mindrfid 等)。目标问题如 "rfid card manufacturer china"、"ntag213 vs ntag215"、"rfid laundry tag supplier"、"hotel key card compatible with Onity" |
| P2-7 | **引用份额(Share-of-Voice)基线**:首月建基线,之后月度对比 |
| P2-8 | **AI 爬虫日志**:上线后看服务器日志中 GPTBot / OAI-SearchBot / PerplexityBot / ClaudeBot 的抓取频率与覆盖(验证准入策略真实生效) |
| P2-9 | (可选)接入 GEO 监测工具(Profound / LLMrefs 类)做自动化追踪 |

---

## 8. 净新增 GEO 资产(引用磁铁 — 需你拍板素材/预算)

这是 90 天权威建设的主战场,与现有《增长路线图》第四层一致,但**从 GEO 引用角度**重排:

1. **季度《RFID Tag Cost Index》原创数据**(行业定价不透明=引用真空)+ `Dataset` schema → 永久引用磁铁,排名中的成本指南全是咨询公司"猜"的,真工厂发布=唯一权威源。
2. **术语表 `/glossary/`**(50–100 条 RFID/NFC 术语,每条 40–80 词定义)+ `DefinedTermSet` → 定义查询引用磁铁,内链全站。
3. **芯片全家族对照矩阵**(NTAG / MIFARE / UHF 一张表)→ 对比/选型查询的"标准答案"页,GEO 极易整表摘取。
4. **拆解系列**(酒店卡/腕带/洗衣标 macro 实拍)→ 极客与行业博客的自然外链来源(外链=训练数据频次=引用概率)。
5. **证书扫描件 + 编号**(现状纯文字宣称)→ E-E-A-T 实锚,AI 在"供应商可信度"问答中可引用。

---

## 9. 验收与冷启动顺序

1. **合并本次速赢**(§2)→ `vitest -u` 刷快照 → 全量 `npm run build` → 抽查 `dist/llms.txt`/`machine/contact.json` 的 NAP 与品牌名归一。
2. **启动实体包**(§3 P0)——实体信号生效最慢,**最先动手**;建好档案即回填 `sameAs`。
3. **H2 锚点 + 答案块强化**(§4 P1)——一次构建铺开,集中刷一轮 snapshot。
4. **监测面板上线**(§7,每周)——4 周后看引用增量,用数据驱动第二轮内容。
5. **数据资产排产**(§8)——成本指数 + 术语表先行(ROI 最高的两个引用磁铁)。

**优先级总览:** 实体一致性(P0)> 可提取性 & 新鲜度(P1)> Schema 深化 & 监测(P2)> 数据资产(节奏型)。注意:本站的特殊性在于**站内管道已满分**,所以不要再在 `llms.txt`/Schema 上过度投入,重心应果断转向**链下实体 + 内容答案塑形 + 原创数据**。

---

## 参考(2026 GEO 研究对标)

- Princeton 大学《GEO: Generative Engine Optimization》(ACM KDD 2024)——统计/引用/引述使生成式引擎可见性 +30–41%。<https://arxiv.org/html/2311.09735v3>
- Mersel AI《GEO for B2B: The Complete 2026 Guide》——引用由内容质量+可提取性+实体密度+链下信任决定。<https://www.mersel.ai/generative-engine-optimization>
- Omnibound《GEO Statistics 2026》——3 个月引用悬崖;跨平台 4+ 处=2.8× 被荐概率;Schema +67% 可发现性但单独不足。<https://www.omnibound.ai/blog/generative-engine-optimization-statistics>
- Presenc AI《State of llms.txt 2026》& SE Ranking——`llms.txt` 采用率 ~10%,多数 AI 爬虫直抓 HTML;Perplexity/Anthropic 有"温和但可测"的引用提升,Google 明确不支持。结论:保持 `llms.txt` 整洁即可,**不必过度投入**。<https://presenc.ai/research/state-of-llms-txt-2026>
- LLMrefs《GEO: The 2026 Guide》——AI 引用与 Google 排名重合度从 ~70% 跌至 <20%。<https://llmrefs.com/generative-engine-optimization>
