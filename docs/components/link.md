# Link 链接

用于跳转页面，基于 Element Plus 的 `el-link` 二次封装，支持自动跳转和点击事件。

## 基础用法

使用 `type` 定义链接样式，支持 `primary`、`success`、`warning`、`danger`、`info` 五种类型。

:::demo 展示不同类型、下划线、禁用状态、图标及自动跳转配置。
link/basic
:::

## API

### Props

| 名称      | 说明                                      | 类型                                   | 默认值  |
| --------- | --------------------------------------- | -------------------------------------- | ------ |
| auto-jump | 点击后是否自动跳转                        | `boolean`                              | `true` |

> 其余 `ElLink` 原生属性均可通过 `v-bind="$attrs"` 透传，包括 `href`、`target`、`type`、`underline`、`disabled` 等。

### Events

| 事件名 | 说明     | 回调参数         |
| ------ | -------- | ---------------- |
| click  | 点击事件 | `(e: MouseEvent)` |

### Slots

| 插槽名   | 说明     |
| -------- | -------- |
| default | 链接内容 |
