/**
 * 点位样式构建 composable
 *
 * 职责：
 * - 统一管理图片缓存（imageSizeCache / preloadedImages）
 * - 提供 buildIconStyle() 统一构建 Icon 样式
 * - 提供 buildMarkerStyle / buildMarkerStyleSync 构建单点样式
 * - 提供 buildClusterStyleSync 构建聚合样式
 * - 样式缓存为模块级别单例，跨组件实例共享
 */

import { render, type VNode } from 'vue'
import type { MapMarkerItem, MarkerStyle, MarkerShape, ShapeDefinition } from '../types'
import { ensureOlModules, useOlModules } from './useOlModules'

const isSSR = typeof window === 'undefined'

// ==================== 形状注册表 ====================

/** 形状注册表 */
const shapeRegistry = new Map<string, { svg: string; defaultColor: string; size: [number, number]; isRaw: boolean }>()

/**
 * 批量注册自定义形状
 * @param shapes - 形状定义数组
 * @param fetchOptions - URL 模式下的 fetch 配置
 * @returns Promise，URL 模式下等待 SVG 内容获取完成
 *
 * @example
 * // 同步注册（Raw SVG）
 * registerMapMarkerShapes([{ name: 'star', svg: '<svg>...</svg>' }])
 *
 * // 异步注册（URL SVG，自动获取内容）
 * await registerMapMarkerShapes([{ name: 'marker', svg: 'https://example.com/icon.svg' }])
 */
export async function registerMapMarkerShapes(
  shapes: ShapeDefinition[],
  fetchOptions?: RequestInit,
): Promise<void> {
  for (const def of shapes) {
    let svgContent = def.svg

    // URL 模式：自动 fetch SVG 内容以支持颜色替换
    if (!svgContent.trimStart().startsWith('<') && isHttpUrl(svgContent)) {
      try {
        const response = await fetch(svgContent, fetchOptions)
        if (response.ok) {
          svgContent = await response.text()
        } else {
          console.warn(
            `[useMarkerStyle] Failed to fetch SVG from "${svgContent}", using URL directly (color replacement disabled).`,
          )
        }
      } catch (e) {
        console.warn(
          `[useMarkerStyle] Failed to fetch SVG from "${svgContent}", using URL directly (color replacement disabled).`,
          e,
        )
      }
    }

    const isRaw = svgContent.trimStart().startsWith('<')
    let size: [number, number]

    if (isRaw) {
      // 解析 SVG 内容获取实际尺寸
      const parsedSize = parseSvgSize(svgContent)
      size = def.size ?? parsedSize
    } else {
      // URL 模式下，使用传入的 size 或默认值
      size = def.size ?? [24, 24]
    }

    shapeRegistry.set(def.name, {
      svg: svgContent,
      defaultColor: def.defaultColor || '#409eff',
      size,
      isRaw,
    })
  }
}

/**
 * 检测是否为 HTTP URL
 */
function isHttpUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * 从 SVG 内容中解析尺寸
 * 优先使用 viewBox，其次使用 width/height 属性
 */
