# Select 下拉选择

基于 Element Plus `el-select` 封装，支持静态 options、远程数据源、分组 options、可搜索、多选等功能。

## 基础用法

:::demo 基础 / 可搜索 / 多选 / 分组
select/basic
:::

## 远程数据

传入 `remote` 配置自动请求远端接口获取 options，支持 GET/POST、参数映射、响应数据映射。

:::demo 静态 / 远程请求 / 多选
select/remote
:::

## 多选值类型

通过 `multiple` 开启多选。`modelValueType` 控制多选时 emit 的值类型：

- `modelValueType="string"`（默认）：emit 逗号拼接字符串，如 `"1,2,3"`，适合直接提交给后端
- `modelValueType="array"`：emit 字符串数组，如 `["1","2","3"]`，适合前端做进一步处理

:::demo 多选时 modelValueType 两种模式对比
select/value-type
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 绑定值（单选为字符串/数字，多选取决于 modelValueType） | `string \| number \| string[]` | - |
| modelValueType | 多选时 emit 的值类型，`"string"` 为逗号拼接字符串，`"array"` 为数组 | `'string' \| 'array'` | `'string'` |
| options | 静态选项列表（优先级高于 remote） | `OptionItem[] \| GroupOptionItem[]` | - |
| remote | 远程数据获取配置 | `RemoteConfig` | - |
| placeholder | 占位文本 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| multiple | 是否多选 | `boolean` | `false` |
| filterable | 是否可搜索 | `boolean` | `false` |
| clearable | 是否可清空 | `boolean` | `false` |

### RemoteConfig

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| url | 请求地址 | `string` | - |
| method | 请求方法 | `'get' \| 'post'` | `'get'` |
| params | URL query 参数 | `Record<string, any>` | - |
| body | 请求体参数（POST） | `Record<string, any>` | - |
| bodyType | body 格式 | `'json' \| 'form-data'` | `'json'` |
| labelKey | 响应中 label 字段名 | `string` | `'label'` |
| valueKey | 响应中 value 字段名 | `string` | `'value'` |
| childrenKey | 响应中 children 字段名 | `string` | `'children'` |

### OptionItem

```ts
interface OptionItem {
  label: string
  value: string | number
  disabled?: boolean
}
```

### GroupOptionItem

```ts
interface GroupOptionItem {
  label: string
  disabled?: boolean
  options: OptionItem[]
}
```
