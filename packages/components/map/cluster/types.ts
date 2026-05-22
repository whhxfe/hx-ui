import type { VNode } from 'vue'
import type { MapMarkerItem } from '../types'

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

/** 聚合组件属性 */
export interface ClusterProps {
  /** 标记点列表 */
  markers: MapMarkerItem[]
  /** 聚合距离（像素） */
  distance?: number
  /** 自定义聚合弹窗内容 */
  clusterContent?: (info: ClusterContentInfo) => VNode | string
}