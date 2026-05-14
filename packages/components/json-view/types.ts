export interface JsonViewProps {
  /**
   * JSON 数据对象（优先级高于从字符串解析）
   */
  data?: Record<string, any> | any[]

  /**
   * JSON 字符串（当 data 未传入时尝试解析此字符串）
   */
  content?: string

  /**
   * JSON 是否默认展开
   * @default false
   */
  defaultExpanded?: boolean

  /**
   * JSON 缩进空格数
   * @default 2
   */
  indent?: number

  /**
   * 默认折叠深度
   * @default 1
   */
  defaultCollapsedDepth?: number

  /**
   * 超过多少字符自动折叠（0 表示不折叠）
   * @default 20
   */
  collapsedNodeLength?: number

  /**
   * 是否可以复制
   * @default true
   */
  copyable?: boolean
}