function parseSvgSize(svgContent: string): [number, number] {
  // 尝试从 viewBox 解析
  const viewBoxMatch = svgContent.match(/viewBox\s*=\s*["']([^"']+)["']/i)
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].split(/\s+/)
    if (parts.length >= 4) {
      const width = parseFloat(parts[2])
      const height = parseFloat(parts[3])
      if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
        return [width, height]
      }
    }
  }

  // 尝试从 width/height 属性解析
  const widthMatch = svgContent.match(/width\s*=\s*["']?(\d+(?:\.\d+)?)/i)
  const heightMatch = svgContent.match(/height\s*=\s*["']?(\d+(?:\.\d+)?)/i)
  if (widthMatch && heightMatch) {
    const width = parseFloat(widthMatch[1])
    const height = parseFloat(heightMatch[1])
    if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
      return [width, height]
    }
  }

  // 默认值
  return [24, 24]
}

/**
 * 获取已注册的形状名称列表
 */
export function getRegisteredShapes(): string[] {
  return [...shapeRegistry.keys()]
}

/** 默认图标尺寸（圆形和图标模式统一） */
const DEFAULT_ICON_SIZE: [number, number] = [20, 20]

export interface UseMarkerStyleOptions {
  /** 默认形状类型 */
  shape?: MarkerShape
  /** 图标 URL */
  iconUrl?: string
  /** 图标渲染尺寸 [width, height]，同时适用于圆形和图标模式，默认 [20, 20] */
  iconSize?: [number, number]
  /** 图标原始尺寸 [width, height] */
  iconOriginalSize?: [number, number]
  /** 图标锚点（默认为底部中心 [0.5, 1]） */
  iconAnchor?: [number, number]
  /** 自定义渲染函数 */
  render?: (item: MapMarkerItem) => string | VNode
  /** 圆形填充颜色 */
  color?: string
}

// ==================== 图片缓存（模块级别单例） ====================

/** 预加载的图片缓存（供 buildMarkerStyleSync 使用） */
const preloadedImages = new Map<string, HTMLImageElement>()

/** 图片尺寸缓存 */
const imageSizeCache = new Map<string, [number, number]>()

// ==================== 样式缓存（模块级别单例，跨组件实例共享） ====================

/** 聚合样式缓存 - 模块级，避免丢失 */
const moduleClusterStyleCache = new Map<string, any>()

/** 单点样式缓存（同步版本）- 模块级 */
const moduleMarkerStyleCache = new Map<string, any>()

/**
 * 预加载图标图片
 */
export function preloadIcon(src: string): Promise<HTMLImageElement> {
  if (isSSR) {
    return Promise.resolve(null as any)
  }
  if (preloadedImages.has(src)) {
    return Promise.resolve(preloadedImages.get(src)!)
  }
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      preloadedImages.set(src, img)
      imageSizeCache.set(src, [img.naturalWidth, img.naturalHeight])
      resolve(img)
    }
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

/**
 * 获取图片原始尺寸（自动缓存）
 */
export function getImageSize(src: string): Promise<[number, number]> {
  if (isSSR) {
    return Promise.resolve([0, 0])
  }
  if (imageSizeCache.has(src)) {
    return Promise.resolve(imageSizeCache.get(src)!)
  }
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const size: [number, number] = [img.naturalWidth, img.naturalHeight]
      imageSizeCache.set(src, size)
      // 同时缓存到 preloadedImages，供同步函数使用
      preloadedImages.set(src, img)
      resolve(size)
    }
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`))
    }
    img.src = src
  })
}

// ==================== 统一的 Icon 样式构建 ====================

/**
 * 统一构建 Icon 样式
 * 处理 URL 图标的尺寸获取、scale 计算、加载失败降级
 *
 * @param url - 图标 URL
 * @param targetSize - 目标渲染尺寸 [width, height]，默认 [32, 32]
 * @param anchor - 图标锚点，默认 [0.5, 1]（底部中心）
 * @returns OL Style 实例
 */
export async function buildIconStyle(
  url: string,
  targetSize?: [number, number],
  anchor?: [number, number],
): Promise<any> {
  const modules = await ensureOlModules()
  const { Style, Icon } = modules

  const size = targetSize ?? [32, 32]
  const iconAnchor = anchor ?? [0.5, 1]

  try {
    const originalSize = await getImageSize(url)
    // getImageSize 成功后 preloadedImages 中已有缓存的 img
    const img = preloadedImages.get(url)

    if (img) {
      // img 模式：使用 scale 控制显示尺寸，避免同时传入 size 导致 OL 内部 null 引用崩溃
      const scaleX = size[0] / originalSize[0]
      return new Style({
        image: new Icon({
          img,
          imgSize: originalSize,
          scale: scaleX,
          anchor: iconAnchor,
        }),
      })
    }

    // src 模式：使用 size 控制显示尺寸
    return new Style({
      image: new Icon({
        src: url,
        size,
        anchor: iconAnchor,
      }),
    })
  } catch (e) {
    // 图片加载失败，降级为灰色圆形
    const fallbackRadius = Math.min(size[0], size[1]) / 2
    return new Style({
      image: new modules.Circle({
        radius: fallbackRadius,
        fill: new modules.Fill({ color: '#909399' }),
        stroke: new modules.Stroke({ color: '#fff', width: 1.5 }),
      }),
    })
  }
}

/**
 * 同步构建 Icon 样式（需要图片已预加载）
 * 用于 Cluster 模式下同步样式回调
 *
 * @param url - 图标 URL
 * @param targetSize - 目标渲染尺寸 [width, height]，默认 [32, 32]
 * @param anchor - 图标锚点，默认 [0.5, 1]
 * @returns OL Style 实例，图片未预加载时返回 null
 */
export function buildIconStyleSync(
  url: string,
  targetSize?: [number, number],
  anchor?: [number, number],
): any | null {
  const modules = useOlModules()
  if (!modules) return null

  const { Style, Icon } = modules

  if (!preloadedImages.has(url)) {
    return null
  }

  const img = preloadedImages.get(url)!
  const size = targetSize ?? [32, 32]
  const originalSize: [number, number] = [img.naturalWidth, img.naturalHeight]

  // img 模式：使用 scale 控制显示尺寸，避免同时传入 size 导致 OL 内部 null 引用崩溃
  const scaleX = size[0] / originalSize[0]
  return new Style({
    image: new Icon({
      img,
      imgSize: originalSize,
      scale: scaleX,
      anchor: anchor ?? [0.5, 1],
    }),
  })
}

// ==================== 形状 SVG 构建 ====================

/** 形状 data URI 缓存，避免重复 encode */
const shapeDataUriCache = new Map<string, string>()

/**
 * 获取形状的可渲染资源（data URI 或 URL）
 * @returns [src, size] 或 null
 */
function getShapeSrc(shape: string, color?: string): [string, [number, number]] | null {
  const def = shapeRegistry.get(shape)
  if (!def) return null

  if (!def.isRaw) {
    // URL 模式：直接使用，颜色不可控
    return [def.svg, def.size]
  }

  // Raw SVG 模式：替换 currentColor，生成 data URI
  const shapeColor = color || def.defaultColor
  const cacheKey = `${shape}-${shapeColor}`

  if (shapeDataUriCache.has(cacheKey)) {
    return [shapeDataUriCache.get(cacheKey)!, def.size]
  }

  const svg = def.svg.replace(/currentColor/g, shapeColor)
  const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  shapeDataUriCache.set(cacheKey, dataUri)

  // 预加载 data URI 到 preloadedImages，供 buildShapeIconStyle 的 img 模式使用
  if (!isSSR) {
    const cachedImg = new Image()
    cachedImg.onload = () => {
      preloadedImages.set(dataUri, cachedImg)
      imageSizeCache.set(dataUri, [cachedImg.naturalWidth, cachedImg.naturalHeight])
    }
    cachedImg.onerror = () => {
      // data URI 加载失败不需要处理
    }
    cachedImg.src = dataUri
  }

  return [dataUri, def.size]
}

/**
 * 获取形状的默认颜色
 */
function getShapeDefaultColor(shape: string): string {
  return shapeRegistry.get(shape)?.defaultColor || '#409eff'
}

/**
 * 预加载形状（公开，供外部预热调用）
 * 直接生成 data URI 缓存，无需额外操作
 */
export async function preloadShape(shape: string, color?: string): Promise<void> {
  if (shape === 'circle') return
  getShapeSrc(shape, color)
}

/**
 * 构建形状的 OL Icon 样式
 * 直接使用 SVG data URI 作为 Icon.src，OpenLayers 内部会处理图片加载
 * @param modules - OpenLayers 模块
 * @param shape - 形状名称
 * @param color - 渲染颜色
 * @param iconSize - 目标渲染尺寸
 * @param iconOriginalSize - SVG 原始尺寸（优先使用，否则从注册信息获取）
 */
function buildShapeIconStyle(
  modules: any,
  shape: string,
  color: string,
  iconSize?: [number, number],
  iconOriginalSize?: [number, number],
): any | null {
  const { Style, Icon } = modules

  const src = getShapeSrc(shape, color)
  if (!src) return null

  const [srcUrl, svgSize] = src
  // 优先使用 iconOriginalSize，否则使用注册时解析的 SVG 尺寸
  const imgSize = iconOriginalSize ?? svgSize
  const displaySize = iconSize ?? imgSize
  // 计算缩放比例：将原始尺寸缩放到目标渲染尺寸
  const scaleX = displaySize[0] / imgSize[0]

  // 优先使用 img 模式（data URI 已在 getShapeSrc 中同步预加载）
  if (preloadedImages.has(srcUrl)) {
    return new Style({
      image: new Icon({
        img: preloadedImages.get(srcUrl)!,
        imgSize,
        scale: scaleX,
      }),
    })
  }

  // src 模式：传入 imgSize 告知 OL 图片原始尺寸，避免 OL 在图片加载完成前访问 null 属性导致崩溃
  return new Style({
    image: new Icon({
      src: srcUrl,
      imgSize,
      scale: scaleX,
    }),
  })
}

/**
 * 构建默认形状样式（异步）
 * 直接使用 SVG data URI
 */
async function buildShapeStyle(
  shape: MarkerShape | undefined,
  color: string,
  iconSize?: [number, number],
  iconOriginalSize?: [number, number],
): Promise<any> {
  const modules = await ensureOlModules()
  const { Style, Circle, Fill, Stroke } = modules

  if (shape && shape !== 'circle' && shapeRegistry.has(shape)) {
    const style = buildShapeIconStyle(modules, shape, color, iconSize, iconOriginalSize)
    if (style) return style
  }

  // 默认 circle（使用 iconSize 宽度的一半作为半径）
  const size = iconSize ?? DEFAULT_ICON_SIZE
  const radius = size[0] / 2
  return new Style({
    image: new Circle({
      radius,
      fill: new Fill({ color }),
      stroke: new Stroke({ color: '#fff', width: 1.5 }),
      // anchor: [0.5, 1],
    }),
  })
}

/**
 * 构建默认形状样式（同步）
 * 直接使用 SVG data URI
 */
function buildShapeStyleSync(
  shape: MarkerShape | undefined,
  color: string,
  iconSize?: [number, number],
  iconOriginalSize?: [number, number],
): any {
  const modules = useOlModules()
  if (!modules) return null

  const { Style, Circle, Fill, Stroke } = modules

  if (shape && shape !== 'circle' && shapeRegistry.has(shape)) {
    const style = buildShapeIconStyle(modules, shape, color, iconSize, iconOriginalSize)
    if (style) return style
  }

  // 默认 circle（使用 iconSize 宽度的一半作为半径）
  const size = iconSize ?? DEFAULT_ICON_SIZE
  const radius = size[0] / 2
  return new Style({
    image: new Circle({
      radius,
      fill: new Fill({ color }),
      stroke: new Stroke({ color: '#fff', width: 1.5 }),
    }),
  })
}

// ==================== 自定义渲染样式构建 ====================

/**
 * 构建自定义渲染样式（异步）
 *
 * 将 VNode / HTML 字符串渲染到 SVG foreignObject 中，生成 data URI 作为 Icon.src，
 * 避免直接将 HTMLDivElement 传给 img 参数导致 OL 内部崩溃。
 */
async function buildCustomRenderStyle(
  item: MapMarkerItem,
  renderFn: (item: MapMarkerItem) => string | VNode,
  iconSize?: [number, number],
  iconAnchor?: [number, number],
): Promise<any> {
  if (isSSR) {
    return null
  }
  const modules = await ensureOlModules()
  const { Style, Icon } = modules

  const content = renderFn(item)
  const el = document.createElement('div')
  el.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;'

  if (typeof content === 'string') {
    el.innerHTML = content
  } else {
    render(content, el)
  }

  const size = iconSize ?? [32, 32]
  const html = el.innerHTML || el.outerHTML

  // 使用 SVG foreignObject 包裹渲染后的 HTML，生成 data URI
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size[0]}" height="${size[1]}">
    <foreignObject width="${size[0]}" height="${size[1]}">
      <div xmlns="http://www.w3.org/1999/xhtml" style="width:${size[0]}px;height:${size[1]}px;display:flex;align-items:center;justify-content:center;">
        ${html}
      </div>
    </foreignObject>
  </svg>`

  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

  // 预加载 data URI 图片，然后使用 img 模式（而非 src 模式）
  // 避免 OL 在图片加载完成前访问 null 引用导致崩溃（Cannot read properties of null (reading '0')）
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Failed to load custom render data URI'))
    image.src = src
  })

  return new Style({
    image: new Icon({
      img,
      imgSize: size,
      scale: 1,
      anchor: iconAnchor ?? [0.5, 1],
    }),
  })
}

