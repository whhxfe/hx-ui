import type { VNode } from 'vue'
import type { MapMarkerItem } from '../types'

/** 弹窗组件属性 */
export interface PopupProps {
  /** 自定义弹窗内容渲染函数 */
  render?: (item: MapMarkerItem) => VNode | string
  /** 弹窗偏移量 */
  offset?: [number, number]
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 是否支持多弹窗同时显示 */
  multiple?: boolean
}