export interface ContentTextProps {
  /**
   * 显示的文本内容（普通文本）
   */
  content?: string
  /**
   * 直接传入 JSON 对象（优先级高于 content）
   */
  data?: Record<string, any> | any[]
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
  /**
   * JSON 是否默认展开（当内容为 JSON 时）
   * @default false
   */
  jsonDefaultExpanded?: boolean
  /**
   * JSON 缩进空格数
   * @default 2
   */
  jsonIndent?: number
  /**
   * JSON 默认折叠深度
   * @default 1
   */
  jsonDefaultCollapsedDepth?: number
  /**
   * 超过多少字符自动折叠（0 表示不折叠）
   * @default 20
   */
  jsonCollapsedNodeLength?: number
}