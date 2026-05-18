<script setup lang="ts">
/**
 * 地图标记点组件
 * 支持独立使用或嵌套在 Cluster 组件内使用
 * - 独立使用时：创建自己的 VectorSource 渲染 markers
 * - 嵌套在 Cluster 内时：从 ClusterContext 获取 clusterSource 并设置样式
 */
import { watchEffect, watch, onUnmounted } from 'vue'
import { useMapRef, useMapReady } from './composables/useMap'
import { useMapContext } from './composables/useMapContext'
import { useClusterContext } from './composables/useClusterContext'
import { useMarkerStyle } from './composables/useMarkerStyle'
import { ensureOlModules } from './composables/useOlModules'
import type { MapMarkerItem, MarkerStyleOptions } from './types'

export interface MarkersProps {
  /** 标记点列表 */
  markers: MapMarkerItem[]
  /** 标记点半径（像素，仅默认圆形模式） */
  markerRadius?: number
  /** 标记点填充颜色（仅默认圆形模式） */
  markerColor?: string
  /** 自定义样式选项（优先级高于 markerRadius/markerColor） */
  markerStyle?: MarkerStyleOptions
}

const props = withDefaults(defineProps<MarkersProps>(), {
  markerRadius: 6,
  markerColor: '#ff0000',
})

const mapRef = useMapRef()
const mapReady = useMapReady()
// MapContext 可能为 null（在 setup 阶段尚未挂载到 BaseMap）
const mapContext = useMapContext()

// 尝试获取 ClusterContext（可能为 null）
const clusterContext = useClusterContext()
const { buildMarkerStyle, buildMarkerStyleSync, buildClusterStyleSync, preloadIcon } = useMarkerStyle()

let ownSource: any = null // 独立模式下的数据源
let ownLayer: any = null // 独立模式下的图层
let clickKey: any = null

/**
 * 构建单点样式
 */
function buildSingleMarkerStyle(item: MapMarkerItem) {
  return buildMarkerStyle(item, {
    iconUrl: props.markerStyle?.iconUrl ?? item.iconUrl,
    iconSize: props.markerStyle?.iconSize ?? item.iconSize,
    iconOriginalSize: props.markerStyle?.iconOriginalSize ?? item.iconOriginalSize,
    iconAnchor: props.markerStyle?.iconAnchor,
    render: props.markerStyle?.render,
    radius: props.markerRadius,
    color: props.markerColor,
  })
}

/**
 * 初始化独立模式的图层
 */
async function initOwnLayer() {
  const map = mapRef.value
  if (!map || ownLayer) return

  const modules = await ensureOlModules()
  const { VectorLayer, VectorSource, Feature, Point } = modules

  ownSource = new VectorSource()
  ownLayer = new VectorLayer({ source: ownSource })

  map.addLayer(ownLayer)

  // 加载点位
  for (const item of props.markers) {
    const feature = new Feature({
      geometry: new Point(modules.fromLonLat([item.lon, item.lat])),
      data: item,
    })
    feature.setStyle(await buildSingleMarkerStyle(item))
    ownSource.addFeature(feature)
  }
}

/**
 * 更新独立模式的点位
 */
async function updateOwnMarkers() {
  if (!ownSource) return

  ownSource.clear()

  const modules = await ensureOlModules()
  const { Feature, Point } = modules

  for (const item of props.markers) {
    const feature = new Feature({
      geometry: new Point(modules.fromLonLat([item.lon, item.lat])),
      data: item,
    })
    feature.setStyle(await buildSingleMarkerStyle(item))
    ownSource.addFeature(feature)
  }
}

/**
 * 销毁独立模式的图层
 */
async function destroyOwnLayer() {
  const map = mapRef.value
  if (!map) return

  if (clickKey) {
    const { unByKey } = await ensureOlModules()
    unByKey(clickKey)
    clickKey = null
  }

  if (ownLayer) {
    map.removeLayer(ownLayer)
    ownLayer = null
  }

  ownSource = null
}

/**
 * 处理点击事件
 */
