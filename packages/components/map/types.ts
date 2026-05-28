/**
 * map 共享类型
 * 包含多个组件和 composables 共用的类型定义
 */

import type { VNode } from 'vue'

/** 标记点数据项 */
export interface MapMarkerItem {
  id: string | number
  /** 经度 */
  lon: number
  /** 纬度 */
  lat: number
  /** 点位名称 */
  name?: string
  /** 点位图标 URL（最高优先级，覆盖所有样式配置） */
  iconUrl?: string
  /** 图标渲染尺寸 [width, height]（像素） */
  iconSize?: [number, number]
  /** 图标原始尺寸 [width, height]，用于配合 iconSize 计算缩放比例 */
  iconOriginalSize?: [number, number]
  /** 图标锚点（相对于图标尺寸的比例） */
  iconAnchor?: [number, number]
  /**
   * 自定义形状（优先级低于 iconUrl 和 render）
   * 可使用已注册的形状名称，如 'map-marker'、'star' 等
   */
  shape?: MarkerShape
  /**
   * 形状填充颜色（仅 item.shape 非空时生效，优先级高于 markerStyle.color）
   */
  color?: string
  /** 数据项级自定义渲染函数（优先级最高，与 iconUrl 同级） */
  render?: (item: MapMarkerItem) => string | VNode
  /** 扩展信息（用于自定义 popup 内容） */
  extra?: Record<string, string>
  [key: string]: any
}

/** 标记点样式配置 */
export interface MarkerStyle {
  /** 默认形状类型（保底渲染方式，默认 'circle'） */
  shape?: MarkerShape
  /** 图标 URL（覆盖 shape） */
  iconUrl?: string
  /** 图标渲染尺寸 [width, height]（像素），同时适用于圆形和图标模式，默认 [20, 20] */
  iconSize?: [number, number]
  /** 图标原始尺寸 [width, height]，用于配合 iconSize 计算缩放比例 */
  iconOriginalSize?: [number, number]
  /** 图标锚点（相对于图标尺寸的比例，默认为底部中心 [0.5, 1]） */
  iconAnchor?: [number, number]
  /** 自定义渲染函数（优先级高于 shape/iconUrl） */
  render?: (item: MapMarkerItem) => string | VNode
  /** 圆形填充颜色（仅 shape='circle' 时生效） */
  color?: string
  /** @deprecated 请使用 iconSize 代替，圆形模式下图标直径等同于 iconSize */
  radius?: number
}

/** 标记点形状类型，支持内置名称和自定义注册的形状名称 */
export type MarkerShape = string

/** 形状定义 */
export interface ShapeDefinition {
  /** 形状唯一标识 */
  name: string
  /**
   * SVG 内容，支持两种格式：
   * 1. Raw SVG 字符串（以 '<' 开头），支持 currentColor 占位符替换颜色
   * 2. SVG 文件 URL（如 '/icons/star.svg'），颜色不可控
   */
  svg: string
  /** 默认颜色（仅 raw SVG 模式有效） */
  defaultColor?: string
  /** SVG 原始尺寸 [width, height]，默认 [24, 24] */
  size?: [number, number]
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
  /** 圆形填充颜色 */
  color?: string
  /** @deprecated 请使用 iconSize 代替，圆形模式下图标直径等同于 iconSize */
  radius?: number
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

/** 默认地图配置 */
export const MAP_CONFIG = {
  normalUrl: 'https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  satelliteUrl: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  center: { lon: 116.4, lat: 39.9 },
  zoom: 10,
  maxZoom: 18,
  minZoom: 3,
}

