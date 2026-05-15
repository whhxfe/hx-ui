import { watch, onUnmounted, shallowRef, type ShallowRef } from 'vue'
import { render, type VNode } from 'vue'

import type { Map as OlMap } from 'ol'
import type { MapMarkerItem } from '../types'

export interface UseMarkerLayerOptions {
  map: OlMap | null
  markers: MapMarkerItem[]
  markerRadius?: number
  markerColor?: string
  markerContent?: (item: MapMarkerItem) => VNode | string
}

export function useMarkerLayer(options: UseMarkerLayerOptions) {
  const { map, markerRadius = 6, markerColor = '#ff0000' } = options

  let layer: any = null
  let source: any = null
  let clickKey: any = null

  const overlayMap = new Map<string | number, any>()
  let activePopupId: string | number | null = null

  const initLayer = async () => {
    if (!map) return

    const [
      { default: VectorLayer },
      { default: VectorSource },
      { Feature },
      { default: Point },
      { default: Overlay },
      { fromLonLat },
      { Style, Fill, Stroke, Circle },
      { default: MapBrowserEvent },
      { unByKey },
    ] = await Promise.all([
      import('ol/layer/Vector'),
      import('ol/source/Vector'),
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

    const rebuildMarkers = () => {
      if (!map || !source) return

      source.clear()
      overlayMap.forEach((o) => map!.removeOverlay(o))
      overlayMap.clear()
      activePopupId = null

      options.markers.forEach((item) => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([item.lon, item.lat])),
          data: item,
        })

        feature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: markerRadius,
              fill: new Fill({ color: markerColor }),
              stroke: new Stroke({ color: '#fff', width: 1.5 }),
            }),
          }),
        )

        source!.addFeature(feature)

        if (options.markerContent) {
          createPopup(item)
        }
      })
    }

    clickKey = map.on('singleclick', (e: any) => {
      let hit = false

      map!.forEachFeatureAtPixel(e.pixel, (feature: any) => {
        const data = feature.get('data') as MapMarkerItem | undefined
        if (!data) return false

        showPopup(data.id, feature.getGeometry().getCoordinates())

        hit = true
        return true
      })

      if (!hit && activePopupId) {
        hidePopup(activePopupId)
      }
    })

    source = new VectorSource()
    layer = new VectorLayer({ source })

    map.addLayer(layer)
    rebuildMarkers()
  }

  const destroyLayer = () => {
    if (!map) return

    if (clickKey) {
      import('ol/Observable').then(({ unByKey }) => unByKey(clickKey))
      clickKey = null
    }

    if (layer) {
      map.removeLayer(layer)
      layer = null
    }

    overlayMap.forEach((o) => map!.removeOverlay(o))
    overlayMap.clear()

    source = null
  }

  watch(
    () => map,
    (newMap) => {
      if (newMap && !layer) {
        initLayer()
      }
    },
    { immediate: true },
  )

  watch(
    () => options.markers,
    () => {
      if (source) {
        initLayer()
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
  }
}
