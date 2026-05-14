# FilterItem 筛选选项

用于选型筛选条件中单个筛选字段的选项选择器，支持单选/多选、远程数据加载、联动清空等功能。通常作为 `HxFilterPanel` 的子组件使用，也支持独立使用。

## 独立使用

:::demo 展示 FilterItem 的三种使用场景：单选、多选、自定义字段映射
filter-item/basic
:::

## API

### HxFilterItem Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 当前选中的值，单选为 `string \| number`，多选根据 `modelValueType` 决定为数组或逗号拼接字符串 | `FilterValueType` | — |
| label | 左侧标签文本 | `string` | `''` |
| options | 静态选项列表 | `FilterOption[]` | — |
| labelKey | 选项文本字段名 | `string` | `'label'` |
| valueKey | 选项值字段名 | `string` | `'value'` |
| multiple | 是否支持多选 | `boolean` | `false` |
| modelValueType | 多选时 v-model 的值类型：`"array"` 发送数组，`"string"` 发送逗号拼接字符串（仅在 `multiple=true` 时有效） | `'string' \| 'array'` | `'array'` |
| allowDeselectAll | 多选模式下是否允许取消所有选项（最后一项也可取消） | `boolean` | `true` |
| remote | 远程数据配置，优先级高于 `options` | `FilterRemoteConfig` | — |
| dependsOn | 联动：依赖的父级 prop 名称，父值变化时自动清空自身选中值 | `string` | — |
| dependsOnValue | 联动：父级 prop 当前选中的值 | `FilterValueType` | — |

### HxFilterItem Emits

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 选中值变化 | `(value: FilterValueType)` |
| change | 选中值变化（与 update:modelValue 同时触发） | `(value: FilterValueType)` |
| options-updated | 远程数据加载完成，选项列表更新 | `()` |

### FilterOption

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| [key: string] | 可配置任意字段，通过 `labelKey` / `valueKey` 指定用于显示和取值的字段 | `any` | — |
| disabled | 是否禁用该选项 | `boolean` | `false` |

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

## 类型定义

```ts
import type {
  FilterItemProps,
  FilterItemEmits,
  FilterItemInstance,
  FilterValueType,
  FilterOption,
  FilterRemoteConfig,
} from '@hx/ui'
```

## 功能说明

- **单选/多选**：通过 `multiple` 属性控制。单选模式点击同一选项可取消选中；多选模式每项独立切换。
- **多选值类型**：多选模式下通过 `modelValueType` 控制 v-model 的值格式：
  - `"array"`（默认）：v-model 值为 `(string \| number)[]` 数组
  - `"string"`：v-model 值为逗号拼接字符串（如 `"a,b,c"`），适用于表单提交时可直接传入的格式
- **禁用选项**：选项中设置 `disabled: true` 可禁用该选项。
- **自定义字段匹配**：通过 `labelKey` 和 `valueKey` 指定选项对象中用于显示文本和值的字段名。
- **远程数据**：配置 `remote` 后自动发起请求，请求参数可包含 `dependsOnValue` 实现联动。
- **联动清空**：当 `dependsOn` 指定的父级 prop 值变化时，自动清空当前选中值。
- **主动清空**：设置 `modelValue` 为空字符串（单选）或空数组（多选）即可清空选中状态。