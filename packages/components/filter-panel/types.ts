import type { RemoteConfig } from '../form/types'

export interface FilterOption {
  [key: string]: any
  disabled?: boolean
}

/** `date-range` 快捷项：结束为今天，开始为今天往前 `days` 天（与 HxQuickDateButton 一致） */
export interface FilterDateRangeShortcut {
  label: string
  days: number
}

export interface FilterConfig {
  prop: string
  label: string
  /** 静态选项列表；使用 remote 时可省略 */
  options?: FilterOption[]
  labelKey?: string
  valueKey?: string
  multiple?: boolean
  type: 'filter-item' | 'date-range'
  /** `filter-item`：远程数据配置（优先级高于 options），支持联动字段 dependsOn */
  remote?: RemoteConfig
  /** `date-range`：快捷区间，默认 最近7天 / 30天 / 90天 */
  dateShortcuts?: FilterDateRangeShortcut[]
  /** `date-range`：输出与展示格式，默认 `YYYY-MM-DD` */
  dateFormat?: string
}

export type FilterValueType = string | number | (string | number)[] | null | undefined

export type ValueType = FilterValueType

export interface FilterState {
  [key: string]: FilterValueType
}

export interface FilterPanelProps {
  modelValue?: FilterState
  title?: string
  filters: FilterConfig[]
  collapse?: boolean
}

export interface FilterPanelEmits {
  (e: 'update:modelValue', value: FilterState): void
  (e: 'change', value: FilterState): void
  (e: 'filter-change', key: string, value: FilterValueType): void
  (e: 'reset'): void
}

export interface FilterItemInstance {
  effectiveOptions: FilterOption[]
}

export interface FilterDateRangeProps {
	modelValue?: FilterValueType
	label?: string
	/** 快捷范围：结束日期为今天，开始为今天往前推 `days` 天（与 HxQuickDateButton 一致） */
	shortcuts?: FilterDateRangeShortcut[]
	format?: string
}

export interface FilterItemProps {
	modelValue?: FilterValueType
	label?: string
	options?: FilterOption[]
	labelKey?: string
	valueKey?: string
	multiple?: boolean
	allowDeselectAll?: boolean
	/** 远程数据配置（优先级高于 options） */
	remote?: RemoteConfig
	/** 联动：依赖的父级 prop 名称 */
	dependsOn?: string
	/** 联动：父级 prop 当前选中的值 */
	dependsOnValue?: FilterValueType
}

export interface FilterItemEmits {
	(e: 'update:modelValue', value: FilterValueType): void
	(e: 'change', value: FilterValueType): void
	(e: 'options-updated'): void
}
