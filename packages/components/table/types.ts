import type { VNode } from 'vue'

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
  filteredValue?: string[]
  tooltipEffect?: 'dark' | 'light'

  // extended props
  hidden?: boolean
  slot?: string
  headerSlot?: string
  headerRender?: (column: TableColumn, index: number) => VNode
  children?: TableColumn[]
  columnProps?: Record<string, any>
}
