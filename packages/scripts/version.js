import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkgPath = path.join(__dirname, '..', 'package.json')

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
const currentVersion = pkg.version

const arg = process.argv[2] || 'patch'

let newVersion
if (/^\d+\.\d+\.\d+$/.test(arg)) {
  // 直接指定版本号
  newVersion = arg
} else {
  // 使用语义化版本更新
  const [major, minor, patch] = currentVersion.split('.').map(Number)
  switch (arg) {
    case 'major':
      newVersion = `${major + 1}.0.0`
      break
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`
      break
    case 'patch':
      newVersion = `${major}.${minor}.${patch + 1}`
      break
    default:
      console.error(`Invalid bump type: ${arg}. Use: major, minor, patch, or x.y.z`)
      process.exit(1)
  }
}

pkg.version = newVersion
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

console.log(`Version updated: ${currentVersion} -> ${newVersion}`)
