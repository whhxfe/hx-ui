/**
 * 公共类型定义
 * 被多个组件共享的基础类型，统一在此定义
 */

/** 下拉 / 单选 / 多选等选项 */
export interface OptionItem {
	label: string
	value: string | number
	disabled?: boolean
	children?: OptionItem[]
}

/** select 分组选项 */
export interface GroupOptionItem {
	label: string
	disabled?: boolean
	options: OptionItem[]
}

/** 远程数据获取配置 */
export interface RemoteConfig {
	/** 远程请求 URL */
	url: string
	/** 请求方法 */
	method?: "get" | "post"
	/** URL query 参数（GET 请求自动拼接在 ? 后） */
	params?: Record<string, unknown>
	/** 请求体参数（POST/PUT 请求序列化为 JSON 放入 body） */
	body?: Record<string, unknown>
	/** 请求体格式（默认 "json"） */
	bodyType?: "json" | "form-data"
	/** 响应数据中 label 字段名（默认 "label"） */
	labelKey?: string
	/** 响应数据中 value 字段名（默认 "value"） */
	valueKey?: string
	/** 响应数据中 children 字段名（默认 "children"，用于级联和分组） */
	childrenKey?: string
}
