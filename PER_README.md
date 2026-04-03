# Rex Wang 个人网站项目文档

## 1. 项目概述

这是一个基于 **Vue 3** 的个人博客/作品集网站，采用现代化的技术栈构建。网站主要用于展示技术博客、每日随笔、产品思考和旅行兴趣等内容模块。网站使用 Markdown 作为内容格式，通过 ViteSSG 进行静态站点生成，支持服务端渲染（SSG）以获得更好的 SEO 和加载性能。

项目地址：https://github.com/OnlyProbie/onlyprobie.github.io

## 2. 目录结构说明

```
onlyprobie.github.io/
├── pages/                    # 页面路由目录（基于文件系统的路由）
│   ├── [...404].md          # 404 错误页面
│   ├── index.md             # 首页
│   ├── daily/               # 碎记模块
│   │   ├── index.md         # 碎历日历页
│   │   └── [date].md        # 碎记详情页（动态路由）
│   ├── posts/               # 技术博客模块
│   │   ├── index.md         # 博客列表页
│   │   └── *.md             # 博客文章
│   ├── product/             # 产品思考模块
│   │   ├── index.md         # 产品列表页
│   │   └── [slug].md        # 产品详情页（动态路由）
│   ├── interest/            # 兴趣模块
│   │   ├── index.md         # 兴趣主页（地图相册）
│   │   ├── photo.md         # 摄影作品
│   │   ├── travel.md        # 旅行记录
│   │   └── xian.md          # 西安特辑
│   ├── content/             # 内容生成目录
│   │   ├── daily/          # 碎记源文件（自动生成）
│   │   └── product/        # 产品源文件（手动管理）
│   ├── design/              # 设计模块
│   └── thinking/            # 思考模块
├── src/                      # Vue 组件和业务逻辑
│   ├── components/          # Vue 组件
│   │   ├── NavBar.vue       # 导航栏
│   │   ├── Footer.vue       # 页脚
│   │   ├── ProfileCard.vue  # 个人资料卡片
│   │   ├── ListPosts.vue    # 文章列表组件
│   │   ├── ProductCard.vue  # 产品卡片
│   │   ├── ProductDetail.vue # 产品详情
│   │   ├── DailyDetail.vue  # 碎记详情
│   │   ├── DailyCalendar.vue # 日历组件（支持农历、节假日）
│   │   ├── ChinaMapAlbum.vue # 中国地图相册
│   │   ├── Search.vue       # 搜索组件
│   │   ├── ToggleTheme.vue  # 主题切换
│   │   ├── BackToTop.vue    # 返回顶部
│   │   ├── ParticleNetwork.vue # 粒子背景动画
│   │   └── WrapperPost.vue  # 文章包装组件
│   ├── composables/         # Vue Composables
│   │   └── useHoliday.ts    # 节假日计算逻辑
│   ├── data/                # 自动生成的数据文件
│   │   ├── dailiesAuto.ts   # 碎记数据（自动生成）
│   │   ├── interestsAuto.ts # 兴趣数据（自动生成）
│   │   └── productsAuto.ts  # 产品数据（自动生成）
│   ├── styles/              # 样式文件
│   │   ├── main.css         # 主样式
│   │   ├── prose.css        # 文章排版样式
│   │   └── markdown.css     # Markdown 渲染样式
│   ├── logics/              # 业务逻辑
│   ├── types.ts             # TypeScript 类型定义
│   ├── App.vue              # 根组件
│   └── main.ts              # 应用入口
├── scripts/                  # 构建脚本
│   ├── generateDailies.ts   # 生成碎记数据
│   ├── generateInterests.ts # 生成兴趣数据
│   ├── generateProducts.ts  # 生成产品数据
│   ├── rss.ts               # 生成 RSS 订阅
│   ├── slugify.ts           # URL slug 处理
│   └── bridge.js            # 桥接脚本
├── packages/                 # 工具包
│   ├── responsive/          # 响应式工具
│   └── utils/               # 通用工具函数
├── content-creator/          # 内容创作工具（独立 Next.js 应用）
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React 组件
│   │   └── lib/             # 工具库
│   └── public/              # 静态资源
├── public/                  # 静态公共资源
│   └── geojson/             # 地图 GeoJSON 数据
│       └── china.json        # 中国地图数据
├── .github/workflows/        # GitHub Actions
│   └── github-pages.yml     # 自动部署配置
├── vite.config.ts           # Vite 配置
├── unocss.config.ts         # UnoCSS 配置
├── tsconfig.json            # TypeScript 配置
├── package.json             # 依赖管理
├── netlify.toml             # Netlify 部署配置
└── test.md                  # 本文档
```

## 3. 主要功能模块分析

### 3.1 首页 (pages/index.md)
- 展示个人资料卡片（ProfileCard）
- 粒子网络背景动画（ParticleNetwork）
- 支持主题切换

### 3.2 博客模块 (pages/posts/)
- 技术文章列表展示
- 支持 Markdown 格式渲染
- 使用 Shiki 进行代码高亮（支持 TwoSlash 语法）
- GitHub 风格的 alerts（tip、warning、danger 等）
- 自动生成目录（Table of Contents）
- 图片点击放大预览

### 3.3 碎记模块 (pages/daily/)
- **DailyCalendar 组件**：完整的日历视图
  - 显示农历日期和节假日信息
  - 标记有记录的日子
  - 支持节气显示
  - 调休/补班标记
  - 点击日期跳转到详情页
- **DailyDetail 组件**：碎记详情展示

### 3.4 产品模块 (pages/product/)
- ProductCard 组件：产品卡片展示
- ProductDetail 组件：产品详情页
- 产品相关数据自动从 `pages/content/product/` 目录生成

