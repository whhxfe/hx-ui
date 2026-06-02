# DateTimePicker 日期时间选择器

基于 `HxDatePicker` 的快捷封装组件，专门用于日期时间选择场景，支持单个日期时间和日期时间范围两种模式，内置 `YYYY-MM-DD HH:mm:ss` 默认格式。

## 基础用法

:::demo 日期时间选择器 — 支持单个日期时间和日期时间范围
date-time-picker/basic
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model / modelValue | 选中的值 | `string \| [string, string]` | - |
| mode | 选择模式 | `'datetime' \| 'datetimerange'` | `'datetimerange'` |
| placeholder | 占位文本（mode=datetime 时） | `string` | `'请选择日期时间'` |
| start-placeholder | 范围开始占位文本 | `string` | `'请选择开始时间'` |
| end-placeholder | 范围结束占位文本 | `string` | `'请选择结束时间'` |
| format | 显示格式 | `string` | `'YYYY-MM-DD HH:mm:ss'` |
| value-format | 绑定值格式 | `string` | `'YYYY-MM-DD HH:mm:ss'` |
| disabled | 是否禁用 | `boolean` | `false` |
| clearable | 是否可清空 | `boolean` | `true` |
| disabled-date | 禁用日期函数 | `(date: Date) => boolean` | - |
| shortcuts | 快捷选项 | `DateRangeShortcut[]` | - |
| default-value | 默认值 | `any` | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 选中值变化时触发 | `(value: any)` |
| update:modelValue | 值更新时触发 | `(value: any)` |
