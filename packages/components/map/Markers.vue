<script setup lang="ts">
import { watchEffect, ref, watch, onUnmounted } from 'vue'
import { useMarkerLayer } from './composables/useMarkerLayer'
import { useMarkerGroup } from './composables/useMarkerGroup'
import { useCluster } from './composables/useCluster'
import { useMapRef, useMapReady } from './composables/useMap'
import type { MarkerProps, MarkerGroupConfig } from './types'

const props = withDefaults(defineProps<MarkerProps & {
  /** 分组配置（优先级高于 markerStyle） */
  groupConfig?: MarkerGroupConfig
}>(), {
  markerRadius: 6,
  markerColor: '#ff0000',
  cluster: false,
  clusterDistance: 40,
})

const emit = defineEmits<{
  (e: 'groupReady', groupApi: ReturnType<typeof useMarkerGroup>): void
}>()

const mapRef = useMapRef()
const mapReady = useMapReady()
const initialized = ref(false)

onUnmounted(() => {
  initialized.value = false
})

let markerLayerInstance: ReturnType<typeof useMarkerLayer> | null = null
let clusterInstance: ReturnType<typeof useCluster> | null = null
let markerGroupInstance: ReturnType<typeof useMarkerGroup> | null = null

// 监听地图就绪后再初始化
watchEffect(() => {
  if (!mapReady.value || initialized.value) return
  initialized.value = true
  const map = mapRef.value
  if (!map) return

  console.log('[Markers.vue] initializing layer')

  // 分组模式（优先级最高）
  if (props.groupConfig) {
    console.log('[Markers.vue] using group mode with config:', props.groupConfig)
    markerGroupInstance = useMarkerGroup({
      map,
      markers: props.markers,
      markerContent: props.markerContent,
      groupConfig: props.groupConfig,
    })
    emit('groupReady', markerGroupInstance)
  } else if (props.cluster) {
    clusterInstance = useCluster({
      map,
      markers: props.markers,
      markerRadius: props.markerRadius,
      markerColor: props.markerColor,
      clusterDistance: props.clusterDistance,
      markerContent: props.markerContent,
      clusterContent: props.clusterContent,
      markerStyle: props.markerStyle,
    })
    clusterInstance.initCluster()
  } else {
    markerLayerInstance = useMarkerLayer({
      map,
      markers: props.markers,
      markerRadius: props.markerRadius,
      markerColor: props.markerColor,
      markerContent: props.markerContent,
      markerStyle: props.markerStyle,
    })
    markerLayerInstance.initLayer()
  }
})

// 监听 markerStyle 变化，触发重新渲染
watch(() => props.markerStyle, (newStyle) => {
  console.log('[Markers.vue] markerStyle changed:', newStyle)
  if (markerLayerInstance) {
    console.log('[Markers.vue] calling rebuildMarkers with new style')
    markerLayerInstance.rebuildMarkers?.(newStyle)
  }
  if (clusterInstance) {
    clusterInstance.refreshStyle?.()
  }
}, { deep: true })

// 暴露分组控制 API
defineExpose({
  showGroup: (groupValue: string) => markerGroupInstance?.showGroup(groupValue),
  hideGroup: (groupValue: string) => markerGroupInstance?.hideGroup(groupValue),
  toggleGroup: (groupValue: string) => markerGroupInstance?.toggleGroup(groupValue),
  showAll: () => markerGroupInstance?.showAll(),
  hideAll: () => markerGroupInstance?.hideAll(),
  getGroupVisibility: () => markerGroupInstance?.getGroupVisibility() ?? {},
})
</script>

<template>
  <slot />
</template>
