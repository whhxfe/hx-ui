<template>
  <slot />
</template>

<script setup lang="ts">
import { computed, provide, watchEffect } from 'vue'
import { addAPIProvider } from '@iconify/vue'
import type { HxConfig, HxConfigProviderProps, IconifyIconConfig } from '../../types/config'
import { HxConfigKey } from './injection'
import { buildImageSourceMap } from '../../utils/image-icon'
import { registerOfflineCollections } from '../../utils/offline-icons'
import { setRequestOptions } from '../../utils/request'

const props = withDefaults(defineProps<HxConfigProviderProps>(), {
  icon: () => ({}),
  request: () => ({}),
})

// ========== 顶层快捷配置工厂函数 ==========

function getDefaultIconifyConfig(): IconifyIconConfig {
  return {
    source: { source: 'offline', cdnUrl: undefined },
    offlineCollections: [],
  }
}

function getDefaultIconConfig() {
  return {
    svg: { symbolPrefix: 'icon' },
    iconify: { source: 'offline', collections: [] },
    image: { source: 'auto', imageIconModules: [] },
  }
}

// ========== 配置合并工具函数 ==========

/**
 * 构建 iconifyIcon 配置，合并顶层快捷配置与 icon.iconify 嵌套配置
 */
function buildIconifyConfig(props: HxConfigProviderProps): IconifyIconConfig {
  const defaults = getDefaultIconifyConfig()

  // 顶层快捷配置优先级高于 icon.iconify
  const iconifySource = props.iconifySource ?? props.icon?.iconify?.source ?? defaults.source.source
  const iconifyCdnUrl = props.iconifyCdnUrl ?? props.icon?.iconify?.cdnUrl ?? defaults.source.cdnUrl
  const collections = props.iconifyCollections ?? props.icon?.iconify?.collections ?? defaults.offlineCollections

  return {
    source: { source: iconifySource, cdnUrl: iconifyCdnUrl },
    offlineCollections: collections,
  }
}

// ========== 响应式配置（使用 computed 确保 props 变化时自动更新）==========

const mergedIconConfig = computed(() => {
  const defaults = getDefaultIconConfig()
  return {
    svg: {
      symbolPrefix: props.iconSymbolPrefix ?? props.icon?.svg?.symbolPrefix ?? defaults.svg.symbolPrefix,
    },
    iconify: buildIconifyConfig(props),
    image: {
      cdnBaseUrl: props.icon?.image?.cdnBaseUrl ?? '',
      source: (props.icon?.image?.source ?? defaults.image.source) as 'auto' | 'local' | 'cdn',
      sourceMap: buildImageSourceMap(props.icon?.image?.imageIconModules ?? []),
      groups: [],
      defaultGroup: 'title',
    },
  }
})

// 预处理 imageIcon 的 groups 和 defaultGroup
const imageIconConfig = computed(() => {
  const imageConfig = mergedIconConfig.value.image
  const groups = Object.keys(imageConfig.sourceMap).sort()
  return {
    ...imageConfig,
    groups,
    defaultGroup: groups[0] ?? 'title',
  }
})

const config = computed<HxConfig>(() => ({
  svgIcon: {
    symbolPrefix: mergedIconConfig.value.svg.symbolPrefix,
  },
  imageIcon: imageIconConfig.value,
  iconifyIcon: mergedIconConfig.value.iconify,
  request: props.request,
  componentDefaults: props.componentDefaults,
  qrCode: props.qrCode,
}))

// ========== Iconify 初始化（响应式）==========

/**
 * 重新配置 Iconify CDN provider
 */
function setupIconify() {
  const iconifySource = mergedIconConfig.value.iconify.source.source
  const iconifyCdnUrl = mergedIconConfig.value.iconify.source.cdnUrl

  if (iconifySource === 'cdn' && iconifyCdnUrl) {
    addAPIProvider('', {
      resources: [iconifyCdnUrl],
    })
  }
}

/**
 * 异步加载离线图标集（图标组件内部有 fallback 处理）
 */
function loadOfflineCollections() {
  const collections = mergedIconConfig.value.iconify.offlineCollections ?? []
  registerOfflineCollections(collections)
}

// 监听配置变化，重新初始化
watchEffect(() => {
  // 访问关键配置触发依赖收集
  const source = mergedIconConfig.value.iconify.source.source
  const cdnUrl = mergedIconConfig.value.iconify.source.cdnUrl
  const collections = mergedIconConfig.value.iconify.offlineCollections

  // 异步加载，不阻塞组件渲染
  loadOfflineCollections()
})

// 同步初始化 CDN
setupIconify()

// ========== Request 初始化 ==========

if (props.request?.headers) {
  setRequestOptions({ headers: props.request.headers })
}

// ========== Provide 配置 ==========

provide(HxConfigKey, config.value)
</script>
