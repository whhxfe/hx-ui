<script setup lang="ts">
/**
 * 地图标记点组件
 * 支持独立使用或嵌套在 Cluster 组件内使用
 * - 独立使用时：创建自己的 VectorSource 渲染 markers
 * - 嵌套在 Cluster 内时：从 ClusterContext 获取 clusterSource 并设置样式
 */
import { watchEffect, watch, onUnmounted, shallowRef, type ShallowRef } from 'vue'
import { useMapRef, useMapReady } from '../composables/useMap'
import { useMapContext } from '../composables/useMapContext'
import { useClusterContext } from '../composables/useClusterContext'
import { useMarkerStyle, preloadShape, type UseMarkerStyleOptions } from '../composables/useMarkerStyle'
import { ensureOlModules } from '../composables/useOlModules'
import type { MapMarkerItem } from '../types'
import type { MarkersProps, OlMap, OlMapEvent, OlFeature, OlVectorSource, OlVectorLayer, OlModules } from './types'

const props = withDefaults(defineProps<MarkersProps>(), {
  markerStyle: () => ({
    shape: 'circle',
    color: '#409eff',
    iconSize: [24, 24],
  }),
})

const mapRef = useMapRef()
const mapReady = useMapReady()
const mapContext = useMapContext()
const clusterContext = useClusterContext()
const { buildMarkerStyle, buildMarkerStyleSync, buildClusterStyleSync, preloadIcon } = useMarkerStyle()

// ==================== 实例级状态（支持多实例） ====================
/** 独立模式下的矢量源 */
const ownSource = shallowRef<OlVectorSource | null>(null) as ShallowRef<OlVectorSource | null>
/** 独立模式下的矢量图层 */
const ownLayer = shallowRef<OlVectorLayer | null>(null) as ShallowRef<OlVectorLayer | null>
/** 点击事件监听 key */
const clickKey = shallowRef<any>(null)

// 预热形状 SVG data URI
const shape = props.markerStyle?.shape
if (shape && shape !== 'circle') {
  preloadShape(shape, props.markerStyle?.color)
}

// ==================== 公共工具函数 ====================

/** 从 props 和 item 合并构建样式选项 */
function mergeStyleOptions(item: MapMarkerItem): UseMarkerStyleOptions {
  const options = {
    shape: props.markerStyle?.shape,
    iconUrl: props.markerStyle?.iconUrl,
    iconSize: props.markerStyle?.iconSize ?? item.iconSize,
    iconOriginalSize: props.markerStyle?.iconOriginalSize ?? item.iconOriginalSize,
    iconAnchor: props.markerStyle?.iconAnchor ?? item.iconAnchor,
    render: props.markerStyle?.render,
    color: props.markerStyle?.color,
  }
  return options
}

/** 构建单个 feature */
async function buildFeature(
  modules: OlModules,
  item: MapMarkerItem,
): Promise<OlFeature> {
  const { Feature, Point } = modules
  const feature = new Feature({
    geometry: new Point(modules.fromLonLat([item.lon, item.lat])),
    data: item,
  })
  feature.setStyle(await buildMarkerStyle(item, mergeStyleOptions(item)))
  return feature
}

// ==================== 独立模式 ====================

async function initOwnLayer(): Promise<void> {
  const map = mapRef.value as OlMap | null
  if (!map || ownLayer.value) return

  const modules = (await ensureOlModules()) as unknown as OlModules
  const { VectorLayer, VectorSource } = modules

  const source = new VectorSource()
  const layer = new VectorLayer({ source })
  map.addLayer(layer)

  for (const item of props.markers) {
    const feature = await buildFeature(modules, item)
    source.addFeature(feature)
  }

  ownSource.value = source
  ownLayer.value = layer
}

async function updateOwnMarkers(): Promise<void> {
  const source = ownSource.value
  if (!source) return

  source.clear()

  const modules = (await ensureOlModules()) as unknown as OlModules
  for (const item of props.markers) {
    const feature = await buildFeature(modules, item)
    source.addFeature(feature)
  }
}

async function destroyOwnLayer(): Promise<void> {
  const map = mapRef.value as OlMap | null
  if (!map) return

  if (clickKey.value) {
    const modules = (await ensureOlModules()) as unknown as OlModules
    modules.unByKey(clickKey.value)
    clickKey.value = null
  }

  if (ownLayer.value) {
    map.removeLayer(ownLayer.value)
    ownLayer.value = null
  }
  ownSource.value = null
}

// ==================== 交互处理 ====================

