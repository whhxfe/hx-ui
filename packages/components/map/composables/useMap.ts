import 'ol/ol.css'
import 'ol-layerswitcher/dist/ol-layerswitcher.css'

import { shallowRef, inject, onUnmounted, computed, type ShallowRef, type Ref, type InjectionKey, type ComputedRef } from 'vue'

import type { BaseMapProps, MapControlsConfig, MapControlType } from '../types'
import { MAP_CONFIG } from '../types'

/** Map 实例注入 key */
export const MapKey = Symbol('ol-map') as InjectionKey<ShallowRef<any>>

/** 导出 ShallowRef 类型供其他模块使用 */
export type { ShallowRef }

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
  // ArcGIS 使用 {z}/{y}/{x} 格式
  return `${base}/{z}/{y}/{x}.png`
}

/** 创建 OpenLayers 控件 */
async function createControl(type: MapControlType, options: any, mapConfig: typeof MAP_CONFIG) {
  const { fromLonLat } = await import('ol/proj')

  switch (type) {
    case 'zoom': {
      const { default: Zoom } = await import('ol/control/Zoom')
      return new Zoom(options ?? {})
    }
    case 'attribution': {
      const { default: Attribution } = await import('ol/control/Attribution')
      return new Attribution(options ?? {})
    }
    case 'scaleLine': {
      const { default: ScaleLine } = await import('ol/control/ScaleLine')
      return new ScaleLine(options ?? {})
    }
    case 'mousePosition': {
      const { default: MousePosition } = await import('ol/control/MousePosition')
      return new MousePosition(options ?? {})
    }
    case 'zoomSlider': {
      const { default: ZoomSlider } = await import('ol/control/ZoomSlider')
      return new ZoomSlider(options ?? {})
    }
    case 'zoomToExtent': {
      const { default: ZoomToExtent } = await import('ol/control/ZoomToExtent')
      const extent = options?.extent
        ? fromLonLat([options.extent[0], options.extent[1]]).concat(fromLonLat([options.extent[2], options.extent[3]]))
        : fromLonLat([mapConfig.center.lon, mapConfig.center.lat]).concat(
            fromLonLat([mapConfig.center.lon + 1, mapConfig.center.lat + 1])
          )
      return new ZoomToExtent({
        ...options,
        extent,
      })
    }
    case 'rotate': {
      const { default: Rotate } = await import('ol/control/Rotate')
      return new Rotate(options ?? {})
    }
    case 'overviewMap': {
      const { default: OverviewMap } = await import('ol/control/OverviewMap')
      const { default: TileLayer } = await import('ol/layer/Tile')
      const { XYZ } = await import('ol/source')

      // 鹰眼图默认使用卫星底图
      const overviewLayer = new TileLayer({
        source: new XYZ({
          url: options?.overviewUrl ?? mapConfig.satelliteUrl,
        }),
      })

      return new OverviewMap({
        ...options,
        layers: [overviewLayer],
      })
    }
    case 'fullScreen': {
      const { default: FullScreen } = await import('ol/control/FullScreen')
      return new FullScreen(options ?? {})
    }
  }
}

/** 根据配置添加控件到地图 */
async function addControls(
  map: any,
  controlsConfig: MapControlsConfig,
  mapConfig: typeof MAP_CONFIG,
  addedControls: globalThis.Map<string, any>
) {
  const defaultControls = ['zoom', 'attribution']

  for (const [type, config] of Object.entries(controlsConfig)) {
    // 如果是 false，显式禁用
    if (config === false) continue

    // 如果未配置但不是默认控件，跳过
    if (config === undefined && !defaultControls.includes(type)) continue

    // 转换为 options：true -> {}，对象 -> 浅拷贝
    const options = config === true ? {} : { ...(config as object) }

    const control = await createControl(type as MapControlType, options, mapConfig)
    map.addControl(control)
    addedControls.set(type, control) // 记录到 addedControls
  }
}

