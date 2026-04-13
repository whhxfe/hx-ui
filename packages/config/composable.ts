import { inject, type InjectionKey } from 'vue'
import type { HxConfig, ImageIconSourceItem, IconifyIconConfig } from './types'

/** App-wide injection key */
export const HxConfigKey: InjectionKey<HxConfig> = Symbol('hx-config')

/**
 * 在组件内调用，读取最近的 HxConfigProvider 注入的配置。
 * 若无 Provider 则返回默认值。
 */
export function useConfig(): HxConfig {
  const config = inject(HxConfigKey, getDefaultConfig())
  return config
}

// ---------- image icon helpers ----------

/**
 * 注册单张图片
 */
export function registerImageIcon(
  map: Record<string, Record<string, ImageIconSourceItem>>,
  group: string,
  name: string,
  item: ImageIconSourceItem
): void {
  const g = group.toLowerCase()
  const n = name.toLowerCase()
  if (!map[g]) map[g] = {}
  const bucket = map[g]
  const current = bucket[n]
  if (!current) {
    bucket[n] = item
  } else {
    // 优先级：webp/avif > apng > png > gif > jpg > 其他（相同优先级时新资源覆盖旧资源）
    const PRIORITY = ['webp', 'avif', 'apng', 'png', 'gif', 'jpg', 'jpeg', 'ico', 'svg']
    const currRank = PRIORITY.indexOf(current.ext.toLowerCase())
    const itemRank = PRIORITY.indexOf(item.ext.toLowerCase())
    if (itemRank !== -1 && (currRank === -1 || itemRank < currRank)) {
      bucket[n] = item
    }
  }
}

/**
 * 根据 glob modules 构建 sourceMap（保持向后兼容）。
 *
 * @param modulesList - import.meta.glob 的结果数组
 * @returns sourceMap
 */
export function buildImageSourceMap(
  modulesList: Record<string, { default: string }>[]
): Record<string, Record<string, ImageIconSourceItem>> {
  const map: Record<string, Record<string, ImageIconSourceItem>> = {}

  for (const modules of modulesList) {
    for (const [rawPath, module] of Object.entries(modules)) {
      const match = rawPath.match(
        /(?:[/\\]assets[/\\]icons|[/\\]icons)[/\\]([^/\\]+)[/\\]([^/\\.]+)\.(png|webp|svg|jpg|jpeg|gif|avif|apng|ico)$/i
      )
      if (!match) continue

      const group = match[1].toLowerCase()
      const name = match[2].toLowerCase()
      const ext = match[3].toLowerCase() as 'png' | 'webp' | 'svg' | 'jpg' | 'jpeg' | 'gif' | 'avif' | 'apng' | 'ico'

      registerImageIcon(map, group, name, { url: module.default, ext })
    }
  }

  return map
}

// ---------- default config ----------

function getDefaultConfig(): HxConfig {
  return {
    svgIcon: {
      symbolPrefix: 'icon',
    },
    imageIcon: {
      cdnBaseUrl: '',
      source: 'auto',
      sourceMap: {},
      groups: [],
      defaultGroup: 'title',
    },
    iconifyIcon: {
      source: { source: 'offline', cdnUrl: undefined },
      offlineCollections: [],
    },
  }
}
