# Transfer 穿梭框

用于在两个面板之间进行数据交互，支持单选/多选、分组折叠、搜索过滤、静态数据源 / 远程数据源等功能。

业务项目中请确保已引入组件库样式：

```ts
import '@whhx/ui/index.css'
```

## 基础用法（options 模式）

通过 `options` 传入静态选项列表，`v-model` 绑定选中值。

:::demo 单选 / 多选
transfer/basic
:::

## 分组数据（options 模式）

当 `options` 传入分组格式数据时，左侧面板会按分组展示，支持展开/折叠分组。

:::demo 分组数据，可折叠分组
transfer/group
:::

## 多选值类型

通过 `multiple` 开启多选。`modelValueType` 控制多选时 emit 的值类型：

- `modelValueType="string"`（默认）：emit 逗号拼接字符串，如 `"1,2,3"`，适合直接提交给后端
- `modelValueType="array"`：emit 字符串数组，如 `["1","2","3"]`，适合前端做进一步处理

:::demo 多选时 modelValueType 两种模式对比
transfer/value-type
:::

## 远程数据（remote 模式）

传入 `remote` 配置自动请求远端接口获取 options，支持 GET/POST、参数映射、响应数据映射。

:::demo 静态数据 / 远程请求 / 多选
transfer/remote
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 绑定值（单选始终为字符串，多选取决于 modelValueType） | `string \| string[]` | `''` |
| modelValueType | 多选时 emit 的值类型，`"string"` 为逗号拼接字符串，`"array"` 为数组 | `'string' \| 'array'` | `'string'` |
| options | 静态选项列表（优先级低于 remote，支持单层或分组格式） | `TransferOption[] \| TransferGroup[]` | - |
| remote | 远程数据获取配置 | `TransferRemoteConfig` | - |
| title | 左侧面板标题，默认 `configText + '列表'` | `string` | - |
| leftWidth | 左侧面板宽度 | `string` | `'300px'` |
| configText | 自定义文案，默认 `'人员'` | `string` | `'人员'` |
| placeholder | 搜索框占位文本 | `string` | `''` |
| multiple | 是否多选，默认单选 | `boolean` | `false` |
| height | 整体高度（同时控制左右两侧） | `string` | `'400px'` |
| labelKey | 选项 label 字段名 | `string` | `'label'` |
| valueKey | 选项 value 字段名 | `string` | `'value'` |

### TransferOption

```ts
interface TransferOption {
  label: string
  value: string | number
  disabled?: boolean
}
```

### TransferGroup

```ts
interface TransferGroup {
  label: string             // 分组名称（渲染为分组标题）
  options: TransferOption[] // 分组下的选项列表
}
```

### TransferRemoteConfig

> 继承自 `RemoteConfig`，分组数据的分组名称固定使用 `label`，选项列表固定使用 `options`，与 Select 保持一致。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| url | 请求地址 | `string` | - |
| method | 请求方法 | `'get' \| 'post'` | `'get'` |
| params | URL query 参数 | `Record<string, any>` | - |
| body | 请求体参数（POST） | `Record<string, any>` | - |
| labelKey | 响应中 label 字段名 | `string` | `'label'` |
| valueKey | 响应中 value 字段名 | `string` | `'value'` |
