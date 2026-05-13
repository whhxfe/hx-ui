import type { LinkProps } from 'element-plus'

/**
 * HxLink 组件 Props
 * 继承 Element Plus 的 LinkProps，扩展 autoJump 属性
 */
export interface HxLinkProps extends LinkProps {
  /**
   * 点击后是否自动跳转
   * @default true
   * 设为 false 时，即使有 href 也不会自动导航，仅触发 click 事件
   */
  autoJump?: boolean
}
