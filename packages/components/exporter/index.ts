import { withInstall } from '../../utils/install'
import _Exporter from './Exporter.vue'

export const HxExporter = withInstall(_Exporter, 'HxExporter')

export type { ExporterProps, ExportType, ExportProgressType } from './types'
