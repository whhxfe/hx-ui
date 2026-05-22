<script setup lang="ts">
import { ref, watch, onMounted, provide, shallowRef, nextTick, computed } from 'vue'
import { useMap, MapKey } from '../composables/useMap'
import { provideMapContext } from '../composables/useMapContext'
import { useConfig } from '../../../hooks/useConfig'
import type { BaseMapProps, BaseMapEmits, BaseMapExposed, MapCenter } from './types'

const config = useConfig()

// =================== Props / Emits ===================
const props = defineProps<BaseMapProps>()
const emit = defineEmits<BaseMapEmits>()

// =================== 响应式状态 ===================
const mapEl = ref<HTMLDivElement | null>(null)

// mapRef 由 useMap 赋值，同时通过 provide 注入给子组件
const mapRef = shallowRef<any>(null)

let syncControlsFn: ((config: any) => void) | null = null

/** projUtils 类型签名 */
interface ProjUtils {
  fromLonLat: (...args: any[]) => any
  toLonLat: (...args: any[]) => any
}
const projUtils = shallowRef<ProjUtils | null>(null)

// =================== 配置合并 ===================
// 优先级：Props > ConfigProvider > 默认值
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

// width/height 数值单位处理
const normalizedWidth = computed(() => {
  const w = effectiveConfig.value.width
  return typeof w === 'number' ? `${w}px` : w
})

const normalizedHeight = computed(() => {
  const h = effectiveConfig.value.height
  return typeof h === 'number' ? `${h}px` : h
})

// =================== provide 上下文 ===================
// 在 setup 阶段提前 provide，让子组件可以同步 inject（即使 map 还未就绪）
provide(MapKey, mapRef)
provideMapContext(mapRef)

// =================== useMap ===================
// 在 setup 阶段同步调用 useMap，确保其内部的 onUnmounted 正确注册
// 但不 await（避免顶层 await 导致组件需 Suspense 包装），在 onMounted 中 await
const mapInstancePromise = useMap({
  props: effectiveConfig.value,
  mapEl,
  mapRef,
  onMapReady: (map) => {
    mapRef.value = map
    emit('mapReady', map)
  },
  onMapClick: (coordinate) => emit('mapClick', coordinate),
})

// =================== 生命周期 ===================
onMounted(async () => {
  // 等待 useMap 完成动态导入
  const mapInstance = await mapInstancePromise

  projUtils.value = mapInstance.projUtils
  syncControlsFn = mapInstance.syncControls

  // DOM 就绪后初始化地图
  await nextTick()
  await mapInstance.initMap()
})

// =================== Props 监听 ===================
// 监听 center / zoom 变化，同步到地图视图
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

// 监听 controls 变化，动态同步控件
// 用序列化快照避免内容相同但引用不同时重复触发
let prevControlsSignature = ''
watch(
  () => effectiveConfig.value.controls,
  (newControls) => {
    const sig = JSON.stringify(newControls)
    if (sig === prevControlsSignature) return
    prevControlsSignature = sig
    syncControlsFn?.(newControls)
  },
  { deep: true, immediate: false },
)

// =================== 暴露方法 ===================
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
    <div ref="mapEl" class="hx-map" />
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use '../../../theme-chalk/src/map';
</style>