<template>
  <div>
    <p class="desc">地图上散布着 30 个随机标记点，距离小于 40px 的标记自动聚合为带数字的圆形。</p>
    <hx-map :center="{ lon: 113.5, lat: 31.5 }" :zoom="7" :height="400">
      <hx-map-cluster :markers="randomMarkers" :distance="40" @cluster-click="handleClusterClick">
        <hx-map-markers :markers="[]" :marker-style="{ shape: 'circle', color: '#409eff', iconSize: [24, 24] }" />
      </hx-map-cluster>
    </hx-map>

    <div v-if="lastClick" class="click-info">
      点击聚合：{{ lastClick }} 个点
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HxMap, HxMapCluster, HxMapMarkers } from '@whhx/ui'
import type { MapMarkerItem } from '@whhx/ui'

// 生成 30 个湖北省内随机点
const cities = [
  { lon: 114.31, lat: 30.52, name: '武汉' },
  { lon: 115.03, lat: 29.99, name: '黄石' },
  { lon: 111.47, lat: 32.65, name: '十堰' },
  { lon: 111.29, lat: 30.69, name: '宜昌' },
  { lon: 112.14, lat: 32.01, name: '襄阳' },
  { lon: 113.37, lat: 31.17, name: '孝感' },
  { lon: 112.24, lat: 30.34, name: '荆州' },
  { lon: 114.87, lat: 30.40, name: '鄂州' },
  { lon: 115.38, lat: 30.78, name: '黄冈' },
  { lon: 113.82, lat: 30.92, name: '咸宁' },
]

const randomMarkers: MapMarkerItem[] = Array.from({ length: 30 }, (_, i) => {
  const base = cities[i % cities.length]
  return {
    id: i + 1,
    lon: base.lon + (Math.random() - 0.5) * 0.3,
    lat: base.lat + (Math.random() - 0.5) * 0.3,
    name: `${base.name}#${Math.floor(i / cities.length) + 1}`,
  }
})

const lastClick = ref<number | null>(null)

function handleClusterClick(info: { count: number }) {
  lastClick.value = info.count
  setTimeout(() => { lastClick.value = null }, 3000)
}
</script>

<style scoped>
.desc {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
}
.click-info {
  margin-top: 12px;
  padding: 8px 16px;
  background: #ecf5ff;
  border-radius: 4px;
  font-size: 14px;
  color: #409eff;
}
</style>