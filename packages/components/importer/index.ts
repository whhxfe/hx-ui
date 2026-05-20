import { withInstall } from '../../utils/install'
import _Importer from './Importer.vue'

export const HxImporter = withInstall(_Importer, 'HxImporter')

export default HxImporter

export type { ImporterProps } from './types'
