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

export interface IconifyIconConfig {
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
	/** 基础 URL（域名部分），如 'https://api.example.com' */
	baseUrl?: string
	/** 请求路径前缀，如 '/api/v1'，会拼接到所有请求 URL 前面 */
	prefix?: string
}

/** 组件通用默认值 */
export type ComponentDefaults = Record<string, Record<string, unknown>>

/** 二维码配置 */
export interface QrCodeConfig {
  /** 默认渲染模式，默认 'svg' */
  renderMode?: 'svg' | 'canvas'
  /** 默认尺寸，默认 120 */
  size?: string | number
  /** 默认前景色，默认 #000000 */
  colorDark?: string
  /** 默认背景色，默认 #ffffff */
  colorLight?: string
  /** 默认纠错等级，默认 'M' */
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  /** 默认边距，默认 2 */
  margin?: number
}

/** 地图全局配置 */
export interface MapConfig {
  /** 标准地图瓦片 URL */
  normalUrl?: string
  /** 卫星地图瓦片 URL */
  satelliteUrl?: string
  /** 默认中心点 */
  center?: { lon: number; lat: number }
  /** 默认缩放级别 */
  zoom?: number
  /** 最大缩放级别 */
  maxZoom?: number
  /** 最小缩放级别 */
  minZoom?: number
}

/** Form 组件全局配置 */
export interface FormConfig {
  /** 默认栅格列数 */
  cols?: number
  /** 默认间距（px）*/
  gap?: number
  /** 默认最小列宽（px）*/
  minColWidth?: number
}

/** 二维码 Provider Props */
export interface QrCodeProviderProps {
  /** 二维码组件全局配置 */
  qrCode?: QrCodeConfig
}

/** 地图 Provider Props */
export interface MapProviderProps {
  /** 地图组件全局配置 */
  map?: MapConfig
}

export interface HxConfigProviderProps {
  /** Icon 组件全局配置 */
  icon?: IconConfig
  /** Request 工具全局配置 */
  request?: RequestProviderProps
  /** 组件通用默认值 */
  componentDefaults?: ComponentDefaults
  /** 二维码组件全局配置 */
  qrCode?: QrCodeConfig
  /** 地图组件全局配置 */
  map?: MapConfig
  /** Form 组件全局配置 */
  form?: FormConfig

  // ========== 顶层快捷配置（优先级高于 icon 对象）==========

  /** SVG symbol 前缀，默认 'icon' */
  iconSymbolPrefix?: string
  /** Iconify 图标源模式：'offline'（默认） | 'cdn' */
  iconifySource?: 'offline' | 'cdn'
  /** Iconify CDN 服务地址（当 iconifySource 为 'cdn' 时使用） */
  iconifyCdnUrl?: string
}

export interface HxConfig {
  svgIcon: SvgIconConfig
  imageIcon: ImageIconConfig
  iconifyIcon: IconifyIconConfig
  request?: RequestProviderProps
  /** 组件通用默认值 */
  componentDefaults?: ComponentDefaults
  /** 二维码全局配置 */
  qrCode?: QrCodeConfig
  /** 地图全局配置 */
  map?: MapConfig
  /** Form 组件全局配置 */
  form?: FormConfig
}
