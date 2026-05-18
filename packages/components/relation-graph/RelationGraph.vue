<template>
  <div class="relation-graph" :style="{ width: parsedWidth, height: parsedHeight }">
    <div v-if="showSearch" class="relation-graph__search">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索人物..."
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <div ref="containerRef" class="relation-graph__container"></div>

    <div v-if="nodeMenu && clickedNode" class="relation-graph__menu" :style="menuStyle">
      <div class="relation-graph__menu-item" @click="handleViewDetail">
        <el-icon><View /></el-icon>
        <span>查看详情</span>
      </div>
      <div class="relation-graph__menu-item" @click="handleFocusNode">
        <el-icon><Aim /></el-icon>
        <span>聚焦节点</span>
      </div>
    </div>

    <div class="relation-graph__toolbar">
      <el-button-group>
        <el-button @click="handleZoomIn" :icon="Plus" circle size="small" />
        <el-button @click="handleZoomOut" :icon="Minus" circle size="small" />
        <el-button @click="handleFitView" :icon="FullScreen" circle size="small" />
      </el-button-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Search, View, Aim, Plus, Minus, FullScreen } from '@element-plus/icons-vue'
import { useGraph } from './composables/useGraph'
import type { RelationGraphProps, RelationNodeClickEvent } from './types'

const props = withDefaults(defineProps<RelationGraphProps>(), {
  nodes: () => [],
  edges: () => [],
  width: '100%',
  height: '500px',
  showSearch: true,
  nodeMenu: true,
  defaultIcon: () => ({
    type: 'iconify',
    icon: 'mdi:account',
  }),
  showMinimap: false,
  layoutType: 'force',
  unitRadius: 100,
  linkDistance: 120,
  nodeSize: 60,
  collapsible: false,
})

const emit = defineEmits<{
  (e: 'node-click', event: RelationNodeClickEvent): void
  (e: 'node-dblclick', event: RelationNodeClickEvent): void
}>()

// 搜索
const searchKeyword = ref('')
const containerRef = ref<HTMLElement | null>(null)
const clickedNode = ref<RelationNodeClickEvent['node'] | null>(null)
const menuStyle = ref<Record<string, string>>({})

// 尺寸解析
const parsedWidth = computed(() => {
  return typeof props.width === 'number' ? `${props.width}px` : props.width
})

const parsedHeight = computed(() => {
  return typeof props.height === 'number' ? `${props.height}px` : props.height
})

// 处理节点点击
function handleNodeClick(event: RelationNodeClickEvent) {
  emit('node-click', event)

  if (props.nodeMenu) {
    clickedNode.value = event.node
    menuStyle.value = {
      left: `${event.x}px`,
      top: `${event.y}px`,
    }
  }
}

// 关闭菜单
function handleCloseMenu() {
  clickedNode.value = null
}

// 查看详情
function handleViewDetail() {
  if (clickedNode.value) {
    emit('node-dblclick', {
      node: clickedNode.value,
      x: 0,
      y: 0,
    })
  }
  handleCloseMenu()
}

// 聚焦节点
function handleFocusNode() {
  if (clickedNode.value && graphInstance.value) {
    graphInstance.value.focusElement?.(clickedNode.value.id)
  }
  handleCloseMenu()
}

// 搜索
function handleSearch() {
  graphMethods.value.searchNodes(searchKeyword.value)
}

// 缩放控制
const graphInstance = ref<ReturnType<typeof useGraph>['graph']>(null)
const graphMethods = ref<Pick<ReturnType<typeof useGraph>, 'init' | 'getZoom' | 'setZoom' | 'fitView' | 'searchNodes' | 'clearSearch'>>({
  init: () => {},
  getZoom: () => 1,
  setZoom: () => {},
  fitView: () => {},
  searchNodes: () => {},
  clearSearch: () => {},
})

function handleZoomIn() {
  const currentZoom = graphMethods.value.getZoom()
  graphMethods.value.setZoom(currentZoom * 1.2)
}

function handleZoomOut() {
  const currentZoom = graphMethods.value.getZoom()
  graphMethods.value.setZoom(currentZoom / 1.2)
}

function handleFitView() {
  graphMethods.value.fitView()
}

// 初始化 G6
let graphContainer: HTMLElement | null = null

onMounted(async () => {
  await nextTick()
  
  graphContainer = containerRef.value
  if (graphContainer) {
    // 确保容器有尺寸
    const rect = graphContainer.getBoundingClientRect()
    const width = rect.width || 800
    const height = rect.height || 400

    if (width <= 0 || height <= 0) {
      console.warn('RelationGraph: container has no size', { width, height, rect })
    }

    const result = useGraph({
      container: graphContainer,
      nodes: props.nodes,
      edges: props.edges,
      defaultIcon: props.defaultIcon,
      width,
      height,
      showMinimap: props.showMinimap,
      layoutType: props.layoutType,
      unitRadius: props.unitRadius,
      linkDistance: props.linkDistance,
      nodeSize: props.nodeSize,
      collapsible: props.collapsible,
      onNodeClick: handleNodeClick,
    })

    graphInstance.value = result.graph as any
    graphMethods.value = result as any
    result.init()
  } else {
    console.warn('RelationGraph: container ref is null')
  }

  // 点击其他区域关闭菜单
  document.addEventListener('click', handleCloseMenu)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleCloseMenu)
})

// 监听数据变化
watch(
  () => [props.nodes, props.edges],
  () => {
    // useGraph 内部会通过 watch 响应数据变化
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.relation-graph {
  position: relative;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
  background: #fafbfc;

  &__search {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 10;
    width: 240px;

    .el-input {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
  }

  &__container {
    width: 100%;
    height: 100%;
  }

  &__menu {
    position: absolute;
    z-index: 20;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    padding: 4px;
    min-width: 120px;

    &-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      color: var(--el-text-color-regular);
      transition: all 0.2s;

      &:hover {
        background: var(--el-fill-color-light);
        color: var(--el-color-primary);
      }
    }
  }

  &__toolbar {
    position: absolute;
    bottom: 16px;
    right: 16px;
    z-index: 10;

    .el-button-group {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
  }
}
</style>
