import type { VNode } from 'vue'
import type Map from 'ol/Map'

/** 标记点数据项 */
export interface MapMarkerItem {
  id: string | number
  /** 经度 */
  lon: number
  /** 纬度 */
  lat: number
  [key: string]: any
}

/** 地图中心点 */
export interface MapCenter {
  /** 经度 */
  lon: number
  /** 纬度 */
  lat: number
}

/** 基础地图属性 */
export interface BaseMapProps {
  /** 标准地图瓦片 URL（拼接规则：{z}/{x}/{y}.png） */
  normalUrl?: string
  /** 卫星地图瓦片 URL（拼接规则：{z}/{x}/{y}.jpg） */
  satelliteUrl?: string
  /** 地图中心点 */
  center?: MapCenter
  /** 缩放级别 */
  zoom?: number
  /** 最大缩放级别 */
  maxZoom?: number
  /** 最小缩放级别 */
  minZoom?: number
  /** 地图宽度 */
  width?: string | number
  /** 地图高度 */
  height?: string | number
  /** 是否启用滚轮缩放 */
  scrollWheelZoom?: boolean
}

/** 基础地图事件 */
export interface BaseMapEmits {
  (e: 'mapReady', map: Map): void
  (e: 'mapClick', coordinate: [number, number]): void
}

/** 基础地图暴露方法 */
export interface BaseMapExposed {
  setCenter(center: MapCenter): void
  setZoom(zoom: number): void
  getCenter(): MapCenter | null
  getZoom(): number | null
  getMap(): Map | null
  fitExtent(extent: [number, number, number, number], padding?: number[]): void
}

/** 标记点属性 */
export interface MarkerProps {
  /** 标记点列表 */
  markers: MapMarkerItem[]
  /** 标记点半径（像素） */
  markerRadius?: number
  /** 标记点填充颜色 */
  markerColor?: string
  /** 点击标记后渲染 popup 内容 */
  markerContent?: (item: MapMarkerItem) => VNode | string
  /** 是否启用聚合模式 */
  cluster?: boolean
  /** 聚合距离（像素） */
  clusterDistance?: number
}

/** 默认地图配置 */
export const MAP_CONFIG = {
  normalUrl: 'https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile',
  satelliteUrl: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile',
  center: { lon: 116.4, lat: 39.9 } as MapCenter,
  zoom: 10,
  maxZoom: 18,
  minZoom: 3,
}
