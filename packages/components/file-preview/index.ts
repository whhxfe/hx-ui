import { withInstall } from '../../utils/install'
import ImgViewer from './ImgViewer.vue'
import VideoViewer from './VideoViewer.vue'
import AudioViewer from './AudioViewer.vue'
import EmlViewer from './EmlViewer.vue'
import PdfViewer from './PdfViewer.vue'
import MarkdownViewer from './MarkdownViewer.vue'
import TextViewer from './TextViewer.vue'
import DefaultViewer from './DefaultViewer.vue'
import _FilePreview from './FilePreview.vue'

export {
  ImgViewer,
  VideoViewer,
  AudioViewer,
  EmlViewer,
  PdfViewer,
  MarkdownViewer,
  TextViewer,
  DefaultViewer,
}

export const HxFilePreview = withInstall(_FilePreview, 'hx-file-preview')
export default HxFilePreview

export type { MaybeUrl, FileType, FileTypeConfig, EmlAttachment, ParsedEml, ImgViewerProps, VideoViewerProps, AudioViewerProps, TextViewerProps, MarkdownViewerProps, PdfViewerProps, EmlViewerProps, DefaultViewerProps, FilePreviewProps } from './types'