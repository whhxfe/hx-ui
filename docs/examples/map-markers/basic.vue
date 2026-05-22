<template>
  <div class="marker-demo">
    <p class="overall-desc">HxMapMarkers 支持多种标记点渲染方式，以下逐一展示每种方式的效果。</p>

    <!-- ==================== 场景一：圆形（默认） ==================== -->
    <h4>▎圆形（默认）</h4>
    <p class="scene-desc">默认渲染方式，通过 <code>color</code> 控制填充色，<code>iconSize</code> 控制直径。</p>
    <div class="legend">
      <span class="legend-item" style="color:#409eff">● 武汉</span>
      <span class="legend-item" style="color:#67c23a">● 黄石</span>
      <span class="legend-item" style="color:#e6a23c">● 十堰</span>
      <span class="legend-item" style="color:#f56c6c">● 宜昌</span>
      <span class="legend-item" style="color:#909399">● 襄阳</span>
    </div>
    <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="7" :height="300">
      <hx-map-markers
        :markers="circleMarkers"
        :marker-style="{ shape: 'circle', color: '#409eff', iconSize: [20, 20] }"
      />
    </hx-map>

    <!-- ==================== 场景二：注册的自定义形状 ==================== -->
    <h4>▎自定义形状</h4>
    <p class="scene-desc">通过 <code>registerMapMarkerShapes</code> 注册 SVG 形状，支持 <code>currentColor</code> 颜色替换。不同形状使用不同的 <code>HxMapMarkers</code> 实例独立配置。</p>
    <div class="shape-row">
      <div class="shape-col">
        <p class="shape-label" style="color:#409eff">map-marker</p>
        <hx-map :center="{ lon: 114.0, lat: 30.3 }" :zoom="8" :height="200">
          <hx-map-markers
            :markers="shapeMarkers"
            :marker-style="{ shape: 'map-marker', iconSize: [32, 32], color: '#409eff' }"
          />
        </hx-map>
      </div>
      <div class="shape-col">
        <p class="shape-label" style="color:#e6a23c">star</p>
        <hx-map :center="{ lon: 111.5, lat: 32.6 }" :zoom="8" :height="200">
          <hx-map-markers
            :markers="shapeMarkersStar"
            :marker-style="{ shape: 'star', iconSize: [32, 32], color: '#e6a23c' }"
          />
        </hx-map>
      </div>
      <div class="shape-col">
        <p class="shape-label" style="color:#67c23a">home-marker</p>
        <hx-map :center="{ lon: 112.14, lat: 32.01 }" :zoom="8" :height="200">
          <hx-map-markers
            :markers="shapeMarkersHome"
            :marker-style="{ shape: 'home-marker', iconSize: [32, 32], color: '#67c23a' }"
          />
        </hx-map>
      </div>
    </div>

    <!-- ==================== 场景三：图标 URL ==================== -->
    <h4>▎图标 URL</h4>
    <p class="scene-desc">通过 <code>markerStyle.iconUrl</code> 或数据项 <code>item.iconUrl</code> 使用外部图片作为标记。</p>
    <div class="legend">
      <span class="legend-item">🏛️ 武汉（item.iconUrl 独立图标）</span>
      <span class="legend-item">🟢 黄石-十堰（markerStyle.iconUrl 兜底）</span>
    </div>
    <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="7" :height="300">
      <hx-map-markers
        :markers="iconUrlMarkers"
        :marker-style="{
          iconUrl: 'https://cdn-icons-png.flaticon.com/32/456/456283.png',
          iconSize: [32, 32],
          iconAnchor: [0.5, 0.5],
        }"
      />
    </hx-map>

    <!-- ==================== 场景四：自定义渲染函数 ==================== -->
    <h4>▎自定义渲染函数</h4>
    <p class="scene-desc">通过 <code>item.render</code> 或 <code>markerStyle.render</code> 返回 <code>VNode</code>，完全控制标记点外观。</p>
    <div class="legend">
      <span class="legend-item">📢 武汉（item.render 蓝色渐变 "W"）</span>
      <span class="legend-item">🎨 黄石-十堰（item.render 渐进色圆环）</span>
      <span class="legend-item">🔴 宜昌-襄阳（markerStyle.render 红色徽章 "M"）</span>
    </div>
    <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="7" :height="300">
      <hx-map-markers
        :markers="renderMarkers"
        :marker-style="{
          shape: 'circle',
          render: markerStyleRenderFn,
          iconSize: [32, 32],
        }"
      />
    </hx-map>

    <!-- ==================== 场景五：混合渲染 ==================== -->
    <h4>▎混合渲染</h4>
    <p class="scene-desc">同一个地图中，不同标记点通过 <code>item.render</code> 和 <code>item.iconUrl</code> 实现各自独立的渲染效果，未覆盖的走 <code>markerStyle</code> 兜底。</p>
    <div class="legend">
      <span class="legend-item">① 武汉（item.render 红色圆形带数字 "1"）</span>
      <span class="legend-item">🟢 黄石（item.iconUrl）</span>
      <span class="legend-item">🎯 十堰（item.render 靶标样式）</span>
      <span class="legend-item" style="color:#409eff">● 宜昌-襄阳（circle 蓝色圆点-兜底）</span>
    </div>
    <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="7" :height="300">
      <hx-map-markers
        :markers="mixedMarkers"
        :marker-style="{ shape: 'circle', iconSize: [20, 20], color: '#409eff' }"
      />
    </hx-map>
  </div>
