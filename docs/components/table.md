# Table 表格

基于 Element Plus `el-table` 的列配置驱动表格，支持插槽列、render 列、多级表头和可选分页。

## 基础用法

:::demo 使用 `columns` 配置快速渲染表格，支持 slot 列。
table/basic
:::

## 操作列

当定义 `#action` 插槽时，会自动生成右侧操作列。

:::demo 当提供 `#action` 插槽时，组件自动追加“操作列”。
table/action
:::

## 前端分页

设置 `frontPagination` 后，会对传入 `data` 自动切片。

:::demo 启用 `frontPagination` 后，按 `currentPage/pageSize` 对 data 切片。
table/pagination
:::

## API

### Props

| 名称 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列配置 | `TableColumn[]` | `[]` |
| data | 表格数据 | `any[]` | `[]` |
| action-column-props | 操作列额外属性（有 `#action` 时生效） | `Record<string, any>` | `{ width: 180, fixed: 'right' }` |
| show-pagination | 是否显示分页 | `boolean` | `false` |
| current-page | 当前页码，支持 `v-model` | `number` | `1` |
| page-size | 每页数量，支持 `v-model` | `number` | `10` |
| page-sizes | 可选每页条数 | `number[]` | `[10,20,50,100]` |
| total | 总条数（后端分页时使用） | `number` | `0` |
| pagination-layout | 分页布局 | `string` | `'total, sizes, prev, pager, next, jumper'` |
| front-pagination | 是否启用前端分页切片 | `boolean` | `false` |

> 其余 `el-table` 原生属性与事件通过 `$attrs` 全量透传，例如 `border`、`stripe`、`row-key`、`@selection-change` 等。

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| size-change | 每页数量变化 | `(size: number) => void` |
| current-change | 当前页变化 | `(page: number) => void` |
| update:current-page | v-model 当前页更新 | `(page: number) => void` |
| update:page-size | v-model 每页数量更新 | `(size: number) => void` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| action | 操作列插槽，自动渲染右侧“操作”列 |
| append | 透传 `el-table` append 插槽 |
| empty | 透传 `el-table` empty 插槽 |
| 自定义列名 | 对应 `columns[].slot` 的单元格插槽 |
| 自定义表头插槽 | 对应 `columns[].headerSlot` 的表头插槽 |
