export { default as HxMap } from './base-map/index.vue'
export { default as HxMapMarkers } from './markers/index.vue'
export { default as HxMapCluster } from './cluster/index.vue'
export { default as HxMapPopup } from './popup/index.vue'

// 共享类型
export type {
  MapMarkerItem,
  MarkerStyle,
  MarkerShape,
  MarkerGroupConfig,
  MarkerGroupStyle,
  MarkerGroupRenderType,
  MarkerGroupRule,
  ShapeDefinition,
} from './types'

export { MAP_CONFIG } from './types'

// 子模块类型
export type { MapCenter, BaseMapProps, BaseMapEmits, BaseMapExposed, MapControlsConfig } from './base-map/types'
export type { ClusterProps, ClusterContentInfo } from './cluster/types'
export type { PopupProps } from './popup/types'

// composables
export {
  useMapContext,
  useHasMapContext,
} from './composables/useMapContext'

export {
  useClusterContext,
  useHasClusterContext,
} from './composables/useClusterContext'

export { registerMapMarkerShapes, getRegisteredShapes } from './composables/useMarkerStyle'
