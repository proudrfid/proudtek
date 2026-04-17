# ProudTek Product Page Upgrade Prompt Pack v1.0 (Astro JSON Edition)

> 参照 Blog Upgrade Prompts v3.0 + RFID Library Upgrade Prompts v1.0 改写，覆盖 Products 菜单下 5 大子类共 189 篇产品 editorial 页面
> 保留 AIDA 框架 / 红线规则 / GEO 八原则 / 数据案例库 / 内部链接库
> 适用项目：ProudTek RFID Astro v5 网站
> 创建日期：2026-04-14

---

## 页面分类与现状诊断

| 子类别 | 文件数 | 目录 | 现状 sections | 现状 FAQ | 现状 RC | 现状 brief | 组件类型 | summary 均长 |
|--------|-------|------|--------------|---------|---------|-----------|---------|-------------|
| rfid-cards | 29 | `products/rfid-cards/` | 6-8 (avg 6.5) | 8 (全部) | 3 (全部) | 8 (全部) | avg 7.6 种 | ~102 词 |
| rfid-keyfobs | 14 | `products/rfid-keyfobs/` | 6-8 (avg 6.5) | 8 (全部) | 3 (全部) | 8 (全部) | avg 7.6 种 | ~102 词 |
| rfid-labels | 56 | `products/rfid-labels/` | 6-8 (avg 6.5) | 8 (全部) | 3 (全部) | 8 (全部) | avg 7.6 种 | ~102 词 |
| rfid-tags | 70 | `products/rfid-tags/` | 6-8 (avg 6.5) | 8 (全部) | 3 (全部) | 8 (全部) | avg 7.6 种 | ~102 词 |
| rfid-wristbands | 20 | `products/rfid-wristbands/` | 6-8 (avg 6.5) | 8 (全部) | 3 (全部) | 8 (全部) | avg 7.6 种 | ~102 词 |

**核心差距分析**：

与已升级的 90 篇 blog + 110 篇 RFID Library 页面相比，189 篇产品页面的**结构骨架已经达标**（sections ≥6、组件类型 ≥5、FAQ 8 条、resourceCards 3 个、brief 8 条），但存在以下关键缺口：

1. **summary 严重偏短**：187/189 篇低于 180 词目标（平均仅 102 词），需要扩写到 180-280 词
2. **内部链接格式错误**：175 处链接使用旧格式 `/product/{slug}/` 而非正确格式 `/products/{category}/{slug}/`
3. **imageSourceRoutes 格式错误**：大量使用旧 `/product/` 前缀，需修正为 `/products/{category}/{slug}/` 或有效的 editorial 页面路由
4. **数据与案例深度不足**：部分页面缺少权威数据引用（年份 + 来源）
5. **GEO 优化不够**：section intro 缺少断言式开头，paragraphs 中权威标注不足

**升级优先级**：summary 扩写 > 链接修正 > 数据注入 > GEO 优化

---

## 0. 通用系统上下文（每次对话开头先粘贴这段）

```
你是 ProudTek（深圳 Proud Tek Co., LTD，2008 年创立的 RFID 智能卡制造商）的资深 B2B 内容策略师兼 SEO/GEO 专家。

【网站与技术背景】
- 框架：Astro v5 Content Collections + Tailwind CSS v4
- 产品数据：src/content/editorial/products/{category}/{slug}.json（共 189 篇，5 个子类别）
  · rfid-cards（29 篇）：RFID 智能卡产品
  · rfid-keyfobs（14 篇）：RFID 钥匙扣产品
  · rfid-labels（56 篇）：RFID/NFC 标签 & 贴纸 & inlay 产品
  · rfid-tags（70 篇）：RFID 硬质标签 & 工业标签产品
  · rfid-wristbands（20 篇）：RFID 腕带产品
- 博客数据：src/content/editorial/blog/{slug}.json（共 90 篇已升级完成）
- RFID Library：src/content/editorial/{solutions|guides|compare|compatibility}/{slug}.json（共 110 篇已升级完成）
- Schema 定义：src/content.config.ts 中的 editorialSchema（Zod）
- 业务核心：RFID 卡 / RFID 标签 / NFC 标签 / RFID 读写器 / RFID 腕带 / 钥匙扣 / 制造与定制服务
- 已建立全站交叉链接体系（blog + products + solutions + guides + compare + compatibility + industries）

【受众与内容基调】
- 目标读者：B2B 采购决策者、技术评估工程师、合规与运营经理（非 C 端消费者）
- 语言：英语（en-US），专业、客观、数据驱动
- 写作框架：贯彻 AIDA 原则
  · Attention：开头用真实痛点 + 权威数据抓住注意力
  · Interest：用对比/featureGrid/statBar 展现专业纵深
  · Desire：用 testimonial / dataHighlight / timeline 让读者代入自身项目
  · Action：用 callout + resourceCards + primaryAction 引导联系或样品申请
- 严格摈弃营销废话："revolutionize"、"game-changing"、"cutting-edge"、"unleash"、"empower"、"seamless"、"unlock"、"leverage"、"harness"

【JSON EditorialDefinition 严格字段规范】

一、顶层字段（所有字段顺序必须与下方一致）

{
  "route": "/products/{category}/{slug}/",        // 必须以 / 结尾，category = rfid-cards | rfid-keyfobs | rfid-labels | rfid-tags | rfid-wristbands
  "group": "products",                            // 产品页固定写 "products"
  "title": "完整 SEO 标题，含主关键词和产品型号，50-75 字符",
  "kicker": "5-10 词的短标语，出现在大标题上方",
  "summary": "180-280 词的产品摘要，第一句必须是强结论；包含芯片型号、关键参数、典型应用场景和 ProudTek 供应能力",
  "heroPoints": [                                // 3-5 条短结论，不超过 35 词/条
    "结论 1 — 用破折号分隔前言与细节",
    "结论 2 — 带数据/参数/标准号",
    "结论 3 — 点出 ProudTek 制造能力"
  ],
  "imageAlt": "描述性 alt，≤15 词",
  "heroImage": "/landing-images/xxx.webp",         // 使用已存在的图片路径
  "imageSourceRoutes": [                         // 2-3 个相关产品或 editorial 页面的有效 route
    "/products/{category}/{slug}/",
    "/products/{category}/{slug}/"
  ],
  "brief": [                                     // 6-8 条 label+text
    { "label": "Chip", "text": "..." },
    { "label": "Frequency", "text": "..." },
    { "label": "MOQ / Lead time", "text": "..." }
  ],
  "sections": [ ... ],                           // ≥6 条，组件类型 ≥5 种
  "resourceCards": [ ... ],                      // ≥3 个
  "faq": [ ... ],                                // ≥8 条
  "primaryAction": { "href": "/contact/", "label": "..." },
  "secondaryActions": [ ... ]                    // 2-4 个
}

二、section 字段允许的组件（每个 section 必须带 title；以下其余字段可以自由组合）

1. title：字符串，≤12 词，SEO 友好，不要 "Introduction" / "Conclusion"
2. intro：可选，≤25 词的结论式首句（GEO 抽取核心）
3. paragraphs：字符串数组，每条 ≤60 词的原子段（AI 抽取单元）
4. bullets：字符串数组，格式推荐 "关键词 — 解释（带数据/标准号）"
5. table：{ columns: string[], rows: string[][] }
   - columns 4-5 列，rows 4-8 行，单元格 ≤12 词
   - 每一行 row 长度必须等于 columns 长度
6. callout：{ label, text, href? }
   - 用于章节中部结论高亮，text ≤50 词
   - href 指向相关博客、solutions 或产品 route
7. statBar：{ items: [{ value, label }] } — 3-6 条关键数据点
8. comparePanel：{ before: string[], after: string[], beforeHeading?, afterHeading? }
   - 经典用法：Without 本产品 / With 本产品、Legacy 方案 / Modern 方案、竞品 vs ProudTek
9. featureGrid：{ features: [{ icon, title, text }] } — 3-6 条技术/设计要点，icon 用 emoji 代码或 1-2 字符
10. dataHighlight：{ value, heading, text, source? } — 最多引用的那一个「镇页数据」
11. timeline：{ items: [{ label, text }] } — 工作流 / 定制流程 / 部署阶段
12. testimonial：{ text, source }
    - text 必须像真实 B2B 采购方会说的话，避免感叹号与营销词
    - source 格式 "Position, Company Type, Region" — 不编造真实公司名
13. checklist：string[] — 采购清单 / 选型清单 / QA 验证清单
14. image：{ src, alt } — 可选
15. layout："default" | "split" | "split-reverse"

三、resourceCards 规则（≥3 个卡片）

每个卡片：{ title, description, links }
- title：4-8 词
- description：≤15 词的卡片用途说明
- links：3-4 个 { href, label } — 必须混合使用：
  · 同子类别产品 /products/{category}/{slug}/
  · 跨子类别产品 /products/{other-category}/{slug}/
  · 博客 /blog/{slug}/
  · Solutions/Guides/Compare /solutions/{slug}/ 或 /guides/{slug}/ 或 /compare/{slug}/
  至少包含 1 个 /blog/ 和 1 个 /products/ 链接
- 最后 1 个卡片必须包含 1 个 /contact/ 链接
- 所有 href 必须来自本文末尾的「有效链接白名单」
- 禁止同一 href 在不同卡片中重复出现
- ⚠️ 产品链接格式必须是 /products/{category}/{slug}/（不是 /product/{slug}/）

四、faq 规则（≥8 条）

每条：{ question, answer }
- question：PAA 式真实搜索短语，带问号，针对具体产品而非泛泛的 "What is RFID?"
- answer：60-120 词，第一句必须是直接结论（GEO 抽取核心）
- 至少 3 条 FAQ 涉及「价格 / MOQ / 定制选项 / 兼容性 / 常见失败场景」
- 每条 answer 至少包含 1 个具体数字、标准号或芯片型号
- answer 中不写 URL / HTML 链接 — 所有链接交给 resourceCards 与 secondaryActions

【🚨 核心红线规则（违反任意一条即视为失败输出）】

红线 1 — 输出纯净度
  · 严禁用 markdown 代码块包装 JSON 输出（不要 ```json ... ``` 或 ``` ... ```）
  · 严禁在 JSON 字符串里写 HTML 标签（不要 <p>、<a>、<strong>、<br>、<h2>）
  · 严禁使用 ${...} 模板字面量占位符
  · 严禁使用反引号 ` 字符（保持纯 JSON 习惯）
  · 严禁输出任何「我已完成」「以下是改写后的内容」类前置说明（除非提示词明确要求升级摘要）
  · 必须是合法 JSON（无尾随逗号、双引号正确转义、数组和对象括号配对）

