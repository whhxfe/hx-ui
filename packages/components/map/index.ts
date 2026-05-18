export { default as HxMap } from './BaseMap.vue'
export { default as HxMapMarkers } from './Markers.vue'
export { default as HxMapCluster } from './Cluster.vue'
export { default as HxMapPopup } from './Popup.vue'

export type {
  MapMarkerItem,
  MapCenter,
  BaseMapProps,
  BaseMapEmits,
  BaseMapExposed,
  MarkerProps,
  MarkerGroupConfig,
  MarkerGroupStyle,
  MarkerStyleOptions,
  ClusterContentInfo,
  PopupProps,
  ClusterProps,
} from './types'

export { MAP_CONFIG } from './types'

// composables
export {
  useMapContext,
  useHasMapContext,
} from './composables/useMapContext'

export {
  useClusterContext,
  useHasClusterContext,
} from './composables/useClusterContext'
