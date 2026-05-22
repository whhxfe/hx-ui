/**
 * 聚合上下文 Composable
 * Cluster 组件提供此上下文，嵌套的 Markers 组件消费此上下文
 */

import { ref, shallowRef, provide, inject, computed, type Ref, type InjectionKey } from 'vue'
import type { MapMarkerItem } from '../types'

/** 聚合上下文状态 */
export interface ClusterContextState {
  /** 是否处于聚合模式 */
  isClusterMode: Ref<boolean>
  /** 聚合后的 feature 集合（当 isClusterMode=true 时有值） */
  clusterFeatures: Ref<any[]>
  /** 当前点击的聚合点坐标（投影坐标） */
  clusterCoord: Ref<[number, number] | null>
  /** Cluster 创建的 VectorLayer，供嵌套的 Markers 设置样式 */
  clusterLayer: any
}

/** 聚合上下文操作 */
export interface ClusterContextActions {
  /** 显示聚合弹窗 */
  showClusterPopup: (coord: [number, number], features: any[]) => void
  /** 隐藏聚合弹窗 */
  hideClusterPopup: () => void
}

/** 聚合上下文完整类型 */
export interface ClusterContext extends ClusterContextState, ClusterContextActions {}

/** 聚合上下文注入 key */
export const ClusterContextKey = Symbol('cluster-context') as InjectionKey<ClusterContext>

/**
 * 提供聚合上下文
 * 在 Cluster 组件中调用
 */
export function provideClusterContext() {
  const isClusterMode = ref(false)
  const clusterFeatures = ref<any[]>([])
  const clusterCoord = ref<[number, number] | null>(null)
  // clusterLayer 使用 shallowRef 避免 OL 图层对象的深层响应式追踪
  const clusterLayer = shallowRef<any>(null)

  const showClusterPopup = (coord: [number, number], features: any[]) => {
    isClusterMode.value = true
    clusterFeatures.value = features
    clusterCoord.value = coord
  }

  const hideClusterPopup = () => {
    isClusterMode.value = false
    clusterFeatures.value = []
    clusterCoord.value = null
  }

  const context: ClusterContext = {
    isClusterMode,
    clusterFeatures,
    clusterCoord,
    showClusterPopup,
    hideClusterPopup,
    clusterLayer,
  }

  provide(ClusterContextKey, context)

  return context
}

/**
 * 注入聚合上下文
 * 在 Markers 组件中调用
 */
export function useClusterContext(): ClusterContext | null {
  const context = inject(ClusterContextKey, null)
  return context
}

/**
 * 检查是否在 Cluster 上下文中
 */
export function useHasClusterContext(): Ref<boolean> {
  const context = inject(ClusterContextKey, null)
  return computed(() => context !== null)
}
