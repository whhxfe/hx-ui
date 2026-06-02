# DatePicker 日期选择器

基于 Element Plus `el-date-picker` 的封装组件，提供日期、日期范围、月份、年份等多种选择模式，支持快捷选项和日期禁用。

## 基础用法

:::demo 日期选择器基础用法 — 支持 date、daterange、month、year、week 等类型
date-picker/basic
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model / modelValue | 选中的值 | `string \| [string, string]` | - |
| type | 选择器类型 | `'date' \| 'daterange' \| 'datetime' \| 'datetimerange' \| 'month' \| 'monthrange' \| 'year' \| 'week'` | `'date'` |
| placeholder | 占位文本（单个选择器） | `string` | - |
| start-placeholder | 范围选择器开始占位文本 | `string` | - |
| end-placeholder | 范围选择器结束占位文本 | `string` | - |
| format | 显示格式 | `string` | - |
| value-format | 绑定值格式 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| clearable | 是否可清空 | `boolean` | `true` |
| disabled-date | 禁用日期函数 | `(date: Date) => boolean` | - |
| disable-future-time | 禁用未来时间（仅 datetime 有效） | `boolean` | `false` |
| shortcuts | 快捷选项（支持所有类型，范围类型返回 `Date[]`，单个类型返回 `Date`） | `DateRangeShortcut[]` | - |
| default-value | 默认值 | `Date \| [Date, Date]` | - |

### DateRangeShortcut

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| text | 快捷选项文字 | `string` |
| value | 快捷选项值，范围类型为 `Date \| () => Date[]`，单个类型为 `Date \| () => Date` | `Date \| () => Date \| Date[] \| () => Date[]` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 选中值变化时触发 | `(value: any)` |
| update:modelValue | 值更新时触发 | `(value: any)` |
