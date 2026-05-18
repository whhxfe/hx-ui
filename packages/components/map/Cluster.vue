<script setup lang="ts">
/**
 * 地图聚合组件
 * 只负责聚合逻辑，提供 ClusterContext 给嵌套的 Markers 组件使用
 */
import { ref, watch, watchEffect, onUnmounted, type VNode } from 'vue'
import { render } from 'vue'
import { useMapRef, useMapReady } from './composables/useMap'
import { provideClusterContext } from './composables/useClusterContext'
import { ensureOlModules } from './composables/useOlModules'
import type { MapMarkerItem, ClusterContentInfo } from './types'

export interface ClusterProps {
  /** 标记点列表 */
  markers: MapMarkerItem[]
  /** 聚合距离（像素） */
  distance?: number
  /** 自定义聚合弹窗内容 */
  clusterContent?: (info: ClusterContentInfo) => VNode | string
}

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

let clusterSource: any = null
let clusterLayer: any = null
let clusterPopup: any = null
let clickKey: any = null

/**
 * 创建聚合弹窗
 */
async function createClusterPopup(coord: [number, number], features: any[]) {
  const modules = await ensureOlModules()
  const map = mapRef.value
  if (!map) return

  const { Overlay } = modules

  // 移除旧的弹窗
  if (clusterPopup) {
    map.removeOverlay(clusterPopup)
  }

  const typeCount: Record<string, number> = {}
  features.forEach((f: any) => {
    const item = f.get('data')
    const type = item.type || '其他'
    typeCount[type] = (typeCount[type] || 0) + 1
  })

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

  clusterPopup = new Overlay({
    element: root,
    positioning: 'bottom-center',
    offset: [0, -20],
    stopEvent: false,
  })

  map.addOverlay(clusterPopup)
  clusterPopup.setPosition(coord)

  // 通过上下文通知嵌套的 Markers
  clusterContext.showClusterPopup(coord, features)
}

/**
 * 隐藏聚合弹窗
 */
function hideClusterPopup() {
  if (clusterPopup) {
    mapRef.value?.removeOverlay(clusterPopup)
    clusterPopup = null
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
  clusterSource = new ClusterSource({
    distance: props.distance,
    source: rawSource,
  })

  // 创建图层（样式由嵌套的 Markers 提供）
  clusterLayer = new VectorLayer({
    source: clusterSource,
    style: undefined, // 样式由 Markers 通过 clusterLayer 访问设置
  })

  // 暴露 clusterSource 给嵌套的 Markers
  clusterContext.clusterLayer.value = clusterLayer

  map.addLayer(clusterLayer)

  // 点击事件
  if (!clickKey) {
    clickKey = map.on('singleclick', (e: any) => {
      hideClusterPopup()

      map.forEachFeatureAtPixel(e.pixel, (feature: any) => {
        const features = feature.get('features')

        if (features && features.length > 1) {
          // 聚合点
          createClusterPopup(e.coordinate, features)
          emit('clusterClick', {
            features,
            count: features.length,
            coordinate: e.coordinate,
            typeCount: {},
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

  if (clickKey) {
    const { unByKey } = await ensureOlModules()
    unByKey(clickKey)
    clickKey = null
  }

  if (clusterPopup) {
    map.removeOverlay(clusterPopup)
    clusterPopup = null
  }

  if (clusterLayer) {
    map.removeLayer(clusterLayer)
    clusterLayer = null
  }

  clusterSource = null
  initialized.value = false
}

/**
 * 监听 markers 变化
 */
watchEffect(() => {
  if (!mapReady.value || initialized.value) return
  initCluster()
})

/**
 * 监听 markers 更新
 */
watch(
  () => props.markers,
  async () => {
    if (!initialized.value || !clusterSource) return
    // 重新加载点位
    initCluster()
  },
  { deep: true }
)

onUnmounted(() => {
  destroyCluster()
})

defineExpose({
  refresh: () => clusterLayer?.changed(),
  hidePopup: hideClusterPopup,
})
</script>

<template>
  <!-- Cluster 组件不渲染实际模板，只提供聚合上下文 -->
  <!-- 嵌套的 Markers 组件从上下文获取 clusterSource 并设置样式 -->
  <slot />
</template>
