import type { RemoteConfig, OptionItem } from "../../types"

export interface CheckboxProps {
	/** v-model */
	modelValue?: any
	/** 静态选项数据 */
	options?: OptionItem[]
	/** 远程数据获取配置 */
	remote?: RemoteConfig
	/** 是否禁用 */
	disabled?: boolean
	/** 按钮形态：`checkbox` 普通样式，`checkbox-btn` 按钮样式 */
	variant?: "checkbox" | "checkbox-btn"
	/** 多选时 emit 的值类型：`"string"` 发送逗号拼接字符串（默认），`"array"` 发送数组 */
	modelValueType?: "string" | "array"
	/** change 事件回调 */
	onChange?: (value: any) => void
}
