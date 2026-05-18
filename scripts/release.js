import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const pkgPath = path.join(rootDir, 'packages', 'package.json')

const args = process.argv.slice(2)
const isDryRun = args.includes('--dry')
const bumpType = args.find((a) => ['major', 'minor', 'patch'].includes(a)) || 'patch'

function getVersion() {
  return JSON.parse(fs.readFileSync(pkgPath, 'utf-8')).version
}

if (isDryRun) {
  console.log('[Dry Run Mode]')
  console.log(`Would execute: bump ${bumpType} -> build -> publish`)
  process.exit(0)
}

const readline = await import('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const answer = await new Promise((resolve) => {
  rl.question(`即将执行: pnpm release (${bumpType})\n确认发布吗？输入 "yes" 继续: `, resolve)
})
rl.close()

if (answer.trim().toLowerCase() !== 'yes') {
  console.log('已取消')
  process.exit(0)
}

console.log('')
console.log('开始发布流程...')
console.log('')

// 步骤 1: 更新版本
console.log('[1/3] 更新版本')
execSync(`pnpm run version:pkg`, { stdio: 'inherit', cwd: rootDir })
const newVersion = getVersion()
console.log(`版本已更新为: ${newVersion}`)
console.log('')

// 步骤 2: 构建
console.log('[2/3] 构建包')
execSync(`pnpm run build:ui:pkg`, { stdio: 'inherit', cwd: rootDir })
console.log('')

// 步骤 3: 发布
console.log('[3/3] 发布到私有 registry')
try {
  execSync(`pnpm run publish:ui`, { stdio: 'inherit', cwd: rootDir })
} catch (error) {
  console.error('')
  console.error('发布失败！')
  console.error(`请手动检查: npm view @hx/ui --registry http://localhost:4873`)
  process.exit(1)
}

console.log('')
console.log('='.repeat(50))
console.log(`发布成功: @hx/ui@${newVersion}`)
console.log('='.repeat(50))
