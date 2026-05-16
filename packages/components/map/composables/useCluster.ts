import { watch, onUnmounted } from 'vue'
import { render, type VNode } from 'vue'
import type { Map as OlMap } from 'ol'
import type { MapMarkerItem, MarkerStyleOptions, ClusterContentInfo } from '../types'
import { useOlModules, ensureOlModules } from './useOlModules'
import { usePopup } from './usePopup'

export interface UseClusterOptions {
  map: OlMap | null
  markers: MapMarkerItem[]
  markerRadius?: number
  markerColor?: string
  clusterDistance?: number
  markerContent?: (item: MapMarkerItem) => VNode | string
  clusterContent?: (info: ClusterContentInfo) => VNode | string
  markerStyle?: MarkerStyleOptions
}

export function useCluster(options: UseClusterOptions) {
  const {
    map,
    markerRadius = 6,
    markerColor = '#ff0000',
    clusterDistance = 40,
  } = options

  const popup = usePopup({
    markerContent: options.markerContent,
    popupOffset: [0, -markerRadius],
  })

  let rawSource: any = null
  let clusterSource: any = null
  let layer: any = null
  let spiderSource: any = null
  let spiderLayer: any = null
  let clickKey: any = null
  let initialized = false

  let clusterPopup: any = null

  const rebuildMarkers = async () => {
    if (!rawSource || !map) return

    rawSource.clear()
    spiderSource?.clear()

    popup.removeAllPopups(map)

    const modules = await ensureOlModules()
    const { Feature, Point } = modules

    options.markers.forEach((item) => {
      const feature = new Feature({
        geometry: new Point(modules.fromLonLat([item.lon, item.lat])),
        data: item,
      })
      rawSource!.addFeature(feature)

      if (options.markerContent) {
        popup.createPopup(map, item)
      }
    })
  }

  const buildMarkerStyle = (item?: MapMarkerItem) => {
    const modules = useOlModules() as any
    if (!modules) return null

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

      return new modules.Style({
        image: new modules.Icon({
          src: markerStyle.iconUrl,
          imgSize: imgSize,
          scale: scale,
          anchor: markerStyle.iconAnchor ?? [0.5, 1],
        }),
      })
    }

    // 模式2：自定义渲染函数（仅单点模式）
    if (markerStyle?.render && item) {
      const el = document.createElement('div')
      el.className = 'custom-marker'
      const content = markerStyle.render(item)
      if (typeof content === 'string') {
        el.innerHTML = content
      } else {
        render(content, el)
      }
      return new modules.Style({
        image: new modules.Icon({
          anchor: markerStyle.iconAnchor ?? [0.5, 1],
          img: el,
          imgSize: markerStyle.iconSize,
        }),
      })
    }

    // 模式3：默认圆形
    return new modules.Style({
      image: new modules.Circle({
        radius: markerRadius,
        fill: new modules.Fill({ color: markerColor }),
        stroke: new modules.Stroke({ color: '#fff', width: 1.5 }),
      }),
    })
  }

  const clusterStyleFn = (feature: any) => {
    const modules = useOlModules() as any
    if (!modules) return null

    const features = feature.get('features')
    const size = features.length

    if (size === 1) {
      const firstItem = features[0].get('data')
      return buildMarkerStyle(firstItem)
    }

    // 聚合：统计各类型数量
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

    const radius = Math.min(28, 12 + Math.sqrt(size) * 3)

    let displayText = String(size)
    if (names.length > 0) {
      displayText = size > 99 ? '99+' : String(size)
    }

    const mainType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '地级市'
    const colorMap: Record<string, string> = {
      '省会': '#f56c6c',
      '地级市': '#409eff',
      '区县': '#67c23a',
      '其他': '#909399',
    }
    const fillColor = colorMap[mainType] || '#409eff'

    return new modules.Style({
      image: new modules.Circle({
        radius,
        fill: new modules.Fill({ color: fillColor }),
        stroke: new modules.Stroke({ color: '#fff', width: 2 }),
      }),
      text: new modules.Text({
        text: displayText,
        fill: new modules.Fill({ color: '#fff' }),
        font: 'bold 13px sans-serif',
        textAlign: 'center',
        textBaseline: 'middle',
        offsetY: -1,
      }),
    })
  }

  const spiderfy = async (center: any, features: any[]) => {
    if (!spiderSource) return

    const modules = await ensureOlModules()
    spiderSource.clear()

    const angleStep = (2 * Math.PI) / features.length
    const radius = 30

    features.forEach((f: any, i: number) => {
      const angle = i * angleStep
      const coord = [
        center[0] + radius * Math.cos(angle),
        center[1] + radius * Math.sin(angle),
      ]

      const spider = new modules.Feature({
        geometry: new modules.Point(coord),
        data: f.get('data'),
      })

      const item = f.get('data')
      const style = buildMarkerStyle(item)
      spider.setStyle(style)

      spiderSource!.addFeature(spider)
    })
  }

  const createClusterPopup = async (coord: [number, number], features: any[]) => {
    const modules = await ensureOlModules()
    const { Overlay } = modules

    if (clusterPopup) {
      map!.removeOverlay(clusterPopup)
    }

    const typeCount: Record<string, number> = {}
    features.forEach((f: any) => {
      const item = f.get('data')
      const type = item.type || '其他'
      typeCount[type] = (typeCount[type] || 0) + 1
    })

    const root = document.createElement('div')
    root.className = 'cluster-popup'

    if (options.clusterContent) {
      // 自定义聚合弹窗
      const contentNode = options.clusterContent({
        features,
        count: features.length,
        coordinate: coord,
        typeCount,
      })
      if (typeof contentNode === 'string') {
        root.innerHTML = contentNode
      } else {
        render(contentNode, root)
      }
    } else {
      // 默认聚合弹窗：统计列表
      const header = document.createElement('div')
      header.className = 'cluster-popup__header'
      header.textContent = `聚合 ${features.length} 个点`
      root.appendChild(header)

      const list = document.createElement('div')
      list.className = 'cluster-popup__list'
      Object.entries(typeCount).forEach(([type, count]) => {
        const item = document.createElement('div')
        item.className = 'cluster-popup__item'
        item.innerHTML = `<span class="type">${type}</span><span class="count">${count}</span>`
        list.appendChild(item)
      })
      root.appendChild(list)

      const footer = document.createElement('div')
      footer.className = 'cluster-popup__footer'
      footer.textContent = '点击区域查看详情'
      root.appendChild(footer)
    }

    clusterPopup = new Overlay({
      element: root,
      positioning: 'bottom-center',
      offset: [0, -20],
      stopEvent: false,
    })

    map!.addOverlay(clusterPopup)
    clusterPopup.setPosition(coord)
  }

  const hideClusterPopup = () => {
    if (clusterPopup) {
      map!.removeOverlay(clusterPopup)
      clusterPopup = null
    }
  }

  const initCluster = async () => {
    if (!map) return

    const modules = await ensureOlModules()
    const { VectorLayer, VectorSource, ClusterSource } = modules

    if (!layer) {
      rawSource = new VectorSource()
      clusterSource = new ClusterSource({
        distance: clusterDistance,
        source: rawSource,
      })

      layer = new VectorLayer({
        source: clusterSource,
        style: clusterStyleFn,
      })

      spiderSource = new VectorSource()
      spiderLayer = new VectorLayer({ source: spiderSource })

      map.addLayer(layer)
      map.addLayer(spiderLayer)
    }

    if (!clickKey) {
      clickKey = map.on('singleclick', (e: any) => {
        hideClusterPopup()
        spiderSource?.clear()

        let hit = false

        map!.forEachFeatureAtPixel(e.pixel, (feature: any) => {
          const features = feature.get('features')

          if (features.length > 1) {
            createClusterPopup(e.coordinate, features)
            hit = true
            return true
          }

          const real = features[0]
          const data = real.get('data')
          popup.showPopup(data.id, real.getGeometry().getCoordinates())
          hit = true
          return true
        })

        if (!hit) popup.hideActivePopup()
      })
    }

    await rebuildMarkers()
    initialized = true
  }

  const destroyCluster = async () => {
    if (!map) return

    if (clickKey) {
      const { unByKey } = await ensureOlModules()
      unByKey(clickKey)
      clickKey = null
    }

    if (clusterPopup) {
      map.removeOverlay(clusterPopup)
      clusterPopup = null
    }

    if (layer) {
      map.removeLayer(layer)
      layer = null
    }

    if (spiderLayer) {
      map.removeLayer(spiderLayer)
      spiderLayer = null
    }

    popup.removeAllPopups(map)

    rawSource = null
    clusterSource = null
    spiderSource = null
    initialized = false
  }

  watch(
    () => [options.markers, options.markerStyle],
    () => {
      if (initialized && rawSource) rebuildMarkers()
    },
    { deep: true },
  )

  onUnmounted(() => {
    destroyCluster()
  })

  const refreshStyle = () => {
    if (layer) {
      layer.changed()
    }
    spiderSource?.clear()
    hideClusterPopup()
  }

  return {
    initCluster,
    destroyCluster,
    refreshStyle,
  }
}
