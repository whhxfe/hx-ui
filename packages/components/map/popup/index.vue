<script setup lang="ts">
/**
 * 地图弹窗组件
 * 作为 Markers 的子组件使用，通过 MapContext 获取激活的 marker 并渲染弹窗
 */
import { watch, ref, onUnmounted, inject } from 'vue'
import { render } from 'vue'
import { useMapContext } from '../composables/useMapContext'
import { useMapRef } from '../composables/useMap'
import { ensureOlModules } from '../composables/useOlModules'
import { MARKERS_DATA_KEY } from '../shared/keys'
import type { MapMarkerItem } from '../types'
import type { PopupProps } from './types'

const props = withDefaults(defineProps<PopupProps>(), {
  offset: () => [0, -12],
  showClose: true,
  multiple: false,
})

const mapRef = useMapRef()
const mapContext = useMapContext()

const activeMarker = mapContext?.activeMarker ?? ref(null)
const activeCoord = mapContext?.activeCoord ?? ref(null)

/** 从父级 Markers 注入的 marker IDs，用于过滤 */
const markerIds = inject<Set<string>>(MARKERS_DATA_KEY, null)

const overlays = new Map<string, { overlay: any; rootEl: HTMLDivElement }>()

/** 非 multiple 模式下的单例 overlay id */
const SINGLETON_ID = '__singleton__'
const isVisible = ref(false)

/** 检查 activeMarker 是否属于当前 Markers 实例 */
function belongsToThisMarkers(item: MapMarkerItem | null): boolean {
  if (!markerIds || !item) return true // 没有注入时不过滤
  return markerIds.has(item.id)
}

async function createOverlay(): Promise<{ overlay: any; rootEl: HTMLDivElement } | undefined> {
  const map = mapRef.value
  if (!map) return undefined

  const { Overlay } = await ensureOlModules()
  const el = document.createElement('div')
  el.className = 'map-marker-popup'

  const ol = new Overlay({
    element: el,
    offset: props.offset,
    positioning: 'bottom-center',
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
    closeBtn.onclick = (e) => {
      console.log('[Popup] closeBtn onclick fired')
      e.stopPropagation()
      closePopup(markerId)
    }
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
  const overlayId = props.multiple ? markerId : SINGLETON_ID
  console.log('[Popup] showPopup called:', { markerId, overlayId, coord, multiple: props.multiple })

  let entry = overlays.get(overlayId)
  if (!entry) {
    console.log('[Popup] Creating new overlay for:', overlayId)
    entry = await createOverlay()
    if (!entry) return
    overlays.set(overlayId, entry)
  }

  renderContent(entry.rootEl, item, markerId)
  entry.overlay.setPosition(coord)
  isVisible.value = true
  console.log('[Popup] Popup shown, isVisible:', isVisible.value)
}

function closePopup(markerId: string) {
  console.log('[Popup] closePopup called:', { markerId, multiple: props.multiple })
  const overlayId = props.multiple ? markerId : SINGLETON_ID
  console.log('[Popup] overlayId:', overlayId)
  const entry = overlays.get(overlayId)
  console.log('[Popup] entry found:', !!entry)
  if (entry) {
    entry.overlay.setPosition(undefined)
    console.log('[Popup] overlay position set to undefined')
  }
  if (!props.multiple) {
    isVisible.value = false
    console.log('[Popup] isVisible set to false')
  }
  // 关闭时清理 activeMarker，防止事件穿透导致重新打开
  mapContext?.clearActiveMarker()
}

function hidePopup() {
  console.log('[Popup] hidePopup called')
  const entry = overlays.get(SINGLETON_ID)
  console.log('[Popup] SINGLETON_ID entry found:', !!entry)
  if (entry) entry.overlay.setPosition(undefined)
  isVisible.value = false
  console.log('[Popup] isVisible set to false in hidePopup')
}

function destroyPopup() {
  const map = mapRef.value
  if (map) {
    for (const entry of overlays.values()) {
      map.removeOverlay(entry.overlay)
    }
    overlays.clear()
  }
}

watch(
  [activeMarker, activeCoord],
  ([marker, coord]) => {
    console.log('[Popup] watch triggered:', { marker: marker?.name, coord, isVisible: isVisible.value, markerIds })
    if (marker && coord) {
      // 过滤：只响应属于自己的 marker
      if (!belongsToThisMarkers(marker)) {
        console.log('[Popup] marker not belongs to this popup, ignored')
        return
      }
      console.log('[Popup] calling showPopup')
      showPopup(marker, coord)
    } else if (!props.multiple) {
      console.log('[Popup] calling hidePopup')
      hidePopup()
    }
  },
  { immediate: true },
)

watch(
  () => props.offset,
  () => {
    // offset 变化需要重新创建 overlay
    destroyPopup()
  },
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

<style lang="scss">
// Map Marker Popup 样式（必须为非 scoped，因为 popup DOM 是通过 document.createElement 动态创建的）
.map-marker-popup {
  position: relative;
  left: 0;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  padding: 0;
  min-width: 120px;
  max-width: 300px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;

  // 底部向下箭头，指向标记点
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #fff;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
  }
}

.map-marker-popup-close {
  position: absolute;
  top: 4px;
  right: 6px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
  color: #999;
  border-radius: 50%;
  z-index: 1;

  &:hover {
    color: #333;
    background: #f5f5f5;
  }
}

.map-marker-popup-content {
  padding: 10px 28px 10px 12px;
}

.default-popup-title {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
}

.default-popup-desc {
  font-size: 12px;
  color: #999;
}
</style>
