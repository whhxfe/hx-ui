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

// ========== Full App Config ==========

export interface HxConfig {
  imageIcon: ImageIconConfig
}

export interface HxConfigProviderProps {
  /**
   * Icon 组件全局配置。
   * 简化：传入 import.meta.glob 的结果，格式为 Record<string, { default: string }>
   */
  icon?: {
    /** 图片图标资源 glob 模块列表 */
    imageIconModules?: Record<string, { default: string }>[]
    /** 图片图标 CDN 基础地址，props 传入的 cdnBaseUrl 优先级高于此值 */
    cdnBaseUrl?: string
    /** 资源来源模式：'auto' | 'local' | 'cdn' */
    source?: 'auto' | 'local' | 'cdn'
  }
}
