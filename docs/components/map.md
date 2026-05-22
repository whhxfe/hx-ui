# Map 地图

基于 OpenLayers 的地图组件，支持底图切换、滚轮缩放、控件配置等功能。

:::demo 基础地图用法
map/basic
:::

## 控件

通过 `controls` 属性配置地图控件，支持 9 种 OpenLayers 内置控件。

:::demo 地图控件
map/controls
:::

### 控件列表

| 控件 | 说明 | 默认开启 |
| --- | --- | --- |
| zoom | 缩放按钮（+/-） | ✅ |
| attribution | 版权信息 | ✅ |
| scaleLine | 比例尺 | ❌ |
| mousePosition | 鼠标位置坐标 | ❌ |
| zoomSlider | 滑块式缩放 | ❌ |
| zoomToExtent | 缩放到指定范围 | ❌ |
| rotate | 重置地图旋转 | ❌ |
| overviewMap | 鹰眼图/小地图 | ❌ |
| fullScreen | 全屏切换 | ❌ |

### 使用方式

```vue
<template>
  <hx-map
    :center="{ lon: 116.4, lat: 39.9 }"
    :zoom="10"
    :controls="{
      zoom: true,
      attribution: { collapsible: true, collapsed: true },
      scaleLine: { units: 'metric' },
      mousePosition: { projection: 'EPSG:4326' },
      fullScreen: true,
    }"
  />
</template>
```

### controls 配置说明

- `true`：使用默认配置启用控件
- `false`：禁用控件（仅对默认开启的 `zoom` 和 `attribution` 有效）
- 配置对象：自定义控件选项

---

## 全局配置

可以通过 `HxConfigProvider` 的 `map` 属性配置全局默认地图参数：

```vue
<HxConfigProvider :map="{
  normalUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  center: { lon: 116.4, lat: 39.9 },
  zoom: 10
}">
```

### 可用瓦片服务

| 服务 | 标准地图 URL | 说明 |
| --- | --- | --- |
| **ArcGIS** | `https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}` | 完全免费，**全球覆盖**（**默认**） |
| **ArcGIS 卫星** | `https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}` | 卫星影像 |
| **OpenStreetMap** | `https://a.tile.openstreetmap.org/{z}/{x}/{y}.png` | 开源免费，无需 API Key |
| **天地图** | `https://t0.tianditu.gov.cn/vec_w/wmts?...` | 国内访问快，需申请 Key |

---

## HxMap 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| normalUrl | 标准地图瓦片 URL | `string` | ArcGIS 街道图 |
| satelliteUrl | 卫星地图瓦片 URL | `string` | ArcGIS 卫星图 |
| center | 地图中心点 | `{ lon: number, lat: number }` | `{ lon: 116.4, lat: 39.9 }` |
| zoom | 缩放级别 | `number` | `10` |
| maxZoom | 最大缩放级别 | `number` | `18` |
| minZoom | 最小缩放级别 | `number` | `3` |
| width | 地图宽度（支持数字自动加 px） | `string \| number` | `'100%'` |
| height | 地图高度（支持数字自动加 px） | `string \| number` | `'500px'` |
| scrollWheelZoom | 是否启用滚轮缩放 | `boolean` | `true` |
| controls | 地图控件配置 | `MapControlsConfig` | `{ zoom: true, attribution: true }` |

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