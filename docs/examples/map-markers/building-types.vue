<template>
  <div class="building-types-demo">
    <p class="overall-desc">
      多种建筑类型点位展示示例，使用不同的 shape
      区分建筑类型，支持动态显隐控制。
    </p>

    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="control-header">
        <span class="control-title">类型显隐控制</span>
        <div class="control-actions">
          <button class="ctrl-btn" @click="showAll">显示全部</button>
          <button class="ctrl-btn" @click="hideAll">隐藏全部</button>
          <button class="ctrl-btn" @click="toggleAll">切换</button>
        </div>
      </div>
      <div class="type-toggles">
        <button
          v-for="type in buildingTypes"
          :key="type.id"
          :class="['type-btn', { active: visibleTypes.has(type.id) }]"
          :style="{ '--type-color': type.color }"
          @click="toggleType(type.id)"
        >
          <span class="type-icon" v-html="type.icon"></span>
          <span class="type-name">{{ type.name }}</span>
          <span class="type-count">({{ getVisibleCount(type.id) }})</span>
        </button>
      </div>
      <div class="legend">
        <span class="legend-label">图例：</span>
        <span
          v-for="type in buildingTypes"
          :key="type.id"
          class="legend-item"
          :style="{ color: type.color }"
        >
          <span v-html="type.icon" class="legend-icon"></span>
          {{ type.name }}
        </span>
      </div>
    </div>

    <!-- 地图展示 -->
    <div class="map-wrapper">
      <hx-map :center="{ lon: 116.4, lat: 39.9 }" :zoom="12" :height="500">
        <hx-map-markers
          v-for="type in buildingTypes"
          :key="type.id"
          :markers="visibleTypes.has(type.id) ? type.markers : []"
          :marker-style="{
            shape: type.shape,
            color: type.color,
            iconSize: [28, 28],
          }"
        >
          <hx-map-popup
            :render="popupRender"
            :offset="[0, -24]"
            :show-close="true"
          />
        </hx-map-markers>
      </hx-map>
    </div>

    <!-- 统计信息 -->
    <div class="stats-panel">
      <div class="stats-title">点位统计</div>
      <div class="stats-grid">
        <div v-for="type in buildingTypes" :key="type.id" class="stat-item">
          <span class="stat-icon" v-html="type.icon"></span>
          <span class="stat-name">{{ type.name }}</span>
          <span class="stat-count"
            >{{ getVisibleCount(type.id) }} / {{ type.markers.length }}</span
          >
          <div class="stat-bar">
            <div
              class="stat-bar-fill"
              :style="{
                width: `${(getVisibleCount(type.id) / type.markers.length) * 100}%`,
                backgroundColor: type.color,
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from "vue";
import {
  HxMap,
  HxMapMarkers,
  HxMapPopup,
  registerMapMarkerShapes,
} from "@hx/ui";
import type { MapMarkerItem } from "@hx/ui";

// 注册建筑类型对应的形状
registerMapMarkerShapes([
  {
    name: "hospital",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" fill="currentColor"/>
    </svg>`,
    defaultColor: "#f56c6c",
  },
  {
    name: "school",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" fill="currentColor"/>
    </svg>`,
    defaultColor: "#409eff",
  },
  {
    name: "gas-station",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z" fill="currentColor"/>
    </svg>`,
    defaultColor: "#e6a23c",
  },
  {
    name: "shopping-mall",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M18 6V4l-2-2H4v16h8v2H4c-1.1 0-2-.9-2-2V4h2v2h2V4h2v2h2V4h2v2h2V4h2v2z" fill="currentColor"/>
      <path d="M20 8H4V6h16v2zM20 12H4v-2h16v2zM4 16h8v8H4v-8z" fill="currentColor"/>
      <path d="M14 18v4h-4v-4h4m2-2h-8v8c0 1.1-.9 2-2 2v0c1.1 0 2-.9 2-2v-4h2v4c0 .55-.45 1-1 1v0c-.55 0-1-.45-1-1h-2v-4h8v-2z" fill="currentColor"/>
    </svg>`,
    defaultColor: "#9c27b0",
  },
  {
    name: "bank",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M4 10h3v7H4v-7zm6.5 0h3v7h-3v-7zM2 19h20v3H2v-3zm15-9h3v7h-3v-7zm-5-9L2 6v2h20V6l-10-5z" fill="currentColor"/>
    </svg>`,
    defaultColor: "#795548",
  },
  {
    name: "park",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M17 12h2L12 2 5.05 6.14 12 18l1-5h-4V8l2-5-1.64 3.86L12 10l4.64-3.14L15 8v5h-4l2 5z" fill="currentColor"/>
    </svg>`,
    defaultColor: "#67c23a",
  },
  {
    name: "hotel",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" fill="currentColor"/>
    </svg>`,
    defaultColor: "#00bcd4",
  },
  {
    name: "restaurant",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" fill="currentColor"/>
    </svg>`,
    defaultColor: "#ff7043",
  },
]);

