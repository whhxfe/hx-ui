import type { RemoteConfig } from "../form/types"

export interface RadioProps {
	/** v-model */
	modelValue?: any
	/** 静态选项数据 */
	options?: import("../form/types").OptionItem[]
	/** 远程数据获取配置 */
	remote?: RemoteConfig
	/** 是否禁用 */
	disabled?: boolean
	/** 类型：radio（标签）| radio-btn（按钮） */
	variant?: "radio" | "radio-btn"
	/** change 事件回调 */
	onChange?: (value: any) => void
}
