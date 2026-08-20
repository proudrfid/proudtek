# proudtek.com 收录急救清单 — 2026-08-08

背景:GA 显示 6/14–7/11 全站仅 30 个新用户,Google 自然搜索 2 次访问;
`site:proudtek.com` 里仍是旧 WordPress 标题。内容与转化要素无问题,
瓶颈 = Google 没有完成新旧站切换 + 站外信号为零。

## 第 0 步 — 先推送部署(5 分钟,唯一的代码步骤)

本地已提交 `6b22e34e`(旧语言目录 + WP 遗留路径 301;robots 解除语言目录屏蔽)。
在终端执行(需 VPN):

```bash
cd ~/Projects/Playground && git push origin main
```

部署完成后抽查(浏览器访问,确认 301 生效):

- `https://proudtek.com/en/rfid/` → 应跳到 `/products/all/`(当前是 404)
- `https://proudtek.com/de/anything/` → 应跳到 `/anything/`
- `https://proudtek.com/robots.txt` → 不应再有 `Disallow: /ar/` 等 13 行

## 第 1 步 — GSC 验证与体检(30 分钟,只需做一次)

1. [search.google.com/search-console](https://search.google.com/search-console) →
   添加**域名资源**(Domain property)`proudtek.com`,按提示在域名注册商加 DNS TXT 记录。
   (如已验证,跳到 2)
2. **提交 sitemap**:`https://proudtek.com/sitemap-index.xml`
3. **覆盖率体检**(编入索引 → 查看未编入索引的页面),记下三个数:
   - 已编入索引的页面数(目标:向 521 靠拢)
   - "已发现 - 尚未编入索引" 数量(大 = 抓取预算/权重问题)
   - 列表里还有多少 `/en/`、`/tag/`、`/product/` 老 URL
4. **手动操作 & 安全问题**两个面板确认是空的(排除惩罚)。
5. **网址检查**(URL Inspection)→ 对下面 15 个核心页逐个"请求编入索引"
   (每天配额有限,分 2–3 天做完):

   ```text
   https://proudtek.com/
   https://proudtek.com/products/all/
   https://proudtek.com/products/rfid-cards/
   https://proudtek.com/products/rfid-tags/
   https://proudtek.com/products/rfid-labels/
   https://proudtek.com/products/rfid-wristbands/
   https://proudtek.com/solutions/rfid-laundry-tags/
   https://proudtek.com/solutions/rfid-laundry-management/
   https://proudtek.com/solutions/hotel-key-cards/
   https://proudtek.com/solutions/google-review-nfc-card/
   https://proudtek.com/compare/
   https://proudtek.com/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/
   https://proudtek.com/guides/
   https://proudtek.com/sample-pack/
   https://proudtek.com/rfq/
   ```

6. **Bing Webmaster Tools**([bing.com/webmasters](https://www.bing.com/webmasters))
   → "从 GSC 导入" 一键同步;Bing 现在给你的流量(5-6 次)比 Google 还多,别浪费。

## 第 2 步 — 每月复查口径(每月最后一个周五,15 分钟)

只看四个数(和 7/11 诊断保持一致):

1. GSC 展示 / 点击(分页面、分查询词)
2. 已编入索引页面数
3. 询盘数与来源(Formspree inbox,剔除 spam)
4. AI 渠道占比(GA: chatgpt.com / perplexity / copilot 来源)

## 已完成(不用再做)

- [x] 旧语言目录 + WP 遗留路径 301(`6b22e34e`,待推送)
- [x] robots 解除 13 个语言目录 Disallow(同上)
- [x] sitemap/robots 基建本身正常(521 URL,已验证)
- [x] 表单管道正常(Formspree 额度 1/50,8/8 测试提交成功)
- [x] 内容质量审计(2026-07-02 已做过,结论:不是瓶颈)

## 背景数据(诊断依据)

- GA 2026-06-14 → 07-11:新用户 30,回访 5;来源 AI 助手 11 > 自然搜索 9 > 直接 7
- google/organic 仅 2 次;bing/organic 5-6 次;首页搜索展示 164 次/28 天
- 真实询盘约 3-4 条/月,对 ~35 访客/月 = 转化率约 10%,不低
- 结论:流量是分母问题;收录急救(本清单)+ 站外信号(目录提交包)是当前最高 ROI 的两件事
