# FilterPanel 筛选面板

用于管理列表页筛选条件的面板组件，支持多选筛选项、单选筛选项、快捷日期范围、展开收起、重置等功能。

## 基础用法

:::demo 展示筛选条件的基本配置，支持多选/单选筛选项、远程数据加载、日期范围选择
filter-panel/basic
:::

## 折叠与高度

:::demo 通过 `collapse` 属性控制折叠状态，通过 `height` 属性限制面板内容区最大高度，超出内容自动显示滚动条
filter-panel/many-items
:::

## 远程联动

:::demo 省 → 市 → 区三级级联，通过 `FilterRemoteConfig.dependsOn` 实现联动
filter-panel/cascaded-linkage
:::

## API

### HxFilterPanel Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 筛选状态对象，key 为 prop，value 为选中值 | `FilterState` | `{}` |
| title | 面板标题 | `string` | `'筛选条件'` |
| filters | 筛选条件配置数组 | `FilterConfig[]` | `[]` |
| collapse | 是否默认收起筛选条件区域 | `boolean` | `false` |
| height | 折叠面板内容区最大高度（控制展开时的最大高度） | `string` | `'400px'` |

### HxFilterPanel Emits

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 筛选状态变更 | `(value: FilterState)` |
| change | 筛选状态变更（与 update:modelValue 同时触发） | `(value: FilterState)` |
| filter-change | 单个筛选项值变化 | `(key: string, value: FilterValueType)` |
| reset | 重置所有筛选条件 | `()` |

### FilterConfig

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prop | 字段标识，对应 `FilterState` 的 key | `string` | — |
| label | 显示名称 | `string` | — |
| type | 筛选类型 | `'filter-item' \| 'date-range'` | — |
| options | 静态选项列表，使用 `remote` 时可省略 | `FilterOption[]` | — |
| labelKey | 选项中 label 字段名（透传至子组件） | `string` | `'label'` |
| valueKey | 选项中 value 字段名（透传至子组件） | `string` | `'value'` |
| multiple | 是否支持多选（仅 `filter-item`） | `boolean` | `true` |
| remote | 远程数据配置，优先级高于 `options` | `FilterRemoteConfig` | — |
| dateShortcuts | 快捷区间按钮列表（仅 `date-range`） | `FilterDateRangeShortcut[]` | 近 7 / 30 / 90 天 |
| dateFormat | 日期输出与展示格式（仅 `date-range`） | `string` | `'YYYY-MM-DD'` |

### FilterRemoteConfig

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| url | 远程请求 URL | `string` | — |
| method | 请求方法 | `'get' \| 'post'` | `'get'` |
| params | URL query 参数（GET 自动拼接在 ? 后） | `Record<string, unknown>` | — |
| body | 请求体参数（POST 序列化为 JSON 放入 body） | `Record<string, unknown>` | — |
| bodyType | 请求体格式 | `'json' \| 'form-data'` | `'json'` |
| labelKey | 响应数据中 label 字段名 | `string` | `'label'` |
| valueKey | 响应数据中 value 字段名 | `string` | `'value'` |
| childrenKey | 响应数据中 children 字段名（用于级联和分组） | `string` | `'children'` |
| dependsOn | 联动：依赖的父级 prop 名称，父值变化时自动重新请求 | `string` | — |
| dependsOnParamKey | 联动：父值作为哪个参数名传递 | `string` | `'value'` |
| dependsOnIn | 联动：父值注入在 query 还是 body 中，默认跟随 method | `'query' \| 'body'` | — |

### FilterDateRangeShortcut

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| label | 按钮文案 | `string` |
| days | 结束为今天、开始为今天往前推的天数 | `number` |

### FilterOption

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| [key: string] | 可配置任意字段扩展 | `any` | — |
| disabled | 是否禁用该选项 | `boolean` | `false` |

## 功能说明

- **筛选项类型**：`type: 'filter-item'` 由内部 `FilterItem` 渲染，支持静态 `options` 与远程数据加载，支持单选/多选；`type: 'date-range'` 为快捷区间 +「自定义」+ `el-date-picker` 范围选择。
- **日期范围 v-model**：值为 `''`（未选择）或 `[start, end]` 字符串元组，格式由 `dateFormat` 控制。
- **远程联动**：通过 `FilterRemoteConfig.dependsOn` 配置，父级 prop 值变化时自动清空自身选中值并重新请求远程数据。
- **选中态展示**：顶部 Chip 区域展示当前所有有效筛选条件，支持逐个清除。
- **展开收起**：通过 `collapse` 属性控制筛选条件区域的折叠状态。
- **重置**：点击「重置」按钮清空所有筛选条件。

## 类型定义

```ts
import type {
  FilterPanelProps,
  FilterPanelEmits,
  FilterConfig,
  FilterOption,
  FilterDateRangeShortcut,
  FilterState,
  FilterValueType,
  FilterRemoteConfig,
  FilterItemProps,
  FilterItemEmits,
  FilterItemInstance,
  FilterDateRangeProps,
} from '@whhx/ui'