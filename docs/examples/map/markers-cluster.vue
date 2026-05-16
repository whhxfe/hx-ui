<template>
  <div>
    <div class="demo-toolbar">
      <span>聚合开关：</span>
      <el-switch v-model="enableCluster" active-text="开" inactive-text="关" />
      <span class="toolbar-divider"></span>
      <el-text type="info" size="small">缩放地图观察聚合效果</el-text>
    </div>

    <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="6" :height="400">
      <hx-map-markers
        :markers="markers"
        :cluster="enableCluster"
        :cluster-distance="50"
        :marker-content="renderPopup"
      />
    </hx-map>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from "vue"
import { ElSwitch, ElText } from "element-plus"
import { HxMap, HxMapMarkers } from "@hx/ui"
import type { MapMarkerItem } from "@hx/ui"

// 湖北区域范围
const HUBEI_BOUNDS = {
  minLon: 108,
  maxLon: 119,
  minLat: 29,
  maxLat: 33,
}

// 生成随机点
const generateMarkers = (count: number): MapMarkerItem[] => {
  const cities = ['武汉', '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州', '恩施', '仙桃', '潜江', '天门', '神农架']
  const districts = ['江区', '湖区', '口区', '阳区', '昌区', '山区', '山区', '北区', '南区', '甸区', '夏区', '陂区', '洲区']
  const markers: MapMarkerItem[] = []

  for (let i = 0; i < count; i++) {
    const lon = HUBEI_BOUNDS.minLon + Math.random() * (HUBEI_BOUNDS.maxLon - HUBEI_BOUNDS.minLon)
    const lat = HUBEI_BOUNDS.minLat + Math.random() * (HUBEI_BOUNDS.maxLat - HUBEI_BOUNDS.minLat)
    const city = cities[Math.floor(Math.random() * cities.length)]
    const district = districts[Math.floor(Math.random() * districts.length)]

    markers.push({
      id: i + 1,
      lon,
      lat,
      name: city,
      address: `湖北省${city}${district}`,
      type: city === '武汉' ? '省会' : Math.random() > 0.3 ? '地级市' : '区县',
    })
  }
  return markers
}

const enableCluster = ref(true)
const markers = generateMarkers(100)

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
  flex-wrap: wrap;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #dcdfe6;
  margin: 0 4px;
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

<style>
/* 聚合详情 popup */
.cluster-popup {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  min-width: 140px;
}

.cluster-popup__header {
  padding: 10px 12px;
  font-weight: 600;
  font-size: 14px;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
}

.cluster-popup__list {
  padding: 8px 0;
}

.cluster-popup__item {
  display: flex;
  justify-content: space-between;
  padding: 4px 12px;
  font-size: 13px;
}

.cluster-popup__item .type {
  color: #606266;
}

.cluster-popup__item .count {
  font-weight: 600;
  color: #409eff;
}

.cluster-popup__footer {
  padding: 8px 12px;
  font-size: 11px;
  color: #909399;
  text-align: center;
  background: #f5f7fa;
  border-top: 1px solid #ebeef5;
}
</style>
