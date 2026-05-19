# 部署指南

## 概述

本项目采用双平台部署策略：
- **Vercel**: 部署 play（演示站）和 serverless API
- **GitHub Pages**: 部署 docs（文档站）

## 目录结构

```
.deploy/
├── vercel/                    # Vercel 部署配置
│   ├── vercel.json           # Vercel 配置文件
│   └── .vercel.env           # 环境变量（需在 Vercel Dashboard 设置）
├── github-pages/             # GitHub Pages 部署配置
│   └── .github/workflows/
│       └── pages.yml        # GitHub Actions 配置
```

## Vercel 部署

### 1. 安装 Vercel CLI

```bash
npm i -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

### 3. 设置环境变量

在 Vercel Dashboard 中设置以下环境变量：
- `VITE_API_BASE_URL`: 部署后的 Vercel 项目地址（如 `https://hx-ui.vercel.app`）

### 4. 部署

```bash
# 部署到预览环境
pnpm deploy:vercel

# 或使用部署脚本
pnpm deploy vercel
```

### 5. 更新 play 配置

部署后需要修改 `play/src/App.vue` 中的 `cdnUrl` 为实际的 Vercel 地址：

```typescript
iconify: {
  source: 'cdn' as const,
  cdnUrl: "https://hx-ui.vercel.app"  // 替换为实际地址
}
```

## GitHub Pages 部署

### 1. 启用 GitHub Pages

1. 进入 GitHub 仓库 Settings → Pages
2. Source 选择 "GitHub Actions"

### 2. 触发部署

推送代码到 main 分支，当 `docs/` 目录有变更时会自动触发部署。

### 3. 访问文档

部署完成后访问：`https://<org>.github.io/<repo>/`

## 一键部署

```bash
# 部署到所有平台
pnpm deploy:all

# 仅部署到 Vercel
pnpm deploy:vercel

# 查看 GitHub Pages 部署说明
pnpm deploy:github
```

## 注意事项

### API 地址配置

play 演示站依赖 API 服务，目前有两种选择：

1. **使用本地 server**：本地开发时运行 `pnpm server:dev`
2. **使用外部 API**：在 `play/src/App.vue` 中配置外部 API 地址

### Vercel Serverless Functions

当前配置为纯静态部署。如需完整的 serverless API，需要：

1. 使用 Hono 的 Vercel 适配器
2. 配置云存储（如 Vercel Blob）用于文件上传
3. 添加数据库支持（如 Vercel Postgres）

### GitHub Pages Base Path

如果部署到子路径（如 `https://username.github.io/hx-ui/`），需要修改 `docs/.vitepress/config.mts` 中的 `base` 配置。
