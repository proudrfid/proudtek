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

## Phase 2 — 待人工决策

1. **compare 页补 Verdict 段(22 页)**:内容撰写工作,NFCFYI 式骨架(Overview→Key Differences→
   Technical Comparison→Use Cases→Verdict)。可与 page-voice 流程结合。
2. **多语言镜像**:NFCFYI 每个语言版本被独立引用。候选 es/pt/ar/de;范围需定
   (仅 compare+glossary ≈ 60 页起步 vs 全量)。涉及 hreflang 基建。
3. **132 个弱元描述**:逐页改写或规则化生成,需抽样审阅质量。
4. **20 个缺 FAQPage 页面**:先分类(utility 页无需 FAQ vs 产品页确实缺失)。
5. **49 个非定义句式摘要**:与 3 有重叠,合并处理。
