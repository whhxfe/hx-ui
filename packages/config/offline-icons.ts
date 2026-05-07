import { addCollection } from '@iconify/vue/offline'
import type { IconifyJSON } from '@iconify/types'

// 使用 import.meta.glob 扫描 @iconify-json 图标集目录下的所有 JSON 文件
// 键名格式为完整相对路径，如 "../node_modules/@iconify/json/json/bi.json"
const iconJsonModules = import.meta.glob('@iconify-json/*.json', {
  eager: false,
  import: 'default',
})

// 已加载过的图标集缓存，避免重复加载
const loadedCollections = new Set<string>()

/**
 * 从图标名称中提取图标集前缀
 * 例如: "ep:user" -> "ep", "mdi:home" -> "mdi"
 */
export function extractCollectionName(icon: string): string {
  const colonIndex = icon.indexOf(':')
  return colonIndex > 0 ? icon.slice(0, colonIndex) : ''
}

/**
 * 根据名称懒加载并注册离线图标集（异步）
 * 使用 import.meta.glob 实现动态加载，Vite 会自动处理代码分割
 */
export async function registerOfflineCollection(name: string): Promise<void> {
  if (loadedCollections.has(name)) return

  // 从 glob 结果中找到匹配的 loader
  // 键名格式为完整相对路径，需要查找包含 "/{name}.json" 的键
  const key = Object.keys(iconJsonModules).find(k => k.endsWith(`/${name}.json`))
  const loader = key ? iconJsonModules[key] : undefined

  if (!loader) return

  try {
    const iconData = (await loader()) as IconifyJSON
    loadedCollections.add(name)
    addCollection(iconData)
  } catch {
    // 图标集不存在时静默失败，避免阻塞应用
  }
}

/**
 * 根据图标名称动态注册其所属的图标集
 * @param icon 图标名称，格式为 "collection:name"（如 "ep:user"）
 */
export async function registerIconCollection(icon: string): Promise<void> {
  const collection = extractCollectionName(icon)
  if (collection) {
    await registerOfflineCollection(collection)
  }
}

/**
 * 批量注册多个离线图标集（异步）
 */
export async function registerOfflineCollections(names: string[]): Promise<void> {
  await Promise.all(names.map(name => registerOfflineCollection(name)))
}
