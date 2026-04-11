import { withInstall } from '../../utils/install'
import _Icon from './base-icon/BaseIcon.vue'

export const HxIcon = withInstall(_Icon, 'HxIcon')

export { default as SvgIcon } from './svg-icon/SvgIcon.vue'
export { default as ImageIcon } from './image-icon/ImageIcon.vue'
export { default as IconifyIcon } from './iconify-icon/IconifyIcon.vue'

export type {
  IconType,
  SvgIconMode,
  IconGroup,
  FlipDirection,
  IconProps,
  SvgIconProps,
  ImageIconProps,
  IconifyIconProps,
} from './types'

export { default } from './base-icon/BaseIcon.vue'
