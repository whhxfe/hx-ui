<script setup lang="ts">
/**
 * 地图聚合组件
 * 只负责聚合逻辑，提供 ClusterContext 给嵌套的 Markers 组件使用
 */
import { ref, shallowRef, watch, watchEffect, onUnmounted, type VNode } from 'vue'
import { render } from 'vue'
import { useMapRef, useMapReady } from '../composables/useMap'
import { provideClusterContext } from '../composables/useClusterContext'
import { ensureOlModules } from '../composables/useOlModules'
import { calcTypeCount } from '../utils'
import type { ClusterContentInfo, ClusterProps } from './types'

const props = withDefaults(defineProps<ClusterProps>(), {
  distance: 40,
})

const emit = defineEmits<{
  (e: 'clusterClick', info: ClusterContentInfo): void
}>()

const mapRef = useMapRef()
const mapReady = useMapReady()

// 提供聚合上下文给嵌套的 Markers
const clusterContext = provideClusterContext()

const initialized = ref(false)

// 使用 shallowRef 管理 OL 对象，避免不必要的响应式追踪
const clusterSource = shallowRef<any>(null)
const clusterLayer = shallowRef<any>(null)
const clusterPopup = shallowRef<any>(null)
const clickKey = shallowRef<any>(null)

/**
 * 创建聚合弹窗
 */
async function createClusterPopup(coord: [number, number], features: any[]): Promise<Record<string, number>> {
  const modules = await ensureOlModules()
  const { Overlay } = modules
  const map = mapRef.value
  if (!map) return {}

  // 移除旧的弹窗
  if (clusterPopup.value) {
    map.removeOverlay(clusterPopup.value)
  }

  const typeCount = calcTypeCount(features)

  const root = document.createElement('div')
  root.className = 'cluster-popup'

  if (props.clusterContent) {
    const info: ClusterContentInfo = {
      features,
      count: features.length,
      coordinate: coord,
      typeCount,
    }
    const contentNode = props.clusterContent(info)
    if (typeof contentNode === 'string') {
      root.innerHTML = contentNode
    } else {
      render(contentNode, root)
    }
  } else {
    // 默认聚合弹窗
    const header = document.createElement('div')
    header.className = 'cluster-popup__header'
    header.textContent = `聚合 ${features.length} 个点`
    root.appendChild(header)

    const list = document.createElement('div')
    list.className = 'cluster-popup__list'
    Object.entries(typeCount).forEach(([type, count]) => {
      const item = document.createElement('div')
      item.className = 'cluster-popup__item'
      item.innerHTML = `<span class="type">${type}</span><span class="count">${count}</span>`
      list.appendChild(item)
    })
    root.appendChild(list)

    const footer = document.createElement('div')
    footer.className = 'cluster-popup__footer'
    footer.textContent = '点击区域查看详情'
    root.appendChild(footer)
  }

  clusterPopup.value = new Overlay({
    element: root,
    positioning: 'bottom-center',
    offset: [0, -20],
    stopEvent: false,
  })

  map.addOverlay(clusterPopup.value)
  clusterPopup.value.setPosition(coord)

  // 通过上下文通知嵌套的 Markers
  clusterContext.showClusterPopup(coord, features)

  return typeCount
}

/**
 * 隐藏聚合弹窗
 */
function hideClusterPopup() {
  if (clusterPopup.value) {
    mapRef.value?.removeOverlay(clusterPopup.value)
    clusterPopup.value = null
  }
  clusterContext.hideClusterPopup()
}

/**
 * 初始化聚合
 */
async function initCluster() {
  const map = mapRef.value
  if (!map) return

  const modules = await ensureOlModules()
  const { VectorLayer, VectorSource, ClusterSource } = modules

  // 创建数据源
  const rawSource = new VectorSource()

  // 加载点位
  const { Feature, Point } = modules
  for (const item of props.markers) {
    const feature = new Feature({
      geometry: new Point(modules.fromLonLat([item.lon, item.lat])),
      data: item,
    })
    rawSource.addFeature(feature)
  }

  // 创建聚合源
  clusterSource.value = new ClusterSource({
    distance: props.distance,
    source: rawSource,
  })

  // 创建图层（样式由嵌套的 Markers 提供）
  clusterLayer.value = new VectorLayer({
    source: clusterSource.value,
    style: undefined,
  })

  // 暴露 clusterSource 给嵌套的 Markers
  clusterContext.clusterLayer.value = clusterLayer.value

  map.addLayer(clusterLayer.value)

  // 点击事件
  if (!clickKey.value) {
    clickKey.value = map.on('singleclick', (e: any) => {
      hideClusterPopup()

      map.forEachFeatureAtPixel(e.pixel, (feature: any) => {
        const features = feature.get('features')

        if (features && features.length > 1) {
          createClusterPopup(e.coordinate, features).then((typeCount) => {
            emit('clusterClick', {
              features,
              count: features.length,
              coordinate: e.coordinate,
              typeCount: typeCount ?? {},
            })
          })
          return true
        }
        return false
      })
    })
  }

  initialized.value = true
}

/**
 * 销毁聚合
 */
async function destroyCluster() {
  const map = mapRef.value
  if (!map) return

  if (clickKey.value) {
    const { unByKey } = await ensureOlModules()
    unByKey(clickKey.value)
    clickKey.value = null
  }

  hideClusterPopup()

  if (clusterLayer.value) {
    map.removeLayer(clusterLayer.value)
    clusterLayer.value = null
  }

  clusterSource.value = null
  initialized.value = false
}

// ===================== 生命周期 =====================

watchEffect(() => {
  if (!mapReady.value) return

  if (initialized.value) return
  initCluster()
})

/**
 * 监听 markers 更新
 * 先销毁旧实例再用最新数据初始化，避免图层残留和内存泄漏
 */
watch(
  () => props.markers,
  async () => {
    if (!mapReady.value) return

    if (!initialized.value || !clusterSource.value) {
      // 尚未初始化，等 watchEffect 处理
      return
    }

    // 先销毁再重建，避免图层残留
    await destroyCluster()
    initCluster()
  },
  { deep: true }
)

onUnmounted(() => {
  destroyCluster()
})

defineExpose({
  refresh: () => clusterLayer.value?.changed(),
  hidePopup: hideClusterPopup,
})
</script>

<template>
  <slot />
</template>

<style lang="scss">
// Cluster Popup 样式（必须为非 scoped，因为 popup DOM 是通过 document.createElement 动态创建的）
.cluster-popup {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  padding: 0;
  min-width: 160px;
  max-width: 280px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  position: relative;

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

.cluster-popup__header {
  padding: 10px 12px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #eee;
}

.cluster-popup__list {
  padding: 4px 0;
  max-height: 200px;
  overflow-y: auto;
}

.cluster-popup__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;

  &:hover {
    background: #f5f7fa;
  }

  .type {
    color: #606266;
    font-size: 13px;
  }

  .count {
    color: #409eff;
    font-weight: 500;
    font-size: 13px;
  }
}

.cluster-popup__footer {
  padding: 8px 12px;
  font-size: 12px;
  color: #909399;
  text-align: center;
  border-top: 1px solid #eee;
}
</style>