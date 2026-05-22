import 'ol/ol.css'
import 'ol-layerswitcher/dist/ol-layerswitcher.css'

import { shallowRef, inject, onUnmounted, computed, type ShallowRef, type Ref, type InjectionKey, type ComputedRef } from 'vue'

import type { BaseMapProps, MapControlsConfig, MapControlType } from '../base-map/types'
import { MAP_CONFIG } from '../types'

/** Map 实例注入 key */
export const MapKey = Symbol('ol-map') as InjectionKey<ShallowRef<any>>

/** 导出 ShallowRef 类型供其他模块使用 */
export type { ShallowRef }

/** projUtils 类型签名 */
export interface ProjUtils {
  fromLonLat: (...args: any[]) => any
  toLonLat: (...args: any[]) => any
}

export interface UseMapOptions {
  props: BaseMapProps
  mapEl: Ref<HTMLDivElement | null>
  /** 外部传入的 mapRef，与组件 provide 的 MapKey 共享同一引用 */
  mapRef: ShallowRef<any>
  onMapReady?: (map: any) => void
  onMapClick?: (coordinate: [number, number]) => void
}

/** 规范化瓦片 URL：如果 URL 已包含 {z} 占位符则直接返回，否则追加标准后缀 */
function normalizeTileUrl(url?: string, defaultUrl?: string): string {
  const base = url ?? defaultUrl ?? ''
  if (base.includes('{z}')) return base
  return `${base}/{z}/{y}/{x}.png`
}

// ====================== 模块级缓存（避免重复动态导入） ======================

/** 缓存已导入的 OL 控件类 */
const controlClassCache = new Map<string, any>()

/** 获取 OL 控件类（带缓存，仅首次调用会动态 import） */
async function getControlClass(type: MapControlType): Promise<any> {
  if (controlClassCache.has(type)) return controlClassCache.get(type)
  let Class: any
  switch (type) {
    case 'zoom':
      ({ default: Class } = await import('ol/control/Zoom'))
      break
    case 'attribution':
      ({ default: Class } = await import('ol/control/Attribution'))
      break
    case 'scaleLine':
      ({ default: Class } = await import('ol/control/ScaleLine'))
      break
    case 'mousePosition':
      ({ default: Class } = await import('ol/control/MousePosition'))
      break
    case 'zoomSlider':
      ({ default: Class } = await import('ol/control/ZoomSlider'))
      break
    case 'zoomToExtent':
      ({ default: Class } = await import('ol/control/ZoomToExtent'))
      break
    case 'rotate':
      ({ default: Class } = await import('ol/control/Rotate'))
      break
    case 'overviewMap':
      ({ default: Class } = await import('ol/control/OverviewMap'))
      break
    case 'fullScreen':
      ({ default: Class } = await import('ol/control/FullScreen'))
      break
  }
  if (Class) controlClassCache.set(type, Class)
  return Class
}

// ====================== 控件工厂 ======================

/** 创建 OpenLayers 控件 */
async function createControl(type: MapControlType, options: any, mapConfig: typeof MAP_CONFIG) {
  const { fromLonLat } = await import('ol/proj')

  switch (type) {
    case 'zoom': {
      const Zoom = await getControlClass('zoom')
      return new Zoom(options ?? {})
    }
    case 'attribution': {
      const Attribution = await getControlClass('attribution')
      return new Attribution(options ?? {})
    }
    case 'scaleLine': {
      const ScaleLine = await getControlClass('scaleLine')
      return new ScaleLine(options ?? {})
    }
    case 'mousePosition': {
      const MousePosition = await getControlClass('mousePosition')
      return new MousePosition(options ?? {})
    }
    case 'zoomSlider': {
      const ZoomSlider = await getControlClass('zoomSlider')
      return new ZoomSlider(options ?? {})
    }
    case 'zoomToExtent': {
      const ZoomToExtent = await getControlClass('zoomToExtent')
      const extent = options?.extent
        ? fromLonLat([options.extent[0], options.extent[1]]).concat(fromLonLat([options.extent[2], options.extent[3]]))
        : fromLonLat([mapConfig.center.lon, mapConfig.center.lat]).concat(
            fromLonLat([mapConfig.center.lon + 1, mapConfig.center.lat + 1])
          )
      return new ZoomToExtent({ ...options, extent })
    }
    case 'rotate': {
      const Rotate = await getControlClass('rotate')
      return new Rotate(options ?? {})
    }
    case 'overviewMap': {
      const OverviewMap = await getControlClass('overviewMap')
      const { default: TileLayer } = await import('ol/layer/Tile')
      const { XYZ } = await import('ol/source')
      const overviewLayer = new TileLayer({
        source: new XYZ({
          url: options?.overviewUrl ?? mapConfig.satelliteUrl,
        }),
      })
      return new OverviewMap({ ...options, layers: [overviewLayer] })
    }
    case 'fullScreen': {
      const FullScreen = await getControlClass('fullScreen')
      return new FullScreen(options ?? {})
    }
  }
}

