# Map 地图

基于 OpenLayers 的地图组件，支持底图切换、标记点聚合、坐标转换等功能。

:::demo 基础地图用法
map/basic
:::

## 控件

通过 `controls` 属性配置地图控件，支持 9 种 OpenLayers 内置控件。

:::demo 地图控件
map/controls
:::

### 控件列表

|| 控件 | 说明 | 默认开启 |
|| --- | --- | --- |
|| zoom | 缩放按钮（+/-） | ✅ |
|| attribution | 版权信息 | ✅ |
|| scaleLine | 比例尺 | ❌ |
|| mousePosition | 鼠标位置坐标 | ❌ |
|| zoomSlider | 滑块式缩放 | ❌ |
|| zoomToExtent | 缩放到指定范围 | ❌ |
|| rotate | 重置地图旋转 | ❌ |
|| overviewMap | 鹰眼图/小地图 | ❌ |
|| fullScreen | 全屏切换 | ❌ |

### 使用方式

```vue
<template>
  <hx-map
    :center="{ lon: 116.4, lat: 39.9 }"
    :zoom="10"
    :controls="{
      // 显式启用默认控件
      zoom: true,
      attribution: { collapsible: true, collapsed: true },
      // 可选控件
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

### 控件配置选项

#### zoom / scaleLine / zoomSlider / rotate / fullScreen

使用布尔值 `true` 启用，或传入配置对象：

|| 属性 | 说明 | 类型 | 默认值 |
|| --- | --- | --- | --- |
|| className | CSS 类名 | `string` | OL 默认 |
|| duration | 动画时长（毫秒） | `number` | `250` |

#### attribution

|| 属性 | 说明 | 类型 | 默认值 |
|| --- | --- | --- | --- |
|| collapsible | 是否可折叠 | `boolean` | `true` |
|| collapsed | 默认折叠状态 | `boolean` | `true` |

#### scaleLine

|| 属性 | 说明 | 类型 | 默认值 |
|| --- | --- | --- | --- |
|| units | 计量单位 | `'metric' \| 'imperial' \| 'nautical' \| 'degrees'` | `'metric'` |
|| minWidth | 最小宽度（像素） | `number` | `64` |
|| bar | 显示为比例条 | `boolean` | `false` |

#### mousePosition

|| 属性 | 说明 | 类型 | 默认值 |
|| --- | --- | --- | --- |
|| projection | 坐标系 | `string` | `'EPSG:3857'` |
|| placeholder | 鼠标离开时的占位文本 | `string` | `'no position'` |

#### zoomToExtent

|| 属性 | 说明 | 类型 | 默认值 |
|| --- | --- | --- | --- |
|| tipLabel | 按钮提示文本 | `string` | `'Fit to extent'` |
|| extent | 目标范围 `[minX, minY, maxX, maxY]`（经纬度） | `[number, number, number, number]` | 地图初始中心附近区域 |

#### overviewMap

|| 属性 | 说明 | 类型 | 默认值 |
|| --- | --- | --- | --- |
|| collapsed | 默认折叠状态 | `boolean` | `true` |

## 标记点

通过 `HxMapMarkers` 组件在地图上添加标记点，支持自定义 popup 内容和聚合模式。

:::demo 基础标记点
map/markers-basic
:::

:::demo 聚合模式
map/markers-cluster
:::

:::demo 分组渲染
map/markers-group
:::

:::demo 自定义样式
map/markers-custom
:::

:::demo 点位图标（混合模式）
map/markers-icon-url
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
| clusterContent | 自定义聚合弹窗内容渲染函数（未传时使用默认统计列表） | `(info: ClusterContentInfo) => VNode \| string` | - |
| groupConfig | 分组配置，设置后启用分组渲染（优先级最高） | `MarkerGroupConfig` | - |

## MapMarkerItem 类型

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| id | 唯一标识 | `string \| number` |
| lon | 经度 | `number` |
| lat | 纬度 | `number` |
| name | 点位名称（可选） | `string` |
| iconUrl | 点位图标 URL（分组渲染时优先使用，rules 配置兜底） | `string` |
| iconSize | 图标渲染尺寸 `[width, height]`（像素） | `[number, number]` |
| iconOriginalSize | 图标原始尺寸 `[width, height]`，用于配合 iconSize 计算缩放比例 | `[number, number]` |
| iconAnchor | 图标锚点（比例） | `[number, number]` |
| [key: string] | 其他自定义字段（可用于分组） | `any` |

---

## 自定义聚合弹窗

通过 `clusterContent` 属性自定义聚合点的弹窗内容。回调接收 `ClusterContentInfo` 上下文：

### ClusterContentInfo 类型

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| features | 聚合点包含的所有标记 Feature | `any[]` |
| count | 聚合数量 | `number` |
| coordinate | 聚合中心投影坐标 | `[number, number]` |
| typeCount | 按 type 字段统计的类型分布 | `Record<string, number>` |

### 示例

```tsx
import type { ClusterContentInfo } from '@hx/ui'

