# Map 地图

基于 OpenLayers 的地图组件，支持底图切换、标记点聚合、坐标转换等功能。

:::demo 基础地图用法
map/basic
:::

## 标记点

通过 `HxMapMarkers` 组件在地图上添加标记点，支持自定义 popup 内容和聚合模式。

:::demo 标记点用法
map/markers
:::

---

## 全局配置

可以通过 `HxConfigProvider` 的 `map` 属性配置全局默认地图参数：

```typescript
<HxConfigProvider :map="{
  normalUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  center: { lon: 116.4, lat: 39.9 },
  zoom: 10
}">
```

### 可用瓦片服务

| 服务 | 标准地图 URL | 说明 |
| --- | --- | --- |
| **ArcGIS** | `https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}` | 完全免费可用，**全球覆盖**（**默认**） |
| **ArcGIS 卫星** | `https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}` | 卫星影像 |
| **OpenStreetMap** | `https://a.tile.openstreetmap.org/{z}/{x}/{y}.png` | 完全免费开源，无需 API Key |
| **天地图** | `https://t0.tianditu.gov.cn/vec_w/wmts?...` | 国内访问快，需申请 Key |

---

## HxMap 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| normalUrl | 标准地图瓦片 URL | `string` | ArcGIS 街道图 |
| satelliteUrl | 卫星地图瓦片 URL | `string` | OpenStreetMap |
| center | 地图中心点 | `{ lon: number, lat: number }` | `{ lon: 116.4, lat: 39.9 }` |
| zoom | 缩放级别 | `number` | `10` |
| maxZoom | 最大缩放级别 | `number` | `19` |
| minZoom | 最小缩放级别 | `number` | `3` |
| width | 地图宽度（支持数字自动加 px） | `string \| number` | `'100%'` |
| height | 地图高度（支持数字自动加 px） | `string \| number` | `'500px'` |
| scrollWheelZoom | 是否启用滚轮缩放 | `boolean` | `true` |

## HxMap 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| mapReady | 地图初始化完成 | `(map: ol/Map) => void` |
| mapClick | 点击地图 | `(coordinate: [lon, lat]) => void` |

## HxMap 暴露方法

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| setCenter | 设置中心点 | `(center: { lon, lat }) => void` |
| setZoom | 设置缩放级别 | `(zoom: number) => void` |
| getCenter | 获取当前中心点 | `() => { lon, lat } \| null` |
| getZoom | 获取当前缩放级别 | `() => number \| null` |
| getMap | 获取原始 ol/Map 实例 | `() => Map \| null` |
| fitExtent | 视野适应范围 | `(extent: [minX, minY, maxX, maxY], padding?: number[]) => void` |

---

## HxMapMarkers 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| markers | 标记点数据 | `MapMarkerItem[]` | `[]` |
| markerRadius | 标记点半径（像素） | `number` | `6` |
| markerColor | 标记点填充颜色 | `string` | `'#ff0000'` |
| markerContent | 点击标记的 popup 内容渲染函数 | `(item: MapMarkerItem) => VNode \| string` | - |
| cluster | 是否启用聚合模式 | `boolean` | `false` |
| clusterDistance | 聚合距离（像素） | `number` | `40` |

## MapMarkerItem 类型

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| id | 唯一标识 | `string \| number` |
| lon | 经度 | `number` |
| lat | 纬度 | `number` |
| [key: string] | 其他自定义字段 | `any` |
