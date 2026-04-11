# FilterPanel 筛选面板

用于管理列表页筛选条件的面板组件，支持多选筛选项、单选筛选项、展开收起、重置等功能。

## 基础用法

:::demo 筛选条件配置与选中状态展示
filter-panel/basic
:::

## 远程联动

:::demo 省 → 市 → 区三级联动（remote.dependsOn 联动父 prop）
filter-panel/cascaded-linkage
:::

## Props

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 筛选状态对象，key 为 prop，value 为选中值 | `FilterState` | `{}` |
| title | 面板标题 | `string` | `'筛选条件'` |
| filters | 筛选条件配置数组 | `FilterConfig[]` | `[]` |
| collapse | 是否默认收起 | `boolean` | `false` |

## FilterConfig

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prop | 筛选字段标识，用于关联 v-model 的 key | `string` | — |
| label | 筛选字段名称 | `string` | — |
| type | 筛选类型 | `'filter-item' \| 'date-range'` | — |
| options | 静态选项列表 | `FilterOption[]` | `[]` |
| multiple | 是否支持多选 | `boolean` | `true` |
| labelKey | 选项中 label 字段名 | `string` | `'label'` |
| valueKey | 选项中 value 字段名 | `string` | `'value'` |
| remote | `filter-item`：远程数据配置，优先级高于 `options`（与 `HxSelect.remote` 一致） | `RemoteConfig` | — |
| dependsOn | `filter-item`：联动——依赖的父级 prop 名称。父值变化时自动清空自身并重新加载选项 | `string` | — |
| dependsOnRemote | `filter-item`：联动远程配置，配合 `dependsOn` 使用 | `FilterDependsOnRemote` | — |
| dateShortcuts | `date-range`：快捷区间按钮列表 | `FilterDateRangeShortcut[]` | 默认近 7 / 30 / 90 天 |
| dateFormat | `date-range`：日期格式（`value-format`） | `string` | `'YYYY-MM-DD'` |

### FilterDependsOnRemote

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| url | 父值变化后请求的目标 URL | `string` | — |
| method | 请求方法 | `'get' \| 'post'` | `'get'` |
| paramKey | GET=query 参数名，POST=body 字段名 | `string` | `'value'` |
| labelKey | 响应中 label 字段名 | `string` | `'label'` |
| valueKey | 响应中 value 字段名 | `string` | `'value'` |
| extraParams | 额外静态参数，随每个联动请求附带 | `Record<string, string \| number>` | — |

### RemoteConfig

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| url | 请求地址 | `string` | — |
| method | 请求方法 | `'get' \| 'post'` | `'get'` |
| params | URL query 参数（GET 拼接在 ? 后） | `Record<string, any>` | — |
| body | 请求体参数（POST 序列化 JSON） | `Record<string, any>` | — |
| bodyType | body 格式 | `'json' \| 'form-data'` | `'json'` |
| labelKey | 响应中 label 字段名 | `string` | `'label'` |
| valueKey | 响应中 value 字段名 | `string` | `'value'` |
| childrenKey | 响应中 children 字段名 | `string` | `'children'` |

## FilterDateRangeShortcut

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| label | 按钮文案 | `string` |
| days | 结束为今天、开始为今天往前推的天数（与 `HxQuickDateButton` 一致） | `number` |

## FilterOption

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| [key: string] | 可配置任意字段扩展 | `any` | — |
| disabled | 是否禁用该选项 | `boolean` | `false` |

## Emits

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 筛选状态变更 | `(value: FilterState)` |
| filter-change | 单个筛选项变更 | `(prop: string, value: ValueType)` |
| reset | 重置所有筛选条件 | `()` |

## 说明

- `type: 'filter-item'` 由内部 `FilterItem` 渲染，支持静态 `options` 与单选 / 多选。
- `type: 'date-range'` 为快捷区间 +「自定义」+ `el-date-picker` 范围选择；`v-model` 为 `''` 或 `[start, end]` 字符串元组（格式见 `dateFormat`）。顶部标签展示为 `开始~结束`。

## 类型定义

```ts
import type {
  FilterPanelProps,
  FilterPanelEmits,
  FilterConfig,
  FilterOption,
  FilterDateRangeShortcut,
  FilterState,
  ValueType,
  RemoteConfig,
  OptionItem,
} from '@hx/ui'
```
