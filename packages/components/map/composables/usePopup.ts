/**
 * 公共弹窗 composable
 * 消除 useMarkerLayer / useCluster / useMarkerGroup 三处的重复弹窗逻辑
 */

import { render, type VNode } from 'vue'
import type { Map as OlMap } from 'ol'
import type { MapMarkerItem } from '../types'
import { ensureOlModules } from './useOlModules'

export interface UsePopupOptions {
  /** 标记点弹窗内容渲染函数 */
  markerContent?: (item: MapMarkerItem) => VNode | string
  /** 弹窗偏移量（默认 [0, -6]） */
  popupOffset?: [number, number]
}

export interface UsePopupReturn {
  /** 创建并添加弹窗到地图 */
  createPopup: (map: OlMap, item: MapMarkerItem, offsetOverride?: [number, number]) => Promise<void>
  /** 显示指定 ID 的弹窗 */
  showPopup: (id: string | number, coord: any) => void
  /** 隐藏指定 ID 的弹窗 */
  hidePopup: (id: string | number) => void
  /** 隐藏当前激活的弹窗 */
  hideActivePopup: () => void
  /** 当前是否有弹窗激活 */
  hasActivePopup: () => boolean
  /** 获取当前激活的弹窗 ID */
  getActivePopupId: () => string | number | null
  /** 移除地图上的所有弹窗 */
  removeAllPopups: (map: OlMap) => void
}

export function usePopup(options: UsePopupOptions): UsePopupReturn {
  const overlayMap = new Map<string | number, any>()
  let activePopupId: string | number | null = null

  const createPopup = async (
    map: OlMap,
    item: MapMarkerItem,
    offsetOverride?: [number, number],
  ) => {
    const { Overlay } = await ensureOlModules()

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

    const offset = offsetOverride ?? options.popupOffset ?? [0, -6]

    const overlay = new Overlay({
      element: root,
      positioning: 'bottom-center',
      offset,
    })

    closeBtn.onclick = () => hidePopup(item.id)

    overlayMap.set(item.id, overlay)
    map.addOverlay(overlay)
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

  const hideActivePopup = () => {
    if (activePopupId) hidePopup(activePopupId)
  }

  const hasActivePopup = () => activePopupId !== null

  const getActivePopupId = () => activePopupId

  const removeAllPopups = (map: OlMap) => {
    overlayMap.forEach((o) => map.removeOverlay(o))
    overlayMap.clear()
    activePopupId = null
  }

  return {
    createPopup,
    showPopup,
    hidePopup,
    hideActivePopup,
    hasActivePopup,
    getActivePopupId,
    removeAllPopups,
  }
}
