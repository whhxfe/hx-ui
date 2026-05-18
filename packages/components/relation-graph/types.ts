/**
 * 人物关系图组件类型定义
 */

/** 账号类型 */
export type AccountType = 'phone' | 'qq' | 'weixin' | 'douyin' | 'email' | 'other'

/** 节点样式配置 */
export interface RelationNodeStyle {
  /** 节点大小 */
  size?: number
  /** 头像/图标 URL */
  img?: string
  /** 边框颜色 */
  stroke?: string
}

/** 边样式配置 */
export interface RelationEdgeData {
  /** 边的颜色 */
  stroke?: string
  /** 关系标签 */
  label?: string
  /** 扩展字段 */
  [key: string]: unknown
}

/** 虚拟账号 */
export interface ContactAccount {
  /** 账号类型 */
  type: AccountType
  /** 账号值 */
  value: string
}

/** 人物节点 */
export interface RelationNode {
  /** 节点唯一标识 */
  id: string
  /** 姓名 */
  name: string
  /** 头像 URL */
  avatar?: string
  /** 职位/角色 */
  role?: string
  /** 节点样式配置 */
  style?: RelationNodeStyle
  /** 性别（用于默认头像） */
  gender?: 'male' | 'female' | 'unknown'
  /** 关联的虚拟账号列表 */
  contactAccounts?: ContactAccount[]
  /** 节点类型 */
  nodeType?: 'person' | 'account'
  /** 扩展字段 */
  [key: string]: unknown
}

/** 关系边 */
export interface RelationEdge {
  /** 源节点 ID */
  source: string
  /** 目标节点 ID */
  target: string
  /** 关系标签 */
  label?: string
  /** 边数据配置（包含样式） */
  data?: RelationEdgeData
  /** 扩展字段 */
  [key: string]: unknown
}

/** 默认图标配置 */
export interface RelationGraphIconConfig {
  /** 图标类型 */
  type: 'svg' | 'iconify'
  /** SVG symbol id（type 为 svg 时使用） */
  svg?: string
  /** iconify 图标名（type 为 iconify 时使用，如 'mdi:account'） */
  icon?: string
}

/** 布局类型 */
export type RelationGraphLayoutType = 'force' | 'radial'

/** 组件 Props */
export interface RelationGraphProps {
  /** 人物节点列表 */
  nodes: RelationNode[]
  /** 关系边列表 */
  edges: RelationEdge[]
  /** 默认图标配置 */
  defaultIcon?: RelationGraphIconConfig
  /** 画布宽度 */
  width?: number | string
  /** 画布高度 */
  height?: number | string
  /** 是否显示搜索框 */
  showSearch?: boolean
  /** 是否启用节点右键菜单 */
  nodeMenu?: boolean
  /** 是否显示小地图 */
  showMinimap?: boolean
  /** 布局类型 */
  layoutType?: RelationGraphLayoutType
  /** 径向布局每层半径（layoutType 为 radial 时有效） */
  unitRadius?: number
  /** 边长度 */
  linkDistance?: number
  /** 节点默认大小 */
  nodeSize?: number
  /** 是否启用折叠展开功能 */
  collapsible?: boolean
}

/** 节点点击事件参数 */
export interface RelationNodeClickEvent {
  node: RelationNode
  x: number
  y: number
}
