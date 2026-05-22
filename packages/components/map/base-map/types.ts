import type Map from 'ol/Map'

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
  /** 是否默认折叠 */
  collapsed?: boolean
  /** 鹰眼图使用的瓦片 URL（默认使用卫星地图） */
  overviewUrl?: string
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