</template>

<script setup lang="ts">
import { h } from "vue"
import { HxMap, HxMapMarkers, registerMapMarkerShapes } from "@hx/ui"
import type { MapMarkerItem, MarkerStyle } from "@hx/ui"

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
  {
    name: 'home-marker',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/></svg>`,
    defaultColor: '#67c23a',
  },
])

// ==================== 场景一：圆形 ====================
const circleMarkers: MapMarkerItem[] = [
  { id: 1, lon: 114.31, lat: 30.52, name: '武汉' },
  { id: 2, lon: 115.03, lat: 29.99, name: '黄石' },
  { id: 3, lon: 111.47, lat: 32.65, name: '十堰' },
  { id: 4, lon: 111.29, lat: 30.69, name: '宜昌' },
  { id: 5, lon: 112.14, lat: 32.01, name: '襄阳' },
]

// ==================== 场景二：自定义形状 ====================
// 不同形状需要使用不同的 hx-map-markers 实例独立配置 markerStyle
const shapeMarkers: MapMarkerItem[] = [
  { id: 1, lon: 114.31, lat: 30.52, name: '武汉' },
  { id: 2, lon: 115.03, lat: 29.99, name: '黄石' },
]

const shapeMarkersStar: MapMarkerItem[] = [
  { id: 3, lon: 111.47, lat: 32.65, name: '十堰' },
  { id: 4, lon: 111.29, lat: 30.69, name: '宜昌' },
]

const shapeMarkersHome: MapMarkerItem[] = [
  { id: 5, lon: 112.14, lat: 32.01, name: '襄阳' },
]

// ==================== 场景三：图标 URL ====================
const iconUrlMarkers: MapMarkerItem[] = [
  // item.iconUrl（最高优先级：武汉使用独立图标）
  {
    id: 1, lon: 114.31, lat: 30.52, name: '武汉',
    iconUrl: 'https://cdn-icons-png.flaticon.com/32/684/684908.png',
    iconSize: [32, 32],
    iconAnchor: [0.5, 0.5],
  },
  // 其他点位使用 markerStyle.iconUrl 兜底
  { id: 2, lon: 115.03, lat: 29.99, name: '黄石' },
  { id: 3, lon: 111.47, lat: 32.65, name: '十堰' },
  { id: 4, lon: 111.29, lat: 30.69, name: '宜昌' },
  { id: 5, lon: 112.14, lat: 32.01, name: '襄阳' },
]

// ==================== 场景四：自定义渲染函数 ====================

// 组件级自定义渲染函数（markerStyle.render）—— 用于宜昌和襄阳
const markerStyleRenderFn: NonNullable<MarkerStyle['render']> = () =>
  h('div', {
    style: {
      width: '32px', height: '32px',
      background: 'linear-gradient(135deg, #f56c6c, #e74c3c)',
      borderRadius: '8px 8px 8px 0',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: '12px', fontWeight: 'bold',
      boxShadow: '0 2px 6px rgba(245,108,108,0.5)',
      border: '2px solid #fff',
    },
  }, 'M')

// 数据项级自定义渲染函数（item.render）—— 武汉
const wuhanRender = (): any =>
  h('div', {
    style: {
      width: '40px', height: '40px',
      background: 'radial-gradient(circle, #409eff 30%, #2c6fdb 100%)',
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: '16px', fontWeight: 'bold',
      boxShadow: '0 2px 8px rgba(64,158,255,0.6)',
      border: '2px solid #fff',
    },
  }, 'W')

// 渐进色圆环 render
const gradientRender = (): any =>
  h('div', {
    style: {
      width: '28px', height: '28px',
      background: 'conic-gradient(#67c23a, #13c2c2, #67c23a)',
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: '12px', fontWeight: 'bold',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      border: '2px solid #fff',
    },
  }, 'G')

const renderMarkers: MapMarkerItem[] = [
  // ① item.render（最高优先级）
  { id: 1, lon: 114.31, lat: 30.52, name: '武汉', render: wuhanRender },
  // ② item.render 渐进色圆环
  { id: 2, lon: 115.03, lat: 29.99, name: '黄石', render: gradientRender },
  { id: 3, lon: 111.47, lat: 32.65, name: '十堰', render: gradientRender },
  // ③ markerStyle.render 兜底（红色徽章 "M"）
  { id: 4, lon: 111.29, lat: 30.69, name: '宜昌' },
  { id: 5, lon: 112.14, lat: 32.01, name: '襄阳' },
]

// ==================== 场景五：混合渲染 ====================
const mixedMarkers: MapMarkerItem[] = [
  // ① item.render
  {
    id: 1, lon: 114.31, lat: 30.52, name: '武汉',
    render: () => h('div', {
      style: {
        width: '36px', height: '36px',
        background: 'radial-gradient(circle, #f56c6c, #e74c3c)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: '14px', fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(245,108,108,0.6)',
        border: '2px solid #fff',
      },
    }, '1'),
  },
  // ② item.iconUrl
  {
    id: 2, lon: 115.03, lat: 29.99, name: '黄石',
    iconUrl: 'https://cdn-icons-png.flaticon.com/32/456/456283.png',
    iconSize: [32, 32],
    iconAnchor: [0.5, 0.5],
  },
  // ③ item.render 靶标
  {
    id: 3, lon: 111.47, lat: 32.65, name: '十堰',
    render: () => h('div', {
      style: {
        width: '32px', height: '32px',
        background: 'radial-gradient(circle, #e74c3c 20%, #fff 20%, #fff 40%, #e74c3c 40%, #e74c3c 60%, #fff 60%, #fff 80%, #e74c3c 80%)',
        borderRadius: '50%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        border: '2px solid #c0392b',
      },
    }),
  },
  // ④ markerStyle.shape 兜底（circle 蓝色圆点）
  { id: 4, lon: 111.29, lat: 30.69, name: '宜昌' },
  { id: 5, lon: 112.14, lat: 32.01, name: '襄阳' },
]
</script>

<style scoped>
.marker-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.overall-desc {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

h4 {
  margin: 0;
  font-size: 15px;
  color: #303133;
}

.scene-desc {
  margin: 0;
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
}

.scene-desc code {
  background: #f5f7fa;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
  color: #409eff;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 6px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
}

.legend-item {
  font-weight: 500;
}

.shape-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.shape-col {
  flex: 1;
  min-width: 200px;
}

.shape-label {
  margin: 0 0 4px 0;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}
</style>