const renderClusterPopup = (info: ClusterContentInfo) => (
  <div style={{ padding: '8px 14px', minWidth: '140px' }}>
    <div style={{ fontWeight: 600, marginBottom: 6 }}>
      📍 {info.count} 个点位
    </div>
    <div>
      {Object.entries(info.typeCount).map(([type, count]) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span>{type}</span>
          <span style={{ fontWeight: 600, color: '#409eff' }}>{count} 个</span>
        </div>
      ))}
    </div>
  </div>
)
```

```vue
<hx-map-markers
  :markers="markers"
  :cluster="true"
  :cluster-content="renderClusterPopup"
  :marker-content="renderPopup"
/>
```

不传 `clusterContent` 时，使用默认的统计列表弹窗（显示类型名称和数量）。

---

::: tip 图标大小控制
当使用 `iconUrl` 设置图标时，可以通过以下方式控制渲染大小：

1. **仅设置 `iconSize`**：假设原始图片尺寸就是 `iconSize`，图标会按该尺寸渲染
2. **同时设置 `iconSize` + `iconOriginalSize`**：`iconOriginalSize` 指定图片真实尺寸，`iconSize` 指定目标渲染尺寸，组件会自动计算缩放比例

```typescript
// 方式1：直接指定渲染尺寸（假设原始图片就是 32x32）
{ iconUrl: '...', iconSize: [32, 32] }

// 方式2：指定原始尺寸 + 目标尺寸（推荐，精确控制）
{ iconUrl: '...', iconOriginalSize: [128, 128], iconSize: [5, 5] }
```
:::

---

## 分组渲染

通过 `groupConfig` 配置实现按字段分组渲染，每个分组可设置独立的渲染样式，并支持分组显隐控制。

### MarkerGroupConfig 类型

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| groupKey | 分组依据的字段名（对应 MapMarkerItem 的属性） | `string` |
| rules | 分组规则列表 | `MarkerGroupRule[]` |
| defaultStyle | 未匹配规则时的默认样式 | `MarkerGroupStyle` |

### MarkerGroupRule 类型

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| value | 分组值（匹配 MapMarkerItem[groupKey]） | `string` |
| style | 该分组的渲染样式 | `MarkerGroupStyle` |

### MarkerGroupStyle 类型

| 属性 | 说明 | 类型 | 适用类型 |
| --- | --- | --- | --- |
| type | 渲染类型 | `'circle' \| 'url' \| 'custom'` | 必填 |
| iconUrl | 图标 URL | `string` | `url` |
| iconSize | 图标渲染尺寸 `[width, height]` | `[number, number]` | `url` |
| iconOriginalSize | 图标原始尺寸 `[width, height]` | `[number, number]` | `url` |
| iconAnchor | 图标锚点（比例） | `[number, number]` | `url` |
| radius | 圆形半径 | `number` | `circle` |
| color | 填充颜色 | `string` | `circle` |
| render | 自定义渲染函数 | `(item) => string \| VNode` | `custom` |

### 示例

```vue
<template>
  <hx-map :center="{ lon: 116.4, lat: 35.0 }" :zoom="5" :height="400">
    <hx-map-markers
      ref="markersRef"
      :markers="markers"
      :group-config="groupConfig"
    />
  </hx-map>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MapMarkerItem, MarkerGroupConfig } from '@hx/ui'

const markers = ref<MapMarkerItem[]>([
  { id: 1, lon: 116.4, lat: 39.9, name: '北京', type: '首都' },
  { id: 2, lon: 121.47, lat: 31.23, name: '上海', type: '直辖市' },
  { id: 3, lon: 113.26, lat: 23.13, name: '广州', type: '省会' },
  { id: 4, lon: 114.06, lat: 22.54, name: '深圳', type: '经济特区' },
])

const groupConfig = ref<MarkerGroupConfig>({
  groupKey: 'type',
  rules: [
    {
      value: '首都',
      style: {
        type: 'url',
        iconUrl: 'https://cdn-icons-png.flaticon.com/128/4479/4479931.png',
        iconSize: [32, 32],
        iconAnchor: [0.5, 1],
      },
    },
    { value: '直辖市', style: { type: 'circle', color: '#409eff', radius: 8 } },
    { value: '省会', style: { type: 'circle', color: '#67c23a', radius: 6 } },
    { value: '经济特区', style: { type: 'custom', render: (item) => item.name + ' 🏙️' } },
  ],
  defaultStyle: { type: 'circle', color: '#909399', radius: 5 },
})

const markersRef = ref()

// 分组显隐控制
markersRef.value?.showGroup('省会')    // 显示省会
markersRef.value?.hideGroup('直辖市')  // 隐藏直辖市
markersRef.value?.toggleGroup('首都')  // 切换首都显隐
markersRef.value?.showAll()            // 显示所有分组
markersRef.value?.hideAll()            // 隐藏所有分组
markersRef.value?.getGroupVisibility() // 获取所有分组可见性状态
</script>
```

### HxMapMarkers 分组暴露方法

通过 `ref` 获取组件实例后调用：

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| showGroup | 显示指定分组 | `(groupValue: string) => void` |
| hideGroup | 隐藏指定分组 | `(groupValue: string) => void` |
| toggleGroup | 切换分组显隐状态 | `(groupValue: string) => void` |
| showAll | 显示所有分组 | `() => void` |
| hideAll | 隐藏所有分组 | `() => void` |
| getGroupVisibility | 获取所有分组的可见性状态 | `() => Record<string, boolean>` |
