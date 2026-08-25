# Products 迁移计划(2026-08-24 启动)

蓝图依据:`docs/rebuild-blueprint-2026-08-15.md` PR-05/PR-06。URL 与 SEO 合同
冻结原则不变;本文件只记录现状测绘与分阶段执行路径。

## 现状测绘(2026-08-24,C1 批次落地时点)

| 路由面 | 数量 | 渲染路径 | 处置 |
|---|---|---|---|
| `/products/{family}/{slug}/` 嵌套商品详情 | 189 | **EditorialPageLayout**(编辑管线) | ✅ C1 已注册原生化 |
| `/products/{family}/` 家族索引 | 6 | EditorialPageLayout | ✅ C1 已注册 |
| `/products/all/` 目录网格 | 1 | SnapshotLayout → **C2 已原生化**(壳级接缝,正文标记原样保留) | ✅ |
| `/products/*/page/N/` 分页 | 4 | 重定向存根(meta refresh) | ✅ C2 已随迁 |
| `/product/{slug}/` 单数别名 | 51 | SnapshotLayout,**canonical 全部指向 /products/\*\*\*,noindex 别名存根** | 🔒 冻结(URL 合同) |
| 特例:standard-rfid-wood-card、rfid-wooden-keyfob | 2 | SnapshotLayout(json 存在但未挂载编辑定义) | 🔍 单独排查 |

关键事实:`mergeCatalogPages()`(`src/lib/catalog-pages.ts`,2060 行)在构建期
合成目录页并注入 siteData;商品详情正文早已是 `EditorialArticle` 组件树,
"products 迁移"从来不是从 WP 正文重写开始——只差路由注册与目录网格。

## C1 —— 详情页与家族索引原生化(本批,已完成)

- 注册表新增 194 条嵌套详情 + 6 条家族索引(canary 总量 335 → 531 输出)
- 回填 65 页缺失的 `publishedAt=2026-06-11`(全部已有 modifiedAt 或无
  authorSlug → **零可见署名变化**,无需设计审批)
- 剔除误注册的 `/products/all/` 与 2 个非编辑特例页
- 门禁:322 测试、canary 524 markers / 540 hubs PASS、合同 default==flagged;
  因日期回填刷新 dist-baseline 并重冻合同基线

## C2 —— `/products/all/` 目录网格(已完成,2026-08-25)

唯一真正的工程活,对应蓝图 PR-06 的 ProductFamilyPage/SkuPage composer 思路:

1. 从现有 WooCommerce 快照网格提取数据形状(卡片字段:图/名/chip/链接),
   固化为结构化数据(可先由 catalog-pages.ts 派生,不必新建 content collection)
2. 新建 `CatalogGrid` 组件(codex tokens,DESIGN.md 约束),`/products/all/`
   走 HomePageLayout 同款 native 分支模式;`PROUDTEK_CATALOG_V2` 旗标已就位
3. 分页 4 页随网格同一 composer 输出(canonical/self 关系保持不变)
4. 验收:main-DOM 合同、image-sitemap 相等、595 输出零意外漂移、移动端抽屉
   实机检查(人工项)

风险:woo 网格内嵌排序/筛选 DOM 钩子(rail.ts 注释提到 facet-filter 计数 pill
依赖),迁移时需保住 PageScript 的行为绑定;建议先做 DOM 钩子清单再动手。

## 冻结与后续小项

- `/product/*` 51 页:noindex+canonical 别名,保持现状;若未来要真 301 重定向,
  走独立的 SEO 变更评审,不在本工程范围
- 2 个 wood 特例页:确认其 json 为何未挂载(疑似 `_pillar.json` 相关逻辑),
  属内容修复而非壳迁移

## C3 —— 尾货批(已完成,2026-08-25)

`/faq/` 与 `/contact/`(枢纽)经 SnapshotLayout 原生分支接入。**原生化定格
538/595(90%)**,其余冻结理由:

| 路由面 | 数量 | 冻结原因 |
|---|---|---|
| `/product/*` 别名 | 51 | 无 `<main>` 元素;noindex 别名,canonical 已冻结 |
| `/2024/*`、`/2025/*` 旧链接 | 5 | 同上,无 main 的旧 WP 模板 |
| `/rfq/` | 1 | 本就是纯 codex 渲染(rfq.astro + BaseLayout),非快照页 |
| `/`(首页 v2) | 1 | PR-04,待视觉方向批准 |
| `/404/` | 1 | 错误页,保持现状 |

每阶段验收门与全站一致:全测试、lint/check、chip 双门禁、三树构建、
site-contract、native-shell canary 审计、线上抽验。