async function handleMapClick(e: any) {
  const map = mapRef.value
  if (!map) return

  map.forEachFeatureAtPixel(e.pixel, (feature: any) => {
    // 尝试获取点位数据
    let data: MapMarkerItem | undefined
    let coord: [number, number] | undefined

    if (clusterContext?.clusterLayer) {
      // Cluster 模式下：从 clusterSource 获取
      const features = feature.get('features')
      if (features && features.length === 1) {
        data = features[0].get('data')
        coord = features[0].getGeometry().getCoordinates()
      }
    } else {
      // 独立模式
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

/**
 * 设置 Cluster 图层样式
 */
function setupClusterLayerStyle() {
  if (!clusterContext?.clusterLayer.value) return

  const layer = clusterContext.clusterLayer.value

  // 设置同步样式函数
  layer.setStyle((feature: any) => {
    const features = feature.get('features')
    const size = features.length

    if (size === 1) {
      // 单点：使用同步样式构建
      const item = features[0].get('data')
      return buildMarkerStyleSync(item, {
        iconUrl: props.markerStyle?.iconUrl ?? item.iconUrl,
        iconSize: props.markerStyle?.iconSize ?? item.iconSize,
        iconAnchor: props.markerStyle?.iconAnchor ?? item.iconAnchor,
        radius: props.markerRadius,
        color: props.markerColor,
      })
    }

    // 聚合点：使用同步构建的样式
    const typeCount: Record<string, number> = {}
    const names: string[] = []
    features.forEach((f: any) => {
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

// 预热样式缓存（在 markers 变化时调用）
async function warmupClusterStyles() {
  if (!clusterContext) return

  const markers = props.markers
  if (!markers || markers.length === 0) return

  // 预先加载图标
  const iconUrl = props.markerStyle?.iconUrl
  if (iconUrl) {
    try {
      await preloadIcon(iconUrl)
    } catch (e) {
      console.warn('[Markers] preload icon failed:', e)
    }
  }

  // 预热单点样式
  for (const item of markers) {
    buildMarkerStyleSync(item, {
      iconUrl: iconUrl ?? item.iconUrl,
      iconSize: props.markerStyle?.iconSize ?? item.iconSize,
      iconAnchor: props.markerStyle?.iconAnchor ?? item.iconAnchor,
      radius: props.markerRadius,
      color: props.markerColor,
    })
  }

  // 预热一些常用的聚合数量样式
  const sampleCounts = [1, 2, 3, 5, 10, 20, 50, 100]
  for (const count of sampleCounts) {
    buildClusterStyleSync(count, { '地级市': count }, [])
  }

  // 预热完成后触发重绘，确保图标正确显示
  if (clusterContext.clusterLayer.value) {
    clusterContext.clusterLayer.value.changed()
  }
}

// ===================== 生命周期 =====================

// 记录是否已初始化
let initialized = false

// 监听地图就绪
watchEffect(() => {
  if (!mapReady.value || initialized) return
  initialized = true

  const map = mapRef.value
  if (!map) return

  // 检查是否有 clusterContext
  if (!clusterContext) {
    console.log('[Markers] No cluster context, using independent mode')
    // 独立模式：创建自己的图层
    initOwnLayer()

    // 注册点击事件
    if (!clickKey) {
      clickKey = map.on('singleclick', handleMapClick)
    }
    return
  }

  // 有 clusterContext，监听 clusterLayer 变化
  watch(
    () => clusterContext?.clusterLayer?.value,
    async (layer) => {
      if (layer) {
        console.log('[Markers] Cluster context ready, using cluster mode')
        // 先确保 OL 模块加载完成
        await ensureOlModules()
        // 再设置样式
        setupClusterLayerStyle()
        // 预热样式缓存
        await warmupClusterStyles()
        // 确保重绘
        layer.changed()

        // 注册点击事件
        if (!clickKey) {
          clickKey = mapRef.value.on('singleclick', handleMapClick)
        }
      }
    },
    { immediate: true }
  )
})

// 监听 markers 变化（独立模式）
watch(
  () => props.markers,
  () => {
    if (!clusterContext && initialized && ownSource) {
      updateOwnMarkers()
    }
  },
  { deep: true }
)

// 监听样式变化
watch(
  () => [props.markerStyle, props.markerRadius, props.markerColor],
  async () => {
    if (clusterContext?.clusterLayer) {
      // 如果样式包含图标，先预加载
      const iconUrl = props.markerStyle?.iconUrl
      if (iconUrl) {
        try {
          await preloadIcon(iconUrl)
        } catch (e) {
          console.warn('[Markers] preload icon failed:', e)
        }
      }
      // 预加载完成后触发重绘
      clusterContext.clusterLayer.value?.changed()
    } else if (ownLayer) {
      updateOwnMarkers()
    }
  },
  { deep: true }
)

onUnmounted(() => {
  destroyOwnLayer()
})
</script>

<template>
  <slot />
</template>
