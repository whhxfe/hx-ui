export interface ImporterProps {
  /** 模板下载地址（可选，有值则显示模板下载） */
  templateUrl?: string
  /** 模板文件名（用于显示） */
  templateFileName?: string
  /** 上传接口地址（必填） */
  uploadAction: string
  /** 请求方法，默认 'post' */
  method?: 'post' | 'put'
  /** 自定义请求头 */
  headers?: Record<string, string>
  /** 请求超时时间（毫秒） */
  timeout?: number
  /** 上传文件字段名，默认 'file'，对应 el-upload 的 name */
  name?: string
  /**
   * 上传附带参数，会随文件一起提交到接口
   * 对应 el-upload 的 data
   */
  data?: Record<string, any>
  /** 接受文件类型，默认 .xlsx,.xls */
  accept?: string
  /** 最大文件大小(MB)，默认 10 */
  maxSize?: number
  /** 按钮文本，默认 '导入' */
  buttonText?: string
  /** 弹窗标题，默认 '导入数据' */
  dialogTitle?: string
  /** 支持多文件上传，默认 false */
  multiple?: boolean
  /** 上传文件数量限制（0 表示无限制），默认与 multiple 一致：multiple=true 时 0，false 时 1 */
  limit?: number
  /** 上传成功后自动关闭弹窗，默认 true */
  autoCloseAfterUpload?: boolean
  /** 上传成功后回调 */
  onSuccess?: (response: any) => void
  /** 上传失败后回调 */
  onError?: (error: any) => void
  /** 携带 cookie，跨域时是否发送凭据，默认 false */
  withCredentials?: boolean
}