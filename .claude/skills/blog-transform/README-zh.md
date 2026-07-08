# blog-transform 使用说明(中文)

一条龙博客改造:**语气活化(幽默但不失专业)+ 令牌化 SVG 配图 + SEO/GEO 优化**,
三层一次完成,事实规格零改动。基于本仓库已验证的 blog-voice 流程扩展而来。

## 安装位置

- 本 skill 已在仓库内:`.claude/skills/blog-transform/` — 在仓库目录打开
  Claude Code 即自动可用,无需安装。
- `blog-transform.skill` 压缩包可导入 claude.ai / Cowork(Settings →
  Capabilities → Skills)。

## 在 Opus 4.8 里使用(Claude Code)

```bash
cd /Users/zhangping/Projects/Playground
claude --model claude-opus-4-8
```

然后粘贴下面任一 prompt。

### Prompt 1 — 单篇改造,先预览不提交(推荐首跑)

```
用 blog-transform 改造 src/content/editorial/blog/<slug>.json,mode=preview。
要求:幽默改写 + 每个主要章节配令牌化 SVG + SEO/GEO 优化,跑完全部验收命令,
最后告诉我改了哪些文件,我自己 npm run dev 看效果。
```

### Prompt 2 — 单篇改造并开 PR

```
用 blog-transform 改造 <slug>,mode=pr。全部验收门通过后再开 PR,
PR 描述里列出:humor/enjoyable 评分、新增 SVG 清单、SEO/GEO 改动点。
```

### Prompt 3 — 批量(注意:会尊重 STOP_BLOG_VOICE 停止信号)

```
用 blog-transform 批量改造:先跑 npm run blog-voice:next 认领目标,
遇到停止信号就停下来问我。每篇独立分支,≥5 篇合一个 PR。
```

### Prompt 4 — 只要 AI 生图提示词(不画 SVG)

```
用 blog-transform 处理 <slug>,配图走 AI 生图路线:按
references/image-prompts.md 为 hero 和每个章节各输出一条生图 prompt,
其余(文字改写 + SEO/GEO + JSON 接线)照常。
```

## 在非 Claude 环境使用(其他大模型)

把 `SKILL.md` 正文 + `references/` 三个文件一起作为 system prompt(或首条
消息)粘贴,再附上目标 JSON 文件内容。没有仓库工具的环境里,让模型输出:
改后完整 JSON + 每张 SVG 代码 + 验收清单,你再手动落盘并在仓库跑验收命令。

## 红线速记(违反即挂 CI 或伤品牌)

- **事实冻结**:芯片名/认证/内存频率规格/标准号/价格,一个都不许改、不许编。
- **`{chip:...}` 占位符行逐字节不动**(含空格),改一处挂 drift lint。
- **Tier B(医疗/患者安全/药品)幽默 ≤2/10**,玩笑绝不落在伤害后果上。
- `reviewedAt` / `reviewedBySlug` 是人工签核,不许碰;`modifiedAt` 改为当天。
- SVG 红色 `#8b2d2d` 只用于真实风险状态,不做装饰。
- 品牌名写 "Proud Tek"(带空格)。

## 产出物清单

改后的 `src/content/editorial/blog/<slug>.json` · `public/diagrams/blog/`
下的 hero + 章节 SVG · 全绿的验收命令输出 ·(pr 模式)一个带评分与改动
清单的 PR。
