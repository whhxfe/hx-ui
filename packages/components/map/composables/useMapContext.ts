import { ref, provide, inject, computed, type Ref, type InjectionKey } from 'vue'
import type { MapMarkerItem } from '../types'
import { MapKey, type ShallowRef } from './useMap'

/** Map Context 状态 */
export interface MapContextState {
  /** 当前激活的 marker（用于 Popup 显示） */
  activeMarker: Ref<MapMarkerItem | null>
  /** 当前激活 marker 的投影坐标 */
  activeCoord: Ref<[number, number] | null>
}

/** Map Context 操作方法 */
export interface MapContextActions {
  /** 设置当前激活的 marker */
  setActiveMarker: (marker: MapMarkerItem | null, coord: [number, number] | null) => void
  /** 清除当前激活的 marker */
  clearActiveMarker: () => void
}

/** Map Context 完整类型 */
export interface MapContext extends MapContextState, MapContextActions {}

/** Map Context 注入 key */
export const MapContextKey = Symbol('map-context') as InjectionKey<MapContext>

/** 唯一 ID 生成器，用于 marker/popup 实例 */
let instanceIdCounter = 0
const getInstanceId = () => `map-instance-${++instanceIdCounter}`

/**
 * 提供 Map Context 的 composable
 * 在 BaseMap 组件中调用，为子组件提供上下文
 */
export function provideMapContext(mapRef: ShallowRef<any>) {
  const instanceId = ref(getInstanceId())
  const activeMarker = ref<MapMarkerItem | null>(null)
  const activeCoord = ref<[number, number] | null>(null)

  const setActiveMarker = (marker: MapMarkerItem | null, coord: [number, number] | null) => {
    activeMarker.value = marker
    activeCoord.value = coord
  }

  const clearActiveMarker = () => {
    activeMarker.value = null
    activeCoord.value = null
  }

  const context: MapContext = {
    activeMarker,
    activeCoord,
    setActiveMarker,
    clearActiveMarker,
  }

  provide(MapContextKey, context)
  provide('mapInstanceId', instanceId) // 用于唯一标识地图实例

  return context
}

/**
 * 注入 Map Context
 * 子组件中使用，获取当前地图的上下文状态
 * 返回 null 如果不在 BaseMap 上下文中
 */
export function useMapContext(): MapContext | null {
  const context = inject(MapContextKey, null)
  return context
}

/**
 * 注入 Map Context（必须版本）
 * 如果不在 BaseMap 上下文中会抛出错误
 */
export function useMapContextRequired(): MapContext {
  const context = inject(MapContextKey)
  if (!context) {
    throw new Error('useMapContext must be used within a component inside BaseMap')
  }
  return context
}

/**
 * 检查是否在 BaseMap 上下文中
 */
export function useHasMapContext(): Ref<boolean> {
  const context = inject(MapContextKey, null)
  return computed(() => context !== null)
}
