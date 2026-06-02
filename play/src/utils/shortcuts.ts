import dayjs from "dayjs"

/** 生成日期时间范围 shortcuts（daterange / datetimerange，保留时分秒） */
function generateDateTimeRangeShortcuts() {
  const list = [
    { text: "近一小时", unit: "hour", amount: 1 },
    { text: "近六小时", unit: "hour", amount: 6 },
    { text: "近一天", unit: "day", amount: 1 },
    { text: "近三天", unit: "day", amount: 3 },
    { text: "近一周", unit: "day", amount: 7 },
    { text: "近一月", unit: "month", amount: 1 },
  ]
  return list.map(item => ({
    text: item.text,
    value: () => [
      dayjs().subtract(item.amount, item.unit as dayjs.ManipulateType).toDate(),
      dayjs().toDate(),
    ],
  }))
}

/** 生成单个日期 shortcuts（date，精确到日） */
function generateDateShortcuts() {
  return [
    { text: "今天", value: () => dayjs().startOf("day").toDate() },
    { text: "昨天", value: () => dayjs().subtract(1, "day").startOf("day").toDate() },
    { text: "明天", value: () => dayjs().add(1, "day").startOf("day").toDate() },
    { text: "上周", value: () => dayjs().subtract(1, "week").startOf("week").toDate() },
    { text: "下周", value: () => dayjs().add(1, "week").startOf("week").toDate() },
    { text: "上月", value: () => dayjs().subtract(1, "month").startOf("month").toDate() },
    { text: "下月", value: () => dayjs().add(1, "month").startOf("month").toDate() },
  ]
}

export const dateTimeRangeShortcuts = generateDateTimeRangeShortcuts()
export const dateShortcuts = generateDateShortcuts()
