import { withInstall } from '../../utils/install'
import _JsonView from './JsonView.vue'
import type { JsonViewProps } from './types'

export const HxJsonView = withInstall(_JsonView, 'HxJsonView')
export type { JsonViewProps }
export default HxJsonView