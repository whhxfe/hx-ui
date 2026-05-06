import { addCollection } from '@iconify/vue/offline'
import type { IconifyJSON } from '@iconify/types'
import type { IconifyCollectionName } from './types'

export type { IconifyCollectionName } from './types'

// 图标集懒加载映射表：只在需要时才动态导入对应 JSON
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
const loadedCollections = new Map<string, IconifyJSON>()

/**
 * 根据名称懒加载并注册离线图标集（异步）
 */
export async function registerOfflineCollection(name: string): Promise<void> {
  if (loadedCollections.has(name)) return

  const loader = collectionLoaders[name]
  if (!loader) return

  const mod = await loader()
  const iconData = mod.default ?? mod
  loadedCollections.set(name, iconData as IconifyJSON)
  addCollection(iconData as IconifyJSON)
}

/**
 * 批量注册多个离线图标集（异步）
 */
export async function registerOfflineCollections(names: IconifyCollectionName[]): Promise<void> {
  await Promise.all(names.map(name => registerOfflineCollection(name)))
}
