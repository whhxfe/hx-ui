<template>
  <div>
    <p class="demo-desc">点击标记点查看 popup 信息</p>

    <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="7" :height="400">
      <hx-map-markers :markers="markers">
        <hx-map-popup :render="renderPopup" multiple />
      </hx-map-markers>
    </hx-map>
  </div>
</template>

<script setup lang="ts">
import { h } from "vue"
import { HxMap, HxMapMarkers, HxMapPopup } from "@hx/ui"
import type { MapMarkerItem } from "@hx/ui"

const markers: MapMarkerItem[] = [
  { id: 1, lon: 114.31, lat: 30.52, name: '武汉', address: '湖北省武汉市江岸区', type: '省会' },
  { id: 2, lon: 115.03, lat: 29.99, name: '黄石', address: '湖北省黄石市下陆区', type: '地级市' },
  { id: 3, lon: 111.47, lat: 32.65, name: '十堰', address: '湖北省十堰市茅箭区', type: '地级市' },
  { id: 4, lon: 111.29, lat: 30.69, name: '宜昌', address: '湖北省宜昌市西陵区', type: '地级市' },
  { id: 5, lon: 112.14, lat: 32.01, name: '襄阳', address: '湖北省襄阳市襄城区', type: '地级市' },
]

const renderPopup = (item: MapMarkerItem) => {
  return h('div', { class: 'marker-popup' }, [
    h('div', { class: 'marker-popup__title' }, item.name),
    h('div', { class: 'marker-popup__desc' }, item.address),
  ])
}
</script>

<style scoped>
.demo-desc {
  margin: 0 0 12px;
  color: #909399;
  font-size: 14px;
}

.marker-popup {
  min-width: 120px;
}

.marker-popup__title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.marker-popup__desc {
  font-size: 12px;
  color: #666;
}
</style>
