<script setup lang="ts">
/**
 * 地图弹窗组件
 * 作为 Markers 的子组件使用，通过 MapContext 获取激活的 marker 并渲染弹窗
 */
import { watch, ref, onUnmounted, type VNode } from 'vue'
import { render } from 'vue'
import { useMapContext } from '../composables/useMapContext'
import { useMapRef } from '../composables/useMap'
import { ensureOlModules } from '../composables/useOlModules'
import type { MapMarkerItem } from '../types'

export interface PopupProps {
  /** 自定义弹窗内容渲染函数 */
  render?: (item: MapMarkerItem) => VNode | string
  /** 弹窗偏移量（默认 [0, -10]） */
  offset?: [number, number]
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 是否允许同时显示多个 popup（默认 false） */
  multiple?: boolean
}

const props = withDefaults(defineProps<PopupProps>(), {
  offset: () => [0, -10],
  showClose: true,
  multiple: false,
})

const mapRef = useMapRef()
const mapContext = useMapContext()

const activeMarker = mapContext?.activeMarker ?? ref(null)
const activeCoord = mapContext?.activeCoord ?? ref(null)

let overlay: any = null
let rootEl: HTMLDivElement | null = null
const overlays = new Map<string, { overlay: any; rootEl: HTMLDivElement }>()
const isVisible = ref(false)

async function ensureOverlay(): Promise<any> {
  const map = mapRef.value
  if (!map) return null

  if (!overlay) {
    const { Overlay } = await ensureOlModules()
    rootEl = document.createElement('div')
    rootEl.className = 'map-marker-popup'

    overlay = new Overlay({
      element: rootEl,
      positioning: 'bottom-center',
      offset: props.offset,
      stopEvent: false,
    })
    map.addOverlay(overlay)
  }

  return overlay
}

async function createOverlay(): Promise<{ overlay: any; rootEl: HTMLDivElement } | undefined> {
  const map = mapRef.value
  if (!map) return undefined

  const { Overlay } = await ensureOlModules()
  const el = document.createElement('div')
  el.className = 'map-marker-popup'

  const ol = new Overlay({
    element: el,
    positioning: 'bottom-center',
    offset: props.offset,
    stopEvent: false,
  })
  map.addOverlay(ol)
  return { overlay: ol, rootEl: el }
}

function renderContent(root: HTMLDivElement, item: MapMarkerItem, markerId: string) {
  root.innerHTML = ''

  if (props.showClose) {
    const closeBtn = document.createElement('button')
    closeBtn.className = 'map-marker-popup-close'
    closeBtn.innerHTML = '&times;'
    closeBtn.onclick = () => closePopup(markerId)
    root.appendChild(closeBtn)
  }

  const content = document.createElement('div')
  content.className = 'map-marker-popup-content'

  if (props.render) {
    const contentNode = props.render(item)
    if (typeof contentNode === 'string') {
      content.innerHTML = contentNode
    } else {
      render(contentNode, content)
    }
  } else {
    content.innerHTML = `
      <div class="default-popup-title">${item.name || ''}</div>
      ${item.address ? `<div class="default-popup-desc">${item.address}</div>` : ''}
    `
  }

  root.appendChild(content)
}

async function showPopup(item: MapMarkerItem, coord: [number, number]) {
  const map = mapRef.value
  if (!map) return

  const markerId = String(item.id ?? `${item.lon}-${item.lat}`)

  if (props.multiple) {
    let entry = overlays.get(markerId)
    if (!entry) {
      entry = await createOverlay()
      if (entry) overlays.set(markerId, entry)
    }
    if (entry) {
      renderContent(entry.rootEl, item, markerId)
      entry.overlay.setPosition(coord)
    }
  } else {
    await ensureOverlay()
    if (!overlay || !rootEl) return
    renderContent(rootEl, item, markerId)
    overlay.setPosition(coord)
    isVisible.value = true
  }
}

function closePopup(markerId: string) {
  if (props.multiple) {
    const entry = overlays.get(markerId)
    if (entry) entry.overlay.setPosition(undefined)
  } else {
    hidePopup()
  }
}

function hidePopup() {
  if (overlay) overlay.setPosition(undefined)
  isVisible.value = false
}

function destroyPopup() {
  const map = mapRef.value
  if (map) {
    if (overlay) {
      map.removeOverlay(overlay)
      overlay = null
      rootEl = null
    }
    for (const entry of overlays.values()) {
      map.removeOverlay(entry.overlay)
    }
    overlays.clear()
  }
}

watch(
  [activeMarker, activeCoord],
  ([marker, coord]) => {
    if (marker && coord) {
      showPopup(marker, coord)
    } else if (!props.multiple) {
      hidePopup()
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  destroyPopup()
})

defineExpose({
  show: showPopup,
  hide: hidePopup,
  destroy: destroyPopup,
})
</script>

<template>
  <slot />
</template>