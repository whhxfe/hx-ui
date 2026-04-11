# Checkbox 多选组

基于 Element Plus `el-checkbox-group` 封装，支持 options 驱动渲染、远程数据源和禁用状态。

## 基础用法

:::demo 基础 / 禁用状态
checkbox/basic
:::

## 远程数据

传入 `remote` 配置自动请求远端接口获取 options。

:::demo 静态 / 远程请求
checkbox/remote
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 绑定值（数组） | `string[]` | `[]` |
| options | 静态选项列表（优先级高于 remote） | `OptionItem[]` | - |
| remote | 远程数据获取配置 | `RemoteConfig` | - |
| disabled | 是否禁用 | `boolean` | `false` |

### OptionItem

```ts
interface OptionItem {
  label: string
  value: string | number
  disabled?: boolean
}
```
