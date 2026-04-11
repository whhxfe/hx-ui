# HxQuickDateButton 快捷日期按钮

提供快捷时间选项（近 N 天）和自定义日期范围选择的组件，支持通过 `change` 事件获取格式化后的 `[startTime, endTime]`。

## 基础用法

预设选项默认为「近 N 天」快捷时间，点击切换选中状态，再次点击取消选中。

:::demo 默认快捷时间 / 带标签 / 隐藏自定义 / 监听 change
quick-date-button/basic
:::

## 自定义快捷选项

通过 `options` 传入自定义的快捷选项列表，格式为 `ShortcutItem[]`。

:::demo 自定义快捷选项
quick-date-button/custom
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 当前选中的 datetype 值（预设选项对应天数字符串，或 `"custom"`） | `string` | `''` |
| label | 左侧标签文本 | `string` | `''` |
| options | 预设快捷选项列表 | `ShortcutItem[]` | `defaultShortcuts`（近 1/3/7/30/90/180/365 天） |
| format | 输出日期格式（dayjs 格式） | `string` | `'YYYY-MM-DD'` |
| custom | 是否显示「自定义」入口和日期范围选择器 | `boolean` | `true` |
| textKey | options 中的文本字段名 | `string` | `'text'` |
| daysKey | options 中的天数字段名 | `string` | `'days'` |

### ShortcutItem

```ts
interface ShortcutItem {
  text: string   // 显示文本
  days: number   // 往前推的天数
}
```

### Emits

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 选中值变化时触发 | `(datetype: string)` |
| change | 选中范围变化时触发 | `(range: string[])` 格式为 `[startTime, endTime]` |

### Expose

| 方法名 | 说明 |
| --- | --- |
| reset | 重置为未选中状态，清空所有选择 |
