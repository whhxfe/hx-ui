export type QrCodeRenderMode = 'svg' | 'canvas'

export type QrCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

export interface QrCodeLogo {
  /** Logo 图片 URL */
  url: string
  /** Logo 宽度（单位 px），默认 40 */
  width?: number
  /** Logo 高度（单位 px），默认 40 */
  height?: number
  /** Logo 距中心的偏移 X（单位 px） */
  offsetX?: number
  /** Logo 距中心的偏移 Y（单位 px） */
  offsetY?: number
}

export interface QrCodeProps {
  /** 二维码内容（URL 或任意文本） */
  value: string
  /** 渲染方式：svg（可 CSS 控制，支持高清缩放）或 canvas（下载更直接） */
  renderMode?: QrCodeRenderMode
  /** 二维码尺寸（宽高），默认 120 */
  size?: string | number
  /** 前景色（深色模块颜色），默认 #000000 */
  colorDark?: string
  /** 背景色，默认 #ffffff */
  colorLight?: string
  /** 纠错等级：L(7%) M(15%) Q(25%) H(30%)，默认 M */
  errorCorrectionLevel?: QrCodeErrorCorrectionLevel
  /** 二维码周围留白（单位 px），默认 0 */
  margin?: number
  /** 是否展示下载按钮，默认 true */
  showDownload?: boolean
  /** 下载按钮文案，默认 '下载二维码' */
  downloadText?: string
  /** 下载文件名（不含扩展名），默认 'qrcode' */
  downloadFileName?: string
  /** Logo 配置（不支持纠错等级 L） */
  logo?: QrCodeLogo
  /** 自定义样式 */
  style?: Record<string, string>
}