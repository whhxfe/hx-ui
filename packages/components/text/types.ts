import type { ComponentSize } from 'element-plus'

export interface HxTextProps {
  /** 文本类型 */
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger' | ''
  /** 文本尺寸，继承 form-size */
  size?: ComponentSize
  /** 溢出时显示省略号 */
  truncated?: boolean
  /** 最大行数，超出显示省略号 */
  lineClamp?: number | string
  /** 自定义标签，默认为 span */
  tag?: string
}