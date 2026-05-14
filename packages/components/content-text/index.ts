import { withInstall } from '../../utils/install'
import _ContentText from './ContentText.vue'

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
   * 最大高度（px 或带单位字符串），超出后截断
   * @default 0
   */
  maxHeight?: number | string
}

export const HxContentText = withInstall(_ContentText, 'hx-content-text')
export default HxContentText