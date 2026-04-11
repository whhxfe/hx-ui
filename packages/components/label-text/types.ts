export interface LabelTextProps {
  /** 标签文本 */
  label: string
  /** 展示文本（默认插槽优先） */
  text?: string
  /** 尺寸 */
  size?: SizeType
  /** Flex 交叉轴对齐方式（align-items） */
  align?: AlignType
  /** 标签宽度（如 'auto', '100px', '50%', 100 等） */
  labelWidth?: string | number
  /** 标签水平对齐方式（当指定 labelWidth 时生效） */
  labelAlign?: LabelAlignType
  /** 标签是否换行 */
  labelWrap?: boolean
  /** 文本是否换行（textLine=0 时生效） */
  textWrap?: boolean
  /** 文本显示行数（0=不限制，>0=指定行数截断） */
  textLine?: number
  /** 是否显示冒号 */
  colon?: boolean
}

export type SizeType = 'small' | 'default' | 'large'

export type LabelAlignType = 'left' | 'center' | 'right'

export type AlignType = 'start' | 'center' | 'end' | 'stretch' | 'baseline'

export const SIZE_LIST = ['small', 'default', 'large'] as const
export const ALIGN_LIST = ['start', 'center', 'end', 'stretch', 'baseline'] as const
export const LABEL_ALIGN_LIST = ['left', 'center', 'right'] as const
