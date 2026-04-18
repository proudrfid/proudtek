# Blog 主图审核报告（90 篇）

**生成时间：** 2026-04-18
**审核方式：** 逐张读图 + 标题语义比对；已与本地 `/public/landing-images/` 215 张图库交叉比对
**状态：** ✅ 已执行（2026-04-18）—— 共修改 79 个 JSON 文件（替换 29 个错配 + 插入 50 个缺失 heroImage 字段），全部通过 JSON 语法校验，目标图片 100% 存在。独特主图数量从 17 张提升到 47 张。

---

## 总体结论

| 类别 | 数量 | 占比 |
|---|---|---|
| ✅ 合适（MATCH） | 6 | 7% |
| 🟡 勉强相关（PARTIAL） | 7 | 8% |
| ❌ 主题不符（MISMATCH） | 27 | 30% |
| ⚫ 缺图（heroImage 为空） | 50 | 55% |
| 💥 链接损坏（文件不存在） | 2 | 2% |

**最大的两个问题：**

1. **50 篇博客 `heroImage` 为空字符串** —— 占一半以上，页面渲染时没有主图。这是整个 blog 模块最严重的问题。
2. **图片复用严重** —— 剩下 40 篇博客只用了 17 张图，其中 `ntag213-nfc-sticker.jpg`（实际内容是一张 Android 手机"please scan the NFC tag"截图，文件名也不准）被塞到 6 篇主题各异的文章上；`ppc-hotel-key-cards.jpg` 和 `ppc-custom-rfid-cards.jpg` 是同一张"海口美兰机场员工通行证"图片，却被同时挂在酒店、普通 RFID 卡、滑雪卡等文章上。
3. **2 张图片文件不存在** —— `/landing-images/ppc-rfid-wristbands.jpg` 被 2 篇引用但 `public/landing-images/` 里没有这个文件，会渲染成 404。

**本地图库够不够用？**  够。`/public/landing-images/` 里有 215 张专业且文件名准确的产品/场景图，足以覆盖几乎所有 blog 题目。下面的替换建议**优先指向本地文件**，只对极少数本地没有对应产品图的（NFC 圣诞/婚礼标签、RFID 滑雪卡、NFC 餐厅评论贴纸等）才建议上网搜图。

---

## 一、图文明显不符（27 篇 MISMATCH）

### 1.1  `ntag213-nfc-sticker.jpg` → 实际是手机"scan NFC tag"截屏（不是贴纸）

