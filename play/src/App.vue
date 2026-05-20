<script setup lang="ts">
import { HxConfigProvider, addIconSet } from '@hx/ui'

// ============================================================
// 注册离线图标集（支持懒加载，推荐）
// ============================================================
// 图标集会自动去重加载，无需其他配置
// addIconSet(() => import('@iconify/json/json/ep.json'))
// addIconSet(() => import('@iconify/json/json/mdi.json'))
// addIconSet(() => import('@iconify/json/json/tabler.json'))
// addIconSet(() => import('@iconify/json/json/logos.json'))
// addIconSet(() => import('@iconify/json/json/mingcute.json'))
// addIconSet(() => import('@iconify/json/json/lucide.json'))
// addIconSet(() => import('@iconify/json/json/carbon.json'))


// 更多图标集请查看 @iconify/json 包中的 json 目录

/** 本地 glob 资源 */
const imageIconModules = import.meta.glob<{ default: string }>(
  '@/assets/icons/**/*',
  { eager: true },
)

/** 图标全局配置 */
const iconConfig = {
  svg: {
    symbolPrefix: 'icon',
  },
  iconify: {
    source: 'cdn' as const,
    cdnUrl:"http://localhost:3333"
  },
  image: {
    source: 'local' as const,
    imageIconModules: [imageIconModules],
  },
};

/** Request 全局配置 */
const requestConfig = {
  baseUrl: 'http://localhost:4003',
  prefix: '/api',
  headers: {
    lang: 'zh-CN',
    'xxx-xxx': 'xxxx',
  },
};
</script>

<template>
  <HxConfigProvider
    :icon="iconConfig"
    :request="requestConfig"
  >
    <router-view />
  </HxConfigProvider>
</template>
