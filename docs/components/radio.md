# Radio 单选组

基于 Element Plus `el-radio-group` 封装，支持 options 驱动渲染、按钮样式、远程数据源、禁用状态。

## 基础用法

:::demo 基础 / 按钮样式 / 禁用状态
radio/basic
:::

## 远程数据

传入 `remote` 配置自动请求远端接口获取 options。

:::demo 静态 / 远程请求 / 按钮样式
radio/remote
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 绑定值 | `string \| number` | - |
| options | 静态选项列表（优先级高于 remote） | `OptionItem[]` | - |
| remote | 远程数据获取配置 | `RemoteConfig` | - |
| variant | 显示样式，`radio` 或 `radio-btn` | `string` | `radio` |
| disabled | 是否禁用 | `boolean` | `false` |

### OptionItem

```ts
interface OptionItem {
  label: string
  value: string | number
  disabled?: boolean
}
```
