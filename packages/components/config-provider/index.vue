<template>
  <slot />
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { addAPIProvider } from '@iconify/vue'
import type { HxConfig, HxConfigProviderProps } from '../../types/config'
import { HxConfigKey } from './injection'
import { buildImageSourceMap } from '../../utils/image-icon'
import { registerOfflineCollections } from '../../utils/offline-icons'
import { setRequestOptions } from '../../utils/request'

const props = withDefaults(defineProps<HxConfigProviderProps>(), {
  icon: () => ({}),
  request: () => ({}),
})

const iconSvgConfig = props.icon?.svg
const iconImageConfig = props.icon?.image
const iconifyConfig = props.icon?.iconify

const iconifySource = iconifyConfig?.source ?? 'offline'
const iconifyCdnUrl = iconifyConfig?.cdnUrl
const iconifyCollections = iconifyConfig?.collections ?? []

if (iconifySource === 'cdn' && iconifyCdnUrl) {
  addAPIProvider('', {
    resources: [iconifyCdnUrl],
  })
} else {
  // 异步加载图标集，不阻塞组件渲染
  // 图标组件内部有 fallback 处理，图标集加载完成后会自动刷新
  registerOfflineCollections(iconifyCollections)
}

const imageIconModules = iconImageConfig?.imageIconModules ?? []
const sourceMap = buildImageSourceMap(imageIconModules)
const groups = Object.keys(sourceMap).sort()

const config: HxConfig = {
  svgIcon: {
    symbolPrefix: iconSvgConfig?.symbolPrefix ?? 'icon',
  },
  imageIcon: {
    cdnBaseUrl: iconImageConfig?.cdnBaseUrl ?? '',
    source: (iconImageConfig?.source ?? 'auto') as 'auto' | 'local' | 'cdn',
    sourceMap,
    groups,
    defaultGroup: groups[0] ?? 'title',
  },
  iconifyIcon: {
    source: { source: iconifySource, cdnUrl: iconifyCdnUrl },
    offlineCollections: iconifyCollections,
  },
  request: props.request,
  componentDefaults: props.componentDefaults,
}

if (props.request?.headers) {
  setRequestOptions({ headers: props.request.headers })
}

provide(HxConfigKey, config)
</script>
