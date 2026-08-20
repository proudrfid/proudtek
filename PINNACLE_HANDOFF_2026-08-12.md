# Pinnacle P0 — 交付说明(2026-08-12,已更新)

> 首页重设计已按要求**全部回滚**(分支、预览文件、DESIGN.md 改动均已移除,首页仍是原样)。
> 保留的只有下面这个纯 bug 修复分支,不改任何视觉。

## 保留内容:`pinnacle/p0-rescue`(b499266a,已在你的仓库里)

| 修复 | 说明 |
| --- | --- |
| **10 条通配符 301 从未生效** | `:path*` 在 Vercel strict 模式下不匹配尾斜杠 → 全部改为 `:path(.*)`。已用 Vercel 官方路由库仿真验证 20/20 通过(含 `/de/anything/ → /anything/`、`/tag/nfc/ → /blog/`)。这是 8/8 收录急救的主体,此前在线上是哑的 |
| **114 篇 blog 无真实发布日期** | 回填 `publishedAt`(上线日 2026-06-11 基准),Article datePublished 不再随每次构建漂移 |
| **fetch 防误触** | `STOP_FETCH` 哨兵:`npm run fetch` 现在会抓镜像自身、覆盖 src/data/pages 快照,已拦截 |
| **转化快赢** | `?intent=` 参数终于被消费(contact 页标题/文案/Formspree 主题随之切换);WhatsApp 全站按页面上下文预填;case-studies 卡片改链 7 篇真实案例详情页,数字改为案例 JSON 的可验证数据 |

验证:构建 595 页通过,测试 157/157 通过(1 个快照按预期更新)。

## 部署(你的 Mac 终端,3 条命令)

```bash
cd ~/Projects/Playground
git checkout main && git merge --ff-only pinnacle/p0-rescue
git push origin main          # 需 VPN;Vercel 自动部署
```

部署后抽查:`proudtek.com/de/anything/` 应 301 到 `/anything/`;`/tag/nfc` 应 301 到 `/blog/`。
(检查完记得切回你的工作分支:`git checkout content-accuracy/citability-absolute-claims`)

## 只有你能做的(收录急救另一半)

1. GSC 验证 + 提交 sitemap + 15 个核心页请求收录 → `INDEX_RESCUE_CHECKLIST_2026-08-08.md`
2. Bing Webmaster「从 GSC 导入」
3. 目录提交 7 项 → `DIRECTORY_SUBMISSION_PACK_2026-08-08.md`(记录表还是空的)

## 其余路线

见 `PINNACLE_BLUEPRINT_2026-08-12.md`(体检报告 + P1–P3 路线图)。首页如果以后想再做,先给视觉方向的参考样例再动工。
