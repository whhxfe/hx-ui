<template>
  <div>
    <div class="demo-toolbar">
      <span>样式类型：</span>
      <el-radio-group v-model="iconMode" size="small">
        <el-radio-button value="circle">圆形</el-radio-button>
        <el-radio-button value="url">图标</el-radio-button>
      </el-radio-group>
    </div>

    <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="7" :height="400">
      <hx-map-markers
        :markers="markers"
        :marker-style="markerStyle"
      >
        <hx-map-popup :render="renderPopup" />
      </hx-map-markers>
    </hx-map>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from "vue"
import { ElRadioGroup, ElRadioButton } from "element-plus"
import { HxMap, HxMapMarkers, HxMapPopup } from "@hx/ui"
import type { MapMarkerItem, MarkerStyleOptions } from "@hx/ui"

const iconMode = ref<'circle' | 'url'>('circle')

const markers: MapMarkerItem[] = [
  { id: 1, lon: 114.31, lat: 30.52, name: '武汉', address: '湖北省武汉市' },
  { id: 2, lon: 115.03, lat: 29.99, name: '黄石', address: '湖北省黄石市' },
  { id: 3, lon: 111.47, lat: 32.65, name: '十堰', address: '湖北省十堰市' },
  { id: 4, lon: 111.29, lat: 30.69, name: '宜昌', address: '湖北省宜昌市' },
  { id: 5, lon: 112.14, lat: 32.01, name: '襄阳', address: '湖北省襄阳市' },
]

const markerStyle = computed<MarkerStyleOptions | undefined>(() => {
  if (iconMode.value === 'url') {
    return {
      iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
      iconSize: [24, 24],
      iconAnchor: [0.5, 1],
    }
  }
  return undefined
})

const renderPopup = (item: MapMarkerItem) => {
  return h('div', { class: 'marker-popup' }, [
    h('div', { class: 'marker-popup__title' }, item.name),
    h('div', { class: 'marker-popup__desc' }, item.address),
  ])
}
</script>

<style scoped>
.demo-toolbar {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
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
