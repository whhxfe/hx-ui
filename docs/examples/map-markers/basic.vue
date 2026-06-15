<template>
  <ClientOnly>
  <div class="map-markers-verify">
    <p class="overall-desc">
      HxMapMarkers 功能验证示例，验证组件的核心功能点：独立使用、弹窗交互、动态数据更新、样式动态切换、点击事件等。
    </p>

    <!-- ==================== 功能验证区 ==================== -->
    <div class="verify-section">
      <h4>▎验证一：独立使用（无 Cluster）</h4>
      <p class="scene-desc">
        HxMapMarkers 不嵌套在 HxMapCluster 内，独立创建自己的 VectorSource。
        <span v-if="independentReady" class="success-badge">✓ 已就绪</span>
      </p>

      <div class="control-bar">
        <button @click="addRandomMarker" class="ctrl-btn">添加随机点</button>
        <button @click="removeLastMarker" class="ctrl-btn">删除最后一点</button>
        <button @click="resetMarkers" class="ctrl-btn">重置</button>
        <span class="count-label">当前点数：{{ independentMarkers.length }}</span>
      </div>

      <div class="map-wrapper">
        <hx-map
          :center="{ lon: 112.5, lat: 31.0 }"
          :zoom="7"
          :height="350"
          @map-click="onIndependentMapClick"
        >
          <hx-map-markers
            :markers="independentMarkers"
            :marker-style="currentStyle"
            @marker-click="onMarkerClick"
          >
            <hx-map-popup
              v-if="showPopup"
              :render="popupRender"
              :offset="[0, -currentIconSize / 2 - 10]"
              :show-close="true"
            />
          </hx-map-markers>
        </hx-map>
      </div>

      <!-- 点击日志 -->
      <div v-if="clickLogs.length" class="log-panel">
        <div class="log-header">
          <span>点击事件日志</span>
          <button @click="clickLogs = []">清除</button>
        </div>
        <div class="log-content">
          <div v-for="(log, idx) in clickLogs.slice(-5)" :key="idx" class="log-item">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-type" :class="log.type">{{ log.label }}</span>
            <span class="log-msg">{{ log.msg }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 样式切换验证 ==================== -->
    <div class="verify-section">
      <h4>▎验证二：样式动态切换</h4>
      <p class="scene-desc">
        实时切换标记样式，验证 markerStyle 响应式更新。
      </p>

      <div class="style-options">
        <div class="style-row">
          <label>形状：</label>
          <button
            v-for="s in shapeOptions"
            :key="s.value"
            :class="['style-btn', { active: currentStyle.shape === s.value }]"
            @click="currentStyle.shape = s.value"
          >
            {{ s.label }}
          </button>
        </div>
        <div class="style-row">
          <label>颜色：</label>
          <button
            v-for="c in colorOptions"
            :key="c"
            :class="['color-btn', { active: currentStyle.color === c }]"
            :style="{ backgroundColor: c }"
            @click="currentStyle.color = c"
          />
        </div>
        <div class="style-row">
          <label>尺寸：</label>
          <input
            type="range"
            v-model.number="currentIconSize"
            min="16"
            max="48"
            class="size-slider"
          />
          <span class="size-value">{{ currentIconSize }}px</span>
        </div>
      </div>

      <div class="map-wrapper">
        <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="7" :height="280">
          <hx-map-markers
            :markers="styleTestMarkers"
            :marker-style="currentStyle"
          />
        </hx-map>
      </div>
    </div>

    <!-- ==================== 图标 URL 验证 ==================== -->
    <div class="verify-section">
      <h4>▎验证三：图标 URL（支持 item 级别覆盖）</h4>
      <p class="scene-desc">
        item.iconUrl 优先级高于 markerStyle.iconUrl，验证多源图标混合展示。
      </p>

      <div class="map-wrapper">
        <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="7" :height="300">
          <hx-map-markers
            :markers="iconUrlMarkers"
            :marker-style="{
              iconUrl: 'https://cdn-icons-png.flaticon.com/32/456/456283.png',
              iconSize: [32, 32],
            }"
          />
        </hx-map>
      </div>
      <div class="legend">
        <span class="legend-item">🏛️ 武汉（item.iconUrl 独立图标）</span>
        <span class="legend-item">🔵 其他（markerStyle.iconUrl 兜底）</span>
      </div>
    </div>

    <!-- ==================== 自定义渲染验证 ==================== -->
    <div class="verify-section">
      <h4>▎验证四：自定义渲染函数</h4>
      <p class="scene-desc">
        item.render 优先级最高，可完全自定义标记点外观。
      </p>

      <div class="map-wrapper">
        <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="7" :height="300">
          <hx-map-markers
            :markers="renderMarkers"
            :marker-style="{ shape: 'circle', color: '#909399', iconSize: [28, 28] }"
          />
        </hx-map>
      </div>
      <div class="legend">
        <span class="legend-item">① 武汉（数字徽章）</span>
        <span class="legend-item">🎯 黄石（靶标样式）</span>
        <span class="legend-item">⚠️ 十堰（警告三角）</span>
        <span class="legend-item">🔵 宜昌-襄阳（circle 兜底）</span>
      </div>
    </div>

    <!-- ==================== 聚合模式验证 ==================== -->
    <div class="verify-section">
      <h4>▎验证五：嵌套在 Cluster 内使用</h4>
      <p class="scene-desc">
        HxMapMarkers 嵌套在 HxMapCluster 内时，从 ClusterContext 获取 clusterSource 并设置样式回调。
      </p>

      <div class="control-bar">
        <label>
          <span>聚合距离</span>
          <input type="range" v-model.number="clusterDistance" min="20" max="100" class="cluster-slider" />
          <span>{{ clusterDistance }}px</span>
        </label>
      </div>

      <div class="map-wrapper">
        <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="7" :height="300">
          <hx-map-cluster
            :markers="clusterMarkers"
            :distance="clusterDistance"
            @cluster-click="onClusterClick"
          >
            <hx-map-markers
              :markers="[]"
              :marker-style="{ shape: 'circle', color: '#409eff', iconSize: [24, 24] }"
            />
          </hx-map-cluster>
        </hx-map>
      </div>
      <div class="legend">
        <span class="legend-item">聚合模式下 HxMapMarkers 的 markers prop 应传空数组</span>
      </div>
    </div>
  </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, reactive, computed, h } from 'vue'
