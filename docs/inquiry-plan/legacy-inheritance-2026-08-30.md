# 改版历史遗产盘点(2026-08-30)

> 依据:proudtek.com 域名属性 16 个月 GSC 数据(2025-10 起)+ 老站实时 sitemap
> (5,541 URL)+ 仓库内容库比对。回答"改版有没有可继承的历史遗产"。

## 一、最重要的发现:改版把一个小而真实的流量底盘弄丢了

proudtek.com 旧版(多语言 WordPress,2025-10 起 GSC 有数据):

| 月份 | 点击 | 曝光 |
|---|---|---|
| 2025-10 | 23 | 871 |
| **2025-11** | **35** | **1,651** |
| 2025-12(改版窗口) | 14 | 234 |
| 2026-02 | 6 | 296 |
| 2026-08(现在) | 11 | 468 |

**旧站巅峰(2025-11)是新站当前水平的 2-3 倍**;改版没有做 301,排名直接蒸发。
好消息:域名没换、老站 proudrfid.com 还在线 → **现在补 301 仍能回收大部分**。

## 二、遗产清单(按可回收价值排序)

| # | 遗产 | 状态 | 回收动作 |
|---|---|---|---|
| 1 | 旧版 782 页的曝光/点击记录(GSC 内可查) | ✅ 已提取 | 有点击的旧 URL 逐条 301(见下表) |
| 2 | 老站 proudrfid.com 5,541 页 + 既有排名 | ✅ 在线 | 族归并 301(3,108 条规则已备)+ 建 GSC 属性后按排名精调 |
| 3 | **Java Card 产品页**(108 曝光/3 点击,6 语言版本) | ⚠️ 两站均已下架 | **重建产品页**(新站已有 java-cards 博客可内链),老站历史 URL 301 到新页 |
| 4 | 旧版多语言足迹(it/fr/ru/da/de/es…) | ⚠️ 新站仅 es/de/ar | 多语言计划新增 it/fr/ru/da(有旧数据背书) |
| 5 | 域名 15 年注册史 + DNS 连续性 | ✅ 已在手 | 无需动作 |
| 6 | 老站外链(未量化) | ❓ 需数据 | 老站建 GSC 属性 → links 报告;或 Ahrefs 一次性审计 |
| 7 | 老站内容资产(产品数据/案例) | ✅ 在线 | 搬运进新目录(java-card、reader 类页优先) |
| 8 | 阿里/印度Mart/社媒档案里的老站链接 | ❓ 待盘点 | 统一改链到新站(NAP 一致性) |

## 三、有点击记录的旧 URL → 新站映射(第一批手工 301)

| 旧 URL(proudtek.com) | 旧表现 | 新站去向 | 动作 |
|---|---|---|---|
| /product/java-card/ | 3c/108i | **新建** /products/rfid-cards/java-card/ | 先建页再 301 |
| /product/nfc-business-card/ | 1c | /products/rfid-cards/nfc-card-custom-printing/ | 直接 301 |
| /product/rfid-wristbands-for-hotels/ | 1c | /solutions/hotel-key-cards/ | 直接 301 |
| /product/wooden-rfid-card/ | 1c | /products/rfid-cards/standard-rfid-wood-card/ | 直接 301 |
| /it/、/de/、/fr/、/ru/、/da/ 等语言首页 | 12c 合计 | 对应新语言首页(it/fr/ru/da 待建) | 语言上线后 301 |

## 四、执行顺序

1. **本周**:proudrfid.com 建 GSC 属性 + 授权 SA(用户 5 分钟)→ 我拉老站 16 个月
   数据,把"老站真实排名页"放进 Stage-1 301。
2. **下周**:重建 Java Card 产品页(素材:新站博客 + NXP JCOP 资料),四条手工 301
   在老站实施。
3. **第 2 个月起**:多语言扩展顺位调整为 **de/es(已有)→ it/fr/ru/da(旧足迹)**
   → ar/pt。

## 五、一句话结论

遗产不但有,而且**最大的一笔是改版自己弄丢的**:旧站的排名记录还完整保存在
GSC 里,老站还在线上等着 301。只要把"建老站 GSC 属性 + 实施 301"这两步做完,
历史遗产就能开始计息。

## 系统化回收(2026-08-30 第二轮挖掘)

全量对账 782 个旧时代曝光页 vs 重定向层:
- 30 页已有重定向 | 8 页新站同路径存活 | 604 页曝光<5(任其老化)
- **140 页曝光≥5 的裸 404 → 全部 301 回收**(提交 24bafcfe + 5882238b)

关键发现:旧站是 12+ 语言 storefront;语言首页曾高排位
(/de pos2, /fa pos3, /ja pos3, /zh pos4)。现全部 308 → 英文根页(过渡),
语言版上线后逐语回指。

技术教训(两次上线验证才归因):
1. Vercel 先做 trailingSlash 规范化、后匹配 redirect 规则 → source 必须带
   尾斜杠,否则永不命中(此前被通配 lang 规则的副作用掩盖);
2. 通配 `/:lang(...)/:path(.*) → /:path` 会剥语言前缀,新站无语言版时只
   有害,已删除;
3. vercel.json redirects 是唯一事实源,_redirects 现为其生成镜像
   (247 条,头部标注 do-not-hand-edit)。

线上验证(7/7 → 200):/fr/produit/mifare-desfire-ev2-cards → EV3 页;
/de/produkt/legic-karte → /products/rfid-cards/;/ja/ → /;
/da/produkt/biltransponderchip → /products/rfid-tags/;等。

待用户确认的产品线缺口:LEGIC 卡与 NFC 戒指有旧站真实需求,新目录无
对应 SKU(现暂指 hub)。
