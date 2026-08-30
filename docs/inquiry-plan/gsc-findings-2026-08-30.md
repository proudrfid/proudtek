# GSC 实测诊断(2026-08-30)

> 数据源:Search Console API,资源 `sc-domain:proudtek.com`(域名属性,SA=Owner)
> 区间:2026-06-01 → 2026-08-29(90 天);趋势段 2026-03 → 2026-08。

## 一、总量(实锤)

| 指标 | 数值 | 判读 |
|---|---|---|
| 点击 | **28 次 / 90 天**(≈9 次/月) | 证实"极少流量" |
| 曝光 | 1,861(≈20 次/天) | 需求有碰到我们,但排得太靠后 |
| CTR | 1.5% | — |
| 平均排名 | **35.8**(第 4 页) | 没有任何词稳定进前 10 |
| sitemap | 已提交 ✓ | 技术通道畅通 |
| 月度趋势 | 3-8 月曝光 468~860/月,零增长 | 6 个月停滞,坐实权威度瓶颈 |

## 二、需求长什么样(164 个查询的形态)

- **几乎全部是芯片型号词**:`ntag213`(60 曝光/排 50.1)、`mifare desfire ev2`
  (37/69.2)、`mifare cards 1k`(32/72.4)、`mifare desfire`(21/88.8)、
  `mifare classic 1k`(12/77.9)、`desfire`(21/83)。
- 买家在搜**具体芯片**,而不是"rfid wristbands"这类大词。
- 波斯语 DESFire 采购词出现(`قیمت/خرید کارت دسفایر`,排 25-26,各 8-9 曝光)
  ——多语言需求的早期信号。

## 三、页面侧(233/520 有过曝光;172 页曝光≥2;39 页曝光≥10)

| 页面 | 曝光 | 排名 | 判读 |
|---|---|---|---|
| /products/rfid-cards/mifare-classic-1k-card/ | **181** | 52.6 | 需求+页面都在,差一个"排上去" |
| /solutions/rfid-supply-chain-management/ | 351 | 5.5* | *尘土式:数百个 1-2 次长尾的平均值,非真实第 5 名 |
| /solutions/rfid-event-wristbands/ | 132 | 5.3* | 同上 |
| /products/rfid-labels/ntag213-nfc-sticker/ | 118 | 37.5 |ntag213 词的承接页,排第 4 页 |
| /products/rfid-cards/mifare-desfire-ev3-card/ | 116 | 36.5 | 可吃 ev2 查询(ev2 兼容段) |
| /products/rfid-labels/long-range-uhf-windshield-sticker/ | 117 | 35.1 | 车贴簇同规则 |
| /products/rfid-cards/ | 113 | 13.9 | **第 2 页!卡片目录页,最能被推上首页** |
| /solutions/hotel-key-cards/ | 159 | 14.9 | 第 2 页,加内链/深度可进首页 |
| /es/、/de/ | 8+3 | — | 曝光极小但 CTR 37%,多语言方向被数据背书 |

## 四、修正后的结论

1. 权威度瓶颈结论不变(6 个月零增长)。
2. **近期最可执行策略 = "芯片需求捕获"**:需求词(型号)、承接页(产品页)、
   老 301(同族合并)三者天然对齐——这是不靠新外链也能推进的唯一战场。
3. 两个"pos 5"页面不是金矿(尘土平均),但 hotel-key-cards(14.9)和
   /products/rfid-cards/(13.9)是真实的第 2 页,可推。
4. 348 页实质隐形 → 坐实内容收敛(T3)。
5. 老站 proudrfid.com **从未接过 GSC**(无资源)→ 建议同样加域名属性+
   授权 SA,Stage-1 301 才能按真实排名做。

## 五、立即动作(本周,不需要新外链)

| # | 动作 | 对象 |
|---|---|---|
| 1 | 标题/首段精确含型号词;加"与 ev2/ev1 兼容与升级"段 | desfire-ev3、classic-1k、ntag213-sticker 三页 |
| 2 | 从已有博客/指南向上述三页+hotel-key-cards+卡片目录页注入内链(每页 5-10 条) | T4 四件套之内链步 |
| 3 | /products/rfid-cards/ 与 hotel-key-cards 加深度(FAQ 扩到 8 条、加对比表)冲首页 | 第 2 页双雄 |
| 4 | 老站族 301(CSV 已备)先做 desfire/ultralight/ntag 三族共 51 条,验证迁移效果 | T1 Stage-2 试运行 |
| 5 | 用户:给 proudrfid.com 建 GSC 域名属性并授权同一 SA | 解锁 Stage-1 |
| 6 | es/de 曝光虽小但 CTR 高,维持现有多语言计划(T4 第 4 步) | 优先级不变 |

## 附:数据文件

- 原始拉取:`/tmp/gsc-data.json`(q/p/d/total/sitemaps)
- 密钥:`gsc-sa.json`(已 gitignore,勿提交、勿外传)
