<template>
  <div>
    <div class="map-demo-toolbar">
      <el-button type="primary" size="small" @click="centerToShanghai">
        切换到上海
      </el-button>
      <el-button type="primary" size="small" @click="centerToShenzhen">
        切换到深圳
      </el-button>
      <el-divider direction="vertical" />
      <el-button size="small" @click="zoomIn">放大</el-button>
      <el-button size="small" @click="zoomOut">缩小</el-button>
    </div>
    <hx-map
      ref="mapRef"
      :center="{ lon: 116.4, lat: 39.9 }"
      :zoom="10"
      height="400px"
      @map-click="handleMapClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { ElMessage, ElButton, ElDivider } from "element-plus"
import { HxMap } from "@whhx/ui"
import type { MapCenter } from "@whhx/ui"

const mapRef = ref()

const handleMapClick = (coordinate: [number, number]) => {
  const [lon, lat] = coordinate
  ElMessage.success(`点击位置：经度 ${lon.toFixed(4)}, 纬度 ${lat.toFixed(4)}`)
}

const centerToShanghai = () => {
  mapRef.value?.setCenter({ lon: 121.47, lat: 31.23 } as MapCenter)
  mapRef.value?.setZoom(12)
}

const centerToShenzhen = () => {
  mapRef.value?.setCenter({ lon: 114.06, lat: 22.54 } as MapCenter)
  mapRef.value?.setZoom(12)
}

const zoomIn = () => {
  const current = mapRef.value?.getZoom()
  if (current !== null && current !== undefined) {
    mapRef.value?.setZoom(Math.min(current + 1, 18))
  }
}

const zoomOut = () => {
  const current = mapRef.value?.getZoom()
  if (current !== null && current !== undefined) {
    mapRef.value?.setZoom(Math.max(current - 1, 3))
  }
}
</script>

<style scoped>
.map-demo-toolbar {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
