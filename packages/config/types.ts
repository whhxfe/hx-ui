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

// 内置支持的离线图标集名称
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

// ========== Full App Config ==========

export interface HxConfig {
  svgIcon: SvgIconConfig
  imageIcon: ImageIconConfig
  iconifyIcon: IconifyIconConfig
}

export interface IconifyProps {
  /**
   * 图标源模式：
   * - 'offline'：使用离线图标集（默认），需配合 collections 配置
   * - 'cdn'：使用 CDN 服务，按需加载图标
   */
  source?: 'offline' | 'cdn'
  /** CDN 服务地址（当 source 为 'cdn' 时使用） */
  cdnUrl?: string
  /**
   * 离线图标集配置（当 source 为 'offline' 时使用）
   * 传入图标集名称数组，如 ['ep', 'mdi']，会自动加载对应的 JSON 数据
   */
  collections?: string[]
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

export interface IconConfig {
  svg?: SvgProps
  image?: ImageProps
  iconify?: IconifyProps
}

export interface HxConfigProviderProps {
  /** Icon 组件全局配置 */
  icon?: IconConfig
}