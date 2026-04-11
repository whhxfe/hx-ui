import { withInstall } from '../../utils/install'
import _RichEditor from './RichEditor.vue'

export const HxRichEditor = withInstall(_RichEditor, 'hx-rich-editor')
export default HxRichEditor

export type { RichEditorParams, RichEditorUploadOptions } from './types'
