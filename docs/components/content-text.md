# ContentText 内容文本

用于展示纯文本内容，支持 JSON 格式自动识别与语法高亮、展开折叠、复制等交互。

## 基础用法

:::demo 纯文本内容展示，支持行数截断
content-text/basic
:::

## JSON 格式化展示

:::demo 自动检测 JSON 内容并格式化展示，带语法高亮
content-text/json
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
| copyable | 是否支持复制，hover 后显示复制按钮 | `boolean` | `false` |
| placeholder | 内容为空时的占位文本 | `string` | `''` |
| maxHeight | 最大高度（px 或带单位字符串），超出后截断 | `number \| string` | `0` |
| jsonDefaultExpanded | JSON 视图默认是否展开 | `boolean` | `false` |
| jsonIndent | JSON 缩进空格数 | `number` | `2` |

## 功能说明

- **JSON 自动检测**：文本以 `{` 或 `[` 开头且能被 `JSON.parse` 成功解析时，自动渲染为带语法高亮的 JSON 视图
- **语法高亮**：key 蓝色、字符串橙色、数字绿色、布尔/ null 灰色
- **展开折叠**：JSON 视图和普通文本截断均支持展开/折叠，JSON 通过最大高度动画过渡
- **复制**：点击复制按钮将格式化后的内容写入剪贴板，复制成功显示 1.8s「已复制」反馈

## 类型定义

```ts
import type { ContentTextProps } from '@hx/ui'
```
