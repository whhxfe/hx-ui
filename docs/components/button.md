# Button 按钮

用于触发业务动作，基于 Element Plus 的 `ElButton` 二次封装。

## 基础用法

使用 `type`、`plain`、`round`、`dashed` 和 `circle` 来定义按钮样式。

:::demo 使用 type、plain、round、dashed 和 circle 定义按钮样式。
button/basic
:::

## 扩展事件

:::demo 在 custom-click 事件里扩展业务交互。
button/custom-event
:::

## 扩展属性

:::demo 通过 custom-prop 注入业务语义。
button/custom-prop
:::

## API

### Props

| 名称 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| custom-prop | 业务扩展属性示例 | string | '' |
| type | 按钮类型（继承 ElButton） | string | - |
| size | 按钮尺寸（继承 ElButton） | string | - |

> 除 `custom-prop` 外，其余 `ElButton` 原生属性均可通过 `v-bind="$attrs"` 继续透传。

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| custom-click | 自定义点击事件 | `(e: MouseEvent) => void` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 按钮内容 |
