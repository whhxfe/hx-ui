/**
 * 日期选择器类型
 * - `date`: 单个日期
 * - `daterange`: 日期范围
 * - `datetime`: 单个日期时间
 * - `datetimerange`: 日期时间范围
 * - `month`: 月份
 * - `monthrange`: 月份范围
 * - `year`: 年份
 * - `week`: 周
 */
export type DatePickerType =
	| "date"
	| "daterange"
	| "datetime"
	| "datetimerange"
	| "month"
	| "monthrange"
	| "year"
	| "week"

/** 日期范围快捷选项（daterange / datetimerange） */
export interface DateRangeShortcut {
	text: string
	value: Date[] | (() => Date[])
}

/** 单个日期快捷选项（date / datetime） */
export interface DateShortcut {
	text: string
	value: Date | (() => Date)
}

/** HxDatePicker Props */
export interface DatePickerProps {
	/** v-model */
	modelValue?: any
	/** 日期选择器类型（兼容 el-date-picker） */
	type?: DatePickerType
	/** 日期选择器类型（与 HxDateTimePicker 命名一致） */
	mode?: DatePickerType
	/** 占位文本（单个选择器） */
	placeholder?: string
	/** 开始日期占位文本（范围选择器） */
	startPlaceholder?: string
	/** 结束日期占位文本（范围选择器） */
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
	/** 禁用未来时间（仅 datetime 类型有效） */
	disableFutureTime?: boolean
	/** 快捷选项（范围类型返回 Date[]，单个类型返回 Date） */
	shortcuts?: (DateRangeShortcut | DateShortcut)[]
	/** 默认值 */
	defaultValue?: any
}
