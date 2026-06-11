# 增长路线图 — proudtek.com(上线前 2 周 → 上线后 90 天)

日期:2026-06-11 · 基础:三路调研(站内链接图谱 513 页 6,395 条边 / CRO 六维 / mindrfid 拆解 + 8 个金钱词 SERP + 外链机会)· 前两轮缺陷修复已全部清零,本路线图为**纯增长项**。

## 战略判断(为什么能赢)

1. **内容护城河是真实的:** mindrfid(成都厂,自称 TOP3)及整个排名中的中国厂商队列都只有薄产品网格 + 每月 1-2 篇通稿,无 guides/compare/芯片教育层;而 Google 已在多个金钱词上奖励内容页——"ntag213 vs ntag215" 前十 100% 是内容页(且多为小厂博客)、"rfid laundry tags" 第 4 名是一篇指南、"rfid tag price" 全是成本指南(没有一篇出自真工厂)。我们的 530 页正面攻击的就是这些已被验证的页面类型。
2. **现实的赢面排序:** 1-3 个月可赢:芯片对比、洗衣标指南+产品对、腕带长尾、酒店锁兼容查询;6-12 个月:头部词("rfid card manufacturer" 等,被欧美老牌占据);"hotel key cards supplier" 前十零中国厂,走锁兼容长尾切入。
3. **开放侧翼 = 价格透明:** 全行业(含 mindrfid 的 FAQ 原话)都"联系后发价目表";发布**价格带 + 明示 MOQ**同时通吃 SERP(成本类查询)与转化(采购筛选),且自带 PR 钩子。
4. **市场平台(Alibaba/MIC)在 8 个美国 SERP 中出现 0 次** —— 它们是询盘渠道和实体一致性签到处,不是 Google 增长赌注。

---

## 第一层:上线前必办 — ✅ 已全部执行(2026-06-11,见下表;验证 140/140 测试 + 全部 lint 绿)

执行实录:#1 死链 145→0(134 改接+11 删,62 文件);#2+#3 案例去孤儿+Top-30 接线 = 85 条链接/63 个宿主文件(8 个案例研究全部获得 2-3 条入链);#4 博客互链 47 篇(行内 markdown 链接+资源卡成对落位,定价三件套 6 向全互链);#5 CRO 六件:公司画册 PDF 上架 /downloads/ + downloads 页收录、form_submit 仅在校验通过后触发、tel/wa.me/mailto/文件下载全部进 GA4 事件、内联表单新增 Country 字段(完整 a11y 契约)+ 按钮改 "Get My Quote"、信任数字统一为 "Since 2008"(4 处)+ JSON-LD 电话统一为 +86 186 6582 0632(⚠️ 待店主确认 158 旧号是否还需在任何地方展示)、sticky CTA 锚定 #quick-quote + 与 cookie 横幅的底部碰撞已解(CSS 变量位移)。

| # | 事项 | 依据 | 工作量 |
|---|---|---|---|
| 1 | **修 145 条站内死链**(65 个不存在目标:30 条指向 4 个从未建的 lp 页、~20 条指向未写的博客、slug 拼写错误若干、research 区 11 条 404 自家方法论) | 漏权重 + 软 404;清单已全量在手 | 半天 |
| 2 | **案例馆去孤儿**:8 个案例研究 0 条内链(转化证据采购必看!)→ 按映射接入高权重宿主(solutions/industries/guides) | 链接图谱 | 2 小时 |
| 3 | **Top-30 孤儿博客接线**(61/114 博客为孤儿,~70 个 resourceCard 链接分布到 ~25 个高权重宿主;含锚文本方案) | 链接图谱 | 半天 |
| 4 | **51 篇"提及不链"互链**:博客重度讨论某 SKU 主题却不链(如 laundry ROI 文 51 次提及洗衣却无洗衣 SKU 链接)→ 首次显著提及加内链 + resourceCards 加条目 | 抽样 15/15 确认模式 | 半天 |
| 5 | **CRO 快赢 6 项**:公司画册 PDF 上架(456KB 成品躺在仓库根目录无人能访问!)/ form_submit 防无效计数 / WhatsApp·tel·下载点击埋点 / 内联表单加国家字段+按钮文案对齐 / 信任数字统一(10+ 年 vs 18 年、500+ 客户、40/50/60+ 国家三版并存!)+ 电话号统一(两个不同语音号) / sticky CTA 从"Talk to engineering"重定向到 #quick-quote 并在同意横幅在场时让位 | CRO 审计 | 1 天 |

## 第二层:上线周冷启动(需要你操作,我给保姆级步骤)

