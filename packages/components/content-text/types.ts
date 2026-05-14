export interface ContentTextProps {
  /**
   * 显示的文本内容
   */
  content?: string
  /**
   * 行数限制，0 表示不限制
   * @default 0
   */
  line?: number
  /**
   * 是否可以复制，hover 后显示复制按钮
   * @default true
   */
  copyable?: boolean
  /**
   * 内容为空时显示的占位文本
   * @default ''
   */
  placeholder?: string
  /**
   * 最大行数，超出后截断并显示省略（仅在 line > 0 时生效）
   * @default 0
   */
  maxHeight?: number | string
}
