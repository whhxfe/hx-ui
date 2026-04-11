export interface InputProps {
	/** v-model */
	modelValue?: string | number
	/** 类型：普通输入框 / textarea */
	type?: "input" | "textarea"
	/** placeholder */
	placeholder?: string
	/** 是否可清空 */
	clearable?: boolean
	/** 是否禁用 */
	disabled?: boolean
	/** 最大输入长度 */
	maxlength?: number
	/** 是否显示字数统计 */
	showWordLimit?: boolean
	/** textarea 行数 */
	rows?: number
	/** 标签文本（用于生成默认 placeholder） */
	label?: string
}
