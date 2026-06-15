<template>
  <ClientOnly>
  <div class="priority-demo">
    <h3>渲染优先级说明（从高到低）</h3>
    <ol class="priority-list">
      <li><code>item.iconUrl</code> — 数据项级 URL 图标（最高）</li>
      <li><code>item.render</code> — 数据项级自定义渲染</li>
      <li><code>markerStyle.render</code> — 组件级自定义渲染</li>
      <li><code>markerStyle.iconUrl</code> — 组件级图标 URL</li>
      <li><code>markerStyle.shape</code> — 注册的自定义形状</li>
      <li><code>circle</code> — 默认圆形（保底）</li>
    </ol>

    <h4>▎场景一：item 级别优先级</h4>
    <p class="desc">markerStyle 只设 shape，数据项通过 <code>iconUrl</code> / <code>render</code> 覆盖</p>
    <div class="legend">
      <span class="legend-item" style="color:#e74c3c">① 武汉：item.iconUrl（地标图标）</span>
      <span class="legend-item" style="color:#8e44ad">② 黄石：item.render（⭐ 表情）</span>
      <span class="legend-item" style="color:#409eff">⑤ 其他：shape="map-marker"</span>
    </div>
    <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="7" :height="400">
      <hx-map-markers :markers="markersScene1" :marker-style="{ shape: 'map-marker', iconSize: [32, 32] }" />
    </hx-map>

    <h4>▎场景二：markerStyle 级别效果</h4>
    <p class="desc">不同 markerStyle 配置产生的不同渲染效果</p>
    <div class="legend">
      <span class="legend-item" style="color:#e67e22">③ markerStyle.render（橙色圆）</span>
      <span class="legend-item" style="color:#2ecc71">④ markerStyle.iconUrl（绿色定位针）</span>
      <span class="legend-item" style="color:#f5a623">⑤ shape="star"（黄色星星）</span>
      <span class="legend-item" style="color:#95a5a6">⑥ circle 默认（灰色圆形）</span>
    </div>
    <hx-map :center="{ lon: 112.5, lat: 31.0 }" :zoom="7" :height="400">
      <hx-map-markers
        :markers="markersScene2A"
        :marker-style="{
          shape: 'map-marker',
          render: markerRenderFn,
          iconSize: [32, 32],
        }"
      />
      <hx-map-markers
        :markers="markersScene2B"
        :marker-style="{
          iconUrl: 'https://cdn-icons-png.flaticon.com/32/456/456283.png',
          iconSize: [32, 32],
          iconAnchor: [0.5, 0.5],
        }"
      />
      <hx-map-markers
        :markers="markersScene2C"
        :marker-style="{
          shape: 'star',
          iconSize: [36, 36],
        }"
      />
      <hx-map-markers
        :markers="markersScene2D"
        :marker-style="{
          shape: 'circle',
          iconSize: [24, 24],
          color: '#95a5a6',
        }"
      />
    </hx-map>
  </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { h } from "vue"
import { HxMap, HxMapMarkers, registerMapMarkerShapes } from "@whhx/ui"
import type { MapMarkerItem, MarkerStyle } from "@whhx/ui"

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

// === 场景一：item 级别优先级 ===
const markersScene1: MapMarkerItem[] = [
  // ① item.iconUrl（最高）
  {
    id: 1, lon: 114.31, lat: 30.52, name: '武汉',
    address: 'item.iconUrl 覆盖所有',
    iconUrl: 'https://cdn-icons-png.flaticon.com/32/684/684908.png',
    iconSize: [32, 32],
    iconAnchor: [0.5, 0.5],
  },
  // ② item.render
  {
    id: 2, lon: 115.03, lat: 29.99, name: '黄石',
    address: 'item.render 覆盖 shape',
    render: () => h('div', {
      style: {
        fontSize: '32px', lineHeight: '1', textAlign: 'center',
        width: '32px', height: '32px',
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
      },
    }, '⭐'),
  },
  // ⑤ shape="map-marker"（markerStyle 兜底）
  { id: 3, lon: 111.47, lat: 32.65, name: '十堰', address: '默认 shape=map-marker' },
  { id: 4, lon: 111.29, lat: 30.69, name: '宜昌', address: '默认 shape=map-marker' },
  { id: 5, lon: 112.14, lat: 32.01, name: '襄阳', address: '默认 shape=map-marker' },
]

// === 场景二：markerStyle 级别效果 ===

// ③ markerStyle.render（组件级自定义渲染）
const markerRenderFn: NonNullable<MarkerStyle['render']> = () =>
  h('div', {
    style: {
      width: '36px', height: '36px',
      background: 'linear-gradient(135deg, #e67e22, #f39c12)',
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: '14px', fontWeight: 'bold',
      boxShadow: '0 2px 6px rgba(230,126,34,0.5)',
      border: '2px solid #fff',
    },
  }, 'R')

const markersScene2A: MapMarkerItem[] = [
  { id: 10, lon: 116.4, lat: 39.9, name: '北京', address: 'markerStyle.render 橙色圆' },
  { id: 11, lon: 121.47, lat: 31.23, name: '上海', address: 'markerStyle.render 橙色圆' },
]

// ④ markerStyle.iconUrl
const markersScene2B: MapMarkerItem[] = [
  { id: 20, lon: 113.26, lat: 23.13, name: '广州', address: 'markerStyle.iconUrl 绿色定位针' },
  { id: 21, lon: 114.06, lat: 22.54, name: '深圳', address: 'markerStyle.iconUrl 绿色定位针' },
]

// ⑤ shape="star"
const markersScene2C: MapMarkerItem[] = [
  { id: 30, lon: 104.07, lat: 30.57, name: '成都', address: 'shape=star 黄色星星' },
  { id: 31, lon: 106.55, lat: 29.56, name: '重庆', address: 'shape=star 黄色星星' },
]

// ⑥ circle 保底
const markersScene2D: MapMarkerItem[] = [
  { id: 40, lon: 108.94, lat: 34.26, name: '西安', address: 'circle 灰色圆形（保底）' },
  { id: 41, lon: 113.66, lat: 34.76, name: '郑州', address: 'circle 灰色圆形（保底）' },
]
</script>

<style scoped>
.priority-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.priority-list {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.8;
  color: #606266;
}

.priority-list code {
  background: #f5f7fa;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
  color: #409eff;
}

h4 {
  margin: 0;
  font-size: 15px;
  color: #303133;
}

.desc {
  margin: 0;
  font-size: 13px;
  color: #909399;
}

.desc code {
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
  margin-bottom: 4px;
}

.legend-item {
  font-weight: 500;
}
</style>