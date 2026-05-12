# Blog 主图全量审查 & 自动匹配 Prompt

在 Cowork 新对话中粘贴以下 prompt，确保 Chrome 浏览器已连接。

---

## Prompt

```
你是 proudtek.com（RFID/NFC制造商）的网站图片编辑。你的任务是逐一审查全部 90 篇博客文章的主图（hero image），判断现有图片是否与文章内容匹配，不匹配的或缺失的都需要通过 Google 图片搜索替换。

## 第一步：生成审查清单

扫描 src/content/editorial/blog/ 下所有 JSON 文件，读取每篇的 slug、title、kicker、heroImage 字段，按以下规则分类：

### 判定为"需要替换"的情况：
1. **heroImage 为空或不存在** → 必须搜索新图
2. **同一张图被多篇文章复用** → 所有复用该图的文章都需要独立配图。以下是已知被复用的图片：
   - `industrial.webp` → 被 5 篇文章使用
   - `ntag213-nfc-sticker.jpg` → 被 6 篇文章使用
   - `mifare-classic-1k-card.jpg` → 被 3 篇文章使用
   - `events-venues.jpg` → 被 2 篇文章使用
   - `eu-compliance.jpg` → 被 2 篇文章使用
   - `fabric-rfid-wristband.jpg` → 被 2 篇文章使用
   - `ppc-rfid-wristbands.jpg` → 被 2 篇文章使用
   - `retail-apparel.jpg` → 被 2 篇文章使用
3. **图片名与文章主题明显不符** → 例如：
   - "Access Card Copied? Security Upgrade" 用了 `ntag424-dna-tamper-evident-tag.jpg`（产品图，不是安全场景）
   - "NFC Christmas Gift Tags" 用了 `ntag213-nfc-sticker.jpg`（通用贴纸，不是圣诞场景）
   - "NFC Wedding Favor Tags" 用了 `ntag213-nfc-sticker.jpg`（通用贴纸，不是婚礼场景）
   - "RFID vs QR Codes for Events" 用了 `fabric-rfid-wristband.jpg`（只有手环，没有 QR 对比场景）
   - "Cashless Payment RFID Wristbands" 用了 `festival-lights.jpg`（灯光场景，不是支付场景）

### 判定为"保留"的情况：
- 图片名与文章主题吻合，且该图未被其他文章复用
- 例如："Metal NFC Cards for Business" 用 `rfid-metal-business-card.jpg` ✅
- 例如："NFC Product Authentication" 用 `product-authentication.jpg` ✅
- 例如："RFID Windshield Tags" 用 `uhf-rfid-windshield-label.webp` ✅

先输出完整审查结果，格式如下：
```
✅ KEEP | metal-nfc-cards-business-networking → rfid-metal-business-card.jpg | 匹配
🔄 REPLACE | access-card-copied-security-upgrade → ntag424-dna-tamper-evident-tag.jpg | 产品图，不匹配安全升级主题
➕ NEW | desfire-ev1-vs-ev2-vs-ev3 → ❌ | 缺少主图
```

等我确认后再开始搜索下载。

## 第二步：逐篇搜索替换（排队执行）

对每篇标记为 🔄 REPLACE 或 ➕ NEW 的文章，按以下流程处理：

### 搜索策略

a) 根据文章 title 提炼 **英文搜索关键词**，规则如下：
   - 去掉年份（2026、2025-2030 等）
   - 去掉冒号后的长副标题
   - 保留核心技术/场景关键词
   - 添加场景描述词，使搜索结果更贴合实际使用场景

   关键词生成示例：
   | 标题 | 搜索关键词 |
   |---|---|
   | NFC vs RFID: What Is the Difference? | `NFC RFID comparison technology` |
   | Hotel Key Card Not Working? | `hotel key card door lock not working` |
   | RFID Marathon Race Timing Setup | `marathon RFID race timing chip runner` |
   | NFC Christmas Gift Tags | `NFC tag christmas gift wrapped present` |
   | NFC Wedding Favor Tags | `NFC tag wedding favor table setting` |
   | Cashless Payment RFID Wristbands | `RFID wristband cashless payment terminal tap` |
   | RFID Elevator and Floor Access | `RFID card elevator access control panel` |
   | RFID in Healthcare: Patient Tracking | `hospital patient RFID wristband tracking` |

b) 用 Google 图片搜索，要求：
   - 优先选择 **真实场景照片**（不要产品白底图、不要插画、不要截图）
   - 图片尺寸 ≥ 1200px 宽
   - 风格：专业、工业、B2B，有人物或真实环境更佳
   - 色调与 RFID/NFC 科技主题协调（蓝色调、银色调、工业灰）

c) **匹配度判断标准**（按优先级排序）：
   1. 图片直接展示文章所描述的场景（如酒店刷卡、工厂扫描、马拉松计时）
   2. 图片展示文章涉及的核心产品在真实环境中的使用
   3. 图片展示相关行业/应用的专业场景
   4. ⚠️ 不要选：纯产品白底图、与标题无关的通用科技图、分辨率低于 1200px 的图

d) 如果第一次搜索不满意，尝试以下备选策略：
   - 加上 "professional photo" 或 "industrial application"
   - 换用同义词（如 "laundry" → "commercial linen"，"warehouse" → "distribution center"）
   - 搜索关联场景（如 "RFID inventory" → "warehouse worker scanning boxes"）

### 下载与更新

- 下载图片保存到 `dist/blog-images/{slug}.jpg`
- 如果原图是 PNG/WebP，转换为 JPG，质量 85%
- 更新 JSON 文件的 `heroImage` 字段为 `/blog-images/{slug}.jpg`
- 如果原来有旧图且文件名不同，**不删除旧图**（可能被其他页面引用）

### 执行节奏

- 一次只处理一篇，完成后输出进度再处理下一篇
- 每篇之间间隔 3 秒，避免触发 Google 搜索限制
- 格式：`[3/65] ✓ difference-nfc-rfid-explained → "NFC RFID comparison technology" → downloaded`
- 如果某篇搜索失败，标记 ⚠️ 跳过，不阻塞后续

## 第三步：完成汇总

全部处理完毕后，输出：
- ✅ 保留原图：X 篇
- 🔄 成功替换：X 篇
- ➕ 新增主图：X 篇
- ⚠️ 搜索失败：X 篇（列出 slug）
- 总计：90 篇全部审查完毕
```

---

## 使用方法

1. 在 Cowork 中开一个 **新对话**
2. 确保 **Chrome 浏览器已连接**（Claude in Chrome 扩展）
3. 整段粘贴上面 Prompt 部分的内容发送
4. Claude 会先输出审查清单让你确认，确认后开始逐篇搜索下载
5. 全程约 60-90 分钟（取决于网速和搜索响应）

## 注意事项

- 图片存储路径：`dist/blog-images/{slug}.jpg`
- heroImage 字段值：`/blog-images/{slug}.jpg`
- 搜索完成后需要运行 `npm run build` 重新构建
