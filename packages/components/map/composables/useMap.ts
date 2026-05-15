import 'ol/ol.css'
import 'ol-layerswitcher/dist/ol-layerswitcher.css'

import { shallowRef, inject, onUnmounted, type ShallowRef, type Ref, type InjectionKey } from 'vue'

import type { BaseMapProps } from '../types'
import { MAP_CONFIG } from '../types'

/** Map 实例注入 key */
export const MapKey = Symbol('ol-map') as InjectionKey<ShallowRef<any>>

export interface UseMapOptions {
  props: BaseMapProps
  mapEl: Ref<HTMLDivElement | null>
  onMapReady?: (map: any) => void
  onMapClick?: (coordinate: [number, number]) => void
}

/** 规范化瓦片 URL：如果 URL 已包含 {z} 占位符则直接返回，否则追加标准后缀 */
function normalizeTileUrl(url?: string, defaultUrl?: string): string {
  const base = url ?? defaultUrl ?? ''
  if (base.includes('{z}')) return base
  return `${base}/{z}/{x}/{y}.png`
}

export async function useMap(options: UseMapOptions) {
  const { props, mapEl, onMapReady, onMapClick } = options

  // 动态导入 OL（可选依赖）
  const [
    { default: Map },
    { default: View },
    { default: TileLayer },
    { default: LayerGroup },
    { XYZ },
    { fromLonLat, toLonLat },
    { unByKey },
    { default: LayerSwitcher },
  ] = await Promise.all([
    import('ol/Map'),
    import('ol/View'),
    import('ol/layer/Tile'),
    import('ol/layer/Group'),
    import('ol/source'),
    import('ol/proj'),
    import('ol/Observable'),
    import('ol-layerswitcher'),
  ])

  const { BaseLayerOptions, GroupLayerOptions } = await import('ol-layerswitcher') as any

  const mapRef = shallowRef<any>(null)

  let clickKey: any = null
  let layerSwitcher: any = null

  const initMap = () => {
    if (!mapEl.value) return

    const view = new View({
      projection: 'EPSG:3857',
      center: fromLonLat([props.center?.lon ?? MAP_CONFIG.center.lon, props.center?.lat ?? MAP_CONFIG.center.lat]),
      zoom: props.zoom ?? MAP_CONFIG.zoom,
      maxZoom: props.maxZoom ?? MAP_CONFIG.maxZoom,
      minZoom: props.minZoom ?? MAP_CONFIG.minZoom,
    })

    const normalLayer = new TileLayer({
      title: '标准地图',
      type: 'base',
      visible: true,
      source: new XYZ({
        url: normalizeTileUrl(props.normalUrl, MAP_CONFIG.normalUrl),
      }),
    } as any)

    const satelliteLayer = new TileLayer({
      title: '卫星地图',
      type: 'base',
      visible: false,
      source: new XYZ({
        url: normalizeTileUrl(props.satelliteUrl, MAP_CONFIG.satelliteUrl),
      }),
    } as any)

    const baseMaps = new LayerGroup({
      title: '底图',
      layers: [satelliteLayer, normalLayer],
    } as any)

    const map = new Map({
      target: mapEl.value,
      view,
      layers: [baseMaps],
    })

    layerSwitcher = new LayerSwitcher({
      activationMode: 'click',
      reverse: true,
      groupSelectStyle: 'group',
    })

    map.addControl(layerSwitcher)

    if (onMapClick) {
      clickKey = map.on('click', (e: any) => {
        onMapClick(toLonLat(e.coordinate) as [number, number])
      })
    }

    mapRef.value = map
    onMapReady?.(map)
  }

  const destroyMap = () => {
    const map = mapRef.value
    if (!map) return

    if (clickKey) {
      unByKey(clickKey)
      clickKey = null
    }

    if (layerSwitcher) {
      map.removeControl(layerSwitcher)
      layerSwitcher = null
    }

    map.getLayers().clear()
    map.getControls().clear()
    map.getOverlays().clear()

    map.setTarget(undefined)
    mapRef.value = null
  }

  onUnmounted(destroyMap)

  return {
    mapRef,
    initMap,
    destroyMap,
    projUtils: { fromLonLat, toLonLat },
  }
}

/** 供子组件使用：注入 map ref */
export function useMapRef(): ShallowRef<any> {
  const mapRef = inject(MapKey, null)
  if (!mapRef) {
    throw new Error('useMapRef must be used within a component that provides map via useMap')
  }
  return mapRef
}
