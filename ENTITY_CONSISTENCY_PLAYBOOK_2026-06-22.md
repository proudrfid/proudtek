# 实体一致性 Playbook — P0-1 三大平台名称统一(+ 链下实体收口)

**日期:** 2026-06-22 · **服务于:** GEO 计划 §3 的 P0-1…P0-5 · **唯一事实源:** `src/lib/seo-content.ts` · **方法:** 抓取/检索现存链下档案逐项对照

> **为什么重要:** AI 答案引擎在判断"哪个 Proud Tek"时会交叉比对站内 `sameAs` 与各权威档案的 NAP。本次检索发现你的"Proud Tek"实体**分散在 4+ 个域名 + 多个平台,且品牌拼写/NAP/统计数字互相打架**——这正是 GEO 最惩罚的"实体消歧噪声"。P0-1 只是冰山一角,真正要收口的是整张链下footprint。

---

## 1. 规范实体卡(逐字复制 — 所有平台、Wikidata、Crunchbase 都用这一套)

| 字段 | 规范值(源) |
|---|---|
| 展示品牌名 | **Proud Tek**(带空格) |
| 法定全称 | **Proud Tek Co., Limited** ⚠️ 见 §4 法定名核对 |
| 官网 | **https://proudtek.com** |
| 邮箱 | **info@proudtek.com** |
| 电话(显示) | **+86 186 6582 0632**(E.164: `+8618665820632`) |
| 办公地址 | **A2109, Zhantao Building, #1079 Minzhi Rd., Longhua District, Shenzhen, Guangdong 518131, China** |
| 成立 | **2008**,Shenzhen, Guangdong, China |
| 员工 | **100+** |
| 客户/国家 | **500+ 企业客户 / 50+ 国家** ⚠️ 旧档案普遍写 "400 / 30",需更新 |
| 认证 | ISO 9001:2015、ISO 14001:2015、RoHS、CE、REACH |
| 会籍 | RAIN RFID Alliance(Member)、NFC Forum(Implementer Member) ⚠️ **见 §4 会籍核实** |
| 接受变体 | `ProudTek`、`Proud Tek Co. Limited`(仅作 alternateName,别当主名用) |
| LinkedIn | https://www.linkedin.com/company/proud-tek-co-ltd/ |
| YouTube | https://www.youtube.com/@protekrfid875 |
| 主联系人 | Nancy Wu(各平台保持一致) |

**铁律:** 主名一律 `Proud Tek`(带空格);`ProudTek` / `Proudtek` / `PROUD TEK` / `Poudtek`(错字)全部消除。NAP 逐字一致(同一个 `A2109 / +86 186 6582 0632 / proudtek.com`),engines 才会把这些档案聚合成同一实体。

---

## 2. 链下 footprint 现状(本次检索实测)