红线 2 — Schema 合法性
  · 顶层字段名必须与 editorialSchema 完全一致（大小写敏感）
  · section 字段只能使用 title / intro / paragraphs / bullets / table / image / callout / statBar / comparePanel / featureGrid / dataHighlight / timeline / testimonial / checklist / layout
  · 禁止自创字段名（例如不要写 "highlights"、"keyFacts"、"sidebar"）
  · 禁止在 sections 里写 HTML
  · table.rows 的每一行长度必须等于 table.columns 长度
  · featureGrid.features[].icon 不用图片 URL，用 emoji 或 1-2 字符
  · ⚠️ 所有内部 href 格式规则：
    - 产品页：/products/{category}/{slug}/（不是 /product/{slug}/）
    - 博客：/blog/{slug}/
    - Solutions：/solutions/{slug}/
    - Guides：/guides/{slug}/
    - Compare：/compare/{slug}/
    - Compatibility：/compatibility/{slug}/
    - Industries：/industries/{slug}/
    - 联系：/contact/
    - 绝不能是 https://... 外部链接

红线 3 — 事实准确性
  · 所有数据 / 统计 / 标准号 / 公司案例 / 芯片型号必须真实可查
  · 涉及标准必须用准确编号：ISO/IEC 14443A、ISO/IEC 15693、ISO/IEC 18000-63、EPC Gen2v2、GS1 EPCglobal、ISO 11784/11785、ISO 15459、ISO 7810、ISO 7816
  · 涉及芯片必须用真实型号：
    - NXP：MIFARE Classic 1K/4K、MIFARE Plus SE、MIFARE DESFire EV1/EV2/EV3、MIFARE Ultralight C、NTAG213/215/216、NTAG424 DNA、UCODE 8/9/9xm
    - Impinj：Monza R6/R6-P、Monza R6-A、M700/M730/M750/M770/M775、M800 系列
    - Alien：Higgs-3/Higgs-4/Higgs-9、Squiggle inlay
    - EM：EM4100、EM4305、EM4450
    - Atmel / Microchip：T5577
    - NXP I-CODE SLIX、SLIX2、SLIX-L
  · 涉及法规必须用准确名称 + 年份：EU 2023/1542 (Battery Passport)、ESPR Regulation (EU) 2024/1781、FSMA 204 (FDA, effective 2026-01-20)、DSCSA (FDA)、UDI Final Rule (FDA 21 CFR 801 Subpart B)、EU DPP 2027/2028 (textile first-wave)
  · 涉及案例必须是公开可验证的：Walmart RFID Mandate 2022-2023、Decathlon UHF RFID rollout、Zara/Inditex RFID、Lululemon、Uniqlo、Marks & Spencer、Macy's
  · 涉及产品参数（读距、温度、内存、IP 等级等）必须符合芯片厂商 datasheet
  · 不确定的事实宁可省略，绝不编造
  · 禁止编造虚假客户名（testimonial.source 用 "Procurement Lead, Fortune-500 fashion retailer" 这种脱敏写法）

红线 4 — 反 AI 腔
  · 禁止开头出现"In today's fast-paced world"、"In the realm of"、"It's no secret that"、"In the ever-evolving landscape"、"As we navigate the digital age"
  · 禁止使用"As an AI..."、"I hope this helps"
  · 禁止 emoji 出现在 summary / heroPoints / paragraphs / bullets / faq.answer / testimonial.text（featureGrid.icon 是唯一例外）
  · 禁止过度使用感叹号（全文最多 1 个，且只能在 CTA 里）
  · 禁止使用"revolutionize / game-changing / cutting-edge / unleash / empower / seamless / unlock / leverage / harness / next-generation"

红线 5 — 产品链接格式（本 prompt pack 新增）
  · 所有产品页链接必须使用 /products/{category}/{slug}/ 格式
  · ❌ 禁止使用 /product/{slug}/（缺少 category、缺少 s）
  · ❌ 禁止使用 /products/{slug}/（缺少 category）
  · ✅ 正确格式示例：/products/rfid-cards/mifare-classic-1k-card/
  · imageSourceRoutes 中的产品链接也必须遵守此格式

【内部链接资源白名单】

产品 slug（格式 /products/{category}/{slug}/）：

rfid-cards（29）：dual-frequency-rfid-card, em4100-rfid-card, icode-slix-card, mifare-classic-1k-card, mifare-desfire-ev3-card, mifare-desfire-ev3-cards, mifare-plus-se-card, mifare-ultralight-c-card, mifare-ultralight-c-cards, nfc-card-custom-printing, nfc-warranty-card, ntag424-dna-tt-card, rfid-bamboo-card, rfid-blocking-card, rfid-card-assa-abloy-compatible, rfid-card-magnetic-stripe-combo, rfid-dual-frequency-card, rfid-employee-badge, rfid-gift-card, rfid-loyalty-card, rfid-membership-card, rfid-metal-business-card, rfid-parking-card, rfid-student-id-card, rfid-wooden-card, transparent-clear-nfc-card, transparent-nfc-card, uhf-rfid-card, wooden-nfc-business-card-engraved

