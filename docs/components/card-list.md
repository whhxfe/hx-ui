# CardList 卡片列表

基于 CSS Grid 的卡片列表容器，支持前端分页，卡片内容完全由插槽自定义。

## 基本用法

:::demo 使用 `data` 传入数据，通过默认插槽自定义每张卡片的内容。
card-list/basic
:::

## 前端分页

:::demo 启用 `frontPagination` 后，按 `currentPage/pageSize` 对 data 自动切片。
card-list/pagination
:::

## API

### Props

| 名称 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 数据源 | `any[]` | `[]` |
| columns | 每行卡片列数 | `number` | `3` |
| row-gap | 行间距(px) | `number` | `16` |
| column-gap | 列间距(px) | `number` | `16` |
| show-pagination | 是否显示分页 | `boolean` | `false` |
| front-pagination | 是否启用前端分页切片 | `boolean` | `false` |
| current-page | 当前页码，支持 `v-model` | `number` | `1` |
| page-size | 每页数量，支持 `v-model` | `number` | `8` |
| page-sizes | 可选每页条数 | `number[]` | `[8,16,24,48]` |
| total | 总条数（后端分页时使用） | `number` | `0` |
| pagination-layout | 分页布局 | `string` | `'total, sizes, prev, pager, next, jumper'` |
| height | 容器高度，设置后卡片区域将出现滚动条 | `string` | `—` |
| max-height | 容器最大高度，超出后卡片区域出现滚动条 | `string` | `—` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| size-change | 每页数量变化 | `(size: number) => void` |
| current-change | 当前页变化 | `(page: number) => void` |
| update:current-page | v-model 当前页更新 | `(page: number) => void` |
| update:page-size | v-model 每页数量更新 | `(size: number) => void` |

### Slots

| 插槽名 | 作用域 | 说明 |
| --- | --- | --- |
| default | `{ item, index }` | 卡片内容 |
| empty | — | 无数据时显示，默认展示 `el-empty` |
| header | — | 列表顶部区域 |