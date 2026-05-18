/**
 * 共享的点位样式构建 composable
 * 被 useMarkerLayer、useCluster、useMarkerGroup 共用
 */

import { render, type VNode } from 'vue'
import type { MapMarkerItem, MarkerStyleOptions } from '../types'
import { ensureOlModules, useOlModules } from './useOlModules'

export interface UseMarkerStyleOptions {
  /** 图标 URL（优先级高于默认圆形） */
  iconUrl?: string
  /** 图标渲染尺寸 [width, height] */
  iconSize?: [number, number]
  /** 图标原始尺寸 [width, height] */
  iconOriginalSize?: [number, number]
  /** 图标锚点（默认为底部中心 [0.5, 1]） */
  iconAnchor?: [number, number]
  /** 自定义渲染函数 */
  render?: (item: MapMarkerItem) => string | VNode
  /** 圆形半径（默认圆形模式时使用） */
  radius?: number
  /** 圆形填充颜色（默认圆形模式时使用） */
  color?: string
}

/** 预加载的图片缓存（模块级别，供 buildMarkerStyleSync 使用） */
const preloadedImages = new Map<string, HTMLImageElement>()

/**
 * 预加载图标图片（供 Markers 组件和同步样式函数使用）
 */
export function preloadIcon(src: string): Promise<HTMLImageElement> {
  if (preloadedImages.has(src)) {
    return Promise.resolve(preloadedImages.get(src)!)
  }
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      preloadedImages.set(src, img)
      resolve(img)
    }
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

/** 图片尺寸缓存 */
const imageSizeCache = new Map<string, [number, number]>()

/**
 * 异步获取图片原始尺寸
 */
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

/**
 * 绘制 cluster 样式到 Canvas
 * 支持中文、图标、圆形背景
 */
