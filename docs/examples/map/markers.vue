<template>
  <div>
    <div class="map-markers-toolbar">
      <span>聚合模式：</span>
      <el-switch v-model="enableCluster" active-text="开" inactive-text="关" />
    </div>
    <hx-map :center="{ lon: 116.4, lat: 35.0 }" :zoom="5" :height="400">
      <hx-map-markers
        :markers="markers"
        :cluster="enableCluster"
        :marker-radius="5"
        marker-color="#e6a23c"
        :marker-content="renderMarkerContent"
      />
    </hx-map>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from "vue"
import { ElSwitch } from "element-plus"
import { HxMap, HxMapMarkers } from "@hx/ui"
import type { MapMarkerItem } from "@hx/ui"

const markers = ref<MapMarkerItem[]>([
  { id: 1, lon: 116.4, lat: 39.9, name: "北京", address: "北京市朝阳区" },
  { id: 2, lon: 121.47, lat: 31.23, name: "上海", address: "上海市浦东新区" },
  { id: 3, lon: 113.26, lat: 23.13, name: "广州", address: "广州市天河区" },
  { id: 4, lon: 114.06, lat: 22.54, name: "深圳", address: "深圳市南山区" },
  { id: 5, lon: 120.15, lat: 30.28, name: "杭州", address: "杭州市西湖区" },
])

const enableCluster = ref(false)

const renderMarkerContent = (item: MapMarkerItem) => {
  return h("div", { class: "marker-popup" }, [
    h("div", { class: "marker-popup__title" }, item.name),
    h("div", { class: "marker-popup__desc" }, item.address),
  ])
}
</script>

<style scoped>
.map-markers-toolbar {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
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
