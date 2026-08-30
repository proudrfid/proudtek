# GSC 四周复盘手册(2026-09-27 执行)

> 触发词:用户说"复盘"或到 9/27。数据源:GSC API(sc-domain:proudtek.com)。
> 基线:90 天 28 点击 / 1,861 曝光 / pos 35.8(gsc-findings-2026-08-30.md)。

## 必查清单(全部用 API,勿凭印象)

1. **点击趋势**:近 28 天 clicks vs 基线速率(≈4.4/14天)。≥50% 增长=批次生效。
2. **四新页收录**:java-card / legic-card / nfc-ring / water-parks 的曝光(≥1 曝光即视为"发现")。
3. **芯片三簇**:ntag213(基线 pos 50.1→现在 53.2)/ desfire ev2 / classic 1k 位次变化。
4. **页二目标**:/products/rfid-cards/(13.9)与 hotel-key-cards(14.9)是否进 Top10 边缘(pos ≤11)。
5. **必应侧**:site:proudtek.com(Bing)收录量 vs 谷歌;IndexNow 后增量。
6. **必应/长尾回流**:/fr/produit/*、/de/produkt/* 等 140 条回收规则命中后的曝光。

## 决策规则

| 条件 | 动作 |
|---|---|
| 任一新 SKU 页 ≥20 曝光 | 加深该线内容(规格表/案例) |
| 芯片词 pos ≤30 | 对应产品页加 FAQ/对比段冲刺页一 |
| 全部持平且 <10 点击/28天 | 启动 T2 外链冲刺(商业目录+PR) |
| 140 条回收 URL 出现曝光 | 评估多语言 it/fr 试点(用户已批:数据到位再定) |
| 腕带簇卫星页仍全零 | 按 wristband-cluster-map.md 执行 301 收敛 + 剪尾 30-40% |

## 届时新拉数据

- /tmp 快照会失,重跑 sa-jwt 流程(gsc-sa.json → /tmp/sa.pem → token)。
- 90 天 page+query 全量;对照本文件决策表逐条执行,不凭感觉。
