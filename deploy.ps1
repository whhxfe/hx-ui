# =============================================================================
# hx-ui 统一部署脚本 (Windows PowerShell)
# 用法：
#   pnpm deploy            # 部署到 Vercel
#   pnpm deploy vercel     # 部署到 Vercel
#   pnpm deploy github     # 显示 GitHub Pages 部署说明
#   pnpm deploy all        # 依次部署到两个平台
# =============================================================================

param(
    [string]$Platform = "vercel"
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  $Message" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
}

switch ($Platform) {
    "vercel" {
        Write-Step "部署到 Vercel (play + serverless API)"

        # 检查 vercel CLI
        $vercelCmd = Get-Command vercel -ErrorAction SilentlyContinue
        if (-not $vercelCmd) {
            Write-Host "错误: 未安装 Vercel CLI" -ForegroundColor Red
            Write-Host "请运行: npm i -g vercel" -ForegroundColor Yellow
            exit 1
        }

        # 复制 Vercel 配置到根目录（如果不存在）
        Write-Host "1. 检查 Vercel 配置..." -ForegroundColor Green
        if (-not (Test-Path "vercel.json")) {
            Write-Host "   复制 vercel.json..."
            Copy-Item ".deploy/vercel/vercel.json" "." -Force
        }
        if (-not (Test-Path "api")) {
            Write-Host "   复制 api/ 目录..."
            Copy-Item ".deploy/vercel/api" "." -Recurse -Force
        }

        # 部署
        Write-Host "2. 执行 Vercel 部署..." -ForegroundColor Green
        vercel --prod

        Write-Host ""
        Write-Host "部署完成！" -ForegroundColor Green
        Write-Host "- 演示站: https://<your-project>.vercel.app"
        Write-Host "- API: https://<your-project>.vercel.app/api"
    }

    "github" {
        Write-Step "GitHub Pages 部署说明"

        Write-Host ""
        Write-Host "GitHub Pages 部署由 GitHub Actions 自动处理。" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "触发条件：" -ForegroundColor Cyan
        Write-Host "  - push 到 main 分支且修改了 docs/ 目录"
        Write-Host "  - 或手动触发 workflow_dispatch"
        Write-Host ""
        Write-Host "部署配置位于: .github/workflows/pages.yml" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "要部署 docs 到 GitHub Pages:" -ForegroundColor Green
        Write-Host "  1. 确保 GitHub 仓库已启用 GitHub Pages"
        Write-Host "  2. 设置 Source 为 'GitHub Actions'"
        Write-Host "  3. 推送代码到 main 分支"
        Write-Host ""
        Write-Host "  文档地址: https://<org>.github.io/<repo>/"
    }

    "all" {
        Write-Step "部署到所有平台"

        Write-Host ">> 部署 Vercel..." -ForegroundColor Yellow
        & $MyInvocation.PSCommandPath -Platform vercel

        Write-Host ""
        Write-Host ">> GitHub Pages..." -ForegroundColor Yellow
        & $MyInvocation.PSCommandPath -Platform github

        Write-Host ""
        Write-Host "==========================================" -ForegroundColor Cyan
        Write-Host "  所有平台部署完成！" -ForegroundColor Green
        Write-Host "==========================================" -ForegroundColor Cyan
    }

    default {
        Write-Host "错误: 未知平台 '$Platform'" -ForegroundColor Red
        Write-Host ""
        Write-Host "支持的平台:" -ForegroundColor Yellow
        Write-Host "  vercel  - Vercel (play + serverless API)"
        Write-Host "  github  - GitHub Pages (docs)"
        Write-Host "  all     - 部署到所有平台"
        Write-Host ""
        Write-Host "用法: .\deploy.ps1 [platform]" -ForegroundColor Cyan
        exit 1
    }
}
