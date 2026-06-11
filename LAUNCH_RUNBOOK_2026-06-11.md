# 上线操作单 — proudtek.com(2026-06-11)

按顺序执行,每阶段有验证门,过了再走下一步。⚠️ 全程开 VPN(GitHub/Google/Vercel 都需要)。

## 阶段 0 — 代码入库(15 分钟)

```bash
cd ~/Projects/Playground && npm run build && npx vitest run && git add -A && git commit -m "C-8..12 + growth tier-1: legal pages, bylines, commercial terms, CTA anchors, CSS purge, 145 dead links fixed, 69 pages de-orphaned, 47 reciprocal links, CRO six" && git push
```

✅ 验证门:构建 Complete!、测试全绿、push 成功。

## 阶段 1 — Vercel 部署(20-30 分钟)

1. vercel.com → **Continue with GitHub** 登录(授权访问 proudrfid/proudtek)
2. **Add New → Project** → Import `proudrfid/proudtek` → Framework 自动识别 Astro;Build/Output 不用改(repo 里 vercel.json 已配好 `npm run build` + `dist`)→ **Deploy**
3. 等 2-4 分钟构建完成,得到 `xxx.vercel.app` 预览地址
4. 预览抽查:首页、任一产品页、/blog/、/contact/、/llms.txt 都正常
5. 项目 **Settings → Domains** → 添加 `proudtek.com`(主域)再添加 `www.proudtek.com`(Vercel 自动把 www 308 到主域 = 我们要的 www→apex)

✅ 验证门:预览站 5 页正常;Domains 页显示两个域名待验证状态。

> 以后每次 `git push` 到 main,Vercel 自动重新部署——内容更新流程就是:改 → 提交 → 推送,完事。

## 阶段 2 — DNS 切换(10 分钟操作 + 等生效)

6. 到你的域名注册商 DNS 管理页,**按 Vercel Domains 页面显示的记录**配置(以页面显示为准;典型值:`proudtek.com` 加 A 记录 → `76.76.21.21`;`www` 加 CNAME → `cname.vercel-dns.com`)。删除指向旧 WordPress 主机的旧 A/CNAME 记录
7. 回到 Vercel Domains 页等绿勾(几分钟~几小时,取决于 TTL);HTTPS 证书自动签发

✅ 验证门:浏览器访问 https://proudtek.com 看到新站(旧"Database Error"消失)。

## 阶段 3 — 上线冒烟测试(15 分钟,全部在 proudtek.com 上)

8. 样式 QA 六页(CSS 清洗回归检查):首页(开合移动端汉堡菜单)、/blog/(卡片缩略图)、/contact/(表单)、任一产品页、任一 compare 页、任一 guide 页(目录)
9. 三件机器入口可访问:`/robots.txt`、`/sitemap-index.xml`、`/llms.txt`
10. 301 抽查:`www.proudtek.com` → apex ✓;`/blog/em4100-vs-t5577-125khz-comparison/` → compare 版 ✓;`/about/case-studies/` → `/case-studies/` ✓
11. **Contact 表单真实提交**(从未验证过的关键链路!):提交 → 去 info@proudtek.com 邮箱**点 Formspree 确认邮件** → 再提交一次 → formspree.io 后台 Submissions 见到数据 ✓
12. `/rfq/` 向导提交一条测试 ✓
13. cookie 横幅点 **Accept** → analytics.google.com → Reports → Realtime 看到 1 个活跃用户 ✓

✅ 验证门:11/12/13 三条链路都通才算上线成功——流量来了接得住、看得见。

## 阶段 4 — 搜索引擎注册(30 分钟)

14. **GSC**(search.google.com/search-console):添加资源 → 选**域名**类型 `proudtek.com` → 按提示在注册商 DNS 加 TXT 记录 → 验证 → **Sitemaps** 提交 `sitemap-index.xml`
15. URL 检查首页 + /products/rfid-cards/ + /compare/ + 任一旗舰 guide → 各点 **Request Indexing**
16. **Bing Webmaster**(bing.com/webmasters):选 **Import from GSC** 一键导入(Bing 数据喂 ChatGPT 检索,GEO 必做)

## 阶段 5 — 免费权威三件 + 平台统一(今天起一周内)

17. **NFC Forum Adopter**(免费,无年费):nfc-forum.org/engage/join — 官网列名 = 最强免费实体信号
18. **EUROPAGES** 免费供应商档案:europages.co.uk/en/supplier-registration
19. **RFID Journal** 上线新闻稿(免费进周报):rfidjournal.com 投稿入口
20. Alibaba / Made-in-China / Global Sources 既有账号统一:名称 **Proud Tek**、网址 **proudtek.com**、地址 **A2109, Zhantao Building, #1079 Minzhi Rd., Longhua District, Shenzhen**、电话 **+86 186 6582 0632**(158 旧号已退役,任何平台不再填)
21. **Formspree 配额**:前几天每天看一眼 Submissions;有真实询盘进来即升级付费档(免费 50 条/月会被垃圾打满丢单)

## Day 1-7 监控

- GSC 覆盖率 2-7 天开始出数;关注"已发现-未编入索引"是否积压
- Vercel 项目页看部署状态与函数日志
- GA4 Realtime + Events(form_submit / contact_click / file_download 都已埋好)
- 每周一次:用 ChatGPT/Perplexity 问 10 个目标问题("rfid card manufacturer china"、"ntag213 vs ntag215"…),记录是否引用 proudtek.com(GEO 基线)

## 已知待办(不阻塞上线)

- RAIN Alliance 会员($1,500/年)决策
- 价格带透明化拍板(增长路线图 #23)
- 第三层:RFQ 参数预填、成本估算器、缺口页生产(价格三件套先行)
- PII 历史记录 BFG 清洗(仓库若公开)
