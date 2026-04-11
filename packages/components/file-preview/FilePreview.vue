<template>
  <div class="hx-file-preview" :style="{ width: previewWidth, height: previewHeight }">
    <component :is="previewComponent" v-bind="componentProps" />
  </div>
</template>

<script setup lang="tsx">
import { computed } from 'vue'
import {
  ImgViewer,
  VideoViewer,
  AudioViewer,
  EmlViewer,
  PdfViewer,
  MarkdownViewer,
  TextViewer,
  DefaultViewer,
} from './index'
import { extractFileInfo } from './utils'
import { FileType } from './types'
import type { MaybeUrl, FileTypeConfig } from './types'

// 扩展名映射表（常量化，便于复用和维护）
const FILE_TYPE_EXTENSIONS: Record<string, string[]> = {
  image: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif'],
  video: ['mp4', 'flv', 'm3u8', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'mkv', 'm4v'],
  audio: ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma', 'opus'],
  pdf: ['pdf'],
  eml: ['eml'],
  markdown: ['md', 'markdown', 'mdown', 'mkdn'],
  text: ['txt', 'text', 'log', 'conf', 'ini', 'cfg', 'config', 'yaml', 'yml', 'json', 'xml', 'csv'],
}

function detectFileType(url: string): FileType {
  const { extension } = extractFileInfo(url)
  if (!extension) return FileType.UNKNOWN

  if (FILE_TYPE_EXTENSIONS.image.includes(extension)) return FileType.IMAGE
  if (FILE_TYPE_EXTENSIONS.video.includes(extension)) return FileType.VIDEO
  if (FILE_TYPE_EXTENSIONS.audio.includes(extension)) return FileType.AUDIO
  if (FILE_TYPE_EXTENSIONS.pdf.includes(extension)) return FileType.PDF
  if (FILE_TYPE_EXTENSIONS.eml.includes(extension)) return FileType.EML
  if (FILE_TYPE_EXTENSIONS.markdown.includes(extension)) return FileType.MARKDOWN
  if (FILE_TYPE_EXTENSIONS.text.includes(extension)) return FileType.TEXT

  return FileType.UNKNOWN
}

const fileTypeConfigs: FileTypeConfig[] = [
  { type: FileType.IMAGE, extensions: FILE_TYPE_EXTENSIONS.image, component: ImgViewer,
    getProps: (url, width, height) => ({ url, width, height }) },
  { type: FileType.VIDEO, extensions: FILE_TYPE_EXTENSIONS.video, component: VideoViewer,
    getProps: (url, width, height, fallbackThumbnail) => ({ url, width, height, fallbackThumbnail }) },
  { type: FileType.AUDIO, extensions: FILE_TYPE_EXTENSIONS.audio, component: AudioViewer,
    getProps: (url, width, height) => ({ url, width, height }) },
  { type: FileType.PDF, extensions: FILE_TYPE_EXTENSIONS.pdf, component: PdfViewer,
    getProps: (url, width, height) => ({ url, width, height }) },
  { type: FileType.EML, extensions: FILE_TYPE_EXTENSIONS.eml, component: EmlViewer,
    getProps: (url, width, height) => ({ url, width, height }) },
  { type: FileType.MARKDOWN, extensions: FILE_TYPE_EXTENSIONS.markdown, component: MarkdownViewer,
    getProps: (url, width, height) => ({ url, width, height }) },
  { type: FileType.TEXT, extensions: FILE_TYPE_EXTENSIONS.text, component: TextViewer,
    getProps: (url, width, height) => ({ url, width, height }) },
]

function getFileTypeConfig(url: string): FileTypeConfig {
  const fileType = detectFileType(url)
  const config = fileTypeConfigs.find(c => c.type === fileType)

  if (config) return config

  return {
    type: FileType.UNKNOWN,
    extensions: [],
    component: DefaultViewer,
    getProps: (url: string, width?: string, height?: string) => {
      const { filename, extension } = extractFileInfo(url)
      return { url, width, height, filename, extension }
    },
  }
}

const props = withDefaults(
  defineProps<{
    url: MaybeUrl
    previewWidth?: string
    previewHeight?: string
    fallbackThumbnail?: string
  }>(),
  {
    previewWidth: '120px',
    previewHeight: '80px',
    fallbackThumbnail: '',
  }
)

const safeUrl = computed(() => props.url ?? '')
const previewComponent = computed(() => getFileTypeConfig(safeUrl.value).component)

const componentProps = computed(() => {
  const config = getFileTypeConfig(safeUrl.value)
  if (config.getProps) {
    return config.getProps(safeUrl.value, props.previewWidth, props.previewHeight, props.fallbackThumbnail)
  }
  return { url: safeUrl.value }
})
</script>

<style lang="scss" scoped>
.hx-file-preview {
  display: inline-block;
  position: relative;
}
</style>