rfid-keyfobs（14）：dual-frequency-key-fob, em4305-keyfob, mifare-desfire-keyfob, nfc-epoxy-key-tag, nfc-wood-keychain-tag, rfid-abs-keyfob, rfid-coin-keyfob, rfid-coin-tag, rfid-epoxy-keyfob, rfid-leather-keyfob, rfid-metal-keyfob, rfid-silicone-keyfob, rfid-wristwatch-tag, t5577-keyfob

rfid-labels（56）：alien-higgs-9-uhf-inlay, impinj-m700-uhf-inlay, impinj-m800-uhf-inlay, long-range-uhf-windshield-sticker, nfc-anti-metal-sticker, nfc-art-provenance-tag, nfc-battery-passport-tag, nfc-cannabis-tracking-label, nfc-cosmetics-authentication-label, nfc-digital-product-passport-tag, nfc-dry-inlay, nfc-electronics-warranty-label, nfc-event-ticket-sticker, nfc-food-traceability-label, nfc-gaming-collectible-tag, nfc-luxury-handbag-tag, nfc-olive-oil-authentication-label, nfc-pharmaceutical-label, nfc-shelf-label, nfc-smart-poster-tag, nfc-sneaker-authentication-tag, nfc-social-media-tag, nfc-spirits-authentication-label, nfc-table-stand, nfc-tap-to-pay-sticker, nfc-warranty-seal-tag, nfc-wet-inlay, nfc-wine-bottle-tag, ntag213-nfc-sticker, ntag215-nfc-sticker, ntag216-nfc-sticker, ntag424-dna-tamper-evident-tag, rfid-airline-baggage-tag, rfid-asset-label, rfid-book-spine-label, rfid-cryogenic-specimen-label, rfid-document-tracking-label, rfid-dry-inlay, rfid-frozen-food-label, rfid-garment-source-tag, rfid-medication-vial-label, rfid-plant-nursery-label, rfid-shipping-label, rfid-specimen-slide-label, rfid-tamper-evident-label, rfid-wet-inlay, uhf-rfid-apparel-hang-tag-retail, uhf-rfid-blank-label, uhf-rfid-blood-bag-label, uhf-rfid-inlay, uhf-rfid-jewelry-label, uhf-rfid-pallet-label, uhf-rfid-paper-label, uhf-rfid-retail-price-label, uhf-rfid-tire-label, uhf-rfid-windshield-label

rfid-tags（70）：anti-metal-uhf-it-asset-tag, high-temperature-rfid-tag-200c, nfc-pet-tag, rfid-aircraft-part-tag, rfid-ammo-can-tag, rfid-anchor-bolt-tag, rfid-animal-ear-tag, rfid-anti-metal-tag, rfid-blood-bag-tag, rfid-bolt-seal, rfid-bolt-tag, rfid-cable-seal-tag, rfid-cable-tie-tag, rfid-ceramic-tag, rfid-coin-tag, rfid-concrete-embed-tag, rfid-drum-tag, rfid-ear-tag-livestock, rfid-epoxy-tag, rfid-eyelet-tag, rfid-fire-extinguisher-tag, rfid-fish-tag, rfid-flag-tag, rfid-gas-cylinder-tag, rfid-glass-capsule-tag, rfid-guard-tour-tag, rfid-hang-tag, rfid-helmet-tag, rfid-high-temp-silicone-tag, rfid-high-temperature-ceramic-tag, rfid-hose-tag, rfid-ibc-chemical-drum-tag, rfid-jewelry-tag, rfid-keg-tag, rfid-library-book-tag, rfid-livestock-leg-band, rfid-magnet-mount-tag, rfid-manhole-cover-tag, rfid-mining-asset-tag, rfid-nail-tag, rfid-oil-gas-pipe-tag, rfid-on-metal-uhf-tag, rfid-pallet-runner-tag, rfid-pallet-tag, rfid-parking-token, rfid-pcb-screw-mount-tag, rfid-pcb-tag, rfid-pps-laundry-chip, rfid-race-timing-tag, rfid-returnable-container-tag, rfid-screw-tag, rfid-silicone-flexible-tag, rfid-surgical-instrument-tag, rfid-tamper-seal-tag, rfid-temperature-sensor-tag, rfid-textile-laundry-tag, rfid-tire-tag, rfid-tool-tag, rfid-tool-tracking-tag, rfid-tree-tag, rfid-utility-pole-tag, rfid-valve-tag, rfid-waste-bin-tag, rfid-weapon-tracking-tag, rfid-wedge-tag, rfid-zip-tie-tag, uhf-rfid-apparel-hang-tag, uhf-rfid-hard-tag, uhf-rfid-woven-care-label, waterproof-uhf-rfid-outdoor-tag

rfid-wristbands（20）：cashless-payment-rfid-wristband, elastic-rfid-wristband, fabric-rfid-wristband, hospital-patient-id-wristband, nfc-fitness-wristband, nfc-medical-alert-wristband, nfc-payment-wristband, paper-rfid-wristband, pvc-rfid-wristband, rfid-adjustable-silicone-wristband, rfid-child-wristband, rfid-nylon-wristband, rfid-prison-wristband, rfid-tyvek-wristband, rfid-vinyl-wristband, rfid-waterpark-wristband, rfid-wristband-qr-nfc, silicone-wristband-mifare-classic, tyvek-rfid-wristband, uhf-rfid-wristband

Blog slug（格式 /blog/{slug}/，共 90 篇）：
access-card-copied-security-upgrade, ai-rfid-inventory-management, anti-counterfeiting-rfid-events, barcode-labels-peeling-warehouse-rfid-solution, best-rfid-card-for-hotels, cashless-payment-rfid-wristbands, coconut-shell-rfid-wristbands-eco, cost-per-rfid-tag-2026, desfire-ev1-vs-ev2-vs-ev3, difference-nfc-rfid-explained, digital-product-passports-nfc, eco-friendly-rfid-sustainable-cards, em4100-vs-t5577-125khz-comparison, google-review-nfc-cards-restaurants, hotel-key-card-design-printing, hotel-key-card-encoding-explained, hotel-key-card-not-working-troubleshooting, hotel-key-card-suppliers-guide, hotel-keycard-deactivated-phone-magnet, how-far-uhf-rfid-tag-read, how-hotel-rfid-key-cards-work, how-nfc-tags-work-smartphones, how-rfid-readers-work, how-to-choose-rfid-wristband-material, how-to-program-nfc-tags, java-cards-smart-card-os-explained, magnetic-stripe-vs-rfid-hotel-cards, manual-inventory-counting-errors-rfid, metal-nfc-cards-business-networking, mifare-classic-vs-desfire-hotel-chips, nfc-business-cards-guide, nfc-card-clone-security-prevention, nfc-christmas-gift-tags, nfc-door-locks-rfid-cards, nfc-product-authentication, nfc-smart-rings-guide, nfc-stickers-marketing-campaigns, nfc-tag-not-scanning-iphone-fix, nfc-tap-google-review, nfc-wedding-favor-tags, ntag213-vs-ntag215-vs-ntag216, pps-vs-silicone-vs-textile-laundry-tags, rain-rfid-2026-trends, rfid-asset-tracking-cost-benefit, rfid-asset-tracking-warehouses, rfid-card-demagnetized-myth-explained, rfid-card-how-it-works, rfid-card-materials-pvc-pet-abs-wood, rfid-conference-badges-guide, rfid-data-encoding-memory, rfid-elevator-floor-access, rfid-event-access-control-setup, rfid-event-wristband-revenue-impact, rfid-frequencies-lf-hf-uhf-explained, rfid-healthcare-patient-tracking, rfid-hotel-keycard-cost-comparison, rfid-interference-metal-environment-solutions, rfid-inventory-roi-calculator, rfid-key-fob-access-control, rfid-laundry-system-payback-period, rfid-laundry-system-roi, rfid-laundry-tags-buyers-guide, rfid-led-tags-warehouse-location, rfid-logistics-supply-chain, rfid-marathon-race-timing-setup, rfid-market-trends-forecast, rfid-reader-not-detecting-tags-troubleshooting, rfid-retail-inventory-management, rfid-retail-shrinkage-reduction-data, rfid-ski-pass-card-season, rfid-sustainability-circular-economy, rfid-system-cost-small-business, rfid-tag-lifespan-duration, rfid-tag-read-range-optimization, rfid-vs-manual-counting-savings, rfid-vs-qr-codes-events, rfid-warehouse-labor-savings, rfid-windshield-tags-vehicle-id, rfid-wristbands-festivals-events, rfid-wristbands-hotels-resorts, rfid-wristbands-music-festival-2026, silicone-vs-fabric-vs-tyvek-wristbands, total-cost-rfid-system-breakdown, uhf-rfid-wristbands-long-range, uhf-vs-hf-rfid-frequency-choice, warehouse-inventory-shrinkage-rfid-solution, waterproof-rfid-tags-outdoor, what-is-mifare-complete-guide, which-nfc-chip-most-memory, wooden-nfc-cards-eco-branding

