# Cascader 级联选择

基于 Element Plus `el-cascader` 封装，支持静态 options 和远程数据源。

## 基础用法

:::demo 基础 / 可搜索 / 禁用
cascader/basic
:::

## 远程数据

传入 `remote` 配置自动请求远端接口获取 options，支持字段映射。

:::demo 静态 / 远程请求
cascader/remote
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 绑定值 | `string \| number \| string[]` | - |
| options | 静态选项列表（优先级高于 remote） | `Record<string, any>[]` | - |
| remote | 远程数据获取配置 | `RemoteConfig` | - |
| placeholder | 占位文本 | `string` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| filterable | 是否可搜索 | `boolean` | `false` |
| clearable | 是否可清空 | `boolean` | `true` |

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
