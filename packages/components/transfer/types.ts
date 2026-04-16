import type { RemoteConfig } from "../form/types"

/** 基础选项 */
export interface TransferOption {
	label: string
	value: string | number
	disabled?: boolean
}

/**
 * 分组数据（传入时可使用 `label` + `options`，与 Select 的 GroupOptionItem 对齐；
 * 组件内部会规范为 groupKey / groupName）
 */
export interface TransferGroup {
	groupKey?: string
	groupName?: string
	/** 分组标题，与 groupName 等价 */
	label?: string
	options: TransferOption[]
}

/** 远程数据获取配置 */
export interface TransferRemoteConfig extends RemoteConfig {
	/** 分组名称字段名（默认 "label"） */
	groupNameKey?: string
	/** 分组选项列表字段名（默认 "options"） */
	groupOptionsKey?: string
}

/** Transfer Props */
export interface TransferProps {
	/**
	 * 双向绑定值。
	 * - `multiple=false` 时始终为 `string`
	 * - `multiple=true` 且 `modelValueType="string"` 时为逗号拼接字符串（默认）
	 * - `multiple=true` 且 `modelValueType="array"` 时为 `string[]`
	 */
	modelValue?: string | string[]
	/** 多选时 emit 的值类型：`"string"` 发送逗号拼接字符串（默认），`"array"` 发送数组 */
	modelValueType?: "string" | "array"
	/** 静态数据源（优先级低于 remote） */
	options?: TransferOption[] | TransferGroup[]
	/** 远程数据获取配置 */
	remote?: TransferRemoteConfig
	/**
	 * 分组标题字段名（默认 `label`，与 Select 分组 options 一致）
	 * 也可通过 remote.groupNameKey 配置（remote 与 props 同时存在时以 props 为准）
	 */
	groupNameKey?: string
	/**
	 * 分组下选项列表字段名（默认 `options`）
	 */
	groupOptionsKey?: string
	/** 选项 label 字段名（默认 `label`） */
	labelKey?: string
	/** 选项 value 字段名（默认 `value`） */
	valueKey?: string
	/** 左侧面板标题 */
	title?: string
	/** 左侧面板宽度 */
	leftWidth?: string
	/** 自定义文案（默认"人员"，用于"xxx列表"和"已选中xxx"） */
	configText?: string
	/** 搜索框占位文本 */
	placeholder?: string
	/** 是否多选，默认单选 */
	multiple?: boolean
	/** 整体高度（同时控制左右两侧） */
	height?: string
}

/** 暴露给父组件的方法 */
export interface TransferExpose {
	loading: boolean
}
