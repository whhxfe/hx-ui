# RelationGraph 人物关系图

基于 `@antv/g6` 封装的关系图组件，用于展示人物之间的关联关系。

## 安装

### 依赖

```bash
pnpm add @antv/g6
```

## 基础用法

:::demo 传入节点 `nodes` 和关系边 `edges` 数据即可渲染关系图。
relation-graph/basic
:::

## 自定义节点样式

:::demo 通过 `style` 属性为节点设置图片、大小和边框颜色。
relation-graph/avatar
:::

## 径向布局

:::demo 通过 `layoutType="radial"` 使用径向布局，适合展示层级关系。
relation-graph/radial
:::

## 折叠展开

:::demo 通过 `collapsible` 启用折叠展开功能，双击节点可切换其子节点的显示/隐藏。
relation-graph/collapsible
:::

## 带小地图

:::demo 通过 `showMinimap` 显示小地图，方便浏览大规模关系网络。
relation-graph/minimap
:::

## 节点事件

:::demo 支持节点点击和双击事件，可在事件回调中获取节点数据。
relation-graph/event
:::

## 通讯关系

:::demo 展示人物及其虚拟账号（电话、微信、QQ、抖音等）。账号自动展开为独立节点并连线到人物。
relation-graph/contact
:::

## 全局配置

可通过 `HxConfigProvider` 在应用顶层统一配置关系图的默认值：

```vue
<template>
  <HxConfigProvider :relationGraph="{ showSearch: false, nodeMenu: false }">
    <App />
  </HxConfigProvider>
</template>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| nodes | 人物节点列表 | `RelationNode[]` | `[]` |
| edges | 关系边列表 | `RelationEdge[]` | `[]` |
| width | 画布宽度 | `number \| string` | `'100%'` |
| height | 画布高度 | `number \| string` | `'500px'` |
| showSearch | 是否显示搜索框 | `boolean` | `true` |
| nodeMenu | 是否启用节点点击菜单 | `boolean` | `true` |
| showMinimap | 是否显示小地图 | `boolean` | `false` |
| layoutType | 布局类型 | `'force' \| 'radial'` | `'force'` |
| unitRadius | 径向布局每层半径 | `number` | `100` |
| linkDistance | 边长度 | `number` | `120` |
| nodeSize | 节点默认大小 | `number` | `60` |
| collapsible | 是否启用折叠展开 | `boolean` | `false` |
| defaultIcon | 默认图标配置 | `RelationGraphIconConfig` | `{ type: 'iconify', icon: 'mdi:account' }` |

### RelationNode 节点数据

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 节点唯一标识 | `string` | - |
| name | 姓名 | `string` | - |
| avatar | 头像 URL | `string` | - |
| role | 职位/角色 | `string` | - |
| gender | 性别（用于默认头像） | `'male' \| 'female' \| 'unknown'` | - |
| contactAccounts | 关联的虚拟账号列表 | `ContactAccount[]` | - |
| nodeType | 节点类型 | `'person' \| 'account'` | `'person'` |
| style | 节点样式配置 | `RelationNodeStyle` | - |
| [key: string] | 其他自定义字段 | `unknown` | - |

### ContactAccount 虚拟账号

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 账号类型 | `AccountType` | - |
| value | 账号值 | `string` | - |

### AccountType 账号类型

`'phone' \| 'qq' \| 'weixin' \| 'douyin' \| 'email' \| 'other'`

| 类型 | 说明 | 图标 |
| --- | --- | --- |
| phone | 电话 | `lucide:phone` |
| qq | QQ | `logos:qq` |
| weixin | 微信 | `logos:wechat` |
| douyin | 抖音 | `logos:tiktok` |
| email | 邮箱 | `lucide:mail` |
| other | 其他 | `lucide:at-sign` |

### RelationNodeStyle 节点样式

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 节点大小 | `number` | `60` |
| img | 头像/图标 URL | `string` | - |
| stroke | 边框颜色 | `string` | `'#5B8FF9'` |

### RelationEdge 边数据

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| source | 源节点 ID | `string` | - |
| target | 目标节点 ID | `string` | - |
| label | 关系标签 | `string` | - |
| data | 边数据配置 | `RelationEdgeData` | - |
| [key: string] | 其他自定义字段 | `unknown` | - |

### RelationEdgeData 边数据配置

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| stroke | 边的颜色 | `string` | `'#b1b1b1'` |
| label | 关系标签 | `string` | - |

### RelationGraphIconConfig 默认图标配置

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 图标类型 | `'svg' \| 'iconify'` | `'iconify'` |
| svg | SVG symbol id（type 为 svg 时使用） | `string` | - |
| icon | iconify 图标名（type 为 iconify 时使用） | `string` | `'mdi:account'` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| node-click | 点击节点 | `(event: RelationNodeClickEvent) => void` |
| node-dblclick | 双击节点 | `(event: RelationNodeClickEvent) => void` |

### RelationNodeClickEvent

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| node | 节点数据 | `RelationNode` |
| x | 点击位置的 X 坐标 | `number` |
| y | 点击位置的 Y 坐标 | `number` |

### 类型定义

```ts
import type { RelationGraphProps, RelationNode, RelationEdge, RelationNodeStyle, RelationEdgeData, RelationGraphIconConfig, RelationNodeClickEvent, AccountType, ContactAccount } from '@hx/ui'
```
