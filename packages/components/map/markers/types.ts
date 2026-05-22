/**
 * markers 组件内部类型定义
 */

import type { MapMarkerItem, MarkerStyle } from '../types'

// ==================== OpenLayers 基础类型定义 ====================

/** @internal OpenLayers 地图事件 */
export interface OlMapEvent {
  pixel: [number, number]
}

/** @internal OpenLayers 要素 */
export interface OlFeature {
  get(key: string): any
  getGeometry(): { getCoordinates(): [number, number] }
  setStyle(style: any): void
}

/** @internal OpenLayers 矢量源 */
export interface OlVectorSource {
  clear(): void
  addFeature(feature: OlFeature): void
}

/** @internal OpenLayers 矢量图层 */
export interface OlVectorLayer {
  getSource(): OlVectorSource
  setStyle(style: any | ((feature: OlFeature) => any)): void
  changed(): void
}

/** @internal OpenLayers 地图 */
export interface OlMap {
  addLayer(layer: OlVectorLayer): void
  removeLayer(layer: OlVectorLayer): void
  on(event: string, handler: (e: OlMapEvent) => void): any
  forEachFeatureAtPixel(pixel: [number, number], callback: (feature: OlFeature) => boolean): void
}

/** @internal OpenLayers 模块集合 */
export interface OlModules {
  VectorLayer: new (options: { source: OlVectorSource }) => OlVectorLayer
  VectorSource: new () => OlVectorSource
  Feature: new (options: { geometry: any; data: MapMarkerItem }) => OlFeature
  Point: new (coords: [number, number]) => any
  fromLonLat(coords: [number, number]): [number, number]
  unByKey(key: any): void
}

// ==================== 组件 Props ====================

export interface MarkersProps {
  /** 标记点列表 */
  markers: MapMarkerItem[]
  /** 自定义样式配置 */
  markerStyle?: MarkerStyle
}