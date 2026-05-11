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

/**
 * <HxIcon> 主组件 Props。
 *
 * 根据 `type` 将 Props 按类型转发到对应子组件（SvgIcon / ImageIcon / IconifyIcon）。
 *
 * ⚠️ 类型提示：
 * - `type="svg"`    时生效的 Props：`name`, `size`, `color`, `mode`, `rotate`, `flip`
 * - `type="image"`  时生效的 Props：`name`, `size`, `group`, `className`, `alt`, `src`, `cdnBaseUrl`, `baseUrl`, `ext`, `source`
 * - `type="iconify"`时生效的 Props：`name`, `size`, `color`, `inline`, `className`
 * - 跨类型传递无效 Props 不会报 TS 错误（运行时被忽略）。
 */
export interface IconProps {
  /** 图标类型，决定使用哪种渲染方式 */
  type?: IconType
  /**
   * 图标名称
   * - svg:    对应 SVG symbol id（不带 `#icon-` 前缀）
   * - image:  文件名（不含后缀）
   * - iconify: Iconify 格式 `collection:name`（如 `ep:user`）
   */
  name: string
  /** 图标尺寸（支持数字 px 或 CSS 单位字符串，如 '2em'） */
  size?: string | number
  /** 图标颜色（svg mono 模式 / iconify 下生效） */
  color?: string
  /**
   * SVG 图标模式（仅 type='svg' 时有效）
   * - 'mono':  单色，使用 currentColor 填充
   * - 'multi': 多色，保留 symbol 内原始填充色
   * @default 'mono'
   */
  mode?: SvgIconMode
  /** 图标分类组（仅 type='image' 时有效），对应 @/assets/icons/{group}/ 下的子目录名 */
  group?: IconGroup
  /** 是否行内渲染（仅 type='iconify' 时有效） */
  inline?: boolean
  /** 旋转角度（仅 type='svg' 时有效） */
  rotate?: number
  /** 翻转方向（仅 type='svg' 时有效） */
  flip?: FlipDirection
  /** 自定义样式类名（image / iconify 专属） */
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
