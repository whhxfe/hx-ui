import type { VNode } from 'vue'

export interface TableColumn {
  // common el-table-column props
  type?: 'selection' | 'index' | 'expand'
  prop?: string
  label?: string
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  sortable?: boolean | 'custom'
  fixed?: boolean | 'left' | 'right'
  formatter?: (row: any, column: any, cellValue: any, index: number) => string
  showOverflowTooltip?: boolean
  className?: string
  labelClassName?: string
  resizable?: boolean

  // extended props
  hidden?: boolean
  slot?: string
  render?: (row: any, index: number) => VNode
  headerSlot?: string
  headerRender?: (column: TableColumn, index: number) => VNode
  children?: TableColumn[]
  columnProps?: Record<string, any>
}
