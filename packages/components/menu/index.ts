import { withInstall } from '../../utils/install'
import _Menu from './Menu.vue'

export const HxMenu = withInstall(_Menu, 'HxMenu')
export default HxMenu

export { default as HxMenuItem } from './MenuItem.vue'
export type { MenuItem, MenuIconProps, MenuItemType, MenuProps } from './types'
