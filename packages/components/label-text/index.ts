// packages/components/label-text/index.ts
import { withInstall } from '../../utils/install'
import _LabelText from './LabelText.vue'
export * from './types'
export const HxLabelText = withInstall(_LabelText, 'hx-label-text')
export default HxLabelText
