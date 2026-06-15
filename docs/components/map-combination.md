# Map 组件组合

综合示例展示 HxMap、HxMapCluster、HxMapMarkers、HxMapPopup 组件的组合使用方式。

:::demo 组件组合示例
map-combination/basic
:::

## 组件层级结构

组件组合使用时，需要按照以下层级结构嵌套：

```vue
<HxMap>
  <HxMapCluster>
    <HxMapMarkers>
      <HxMapPopup />
    </HxMapMarkers>
  </HxMapCluster>
</HxMap>
```

### 层级说明

| 层级 | 组件 | 说明 |
| --- | --- | --- |
| 1 | HxMap | 地图容器，提供地图实例和基础配置 |
| 2 | HxMapCluster | 聚合组件，管理多个标记点的聚合逻辑 |
| 3 | HxMapMarkers | 标记点组件，渲染实际的地图标记 |
| 4 | HxMapPopup | 弹窗组件，显示标记点的详情信息 |

## 常用组合场景

### 场景一：聚合 + 弹窗

适用于数据点较多、需要按区域聚合查看的场景。

```vue
<template>
  <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="7" :height="500">
    <hx-map-cluster :markers="markers" :distance="50">
      <hx-map-markers :markers="[]" :marker-style="{ shape: 'circle', iconSize: [24, 24] }">
        <hx-map-popup :show-close="true" />
      </hx-map-markers>
    </hx-map-cluster>
  </hx-map>
</template>
```

### 场景二：自定义聚合内容

通过 `clusterContent` 插槽自定义聚合弹窗的显示内容。

```vue
<template>
  <hx-map-cluster
    :markers="markers"
    :distance="50"
    :cluster-content="customClusterContent"
  >
    ...
  </hx-map-cluster>
</template>

<script setup lang="ts">
import { h } from 'vue'
import type { ClusterContentInfo } from '@whhx/ui'

function customClusterContent(info: ClusterContentInfo) {
  return h('div', { class: 'cluster-popup' }, [
    h('div', { class: 'cluster-count' }, `聚合 ${info.count} 个点`)
  ])
}
</script>
```

### 场景三：自定义弹窗内容

通过 `render` 函数自定义标记弹窗的显示内容。

```vue
<template>
  <hx-map-popup :render="customPopupRender" />
</template>

<script setup lang="ts">
import { h } from 'vue'
import type { MapMarkerItem } from '@whhx/ui'

function customPopupRender(item: MapMarkerItem) {
  return h('div', [
    h('div', { class: 'title' }, item.name),
    h('div', { class: 'desc' }, item.address)
  ])
}
</script>
```

### 场景四：独立使用 Markers

如果不使用聚合，可以直接使用 Markers 组件。

```vue
<template>
  <hx-map :center="{ lon: 116.4, lat: 39.9 }" :zoom="10">
    <hx-map-markers :markers="markers" :marker-style="{ shape: 'map-marker' }">
      <hx-map-popup :show-close="true" />
    </hx-map-markers>
  </hx-map>
</template>
```

## 事件处理

| 事件 | 组件 | 说明 |
| --- | --- | --- |
| mapReady | HxMap | 地图初始化完成 |
| mapClick | HxMap | 点击地图空白处 |
| clusterClick | HxMapCluster | 点击聚合点 |

```vue
<template>
  <hx-map @map-ready="onMapReady" @map-click="onMapClick">
    <hx-map-cluster @cluster-click="onClusterClick">
      ...
    </hx-map-cluster>
  </hx-map>
</template>

<script setup lang="ts">
import type { Map } from 'ol'
import type { ClusterContentInfo } from '@whhx/ui'

function onMapReady(map: Map) {
  console.log('地图已就绪')
}

function onMapClick(coordinate: [number, number]) {
  console.log('点击坐标:', coordinate)
}

function onClusterClick(info: ClusterContentInfo) {
  console.log('聚合信息:', info.count, '个点')
}
</script>
```
