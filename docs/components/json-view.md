# JsonView JSON 视图

用于展示 JSON 数据结构，带语法高亮、展开/折叠、复制等交互。

## 基础用法

:::demo 展示 JavaScript 对象或数组，带语法高亮，支持展开/折叠
json-view/basic
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | JSON 数据对象（优先级高于从字符串解析） | `Record<string, any> \| any[]` | — |
| content | JSON 字符串（当 `data` 未传入时尝试解析此字符串） | `string` | — |
| default-expanded | 是否默认展开 | `boolean` | `false` |
| indent | JSON 缩进空格数 | `number` | `2` |
| default-collapsed-depth | 默认折叠深度 | `number` | `1` |
| collapsed-node-length | 超过多少字符自动折叠（0 表示不折叠） | `number` | `20` |
| copyable | 是否可以复制 | `boolean` | `true` |

## 功能说明

- **语法高亮**：key 紫色、字符串绿色、数字橙色、布尔/ null 蓝色
- **展开/折叠**：点击顶部的「展开/折叠」按钮切换 JSON 视图状态
- **复制**：点击复制按钮将格式化后的 JSON 写入剪贴板，成功显示「已复制」反馈

## 类型定义

```ts
import type { JsonViewProps } from '@hx/ui'