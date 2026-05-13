# Link 链接

用于跳转页面，基于 Element Plus 的 `el-link` 二次封装，支持自动跳转和点击事件。

## 基础用法

使用 `type` 定义链接样式，支持 `primary`、`success`、`warning`、`danger`、`info` 五种类型。

:::demo 展示不同类型的链接样式。
link/basic
:::

## 下划线模式

通过 `underline` 属性控制下划线显示方式，支持 `always`（始终显示）、`hover`（悬停显示）、`never`（从不显示）三种模式。

:::demo 链接下划线三种模式对比。
link/underline
:::

## 禁用与点击事件

设置 `disabled` 属性禁用链接，或通过 `auto-jump` 关闭自动跳转，配合 `click` 事件实现自定义点击逻辑。

:::demo 禁用状态下的链接样式，以及通过 click 事件模拟自定义交互。
link/disabled
:::

## 图标组合

链接可以与图标组件配合使用，增强交互提示。

:::demo 图标与链接组合使用。
link/icon
:::

## 自动跳转

通过 `auto-jump` 属性控制点击 `href` 链接时是否自动跳转。

:::demo auto-jump 开关对比。
link/auto-jump
:::

## API

### Props

| 名称      | 说明                                      | 类型                                   | 默认值  |
| --------- | --------------------------------------- | -------------------------------------- | ------ |
| auto-jump | 点击后是否自动跳转                        | `boolean`                              | `true` |

> 其余 `ElLink` 原生属性均可直接使用，包括 `href`、`target`、`type`、`underline`、`disabled` 等。

### Events

| 事件名 | 说明     | 回调参数         |
| ------ | -------- | ---------------- |
| click  | 点击事件 | `(e: MouseEvent)` |

### Slots

| 插槽名   | 说明     |
| -------- | -------- |
| default | 链接内容 |
