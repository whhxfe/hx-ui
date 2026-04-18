import type { RemoteConfig } from "../../types"

/** 基础选项 */
export interface TransferOption {
	label: string
	value: string | number
	disabled?: boolean
}

/**
 * 分组数据（与 Select 的 GroupOptionItem 对齐）
 * - 外部传入时使用 `label` + `options`
 * - 组件内部规范为 `groupName` + `groupKey` + `options`
 */
export interface TransferGroup {
	/** 分组名称（渲染为分组标题，外部传入使用 `label`） */
	groupName?: string
	label?: string
	/** 分组下的选项列表 */
	options: TransferOption[]
	/** 分组唯一标识（组件内部自动生成） */
	groupKey?: string
}

/** 远程数据获取配置 */
export interface TransferRemoteConfig extends RemoteConfig {
	// 分组数据的 groupName 固定使用 `label`，选项列表固定使用 `options`，与 Select 保持一致
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
	/** 静态数据源（优先级低于 remote），支持单层或分组格式 */
	options?: TransferOption[] | TransferGroup[]
	/** 远程数据获取配置 */
	remote?: TransferRemoteConfig
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
