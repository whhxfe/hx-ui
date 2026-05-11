import { addCollection } from '@iconify/vue/offline'

// 内置硬编码的图标集加载器
// 使用时按需添加，减少打包体积
const _builtinLoaders: Record<string, () => Promise<any>> = {
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

// 合并用户自定义图标集（运行时注册，优先级高于内置）
const customLoaders: Record<string, () => Promise<any>> = {}

/** 合并后的查询表：内置 + 自定义 */
function getLoader(name: string): (() => Promise<any>) | undefined {
  return customLoaders[name] ?? _builtinLoaders[name]
}

/**
 * 允许消费者在运行时注册自定义图标集加载器，
 * 无需修改库源码即可扩展离线图标支持。
 *
 * @example
 * ```ts
 * registerCollectionLoader('fa6-solid', () => import('@iconify/json/json/fa6-solid.json'))
 * ```
 */
export function registerCollectionLoader(
  name: string,
  loader: () => Promise<any>,
): void {
  customLoaders[name] = loader
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

  const loader = getLoader(name)
  if (!loader) return

  try {
    const iconData = await loader()
    loadedCollections.add(name)
    addCollection(iconData)
  } catch (e) {
    // 图标集加载失败时给出控制台提示，便于开发者排查
    console.warn(`[hx-ui] Failed to load offline icon collection "${name}":`, (e as Error)?.message ?? e)
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
