/**
 * VitePress 构建后处理脚本
 * 为 GitHub Pages SPA 路由生成 404.html fallback
 */
import { copyFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '../.vitepress/dist')
const indexPath = resolve(distDir, 'index.html')
const notFoundPath = resolve(distDir, '404.html')

if (existsSync(indexPath)) {
	copyFileSync(indexPath, notFoundPath)
	console.log('Generated 404.html for SPA routing')
}
