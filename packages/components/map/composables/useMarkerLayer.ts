import { watch, onUnmounted } from 'vue'
import type { VNode } from 'vue'
import type { Map as OlMap } from 'ol'
import type { MapMarkerItem, MarkerStyleOptions } from '../types'
import { useOlModules, ensureOlModules } from './useOlModules'
import { usePopup } from './usePopup'

type MapMarkerStyle = MarkerStyleOptions

export interface UseMarkerLayerOptions {
  map: OlMap | null
  markers: MapMarkerItem[]
  markerRadius?: number
  markerColor?: string
  markerContent?: (item: MapMarkerItem) => VNode | string
  markerStyle?: MarkerStyleOptions
}

export function useMarkerLayer(options: UseMarkerLayerOptions) {
  const { map, markerRadius = 6, markerColor = '#ff0000' } = options

  const popup = usePopup({
    markerContent: options.markerContent,
    popupOffset: [0, -markerRadius],
  })

  let layer: any = null
  let source: any = null
  let clickKey: any = null
  let initialized = false

  const buildMarkerStyle = async (item: MapMarkerItem) => {
    const modules = await ensureOlModules()
    const { Style, Circle, Fill, Stroke, Icon } = modules
    const { markerStyle, markerRadius = 6, markerColor = '#ff0000' } = options

    // 模式1：URL 图标
    if (markerStyle?.iconUrl) {
      const targetSize = markerStyle.iconSize
      const originalSize = markerStyle.iconOriginalSize ?? targetSize

      let scale: number | undefined
      let imgSize: [number, number] | undefined

      if (targetSize && originalSize) {
        scale = targetSize[0] / originalSize[0]
        imgSize = originalSize
      }

      return new Style({
        image: new Icon({
          src: markerStyle.iconUrl,
          imgSize: imgSize,
          scale: scale,
          anchor: markerStyle.iconAnchor ?? [0.5, 1],
        }),
      })
    }

    // 模式2：自定义渲染函数
    if (markerStyle?.render) {
      try {
        const content = markerStyle.render(item)
        let htmlContent = ''
        if (typeof content === 'string') {
          htmlContent = content
        } else {
          htmlContent = `<div>${item.name || ''}</div>`
        }

        const canvas = document.createElement('canvas')
        const size = markerStyle.iconSize ?? [80, 40]
        canvas.width = size[0]
        canvas.height = size[1]
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = '#ffffff'
          ctx.shadowColor = 'rgba(0,0,0,0.2)'
          ctx.shadowBlur = 4
          ctx.shadowOffsetY = 2
          ctx.beginPath()
          ctx.roundRect(0, 0, size[0], size[1], 4)
          ctx.fill()
          ctx.fillStyle = '#333'
          ctx.font = '14px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          const text = item.name || ''
          ctx.fillText(text, size[0] / 2, size[1] / 2)
        }

        return new Style({
          image: new Icon({
            img: canvas,
            imgSize: size,
            anchor: markerStyle.iconAnchor ?? [0.5, 0.5],
          }),
        })
      } catch (err) {
        console.error('[useMarkerLayer] buildMarkerStyle custom mode error:', err)
        throw err
      }
    }

    // 模式3：默认圆形
    return new Style({
      image: new Circle({
        radius: markerRadius,
        fill: new Fill({ color: markerColor }),
        stroke: new Stroke({ color: '#fff', width: 1.5 }),
      }),
    })
  }

  // 保存当前选项的引用
  const currentOptions = options

  const rebuildMarkers = async (newMarkerStyle?: MapMarkerStyle) => {
    if (!map || !source) return

    currentOptions.markerStyle = newMarkerStyle

    source.clear()
    popup.removeAllPopups(map)

    const modules = await ensureOlModules()
    const { Feature, Point } = modules

    for (const item of options.markers) {
      const feature = new Feature({
        geometry: new Point(modules.fromLonLat([item.lon, item.lat])),
        data: item,
      })

      const style = await buildMarkerStyle(item)
      feature.setStyle(style)

      source.addFeature(feature)

      if (options.markerContent) {
        popup.createPopup(map, item)
      }
    }
  }

  const initLayer = async () => {
    if (!map) return

    const modules = await ensureOlModules()
    const { VectorLayer, VectorSource } = modules

    if (!layer) {
      source = new VectorSource()
      layer = new VectorLayer({ source })
      map.addLayer(layer)
    }

    if (!clickKey) {
      clickKey = map.on('singleclick', (e: any) => {
        let hit = false

        map!.forEachFeatureAtPixel(e.pixel, (feature: any) => {
          const data = feature.get('data') as MapMarkerItem | undefined
          if (!data) return false

          popup.showPopup(data.id, feature.getGeometry().getCoordinates())

          hit = true
          return true
        })

        if (!hit) popup.hideActivePopup()
      })
    }

    await rebuildMarkers()
    initialized = true
  }

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

    popup.removeAllPopups(map)

    source = null
    initialized = false
  }

  watch(
    () => [options.markers, options.markerStyle],
    () => {
      if (initialized && source) {
        rebuildMarkers()
      }
    },
    { deep: true },
  )

  onUnmounted(() => {
    destroyLayer()
  })

  return {
    initLayer,
    destroyLayer,
    rebuildMarkers,
  }
}
