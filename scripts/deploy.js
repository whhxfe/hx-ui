#!/usr/bin/env node
/**
 * hx-ui 统一部署脚本 (跨平台 Node.js)
 *
 * 用法：
 *   node scripts/deploy.js          # 部署到 Vercel
 *   node scripts/deploy.js vercel   # 部署到 Vercel
 *   node scripts/deploy.js github   # 显示 GitHub Pages 部署说明
 *   node scripts/deploy.js all     # 依次部署到两个平台
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const platform = process.argv[2] || 'vercel';

function log(message, color = 'green') {
  const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
  };
  console.log(`\n${colors[color] || colors.reset}${'='.repeat(44)}`);
  console.log(`  ${message}`);
  console.log(`${'='.repeat(44)}${colors.reset}\n`);
}

function exec(command, options = {}) {
  try {
    execSync(command, {
      stdio: 'inherit',
      shell: true,
      ...options,
    });
    return true;
  } catch (error) {
    return false;
  }
}

function copyVercelConfig() {
  const deployDir = path.join(__dirname, '..', '.deploy', 'vercel');

  if (!fs.existsSync('vercel.json')) {
    console.log('复制 vercel.json...');
    fs.copyFileSync(path.join(deployDir, 'vercel.json'), 'vercel.json');
  }

  if (!fs.existsSync('api')) {
    console.log('复制 api/ 目录...');
    fs.mkdirSync('api', { recursive: true });
    const apiFiles = fs.readdirSync(path.join(deployDir, 'api'));
    for (const file of apiFiles) {
      fs.copyFileSync(path.join(deployDir, 'api', file), path.join('api', file));
    }
  }
}

function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe', shell: true });
    return true;
  } catch {
    return false;
  }
}

switch (platform) {
  case 'vercel':
    log('部署到 Vercel (play + serverless API)', 'cyan');

    if (!checkVercelCLI()) {
      console.error('错误: 未安装 Vercel CLI');
      console.error('请运行: npm i -g vercel');
      process.exit(1);
    }

    console.log('1. 检查 Vercel 配置...');
    copyVercelConfig();

    console.log('2. 执行 Vercel 部署...\n');
    exec('vercel --prod');

    console.log('\n部署完成！');
    console.log('- 演示站: https://<your-project>.vercel.app');
    console.log('- API: https://<your-project>.vercel.app/api');
    break;

  case 'github':
    log('GitHub Pages 部署说明', 'cyan');

    console.log('GitHub Pages 部署由 GitHub Actions 自动处理。\n');
    console.log('触发条件：');
    console.log('  - push 到 main 分支且修改了 docs/ 目录');
    console.log('  - 或手动触发 workflow_dispatch\n');
    console.log('部署配置位于: .github/workflows/pages.yml\n');
    console.log('要部署 docs 到 GitHub Pages:');
    console.log('  1. 确保 GitHub 仓库已启用 GitHub Pages');
    console.log('  2. 设置 Source 为 "GitHub Actions"');
    console.log('  3. 推送代码到 main 分支\n');
    console.log('  文档地址: https://<org>.github.io/<repo>/');
    break;

  case 'all':
    log('部署到所有平台', 'cyan');

    console.log('>> 部署 Vercel...\n');
    require.main === module && (require.main.filename = __filename);
    const deployVercel = () => require(__filename);
    exec(`node "${__filename}" vercel`);

    console.log('\n>> GitHub Pages...');
    exec(`node "${__filename}" github`);

    log('所有平台部署完成！', 'green');
    break;

  default:
    console.error(`错误: 未知平台 '${platform}'\n`);
    console.log('支持的平台:');
    console.log('  vercel  - Vercel (play + serverless API)');
    console.log('  github  - GitHub Pages (docs)');
    console.log('  all     - 部署到所有平台\n');
    console.log('用法: node scripts/deploy.js [platform]');
    process.exit(1);
}