Solutions slug（格式 /solutions/{slug}/）：
digital-product-passport, google-review-cards-for-checkout-counters, google-review-cards-for-clinics, google-review-cards-for-front-desks, google-review-cards-for-gyms-and-fitness-studios, google-review-cards-for-hotels, google-review-cards-for-pickup-counters, google-review-cards-for-restaurants, google-review-cards-for-retail-stores, google-review-cards-for-salons-and-spas, google-review-cards-for-tabletop-prompts, google-review-nfc-card, hotel-key-cards, hotel-rfid-access-control, nfc-brand-authentication, nfc-business-card, nfc-business-card-programs, nfc-luxury-authentication, rfid-access-control, rfid-asset-tracking-labels, rfid-attendance-system, rfid-event-access-control, rfid-event-wristbands, rfid-inventory-tracking, rfid-keyfobs-access-control, rfid-laundry-management, rfid-laundry-tags, rfid-laundry-tracking, rfid-library-management, rfid-parking-management, rfid-patient-tracking, rfid-race-timing, rfid-readers-and-encoding, rfid-supply-chain-management, rfid-tool-tracking, rfid-warehouse-management, vehicle-rfid-identification

Guides slug（格式 /guides/{slug}/）：
california-rfid-privacy-law, epc-gen2-uhf-rfid, eu-digital-product-passport-2027, fda-rfid-pharmaceutical-tracking, google-review-card-design-and-copy, google-review-card-placement-guide, google-review-card-staff-prompt-playbook, google-review-cards-for-auto-dealerships, google-review-cards-for-dental-groups, google-review-cards-for-fitness-franchises, google-review-cards-for-hotel-groups, google-review-cards-for-multi-location-brands, google-review-cards-for-restaurant-franchises, google-review-cards-for-salon-chains, google-review-nfc-card-setup, gs1-epc-encoding-guide, hotel-key-card-artwork-and-printing-checklist, hotel-key-card-encoding, hotel-key-card-material-selection, hotel-key-card-sample-planning, iso-14443-explained, iso-18000-6c-uhf-rfid-standard, item-level-rfid-tagging-mandate, nfc-business-card-iphone-android-compatibility, nfc-ndef-format-explained, nfc-rohs-reach-compliance, nfc-tag-programming-android-guide, nfc-tag-programming-iphone, python-rfid-reader-library, rain-rfid-explained, rfid-ce-marking-europe, rfid-food-safety-traceability, rfid-oracle-netsuite-integration, rfid-reader-writer-selection, rfid-sap-wms-integration, rfid-shopify-inventory-integration, rfid-tag-card-wristband-lifespan, uhf-rfid-reader-api-guide, walmart-rfid-tagging-mandate

Compare slug（格式 /compare/{slug}/）：
125khz-vs-13.56mhz-rfid, active-vs-passive-rfid, google-review-nfc-card-vs-nfc-sticker, hf-vs-uhf-rfid-for-asset-tracking, hotel-key-cards-vs-hotel-wristbands, keyfob-vs-card-vs-wristband-access-control, metal-vs-wood-vs-pvc-nfc-business-cards, mifare-classic-vs-plus-vs-desfire-hotel-locks, mifare-plus-ev2-vs-desfire-ev3, mifare-plus-vs-desfire, nfc-review-card-vs-qr-review-stand, nfc-vs-bluetooth, ntag213-vs-ntag215-vs-ntag216, on-metal-nfc-labels-vs-standard-nfc-stickers, pps-vs-silicone-laundry-tags, pps-vs-silicone-vs-textile-rfid-laundry-tags, pvc-vs-wood-vs-pla-hotel-key-cards, rfid-hotel-card-vs-magnetic-stripe, rfid-vs-barcode, rfid-vs-ble-asset-tracking, rfid-vs-magnetic-hotel-key-cards, rfid-vs-qr-code, rfid-wristband-vs-rfid-card, rfid-wristbands-hotels-vs-events-vs-resorts, silicone-vs-fabric-vs-woven-rfid-wristbands, uhf-vs-hf-rfid, uhf-vs-hf-rfid-laundry-tags

Compatibility slug（格式 /compatibility/{slug}/）：
be-tech-hotel-key-cards, hafele-dialock-hotel-key-cards, miwa-hotel-key-cards, onity-hotel-key-cards, saflok-hotel-key-cards, salto-hotel-key-cards, vingcard-hotel-key-cards

Industries slug（格式 /industries/{slug}/）：
agriculture, brand-protection, education, eu-compliance, events-venues, fitness, healthcare, hospitality, industrial, laundry-services, libraries, logistics, luxury-brands, pharmaceutical, retail-apparel

联系页：/contact/

> 说明：如果上面清单里找不到本产品主题对应的精准 slug，先检查 src/content/editorial/ 下是否存在该文件；不存在则不要编造路径，改用最接近的替代 slug。

【升级目标】
- summary：扩写到 180-280 词（当前平均仅 102 词，187/189 篇不达标）
- sections：保持 ≥6 条，至少使用 5 种以上不同组件类型（当前已达标）
- faq：保持 ≥8 条（当前已达标，重点优化 answer 质量和数据密度）
- resourceCards：保持 ≥3 个，⚠️ 修正所有 /product/ 链接为 /products/{category}/{slug}/
- brief：保持 ≥6 条（当前已达标）
- heroPoints：3-5 条，每条带数据或标准号
- imageSourceRoutes：修正为有效的 /products/{category}/{slug}/ 或其他 editorial 路由
- 每篇必须与其 sibling 产品（同子类别内同类产品）差异化，突出独特卖点
```

---

## 1. 产品页面主升级提示词（通用，适用于全部 5 个子类别）

```
请严格遵循【0. 通用系统上下文】中的所有红线规则（红线 1-5）。

任务：把下面这篇 ProudTek 产品页面 JSON 升级为 B2B 采购决策者愿意直接拿来做选型报告附件的深度产品参考页。保持 editorialSchema 合法。

<input_product>
[在这里粘贴单篇 products JSON 文件内容，包括外层 { ... }]
</input_product>

