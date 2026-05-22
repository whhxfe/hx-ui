# MapCluster 标记点聚合

将多个近距离的标记点聚合为一个圆形图标，减少地图上的视觉杂乱。需要与 `HxMapMarkers` 配合使用。

## 基本用法

`HxMapCluster` 包裹 `HxMapMarkers` 使用，通过 `markers` 属性传入点位数据，`distance` 控制聚合距离（像素）。

:::demo 基础聚合
map-cluster/basic
:::

---

## HxMapCluster 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| markers | 标记点数据 | `MapMarkerItem[]` | - |
| distance | 聚合距离（像素），小于该距离的标记聚合在一起 | `number` | `40` |
| clusterContent | 自定义聚合弹窗内容 | `(info: ClusterContentInfo) => VNode \| string` | - |

## HxMapCluster 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| clusterClick | 点击聚合点 | `ClusterContentInfo` |

## ClusterContentInfo

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| features | 聚合点包含的所有标记 Feature | `any[]` |
| count | 聚合数量 | `number` |
| coordinate | 聚合中心投影坐标 | `[number, number]` |
| typeCount | 按 type 字段统计的数量 | `Record<string, number>` |