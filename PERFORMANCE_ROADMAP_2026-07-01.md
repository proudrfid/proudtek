# 网站表现提升路线图 — proudtek.com

**日期:** 2026-07-01 · **整合自:** `SITE_AUDIT_2026-06-29.md` / `GROWTH_ROADMAP_2026-06-11.md` / `GEO_IMPROVEMENT_PLAN_2026-06-22.md` / `ENTITY_CONSISTENCY_PLAYBOOK_2026-06-22.md` + 本次现状复核(内链图谱重跑、Lighthouse 基线核实、组织实体现状核对)

## 一句话

站内工程/设计/AI 可抓取性已是头部水平,真正卡住"表现"的是三件事:**① 询盘表单可能没人收到(收入直接归零)、② 结构性内链腐化在悄悄复发(35 篇博客含案例研究重新孤儿化)、③ 链下实体信号单薄(sameAs 仅 4 项)**。技术性能本身没有大问题,只是基线数据太旧,看不清现状。下面按"不做就流血"→"我能直接做"→"需要你"→"复利型"排序。

---

## 阶段 0 — 本周,你必须做(否则后面全部空转)

| # | 事项 | 为什么排第一 |
|---|---|---|
| 0-1 | **部署 Formspree 修复 + 验证到账**:代码已修好(`97c648b`→`xlgorlog`)并在你本机 git 历史里,需要你 `git push` 触发部署,然后去 Formspree 后台确认转发邮箱有人看,再发一条真测试询盘验证真的到邮箱 | 表单曾经在提交到你不拥有的账号——**修好但没验证 = 可能仍然在丢单** |
| 0-2 | **Vercel 绑定 proudtek.com + www→apex 301**(检查下来 `vercel.json` 里还没看到这个重定向配置) | 域名不统一会拆分权重、AI 也会看到两个"入口" |
| 0-3 | **提交 sitemap 到 GSC + Bing Webmaster**(Bing 喂 ChatGPT 检索) | 免费,越早提交越早开始被索引/被抓取计入新鲜度 |
| 0-4 | **Formspree 配额检查**:免费档 50 条/月全站共享,一旦被爬虫或旺季打满会静默丢单 | 和 0-1 是同一个"钱从哪个孔漏出去"的问题 |

*0-1/0-2/0-3/0-4 都需要你的账号权限(Formspree/Vercel/GSC/Bing),我做不了,但可以给你逐步操作说明。*

---

## 阶段 1 — 我现在就能做(结构/技术,不需要你拍板)

本次重跑 `scripts/internal-link-audit.mjs` 和翻查 `.lighthouseci/`,发现两块此前审计没抓到的**新鲜问题**:

| # | 发现 | 证据 |
|---|---|---|
| 1-1 | **站内断链 5 处是真的**(其余归为脚本误报:查询参数、`public/downloads` 静态文件、`/rfq/` 均属误判):`/guides/chip-encyclopedias/`(应指向已建好的 `/glossary/`)+ 3 个旧 `/lp/*` slug(`custom-rfid-cards-manufacturer`、`rfid-wristband-factory`、`hotel-key-card-supplier`,已在 6-10 那轮合并消失,内链没跟着改) | `internal-link-audit.mjs` 实跑 |
| 1-2 | **孤儿页面复发**:当前 42 个(35 blog + 2 compare + 2 lp + 若干),`/blog/` 平均入链只有 2.0(其他分区 7–60)。**至少 1 篇案例研究已经重新变回 0 入链**(`case-study-restaurant-group-nfc-review-cards-google-reviews-320-percent`)——6-11 那轮"全部 8 篇案例去孤儿"的成果没能扛住之后 3 周的新增内容 | 同上 |
| 1-3 | 2 处自链(`compare/metal-vs-wood-vs-pvc-nfc-business-cards`、`compare/pps-vs-silicone-vs-textile-rfid-laundry-tags`) | 同上 |
| 1-4 | **Lighthouse 基线过期**:仅有的分数来自 5-20(CSS 瘦身、LCP 预加载等一批性能改动之前),`.lighthouseci` 报的"样式表 134KB 超预算"这类结论已经不可信——`SITE_AUDIT_2026-06-29` 说瘦身后是 44.4KB gzip。现在真实性能什么样,没人量过 | `assertion-results.json` mtime |

**我可以直接做:** 修 1-1/1-3(改内链目标,零风险);重跑一轮孤儿页梳理+补链(1-2,参照 6-11 那轮的做法,批量把 35 篇孤儿博客接回高权重宿主页);跑一次 `npm run build && lhci autorun` 拿一份**现在真实的** Lighthouse 基线,而不是继续引用 5 月的旧数字。

**✅ 已完成(2026-07-01):** 1-1/1-2/1-3 全部修完(断链/自链提交 `ef5ef8a`,35 篇孤儿博客提交 `8df2888`,孤儿 42→7 且剩 7 个均为有意跳过项)。Lighthouse 沙盒里跑不了(无 Chrome 二进制),**由你在本机跑通** `npm run lh:baseline`(609 页构建 65.89s + 8 页×3 次 Lighthouse)。结果:**8 个代表页全部通过所有预算断言,`assertion-results.json` 为空数组(零警告零错误)**——CSS 稳定在 62KB/页(远低于 80KB 上限)、CLS 全部为 0(含 `compare/uhf-vs-hf-rfid` 历史遗留的 0.13 布局偏移,已彻底解决,不只是压线通过)、TBT 全为 0ms、FCP 全为 0.4s。唯一略突出的是 **`/blog/`**:performance 0.88(其余页 0.99–1.0)、LCP 2.3s(其余页 0.5–0.9s)——不是代码问题,是页面本身重:28 张图共 6.3MB + 唯一加载了 `accounts.google.com/gsi/client`(96KB Google Identity 脚本)。

