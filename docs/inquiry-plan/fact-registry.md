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
| 样品政策 | 库存样品免费(快递到付);定制/新开样品 $30-$100 | FAQ + sample-pack LP(已对齐) |
| 保修 | 1 年,覆盖我们供应的全部产品 | FAQ(已修语法与实体名) |
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

## 审核判定与处置(平反记录)

| 审核指控 | 核查结果 | 处置 |
|---|---|---|
| 成立年份 2008 vs 2010 冲突 | ✗ 不实:2010 是 EU 法规/行业事件年份,非公司年份 | 无需修 |
| "29/26 卡数量口径" | 当前库无此硬编码 | 无需修(计数动态) |
| $30-100 样品费"不存在" | 存在(faq.json,审核指 LP 与 FAQ 不一致属实的另一半) | LP 已补全口径 |
| not practically clonable | 原句有条件限定 | 保留 |
| guaranteed ×21 | 7/8 是技术/厂商语境,仅 1 处软化 | 已修 1 处 |

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
