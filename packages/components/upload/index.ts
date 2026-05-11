import { withInstall } from '../../utils/install'
import _Upload from './Upload.vue'

export const HxUpload = withInstall(_Upload, 'HxUpload')
export default HxUpload

export type { UploadProps } from './types'