// ==================== 构建聚合样式（直接导出的函数） ====================

/**
 * 构建聚合簇样式（同步，返回 Style 实例）
 * 作为独立函数导出（不受 Hot Reload 影响），
 * composable 内部的 buildClusterStyleSync 委托给此函数
 */
function buildClusterStyleSyncImpl(
  count: number,
  typeCount?: Record<string, number>,
  names?: string[],
): any {
  const modules = useOlModules()
  if (!modules) return null

  const cacheKey = `${count}-${JSON.stringify(typeCount)}-${JSON.stringify(names)}`
  if (moduleClusterStyleCache.has(cacheKey)) {
    return moduleClusterStyleCache.get(cacheKey)
  }

  const { Style, Circle, Fill, Stroke, Text } = modules

  const radius = Math.min(24, 12 + Math.sqrt(count) * 2)

  let displayText = String(count)
  if (names && names.length > 0) {
    displayText = count > 99 ? '99+' : String(count)
  }

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

  moduleClusterStyleCache.set(cacheKey, style)
  return style
}

// ==================== composable 主体 ====================

export function useMarkerStyle() {

  /**
   * 构建单个点位的样式（异步版本）
   *
   * 优先级：
   * 1. item.iconUrl / item.render（数据项级别，最高优先级）
   * 2. item.shape / item.color（数据项级形状，优先级高于 markerStyle 配置）
   * 3. markerStyle.render / markerStyle.iconUrl（组件级配置）
   * 4. markerStyle.shape / markerStyle.color（组件级形状，兜底）
   *
   * 注意：markerGroup 的分组样式由 useMarkerGroup 处理，不经过此函数
   */
  const buildMarkerStyle = async (
    item: MapMarkerItem,
    options?: UseMarkerStyleOptions,
  ): Promise<any> => {
    // 图标尺寸和锚点：优先使用 item 级别，其次使用 options 级别
    const iconSize = item.iconSize ?? options?.iconSize ?? DEFAULT_ICON_SIZE
    const iconAnchor = item.iconAnchor ?? options?.iconAnchor

    // 颜色：优先级 item.color > options.color > 形状默认色 > #409eff
    const optionsColor = options?.color || '#409eff'

    // 模式1：item.iconUrl（最高优先级）
    if (item.iconUrl) {
      return buildIconStyle(
        item.iconUrl,
        item.iconSize ?? options?.iconSize,
        iconAnchor,
      )
    }

    // 模式2：item.render（数据项级自定义渲染）
    if (item.render) {
      try {
        return await buildCustomRenderStyle(
          item,
          item.render,
          iconSize,
          iconAnchor,
        )
      } catch (err) {
        console.error('[useMarkerStyle] item.render error:', err)
      }
    }

    // 模式3：item.shape（数据项级形状）
    if (item.shape) {
      const shapeColor = item.color || optionsColor
      return buildShapeStyle(item.shape, shapeColor, iconSize, options?.iconOriginalSize)
    }

    // 模式4：options.render（组件级自定义渲染）
    if (options?.render) {
      try {
        return await buildCustomRenderStyle(
          item,
          options.render,
          options.iconSize,
          options.iconAnchor,
        )
      } catch (err) {
        console.error('[useMarkerStyle] markerStyle.render error:', err)
      }
    }

    // 模式5：options.iconUrl（组件级图标 URL）
    if (options?.iconUrl) {
      return buildIconStyle(
        options.iconUrl,
        options.iconSize,
        options.iconAnchor,
      )
    }

    // 模式6：默认形状（shape）
    const shape = options?.shape
    const isKnownShape = shape && shape !== 'circle' && shapeRegistry.has(shape)
    const defaultColor = isKnownShape ? getShapeDefaultColor(shape!) : '#409eff'
    const color = optionsColor || defaultColor
    return buildShapeStyle(shape, color, iconSize, options?.iconOriginalSize)
  }

  /**
   * 构建单个点位样式（同步版本）
   * 用于 Cluster 模式下同步构建单点样式
   * 仅支持预加载的图标、预定义形状和默认圆形
   *
   * 缓存为模块级单例，不受 Hot Reload 影响
   *
   * 优先级：
   * 1. item.iconUrl（数据项级图标 URL）
   * 2. item.shape / item.color（数据项级形状）
   * 3. options.iconUrl（组件级图标 URL）
   * 4. options.shape / options.color（组件级形状）
   */
  function buildMarkerStyleSync(item: MapMarkerItem, options?: UseMarkerStyleOptions): any {
    // 图标尺寸和锚点：优先使用 item 级别，其次使用 options 级别
    const iconSize = item.iconSize ?? options?.iconSize ?? DEFAULT_ICON_SIZE
    const iconAnchor = item.iconAnchor ?? options?.iconAnchor
    const iconOriginalSize = options?.iconOriginalSize

    // 颜色：优先级 item.color > options.color > 形状默认色 > #409eff
    const defaultColor = options?.color || '#409eff'

    // 优先级：item 级别的属性优先于 options
    const iconUrl = item.iconUrl ?? options?.iconUrl

    // 构建缓存 key
    const cacheKey = `sync-${item.id ?? item.lon}-${item.lat}-${iconUrl ?? item.shape ?? options?.shape ?? 'circle'}-${JSON.stringify(iconSize)}-${item.color ?? defaultColor}`
    if (moduleMarkerStyleCache.has(cacheKey)) {
      return moduleMarkerStyleCache.get(cacheKey)
    }

    let style: any

    // 模式1：item.iconUrl 或 options.iconUrl（优先使用预加载的图标）
    if (iconUrl) {
      style = buildIconStyleSync(iconUrl, iconSize, iconAnchor)
    }

    // 模式2：item.shape（数据项级形状）
    if (!style && item.shape) {
      const shapeColor = item.color || defaultColor
      style = buildShapeStyleSync(item.shape, shapeColor, iconSize, iconOriginalSize)
    }

    // 模式3：options.shape（组件级形状）
    if (!style) {
      const shape = options?.shape
      const isKnownShape = shape && shape !== 'circle' && shapeRegistry.has(shape)
      const shapeDefaultColor = isKnownShape ? getShapeDefaultColor(shape!) : '#409eff'
      const shapeColor = defaultColor || shapeDefaultColor
      style = buildShapeStyleSync(shape, shapeColor, iconSize, iconOriginalSize)
    }

    if (style) {
      moduleMarkerStyleCache.set(cacheKey, style)
    }
    return style
  }

  /**
   * 构建聚合簇样式（同步，返回 Style 实例）
   * 委托给模块级函数，缓存不受 Hot Reload 影响
   *
   * OL 尚未加载时返回 null（不做无意义的 ensureOlModules 调用）
   */
  function buildClusterStyleSync(
    count: number,
    typeCount?: Record<string, number>,
    names?: string[],
  ): any {
    return buildClusterStyleSyncImpl(count, typeCount, names)
  }

  return {
    buildMarkerStyle,
    buildMarkerStyleSync,
    buildClusterStyleSync,
    preloadIcon,
  }
}