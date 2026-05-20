export type ExportType = 'page' | 'all' | 'count' | 'selected'

/** 导出选项，用于控制弹窗中显示哪些导出方式，默认全部可见 */
export type ExportOption = ExportType

export type ExportProgressType = 'none' | 'preparing' | 'downloading' | 'complete'

export interface ExporterProps {
  /** 导出接口地址（必填） */
  exportAction: string
  /** 请求方法，默认 'post' */
  method?: 'get' | 'post'
  /** 自定义请求头 */
  headers?: Record<string, string>
  /** 请求超时时间（毫秒） */
  timeout?: number
  /** 最大导出数量限制，默认 10000 */
  maxExportCount?: number
  /** 选中行数据（用于选中导出） */
  selectedRows?: any[]
  /** 选中行 ID 字段名，默认 'id' */
  rowIdField?: string
  /** 选中导出时 ids 的分隔符，默认 undefined 表示传数组；传 ',' 则以逗号拼接为字符串 */
  idsDelimiter?: string
  /** 获取当前检索条件的函数 */
  getSearchParams?: () => Record<string, any>
  /** 当前总数据量（用于显示全部导出预计数量） */
  totalCount?: number
  /** 当前页码 */
  currentPage?: number
  /** 每页数量 */
  pageSize?: number
  /** 按钮文本，默认 '导出' */
  buttonText?: string
  /** 弹窗标题，默认 '导出数据' */
  dialogTitle?: string
  /** 导出参数额外补充 */
  extraParams?: Record<string, any>
  /**
   * 导出选项可见性配置
   * 控制弹窗中显示哪些导出方式，默认全部显示
   * @example ['page', 'all', 'count', 'selected'] // 全部显示
   * @example ['page', 'selected'] // 只显示按页导出和选中导出
   * @example ['all'] // 只显示全部导出
   */
  exportOptions?: ExportOption[]
  /** 导出文件名前缀，默认 'export' */
  fileNamePrefix?: string
  /** 导出成功后自动关闭弹窗，默认 true */
  autoCloseAfterExport?: boolean
  /** 导出成功后回调 */
  onSuccess?: () => void
  /** 导出失败回调 */
  onError?: (error: any) => void
}