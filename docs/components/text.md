# Text 文本

用于展示不同样式的文本，基于 Element Plus 的 `el-text` 二次封装，支持类型、尺寸、截断等功能。

## 基础用法

使用 `type` 定义文本颜色类型，支持 `primary`、`success`、`warning`、`danger`、`info` 五种类型。

:::demo 展示不同类型、尺寸、截断、自定义标签、可点击文本及配合图标使用。
text/basic
:::

## API

### Props

| 名称       | 说明                                      | 类型                                    | 默认值  |
| ---------- | ----------------------------------------- | --------------------------------------- | ------- |
| type       | 文本类型                                  | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| ''` | `''`   |
| size       | 文本尺寸                                  | `'large' \| 'default' \| 'small'`       | `''`    |
| truncated  | 溢出时显示省略号                          | `boolean`                               | `false` |
| line-clamp | 最大行数，超出显示省略号                  | `number \| string`                     | `undefined` |
| tag        | 自定义标签，默认为 span                    | `string`                               | `'span'` |

> 其余 `ElText` 原生属性均可通过 `v-bind="$attrs"` 透传。

### Events

| 事件名 | 说明     | 回调参数          |
| ------ | -------- | ----------------- |
| click  | 点击事件 | `(e: MouseEvent)` |

### Slots

| 插槽名   | 说明     |
| -------- | -------- |
| default | 文本内容 |