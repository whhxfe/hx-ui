<script setup lang="ts">
import { watch } from 'vue'
import { useMarkerLayer } from './composables/useMarkerLayer'
import { useCluster } from './composables/useCluster'
import { useMapRef } from './composables/useMap'
import type { MarkerProps } from './types'

const props = withDefaults(defineProps<MarkerProps>(), {
  markerRadius: 6,
  markerColor: '#ff0000',
  cluster: false,
  clusterDistance: 40,
})

const mapRef = useMapRef()

// 监听 mapRef 变化后再初始化
watch(
  mapRef,
  (map) => {
    if (!map) return

    if (props.cluster) {
      useCluster({
        map,
        markers: props.markers,
        markerRadius: props.markerRadius,
        markerColor: props.markerColor,
        clusterDistance: props.clusterDistance,
        markerContent: props.markerContent,
      })
    } else {
      useMarkerLayer({
        map,
        markers: props.markers,
        markerRadius: props.markerRadius,
        markerColor: props.markerColor,
        markerContent: props.markerContent,
      })
    }
  },
  { immediate: true },
)
</script>

<template>
  <slot />
</template>