import { HxMap, HxMapMarkers, HxMapCluster, HxMapPopup, registerMapMarkerShapes } from '@whhx/ui'
import type { MapMarkerItem, MarkerStyle } from '@whhx/ui'

// 注册自定义形状
registerMapMarkerShapes([
  {
    name: 'map-marker',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg>`,
    defaultColor: '#409eff',
  },
  {
    name: 'star',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/></svg>`,
    defaultColor: '#f5a623',
  },
])

// ==================== 验证一：独立使用 ====================
const independentReady = ref(false)
const showPopup = ref(true)
const independentMarkers = ref<MapMarkerItem[]>([
  { id: 1, lon: 114.31, lat: 30.52, name: '武汉市', type: '省会' },
  { id: 2, lon: 115.03, lat: 29.99, name: '黄石市', type: '地级市' },
  { id: 3, lon: 111.47, lat: 32.65, name: '十堰市', type: '地级市' },
  { id: 4, lon: 111.29, lat: 30.69, name: '宜昌市', type: '地级市' },
  { id: 5, lon: 112.14, lat: 32.01, name: '襄阳市', type: '地级市' },
])

const clickLogs = ref<Array<{ time: string; type: string; label: string; msg: string }>>([])

function addLog(type: string, label: string, msg: string) {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
  clickLogs.value.push({ time, type, label, msg })
}

function addRandomMarker() {
  const id = Date.now()
  const lon = 110 + Math.random() * 8
  const lat = 29 + Math.random() * 5
  independentMarkers.value.push({
    id,
    lon,
    lat,
    name: `随机点_${id}`,
    type: '动态添加',
  })
  addLog('add', '添加', `新增点位 (${lon.toFixed(2)}, ${lat.toFixed(2)})`)
}

function removeLastMarker() {
  if (independentMarkers.value.length > 0) {
    const removed = independentMarkers.value.pop()
    addLog('remove', '删除', `删除 ${removed?.name || ''}`)
  }
}

