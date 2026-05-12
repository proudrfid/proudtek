# Prompt — 盘查全站页面的主图（Hero Image）并补齐缺失

将此 prompt 直接复制到一个新的 Claude 会话里，或交给一个能执行 Bash/Read/Write/WebSearch/image-gen 工具的 agent 使用。

---

## 任务目标

检查 Proud Tek 站点（位于 `/sessions/happy-practical-bohr/mnt/Playground/`，构建后输出在 `dist-restored/`）中下列页面类型的**主图（hero image）**是否存在；对于**缺失主图**的页面，在线搜索合适的免版税图片或用**免费** AI 生成符合品牌调性的图像，然后把图片落到 `public/landing-images/` 目录并修改源文件（Astro 组件 或 editorial-pages.ts / render-snapshot.ts 里的模板）让页面在下一次 `npm run build` 后自动带上主图。

## ⚠️ 硬性约束（不可违反）

1. **禁止复用任何现有图片**。站点下的 `dist-restored/site-assets/`、`public/landing-images/`、`blog-images/`、任何已存在的图片资源都**不得**作为本任务的主图使用。每张补齐的主图必须是本任务**新下载或新生成**的。
2. **整个任务预算 = $0**。只能使用：
   - 免版税图片站（Unsplash / Pexels / Pixabay / Wikimedia Commons / Openverse）
   - 免费 AI 生成工具（Pollinations.ai、Hugging Face Spaces 免费 Inference、Google AI Studio 免费配额、Bing Image Creator 等）
   - **禁止**调用任何付费 API（DALL·E API、Midjourney API、Replicate 付费模型、Stability 付费 API 等）
3. 所有图片的来源必须可公开验证（记录到 CREDITS.md）。

## 页面范围（按优先级）

| 优先级 | 路径 | 数量 | 说明 |
|---|---|---:|---|
| 高 | `/solutions/*` | 38 | landing pages — 面向采购/转化，主图最重要 |
| 高 | `/blog/*` | 91 | 大部分无主图，影响阅读体验与 SEO |
| 中 | `/editorial/guides/*` + `/guides/*` | 40 | 长文知识库，补主图提升专业感 |
| 中 | `/compatibility/*` | 8 | 酒店锁兼容性页 |
| 低 | `/product/*` | 51 | 已有 WooCommerce 产品图；仅抽查确认 |

## 主图的判断标准（"有主图"的定义）

一个页面算作"有主图"需要**同时满足**：

1. HTML 里存在至少一个主内容区（非 header/footer/sidebar）的 `<img>` 或 `<figure>`，满足其一：
   - class 含 `wp-post-image` / `attachment-post-thumbnail` / `codex-editorial-hero-media` / `codex-hero-image`
   - 父容器 class 含 `hero` / `featured-image` / `post-thumbnail` / `entry-header` / `entry-image`
   - 图片宽度属性 ≥ 600px 且位置在正文 H1 之前
2. 对应 `<meta property="og:image">` 存在且**不是**通用的 `proudtek-logo.png` 默认占位
3. 图片文件真实存在于 `dist-restored/site-assets/` 或 `public/landing-images/` 下（不是 404）

不满足任一条件 → 视为缺主图。

## 第 1 步：扫描盘点（一次性）

写一个 Node/Python 脚本（放在 `scripts/audit-hero-images.mjs`），遍历每个页面类型的 `index.html`，输出如下 CSV/JSON：

```
page_path, page_type, has_hero, hero_img_src, og_image, title, h1, suggested_keywords
```

`suggested_keywords` 用 H1 + 页面标题 + `meta description` 的前 30 字合并，用于后续搜图 / 生图。

**交付物 1**：`audit-hero-images.json`（列出所有页面的当前状态），以及一个 Markdown 摘要 `HERO_IMAGE_AUDIT.md` 列出需要补图的页面数量按目录分组。

## 第 2 步：为每张缺失的主图获取素材

**严格要求**：
- ❌ **不得**复用本地 `dist-restored/site-assets/`、`public/landing-images/` 等目录下已有的图片。每张缺失的主图必须是**新获取**的资源
- ✅ 只能走两条路径：在线免版税图片 或 免费 AI 生成
- ✅ 不能使用任何付费 API / 付费服务

**策略（按顺序尝试）**：

### A. 在线搜索免版税图片（首选）

通过 WebSearch 或 WebFetch 在以下来源按关键词搜索：

| 来源 | 授权 | 搜索 URL 模板 |
|---|---|---|
| Unsplash | Unsplash License（商用免费、无需署名） | `https://unsplash.com/s/photos/{keyword}` |
| Pexels | Pexels License（商用免费、无需署名） | `https://www.pexels.com/search/{keyword}/` |
| Pixabay | Pixabay License（商用免费） | `https://pixabay.com/images/search/{keyword}/` |
| Wikimedia Commons | CC0 / CC BY / PD（部分需署名） | `https://commons.wikimedia.org/w/index.php?search={keyword}&type=image` |
| Openverse | 聚合多个 CC 源 | `https://openverse.org/search/image?q={keyword}` |

