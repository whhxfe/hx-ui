// packages/components/content-text/index.ts
import { withInstall } from '../../utils/install'
import _ContentText from './ContentText.vue'
export * from './types'
export const HxContentText = withInstall(_ContentText, 'hx-content-text')
export default HxContentText