/** 根据配置添加控件到地图（初始调用） */
async function addControls(
  map: any,
  controlsConfig: MapControlsConfig,
  mapConfig: typeof MAP_CONFIG,
  addedControls: globalThis.Map<string, any>
) {
  const defaultControls = ['zoom', 'attribution']

  for (const [type, config] of Object.entries(controlsConfig)) {
    if (config === false) continue
    if (config === undefined && !defaultControls.includes(type)) continue

    const options = config === true ? {} : { ...(config as object) }
    const control = await createControl(type as MapControlType, options, mapConfig)
    map.addControl(control)
    addedControls.set(type, control)
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

  if (!currentControls || typeof currentControls.get !== 'function') return

  // 确定需要启用的控件
  for (const key of [...Object.keys(newConfig ?? {}), ...defaultControls]) {
    if (shouldAddKeys.has(key)) continue
    const config = newConfig?.[key as keyof MapControlsConfig]
    if (config === false) continue
    if (config !== undefined || defaultControls.includes(key)) {
      shouldAddKeys.add(key)
    }
  }

  // 控件类型映射（OL 类名 → 内部类型 key）
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

  // 获取地图上所有控件并复制为快照
  const mapControls = map.getControls()
  const allControls = [...mapControls.getArray()]

  // 第一步：收集需要移除的控件
  const toRemove: any[] = []
  for (const control of allControls) {
    const type = controlTypeMap[control.constructor.name]
    if (!type) continue

    if (!shouldAddKeys.has(type)) {
      toRemove.push({ control, type })
    } else if (!currentControls.has(type)) {
      currentControls.set(type, control)
    } else {
      const newCfg = newConfig?.[type as keyof MapControlsConfig]
      if (typeof newCfg === 'object' && newCfg !== null && type === 'overviewMap') {
        const existingControl = currentControls.get(type)
        const overviewMapInstance = existingControl?.getOverviewMap?.()
        if (overviewMapInstance) {
          const layers = overviewMapInstance.getLayers()
          const firstLayer = layers?.item(0)
          const source = firstLayer?.getSource?.()
          const currentUrl = source?.getUrls?.()?.[0] ?? source?.getUrl?.()
          if (currentUrl !== (newCfg as any).overviewUrl) {
            toRemove.push({ control: existingControl, type })
          }
        } else {
          toRemove.push({ control: existingControl, type })
        }
      }
    }
  }

  // 第二步：执行移除
  for (const { control, type } of toRemove) {
    map.removeControl(control)
    currentControls.delete(type)
  }

  // 第三步：添加缺失的控件
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
  const { props, mapEl, mapRef, onMapReady, onMapClick } = options

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
    projUtils: { fromLonLat, toLonLat } as ProjUtils,
    addedControls,
    syncControls: async (config: MapControlsConfig | undefined) => {
      const map = mapRef.value
      if (map && addedControls && typeof addedControls.get === 'function') {
        await syncControls(map, config, MAP_CONFIG, addedControls)
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