### 3.5 兴趣模块 (pages/interest/)
- **ChinaMapAlbum 组件**：中国地图相册
  - 使用 ECharts 渲染中国地图
  - 根据照片 EXIF 信息提取城市
  - 点击城市显示该城市的所有照片
  - 使用本地 GeoJSON 数据（china.json）
- 旅行照片管理（从 `public/images/interests/travel/` 自动读取）

### 3.6 内容创作工具 (content-creator/)
独立运行的 Next.js 应用，提供：
- 可视化内容创建表单
- 支持多种内容类型：博客、碎记、产品、兴趣
- 实时 Markdown 预览
- 一键保存到正确目录
- 下载 Markdown 文件
- 复制到剪贴板

## 4. 技术实现细节

### 4.1 核心框架
- **Vue 3.5.12**：渐进式 JavaScript 框架
- **Vue Router 4.2.5**：官方路由管理
- **Pinia 2.2.4**：状态管理
- **Vite 5.4.9**：下一代前端构建工具
- **vite-ssg 0.23.8**：静态站点生成

### 4.2 UI 和样式
- **UnoCSS 0.63.6**：原子化 CSS 引擎（预设 presetUno、presetIcons、presetAttributify）
- **@unocss/reset**：CSS 重置
- **Floating-Vue 5.2.2**：浮动菜单组件
- **NProgress 0.2.0**：导航进度条

### 4.3 Markdown 处理
- **markdown-it**：Markdown 解析器
- **Shiki 1.22.2**：代码高亮（支持 VS Code 主题）
- **@shikijs/twoslash**：TypeScript 代码类型提示
- **markdown-it-anchor**：标题锚点生成
- **markdown-it-github-alerts**：GitHub 风格的提示框
- **markdown-it-magic-link**：自动链接转换
- **markdown-it-table-of-contents**：目录生成

### 4.4 数据可视化
- **ECharts 5.6.0**：图表库
- **ECharts-GL 2.0.9**：ECharts WebGL 扩展
- **D3 7.9.0**：数据驱动文档

### 4.5 日期处理
- **dayjs 1.11.13**：轻量级日期库
- **lunar 2.0.0**：农历转换
- **chinese-holidays 1.8.0**：中国节假日

### 4.6 自动数据生成脚本
项目使用 `esno`（ESM Node）运行 TypeScript 脚本：

```typescript
// generateDailies.ts - 扫描 pages/content/daily/*.md 生成数据
// generateInterests.ts - 扫描 public/images/interests/travel/ 生成照片数据
// generateProducts.ts - 扫描 pages/content/product/*.md 生成产品数据
```

生成的文件保存在 `src/data/` 目录，这些文件由脚本自动生成，不应手动编辑。

### 4.7 路由系统
使用 `unplugin-vue-router` 实现基于文件系统的路由：
- `pages/*.md` → `/`
- `pages/posts/*.md` → `/posts/`
- `pages/daily/[date].md` → `/daily/:date`

### 4.8 构建时数据流
```
1. esno ./scripts/generateDailies.ts     → 生成 src/data/dailiesAuto.ts
2. esno ./scripts/generateInterests.ts  → 生成 src/data/interestsAuto.ts
3. esno ./scripts/generateProducts.ts    → 生成 src/data/productsAuto.ts
4. vite-ssg build                        → 生成静态 HTML
5. esno ./scripts/rss.ts                → 生成 RSS 订阅文件
```

## 5. 构建与部署说明

### 5.1 本地开发

```bash
# 安装依赖（使用 pnpm）
pnpm install

# 启动开发服务器
pnpm dev
# 访问 http://localhost:3333

# 生成各类数据文件（开发时 dev 命令会自动运行）
pnpm generate:interests
pnpm generate:products
```

### 5.2 生产构建

```bash
pnpm build
```

构建产物输出到 `dist/` 目录。

### 5.3 部署

#### GitHub Pages（自动部署）
项目配置了 GitHub Actions，当 push 到 `main` 分支时自动：
1. 安装 pnpm 和 Node.js 20
2. 执行 `pnpm run build`
3. 将 `dist/` 目录部署到 GitHub Pages

#### Netlify 部署
项目根目录包含 `netlify.toml` 配置文件，支持 Netlify 自动部署。

### 5.4 内容创作工具使用

```bash
# 进入 content-creator 目录
cd content-creator

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
# 访问 http://localhost:3000
```

内容创作工具独立运行，通过 API 路由保存文件到主项目。

### 5.5 添加新内容

#### 添加博客文章
在 `pages/posts/` 目录创建 `.md` 文件：

```markdown
---
title: 文章标题
date: 2024-01-01
description: 文章描述
---

文章内容...
```

#### 添加碎记
在 `pages/content/daily/` 目录创建 `YYYY-MM-DD.md` 文件：

```markdown
---
date: 2024-01-01
---

# 今日碎记

碎记内容...
```

#### 添加产品
在 `pages/content/product/` 目录创建 `.md` 文件：

```markdown
---
slug: product-slug
title: 产品名称
description: 产品描述
date: 2024-01-01
features:
  - 特性1
  - 特性2
techStack:
  - 技术栈1
---

产品内容...
```

#### 添加旅行照片
将照片放入 `public/images/interests/travel/` 目录，文件名格式：
`城市-景点-YYYYMMDD.jpg` 或 `城市-YYYYMM.jpg`

### 5.6 代码规范

项目使用 ESLint 和 lint-staged：
- 提交前自动运行 `eslint --fix`
- 使用 `@antfu/eslint-config` 配置

## 6. 许可证

- 代码：MIT License
- 文章和图片：CC BY-NC-SA 4.0
