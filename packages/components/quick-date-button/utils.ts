import dayjs from "dayjs"
import type { ShortcutItem } from "./types"

/**
 * 将 ShortcutItem[] 转换为 el-date-picker 需要的 shortcuts 格式
 * @param options 快捷选项列表
 * @param format 日期格式
 */
export function generateShortcuts(options: ShortcutItem[] = [], format = "YYYY-MM-DD"): ShortcutItem[] {
	return options.map((item) => ({
		...item,
		value: () => [
			dayjs().subtract(item.days, "day").startOf("day").toDate(),
			dayjs().subtract(1, "day").endOf("day").toDate(),
		],
	}))
}

/**
 * 默认快捷选项（近 N 天）
 * 与页面 initQuickDateButton 逻辑保持一致：结束=昨天 23:59:59，开始=往前 N 天 00:00:00
 */
export const defaultShortcuts: ShortcutItem[] = [
	{ text: "近一天", days: 1 },
	{ text: "近三天", days: 3 },
	{ text: "近一周", days: 7 },
	{ text: "近一月", days: 30 },
	{ text: "近三月", days: 90 },
	{ text: "近半年", days: 180 },
	{ text: "近一年", days: 365 },
]
