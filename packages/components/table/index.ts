import { withInstall } from '../../utils/install'
import _Table from './Table.vue'

export const HxTable = withInstall(_Table, 'HxTable')
export default HxTable

export type { TableColumn } from './types'
