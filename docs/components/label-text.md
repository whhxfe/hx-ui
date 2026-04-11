# LabelText 标签文本

用于展示标签和文本的左右布局，常用于表单详情页、数据展示等场景。

## 基础用法

使用 `label` 和 `text` 属性展示简单的标签文本。

:::demo 基础用法
label-text/basic
:::

## 尺寸

通过 `size` 属性设置尺寸大小。

:::demo small / default / large
label-text/size
:::

## 固定宽度

通过 `label-width` 设置标签宽度。

:::demo 设置固定宽度，如 100px 或百分比
label-text/label-width
:::

## 文本行数限制

通过 `text-line` 限制文本显示行数，超出部分省略。

:::demo 设置文本行数限制
label-text/text-line
:::

## 自定义对齐

通过 `align` 和 `label-align` 设置对齐方式。

:::demo align-items 对齐 / label 文本对齐
label-text/align
:::

## 插槽使用

使用默认插槽自定义文本内容。

:::demo 通过插槽插入富文本或自定义内容
label-text/slot
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签文本 | string | - |
| text | 展示文本（插槽优先） | string | - |
| size | 尺寸 | 'small' \| 'default' \| 'large' | 'default' |
| align | Flex 交叉轴对齐方式 | AlignType | 'center' |
| label-width | 标签宽度 | string \| number | 'auto' |
| label-align | 标签水平对齐方式 | 'left' \| 'center' \| 'right' | 'left' |
| label-wrap | 标签是否换行 | boolean | false |
| text-wrap | 文本是否换行 | boolean | true |
| text-line | 文本显示行数（0=不限制） | number | 0 |

### AlignType

```typescript
type AlignType = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
```

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义文本内容（优先于 text 属性） |
