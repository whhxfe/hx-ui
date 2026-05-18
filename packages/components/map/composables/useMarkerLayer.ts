/**
 * 地图标记图层 composable
 * 处理点位渲染和点击事件
 */

import { watch, onUnmounted } from 'vue'
import type { Map as OlMap } from 'ol'
import type { MapMarkerItem, MarkerStyleOptions } from '../types'
import { ensureOlModules } from './useOlModules'
import { useMarkerStyle } from './useMarkerStyle'

export interface UseMarkerLayerOptions {
  map: OlMap | null
  markers: MapMarkerItem[]
  markerRadius?: number
  markerColor?: string
  markerStyle?: MarkerStyleOptions
  /** 点击 marker 回调 */
  onMarkerClick?: (item: MapMarkerItem, coord: [number, number]) => void
}

export interface UseMarkerLayerReturn {
  initLayer: () => Promise<void>
  destroyLayer: () => Promise<void>
  rebuildMarkers: (newMarkerStyle?: MarkerStyleOptions) => Promise<void>
  updateMarkers: (markers: MapMarkerItem[]) => void
}

export function useMarkerLayer(options: UseMarkerLayerOptions): UseMarkerLayerReturn {
  const { map, markerRadius = 6, markerColor = '#ff0000' } = options
  const { buildMarkerStyle } = useMarkerStyle()

  let layer: any = null
  let source: any = null
  let clickKey: any = null
  let initialized = false

  // 保存当前 options 的引用，用于响应式更新
  let currentMarkers = options.markers
  let currentMarkerStyle = options.markerStyle

  /**
   * 构建单个点位样式
   */
  const buildStyle = async (item: MapMarkerItem) => {
    return buildMarkerStyle(item, {
      iconUrl: currentMarkerStyle?.iconUrl ?? item.iconUrl,
      iconSize: currentMarkerStyle?.iconSize ?? item.iconSize,
      iconOriginalSize: currentMarkerStyle?.iconOriginalSize ?? item.iconOriginalSize,
      iconAnchor: currentMarkerStyle?.iconAnchor,
      render: currentMarkerStyle?.render,
      radius: markerRadius,
      color: markerColor,
    })
  }

  /**
   * 重建所有点位
   */
  const rebuildMarkers = async (newMarkerStyle?: MarkerStyleOptions) => {
    if (!map || !source) return

    currentMarkerStyle = newMarkerStyle ?? currentMarkerStyle

    source.clear()

    const modules = await ensureOlModules()
    const { Feature, Point } = modules

    for (const item of currentMarkers) {
      const feature = new Feature({
        geometry: new Point(modules.fromLonLat([item.lon, item.lat])),
        data: item,
      })

      const style = await buildStyle(item)
      feature.setStyle(style)

      source.addFeature(feature)
    }
  }

  /**
   * 更新点位数据
   */
  const updateMarkers = (markers: MapMarkerItem[]) => {
    currentMarkers = markers
    if (initialized && source) {
      rebuildMarkers()
    }
  }

  /**
   * 初始化图层
   */
  const initLayer = async () => {
    if (!map) return

    const modules = await ensureOlModules()
    const { VectorLayer, VectorSource } = modules

    if (!layer) {
      source = new VectorSource()
      layer = new VectorLayer({ source })
      map.addLayer(layer)
    }

    // 点击事件处理
    if (!clickKey) {
      clickKey = map.on('singleclick', (e: any) => {
        let hit = false

        map!.forEachFeatureAtPixel(e.pixel, (feature: any) => {
          const data = feature.get('data') as MapMarkerItem | undefined
          if (!data) return false

          const coord = feature.getGeometry().getCoordinates()
          options.onMarkerClick?.(data, coord)

          hit = true
          return true
        })
      })
    }

    await rebuildMarkers()
    initialized = true
  }

  /**
   * 销毁图层
   */
  const destroyLayer = async () => {
    if (!map) return

    if (clickKey) {
      const { unByKey } = await ensureOlModules()
      unByKey(clickKey)
      clickKey = null
    }

    if (layer) {
      map.removeLayer(layer)
      layer = null
    }

    source = null
    initialized = false
  }

  // 监听 markers 变化
  watch(
    () => options.markers,
    (newMarkers) => {
      currentMarkers = newMarkers
      if (initialized && source) {
        rebuildMarkers()
      }
    },
    { deep: true }
  )

  // 监听 markerStyle 变化
  watch(
    () => options.markerStyle,
    (newStyle) => {
      currentMarkerStyle = newStyle
      if (initialized && source) {
        rebuildMarkers(newStyle)
      }
    },
    { deep: true }
  )

  onUnmounted(() => {
    destroyLayer()
  })

  return {
    initLayer,
    destroyLayer,
    rebuildMarkers,
    updateMarkers,
  }
}
