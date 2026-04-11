// ========== 公共枚举/类型 ==========

/** 三种渲染方式 */
export type IconType = 'svg' | 'image' | 'iconify'

/** SVG 图标模式，决定 symbol 前缀和渲染样式 */
export type SvgIconMode = 'mono' | 'multi'

/** image / iconify 的分类组名（统一 group 概念） */
export type IconGroup = string

/** SVG 翻转方向 */
export type FlipDirection = 'horizontal' | 'vertical' | 'both'

// ========== SvgIcon Props ==========

export interface SvgIconProps {
  /** 图标名称，对应 SVG symbol 的 id */
  icon: string
  /** 图标模式：mono=单色使用 currentColor，multi=多色独立填充 */
  mode?: SvgIconMode
  /** 图标颜色（mono 模式下生效） */
  color?: string
  /** 图标尺寸 */
  size?: number | string
  /** 旋转角度 */
  rotate?: number
  /** 翻转方向 */
  flip?: FlipDirection
}

// ========== ImageIcon Props ==========

export interface ImageIconProps {
  /** 图标名称（对应 @/assets/icons/{group}/{name}.{ext} 中的文件名） */
  name: string
  /** 图标尺寸 */
  size?: number | string
  /** 图标分类组，对应 @/assets/icons/{group}/ 下的子目录名 */
  group?: IconGroup
  /** 自定义样式类名 */
  className?: string
  /** 图标描述（无障碍） */
  alt?: string
  /** 直接指定图标地址（优先级最高） */
  src?: string
  /** CDN 基础地址 */
  cdnBaseUrl?: string
  /** 本地基础地址 */
  baseUrl?: string
  /** 文件后缀 */
  ext?: 'png' | 'webp' | 'svg' | 'jpg' | 'jpeg' | 'gif' | 'avif' | 'apng' | 'ico'
  /** 资源来源：'auto' | 'local' | 'cdn' */
  source?: 'auto' | 'local' | 'cdn'
}

// ========== IconifyIcon Props ==========

export interface IconifyIconProps {
  /**
   * 图标名称，Iconify 格式 `collection:name`（如 `ep:user`、`mdi:heart`）。
   * 使用 `@iconify/vue/offline` + 本地 `@iconify-json/*` 数据渲染，不请求 CDN；未内置的集合需自行 `addCollection`。
   */
  icon: string
  /** 图标尺寸 */
  size?: number | string
  /** 图标颜色 */
  color?: string
  /** 是否行内渲染 */
  inline?: boolean
  /** 自定义样式类名 */
  className?: string
}

// ========== 主组件 Icon Props ==========

export interface IconProps {
  /** 图标类型 */
  type?: IconType
  /** 图标名称 */
  name: string
  /** 图标尺寸 */
  size?: string | number
  /** 图标颜色（mono svg / iconify 下生效） */
  color?: string
  /** 分类组：
   * - svg: 'mono' | 'multi'，决定 symbol 前缀（默认 'mono'）
   * - image: 子目录名（默认检测到的第一个目录）
   */
  group?: IconGroup
  /** 是否行内渲染（iconify 专属） */
  inline?: boolean
  /** 旋转角度（svg 专属） */
  rotate?: number
  /** 翻转方向（svg 专属） */
  flip?: FlipDirection
  /** 自定义样式类名（image 专属） */
  className?: string
  /** 图标描述（image 专属，无障碍） */
  alt?: string
  /** 直接指定图标地址（image 专属，优先级最高） */
  src?: string
  /** CDN 基础地址（image 专属） */
  cdnBaseUrl?: string
  /** 本地基础地址（image 专属） */
  baseUrl?: string
  /** 文件后缀（image 专属） */
  ext?: 'png' | 'webp' | 'svg' | 'jpg' | 'jpeg' | 'gif' | 'avif' | 'apng' | 'ico'
  /** 资源来源（image 专属）：'auto' | 'local' | 'cdn' */
  source?: 'auto' | 'local' | 'cdn'

  // ===== 兼容旧命名 =====
  /** @deprecated 请使用 group */
  imageType?: IconGroup
}
