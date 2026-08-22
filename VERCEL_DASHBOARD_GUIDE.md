# Vercel 部署指南（无需 CLI）

## 方案：直接使用 Vercel Dashboard

由于 Vercel CLI 安装遇到权限问题，我们使用 Vercel 网页控制台完成部署。

---

## 步骤 1：配置环境变量

1. 访问 Vercel Dashboard: https://vercel.com/proudrfid/proudtek
2. 点击 **Settings** 标签
3. 左侧菜单选择 **Environment Variables**
4. 点击 **Add New**
5. 配置：
   - **Name:** `PROUDTEK_NATIVE_SHELL`
   - **Value:** `1`
   - **Environments:** 只勾选 **Preview** ✅（不要勾选 Production）
6. 点击 **Save**

---

## 步骤 2：触发 Preview 部署

### 选项 A：推送新提交（推荐）

```bash
# 创建一个空提交触发部署
git commit --allow-empty -m "chore: trigger preview deployment for Phase 1"
git push origin main
```

Vercel 会自动检测到推送并开始构建。

### 选项 B：手动部署

1. 在 Vercel Dashboard，点击 **Deployments** 标签
2. 找到最新的 `main` 分支部署
3. 点击右侧的 **⋯** 菜单
4. 选择 **Redeploy**
5. 确保勾选 **Use existing Build Cache** 以加快构建

---

## 步骤 3：监控部署状态

1. 在 **Deployments** 页面，等待构建完成
2. 状态变为 **Ready** 后，点击部署卡片
3. 记录 Preview URL（格式：`https://proudtek-<hash>.vercel.app`）

---

## 步骤 4：运行验收测试

打开 Preview URL 并按照 `.vercel/deployment-checklist.md` 执行：

### 关键测试项：

**桌面浏览器（Chrome/Firefox/Safari）：**
- [ ] 访问 `<preview-url>/blog/`
- [ ] 页面正常加载
- [ ] Header 和 Footer 可见
- [ ] 博客卡片网格正常

**移动设备（iOS Safari + Android Chrome）：**
- [ ] **关键测试：** 点击汉堡菜单，mobile drawer 打开
- [ ] **关键测试：** Drawer 背景是白色，不是深色/空白（这是之前的 bug）
- [ ] 菜单项可点击
- [ ] 关闭按钮功能正常

**Network 检查（DevTools → Network → Filter: CSS）：**
- [ ] 验证 **0 个请求** 包含 `kadence` 或 `woocommerce` 在 URL 中

---

## 步骤 5：Production 部署（仅在 Preview 通过后）

1. 返回 **Settings** → **Environment Variables**
2. 找到 `PROUDTEK_NATIVE_SHELL`
3. 点击 **Edit**
4. 勾选 **Production** 环境 ✅
5. 保存

6. 触发生产部署：
   - 选项 A：推送新提交
   - 选项 B：在 Dashboard 手动 Redeploy 最新的 main 部署到 Production

7. 按照 `.vercel/monitoring-guide.md` 监控 24 小时

---

## 快速回滚（如果 Production 出问题）

1. **Settings** → **Environment Variables**
2. 找到 `PROUDTEK_NATIVE_SHELL`
3. 点击 **Edit**
4. **取消勾选** Production ❌
5. 保存
6. **Deployments** → 找到最新 Production 部署 → **Redeploy**

回滚时间：~2-3 分钟

---

## 验证环境变量是否生效

部署完成后，在 Preview 部署的日志中搜索：

```
PROUDTEK_NATIVE_SHELL=1
```

如果看到这行，说明环境变量已正确应用。

---

## 后续步骤

**Preview 验收通过后：**
- 启用 Production 环境变量
- 监控 24 小时（参考 `.vercel/monitoring-guide.md`）
- 验证用户反馈和错误率

**全部稳定后：**
- 扩展到 `/guides/`、`/solutions/`
- 按照相同模式启用更多 hub routes

---

## 遇到问题？

- **构建失败：** 查看 Vercel Deployment Logs
- **样式异常：** 用 DevTools 检查是否有 kadence CSS 泄漏
- **Mobile drawer 空白：** 很可能是环境变量未生效，检查部署日志

所有代码已在 GitHub 上，随时可以开始部署。