/** 同步控件配置到地图（支持动态更新） */
export async function syncControls(
  map: any,
  newConfig: MapControlsConfig | undefined,
  mapConfig: typeof MAP_CONFIG,
  currentControls: globalThis.Map<string, any>
) {
  const defaultControls = ['zoom', 'attribution']
  const shouldAddKeys = new Set<string>()

  // 确保 currentControls 是 Map 类型
  if (!(currentControls instanceof Map)) {
    console.warn('[useMap] currentControls is not a Map, skipping syncControls')
    return
  }

  // 确定需要启用的控件
  for (const key of [...Object.keys(newConfig ?? {}), ...defaultControls]) {
    if (shouldAddKeys.has(key)) continue
    const config = newConfig?.[key as keyof MapControlsConfig]
    if (config === false) continue
    if (config !== undefined || defaultControls.includes(key)) {
      shouldAddKeys.add(key)
    }
  }

  // 获取地图上所有控件
  const mapControls = map.getControls()
  const allControls = mapControls.getArray()

  // 控件类型映射
  const controlTypeMap: Record<string, string> = {
    Zoom: 'zoom',
    Attribution: 'attribution',
    ScaleLine: 'scaleLine',
    MousePosition: 'mousePosition',
    ZoomSlider: 'zoomSlider',
    ZoomToExtent: 'zoomToExtent',
    Rotate: 'rotate',
    OverviewMap: 'overviewMap',
    FullScreen: 'fullScreen',
  }

  for (const control of allControls) {
    const type = controlTypeMap[control.constructor.name]
    if (!type) continue

    if (!shouldAddKeys.has(type)) {
      // 不需要该控件
      map.removeControl(control)
      currentControls.delete(type)
    } else if (!currentControls.has(type)) {
      // 新控件但已在地图上，记录它
      currentControls.set(type, control)
    } else {
      // 已有控件，检查配置是否变化（仅对对象配置有效）
      const newCfg = newConfig?.[type as keyof MapControlsConfig]
      if (typeof newCfg === 'object' && newCfg !== null) {
        const existingControl = currentControls.get(type)
        // overviewMap 的 overviewUrl 变化时重建
        if (type === 'overviewMap' && (newCfg as any).overviewUrl) {
          const currentLayer = existingControl?.getLayer?.()
          if (currentLayer) {
            const currentUrl = currentLayer.getSource?.()?.getUrls?.()?.[0]
            if (currentUrl !== (newCfg as any).overviewUrl) {
              // 配置变化，移除旧控件后重新创建
              map.removeControl(existingControl)
              currentControls.delete(type)
            }
          }
        }
      }
    }
  }

  // 添加缺失的控件
  for (const type of shouldAddKeys) {
    if (currentControls.has(type)) continue

    const config = newConfig?.[type as keyof MapControlsConfig]
    const options = config === true ? {} : { ...((config as object) ?? {}) }
    const control = await createControl(type as MapControlType, options, mapConfig)
    map.addControl(control)
    currentControls.set(type, control)
  }
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
  // 记录已添加的控件实例
  const addedControls = new globalThis.Map<string, any>()

  let clickKey: any = null
  let layerSwitcher: any = null

  const initMap = async () => {
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

    // 添加控件
    if (props.controls) {
      await addControls(map, props.controls, MAP_CONFIG, addedControls)
    }

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

    // 清理控件
    for (const control of addedControls.values()) {
      map.removeControl(control)
    }
    addedControls.clear()

    map.getLayers().clear()
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
    addedControls,
    syncControls: (config: MapControlsConfig | undefined) => {
      const map = mapRef.value
      // 确保 map 和 addedControls 都已正确初始化
      if (map && addedControls instanceof Map) {
        console.log('[useMap] syncControls called with:', config, 'addedControls:', addedControls)
        syncControls(map, config, MAP_CONFIG, addedControls)
      } else {
        console.log('[useMap] syncControls skipped - map:', !!map, 'addedControls:', addedControls)
      }
    },
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

/** 供子组件使用：返回地图是否就绪的 computed */
export function useMapReady(): ComputedRef<boolean> {
  const mapRef = inject(MapKey, null)
  return computed(() => !!mapRef?.value)
}
