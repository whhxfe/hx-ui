import type { RemoteConfig } from "../form/types"

export interface SelectProps {
	/**
	 * v-model。
	 * - `multiple=false` 时始终为 `string`
	 * - `multiple=true` 且 `modelValueType="string"` 时为逗号拼接字符串（默认）
	 * - `multiple=true` 且 `modelValueType="array"` 时为 `string[]`
	 */
	modelValue?: any
	/** 多选时 emit 的值类型：`"string"` 发送逗号拼接字符串（默认），`"array"` 发送数组 */
	modelValueType?: "string" | "array"
	/** 静态选项数据 */
	options?: import("../form/types").OptionItem[] | import("../form/types").GroupOptionItem[]
	/** 远程数据获取配置 */
	remote?: RemoteConfig
	/** 是否多选 */
	multiple?: boolean
	/** 是否可清空 */
	clearable?: boolean
	/** 是否禁用 */
	disabled?: boolean
	/** 是否可搜索 */
	filterable?: boolean
	/** 占位文本 */
	placeholder?: string
	/** change 事件回调 */
	onChange?: (value: any) => void
}