function resetMarkers() {
  independentMarkers.value = [
    { id: 1, lon: 114.31, lat: 30.52, name: '武汉市', type: '省会' },
    { id: 2, lon: 115.03, lat: 29.99, name: '黄石市', type: '地级市' },
    { id: 3, lon: 111.47, lat: 32.65, name: '十堰市', type: '地级市' },
    { id: 4, lon: 111.29, lat: 30.69, name: '宜昌市', type: '地级市' },
    { id: 5, lon: 112.14, lat: 32.01, name: '襄阳市', type: '地级市' },
  ]
  clickLogs.value = []
  addLog('reset', '重置', '恢复到初始数据')
}

function onIndependentMapClick(coordinate: [number, number]) {
  addLog('map', '地图点击', `坐标: (${coordinate[0].toFixed(2)}, ${coordinate[1].toFixed(2)})`)
}

function onMarkerClick(item: MapMarkerItem) {
  addLog('marker', '标记点击', `${item.name} (${item.lon}, ${item.lat})`)
}

function popupRender(item: MapMarkerItem) {
  return h('div', { class: 'verify-popup' }, [
    h('div', { class: 'popup-title' }, item.name),
    h('div', { class: 'popup-info' }, [
      h('span', { class: 'info-label' }, '类型：'),
      h('span', { class: 'info-value' }, item.type),
    ]),
    h('div', { class: 'popup-info' }, [
      h('span', { class: 'info-label' }, '坐标：'),
      h('span', { class: 'info-value' }, `${item.lon.toFixed(2)}, ${item.lat.toFixed(2)}`),
    ]),
  ])
}

// ==================== 验证二：样式切换 ====================
const currentStyle = reactive<MarkerStyle>({
  shape: 'circle',
  color: '#409eff',
  iconSize: [24, 24],
})

const currentIconSize = ref(24)

const shapeOptions = [
  { label: '圆形', value: 'circle' },
  { label: '地图标记', value: 'map-marker' },
  { label: '星形', value: 'star' },
]

const colorOptions = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399']

const styleTestMarkers: MapMarkerItem[] = [
  { id: 1, lon: 114.31, lat: 30.52, name: '武汉' },
  { id: 2, lon: 115.03, lat: 29.99, name: '黄石' },
  { id: 3, lon: 111.47, lat: 32.65, name: '十堰' },
  { id: 4, lon: 111.29, lat: 30.69, name: '宜昌' },
  { id: 5, lon: 112.14, lat: 32.01, name: '襄阳' },
]

// 响应 iconSize 变化
import { watch } from 'vue'
watch(currentIconSize, (val) => {
  currentStyle.iconSize = [val, val]
})

// ==================== 验证三：图标 URL ====================
const iconUrlMarkers: MapMarkerItem[] = [
  {
    id: 1,
    lon: 114.31,
    lat: 30.52,
    name: '武汉',
    iconUrl: 'https://cdn-icons-png.flaticon.com/32/684/684908.png',
    iconSize: [32, 32],
    iconAnchor: [0.5, 0.5],
  },
  { id: 2, lon: 115.03, lat: 29.99, name: '黄石' },
  { id: 3, lon: 111.47, lat: 32.65, name: '十堰' },
  { id: 4, lon: 111.29, lat: 30.69, name: '宜昌' },
  { id: 5, lon: 112.14, lat: 32.01, name: '襄阳' },
]

// ==================== 验证四：自定义渲染 ====================
const renderMarkers: MapMarkerItem[] = [
  // item.render：数字徽章
  {
    id: 1,
    lon: 114.31,
    lat: 30.52,
    name: '武汉',
    render: () =>
      h('div', {
        style: {
          width: '32px',
          height: '32px',
          background: 'radial-gradient(circle, #409eff, #2c6fdb)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(64,158,255,0.6)',
          border: '2px solid #fff',
        },
      }, '1'),
  },
  // item.render：靶标样式
  {
    id: 2,
    lon: 115.03,
    lat: 29.99,
    name: '黄石',
    render: () =>
      h('div', {
        style: {
          width: '32px',
          height: '32px',
          background:
            'radial-gradient(circle, #e74c3c 20%, #fff 20%, #fff 40%, #e74c3c 40%, #e74c3c 60%, #fff 60%, #fff 80%, #e74c3c 80%)',
          borderRadius: '50%',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          border: '2px solid #c0392b',
        },
      }),
  },
  // item.render：警告三角
  {
    id: 3,
    lon: 111.47,
    lat: 32.65,
    name: '十堰',
    render: () =>
      h('div', {
        style: {
          width: 0,
          height: 0,
          borderLeft: '14px solid transparent',
          borderRight: '14px solid transparent',
          borderBottom: '24px solid #e6a23c',
          filter: 'drop-shadow(0 2px 4px rgba(230,162,60,0.5))',
        },
      }),
  },
  // 使用 markerStyle 兜底
  { id: 4, lon: 111.29, lat: 30.69, name: '宜昌' },
  { id: 5, lon: 112.14, lat: 32.01, name: '襄阳' },
]

