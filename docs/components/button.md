# Button 按钮

基于 Element Plus 的 `el-button` 二次封装，支持所有 ElButton 原生属性和事件。

## 基础用法

使用 `type` 属性定义按钮样式。

:::demo 展示不同类型、样式变体、状态和尺寸。
button/basic
:::

## API

### Props

继承 `ElButton` 所有属性，常用属性如下：

| 名称 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | - |
| size | 按钮尺寸 | `'large' \| 'default' \| 'small'` | - |
| plain | 是否为朴素按钮 | `boolean` | false |
| round | 是否为圆角按钮 | `boolean` | false |
| circle | 是否为圆形按钮 | `boolean` | false |
| dashed | 是否为虚线边框 | `boolean` | false |
| disabled | 是否禁用 | `boolean` | false |
| loading | 是否加载中 | `boolean` | false |

> 其他 `ElButton` 原生属性均可通过 `v-bind="$attrs"` 透传。

### Events

继承 `ElButton` 所有事件。

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 按钮内容 |
