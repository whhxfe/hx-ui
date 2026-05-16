<script setup lang="ts">
import { ref, watch, onMounted, provide, shallowRef, nextTick, computed } from 'vue'
import { useMap, MapKey } from './composables/useMap'
import { useConfig } from '../../hooks/useConfig'
import type { BaseMapProps, BaseMapEmits, BaseMapExposed, MapCenter } from './types'

const config = useConfig()

/* ------------------------------ Props / Emits ----------------------------- */
const props = defineProps<BaseMapProps>()

const emit = defineEmits<BaseMapEmits>()

/* ------------------------------ Map ID ----------------------------- */
const mapId = `hx-map-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

/* --------------------------------- 配置合并 -------------------------------- */
// Props > ConfigProvider > 默认值
const effectiveConfig = computed(() => ({
  normalUrl: props.normalUrl ?? config.map?.normalUrl ?? 'https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  satelliteUrl: props.satelliteUrl ?? config.map?.satelliteUrl ?? 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  center: props.center ?? config.map?.center ?? { lon: 116.4, lat: 39.9 },
  zoom: props.zoom ?? config.map?.zoom ?? 10,
  maxZoom: props.maxZoom ?? config.map?.maxZoom ?? 18,
  minZoom: props.minZoom ?? config.map?.minZoom ?? 3,
  width: props.width ?? '100%',
  height: props.height ?? '500px',
  scrollWheelZoom: props.scrollWheelZoom ?? true,
  controls: props.controls,
}))

// width/height 单位处理
const normalizedWidth = computed(() => {
  const w = effectiveConfig.value.width
  return typeof w === 'number' ? `${w}px` : w
})

const normalizedHeight = computed(() => {
  const h = effectiveConfig.value.height
  return typeof h === 'number' ? `${h}px` : h
})

/* --------------------------------- Map ref -------------------------------- */
const mapEl = ref<HTMLDivElement | null>(null)
const mapRef = shallowRef<any>(null)
const projUtils = shallowRef<{ fromLonLat: Function; toLonLat: Function } | null>(null)
let syncControlsFn: ((config: any) => void) | null = null

// 提前 provide，让子组件可以同步 inject
provide(MapKey, mapRef)

/* =====================
 * 生命周期
 * ===================== */
onMounted(async () => {
  const mapInstance = await useMap({
    props: effectiveConfig.value,
    mapEl,
    onMapReady: (map) => {
      mapRef.value = map
      emit('mapReady', map)
    },
    onMapClick: (coordinate) => emit('mapClick', coordinate),
  })
  projUtils.value = mapInstance.projUtils
  syncControlsFn = mapInstance.syncControls
  // 等待 DOM 更新后初始化地图
  await nextTick()
  mapInstance.initMap()
})

/* =====================
 * props 同步
 * ===================== */
watch(
  () => [effectiveConfig.value.center, effectiveConfig.value.zoom] as [{ lon: number; lat: number }, number],
  ([center, zoom]) => {
    const map = mapRef.value
    const { fromLonLat } = projUtils.value || {}
    if (!map || !fromLonLat) return
    map.getView().setCenter(fromLonLat([center.lon, center.lat]))
    map.getView().setZoom(zoom)
  },
  { deep: true },
)

// 监听 controls 变化，动态同步
// 用序列化快照避免内容相同但引用不同时重复触发
let prevControlsSignature = ''
watch(
  () => effectiveConfig.value.controls,
  (newControls) => {
    const sig = JSON.stringify(newControls)
    if (sig === prevControlsSignature) return
    prevControlsSignature = sig
    if (syncControlsFn && mapRef.value) {
      syncControlsFn(newControls)
    }
  },
  { deep: true, immediate: false },
)

/* =====================
 * 暴露方法
 * ===================== */
defineExpose<BaseMapExposed>({
  setCenter(center: MapCenter) {
    const map = mapRef.value
    const { fromLonLat } = projUtils.value || {}
    if (map && fromLonLat) {
      map.getView().setCenter(fromLonLat([center.lon, center.lat]))
    }
  },

  setZoom(zoom: number) {
    const map = mapRef.value
    if (map) {
      map.getView().setZoom(zoom)
    }
  },

  getCenter(): MapCenter | null {
    const map = mapRef.value
    const { toLonLat } = projUtils.value || {}
    if (map && toLonLat) {
      const center = map.getView().getCenter()
      if (center) {
        const [lon, lat] = toLonLat(center)
        return { lon, lat }
      }
    }
    return null
  },

  getZoom(): number | null {
    const map = mapRef.value
    return map?.getView().getZoom() ?? null
  },

  getMap() {
    return mapRef.value
  },

  fitExtent(extent: [number, number, number, number], padding = [50, 50, 50, 50]) {
    const map = mapRef.value
    if (map) {
      map.getView().fit(extent, { padding })
    }
  },
})
</script>

<template>
  <div class="hx-map-container" :style="{ width: normalizedWidth, height: normalizedHeight }">
    <div ref="mapEl" class="hx-map" :data-map-id="mapId"></div>
    <slot />
  </div>
</template>

<style scoped>
.hx-map-container {
  position: relative;
}

.hx-map {
  width: 100%;
  height: 100%;
}
</style>

<style>
/* Popup 样式（全局，避免 scoped 影响） */
.map-marker-popup {
  position: relative;
  background: #fff;
  padding: 10px 12px;
  border-radius: 4px;
  min-width: 160px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.map-marker-popup::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px 6px 0 6px;
  border-style: solid;
  border-color: #fff transparent transparent;
}

.map-marker-popup-content {
  margin-right: 24px;
}

.map-marker-popup-close {
  position: absolute;
  top: 6px;
  right: 6px;
  border: none;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
  color: #999;
}

/* Cluster Popup 样式（全局，避免 scoped 影响） */
.cluster-popup {
  position: relative;
  background: #fff;
  padding: 10px 0;
  border-radius: 6px;
  min-width: 180px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.cluster-popup::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px 6px 0 6px;
  border-style: solid;
  border-color: #fff transparent transparent;
}

.cluster-popup__header {
  padding: 4px 14px 8px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.cluster-popup__list {
  padding: 6px 14px;
}

.cluster-popup__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 13px;
}

.cluster-popup__item .type {
  color: #666;
}

.cluster-popup__item .count {
  font-weight: 600;
  color: #333;
}

.cluster-popup__footer {
  padding: 8px 14px 4px;
  font-size: 12px;
  color: #999;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}
</style>
