export interface FilterOption {
  [key: string]: any
  disabled?: boolean
}

/** `date-range` 快捷项：结束为今天，开始为今天往前 `days` 天（与 HxQuickDateButton 一致） */
export interface FilterDateRangeShortcut {
  label: string
  days: number
}

/** filter-panel 专用远程数据配置 */
export interface FilterRemoteConfig {
	/** 远程请求 URL */
	url: string
	/** 请求方法 */
	method?: "get" | "post"
	/** URL query 参数（GET 请求自动拼接在 ? 后） */
	params?: Record<string, unknown>
	/** 请求体参数（POST 请求序列化为 JSON 放入 body） */
	body?: Record<string, unknown>
	/** 请求体格式（默认 "json"） */
	bodyType?: "json" | "form-data"
	/** 响应数据中 label 字段名（默认 "label"） */
	labelKey?: string
	/** 响应数据中 value 字段名（默认 "value"） */
	valueKey?: string
	/** 响应数据中 children 字段名（默认 "children"，用于级联和分组） */
	childrenKey?: string
	/** 联动：依赖的父级 prop 名称，父值变化时自动重新请求 */
	dependsOn?: string
	/** 联动：父值作为哪个参数名传递，默认 "value" */
	dependsOnParamKey?: string
	/** 联动：父值注入在 query 参数还是 body 中，默认跟随 method（method=get 时为 query，method=post 时为 body） */
	dependsOnIn?: "query" | "body"
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
  remote?: FilterRemoteConfig
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
	remote?: FilterRemoteConfig
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