function handleMapClick(e: OlMapEvent): void {
  const map = mapRef.value as OlMap | null
  if (!map) return

  map.forEachFeatureAtPixel(e.pixel, (feature: OlFeature) => {
    let data: MapMarkerItem | undefined
    let coord: [number, number] | undefined

    if (clusterContext?.clusterLayer?.value) {
      const features = feature.get('features')
      if (features && features.length === 1) {
        data = features[0].get('data')
        coord = features[0].getGeometry().getCoordinates()
      }
    } else {
      data = feature.get('data')
      coord = feature.getGeometry().getCoordinates()
    }

    if (data && coord) {
      mapContext?.setActiveMarker(data, coord)
      return true
    }
    return false
  })
}

// ==================== Cluster 模式 ====================

function setupClusterLayerStyle(): void {
  const layer = clusterContext?.clusterLayer?.value as OlVectorLayer | undefined
  if (!layer) return

  const markerStyle = props.markerStyle

  layer.setStyle((feature: OlFeature) => {
    const features = feature.get('features')
    const size = features.length

    if (size === 1) {
      const item = features[0].get('data')
      return buildMarkerStyleSync(item, {
        shape: markerStyle?.shape,
        iconUrl: markerStyle?.iconUrl,
        iconSize: markerStyle?.iconSize ?? item.iconSize,
        iconOriginalSize: markerStyle?.iconOriginalSize ?? item.iconOriginalSize,
        iconAnchor: markerStyle?.iconAnchor ?? item.iconAnchor,
        color: markerStyle?.color,
      })
    }

    const typeCount: Record<string, number> = {}
    const names: string[] = []
    features.forEach((f: OlFeature) => {
      const item = f.get('data')
      const type = item.type || '其他'
      typeCount[type] = (typeCount[type] || 0) + 1
      if (item.name && names.length < 2) {
        names.push(item.name)
      }
    })

    return buildClusterStyleSync(size, typeCount, names)
  })
}

async function warmupClusterStyles(): Promise<void> {
  if (!clusterContext) return
  const markers = props.markers
  if (!markers || markers.length === 0) return

  const iconUrl = props.markerStyle?.iconUrl
  if (iconUrl) {
    try { await preloadIcon(iconUrl) } catch (e) { console.warn('[Markers] preload icon failed:', e) }
  }

  // 预热单点样式缓存
  for (const item of markers) {
    buildMarkerStyleSync(item, {
      shape: props.markerStyle?.shape,
      iconUrl,
      iconSize: props.markerStyle?.iconSize ?? item.iconSize,
      iconOriginalSize: props.markerStyle?.iconOriginalSize ?? item.iconOriginalSize,
      iconAnchor: props.markerStyle?.iconAnchor ?? item.iconAnchor,
      color: props.markerStyle?.color,
    })
  }

  // 预热聚合样式缓存（使用典型的 count 值）
  const sampleCounts = [2, 3, 5, 10, 20, 50, 100]
  for (const count of sampleCounts) {
    buildClusterStyleSync(count, { '地级市': count }, [])
  }
}

// ===================== 生命周期 =====================
let initialized = false

watchEffect(() => {
  if (!mapReady.value || initialized) return
  initialized = true

  const map = mapRef.value as OlMap | null
  if (!map) return

  if (!clusterContext) {
    initOwnLayer()
    if (!clickKey.value) {
      clickKey.value = map.on('singleclick', handleMapClick)
    }
    return
  }

  // Cluster 模式：等待 clusterLayer 就绪后初始化
  watch(
    () => clusterContext?.clusterLayer?.value,
    async (layer) => {
      if (layer) {
        await ensureOlModules()
        // 先预热样式缓存，再设置样式回调（避免首次渲染时 buildMarkerStyleSync 返回 null）
        await warmupClusterStyles()
        setupClusterLayerStyle()
        layer.changed()

        if (!clickKey.value) {
          clickKey.value = (mapRef.value as OlMap).on('singleclick', handleMapClick)
        }
      }
    },
    { immediate: true },
  )
})

watch(
  () => props.markers,
  () => {
    if (!clusterContext && initialized && ownSource.value) {
      updateOwnMarkers()
    }
  },
  { deep: true },
)

watch(
  () => props.markerStyle,
  async () => {
    if (clusterContext?.clusterLayer?.value) {
      // Cluster 模式：重新预热样式并刷新
      await warmupClusterStyles()
      clusterContext.clusterLayer.value.changed()
    } else if (ownLayer.value) {
      updateOwnMarkers()
    }
  },
  { deep: true },
)

onUnmounted(async () => {
  await destroyOwnLayer()
})
</script>

<template>
  <slot />
</template>