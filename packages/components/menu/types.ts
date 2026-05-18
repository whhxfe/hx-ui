import type { CSSProperties } from 'vue'
import type { IconProps } from '../icon/types'

export interface MenuIconProps extends Pick<IconProps, 'type' | 'name' | 'size' | 'color' | 'rotate' | 'flip'> {}

export type MenuItemType = 'item' | 'sub' | 'group'

export interface MenuItem {
  /** 菜单项类型：item=普通项，sub=可展开子菜单，group=分组 */
  type?: MenuItemType
  /** 菜单标题（group 分组时对应 el-menu-item-group 的 title） */
  title: string
  /** 路由路径（item 类型必填，作为菜单唯一标识） */
  path?: string
  /** 外部链接地址，点击后在新窗口打开（优先级高于 path） */
  url?: string
  /** 图标配置 */
  icon?: MenuIconProps
  /** 子菜单 */
  children?: MenuItem[]
  /** 是否禁用 */
  disabled?: boolean
  /** 徽章文本 */
  badge?: string | number
  /** 分割线 */
  divider?: boolean
}

export interface MenuProps {
  /** 菜单数据 */
  menu?: MenuItem[]
  /** 布局模式 */
  mode?: 'horizontal' | 'vertical'
  /** 当前激活的菜单项 index */
  active?: string
  /** 初始展开的 SubMenu index 数组 */
  defaultOpeneds?: string[]
  /** 展开的 SubMenu index 数组（v-model） */
  openeds?: string[]
  /** 是否只保持展开一个子菜单 */
  uniqueOpened?: boolean
  /** 是否启用 ElMenu 的 router 模式（需已安装 vue-router） */
  router?: boolean
  /** 子菜单触发方式 */
  menuTrigger?: 'hover' | 'click'
  /** 是否折叠（vertical 模式生效） */
  collapse?: boolean
  /** 菜单背景色（CSS color） */
  backgroundColor?: string
  /** 菜单文字色 */
  textColor?: string
  /** 激活菜单项文字色 */
  activeTextColor?: string
  /** 点击菜单外是否关闭 */
  closeOnClickOutside?: boolean
  /** 折叠时是否有动画 */
  collapseTransition?: boolean
  /** 是否显示横向菜单的省略图标 */
  ellipsis?: boolean
  /** popper offset */
  popperOffset?: number
  /** popper 效果 */
  popperEffect?: 'dark' | 'light'
  /** popper 额外 class */
  popperClass?: string
  /** popper 额外样式 */
  popperStyle?: Record<string, string>
  /** 子菜单展开延迟（ms） */
  showTimeout?: number
  /** 子菜单收起延迟（ms） */
  hideTimeout?: number
  /** 是否持久化 popper 内容 */
  persistent?: boolean
  /**
   * 垂直模式下的菜单宽度；未设置时由外层容器决定（建议 `width: 100%` 填满父级）
   * 横向模式一般无需设置
   */
  width?: string | number
  /**
   * 图标占位区宽度（px），写入 `--hx-menu-icon-slot-width`，折叠弹出层同步
   */
  iconWidth?: string | number
}