// 建筑类型配置
interface BuildingType {
  id: string;
  name: string;
  color: string;
  shape: string;
  icon: string;
  markers: MapMarkerItem[];
}

const buildingTypes: BuildingType[] = [
  {
    id: "hospital",
    name: "医院",
    color: "#f56c6c",
    shape: "hospital",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" fill="currentColor"/></svg>`,
    markers: [
      { id: "h1", lon: 116.4, lat: 39.9, name: "北京协和医院" },
      { id: "h2", lon: 116.42, lat: 39.88, name: "北京大学第一医院" },
      { id: "h3", lon: 116.38, lat: 39.92, name: "北京朝阳医院" },
      { id: "h4", lon: 116.44, lat: 39.93, name: "北京医院" },
      { id: "h5", lon: 116.35, lat: 39.87, name: "中日友好医院" },
    ],
  },
  {
    id: "school",
    name: "学校",
    color: "#409eff",
    shape: "school",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" fill="currentColor"/></svg>`,
    markers: [
      { id: "s1", lon: 116.32, lat: 39.95, name: "清华大学" },
      { id: "s2", lon: 116.31, lat: 39.99, name: "北京大学" },
      { id: "s3", lon: 116.45, lat: 39.92, name: "中国人民大学" },
      { id: "s4", lon: 116.28, lat: 39.87, name: "北京师范大学" },
      { id: "s5", lon: 116.48, lat: 39.85, name: "北京航空航天大学" },
      { id: "s6", lon: 116.37, lat: 39.98, name: "北京理工大学" },
    ],
  },
  {
    id: "gas-station",
    name: "加油站",
    color: "#e6a23c",
    shape: "gas-station",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z" fill="currentColor"/></svg>`,
    markers: [
      { id: "g1", lon: 116.4, lat: 39.85, name: "中石化朝阳加油站" },
      { id: "g2", lon: 116.35, lat: 39.92, name: "中石油建国路加油站" },
      { id: "g3", lon: 116.48, lat: 39.9, name: "壳牌东四加油站" },
      { id: "g4", lon: 116.28, lat: 39.88, name: "中石化望京加油站" },
      { id: "g5", lon: 116.43, lat: 39.96, name: "中石油和平里加油站" },
      { id: "g6", lon: 116.33, lat: 39.85, name: "道达尔石景山加油站" },
    ],
  },
  {
    id: "shopping-mall",
    name: "商场",
    color: "#9c27b0",
    shape: "shopping-mall",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M18 6V4l-2-2H4v16h8v2H4c-1.1 0-2-.9-2-2V4h2v2h2V4h2v2h2V4h2v2h2V4h2v2z" fill="currentColor"/><path d="M20 8H4V6h16v2zM20 12H4v-2h16v2zM4 16h8v8H4v-8z" fill="currentColor"/></svg>`,
    markers: [
      { id: "m1", lon: 116.4, lat: 39.9, name: "王府井百货" },
      { id: "m2", lon: 116.38, lat: 39.93, name: "国贸商城" },
      { id: "m3", lon: 116.45, lat: 39.87, name: "朝阳大悦城" },
      { id: "m4", lon: 116.3, lat: 39.88, name: "西单大悦城" },
      { id: "m5", lon: 116.42, lat: 39.97, name: "三里屯太古里" },
    ],
  },
  {
    id: "bank",
    name: "银行",
    color: "#795548",
    shape: "bank",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 10h3v7H4v-7zm6.5 0h3v7h-3v-7zM2 19h20v3H2v-3zm15-9h3v7h-3v-7zm-5-9L2 6v2h20V6l-10-5z" fill="currentColor"/></svg>`,
    markers: [
      { id: "b1", lon: 116.41, lat: 39.91, name: "中国工商银行" },
      { id: "b2", lon: 116.4, lat: 39.92, name: "中国建设银行" },
      { id: "b3", lon: 116.39, lat: 39.9, name: "中国银行" },
      { id: "b4", lon: 116.42, lat: 39.89, name: "中国农业银行" },
      { id: "b5", lon: 116.38, lat: 39.91, name: "招商银行" },
      { id: "b6", lon: 116.43, lat: 39.93, name: "交通银行" },
    ],
  },
  {
    id: "park",
    name: "公园",
    color: "#67c23a",
    shape: "park",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M17 12h2L12 2 5.05 6.14 12 18l1-5h-4V8l2-5-1.64 3.86L12 10l4.64-3.14L15 8v5h-4l2 5z" fill="currentColor"/></svg>`,
    markers: [
      { id: "p1", lon: 116.4, lat: 39.93, name: "天安门广场" },
      { id: "p2", lon: 116.33, lat: 39.95, name: "颐和园" },
      { id: "p3", lon: 116.28, lat: 39.99, name: "圆明园" },
      { id: "p4", lon: 116.47, lat: 39.92, name: "朝阳公园" },
      { id: "p5", lon: 116.35, lat: 39.86, name: "玉渊潭公园" },
      { id: "p6", lon: 116.42, lat: 39.97, name: "地坛公园" },
    ],
  },
  {
    id: "hotel",
    name: "酒店",
    color: "#00bcd4",
    shape: "hotel",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" fill="currentColor"/></svg>`,
    markers: [
      { id: "ht1", lon: 116.41, lat: 39.9, name: "北京饭店" },
      { id: "ht2", lon: 116.39, lat: 39.91, name: "王府半岛酒店" },
      { id: "ht3", lon: 116.44, lat: 39.91, name: "中国大饭店" },
      { id: "ht4", lon: 116.37, lat: 39.88, name: "希尔顿酒店" },
      { id: "ht5", lon: 116.43, lat: 39.87, name: "JW万豪酒店" },
    ],
  },
  {
    id: "restaurant",
    name: "餐饮",
    color: "#ff7043",
    shape: "restaurant",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" fill="currentColor"/></svg>`,
    markers: [
      { id: "r1", lon: 116.4, lat: 39.91, name: "全聚德烤鸭店" },
      { id: "r2", lon: 116.41, lat: 39.89, name: "东来顺火锅" },
      { id: "r3", lon: 116.38, lat: 39.92, name: "便宜坊烤鸭" },
      { id: "r4", lon: 116.42, lat: 39.88, name: "豆花餐厅" },
      { id: "r5", lon: 116.36, lat: 39.9, name: "鸿茅老字号" },
      { id: "r6", lon: 116.45, lat: 39.9, name: "新辣道鱼火锅" },
    ],
  },
];

