import { withInstall } from '../../utils/install'
import _UploadFilePreviewList from './UploadFilePreviewList.vue'

export const HxUploadFilePreviewList = withInstall(_UploadFilePreviewList, 'hx-upload-file-preview-list')
export default HxUploadFilePreviewList

export type { UploadFilePreviewListProps } from './types'
