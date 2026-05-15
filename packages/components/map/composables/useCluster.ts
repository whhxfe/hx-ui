import { watch, onUnmounted } from 'vue'
import { render, type VNode } from 'vue'

import type { Map as OlMap } from 'ol'
import type { MapMarkerItem } from '../types'

export interface UseClusterOptions {
  map: OlMap | null
  markers: MapMarkerItem[]
  markerRadius?: number
  markerColor?: string
  clusterDistance?: number
  markerContent?: (item: MapMarkerItem) => VNode | string
}

export function useCluster(options: UseClusterOptions) {
  const {
    map,
    markerRadius = 6,
    markerColor = '#ff0000',
    clusterDistance = 40,
  } = options

  let rawSource: any = null
  let clusterSource: any = null
  let layer: any = null

  let spiderSource: any = null
  let spiderLayer: any = null

  let clickKey: any = null

  const overlayMap = new Map<string | number, any>()
  let activePopupId: string | number | null = null

  const initCluster = async () => {
    if (!map) return

    const [
      { default: VectorLayer },
      { default: VectorSource },
      { default: ClusterSource },
      { Feature },
      { default: Point },
      { default: Overlay },
      { fromLonLat },
      { Style, Fill, Stroke, Circle, Text },
      { default: MapBrowserEvent },
      { unByKey },
    ] = await Promise.all([
      import('ol/layer/Vector'),
      import('ol/source/Vector'),
      import('ol/source/Cluster'),
      import('ol/Feature'),
      import('ol/geom/Point'),
      import('ol/Overlay'),
      import('ol/proj'),
      import('ol/style'),
      import('ol/MapBrowserEvent').catch(() => ({ default: class {} })),
      import('ol/Observable'),
    ])

    const CircleStyle = Circle

    const createPopup = (item: MapMarkerItem) => {
      const root = document.createElement('div')
      root.className = 'map-marker-popup'

      const content = document.createElement('div')
      content.className = 'map-marker-popup-content'
      root.appendChild(content)

      const closeBtn = document.createElement('button')
      closeBtn.className = 'map-marker-popup-close'
      closeBtn.innerHTML = '&times;'
      root.appendChild(closeBtn)

      if (options.markerContent) {
        const contentNode = options.markerContent(item)
        if (typeof contentNode === 'string') {
          content.innerHTML = contentNode
        } else {
          render(contentNode, content)
        }
      }

      const overlay = new Overlay({
        element: root,
        positioning: 'bottom-center',
        offset: [0, -markerRadius],
      })

      closeBtn.onclick = () => hidePopup(item.id)

      overlayMap.set(item.id, overlay)
      map!.addOverlay(overlay)
    }

    const showPopup = (id: string | number, coord: any) => {
      if (activePopupId && activePopupId !== id) {
        hidePopup(activePopupId)
      }
      overlayMap.get(id)?.setPosition(coord)
      activePopupId = id
    }

    const hidePopup = (id: string | number) => {
      overlayMap.get(id)?.setPosition(undefined)
      if (activePopupId === id) activePopupId = null
    }

    const clusterStyleFn = (feature: any) => {
      const features = feature.get('features')
      const size = features.length

      if (size === 1) {
        return new Style({
          image: new CircleStyle({
            radius: markerRadius,
            fill: new Fill({ color: markerColor }),
            stroke: new Stroke({ color: '#fff', width: 1.5 }),
          }),
        })
      }

      return new Style({
        image: new CircleStyle({
          radius: Math.min(20, 10 + size),
          fill: new Fill({ color: '#3399cc' }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
        text: new Text({
          text: String(size),
          fill: new Fill({ color: '#fff' }),
          font: 'bold 14px sans-serif',
        }),
      })
    }

    const spiderfy = (center: any, features: any[]) => {
      if (!spiderSource) return

      spiderSource.clear()

      const angleStep = (2 * Math.PI) / features.length
      const radius = 30

      features.forEach((f: any, i: number) => {
        const angle = i * angleStep
        const coord = [
          center[0] + radius * Math.cos(angle),
          center[1] + radius * Math.sin(angle),
        ]

        const spider = new Feature({
          geometry: new Point(coord),
          data: f.get('data'),
        })

        spider.setStyle(
          new Style({
            image: new CircleStyle({
              radius: markerRadius,
              fill: new Fill({ color: markerColor }),
              stroke: new Stroke({ color: '#fff', width: 1.5 }),
            }),
          }),
        )

        spiderSource!.addFeature(spider)
      })
    }

    const rebuildMarkers = () => {
      if (!rawSource || !map) return

      rawSource.clear()
      spiderSource?.clear()

      overlayMap.forEach((o) => map!.removeOverlay(o))
      overlayMap.clear()
      activePopupId = null

      options.markers.forEach((item) => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([item.lon, item.lat])),
          data: item,
        })
        rawSource!.addFeature(feature)

        if (options.markerContent) {
          createPopup(item)
        }
      })
    }

    clickKey = map.on('singleclick', (e: any) => {
      spiderSource?.clear()

      map!.forEachFeatureAtPixel(e.pixel, (feature: any) => {
        const features = feature.get('features')

        if (features.length > 1) {
          const zoom = map!.getView().getZoom() ?? 0

          if (zoom < 16) {
            map!.getView().animate({
              center: e.coordinate,
              zoom: zoom + 2,
              duration: 300,
            })
          } else {
            spiderfy(e.coordinate, features)
          }
          return true
        }

        const real = features[0]
        const data = real.get('data')

        showPopup(data.id, real.getGeometry().getCoordinates())
        return true
      })
    })

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

    rebuildMarkers()
  }

  const destroyCluster = () => {
    if (!map) return

    if (clickKey) {
      import('ol/Observable').then(({ unByKey }) => unByKey(clickKey))
      clickKey = null
    }

    if (layer) {
      map.removeLayer(layer)
      layer = null
    }

    if (spiderLayer) {
      map.removeLayer(spiderLayer)
      spiderLayer = null
    }

    overlayMap.forEach((o) => map!.removeOverlay(o))
    overlayMap.clear()

    rawSource = null
    clusterSource = null
    spiderSource = null
  }

  watch(
    () => map,
    (newMap) => {
      if (newMap && !layer) {
        initCluster()
      }
    },
    { immediate: true },
  )

  watch(
    () => options.markers,
    () => {
      if (rawSource) {
        initCluster()
      }
    },
    { deep: true },
  )

  onUnmounted(() => {
    destroyCluster()
  })

  return {
    initCluster,
    destroyCluster,
  }
}
