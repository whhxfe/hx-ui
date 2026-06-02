import type { VNode } from 'vue'

/**
 * el-table-column 原生支持的 prop 名称列表
 * 用于 ColumnItem 中构造绑定属性，保持单一数据源
 */
export const COLUMN_DIRECT_PROPS = [
  'type',
  'columnKey',
  'index',
  'label',
  'prop',
  'width',
  'minWidth',
  'fixed',
  'render',
  'renderHeader',
  'sortable',
  'sortOrders',
  'sortMethod',
  'resizable',
  'showOverflowTooltip',
  'align',
  'headerAlign',
  'className',
  'labelClassName',
  'selectable',
  'reserveSelection',
  'filters',
  'filterMethod',
  'filteredValue',
  'tooltipEffect',
] as const

export type ColumnDirectProp = (typeof COLUMN_DIRECT_PROPS)[number]

/** 分页布局配置 */
export type PaginationLayout =
  | 'total'
  | 'sizes'
  | 'prev'
  | 'pager'
  | 'next'
  | 'jumper'
  | '->'
  | 'total, sizes, prev, pager, next, jumper'

export interface TableProps {
  /** 表格列配置 */
  columns?: TableColumn[]
  /** 表格数据源 */
  data?: any[]
  /** 是否显示分页 */
  showPagination?: boolean
  /** 当前页码（受控模式） */
  currentPage?: number
  /** 每页条数（受控模式） */
  pageSize?: number
  /** 每页条数选项 */
  pageSizes?: number[]
  /** 数据总条数（受控模式） */
  total?: number
  /** 分页组件布局 */
  paginationLayout?: string
  /** 是否启用前端分页 */
  frontPagination?: boolean
  /** 表格容器高度，支持 number（像素）或 string（如 '400px'，不含分页高度） */
  height?: number | string
  /** 表格最大高度，超出后可滚动 */
  maxHeight?: number | string
}

export interface TableColumn {
  // common el-table-column props
  type?: 'selection' | 'index' | 'expand'
  columnKey?: string
  index?: number | ((index: number) => number)
  prop?: string
  label?: string
  width?: number | string
  minWidth?: number | string
  fixed?: boolean | 'left' | 'right'
  /** 自定义渲染函数，与 `slot` 同时设置时 render 优先级更高 */
  render?: (row: any, index: number) => VNode
  renderHeader?: (data: { column: any; $index: number }) => VNode
  sortable?: boolean | 'custom'
  sortOrders?: ('ascending' | 'descending' | null)[]
  sortMethod?: (a: any, b: any) => number
  resizable?: boolean
  showOverflowTooltip?: boolean | { effect?: 'dark' | 'light' }
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  className?: string
  labelClassName?: string
  selectable?: (row: any, index: number) => boolean
  reserveSelection?: boolean
  filters?: { text: string; value: string }[]
  filterMethod?: (value: any, row: any, column: any) => boolean
  filteredValue?: any[]
  tooltipEffect?: 'dark' | 'light'

  // extended props
  /** 是否隐藏该列 */
  hidden?: boolean
  /** 自定义单元格插槽名，与 `render` 同时设置时 render 优先级更高 */
  slot?: string
  /** 自定义表头插槽名 */
  headerSlot?: string
  /** 自定义表头渲染函数 */
  headerRender?: (column: TableColumn, index: number) => VNode
  /** 多级表头子列 */
  children?: TableColumn[]
  /**
   * 额外透传给 el-table-column 的属性
   * 用于覆盖或补充未在 TableColumn 中显式声明的原生属性
   */
  columnProps?: Partial<Omit<TableColumn, 'children' | 'hidden' | 'columnProps' | 'slot' | 'headerSlot' | 'headerRender'>>
}
