<template>
  <div class="map-combination-demo">
    <p class="overall-desc">
      综合示例展示 HxMap、HxMapCluster、HxMapMarkers、HxMapPopup 组件的组合使用，
      包含聚合功能、自定义样式、多类型标记点、弹窗交互等特性。
    </p>

    <!-- 统计信息 -->
    <div class="stats-panel">
      <div class="stat-item">
        <span class="stat-label">总点数</span>
        <span class="stat-value">{{ totalCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">聚合数</span>
        <span class="stat-value">{{ clusterCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">当前缩放</span>
        <span class="stat-value">{{ currentZoom }}</span>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="control-row">
        <label>
          <span>聚合距离</span>
          <input type="range" v-model.number="clusterDistance" min="20" max="100" />
          <span>{{ clusterDistance }}px</span>
        </label>
        <label>
          <span>标记尺寸</span>
          <input type="range" v-model.number="markerSize" min="16" max="48" />
          <span>{{ markerSize }}px</span>
        </label>
      </div>
      <div class="control-row">
        <label class="checkbox-label">
          <input type="checkbox" v-model="showClusterPopup" />
          <span>显示聚合弹窗</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="showMarkerPopup" />
          <span>显示标记弹窗</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="showLabels" />
          <span>显示标注</span>
        </label>
      </div>
    </div>

    <!-- 地图容器 -->
    <div class="map-wrapper">
      <hx-map
        ref="mapRef"
        :center="{ lon: 112.5, lat: 31.0 }"
        :zoom="7"
        :height="500"
        :scroll-wheel-zoom="true"
        :controls="{
          zoom: true,
          attribution: true,
          scaleLine: true,
          mousePosition: false,
        }"
        @map-ready="onMapReady"
        @map-click="onMapClick"
      >
        <!-- 聚合组件 -->
        <hx-map-cluster
          ref="clusterRef"
          :markers="allMarkers"
          :distance="clusterDistance"
          :cluster-content="customClusterContent"
          @cluster-click="onClusterClick"
        >
          <!-- 标记点组件 -->
          <hx-map-markers
            :markers="[]"
            :marker-style="{
              shape: 'circle',
              color: '#409eff',
              iconSize: [markerSize, markerSize],
            }"
          >
            <!-- 弹窗组件 -->
            <hx-map-popup
              v-if="showMarkerPopup"
              :render="customPopupRender"
              :offset="[0, -markerSize / 2 - 10]"
              :show-close="true"
            />
          </hx-map-markers>
        </hx-map-cluster>
      </hx-map>
    </div>

    <!-- 操作提示 -->
    <div class="tips">
      <p><strong>操作提示：</strong></p>
      <ul>
        <li>点击聚合点：查看聚合详情，自动展开聚合内的标记点</li>
        <li>点击单个标记点：显示标记详情弹窗</li>
        <li>滚轮缩放：当聚合距离内标记点分散开后，显示单个标记</li>
        <li>点击地图空白处：关闭弹窗</li>
      </ul>
    </div>

    <!-- 最近操作日志 -->
    <div v-if="actionLog.length" class="action-log">
      <div class="log-header">
        <span>最近操作</span>
        <button @click="actionLog = []">清除</button>
      </div>
      <div class="log-list">
        <div v-for="(log, idx) in actionLog.slice(-5)" :key="idx" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-type" :class="log.type">{{ log.typeText }}</span>
          <span class="log-content">{{ log.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { HxMap, HxMapCluster, HxMapMarkers, HxMapPopup, registerMapMarkerShapes } from '@hx/ui'
import type { MapMarkerItem, ClusterContentInfo } from '@hx/ui'

// ==================== 注册自定义形状 ====================
registerMapMarkerShapes([
  {
    name: 'hospital',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" fill="currentColor"/>
    </svg>`,
    defaultColor: '#f56c6c',
    size: [24, 24],
  },
  {
    name: 'school',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="currentColor"/>
    </svg>`,
    defaultColor: '#67c23a',
    size: [24, 24],
  },
  {
    name: 'shopping',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h12v12z" fill="currentColor"/>
    </svg>`,
    defaultColor: '#e6a23c',
    size: [24, 24],
  },
])

// ==================== 地图引用 ====================
const mapRef = ref<any>(null)
const clusterRef = ref<any>(null)

// ==================== 响应式状态 ====================
const clusterDistance = ref(50)
const markerSize = ref(24)
const showClusterPopup = ref(true)
const showMarkerPopup = ref(true)
const showLabels = ref(true)
const currentZoom = ref(7)
const clusterCount = ref(0)
const actionLog = ref<Array<{
  time: string
  type: string
  typeText: string
  content: string
}>>([])

// ==================== 数据定义 ====================

// 湖北省城市数据（省会、地级市、区县）
const cityData = [
  // 省会
  { id: 'wh', lon: 114.31, lat: 30.52, name: '武汉市', type: '省会', level: 1, population: 1232 },
  // 地级市
  { id: 'hs', lon: 115.03, lat: 29.99, name: '黄石市', type: '地级市', level: 2, population: 245 },
  { id: 'sy', lon: 111.47, lat: 32.65, name: '十堰市', type: '地级市', level: 2, population: 326 },
  { id: 'yc', lon: 111.29, lat: 30.69, name: '宜昌市', type: '地级市', level: 2, population: 401 },
  { id: 'xy', lon: 112.14, lat: 32.01, name: '襄阳市', type: '地级市', level: 2, population: 527 },
  { id: 'xg', lon: 113.37, lat: 31.17, name: '孝感市', type: '地级市', level: 2, population: 487 },
  { id: 'jz', lon: 112.24, lat: 30.34, name: '荆州市', type: '地级市', level: 2, population: 523 },
  { id: 'ez', lon: 114.87, lat: 30.40, name: '鄂州市', type: '地级市', level: 2, population: 107 },
  { id: 'hg', lon: 115.38, lat: 30.78, name: '黄冈市', type: '地级市', level: 2, population: 579 },
  { id: 'xn', lon: 113.82, lat: 30.92, name: '咸宁市', type: '地级市', level: 2, population: 303 },
  { id: 'sz', lon: 111.51, lat: 31.75, name: '随州市', type: '地级市', level: 2, population: 201 },
  { id: 'jy', lon: 112.98, lat: 30.68, name: '荆门市', type: '地级市', level: 2, population: 287 },
  { id: 'es', lon: 110.67, lat: 31.86, name: '恩施市', type: '地级市', level: 2, population: 402 },
  { id: 'sz1', lon: 113.16, lat: 32.74, name: '随州市', type: '地级市', level: 2, population: 201 },
  { id: 'tm', lon: 112.83, lat: 31.62, name: '天门市', type: '地级市', level: 2, population: 115 },
  { id: 'qjz', lon: 113.03, lat: 30.36, name: '潜江市', type: '地级市', level: 2, population: 96 },
  { id: 'snj', lon: 112.53, lat: 31.02, name: '神农架', type: '地级市', level: 2, population: 7 },
]

// 医院数据
const hospitalData = [
  { id: 'h1', lon: 114.31, lat: 30.52, name: '武汉协和医院', type: '医院', level: 3, beds: 4800 },
  { id: 'h2', lon: 114.35, lat: 30.58, name: '武汉同济医院', type: '医院', level: 3, beds: 6100 },
  { id: 'h3', lon: 112.14, lat: 32.01, name: '襄阳市中心医院', type: '医院', level: 2, beds: 2200 },
  { id: 'h4', lon: 111.29, lat: 30.69, name: '宜昌市中心医院', type: '医院', level: 2, beds: 1800 },
  { id: 'h5', lon: 115.03, lat: 29.99, name: '黄石市中心医院', type: '医院', level: 2, beds: 1200 },
]

// 学校数据
const schoolData = [
  { id: 's1', lon: 114.30, lat: 30.50, name: '武汉大学', type: '学校', level: 3, students: 58000 },
  { id: 's2', lon: 114.27, lat: 30.53, name: '华中科技大学', type: '学校', level: 3, students: 62000 },
  { id: 's3', lon: 112.12, lat: 32.05, name: '湖北文理学院', type: '学校', level: 2, students: 18000 },
  { id: 's4', lon: 111.31, lat: 30.72, name: '三峡大学', type: '学校', level: 2, students: 24000 },
]

// 商场数据
const shoppingData = [
  { id: 'm1', lon: 114.31, lat: 30.51, name: '武商梦时代', type: '商场', level: 3, area: 760000 },
  { id: 'm2', lon: 114.28, lat: 30.58, name: '武汉天地', type: '商场', level: 3, area: 120000 },
  { id: 'm3', lon: 112.16, lat: 31.98, name: '万达广场(襄阳)', type: '商场', level: 2, area: 150000 },
]

// 生成随机区县数据
function generateCountyData() {
  const counties: MapMarkerItem[] = []
  const countyNames = [
    '江夏区', '东西湖区', '汉南区', '蔡甸区', '新洲区', '黄陂区',
    '大冶市', '阳新县', '郧阳区', '郧西县', '竹山县', '房县',
    '夷陵区', '秭归县', '兴山县', '宜都市', '当阳市', '枝江市',
  ]

  cityData.forEach((city, cityIdx) => {
    const numCounties = Math.floor(Math.random() * 3) + 2
    for (let i = 0; i < numCounties; i++) {
      const idx = cityIdx * 3 + i
      if (idx < countyNames.length) {
        counties.push({
          id: `county_${idx}`,
          lon: city.lon + (Math.random() - 0.5) * 0.3,
          lat: city.lat + (Math.random() - 0.5) * 0.3,
          name: countyNames[idx],
          type: '区县',
          level: 3,
          parentCity: city.name,
        })
      }
    }
  })

  return counties
}

// 计算总点数
const totalCount = computed(() => {
  return cityData.length + hospitalData.length + schoolData.length + shoppingData.length + generateCountyData().length
})

// 所有标记点
const allMarkers = computed(() => {
  const counties = generateCountyData()
  return [...cityData, ...hospitalData, ...schoolData, ...shoppingData, ...counties] as MapMarkerItem[]
})

// ==================== 自定义聚合弹窗内容 ====================
function customClusterContent(info: ClusterContentInfo) {
  const { features, count, typeCount } = info

  // 统计各类型数量
  const typeStats = Object.entries(typeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  // 获取部分名称
  const names = features.slice(0, 3).map((f: any) => f.get('data')?.name).filter(Boolean)

  return h('div', { class: 'custom-cluster-popup' }, [
    h('div', { class: 'cluster-header' }, [
      h('span', { class: 'cluster-count' }, `${count} 个点位`),
      h('span', { class: 'cluster-types' }, Object.keys(typeCount).join('、')),
    ]),
    h('div', { class: 'cluster-body' },
      typeStats.map(([type, num]) =>
        h('div', { class: 'cluster-item' }, [
          h('span', { class: 'cluster-type-name' }, type),
          h('span', { class: 'cluster-type-count' }, String(num)),
        ])
      )
    ),
    names.length > 0 && h('div', { class: 'cluster-preview' }, [
      h('span', { class: 'cluster-preview-label' }, '包含：'),
      ...names.map(name => h('span', { class: 'cluster-preview-name' }, name as string)),
    ]),
  ])
}

// ==================== 自定义标记弹窗内容 ====================
function customPopupRender(item: MapMarkerItem) {
  const typeColor: Record<string, string> = {
    '省会': '#f56c6c',
    '地级市': '#409eff',
    '区县': '#67c23a',
    '医院': '#e6a23c',
    '学校': '#909399',
    '商场': '#f56c6c',
  }

  const color = typeColor[item.type as string] || '#409eff'

  return h('div', { class: 'custom-marker-popup' }, [
    h('div', { class: 'popup-header', style: { borderLeftColor: color } }, [
      h('span', { class: 'popup-title' }, item.name),
      h('span', { class: 'popup-type', style: { backgroundColor: color } }, item.type),
    ]),
    h('div', { class: 'popup-body' }, [
      item.population && h('div', { class: 'popup-row' }, [
        h('span', { class: 'popup-label' }, '人口'),
        h('span', { class: 'popup-value' }, `${item.population}万`),
      ]),
      item.beds && h('div', { class: 'popup-row' }, [
        h('span', { class: 'popup-label' }, '床位'),
        h('span', { class: 'popup-value' }, `${item.beds}张`),
      ]),
      item.students && h('div', { class: 'popup-row' }, [
        h('span', { class: 'popup-label' }, '学生'),
        h('span', { class: 'popup-value' }, `${(item.students / 10000).toFixed(1)}万`),
      ]),
      item.area && h('div', { class: 'popup-row' }, [
        h('span', { class: 'popup-label' }, '面积'),
        h('span', { class: 'popup-value' }, `${(item.area / 10000).toFixed(0)}万㎡`),
      ]),
      item.parentCity && h('div', { class: 'popup-row' }, [
        h('span', { class: 'popup-label' }, '所属'),
        h('span', { class: 'popup-value' }, item.parentCity),
      ]),
      h('div', { class: 'popup-row' }, [
        h('span', { class: 'popup-label' }, '坐标'),
        h('span', { class: 'popup-value' }, `${item.lon.toFixed(2)}, ${item.lat.toFixed(2)}`),
      ]),
    ]),
  ])
}

// ==================== 事件处理 ====================
function onMapReady(map: any) {
  addLog('info', '地图就绪', `缩放级别: ${map.getView().getZoom()}`)
  map.getView().on('change:resolution', () => {
    currentZoom.value = map.getView().getZoom()
  })
}

function onMapClick(coordinate: [number, number]) {
  addLog('click', '地图点击', `坐标: ${coordinate[0].toFixed(2)}, ${coordinate[1].toFixed(2)}`)
}

function onClusterClick(info: any) {
  clusterCount.value++
  const names = info.features.slice(0, 3).map((f: any) => f.get('data')?.name).join('、')
  addLog('cluster', '聚合点击', `聚合 ${info.count} 个点位，包含: ${names}...`)
}

function addLog(type: string, typeText: string, content: string) {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

  actionLog.value.push({ time, type, typeText, content })

  // 最多保留 20 条
  if (actionLog.value.length > 20) {
    actionLog.value = actionLog.value.slice(-20)
  }
}
</script>

<style scoped>
.map-combination-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.overall-desc {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

/* 统计面板 */
.stats-panel {
  display: flex;
  gap: 24px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: #fff;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
}

/* 控制面板 */
.control-panel {
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.control-row label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.control-row input[type="range"] {
  width: 100px;
  cursor: pointer;
}

.checkbox-label {
  cursor: pointer;
}

.checkbox-label input {
  cursor: pointer;
}

/* 地图容器 */
.map-wrapper {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 操作提示 */
.tips {
  padding: 12px 16px;
  background: #ecf5ff;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.tips p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #303133;
}

.tips ul {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  color: #606266;
}

.tips li {
  margin-bottom: 4px;
}

/* 操作日志 */
.action-log {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
  font-size: 14px;
  font-weight: 500;
}

.log-header button {
  padding: 2px 8px;
  font-size: 12px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.log-header button:hover {
  background: #f5f7fa;
}

.log-list {
  max-height: 150px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #909399;
  font-family: monospace;
}

.log-type {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.log-type.info {
  background: #ecf5ff;
  color: #409eff;
}

.log-type.click {
  background: #fdf6ec;
  color: #e6a23c;
}

.log-type.cluster {
  background: #f0f9eb;
  color: #67c23a;
}

.log-content {
  color: #606266;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<style lang="scss">
/* 自定义聚合弹窗样式（全局，因为是动态创建的 DOM） */
.custom-cluster-popup {
  padding: 12px;
  min-width: 180px;
}

.cluster-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.cluster-count {
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

.cluster-types {
  font-size: 12px;
  color: #909399;
}

.cluster-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cluster-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;

  &:hover {
    background: #f5f7fa;
    padding: 2px 4px;
    margin: 0 -4px;
    border-radius: 4px;
  }
}

.cluster-type-name {
  color: #606266;
}

.cluster-type-count {
  font-weight: 500;
  color: #409eff;
}

.cluster-preview {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #eee;
  font-size: 12px;
}

.cluster-preview-label {
  color: #909399;
}

.cluster-preview-name {
  color: #409eff;
  margin-left: 4px;

  &::after {
    content: '、';
  }

  &:last-child::after {
    content: '';
  }
}

/* 自定义标记弹窗样式（全局） */
.custom-marker-popup {
  min-width: 160px;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-left: 3px solid;
  background: #f5f7fa;
  border-radius: 0 4px 0 0;
}

.popup-title {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
}

.popup-type {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  color: #fff;
}

.popup-body {
  padding: 8px 12px;
}

.popup-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 13px;
}

.popup-label {
  color: #909399;
}

.popup-value {
  color: #303133;
  font-weight: 500;
}
</style>
