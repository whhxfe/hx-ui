import type { OptionItem, RemoteConfig } from "../../types"

/**
 * 级联面板配置（对应 Element Plus el-cascader 的 props 属性）
 */
export interface CascaderPanelProps {
	/** 展开触发方式 */
	expandTrigger?: "click" | "hover"
	/** 是否返回完整路径数组；false 时 v-model 仅绑定叶子节点值 */
	emitPath?: boolean
	/** 是否多选 */
	multiple?: boolean
	/** 是否可选中任意节点（默认只能选叶子节点） */
	checkStrictly?: boolean
	/** 输入框是否展示完整路径，设为 false 则只显示选中节点 label */
	showAllLevels?: boolean
	/** 多级路径的分隔符 */
	separator?: string
	/** 数据中 label 字段名（默认 "label"） */
	labelKey?: string
	/** 数据中 value 字段名（默认 "value"） */
	valueKey?: string
	/** 数据中 children 字段名（默认 "children"） */
	childrenKey?: string
	/** 数据中 disabled 字段名（默认 "disabled"） */
	disabledKey?: string
	/** 数据中 leaf 字段名，默认叶子节点判断 */
	leafKey?: string
	/** 是否懒加载子节点（需配合 resolveLeafChange） */
	lazy?: boolean
	/** 懒加载回调，根据 node 和 rawNode 判断是否有子节点 */
	lazyLoad?: (node: any, rawNode: any) => void
	/** 自定义节点渲染函数 */
	renderLabel?: (h: any, { node, data }: any) => any
}

export interface CascaderProps {
	/** v-model */
	modelValue?: string | number | boolean | (string | number)[] | (string | number)[][]
	/** 静态选项数据 */
	options?: OptionItem[]
	/** 远程数据获取配置 */
	remote?: RemoteConfig
	/** placeholder */
	placeholder?: string
	/** 是否可清空 */
	clearable?: boolean
	/** 是否禁用 */
	disabled?: boolean
	/** 是否可搜索 */
	filterable?: boolean
	/** 级联面板配置 */
	props?: CascaderPanelProps
}