**筛选规则**：
- 只接受明确标注 "Free to use" / CC0 / Unsplash License / Pexels License / Pixabay License 的图片
- 如果授权要求署名（如 CC BY 4.0），必须在 CREDITS.md 里登记作者和链接
- 优先选择横向（16:9 或 3:2）构图、中性或冷色调、包含产品或场景（而非人物特写）
- 分辨率至少 1600×900（Retina 屏需要）；小于此分辨率的不要下载
- 避免：带可见文字、带可见商标/Logo、质量低、风格不统一的图片

**下载方式**：
- Unsplash：直接 GET `https://images.unsplash.com/photo-xxx?w=1600&fm=webp&q=80`
- Pexels：优先使用 Pexels API（免费、需申请 API key）；不想用 API 就从页面抓 `<img srcset>` 的高清 URL
- Pixabay / Wikimedia：直接右键/开发者工具拿原图 URL

### B. 免费 AI 生成（回退方案）

如果来源 A 搜不到合适的图，用以下**免费**生成工具（按优先级）：

| 工具 | 接入方式 | 免费额度 |
|---|---|---|
| **Pollinations.ai** | 直接 GET `https://image.pollinations.ai/prompt/{url-encoded-prompt}?width=1600&height=900&nologo=true` | 完全免费、无需注册、无频率限制 |
| **Hugging Face Spaces** | 通过公开 Space（如 `black-forest-labs/FLUX.1-schnell`、`stabilityai/stable-diffusion-3.5-large`）调用 Inference API | 免费但有频率限制；需 HF 免费 token |
| **Google AI Studio — Imagen 3** | `https://aistudio.google.com/` | 免费配额（需 Google 账号） |
| **Leonardo.ai** free tier | 每日免费 tokens | 需注册 |
| **Bing Image Creator (DALL·E 3)** | https://www.bing.com/images/create | 需微软账号，每日限量 boost |

**推荐首选 Pollinations.ai**，因为它完全免费、直接 HTTP GET 就能拿到图、适合批量脚本化调用。

**品牌风格提示词模板**（追加到每个页面的主题提示词后）：
```
professional commercial photography, clean industrial aesthetic,
soft natural lighting, neutral palette with warm amber accents,
shallow depth of field, editorial magazine style,
no visible text, no logos, no watermarks, 16:9 aspect ratio,
high detail, crisp focus
```

**按页面类型组装的主题提示词示例**：
- `solutions/rfid-laundry-tags/` → "RFID laundry tags attached to hotel linens in an industrial laundry facility"
- `blog/access-card-copied-security-upgrade/` → "close-up of a modern electronic door lock with an RFID key card being presented"
- `editorial/guides/iso-14443-explained/` → "minimalist flat-design infographic of NFC chip architecture, isometric view, pale background"
- `compatibility/saflok-hotel-key-cards/` → "hotel room electronic keycard lock on a wooden door with a contactless RFID card being held near the reader"

**Pollinations.ai 调用示例（bash）**：
```bash
prompt="RFID laundry tags attached to hotel linens in an industrial laundry facility, professional commercial photography, clean industrial aesthetic, soft natural lighting, neutral palette with warm amber accents, shallow depth of field, editorial magazine style, no visible text, no logos, 16:9 aspect ratio, high detail"
encoded=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$prompt")
curl -sL "https://image.pollinations.ai/prompt/${encoded}?width=1600&height=900&nologo=true&seed=$(date +%s)" \
     -o "public/landing-images/hero/rfid-laundry-tags-hero.jpg"
```

**如果 A 和 B 同时失败**：记录到 `HERO_IMAGE_AUDIT.md` 的"未能获取"清单里，不要留占位图，也不要复用旧图。

## 第 3 步：优化并落盘

对于**每张新获取的图**：

1. 缩放并转换为 WebP（主用）+ JPG（兜底），目标主图尺寸 1600×900，辅助尺寸 800×450、400×225
2. 文件命名：`{page-slug}-hero.webp` / `.jpg`（slug 由路径转为 kebab-case，如 `solutions-rfid-laundry-tags-hero.webp`）
3. 存放位置：**新建**目录 `public/landing-images/hero/`（若已存在，**不要**在新文件命名时与旧文件冲突）
4. 保留原始文件的归属（attribution）元数据在 `public/landing-images/hero/CREDITS.md`，每行包含：文件名、原始 URL、作者、来源、授权类型
5. 处理工具推荐：`sharp`（Node）或 `Pillow`（Python）做缩放和 WebP 转换