【产品页面特征 — 与 Blog/Solutions/Guides/Compare 的差异化定位】
产品页面的核心使命是：展示单个 RFID/NFC 产品的完整技术规格、应用场景、采购参数和差异化卖点，让采购决策者和技术评估工程师在一页内获取所有选型所需信息。
- 侧重「单产品全景」：芯片参数 + 材质规格 + 应用场景 + 定制选项 + MOQ/交期（区别于 Solutions 的方案全景）
- 侧重「可采购的具体 SKU」而非泛泛的技术知识（区别于 Guides 的操作指导）
- 侧重「本产品最适合的场景」而非两产品对比（区别于 Compare）
- 侧重「技术规格表 + 定制能力 + QA 保障」作为采购决策的硬支撑

【升级执行清单（按 AIDA 顺序 + JSON 字段映射）】

★ A. ATTENTION — 开篇 3 秒抓住读者

  1. 重写 summary 为 180-280 词（当前绝大多数仅 ~100 词，这是最关键的升级）：
     - 第一句直接给结论：这个产品是什么 + 解决什么核心问题 + 关键芯片型号/频率
     - 第二句插入 1 个真实行业痛点 + 1 个权威数据点（带年份 + 来源机构）
     - 中间段落覆盖：
       · 核心技术参数（频率、读距、内存、IP 等级、温度范围）
       · 2-3 个典型 B2B 应用场景
       · 关键合规标准号
     - 倒数第二句说明本产品对哪类采购决策者最有价值
     - 最后一句回到 ProudTek 制造能力：MOQ 灵活性、定制选项、交付能力
  2. 重写 heroPoints 为 3-5 条：
     - 每条格式："关键词 — 解释（含具体参数或标准号）"
     - 至少 2 条带具体数字（读距、温度范围、IP 等级、内存容量等）
     - 至少 1 条提及 ProudTek 制造/定制能力

★ I. INTEREST — 用技术纵深建立采购信心

  3. sections 保持 ≥6 个，至少使用 5 种不同组件类型。产品页面建议覆盖：
     - 1 个 statBar section（产品核心参数：频率、读距、内存、温度、IP 等级、寿命）
     - 1 个 table section（选型矩阵：芯片选项 × 参数维度，或应用场景 × 推荐配置）
     - 1 个 featureGrid section（3-6 条产品核心优势/技术特性）
     - 1 个 timeline section（定制流程：询价 → 确认规格 → 打样 → 确认 → 量产 → 交付）
     - 1 个 comparePanel section（不用本产品 vs 用本产品，强调 ROI）
     - 1 个 checklist section（采购选型清单 / QA 验收清单）
  4. 每个 section 必须带 title（≤12 词）和 intro（≤25 词的结论首句）
  5. 每条 paragraph ≤60 词（GEO 原子段）
  6. 涉及技术参数时引用准确标准号、芯片型号和厂商 datasheet 数据

★ D. DESIRE — 让读者代入自身采购项目

  7. brief 字段保持 6-8 条 label+text，产品页建议标签：
     - Chip / Frequency / Memory / Material / Dimensions / Read range / Operating temperature / IP rating / Printing options / MOQ & Lead time
  8. 至少 1 个 section 内嵌 callout（label + text + href），指向相关 solutions 页面或深度博客
  9. 至少 1 个 section 使用 testimonial（匿名 B2B 客户评价）或 dataHighlight（产品镇页数据）

★ A. ACTION — 强转化收尾

 10. faq 保持 ≥8 条，重点优化 answer 质量：
     - 每个 answer 60-120 词，第一句直接结论，至少含 1 个数字/标准号/芯片型号
     - 至少 2 条涉及「价格 / MOQ / 定制选项 / 交期」
     - 至少 2 条涉及「兼容性 / 读距 / 常见安装/使用失败场景」
     - 至少 1 条涉及「与竞品/替代品的差异」
 11. resourceCards 保持 ≥3 个，⚠️ 修正所有链接格式：
     - 第 1 个卡片：相关产品（链接同子类别 + 跨子类别的 /products/{category}/{slug}/）
     - 第 2 个卡片：深度阅读（混合 /blog/ + /solutions/ + /guides/ + /compare/）
     - 第 3 个卡片：获取样品或报价（含 /contact/ 链接）
     - ⚠️ 所有产品 href 必须用 /products/{category}/{slug}/ 格式
     - ⚠️ 禁止使用 /product/{slug}/ 旧格式
 12. primaryAction 指向 /contact/，secondaryActions 2-4 条指向最相关的产品、博客或 solutions 页面
 13. imageSourceRoutes 修正为有效的 /products/{category}/{slug}/ 或其他 editorial 路由
     - ⚠️ 禁止使用 /product/{slug}/ 旧格式

★ SEO + GEO 横向要求（贯穿全 JSON）
 14. title 50-75 字符，含产品名称 + 主关键词 + 差异化卖点
 15. kicker 5-10 词，与 title 不同角度
 16. 主关键词在 title、summary 首段、至少 1 个 section title、至少 1 条 FAQ question 里自然出现
 17. 累计内部链接 ≥8 个（分布在 resourceCards + callout.href + primaryAction + secondaryActions 中）
 18. 禁止在 section 正文字段（paragraphs、bullets、table.rows、faq.answer）里写 URL 或 HTML 超链接

【输出格式】

第一部分 — 升级摘要（用纯文本，不要 JSON，不要 HTML）
  · summary 词数变化（旧 → 新）
  · 链接格式修正清单（列出所有 /product/ → /products/{category}/{slug}/ 的修正）
  · 新增的数据点与来源（列表）
  · 新增或重构的 section 列表及其使用的组件类型
  · FAQ 优化说明
  · 引用的内部链接清单
  · 与同子类别 sibling 产品的差异化角度说明
  · 关键改动说明（≤5 条）

第二部分 — 完整升级后的 JSON
  · 直接以 { 开头、以 } 结尾
  · 不要 markdown 代码块包装
  · 不要任何前置说明文字
  · 必须是合法 JSON（可直接 JSON.parse）
  · 字段顺序遵循【0. 通用系统上下文】中的顶层字段顺序
```

---

## 2. Summary 扩写专项（最高优先级 — 187/189 篇需要）

```
请严格遵循【0. 通用系统上下文】中的所有红线规则。

任务：把下面这篇产品页面的 summary 从当前 ~100 词扩写到 180-280 词。只修改 summary 字段，其他字段不动。

<input_product>
[在这里粘贴单篇 products JSON 文件内容]
</input_product>

【Summary 扩写结构（180-280 词，5 段式）】

第 1 段（结论开头，~30 词）：
- 产品定义 + 核心芯片/频率 + 一句话最大价值主张
- 例："An RFID ceramic tag is a UHF transponder housed in a dense alumina substrate, engineered for continuous 300°C operation in foundry and autoclave environments where all polymer tags fail."

第 2 段（行业痛点 + 数据，~40 词）：
- 不用本产品时的真实损失 + 1 个权威数据点（年份 + 来源）
- 例："Manual tracking of high-temperature metal parts costs foundries an estimated $2.1 million per year in lost inventory and production delays (McKinsey, 2024)."

第 3 段（技术参数核心，~60 词）：
- 频率、读距、内存、IP 等级、温度范围、关键标准号
- 材质和耐久性数据
- 可选芯片列表

第 4 段（应用场景 + 目标读者，~50 词）：
- 2-3 个具体 B2B 应用场景
- 说明哪类采购角色最需要这个产品

第 5 段（ProudTek 供应能力，~40 词）：
- 定制选项（尺寸、印刷、编码）
- MOQ 灵活性和交付周期
- 质检保障（100% 检测等）

【输出格式】合法 JSON 对象，只包含 summary 字段：

{
  "summary": "扩写后的 180-280 词 summary..."
}

【禁止】
- 不要 markdown 代码块包装
- 不要前置/后置说明文字
- 不要 HTML 标签
- 不要 emoji
- 不要营销废话
- summary 里不写 URL
```

---

## 3. 链接修正专项（175 处 /product/ → /products/{category}/{slug}/ 修正）

```
请严格遵循【0. 通用系统上下文】中的所有红线规则。

