# ContentText 内容文本

用于展示纯文本内容，支持行数截断、展开折叠、复制等交互。

## 基础用法

:::demo 纯文本内容展示，支持行数截断
content-text/basic
:::

## 复制功能

:::demo 通过 `copyable` 开启复制功能
content-text/copyable
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 显示的文本内容 | `string` | — |
| line | 行数限制，超出后显示「展开」按钮，0 表示不限制 | `number` | `0` |
| copyable | 是否支持复制，hover 后显示复制按钮 | `boolean` | `true` |
| placeholder | 内容为空时的占位文本 | `string` | `''` |
| maxHeight | 最大高度（px 或带单位字符串），超出后截断 | `number \| string` | `0` |

## 功能说明

- **行数截断**：通过 `line` 属性限制显示行数，超出后显示「展开」按钮
- **最大高度**：通过 `maxHeight` 属性限制容器高度，超出部分隐藏
- **复制**：鼠标 hover 后显示复制按钮，点击将文本内容写入剪贴板

## 类型定义

```ts
import type { ContentTextProps } from '@hx/ui'
// ContentTextProps:
// content?: string
// line?: number
// copyable?: boolean
// placeholder?: string
// maxHeight?: number | string
