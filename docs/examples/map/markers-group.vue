<template>
  <div>
    <div class="demo-toolbar">
      <el-text type="info" size="small">按类型分组显示不同样式的标记点</el-text>
    </div>

    <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="7" :height="400">
      <!-- 省会标记 -->
      <hx-map-markers
        :markers="provincialMarkers"
        :marker-radius="10"
        marker-color="#f56c6c"
      >
        <hx-map-popup :render="renderProvincialPopup" />
      </hx-map-markers>

      <!-- 地级市标记 -->
      <hx-map-markers
        :markers="prefectureMarkers"
        :marker-radius="8"
        marker-color="#409eff"
      >
        <hx-map-popup :render="renderPrefecturePopup" />
      </hx-map-markers>

      <!-- 区县标记 -->
      <hx-map-markers
        :markers="districtMarkers"
        :marker-radius="6"
        marker-color="#67c23a"
      >
        <hx-map-popup :render="renderDistrictPopup" />
      </hx-map-markers>
    </hx-map>

    <div class="demo-legend">
      <div class="legend-item">
        <span class="legend-dot provincial"></span>
        <span>省会</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot prefecture"></span>
        <span>地级市</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot district"></span>
        <span>区县</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from "vue"
import { ElText } from "element-plus"
import { HxMap, HxMapMarkers, HxMapPopup } from "@hx/ui"
import type { MapMarkerItem } from "@hx/ui"

// 模拟数据
const allMarkers: MapMarkerItem[] = [
  { id: 1, lon: 114.31, lat: 30.52, name: '武汉', address: '湖北省武汉市', type: '省会' },
  { id: 2, lon: 115.03, lat: 29.99, name: '黄石', address: '湖北省黄石市', type: '地级市' },
  { id: 3, lon: 111.47, lat: 32.65, name: '十堰', address: '湖北省十堰市', type: '地级市' },
  { id: 4, lon: 111.29, lat: 30.69, name: '宜昌', address: '湖北省宜昌市', type: '地级市' },
  { id: 5, lon: 112.14, lat: 32.01, name: '襄阳', address: '湖北省襄阳市', type: '地级市' },
  { id: 6, lon: 115.98, lat: 30.20, name: '黄冈', address: '湖北省黄冈市', type: '地级市' },
  { id: 7, lon: 112.19, lat: 30.35, name: '荆州市', address: '湖北省荆州市', type: '地级市' },
  { id: 8, lon: 113.91, lat: 30.93, name: '孝感', address: '湖北省孝感市', type: '地级市' },
  { id: 9, lon: 114.87, lat: 30.46, name: '鄂州', address: '湖北省鄂州市', type: '区县' },
  { id: 10, lon: 112.24, lat: 31.02, name: '荆门', address: '湖北省荆门市', type: '地级市' },
  { id: 11, lon: 109.47, lat: 30.27, name: '恩施', address: '湖北省恩施市', type: '地级市' },
  { id: 12, lon: 113.36, lat: 31.73, name: '随州', address: '湖北省随州市', type: '地级市' },
  { id: 13, lon: 113.47, lat: 29.88, name: '咸宁', address: '湖北省咸宁市', type: '地级市' },
]

// 按类型分组
const provincialMarkers = computed(() =>
  allMarkers.filter(m => m.type === '省会')
)
const prefectureMarkers = computed(() =>
  allMarkers.filter(m => m.type === '地级市')
)
const districtMarkers = computed(() =>
  allMarkers.filter(m => m.type === '区县')
)

// Popup 渲染函数
const createPopupRender = (badgeClass: string) => (item: MapMarkerItem) => {
  return h('div', { class: 'marker-popup' }, [
    h('div', { class: 'marker-popup__title' }, item.name),
    h('div', { class: 'marker-popup__desc' }, item.address),
    h('span', { class: ['marker-popup__badge', badgeClass] }, item.type),
  ])
}

const renderProvincialPopup = createPopupRender('provincial')
const renderPrefecturePopup = createPopupRender('prefecture')
const renderDistrictPopup = createPopupRender('district')
</script>

<style scoped>
.demo-toolbar {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.demo-legend {
  margin-top: 12px;
  display: flex;
  gap: 20px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.provincial {
  background: #f56c6c;
}

.legend-dot.prefecture {
  background: #409eff;
}

.legend-dot.district {
  background: #67c23a;
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
  color: var(--el-text-color-regular);
  margin-bottom: 6px;
}

.marker-popup__badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: var(--el-bg-color);
}

.marker-popup__badge.provincial {
  background: #f56c6c;
}

.marker-popup__badge.prefecture {
  background: #409eff;
}

.marker-popup__badge.district {
  background: #67c23a;
}
</style>