| Slug | 标题 | 问题 | 本地替换建议 |
|---|---|---|---|
| `how-far-uhf-rfid-tag-read` | How Far Can a UHF RFID Tag Be Read? | 讲 UHF 读距，图却是 NFC 手机 UI | `long-range-uhf-windshield-sticker.jpg` 或 `impinj-m800-uhf-inlay.jpg` |
| `nfc-christmas-gift-tags` | NFC Christmas Gift Tags | 讲节日礼品，图却是手机 UI | 本地无节日图，建议网搜 [Unsplash: christmas gift tag](https://unsplash.com/s/photos/christmas-gift-tag) |
| `nfc-tag-not-scanning-iphone-fix` | NFC Tag Not Scanning on iPhone? | 图里是 Android 手机，文章讲 iPhone | `nfc-tap-to-pay-sticker.jpg`（iPhone tap 场景更贴） |
| `nfc-wedding-favor-tags` | NFC Wedding Favor Tags | 婚礼场景，图却是手机 UI | 本地无婚礼图，建议网搜 [Unsplash: wedding favor](https://unsplash.com/s/photos/wedding-favor) |
| `rfid-retail-shrinkage-reduction-data` | RFID Retail Shrinkage Reduction | 零售防损，图却是手机 UI | `retail-apparel.jpg` 或 `uhf-rfid-retail-price-label.jpg` |
| `rfid-tag-lifespan-duration` | How Long Does an RFID Tag Last? | 标签寿命，图却是手机 UI | `rfid-ceramic-tag.png`（耐用型标签更直观）|

### 1.2  `ppc-hotel-key-cards.jpg` / `ppc-custom-rfid-cards.jpg` → 实际是"海口机场员工通行证"中文 ID 卡

| Slug | 标题 | 问题 | 本地替换建议 |
|---|---|---|---|
| `best-rfid-card-for-hotels` | Best RFID Card for Hotels | 酒店卡，图却是机场员工证 | `hotel-key-cards-hero.webp` 或 `mifare-classic-plus-desfire-hotel-chip-compare.jpg` |
| `hotel-key-card-not-working-troubleshooting` | Hotel Key Card Not Working? Troubleshooting | 同上 | `hotel-key-cards-hero.webp` |
| `hotel-keycard-deactivated-phone-magnet` | Hotel Keycard Deactivated by Phone Magnet | 同上 | `hotel-key-cards-hero.webp` + 手机磁铁对比图（本地无，可网搜） |
| `rfid-hotel-keycard-cost-comparison` | Hotel Key Card Cost Comparison | 同上 | `hotel-key-cards-hero.webp` |
| `rfid-card-demagnetized-myth-explained` | Can an RFID Card Be Demagnetized? | 讲 RFID vs 磁条，图却是机场证 | `rfid-card-magnetic-stripe-combo.jpg`（完美对应） |
| `rfid-card-how-it-works` | How Does an RFID Card Work? | 原理文，图却是机场证 | `em4100-rfid-card.jpg` 或 `rfid-dual-frequency-card.jpg` |
| `rfid-ski-pass-card-season` | RFID Ski Pass Cards 2026-2027 | 滑雪卡，图却是机场证 | 本地无滑雪图，建议网搜 [Unsplash: ski lift gate](https://unsplash.com/s/photos/ski-lift) |

### 1.3  `industrial.webp` → 汽车焊接流水线（不是 RFID 场景）

| Slug | 标题 | 问题 | 本地替换建议 |
|---|---|---|---|
| `cost-per-rfid-tag-2026` | Cost Per RFID Tag in 2026 | 讲标签单价，图却是汽车厂 | `uhf-rfid-paper-label.jpg`（展示批量标签更贴） |
| `rfid-system-cost-small-business` | Is RFID Too Expensive for Small Business? | 小企业，图却是巨型车厂 | `retail-apparel.jpg`（小店零售场景） |
| `rfid-tag-read-range-optimization` | RFID Tag Read Range Too Short? | 读距故障，图却是车厂 | `impinj-m700-uhf-inlay.jpg` 或 `rfid-on-metal-uhf-tag.jpg` |

### 1.4  `eu-compliance.jpg` → 满货架的整洁仓库

| Slug | 标题 | 问题 | 本地替换建议 |
|---|---|---|---|
| `difference-nfc-rfid-explained` | Difference Between NFC and RFID | 原理对比，图却是仓库 | `nfc-dry-inlay.jpg` + `uhf-rfid-inlay.jpg` 对比组图（本地都有） |
| `which-nfc-chip-most-memory` | Which NFC Chip Has the Most Memory? | 芯片对比，图却是仓库 | `ntag213-nfc-sticker.jpg` / `ntag215-nfc-sticker.jpg` / `ntag216-nfc-sticker.jpg` 并排 |

### 1.5  `events-venues.jpg` → 演唱会五彩纸屑

| Slug | 标题 | 问题 | 本地替换建议 |
|---|---|---|---|
| `nfc-card-clone-security-prevention` | NFC Card Cloning: Security Risks | 讲安全/克隆，图却是演唱会 | `ntag424-dna-tt-card.png`（DNA 防克隆卡）或 `rfid-employee-badge.jpg` |
| `rfid-conference-badges-guide` | RFID Conference Badges | 讲会议证，图却是演唱会观众 | `rfid-employee-badge.jpg`（名字虽叫 employee 但视觉为挂绳证件） |
| `rfid-marathon-race-timing-setup` | RFID Marathon Timing Chip Setup | 马拉松，图却是演唱会 | **`rfid-race-timing-tag.jpg` —— 完美本地匹配** |

### 1.6  `rfid-anti-metal-tag.jpg` → 实际是一卷白色纸质标签（不是抗金属标签）

| Slug | 标题 | 问题 | 本地替换建议 |
|---|---|---|---|
| `rfid-interference-metal-environment-solutions` | RFID Interference in Metal Environments | 讲抗金属，图却是纸标签卷 | **`rfid-on-metal-uhf-tag.jpg`** 或 `anti-metal-uhf-it-asset-tag.jpg` |
| `rfid-reader-not-detecting-tags-troubleshooting` | RFID Reader Not Detecting Tags? Troubleshooting | 讲读写故障，图却是纸标签卷 | `impinj-m700-uhf-inlay.jpg` 或 `alien-higgs-9-uhf-inlay.jpg` |

### 1.7  其他零散错配

| Slug | 标题 | 现图 | 问题 | 本地替换建议 |
|---|---|---|---|---|
| `access-card-copied-security-upgrade` | Access Card Copied? How to Upgrade Building Security | `ntag424-dna-tamper-evident-tag.jpg`（圆形 NFC 棒棒糖贴纸） | 文章讲楼宇门禁卡升级，图却是易碎 NFC 贴纸 | **`ntag424-dna-tt-card.png`**（NTAG424 DNA 门禁卡，与主题完全吻合） |
| `warehouse-inventory-shrinkage-rfid-solution` | Warehouse Inventory Shrinkage | `retail-apparel.jpg`（零售店员手持机） | 讲仓库，却用零售店图 | `logistics.jpg` 或 `eu-compliance.jpg`（仓库更合适） |

---

## 二、勉强相关（7 篇 PARTIAL，可保留但不最优）

| Slug | 标题 | 现图 | 评价 |
|---|---|---|---|
| `ai-rfid-inventory-management` | AI and RFID Inventory Management | `retail-apparel.jpg` | RFID 盘点场景对得上，AI 角度没体现，可保留 |
| `manual-inventory-counting-errors-rfid` | Manual Inventory Counting Errors | `retail-apparel.jpg` | ✅ 基本对 |
| `rfid-inventory-roi-calculator` | RFID Inventory ROI Calculator | `retail-apparel.jpg` | 零售盘点场景 OK |
| `rfid-asset-tracking-cost-benefit` | RFID Asset Tracking Cost-Benefit | `industrial.webp` | 工业场景勉强对上 |
| `total-cost-rfid-system-breakdown` | Total Cost of RFID System | `industrial.webp` | 偏弱，建议改 `uhf-rfid-paper-label.jpg` + `rfid-asset-label.jpg` 组图 |
| `rfid-vs-manual-counting-savings` | RFID vs. Manual Counting | `eu-compliance.jpg` | 仓库 OK |
| `rfid-sustainability-circular-economy` | RFID for Sustainability / Circular Economy | `nfc-digital-product-passport-tag.jpg` | DPP 确实是循环经济的一部分，OK |
| `nfc-tap-google-review` | NFC Tap-to-Google-Review | `nfc-social-media-tag.jpg` | 手机 NFC 场景对，但主题是 Google 评价，建议改 `nfc-table-stand.jpg`（餐厅场景更贴） |

---

## 三、已经合适（6 篇 MATCH，不建议动）

| Slug | 标题 | 现图 | 理由 |
|---|---|---|---|
| `barcode-labels-peeling-warehouse-rfid-solution` | Barcode Labels Peeling Off | `uhf-rfid-paper-label.jpg` | ✅ UHF 标签卷直接相关 |
| `rain-rfid-2026-trends` | UHF RAIN RFID in 2026 | `uhf-rfid-paper-label.jpg` | ✅ UHF = RAIN |
| `how-to-choose-rfid-wristband-material` | How to Choose RFID Wristband Material | `tyvek-rfid-wristband.jpg` | ✅ 展示 Tyvek 材质 |
| `rfid-laundry-system-payback-period` | RFID Laundry Tracking System Payback | `rfid-textile-laundry-tag.jpg` | ✅ 洗涤布草标签 |
| `rfid-warehouse-labor-savings` | RFID Warehouse Picking & Labor | `logistics.jpg` | ✅ 仓库叉车场景 |

---

## 四、链接损坏（2 篇 BROKEN）

文件 `/landing-images/ppc-rfid-wristbands.jpg` 在 `public/landing-images/` 目录里**不存在**，前端会渲染 404。

| Slug | 标题 | 本地替换建议 |
|---|---|---|
| `rfid-event-wristband-revenue-impact` | RFID Wristband Event Revenue | `cashless-payment-rfid-wristband.jpg` |
| `rfid-wristbands-music-festival-2026` | RFID Wristbands for Music Festivals 2026 | `cashless-payment-rfid-wristband.jpg` 或 `events-venues.jpg` |

---

## 五、缺图（50 篇 MISSING heroImage）

这是最大的一批，全部 `heroImage: ""`。下面按主题分组并直接给出最合适的本地文件：

### 5.1  酒店/钥匙卡（9 篇）→ 多用 `hotel-key-cards-hero.webp` 或 `mifare-classic-plus-desfire-hotel-chip-compare.jpg`

| Slug | 标题 | 建议图 |
|---|---|---|
| `hotel-key-card-design-printing` | Hotel Key Card Design and Printing Guide | `nfc-card-custom-printing.jpg` |
| `hotel-key-card-encoding-explained` | Hotel Key Card Encoding Explained | `hotel-key-cards-hero.webp` |
| `hotel-key-card-suppliers-guide` | How to Choose Hotel Key Card Suppliers | `hotel-key-cards-hero.webp` |
| `how-hotel-rfid-key-cards-work` | How Hotel RFID Key Cards Work | `hotel-key-cards-hero.webp` |
| `magnetic-stripe-vs-rfid-hotel-cards` | Magnetic Stripe vs RFID Hotel Key Cards | `rfid-card-magnetic-stripe-combo.jpg` |
| `mifare-classic-vs-desfire-hotel-chips` | MIFARE Classic vs DESFire: Which Chip for Your Hotel? | `mifare-classic-plus-desfire-hotel-chip-compare.jpg` |
| `nfc-door-locks-rfid-cards` | How NFC Door Locks Work with RFID Cards | `hotel-key-cards-hero.webp` + 门锁图（本地无，可网搜） |
| `rfid-wristbands-hotels-resorts` | RFID Wristbands for Hotels and Resorts | `hospitality.webp` 或 `silicone-wristband-mifare-classic.jpg` |
| `rfid-elevator-floor-access` | RFID Elevator and Floor Access Control | `rfid-employee-badge.jpg` |

### 5.2  活动/演唱会/手环（5 篇）

| Slug | 标题 | 建议图 |
|---|---|---|
| `anti-counterfeiting-rfid-events` | Anti-Counterfeiting RFID for Events | `nfc-event-ticket-sticker.jpg` |
| `cashless-payment-rfid-wristbands` | Cashless Payment RFID Wristbands | `cashless-payment-rfid-wristband.jpg` |
| `coconut-shell-rfid-wristbands-eco` | Coconut Shell RFID Wristbands: Eco | `fabric-rfid-wristband.jpg`（本地无椰壳图，可网搜 [Unsplash: coconut bracelet](https://unsplash.com/s/photos/coconut-bracelet)） |
| `rfid-event-access-control-setup` | How to Set Up RFID Event Access Control | `events-venues.jpg` 或 `nfc-event-ticket-sticker.jpg` |
| `rfid-vs-qr-codes-events` | RFID vs QR Codes for Event Management | `nfc-event-ticket-sticker.jpg` |
| `rfid-wristbands-festivals-events` | RFID Wristbands for Festivals and Events | `events-venues.jpg` + `cashless-payment-rfid-wristband.jpg` |
| `silicone-vs-fabric-vs-tyvek-wristbands` | Silicone vs Fabric vs Tyvek RFID Wristbands | **组图建议：`silicone-wristband-mifare-classic.jpg` + `fabric-rfid-wristband.jpg` + `tyvek-rfid-wristband.jpg`**，可做三联 banner |
| `uhf-rfid-wristbands-long-range` | UHF RFID Wristbands for Long-Range Tracking | `fabric-rfid-wristband.jpg` 或 `elastic-rfid-wristband.jpg` |

### 5.3  NFC 应用/营销（7 篇）

| Slug | 标题 | 建议图 |
|---|---|---|
| `digital-product-passports-nfc` | Digital Product Passports and NFC Tags | `nfc-digital-product-passport-tag.jpg` |
| `google-review-nfc-cards-restaurants` | Google Review NFC Cards for Restaurants | `nfc-table-stand.jpg`（立牌场景） |
| `how-nfc-tags-work-smartphones` | How NFC Tags Work with Smartphones | `nfc-social-media-tag.jpg` |
| `how-to-program-nfc-tags` | How to Program NFC Tags and Stickers | `nfc-smart-poster-tag.jpg` |
| `metal-nfc-cards-business-networking` | Metal NFC Cards: Premium Business Networking | `nfc-card-custom-printing.jpg`（本地无金属卡具体图，可网搜 [Unsplash: metal business card](https://unsplash.com/s/photos/metal-business-card)） |
| `nfc-business-cards-guide` | NFC Business Cards: The Complete Guide | `ppc-nfc-business-cards.jpg` |
| `nfc-product-authentication` | NFC Tags for Product Authentication | `nfc-luxury-handbag-tag.webp` 或 `nfc-sneaker-authentication-tag.webp` |
| `nfc-smart-rings-guide` | NFC Smart Rings: Wearable Contactless Tech | 本地无 ring 图，建议网搜 [Unsplash: nfc smart ring](https://unsplash.com/s/photos/smart-ring) |
| `nfc-stickers-marketing-campaigns` | NFC Stickers for Marketing Campaigns | `nfc-smart-poster-tag.jpg` |
| `wooden-nfc-cards-eco-branding` | Wooden NFC Cards for Eco-Friendly Branding | `rfid-wooden-card.jpg` 或 `rfid-bamboo-card.jpg` |

### 5.4  芯片/技术对比（10 篇）

| Slug | 标题 | 建议图 |
|---|---|---|
| `desfire-ev1-vs-ev2-vs-ev3` | DESFire EV1 vs EV2 vs EV3 | `mifare-desfire-ev3-cards.jpg` |
| `em4100-vs-t5577-125khz-comparison` | EM4100 vs T5577: 125 kHz Comparison | `em4100-rfid-card.jpg` |
| `java-cards-smart-card-os-explained` | Java Cards and Smart Card OS Explained | `mifare-plus-se-card.png` |
| `ntag213-vs-ntag215-vs-ntag216` | NTAG213 vs NTAG215 vs NTAG216 | 三图组合 `ntag213-nfc-sticker.jpg` + `ntag215-nfc-sticker.jpg` + `ntag216-nfc-sticker.jpg` |
| `rfid-data-encoding-memory` | RFID Data Encoding and Memory Structures | `mifare-classic-1k-card.jpg` |
| `rfid-frequencies-lf-hf-uhf-explained` | RFID Frequencies Explained: LF/HF/UHF | `dual-frequency-rfid-card.webp` |
| `uhf-vs-hf-rfid-frequency-choice` | UHF vs HF RFID: Which Frequency? | `dual-frequency-rfid-card.webp` |
| `what-is-mifare-complete-guide` | What Is MIFARE? A Complete Guide | `mifare-classic-1k-card.jpg` 或 `mifare-ultralight-c-cards-bulk.jpg` |
| `how-rfid-readers-work` | How RFID Readers Work: USB, BT, Fixed | 本地无读写器图，建议网搜 [Impinj R420 reader product image](https://www.impinj.com/products/readers) |
| `rfid-card-materials-pvc-pet-abs-wood` | RFID Card Materials: PVC, PET, ABS, Wood | 组图 `rfid-wooden-card.jpg` + `rfid-bamboo-card.jpg` + `em4100-rfid-card.jpg` |

### 5.5  行业应用（9 篇）

| Slug | 标题 | 建议图 |
|---|---|---|
| `eco-friendly-rfid-sustainable-cards` | Eco-Friendly RFID: Sustainable Cards | `rfid-wooden-card.jpg` 或 `rfid-bamboo-card.jpg` |
| `pps-vs-silicone-vs-textile-laundry-tags` | PPS vs Silicone vs Textile Laundry Tags | `rfid-pps-laundry-chip.png` + `rfid-textile-laundry-tag.jpg`（组图） |
| `rfid-asset-tracking-warehouses` | RFID Asset Tracking for Warehouses | `rfid-asset-label.jpg` 或 `logistics.jpg` |
| `rfid-healthcare-patient-tracking` | RFID in Healthcare | `hospital-patient-id-wristband.jpg` |
| `rfid-key-fob-access-control` | RFID Key Fob Access Control | `mifare-desfire-keyfob.jpg` 或 `em4305-keyfob.jpg` |
| `rfid-laundry-system-roi` | How RFID Laundry Systems Save Money | `rfid-laundry-tags-industrial-wash-banner.jpg` |
| `rfid-laundry-tags-buyers-guide` | RFID Laundry Tags: Buyer's Guide | `rfid-textile-laundry-tag.jpg` + `rfid-pps-laundry-chip.png` |
| `rfid-led-tags-warehouse-location` | RFID LED Tags for Warehouse Location | 本地无 LED 灯标签，建议网搜 [Omni-ID View RFID LED tag](https://www.omni-id.com/) |
| `rfid-logistics-supply-chain` | RFID in Logistics and Supply Chain | `logistics.jpg` ✅ |
| `rfid-market-trends-forecast` | RFID Market Trends and Forecast 2025–2030 | `industrial.webp`（工业场景通用） |
| `rfid-retail-inventory-management` | RFID for Retail Inventory | `retail-apparel.jpg` 或 `uhf-rfid-retail-price-label.jpg` |
| `rfid-windshield-tags-vehicle-id` | RFID Windshield Tags for Vehicle ID | `long-range-uhf-windshield-sticker.jpg` 或 `uhf-rfid-windshield-label.jpg` |
| `waterproof-rfid-tags-outdoor` | How to Waterproof RFID Tags for Outdoor Use | `rfid-on-metal-uhf-tag.jpg` 或 `rfid-ceramic-tag.png` |

---

## 六、建议的后续动作

1. **先修 2 个 404** —— `rfid-event-wristband-revenue-impact` 和 `rfid-wristbands-music-festival-2026` 指向的 `ppc-rfid-wristbands.jpg` 不存在，最紧急。
2. **批量回填 50 个空 `heroImage`** —— 上面第五节已经给出一对一映射，可以脚本化批量改 JSON。
3. **替换 7 张最典型的错配** —— 特别是 `ppc-hotel-key-cards.jpg`（机场证挂在 4 篇酒店文章）和 `rfid-anti-metal-tag.jpg`（纸标签挂在抗金属文章）。
4. **可选：生成缺失的新图** —— 少数主题本地完全没有（圣诞 NFC 标签、婚礼 favor、滑雪卡、NFC 智能戒指、LED 标签、NFC 金属卡实物），可以接后续 AI 作图或上 Unsplash 采集。

---

**等候确认事项：**

1. 是否接受上面的替换建议？是否需要我直接执行批量 JSON 改动？
2. 对"勉强相关（PARTIAL）"那 7 篇，要不要一并替换？
3. 对本地没有对应产品图的那 6–8 篇（圣诞/婚礼/滑雪/NFC 戒指/LED 标签/金属名片），是接受 Unsplash 搜索链接，还是你希望我用 AI 图像工具生成？