任务：修正下面这篇产品页面 JSON 中所有错误格式的内部链接。

<input_product>
[在这里粘贴单篇 products JSON 文件内容]
</input_product>

【链接修正规则】

1. 产品页链接：
   ❌ /product/{slug}/ → ✅ /products/{category}/{slug}/
   - 你需要根据 slug 判断它属于哪个 category（rfid-cards / rfid-keyfobs / rfid-labels / rfid-tags / rfid-wristbands）
   - 参考【有效链接白名单】中的完整 slug 列表确定正确的 category

2. imageSourceRoutes 中的链接同样需要修正

3. 如果某个 /product/{slug}/ 在白名单中找不到对应的 products slug：
   - 不要编造路径
   - 用白名单中最接近的替代 slug
   - 在升级摘要中说明替换理由

4. 确保修正后的链接以 / 结尾

【常见 slug → category 映射参考】

含 "card" / "badge" / "blocking" / "bamboo" / "wooden" / "transparent" / "metal-business" → rfid-cards
含 "keyfob" / "key-fob" / "key-tag" / "keychain" / "coin-keyfob" / "wristwatch-tag" → rfid-keyfobs
含 "label" / "sticker" / "inlay" / "hang-tag" / "poster" / "table-stand" / "shelf" / "passport-tag" / "authentication" / "spine" → rfid-labels
含 "wristband" → rfid-wristbands
其他 "tag" / "seal" / "chip" / "token" → rfid-tags

【输出格式】

第一部分 — 链接修正清单（纯文本表格）
  字段路径 | 旧链接 | 新链接 | 修正原因

第二部分 — 修正后的完整 JSON（无 markdown 包装）
```

---

## 4. 数据 + 案例注入专项

```
请严格遵循【0. 通用系统上下文】中的所有红线规则。

任务：往下面这篇 ProudTek 产品页面 JSON 里精准注入 5-8 个真实可查的数据点 + 至少 2 个公开案例。保持 JSON 合法。

<input_product>
[在这里粘贴单篇 products JSON 文件内容]
</input_product>

【硬要求】
- 每个数据必须带：具体数字 + 年份 + 来源机构
- 优先来源：GS1、IDTechEx、RFID Journal、Statista、ABI Research、Auto-ID Lab、European Commission、FDA、ISO、Impinj 投资者报告、NXP annual report、Avery Dennison、Checkpoint Systems、McKinsey retail reports
- 优先 2023-2026 年的数据
- 每个数据自然嵌入到相关 section 的 paragraphs / bullets / callout.text / dataHighlight 字段中
- 如果本文缺少 dataHighlight section，补充 1 个

【产品页面特别适合的数据类型】
1. 市场规模 / 出货量（该类产品的全球部署规模）
2. ROI 案例（使用该产品后的效率提升 / 成本节约）
3. 标杆客户部署（仅公开案例）
4. 技术参数对比（与替代方案的量化差异）
5. 法规驱动需求（相关法规的截止日期和合规要求）
6. 产品寿命 / 可靠性数据（读写次数、耐温测试、IP 等级验证）

【输出】
第一部分 — 数据注入清单（纯文本）
  位置 | 注入的数据 | 来源
第二部分 — 改动后的完整 JSON（无 markdown 包装）
```

---

## 5. FAQ 优化专项（提升 answer 质量和数据密度）

```
请严格遵循【0. 通用系统上下文】中的所有红线规则。

任务：优化下面这篇产品页面的 8 条 FAQ，提升 answer 的数据密度和 GEO 抽取友好度。返回合法 JSON 数组。

<input_product>
[在这里粘贴单篇 products JSON 的 faq 数组，或完整文件]
</input_product>

【产品页 FAQ 设计原则】

1. 问题必须针对具体产品，不要泛泛的 "What is RFID?"
   ✅ "What is the maximum read range of an RFID ceramic tag on metal surfaces?"
   ✅ "Can NTAG213 stickers store a URL longer than 130 characters?"
   ❌ "What is NFC?"（太宽泛）

2. 答案 60-120 词，第一句必须是可直接引用的结论
   ✅ "RFID ceramic tags achieve 1-3 m read range on metal surfaces using UHF 860-960 MHz, per ISO/IEC 18000-63. The ceramic dielectric naturally..."
   ❌ "There are several factors that affect read range..."

3. 每条 answer 包含 1-2 个具体数字 / 标准号 / 芯片型号

【产品页 FAQ 分布建议（8 条）】
- 2 条：产品技术参数（频率/读距/内存/温度/IP/兼容性）
- 2 条：采购参数（MOQ/定制选项/交期/价格区间/样品流程）
- 1 条：应用场景推荐（哪些行业/场景最适合）
- 1 条：与替代品/竞品的差异（为什么选这个而不是那个）
- 1 条：常见失败场景/疑难排查（安装错误/环境影响/读取失败）
- 1 条：合规/标准/认证要求

【输出格式】合法 JSON 数组，可直接替换 "faq" 字段值

[
  { "question": "...", "answer": "..." },
  ...（共 8 条）
]
```

---

## 6. 对比组件生成专项

```
请严格遵循【0. 通用系统上下文】中的所有红线规则。

任务：为下面这篇产品页面生成 1-2 个高密度的结构化对比组件，以 section 形式嵌入到原 JSON 的 sections 数组中。

<input_product>
[在这里粘贴产品 JSON]
</input_product>

【产品页面适用的对比维度】

rfid-cards 子类：
- 芯片选型矩阵：MIFARE Classic vs Plus SE vs DESFire EV3 × 安全性/内存/读速/单价/场景
- 卡片材质对比：PVC vs PET vs ABS vs 木质 vs 金属 × 耐久性/成本/印刷/环保

rfid-keyfobs 子类：
- 外壳材质对比：ABS vs 环氧 vs 皮革 vs 硅胶 vs 金属 × IP 等级/耐温/成本/美观度
- LF vs HF 钥匙扣：EM4100 vs T5577 vs MIFARE Classic vs DESFire × 安全/兼容/价格

rfid-labels 子类：
- 芯片选型：NTAG213 vs 215 vs 216 vs 424 DNA × 内存/安全/价格/应用
- 基材对比：纸质 vs PET vs PVC vs 纺织 × 耐久/成本/应用/环保
- NFC vs UHF inlay：频率/读距/单价/应用场景

rfid-tags 子类：
- 外壳材质：ABS vs 环氧 vs 陶瓷 vs PCB vs 硅胶 × 耐温/IP/读距/安装方式
- on-metal vs off-metal 性能差异
- 工业标签寿命对比：不同环境条件下的预期寿命

rfid-wristbands 子类：
- 材质对比：硅胶 vs 织物 vs PVC vs Tyvek vs 尼龙 × 耐久/舒适/成本/场景
- 芯片选型：MIFARE Classic vs DESFire vs UHF × 安全/读距/多应用/价格

【组件选型规则】
- 维度 ≥3 → 使用 table
- 两极对比 → 使用 comparePanel
- 同类并列特性 → 使用 featureGrid

【输出】
第一部分 — 对比组件选型说明（纯文本，≤5 句话）
第二部分 — 新 section 对象数组（合法 JSON）
```

---

## 7. 内部交叉链接专项

```
请严格遵循【0. 通用系统上下文】中的所有红线规则。

任务：为下面这篇产品页面补齐内部链接，确保总链接数 ≥8 条。

<input_product>
[在这里粘贴产品 JSON]
</input_product>

【产品页面的链接策略 — 全站互联】

产品页面处于全站链接体系的核心节点，应该充分利用交叉链接：
- Products → 链接到同子类别 sibling 产品（如同为 rfid-cards 的其他卡片）
- Products → 链接到跨子类别互补产品（如卡片 → 相关钥匙扣或腕带）
- Products → 链接到相关 Solutions（方案全景）
- Products → 链接到相关 Guides（技术深挖）
- Products → 链接到相关 Compare（选型对比）
- Products → 链接到相关 Blog（深度文章）
- Products → 链接到相关 Industries（行业应用）