**再次确认**：所有落到这个目录的图片，都必须是**本任务中新下载或新生成的**。不得移动、复制、或重命名站点内任何既有图片到这个目录冒充新资源。

## 第 4 步：注入到页面

由于本站主要走 WordPress 快照 + `render-snapshot.ts` cheerio 处理，有两种注入策略：

### 方式 A：改 `render-snapshot.ts`（cheerio 注入，改动最小）
在页面没有主图时，根据 `meta[name="codex-page-slug"]` 或 `<body class="page-id-XXX">` 查一张对应主图，插入到 `main > .entry-content` 或 `article` 顶部。

示例伪代码：
```ts
const pageSlug = getSlug(page.route);  // e.g. "solutions/rfid-laundry-tags"
const hero = getHeroByPageSlug(pageSlug); // from a manifest JSON
if (hero && !$body(".codex-injected-hero").length) {
  const mainArticle = $body("article, main .entry-content").first();
  mainArticle.prepend(`
    <figure class="codex-injected-hero wp-post-image">
      <img src="${hero.src}" alt="${hero.alt}" width="1600" height="900"
           loading="eager" fetchpriority="high" decoding="async">
      ${hero.credit ? `<figcaption>Photo: ${hero.credit}</figcaption>` : ''}
    </figure>
  `);
}
```

Manifest 是一个 JSON 文件（`src/data/hero-images.json`）：
```json
{
  "solutions/rfid-laundry-tags": {
    "src": "/landing-images/hero/rfid-laundry-tags-hero.webp",
    "srcset": "/landing-images/hero/rfid-laundry-tags-hero-800.webp 800w, ...",
    "alt": "RFID laundry tags attached to hotel linens in an industrial laundry facility",
    "credit": "Unsplash — John Doe"
  },
  ...
}
```

### 方式 B：改 Astro 源组件
对编辑类页面（editorial、guides），修改对应 `*.astro` 组件或 `editorial-pages.ts` 的 `render*()` 函数，使其支持 `heroImage?: string` 字段。

## 第 5 步：也同步更新 `og:image` 元标签

在 `render-snapshot.ts` 的 head 处理或 `src/lib/seo.ts` 里：若页面存在主图，把 `<meta property="og:image">` 的内容换成主图 URL（1200×630 裁切版本 — 需要额外生成一份）。

## 第 6 步：重新构建并抽查验证

```bash
cd /sessions/happy-practical-bohr/mnt/Playground
npm run build
```

再跑一遍第 1 步的审计脚本，确认 `has_hero=false` 的页面数从 N 变为 0（或接近 0）。用 Chrome 浏览器访问 3-5 个之前缺主图的页面抽查视觉效果。

---

## 验收标准

- [ ] `solutions/*`（38 页）100% 有主图
- [ ] `blog/*`（91 页）至少 90% 有主图（允许部分极短贴文例外）
- [ ] `editorial/guides/*` + `guides/*`（40 页）100% 有主图
- [ ] `compatibility/*`（8 页）100% 有主图
- [ ] 所有新图：WebP + JPG 双格式、≥1600×900、带 alt、`loading="eager" fetchpriority="high"` 仅限首屏主图
- [ ] **每一张新图的 SHA-256 哈希 ≠ 站点内任何既有图片的 SHA-256 哈希**（用脚本验证，防止误复用）
- [ ] `public/landing-images/hero/CREDITS.md` 列出所有图片的来源（Unsplash/Pexels/Pixabay/Pollinations.ai 等）+ 授权 + 原始 URL
- [ ] `og:image` 与主图同步
- [ ] `npm run build` 通过、无新构建错误
- [ ] 抽查 5 个页面浏览器视觉 OK

## 预算与速率控制

- **在线搜图**：每页最多请求 3 次（A 内部在 Unsplash → Pexels → Pixabay 三个来源切换），避免被限速
- **AI 生图**：**只用免费工具**（首推 Pollinations.ai，次选 Hugging Face Spaces / Google AI Studio / Bing Image Creator）。不得调用 DALL·E API、Midjourney 付费 API、Replicate 付费模型等**任何需要付费或消耗 API credits 的服务**
- **并发**：每次处理 3-5 页，每张生成后 `sleep 2-3s`，避免触发免费服务的限流
- **预算上限**：**$0**（整个任务不允许产生任何金钱开销）

## 最后

执行完成后请生成两份报告：
1. `HERO_IMAGE_AUDIT.md` — 审计前后对比、各目录完成率、图片来源分布（本地复用 / Unsplash / Pexels / AI 生成 的占比）
2. `public/landing-images/hero/CREDITS.md` — 所有外部素材归属表
