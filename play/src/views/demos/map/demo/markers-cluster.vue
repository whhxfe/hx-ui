<template>
  <div>
    <div class="demo-toolbar">
      <span>聚合开关：</span>
      <el-switch v-model="enableCluster" active-text="开" inactive-text="关" />
      <span class="toolbar-divider"></span>
      <span>弹窗样式：</span>
      <el-radio-group v-model="popupMode" size="small">
        <el-radio-button value="default">默认统计</el-radio-button>
        <el-radio-button value="custom">自定义</el-radio-button>
      </el-radio-group>
      <span class="toolbar-divider"></span>
      <el-text type="info" size="small">缩放地图观察聚合效果</el-text>
    </div>

    <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="6" :height="400">
      <!-- 聚合模式：Cluster 内部嵌套 Markers -->
      <hx-map-cluster
        v-if="enableCluster"
        :markers="markers"
        :distance="50"
        :cluster-content="currentClusterContent"
        @cluster-click="handleClusterClick"
      >
        <!-- 嵌套的 Markers 负责单点渲染和点击 -->
        <hx-map-markers :markers="markers">
          <hx-map-popup :render="renderPopup" />
        </hx-map-markers>
      </hx-map-cluster>

      <!-- 非聚合模式：独立使用 Markers -->
      <template v-else>
        <hx-map-markers :markers="markers">
          <hx-map-popup :render="renderPopup" />
        </hx-map-markers>
      </template>
    </hx-map>
  </div>
</template>

<script setup lang="tsx">
import { ref, computed } from "vue"
import { ElSwitch, ElRadioGroup, ElRadioButton, ElText, ElMessage } from "element-plus"
import { HxMap, HxMapMarkers, HxMapCluster, HxMapPopup } from "@hx/ui"
import type { MapMarkerItem, ClusterContentInfo } from "@hx/ui"

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
const popupMode = ref<'default' | 'custom'>('default')
const markers = generateMarkers(100)

// 自定义聚合弹窗（JSX 语法）
const renderClusterPopup = (info: ClusterContentInfo) => (
  <div class="cluster-custom-wrap">
    <div class="cluster-custom-title">{info.count} 个点位</div>
    <div class="cluster-custom-body">
      {Object.entries(info.typeCount).map(([type, count]) => (
        <div class="cluster-custom-row">
          <span class="cluster-custom-type">{type}</span>
          <span class="cluster-custom-count">{count} 个</span>
        </div>
      ))}
    </div>
  </div>
)

const currentClusterContent = computed(() =>
  popupMode.value === 'custom' ? renderClusterPopup : undefined
)

const renderPopup = (item: MapMarkerItem) => (
  <div class="marker-popup">
    <div class="marker-popup__title">{item.name}</div>
    <div class="marker-popup__desc">{item.address}</div>
  </div>
)

const handleClusterClick = (info: ClusterContentInfo) => {
  ElMessage.info(`点击了聚合点，包含 ${info.count} 个点位`)
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

.cluster-custom-wrap {
  padding: 8px 14px;
  min-width: 140px;
}

.cluster-custom-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
  color: #333;
}

.cluster-custom-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cluster-custom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.cluster-custom-type {
  color: #666;
}

.cluster-custom-count {
  font-weight: 600;
  color: #409eff;
}
</style>
