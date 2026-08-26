# GEO 改造计划 — 2026-08-25

基于两轮引用实证分析(5 家 GEO 强被引站 + 5 大厂)的改造路线图。

## Phase 1 — 已完成(本轮)

### ① 元描述商务信号注入(`src/lib/seo.ts`)
- `withCommerceSignal()`:product 类页面元描述缺失商务信号时,追加经核实的工厂直供事实
  ("500-piece MOQ per chip type"、"written quotes and lead times held before tooling"——均为站点
  about/lp 原文声明的忠实压缩,零编造)。
- 注入同时作用于 meta description 与 Article schema description,保持一致。
- 效果:**24 → 210 / 532** 页携带可被 AI 引擎摘抄的商务信号。

### ② GEO 可摘取性审计工具(`scripts/geo-extractability-audit.mjs`,npm run audit:geo)
报告型工具(CI 永不失败),量化五维并输出四份 punch list:
FAQ schema 覆盖、描述答案式、商务信号、compare Verdict 段、定义句首段。

### 当前基线(Phase 1 完成时)

| 维度 | 数值 |
|---|---|
| FAQPage schema 覆盖 | 512/532 |
| 描述答案式 | 400/532 |
| 商务信号 | **210/532**(原 24) |
| compare Verdict 段 | 6/28 |
| 定义句式摘要 | 450/499 |

## Phase 2 — 已完成(2026-08-25 第二轮)

### 任务① compare 页 Verdict 段:6/28 → **28/28**
22 页全部按 NFCFYI 骨架补写(title 含一句式答案 + intro 带具体数字 + 3 条
Choose-X-when 要点)。所有事实取自各页既有 heroPoints/intro,零新声明;
chip 引用沿用页面已有占位符。

### 任务③ 弱元描述处置
抽样后发现原 132 个多数为**启发式误报**(叙事钩子与品牌主语句被误判)。
处理方式是修正 `audit:geo` 判定(定义式主谓句、品牌+事实句、数字句均视为合格),
而非破坏性重写好文案。修正后 answer-shaped 400→440,definition-first 450→**499/499 满格**。
残余 92 个弱描述经人工抽查均为合格的编辑风格钩子(如 "Yes — a phone really can
kill a hotel keycard"),属文体多样性——记录为审计已知局限,**不追代理指标满格**。
真实重复描述仅 2 对(2024 归档页 vs product 页,x52 的分页/重定向存根不可索引,无 SEO 影响)。

### 任务④ 缺 FAQPage 的 20 页分类
- **A 类·无需 FAQ(9)**:/blog/ /case-studies/ /compare/ /glossary/ /guides/
  /solutions/ /compatibility/ /rfq/ /tools/rfid-tag-cost-estimator/ —— 索引/交易/工具页,
  无问答语义。
- **B 类·合成分类 hub(11)**:compare 类目 ×4(chip-vs-chip、form-factor-material、
  frequency-tech、reader-vs-reader)+ guides 类目 ×7。可加 1-2 条采购 FAQ,
  需动合成逻辑或 json 覆盖 → 记为可选 Phase 3 增强。

## Phase 2 完成后基线

| 维度 | Phase 1 | Phase 2 |
|---|---|---|
| FAQPage 覆盖 | 512/532 | 512/532(A 类豁免) |
| 描述答案式 | 400/532 | 440/532(余 92 为合格叙事体) |
| 商务信号 | 210/532 | 210/532 |
| compare Verdict | 6/28 | **28/28** |
| 定义句式摘要 | 450/499 | **499/499** |

## Phase 3 — 可选后续

1. B 类分类 hub 加采购 FAQ(需合成逻辑改造)
2. 多语言镜像(es/pt/ar/de,范围待定)
3. 2 对重复描述差异化(2024 归档 vs product 页)

---

以下为 Phase 1 时的原始规划(保留备查):

## Phase 2 — 待人工决策(原始版)

1. **compare 页补 Verdict 段(22 页)**:内容撰写工作,NFCFYI 式骨架(Overview→Key Differences→
   Technical Comparison→Use Cases→Verdict)。可与 page-voice 流程结合。
2. **多语言镜像**:NFCFYI 每个语言版本被独立引用。候选 es/pt/ar/de;范围需定
   (仅 compare+glossary ≈ 60 页起步 vs 全量)。涉及 hreflang 基建。
3. **132 个弱元描述**:逐页改写或规则化生成,需抽样审阅质量。
4. **20 个缺 FAQPage 页面**:先分类(utility 页无需 FAQ vs 产品页确实缺失)。
5. **49 个非定义句式摘要**:与 3 有重叠,合并处理。