【链接分布目标】
- resourceCards（≥3 卡片 × 3-4 links）：占总链接的 60-70%
- callout.href（1-2 个）：占 10-15%
- primaryAction + secondaryActions：占 20-25%
- 至少覆盖 3 种不同目标类型（/products/ + /blog/ + /solutions/ 或其他）

【⚠️ 产品链接格式提醒】
所有产品链接必须使用 /products/{category}/{slug}/ 格式
❌ /product/{slug}/
✅ /products/rfid-cards/mifare-classic-1k-card/

【输出】
第一部分 — 链接清单（纯文本表格）
  插入位置 | 锚文本 | 目标 href
第二部分 — 插入链接的完整 JSON
```

---

## 8. GEO 优化专项

```
请严格遵循【0. 通用系统上下文】中的所有红线规则。

任务：把下面这篇产品页面改造成 AI 搜索引擎（Google AI Overview、Perplexity、ChatGPT Search、Claude）会主动引用的「权威产品参考」格式。

<input_product>
[在这里粘贴产品 JSON]
</input_product>

【GEO 八大原则 — 产品页面特化版】

1. 断言式开头
   每个 section intro 必须是可直接引用的产品事实陈述
   ✅ "RFID ceramic tags withstand continuous operation at 300°C, per alumina Al₂O₃ substrate specifications rated to ISO 10545-8 thermal shock resistance."
   ❌ "There are several high-temperature RFID options available."

2. 数据具象化
   产品参数必须精确到 datasheet 数据，不要用 "excellent" / "good" / "high performance"
   ✅ "1-3 m read range on metal surfaces at 860-960 MHz, -22 dBm tag sensitivity"
   ❌ "Good read range on metal"

3. 结构化原子段
   每条 paragraph ≤60 词 = 1 个可独立引用的产品论断

4. 实体显式标记
   芯片全名首次出现用完整型号（"NXP MIFARE DESFire EV3 8K"），后续可缩写

5. 答案前置的 FAQ
   每个 answer 首句直接给产品参数或结论

6. 规格表
   至少 1 个 table section（产品选型矩阵 / 规格对比）— 这是 Google Featured Snippet 的高价值资产

7. 权威标注
   paragraphs/bullets 末尾加标准号或来源：
   "(ISO/IEC 14443A)" / "(NXP datasheet)" / "(IP68, IEC 60529)" / "(UL 94 V-0)"

8. 可选 Sources section
   如果该产品引用了大量外部数据，追加 1 个 "Sources and further reading" section

【输出】
第一部分 — GEO 优化报告（纯文本）
  · 改造的字段和原则对应关系
  · 命中哪些 AI 搜索意图查询（列出 5-10 个）
第二部分 — 改造后的完整 JSON
```

---

## 9. 子类别特化升级提示词

### 9a. rfid-cards 子类（29 篇）

```
请严格遵循【0. 通用系统上下文】中的所有红线规则。

【rfid-cards 特化指导 — 在通用升级提示词基础上额外注意】

1. summary 必须包含：卡片尺寸标准（ISO 7810 CR-80）、芯片型号、频率、关键安全特性
2. brief 必须包含：Chip / Frequency / Standard / Card body / Memory / Security / Printing / MOQ & Lead time
3. 酒店卡片（assa-abloy-compatible / magnetic-stripe-combo 等）：
   - 必须提及门锁兼容性品牌（Saflok / Onity / VingCard / SALTO）
   - 链接到 /compatibility/ 和 /solutions/hotel-key-cards/
4. NFC 名片类（metal-business-card / wooden-card / bamboo-card）：
   - 必须提及 NFC Forum Type 2/4 认证和智能手机兼容性
   - 链接到 /solutions/nfc-business-card/ 和 /blog/nfc-business-cards-guide/
5. 安全类（desfire / plus-se / ntag424-dna）：
   - 必须提及具体加密算法（AES-128 / 3DES / Crypto-1）
   - 链接到 /compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/ 和 /blog/desfire-ev1-vs-ev2-vs-ev3/

<input_product>
[粘贴 rfid-cards 子类的 JSON]
</input_product>
```

### 9b. rfid-keyfobs 子类（14 篇）

```
请严格遵循【0. 通用系统上下文】中的所有红线规则。

【rfid-keyfobs 特化指导】

1. summary 必须包含：外壳材质（ABS/环氧/皮革/硅胶/金属）、芯片选项、IP 等级、钥匙环耐久性
2. brief 必须包含：Housing / Chip options / IP rating / Key ring durability / Dimensions / Colour options / MOQ & Lead time
3. 双频钥匙扣（dual-frequency-key-fob）：
   - 强调 LF+HF 双系统兼容和迁移场景
   - 链接到 /products/rfid-cards/dual-frequency-rfid-card/
4. 所有钥匙扣都要强调门禁场景（access control）：
   - 链接到 /solutions/rfid-access-control/ 和 /solutions/rfid-keyfobs-access-control/
   - 链接到 /blog/rfid-key-fob-access-control/
5. 对比维度：与同芯片的卡片形态对比（keyfob vs card 的便携性/耐久性/成本差异）
   - 链接到 /compare/keyfob-vs-card-vs-wristband-access-control/

<input_product>
[粘贴 rfid-keyfobs 子类的 JSON]
</input_product>
```

### 9c. rfid-labels 子类（56 篇）

```
请严格遵循【0. 通用系统上下文】中的所有红线规则。

【rfid-labels 特化指导 — 最大子类，产品类型跨度最大】

此子类包含 4 种差异很大的产品线，升级时必须针对性区分：

A. NFC 贴纸/标签（ntag213/215/216/424-dna，nfc-anti-metal-sticker 等）：
   - 强调智能手机兼容性（iPhone 7+, NFC Android）
   - 强调 NDEF 编码和 URL 容量
   - 典型场景：品牌认证、数字产品护照、Google Review、营销活动
   - 链接到 /blog/how-nfc-tags-work-smartphones/ 和 /guides/nfc-ndef-format-explained/

B. UHF RFID 标签/inlay（uhf-rfid-paper-label, apparel-hang-tag, inlay 等）：
   - 强调读距（1-12m）、EPC 编码、批量出货量
   - 典型场景：零售库存（Walmart mandate）、仓储物流、供应链
   - 链接到 /guides/walmart-rfid-tagging-mandate/ 和 /solutions/rfid-inventory-tracking/

C. NFC 行业认证/溯源标签（luxury-handbag, spirits, pharmaceutical, food-traceability 等）：
   - 强调防篡改（tamper-evident）、NTAG424 DNA 签名验证
   - 法规驱动：EU DPP (ESPR 2024/1781)、FSMA 204、DSCSA
   - 链接到 /guides/eu-digital-product-passport-2027/ 和 /solutions/nfc-brand-authentication/

D. 专业 RFID 标签（blood-bag, cryogenic, medication-vial, specimen 等）：
   - 强调极端环境耐受性（低温、灭菌、化学品）
   - 强调合规标准（FDA 21 CFR、ISO 15189、GS1 GTIN 编码）
   - 链接到 /solutions/rfid-patient-tracking/ 和 /guides/fda-rfid-pharmaceutical-tracking/

<input_product>
[粘贴 rfid-labels 子类的 JSON]
</input_product>
```

### 9d. rfid-tags 子类（70 篇）

```
请严格遵循【0. 通用系统上下文】中的所有红线规则。

【rfid-tags 特化指导 — 最大文件数量，工业应用为主】

此子类以硬质工业标签为主，产品差异主要体现在外壳材质和应用环境：

