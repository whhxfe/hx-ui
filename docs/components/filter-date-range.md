# FilterDateRange 日期范围选择

用于筛选条件中的快捷日期范围选择器，支持预定义快捷按钮和自定义日期范围选择。通常作为 `HxFilterPanel` 的子组件使用，也支持独立使用。

## 独立使用

:::demo 展示 FilterDateRange 的三种使用场景：默认快捷日期、自定义快捷日期、自定义日期格式
filter-date-range/basic
:::

:::demo 展示 dropdownPlacement 属性，控制自定义日期选择器的弹出位置
filter-date-range/dropdown-placement
:::

## API

### HxFilterDateRange Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 当前选中的日期范围，值为 `''`（未选择）或 `[start, end]` 字符串元组 | `FilterValueType` | — |
| label | 左侧标签文本 | `string` | `''` |
| shortcuts | 快捷区间按钮列表，省略时为默认近 7 / 30 / 90 天 | `FilterDateRangeShortcut[]` | — |
| format | 日期输出与展示格式 | `string` | `'YYYY-MM-DD'` |
| dropdownPlacement | 自定义日期选择器弹出位置 | `'bottom' \| 'right'` | `'bottom'` |

### HxFilterDateRange Emits

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 日期范围变化 | `(value: FilterValueType)` |
| change | 日期范围变化（与 update:modelValue 同时触发） | `(value: FilterValueType)` |

### FilterDateRangeShortcut

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| label | 按钮文案 | `string` |
| days | 结束为今天、开始为今天往前推的天数 | `number` |

## 类型定义

```ts
import type {
  FilterDateRangeProps,
  FilterDateRangeShortcut,
  FilterValueType,
} from '@hx/ui'
```

## 功能说明

- **快捷选择**：点击预设快捷按钮（如「最近7天」）可直接选择对应日期范围，再次点击可取消选中。
- **自定义选择**：点击「自定义」按钮展开 `el-date-picker` 日期范围选择器，支持任意起止日期。
- **选中态切换**：点击不同的快捷按钮或切换到自定义模式会自动切换选中态，且日期显示与选中状态保持一致。
- **可清空**：再次点击已激活的快捷按钮可取消选中；自定义日期选择器支持 `clearable` 清空。
- **双向绑定**：支持 `v-model`，值为 `''`（未选择）或 `[start, end]` 字符串元组。