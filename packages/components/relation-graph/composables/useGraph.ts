/**
 * G6 图形实例管理 Hook
 */
import { ref, shallowRef, onBeforeUnmount, watch, type ShallowRef } from 'vue'
import type { Graph } from '@antv/g6'
import type {
  RelationNode,
  RelationEdge,
  RelationGraphIconConfig,
  RelationNodeClickEvent,
  RelationGraphLayoutType,
  AccountType,
  ContactAccount,
} from '../types'

/** 账号类型对应的图标映射（Iconify 图标名） */
const ACCOUNT_ICON_MAP: Record<AccountType, string> = {
  phone: 'lucide:phone',
  qq: 'logos:qq',
  weixin: 'logos:wechat',
  douyin: 'logos:tiktok',
  email: 'lucide:mail',
  other: 'lucide:at-sign',
}

/** 性别对应的默认头像路径 */
const GENDER_ICON_MAP: Record<string, string> = {
  male: '/images/avatars/male.svg',
  female: '/images/avatars/female.svg',
  unknown: '/images/avatars/unknown.svg',
}

/**
 * 获取账号图标的 SVG 数据 URI
 */
function getAccountIconSvg(iconName: string): string {
  const iconSvgs: Record<string, string> = {
    'lucide:phone': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5AD8A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    'lucide:mail': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5AD8A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    'lucide:at-sign': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5AD8A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>`,
    'logos:qq': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#12B7F5" d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.09 1.073.164 1.137.31.386 1.54.967 2.406 1.245.357.122.683.207.983.263-.12.384-.277.732-.46 1.03-.487.793-1.055 1.112-1.282 1.142-.053.007-.094.01-.123.012-.002-.001-.008.002-.03-.032-.023-.036-.055-.133-.055-.331 0-.101-.015-.303-.015-.303-.016-.107-.023-.182-.023-.182L5.08 19.49s.094.056.26.15c.096.055.206.116.328.184.41.227 1.016.514 1.75.68.44.1.92.152 1.43.152.11 0 .22-.002.33-.006l.27.011c.39.011.795-.022 1.183-.096.48-.094.93-.26 1.33-.484.23-.128.44-.275.63-.433.14-.116.27-.237.38-.358.14-.15.26-.307.34-.465l.06-.12c.01-.02.02-.04.03-.06.04-.08.07-.163.08-.24.02-.09.02-.17.01-.25-.03-.18-.12-.36-.26-.53-.06-.08-.14-.15-.22-.22-.08-.07-.17-.13-.27-.19-.02-.01-.04-.02-.06-.03l-.02-.01c-.22-.13-.49-.24-.8-.34-.4-.12-.85-.2-1.33-.25h-.01l-.05-.01c-.12-.02-.24-.03-.36-.04-.2-.02-.4-.03-.6-.03-.18 0-.36.01-.54.03h-.03c-.2.02-.4.04-.58.07-.24.04-.48.08-.7.14-.36.09-.69.2-.99.34-.17.08-.33.17-.48.26-.11.07-.21.14-.3.22-.13.1-.25.21-.36.33-.14.15-.26.31-.37.5-.09.15-.16.32-.22.5-.05.15-.09.31-.11.49l-.01.08v.09c-.01.02-.01.05-.01.09v.01s.02.03.02.06c.01.03.02.06.03.1.04.13.08.27.14.41.05.14.12.28.18.43.06.13.13.27.2.4.07.14.15.28.23.42.08.13.17.26.26.39.09.13.18.25.28.37.13.16.27.31.41.45.14.14.29.27.44.39.1.08.2.15.3.22.1.07.2.14.3.2.2.12.4.23.6.32.14.06.28.12.42.17.11.04.22.08.32.11.19.06.38.1.56.14.14.03.28.05.41.07.16.02.31.04.46.05.09.01.18.01.26.02.14.01.28.01.41.01.15 0 .29-.01.42-.01.17-.01.33-.02.48-.04l.24-.03c.17-.03.33-.06.48-.1.17-.04.33-.09.48-.14.21-.07.4-.16.58-.25.21-.11.4-.24.57-.38.11-.09.21-.19.3-.29.09-.1.17-.2.24-.31.09-.13.16-.27.23-.41.05-.11.1-.23.14-.35.05-.15.09-.31.12-.47l.03-.21c.03-.22.04-.45.04-.67 0-.18-.01-.36-.02-.54v-.09c-.02-.27-.07-.53-.14-.79-.07-.24-.16-.47-.27-.69-.09-.18-.2-.35-.32-.51-.1-.14-.21-.27-.33-.4-.12-.12-.25-.24-.39-.34-.15-.12-.31-.22-.48-.32-.15-.08-.31-.16-.48-.23-.11-.04-.22-.09-.34-.13-.19-.06-.39-.11-.6-.15-.14-.03-.29-.05-.44-.07-.17-.02-.34-.04-.51-.05h-.02c-.17-.01-.34-.01-.51-.01z"/><path fill="#12B7F5" d="M12.003 22c-3.5 0-7.204-1.253-9.758-3.295-.37-.295-.54-.768-.44-1.228.096-.44.38-.786.78-.948C5.37 15.43 8.452 14.25 12 14.25s6.63 1.18 9.42 3.278c.4.162.684.508.78.948.1.46-.07.933-.44 1.228C19.207 20.747 15.503 22 12.003 22z"/></svg>`,
    'logos:wechat': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#07C160" d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098c1.603.567 3.402.886 5.249.886 1.659 0 3.246-.248 4.821-.72a.797.797 0 0 1 .8.098l1.659 1.028a.33.33 0 0 0 .202.064c.124 0 .222-.101.222-.23 0-.023-.007-.048-.018-.096l-.338-1.382a.596.596 0 0 1-.023-.156.59.59 0 0 1 .201-.449C22.759 12.582 24 10.665 24 9.53 24 5.476 20.109 2.188 15.309 2.188H8.691z"/><path fill="#07C160" d="M9.558 5.44a1.046 1.046 0 1 0 0-2.092 1.046 1.046 0 0 0 0 2.092z"/><path fill="#07C160" d="M14.441 5.44a1.046 1.046 0 1 0 0-2.092 1.046 1.046 0 0 0 0 2.092z"/><path fill="#FFF" d="M12 19.503c-2.32 0-4.406-.788-6.04-2.135a.483.483 0 0 1-.198-.39c0-.184.103-.352.274-.424a10.171 10.171 0 0 0 5.964-2.088.482.482 0 0 1 .451-.073l2.173 1.277a.491.491 0 0 1 .212.2c.12.188.192.396.192.619a.49.49 0 0 1-.344.474C13.69 18.907 12.87 19.503 12 19.503z"/><ellipse fill="#FFF" cx="5.978" cy="9.529" rx="1.046" ry="1.044"/><ellipse fill="#FFF" cx="17.022" cy="9.529" rx="1.046" ry="1.044"/></svg>`,
    'logos:tiktok': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><linearGradient id="tiktok-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#69C9D0"/><stop offset="50%" stop-color="#EE1D52"/><stop offset="100%" stop-color="#69C9D0"/></linearGradient></defs><path fill="url(#tiktok-gradient)" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
  }

  const svg = iconSvgs[iconName] || iconSvgs['lucide:at-sign']
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export interface UseGraphOptions {
  container: HTMLElement | null
  nodes: RelationNode[]
  edges: RelationEdge[]
  defaultIcon?: RelationGraphIconConfig
  width: number
  height: number
  showMinimap?: boolean
  layoutType?: RelationGraphLayoutType
  unitRadius?: number
  linkDistance?: number
  nodeSize?: number
  collapsible?: boolean
  onNodeClick?: (event: RelationNodeClickEvent) => void
}

/**
 * 使用 G6 图形实例
 */
export function useGraph(options: UseGraphOptions): {
  graph: ShallowRef<Graph | null>
  init: () => void
  getZoom: () => number
  setZoom: (ratio: number) => void
  fitView: () => void
  searchNodes: (keyword: string) => void
  clearSearch: () => void
  setData: (nodes: RelationNode[], edges: RelationEdge[]) => void
} {
  const {
    container,
    nodes,
    edges,
    width,
    height,
    showMinimap = false,
    layoutType = 'force',
    unitRadius = 100,
    linkDistance = 120,
    nodeSize = 60,
    collapsible = false,
    onNodeClick,
  } = options

  const graph = shallowRef<Graph | null>(null)
  let currentHighlightKeyword = ''
  // 折叠状态映射
  const collapsedMap: Record<string, boolean> = {}
  // 原始数据引用
  let originalNodes: RelationNode[] = []
  let originalEdges: RelationEdge[] = []

  /**
   * 查找节点的所有子孙节点
   */
  function findDescendants(parentId: string): string[] {
    const visited = new Set<string>()

    const dfs = (pid: string) => {
      for (const e of originalEdges) {
        if (e.source === pid && !visited.has(e.target)) {
          visited.add(e.target)
          dfs(e.target)
        }
      }
    }

    dfs(parentId)
    return [...visited]
  }

  /**
   * 根据折叠状态构建当前显示的数据
   * 同时展开 contactAccounts 为独立的账号节点
   */
  function buildData() {
    const hidden = new Set<string>()

    Object.keys(collapsedMap).forEach((id) => {
      if (collapsedMap[id]) {
        findDescendants(id).forEach((d) => hidden.add(d))
      }
    })

    const filteredNodes = originalNodes.filter((n) => !hidden.has(n.id))
    const nodeIds = new Set(filteredNodes.map((n) => n.id))

    const filteredEdges = originalEdges.filter(
      (e) => nodeIds.has(e.source) && nodeIds.has(e.target)
    )

    // 展开 contactAccounts 为独立的账号节点
    const accountNodes: RelationNode[] = []
    const accountEdges: RelationEdge[] = []

    filteredNodes.forEach((person) => {
      if (person.contactAccounts && person.contactAccounts.length > 0) {
        person.contactAccounts.forEach((account, index) => {
          const accountId = `${person.id}-account-${account.type}-${index}`
          const accountNode: RelationNode = {
            id: accountId,
            name: account.value,
            nodeType: 'account',
            role: account.type,
            style: {
              size: 40,
              stroke: '#5AD8A6',
            },
            accountData: account,
          }

          accountNodes.push(accountNode)
          accountEdges.push({
            source: person.id,
            target: accountId,
            label: account.type,
            data: {
              stroke: '#b1b1b1',
              label: account.type,
            },
          })
        })
      }
    })

    const allNodes = [...filteredNodes, ...accountNodes]
    const allEdges = [...filteredEdges, ...accountEdges]

    return {
      nodes: allNodes.map((n) => ({
        id: n.id,
        data: { ...n },
      })),
      edges: allEdges.map((e, i) => ({
        id: `edge-${i}`,
        source: e.source,
        target: e.target,
        data: { label: e.label, ...e.data },
      })),
    }
  }

  /**
   * 获取节点样式
   */
  function getNodeStyle(d: any) {
    // 样式配置在 d.data.style 中
    const nodeStyle = d.data?.style as { size?: number; img?: string; stroke?: string } | undefined
    const size = nodeStyle?.size ?? nodeSize
    const img = nodeStyle?.img
    const nodeType = d.data?.nodeType as 'person' | 'account' | undefined

    // 基础样式
    const baseStyle = {
      size: [size, size],
      fill: '#fff',
      stroke: nodeStyle?.stroke ?? (nodeType === 'account' ? '#5AD8A6' : '#5B8FF9'),
      lineWidth: 1,
      labelText: String(d.data?.name ?? d.data?.label ?? ''),
      labelFill: '#262626',
      labelFontSize: size > 40 ? 12 : 9,
      labelPlacement: 'bottom',
    }

    // 如果有图片，使用图片
    if (img) {
      return {
        ...baseStyle,
        icon: true,
        iconSrc: img,
        iconWidth: size - 10,
        iconHeight: size - 10,
      }
    }

    // 账号节点使用图标
    if (nodeType === 'account') {
      const accountType = d.data?.role as AccountType
      const iconName = ACCOUNT_ICON_MAP[accountType] || ACCOUNT_ICON_MAP.other
      // 账号节点使用内联 SVG（Iconify 格式）
      return {
        ...baseStyle,
        icon: true,
        iconSrc: getAccountIconSvg(iconName),
        iconWidth: size - 10,
        iconHeight: size - 10,
      }
    }

    // 人物节点使用默认头像（根据 gender 或默认为 unknown）
    const gender = d.data?.gender as string
    const defaultIcon = GENDER_ICON_MAP[gender] || GENDER_ICON_MAP.unknown
    return {
      ...baseStyle,
      icon: true,
      iconSrc: defaultIcon,
      iconWidth: size - 10,
      iconHeight: size - 10,
    }
  }

  /**
   * 获取边样式
   */
  function getEdgeStyle(edge: any) {
    // 边数据在 edge.data 中
    const edgeData = edge.data as { stroke?: string; label?: string } | undefined

    return {
      stroke: edgeData?.stroke ?? '#b1b1b1',
      lineWidth: 2,
      endArrow: true,
      labelText: edgeData?.label ?? '',
      labelFill: '#262626',
      labelFontSize: 10,
      labelOffsetY: -4,
      labelPlacement: 'center',
    }
  }

  /**
   * 获取布局配置
   */
  function getLayoutConfig() {
    if (layoutType === 'radial') {
      return {
        type: 'radial',
        unitRadius,
        preventOverlap: true,
        linkDistance,
      }
    }
    return {
      type: 'force',
      preventOverlap: true,
      nodeSize,
      linkDistance,
    }
  }

  /**
   * 初始化 G6 实例
   */
  async function initGraph() {
    if (!container) return

    try {
      const { Graph, Minimap } = await import('@antv/g6')

      // 保存原始数据
      originalNodes = [...nodes]
      originalEdges = [...edges]

      // 构建实例
      const g = new Graph({
        container,
        width,
        height,
        data: buildData(),
        node: {
          style: (d: any) => getNodeStyle(d),
        },
        edge: {
          style: (edge: any) => getEdgeStyle(edge),
        },
        layout: getLayoutConfig(),
        behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
        autoFit: 'view',
      })

      // 添加插件
      if (showMinimap) {
        g.addPlugin(
          new Minimap({
            size: [200, 150],
            padding: 10,
          })
        )
      }

      // 绑定节点点击事件
      g.on('node:click', (evt: any) => {
        if (onNodeClick && evt.itemId) {
          const nodeData = g.getNodeData(evt.itemId)
          onNodeClick?.({
            node: nodeData.data as RelationNode,
            x: evt.canvas.x,
            y: evt.canvas.y,
          })
        }
      })

      // 绑定双击事件（折叠/展开）
      if (collapsible) {
        g.on('node:dblclick', (evt: any) => {
          const id = evt.itemId
          if (!id) return

          // 切换折叠状态
          collapsedMap[id] = !collapsedMap[id]

          // 重新渲染
          g.setData(buildData())
          g.render()
        })
      }

      // 渲染
      await g.render()
      graph.value = g
    } catch (error) {
      console.error('[RelationGraph] Failed to initialize G6:', error)
    }
  }

  // 缩放控制
  let currentZoom = 1

  /**
   * 设置缩放
   */
  function setZoom(ratio: number) {
    if (graph.value) {
      graph.value.zoomTo(ratio, { x: width / 2, y: height / 2 }, false)
      currentZoom = ratio
    }
  }

  /**
   * 获取当前缩放值
   */
  function getZoom(): number {
    return currentZoom
  }

  /**
   * 自适应视图
   */
  function fitView() {
    if (graph.value) {
      graph.value.fitView()
    }
  }

  /**
   * 搜索节点
   */
  function searchNodes(keyword: string) {
    if (!graph.value) return

    currentHighlightKeyword = keyword

    if (!keyword) {
      clearSearch()
      return
    }

    const allNodeData = graph.value.getData()
    if (!allNodeData?.nodes) return

    const lowerKeyword = keyword.toLowerCase()
    const stateMap: Record<string, string[]> = {}

    allNodeData.nodes.forEach((n: any) => {
      const name = (n.data?.name || n.data?.label || '').toLowerCase()
      const role = (n.data?.role || '').toLowerCase()
      const match = name.includes(lowerKeyword) || role.includes(lowerKeyword)
      stateMap[n.id] = match ? ['highlight'] : ['dim']
    })

    graph.value.setElementState(stateMap)
  }

  /**
   * 清除搜索高亮
   */
  function clearSearch() {
    if (!graph.value) return
    currentHighlightKeyword = ''
    graph.value.setElementState({})
  }

  /**
   * 设置新数据
   */
  function setData(newNodes: RelationNode[], newEdges: RelationEdge[]) {
    originalNodes = [...newNodes]
    originalEdges = [...newEdges]
    // 重置折叠状态
    Object.keys(collapsedMap).forEach((key) => delete collapsedMap[key])

    if (graph.value) {
      graph.value.setData(buildData())
      graph.value.render()
    }
  }

  // 监听数据变化
  watch(
    () => [nodes, edges],
    () => {
      originalNodes = [...nodes]
      originalEdges = [...edges]

      if (graph.value) {
        graph.value.setData(buildData())
        graph.value.render()

        if (currentHighlightKeyword) {
          searchNodes(currentHighlightKeyword)
        }
      }
    },
    { deep: true }
  )

  // 初始化（由调用者在 onMounted 中触发）
  function init() {
    initGraph()
  }

  // 清理
  onBeforeUnmount(() => {
    if (graph.value) {
      graph.value.destroy()
      graph.value = null
    }
  })

  return {
    graph,
    init,
    getZoom,
    setZoom,
    fitView,
    searchNodes,
    clearSearch,
    setData,
  }
}
