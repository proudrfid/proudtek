# 全站统一事实注册表(Fact Registry,2026-08-30 建)

> 缘起:外部 AI 审核指出站内自证数字口径分散。本表是唯一口径源——
> 任何页面写这些数字必须与此一致;新增事实先入表再进页。

## 已核实口径(站内一致)

| 事实 | 唯一口径 | 出处 |
|---|---|---|
| 成立年份 | 2008(Shenzhen) | about/contact 一致;全库 117 处 since 2008,无冲突 |
| 公司法定名 | Proud Tek Co., Ltd | 站内统一;FAQ 曾写 "Proud RFID" 已修 |
| NAP | Zhantao Building, #1079 Minzhi Rd., Longhua, Shenzhen / +86 186 6582 0632 / info@proudtek.com | contact.json |
| MOQ 两档 | 库存标准品 100 pcs 起;定制/芯片程序 500 pcs/芯片型号 | FAQ + 各产品页,FAQ 现已写明两档 |
| 样品政策 | 合格 B2B 买家库存样品免费:典型 2–3 个 SKU、5–20 件(LF/HF/UHF);1 个工作日备好,快递 2–5 天;买家承担 DHL/FedEx 运费($25–60),首单抵扣;定制样品 +3–5 个工作日,样品费抵扣量产 PO。**2026-09-05 起 "8–12 SKU 样品包 / 5–10 天" 口径全站作废**,代码唯一源 `formatSamplePolicy()`(src/lib/seo-content.ts) | ORGANIZATION_OPERATIONS.samples;首页资源卡/信任条/llms.txt 由代码生成;LP、FAQ、About、contact、products/all 手工对齐并由 `src/lib/__tests__/citability.test.ts` 黑名单守护 |
| 保修 | 1 年,覆盖我们供应的全部产品 | FAQ(已修语法与实体名) |
| 响应时效 | 首次回复:深圳工作时间 2–4 小时内;书面报价 24–48 小时内,有效期 30 天 | ORGANIZATION_OPERATIONS.response;`formatResponsePolicy()` |
| 证据分级 | 全站 8 级标签(OFFICIAL_STANDARD / CHIP_VENDOR_DATASHEET / THIRD_PARTY_TEST / PROUD_TEK_INTERNAL_TEST / PROUD_TEK_SELF_REPORTED / COMMERCIAL_POLICY / GENERAL_EXPLANATION / UNSUPPORTED) | `src/data/evidence-tiers.ts`;渲染为 `evidenceCards` 区块(About / Factory / Certifications),图例在 /about/methodology/#evidence-tiers-used-on-this-site |
| 产品目录 | 动态计数(不手写死数);当前 199 个产品 json | 由构建系统生成 |

## 2026-08-30 修复记录(外部审核驱动)

- 语言:Advanced Production Equipments→Machines(含 render-snapshot 同步)、
  quotation/payment 被动语态、standards of art、FAQ 保修句实体+语法
- 绝对化软化 10 处:fits every substrate / every (modern) phone ×3 /
  works with every ×4 / guaranteed life ×1 —— 全部改为条件式表述
- `not practically clonable` 保留:原文带 "without key material" 条件,
  密码学上成立(审核误读,已在下节说明)
- 样品政策:LP 与 FAQ 统一为完整口径(免费+运费到付+定制 $30-$100)
- hospitality + supply-chain:各加 "How to read the numbers" 证据归属节
  (ROI 区间=行业典型估计,非具名客户审计结果)

## 第二轮清扫(同日)

- CR80 ⇒ "适配所有读写器"指控:平反——卡指南 _pillar 早已写明
  "Physical fit is not protocol fit"(审核误读);membership 页
  "all major platforms" 属实,已改条件式
- 双频卡 0.84mm "fits every card printer":实质错误(部分直印机
  仅收 0.76mm),两处改为"确认打印机厚度规格"
- FAQ:MOQ 两档写明(库存任意量/定制 100/500)、交期、退货两句语法
  修复并补书面确认承诺

## 审核判定与处置(平反记录)

| 审核指控 | 核查结果 | 处置 |
|---|---|---|
| 成立年份 2008 vs 2010 冲突 | ✗ 不实:2010 是 EU 法规/行业事件年份,非公司年份 | 无需修 |
| "29/26 卡数量口径" | 当前库无此硬编码 | 无需修(计数动态) |
| $30-100 样品费"不存在" | 存在(faq.json,审核指 LP 与 FAQ 不一致属实的另一半) | LP 已补全口径 |
| not practically clonable | 原句有条件限定 | 保留 |
| guaranteed ×21 | 7/8 是技术/厂商语境,仅 1 处软化 | 已修 1 处 |

## 已验活的渠道资产(2026-09-01 实测,实体一致性锚点)

| 资产 | URL | 状态 |
|---|---|---|
| Made-in-China 店铺 | rfid-tag.en.made-in-china.com | 200 |
| LinkedIn 公司页 | /company/proud-tek-co-ltd/ | 200 |
| YouTube | @protekrfid875 | 200 |
| Facebook | /RFIDTRANSPONDER/ | 200 |
| WhatsApp | wa.me/8618665820632 | 与 NAP 电话一致 |

## 2026-09-05 可引用性整改(外部答案引擎诊断驱动)

- 首页(WP 快照,`applyHomepageCitabilityPass`):删除形容词段落("meticulous craftsmanship" 等)、
  "WHAT MAKES US DIFFERENT" 行替换为证据条(与 V2 首页共用 HOME_EVIDENCE)、
  "OUR CHIP PARTNERS"→"Supported chip families"(注明非厂商合作关系)、
  "seamless compatibility"→兼容性以样品验证为准、客户评价加"未经独立核实"声明
- About:去掉"no middlemen / 15–30% markup / 50+ countries / 非标不加价";DPP、电池法规仅陈述
  标签层角色;认证页 NFC Forum / ARC / Walmart / FSMA-DSCSA / FCC 表述收窄到实际供应范围
- Methodology 与 Factory 对齐:洗涤耐久测试按项目在合作产线或第三方实验室进行,协议不变

## 开放项(需用户提供,不编造)

- [ ] ISO 9001 证书编号 + 认证机构 + 有效期(首页信任信号)
- [ ] 专利号清单(8+ 项专利声明需可核验编号)
- [ ] 两家工厂的名称/地址/产权口径
- [ ] 设备 305+ 台的清单或产能口径
- [ ] 具名/匿名客户案例数据(走 case-study-interview-kit.md)

## 证据层级模板(新内容一律适用)

> **Standard**:ISO/IEC/GS1/监管文件 → **Manufacturer source**:NXP/Impinj/
> HID 一手资料 → **Proud Tek lab test**:设备/功率/距离/样本数/日期 →
> **Customer outcome**:客户类型/规模/基线/测量周期(目前为空,不引用)
