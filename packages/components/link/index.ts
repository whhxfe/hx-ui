import { withInstall } from '../../utils/install'
import _Link from './Link.vue'
import type { HxLinkProps } from './types'

export const HxLink = withInstall(_Link, 'HxLink')
export type { HxLinkProps }
export default HxLink
