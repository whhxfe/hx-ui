import { addCollection } from '@iconify/vue/offline'

// 已加载的图标集缓存（按 prefix 去重）
const loadedPrefixes = new Set<string>()

// 用户注册的懒加载器映射（prefix -> loader）
const loaders: Record<string, () => Promise<any>> = {}

/**
 * 注册图标集（支持同步或懒加载）
 *
 * @example 同步加载
 * import mingcuteData from '@iconify/json/json/mingcute.json'
 * addIconSet(mingcuteData)
 *
 * @example 懒加载（推荐，按需加载减小主包体积）
 * addIconSet(() => import('@iconify/json/json/mingcute.json'))
 *
 * @example 批量注册
 * addIconSet([
 *   () => import('@iconify/json/json/ep.json'),
 *   () => import('@iconify/json/json/mdi.json'),
 * ])
 */
export function addIconSet(
  source: any | (() => Promise<any>) | (any | (() => Promise<any>))[]
): void | Promise<void> {
  // 批量模式
  if (Array.isArray(source)) {
    return Promise.all(source.map((s) => addIconSet(s) as Promise<void>)) as any
  }

  // 同步模式
  if (!isLoader(source)) {
    return registerData(source)
  }

  // 懒加载模式：先获取 prefix，再注册
  return source().then((data) => {
    if (data?.prefix) {
      loaders[data.prefix] = source
    }
    registerData(data)
  })
}

function isLoader(fn: any): fn is () => Promise<any> {
  return typeof fn === 'function'
}

function registerData(data: any): void {
  if (!data?.prefix || loadedPrefixes.has(data.prefix)) return
  loadedPrefixes.add(data.prefix)
  addCollection(data)
}

/**
 * 从图标名称中提取图标集前缀
 * 例如: "ep:user" -> "ep", "mdi:home" -> "mdi"
 */
export function extractCollectionName(icon: string): string {
  const colonIndex = icon.indexOf(':')
  return colonIndex > 0 ? icon.slice(0, colonIndex) : ''
}

/**
 * 注册图标所属的图标集（根据图标名称自动查找并加载）
 * 供图标组件内部使用
 */
export async function registerIconCollection(icon: string): Promise<void> {
  const prefix = extractCollectionName(icon)
  if (!prefix || loadedPrefixes.has(prefix)) return

  const loader = loaders[prefix]
  if (loader) {
    await loader()
  }
}
