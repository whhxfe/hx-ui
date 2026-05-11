import { withInstall } from '../../utils/install'
import _QuickDateButton from './HxQuickDateButton.vue'

export const HxQuickDateButton = withInstall(_QuickDateButton, 'HxQuickDateButton')
export default HxQuickDateButton

export type { QuickDateButtonProps, QuickDateButtonExpose, ShortcutItem } from './types'
