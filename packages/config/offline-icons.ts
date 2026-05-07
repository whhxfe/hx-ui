import { addCollection } from '@iconify/vue/offline'

// 硬编码导入需要使用的图标集
// 使用时按需添加，减少打包体积
const collectionLoaders: Record<string, () => Promise<any>> = {
  ep: () => import('@iconify/json/json/ep.json'),
  mdi: () => import('@iconify/json/json/mdi.json'),
  logos: () => import('@iconify/json/json/logos.json'),
  twemoji: () => import('@iconify/json/json/twemoji.json'),
  bi: () => import('@iconify/json/json/bi.json'),
  lucide: () => import('@iconify/json/json/lucide.json'),
  carbon: () => import('@iconify/json/json/carbon.json'),
  tabler: () => import('@iconify/json/json/tabler.json'),
  'streamline-logos': () => import('@iconify/json/json/streamline-logos.json'),
}

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
 */
export async function registerOfflineCollection(name: string): Promise<void> {
  if (loadedCollections.has(name)) return

  const loader = collectionLoaders[name]
  if (!loader) return

  try {
    const iconData = await loader()
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
