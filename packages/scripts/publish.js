import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkgPath = path.join(__dirname, '..', 'package.json')

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
const version = pkg.version
const name = pkg.name

console.log(`Publishing ${name}@${version}...`)

try {
  execSync(
    `pnpm publish --no-git-checks --access public`,
    {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    }
  )
  console.log(`Successfully published ${name}@${version}`)
} catch (error) {
  if (error.status === 409) {
    console.error(`Package ${name}@${version} already exists in the registry.`)
    console.error(`If you need to republish, remove the existing package first or use a different version.`)
  }
  process.exit(1)
}