// ==================== 验证五：聚合模式 ====================
const clusterDistance = ref(50)

const clusterMarkers: MapMarkerItem[] = [
  { id: 1, lon: 114.31, lat: 30.52, name: '武汉市', type: '省会' },
  { id: 2, lon: 114.35, lat: 30.55, name: '武昌区', type: '区县' },
  { id: 3, lon: 114.28, lat: 30.58, name: '汉口区', type: '区县' },
  { id: 4, lon: 115.03, lat: 29.99, name: '黄石市', type: '地级市' },
  { id: 5, lon: 115.05, lat: 30.02, name: '大冶市', type: '区县' },
  { id: 6, lon: 111.47, lat: 32.65, name: '十堰市', type: '地级市' },
  { id: 7, lon: 111.50, lat: 32.68, name: '茅箭区', type: '区县' },
  { id: 8, lon: 111.29, lat: 30.69, name: '宜昌市', type: '地级市' },
  { id: 9, lon: 111.31, lat: 30.72, name: '西陵区', type: '区县' },
  { id: 10, lon: 112.14, lat: 32.01, name: '襄阳市', type: '地级市' },
]

function onClusterClick(info: any) {
  console.log('[Verify] Cluster click:', info)
}
</script>

<style scoped>
.map-markers-verify {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.overall-desc {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.verify-section {
  padding: 16px;
  background: #fafafa;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.verify-section h4 {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #303133;
}

.scene-desc {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
}

.success-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #67c23a;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
}

/* 控制栏 */
.control-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.ctrl-btn {
  padding: 4px 12px;
  font-size: 12px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.ctrl-btn:hover {
  background: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

.count-label {
  font-size: 12px;
  color: #606266;
  margin-left: 8px;
}

/* 地图容器 */
.map-wrapper {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 点击日志 */
.log-panel {
  margin-top: 12px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  font-size: 12px;
}

.log-header button {
  padding: 2px 8px;
  font-size: 11px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 3px;
  cursor: pointer;
}

.log-content {
  max-height: 120px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  font-size: 11px;
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
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
}

.log-type.add { background: #f0f9eb; color: #67c23a; }
.log-type.remove { background: #fef0f0; color: #f56c6c; }
.log-type.reset { background: #ecf5ff; color: #409eff; }
.log-type.map { background: #fdf6ec; color: #e6a23c; }
.log-type.marker { background: #f0f9eb; color: #67c23a; }

.log-msg {
  color: #606266;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 样式选项 */
.style-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  padding: 12px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.style-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.style-row label {
  font-size: 13px;
  color: #606266;
  min-width: 50px;
}

.style-btn {
  padding: 4px 10px;
  font-size: 12px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.style-btn:hover {
  border-color: #409eff;
}

.style-btn.active {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}

.color-btn {
  width: 24px;
  height: 24px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.active {
  border-color: #303133;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px currentColor;
}

.size-slider {
  width: 100px;
  cursor: pointer;
}

.size-value {
  font-size: 12px;
  color: #606266;
  min-width: 40px;
}

.cluster-slider {
  width: 100px;
  cursor: pointer;
}

/* 图例 */
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
  padding: 6px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
}

.legend-item {
  font-weight: 500;
}
</style>

<style lang="scss">
/* 验证弹窗样式（全局） */
.verify-popup {
  min-width: 140px;
  font-size: 13px;
}

.popup-title {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.popup-info {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;

  .info-label {
    color: #909399;
  }

  .info-value {
    color: #606266;
    font-weight: 500;
  }
}
</style>
