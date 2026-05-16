import type { VNode } from 'vue'
import type Map from 'ol/Map'

/** 标记点数据项 */
export interface MapMarkerItem {
  id: string | number
  /** 经度 */
  lon: number
  /** 纬度 */
  lat: number
  /** 点位名称 */
  name?: string
  /** 点位图标 URL（优先使用，rules 配置兜底） */
  iconUrl?: string
  /** 图标渲染尺寸 [width, height]（像素） */
  iconSize?: [number, number]
  /** 图标原始尺寸 [width, height]，用于配合 iconSize 计算缩放比例 */
  iconOriginalSize?: [number, number]
  /** 图标锚点（相对于图标尺寸的比例） */
  iconAnchor?: [number, number]
  /** 扩展信息（用于自定义 popup 内容） */
  extra?: Record<string, string>
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
  /** 标准地图瓦片 URL（拼接规则：{z}/{y}/{x}.png） */
  normalUrl?: string
  /** 卫星地图瓦片 URL（拼接规则：{z}/{y}/{x}.jpg） */
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
  /** 地图控件配置 */
  controls?: MapControlsConfig
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

/** 标记点渲染样式选项 */
export interface MarkerStyleOptions {
  /** 图标 URL（优先级高于默认圆形） */
  iconUrl?: string
  /** 图标渲染尺寸 [width, height]（像素） */
  iconSize?: [number, number]
  /** 图标原始尺寸 [width, height]，用于配合 iconSize 计算缩放比例 */
  iconOriginalSize?: [number, number]
  /** 图标锚点（相对于图标尺寸的比例，默认为底部中心 [0.5, 1]） */
  iconAnchor?: [number, number]
  /** 自定义渲染函数（返回 HTML 字符串或 VNode） */
  render?: (item: MapMarkerItem) => string | VNode
}

/** 分组渲染类型 */
export type MarkerGroupRenderType = 'circle' | 'url' | 'custom'

/** 分组渲染规则 */
export interface MarkerGroupStyle {
  /** 渲染类型 */
  type: MarkerGroupRenderType
  /** 图标 URL（type='url' 时使用） */
  iconUrl?: string
  /** 图标渲染尺寸 [width, height] */
  iconSize?: [number, number]
  /** 图标原始尺寸 [width, height]，用于配合 iconSize 计算缩放比例 */
  iconOriginalSize?: [number, number]
  /** 图标锚点 */
  iconAnchor?: [number, number]
  /** 自定义渲染函数（type='custom' 时使用） */
  render?: (item: MapMarkerItem) => string | VNode
  /** 圆形半径（type='circle' 时使用） */
  radius?: number
  /** 圆形填充颜色 */
  color?: string
}

/** 分组规则 */
export interface MarkerGroupRule {
  /** 分组值（匹配 MapMarkerItem[groupKey]） */
  value: string
  /** 渲染样式 */
  style: MarkerGroupStyle
}

/** 分组配置 */
export interface MarkerGroupConfig {
  /** 分组键名（对应 MapMarkerItem 的字段） */
  groupKey: string
  /** 分组规则列表 */
  rules: MarkerGroupRule[]
  /** 默认渲染规则（未匹配时使用） */
  defaultStyle?: MarkerGroupStyle
}

/** 聚合弹窗上下文 */
export interface ClusterContentInfo {
  /** 聚合点包含的所有标记 Feature */
  features: any[]
  /** 聚合数量 */
  count: number
  /** 聚合中心投影坐标 */
  coordinate: [number, number]
  /** 按 type 字段统计的数量 */
  typeCount: Record<string, number>
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
  /** 自定义聚合弹窗内容（未传时使用默认统计列表） */
  clusterContent?: (info: ClusterContentInfo) => VNode | string
  /** 自定义样式选项（优先级高于 markerRadius/markerColor） */
  markerStyle?: MarkerStyleOptions
}

/** 默认地图配置 */
export const MAP_CONFIG = {
  // ArcGIS 瓦片格式为 {z}/{y}/{x}
  normalUrl: 'https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  satelliteUrl: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  center: { lon: 116.4, lat: 39.9 } as MapCenter,
  zoom: 10,
  maxZoom: 18,
  minZoom: 3,
}

// ==================== 地图控件配置类型 ====================

/** 控件类型 */
export type MapControlType =
  | 'zoom'
  | 'attribution'
  | 'scaleLine'
  | 'mousePosition'
  | 'zoomSlider'
  | 'zoomToExtent'
  | 'rotate'
  | 'overviewMap'
  | 'fullScreen'

/** 缩放按钮配置 */
export interface ZoomControlOptions {
  duration?: number
  className?: string
  delta?: number
}

/** 版权信息配置 */
export interface AttributionControlOptions {
  collapsible?: boolean
  collapsed?: boolean
}

/** 比例尺配置 */
export interface ScaleLineControlOptions {
  units?: 'metric' | 'imperial' | 'nautical' | 'degrees'
  minWidth?: number
  bar?: boolean
  steps?: number
  text?: boolean
}

/** 鼠标位置配置 */
export interface MousePositionControlOptions {
  projection?: string
  placeholder?: string
}

/** 滑块缩放配置 */
export interface ZoomSliderControlOptions {
  duration?: number
}

/** 缩放到范围配置 */
export interface ZoomToExtentControlOptions {
  tipLabel?: string
  extent?: [number, number, number, number]
}

/** 重置旋转配置 */
export interface RotateControlOptions {
  autoHide?: boolean
  duration?: number
}

/** 鹰眼图配置 */
export interface OverviewMapControlOptions {
  collapsed?: boolean
}

/** 全屏配置 */
export interface FullScreenControlOptions {
  keys?: boolean
}

/** 控件配置（可以是 boolean 或详细配置对象） */
export type MapControlOptions<T extends MapControlType> =
  | boolean
  | (T extends 'zoom' ? ZoomControlOptions
    : T extends 'attribution' ? AttributionControlOptions
    : T extends 'scaleLine' ? ScaleLineControlOptions
    : T extends 'mousePosition' ? MousePositionControlOptions
    : T extends 'zoomSlider' ? ZoomSliderControlOptions
    : T extends 'zoomToExtent' ? ZoomToExtentControlOptions
    : T extends 'rotate' ? RotateControlOptions
    : T extends 'overviewMap' ? OverviewMapControlOptions
    : T extends 'fullScreen' ? FullScreenControlOptions
    : never)

/** 完整控件配置对象 */
export interface MapControlsConfig {
  zoom?: MapControlOptions<'zoom'>
  attribution?: MapControlOptions<'attribution'>
  scaleLine?: MapControlOptions<'scaleLine'>
  mousePosition?: MapControlOptions<'mousePosition'>
  zoomSlider?: MapControlOptions<'zoomSlider'>
  zoomToExtent?: MapControlOptions<'zoomToExtent'>
  rotate?: MapControlOptions<'rotate'>
  overviewMap?: MapControlOptions<'overviewMap'>
  fullScreen?: MapControlOptions<'fullScreen'>
}
