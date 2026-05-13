// ========== Image Icons ==========

export interface ImageIconSourceItem {
  url: string
  ext: 'png' | 'webp' | 'svg' | 'jpg' | 'jpeg' | 'gif' | 'avif' | 'apng' | 'ico'
}

export interface ImageIconConfig {
  /** CDN 基础地址 */
  cdnBaseUrl: string
  /**
   * 资源来源模式：
   * - 'auto'：优先 cdnBaseUrl，有配置就用；无配置则 fallback 到 sourceMap
   * - 'local'：仅使用本地 glob 资源（sourceMap）
   * - 'cdn'：仅使用 CDN 地址（需要 cdnBaseUrl 有配置）
   */
  source: 'auto' | 'local' | 'cdn'
  /** { group: { name: { url, ext } } } */
  sourceMap: Record<string, Record<string, ImageIconSourceItem>>
  /** 已注册的 group 列表（按字母排序） */
  groups: string[]
  /** 默认 group（取第一个） */
  defaultGroup: string
}

// ========== Iconify Icons ==========

export interface IconifyIconSourceConfig {
  /** 图标源模式：'offline' | 'cdn' */
  source: 'offline' | 'cdn'
  /** CDN 服务地址（当 source 为 'cdn' 时必填） */
  cdnUrl?: string
}

/** 内置支持的离线图标集名称 */
export type IconifyCollectionName = string

export interface IconifyIconConfig {
  /** 离线图标集名称列表 */
  offlineCollections?: string[]
  /** 图标源配置 */
  source: IconifyIconSourceConfig
}

// ========== SVG Icons ==========

export interface SvgIconConfig {
  /** SVG symbol 前缀 */
  symbolPrefix: string
}

export interface ImageProps {
  /** 图片图标资源 glob 模块列表 */
  imageIconModules?: Record<string, { default: string }>[]
  /** 图片图标 CDN 基础地址，props 传入的 cdnBaseUrl 优先级高于此值 */
  cdnBaseUrl?: string
  /** 资源来源模式：'auto' | 'local' | 'cdn' */
  source?: 'auto' | 'local' | 'cdn'
}

export interface SvgProps {
  /** SVG symbol 前缀，默认 'icon' */
  symbolPrefix?: string
}

export interface IconifyProps {
  /** 图标源模式：'offline'（默认） | 'cdn' */
  source?: 'offline' | 'cdn'
  /** CDN 服务地址（当 source 为 'cdn' 时使用） */
  cdnUrl?: string
  /** 离线图标集名称列表（当 source 为 'offline' 时使用） */
  collections?: string[]
}

export interface IconConfig {
  svg?: SvgProps
  image?: ImageProps
  iconify?: IconifyProps
}

/** Request Provider Props，与 utils/request.ts 中的 RequestOptions 对应 */
export interface RequestProviderProps {
  /** 全局默认请求头，会被请求级别的 headers 合并覆盖 */
  headers?: Record<string, string>
}

/** 组件通用默认值 */
export type ComponentDefaults = Record<string, Record<string, unknown>>

export interface HxConfigProviderProps {
  /** Icon 组件全局配置 */
  icon?: IconConfig
  /** Request 工具全局配置 */
  request?: RequestProviderProps
  /** 组件通用默认值 */
  componentDefaults?: ComponentDefaults
}

export interface HxConfig {
  svgIcon: SvgIconConfig
  imageIcon: ImageIconConfig
  iconifyIcon: IconifyIconConfig
  request?: RequestProviderProps
  /** 组件通用默认值 */
  componentDefaults?: ComponentDefaults
}
