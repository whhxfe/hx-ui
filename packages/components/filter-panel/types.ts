/**
 * 筛选面板中单个选项的数据结构
 */
export interface FilterOption {
  [key: string]: any
  disabled?: boolean
}

/** `date-range` 快捷项：结束为今天，开始为今天往前 `days` 天 */
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

/**
 * 单个筛选字段的配置项
 */
export interface FilterConfig {
  /** 字段标识，对应 FilterState 的 key */
  prop: string
  /** 显示名称 */
  label: string
  /** 静态选项列表；使用 remote 时可省略 */
  options?: FilterOption[]
  labelKey?: string
  valueKey?: string
  multiple?: boolean
  /**
   * 多选时 v-model 的值类型：
   * - `"array"`：值为数组（默认）
   * - `"string"`：值为逗号拼接字符串（仅在 multiple=true 时有效）
   */
  modelValueType?: 'string' | 'array'
  /** 筛选类型：'filter-item' 为普通选项筛选，'date-range' 为日期范围 */
  type: 'filter-item' | 'date-range'
  /** `filter-item`：远程数据配置（优先级高于 options），支持联动字段 dependsOn */
  remote?: FilterRemoteConfig
  /** `date-range`：`FilterDateRangeShortcut[]` 快捷区间，默认 最近7天 / 30天 / 90天 */
  dateShortcuts?: FilterDateRangeShortcut[]
  /** `date-range`：输出与展示格式，默认 `YYYY-MM-DD` */
  dateFormat?: string
}

/** 单个筛选字段的值类型 */
export type FilterValueType = string | number | (string | number)[] | null | undefined

/** 筛选面板完整的值状态集合 */
export interface FilterState {
  [key: string]: FilterValueType
}

/** HxFilterPanel 组件 Props */
export interface FilterPanelProps {
  /** 当前筛选值状态（v-model） */
  modelValue?: FilterState
  /** 面板标题 */
  title?: string
  /** 筛选字段配置数组 */
  filters: FilterConfig[]
  /** 是否折叠筛选条件区域 */
  collapse?: boolean
  /** 折叠面板内容区最大高度，默认 '400px' */
  height?: string
}

/** HxFilterPanel 组件 Emits */
export interface FilterPanelEmits {
  (e: 'update:modelValue', value: FilterState): void
  (e: 'change', value: FilterState): void
  (e: 'filter-change', key: string, value: FilterValueType): void
  (e: 'reset'): void
}

/** FilterItem 组件暴露的实例方法 */
export interface FilterItemInstance {
  effectiveOptions: FilterOption[]
}

/** FilterDateRange 组件 Props */
export interface FilterDateRangeProps {
  modelValue?: FilterValueType
  label?: string
  /** 快捷范围：结束日期为今天，开始为今天往前推 `days` 天 */
  shortcuts?: FilterDateRangeShortcut[]
  format?: string
  /** 日期选择框弹出位置：'right' 右侧（默认）, 'bottom' 下方 */
  dropdownPlacement?: 'bottom' | 'right'
}

/** FilterItem 组件 Props */
export interface FilterItemProps {
  modelValue?: FilterValueType
  label?: string
  options?: FilterOption[]
  labelKey?: string
  valueKey?: string
  multiple?: boolean
  /**
   * 多选时 v-model 的值类型：
   * - `"array"`：值为数组（默认）
   * - `"string"`：值为逗号拼接字符串（仅在 multiple=true 时有效）
   */
  modelValueType?: 'string' | 'array'
  allowDeselectAll?: boolean
  /** 远程数据配置（优先级高于 options） */
  remote?: FilterRemoteConfig
  /** 联动：依赖的父级 prop 名称 */
  dependsOn?: string
  /** 联动：父级 prop 当前选中的值 */
  dependsOnValue?: FilterValueType
}

/** FilterItem 组件 Emits */
export interface FilterItemEmits {
  (e: 'update:modelValue', value: FilterValueType): void
  (e: 'change', value: FilterValueType): void
  (e: 'options-updated'): void
}