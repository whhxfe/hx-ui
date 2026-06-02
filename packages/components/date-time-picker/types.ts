import type { DateRangeShortcut, DateShortcut } from "../date-picker/types"

/**
 * HxDateTimePicker 支持两种模式：
 * - `datetime`: 单个日期时间选择器
 * - `datetimerange`: 日期时间范围选择器
 */

/** HxDateTimePicker Props — 支持单个日期时间 / 日期时间范围 */
export interface DateTimePickerProps {
	/** v-model */
	modelValue?: any
	/** 模式：单个日期时间 / 日期时间范围 */
	mode?: string
	/** 占位文本（单个模式） */
	placeholder?: string
	/** 开始日期占位文本（范围模式） */
	startPlaceholder?: string
	/** 结束日期占位文本（范围模式） */
	endPlaceholder?: string
	/** 显示格式 */
	format?: string
	/** 值格式 */
	valueFormat?: string
	/** 是否禁用 */
	disabled?: boolean
	/** 是否可清空 */
	clearable?: boolean
	/** 禁用日期函数 */
	disabledDate?: (date: Date) => boolean
	/** 快捷选项（范围模式用 DateRangeShortcut[]，单个模式用 DateShortcut[]） */
	shortcuts?: (DateRangeShortcut | DateShortcut)[]
	/** 默认值 */
	defaultValue?: any
}