| 资产 | 归属 | 现状 vs 规范 | 处置 |
|---|---|---|---|
| `rfid-tag.en.made-in-china.com` | ✅ 你的(Nancy Wu / 2008 / ISO / 10 产线吻合) | 名="Shenzhen Proud Tek Co., **Ltd.**";楼名"Zhantao **Science & Technology** Building";街="Minzhi **Street**"(缺 #1079);简介用"**Proudtek**"且有错字"**Poudtek**"、"**Hongkong**" | §3 按表改 |
| `proudrfid.com` | ⚠️ 旧官网(repo 仓库即 `proudrfid/proudtek`) | 旧 NAP:`A2110` / `+86 15815501857` / "400 客户 / 30 国" | §4 决策:301→proudtek.com 或更新 |
| `protekrfid.com` | ⚠️ 很可能你的(YouTube 句柄 `@protekrfid875` 同源) | 整站"ProudTek/Protek",独立品牌叙事 | §4 决策:整合/301/保留 |
| `rfidak.com` | ❓ 待你确认 | "ProudTek-RFID card…" | §4 先确认是否你的 |
| `facebook.com/RFIDTRANSPONDER` | ✅ 你的 | 名="PROUD TEK CO.,LTD"(全大写) | 改为 `Proud Tek` |
| `proudtek.com` | ✅ 规范主站 | 本周已修 NAP/品牌 | 跑 `npm run build` 后即生效 |

**核心问题:不是某个档案写错,而是同一家公司以 `proudtek.com / proudrfid.com / protekrfid.com / rfidak.com` 四个域名 + 多种拼写并存。** 对 AI 而言这是 4 个弱实体而非 1 个强实体 → 引用被稀释。**收敛域名/品牌叙事到单一规范实体,是本阶段 ROI 最高的一步,优先级高于单纯改 3 个店铺名。**

---

## 3. 三大平台逐字改写表

### Made-in-China(`rfid-tag.en.made-in-china.com` → 后台 *Company Profile / 公司介绍*)

| 字段 | 改成 |
|---|---|
| 公司名 | `Proud Tek Co., Limited`(或与营业执照一致的法定名,见 §4) |
| 地址 | `A2109, Zhantao Building, #1079 Minzhi Rd., Longhua District, Shenzhen, Guangdong, China` |
| 简介品牌名 | 全文 `Proudtek`/`Poudtek` → `Proud Tek`;`Hongkong` → `Hong Kong` |
| 客户/国家 | 若提及,统一 `500+ clients / 50+ countries` |
| 邮箱/电话 | `info@proudtek.com` / `+86 186 6582 0632` |

### Alibaba(国际站后台 → *Company Profile* + *Minisite/Company Overview*)

需核对并统一为规范卡:Company Name、Registered Address / Operational Address、Year Established(2008)、Total Employees(100+)、Main Markets、Contact(Nancy Wu / info@proudtek.com / +86 186 6582 0632)、官网链接 `proudtek.com`。**重点:公司名与地址逐字对齐 §1。**

### Global Sources(供应商后台 → *Company Information*)

同上逐字对齐:Company Name、Address、Year Established、Website。Global Sources 与 Alibaba 历史数据常各写各的,务必对照 §1 校一遍。

> 三家平台都另有"工厂地址"字段。MIC 现填 `#7 Shangwei Industrial Road, Shangkeng Community, Guanlan, Longhua District`(repo 规范卡未含此址)——见 §4 工厂地址核对,确认后三平台填**同一个**工厂地址。

---

## 4. 需要你拍板/核实(改之前先定)

1. **法定名核对:** repo 写 `Proud Tek Co., Limited`,MIC 写 `Shenzhen Proud Tek Co., Ltd.`。以**营业执照英文名为准**;若执照是"…Co., Ltd.",应把 **repo 的 `ORGANIZATION_NAME` 改成执照名**(法定名要锚定执照,不是反过来)。告诉我哪个对,我改 `seo-content.ts`。
2. **会籍核实:** `llms.txt` 已对 AI 声明 "RAIN RFID Alliance member · NFC Forum implementer member",但 `GROWTH_ROADMAP` 把这两项列为**待加入/待决策**。若尚未入会,这是**喂给 AI 的不实信誉声明**(违反站内事实准确性铁律)——对外发布前务必确认;未入会就先从 `llms.txt`/规范卡撤下。
3. **工厂地址:** MIC 的 `#7 Shangwei Industrial Road…` 是否现行工厂?是→补进 repo 规范卡并三平台统一;否→更正。
4. **域名收敛(最高价值决策):** `proudrfid.com` / `protekrfid.com` / `rfidak.com` 如何处置?推荐:确认归属后 **301 重定向到 proudtek.com 对应页**(把分散的权重/实体信号并入主站),或至少统一其 NAP+品牌叙事并互加 `sameAs`。这步决定 AI 是看到"1 个强 Proud Tek"还是"4 个弱 Proud Tek"。

---

## 5. P0-5 回填 `sameAs`(我可代做)

确认归属后,把这些权威档案 URL 加进 `src/lib/seo-content.ts` 的 `ORGANIZATION_SOCIAL`,即自动流入每页 Organization JSON-LD(喂 AI 实体消歧):

```
made_in_china: "https://rfid-tag.en.made-in-china.com",
alibaba:       "https://<你的店铺>.en.alibaba.com",   // 待你给 URL
global_sources:"https://<你的店铺>.globalsources.com", // 待你给 URL
facebook:      "https://www.facebook.com/RFIDTRANSPONDER/",
// 后续:wikidata / crunchbase / nfc-forum 列名页
```

> 当前 `ORGANIZATION_SOCIAL` 仅 3 项(LinkedIn/YouTube/WhatsApp)。扩到 ≥6 项是 GEO 计划里"跨平台 4+ = 2.8× 被荐概率"的直接抓手。

---

## 6. 执行选项(告诉我走哪条)

- **(A) 我驱动浏览器实操**:你登录 Made-in-China / Alibaba / Global Sources 后台,我用 Claude in Chrome 按 §3 逐字段改写(你最后确认提交)。
- **(B) 我先深挖 rogue 域名**:抓取 proudrfid / protekrfid / rfidak 的 About/Contact,出一份"逐域名 NAP 差异表 + 301 映射建议"。
- **(C) 我改代码侧**:你给我已确认的店铺 URL + 法定名/会籍结论,我一次性更新 `ORGANIZATION_NAME` + 回填 `sameAs`(P0-5)。

---

*事实源:`src/lib/seo-content.ts`(规范卡)· 现状抓取:made-in-china.com 公司档案 + 公开检索(proudrfid/protekrfid/rfidak/facebook)。所有对外改写以营业执照与你的确认为最终准绳。*