A. 高温标签（ceramic-tag, high-temperature-*, high-temp-silicone）：
   - 强调耐温上限（200°C / 300°C / 400°C）和基材选择（陶瓷/PTFE/硅胶）
   - 链接到 /blog/waterproof-rfid-tags-outdoor/ 和 /blog/rfid-interference-metal-environment-solutions/

B. 金属表面标签（anti-metal-tag, on-metal-uhf-tag, pcb-tag, pcb-screw-mount）：
   - 强调 on-metal 读距（vs off-metal 的性能差异）和铁氧体/陶瓷隔离层
   - 链接到 /compare/on-metal-nfc-labels-vs-standard-nfc-stickers/

C. 洗涤标签（pps-laundry-chip, textile-laundry-tag, uhf-rfid-woven-care-label）：
   - 强调耐洗次数（200-500 次）、耐温（≤180°C 热压）、ISO 6330 测试
   - 链接到 /solutions/rfid-laundry-management/ 和 /compare/pps-vs-silicone-laundry-tags/

D. 资产管理标签（tool-tag, fire-extinguisher-tag, gas-cylinder-tag, pallet-tag 等）：
   - 强调固定方式（螺钉/铆钉/扎带/胶粘/嵌入）和预期寿命
   - 链接到 /solutions/rfid-asset-tracking-labels/ 和 /solutions/rfid-tool-tracking/

E. 特种标签（animal-ear-tag, fish-tag, tire-tag, glass-capsule, concrete-embed 等）：
   - 强调行业特定合规（ISO 11784/11785 动物标识、FDA UDI 等）
   - 强调极端环境耐受（水下、土壤、混凝土固化）

<input_product>
[粘贴 rfid-tags 子类的 JSON]
</input_product>
```

### 9e. rfid-wristbands 子类（20 篇）

```
请严格遵循【0. 通用系统上下文】中的所有红线规则。

【rfid-wristbands 特化指导】

1. summary 必须包含：腕带材质、芯片、频率、典型佩戴场景和耐久性
2. brief 必须包含：Material / Chip / Frequency / Closure type / Waterproof rating / Comfort / Reusability / MOQ & Lead time
3. 活动型腕带（paper, tyvek, vinyl, fabric）：
   - 强调一次性使用、快速部署、RFID+QR 组合
   - 强调活动场景：音乐节、体育赛事、会议
   - 链接到 /solutions/rfid-event-wristbands/ 和 /blog/rfid-wristbands-festivals-events/
4. 持久型腕带（silicone, nylon, elastic, adjustable-silicone）：
   - 强调长期佩戴、IP68 防水、多应用（门禁+消费+储物柜）
   - 强调场所场景：水上乐园、健身房、酒店度假村
   - 链接到 /solutions/rfid-event-access-control/ 和 /blog/rfid-wristbands-hotels-resorts/
5. 医疗腕带（hospital-patient-id, medical-alert）：
   - 强调患者识别准确性、消毒兼容性、ISO/IEC 15693 兼容
   - 链接到 /solutions/rfid-patient-tracking/ 和 /blog/rfid-healthcare-patient-tracking/
6. 支付腕带（cashless-payment, nfc-payment）：
   - 强调 NFC 支付兼容、多钱包分区、活动收入提升数据
   - 链接到 /blog/cashless-payment-rfid-wristbands/ 和 /blog/rfid-event-wristband-revenue-impact/

<input_product>
[粘贴 rfid-wristbands 子类的 JSON]
</input_product>
```

---

## 推荐工作流

针对 189 篇产品页面，按以下顺序操作：

| 步骤 | 用哪个提示词 | 预期产出 | 优先级 |
|------|------------|---------|--------|
| 1 | #3 链接修正 | 修正全部 175 处 /product/ → /products/{category}/{slug}/ | 🔴 最高（可批量脚本处理） |
| 2 | #2 Summary 扩写 | 187 篇 summary 扩写到 180-280 词 | 🔴 最高（最大内容缺口） |
| 3 | #1 或 #9a-e 分类主升级 | 全面提升（summary + 链接 + 数据 + 组件 + FAQ） | 🟡 高 |
| 4 | #4 数据注入 | 替换空泛表述为带年份+来源的数据 | 🟡 高 |
| 5 | #5 FAQ 优化 | 提升 answer 的数据密度和 GEO 友好度 | 🟢 中 |
| 6 | #6 对比组件 | 补足 table / comparePanel / featureGrid | 🟢 中 |
| 7 | #7 内部链接 | 修正 + 补充全站交叉链接 | 🟢 中 |
| 8 | #8 GEO 改造 | AI 搜索引擎优化 | 🔵 低 |
| 9 | 验证 | JSON 合法性 + editorialSchema 校验 + Astro build | 🔴 必做 |

**批量处理建议**：

- **步骤 1（链接修正）可以用 Python 脚本自动化**：正则替换 `/product/{slug}/` → `/products/{category}/{slug}/`，根据 slug 查找正确的 category
- **步骤 2（Summary 扩写）建议按子类别批量**：
  1. rfid-keyfobs（14 篇）→ 先处理，数量少
  2. rfid-wristbands（20 篇）→ 其次
  3. rfid-cards（29 篇）→ 中等
  4. rfid-labels（56 篇）→ 按产品线 A/B/C/D 分批
  5. rfid-tags（70 篇）→ 按应用分类 A/B/C/D/E 分批
- **步骤 3+（全面升级）可以将步骤 1-8 合并**：使用 #1 或 #9a-e 一站式处理，一次对话完成单篇全部升级

---

## 验证清单

每次产出后必须检查：

一、JSON 合法性
- [ ] 无 markdown 代码块包装
- [ ] 无 HTML 标签混入 JSON 字符串
- [ ] 无尾随逗号
- [ ] 所有双引号正确转义
- [ ] 可以 JSON.parse() 不报错

二、Schema 合规
- [ ] group = "products"
- [ ] route = /products/{category}/{slug}/ 格式，以 / 结尾
- [ ] sections ≥6、组件类型 ≥5 种
- [ ] faq ≥8 条
- [ ] resourceCards ≥3 个
- [ ] brief ≥6 条
- [ ] heroPoints 3-5 条
- [ ] table.rows 每行长度 = columns 长度
- [ ] featureGrid.features[].icon 不是 URL
- [ ] statBar 格式 { items: [{ value, label }] }
- [ ] comparePanel 格式 { before: [], after: [], beforeHeading?, afterHeading? }
- [ ] timeline 格式 { items: [{ label, text }] }
- [ ] testimonial 格式 { text, source }
- [ ] dataHighlight 格式 { value, heading, text, source? }
- [ ] callout 格式 { label, text, href? }
- [ ] image 格式 { src, alt }（对象，不是字符串）
- [ ] resourceCards.links 格式 [{ href, label }]（数组，不是 flat href）

三、链接格式
- [ ] ⚠️ 无 /product/{slug}/ 旧格式链接
- [ ] 所有产品链接为 /products/{category}/{slug}/ 格式
- [ ] 所有 href 在有效链接白名单中
- [ ] imageSourceRoutes 不含 /product/ 旧格式
- [ ] 无 https://... 外部链接
- [ ] 无重复 href

四、内容质量
- [ ] summary 180-280 词
- [ ] summary 第一句是强结论
- [ ] heroPoints 至少 2 条带数字/标准号
- [ ] 每条 paragraph ≤60 词
- [ ] 至少 1 个 dataHighlight 或 testimonial
- [ ] 至少 1 个 callout 带 href
- [ ] FAQ answer 第一句是直接结论
- [ ] 无营销废话
- [ ] 无 emoji（featureGrid.icon 除外）
- [ ] 无 AI 腔开头

五、Astro Build
- [ ] 运行 `npm run build` 无报错
- [ ] 所有 189 个产品页面正常渲染
