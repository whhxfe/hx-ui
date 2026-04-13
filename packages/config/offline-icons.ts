import { addCollection } from '@iconify/vue/offline'
import type { IconifyJSON } from '@iconify/types'
import type { IconifyCollectionName } from './types'

export type { IconifyCollectionName } from './types'

// 静态导入预定义图标集
import epIcons from '@iconify/json/json/ep.json'
import mdiIcons from '@iconify/json/json/mdi.json'
import logosIcons from '@iconify/json/json/logos.json'
import twemojiIcons from '@iconify/json/json/twemoji.json'
import biIcons from '@iconify/json/json/bi.json'
import lucideIcons from '@iconify/json/json/lucide.json'
import carbonIcons from '@iconify/json/json/carbon.json'
import tablerIcons from '@iconify/json/json/tabler.json'
import streamlineLogosIcons from '@iconify/json/json/streamline-logos.json'

const ALL_OFFLINE_COLLECTIONS: Record<string, IconifyJSON> = /* @__PURE__ */ {
  ep: epIcons as IconifyJSON,
  mdi: mdiIcons as IconifyJSON,
  logos: logosIcons as IconifyJSON,
  twemoji: twemojiIcons as IconifyJSON,
  bi: biIcons as IconifyJSON,
  lucide: lucideIcons as IconifyJSON,
  carbon: carbonIcons as IconifyJSON,
  tabler: tablerIcons as IconifyJSON,
  'streamline-logos': streamlineLogosIcons as IconifyJSON,
}

/**
 * 根据名称注册离线图标集
 */
export function registerOfflineCollection(name: string): void {
  if (name in ALL_OFFLINE_COLLECTIONS) {
    addCollection(ALL_OFFLINE_COLLECTIONS[name])
  }
}

/**
 * 注册多个离线图标集
 */
export function registerOfflineCollections(names: IconifyCollectionName[]): void {
  for (const name of names) {
    registerOfflineCollection(name)
  }
}
