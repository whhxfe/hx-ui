#!/bin/bash
# =============================================================================
# hx-ui 统一部署脚本
# 用法：
#   pnpm deploy            # 部署到 Vercel
#   pnpm deploy vercel     # 部署到 Vercel
#   pnpm deploy github     # 显示 GitHub Pages 部署说明
#   pnpm deploy all        # 依次部署到两个平台
# =============================================================================

set -e

PLATFORM=${1:-vercel}

case $PLATFORM in
  vercel)
    echo "=========================================="
    echo "  部署到 Vercel (play + serverless API)"
    echo "=========================================="
    echo ""

    # 检查 vercel CLI
    if ! command -v vercel &> /dev/null; then
      echo "错误: 未安装 Vercel CLI"
      echo "请运行: npm i -g vercel"
      exit 1
    fi

    # 复制 Vercel 配置到根目录
    echo "1. 复制 Vercel 配置..."
    cp -rf .deploy/vercel/* ./

    # 部署
    echo "2. 执行 Vercel 部署..."
    vercel --prod

    echo ""
    echo "部署完成！"
    echo "- 演示站: https://<your-project>.vercel.app"
    echo "- API: https://<your-project>.vercel.app/api"
    ;;

  github)
    echo "=========================================="
    echo "  GitHub Pages 部署说明"
    echo "=========================================="
    echo ""
    echo "GitHub Pages 部署由 GitHub Actions 自动处理。"
    echo ""
    echo "触发条件："
    echo "  - push 到 main 分支且修改了 docs/ 目录"
    echo "  - 或手动触发 workflow_dispatch"
    echo ""
    echo "部署配置位于: .deploy/github-pages/.github/workflows/pages.yml"
    echo ""
    echo "要部署 docs 到 GitHub Pages:"
    echo "  1. 确保 GitHub 仓库已启用 GitHub Pages"
    echo "  2. 设置 Source 为 'GitHub Actions'"
    echo "  3. 推送代码到 main 分支"
    echo ""
    echo "  文档地址: https://<org>.github.io/<repo>/"
    ;;

  all)
    echo "=========================================="
    echo "  部署到所有平台"
    echo "=========================================="
    echo ""

    # 部署 Vercel
    echo ">> 部署 Vercel..."
    pnpm deploy vercel

    echo ""
    echo ">> GitHub Pages..."
    pnpm deploy github

    echo ""
    echo "=========================================="
    echo "  所有平台部署完成！"
    echo "=========================================="
    ;;

  *)
    echo "错误: 未知平台 '$PLATFORM'"
    echo ""
    echo "支持的平台:"
    echo "  vercel  - Vercel (play + serverless API)"
    echo "  github  - GitHub Pages (docs)"
    echo "  all     - 部署到所有平台"
    echo ""
    echo "用法: pnpm deploy [platform]"
    exit 1
    ;;
esac
