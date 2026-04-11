import type { RemoteConfig } from "../form/types"

/** 与 Element Plus `el-cascader` 的 `props` 一致：emitPath、multiple、字段映射等 */
export type CascaderFieldProps = Record<string, unknown>

export interface CascaderProps {
	/** v-model */
	modelValue?: any
	/** 静态选项数据 */
	options?: any[]
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
	/**
	 * 传给 el-cascader 的面板配置（Element Plus 的 `props` 属性）
	 */
	props?: CascaderFieldProps
	/**
	 * 为 false 时 v-model 仅绑定叶子节点值；等价于 `props: { emitPath: false }`
	 */
	emitPath?: boolean
}