| # | 事项 | 成本 | 优先级 |
|---|---|---|---|
| 6 | Vercel 绑域名 + www→apex 301 + 部署 | — | P0 |
| 7 | GSC + Bing Webmaster 提交 sitemap-index(Bing 喂 ChatGPT 检索) | 免费 | P0 |
| 8 | **NFC Forum Adopter 会员**(免费、无年费!官网列名 + logo 使用权 = 最强免费实体信号) | 免费 | P0 |
| 9 | EUROPAGES 免费供应商档案(120 万月活 B2B 买家,EU 市场) | 免费 | P0 |
| 10 | **三大平台名称统一**:Alibaba/Made-in-China/Global Sources 既有账号统一为 "Proud Tek" + proudtek.com + A2109 地址(喂 Google 品牌图谱与 AI 答案) | 2-3 小时 | P0 |
| 11 | RFID Journal 发布 launch 新闻稿(免费进周报 Roundup)| 免费 | P0 |
| 12 | **Formspree 配额决策**:免费 50 条/月全站共享,上线周被爬虫打满即静默丢单 → 升级或拆分端点 + 前 30 天每 2-3 天查后台 | ~$10+/月 | P0 |
| 13 | GA4 标记关键事件(form_submit/rfq_submit/contact_click/download)+ UTM 规范(utm_source=linkedin\|google\|alibaba-mail…) | 免费 | P1 |

## 第三层:上线后 2-6 周

**Claude 可代做(按影响排序):**

| # | 事项 | 价值 |
|---|---|---|
| 14 | RFQ 向导查询参数预填(`/rfq/?product=&freq=&qty=`)+ SKU 页 CommercialTerms 链接参数化 → 询盘到达即带规格 | 询盘质量+回复速度 |
| 15 | 内联表单页内 thank-you(fetch 化或 _next)→ 干净的 GA4 关键事件 + 提交后再营销面(样品包/画册/WhatsApp) | 度量+二次转化 |
| 16 | 7 个案例映射进对应产品 SKU 的 resourceCards(现状 0/196 SKU 引用案例) | 决策页转化 |
| 17 | RFP 模板(.docx)+ ROI 模型(.xlsx)下载资产(内容已存在于两篇博文)+ download 埋点 | 线索面 |
| 18 | `/tools/rfid-tag-cost-estimator/` 成本估算器(纯前端,价格带数据已在 cost-per-rfid-tag-2026 文内;CTA 直通预填 RFQ) | 转化+外链磁铁 |
| 19 | 11 个缺口页按序生产:**价格三件套先行**(/guides/rfid-card-cost/、rfid-wristband-cost、rfid-reader-price-guide)→ Zebra 打印机标签兼容页(兼容层从酒店锁扩展到打印机,零竞争)→ 尺寸参考/NFC 芯片全家族对照表(GEO 引用磁铁)→ ISO 15693(站内已有死链指向它=需求已证) | SERP 已验证的页面类型 |

**需要你提供素材/拍板:**

| # | 事项 | 需要什么 |
|---|---|---|
| 20 | 证书扫描件上墙(/about/certifications/ 现状纯文字宣称) | ISO 9001/RoHS/REACH/FCC/CE 扫描件(可打水印)+ 证书编号 |
| 21 | 证言升级 + 客户 logo 行(现有 3 条证言只有名+国家) | 向客户要授权(公司名/头衔或 logo) |
| 22 | 工厂视频上 /about/factory/(10.8MB 成片只在首页背景播放)+ 60-90 秒剪辑版 + YouTube 镜像 | 剪辑决定 |
| 23 | **价格带透明化拍板**(战略差异化,全行业不敢做;发布后每个 PR pitch 都有钩子) | 你定价格带颗粒度 |
| 24 | RAIN Alliance 会员($1,500/年 Community 档;官网列名于 NXP/Impinj 旁,深圳同行 DTB/RICHRFID 已在内) | 预算决策 |

## 第四层:90 天权威建设(节奏型)

- **季度《RFID Tag Cost Index》原创数据资产**:行业定价不透明 = 引用真空;真工厂发布成本指数是永久链接磁铁(排名中的成本指南全是咨询公司猜的)。每季 1-2 天。
- **拆解系列**(酒店卡/腕带/洗衣标 macro+芯片照,ChampionChip 式照片已有先例):极客与行业博客的自然外链来源。每篇 1 天。
- RFID Journal "Expert Views" 客座文章(700-1,000 词,免费,用成本指数数据当题)。
- 每周用 ChatGPT/Perplexity 问 10 个目标问题,记录 proudtek 是否被引用(GEO 监测)。
- 第 90 天复盘:GSC 数据驱动的第二轮内容规划;评估 Kompass/AIM Global。

## mindrfid 直接对位打法(摘要)

他们的弱点 = 我们的对比面:导航有拼写错误、标题全是模板话术、品牌分裂在 3 个域名、产品页是无文字的图片网格、博客写了洗衣标却没有产品页、价格/MOQ 全部"联系后告知"。我们已有:规格表产品页、洗衣标完整 hub、干净单语英文站、明示 MOQ/付款/交期的商务条款块。**不要打价格形容词战("most competitive price"是他们的话术),打规格精确性 + 买家教育 + 条款透明。**

---
*三份完整调研底稿(链接图谱数据、CRO 逐项证据、SERP 逐词记录与外链 URL 清单)可向 Claude 索取。*