**✅ 追加修完(2026-07-01,同日第二轮):** gsi/client 泄漏根因是 `extractChromeFromSnapshot()` 只对 headHtml 做清理、bodyHtml 原样直出——已修(`cff8eb1`),并顺带发现清理逻辑漏删了包裹脚本的 HTML 注释,一并修掉(`b449a1c`,纯字节级、无功能影响)。28 张图的问题是 WebP 生成脚本从未覆盖 `blog-images/` 目录——已修(`025365f`),117 张图 15.04MB→9.94MB(-34%)。**未做、有意披露的后续项:** Lighthouse 同时标出的"uses-responsive-images"(多宽度 srcset,还能再省 5.86MB)——全站目前没有这套基建,新建属于新增架构而非套用现有模式,留作后续候选。四次提交本地已完成,`git push` 因沙盒无凭证失败,需你手动推。

---

## 阶段 2 — 我可以做,2-4 周(转化优化,纯代码,不需要新素材)

来自 `GROWTH_ROADMAP` 第三层"Claude 可代做",按价值排序:

1. ✅ **已完成(2026-07-01,提交 `db32f4f`):** RFQ 向导查询参数预填(`/rfq/?product=&freq=&qty=`)+ SKU 页条款链接参数化。196 个 SKU 页的"Full terms in your quote"链接现在自动带 `?product=<cluster slug>`,进向导直接跳过第一步。
2. ✅ **已完成(2026-07-01,提交 `84fe033`):** 7 个案例研究接入对应产品 SKU 的 resourceCards(0/196 → 7/196)。按每篇案例研究实际用到的芯片/材质精确匹配到唯一对应 SKU(不是泛主题匹配),新增"Proven in production"卡片组。
3. ✅ **已完成(2026-07-01,提交 `c9410af` + `bfd5f44`):** 价格指南 + 估算器,范围较原计划收窄一项——写完 `/guides/rfid-card-cost/` 和 `/guides/rfid-wristband-cost/` 后发现 `rfid-reader-price-guide` 会与 `rfid-reader-writer-selection.json` 现有的"Procurement, pricing and volume economics"小节大面积重复,提请用户拍板后**跳过该页,改为在两处互相跳链**(用户确认)。`/tools/rfid-tag-cost-estimator/` 前端估算器同步建成:卡片/腕带各 3-5 档预设 × 3 档批量,读卡器为静态参考表(直接引用现有指南数字,原因同上——数量线性缩放对读卡器不成立)。数字来源:站内已发布的芯片百科/酒店卡指南 + 2 篇外部行业报告(cpcongroup.com、rfidhy.com),全程标注"参考区间非报价"。内链审计跑出的孤儿(`rfid-wristband-cost` 0 入链)已顺带修复。导航/sitemap/llms.txt 均已注册。
4. ⏳ RFP 模板(.docx)+ ROI 模型(.xlsx)下载资产 + download 事件埋点。**尚未开始。**

---

## 阶段 3 — 需要你(可以和阶段 0-2 并行推进)

**免费/低成本的实体信号**(直接影响 AI 答案引擎推荐概率):
- NFC Forum Adopter 免费列名、Europages 免费供应商档案(均免费无年费)
- Alibaba / Global Sources 后台资料对齐规范实体卡——但**先拍板两件事**:法定名以营业执照为准(repo 现用 `Proud Tek Co., Limited`,Made-in-China 用 `Shenzhen Proud Tek Co., Ltd.`,哪个对?)、Made-in-China 现填的工厂地址(`#7 Shangwei Industrial Road...`)是否现行有效。定了我就能把 `sameAs` 一次性回填进代码(当前只有 LinkedIn/YouTube/WhatsApp/Made-in-China/Facebook 共 5 项)
- ⚠️ 顺带确认:代码里已经有"未入会,不得宣称 RAIN/NFC Forum 会员"的注释和 2026-06-22 拍板记录,这条风险已经被之前的会话堵住了,不用重新担心

**需要素材:**
- ISO 9001/RoHS/REACH/CE 证书扫描件上墙、客户证言加公司名/logo、工厂视频剪 60-90 秒版

**需要战略决策:**
- 价格带透明化(全行业不敢做,能当差异化 + PR 钩子)
- RAIN RFID Alliance 付费会籍($1,500/年)值不值

---

## 阶段 4 — 90 天复利节奏

- 季度《RFID Tag Cost Index》原创数据资产(行业定价不透明=引用真空,真工厂发布=永久引用磁铁)
- 拆解系列(酒店卡/腕带/洗衣标 macro 实拍)——外链与 AI 训练数据频次的自然来源
- 每周固定 10-20 个目标问题在 ChatGPT/Perplexity/Gemini 上查一遍,记录是否被引用、引了哪页、和 mindrfid 等竞品谁更常被提——建立 Share-of-Voice 基线

---

## 验收方式

- 阶段 1:`node scripts/internal-link-audit.mjs` 断链数 0、孤儿数显著下降;`npm run lint && npm test` 绿
- 阶段 0:Formspree 后台看到新提交 + 测试邮件到账;`https://proudtek.com` 与 `https://www.proudtek.com` 都能访问且指向同一份内容
- 阶段 4:GEO 监测表连续 4 周有数据后看引用份额趋势

## 参考

完整背景与逐项证据见 `SITE_AUDIT_2026-06-29.md`、`GROWTH_ROADMAP_2026-06-11.md`、`GEO_IMPROVEMENT_PLAN_2026-06-22.md`、`ENTITY_CONSISTENCY_PLAYBOOK_2026-06-22.md`。