function drawClusterToCanvas(
  canvas: HTMLCanvasElement,
  count: number,
  typeCount?: Record<string, number>,
  names?: string[]
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const size = 56 * dpr
  canvas.width = size
  canvas.height = size
  canvas.style.width = '56px'
  canvas.style.height = '56px'

  const centerX = size / 2
  const centerY = size / 2

  // 计算半径（根据数量）
  const radius = Math.min(24 * dpr, 12 * dpr + Math.sqrt(count) * 2 * dpr)

  // 根据主要类型确定颜色
  let fillColor = '#409eff' // 默认蓝色
  if (typeCount) {
    const mainType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '地级市'
    const colorMap: Record<string, string> = {
      '省会': '#f56c6c',
      '地级市': '#409eff',
      '区县': '#67c23a',
      '其他': '#909399',
    }
    fillColor = colorMap[mainType] || '#409eff'
  }

  // 绘制圆形背景
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.fillStyle = fillColor
  ctx.fill()
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2 * dpr
  ctx.stroke()

  // 绘制文字
  let displayText = String(count)
  if (names && names.length > 0) {
    displayText = count > 99 ? '99+' : String(count)
  }

  ctx.fillStyle = '#fff'
  ctx.font = `bold ${14 * dpr}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(displayText, centerX, centerY)
}

/**
 * 使用点位样式构建 composable
 */
export function useMarkerStyle() {
  // Cluster 样式缓存
  const clusterStyleCache = new Map<string, any>()

  /**
   * 构建单个点位的样式
   * @param item - 点位数据
   * @param options - 样式选项
   */
  const buildMarkerStyle = async (
    item: MapMarkerItem,
    options?: UseMarkerStyleOptions
  ): Promise<any> => {
    const modules = await ensureOlModules()
    const { Style, Circle, Fill, Stroke, Icon } = modules

    const {
      radius = 6,
      color = '#ff0000',
    } = options ?? {}

    // 优先级：item.iconUrl > options.iconUrl > 默认圆形

    // 模式1：URL 图标（item 级别）
    if (item.iconUrl) {
      const targetSize = item.iconSize ?? options?.iconSize ?? [32, 32]
      try {
        const originalSize = await getImageSize(item.iconUrl)
        const scale = targetSize[0] / originalSize[0]

        return new Style({
          image: new Icon({
            src: item.iconUrl,
            imgSize: originalSize,
            scale,
            anchor: item.iconAnchor ?? options?.iconAnchor ?? [0.5, 1],
          }),
        })
      } catch {
        // 图片加载失败，降级为固定尺寸
        return new Style({
          image: new Icon({
            src: item.iconUrl,
            size: targetSize,
            anchor: item.iconAnchor ?? options?.iconAnchor ?? [0.5, 1],
          }),
        })
      }
    }

    // 模式2：URL 图标（options 级别）
    if (options?.iconUrl) {
      const targetSize = options.iconSize
      if (targetSize) {
        try {
          const originalSize = await getImageSize(options.iconUrl)
          const scale = targetSize[0] / originalSize[0]

          return new Style({
            image: new Icon({
              src: options.iconUrl!,
              imgSize: originalSize,
              scale,
              anchor: options.iconAnchor ?? [0.5, 1],
            }),
          })
        } catch {
          return new Style({
            image: new Icon({
              src: options.iconUrl!,
              size: targetSize,
              anchor: options.iconAnchor ?? [0.5, 1],
            }),
          })
        }
      }
    }

    // 模式3：自定义渲染函数
    if (options?.render) {
      try {
        const content = options.render(item)
        const el = document.createElement('div')
        el.className = 'custom-marker'

        if (typeof content === 'string') {
          el.innerHTML = content
        } else {
          render(content, el)
        }

        return new Style({
          image: new Icon({
            anchor: options.iconAnchor ?? [0.5, 1],
            img: el,
            imgSize: options.iconSize,
          }),
        })
      } catch (err) {
        console.error('[useMarkerStyle] buildMarkerStyle custom render error:', err)
      }
    }

    // 模式4：默认圆形
    return new Style({
      image: new Circle({
        radius,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: '#fff', width: 1.5 }),
      }),
    })
  }

  // 单点样式缓存
  const markerStyleCache = new Map<string, any>()

  /**
   * 构建单个点位样式（同步版本）
   * 用于 Cluster 模式下同步构建单点样式
   * 支持圆形和预加载的图标
   */
  function buildMarkerStyleSync(item: MapMarkerItem, options?: UseMarkerStyleOptions): any {
    const modules = useOlModules()
    if (!modules) return null

    const { Style, Circle, Fill, Stroke, Icon } = modules

    const radius = options?.radius ?? 6
    const color = options?.color ?? '#ff0000'

    // 构建缓存 key
    const iconUrl = options?.iconUrl ?? item.iconUrl
    const iconSize = options?.iconSize ?? item.iconSize
    const iconAnchor = options?.iconAnchor ?? item.iconAnchor
    const cacheKey = `sync-${item.id ?? item.lon}-${item.lat}-${iconUrl ?? 'circle'}-${JSON.stringify(iconSize)}-${color}`

    if (markerStyleCache.has(cacheKey)) {
      return markerStyleCache.get(cacheKey)
    }

    let style: any

    // 优先使用图标（如果有预加载的图片）
    if (iconUrl && preloadedImages.has(iconUrl)) {
      const img = preloadedImages.get(iconUrl)!
      const targetSize = iconSize ?? [32, 32]
      const scale = targetSize[0] / img.naturalWidth

      style = new Style({
        image: new Icon({
          img,
          imgSize: [img.naturalWidth, img.naturalHeight],
          scale,
          anchor: iconAnchor ?? [0.5, 1],
        }),
      })
    } else {
      // 默认圆形
      style = new Style({
        image: new Circle({
          radius,
          fill: new Fill({ color }),
          stroke: new Stroke({ color: '#fff', width: 1.5 }),
        }),
      })
    }

    markerStyleCache.set(cacheKey, style)
    return style
  }

  /**
   * 构建聚合簇样式（同步，返回 Style 实例）
   * @param count - 聚合点数量
   * @param typeCount - 按类型统计的数量
   * @param names - 主要名称列表
   */
  function buildClusterStyleSync(
    count: number,
    typeCount?: Record<string, number>,
    names?: string[]
  ): any {
    const modules = useOlModules()

    // 如果模块未加载，返回 null（会被预热后的正确样式替换）
    if (!modules) {
      ensureOlModules()
      return null
    }

    const cacheKey = `${count}-${JSON.stringify(typeCount)}-${JSON.stringify(names)}`
    if (clusterStyleCache.has(cacheKey)) {
      return clusterStyleCache.get(cacheKey)
    }

    const { Style, Circle, Fill, Stroke, Text } = modules

    const radius = Math.min(24, 12 + Math.sqrt(count) * 2)

    let displayText = String(count)
    if (names && names.length > 0) {
      displayText = count > 99 ? '99+' : String(count)
    }

    // 根据主要类型确定颜色
    let fillColor = '#409eff'
    if (typeCount) {
      const mainType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '地级市'
      const colorMap: Record<string, string> = {
        '省会': '#f56c6c',
        '地级市': '#409eff',
        '区县': '#67c23a',
        '其他': '#909399',
      }
      fillColor = colorMap[mainType] || '#409eff'
    }

    const style = new Style({
      image: new Circle({
        radius,
        fill: new Fill({ color: fillColor }),
        stroke: new Stroke({ color: '#fff', width: 2 }),
      }),
      text: new Text({
        text: displayText,
        fill: new Fill({ color: '#fff' }),
        font: 'bold 14px sans-serif',
        textAlign: 'center',
        textBaseline: 'middle',
        offsetY: -1,
      }),
    })

    clusterStyleCache.set(cacheKey, style)
    return style
  }

  /**
   * 构建聚合簇样式（异步，支持 Canvas 绘制）
   * @param count - 聚合点数量
   * @param typeCount - 按类型统计的数量
   * @param names - 主要名称列表
   */
  const buildClusterStyle = async (
    count: number,
    typeCount?: Record<string, number>,
    names?: string[]
  ): Promise<any> => {
    const modules = await ensureOlModules()
    const { Style, Icon } = modules

    const cacheKey = `canvas-${count}-${JSON.stringify(typeCount)}-${JSON.stringify(names)}`
    if (clusterStyleCache.has(cacheKey)) {
      return clusterStyleCache.get(cacheKey)
    }

    // 使用 Canvas 绘制（支持中文和图标）
    const canvas = document.createElement('canvas')
    drawClusterToCanvas(canvas, count, typeCount, names)

    const style = new Style({
      image: new Icon({
        img: canvas,
        imgSize: [56, 56],
        anchor: [0.5, 0.5],
      }),
    })

    clusterStyleCache.set(cacheKey, style)
    return style
  }

  return {
    buildMarkerStyle,
    buildMarkerStyleSync,
    buildClusterStyle,
    buildClusterStyleSync,
    preloadIcon,
  }
}
