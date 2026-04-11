import { withInstall } from '../../utils/install'
import _FilterPanel from './FilterPanel.vue'

export const HxFilterPanel = withInstall(_FilterPanel, 'HxFilterPanel')
export default HxFilterPanel

export type { FilterPanelProps, FilterPanelEmits, FilterConfig, FilterOption, FilterDateRangeShortcut, FilterState, FilterItemInstance, ValueType, FilterItemProps, FilterItemEmits, FilterDateRangeProps } from './types'

export type { RemoteConfig, OptionItem } from '../form/types'
