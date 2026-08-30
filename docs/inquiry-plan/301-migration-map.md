# 站群归一:proudrfid.com → proudtek.com 301 迁移方案(T1)

> ⚠️ **状态更新(2026-08-30):proudrfid.com 由第三方优化,我方无管辖权。**
> 本文档的 Stage-1/Stage-2(涉及老站服务器的部分)**搁置**;
> `redirects-stage2.csv` 保留为休眠资产,若未来获得老站管辖权可重启。
> proudtek.com 自身旧版遗产的重定向由自有主机承担,不在此限制内
> (见 legacy-inheritance-2026-08-30.md,已实施 /product/* 共 51 条 +
> 语言首页 4 条,来源 route-overrides.ts)。

## 现状实测

- 老站 5,814 URL(18 个子 sitemap),仍在收录与排名;新站 520 URL。
- 命名体系完全不同:老站按芯片型号平铺(`mifare-desfire-ev1-rfid-white-card`),
  新站为精选结构化目录(`/products/rfid-cards/mifare-desfire-ev3-card`)。
- **结论:1:1 映射不存在,采用「芯片族归并 + 类目枢纽承接」两阶段策略。**

## Stage-1(GSC 精调,第 1-4 周)

从 proudrfid.com 的 Search Console 导出**有曝光/点击的 Top 300 页面**,
逐条映射到新站最接近页(产品→族内最新代产品页;文章→对应博客/指南)。
这一步必须在拿到 GSC 数据后做——把有限的重定向额度花在真正有权重/流量的页面上。

## Stage-2(规则版,已产出)

见同目录 `redirects-stage2.csv`(3,108 条,基于芯片族/类目规则自动生成):

| 目标枢纽 | 条数 |
|---|---|
| /products/rfid-cards | 1,096 |
| /products/rfid-readers | 642 |
| /products/rfid-wristbands | 480 |
| /products/rfid-labels | 413 |
| /products/rfid-tags | 225 |
| /products/rfid-keyfobs | 155 |
| 族内具体产品页(ev3/ntag424/ultralight/icode/em4100/plus) | 97 |

剩余 ~2,700 条(top-search/sm/多语言程序化页等):**不建议 301**——
这些是门页型内容,批量重定向会连带传递低质信号;让它们随老站自然 410/退场。

## 实施要点(在 proudrfid.com 的 WordPress 端操作)

1. 用 Redirection 插件(或 nginx/CDN 层)导入 CSV;批量前先导 20 条验证。
2. 301 一律指向**最接近的等价页**,严禁批量指向首页(软 404 信号)。
3. 老站首页保留,顶部加品牌横幅指向新站(老站首页本身是品牌搜索入口)。
4. 老站全站 canonical 逐步切到新站对应页(过渡期方案,比直接关站平滑)。
5. 60 天后看 GSC:老站抓取量下降、新站对应页曝光上升 = 迁移生效。

## 风险与对策

- **老站现有询盘损失**:Stage-1 只迁有排名页,门页暂留,询盘路径不断。
- **新站内容被判定重叠**:族归并是"信号合并"不是内容复制,新站页内容
  独立且更优,无重复内容惩罚问题。
- protekrfid.com / cxjsmartcard.com:同规则择期归一,优先级低于主两站。
