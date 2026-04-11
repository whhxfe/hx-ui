/**
 * file-preview 组件类型定义
 */

// ================================
// 通用类型
// ================================

export type MaybeUrl = string | undefined | null

// ================================
// FilePreview 类型
// ================================

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  PDF = 'pdf',
  EML = 'eml',
  MARKDOWN = 'markdown',
  TEXT = 'text',
  UNKNOWN = 'unknown',
}

export interface FileTypeConfig {
  type: FileType
  extensions: string[]
  component: any
  getProps?: (
    url: string,
    width?: string,
    height?: string,
    fallbackThumbnail?: string
  ) => Record<string, any>
}

// ================================
// EML 解析器类型
// ================================

export interface EmlAttachment {
  filename?: string
  contentType?: string
  content: string
  isText: boolean
  isInline: boolean
  contentId?: string
}

export interface ParsedEml {
  subject?: string
  from?: string
  fromText?: string
  to?: string
  toText?: string
  date?: string
  html?: string
  text?: string
  attachments: EmlAttachment[]
}

// ================================
// 各 Viewer Props 类型
// ================================

export interface ImgViewerProps {
  url: string
  width?: string | number
  height?: string | number
}

export interface VideoViewerProps {
  url?: MaybeUrl
  width?: string
  height?: string
  fallbackThumbnail?: string
}

export interface AudioViewerProps {
  url: string
  width?: string
  height?: string
}

export interface TextViewerProps {
  url?: MaybeUrl
  width?: string
  height?: string
}

export interface MarkdownViewerProps {
  url?: MaybeUrl
  width?: string
  height?: string
}

export interface PdfViewerProps {
  url?: string | Blob | MaybeUrl
  width?: string
  height?: string
}

export interface EmlViewerProps {
  url?: MaybeUrl
  width?: string
  height?: string
}

export interface DefaultViewerProps {
  url: string
  width?: string
  height?: string
  filename?: string
  extension?: string
}

export interface FilePreviewProps {
  url: MaybeUrl
  previewWidth?: string
  previewHeight?: string
  fallbackThumbnail?: string
}
