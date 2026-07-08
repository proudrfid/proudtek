# blog-fable 使用说明(中文)

blog-transform 的 **Cowork 桌面端运行版**(Claude Fable 5 会话专用)。内容规则
(幽默配方、SVG 站规、SEO/GEO、Tier B 红线)完全沿用 blog-transform——本 skill
只补"在沙盒里怎么跑"这一层,全部来自 2026-07-08 批量移植 19 篇的实战教训。

## 什么时候用哪个

| 环境 | 用 |
|---|---|
| Claude Code(你的 Mac 终端,Opus 4.8 等) | **blog-transform** |
| Cowork 桌面 App(Fable 会话,本仓库以挂载文件夹接入) | **blog-fable** |

## 怎么用

Cowork 会话里直接说即可(skill 会自动触发),例如:

```
用 blog-fable 改造 src/content/editorial/blog/<slug>.json,做完打包分支给我 push
```

```
用 blog-fable 把 _redesigns/ 里的 <xxx>.html 移植回真正的页面并交付
```

## 它替你避开的坑(速记)

- 文件工具与 bash 的双路径体系;/tmp 图片要拷回仓库才能"看"。
- 改页前先查 `public/_redirects`(301 孤儿页陷阱,ntag 案例)。
- squash-merge 仓库:是否已上线以内容对比为准,分支 ahead 不可信。
- 假 zod 校验器、vitest 要 TMPDIR、ImageMagick 渲 SVG 失真 → cairosvg。
- drift lint 连行尾逗号一起比:`{chip:}` 行不能变成数组末元素。
- 沙盒无推送凭证:plumbing 建分支 + 给你可粘贴的 push/PR 命令(无行内注释)。
- merge 后用 `?v=` 缓存穿透验证;PR 合并后追加的修复要开新 PR。
