import type { OptionItem } from "../form/types"

/** 预设选项（快捷时间），days 为往前推的天数 */
export interface ShortcutItem {
	/** 显示文本 */
	text: string
	/** 往前推的天数 */
	days: number
	/** 允许任意额外字段（如自定义 key 名） */
	[key: string]: string | number | (() => Date[])
}

/** v-model 绑定值类型 */
export type QuickDateButtonValue = string[]

export interface QuickDateButtonProps {
	/**
	 * v-model，当前选中的 datetype 值（预设选项 value 或 "custom"）
	 * @default ""
	 */
	modelValue?: string
	/**
	 * 左侧标签文本
	 * @default ""
	 */
	label?: string
	/**
	 * 预设快捷选项列表
	 * @default []
	 */
	options?: ShortcutItem[]
	/**
	 * 日期格式，用于 dayjs 格式化输出
	 * @default "YYYY-MM-DD"
	 */
	format?: string
	/**
	 * 是否显示「自定义」入口和日期范围选择器
	 * @default true
	 */
	custom?: boolean
	/**
	 * options 中的文本字段名
	 * @default "text"
	 */
	textKey?: string
	/**
	 * options 中的天数字段名
	 * @default "days"
	 */
	daysKey?: string
}

export interface QuickDateButtonExpose {
	/** 清空所有选择（重置为未选中状态） */
	reset: () => void
}
