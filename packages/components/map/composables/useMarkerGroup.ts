import { render, type VNode } from 'vue'
import type { Map as OlMap } from 'ol'
import type { MapMarkerItem, MarkerGroupConfig, MarkerGroupStyle, MarkerGroupRenderType } from '../types'
import { useOlModules, ensureOlModules } from './useOlModules'
import { usePopup } from './usePopup'

export interface UseMarkerGroupOptions {
  map: OlMap | null
  markers: MapMarkerItem[]
  markerContent?: (item: MapMarkerItem) => VNode | string
  groupConfig: MarkerGroupConfig
}

// 图片尺寸缓存，避免重复加载
const imageSizeCache = new Map<string, [number, number]>()

function getImageSize(src: string): Promise<[number, number]> {
  if (imageSizeCache.has(src)) {
    return Promise.resolve(imageSizeCache.get(src)!)
  }
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const size: [number, number] = [img.naturalWidth, img.naturalHeight]
      imageSizeCache.set(src, size)
      resolve(size)
    }
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`))
    }
    img.src = src
  })
}

export interface MarkerGroupExposed {
  showGroup(groupValue: string): void
  hideGroup(groupValue: string): void
  toggleGroup(groupValue: string): void
  showAll(): void
  hideAll(): void
  getGroupVisibility(): Record<string, boolean>
  destroy(): void
}

export function useMarkerGroup(options: UseMarkerGroupOptions): MarkerGroupExposed {
  const { map, markerContent } = options
  const { groupConfig } = options

  const popup = usePopup({ markerContent })

  // 每个分组的图层和 source
  const groupLayers = new Map<string, { layer: any; source: any }>()
  // 分组可见性状态
  const groupVisibility = new Map<string, boolean>()
  // 点击事件 key
  let clickKey: any = null

  // 根据渲染类型构建 OpenLayers Style
  // 优先级：item.iconUrl > style.iconUrl > circle 默认
  const buildGroupStyle = async (
    item: MapMarkerItem,
    style: MarkerGroupStyle,
  ): Promise<any> => {
    const modules = await ensureOlModules()
    const { Style, Circle, Fill, Stroke, Icon } = modules

    // 优先使用 item 自带的图标 URL
    if (item.iconUrl) {
      const targetSize = item.iconSize ?? style.iconSize ?? [32, 32]
      try {
        const originalSize = await getImageSize(item.iconUrl)
        const scale = targetSize[0] / originalSize[0]

        return new Style({
          image: new Icon({
            src: item.iconUrl,
            imgSize: originalSize,
            scale: scale,
            anchor: item.iconAnchor ?? style.iconAnchor ?? [0.5, 1],
          }),
        })
      } catch {
        return new Style({
          image: new Icon({
            src: item.iconUrl,
            size: targetSize,
            anchor: item.iconAnchor ?? style.iconAnchor ?? [0.5, 1],
          }),
        })
      }
    }

    const { radius = 6, color = '#ff0000' } = style

    switch (style.type) {
      case 'url':
        const targetSize2 = style.iconSize
        if (targetSize2) {
          try {
            const originalSize = await getImageSize(style.iconUrl!)
            const scale = targetSize2[0] / originalSize[0]

            return new Style({
              image: new Icon({
                src: style.iconUrl!,
                imgSize: originalSize,
                scale: scale,
                anchor: style.iconAnchor ?? [0.5, 1],
              }),
            })
          } catch {
            return new Style({
              image: new Icon({
                src: style.iconUrl!,
                size: targetSize2,
                anchor: style.iconAnchor ?? [0.5, 1],
              }),
            })
          }
        }
        return new Style({
          image: new Circle({
            radius: 6,
            fill: new Fill({ color: '#ff0000' }),
          }),
        })

      case 'custom':
        try {
          const content = style.render ? style.render(item) : item.name || ''
          let htmlContent = ''
          if (typeof content === 'string') {
            htmlContent = content
          } else {
            htmlContent = `<div>${item.name || ''}</div>`
          }

          const canvas = document.createElement('canvas')
          const size = style.iconSize ?? [80, 40]
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
            ctx.fillText(item.name || '', size[0] / 2, size[1] / 2)
          }

          return new Style({
            image: new Icon({
              img: canvas,
              imgSize: size,
              anchor: style.iconAnchor ?? [0.5, 0.5],
            }),
          })
        } catch (err) {
          console.error('[useMarkerGroup] buildGroupStyle custom mode error:', err)
          throw err
        }

      case 'circle':
      default:
        return new Style({
          image: new Circle({
            radius,
            fill: new Fill({ color }),
            stroke: new Stroke({ color: '#fff', width: 1.5 }),
          }),
        })
    }
  }

  // 创建分组图层
  const createGroupLayer = async (groupValue: string, style: MarkerGroupStyle) => {
    if (!map) return

    const modules = await ensureOlModules()
    const { VectorLayer: VL, VectorSource: VS } = modules

    const source = new VS()
    const layer = new VL({ source, zIndex: groupLayers.size + 1 })

    map.addLayer(layer)
    groupLayers.set(groupValue, { layer, source })
    groupVisibility.set(groupValue, true)
  }

  // 为分组添加点位
  const addMarkersToGroup = async (
    groupValue: string,
    markers: MapMarkerItem[],
    style: MarkerGroupStyle,
  ) => {
    const groupData = groupLayers.get(groupValue)
    if (!groupData) return

    const { source } = groupData
    const modules = await ensureOlModules()
    const { Feature, Point } = modules

    for (const item of markers) {
      const feature = new Feature({
        geometry: new Point(modules.fromLonLat([item.lon, item.lat])),
        data: item,
      })

      const featureStyle = await buildGroupStyle(item, style)
      feature.setStyle(featureStyle)

      source.addFeature(feature)

      if (markerContent) {
        const iconHeight = item.iconSize ? item.iconSize[1] : 32
        popup.createPopup(map!, item, [0, -iconHeight])
      }
    }
  }

  // 初始化所有分组
  const initGroups = async () => {
    if (!map) return

    // 注册点击事件
    if (!clickKey) {
      clickKey = map.on('singleclick', (e: any) => {
        let hit = false

        map!.forEachFeatureAtPixel(e.pixel, (feature: any, layer: any) => {
          const data = feature.get('data') as MapMarkerItem | undefined
          if (!data) return false

          popup.showPopup(data.id, feature.getGeometry().getCoordinates())

          hit = true
          return true
        })

        if (!hit) popup.hideActivePopup()
      })
    }

    // 按分组聚合点位
    const groupMarkers = new Map<string, MapMarkerItem[]>()
    for (const item of options.markers) {
      const groupValue = String(item[groupConfig.groupKey] ?? '')
      if (!groupMarkers.has(groupValue)) {
        groupMarkers.set(groupValue, [])
      }
      groupMarkers.get(groupValue)!.push(item)
    }

    // rules 转换为 Map 便于查找
    const rulesMap = new Map<string, MarkerGroupStyle>()
    for (const rule of groupConfig.rules) {
      rulesMap.set(rule.value, rule.style)
    }

    // 为每个分组创建图层并添加点位
    for (const [groupValue, markers] of groupMarkers) {
      const style = rulesMap.get(groupValue) ?? groupConfig.defaultStyle
      if (!style) {
        console.warn(`[useMarkerGroup] no style for group: ${groupValue}, skipping`)
        continue
      }

      await createGroupLayer(groupValue, style)
      await addMarkersToGroup(groupValue, markers, style)
    }

    console.log(`[useMarkerGroup] initialized ${groupLayers.size} groups`)
  }

  // 显示指定分组
  const showGroup = (groupValue: string) => {
    const groupData = groupLayers.get(groupValue)
    if (!groupData) return

    groupData.layer.setVisible(true)
    groupVisibility.set(groupValue, true)
  }

  // 隐藏指定分组
  const hideGroup = (groupValue: string) => {
    const groupData = groupLayers.get(groupValue)
    if (!groupData) return

    groupData.layer.setVisible(false)
    groupVisibility.set(groupValue, false)
  }

  // 切换分组显隐
  const toggleGroup = (groupValue: string) => {
    const isVisible = groupVisibility.get(groupValue)
    if (isVisible) {
      hideGroup(groupValue)
    } else {
      showGroup(groupValue)
    }
  }

  // 显示所有分组
  const showAll = () => {
    for (const groupValue of groupLayers.keys()) {
      showGroup(groupValue)
    }
  }

  // 隐藏所有分组
  const hideAll = () => {
    for (const groupValue of groupLayers.keys()) {
      hideGroup(groupValue)
    }
  }

  // 获取分组可见性状态
  const getGroupVisibility = (): Record<string, boolean> => {
    return Object.fromEntries(groupVisibility)
  }

  // 销毁所有图层
  const destroy = async () => {
    if (!map) return

    if (clickKey) {
      const { unByKey } = await ensureOlModules()
      unByKey(clickKey)
      clickKey = null
    }

    for (const [groupValue, { layer }] of groupLayers) {
      map.removeLayer(layer)
    }
    groupLayers.clear()
    groupVisibility.clear()

    popup.removeAllPopups(map)
  }

  // 立即初始化
  initGroups()

  return {
    showGroup,
    hideGroup,
    toggleGroup,
    showAll,
    hideAll,
    getGroupVisibility,
    destroy,
  }
}
