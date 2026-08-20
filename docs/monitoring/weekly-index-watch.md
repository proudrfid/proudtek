# proudtek.com 每周收录监测日志

每周五自动运行,六项检查,追加式记录。基线由 2026-08-13 深度诊断建立
(详见仓库根目录 TRAFFIC_PENALTY_DIAGNOSIS_2026-08-13.md)。

| 日期 | ①P0部署(301生效) | ②首页索引标题 | ③新页收录抽样 | ④品牌词首位 | ⑤tekrfid镜像 | ⑥目录条目 | 变化点 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-08-13(基线) | ✗ 未部署(/de/anything/ 与 /tag/nfc 均无跳转) | 旧 WP 标题 | 部分新页已收录(/products/rfid-cards/、/faq/、/compare/em4100-vs-t5577/ 等,新标题) | proudrfid.com(非 proudtek) | ✗ 200 完整镜像在线 | 0(EUROPAGES/Kompass/ThomasNet/RFID Journal 均无) | — 基线 |

## GSC 基线(2026-08-13,浏览器实查)

- **手动操作:无(No issues detected)✅ 惩罚问题正式关闭;安全问题:无 ✅**
- 索引:已收录 **4.05K** / 未收录 **20.4K**(数据截至 8/6)
- 未收录原因:Soft 404 **5,986**(=死掉的通配 301 造成的空 200,P0 部署直接治)· 5xx **2,264**(全是老 WPML 多语言 URL,末次抓取集中在 6/10-11 切站窗口)· robots 屏蔽 1,637(8/8 已解,待消化)· 已抓取未收录 9,442 · 已发现未收录 489
- 关键实证:`/sample-pack/` 与 `/compare/` 两个核心页 **Last crawl: N/A(两个月从未被抓取)** —— 抓取预算被 2.4 万旧 URL 吃光
- sitemap-index.xml:7/15 已提交,Success,发现 1,044 URL
- 今日已请求收录 5 页:/ · /solutions/rfid-laundry-tags/ · /products/rfid-cards/ · /sample-pack/ · /compare/(全部进入优先抓取队列)
- **待办**:P0 部署后到 Pages 报告对 Soft 404 / 5xx / robots 三项点 VALIDATE FIX;剩余 10 个核心页明天配额内继续请求收录;Bing Webmaster「从 GSC 导入」(需用户微软账号)
