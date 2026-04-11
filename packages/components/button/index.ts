// packages/components/button/index.ts
import { withInstall } from '../../utils/install'
import _Button from './Button.vue'

export const HxButton = withInstall(_Button, 'HxButton')
export default HxButton

export type { ButtonProps } from './types'