import { withInstall } from '../../utils/install'
import _FilterPanel from './FilterPanel.vue'
import _FilterItem from './FilterItem.vue'
import _FilterDateRange from './FilterDateRange.vue'

export const HxFilterPanel = withInstall(_FilterPanel, 'HxFilterPanel')
export const HxFilterItem = withInstall(_FilterItem, 'HxFilterItem')
export const HxFilterDateRange = withInstall(_FilterDateRange, 'HxFilterDateRange')

export default HxFilterPanel

export type { FilterPanelProps, FilterPanelEmits, FilterConfig, FilterOption, FilterDateRangeShortcut, FilterState, FilterItemInstance, FilterItemProps, FilterItemEmits, FilterDateRangeProps, FilterRemoteConfig, FilterValueType } from './types'
