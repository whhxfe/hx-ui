import type { LinkProps } from 'element-plus'

export interface HxLinkProps extends LinkProps {
  /** 点击后是否自动跳转，默认 true */
  autoJump?: boolean
}