// 可见性控制
const visibleTypes = ref<Set<string>>(new Set(buildingTypes.map((t) => t.id)));

function toggleType(id: string) {
  if (visibleTypes.value.has(id)) {
    visibleTypes.value.delete(id);
  } else {
    visibleTypes.value.add(id);
  }
  visibleTypes.value = new Set(visibleTypes.value);
}

function showAll() {
  visibleTypes.value = new Set(buildingTypes.map((t) => t.id));
}

function hideAll() {
  visibleTypes.value = new Set();
}

function toggleAll() {
  if (visibleTypes.value.size === buildingTypes.length) {
    hideAll();
  } else {
    showAll();
  }
}

function getVisibleCount(typeId: string): number {
  return buildingTypes.find((t) => t.id === typeId)?.markers.length ?? 0;
}

// Popup 渲染函数
function popupRender(item: MapMarkerItem) {
  const type = buildingTypes.find((t) =>
    t.markers.some((m) => m.id === item.id),
  );
  return h("div", { class: "marker-popup" }, [
    h("div", { class: "popup-header" }, [
      h("span", { class: "popup-icon", style: { color: type?.color } }, [
        h("span", { innerHTML: type?.icon ?? "" }),
      ]),
      h("span", { class: "popup-title" }, item.name),
    ]),
    h("div", { class: "popup-body" }, [
      h("div", { class: "popup-row" }, [
        h("span", { class: "popup-label" }, "类型："),
        h("span", { class: "popup-value" }, type?.name ?? "-"),
      ]),
      h("div", { class: "popup-row" }, [
        h("span", { class: "popup-label" }, "坐标："),
        h(
          "span",
          { class: "popup-value" },
          `${item.lon.toFixed(4)}, ${item.lat.toFixed(4)}`,
        ),
      ]),
    ]),
  ]);
}
</script>

<style scoped>
.building-types-demo {
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

/* 控制面板 */
.control-panel {
  padding: 16px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.control-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.control-actions {
  display: flex;
  gap: 8px;
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

.type-toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.type-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 13px;
  border: 2px solid #e4e7ed;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.type-btn:hover {
  border-color: var(--type-color);
  background: #f5f7fa;
}

.type-btn.active {
  border-color: var(--type-color);
  background: color-mix(in srgb, var(--type-color) 10%, white);
}

.type-icon {
  display: flex;
  align-items: center;
  color: var(--type-color);
}

.type-icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.type-name {
  font-weight: 500;
  color: #303133;
}

.type-count {
  font-size: 12px;
  color: #909399;
}

/* 图例 */
.legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
}

.legend-label {
  font-weight: 600;
  color: #606266;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-icon {
  display: flex;
  align-items: center;
}

.legend-icon :deep(svg) {
  width: 14px;
  height: 14px;
}

/* 地图容器 */
.map-wrapper {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 统计面板 */
.stats-panel {
  padding: 16px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.stats-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.stat-icon {
  display: flex;
  align-items: center;
}

.stat-icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.stat-name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
}

.stat-count {
  font-size: 12px;
  color: #909399;
  margin-left: auto;
}

.stat-bar {
  width: 100%;
  height: 4px;
  background: #e4e7ed;
  border-radius: 2px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}
</style>

<style lang="scss">
/* 标记点弹窗样式 */
.marker-popup {
  min-width: 160px;
  font-size: 13px;
}

.popup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.popup-icon {
  display: flex;
  align-items: center;
}

.popup-icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.popup-title {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
}

.popup-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.popup-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-label {
  color: #909399;
}

.popup-value {
  color: #606266;
  font-weight: 500;
}
</style>
